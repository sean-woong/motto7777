// ====== DEV TOGGLES ======
const ENABLE_AUDIO = true;
const SHOW_LEGEND_PINS = false;
const LEGEND_PIN_COUNT = 1;
const DUR_SHORT = 120;
const DUR_MEDIUM = 240;
const DUR_LONG = 480;

// ====== External Links ======
const SPOTIFY_URL = '#';
const YOUTUBE_URL = '#';
const SHOP_URL = '#';
const TWITTER_URL = 'https://x.com/motto_7777';
const IG_URL = '#';
const TT_URL = '#';

// ====== Data Sources ======
const IMM_DATA_URL = (() => {
  try {
    const base = document.baseURI || window.location.href;
    return new URL('assets/data/immortals.json', base).href;
  } catch (err) {
    console.warn('Failed to resolve Immortals data URL, falling back to relative path.', err);
    return 'assets/data/immortals.json';
  }
})();

let IMM_LIST = [];
let IMM_TAG_OPTIONS = [];
let immDataPromise = null;
let immDataError = null;

// ====== Portals ======
const PORTALS = [
  { id: 'dealer', label: 'DEALER', img: 'assets/images/dealer.gif', emo: '🎲' },
  { id: 'skull', label: 'SKULL', img: 'assets/images/skull.gif', emo: '💀' },
  { id: 'rockstar', label: 'ROCKSTAR', img: 'assets/images/rockstar.gif', emo: '🎸' },
  { id: 'drag', label: 'DRAG', img: 'assets/images/drag.gif', emo: '👑' },
  { id: 'military', label: 'MILITARY', img: 'assets/images/military.gif', emo: '🪖' },
  { id: 'motorcycle', label: 'MOTORCYCLE', img: 'assets/images/motorcycle.gif', emo: '🏍️' },
  { id: 'boxer', label: 'BOXER', img: 'assets/images/boxer.gif', emo: '🥊' },
  { id: 'kia', label: 'KIA', img: 'assets/images/KIA.gif', emo: '🚗' }
];

// ====== Character Hero Videos ======
const CHAR_HERO = {
  dealer: 'assets/video/dealer.mp4',
  skull: 'assets/video/skull.mp4',
  rockstar: 'assets/video/rockstar.mp4',
  drag: 'assets/video/drag.mp4',
  military: 'assets/video/military.mp4',
  motorcycle: 'assets/video/motorcycle.mp4',
  boxer: 'assets/video/boxer.mp4',
  kia: 'assets/video/KIA.mp4'
};

// ====== Character Clips ======
const CHAR_CLIPS = {
  dealer: [],
  skull: [],
  rockstar: [],
  drag: [],
  military: [],
  motorcycle: [],
  boxer: [],
  kia: []
};

function getPortalById(id) {
  return PORTALS.find(p => p.id === id);
}

function deriveVideoPath(id) {
  const portal = getPortalById(id);
  if (!portal) {
    return CHAR_HERO[id] || `assets/video/${id}.mp4`;
  }
  if (portal.img) {
    return portal.img
      .replace('/images/', '/video/')
      .replace(/\.gif$/i, '.mp4');
  }
  return CHAR_HERO[id] || `assets/video/${id}.mp4`;
}

function formatTagList(tags, opts = {}) {
  if (!Array.isArray(tags) || !tags.length) return '';
  const { hash = false, joiner = ' · ' } = opts;
  const cleaned = tags
    .map((tag) => (tag || '').toString().trim())
    .filter(Boolean)
    .map((tag) => `${hash ? '#' : ''}${tag.toUpperCase()}`);
  return cleaned.join(joiner);
}

