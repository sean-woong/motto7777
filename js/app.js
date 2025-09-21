// ====== DEV TOGGLES ======
const ENABLE_AUDIO     = true;   // ENTER 후 OST 자동 시작
const SHOW_LEGEND_PINS = true;   // 메인에 Legend 지름길 핀
const LEGEND_PIN_COUNT = 1;      // 한 번에 몇 개 표시할지

// ====== External Links ======
const SPOTIFY_URL  = '#';
const YOUTUBE_URL  = '#';
const SHOP_URL     = '#';
const TWITTER_URL  = 'https://x.com/motto_7777';
const IG_URL       = '#';
const TT_URL       = '#';

// ====== Data Sources ======
const IMM_LIST = [
  {
    id: "imm_01",
    title: "Immortals #1 — Skull #19",
    desc: "Skull #19 — Fragment Protocol · Fuel ignites. 연료가 점화된다.",
    archetype: "skull",
    thumb: "assets/images/skull.gif",
    video: "assets/video/skull.mp4",
    legend: true,
    tags: ["cyberpunk", "animation"],
    created_date: "2025-09-01"
  }
];

// ====== Portals ======
const PORTALS = [
  { id: 'dealer',     label: 'DEALER',     img: 'assets/images/dealer.gif',     emo: '🎲' },
  { id: 'skull',      label: 'SKULL',      img: 'assets/images/skull.gif',      emo: '💀' },
  { id: 'rockstar',   label: 'ROCKSTAR',   img: 'assets/images/rockstar.gif',   emo: '🎸' },
  { id: 'drag',       label: 'DRAG',       img: 'assets/images/drag.gif',       emo: '👑' },
  { id: 'military',   label: 'MILITARY',   img: 'assets/images/military.gif',   emo: '🪖' },
  { id: 'motorcycle', label: 'MOTORCYCLE', img: 'assets/images/motorcycle.gif', emo: '🏍️' },
  { id: 'boxer',      label: 'BOXER',      img: 'assets/images/boxer.gif',      emo: '🥊' },
];

// ====== Character Hero Videos ======
const CHAR_HERO = {
  dealer:     'assets/video/dealer.mp4',
  skull:      'assets/video/skull.mp4',
  rockstar:   'assets/video/rockstar.mp4',
  drag:       'assets/video/drag.mp4',
  military:   'assets/video/military.mp4',
  motorcycle: 'assets/video/motorcycle.mp4',
  boxer:      'assets/video/boxer.mp4'
};

// ====== Character Clips ======
const CHAR_CLIPS = {
  dealer: [],
  skull: [],
  rockstar: [],
  drag: [],
  military: [],
  motorcycle: [],
  boxer: []
};

// ====== Legend Descriptions ======
const LEGEND_DESC = {
  dealer:     { en: "Dealer — Loop Glitch · Fumes bleed.",   ko: "딜러 — 루프 글리치 · 연기가 스며든다." },
  skull:      { en: "Skull — Fragment Protocol · Sparks ignite.", ko: "스컬 — 프래그먼트 프로토콜 · 스파크가 튄다." },
  rockstar:   { en: "Rockstar — Stall Stage · Smile stalls.", ko: "록스타 — 스톨 스테이지 · 미소가 멈춘다." },
  drag:       { en: "Drag — Recode Glam · Everything screams.", ko: "드랙 — 리코드 글램 · 모든 것이 비명한다." },
  military:   { en: "Military — Reload Combat · Target locked.", ko: "밀리터리 — 리로드 컴뱃 · 조준이 고정된다." },
  boxer:      { en: "Boxer — Loop Fight · Bell rings.",      ko: "복서 — 루프 파이트 · 종이 울린다." },
  motorcycle: { en: "Motorcycle — Skid Speed · Veins pulse.", ko: "모터사이클 — 스키드 스피드 · 맥박이 뛴다." }
};

