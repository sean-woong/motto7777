(() => {
  'use strict';
  const word = document.querySelector('.word');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!word || new URLSearchParams(location.search).get('motion') === 'off') return;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;pointer-events:none';
  svg.innerHTML = `<defs><filter id="title-wave" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB"><feImage result="wave" preserveAspectRatio="none"/><feDisplacementMap in="SourceGraphic" in2="wave" scale="30" xChannelSelector="R" yChannelSelector="G"/></filter></defs>`;
  document.body.append(svg);
  const map = svg.querySelector('feImage');
  const displacement = svg.querySelector('feDisplacementMap');
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const pixels = ctx.createImageData(128, 64);
  let visible = false;
  let frame = 0;
  let phase = 0;
  let lastY = window.scrollY;

  function render() {
    frame = 0;
    // Scroll position advances the wave. No time-based movement or settling.
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 128; x++) {
        const edgeX = Math.min(1, x / 6, (127 - x) / 6);
        const edgeY = Math.min(1, y / 4, (63 - y) / 4);
        const i = (y * 128 + x) * 4;
        pixels.data[i] = Math.round(127.5 + Math.sin(y / 63 * Math.PI * 4 + phase) * 127.5 * edgeX);
        pixels.data[i + 1] = Math.round(127.5 + Math.sin(x / 127 * Math.PI * 6 - phase) * 76 * edgeY);
        pixels.data[i + 2] = 128;
        pixels.data[i + 3] = 255;
      }
    }
    ctx.putImageData(pixels, 0, 0);
    map.setAttribute('href', canvas.toDataURL());
    displacement.setAttribute('scale', window.innerWidth <= 650 ? '16' : '30');
    word.style.filter = 'url(#title-wave)';
  }

  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastY = window.scrollY;
    if (reduced.matches) {
      word.style.removeProperty('filter');
    } else if (visible && !document.hidden) {
      frame = requestAnimationFrame(render);
    }
  }
  window.addEventListener('scroll', () => {
    const nextY = window.scrollY;
    const delta = nextY - lastY;
    lastY = nextY;
    if (reduced.matches || document.hidden) return;
    // Scrolling back reverses the wave by exactly the same amount.
    phase += delta * (Math.PI * 2 / 600);
    if (visible && !frame) frame = requestAnimationFrame(render);
  }, { passive: true });
  window.addEventListener('resize', sync);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(word);
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
})();
