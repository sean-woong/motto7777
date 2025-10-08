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

const ARCHIVE_BACKDROP_CACHE = new Map();
function normalizeImmItem(item = {}) {
  const clone = { ...item };
  const tags = Array.isArray(clone.tags) ? clone.tags.slice() : [];
  const normalizedTags = [];
  const seen = new Set();

  tags.forEach((tag) => {
    const clean = (tag || '').toString().trim();
    if (!clean) return;
    const key = clean.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    normalizedTags.push(clean);
  });

  const legendActive = typeof isLegendEnabled === 'function'
    ? isLegendEnabled(clone.legend)
    : clone.legend === true;

  if (legendActive && !seen.has('legend')) {
    seen.add('legend');
    normalizedTags.push('legend');
  }

  if (typeof clone.legend !== 'object' || clone.legend === null) {
    clone.legend = legendActive;
  }
  clone.tags = normalizedTags;
  return clone;
}

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

  const encodeSpacesOnce = (value) => {
    // encode spaces only once
    return value.includes('%20') ? value : value.replace(/ /g, '%20');
  };

  const isAbsolute = /^(?:https?:|data:|blob:|\/\/)/i.test(raw);

  if (isAbsolute) {
    return encodeSpacesOnce(raw);
  }

  const cleaned = raw.replace(/^(?:\.\/)+/, '').replace(/^\/+/u, '');
  const encoded = encodeSpacesOnce(cleaned);

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


// ====== Media Utilities ======
function sampleAverageColor(drawable, width, height) {
  const SAMPLE_W = 32;
  const aspect = width && height ? height / width : 1;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  const sampleHeight = Math.max(1, Math.round(SAMPLE_W * aspect));
  canvas.width = SAMPLE_W;
  canvas.height = sampleHeight;
  ctx.drawImage(drawable, 0, 0, SAMPLE_W, sampleHeight);
  let r = 0;
  let g = 0;
  let b = 0;
  let total = 0;
  const data = ctx.getImageData(0, 0, SAMPLE_W, sampleHeight).data;
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] / 255;
    if (alpha <= 0) continue;
    r += data[i] * alpha;
    g += data[i + 1] * alpha;
    b += data[i + 2] * alpha;
    total += alpha;
  }
  if (!total) return null;
  return [
    Math.round(r / total),
    Math.round(g / total),
    Math.round(b / total)
  ];
}

function computeAverageColorFromImage(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    if (!/^data:/i.test(src)) {
      img.crossOrigin = 'anonymous';
    }
    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
    };
    const handleReady = () => {
      cleanup();
      try {
        const color = sampleAverageColor(img, img.naturalWidth || img.width, img.naturalHeight || img.height);
        resolve(color);
      } catch (err) {
        console.warn('Image sampling failed:', err);
        resolve(null);
      }
    };
    img.onload = handleReady;
    img.onerror = () => {
      cleanup();
      resolve(null);
    };
    img.src = src;
    if (img.complete && (img.naturalWidth || img.width)) {
      handleReady();
    }
  });
}

function computeAverageColorFromVideo(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const video = document.createElement('video');
    if (!/^data:/i.test(src)) {
      video.crossOrigin = 'anonymous';
    }
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    let settled = false;
    let timeoutId = null;
    const cleanup = () => {
      video.removeEventListener('loadeddata', handleLoaded);
      video.removeEventListener('error', handleError);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
    const settle = (color) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      cleanup();
      resolve(color);
    };
    const handleLoaded = () => {
      try {
        const color = sampleAverageColor(video, video.videoWidth || video.width, video.videoHeight || video.height);
        settle(color);
      } catch (err) {
        console.warn('Video sampling failed:', err);
        settle(null);
      }
    };
    const handleError = () => settle(null);
    video.addEventListener('loadeddata', handleLoaded, { once: true });
    video.addEventListener('error', handleError, { once: true });
    video.src = src;
    video.load();
    timeoutId = setTimeout(() => settle(null), 2000);
  });
}

function mixChannel(channel, target, weight) {
  return Math.max(0, Math.min(255, Math.round(channel + (target - channel) * weight)));
}