// ====== OST Tracks ======
const OST_TRACKS = [
  { title: 'Doomsday',        url: 'assets/audio/doomsday.mp3',        who: 'military' },
  { title: 'Motto',           url: 'assets/audio/motto.mp3',           who: 'motorcycle' },
  { title: 'Drag',            url: 'assets/audio/drag.mp3',            who: 'drag' },
  { title: '7777 (Get Lo)',   url: 'assets/audio/7777_getlo.mp3',      who: 'boxer' },
  { title: 'DNA Ferrari',     url: 'assets/audio/dna_ferrari.mp3',     who: 'rockstar' },
  { title: 'Break',           url: 'assets/audio/break.mp3',           who: 'dealer' },
  { title: 'Close Encounter', url: 'assets/audio/close_encounter.mp3', who: 'skull' }
];

// ====== Archive Files ======
const ARCHIVE_FILES = [];

// ====== DOM Cache ======
const DOM = {
  intro: document.getElementById('intro'),
  introClip: document.getElementById('introClip'),
  enterBtn: document.getElementById('enterBtn'),
  stage: document.getElementById('stage'),
  egg1: document.getElementById('egg1'),
  egg2: document.getElementById('egg2'),
  audioUI: document.getElementById('audio-ui'),
  nowUI: document.getElementById('nowPlaying'),
  vol: document.getElementById('vol'),
  muteBtn: document.getElementById('muteBtn'),
  prevBtn: document.getElementById('prevBtn'),
  playBtn: document.getElementById('playBtn'),
  nextBtn: document.getElementById('nextBtn'),
  spBtn: document.getElementById('spBtn'),
  ytBtn: document.getElementById('ytBtn'),
  twBtn: document.getElementById('twBtn'),
  igBtn: document.getElementById('igBtn'),
  ttBtn: document.getElementById('ttBtn'),
  shopBtn: document.getElementById('shopBtn'),
  immBtn: document.getElementById('immBtn'),
  arcBtn: document.getElementById('arcBtn'),
  homeBtn: document.getElementById('homeBtn'),
  charModal: document.getElementById('charModal'),
  charHero: document.getElementById('charHero'),
  charStrip: document.getElementById('charStrip'),
  charCaption: document.getElementById('charCaption'),
  charLegend: document.getElementById('charLegend'),
  charAutoBtn: document.getElementById('charAuto'),
  immModal: document.getElementById('immModal'),
  immGrid: document.getElementById('immGrid'),
  immDModal: document.getElementById('immDetailModal'),
  immLegend: document.getElementById('immLegend'),
  immTitle: document.getElementById('immTitle'),
  immVideo: document.getElementById('immVideo'),
  immDesc: document.getElementById('immDesc'),
  immPrev: document.getElementById('immPrev'),
  immNext: document.getElementById('immNext'),
  immIndex: document.getElementById('immIndex'),
  arcModal: document.getElementById('archiveModal'),
  arcGrid: document.getElementById('archiveGrid')
};

// ====== Link Setup ======
if (DOM.spBtn) DOM.spBtn.href = SPOTIFY_URL;
if (DOM.ytBtn) DOM.ytBtn.href = YOUTUBE_URL;
if (DOM.twBtn) DOM.twBtn.href = TWITTER_URL;
if (DOM.igBtn && IG_URL !== '#') DOM.igBtn.href = IG_URL;
if (DOM.ttBtn && TT_URL !== '#') DOM.ttBtn.href = TT_URL;
if (DOM.shopBtn) DOM.shopBtn.href = SHOP_URL;
if (SPOTIFY_URL === '#') DOM.spBtn?.classList.add('disabled');
if (YOUTUBE_URL === '#') DOM.ytBtn?.classList.add('disabled');
if (IG_URL === '#') DOM.igBtn?.classList.add('disabled');
if (TT_URL === '#') DOM.ttBtn?.classList.add('disabled');
if (SHOP_URL === '#') DOM.shopBtn?.classList.add('disabled');