function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  const dt = new Date(dateStr);
  if (Number.isNaN(dt.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(dt);
}

function resolveAssetPath(input) {
  if (input === undefined || input === null) return '';
  const raw = `${input}`.trim();
  if (!raw) return '';

  const isAbsolute = /^(?:https?:|data:|blob:|\/\/)/i.test(raw);
  const hasWhitespace = /\s/.test(raw);

  if (isAbsolute) {
    if (!hasWhitespace) return raw;
    return raw.replace(/\s+/g, (match) => encodeURIComponent(match));
  }

  const encoded = hasWhitespace
    ? raw.split('/').map((segment) => (segment ? encodeURIComponent(segment) : segment)).join('/')
    : raw;
  try {
    return new URL(encoded, document.baseURI || window.location.href).href;
  } catch (err) {
    console.warn('Failed to resolve asset path:', raw, err);
    return encoded;
  }
}

function stripBom(input) {
  if (!input) return '';
  return input.charCodeAt(0) === 0xFEFF ? input.slice(1) : input;
}

function tryParseJson(text) {
  try {
    return { value: JSON.parse(text), error: null };
  } catch (err) {
    return { value: null, error: err };
  }
}

function parseImmortalsPayload(rawText) {
  const trimmed = stripBom((rawText || '').trim());
  if (!trimmed) return [];

  const direct = tryParseJson(trimmed);
  if (!direct.error) {
    return direct.value;
  }

  const wrappedText = `[${trimmed.replace(/\,\s*$/, '')}]`;
  const wrapped = tryParseJson(wrappedText);
  if (!wrapped.error) {
    console.warn('Immortals payload wrapped as array for parsing compatibility.');
    return wrapped.value;
  }

  const looseObjects = splitLooseJsonObjects(trimmed);
  if (looseObjects.length) {
    const parsed = [];
    for (let i = 0; i < looseObjects.length; i += 1) {
      const chunk = looseObjects[i].trim().replace(/\,\s*$/, '');
      if (!chunk) continue;
      const result = tryParseJson(chunk);
      if (result.error) {
        console.error(`Failed to parse Immortal entry #${i + 1}:`, result.error);
        throw result.error;
      }
      parsed.push(result.value);
    }
    if (parsed.length) {
      console.warn('Immortals payload parsed via loose object fallback.');
      return parsed;
    }
  }

  const originalError = direct.error || wrapped.error;
  throw originalError || new Error('Unable to parse Immortals payload.');
}

function splitLooseJsonObjects(text) {
  const objects = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escaping = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];

    if (inString) {
      if (escaping) {
        escaping = false;
      } else if (ch === '\\') {
        escaping = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === '{') {
      if (depth === 0) {
        start = i;
      }
      depth += 1;
    } else if (ch === '}') {
      if (depth > 0) depth -= 1;
      if (depth === 0 && start !== -1) {
        objects.push(text.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return objects;
}

function sanitizeImmTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags
      .map(tag => (tag || '').toString().trim())
      .filter(Boolean);
  }
  if (typeof tags === 'string') {
    const parts = tags.split(/[,#]/);
    return parts
      .map(part => part.trim())
      .filter(Boolean);
  }
  return [];
}

function buildImmTagOptions(list) {
  const tagMap = new Map();
  list.forEach((item) => {
    sanitizeImmTags(item.tags).forEach((tag) => {
      const key = tag.toLowerCase();
      if (!tagMap.has(key)) {
        tagMap.set(key, tag);
      }
    });
  });
  return Array.from(tagMap.entries())
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function pickFirstEntryField(entry, fields) {
  for (let i = 0; i < fields.length; i += 1) {
    const key = fields[i];
    if (key in entry && entry[key] !== undefined && entry[key] !== null) {
      const val = entry[key];
      if (Array.isArray(val)) {
        if (val.length) return val;
        continue;
      }
      const str = `${val}`.trim();
      if (str) return str;
    }
  }
  return '';
}

function sanitizeImmEntry(raw, index) {
  const source = (raw && typeof raw === 'object') ? raw : {};
  const entry = { ...source };
  const fallbackId = `imm_${index + 1}`;
  entry.id = pickFirstEntryField(entry, ['id', 'slug', 'uid']) || fallbackId;
  entry.archetype = (pickFirstEntryField(entry, ['archetype', 'type', 'category']) || '').toLowerCase();

  const titleEn = pickFirstEntryField(entry, ['title_en', 'titleEn', 'name_en', 'nameEn']);
  const titleKo = pickFirstEntryField(entry, ['title_ko', 'titleKo', 'name_ko', 'nameKo']);
  const genericTitle = pickFirstEntryField(entry, ['title', 'name', 'label']);
  entry.title_en = titleEn || '';
  entry.title_ko = titleKo || '';
  entry.title = genericTitle || titleEn || titleKo || entry.id;

  let descEn = pickFirstEntryField(entry, ['desc_en', 'description_en', 'summary_en', 'descEn']);
  let descKo = pickFirstEntryField(entry, ['desc_ko', 'description_ko', 'summary_ko', 'descKo']);
  const descriptionObj = entry.description || entry.descriptions;
  if (descriptionObj && typeof descriptionObj === 'object') {
    if (!descEn && descriptionObj.en !== undefined) {
      descEn = `${descriptionObj.en}`.trim();
    }
    const koText = descriptionObj.ko ?? descriptionObj.kr ?? descriptionObj['ko-KR'];
    if (!descKo && koText !== undefined) {
      descKo = `${koText}`.trim();
    }
    if (!descEn && Array.isArray(descriptionObj)) {
      descEn = `${descriptionObj[0] || ''}`.trim();
    }
  }
  const unifiedDesc = pickFirstEntryField(entry, ['desc', 'description', 'summary']);
  entry.desc_en = descEn || '';
  entry.desc_ko = descKo || '';
  if (unifiedDesc) {
    entry.desc = unifiedDesc;
  } else {
    const parts = [descEn, descKo].filter(Boolean);
    entry.desc = parts.join('\n');
  }

  const legendEn = pickFirstEntryField(entry, ['legend_en', 'legendEn']);
  const legendKo = pickFirstEntryField(entry, ['legend_ko', 'legendKo']);
  if (legendEn || legendKo) {
    entry.legend = entry.legend || {};
    if (typeof entry.legend !== 'object' || entry.legend === null || Array.isArray(entry.legend)) {
      entry.legend = { value: entry.legend };
    }
    if (legendEn) entry.legend_en = legendEn;
    if (legendKo) entry.legend_ko = legendKo;
  }

  const thumbPath = pickFirstEntryField(entry, ['thumb', 'thumbnail', 'thumb_url', 'thumbUrl', 'preview', 'image', 'gif']);
  const videoPath = pickFirstEntryField(entry, ['video', 'video_url', 'videoUrl', 'mp4', 'src', 'media']);
  entry.thumb = resolveAssetPath(thumbPath || entry.thumb || '');
  entry.video = resolveAssetPath(videoPath || entry.video || '');

  const createdAt = pickFirstEntryField(entry, ['created_date', 'createdDate', 'release', 'date', 'released_at', 'released']);
  entry.created_date = createdAt || entry.created_date || '';

  entry.tags = sanitizeImmTags(entry.tags || entry.tag || entry.labels || entry.categories);
  if (!entry.tags.length && entry.archetype) {
    entry.tags = [entry.archetype];
  }
  return entry;
}

function extractImmortalsArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const candidates = ['immortals', 'items', 'data', 'list'];
    for (let i = 0; i < candidates.length; i += 1) {
      const key = candidates[i];
      if (Array.isArray(payload[key])) {
        return payload[key];
      }
    }
  }
  return [];
}

function rebuildImmCaches(list) {
  IMM_LIST = list.slice();
  IMM_TAG_OPTIONS = buildImmTagOptions(IMM_LIST);
}

async function ensureImmortalsData() {
  if (immDataPromise) return immDataPromise;
  immDataPromise = fetch(IMM_DATA_URL, { credentials: 'same-origin' })
    .then((resp) => {
      if (!resp.ok) {
        throw new Error(`Failed to load immortals.json (${resp.status})`);
      }
      return resp.text();
    })
    .then((payload) => {
      const parsed = parseImmortalsPayload(payload);
      const list = extractImmortalsArray(parsed).map(sanitizeImmEntry);
      rebuildImmCaches(list);
      const validTags = new Set(IMM_TAG_OPTIONS.map(opt => opt.key));
      IMM_FILTER_TAGS.forEach((tag) => {
        if (!validTags.has(tag)) {
          IMM_FILTER_TAGS.delete(tag);
        }
      });
      immDataError = null;
      if (_immFiltersInitialized) {
        renderImmTagFilters();
        updateImmFilterUI();
      }
      return IMM_LIST;
    })
    .catch((err) => {
      immDataError = err;
      console.error('Immortals data load failed:', err);
      rebuildImmCaches([]);
      if (_immFiltersInitialized) {
        renderImmTagFilters();
        updateImmFilterUI();
      }
      return [];
    });
  return immDataPromise;
}

// ====== Legend Descriptions ======
const LEGEND_DESC = {
  dealer: { en: "Dealer — Loop Glitch · Fumes bleed.", ko: "딜러 — 루프 글리치 · 연기가 스며든다." },
  skull: { en: "Skull — Fragment Protocol · Sparks ignite.", ko: "스컬 — 프래그먼트 프로토콜 · 스파크가 튄다." },
  rockstar: { en: "Rockstar — Stall Stage · Smile stalls.", ko: "록스타 — 스톨 스테이지 · 미소가 멈춘다." },
  drag: { en: "Drag — Recode Glam · Everything screams.", ko: "드랙 — 리코드 글램 · 모든 것이 비명한다." },
  military: { en: "Military — Reload Combat · Target locked.", ko: "밀리터리 — 리로드 컴뱃 · 조준이 고정된다." },
  boxer: { en: "Boxer — Loop Fight · Bell rings.", ko: "복서 — 루프 파이트 · 종이 울린다." },
  motorcycle: { en: "Motorcycle — Skid Speed · Veins pulse.", ko: "모터사이클 — 스키드 스피드 · 맥박이 뛴다." },
  kia: { en: "KIA — Memory Drive · Neon traces linger.", ko: "기아 — 메모리 드라이브 · 네온 잔상이 남는다." }
};

// ====== OST Tracks ======
const OST_TRACKS = [
  { title: 'Doomsday', url: 'assets/audio/doomsday.mp3', who: 'military' },
  { title: 'Motto', url: 'assets/audio/motto.mp3', who: 'motorcycle' },
  { title: 'Drag', url: 'assets/audio/drag.mp3', who: 'drag' },
  { title: '7777 (Get Lo)', url: 'assets/audio/7777_getlo.mp3', who: 'boxer' },
  { title: 'DNA Ferrari', url: 'assets/audio/dna_ferrari.mp3', who: 'rockstar' },
  { title: 'Break', url: 'assets/audio/break.mp3', who: 'dealer' },
  { title: 'Close Encounter', url: 'assets/audio/close_encounter.mp3', who: 'skull' }
];

// ====== Archive Files ======
const ARCHIVE_FILES = [
  { src: 'assets/archive/KIA.mp4', title: 'KIA — Performance Snippet' },
  { src: 'assets/archive/List.jpg', title: 'Immortals Checklist' },
  { src: 'assets/archive/Logo_motto%203.jpg', title: 'MOTTO Logo Treatments' },
  { src: 'assets/archive/Track_list%202.jpg', title: 'Track List Draft' },
  { src: 'assets/archive/track_list.jpg', title: 'Track List Final' }
];

// ====== DOM Cache ======
const DOM = {
  intro: document.getElementById('intro'),
  introClip: document.getElementById('introClip'),
  enterBtn: document.getElementById('enterBtn'),
  stage: document.getElementById('stage'),
  egg1: document.getElementById('egg1'),
  egg2: document.getElementById('egg2'),
  audioUI: document.getElementById('audio-ui'),
  nowText: document.getElementById('nowText'),
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
  immSearch: document.getElementById('immSearch'),
  immTagFilters: document.getElementById('immTagFilters'),
  immCount: document.getElementById('immCount'),
  immClearFilters: document.getElementById('immClearFilters'),
  immLegend: document.getElementById('immLegend'),
  immTitle: document.getElementById('immTitle'),
  immVideo: document.getElementById('immVideo'),
  immMeta: document.getElementById('immMeta'),
  immTags: document.getElementById('immTags'),
  immDate: document.getElementById('immDate'),
  immDesc: document.getElementById('immDesc'),
  immPrev: document.getElementById('immPrev'),
  immNext: document.getElementById('immNext'),
  immIndex: document.getElementById('immIndex'),
  arcModal: document.getElementById('archiveModal'),
  arcGrid: document.getElementById('archiveGrid'),
  arcDetail: document.getElementById('archiveDetail'),
  arcDetailMedia: document.getElementById('archiveDetailMedia'),
  arcDetailCaption: document.getElementById('archiveDetailCaption')
};

const MODALS = [DOM.charModal, DOM.immModal, DOM.immDModal, DOM.arcModal];

MODALS.forEach((el) => {
  if (!el) return;
  if (el.hasAttribute('hidden')) el.removeAttribute('hidden');
  el.classList.add('hidden');
  el.classList.remove('active');
});

function activateModal(el) {
  if (!el) return;
  if (el._hideTimer) {
    clearTimeout(el._hideTimer);
    el._hideTimer = null;
  }
  el.classList.remove('hidden');
  requestAnimationFrame(() => el.classList.add('active'));
}

function deactivateModal(el) {
  if (!el) return;
  const wasActive = el.classList.contains('active');
  el.classList.remove('active');
  if (el._hideTimer) {
    clearTimeout(el._hideTimer);
    el._hideTimer = null;
  }
  if (wasActive) {
    el._hideTimer = setTimeout(() => {
      el.classList.add('hidden');
      el._hideTimer = null;
      updateBackdropState();
    }, DUR_MEDIUM);
  } else {
    el.classList.add('hidden');
    updateBackdropState();
  }
}

function isModalActive(el) {
  if (!el) return false;
  if (el.classList.contains('active')) return true;
  return !el.classList.contains('hidden');
}

function updateBackdropState() {
  const anyOpen = MODALS.some(isModalActive);
  document.body.classList.toggle('modal-open', anyOpen);
  const hideStage = [DOM.immModal, DOM.immDModal, DOM.arcModal].some(isModalActive);
  if (DOM.stage) {
    DOM.stage.classList.toggle('hidden', hideStage);
  }
}

function closeModal(modal, opts = {}) {
  if (!modal) return;
  if (modal === DOM.charModal) {
    closeCharModal();
    return;
  }
  if (modal === DOM.immDModal) {
    closeImmDetailModal({ reopenImm: opts.reopenImm });
    return;
  }
  if (modal === DOM.arcModal) {
    closeArchiveDetail();
    deactivateModal(modal);
    return;
  }
  deactivateModal(modal);
}

function openModal(target, opts = {}) {
  if (!target) return;
  const skipItems = Array.isArray(opts.skip)
    ? opts.skip
    : opts.skip
      ? [opts.skip]
      : [];
  const skipSet = new Set(skipItems);
  skipSet.add(target);

  MODALS.forEach((modal) => {
    if (!modal || skipSet.has(modal) || !isModalActive(modal)) return;
    closeModal(modal, { reopenImm: false });
  });

  if (!isModalActive(target)) {
    activateModal(target);
  } else if (target.classList.contains('hidden')) {
    activateModal(target);
  } else {
    target.classList.add('active');
  }

  updateBackdropState();
}

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

// ====== Debounce ======
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// ====== Intro → Main ======
DOM.enterBtn?.addEventListener('click', () => {
  console.log("ENTER 버튼 클릭됨 ✅");
  DOM.enterBtn.disabled = true;
  DOM.enterBtn.setAttribute('aria-busy', 'true');

  const finalizeBoot = () => {
    console.log("bootMain 실행 직전 ✅");
    try {
      bootMain();
      console.log("bootMain 실행 완료 ✅");
    } catch (err) {
      console.error("bootMain 실행 오류:", err);
    }
  };

  if (DOM.intro) {
    DOM.intro.classList.add('intro--exit');
  }

  setTimeout(() => {
    if (DOM.intro) {
      DOM.intro.style.display = 'none';
    }

    if (DOM.introClip) {
      DOM.introClip.hidden = false;
      requestAnimationFrame(() => DOM.introClip.classList.add('intro-clip--active'));

      const clipVisibleMs = 2200;
      setTimeout(() => {
        DOM.introClip.classList.remove('intro-clip--active');
        setTimeout(() => {
          DOM.introClip.hidden = true;
          finalizeBoot();
        }, DUR_LONG);
      }, clipVisibleMs);
    } else {
      finalizeBoot();
    }
  }, DUR_LONG);
});

// ====== Boot Main ======
function bootMain() {
  console.log("Booting main stage ✅");
  spawnPortals();
  requestAnimationFrame(() => {
    if (SHOW_LEGEND_PINS) spawnLegendPins();
    if (ENABLE_AUDIO) {
      DOM.audioUI.hidden = false;
      startOST();
    }
  });
}

let portalObserver = null;

function spawnPortals() {
  if (portalObserver) {
    portalObserver.disconnect();
    portalObserver = null;
  }

  DOM.stage.innerHTML = '';
  if (!PORTALS.length) return;

  const frag = document.createDocumentFragment();

  PORTALS.forEach((p, idx) => {
    const el = document.createElement('a');
    el.href = '#';
    el.className = 'portal';
    el.dataset.id = p.id;
    el.dataset.index = String(idx);

    const heroSrc = deriveVideoPath(p.id);
    if (heroSrc) {
      el.dataset.video = heroSrc;
    }
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `${p.label} 캐릭터 모달 열기`);

    const probe = new Image();
    probe.onload = () => {
      el.style.backgroundImage = `url(${p.img})`;
      if (heroSrc) {
        el.dataset.video = heroSrc;
      }
      console.log(`${p.label} GIF 로드 성공 ✅`);
    };
    probe.onerror = () => {
      el.classList.add('placeholder');
      console.error(`${p.label} GIF 로드 실패: ${p.img} 확인 필요 ❌`);
    };
    probe.src = p.img;

    const lb = document.createElement('div');
    lb.className = 'label';
    lb.textContent = p.label;
    el.appendChild(lb);

    el.addEventListener('click', (e) => {
      e.preventDefault();
      trackEvent('포털', '클릭', p.label);
      openCharModal(p.id);
    });

    frag.appendChild(el);
  });

  DOM.stage.appendChild(frag);
  const portals = DOM.stage.querySelectorAll('.portal');
  observePortals(portals);
}

function ensurePortalObserver() {
  if (!portalObserver) {
    portalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const node = entry.target;
          const idx = Number(node.dataset.index || '0');
          node.style.setProperty('--portal-delay', `${(idx * 0.06).toFixed(2)}s`);
          node.classList.add('portal-enter');
          portalObserver?.unobserve(node);
        }
      });
    }, { threshold: 0.35, rootMargin: '0px 0px -10% 0px' });
  }
  return portalObserver;
}