function lightenColor(rgb, weight = 0.3) {
  return rgb.map((channel) => mixChannel(channel, 255, weight));
}

function darkenColor(rgb, weight = 0.4) {
  return rgb.map((channel) => mixChannel(channel, 0, weight));
}

function toRgba(rgb, alpha = 1) {
  const [r, g, b] = rgb.map((channel) => Math.max(0, Math.min(255, Math.round(channel))));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function escapeCssUrl(input) {
  return (input || '').replace(/["\\]/g, '\\$&');
}

function buildArchiveBackdropValue(color, src) {
  const accent = lightenColor(color, 0.35);
  const shadow = darkenColor(color, 0.6);
  const gradient = `linear-gradient(125deg, ${toRgba(accent, 0.45)} 0%, ${toRgba(shadow, 0.94)} 100%)`;
  const imageLayer = src ? `, url("${escapeCssUrl(src)}") center / cover no-repeat` : '';
  return {
    imageValue: `${gradient}${imageLayer}`,
    accentValue: toRgba(accent, 0.55)
  };
}

function deriveArchiveBackdrop(src, { isVideo } = {}) {
  if (!src) return Promise.resolve(null);
  const key = `${isVideo ? 'v' : 'i'}:${src}`;
  if (ARCHIVE_BACKDROP_CACHE.has(key)) {
    const cached = ARCHIVE_BACKDROP_CACHE.get(key);
    return cached instanceof Promise ? cached : Promise.resolve(cached);
  }
  const loader = (isVideo ? computeAverageColorFromVideo(src) : computeAverageColorFromImage(src))
    .then((rgb) => {
      if (!rgb) {
        ARCHIVE_BACKDROP_CACHE.set(key, null);
        return null;
      }
      const values = buildArchiveBackdropValue(rgb, src);
      ARCHIVE_BACKDROP_CACHE.set(key, values);
      return values;
    })
    .catch((err) => {
      console.warn('Backdrop derive failed:', err);
      ARCHIVE_BACKDROP_CACHE.set(key, null);
      return null;
    });
  ARCHIVE_BACKDROP_CACHE.set(key, loader);
  return loader;
}

function applyArchiveBackdrop(container, { src, isVideo } = {}) {
  if (!container) return;
  const token = Symbol('backdrop');
  container._backdropToken = token;
  container.style.removeProperty('--archive-detail-image');
  container.style.removeProperty('--archive-detail-accent');
  if (!src) return;
  deriveArchiveBackdrop(src, { isVideo }).then((values) => {
    if (!values || container._backdropToken !== token) return;
    if (values.imageValue) {
      container.style.setProperty('--archive-detail-image', values.imageValue);
    }
    if (values.accentValue) {
      container.style.setProperty('--archive-detail-accent', values.accentValue);
    }
  });
}

function updateArchiveOrientation(container, mediaEl) {
  if (!container || !mediaEl) return;
  let width = 0;
  let height = 0;
  if (mediaEl.tagName === 'IMG') {
    width = mediaEl.naturalWidth || mediaEl.width;
    height = mediaEl.naturalHeight || mediaEl.height;
  } else if (mediaEl.tagName === 'VIDEO') {
    width = mediaEl.videoWidth || mediaEl.clientWidth;
    height = mediaEl.videoHeight || mediaEl.clientHeight;
  }
  if (!width || !height) return;
  const delta = Math.abs(width - height);
  const orientation = delta / Math.max(width, height) < 0.08
    ? 'square'
    : width > height
      ? 'landscape'
      : 'portrait';
  container.dataset.orientation = orientation;
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
  const normalized = Array.isArray(list) ? list.map(normalizeImmItem) : [];
  IMM_LIST = normalized;
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
  { src: 'assets/archive/track_list/List.jpg', title: 'Immortals Checklist' },
  { src: 'assets/archive/logo/Logo_motto_3.jpg', title: 'MOTTO Logo Treatments' },
  { src: 'assets/archive/track_list/Track_list 2.jpg', title: 'Track List Draft' },
  { src: 'assets/archive/track_list/track_list.jpg', title: 'Track List Final' }
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
  immVideoFallback: document.getElementById('immVideoFallback'),
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
  arcDetailGuide: document.getElementById('archiveDetailGuide'),
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

let _overlayQueue = Promise.resolve();

function playTransitionOverlay(callback, opts = {}) {
  const overlay = DOM.introClip;
  if (!overlay) {
    if (typeof callback === 'function') {
      try { callback(); } catch (err) { console.error('Transition callback failed:', err); }
    }
    return Promise.resolve();
  }
  const {
    duration = 1200,
    fade = DUR_MEDIUM,
    backgroundOpacity = 0.65,
    revealDelay = 260
  } = opts;
  const clampedOpacity = Math.max(0, Math.min(1, Number(backgroundOpacity) || 0));
  const totalDuration = Math.max(0, duration);
  const fadeDuration = Math.max(0, fade);
  const delay = Math.max(0, revealDelay);
  const img = overlay.querySelector('img');
  if (img && !img.dataset.originalSrc) {
    img.dataset.originalSrc = img.getAttribute('data-src') || img.src;
  }
  _overlayQueue = _overlayQueue.then(() => new Promise((resolve) => {
    if (img && img.dataset.originalSrc) {
      const original = img.dataset.originalSrc;
      img.src = '';
      void img.offsetWidth;
      img.src = original;
    }
    overlay.hidden = false;
    overlay.style.setProperty('--overlay-alpha', String(clampedOpacity));
    requestAnimationFrame(() => {
      overlay.classList.add('intro-clip--active');
      if (typeof callback === 'function') {
        setTimeout(() => {
          try {
            callback();
          } catch (err) {
            console.error('Transition callback failed:', err);
          }
        }, delay);
      }
    });
    setTimeout(() => {
      overlay.classList.remove('intro-clip--active');
      setTimeout(() => {
        overlay.hidden = true;
        resolve();
      }, fadeDuration);
    }, totalDuration);
  }));
  return _overlayQueue;
}

const NAV_OVERLAY_DEFAULTS = Object.freeze({
  duration: 1200,
  fade: DUR_MEDIUM,
  backgroundOpacity: 0.66,
  revealDelay: 240
});

// ====== Intro → Main ======
DOM.enterBtn?.addEventListener('click', () => {
  console.log("ENTER 버튼 클릭됨 ✅");
  DOM.enterBtn.disabled = true;
  DOM.enterBtn.setAttribute('aria-busy', 'true');

  const finalizeBoot = async () => {
    console.log('bootMain 실행 직전 ✅');
    try {
      await bootMain();
      console.log('bootMain 실행 완료 ✅');
    } catch (err) {
      console.error('bootMain 실행 오류:', err);
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
      playTransitionOverlay(() => finalizeBoot(), {
        duration: 1600,
        fade: DUR_MEDIUM,
        backgroundOpacity: 0.68,
        revealDelay: 320
      });
    } else {
      finalizeBoot();
    }
  }, DUR_LONG);
});

// ====== Today Stage ======
function pickRandomImmortal() {
  if (!IMM_LIST.length) return null;
  const candidates = IMM_LIST.filter((item) => item && item.thumb);
  if (!candidates.length) return null;
  const idx = Math.floor(Math.random() * candidates.length);
  return candidates[idx];
}

function createFallbackImage(src, title) {
  const img = document.createElement('img');
  if (src) img.src = src;
  img.alt = title || '';
  img.loading = 'lazy';
  img.decoding = 'async';
  img.hidden = false;
  return img;
}

function attachVideoFallback(videoEl, onFailure) {
  if (!videoEl || typeof onFailure !== 'function') return;
  const once = { once: true };
  const handler = () => {
    try {
      onFailure();
    } catch (err) {
      console.error('Video fallback handler failed:', err);
    }
  };
  videoEl.addEventListener('error', handler, once);
  videoEl.addEventListener('stalled', handler, once);
  videoEl.addEventListener('emptied', handler, once);
}

function createTodayHeroCard(entry) {
  const card = document.createElement('div');
  card.className = 'imm-cell today-hero-card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');

  const title = entry.title || entry.title_en || entry.id || '';
  const tags = Array.isArray(entry.tags) ? entry.tags : [];
  const overlayTags = formatTagList(tags);

  const hasVideo = Boolean(entry.video);

  const media = document.createElement('div');
  media.className = 'today-hero-media';

  const addFallbackImage = () => {
    if (!entry.thumb) return;
    const fallbackImg = createFallbackImage(entry.thumb, title);
    media.appendChild(fallbackImg);
    return fallbackImg;
  };

  if (hasVideo) {
    const videoEl = document.createElement('video');
    videoEl.src = entry.video;
    videoEl.muted = true;
    videoEl.loop = true;
    videoEl.playsInline = true;
    videoEl.autoplay = true;
    videoEl.preload = 'metadata';
    if (entry.thumb) {
      videoEl.setAttribute('poster', entry.thumb);
    }

    let fallbackImg = null;
    const ensureFallbackVisible = () => {
      fallbackImg = fallbackImg || addFallbackImage();
      if (fallbackImg) {
        fallbackImg.hidden = false;
      }
      try {
        videoEl.pause();
      } catch (err) {
        // noop
      }
      videoEl.remove();
    };

    attachVideoFallback(videoEl, () => {
      console.warn('Hero video failed, showing thumbnail instead:', entry.video);
      ensureFallbackVisible();
    });

    videoEl.addEventListener('loadeddata', () => {
      if (fallbackImg) {
        fallbackImg.hidden = true;
      }
    }, { once: true });

    media.appendChild(videoEl);
  } else if (entry.thumb) {
    addFallbackImage();
  }

  const info = document.createElement('div');
  info.className = 'imm-info';
  const titleNode = document.createElement('strong');
  titleNode.textContent = title;
  info.appendChild(titleNode);
  if (overlayTags) {
    const tagSpan = document.createElement('span');
    tagSpan.textContent = overlayTags;
    info.appendChild(tagSpan);
  }

  card.appendChild(media);
  card.appendChild(info);

  if (title) {
    card.setAttribute('aria-label', title);
  }

  const handleActivate = () => {
    const idx = IMM_LIST.findIndex((item) => item.id === entry.id);
    if (idx >= 0) {
      IMM_VIEW = IMM_LIST.slice();
      openImmDetailByIndex(idx);
    } else {
      playTransitionOverlay(() => openImmortals(), NAV_OVERLAY_DEFAULTS);
    }
  };

  card.addEventListener('click', handleActivate);
  card.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      handleActivate();
    }
  });

  return card;
}