// ====== Easter Eggs ======
function placeEggs() {
  const vw = window.innerWidth, vh = window.innerHeight;
  const pad = 14, w = 120, h = 20;
  let x1, y1, x2, y2, tries = 0, placedOK = false;
  while (tries < 20 && !placedOK) {
    x1 = Math.random() * (vw - 160) + pad;
    y1 = Math.random() * (vh - 100) + pad;
    x2 = Math.random() * (vw - 160) + pad;
    y2 = Math.random() * (vh - 100) + pad;
    placedOK = Math.abs(x1 - x2) > w || Math.abs(y1 - y2) > h;
    tries++;
  }
  if (!placedOK) {
    x1 = pad; y1 = pad;
    x2 = vw - 120 - pad; y2 = pad;
  }
  DOM.egg1.style.left = `${Math.round(x1)}px`; DOM.egg1.style.bottom = `${Math.round(y1)}px`;
  DOM.egg2.style.right = `${Math.round(vw - x2)}px`; DOM.egg2.style.bottom = `${Math.round(y2)}px`;
  DOM.egg1.classList.add('show');
  DOM.egg2.classList.add('show');
}

// ====== Debounce ======
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// ====== Intro → Main ======
DOM.enterBtn?.addEventListener('click', async () => {
  DOM.intro.style.display = 'none';
  DOM.introClip.hidden = false;
  setTimeout(() => {
    DOM.introClip.hidden = true;
    bootMain();
  }, 3000);
});

// ====== Boot Main ======
function bootMain() {
  spawnPortals();
  placeEggs();
  if (SHOW_LEGEND_PINS) spawnLegendPins();
  if (ENABLE_AUDIO) {
    DOM.audioUI.hidden = false; DOM.nowUI.hidden = false;
    startOST();
  }
}

// ====== Portals ======
function spawnPortals() {
  DOM.stage.innerHTML = '';
  const vw = window.innerWidth, vh = window.innerHeight;
  const placed = [];

  PORTALS.forEach(p => {
    const el = document.createElement('a');
    el.href = '#';
    el.className = 'portal';
    el.dataset.id = p.id;
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `${p.label} 캐릭터 모달 열기`);

    const probe = new Image();
    probe.onload = () => el.style.backgroundImage = `url(${p.img})`;
    probe.onerror = () => el.classList.add('placeholder');
    probe.src = p.img;

    const w = Math.min(vw * 0.22, 320), h = w;
    el.style.width = `${w}px`; el.style.height = `${h}px`;

    const padX = Math.min(120, vw * (vw < 640 ? 0.05 : 0.1)), padY = Math.min(100, vh * (vh < 640 ? 0.08 : 0.12));
    let tries = 0, placedOK = false, x = 0, y = 0;
    while (tries < 40 && !placedOK) {
      x = Math.random() * (vw - padX * 2 - w) + padX;
      y = Math.random() * (vh - padY * 2 - h) + padY;
      placedOK = placed.every(r => overlapRatio(x, y, w, h, r.x, r.y, r.w, r.h) < 0.5);
      tries++;
    }
    el.style.left = `${x}px`; el.style.top = `${y}px`;
    placed.push({ x, y, w, h });

    const lb = document.createElement('div');
    lb.className = 'label'; lb.textContent = p.label; el.appendChild(lb);

    el.addEventListener('click', (e) => {
      e.preventDefault();
      trackEvent('포털', '클릭', p.label);
      openCharModal(p.id);
    });

    DOM.stage.appendChild(el);
  });
}
window.addEventListener('resize', debounce(() => {
  spawnPortals();
  if (SHOW_LEGEND_PINS) spawnLegendPins(true);
}, 200));

function overlapRatio(x1, y1, w1, h1, x2, y2, w2, h2) {
  const xOverlap = Math.max(0, Math.min(x1 + w1, x2 + w2) - Math.max(x1, x2));
  const yOverlap = Math.max(0, Math.min(y1 + h1, y2 + h2) - Math.max(y1, y2));
  const inter = xOverlap * yOverlap;
  const area1 = w1 * h1, area2 = w2 * h2;
  const base = Math.min(area1, area2) || 1;
  return inter / base;
}

