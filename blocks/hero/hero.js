export default function decorate(block) {
  const rows = [...block.children];

  const imageRow = rows[0];
  const eyebrowRow = rows[1];
  const titleRow = rows[2];
  const descriptionRow = rows[3];

  const image = imageRow?.querySelector('picture');
  const eyebrow = eyebrowRow?.textContent.trim();
  const title = titleRow?.textContent.trim();
  const description = descriptionRow?.innerHTML;

  block.innerHTML = '';

  const hero = document.createElement('div');
  hero.className = 'hero-banner';

  if (image) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'hero-image';
    imageWrapper.append(image);
    hero.append(imageWrapper);
  }

  const content = document.createElement('div');
  content.className = 'hero-content';

  if (eyebrow) {
    const eyebrowEl = document.createElement('div');
    eyebrowEl.className = 'hero-eyebrow';
    eyebrowEl.textContent = eyebrow;
    content.append(eyebrowEl);
  }

  if (title) {
    const heading = document.createElement('h1');
    heading.className = 'hero-title';
    heading.textContent = title;
    content.append(heading);
  }

  if (description) {
    const desc = document.createElement('div');
    desc.className = 'hero-description';
    desc.innerHTML = description;
    content.append(desc);
  }

  hero.append(content);
  block.append(hero);
}