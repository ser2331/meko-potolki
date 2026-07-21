const MEKO_ICONS = {
  measure: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12h4l2-5 4 10 2-5h8"/></svg>',
  clean: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z"/><path d="M5 19h14"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/></svg>',
  safe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
  team: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  service: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 6l4 4-8 8H6v-4l8-8z"/></svg>',
};

function initIcons() {
  document.querySelectorAll('[data-icon]').forEach((el) => {
    const icon = MEKO_ICONS[el.dataset.icon];
    if (icon) el.innerHTML = icon;
  });
}

function initCountUp() {
  const els = document.querySelectorAll('.count-up');
  if (!els.length) return;

  const animate = (el) => {
    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = `${Math.floor(progress * target)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    els.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.counted) return;
      entry.target.dataset.counted = 'true';
      animate(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  els.forEach((el) => observer.observe(el));
}

function injectFloatingUi() {
  if (document.getElementById('mobile-sticky-bar')) return;

  const base = getBasePath();
  const cfg = MEKO_CONFIG;

  const bar = document.createElement('div');
  bar.id = 'mobile-sticky-bar';
  bar.className = 'mobile-sticky-bar';
  bar.innerHTML = `
    <a href="tel:${cfg.phone}" class="mobile-sticky-bar__btn mobile-sticky-bar__btn--phone" data-phone data-track="phone">Позвонить</a>
    <a href="${navHref('/kontakty.html#zayavka', base)}" class="mobile-sticky-bar__btn mobile-sticky-bar__btn--cta" data-track="sticky-cta">Замер</a>
  `;

  const wa = document.createElement('a');
  wa.href = `https://wa.me/${cfg.whatsapp}`;
  wa.className = 'whatsapp-float';
  wa.setAttribute('aria-label', 'Написать в WhatsApp');
  wa.setAttribute('data-track', 'whatsapp');
  wa.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15l-1.4 5.1 5.2-1.4A10 10 0 1012 2zm5.3 14.3c-.2.6-1.2 1.1-1.7 1.1-.4 0-1 .2-3.3-.7-2.8-1.1-4.6-3.7-4.7-3.9-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.3.6c-.1.2-.2.3 0 .5.2.3 1 1.5 2.3 2.4 1.6 1.1 2.9 1.4 3.3 1.6.4.1.7.1.9-.1l.8-.9c.2-.2.4-.2.7-.1l2.2 1c.3.1.5.2.6.4.1.1.1.7-.1 1.3z"/></svg>';

  document.body.appendChild(bar);
  document.body.appendChild(wa);
}

function injectBreadcrumbSchema() {
  const crumbs = document.querySelectorAll('.breadcrumbs__list .breadcrumbs__item');
  if (crumbs.length < 2 || typeof MEKO_CONFIG === 'undefined') return;

  const items = [];

  crumbs.forEach((item, index) => {
    const link = item.querySelector('a');
    const text = link ? link.textContent.trim() : item.textContent.trim();
    const href = link ? link.href : window.location.href;
    items.push({
      '@type': 'ListItem',
      position: index + 1,
      name: text,
      item: href,
    });
  });

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  });
  document.head.appendChild(script);
}