// ====== Legend Pins ======
let IMM_VIEW = [], IMM_CUR = -1;
async function spawnLegendPins(resize = false) {
  const legends = IMM_LIST.filter(x => x.legend === true);
  if (!legends.length) return;

  [...DOM.stage.querySelectorAll('.portal.legend')].forEach(n => n.remove());

  const vw = window.innerWidth, vh = window.innerHeight;
  const padX = Math.min(120, vw * (vw < 640 ? 0.05 : 0.1)), padY = Math.min(100, vh * (vh < 640 ? 0.08 : 0.12));
  const picks = legends.sort(() => Math.random() - 0.5).slice(0, LEGEND_PIN_COUNT);

  picks.forEach(item => {
    const el = document.createElement('a');
    el.href = '#';
    el.className = 'portal legend';
    el.setAttribute('tabindex', '0');
    el.style.width = el.style.height = `${Math.min(vw * 0.18, 260)}px`;
    el.style.backgroundImage = `url(${item.thumb || ''})`;

    const x = Math.random() * (vw - padX * 2 - 260) + padX;
    const y = Math.random() * (vh - padY * 2 - 260) + padY;
    el.style.left = `${x}px`; el.style.top = `${y}px`;

    const lb = document.createElement('div');
    lb.className = 'label'; lb.textContent = 'LEGEND'; el.appendChild(lb);

    el.addEventListener('click', (e) => {
      e.preventDefault();
      openImmortals();
      IMM_VIEW = legends.slice();
      const idx = IMM_VIEW.findIndex(x => x.id === item.id);
      openImmDetailByIndex(Math.max(0, idx));
    });

    DOM.stage.appendChild(el);
  });
}

// ====== Character Modal ======
// ====== Character Modal ======
let _charAutoTimer = null;

function openCharModal(id) {
  trackEvent('모달', '열기', `Character: ${id}`);
  const d = LEGEND_DESC[id];
  if (d) {
    DOM.charLegend.innerHTML = `<div class="en">${d.en}</div><div class="ko">${d.ko}</div>`;
    DOM.charLegend.style.display = 'block';
  } else {
    DOM.charLegend.style.display = 'none';
  }

  DOM.charHero.loop = true;
  DOM.charHero.src = CHAR_HERO[id] || '';
  DOM.charHero.currentTime = 0;
  DOM.charHero.onerror = () => {
    DOM.charHero.replaceWith(document.createElement('div')).textContent = '비디오를 불러올 수 없습니다';
  };
  DOM.charHero.play().catch(() => {});

  DOM.charStrip.innerHTML = '';
  const clips = CHAR_CLIPS[id] || [];
  if (!clips.length) {
    DOM.charStrip.innerHTML = '<div style="color:#9aa0a6; padding:10px;">아직 클립이 없습니다.</div>';
  } else {
    clips.forEach((item, idx) => {
      const b = document.createElement('button');
      b.className = 'char-thumb';
      b.innerHTML = `<img src="${item.thumb}" alt="" loading="lazy">`;
      b.onclick = () => {
        stopCharAuto();
        playCharClip(id, idx);
        setAutoBtn(false);
      };
      DOM.charStrip.appendChild(b);
    });
  }

  DOM.charCaption.textContent = id ? id.toUpperCase() + ' — LOOP' : '';
  setAutoBtn(true);
  startCharAuto(id);
  DOM.charModal.hidden = false;
}

function playCharClip(id, idx) {
  const clips = CHAR_CLIPS[id] || [];
  const item = clips[idx];
  if (!item) return;
  DOM.charHero.loop = false;
  DOM.charHero.src = item.src;
  DOM.charHero.currentTime = 0;
  DOM.charHero.play().catch(() => {});
  DOM.charCaption.textContent = `${id.toUpperCase()} — ${item.cap || 'LOOP'}`;
}

function startCharAuto(id) {
  stopCharAuto();
  const clips = CHAR_CLIPS[id] || [];
  if (!clips.length) {
    DOM.charHero.loop = true;
    return;
  }
  let i = 0;
  const playIdx = (k) => {
    playCharClip(id, k);
    const onEnded = () => {
      DOM.charHero.removeEventListener('ended', onEnded);
      i = (k + 1) % clips.length;
      playIdx(i);
    };
    DOM.charHero.addEventListener('ended', onEnded);
    _charAutoTimer = setTimeout(() => {
      DOM.charHero.removeEventListener('ended', onEnded);
      i = (k + 1) % clips.length;
      playIdx(i);
    }, 15500);
  };
  playIdx(0);
}

