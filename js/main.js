document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('is-loading');

  renderLayout();
  injectFloatingUi();
  injectBreadcrumbSchema();
  initAnalytics();
  initMobileMenu();
  initStickyBar();
  initFaq();
  initContactForm();
  initPortfolioFilter();
  initLazyMedia();
  initSkeletons();
  initScrollReveal();
  initIcons();
  initCountUp();
  if (typeof initCalculator === 'function') initCalculator();
  if (typeof initLightbox === 'function') initLightbox();
  initPageReady();
  injectConfig();
});

function initStickyBar() {
  const bar = document.getElementById('mobile-sticky-bar');
  if (!bar) return;

  document.body.classList.add('has-sticky-bar');

  const toggle = () => {
    bar.classList.toggle('is-visible', window.scrollY > 320);
  };

  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

function initPageReady() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-ready');
    });
  });
}

function initLazyMedia() {
  document.querySelectorAll('img:not([loading])').forEach((img) => {
    if (!img.closest('header')) {
      img.loading = 'lazy';
      img.decoding = 'async';
    }
  });
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

  const targets = document.querySelectorAll('.section, .card, .advantage-card, .step-card, .review, .info-box, .compare-card, .district-card');
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
  const mobileNav = document.getElementById('mobile-nav');
  if (!mobileNav) return;

  const openMenu = () => {
    const burger = document.querySelector('.burger');
    if (!burger) return;
    burger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    const burger = document.querySelector('.burger');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('.burger')) {
      const burger = e.target.closest('.burger');
      const isOpen = burger.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu();
      else openMenu();
      return;
    }

    if (e.target.closest('.mobile-nav__close') || e.target.closest('.mobile-nav__link')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      closeMenu();
    }
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
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        name: form.querySelector('[name="name"]')?.value?.trim(),
        phone: form.querySelector('[name="phone"]')?.value?.trim(),
        message: form.querySelector('[name="message"]')?.value?.trim(),
      };

      const success = form.querySelector('.form__success');
      if (success) success.classList.add('is-visible');

      try {
        const sent = await sendTelegramLead(data);
        showToast(
          sent ? 'Заявка отправлена! Перезвоним в ближайшее время.' : 'Заявка принята! Мы свяжемся с вами в ближайшее время.',
          'success'
        );
        trackFormSubmit(form.getAttribute('aria-label') || 'contact');
      } catch {
        showToast('Заявка принята! Мы свяжемся с вами в ближайшее время.', 'success');
      }

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
