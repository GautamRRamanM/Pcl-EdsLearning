/*
 * Office Page Card block (block name: office-page-card)
 * Mirrors the AEM "pcl-office-card" component's look & functionality.
 *
 * The AEM Granite dialog only ever exposed two author fields:
 *   - Office Detail Page (a page reference)
 *   - CTA
 * Everything else (image, office name, address) was resolved at runtime
 * from the referenced page's own content, not authored on the card itself.
 * This EDS project has no Hero block — office pages instead carry a
 * "Contact Card" block, so this fetches the linked page's .plain.html and
 * pulls the office name / address (and phone, if present) out of THAT block.
 *
 * ASSUMPTION (unconfirmed): the Contact Card block renders as
 * `.contact-card` containing a heading (office name) followed by an
 * address paragraph and, optionally, a `tel:` link for the phone number.
 * Confirm/replace these selectors against the real contact-card.js output.
 *
 * Supports two authoring shapes for THIS block's own two fields:
 *   - Document Authoring table: "label | value" rows
 *   - Universal Editor: one field per row, positional (officeDetailPage, cta)
 */

const officeDataCache = new Map();

const UE_FIELD_ORDER = ['office detail page', 'cta'];

// IMPORTANT: inside the Universal Editor canvas, window.location is the AEM
// *author* host (e.g. author-xxxxx.adobeaemcloud.com). That host serves the
// authoring UI but does NOT generate .plain.html — only the actual Edge
// Delivery Services layer does (your project's aem.page/aem.live branch
// domain, or your production custom domain). Set EDS_ORIGIN to that domain
// so the fetch resolves correctly both inside the UE canvas and on the real
// site. Leave it '' only if you're testing purely on the live/preview site
// itself (where window.location already IS the EDS origin).
const EDS_ORIGIN = ''; // e.g. 'https://main--your-repo--your-org.aem.page'

function getText(cell) {
  return cell ? cell.textContent.trim() : '';
}

function getLink(cell) {
  if (!cell) return '';
  const a = cell.querySelector('a');
  if (a) return a.getAttribute('href');
  return getText(cell);
}

function toPlainHtmlPath(href) {
  if (!href) return null;
  try {
    const base = EDS_ORIGIN || window.location.origin;
    const url = new URL(href, base);
    url.pathname = url.pathname.replace(/\.html$/, '') + '.plain.html';
    // Always return an absolute URL: relative to `base`, not the current
    // page's origin, so this works correctly from inside the UE canvas.
    return new URL(url.pathname + url.search, base).toString();
  } catch {
    return null;
  }
}

async function fetchOfficeData(path) {
  if (!path) return null;
  if (officeDataCache.has(path)) return officeDataCache.get(path);

  const promise = (async () => {
    try {
      const res = await fetch(path);
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.warn(`[office-page-card] fetch failed (${res.status}) for`, path);
        return null;
      }
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');

      // ASSUMPTION: adjust this selector to match your real contact-card.js markup.
      const card = doc.querySelector('.contact-card') || doc.body;
      const heading = card.querySelector('h1, h2, h3, h4');
      const picture = card.querySelector('picture') || card.querySelector('img');
      const officeName = heading ? heading.textContent.trim() : '';
      const phoneLink = card.querySelector('a[href^="tel:"]');
      const phone = phoneLink ? phoneLink.textContent.trim() : '';

      // Address: paragraph(s) between the heading and the phone link (if any),
      // otherwise the first paragraph after the heading.
      let addressLines = [];
      const paragraphs = [...card.querySelectorAll('p')];
      const addressEl = heading
        ? paragraphs.find((p) => heading.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING
          && (!phoneLink || p.compareDocumentPosition(phoneLink) & Node.DOCUMENT_POSITION_FOLLOWING))
        : paragraphs[0];
      if (addressEl) {
        const clone = addressEl.cloneNode(true);
        clone.querySelectorAll('a').forEach((a) => a.remove());
        addressLines = clone.innerHTML
          .split(/<br\s*\/?>/i)
          .map((line) => line.replace(/<[^>]+>/g, '').trim())
          .filter(Boolean);
      }

      if (!officeName) {
        // eslint-disable-next-line no-console
        console.warn('[office-page-card] fetched page but found no heading — check the .contact-card selector', path);
      }

      return { picture, officeName, addressLines, phone };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[office-page-card] fetch/parse error for', path, err);
      return null;
    }
  })();

  officeDataCache.set(path, promise);
  return promise;
}

export default async function decorate(block) {
  const rows = [...block.children];
  const data = {};

  const isLabelValueShape = rows.length > 0 && rows.every((row) => row.children.length >= 2);

  if (isLabelValueShape) {
    rows.forEach((row) => {
      const cols = row.children;
      const key = getText(cols[0]).toLowerCase();
      data[key] = cols[1];
    });
  } else {
    rows.forEach((row, i) => {
      const key = UE_FIELD_ORDER[i];
      if (key) data[key] = row.children[0] || row;
    });
  }

  const href = getLink(data['office detail page']) || '#';
  const ctaText = getText(data.cta) || 'Learn More';

  // Authored overrides take priority; otherwise pull from the referenced page's Contact Card.
  let officeName = getText(data['office name']);
  let legalTitle = getText(data['legal title']);
  let alt = getText(data.alt);
  let addressLines = ['address 1', 'address 2', 'address 3']
    .map((key) => getText(data[key]))
    .filter(Boolean);
  let pictureEl = data.image?.querySelector('picture') || data.image?.querySelector('img');

  block.textContent = '';
  block.classList.add('office-page-card');

  const card = document.createElement('a');
  card.className = 'office-page-card-link';
  card.href = href;

  const imageWrap = document.createElement('div');
  imageWrap.className = 'office-page-card-image';
  card.append(imageWrap);

  const body = document.createElement('div');
  body.className = 'office-page-card-body';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'office-page-card-eyebrow';

  const title = document.createElement('h3');
  title.className = 'office-page-card-title';

  const address = document.createElement('div');
  address.className = 'office-page-card-address';

  const cta = document.createElement('span');
  cta.className = 'office-page-card-cta';
  cta.textContent = ctaText;

  body.append(eyebrow, title, address, cta);
  card.append(body);
  block.append(card);

  function render() {
    if (pictureEl) {
      const imgEl = pictureEl.tagName === 'PICTURE' ? pictureEl.querySelector('img') : pictureEl;
      if (imgEl && alt) imgEl.alt = alt;
      imageWrap.replaceChildren(pictureEl);
      imageWrap.style.display = '';
    } else {
      // No image found on the referenced page's Contact Card — hide the
      // image slot rather than showing a broken/empty box.
      imageWrap.replaceChildren();
      imageWrap.style.display = 'none';
    }
    eyebrow.textContent = legalTitle || officeName;
    title.textContent = officeName;
    card.setAttribute('aria-label', `${officeName} - ${ctaText}`);
    address.replaceChildren(
      ...addressLines.map((line) => {
        const p = document.createElement('p');
        p.textContent = line;
        return p;
      }),
    );
  }

  render();

  const dataPath = toPlainHtmlPath(href);
  const needsFetchedData = !officeName || addressLines.length === 0;

  if (dataPath && needsFetchedData) {
    const officeData = await fetchOfficeData(dataPath);
    if (officeData) {
      pictureEl = pictureEl || officeData.picture;
      officeName = officeName || officeData.officeName;
      legalTitle = legalTitle || officeData.officeName;
      addressLines = addressLines.length ? addressLines : officeData.addressLines;
      render();
    }
  }
}