function getBasePath() {
  const base = document.body.dataset.base;
  if (base !== undefined) return base;
  const depth = (window.location.pathname.match(/\//g) || []).length;
  const isNested = /\/(uslugi|portfolio|blog)\//.test(window.location.pathname);
  return isNested ? '../' : '';
}

function navHref(href, base) {
  if (href.startsWith('http') || href === '/') {
    return href === '/' ? base || '/' : href;
  }
  return `${base}${href.replace(/^\//, '')}`;
}

function navIcon(name) {
  const icons = {
    home: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z"/></svg>',
    ceiling: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8"/></svg>',
    diamond: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l8 8-8 12L4 10l8-8z"/></svg>',
    gear: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
    gallery: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
    pin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  };
  return icons[name] || '';
}

function renderSiteHeader() {
  const el = document.getElementById('site-header');
  if (!el || typeof MEKO_CONFIG === 'undefined') return;

  const cfg = MEKO_CONFIG;
  const base = getBasePath();
  const activePage = document.body.dataset.page || '';
  const logoSrc = cfg.logo.startsWith('http') ? cfg.logo : `${base}${cfg.logo}`;

  const navItems = cfg.nav.map((item) => {
    const href = navHref(item.href, base);
    const isActive = item.id === activePage ? ' main-nav__link--active' : '';
    const icon = item.icon ? `<span class="main-nav__icon" aria-hidden="true">${navIcon(item.icon)}</span>` : '';
    return `<li><a href="${href}" class="main-nav__link${isActive}">${icon}${item.label}</a></li>`;
  }).join('');

  el.innerHTML = `
    <div class="top-bar">
      <div class="container top-bar__inner">
        <div class="top-bar__social">
          <a href="${cfg.social.vk}" class="top-bar__social-link" target="_blank" rel="noopener" aria-label="ВКонтакте">VK</a>
          <a href="${cfg.social.instagram}" class="top-bar__social-link" target="_blank" rel="noopener" aria-label="Instagram">IG</a>
          <a href="${cfg.social.facebook}" class="top-bar__social-link" target="_blank" rel="noopener" aria-label="Facebook">FB</a>
          <a href="${cfg.social.ok}" class="top-bar__social-link" target="_blank" rel="noopener" aria-label="Одноклассники">OK</a>
        </div>
      </div>
    </div>

    <div class="header-main">
      <div class="container header-main__inner">
        <a href="${navHref('/', base)}" class="header-main__logo" aria-label="MEKO — на главную">
          <img src="${logoSrc}" alt="MEKO — натяжные потолки в Краснодаре" width="160" height="80" class="header-main__logo-img">
        </a>

        <div class="header-main__contacts">
          <div class="header-main__phones">
            <a href="tel:${cfg.phone}" class="header-main__phone" data-phone="text">${cfg.phoneDisplay}</a>
            <a href="tel:${cfg.phone}" class="header-main__phone" data-phone="text">${cfg.phoneDisplay}</a>
          </div>
          <div class="header-main__messengers">
            <a href="viber://chat?number=${cfg.viber}" class="messenger messenger--viber" aria-label="Viber">V</a>
            <a href="https://wa.me/${cfg.whatsapp}" class="messenger messenger--whatsapp" aria-label="WhatsApp" data-whatsapp>W</a>
            <a href="https://t.me/${cfg.telegram}" class="messenger messenger--telegram" aria-label="Telegram" data-telegram>T</a>
          </div>
        </div>

        <div class="header-main__actions">
          <a href="${navHref('/kontakty.html#zayavka', base)}" class="btn btn--navy">Вызов замерщика</a>
          <a href="${navHref('/tseny.html', base)}" class="btn btn--calc" title="Калькулятор — скоро">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h2M12 10h2M16 10h0M8 14h2M12 14h2M16 14h0M8 18h2M12 18h4"/></svg>
            Калькулятор
          </a>
        </div>

        <button class="burger" aria-label="Открыть меню" aria-expanded="false" aria-controls="mobile-nav">
          <span class="burger__line"></span>
          <span class="burger__line"></span>
          <span class="burger__line"></span>
        </button>
      </div>
    </div>

    <nav class="main-nav" aria-label="Основная навигация">
      <div class="container">
        <ul class="main-nav__list">${navItems}</ul>
      </div>
    </nav>

    <nav class="mobile-nav" id="mobile-nav" aria-label="Мобильная навигация">
      <ul class="mobile-nav__list">
        ${cfg.nav.map((item) => `<li><a href="${navHref(item.href, base)}" class="mobile-nav__link">${item.label}</a></li>`).join('')}
        <li><a href="tel:${cfg.phone}" class="mobile-nav__link" data-phone="text">${cfg.phoneDisplay}</a></li>
      </ul>
    </nav>
  `;
}

function renderSiteFooter() {
  const el = document.getElementById('site-footer');
  if (!el || typeof MEKO_CONFIG === 'undefined') return;

  const cfg = MEKO_CONFIG;
  const base = getBasePath();

  el.innerHTML = `
    <div class="container">
      <div class="footer__grid">
        <div>
          <img src="${cfg.logo.startsWith('http') ? cfg.logo : base + cfg.logo}" alt="MEKO" width="120" height="60" class="footer__logo">
          <p class="footer__desc">Установка натяжных потолков в Краснодаре. Работаем с ${cfg.yearFounded} года.</p>
        </div>
        <div>
          <h3 class="footer__title">Услуги</h3>
          <ul class="footer__links">
            <li><a href="${navHref('/uslugi/natyazhnye-potolki.html', base)}" class="footer__link">Натяжные потолки</a></li>
            <li><a href="${navHref('/uslugi/matovye-potolki.html', base)}" class="footer__link">Матовые</a></li>
            <li><a href="${navHref('/uslugi/glyantsevye-potolki.html', base)}" class="footer__link">Глянцевые</a></li>
            <li><a href="${navHref('/tseny.html', base)}" class="footer__link">Цены</a></li>
          </ul>
        </div>
        <div>
          <h3 class="footer__title">Компания</h3>
          <ul class="footer__links">
            <li><a href="${navHref('/portfolio/', base)}" class="footer__link">Наши работы</a></li>
            <li><a href="${navHref('/otzyvy.html', base)}" class="footer__link">Отзывы</a></li>
            <li><a href="${navHref('/o-kompanii.html', base)}" class="footer__link">О компании</a></li>
            <li><a href="${navHref('/blog/', base)}" class="footer__link">Блог</a></li>
          </ul>
        </div>
        <div>
          <h3 class="footer__title">Контакты</h3>
          <ul class="footer__links">
            <li><a href="tel:${cfg.phone}" class="footer__link" data-phone="text">${cfg.phoneDisplay}</a></li>
            <li><a href="mailto:${cfg.email}" class="footer__link" data-email="text">${cfg.email}</a></li>
            <li><span class="footer__link" data-address>${cfg.address}</span></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <p>© ${cfg.yearFounded}–2026 MEKO. Натяжные потолки в Краснодаре.</p>
        <p>Все права защищены</p>
      </div>
    </div>
  `;
}

function renderLayout() {
  renderSiteHeader();
  renderSiteFooter();
}
