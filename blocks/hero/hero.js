export default function decorate(block) {
  const rows = [...block.children];

  const image = rows[0]?.children[1]?.querySelector('picture');
  const eyebrow = rows[1]?.children[1]?.textContent.trim();
  const title = rows[2]?.children[1]?.textContent.trim();

  // Keep the authored HTML (including links)
  const descriptionHTML = rows[3]?.children[1]?.innerHTML || '';

  block.innerHTML = '';

  const hero = document.createElement('div');
  hero.className = 'hero-banner';

  /* Left Content */

  const content = document.createElement('div');
  content.className = 'hero-content';

  if (eyebrow) {
    const eyebrowEl = document.createElement('div');
    eyebrowEl.className = 'hero-eyebrow';
    eyebrowEl.textContent = eyebrow;
    content.appendChild(eyebrowEl);
  }

  if (title) {
    const titleEl = document.createElement('h1');
    titleEl.className = 'hero-title';
    titleEl.textContent = title;
    content.appendChild(titleEl);
  }

  if (descriptionHTML) {
    const desc = document.createElement('div');
    desc.className = 'hero-description';
    desc.innerHTML = descriptionHTML;

    // Find the authored link
    const addressLink = desc.querySelector('a');

    if (addressLink) {
      addressLink.classList.add('hero-address-link');
      addressLink.target = '_blank';
      addressLink.rel = 'noopener noreferrer';

      addressLink.insertAdjacentHTML(
        'beforeend',
        `
        <svg
          class="hero-map-icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 2H14V10"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"/>
          <path
            d="M14 2L2 14"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"/>
          <path
            d="M10 14H2V6"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"/>
        </svg>
        `,
      );
    }

    content.appendChild(desc);
  }

  /* Right Image */

  if (image) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'hero-image';
    imageWrapper.append(image);

    hero.append(content, imageWrapper);
  } else {
    hero.append(content);
  }

  block.append(hero);
}