function observePortals(nodes) {
  const observer = ensurePortalObserver();
  nodes.forEach(node => observer.observe(node));
}
window.addEventListener('resize', debounce(() => {
  spawnPortals();
  if (SHOW_LEGEND_PINS) spawnLegendPins(true);
}, 200));

// ====== Legend Pins ======
let IMM_VIEW = [], IMM_CUR = -1;

function isLegendEnabled(legendField) {
  if (legendField === true) return true;
  if (!legendField || legendField === false) return false;
  if (typeof legendField === 'object' && !Array.isArray(legendField)) {
    if ('enabled' in legendField) {
      return Boolean(legendField.enabled);
    }
    return true;
  }
  return Boolean(legendField);
}

async function spawnLegendPins(resize = false) {
  await ensureImmortalsData();
  const legends = IMM_LIST.filter(x => isLegendEnabled(x.legend));
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

  const portalEl = DOM.stage?.querySelector(`.portal[data-id="${id}"]`);
  const heroSrc = portalEl?.dataset.video || deriveVideoPath(id);
  DOM.charHero.loop = true;
  DOM.charHero.src = heroSrc || '';
  DOM.charHero.currentTime = 0;
  DOM.charHero.onerror = () => {
    console.warn('비디오를 불러올 수 없습니다:', heroSrc);
    DOM.charCaption.textContent = `${id.toUpperCase()} — VIDEO NOT FOUND`;
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
  openModal(DOM.charModal);
  DOM.charModal.focus(); // 모달에 포커스 추가
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
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isModalActive(DOM.charModal)) closeCharModal(); });
function closeCharModal() {
  stopCharAuto();
  deactivateModal(DOM.charModal);
  DOM.charHero.pause();
  DOM.charHero.src = '';
}

