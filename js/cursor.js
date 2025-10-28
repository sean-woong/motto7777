(function initMottoCursor(global) {
  if (!global || typeof document === 'undefined') {
    return;
  }

  const doc = document;
  const state = {
    initialized: false,
    raf: null,
    x: global.innerWidth ? global.innerWidth / 2 : 0,
    y: global.innerHeight ? global.innerHeight / 2 : 0,
    lastX: null,
    lastY: null,
    lastTime: null,
    clickable: false,
    movingTimer: null,
    cursorEl: null,
    handleMouseMove: null,
    handleMouseLeave: null,
    handleWindowBlur: null
  };

  const prefersPointerFine = () => {
    if (!global.matchMedia) return true;
    const mq = global.matchMedia('(pointer: fine)');
    if (typeof mq.matches === 'boolean') return mq.matches;
    return true;
  };

  const ensureCursorElement = () => {
    if (state.cursorEl && doc.body.contains(state.cursorEl)) {
      return state.cursorEl;
    }
    const existing = doc.getElementById('mottoCursor');
    if (existing) {
      if (existing.parentNode !== doc.body) {
        doc.body.appendChild(existing);
      }
      state.cursorEl = existing;
      return state.cursorEl;
    }
    const el = doc.createElement('div');
    el.id = 'mottoCursor';
    el.className = 'motto-cursor';
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('role', 'presentation');
    doc.body.appendChild(el);
    state.cursorEl = el;
    return el;
  };

  const setCursorSpeed = (value) => {
    doc.body?.style?.setProperty('--cursor-speed', `${value}`);
  };

  const updateClickableState = (isClickable) => {
    if (state.clickable === isClickable) return;
    state.clickable = isClickable;
    doc.body?.classList?.toggle('cursor-target', isClickable);
  };

  const toggleCursorMoving = (isMoving) => {
    if (!doc.body) return;
    if (isMoving) {
      doc.body.classList.add('cursor-moving');
      if (state.movingTimer) clearTimeout(state.movingTimer);
      state.movingTimer = global.setTimeout(() => {
        doc.body.classList.remove('cursor-moving');
        state.movingTimer = null;
        setCursorSpeed(0);
      }, 200);
    } else {
      doc.body.classList.remove('cursor-moving');
      if (state.movingTimer) {
        clearTimeout(state.movingTimer);
        state.movingTimer = null;
      }
      setCursorSpeed(0);
    }
  };

  const applyCursorPosition = () => {
    state.raf = null;
    if (!state.cursorEl) return;
    state.cursorEl.style.setProperty('--cursor-x', `${state.x}px`);
    state.cursorEl.style.setProperty('--cursor-y', `${state.y}px`);
  };

  const scheduleCursorRender = () => {
    if (state.raf) return;
    state.raf = global.requestAnimationFrame(applyCursorPosition);
  };

  const handlePointerMove = (event) => {
    if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
      return;
    }
    state.x = event.clientX;
    state.y = event.clientY;
    const now = global.performance ? global.performance.now() : Date.now();
    if (state.lastTime !== null && state.lastX !== null && state.lastY !== null) {
      const dist = Math.hypot(event.clientX - state.lastX, event.clientY - state.lastY);
      const speed = dist;
      if (speed > 50) {
        const normalized = Math.min((speed - 50) / 150, 1);
        setCursorSpeed(normalized);
        toggleCursorMoving(true);
      } else {
        setCursorSpeed(0);
      }
    }
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.lastTime = now;

    const clickableTarget = event.target?.closest?.('a, button, .clickable, [role="button"], input, select, textarea');
    updateClickableState(Boolean(clickableTarget));
    scheduleCursorRender();
  };

  const handlePointerLeave = (event) => {
    if (event && event.relatedTarget) return;
    updateClickableState(false);
    toggleCursorMoving(false);
  };

  const handleWindowBlur = () => {
    updateClickableState(false);
    toggleCursorMoving(false);
  };

  const addListeners = () => {
    state.handleMouseMove = handlePointerMove;
    state.handleMouseLeave = handlePointerLeave;
    state.handleWindowBlur = handleWindowBlur;
    doc.addEventListener('pointermove', state.handleMouseMove, { passive: true });
    doc.addEventListener('pointerleave', state.handleMouseLeave);
    global.addEventListener('blur', state.handleWindowBlur);
  };

  const removeListeners = () => {
    if (state.handleMouseMove) doc.removeEventListener('mousemove', state.handleMouseMove);
    if (state.handleMouseLeave) doc.removeEventListener('mouseleave', state.handleMouseLeave);
    if (state.handleWindowBlur) global.removeEventListener('blur', state.handleWindowBlur);
    state.handleMouseMove = null;
    state.handleMouseLeave = null;
    state.handleWindowBlur = null;
  };

  const init = () => {
    if (state.initialized) return;
    if (!doc.body) return;
    if (!prefersPointerFine()) return;
    ensureCursorElement();
    applyCursorPosition();
    doc.body.classList.add('has-custom-cursor');
    setCursorSpeed(0);
    addListeners();
    state.initialized = true;
  };

  const destroy = () => {
    if (!state.initialized) return;
    removeListeners();
    doc.body?.classList?.remove('has-custom-cursor', 'cursor-moving', 'cursor-target');
    if (state.cursorEl && state.cursorEl.parentNode) {
      state.cursorEl.parentNode.removeChild(state.cursorEl);
    }
    state.cursorEl = null;
    state.initialized = false;
  };

  const MottoCursor = {
    init,
    destroy,
    isActive: () => state.initialized
  };

  global.MottoCursor = MottoCursor;

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', () => MottoCursor.init(), { once: true });
  } else {
    MottoCursor.init();
  }
})(typeof window !== 'undefined' ? window : null);
