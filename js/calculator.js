function initCalculator() {
  const calc = document.querySelector('.js-calculator');
  if (!calc || typeof MEKO_CONFIG === 'undefined') return;

  const cfg = MEKO_CONFIG.calculator;
  const els = {
    width: calc.querySelector('[name="width"]'),
    length: calc.querySelector('[name="length"]'),
    texture: calc.querySelector('[name="texture"]'),
    corners: calc.querySelector('[name="corners"]'),
    pipes: calc.querySelector('[name="pipes"]'),
    lights: calc.querySelector('[name="lights"]'),
    tape: calc.querySelector('[name="tape"]'),
    price: calc.querySelector('.calculator__price-value'),
    summary: calc.querySelector('.calculator__summary'),
  };

  const counters = calc.querySelectorAll('[data-counter]');
  counters.forEach((wrap) => {
    const input = wrap.querySelector('input');
    const minus = wrap.querySelector('[data-action="minus"]');
    const plus = wrap.querySelector('[data-action="plus"]');
    minus?.addEventListener('click', () => {
      input.value = Math.max(0, Number(input.value) - 1);
      update();
    });
    plus?.addEventListener('click', () => {
      input.value = Number(input.value) + 1;
      update();
    });
  });

  calc.addEventListener('input', update);
  calc.addEventListener('change', update);
  update();

  function getArea() {
    const w = Number(els.width?.value || 0);
    const l = Number(els.length?.value || 0);
    return Math.max(cfg.minArea, w * l);
  }

  function getTexturePrice() {
    const map = {
      matte_white: cfg.matteWhite,
      matte_color: cfg.matteColor,
      satin_white: cfg.satinWhite,
      satin_color: cfg.satinColor,
      glossy_white: cfg.glossyWhite,
      glossy_color: cfg.glossyColor,
    };
    return map[els.texture?.value] || cfg.matteWhite;
  }

  function update() {
    const area = getArea();
    const sqmPrice = getTexturePrice();
    const corners = Number(els.corners?.value || 0);
    const pipes = Number(els.pipes?.value || 0);
    const lights = Number(els.lights?.value || 0);
    const tape = Number(els.tape?.value || 0);

    const total = Math.round(
      area * sqmPrice
      + corners * cfg.corner
      + pipes * cfg.pipe
      + lights * cfg.light
      + tape * cfg.tapePerMeter
    );

    if (els.price) els.price.textContent = total.toLocaleString('ru-RU');
    if (els.summary) {
      els.summary.textContent = `Площадь ${area.toFixed(1)} м² × ${sqmPrice} ₽, углы: ${corners}, трубы: ${pipes}, свет: ${lights}, лента: ${tape} м.`;
    }
  }
}