// ====== Immortals ======
let _immDetailShouldReopenImmModal = false;
let _immFiltersInitialized = false;
let IMM_FILTER_TEXT = '';
const IMM_FILTER_TAGS = new Set();
const IMM_TAG_BUTTONS = new Map();

function renderImmTagFilters() {
  if (!DOM.immTagFilters) return;
  DOM.immTagFilters.innerHTML = '';
  IMM_TAG_BUTTONS.clear();

  if (!IMM_TAG_OPTIONS.length) {
    DOM.immTagFilters.hidden = true;
    return;
  }

  DOM.immTagFilters.hidden = false;
  IMM_TAG_OPTIONS.forEach(({ key, label }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'imm-tag-btn';
    btn.dataset.tag = key;
    btn.setAttribute('aria-pressed', IMM_FILTER_TAGS.has(key) ? 'true' : 'false');
    btn.textContent = `#${label.toUpperCase()}`;
    btn.addEventListener('click', () => {
      if (IMM_FILTER_TAGS.has(key)) {
        IMM_FILTER_TAGS.delete(key);
      } else {
        IMM_FILTER_TAGS.add(key);
      }
      applyImmortalFilters();
    });
    DOM.immTagFilters.appendChild(btn);
    IMM_TAG_BUTTONS.set(key, btn);
  });
}

