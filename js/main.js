document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('is-loading');

  renderLayout();
  initMobileMenu();
  initFaq();
  initContactForm();
  initPortfolioFilter();
  initLazyMedia();
  initSkeletons();
  initScrollReveal();
  initPageReady();
  injectConfig();
});

function initPageReady() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-ready');
    });
  });
}

function initLazyMedia() {
  document.querySelectorAll('img[data-src]').forEach((img) => {
    wrapLazyImage(img);
  });

  document.querySelectorAll('img:not([data-src])').forEach((img) => {
    if (!img.closest('header') && !img.hasAttribute('loading')) {
      img.loading = 'lazy';
      img.decoding = 'async';
    }
  });

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('img[data-src]').forEach((img) => loadLazyImage(img));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loadLazyImage(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '120px' });

  document.querySelectorAll('img[data-src]').forEach((img) => observer.observe(img));
}

function wrapLazyImage(img) {
  if (img.closest('.lazy-img-wrap')) return;

  const wrap = document.createElement('div');
  wrap.className = 'lazy-img-wrap';
  if (img.classList.contains('card__image')) wrap.style.aspectRatio = '16 / 10';
  if (img.closest('.portfolio-item')) wrap.style.aspectRatio = '1';

  const skeleton = document.createElement('div');
  skeleton.className = 'skeleton';
  skeleton.setAttribute('aria-hidden', 'true');

  img.classList.add('lazy-img');
  img.parentNode.insertBefore(wrap, img);
  wrap.appendChild(skeleton);
  wrap.appendChild(img);
}

function loadLazyImage(img) {
  const src = img.dataset.src;
  if (!src || img.dataset.loaded === 'true') return;

  img.dataset.loaded = 'true';
  img.src = src;

  img.addEventListener('load', () => {
    img.classList.add('is-loaded');
    const skeleton = img.parentElement?.querySelector('.skeleton');
    if (skeleton) skeleton.classList.add('is-hidden');
  }, { once: true });

  img.addEventListener('error', () => {
    img.classList.add('is-loaded');
    const skeleton = img.parentElement?.querySelector('.skeleton');
    if (skeleton) skeleton.classList.add('is-hidden');
  }, { once: true });
}

function initSkeletons() {
  document.querySelectorAll('.img-placeholder').forEach((el, index) => {
    el.classList.add('skeleton');

    setTimeout(() => {
      el.classList.add('is-loaded');
    }, 300 + Math.min(index * 40, 400));
  });
}

function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll('.section, .card, .advantage-card, .step-card, .review, .info-box');
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal--delay-1');
    if (i % 3 === 2) el.classList.add('reveal--delay-2');
  });

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('is-visible'));

  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 320);
  }, 4200);
}

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
  document.querySelectorAll('.js-contact-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const success = form.querySelector('.form__success');
      if (success) success.classList.add('is-visible');

      showToast('Спасибо! Мы перезвоним вам в ближайшее время.', 'success');
      form.reset();

      setTimeout(() => {
        if (success) success.classList.remove('is-visible');
      }, 5000);
    });
  });
}

function initPortfolioFilter() {
  const filters = document.querySelectorAll('.portfolio-filter__btn');
  const items = document.querySelectorAll('.portfolio-item[data-category]');
  const grid = document.querySelector('.portfolio-grid');
  if (!filters.length || !items.length) return;

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;
      filters.forEach((f) => f.classList.toggle('is-active', f === btn));

      if (grid) grid.classList.add('is-filtering');

      items.forEach((item) => {
        const show = category === 'all' || item.dataset.category === category;
        item.classList.toggle('is-filtered-out', !show);
      });

      setTimeout(() => {
        if (grid) grid.classList.remove('is-filtering');
      }, 320);
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