async function renderTodayGallery() {
  if (!DOM.stage) return;
  DOM.stage.classList.add('stage--hero');
  DOM.stage.innerHTML = '<div class="today-loading">Loading...</div>';
  try {
    await ensureImmortalsData();
    const pick = pickRandomImmortal();

    DOM.stage.innerHTML = '';
    const section = document.createElement('section');
    section.className = 'today-section';

    if (pick) {
      const hero = createTodayHeroCard(pick);
      section.appendChild(hero);
      requestAnimationFrame(() => {
        hero.classList.add('today-hero-animate');
      });
    } else {
      const empty = document.createElement('div');
      empty.className = 'imm-empty today-empty';
      empty.textContent = immDataError
        ? 'Unable to load art right now.'
        : 'Art will unlock soon.';
      section.appendChild(empty);
    }

    const footer = document.createElement('div');
    footer.className = 'today-footer';
    const viewAllLink = document.createElement('a');
    viewAllLink.href = '#';
    viewAllLink.className = 'today-nav-link';
    viewAllLink.textContent = 'Explore All Immortals';
    viewAllLink.addEventListener('click', (e) => {
      e.preventDefault();
      playTransitionOverlay(() => openImmortals(), NAV_OVERLAY_DEFAULTS);
    });
    footer.appendChild(viewAllLink);
    section.appendChild(footer);

    DOM.stage.appendChild(section);
  } catch (err) {
    console.error('Failed to render Today gallery:', err);
    const error = document.createElement('div');
    error.className = 'today-error imm-empty';
    error.textContent = 'Unable to load art right now.';
    DOM.stage.innerHTML = '';
    DOM.stage.appendChild(error);
  }
}

