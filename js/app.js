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
const IG_URL = 'https://www.instagram.com/mottttooooooo/';
const TT_URL = 'https://www.youtube.com/@motto_7777';
const NFT_COLLECTION_URL = 'https://crypto.com/nft/collection/e5d6b1c9197704a5cca12036062263f2?tab=items';

// ====== Build Version ======
const SCRIPT_VERSION = (() => {
  if (typeof document === 'undefined') return '';
  try {
    const current = document.currentScript;
    if (current?.src) {
      const url = new URL(current.src, document.baseURI || window.location.href);
      const version = url.searchParams.get('v');
      if (version) {
        return version;
      }
    }
  } catch (err) {
    // ignore
  }
  try {
    const scripts = document.querySelectorAll('script[src]');
    for (let i = scripts.length - 1; i >= 0; i -= 1) {
      const script = scripts[i];
      const srcAttr = script.getAttribute('src') || '';
      if (!srcAttr.includes('app.js')) continue;
      try {
        const url = new URL(script.src || srcAttr, document.baseURI || window.location.href);
        const version = url.searchParams.get('v');
        if (version) {
          return version;
        }
      } catch (innerErr) {
        const match = srcAttr.match(/[?&]v=([^&]+)/);
        if (match) {
          return decodeURIComponent(match[1]);
        }
      }
    }
  } catch (err) {
    // ignore
  }
  return '';
})();

function appendQueryParam(path, key, value, options = {}) {
  if (!path) return path;
  const { skipIfExists = false } = options;
  const [base, fragment = ''] = path.split('#');
  const safeKey = `${key}`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`([?&])${safeKey}=`);
  if (skipIfExists && pattern.test(base)) {
    return path;
  }
  const separator = base.includes('?') ? '&' : '?';
  const next = `${base}${separator}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  return fragment ? `${next}#${fragment}` : next;
}

function withAssetVersion(path) {
  if (!path) return path;
  const version = SCRIPT_VERSION;
  if (!version) return path;
  return appendQueryParam(path, 'v', version, { skipIfExists: true });
}

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

const ABOUT_HERO = Object.freeze({
  eyebrow: 'ABOUT · PROJECT 7777',
  title: 'MOTTO 7777',
  sublines: [
    'Audio-visual project by Sean Woong & Haz Haus.',
    '7 archetypes · 7,777 artworks · 7-track OST.'
  ]
});

const ABOUT_CREDITS = Object.freeze([
  'Created by Sean Woong & Haz Haus',
  'Worldbuilding · Sean Woong & Haz Haus',
  'Visual direction · Sean Woong',
  'Music & sound direction · Haz Haus'
]);

const ABOUT_STATS = Object.freeze([
  { label: 'IMMORTALS', value: '77', caption: 'Motion portrait NFTs at the visible core of MOTTO 7777.' },
  { label: 'PACKS', value: '7', caption: 'Dealer, Skull, Rockstar, Drag, Military, Motorcycle, Boxer.' },
  { label: 'OST', value: '7', caption: 'Original tracks by Haz Haus & oo.sean.' },
  { label: 'SUPPLY', value: '7,777', caption: '7,700 main collection NFTs + 77 Immortals motion portrait NFTs.' }
]);

const ABOUT_SUMMARY = 'This site is the main stage and archive for MOTTO 7777. Immortals show the core motion portrait NFTs, the archive holds posters and behind-the-scenes work, and the OST keeps the world moving in the background. The NFT tab links straight to the full 7,777-piece collection on Crypto.com NFT.';

const ABOUT_LORE = Object.freeze([
  'In the year 7,777, humanity’s last echoes dissolve into glitch and loop. Seven archetypes — Dealer, Skull, Rockstar, Drag, Military, Motorcycle, Boxer — drift through signal, circuit, and emotion. Their identities fragment and repeat, asking a simple question: what remains when memory fractures?',
  'MOTTO 7777 lives on sevens — set in the year 7,777, shaped by seven archetypes, 7,777 NFTs, and a 7-track OST that scores this world. The 7,700-piece MOTTO pack is a curated generative set of hand-drawn helmets, riders and glitches spread across those seven archetypes.',
  'The 77 Immortals are animated motion portrait NFTs that sit at the core of MOTTO 7777. Each Immortal loops an 8-bit reimagining of the original MOTTO OST, as if the soundtrack survived only as game-console memory. Within the 77, seven Legend pieces form the innermost core: images that refuse to fade, replaying the question of who stays, who is erased, and who turns into myth.'
]);

const ABOUT_PILLARS = [
  {
    id: 'immortals',
    eyebrow: 'IMMORTALS GRID',
    title: 'IMMORTALS GRID',
    body: [
      'Looping motion portraits built from the seven packs.',
      'This grid is where you explore the 77 Immortals and their key cuts in one place.'
    ]
  },
  {
    id: 'archive',
    eyebrow: 'ARCHIVE WALL',
    title: 'ARCHIVE WALL',
    body: [
      'Posters, behind-the-scenes cuts, memes and side experiments from MOTTO 7777.',
      'This is where the messy process stays visible instead of being hidden.'
    ]
  },
  {
    id: 'sound',
    eyebrow: 'SOUND / OST',
    title: 'SOUND / OST',
    body: [
      'A custom score for this world by Haz Haus in collaboration with oo.sean.',
      'The OST and live edits sit here so every loop and drop has a mood under it.'
    ]
  },
  {
    id: 'drops',
    eyebrow: 'DROPS / COLLECTORS',
    title: 'DROPS / COLLECTORS',
    body: [
      'MOTTO 7777 lives here as high-res motion and sound, and on-chain as a 7,777-piece NFT collection on the Cronos chain via Crypto.com NFT. The main MOTTO pack holds 7,700 hand-built generative portraits, with 77 Immortal motion portraits sitting at the top layer.',
      'Immortals are the rarest visible layer of the world, while the main drop is available to collectors via the NFT tab.'
    ]
  }
];

const ABOUT_TEASER_URL = 'https://www.youtube.com/embed/0j9Vhhuz5PA';
const ABOUT_CTA_NOTE = 'Pick where to enter: characters through IMMORTALS, process through ARCHIVE, or the sound of the world through the OST.';

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
const ARCHIVE_MANIFEST_URL = withAssetVersion('assets/archive/archive.json');
let ARCHIVE_FILES = [];
let _archiveManifestPromise = null;
let ARCHIVE_SPOTLIGHT_ENABLED = false;
const ARCHIVE_ACCENT_CACHE = new Map();
const ARCHIVE_COLOR_CANVAS = document.createElement('canvas');
const ARCHIVE_COLOR_CONTEXT = ARCHIVE_COLOR_CANVAS.getContext('2d', { willReadFrequently: true })
  || ARCHIVE_COLOR_CANVAS.getContext('2d');
const ARCHIVE_DEFAULT_COLOR = [190, 204, 224];
let ARCHIVE_IS_ANIMATING = false;
let ARCHIVE_TRANSITION_TIMER = null;
const SPOTLIGHT_STATE = {
  enabled: true,
  raf: null,
  currentX: 50,
  currentY: 48,
  targetX: 50,
  targetY: 48,
  lerp: 0.2,
  offsetPx: 32
};
const SPOTLIGHT_MEDIA_PREF = window.matchMedia('(prefers-reduced-motion: reduce)');
const SPOTLIGHT_POINTER_PREF = window.matchMedia('(pointer: coarse)');

if (typeof window !== 'undefined') {
  window.__MOTTO_ARCHIVE_FILES__ = ARCHIVE_FILES;
}

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
  aboutBtn: document.getElementById('aboutBtn'),
  nftBtn: document.getElementById('nftBtn'),
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

let MAIN_BOOTED = false;
let MAIN_BOOT_PROMISE = null;

const MODALS = [DOM.charModal, DOM.immModal, DOM.immDModal, DOM.arcModal];

MODALS.forEach((el) => {
  if (!el) return;
  if (el.hasAttribute('hidden')) el.removeAttribute('hidden');
  el.classList.add('hidden');
  el.classList.remove('active');
});

const IMMORTALS_ACCESS_MODES = Object.freeze({
  LOCKED: 'locked',
  OPEN: 'open'
});
const IMMORTALS_ACCESS_STORAGE_KEY = 'motto:immortals-access';
let IMMORTALS_ACCESS_MODE = IMMORTALS_ACCESS_MODES.LOCKED;

function readStoredImmortalsAccessMode() {
  if (typeof window === 'undefined') return IMMORTALS_ACCESS_MODES.LOCKED;
  try {
    const stored = window.localStorage?.getItem(IMMORTALS_ACCESS_STORAGE_KEY);
    if (stored === IMMORTALS_ACCESS_MODES.OPEN || stored === IMMORTALS_ACCESS_MODES.LOCKED) {
      return stored;
    }
  } catch (err) {
    console.warn('Unable to read Immortals access mode:', err);
  }
  return IMMORTALS_ACCESS_MODES.LOCKED;
}

