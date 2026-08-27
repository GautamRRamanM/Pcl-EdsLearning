export default async function decorate(block) {
  const rows = [...block.children];

  const officePage = rows[0]?.querySelector('a')?.getAttribute('href')?.trim();
  const cta = rows[1]?.children[1]?.textContent.trim() || 'Learn More';

  if (!officePage) {
    block.innerHTML = '<p>Office page not configured.</p>';
    return;
  }

  try {
    const response = await fetch(`${officePage}.plain.html`);

    if (!response.ok) {
      throw new Error('Unable to fetch office page.');
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const hero = doc.querySelector('.hero');

    if (!hero) {
      block.innerHTML = '<p>Hero block not found.</p>';
      return;
    }

    const heroRows = [...hero.children];

    let image = '';
    let eyebrow = '';
    let title = '';
    let description = '';

    heroRows.forEach((row) => {
      const cols = row.querySelectorAll(':scope > div');

      if (cols.length < 2) return;

      const label = cols[0].textContent.trim().toLowerCase();
      const value = cols[1];

      switch (label) {
        case 'image':
          image = value.querySelector('img')?.src
            || value.querySelector('picture img')?.src
            || value.querySelector('a')?.href
            || '';
          break;

        case 'eyebrow':
          eyebrow = value.textContent.trim();
          break;

        case 'title':
          title = value.textContent.trim();
          break;

        case 'description':
          description = value.innerHTML;
          break;

        default:
          break;
      }
    });

    block.innerHTML = `
      <div class="office-card">

        ${
  image
    ? `
              <div class="office-card-image">
                <img src="${image}" alt="${title}" loading="lazy">
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

          ${
  title
    ? `<h3 class="office-card-title">${title}</h3>`
    : ''
}

          ${
  description
    ? `<div class="office-card-address">${description}</div>`
    : ''
}

          <a href="${officePage}" class="office-card-link">
            ${cta}
            <span></span>
          </a>

        </div>

      </div>
    `;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    block.innerHTML = '<p>Unable to load office information.</p>';
  }
}