function normalizeImmTag(tag) {
  return (tag || '').toString().trim().toLowerCase();
}

function isImmFilterActive() {
  return Boolean(IMM_FILTER_TEXT.trim()) || IMM_FILTER_TAGS.size > 0;
}

function updateImmFilterUI() {
  if (DOM.immSearch && DOM.immSearch.value !== IMM_FILTER_TEXT) {
    DOM.immSearch.value = IMM_FILTER_TEXT;
  }

  IMM_TAG_BUTTONS.forEach((btn, key) => {
    const active = IMM_FILTER_TAGS.has(key);
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  if (DOM.immClearFilters) {
    const hasFilters = isImmFilterActive();
    DOM.immClearFilters.hidden = !hasFilters;
    DOM.immClearFilters.disabled = !hasFilters;
  }
}

function updateImmCount(current, total) {
  if (!DOM.immCount) return;
  const hasFilters = isImmFilterActive();
  if (total === 0 && !hasFilters) {
    DOM.immCount.textContent = 'No Immortals yet';
    return;
  }
  const prefix = hasFilters ? `Showing ${current} of ${total}` : `Showing ${current}`;
  const suffix = current === 1 ? ' IMMORTAL' : ' IMMORTALS';
  DOM.immCount.textContent = `${prefix}${suffix}`;
}

function ensureImmFilterControls() {
  if (!_immFiltersInitialized) {
    if (DOM.immSearch) {
      DOM.immSearch.addEventListener('input', () => {
        IMM_FILTER_TEXT = DOM.immSearch.value;
        applyImmortalFilters();
      });
    }

    DOM.immClearFilters?.addEventListener('click', () => {
      if (!isImmFilterActive()) return;
      IMM_FILTER_TEXT = '';
      IMM_FILTER_TAGS.clear();
      applyImmortalFilters();
    });

    _immFiltersInitialized = true;
  }

  renderImmTagFilters();
  updateImmFilterUI();
}

async function openImmortals() {
  if (!DOM.immModal) return [];
  DOM.immModal.classList.add('modal-loading');
  await ensureImmortalsData();
  ensureImmFilterControls();
  const filtered = applyImmortalFilters();
  DOM.immModal.classList.remove('modal-loading');
  openModal(DOM.immModal);
  setTimeout(() => {
    if (isModalActive(DOM.immModal)) {
      DOM.immSearch?.focus({ preventScroll: true });
    }
  }, DUR_SHORT);
  return filtered;
}

function applyImmortalFilters() {
  const filtersActive = isImmFilterActive();
  const needle = IMM_FILTER_TEXT.trim().toLowerCase();

  if (!IMM_LIST.length) {
    const errorDetail = immDataError?.message || '';
    const emptyText = immDataError
      ? `Immortals data load failed. ${errorDetail}`.trim()
      : filtersActive
        ? 'No Immortals match the current filters.'
        : 'No Immortals yet.';
    renderImmGrid([], { emptyText });
    updateImmCount(0, IMM_LIST.length);
    updateImmFilterUI();
    return [];
  }

  const filtered = IMM_LIST.filter((item) => {
    if (!item) return false;

    if (needle) {
      const haystack = [
        item.title,
        item.desc,
        item.archetype,
        (item.tags || []).join(' ')
      ].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(needle)) {
        return false;
      }
    }

    if (IMM_FILTER_TAGS.size) {
      const tagSet = new Set((item.tags || []).map(normalizeImmTag));
      for (const activeTag of IMM_FILTER_TAGS) {
        if (!tagSet.has(activeTag)) {
          return false;
        }
      }
    }

    return true;
  });

  renderImmGrid(filtered, {
    emptyText: filtersActive
      ? 'No Immortals match the current filters. Try a different search or clear filters.'
      : 'No items yet.'
  });

  updateImmCount(filtered.length, IMM_LIST.length);
  updateImmFilterUI();
  return filtered;
}

function renderImmGrid(list, opts = {}) {
  if (!DOM.immGrid) return;
  DOM.immGrid.innerHTML = '';
  const emptyText = opts.emptyText || 'No items yet.';
  if (!Array.isArray(list) || !list.length) {
    const empty = document.createElement('div');
    empty.className = 'imm-empty';
    empty.textContent = emptyText;
    DOM.immGrid.appendChild(empty);
    return;
  }
  list.forEach((item, idx) => {
    const cell = document.createElement('div');
    cell.className = 'imm-cell';
    cell.setAttribute('role', 'button');
    cell.setAttribute('tabindex', '0');
    const thumb = resolveAssetPath(item.thumb || item.thumbnail || '');
    const overlayTags = formatTagList(item.tags);
    cell.innerHTML = `
      <img src="${thumb}" alt="${item.title || ''}" loading="lazy">
      <div class="imm-info">
        <strong>${item.title || ''}</strong>
        ${overlayTags ? `<span>${overlayTags}</span>` : ''}
      </div>`;
    if (item.title) {
      cell.setAttribute('aria-label', item.title);
    }
    cell.onclick = () => {
      IMM_VIEW = list.slice();
      openImmDetailByIndex(idx);
    };
    cell.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        cell.click();
      }
    });
    DOM.immGrid.appendChild(cell);
  });
}

