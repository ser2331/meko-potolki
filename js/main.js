document.addEventListener('DOMContentLoaded', () => {
  renderLayout();
  initMobileMenu();
  initFaq();
  initContactForm();
  initPortfolioFilter();
  injectConfig();
});

function initMobileMenu() {
  document.addEventListener('click', (e) => {
    const burger = e.target.closest('.burger');
    if (!burger) return;

    const mobileNav = document.getElementById('mobile-nav');
    if (!mobileNav) return;

    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.classList.toggle('is-open', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('.mobile-nav__link');
    if (!link) return;
    const burger = document.querySelector('.burger');
    const mobileNav = document.getElementById('mobile-nav');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (mobileNav) mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
  });
}

function initFaq() {
  document.querySelectorAll('.faq__question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.faq__item.is-open').forEach((el) => {
        el.classList.remove('is-open');
        el.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initContactForm() {
  const form = document.querySelector('.js-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const success = form.querySelector('.form__success');
    if (success) {
      success.classList.add('is-visible');
      form.reset();
      setTimeout(() => success.classList.remove('is-visible'), 5000);
    }
  });
}

function initPortfolioFilter() {
  const filters = document.querySelectorAll('.portfolio-filter__btn');
  const items = document.querySelectorAll('[data-category]');
  if (!filters.length || !items.length) return;

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;
      filters.forEach((f) => f.classList.toggle('is-active', f === btn));
      items.forEach((item) => {
        const show = category === 'all' || item.dataset.category === category;
        item.style.display = show ? '' : 'none';
      });
    });
  });
}

function injectConfig() {
  if (typeof MEKO_CONFIG === 'undefined') return;

  document.querySelectorAll('[data-phone]').forEach((el) => {
    el.href = `tel:${MEKO_CONFIG.phone}`;
    if (el.dataset.phone === 'text') {
      el.textContent = MEKO_CONFIG.phoneDisplay;
    }
  });

  document.querySelectorAll('[data-email]').forEach((el) => {
    el.href = `mailto:${MEKO_CONFIG.email}`;
    if (el.dataset.email === 'text') {
      el.textContent = MEKO_CONFIG.email;
    }
  });

  document.querySelectorAll('[data-address]').forEach((el) => {
    el.textContent = MEKO_CONFIG.address;
  });

  document.querySelectorAll('[data-whatsapp]').forEach((el) => {
    el.href = `https://wa.me/${MEKO_CONFIG.whatsapp}`;
  });

  document.querySelectorAll('[data-telegram]').forEach((el) => {
    el.href = `https://t.me/${MEKO_CONFIG.telegram}`;
  });
}