function persistImmortalsAccessMode(mode) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage?.setItem(IMMORTALS_ACCESS_STORAGE_KEY, mode);
  } catch (err) {
    console.warn('Unable to store Immortals access mode:', err);
  }
}

function applyImmortalsAccessMode(mode) {
  const normalized = mode === IMMORTALS_ACCESS_MODES.OPEN
    ? IMMORTALS_ACCESS_MODES.OPEN
    : IMMORTALS_ACCESS_MODES.LOCKED;
  IMMORTALS_ACCESS_MODE = normalized;
  persistImmortalsAccessMode(normalized);
  if (document?.documentElement) {
    document.documentElement.classList.toggle('immortals-locked', normalized === IMMORTALS_ACCESS_MODES.LOCKED);
  }
  if (DOM.immBtn) {
    DOM.immBtn.classList.toggle('is-locked', normalized === IMMORTALS_ACCESS_MODES.LOCKED);
    DOM.immBtn.setAttribute('data-immortals-access', normalized);
  }
  return normalized;
}

function isImmortalsUnlocked() {
  return IMMORTALS_ACCESS_MODE === IMMORTALS_ACCESS_MODES.OPEN;
}

function lockImmortalsAccess() {
  return applyImmortalsAccessMode(IMMORTALS_ACCESS_MODES.LOCKED);
}

function unlockImmortalsAccess() {
  return applyImmortalsAccessMode(IMMORTALS_ACCESS_MODES.OPEN);
}

function toggleImmortalsAccess() {
  return applyImmortalsAccessMode(isImmortalsUnlocked()
    ? IMMORTALS_ACCESS_MODES.LOCKED
    : IMMORTALS_ACCESS_MODES.OPEN);
}

function initImmortalsAccessMode() {
  const stored = readStoredImmortalsAccessMode();
  applyImmortalsAccessMode(stored);
}

initImmortalsAccessMode();