function resolveEntryLegend(entry) {
  const legendField = entry.legend;
  const legendObj = (legendField && typeof legendField === 'object' && !Array.isArray(legendField))
    ? legendField
    : null;
  const en = entry.legend_en !== undefined ? entry.legend_en : legendObj?.en;
  const ko = entry.legend_ko !== undefined ? entry.legend_ko : legendObj?.ko;
  return { en, ko };
}

function buildLegendContent(entry) {
  const archetypeKey = (entry.archetype || '').toLowerCase();
  const fallback = LEGEND_DESC[archetypeKey] || {};
  const resolved = resolveEntryLegend(entry);
  const en = resolved.en !== undefined ? resolved.en : fallback.en;
  const ko = resolved.ko !== undefined ? resolved.ko : fallback.ko;
  const parts = [];
  if (en) parts.push(`<div class="en">${en}</div>`);
  if (ko) parts.push(`<div class="ko">${ko}</div>`);
  return parts.join('');
}

function renderImmDescription(entry) {
  if (!DOM.immDesc) return;
  const lines = [];
  if (entry.desc_en) lines.push(entry.desc_en);
  if (entry.desc_ko) lines.push(entry.desc_ko);
  if (!lines.length && entry.desc) lines.push(entry.desc);

  DOM.immDesc.innerHTML = '';

  if (!lines.length) {
    DOM.immDesc.hidden = true;
    return;
  }

  DOM.immDesc.hidden = false;
  lines.forEach((text, idx) => {
    const span = document.createElement('span');
    span.textContent = text;
    DOM.immDesc.appendChild(span);
    if (idx < lines.length - 1) {
      DOM.immDesc.appendChild(document.createElement('br'));
    }
  });
}

