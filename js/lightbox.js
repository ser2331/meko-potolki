function initLightbox() {
  const items = document.querySelectorAll('[data-lightbox]');
  if (!items.length) return;

  let overlay;

  const close = () => {
    overlay?.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => overlay?.remove(), 250);
    overlay = null;
  };

  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const img = item.querySelector('img');
      const label = item.getAttribute('aria-label') || item.dataset.caption || 'Просмотр';

      overlay = document.createElement('div');
      overlay.className = 'lightbox';
      overlay.innerHTML = `
        <div class="lightbox__backdrop" data-close></div>
        <div class="lightbox__dialog" role="dialog" aria-modal="true" aria-label="${label}">
          <button class="lightbox__close" type="button" aria-label="Закрыть">&times;</button>
          <div class="lightbox__content">
            ${img ? `<img src="${img.src}" alt="${img.alt}" class="lightbox__image">` : `<div class="img-placeholder skeleton lightbox__placeholder">${label}</div>`}
            <p class="lightbox__caption">${label}</p>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => overlay.classList.add('is-open'));

      overlay.addEventListener('click', (ev) => {
        if (ev.target.closest('[data-close]') || ev.target.classList.contains('lightbox__close')) close();
      });

      document.addEventListener('keydown', function escHandler(ev) {
        if (ev.key === 'Escape') {
          close();
          document.removeEventListener('keydown', escHandler);
        }
      });
    });
  });
}