window.MottoImmortals = Object.assign(window.MottoImmortals || {}, {
  lock: () => lockImmortalsAccess(),
  unlock: () => unlockImmortalsAccess(),
  toggle: () => toggleImmortalsAccess(),
  mode: () => IMMORTALS_ACCESS_MODE
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
    if (window.location.hash.startsWith('#archive')) {
      history.replaceState(null, '', '#');
    }
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

function resetStageForView() {
  try {
    closeArchiveDetail();
  } catch (err) {
    console.warn('Failed to close archive detail before view change:', err);
  }
  try {
    document.querySelectorAll('.modal').forEach((mod) => {
      closeModal(mod, { reopenImm: false });
    });
  } catch (err) {
    console.warn('Failed to close modal before view change:', err);
  }
}

function fastExitIntro() {
  if (DOM.intro) {
    DOM.intro.classList.add('intro--exit');
    DOM.intro.style.display = 'none';
  }
  if (DOM.introClip) {
    DOM.introClip.hidden = true;
  }
}

function ensureMainReady() {
  if (MAIN_BOOTED) return Promise.resolve();
  if (MAIN_BOOT_PROMISE) return MAIN_BOOT_PROMISE;
  MAIN_BOOT_PROMISE = bootMain()
    .then(() => {
      MAIN_BOOTED = true;
    })
    .finally(() => {
      MAIN_BOOT_PROMISE = null;
    });
  return MAIN_BOOT_PROMISE;
}

function handleInitialViewRequest() {
  let viewParam = null;
  try {
    const url = new URL(window.location.href);
    viewParam = (url.searchParams.get('view') || '').toLowerCase();
    if (!viewParam) return;
    const nextSearch = new URLSearchParams(url.searchParams);
    nextSearch.delete('view');
    const nextSearchString = nextSearch.toString();
    history.replaceState(
      null,
      '',
      `${url.pathname}${nextSearchString ? `?${nextSearchString}` : ''}${url.hash}`
    );
  } catch (err) {
    console.error('Failed to parse view parameter:', err);
    return;
  }

  if (viewParam === 'immortals' && !isImmortalsUnlocked()) {
    console.info('Immortals view request ignored because access is locked.');
    return;
  }

  const actions = {
    immortals: () => openImmortals(),
    archive: () => openArchive(),
    about: () => renderAboutView(),
    nft: () => {
      resetStageForView();
      renderNftView();
    }
  };

  const action = actions[viewParam];
  if (!action) return;

  fastExitIntro();
  ensureMainReady()
    .then(() => action())
    .catch((err) => {
      console.error('Failed to open requested view:', err);
    });
}

// ====== Intro → Main ======
DOM.enterBtn?.addEventListener('click', () => {
  console.log("ENTER 버튼 클릭됨 ✅");
  DOM.enterBtn.disabled = true;
  DOM.enterBtn.setAttribute('aria-busy', 'true');

  const finalizeBoot = async () => {
    console.log('bootMain 실행 직전 ✅');
    try {
      await ensureMainReady();
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

  const media = document.createElement('div');
  media.className = 'today-hero-media';

  const previewSrc = entry.thumb || '';
  if (previewSrc) {
    const previewImg = createFallbackImage(previewSrc, title);
    media.appendChild(previewImg);
  } else {
    media.innerHTML = '<div class="imm-thumb-placeholder" aria-hidden="true"></div>';
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
  DOM.stage.classList.remove('stage--about');
  DOM.stage.classList.remove('stage--nft');
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
    viewAllLink.dataset.mode = isImmortalsUnlocked() ? 'open' : 'locked';
    viewAllLink.addEventListener('click', (e) => {
      e.preventDefault();
      handleImmortalsEntryRequest('today-link');
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

function collectAboutStats() {
  return ABOUT_STATS.map((stat) => ({ ...stat }));
}

function navigateAboutAction(action, source = 'about-cta') {
  switch (action) {
    case 'immortals':
      handleImmortalsEntryRequest(source);
      break;
    case 'archive':
      playTransitionOverlay(() => openArchive(), NAV_OVERLAY_DEFAULTS);
      break;
    case 'music':
      window.location.href = 'music.html';
      break;
    case 'nft':
      openNftView(source);
      break;
    default:
      break;
  }
}

async function renderAboutView() {
  if (!DOM.stage) return;
  DOM.stage.classList.remove('stage--hero');
  DOM.stage.classList.remove('stage--nft');
  DOM.stage.classList.add('stage--about');
  DOM.stage.innerHTML = '';

  const section = document.createElement('section');
  section.className = 'about';

  const hero = document.createElement('header');
  hero.className = 'about-hero';
  const heroEyebrow = document.createElement('p');
  heroEyebrow.className = 'about-eyebrow';
  heroEyebrow.textContent = ABOUT_HERO.eyebrow;
  hero.appendChild(heroEyebrow);

  const heroTitle = document.createElement('h1');
  heroTitle.textContent = ABOUT_HERO.title || ABOUT_HERO.line;
  hero.appendChild(heroTitle);
  if (Array.isArray(ABOUT_HERO.sublines)) {
    ABOUT_HERO.sublines.forEach((text) => {
      if (!text) return;
      const sub = document.createElement('p');
      sub.className = 'about-subhead';
      sub.textContent = text;
      hero.appendChild(sub);
    });
  }
  section.appendChild(hero);

  const teaser = document.createElement('div');
  teaser.className = 'about-teaser';
  const teaserFrame = document.createElement('div');
  teaserFrame.className = 'about-teaser__frame';
  const teaserIframe = document.createElement('iframe');
  teaserIframe.src = ABOUT_TEASER_URL;
  teaserIframe.title = 'MOTTO 7777 teaser';
  teaserIframe.setAttribute('frameborder', '0');
  teaserIframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  teaserIframe.setAttribute('allowfullscreen', '');
  teaserFrame.appendChild(teaserIframe);
  teaser.appendChild(teaserFrame);
  section.appendChild(teaser);

  const credits = document.createElement('div');
  credits.className = 'about-credits';
  ABOUT_CREDITS.forEach((line, idx) => {
    const p = document.createElement('p');
    p.textContent = line;
    if (idx === 0) {
      p.classList.add('about-credits__lead');
    }
    credits.appendChild(p);
  });
  section.appendChild(credits);

  const statsWrap = document.createElement('div');
  statsWrap.className = 'about-stats';
  collectAboutStats().forEach((stat) => {
    const card = document.createElement('div');
    card.className = 'about-stat';

    const label = document.createElement('span');
    label.className = 'about-stat-label';
    label.textContent = stat.label;
    card.appendChild(label);

    const value = document.createElement('strong');
    value.className = 'about-stat-value';
    value.textContent = stat.value;
    card.appendChild(value);

    const caption = document.createElement('span');
    caption.className = 'about-stat-caption';
    caption.textContent = stat.caption;
    card.appendChild(caption);

    statsWrap.appendChild(card);
  });
  section.appendChild(statsWrap);

  if (ABOUT_LORE.length) {
    const loreWrap = document.createElement('div');
    loreWrap.className = 'about-lore';
    ABOUT_LORE.forEach((text) => {
      if (!text) return;
      const p = document.createElement('p');
      p.className = 'about-main-copy';
      p.textContent = text;
      loreWrap.appendChild(p);
    });
    section.appendChild(loreWrap);
  }

  const summary = document.createElement('div');
  summary.className = 'about-summary';
  const summaryP = document.createElement('p');
  summaryP.className = 'about-main-copy';
  summaryP.textContent = ABOUT_SUMMARY;
  summary.appendChild(summaryP);
  section.appendChild(summary);

  const grid = document.createElement('div');
  grid.className = 'about-grid';
  ABOUT_PILLARS.forEach((pillar) => {
    const card = document.createElement('article');
    card.className = 'about-card';

    if (pillar.eyebrow) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'about-card-eyebrow';
      eyebrow.textContent = pillar.eyebrow;
      card.appendChild(eyebrow);
    }

    const title = document.createElement('h3');
    title.textContent = pillar.title;
    card.appendChild(title);

    const bodyLines = Array.isArray(pillar.body)
      ? pillar.body
      : pillar.body
        ? [pillar.body]
        : [];
    bodyLines.forEach((text) => {
      const copy = document.createElement('p');
      copy.textContent = text;
      card.appendChild(copy);
    });

    grid.appendChild(card);
  });
  section.appendChild(grid);

  const ctaNote = document.createElement('p');
  ctaNote.className = 'about-cta-note';
  ctaNote.textContent = ABOUT_CTA_NOTE;
  section.appendChild(ctaNote);

  const ctas = [
    { label: 'ENTER IMMORTALS', action: 'immortals' },
    { label: 'BROWSE ARCHIVE', action: 'archive' },
    { label: 'LISTEN TO OST', action: 'music' },
    { label: 'GO TO NFT DROP', action: 'nft' }
  ];

  const actions = document.createElement('div');
  actions.className = 'about-actions';
  ctas.forEach((cta) => {
    const node = document.createElement('button');
    node.className = 'about-btn';
    node.type = 'button';
    node.textContent = cta.label;
    node.addEventListener('click', (e) => {
      e.preventDefault();
      navigateAboutAction(cta.action, 'about-cta');
    });

    actions.appendChild(node);
  });
  section.appendChild(actions);

  DOM.stage.innerHTML = '';
  DOM.stage.appendChild(section);
  if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function renderNftView() {
  if (!DOM.stage) return;
  DOM.stage.classList.remove('stage--hero');
  DOM.stage.classList.remove('stage--about');
  DOM.stage.classList.add('stage--nft');
  DOM.stage.innerHTML = '';

  const root = document.createElement('section');
  root.className = 'nft-root';
  root.setAttribute('aria-labelledby', 'nft-title');

  const hero = document.createElement('section');
  hero.className = 'nft-hero';
  const eyebrow = document.createElement('p');
  eyebrow.className = 'nft-eyebrow';
  eyebrow.textContent = 'NFT';
  hero.appendChild(eyebrow);

  const heroTitle = document.createElement('h1');
  heroTitle.id = 'nft-title';
  heroTitle.textContent = 'MOTTO 7777 · NFT DROP';
  hero.appendChild(heroTitle);

  const heroSubtext = document.createElement('p');
  heroSubtext.className = 'nft-subtext';
  heroSubtext.textContent = 'Survival Battle: MOTTO 7777 on the Cronos chain via Crypto.com NFT.';
  hero.appendChild(heroSubtext);

  const heroIntro = document.createElement('p');
  heroIntro.className = 'nft-intro';
  heroIntro.textContent = 'MOTTO 7777 is an audio-visual Cronos collection by Sean Woong and Haz Haus. Seven archetypes, 7,777 NFTs and a 7-track OST are tied into one world called “Survival Battle: MOTTO 7777.”';
  hero.appendChild(heroIntro);

  root.appendChild(hero);

  const content = document.createElement('div');
  content.className = 'nft-content';

  const makeSection = (titleText) => {
    const section = document.createElement('section');
    section.className = 'nft-section';
    if (titleText) {
      const heading = document.createElement('h2');
      heading.textContent = titleText;
      section.appendChild(heading);
    }
    return section;
  };

  const mainSection = makeSection('Main drop — MOTTO pack (7,700)');
  [
    'The main drop is a 7,700-piece MOTTO pack drawn by Sean Woong. Each NFT is a hand-drawn composite portrait built from helmets, riders, suits, glitches and backgrounds across the seven archetypes.',
    'Traits are assembled through a generative system, then curated down into 7,700 final pieces — not auto-generated noise, but a selected layer of the world.'
  ].forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    mainSection.appendChild(p);
  });
  content.appendChild(mainSection);

  const immortalsSection = makeSection('Immortals & legends (77)');
  [
    'Alongside the MOTTO pack, 77 Immortal NFTs sit at the core of MOTTO 7777. They are animated motion portraits that loop an 8-bit reimagining of the original MOTTO OST, as if the soundtrack survived only as game-console memory.',
    'Within the 77, seven Legend pieces form the innermost core — images that refuse to fade, replaying the question of who stays, who is erased, and who turns into myth.'
  ].forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    immortalsSection.appendChild(p);
  });
  content.appendChild(immortalsSection);

  const rulesSection = makeSection('Game rules — Survival Battle');
  const rulesIntro = document.createElement('p');
  rulesIntro.textContent = 'Total supply is 7,777 NFTs across the collection: 7,700 MOTTO pack NFTs plus 77 Immortals and legends. The pack is where the Survival Battle rules actually move.';
  rulesSection.appendChild(rulesIntro);

  const rulesLabel = document.createElement('p');
  const strong = document.createElement('strong');
  strong.textContent = 'Key rules:';
  rulesLabel.appendChild(strong);
  rulesSection.appendChild(rulesLabel);

  const rulesList = document.createElement('ul');
  rulesList.className = 'nft-list';
  [
    'Two weeks after the drop window closes, 50% of the MOTTO pack (non-Immortals) will be updated on-chain with “Killed in Action” (KIA) artwork.',
    'Until that KIA update, all assets can be traded freely inside the “Survival Battle: MOTTO 7777” collection on Crypto.com NFT.',
    'After the KIA update, these NFTs will not be withdrawable outside Crypto.com NFT. Check the official event details on Crypto.com for the full terms.'
  ].forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    rulesList.appendChild(li);
  });
  rulesSection.appendChild(rulesList);
  content.appendChild(rulesSection);

  const utilitySection = makeSection('Holder utilities');
  const utilityCopy = document.createElement('p');
  utilityCopy.textContent = 'MOTTO 7777 NFTs come with more than just artwork. Holders can expect utilities such as soundtrack download access, future mini-game entries, occasional physical merchandise packages, and future governance-related rewards. Exact amounts, conditions and timelines are explained on Crypto.com NFT and in the official “Motto 7777 NFT Collection – Reward Utility Terms & Conditions.”';
  utilitySection.appendChild(utilityCopy);
  content.appendChild(utilitySection);

  const ctaSection = makeSection('');
  ctaSection.classList.add('nft-cta-section');
  const ctaCopy = document.createElement('p');
  ctaCopy.className = 'nft-cta-copy';
  ctaCopy.textContent = 'Enter the drop from here — view the full collection while the rest of the site stays active.';
  ctaSection.appendChild(ctaCopy);
  const ctaRow = document.createElement('div');
  ctaRow.className = 'nft-cta-row';
  const ctaLink = document.createElement('a');
  ctaLink.className = 'nft-cta nft-cta--primary';
  ctaLink.href = NFT_COLLECTION_URL;
  ctaLink.target = '_blank';
  ctaLink.rel = 'noopener';
  ctaLink.textContent = 'View collection on Crypto.com NFT';
  ctaRow.appendChild(ctaLink);
  ctaSection.appendChild(ctaRow);
  content.appendChild(ctaSection);

  root.appendChild(content);
  DOM.stage.appendChild(root);

  if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function openAboutSection(source = 'nav-link') {
  const open = () => {
    trackEvent('Nav', 'Open', `About:${source}`);
    playTransitionOverlay(() => {
      resetStageForView();
      renderAboutView();
    }, NAV_OVERLAY_DEFAULTS);
  };

  if (MAIN_BOOTED) {
    open();
    return;
  }

  ensureMainReady()
    .then(() => open())
    .catch((err) => {
      console.error('Failed to open About view:', err);
    });
}

function openNftView(source = 'nav-link') {
  const open = () => {
    trackEvent('Nav', 'Open', `NFT:${source}`);
    playTransitionOverlay(() => {
      resetStageForView();
      renderNftView();
    }, NAV_OVERLAY_DEFAULTS);
  };

  if (MAIN_BOOTED) {
    open();
    return;
  }

  ensureMainReady()
    .then(() => open())
    .catch((err) => {
      console.error('Failed to open NFT view:', err);
    });
}

function handleImmortalsEntryRequest(source = 'nav') {
  const runAction = () => {
    const action = isImmortalsUnlocked()
      ? () => openImmortals()
      : () => renderTodayGallery();
    try {
      trackEvent('Immortals', isImmortalsUnlocked() ? 'Open' : 'Shuffle', source);
    } catch (err) {
      console.warn('Immortals tracking failed:', err);
    }
    playTransitionOverlay(() => {
      try {
        action();
      } catch (err) {
        console.error('Immortals entry action failed:', err);
      }
    }, NAV_OVERLAY_DEFAULTS);
  };

  if (MAIN_BOOTED) {
    runAction();
    return;
  }

  ensureMainReady()
    .then(() => runAction())
    .catch((err) => {
      console.error('Failed to prepare Immortals action:', err);
    });
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
  MAIN_BOOTED = true;
}

let portalObserver = null;

function spawnPortals() {
  DOM.stage?.classList.remove('stage--hero');
  DOM.stage?.classList.remove('stage--about');
  DOM.stage?.classList.remove('stage--nft');
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
  lines.forEach((text) => {
    const line = document.createElement('span');
    line.className = 'imm-desc-line';
    line.textContent = text;
    DOM.immDesc.appendChild(line);
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
    DOM.immLegend.innerHTML = '';
    DOM.immLegend.style.display = 'none';
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
let ARCHIVE_ACTIVE_INDEX = -1;
let ARCHIVE_ACTIVE_KEY = null;
let ARCHIVE_PENDING_KEY = null;
let ARCHIVE_PENDING_SCROLL = false;
const ARCHIVE_KEY_TO_INDEX = new Map();
const ARCHIVE_ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'mp4']);
const ARCHIVE_ALLOWED_POSTER_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif']);

function extractArchiveFilename(path) {
  if (typeof path !== 'string') return '';
  const withoutQuery = path.split('?')[0];
  const parts = withoutQuery.split('/');
  return parts[parts.length - 1] || '';
}

function isValidArchiveFilename(name, { allowVideo = true } = {}) {
  if (!name) return false;
  if (name.includes('-')) return false;
  if (!/^[A-Za-z0-9_]+\.[A-Za-z0-9]+$/.test(name)) return false;
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (allowVideo) {
    return ARCHIVE_ALLOWED_EXTENSIONS.has(ext);
  }
  return ARCHIVE_ALLOWED_POSTER_EXTENSIONS.has(ext);
}

function deriveArchiveFallbackTitle(filename, index) {
  if (!filename) {
    return `Archive Item ${index + 1}`;
  }
  const base = filename.replace(/\.[^.]+$/, '');
  const spaced = base.replace(/[_]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!spaced) {
    return `Archive Item ${index + 1}`;
  }
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function sanitizeArchiveEntry(raw, index) {
  if (!raw || typeof raw !== 'object') {
    console.warn(`Archive entry #${index + 1} is not an object`, raw);
    return null;
  }
  const entry = { ...raw };
  const src = typeof entry.src === 'string' ? entry.src.trim() : '';
  if (!src) {
    console.warn(`Archive entry #${index + 1} is missing src`, raw);
    return null;
  }
  if (/\s/.test(src) || src.includes('%')) {
    console.warn(`Archive entry #${index + 1} contains invalid characters: ${src}`);
    return null;
  }
  const filename = extractArchiveFilename(src);
  if (!isValidArchiveFilename(filename)) {
    console.warn(`Archive entry #${index + 1} has an invalid filename: ${src}`);
    return null;
  }
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (!ARCHIVE_ALLOWED_EXTENSIONS.has(ext)) {
    console.warn(`Archive entry #${index + 1} uses an unsupported extension: ${src}`);
    return null;
  }
  const declaredType = (entry.type || '').toLowerCase();
  const inferredType = ext === 'mp4' ? 'video' : 'image';
  const type = declaredType === 'video' || declaredType === 'image' ? declaredType : inferredType;
  const normalizedType = inferredType === 'video' ? 'video' : 'image';
  if (type !== normalizedType) {
    console.warn(`Archive entry #${index + 1} type mismatch; using "${normalizedType}" for ${src}`);
  }
  const fit = (entry.fit || entry.objectFit || '').toLowerCase();
  const providedTitle = typeof entry.title === 'string' && entry.title.trim()
    ? entry.title.trim()
    : '';
  const hasManualTitle = Boolean(providedTitle);
  const fallbackTitle = deriveArchiveFallbackTitle(filename, index);
  const title = hasManualTitle ? providedTitle : '';
  const accessibleTitle = hasManualTitle ? providedTitle : fallbackTitle;
  let poster = typeof entry.poster === 'string' && entry.poster.trim()
    ? entry.poster.trim()
    : (typeof entry.preview === 'string' && entry.preview.trim() ? entry.preview.trim() : '');
  if (poster) {
    if (/\s/.test(poster) || poster.includes('%')) {
      console.warn(`Archive entry #${index + 1} poster contains invalid characters: ${poster}`);
      poster = '';
    } else {
      const posterFilename = extractArchiveFilename(poster);
      if (!isValidArchiveFilename(posterFilename, { allowVideo: false })) {
        console.warn(`Archive entry #${index + 1} poster has an invalid filename: ${poster}`);
        poster = '';
      }
    }
  }
  const key = generateArchiveKey({ ...entry, src, title }, index);

  return {
    src,
    title,
    type: normalizedType,
    displayType: normalizedType === 'video' ? 'VIDEO' : 'STILL',
    fit,
    poster,
    loop: entry.loop !== undefined ? Boolean(entry.loop) : undefined,
    fallbackTitle,
    accessibleTitle,
    hasManualTitle,
    key,
    index
  };
}

function generateArchiveKey(entry, index) {
  const base = (entry && (entry.id || entry.slug || entry.key || entry.src || entry.title))
    ? `${entry.id || entry.slug || entry.key || entry.src || entry.title}`
    : `archive-${index}`;
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || `archive-${index}`;
}

function escapeHTML(str) {
  return `${str}`.replace(/[&<>"]+/g, (match) => {
    switch (match) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      default: return match;
    }
  });
}

function ensureArchiveManifest(options = {}) {
  if (options.force) {
    _archiveManifestPromise = null;
  }
  if (_archiveManifestPromise) {
    return _archiveManifestPromise;
  }
  const manifestUrl = appendQueryParam(
    ARCHIVE_MANIFEST_URL,
    '_cb',
    Date.now().toString(36)
  );
  _archiveManifestPromise = fetch(manifestUrl, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Manifest request failed: ${response.status}`);
      }
      return response.json();
    })
    .then((payload) => {
      if (!Array.isArray(payload)) {
        throw new Error('Archive manifest payload is not an array');
      }
      const sanitized = payload
        .map((item, index) => sanitizeArchiveEntry(item, index))
        .filter(Boolean);
      ARCHIVE_KEY_TO_INDEX.clear();
      ARCHIVE_FILES = sanitized.map((entry, idx) => {
        const key = (entry.key || generateArchiveKey(entry, idx)).toLowerCase();
        const normalized = { ...entry, key, index: idx };
        ARCHIVE_KEY_TO_INDEX.set(key, idx);
        return normalized;
      });
      if (typeof window !== 'undefined') {
        window.__MOTTO_ARCHIVE_FILES__ = ARCHIVE_FILES;
      }
      return ARCHIVE_FILES;
    })
    .catch((error) => {
      console.error('Failed to load archive manifest:', error);
      ARCHIVE_FILES = [];
      _archiveManifestPromise = null;
      if (typeof window !== 'undefined') {
        window.__MOTTO_ARCHIVE_FILES__ = ARCHIVE_FILES;
      }
      throw error;
    });
  return _archiveManifestPromise;
}

function setArchiveGridState(state, message) {
  if (!DOM.arcGrid) return;
  clearArchiveFocus();
  DOM.arcGrid.innerHTML = '';
  const notice = document.createElement('div');
  notice.className = 'archive-grid-state';
  if (state) {
    notice.classList.add(`archive-grid-state--${state}`);
  }
  notice.textContent = message;
  notice.setAttribute('role', 'status');
  notice.setAttribute('aria-live', 'polite');
  DOM.arcGrid.appendChild(notice);
  syncArchiveSpotlightClass();
}

function renderArchiveGrid(entries) {
  if (!DOM.arcGrid) return;
  DOM.arcGrid.innerHTML = '';
  if (!entries.length) {
    setArchiveGridState('empty', 'Archive coming soon');
    return;
  }
  const allowHoverScrub = window.matchMedia('(hover:hover)').matches
    && window.matchMedia('(pointer:fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  clearArchiveFocus();
  entries.forEach((item, index) => {
    const src = resolveAssetPath(item.src);
    if (!src) return;
    const isVideo = item.type === 'video' || /\.mp4(?:$|\?)/i.test(item.src || src);
    const fitMode = (item.fit || '').toLowerCase();
    const mediaClass = fitMode === 'contain'
      ? 'archive-media archive-media--contain'
      : 'archive-media';
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = index;
    cell.dataset.archiveSrc = item.src || '';
    if (item.key) {
      cell.dataset.key = item.key;
      cell.id = `archive-cell-${item.key}`;
    }
    const label = item.accessibleTitle || item.title || `Archive Item ${index + 1}`;
    cell.setAttribute('role', 'button');
    cell.setAttribute('aria-expanded', 'false');
    if (label) {
      cell.setAttribute('aria-label', label);
    } else {
      cell.removeAttribute('aria-label');
    }
    cell.tabIndex = 0;
    let media;
    if (isVideo) {
      const posterAttr = item.poster ? ` poster="${resolveAssetPath(item.poster)}"` : '';
      const loopAttr = item.loop === false ? '' : ' loop';
      media = `<div class="${mediaClass}"><video src="${src}" muted playsinline preload="metadata" data-archive-video${posterAttr}${loopAttr}></video></div>`;
    } else {
      const altText = label ? escapeHTML(label) : '';
      media = `<div class="${mediaClass}"><img src="${src}" alt="${altText}" loading="lazy"></div>`;
    }
    const title = item.title ? escapeHTML(item.title) : '';
    const typeLabel = item.displayType ? escapeHTML(item.displayType) : '';
    const caption = item.title
      ? `<div class="caption"><span class="caption-title">${title}</span>${typeLabel ? `<span class="caption-type">${typeLabel}</span>` : ''}</div>`
      : '';
    cell.innerHTML = `${media}${caption}`;
    cell.onclick = (event) => {
      event.preventDefault();
      if (cell.classList.contains('is-focus')) {
        closeArchiveDetail();
      } else {
        openArchiveDetail(item, cell);
      }
    };
    DOM.arcGrid.appendChild(cell);
    decorateArchiveCell(cell, item, allowHoverScrub);
  });
  syncArchiveSpotlightClass();
  if (ARCHIVE_PENDING_KEY) {
    const pendingKey = ARCHIVE_PENDING_KEY;
    const pendingScroll = ARCHIVE_PENDING_SCROLL;
    ARCHIVE_PENDING_KEY = null;
    ARCHIVE_PENDING_SCROLL = false;
    openArchiveByKey(pendingKey, { scroll: pendingScroll });
  }
}

function decorateArchiveCell(cell, item, allowHoverScrub) {
  if (!cell) return;
  const mediaEl = cell.querySelector('img, video');
  if (!mediaEl) {
    removeArchiveCell(cell, 'Archive item missing media.');
    return;
  }

  const onError = () => removeArchiveCell(cell, 'Some archive files were removed.');
  mediaEl.addEventListener('error', onError, { once: true });
  if (mediaEl.tagName === 'VIDEO') {
    mediaEl.addEventListener('stalled', onError, { once: true });
    mediaEl.loop = item.loop !== false;
  }

  const accentKey = (item.poster || item.preview || item.src || '').trim();
  if (accentKey) {
    if (ARCHIVE_ACCENT_CACHE.has(accentKey)) {
      setCellAccent(cell, ARCHIVE_ACCENT_CACHE.get(accentKey));
    } else {
      setCellAccent(cell, ARCHIVE_DEFAULT_COLOR);
      applyArchiveAccentToCell(cell, item, mediaEl, accentKey).catch(() => {});
    }
  } else {
    setCellAccent(cell, ARCHIVE_DEFAULT_COLOR);
  }

  const mediaWrapper = cell.querySelector('.archive-media');
  if (allowHoverScrub && mediaEl.tagName === 'VIDEO' && mediaWrapper) {
    mediaWrapper.style.setProperty('--scrub-progress', '0');
    mediaWrapper.dataset.scrub = '1';
    setupVideoHoverScrub(mediaEl, mediaWrapper);
  } else if (mediaWrapper) {
    mediaWrapper.style.removeProperty('--scrub-progress');
    delete mediaWrapper.dataset.scrub;
  }

  updateArchiveCaption(cell, item);

  if (!cell._archiveKeydown) {
    cell.addEventListener('keydown', (evt) => {
      if (evt.key === 'Enter' || evt.key === ' ') {
        evt.preventDefault();
        if (cell.classList.contains('is-focus')) {
          closeArchiveDetail();
        } else {
          const idx = Number.parseInt(cell.dataset.index || '-1', 10);
          const entry = ARCHIVE_FILES[idx] || item;
          openArchiveDetail(entry, cell);
        }
      }
    });
    cell._archiveKeydown = true;
  }
}

function spotlightEligible() {
  return !SPOTLIGHT_MEDIA_PREF.matches && !SPOTLIGHT_POINTER_PREF.matches;
}

function syncArchiveSpotlightClass() {
  if (!DOM.arcGrid) return;
  const hasCells = Boolean(DOM.arcGrid.querySelector('.cell'));
  const shouldEnable = ARCHIVE_SPOTLIGHT_ENABLED && hasCells && spotlightEligible();
  SPOTLIGHT_STATE.enabled = shouldEnable;
  DOM.arcGrid.classList.toggle('archive-grid--spotlight', shouldEnable);
  if (shouldEnable) {
    initArchiveSpotlight();
    scheduleSpotlightFrame(true);
  } else {
    stopSpotlightAnimation();
    setSpotlightTarget(50, 48, true);
    DOM.arcGrid.style.setProperty('--spotlight-intensity', '0');
    DOM.arcGrid.style.setProperty('--spotlight-secondary-intensity', '0');
  }
}

function initArchiveSpotlight() {
  if (!DOM.arcGrid || DOM.arcGrid._spotlightInit) return;
  const grid = DOM.arcGrid;
  const handlePointer = (event) => {
    if (!SPOTLIGHT_STATE.enabled) return;
    const type = event.pointerType;
    if (type && type !== 'mouse' && type !== 'pen') return;
    const rect = grid.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);
    setSpotlightTarget(x, y);
  };
  const handleLeave = () => {
    setSpotlightTarget(50, 48);
  };
  grid.addEventListener('pointermove', handlePointer);
  grid.addEventListener('pointerdown', handlePointer);
  grid.addEventListener('pointerleave', handleLeave);
  grid._spotlightInit = true;
  handleLeave();
}

function setSpotlightTarget(xPerc, yPerc, immediate = false) {
  const x = clamp(Number.isFinite(xPerc) ? xPerc : 50, 0, 100);
  const y = clamp(Number.isFinite(yPerc) ? yPerc : 48, 0, 100);
  SPOTLIGHT_STATE.targetX = x;
  SPOTLIGHT_STATE.targetY = y;
  if (immediate) {
    SPOTLIGHT_STATE.currentX = x;
    SPOTLIGHT_STATE.currentY = y;
    applySpotlightStyle(x, y);
  }
  scheduleSpotlightFrame();
}

function scheduleSpotlightFrame(force) {
  if (!SPOTLIGHT_STATE.enabled) return;
  if (force) {
    SPOTLIGHT_STATE.currentX = SPOTLIGHT_STATE.targetX;
    SPOTLIGHT_STATE.currentY = SPOTLIGHT_STATE.targetY;
    applySpotlightStyle(SPOTLIGHT_STATE.currentX, SPOTLIGHT_STATE.currentY);
  }
  if (SPOTLIGHT_STATE.raf) return;
  const step = () => {
    SPOTLIGHT_STATE.raf = null;
    if (!SPOTLIGHT_STATE.enabled) return;
    const lerp = ARCHIVE_IS_ANIMATING ? 0.14 : SPOTLIGHT_STATE.lerp;
    const nextX = SPOTLIGHT_STATE.currentX + (SPOTLIGHT_STATE.targetX - SPOTLIGHT_STATE.currentX) * lerp;
    const nextY = SPOTLIGHT_STATE.currentY + (SPOTLIGHT_STATE.targetY - SPOTLIGHT_STATE.currentY) * lerp;
    SPOTLIGHT_STATE.currentX = nextX;
    SPOTLIGHT_STATE.currentY = nextY;
    applySpotlightStyle(nextX, nextY);
    const settled = Math.abs(nextX - SPOTLIGHT_STATE.targetX) < 0.05
      && Math.abs(nextY - SPOTLIGHT_STATE.targetY) < 0.05;
    if (!settled) {
      SPOTLIGHT_STATE.raf = requestAnimationFrame(step);
    }
  };
  SPOTLIGHT_STATE.raf = requestAnimationFrame(step);
}

function stopSpotlightAnimation() {
  if (SPOTLIGHT_STATE.raf) {
    cancelAnimationFrame(SPOTLIGHT_STATE.raf);
    SPOTLIGHT_STATE.raf = null;
  }
}

function applySpotlightStyle(x, y) {
  const grid = DOM.arcGrid;
  if (!grid) return;
  const rect = grid.getBoundingClientRect();
  grid.style.setProperty('--spotlight-x', `${x}%`);
  grid.style.setProperty('--spotlight-y', `${y}%`);
  if (rect.width && rect.height) {
    const offsetBase = Math.min(Math.max(Math.min(rect.width, rect.height) * 0.04, 24), 36);
    const offsetX = clamp((((x / 100) * rect.width) + offsetBase) / rect.width * 100, 0, 100);
    const offsetY = clamp((((y / 100) * rect.height) + offsetBase * 0.6) / rect.height * 100, 0, 100);
    grid.style.setProperty('--spotlight-secondary-x', `${offsetX}%`);
    grid.style.setProperty('--spotlight-secondary-y', `${offsetY}%`);
  }
  const intensity = ARCHIVE_IS_ANIMATING ? 0.45 : 0.75;
  const secondary = ARCHIVE_IS_ANIMATING ? 0.28 : 0.41;
  grid.style.setProperty('--spotlight-intensity', intensity.toFixed(3));
  grid.style.setProperty('--spotlight-secondary-intensity', secondary.toFixed(3));
}

const SPOTLIGHT_PREF_HANDLERS = [SPOTLIGHT_MEDIA_PREF, SPOTLIGHT_POINTER_PREF];
SPOTLIGHT_PREF_HANDLERS.forEach((mq) => {
  if (!mq) return;
  const listener = () => syncArchiveSpotlightClass();
  if (typeof mq.addEventListener === 'function') mq.addEventListener('change', listener);
  else if (typeof mq.addListener === 'function') mq.addListener(listener);
});

function applyArchiveAccentToCell(cell, item, mediaEl, cacheKey) {
  if (!cell || !mediaEl) return Promise.resolve();
  if (ARCHIVE_ACCENT_CACHE.has(cacheKey)) {
    setCellAccent(cell, ARCHIVE_ACCENT_CACHE.get(cacheKey));
    return Promise.resolve();
  }

  if (mediaEl.tagName === 'IMG') {
    return new Promise((resolve) => {
      const compute = () => {
        try {
          const color = sampleColorFromImage(mediaEl) || ARCHIVE_DEFAULT_COLOR;
          ARCHIVE_ACCENT_CACHE.set(cacheKey, color);
          setCellAccent(cell, color);
        } catch (err) {
          // ignored
        }
        resolve();
      };
      if (mediaEl.complete && mediaEl.naturalWidth) {
        compute();
      } else {
        mediaEl.addEventListener('load', compute, { once: true });
      }
    });
  }

  const posterSrc = (item.poster && !/\.mp4(?:$|\?)/i.test(item.poster))
    ? resolveAssetPath(item.poster)
    : null;

  if (posterSrc) {
    return loadImageForAccent(posterSrc).then((color) => {
      if (!color) return;
      ARCHIVE_ACCENT_CACHE.set(cacheKey, color);
      setCellAccent(cell, color);
    }).catch(() => {});
  }

  if (mediaEl.tagName === 'VIDEO') {
    return extractAverageColorFromVideo(mediaEl)
      .then((color) => {
        if (!color) return;
        ARCHIVE_ACCENT_CACHE.set(cacheKey, color);
        setCellAccent(cell, color);
      })
      .catch(() => {});
  }

  return Promise.resolve();
}

function loadImageForAccent(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      try {
        resolve(sampleColorFromImage(img));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = reject;
    img.src = url;
  });
}

function sampleColorFromImage(img) {
  if (!ARCHIVE_COLOR_CONTEXT) return ARCHIVE_DEFAULT_COLOR;
  const width = Math.max(1, img.naturalWidth || img.width || 1);
  const height = Math.max(1, img.naturalHeight || img.height || 1);
  const targetWidth = Math.min(48, width);
  const targetHeight = Math.max(1, Math.round((height / width) * targetWidth));
  ARCHIVE_COLOR_CANVAS.width = targetWidth;
  ARCHIVE_COLOR_CANVAS.height = targetHeight;
  ARCHIVE_COLOR_CONTEXT.drawImage(img, 0, 0, targetWidth, targetHeight);
  return sampleAverageFromCanvas(targetWidth, targetHeight);
}

function extractAverageColorFromVideo(video) {
  if (!ARCHIVE_COLOR_CONTEXT) return Promise.resolve(ARCHIVE_DEFAULT_COLOR);
  return new Promise((resolve, reject) => {
    const attemptSample = () => {
      const width = Math.max(1, video.videoWidth || 1);
      const height = Math.max(1, video.videoHeight || 1);
      const targetWidth = Math.min(48, width);
      const targetHeight = Math.max(1, Math.round((height / width) * targetWidth));
      ARCHIVE_COLOR_CANVAS.width = targetWidth;
      ARCHIVE_COLOR_CANVAS.height = targetHeight;
      try {
        ARCHIVE_COLOR_CONTEXT.drawImage(video, 0, 0, targetWidth, targetHeight);
        resolve(sampleAverageFromCanvas(targetWidth, targetHeight));
      } catch (err) {
        reject(err);
      }
    };

    const finish = () => {
      try { video.pause(); } catch (err) { /* noop */ }
      attemptSample();
    };

    const prepareFrame = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        finish();
        return;
      }
      const previous = video.currentTime;
      const target = clamp(video.duration * 0.12, 0, Math.max(video.duration - 0.1, 0));
      const handleSeek = () => {
        video.removeEventListener('seeked', handleSeek);
        finish();
        try { video.currentTime = previous; } catch (err) { /* noop */ }
      };
      video.addEventListener('seeked', handleSeek, { once: true });
      try {
        video.currentTime = target;
      } catch (err) {
        video.removeEventListener('seeked', handleSeek);
        finish();
      }
    };

    if (video.readyState >= 2 && video.videoWidth) {
      prepareFrame();
      return;
    }

    const onLoaded = () => {
      video.removeEventListener('loadeddata', onLoaded);
      prepareFrame();
    };
    video.addEventListener('loadeddata', onLoaded, { once: true });
    try {
      video.preload = 'auto';
      video.load();
    } catch (err) {
      setTimeout(() => {
        video.removeEventListener('loadeddata', onLoaded);
        finish();
      }, 0);
    }
  });
}

function sampleAverageFromCanvas(width, height) {
  if (!ARCHIVE_COLOR_CONTEXT) return ARCHIVE_DEFAULT_COLOR;
  const data = ARCHIVE_COLOR_CONTEXT.getImageData(0, 0, width, height).data;
  let total = 0;
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 16) continue;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    total += 1;
  }
  if (!total) return ARCHIVE_DEFAULT_COLOR;
  return [r / total, g / total, b / total];
}

function setCellAccent(cell, rgb) {
  if (!cell || !rgb) return;
  const [r, g, b] = rgb;
  const accent = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 0.92)`; // Accent alpha knob ↑ for stronger edge glow
  const soft = `rgba(${mixChannel(r, 255, 0.65)}, ${mixChannel(g, 255, 0.65)}, ${mixChannel(b, 255, 0.65)}, 0.32)`; // Mix ratio 0.65 controls frame tint softness
  const shadow = `rgba(${mixChannel(r, 0, 0.7)}, ${mixChannel(g, 0, 0.7)}, ${mixChannel(b, 0, 0.7)}, 0.65)`; // Shadow ratio 0.7 deepens neon halo
  cell.style.setProperty('--archive-accent', accent);
  cell.style.setProperty('--archive-accent-soft', soft);
  cell.style.setProperty('--archive-accent-shadow', shadow);
}

function mixChannel(value, target, ratio) {
  return Math.round(value * (1 - ratio) + target * ratio);
}

function resetInlineVideos(excludeCell) {
  if (!DOM.arcGrid) return;
  DOM.arcGrid.querySelectorAll('video[data-inline-active]').forEach((video) => {
    if (excludeCell && excludeCell.contains(video)) return;
    try {
      video.pause();
      video.currentTime = 0;
    } catch (err) {
      /* noop */
    }
    video.controls = false;
    video.removeAttribute('data-inline-active');
    video.muted = true;
    video.loop = true;
  });
}

function updateArchiveCaption(cell, item) {
  const caption = cell.querySelector('.caption');
  if (!caption) return;
  const title = item?.title ? escapeHTML(item.title) : '';
  const typeLabel = item?.displayType ? escapeHTML(item.displayType) : '';
  caption.innerHTML = title
    ? `<span class="caption-title">${title}</span>${typeLabel ? `<span class="caption-type">${typeLabel}</span>` : ''}`
    : '';
}

function setupVideoHoverScrub(video, wrapper) {
  if (!video || !wrapper) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let raf = null;
  let pendingTime = null;
  let scrubbing = false;

  const ensureReady = () => {
    if (video.readyState >= 2 && Number.isFinite(video.duration) && video.duration > 0) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const handle = () => {
        video.removeEventListener('loadeddata', handle);
        resolve();
      };
      video.addEventListener('loadeddata', handle, { once: true });
      try {
        video.preload = 'auto';
        video.load();
      } catch (err) {
        resolve();
      }
    });
  };

  const updateTime = () => {
    raf = null;
    if (!scrubbing || !Number.isFinite(pendingTime)) return;
    try {
      video.currentTime = pendingTime;
    } catch (err) {
      // ignore
    }
  };

  const handleMove = (event) => {
    if (!scrubbing || ARCHIVE_IS_ANIMATING) return;
    const rect = wrapper.getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / (rect.width || 1), 0, 1);
    wrapper.style.setProperty('--scrub-progress', ratio.toFixed(4));
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    pendingTime = ratio * video.duration;
    if (!raf) raf = requestAnimationFrame(updateTime);
  };

  const handleEnter = () => {
    if (ARCHIVE_IS_ANIMATING) return;
    ensureReady().then(() => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      try { video.pause(); } catch (err) { /* noop */ }
      scrubbing = true;
    });
  };

  const handleLeave = () => {
    scrubbing = false;
    wrapper.style.setProperty('--scrub-progress', '0');
    if (raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
    pendingTime = null;
    try { video.currentTime = 0; } catch (err) { /* noop */ }
  };

  wrapper.addEventListener('mousemove', handleMove);
  wrapper.addEventListener('mouseenter', handleEnter);
  wrapper.addEventListener('mouseleave', handleLeave);
  wrapper.addEventListener('focusin', handleEnter);
  wrapper.addEventListener('focusout', handleLeave);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function runArchiveTransition(mutator) {
  if (typeof mutator !== 'function') return;
  const grid = DOM.arcGrid;
  const begin = () => {
    ARCHIVE_IS_ANIMATING = true;
    if (grid) {
      grid.classList.add('is-animating');
    }
    if (ARCHIVE_TRANSITION_TIMER) {
      clearTimeout(ARCHIVE_TRANSITION_TIMER);
    }
    if (SPOTLIGHT_STATE.enabled) {
      scheduleSpotlightFrame(true);
    }
  };
  const end = () => {
    if (ARCHIVE_TRANSITION_TIMER) clearTimeout(ARCHIVE_TRANSITION_TIMER);
    ARCHIVE_TRANSITION_TIMER = setTimeout(() => {
      ARCHIVE_IS_ANIMATING = false;
      if (grid) grid.classList.remove('is-animating');
      ARCHIVE_TRANSITION_TIMER = null;
      if (SPOTLIGHT_STATE.enabled) {
        scheduleSpotlightFrame(true);
      }
    }, 420);
  };
  begin();
  if (document.startViewTransition) {
    try {
      const vt = document.startViewTransition(() => {
        mutator();
      });
      vt?.finished?.then(end).catch(end);
      return;
    } catch (err) {
      // graceful fallback
    }
  }
  mutator();
  requestAnimationFrame(() => end());
}

function applyArchiveFocus(cell) {
  if (!DOM.arcGrid || !cell) return;
  resetInlineVideos(cell);
  const apply = () => {
    DOM.arcGrid.classList.add('is-focused', 'has-active');
    const cells = DOM.arcGrid.querySelectorAll('.cell');
    cells.forEach((el) => {
      const isFocus = el === cell;
      el.classList.toggle('is-focus', isFocus);
      el.classList.toggle('is-dim', !isFocus);
      el.setAttribute('aria-expanded', isFocus ? 'true' : 'false');
    });
  };
  runArchiveTransition(apply);
}

function clearArchiveFocus() {
  if (!DOM.arcGrid) return;
  const apply = () => {
    DOM.arcGrid.classList.remove('is-focused', 'has-active');
    DOM.arcGrid.querySelectorAll('.cell').forEach((el) => {
      el.classList.remove('is-active');
      el.classList.remove('is-focus', 'is-dim');
      el.setAttribute('aria-expanded', 'false');
    });
  };
  resetInlineVideos();
  runArchiveTransition(apply);
  ARC_ACTIVE_CELL = null;
  ARCHIVE_ACTIVE_INDEX = -1;
  ARCHIVE_ACTIVE_KEY = null;
}

function updateArchiveHash(key) {
  const target = key
    ? `#archive:${encodeURIComponent(key.toLowerCase())}`
    : '#archive';
  if (window.location.hash === target) return;
  history.replaceState(null, '', target);
}

function openArchiveByKey(key, options = {}) {
  if (!key) return false;
  const normalized = key.toLowerCase();
  const index = ARCHIVE_KEY_TO_INDEX.get(normalized);
  if (index == null) {
    ARCHIVE_PENDING_KEY = normalized;
    ARCHIVE_PENDING_SCROLL = Boolean(options.scroll);
    return false;
  }
  const entry = ARCHIVE_FILES[index];
  if (!entry) return false;
  const cell = DOM.arcGrid?.querySelector(`.cell[data-key="${normalized}"]`);
  if (!cell) {
    ARCHIVE_PENDING_KEY = normalized;
    ARCHIVE_PENDING_SCROLL = Boolean(options.scroll);
    return false;
  }
  openArchiveDetail(entry, cell);
  if (options.scroll && cell.scrollIntoView) {
    cell.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
  return true;
}

function navigateArchive(step) {
  if (!Number.isFinite(step) || !ARCHIVE_FILES.length) return;
  let next = ARCHIVE_ACTIVE_INDEX;
  if (next === -1) {
    next = 0;
  }
  next = (next + ARCHIVE_FILES.length + step) % ARCHIVE_FILES.length;
  const entry = ARCHIVE_FILES[next];
  if (!entry) return;
  const cell = DOM.arcGrid?.querySelector(`.cell[data-index="${next}"]`);
  if (!cell) {
    ARCHIVE_PENDING_KEY = entry.key;
    ARCHIVE_PENDING_SCROLL = true;
    openArchiveByKey(entry.key, { scroll: true });
    return;
  }
  resetInlineVideos(cell);
  openArchiveDetail(entry, cell);
  cell.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

function parseArchiveHash() {
  const hash = (window.location.hash || '').replace(/^#/, '');
  if (!hash) return { open: false, key: null };
  if (!hash.toLowerCase().startsWith('archive')) return { open: false, key: null };
  const parts = hash.split(':');
  const rawKey = parts[1] ? decodeURIComponent(parts[1]) : null;
  return { open: true, key: rawKey ? rawKey.toLowerCase() : null };
}

function handleArchiveHashChange() {
  const { open, key } = parseArchiveHash();
  if (!open) {
    if (isModalActive(DOM.arcModal)) {
      closeModal(DOM.arcModal);
    }
    return;
  }
  if (!isModalActive(DOM.arcModal)) {
    ARCHIVE_PENDING_KEY = key;
    ARCHIVE_PENDING_SCROLL = Boolean(key);
    openArchive();
    return;
  }
  if (key) {
    if (!openArchiveByKey(key, { scroll: true })) {
      ARCHIVE_PENDING_KEY = key;
      ARCHIVE_PENDING_SCROLL = true;
    }
  } else if (DOM.arcDetail && DOM.arcDetail.classList.contains('has-selection')) {
    closeArchiveDetail();
  }
}

function openArchive() {
  if (!DOM.arcGrid) return;
  closeArchiveDetail({ skipHash: true });
  setSpotlightTarget(50, 48, true);
  setArchiveGridState('loading', 'Loading archive…');
  openModal(DOM.arcModal);
  if (!window.location.hash.startsWith('#archive')) {
    updateArchiveHash(null);
  }
  ensureArchiveManifest({ force: true })
    .then((entries) => {
      if (!entries.length) {
        setArchiveGridState('empty', 'Archive coming soon');
        return;
      }
      renderArchiveGrid(entries);
    })
    .catch(() => {
      setArchiveGridState('error', 'Unable to load archive right now.');
    });
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

function removeArchiveCell(cell, emptyMessage) {
  if (!cell) return;
  const grid = cell.parentElement;
  const wasFocused = cell === ARC_ACTIVE_CELL;
  cell.replaceWith();
  if (!grid) return;
  if (wasFocused) {
    closeArchiveDetail();
  }
  if (!grid.querySelector('.cell')) {
    setArchiveGridState('empty', emptyMessage || 'Archive coming soon');
  } else {
    syncArchiveSpotlightClass();
  }
}

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
  DOM.vol.oninput = () => {
    if (A) A.volume = parseFloat(DOM.vol.value);
    updateVolumeFill();
  };
  DOM.vol.addEventListener('change', updateVolumeFill);
  DOM.muteBtn.onclick = () => {
    if (!A) return;
    A.muted = !A.muted;
    updateMuteBtn();
  };
  updateMuteBtn();
  updateVolumeFill();
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
  if (!DOM.playBtn) return;
  const iconEl = DOM.playBtn.querySelector('.audio-icon');
  if (iconEl) {
    iconEl.classList.toggle('audio-icon--pause', playing);
    iconEl.classList.toggle('audio-icon--play', !playing);
  }
  DOM.playBtn.classList.toggle('is-playing', playing);
  DOM.playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
}
function updateMuteBtn() {
  const muted = Boolean(A && A.muted);
  if (DOM.muteBtn) {
    DOM.muteBtn.classList.toggle('is-muted', muted);
    DOM.muteBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
  }
}
function updateVolumeFill() {
  if (!DOM.vol) return;
  const raw = Number.parseFloat(DOM.vol.value || '0');
  const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 1) : 0;
  const percent = `${Math.round(clamped * 100)}%`;
  DOM.vol.style.setProperty('--vol', percent);
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
    const gap = Math.max(4, Math.min(containerWidth * 0.015, 8));
    const start = containerWidth;
    const distance = textWidth + containerWidth + gap;
    const speed = 220;
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
  openAboutSection('brand-home');
});
DOM.immBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  handleImmortalsEntryRequest('nav-link');
});
DOM.arcBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  playTransitionOverlay(() => openArchive(), NAV_OVERLAY_DEFAULTS);
});
DOM.aboutBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  openAboutSection('nav-link');
});
DOM.nftBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  openNftView('nav-link');
});