function openImmDetailByIndex(i) {
  if (!IMM_VIEW.length) return;
  IMM_CUR = (i + IMM_VIEW.length) % IMM_VIEW.length;
  const it = IMM_VIEW[IMM_CUR];
  if (isModalActive(DOM.immModal)) {
    _immDetailShouldReopenImmModal = true;
  }
  DOM.immTitle.textContent = it.title || '';
  renderImmDescription(it);
  if (DOM.immTags) {
    const tagsText = formatTagList(it.tags, { hash: true, joiner: ' ' });
    DOM.immTags.textContent = tagsText;
    DOM.immTags.hidden = !tagsText;
  }
  if (DOM.immDate) {
    const dateText = formatDateLabel(it.created_date);
    DOM.immDate.textContent = dateText ? `Released ${dateText}` : '';
    DOM.immDate.hidden = !dateText;
  }
  if (DOM.immMeta) {
    const metaVisible = Boolean((DOM.immTags && !DOM.immTags.hidden) || (DOM.immDate && !DOM.immDate.hidden));
    DOM.immMeta.hidden = !metaVisible;
  }
  if (DOM.immLegend) {
    const legendContent = buildLegendContent(it);
    if (legendContent) {
      DOM.immLegend.innerHTML = legendContent;
      DOM.immLegend.style.display = 'block';
    } else {
      DOM.immLegend.innerHTML = '';
      DOM.immLegend.style.display = 'none';
    }
  }
  if (DOM.immVideo) {
    if (it.video) {
      DOM.immVideo.hidden = false;
      DOM.immVideo.src = it.video;
      DOM.immVideo.currentTime = 0;
      DOM.immVideo.onerror = () => {
        console.warn('Immortal video missing:', it.video);
      };
      DOM.immVideo.play().catch(() => {});
    } else {
      DOM.immVideo.pause();
      DOM.immVideo.removeAttribute('src');
      DOM.immVideo.hidden = true;
    }
  }
  DOM.immIndex.textContent = `${IMM_CUR + 1} / ${IMM_VIEW.length}`;
  openModal(DOM.immDModal);
}

function closeImmDetailModal({ reopenImm } = {}) {
  if (!DOM.immDModal) return;
  if (DOM.immVideo) {
    DOM.immVideo.pause();
    DOM.immVideo.removeAttribute('src');
    DOM.immVideo.hidden = true;
  }
  deactivateModal(DOM.immDModal);
  const shouldReopen = typeof reopenImm === 'boolean'
    ? reopenImm
    : _immDetailShouldReopenImmModal;
  _immDetailShouldReopenImmModal = false;
  if (shouldReopen && DOM.immModal) {
    openModal(DOM.immModal, { skip: [DOM.immDModal] });
  }
}

DOM.immPrev?.addEventListener('click', () => openImmDetailByIndex(IMM_CUR - 1));
DOM.immNext?.addEventListener('click', () => openImmDetailByIndex(IMM_CUR + 1));
DOM.immModal?.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-close')) {
    closeModal(DOM.immModal);
    if (isModalActive(DOM.immDModal)) {
      closeImmDetailModal({ reopenImm: false });
    }
  }
});
DOM.immDModal?.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-close')) {
    closeImmDetailModal();
  }
});

// ====== Archive ======
function openArchive() {
  if (!DOM.arcGrid) return;
  closeArchiveDetail();
  DOM.arcGrid.innerHTML = '';
  if (!ARCHIVE_FILES.length) {
    const empty = document.createElement('div');
    empty.style.color = '#9aa0a6'; empty.textContent = 'No archive yet.';
    DOM.arcGrid.appendChild(empty);
  } else {
    ARCHIVE_FILES.forEach(entry => {
      const item = typeof entry === 'string' ? { src: entry } : entry;
      const src = resolveAssetPath(item.src);
      if (!src) return;
      const isVideo = /\.mp4(?:$|\?)/i.test(item.src || src);
      const cell = document.createElement('div');
      cell.className = 'cell';
      const media = isVideo
        ? `<video src="${src}" muted loop playsinline loading="lazy"></video>`
        : `<img src="${src}" alt="${item.title || ''}" loading="lazy">`;
      const caption = item.title ? `<div class="caption">${item.title}</div>` : '';
      cell.innerHTML = `${media}${caption}`;
      if (item.title) {
        cell.setAttribute('aria-label', item.title);
      }
      cell.onclick = () => openArchiveDetail(item);
      DOM.arcGrid.appendChild(cell);
    });
  }
  if (DOM.arcDetail) {
    DOM.arcDetail.classList.add('hidden');
  }
  DOM.arcGrid.classList.remove('hidden');
  openModal(DOM.arcModal);
}
DOM.arcModal?.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-close')) {
    if (e.target.classList.contains('modal-close') && DOM.arcDetail && !DOM.arcDetail.classList.contains('hidden')) {
      closeArchiveDetail();
      return;
    }
    closeModal(DOM.arcModal);
  }
});

// ====== Audio ======
let A = null, queue = [], now = -1, playing = false;
let pendingPlayHandler = null;