// ====== Boot Main ======
async function bootMain() {
  console.log('Booting main stage ✅');
  await renderTodayGallery();
  requestAnimationFrame(() => {
    if (ENABLE_AUDIO) {
      DOM.audioUI.hidden = false;
      startOST();
    }
  });
}

let portalObserver = null;

function spawnPortals() {
  DOM.stage?.classList.remove('stage--hero');
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
function triggerTodayHeroAnimation() {
  const hero = DOM.stage?.querySelector('.today-hero-card');
  if (!hero) return;
  hero.classList.remove('today-hero-animate');
  void hero.offsetWidth;
  hero.classList.add('today-hero-animate');
}

window.addEventListener('resize', debounce(() => {
  if (SHOW_LEGEND_PINS) spawnLegendPins(true);
  triggerTodayHeroAnimation();
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
      playTransitionOverlay(() => {
        openImmortals();
        IMM_VIEW = legends.slice();
        const idx = IMM_VIEW.findIndex(x => x.id === item.id);
        openImmDetailByIndex(Math.max(0, idx));
      }, NAV_OVERLAY_DEFAULTS);
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
  ensureImmFilterControls();
  DOM.immModal.classList.add('modal-loading');
  try {
    await ensureImmortalsData();
  } catch (err) {
    console.error('Immortals modal open failed:', err);
  }
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
  const { emptyText = 'No Immortals yet.' } = opts;
  DOM.immGrid.innerHTML = '';
  const normalizedList = Array.isArray(list) ? list.map(normalizeImmItem) : [];
  if (!normalizedList.length) {
    const empty = document.createElement('div');
    empty.className = 'imm-empty';
    empty.textContent = emptyText;
    DOM.immGrid.appendChild(empty);
    IMM_VIEW = [];
    return;
  }

  const view = normalizedList.slice();
  IMM_VIEW = view;

  view.forEach((item, idx) => {
    const cell = document.createElement('div');
    cell.className = 'imm-cell';
    cell.setAttribute('role', 'button');
    cell.setAttribute('tabindex', '0');
    const thumb = resolveAssetPath(item.thumb || item.thumbnail || '');
    const overlayTags = formatTagList(item.tags);
    const thumbMarkup = thumb
      ? `<img src="${thumb}" alt="${item.title || ''}" loading="lazy">`
      : `<div class="imm-thumb-placeholder" aria-hidden="true"></div>`;
    cell.innerHTML = `
      <div class="imm-thumb">
        ${thumbMarkup}
        <div class="imm-info">
          <strong>${item.title || ''}</strong>
          ${overlayTags ? `<span>${overlayTags}</span>` : ''}
        </div>
      </div>`;
    if (item.title) {
      cell.setAttribute('aria-label', item.title);
    }
    cell.onclick = () => {
      IMM_VIEW = view;
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
  const detailTitle = it.title || it.title_en || it.id || '';
  DOM.immTitle.textContent = detailTitle;
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
  const fallbackImg = DOM.immVideoFallback || null;
  if (fallbackImg) {
    if (it.thumb) {
      fallbackImg.src = it.thumb;
      fallbackImg.alt = detailTitle || `Preview of ${it.id || 'Immortal'}`;
    } else {
      fallbackImg.removeAttribute('src');
      fallbackImg.alt = '';
    }
    fallbackImg.hidden = true;
  }

  if (DOM.immVideo) {
    const hideVideo = () => {
      DOM.immVideo.pause();
      DOM.immVideo.hidden = true;
      DOM.immVideo.removeAttribute('src');
      DOM.immVideo.removeAttribute('poster');
    };

    hideVideo();
    DOM.immVideo.onerror = null;
    DOM.immVideo.onstalled = null;
    DOM.immVideo.onloadeddata = null;

    if (it.video) {
      DOM.immVideo.hidden = false;
      if (it.thumb) {
        DOM.immVideo.setAttribute('poster', it.thumb);
      }
      DOM.immVideo.src = it.video;
      DOM.immVideo.currentTime = 0;

      const revealFallback = () => {
        console.warn('Immortal video missing:', it.video);
        hideVideo();
        if (fallbackImg && fallbackImg.src) {
          fallbackImg.hidden = false;
        }
      };

      DOM.immVideo.onerror = revealFallback;
      DOM.immVideo.onstalled = revealFallback;
      DOM.immVideo.onloadeddata = () => {
        if (fallbackImg) {
          fallbackImg.hidden = true;
        }
      };

      DOM.immVideo.play().catch(() => {});
    } else if (fallbackImg && fallbackImg.src) {
      fallbackImg.hidden = false;
    }
  } else if (fallbackImg && fallbackImg.src) {
    fallbackImg.hidden = false;
  }
  DOM.immIndex.textContent = `${IMM_CUR + 1} / ${IMM_VIEW.length}`;
  openModal(DOM.immDModal);
}

function closeImmDetailModal({ reopenImm } = {}) {
  if (!DOM.immDModal) return;
  if (DOM.immVideo) {
    DOM.immVideo.pause();
    DOM.immVideo.removeAttribute('src');
    DOM.immVideo.removeAttribute('poster');
    DOM.immVideo.hidden = true;
  }
  if (DOM.immVideoFallback) {
    DOM.immVideoFallback.hidden = true;
    DOM.immVideoFallback.removeAttribute('src');
    DOM.immVideoFallback.alt = '';
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
let ARC_ACTIVE_CELL = null;

function openArchive() {
  if (!DOM.arcGrid) return;
  closeArchiveDetail();
  DOM.arcGrid.innerHTML = '';
  if (!ARCHIVE_FILES.length) {
    const empty = document.createElement('div');
    empty.style.color = '#9aa0a6'; empty.textContent = 'No archive yet.';
    DOM.arcGrid.appendChild(empty);
  } else {
    ARCHIVE_FILES.forEach((entry, index) => {
      const item = typeof entry === 'string' ? { src: entry } : entry;
      const src = resolveAssetPath(item.src);
      if (!src) return;
      const isVideo = /\.mp4(?:$|\?)/i.test(item.src || src);
      const fitMode = (item.fit || item.objectFit || '').toLowerCase();
      const mediaClass = fitMode === 'contain'
        ? 'archive-media archive-media--contain'
        : 'archive-media';
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = index;
      if (item.src) {
        cell.dataset.src = item.src;
      }
      const media = isVideo
        ? `<div class="${mediaClass}"><video src="${src}" muted loop playsinline loading="lazy"></video></div>`
        : `<div class="${mediaClass}"><img src="${src}" alt="${item.title || ''}" loading="lazy"></div>`;
      const caption = item.title ? `<div class="caption">${item.title}</div>` : '';
      cell.innerHTML = `${media}${caption}`;
      if (item.title) {
        cell.setAttribute('aria-label', item.title);
      }
      cell.onclick = () => openArchiveDetail(item, cell);
      DOM.arcGrid.appendChild(cell);
    });
  }
  DOM.arcGrid.classList.remove('hidden');
  openModal(DOM.arcModal);
}
DOM.arcModal?.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-close')) {
    if (e.target.classList.contains('modal-close') && DOM.arcDetail && DOM.arcDetail.classList.contains('has-selection')) {
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
    updateMarqueePlayState();
  }).catch(() => {
    playing = false; updatePlayBtn();
    setNowLabel('탭하여 오디오 시작');
    setPendingPlayback();
    updateMarqueePlayState();
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
    updateMarqueePlayState();
    return;
  }

  playing = true;
  updatePlayBtn();
  updateMarqueePlayState();
  A.play().then(() => {
    playing = true;
    updatePlayBtn();
    updateMarqueePlayState();
  }).catch(() => {
    playing = false;
    updatePlayBtn();
    setPendingPlayback();
    updateMarqueePlayState();
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
  const label = ((text ?? '') || '').toString().trim() || '—';

  let inner = DOM.nowText.querySelector('.track-title__inner');
  if (!inner) {
    inner = document.createElement('span');
    inner.className = 'track-title__inner';
    DOM.nowText.innerHTML = '';
    DOM.nowText.appendChild(inner);
  }
  inner.textContent = label;
  DOM.nowText.setAttribute('aria-label', label);

  DOM.nowText.classList.remove('marquee', 'marquee--paused');
  DOM.nowText.style.removeProperty('--marquee-distance');
  DOM.nowText.style.removeProperty('--marquee-duration');
  DOM.nowText.style.removeProperty('--marquee-start');

  requestAnimationFrame(() => {
    if (!DOM.nowText || !inner.isConnected) return;

    const containerWidth = DOM.nowText.clientWidth || 1;
    const textWidth = inner.scrollWidth || containerWidth;
    const gap = Math.max(16, Math.min(containerWidth * 0.06, 32));
    const start = containerWidth;
    const distance = textWidth + containerWidth + gap;
    const speed = 60;
    const duration = Math.max(10, distance / speed);

    DOM.nowText.style.setProperty('--marquee-start', `${start}px`);
    DOM.nowText.style.setProperty('--marquee-distance', `${distance}px`);
    DOM.nowText.style.setProperty('--marquee-duration', `${duration}s`);
    DOM.nowText.classList.add('marquee');
    updateMarqueePlayState();
  });
}
function updateNow(meta) {
  clearPendingPlayback();
  setNowLabel(meta.title || '—');
}

function updateMarqueePlayState() {
  if (!DOM.nowText) return;
  if (!DOM.nowText.classList.contains('marquee')) return;
  DOM.nowText.classList.toggle('marquee--paused', !playing);
}

function trackEvent(category, action, label) {
  console.log(`[분석] ${category}: ${action} - ${label}`);
}

DOM.homeBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  playTransitionOverlay(() => {
    closeArchiveDetail();
    document.querySelectorAll('.modal').forEach(mod => closeModal(mod, { reopenImm: false }));
    renderTodayGallery();
  }, NAV_OVERLAY_DEFAULTS);
});
DOM.immBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  playTransitionOverlay(() => openImmortals(), NAV_OVERLAY_DEFAULTS);
});
DOM.arcBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  playTransitionOverlay(() => openArchive(), NAV_OVERLAY_DEFAULTS);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && DOM.intro && DOM.intro.style.display !== 'none') { DOM.enterBtn?.click(); }
  if (e.key === 'Escape') {
    let closed = false;
    if (DOM.arcDetail && DOM.arcDetail.classList.contains('has-selection')) { closeArchiveDetail(); closed = true; }
    if (isModalActive(DOM.immDModal)) { closeModal(DOM.immDModal, { reopenImm: false }); closed = true; }
    if (isModalActive(DOM.immModal)) { closeModal(DOM.immModal); closed = true; }
    if (isModalActive(DOM.arcModal)) { closeModal(DOM.arcModal); closed = true; }
    if (isModalActive(DOM.charModal)) { closeModal(DOM.charModal); closed = true; }
  }
});
function openArchiveDetail(entry, sourceCell) {
  if (!DOM.arcDetail || !DOM.arcDetailMedia) return;
  const item = typeof entry === 'string' ? { src: entry } : entry;
  const src = resolveAssetPath(item?.src);
  if (!src) return;
  if (ARC_ACTIVE_CELL && ARC_ACTIVE_CELL !== sourceCell) {
    ARC_ACTIVE_CELL.classList.remove('is-active');
  }
  if (sourceCell) {
    sourceCell.classList.add('is-active');
    ARC_ACTIVE_CELL = sourceCell;
  } else if (ARC_ACTIVE_CELL) {
    ARC_ACTIVE_CELL.classList.add('is-active');
  }
  const isVideo = /\.mp4(?:$|\?)/i.test(item?.src || src);
  const fitMode = (item?.fit || item?.objectFit || '').toLowerCase();
  const mediaClass = fitMode === 'contain'
    ? 'archive-media archive-media--contain'
    : 'archive-media';
  const detailMedia = DOM.arcDetailMedia;
  detailMedia.hidden = false;
  detailMedia.classList.remove('is-ready');
  detailMedia.removeAttribute('data-orientation');
  detailMedia.dataset.mediaType = isVideo ? 'video' : 'image';
  const mediaMarkup = isVideo
    ? `<div class="${mediaClass}"><video src="${src}" muted loop playsinline controls autoplay></video></div>`
    : `<div class="${mediaClass}"><img src="${src}" alt="${item.title || ''}" decoding="async" loading="lazy" /></div>`;
  detailMedia.innerHTML = mediaMarkup;
  const backdropSrc = resolveAssetPath(item?.backdrop || item?.poster || item?.preview || item?.src);
  applyArchiveBackdrop(detailMedia, { src: backdropSrc, isVideo });
  const mediaEl = detailMedia.querySelector('img, video');
  if (mediaEl && mediaEl.tagName === 'VIDEO') {
    mediaEl.muted = true;
    mediaEl.loop = item?.loop !== false;
    mediaEl.playsInline = true;
    mediaEl.setAttribute('playsinline', '');
    mediaEl.setAttribute('muted', '');
    mediaEl.setAttribute('loop', '');
    mediaEl.play().catch(() => {});
  }
  const markReady = () => {
    updateArchiveOrientation(detailMedia, mediaEl);
    detailMedia.classList.add('is-ready');
  };
  if (mediaEl) {
    if (mediaEl.tagName === 'IMG') {
      if (mediaEl.complete && (mediaEl.naturalWidth || mediaEl.width)) {
        markReady();
      } else {
        mediaEl.addEventListener('load', markReady, { once: true });
        mediaEl.addEventListener('error', () => detailMedia.classList.add('is-ready'), { once: true });
      }
    } else {
      if (mediaEl.readyState >= 1 && (mediaEl.videoWidth || mediaEl.clientWidth)) {
        markReady();
      } else {
        mediaEl.addEventListener('loadedmetadata', markReady, { once: true });
        mediaEl.addEventListener('error', () => detailMedia.classList.add('is-ready'), { once: true });
      }
    }
  } else {
    detailMedia.classList.add('is-ready');
  }
  if (DOM.arcDetailCaption) {
    DOM.arcDetailCaption.textContent = item.title || '';
    DOM.arcDetailCaption.hidden = !item.title;
  }
  if (DOM.arcDetailGuide) {
    DOM.arcDetailGuide.hidden = true;
  }
  DOM.arcDetail.classList.add('has-selection');
}

function closeArchiveDetail() {
  if (!DOM.arcDetail) return;
  if (ARC_ACTIVE_CELL) {
    ARC_ACTIVE_CELL.classList.remove('is-active');
    ARC_ACTIVE_CELL = null;
  }
  const video = DOM.arcDetailMedia?.querySelector('video');
  if (video) video.pause();
  if (DOM.arcDetailMedia) {
    DOM.arcDetailMedia.innerHTML = '';
    DOM.arcDetailMedia.classList.remove('is-ready');
    DOM.arcDetailMedia.removeAttribute('data-orientation');
    delete DOM.arcDetailMedia.dataset.mediaType;
    DOM.arcDetailMedia.style.removeProperty('--archive-detail-image');
    DOM.arcDetailMedia.style.removeProperty('--archive-detail-accent');
    DOM.arcDetailMedia._backdropToken = null;
    DOM.arcDetailMedia.hidden = true;
  }
  if (DOM.arcDetailCaption) {
    DOM.arcDetailCaption.textContent = '';
    DOM.arcDetailCaption.hidden = true;
  }
  if (DOM.arcDetailGuide) {
    DOM.arcDetailGuide.hidden = false;
  }
  DOM.arcDetail.classList.remove('has-selection');
  DOM.arcGrid?.classList.remove('hidden');
}

ensureImmortalsData().catch((err) => {
  console.error('Initial Immortals preload failed:', err);
});