function stopCharAuto() {
  if (_charAutoTimer) { clearTimeout(_charAutoTimer); _charAutoTimer = null; }
  DOM.charHero.loop = true;
}

function setAutoBtn(on) {
  DOM.charAutoBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
  DOM.charAutoBtn.textContent = on ? 'AUTO ON' : 'AUTO OFF';
}

DOM.charAutoBtn?.addEventListener('click', () => {
  const on = DOM.charAutoBtn.getAttribute('aria-pressed') === 'true';
  if (on) { stopCharAuto(); setAutoBtn(false); }
  else { startCharAuto(getOpenCharId()); setAutoBtn(true); }
});

function getOpenCharId() {
  const txt = DOM.charCaption.textContent || '';
  const id = (txt.split('—')[0] || '').trim().toLowerCase();
  if (id && PORTALS.find(p => p.id === id)) return id;
  return PORTALS[0].id;
}

DOM.charModal?.addEventListener('click', (e) => { if (e.target.hasAttribute('data-close')) closeCharModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !DOM.charModal.hidden) closeCharModal(); });
function closeCharModal() { stopCharAuto(); DOM.charModal.hidden = true; DOM.charHero.pause(); DOM.charHero.src = ''; }

// ====== Immortals ======
async function openImmortals() {
  DOM.immModal.classList.add('modal-loading');
  renderImmGrid(IMM_LIST);
  DOM.immModal.classList.remove('modal-loading');
  DOM.immModal.hidden = false;
}

function renderImmGrid(list) {
  DOM.immGrid.innerHTML = '';
  if (!Array.isArray(list) || !list.length) {
    const empty = document.createElement('div');
    empty.style.color = '#9aa0a6';
    empty.textContent = 'No items yet.';
    DOM.immGrid.appendChild(empty);
    return;
  }
  list.forEach((item, idx) => {
    const cell = document.createElement('div');
    cell.className = 'imm-cell';
    const thumb = item.thumb || '';
    cell.innerHTML = `<img src="${thumb}" alt="${item.title || ''}" loading="lazy">`;
    cell.onclick = () => {
      IMM_VIEW = list.slice();
      openImmDetailByIndex(idx);
    };
    DOM.immGrid.appendChild(cell);
  });
}

function openImmDetailByIndex(i) {
  if (!IMM_VIEW.length) return;
  IMM_CUR = (i + IMM_VIEW.length) % IMM_VIEW.length;
  const it = IMM_VIEW[IMM_CUR];
  DOM.immTitle.textContent = it.title || '';
  DOM.immDesc.textContent = it.desc || '';
  const lg = LEGEND_DESC[(it.archetype || '').toLowerCase()];
  if (lg) { DOM.immLegend.innerHTML = `<div class="en">${lg.en}</div><div class="ko">${lg.ko}</div>`; DOM.immLegend.style.display = 'block'; }
  else { DOM.immLegend.style.display = 'none'; }
  DOM.immVideo.src = it.video || '';
  DOM.immVideo.currentTime = 0;
  DOM.immVideo.onerror = () => {
    DOM.immVideo.replaceWith(document.createElement('div')).textContent = '비디오를 불러올 수 없습니다';
  };
  DOM.immVideo.play().catch(() => {});
  DOM.immIndex.textContent = `${IMM_CUR + 1} / ${IMM_VIEW.length}`;
  DOM.immDModal.hidden = false;
}

DOM.immPrev?.addEventListener('click', () => openImmDetailByIndex(IMM_CUR - 1));
DOM.immNext?.addEventListener('click', () => openImmDetailByIndex(IMM_CUR + 1));
DOM.immModal?.addEventListener('click', (e) => { if (e.target.hasAttribute('data-close')) DOM.immModal.hidden = true; });
DOM.immDModal?.addEventListener('click', (e) => { if (e.target.hasAttribute('data-close')) { DOM.immVideo.pause(); DOM.immDModal.hidden = true; } });

