function initAnalytics() {
  if (typeof MEKO_CONFIG === 'undefined') return;

  const { yandexMetrikaId, googleAnalyticsId } = MEKO_CONFIG.analytics || {};

  if (yandexMetrikaId) {
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = Date.now();
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://mc.yandex.ru/metrika/tag.js';
    document.head.appendChild(s);
    window.ym(yandexMetrikaId, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
  }

  if (googleAnalyticsId) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', googleAnalyticsId);
  }

  document.addEventListener('click', (e) => {
    const track = e.target.closest('[data-track]');
    if (!track) return;
    const goal = track.dataset.track;
    if (yandexMetrikaId && window.ym) window.ym(yandexMetrikaId, 'reachGoal', goal);
    if (googleAnalyticsId && window.gtag) window.gtag('event', goal, { event_category: 'engagement' });
  });
}

function trackFormSubmit(formName) {
  const { yandexMetrikaId, googleAnalyticsId } = MEKO_CONFIG?.analytics || {};
  if (yandexMetrikaId && window.ym) window.ym(yandexMetrikaId, 'reachGoal', `form-${formName}`);
  if (googleAnalyticsId && window.gtag) window.gtag('event', 'form_submit', { form_name: formName });
}

async function sendTelegramLead(data) {
  const { token, chatId } = MEKO_CONFIG?.telegramBot || {};
  if (!token || !chatId) return false;

  const text = [
    '🆕 Новая заявка MEKO',
    `Имя: ${data.name || '—'}`,
    `Телефон: ${data.phone || '—'}`,
    data.message ? `Комментарий: ${data.message}` : '',
    `Страница: ${window.location.href}`,
  ].filter(Boolean).join('\n');

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  return res.ok;
}
