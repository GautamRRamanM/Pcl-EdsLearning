function getRows(block) {
  return [...block.children];
}

function getRow(block, fieldName) {
  const rows = getRows(block);

  return rows.find((row) => {
    const label = row.children[0]?.textContent.trim();

    return label === fieldName;
  });
}

function getValue(block, fieldName) {
  const row = getRow(block, fieldName);

  if (!row) {
    return '';
  }

  return row.children[1]?.textContent.trim() || '';
}

function getLink(block, fieldName) {
  const row = getRow(block, fieldName);

  if (!row) {
    return '';
  }

  const link = row.children[1]?.querySelector('a');

  return link?.href || '';
}

function getImage(block, fieldName) {
  const row = getRow(block, fieldName);

  if (!row) {
    return null;
  }

  return row.children[1]?.querySelector('img');
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function createLinkedInIcon(link) {
  const anchor = document.createElement('a');

  anchor.className = 'contact-card__linkedin';
  anchor.href = link;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.setAttribute('aria-label', 'LinkedIn profile');

  anchor.innerHTML = '<span aria-hidden="true">in</span>';

  return anchor;
}

function decorateOneColumn(block) {
  const title = getValue(block, 'Title');
  const description = getValue(block, 'Description');
  const contactTitle = getValue(block, 'Contact Title');
  const name = getValue(block, 'Name');
  const linkedin = getLink(block, 'LinkedIn URL');
  const image = getImage(block, 'Image Selection');

  const ctaText = getValue(block, 'CTA Text');
  const ctaLink = getLink(block, 'CTA Link');

  let imageElement = null;

  if (image) {
    imageElement = image.cloneNode(true);
  }

  block.innerHTML = '';

  const card = createElement(
    'div',
    'contact-card__one-column',
  );

  const content = createElement(
    'div',
    'contact-card__one-column-content',
  );

  if (title) {
    const titleElement = createElement(
      'div',
      'contact-card__one-column-title',
      title,
    );

    content.appendChild(titleElement);
  }

  if (contactTitle) {
    const contactTitleElement = createElement(
      'div',
      'contact-card__one-column-contact-title',
      contactTitle,
    );

    content.appendChild(contactTitleElement);
  }

  const nameRow = createElement(
    'div',
    'contact-card__one-column-name-row',
  );

  if (name) {
    const nameElement = createElement(
      'h3',
      'contact-card__one-column-name',
      name,
    );

    nameRow.appendChild(nameElement);
  }

  if (linkedin) {
    nameRow.appendChild(
      createLinkedInIcon(linkedin),
    );
  }

  content.appendChild(nameRow);

  if (description) {
    const descriptionElement = createElement(
      'div',
      'contact-card__one-column-description',
      description,
    );

    content.appendChild(descriptionElement);
  }

  const imageWrapper = createElement(
    'div',
    'contact-card__one-column-image',
  );

  if (imageElement) {
    imageElement.alt = name || '';

    imageWrapper.appendChild(imageElement);
  }

  card.appendChild(content);
  card.appendChild(imageWrapper);

  block.appendChild(card);

  if (ctaText) {
    const ctaWrapper = createElement(
      'div',
      'contact-card__one-column-cta-wrapper',
    );

    const cta = createElement(
      'a',
      'contact-card__one-column-cta',
      ctaText,
    );

    cta.href = ctaLink || '#';

    ctaWrapper.appendChild(cta);

    block.appendChild(ctaWrapper);
  }
}

function decorateTwoColumn(block) {
  const title = getValue(block, 'Title');
  const employeeName = getValue(block, 'Name');
  const jobTitle = getValue(block, 'Contact\'s Position');
  const phone = getValue(block, 'Phone');
  const linkedin = getLink(block, 'LinkedIn');
  const email = getValue(block, 'Email Address');

  block.innerHTML = '';

  const content = createElement(
    'div',
    'contact-card__content',
  );

  const heading = createElement(
    'h2',
    'contact-card__title',
    title || 'CONTACT US TO START A PROJECT',
  );

  content.appendChild(heading);

  const columns = createElement(
    'div',
    'contact-card__columns',
  );

  const employee = createElement(
    'div',
    'contact-card__employee',
  );

  const employeeHeader = createElement(
    'div',
    'contact-card__employee-header',
  );

  const name = createElement(
    'h3',
    'contact-card__employee-name',
    employeeName,
  );

  employeeHeader.appendChild(name);

  if (linkedin) {
    employeeHeader.appendChild(
      createLinkedInIcon(linkedin),
    );
  }

  employee.appendChild(employeeHeader);

  const role = createElement(
    'div',
    'contact-card__job-title',
    jobTitle,
  );

  employee.appendChild(role);

  const contact = createElement(
    'div',
    'contact-card__contact',
  );

  const contactLabel = createElement(
    'div',
    'contact-card__contact-label',
    'GENERAL INQUIRIES',
  );

  contact.appendChild(contactLabel);

  if (phone) {
    const phoneRow = createElement(
      'div',
      'contact-card__phone-row',
    );

    const phoneIcon = document.createElement('span');

    phoneIcon.className = 'contact-card__phone-icon';

    phoneIcon.innerHTML = `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
            >
                <path
                    d="M6.6 2.9c.4-.4 1-.5 1.5-.2l3.1 1.8c.5.3.7.9.5 1.4l-1.4 3.1c-.2.4-.1.9.2 1.2l3.2 3.2c.3.3.8.4 1.2.2l3.1-1.4c.5-.2 1.1 0 1.4.5l1.8 3.1c.3.5.2 1.1-.2 1.5l-2.1 2.1c-.9.9-2.2 1.2-3.4.8-3.3-1.1-6.3-3.1-8.8-5.6s-4.5-5.5-5.6-8.8c-.4-1.2-.1-2.5.8-3.4L6.6 2.9Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        `;

    phoneRow.appendChild(phoneIcon);

    const phoneLink = createElement(
      'a',
      'contact-card__phone',
      phone,
    );

    phoneLink.href = `tel:${phone.replace(/\D/g, '')}`;

    phoneRow.appendChild(phoneLink);

    contact.appendChild(phoneRow);
  }

  if (email) {
    const emailRow = createElement(
      'div',
      'contact-card__email-row',
    );

    const emailIcon = document.createElement('span');

    emailIcon.className = 'contact-card__email-icon';

    emailIcon.innerHTML = `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
            >
                <path
                    d="M3 5.5h18v13H3z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linejoin="round"
                />
                <path
                    d="m3.5 6 8.5 6.5L20.5 6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linejoin="round"
                />
            </svg>
        `;

    emailRow.appendChild(emailIcon);

    const emailLink = createElement(
      'a',
      'contact-card__email',
      email,
    );

    emailLink.href = `mailto:${email}`;

    emailRow.appendChild(emailLink);

    contact.appendChild(emailRow);
  }

  columns.appendChild(employee);
  columns.appendChild(contact);

  content.appendChild(columns);

  block.appendChild(content);
}

export default function decorate(block) {
  const columnType = getValue(
    block,
    'Column Type',
  );

  if (columnType === 'one-column') {
    decorateOneColumn(block);
    return;
  }

  if (columnType === 'two-column') {
    decorateTwoColumn(block);
  }
}
