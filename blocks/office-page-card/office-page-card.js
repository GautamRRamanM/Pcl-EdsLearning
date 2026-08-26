export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const officePage = rows[0]
    ?.querySelector('a')
    ?.getAttribute('href')
    ?.trim();

  const cta =
    rows[1]?.textContent.trim() || 'Learn More';

  if (!officePage) {
    block.innerHTML = '<p>Office page not configured.</p>';
    return;
  }

  try {
    const response = await fetch(`${officePage}.plain.html`);

    if (!response.ok) {
      throw new Error(`Unable to load ${officePage}`);
    }

    const html = await response.text();

    const doc = new DOMParser().parseFromString(
      html,
      'text/html'
    );

    let image = '';
    let eyebrow = '';
    let title = '';
    const address = [];

    /* -------------------------------
       Find Hero Block
    -------------------------------- */

    const heroTable = [...doc.querySelectorAll('table')].find((table) => {
      const heading = table.querySelector('tr:first-child th');
      return heading && heading.textContent.trim().toLowerCase() === 'hero';
    });

    if (!heroTable) {
      block.innerHTML =
        '<p>Hero block not found on Office page.</p>';
      return;
    }

    const heroRows = [...heroTable.querySelectorAll('tr')];

    heroRows.forEach((row) => {
      const cells = row.querySelectorAll('td');

      if (cells.length < 2) return;

      const label = cells[0].textContent.trim().toLowerCase();
      const value = cells[1];

      switch (label) {
        case 'image':
          image =
            value.querySelector('img')?.src ||
            value.querySelector('a')?.href ||
            '';
          break;

        case 'eyebrow':
          eyebrow = value.textContent.trim();
          break;

        case 'title':
          title = value.textContent.trim();
          break;

        case 'description':
          address.push(
            ...value.innerHTML
              .split('<br>')
              .map((line) =>
                line.replace(/<[^>]+>/g, '').trim()
              )
              .filter(Boolean)
          );
          break;

        default:
      }
    });

    block.innerHTML = `
      <div class="office-card">

        ${
          image
            ? `
        <div class="office-card-image">
          <img
            src="${image}"
            alt="${title}"
            loading="lazy">
        </div>
        `
            : ''
        }

        <div class="office-card-content">

          ${
            eyebrow
              ? `<div class="office-card-eyebrow">${eyebrow}</div>`
              : ''
          }

          <h3 class="office-card-title">
            ${title}
          </h3>

          <div class="office-card-address">
            ${address
              .map((line) => `<p>${line}</p>`)
              .join('')}
          </div>

          <a
            href="${officePage}"
            class="office-card-link">

            ${cta}

            <span></span>

          </a>

        </div>

      </div>
    `;
  } catch (e) {
    console.error(e);

    block.innerHTML =
      '<p>Unable to load office information.</p>';
  }
}