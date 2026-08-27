export default function decorate(block) {
  const rows = [...block.children];

  const image = rows[0]?.children[1]?.querySelector('picture');
  const eyebrow = rows[1]?.children[1]?.textContent.trim();
  const title = rows[2]?.children[1]?.textContent.trim();
  const description = rows[3]?.children[1]?.innerHTML;

  block.innerHTML = '';

  const hero = document.createElement('div');
  hero.className = 'hero-banner';

  if (image) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'hero-image';
    imageWrapper.append(image);
    hero.appendChild(imageWrapper);
  }

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

  if (description) {
    const desc = document.createElement('div');
    desc.className = 'hero-description';
    desc.innerHTML = description;
    content.appendChild(desc);
  }

  hero.appendChild(content);
  block.appendChild(hero);
}