function startOST() {
  if (!OST_TRACKS.length) return;
  clearPendingPlayback();
  if (A) {
    A.pause();
    A.src = '';
    A = null;
  }
  A = new Audio();
  A.preload = 'auto';
  A.crossOrigin = 'anonymous';
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
    if (idx > 0) [queue[0], queue[idx]] = [queue[idx], queue[0]];
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
    updateMuteBtn();
  };
  updateMuteBtn();
}

function clearPendingPlayback() {
  if (pendingPlayHandler && DOM.audioUI) {
    DOM.audioUI.removeEventListener('click', pendingPlayHandler);
    pendingPlayHandler = null;
  }
  DOM.audioUI?.classList.remove('pending');
}

function setPendingPlayback() {
  if (!DOM.audioUI) return;
  clearPendingPlayback();
  DOM.audioUI.classList.add('pending');
  pendingPlayHandler = () => {
    clearPendingPlayback();
    loadTrack(now);
  };
  DOM.audioUI.addEventListener('click', pendingPlayHandler, { once: true });
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
    setNowLabel('탭하여 오디오 시작');
    setPendingPlayback();
  });
}

function nextTrack() { loadTrack(now + 1); }
function prevTrack() { loadTrack(now - 1); }
function togglePlay() {
  if (!A) return;
  if (playing) {
    A.pause();
    playing = false;
    updatePlayBtn();
    return;
  }

  playing = true;
  updatePlayBtn();
  A.play().then(() => {
    playing = true;
    updatePlayBtn();
  }).catch(() => {
    playing = false;
    updatePlayBtn();
    setPendingPlayback();
  });
}
function updatePlayBtn() {
  const icon = playing ? '⏸' : '▶︎';
  const span = DOM.playBtn?.querySelector('span');
  if (span) span.textContent = icon;
  if (DOM.playBtn) DOM.playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
}
function updateMuteBtn() {
  const muted = Boolean(A && A.muted);
  const span = DOM.muteBtn?.querySelector('span');
  if (span) span.textContent = muted ? '🔇' : '🔊';
  if (DOM.muteBtn) DOM.muteBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
}
function setNowLabel(text) {
  if (!DOM.nowText) return;
  DOM.nowText.classList.remove('marquee');
  DOM.nowText.textContent = text;
  void DOM.nowText.offsetWidth;
  requestAnimationFrame(() => {
    if (!DOM.nowText) return;
    if (DOM.nowText.scrollWidth > DOM.nowText.clientWidth + 2) {
      DOM.nowText.classList.add('marquee');
    }
  });
}
function updateNow(meta) {
  clearPendingPlayback();
  setNowLabel(meta.title || '—');
}

function trackEvent(category, action, label) {
  console.log(`[분석] ${category}: ${action} - ${label}`);
}

DOM.homeBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  closeArchiveDetail();
  document.querySelectorAll('.modal').forEach(mod => closeModal(mod, { reopenImm: false }));
  spawnPortals();
  if (SHOW_LEGEND_PINS) spawnLegendPins();
});

DOM.immBtn?.addEventListener('click', (e) => { e.preventDefault(); openImmortals(); });
DOM.arcBtn?.addEventListener('click', (e) => { e.preventDefault(); openArchive(); });

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && DOM.intro && DOM.intro.style.display !== 'none') { DOM.enterBtn?.click(); }
  if (e.key === 'Escape') {
    let closed = false;
    if (DOM.arcDetail && !DOM.arcDetail.classList.contains('hidden')) { closeArchiveDetail(); closed = true; }
    if (isModalActive(DOM.immDModal)) { closeModal(DOM.immDModal, { reopenImm: false }); closed = true; }
    if (isModalActive(DOM.immModal)) { closeModal(DOM.immModal); closed = true; }
    if (isModalActive(DOM.arcModal)) { closeModal(DOM.arcModal); closed = true; }
    if (isModalActive(DOM.charModal)) { closeModal(DOM.charModal); closed = true; }
  }
});
function openArchiveDetail(entry) {
  if (!DOM.arcDetail || !DOM.arcDetailMedia) return;
  const item = typeof entry === 'string' ? { src: entry } : entry;
  const src = resolveAssetPath(item?.src);
  if (!src) return;
  const isVideo = /\.mp4(?:$|\?)/i.test(item?.src || src);
  const mediaMarkup = isVideo
    ? `<video src="${src}" controls autoplay playsinline loop style="width:100%;max-height:70vh;object-fit:contain;background:#000;"></video>`
    : `<img src="${src}" alt="${item.title || ''}" loading="lazy" style="width:100%;max-height:70vh;object-fit:contain;background:#000;"/>`;
  DOM.arcDetailMedia.innerHTML = mediaMarkup;
  if (DOM.arcDetailCaption) {
    DOM.arcDetailCaption.textContent = item.title || '';
    DOM.arcDetailCaption.classList.toggle('hidden', !item.title);
  }
  DOM.arcGrid?.classList.add('hidden');
  DOM.arcDetail.classList.remove('hidden');
}

function closeArchiveDetail() {
  if (!DOM.arcDetail) return;
  const video = DOM.arcDetail.querySelector('video');
  if (video) video.pause();
  if (DOM.arcDetailMedia) {
    DOM.arcDetailMedia.innerHTML = '';
  }
  if (DOM.arcDetailCaption) {
    DOM.arcDetailCaption.textContent = '';
    DOM.arcDetailCaption.classList.remove('hidden');
  }
  DOM.arcDetail.classList.add('hidden');
  DOM.arcGrid?.classList.remove('hidden');
}

ensureImmortalsData().catch((err) => {
  console.error('Initial Immortals preload failed:', err);
});