let brandGlitchTimer = null;
function triggerBrandGlitch(duration = 3200) {
  if (!DOM.homeBtn) return;
  if (DOM.homeBtn.classList.contains('is-glitching')) {
    DOM.homeBtn.classList.remove('is-glitching');
    // Force reflow to restart CSS animations
    void DOM.homeBtn.offsetWidth;
  }
  DOM.homeBtn.classList.add('is-glitching');
  if (brandGlitchTimer) clearTimeout(brandGlitchTimer);
  brandGlitchTimer = setTimeout(() => {
    DOM.homeBtn?.classList.remove('is-glitching');
    brandGlitchTimer = null;
  }, duration);
}
function endBrandGlitch() {
  if (!DOM.homeBtn) return;
  if (brandGlitchTimer) {
    clearTimeout(brandGlitchTimer);
    brandGlitchTimer = null;
  }
  DOM.homeBtn.classList.remove('is-glitching');
}
function initMobileBrandGlitch() {
  if (!DOM.homeBtn || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
  const mediaQueries = [
    window.matchMedia('(pointer: coarse)'),
    window.matchMedia('(hover: none)')
  ];
  const shouldEnable = () => mediaQueries.some((mq) => mq.matches);

  const unbind = () => {
    if (!DOM.homeBtn._glitchBound) return;
    const events = DOM.homeBtn._glitchEvents || [];
    events.forEach(([type, handler, opts]) => DOM.homeBtn.removeEventListener(type, handler, opts));
    DOM.homeBtn._glitchEvents = null;
    DOM.homeBtn._glitchBound = false;
    endBrandGlitch();
  };

  const glitchHandler = () => triggerBrandGlitch();
  const bind = () => {
    if (DOM.homeBtn._glitchBound) return;
    const events = [
      ['pointerdown', glitchHandler, false],
      ['touchstart', glitchHandler, { passive: true }],
      ['focus', glitchHandler, false],
      ['pointerup', endBrandGlitch, false],
      ['pointercancel', endBrandGlitch, false],
      ['pointerleave', endBrandGlitch, false],
      ['blur', endBrandGlitch, false]
    ];
    events.forEach(([type, handler, opts]) => DOM.homeBtn.addEventListener(type, handler, opts));
    DOM.homeBtn._glitchEvents = events;
    DOM.homeBtn._glitchBound = true;
  };

  const apply = () => {
    if (shouldEnable()) {
      bind();
    } else {
      unbind();
    }
  };

  apply();
  const handleChange = () => apply();
  mediaQueries.forEach((mq) => {
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handleChange);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(handleChange);
    }
  });
}
initMobileBrandGlitch();

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && DOM.intro && DOM.intro.style.display !== 'none') { DOM.enterBtn?.click(); }
  if (e.key === 'Escape') {
    let closed = false;
    if (DOM.arcDetail && DOM.arcDetail.classList.contains('has-selection')) { closeArchiveDetail(); closed = true; }
    if (isModalActive(DOM.immDModal)) { closeModal(DOM.immDModal, { reopenImm: false }); closed = true; }
    if (isModalActive(DOM.immModal)) { closeModal(DOM.immModal); closed = true; }
    if (isModalActive(DOM.arcModal)) { closeModal(DOM.arcModal); closed = true; }
    if (isModalActive(DOM.charModal)) { closeModal(DOM.charModal); closed = true; }
    if (closed) return;
  }
  if (isModalActive(DOM.arcModal) && ARCHIVE_ACTIVE_KEY) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigateArchive(1);
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateArchive(-1);
      return;
    }
  }
});
function openArchiveDetail(entry, sourceCell) {
  const item = entry && typeof entry === 'object' ? entry : { src: entry };
  const src = resolveAssetPath(item?.src);
  if (!src) return;
  let cell = sourceCell;
  if (!cell && item?.key) {
    cell = DOM.arcGrid?.querySelector(`.cell[data-key="${item.key}"]`);
  }
  if (!cell) {
    if (item?.key) {
      ARCHIVE_PENDING_KEY = item.key.toLowerCase();
      ARCHIVE_PENDING_SCROLL = true;
    }
    return;
  }

  if (ARCHIVE_PENDING_KEY) {
    ARCHIVE_PENDING_KEY = null;
    ARCHIVE_PENDING_SCROLL = false;
  }

  DOM.arcGrid?.querySelectorAll('.cell.is-active').forEach((el) => {
    if (el !== cell) el.classList.remove('is-active');
  });
  cell.classList.add('is-active');
  ARC_ACTIVE_CELL = cell;

  const index = Number.parseInt(cell.dataset.index || (item?.index ?? -1), 10);
  ARCHIVE_ACTIVE_INDEX = Number.isFinite(index) ? index : ARCHIVE_ACTIVE_INDEX;
  ARCHIVE_ACTIVE_KEY = (item?.key || cell.dataset.key || generateArchiveKey(item, index)).toLowerCase();

  applyArchiveFocus(cell);

  try {
    cell.focus({ preventScroll: ARCHIVE_PENDING_SCROLL });
  } catch (err) {
    // ignore
  }

  updateArchiveHash(ARCHIVE_ACTIVE_KEY);
  ARCHIVE_PENDING_SCROLL = false;

  const mediaWrapper = cell.querySelector('.archive-media');
  const mediaEl = mediaWrapper?.querySelector('img, video');
  if (mediaEl && mediaEl.tagName === 'VIDEO') {
    mediaEl.dataset.inlineActive = '1';
    mediaEl.controls = true;
    mediaEl.loop = item?.loop !== false;
    mediaEl.muted = true;
    try { mediaEl.play(); } catch (err) { /* noop */ }
  }

  updateArchiveCaption(cell, item);
  DOM.arcDetail?.classList.add('has-selection');
  syncArchiveSpotlightClass();
}