// ====== Archive ======
function openArchive() {
  DOM.arcGrid.innerHTML = '';
  if (!ARCHIVE_FILES.length) {
    const empty = document.createElement('div');
    empty.style.color = '#9aa0a6'; empty.textContent = 'No archive yet.';
    DOM.arcGrid.appendChild(empty);
  } else {
    ARCHIVE_FILES.forEach(src => {
      const isVideo = /\.mp4$/i.test(src);
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.innerHTML = isVideo
        ? `<video src="${src}" muted loop playsinline loading="lazy"></video>`
        : `<img src="${src}" alt="" loading="lazy">`;
      cell.onclick = () => window.open(src, '_blank', 'noopener');
      DOM.arcGrid.appendChild(cell);
    });
  }
  DOM.arcModal.hidden = false;
}
DOM.arcModal?.addEventListener('click', (e) => { if (e.target.hasAttribute('data-close')) DOM.arcModal.hidden = true; });

// ====== Audio ======
let A = null, queue = [], now = -1, playing = false;

function startOST() {
  if (!OST_TRACKS.length) { return; }
  A = new Audio(); A.preload = 'auto'; A.crossOrigin = 'anonymous';
  A.volume = parseFloat(DOM.vol.value);
  A.addEventListener('ended', nextTrack);

  queue = OST_TRACKS.slice();
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }
  const first = !localStorage.getItem('motto_first_visit');
  localStorage.setItem('motto_first_visit', '1');
  if (first) {
    const idx = queue.findIndex(t => (t.title || '').toLowerCase() === 'motto');
    if (idx > 0) { [queue[0], queue[idx]] = [queue[idx], queue[0]]; }
  }
  now = -1;
  nextTrack();

  DOM.playBtn.onclick = togglePlay;
  DOM.prevBtn.onclick = prevTrack;
  DOM.nextBtn.onclick = nextTrack;
  DOM.vol.oninput = () => { if (A) A.volume = parseFloat(DOM.vol.value); };
  DOM.muteBtn.onclick = () => {
    if (!A) return;
    A.muted = !A.muted;
    DOM.muteBtn.textContent = A.muted ? '🔇' : '🔊';
  };
}

function loadTrack(i) {
  now = (i + queue.length) % queue.length;
  const meta = queue[now];
  if (!A) return;
  A.src = meta.url; A.currentTime = 0;
  A.play().then(() => {
    playing = true; updateNow(meta); updatePlayBtn();
  }).catch(() => {
    playing = false; updatePlayBtn();
    DOM.nowUI.textContent = '탭하여 오디오 시작';
    DOM.nowUI.onclick = () => loadTrack(now);
  });
}

function nextTrack() { loadTrack(now + 1); }
function prevTrack() { loadTrack(now - 1); }
function togglePlay() {
  if (!A) return;
  if (playing) { A.pause(); playing = false; }
  else { A.play().then(() => playing = true).catch(() => playing = false); }
  updatePlayBtn();
}
function updatePlayBtn() { DOM.playBtn.textContent = playing ? '⏸' : '▶︎'; }
function updateNow(meta) {
  const p = PORTALS.find(pp => pp.id === (meta.who || '')); 
  const icon = p?.emo || '♪';
  DOM.nowUI.textContent = `Now Playing: [${icon} ${meta.title || ''}]`;
}

function trackEvent(category, action, label) {
  console.log(`[분석] ${category}: ${action} - ${label}`);
}

DOM.homeBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  [...document.querySelectorAll('.modal')].forEach(m => m.hidden = true);
  spawnPortals(); if (SHOW_LEGEND_PINS) spawnLegendPins();
});

DOM.immBtn?.addEventListener('click', (e) => { e.preventDefault(); openImmortals(); });
DOM.arcBtn?.addEventListener('click', (e) => { e.preventDefault(); openArchive(); });

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && DOM.intro && DOM.intro.style.display !== 'none') { DOM.enterBtn?.click(); }
  if (e.key === 'Escape') {
    if (!DOM.charModal.hidden) closeCharModal();
    if (!DOM.immModal.hidden) DOM.immModal.hidden = true;
    if (!DOM.immDModal.hidden) { DOM.immVideo.pause(); DOM.immDModal.hidden = true; }
    if (!DOM.arcModal.hidden) DOM.arcModal.hidden = true;
  }
});