function closeArchiveDetail(opts = {}) {
  const detailEl = DOM.arcDetail;
  const hadSelection = detailEl?.classList.contains('has-selection');
  if (ARC_ACTIVE_CELL) {
    ARC_ACTIVE_CELL.classList.remove('is-active');
    ARC_ACTIVE_CELL = null;
  }
  clearArchiveFocus();
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
  detailEl?.classList.remove('has-selection');
  DOM.arcGrid?.classList.remove('hidden');
  ARCHIVE_ACTIVE_INDEX = -1;
  ARCHIVE_ACTIVE_KEY = null;
  if (hadSelection && !opts.skipHash) {
    updateArchiveHash(null);
  }
  syncArchiveSpotlightClass();
  setSpotlightTarget(50, 48, true);
}

ensureImmortalsData().catch((err) => {
  console.error('Initial Immortals preload failed:', err);
});

ensureArchiveManifest().catch((err) => {
  console.warn('Archive manifest preload failed:', err);
});

handleInitialViewRequest();

window.MottoArchive = window.MottoArchive || {};
window.MottoArchive.setSpotlight = (enabled = true) => {
  ARCHIVE_SPOTLIGHT_ENABLED = Boolean(enabled);
  syncArchiveSpotlightClass();
  return ARCHIVE_SPOTLIGHT_ENABLED;
};
window.MottoArchive.toggleSpotlight = () => {
  ARCHIVE_SPOTLIGHT_ENABLED = !ARCHIVE_SPOTLIGHT_ENABLED;
  syncArchiveSpotlightClass();
  return ARCHIVE_SPOTLIGHT_ENABLED;
};
window.MottoArchive.disableOverlay = true;

window.addEventListener('hashchange', handleArchiveHashChange);
handleArchiveHashChange();
