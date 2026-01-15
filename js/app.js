// ====== DEV TOGGLES ======
const ENABLE_AUDIO = true;
const SHOW_LEGEND_PINS = false;
const LEGEND_PIN_COUNT = 1;
const DUR_SHORT = 120;
const DUR_MEDIUM = 240;
const DUR_LONG = 480;

// ====== External Links ======
const LINK_CONFIG = (typeof window !== 'undefined' && window.MOTTO_LINKS)
  ? window.MOTTO_LINKS
  : {};
const SPOTIFY_URL = LINK_CONFIG.spotify || '#';
const YOUTUBE_URL = LINK_CONFIG.youtube || '#';
const SHOP_URL = LINK_CONFIG.shop || '#';
const TWITTER_URL = LINK_CONFIG.twitter || 'https://x.com/motto_7777';
const IG_URL = LINK_CONFIG.instagram || 'https://www.instagram.com/mottttooooooo/';
const TT_URL = LINK_CONFIG.tt || 'https://www.youtube.com/@motto_7777';
const NFT_COLLECTION_URL = LINK_CONFIG.nftCollection
  || 'https://crypto.com/nft/drops-event/7757a25297e2ba222ccf68f367e614f4?tab=shop';

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

const INTRO_LOGO_STATIC_SRC = 'assets/images/motto_profile_static.webp';
const INTRO_LOGO_ANIMATED_SRC = 'assets/images/motto_profile.gif';
const INTRO_LOGO_MOTION_PREF = (typeof window !== 'undefined' && typeof window.matchMedia === 'function')
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null;

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

const LANGUAGES = Object.freeze({
  KR: 'kr',
  EN: 'en'
});

const LANGUAGE_LABELS = Object.freeze({
  en: 'English',
  kr: '한국어'
});

let CURRENT_LANG = LANGUAGES.EN;

const ABOUT_CONTENT = Object.freeze({
  en: {
    hero: {
      eyebrow: 'ABOUT · PROJECT 7777',
      title: 'MOTTO 7777',
      sublines: [
        'Audio-visual web artbook project by Sean Woong & Haz Haus.',
        '7 archetypes · 7,777 artworks · 7-track OST.'
      ]
    },
    credits: [],
    stats: [
      { label: 'IMMORTALS', value: '77', caption: '77 looping motion-portrait NFTs at the core of MOTTO 7777.' },
      { label: 'PACKS', value: '7', caption: 'Dealer, Skull, Rockstar, Drag, Military, Motorcycle, Boxer.' },
      { label: 'OST', value: '7', caption: 'Original tracks by Haz Haus & oo.sean.' },
      { label: 'SUPPLY', value: '7,777', caption: '7,700 main collection NFTs + 77 Immortals motion portrait NFTs.' }
    ],
    chapters: [
      {
        title: 'Chapter 1: World of 7777',
        logline: 'glitch · loop · 7 archetypes',
        lines: [
          'MOTTO 7777 is an audio-visual web artbook by Sean Woong & Haz Haus.',
          'In the year 7,777, humanity’s last echo melts into glitch and loop.',
          'Seven archetypes (Dealer, Skull, Rockstar, Drag, Military, Motorcycle, Boxer) drift through signal, circuit, and emotion.',
          'When memory fractures, what remains?'
        ]
      },
      {
        title: 'Chapter 2: Survival Battle',
        logline: 'DROP → T+14 DAYS → KIA / SURVIVE',
        lines: [
          'DROP → T+14 DAYS → KIA / SURVIVE',
          '7,777 NFTs (7,700 main pack + 77 Immortals)',
          'T+14 days after the drop, 50% of the main pack updates to “Killed in Action” (KIA), replacing the original artwork with the KIA version.',
          'The remaining 50% survive and keep the original artwork.',
          'KIA-updated NFTs can be held/traded only inside Crypto.com NFT (no external withdrawals).'
        ]
      },
      {
        title: 'Chapter 3: Holder Benefits',
        logline: 'OST · mini-game · merch · governance',
        lines: [
          'OST downloads',
          'Future mini-game access',
          'Physical merchandise packages (e.g., NFC keyring prototype)',
          'Governance rewards (eligibility-based)'
        ]
      }
    ],
    pillars: [
      {
        id: 'immortals',
        eyebrow: 'IMMORTALS GRID',
        title: 'IMMORTALS GRID',
        body: [
          '77 looping motion portraits built from the seven packs.',
          'This grid is where you explore the 77 Immortals and their featured cuts in one place.'
        ]
      },
      {
        id: 'archive',
        eyebrow: 'ARCHIVE WALL',
        title: 'ARCHIVE WALL',
        body: [
          'Posters, behind-the-scenes cuts, memes and side experiments from MOTTO 7777.',
          'This is where the process stays visible instead of being hidden.'
        ]
      },
      {
        id: 'sound',
        eyebrow: 'SOUND / OST',
        title: 'SOUND / OST',
        body: [
          'A custom score and live edits for this world by Haz Haus × oo.sean.',
          'The OST and live edits sit here so every loop and drop has a mood under it.'
        ]
      },
      {
        id: 'drops',
        eyebrow: 'DROPS / COLLECTORS',
        title: 'DROPS / COLLECTORS',
        body: [
          'Enter the MOTTO 7777 drop on Crypto.com NFT.',
          'View the full 7,777-piece collection, trade pack NFTs, and collect Immortals directly from the marketplace.'
        ]
      }
    ],
    ctaNote: 'Pick where to enter: characters through IMMORTALS, process through ARCHIVE, the sound of the world through the OST, or the full drop via the NFT tab.',
    ctas: [
      { label: 'ENTER IMMORTALS', shortLabel: 'CHARACTERS', action: 'immortals' },
      { label: 'BROWSE ARCHIVE', shortLabel: 'ARCHIVE', action: 'archive' },
      { label: 'LISTEN TO OST', shortLabel: 'OST', action: 'music' },
      { label: 'GO TO NFT DROP', shortLabel: 'NFT DROP', action: 'nft' }
    ]
  },
  kr: {
    hero: {
      eyebrow: 'ABOUT · 프로젝트 7777',
      title: 'MOTTO 7777',
      sublines: [
        'Sean Woong과 Haz Haus의 오디오-비주얼 웹 아트북 프로젝트.',
        '7 아키타입 · 7,777 아트워크 · 7트랙 OST.'
      ]
    },
    credits: [],
    stats: [
      { label: 'IMMORTALS', value: '77', caption: 'MOTTO 7777의 코어에 있는 77개의 루핑 모션 포트레이트 NFT.' },
      { label: 'PACKS', value: '7', caption: 'Dealer · Skull · Rockstar · Drag · Military · Motorcycle · Boxer' },
      { label: 'OST', value: '7', caption: 'Haz Haus × oo.sean 오리지널 트랙.' },
      { label: 'SUPPLY', value: '7,777', caption: '7,700 main collection + 77 Immortals 모션 포트레이트.' }
    ],
    chapters: [
      {
        title: 'Chapter 1: 7777 세계관',
        logline: 'glitch · loop · 7 아키타입',
        lines: [
          'MOTTO 7777은 Sean Woong & Haz Haus의 오디오-비주얼 웹 아트북.',
          '7777년, 인류의 마지막 에코가 글리치와 루프로 녹아듦.',
          '7 아키타입(Dealer, Skull, Rockstar, Drag, Military, Motorcycle, Boxer)이 신호·회로·감정을 통해 떠돔.',
          '기억이 파편화될 때, 무엇이 남을까?'
        ]
      },
      {
        title: 'Chapter 2: Survival Battle',
        logline: 'DROP → T+14일 → KIA / SURVIVE',
        lines: [
          '총 7,777 NFTs (7,700 main + 77 Immortals)',
          'T+14일: main 50% KIA(원본 파괴), 50% Survive',
          'KIA는 Crypto.com NFT 내부 거래만 가능'
        ]
      },
      {
        title: 'Chapter 3: 홀더 혜택',
        logline: 'OST · 미니게임 · 머치 · 거버넌스',
        lines: [
          'OST 다운로드',
          '미래 미니게임',
          '물리 머천다이즈 (NFC 키링 프로토)',
          '거버넌스 리워드'
        ]
      }
    ],
    pillars: [
      {
        id: 'immortals',
        eyebrow: 'IMMORTALS GRID',
        title: 'IMMORTALS GRID',
        body: [
          '7개의 팩에서 파생된 77 루핑 모션 포트레이트.',
          '이 그리드에서 77 Immortals와 주요 컷을 한 번에 탐색합니다.'
        ]
      },
      {
        id: 'archive',
        eyebrow: 'ARCHIVE WALL',
        title: 'ARCHIVE WALL',
        body: [
          '포스터, 비하인드 컷, 밈, 사이드 실험—과정이 숨지 않고 남는 벽.'
        ]
      },
      {
        id: 'sound',
        eyebrow: 'SOUND / OST',
        title: 'SOUND / OST',
        body: [
          'Haz Haus × oo.sean이 함께 만든 이 세계의 커스텀 스코어와 라이브 에딧.'
        ]
      },
      {
        id: 'drops',
        eyebrow: 'DROPS / COLLECTORS',
        title: 'DROPS / COLLECTORS',
        body: [
          'Crypto.com NFT에서 전체 7,777 컬렉션을 확인하고 수집/거래.'
        ]
      }
    ],
    ctaNote: 'IMMORTALS로 캐릭터를, ARCHIVE로 과정을, OST로 무드를, NFT 탭으로 전체 드롭을.',
    ctas: [
      { label: 'ENTER IMMORTALS', shortLabel: '캐릭터', action: 'immortals' },
      { label: 'BROWSE ARCHIVE', shortLabel: '아카이브', action: 'archive' },
      { label: 'LISTEN TO OST', shortLabel: 'OST', action: 'music' },
      { label: 'GO TO NFT DROP', shortLabel: 'NFT', action: 'nft' }
    ]
  }
});

const NFT_CONTENT = Object.freeze({
  en: {
    hero: {
      eyebrow: 'NFT',
      title: 'MOTTO 7777 · NFT DROP',
      subtext: 'Survival Battle: MOTTO 7777 on the Cronos chain via Crypto.com NFT.',
      intro: 'MOTTO 7777 is an audio-visual Cronos collection by Sean Woong and Haz Haus. Seven archetypes, 7,777 NFTs and a 7-track OST are tied into one world called “Survival Battle: MOTTO 7777.”'
    },
    sections: {
      main: {
        title: 'Main drop — MOTTO pack (7,700)',
        logline: '7,700 hand-drawn composite portraits',
        body: [
          'The main drop is a 7,700-piece MOTTO pack drawn by Sean Woong. Each NFT is a hand-drawn composite portrait built from layered traits and glitches across the seven archetypes.',
          'Traits are assembled through a generative system, then curated down into 7,700 final pieces — not auto-generated noise, but a selected layer of the world.'
        ]
      },
      immortals: {
        title: 'Immortals & Legends (77)',
        logline: '77 looping motion portraits + 8-bit OST memory',
        body: [
          'Alongside the MOTTO pack, 77 Immortal NFTs sit at the core of MOTTO 7777. They are animated motion portraits that loop an 8-bit reimagining of the original MOTTO OST, as if the soundtrack survived only as game-console memory.',
          'Within the 77, seven Legend pieces form the innermost core — images that refuse to fade, replaying the question of who stays, who is erased, and who turns into myth.'
        ]
      },
      rules: {
        title: 'Game rules — Survival Battle',
        logline: 'DROP → T+14 DAYS → KIA / SURVIVE',
        intro: 'Total supply is 7,777 NFTs across the collection: 7,700 MOTTO pack NFTs plus 77 Immortals and legends. The pack is where the Survival Battle rules actually move.',
        label: 'Key rules:',
        list: [
          'Two weeks after the drop window closes, 50% of the MOTTO pack (non-Immortals) will be updated on-chain with “Killed in Action” (KIA) artwork.',
          'The remaining 50% of the MOTTO pack effectively “Survive” the battle and retain their original artwork.',
          'Until that KIA update, all assets can be traded freely inside the “Survival Battle: MOTTO 7777” collection on Crypto.com NFT.',
          'After the KIA update, MOTTO pack NFTs will not be withdrawable outside Crypto.com NFT. Immortals and Legends may follow separate rules as defined on Crypto.com NFT. Check the official event details on Crypto.com for the full terms.'
        ]
      },
      utility: {
        title: 'Holder utilities',
        logline: 'OST · mini-game · merch · governance',
        body: [
          'MOTTO 7777 NFTs come with more than just artwork. Holders may gain access to utilities such as soundtrack download links, future mini-game entries, occasional physical merchandise packages, and future governance-related rewards, depending on eligibility and conditions. Exact amounts, conditions and timelines are explained on Crypto.com NFT and in the official “Motto 7777 NFT Collection – Reward Utility Terms & Conditions.”',
          'NFC mini-CD keyring (Prototype) is showcased in the MERCH / REWARDS tab.'
        ]
      },
      cta: {
        copy: 'Enter the drop from here — view the full collection while the rest of the site stays active.',
        label: 'View collection on Crypto.com NFT'
      }
    }
  },
  kr: {
    hero: {
      eyebrow: 'NFT',
      title: 'MOTTO 7777 · NFT DROP',
      subtext: 'Survival Battle: Crypto.com NFT를 통한 Cronos 체인 드롭.',
      intro: 'MOTTO 7777은 Sean Woong × Haz Haus의 오디오-비주얼 Cronos 컬렉션입니다.\n7 아키타입, 7,777 NFTs, 7트랙 OST가 하나의 세계 “Survival Battle: MOTTO 7777”로 묶입니다.'
    },
    sections: {
      main: {
        title: 'Main drop — MOTTO pack (7,700)',
        logline: '7,700 핸드 드로잉 컴포지트 포트레이트',
        body: [
          '메인 드롭은 Sean Woong이 그린 7,700 피스 MOTTO pack입니다.',
          '각 NFT는 7 아키타입 전반의 레이어드 트레잇과 글리치를 조합한 핸드 드로잉 컴포지트 포트레이트로 구성됩니다.',
          '트레잇은 제너러티브 시스템으로 조합되지만, 최종 7,700 피스는 큐레이션을 거쳐 선택된 결과물입니다.',
          '자동 생성 노이즈가 아니라, 세계의 ‘선택된 층’만 남깁니다.'
        ]
      },
      immortals: {
        title: 'Immortals & Legends (77)',
        logline: '77 루핑 모션 포트레이트 + 8-bit OST 메모리',
        body: [
          'MOTTO pack과 함께, MOTTO 7777의 코어에는 77개의 Immortal NFTs가 존재합니다.',
          '이들은 애니메이션 루핑 모션 포트레잇이며, 원본 MOTTO OST를 8-bit로 재해석한 루프를 품고 있습니다—사운드트랙이 게임 콘솔의 메모리처럼 살아남은 것처럼.',
          '77개 안쪽에는 7개의 Legend가 가장 깊은 코어를 이룹니다.',
          '사라지지 않는 이미지처럼 반복되며, “누가 남고, 누가 지워지며, 누가 신화가 되는가”를 되묻습니다.'
        ]
      },
      rules: {
        title: 'Game rules — Survival Battle',
        logline: 'DROP → T+14일 → KIA / SURVIVE',
        intro: '총 공급은 7,777 NFTs: 7,700 MOTTO pack + 77 Immortals & Legends.',
        label: 'Key rules:',
        list: [
          'Survival Battle 룰은 MOTTO pack(Non-Immortals)에서 실제로 움직입니다.',
          '드롭 윈도우 종료 2주 후(T+14일), MOTTO pack(Non-Immortals) 50%가 온체인에서 KIA 아트워크로 업데이트됩니다.',
          '나머지 50%는 Survive로 남아 원본 아트워크를 유지합니다.',
          'KIA 업데이트 전까지는 Crypto.com NFT 내 “Survival Battle: MOTTO 7777” 컬렉션에서 자유 거래가 가능합니다.',
          'KIA 업데이트 이후, MOTTO pack NFTs는 Crypto.com NFT 외부로 출금 불가 상태가 됩니다.',
          'Immortals/Legends는 Crypto.com NFT에 정의된 별도 룰이 적용될 수 있습니다. 이벤트 상세/약관 기준을 따릅니다.'
        ]
      },
      utility: {
        title: 'Holder utilities',
        logline: 'OST · 미니게임 · 머치 · 거버넌스',
        body: [
          'MOTTO 7777은 아트워크만이 아니라, 홀더에게 다음과 같은 유틸리티가 열릴 수 있습니다(자격/조건 기반).'
        ],
        bullets: [
          'OST 다운로드 링크',
          '미래 미니게임 참여',
          '간헐적 피지컬 머치 패키지',
          '향후 거버넌스/리워드 관련 혜택'
        ],
        footnotes: [
          '정확한 수량·조건·타임라인은 Crypto.com NFT 및 공식 “Motto 7777 NFT Collection – Reward Utility Terms & Conditions”에 정의된 기준을 따릅니다.',
          'NFC mini-CD keyring (Prototype) 는 MERCH / REWARDS 탭에서 쇼케이스됩니다.'
        ]
      },
      cta: {
        copy: 'Enter the drop from here — view the full collection while the rest of the site stays active.',
        label: 'View collection on Crypto.com NFT'
      }
    }
  }
});

const ABOUT_TEASER_URL = 'https://www.youtube.com/embed/0j9Vhhuz5PA';

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
  introLogo: document.getElementById('introLogo'),
  enterBtn: document.getElementById('enterBtn'),
  stage: document.getElementById('stage'),
  egg1: document.getElementById('egg1'),
  egg2: document.getElementById('egg2'),
  navEggs: document.querySelector('.nav-eggs'),
  audioUI: document.getElementById('audio-ui'),
  audioToggle: document.getElementById('audioToggle'),
  nowText: document.getElementById('nowText'),
  vol: document.getElementById('vol'),
  muteBtn: document.getElementById('muteBtn'),
  playerCenter: document.querySelector('.player-center'),
  prevBtn: document.getElementById('prevBtn'),
  playBtn: document.getElementById('playBtn'),
  nextBtn: document.getElementById('nextBtn'),
  volumePopover: document.getElementById('volumePopover'),
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
  nav: document.querySelector('.nav'),
  navToggle: document.getElementById('navToggle'),
  navLinks: document.getElementById('navLinks'),
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
  immSearchToggle: document.getElementById('immSearchToggle'),
  immTagFilters: document.getElementById('immTagFilters'),
  immTagsToggle: document.getElementById('immTagsToggle'),
  immMobileBackdrop: document.getElementById('immMobileBackdrop'),
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
  arcFilterButtons: document.querySelectorAll('[data-archive-filter]'),
  arcSpotlightToggle: document.getElementById('archiveSpotlightToggle'),
  arcShuffle: document.getElementById('archiveShuffle'),
  arcStatTotal: document.getElementById('archiveStatTotal'),
  arcStatMotion: document.getElementById('archiveStatMotion'),
  arcStatStill: document.getElementById('archiveStatStill'),
  arcTimelineItems: document.querySelectorAll('[data-archive-jump]'),
  arcTimeline: document.getElementById('archiveTimeline'),
  arcNotesBtn: document.querySelector('[data-archive-notes]'),
  arcDetail: document.getElementById('archiveDetail'),
  arcDetailMedia: document.getElementById('archiveDetailMedia'),
  arcDetailTitle: document.getElementById('archiveDetailTitle'),
  arcDetailType: document.getElementById('archiveDetailType')
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

// ====== Intro Logo Swap ======
let _introLogoSwapInFlight = false;

function getIntroLogoSource(type = 'static') {
  if (!DOM.introLogo) return '';
  if (type === 'animated') {
    return DOM.introLogo.dataset.animatedSrc || INTRO_LOGO_ANIMATED_SRC;
  }
  return DOM.introLogo.dataset.staticSrc || INTRO_LOGO_STATIC_SRC;
}

function shouldReduceIntroMotion() {
  return Boolean(INTRO_LOGO_MOTION_PREF && INTRO_LOGO_MOTION_PREF.matches);
}

function restoreIntroLogoStatic() {
  if (!DOM.introLogo) return;
  const staticSrc = getIntroLogoSource('static');
  if (staticSrc) {
    DOM.introLogo.src = staticSrc;
  }
  delete DOM.introLogo.dataset.currentAnimated;
}

function swapIntroLogoToGif() {
  if (!DOM.introLogo || shouldReduceIntroMotion()) return;
  const animatedSrc = getIntroLogoSource('animated');
  if (!animatedSrc) return;
  const versionedSrc = withAssetVersion(animatedSrc);
  if (!versionedSrc) return;
  if (DOM.introLogo.dataset.currentAnimated === versionedSrc || _introLogoSwapInFlight) return;

  _introLogoSwapInFlight = true;
  const loader = new Image();
  loader.decoding = 'async';
  loader.addEventListener('load', () => {
    DOM.introLogo.src = versionedSrc;
    DOM.introLogo.dataset.currentAnimated = versionedSrc;
    _introLogoSwapInFlight = false;
  }, { once: true });
  loader.addEventListener('error', () => {
    _introLogoSwapInFlight = false;
  }, { once: true });
  loader.src = versionedSrc;
}

function requestIntroLogoSwapAfterLoad() {
  if (!DOM.introLogo || typeof window === 'undefined' || typeof document === 'undefined') return;
  if (document.readyState === 'complete') {
    swapIntroLogoToGif();
    return;
  }
  window.addEventListener('load', swapIntroLogoToGif, { once: true });
}

function bindIntroLogoMotionWatcher() {
  if (!INTRO_LOGO_MOTION_PREF) return;
  const handler = (event) => {
    if (event && event.matches) {
      restoreIntroLogoStatic();
      return;
    }
    requestIntroLogoSwapAfterLoad();
  };
  if (typeof INTRO_LOGO_MOTION_PREF.addEventListener === 'function') {
    INTRO_LOGO_MOTION_PREF.addEventListener('change', handler);
  } else if (typeof INTRO_LOGO_MOTION_PREF.addListener === 'function') {
    INTRO_LOGO_MOTION_PREF.addListener(handler);
  }
}

requestIntroLogoSwapAfterLoad();
bindIntroLogoMotionWatcher();

const VIEW_STATES = Object.freeze({
  HOME: 'home',
  ABOUT: 'about',
  NFT: 'nft',
  MERCH: 'merch'
});

let CURRENT_STAGE_VIEW = VIEW_STATES.HOME;
let HISTORY_READY = false;

function buildHistoryBase(hashOverride) {
  if (typeof window === 'undefined') return '';
  const base = `${window.location.pathname}${window.location.search}`;
  if (typeof hashOverride === 'string') {
    return `${base}${hashOverride}`;
  }
  const { hash = '' } = window.location;
  if (!hash || hash.startsWith('#archive')) {
    return base;
  }
  return `${base}${hash}`;
}

function buildViewUrl(view, hashOverride) {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  const normalized = view || VIEW_STATES.HOME;
  if (normalized && normalized !== VIEW_STATES.HOME) {
    url.searchParams.set('view', normalized);
  } else {
    url.searchParams.delete('view');
  }
  if (typeof hashOverride === 'string') {
    url.hash = hashOverride;
  } else if (!url.hash || url.hash.startsWith('#archive')) {
    url.hash = '';
  }
  const qs = url.searchParams.toString();
  return `${url.pathname}${qs ? `?${qs}` : ''}${url.hash}`;
}

function commitViewState(view, { replace = false, force = false } = {}) {
  if (typeof window === 'undefined' || !window.history) return;
  const payload = { introDismissed: true, view };
  if (!HISTORY_READY) {
    history.replaceState(payload, '', buildViewUrl(view, ''));
    HISTORY_READY = true;
    CURRENT_STAGE_VIEW = view;
    return;
  }
  if (!force && !replace && CURRENT_STAGE_VIEW === view) {
    return;
  }
  const method = replace ? 'replaceState' : 'pushState';
  history[method](payload, '', buildViewUrl(view));
  CURRENT_STAGE_VIEW = view;
}

function replaceHistoryPreservingState(url) {
  if (typeof window === 'undefined' || !window.history) return;
  const currentState = history.state && typeof history.state === 'object'
    ? { ...history.state }
    : { introDismissed: true, view: CURRENT_STAGE_VIEW };
  history.replaceState(currentState, '', url);
}

const IMMORTALS_ACCESS_MODES = Object.freeze({
  LOCKED: 'locked',
  OPEN: 'open'
});
const IMMORTALS_ACCESS_STORAGE_KEY = 'motto:immortals-access';
let IMMORTALS_ACCESS_MODE = IMMORTALS_ACCESS_MODES.OPEN;

function readStoredImmortalsAccessMode() {
  if (typeof window === 'undefined') return IMMORTALS_ACCESS_MODES.OPEN;
  try {
    const stored = window.localStorage?.getItem(IMMORTALS_ACCESS_STORAGE_KEY);
    if (stored === IMMORTALS_ACCESS_MODES.OPEN || stored === IMMORTALS_ACCESS_MODES.LOCKED) {
      return stored;
    }
  } catch (err) {
    console.warn('Unable to read Immortals access mode:', err);
  }
  return IMMORTALS_ACCESS_MODES.OPEN;
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
  if (stored === IMMORTALS_ACCESS_MODES.LOCKED) {
    persistImmortalsAccessMode(IMMORTALS_ACCESS_MODES.OPEN);
  }
  applyImmortalsAccessMode(IMMORTALS_ACCESS_MODES.OPEN);
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
      replaceHistoryPreservingState(buildHistoryBase(''));
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
window.addEventListener('resize', () => ensureMobileNavEggsPlacement(1));
if (SPOTIFY_URL === '#') DOM.spBtn?.classList.add('disabled');
if (YOUTUBE_URL === '#') DOM.ytBtn?.classList.add('disabled');
if (IG_URL === '#') DOM.igBtn?.classList.add('disabled');
if (TT_URL === '#') DOM.ttBtn?.classList.add('disabled');

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
  stopIntroGlitchLoop();
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
  } catch (err) {
    console.error('Failed to parse view parameter:', err);
    return;
  }

  if (viewParam === 'immortals' && !isImmortalsUnlocked()) {
    console.info('Immortals locked — falling back to home stage.');
    viewParam = VIEW_STATES.HOME;
  }

  const actions = {
    immortals: () => openImmortals(),
    archive: () => openArchive(),
    about: () => openAboutSection('url-param', { replaceHistory: true }),
    nft: () => openNftView('url-param', { replaceHistory: true }),
    merch: () => openMerchView('url-param', { replaceHistory: true }),
    [VIEW_STATES.HOME]: () => openHomeStage('url-param', { replaceHistory: true })
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

function handleViewPopState(event) {
  const state = event.state;
  if (!state || state.introDismissed !== true) return;
  const targetView = state.view || VIEW_STATES.HOME;
  CURRENT_STAGE_VIEW = targetView;
  const actions = {
    [VIEW_STATES.ABOUT]: () => openAboutSection('history', { skipHistory: true }),
    [VIEW_STATES.NFT]: () => openNftView('history', { skipHistory: true }),
    [VIEW_STATES.MERCH]: () => openMerchView('history', { skipHistory: true }),
    [VIEW_STATES.HOME]: () => openHomeStage('history', { skipHistory: true })
  };
  fastExitIntro();
  ensureMainReady()
    .then(() => {
      const action = actions[targetView] || actions[VIEW_STATES.HOME];
      action();
    })
    .catch((err) => {
      console.error('Failed to handle history navigation:', err);
    });
}

const INTRO_GLITCH_MIN_DELAY = 1500;
const INTRO_GLITCH_MAX_DELAY = 3000;
const INTRO_GLITCH_DURATION = 460;
let introGlitchTimer = null;
let introCtaEl = null;

function getIntroCtaEl() {
  if (introCtaEl) return introCtaEl;
  introCtaEl = document.querySelector('.intro-cta');
  return introCtaEl;
}

function stopIntroGlitchLoop() {
  if (introGlitchTimer) {
    clearTimeout(introGlitchTimer);
    introGlitchTimer = null;
  }
  const el = getIntroCtaEl();
  if (el) el.classList.remove('is-glitch-burst');
}

function startIntroGlitchLoop() {
  const el = getIntroCtaEl();
  if (!el || !DOM.intro || DOM.intro.style.display === 'none') return;
  stopIntroGlitchLoop();
  const runBurst = () => {
    if (!DOM.intro || DOM.intro.style.display === 'none') {
      stopIntroGlitchLoop();
      return;
    }
    el.classList.remove('is-glitch-burst');
    void el.offsetWidth;
    el.classList.add('is-glitch-burst');
    setTimeout(() => {
      el.classList.remove('is-glitch-burst');
    }, INTRO_GLITCH_DURATION);
    const delay = INTRO_GLITCH_MIN_DELAY + Math.random() * (INTRO_GLITCH_MAX_DELAY - INTRO_GLITCH_MIN_DELAY);
    introGlitchTimer = setTimeout(runBurst, delay);
  };
  const initialDelay = INTRO_GLITCH_MIN_DELAY + Math.random() * (INTRO_GLITCH_MAX_DELAY - INTRO_GLITCH_MIN_DELAY);
  introGlitchTimer = setTimeout(runBurst, initialDelay);
}

// ====== Intro → Main ======
const INTRO_AUTO_ENTER_DELAY = 5000;
let introAutoEnterTimer = null;

function cancelIntroAutoEnter() {
  if (!introAutoEnterTimer) return;
  clearTimeout(introAutoEnterTimer);
  introAutoEnterTimer = null;
}

function requestIntroEnter() {
  if (!DOM.enterBtn || DOM.enterBtn.disabled) return;
  DOM.enterBtn.click();
}

function scheduleIntroAutoEnter() {
  if (!DOM.intro || !DOM.enterBtn) return;
  if (DOM.intro.style.display === 'none') return;
  cancelIntroAutoEnter();
  introAutoEnterTimer = setTimeout(() => {
    if (!DOM.intro || DOM.intro.style.display === 'none') return;
    requestIntroEnter();
  }, INTRO_AUTO_ENTER_DELAY);
}

if (DOM.intro) {
  DOM.intro.addEventListener('touchstart', () => {
    if (DOM.intro.style.display === 'none') return;
    requestIntroEnter();
  }, { passive: true });
}

DOM.enterBtn?.addEventListener('click', () => {
  console.log("ENTER 버튼 클릭됨 ✅");
  stopIntroGlitchLoop();
  cancelIntroAutoEnter();
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
    stopIntroGlitchLoop();

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

scheduleIntroAutoEnter();
startIntroGlitchLoop();

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
  DOM.stage.classList.remove('stage--merch');
  DOM.stage.classList.add('stage--hero');
  setHomeView(true);
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
    if (window.matchMedia('(max-width: 768px)').matches) {
      moveNavEggsAfter(footer);
      requestAnimationFrame(() => moveNavEggsAfter(footer));
      ensureMobileNavEggsPlacement(2);
    }

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

function getAboutContent(lang) {
  return ABOUT_CONTENT[lang] || ABOUT_CONTENT.en;
}

function getNftContent(lang) {
  return NFT_CONTENT[lang] || NFT_CONTENT.en;
}

function applyLanguageMode() {
  if (typeof document === 'undefined') return;
  document.body.classList.toggle('lang-en', CURRENT_LANG === LANGUAGES.EN);
  document.body.classList.toggle('lang-kr', CURRENT_LANG === LANGUAGES.KR);
  updateLanguageToggleState();
}

let ABOUT_ACCORDION_LISTENERS = [];
let ABOUT_ACCORDION_MQ = null;
let ABOUT_ACCORDION_MQ_HANDLER = null;

function clearAboutAccordionListeners() {
  ABOUT_ACCORDION_LISTENERS.forEach(({ el, handler }) => {
    el.removeEventListener('toggle', handler);
  });
  ABOUT_ACCORDION_LISTENERS = [];
}

function setupAboutAccordion() {
  if (typeof window === 'undefined') return;
  const applyState = (isMobile) => {
    const detailsNodes = document.querySelectorAll('.about .about-chapters details.about-chapter');
    detailsNodes.forEach((node) => {
      node.open = !isMobile;
    });
    clearAboutAccordionListeners();
    if (!isMobile) return;
    detailsNodes.forEach((node) => {
      const handler = () => {
        if (!node.open) return;
        detailsNodes.forEach((other) => {
          if (other !== node) other.open = false;
        });
      };
      node.addEventListener('toggle', handler);
      ABOUT_ACCORDION_LISTENERS.push({ el: node, handler });
    });
  };

  if (ABOUT_ACCORDION_MQ && ABOUT_ACCORDION_MQ_HANDLER) {
    ABOUT_ACCORDION_MQ.removeEventListener('change', ABOUT_ACCORDION_MQ_HANDLER);
  }
  ABOUT_ACCORDION_MQ = window.matchMedia('(max-width: 768px)');
  ABOUT_ACCORDION_MQ_HANDLER = (event) => applyState(event.matches);
  ABOUT_ACCORDION_MQ.addEventListener('change', ABOUT_ACCORDION_MQ_HANDLER);
  applyState(ABOUT_ACCORDION_MQ.matches);
}

let NFT_ACCORDION_LISTENERS = [];
let NFT_ACCORDION_MQ = null;
let NFT_ACCORDION_MQ_HANDLER = null;

function clearNftAccordionListeners() {
  NFT_ACCORDION_LISTENERS.forEach(({ el, handler }) => {
    el.removeEventListener('toggle', handler);
  });
  NFT_ACCORDION_LISTENERS = [];
}

function setupNftAccordion() {
  if (typeof window === 'undefined') return;
  const applyState = (isMobile) => {
    const detailsNodes = document.querySelectorAll('.nft-root details.nft-section');
    detailsNodes.forEach((node) => {
      node.open = !isMobile;
    });
    clearNftAccordionListeners();
    if (!isMobile) return;
    detailsNodes.forEach((node) => {
      const handler = () => {
        if (!node.open) return;
        detailsNodes.forEach((other) => {
          if (other !== node) other.open = false;
        });
      };
      node.addEventListener('toggle', handler);
      NFT_ACCORDION_LISTENERS.push({ el: node, handler });
    });
  };

  if (NFT_ACCORDION_MQ && NFT_ACCORDION_MQ_HANDLER) {
    NFT_ACCORDION_MQ.removeEventListener('change', NFT_ACCORDION_MQ_HANDLER);
  }
  NFT_ACCORDION_MQ = window.matchMedia('(max-width: 768px)');
  NFT_ACCORDION_MQ_HANDLER = (event) => applyState(event.matches);
  NFT_ACCORDION_MQ.addEventListener('change', NFT_ACCORDION_MQ_HANDLER);
  applyState(NFT_ACCORDION_MQ.matches);
}

let NAV_EGGS_HOME_PARENT = null;
let NAV_EGGS_HOME_NEXT = null;

function moveNavEggsAfter(node) {
  if (!DOM.navEggs) return;
  const navEggs = DOM.navEggs;
  if (!NAV_EGGS_HOME_PARENT) {
    NAV_EGGS_HOME_PARENT = navEggs.parentElement;
    NAV_EGGS_HOME_NEXT = navEggs.nextSibling;
  }
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (!node || !isMobile) {
    if (NAV_EGGS_HOME_PARENT && navEggs.parentElement !== NAV_EGGS_HOME_PARENT) {
      NAV_EGGS_HOME_PARENT.insertBefore(navEggs, NAV_EGGS_HOME_NEXT);
    }
    navEggs.classList.remove('nav-eggs--stage');
    return;
  }
  if (navEggs.parentElement !== node.parentElement) {
    node.parentElement.insertBefore(navEggs, node.nextSibling);
  } else if (navEggs !== node.nextSibling) {
    node.parentElement.insertBefore(navEggs, node.nextSibling);
  }
  navEggs.classList.add('nav-eggs--stage');
}

function ensureMobileNavEggsPlacement(retries = 2) {
  if (!DOM.navEggs) return;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (!isMobile) {
    moveNavEggsAfter(null);
    return;
  }
  if (!document.body.classList.contains('view-hero')) {
    moveNavEggsAfter(null);
    return;
  }
  const footer = document.querySelector('.today-footer');
  if (footer) {
    moveNavEggsAfter(footer);
    return;
  }
  if (retries > 0) {
    window.setTimeout(() => ensureMobileNavEggsPlacement(retries - 1), 200);
  }
}

function setupAudioToggle() {
  if (!DOM.audioUI || !DOM.audioToggle) return;
  const applyState = (collapsed) => {
    DOM.audioUI.classList.toggle('is-collapsed', collapsed);
    DOM.audioToggle.setAttribute('aria-pressed', collapsed ? 'true' : 'false');
    DOM.audioToggle.setAttribute('aria-label', collapsed ? 'Expand audio player' : 'Collapse audio player');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    DOM.audioToggle.textContent = isMobile ? '▲' : (collapsed ? '▲' : '▾');
    try {
      localStorage.setItem('motto_audio_collapsed', collapsed ? '1' : '0');
    } catch (err) {
      // ignore storage errors
    }
  };

  let collapsed = false;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  try {
    const stored = localStorage.getItem('motto_audio_collapsed');
    if (isMobile) {
      collapsed = true;
    } else if (stored !== null) {
      collapsed = stored === '1';
    }
  } catch (err) {
    collapsed = isMobile;
  }
  applyState(collapsed);

  DOM.audioToggle.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    applyState(!DOM.audioUI.classList.contains('is-collapsed'));
  });

  DOM.audioUI.addEventListener('click', (event) => {
    if (!DOM.audioUI.classList.contains('is-collapsed')) return;
    if (event.target.closest('button, input, a')) return;
    applyState(false);
  });
}

function setHomeView(isHome) {
  if (typeof document === 'undefined') return;
  document.body.classList.toggle('view-hero', Boolean(isHome));
  if (!isHome) {
    moveNavEggsAfter(null);
    return;
  }
  if (!window.matchMedia('(max-width: 768px)').matches) {
    moveNavEggsAfter(null);
    return;
  }
  ensureMobileNavEggsPlacement(2);
}

function updateLanguageToggleState() {
  document.querySelectorAll('.lang-toggle__btn').forEach((btn) => {
    const lang = btn.dataset.lang;
    const isActive = CURRENT_LANG === lang;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function setLanguage(lang) {
  if (!lang || lang === CURRENT_LANG) return;
  CURRENT_LANG = lang;
  applyLanguageMode();
}

function createLanguageToggle() {
  const wrapper = document.createElement('div');
  wrapper.className = 'lang-toggle';

  const makeButton = (lang) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lang-toggle__btn';
    btn.dataset.lang = lang;
    btn.textContent = LANGUAGE_LABELS[lang];
    const isActive = CURRENT_LANG === lang;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    btn.addEventListener('click', () => setLanguage(lang));
    return btn;
  };

  wrapper.appendChild(makeButton(LANGUAGES.EN));
  wrapper.appendChild(makeButton(LANGUAGES.KR));
  return wrapper;
}

function collectAboutStats(content) {
  return content.stats.map((stat) => ({ ...stat }));
}

function formatChapterTitle(title, lang) {
  if (lang !== LANGUAGES.KR) return { text: title };
  if (!title || !title.startsWith('Chapter ')) return { text: title };
  const parts = title.split(':');
  if (parts.length < 2) return { text: title };
  return { html: `<span class="en-text">${parts[0]}</span>:${parts.slice(1).join(':')}` };
}

function buildAboutBlock(lang) {
  const content = getAboutContent(lang);
  const isKr = lang === LANGUAGES.KR;
  const block = document.createElement('div');
  block.className = `lang-block lang-block--${lang} ${isKr ? 'kr-text' : 'en-text'}`;

  const hero = document.createElement('header');
  hero.className = 'about-hero';
  const heroEyebrow = document.createElement('p');
  heroEyebrow.className = 'about-eyebrow';
  if (isKr) {
    heroEyebrow.innerHTML = '<span class="en-text">ABOUT</span> · 프로젝트 7777';
  } else {
    heroEyebrow.textContent = content.hero.eyebrow;
  }
  hero.appendChild(heroEyebrow);

  const heroAccordion = document.createElement('details');
  heroAccordion.className = 'about-hero-accordion';
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  heroAccordion.open = !isMobile;

  const summary = document.createElement('summary');
  summary.className = 'about-hero-summary';
  const summaryTitle = document.createElement('span');
  summaryTitle.className = 'about-hero-summary-title';
  summaryTitle.textContent = content.hero.title || content.hero.line || 'MOTTO 7777';
  const summaryMeta = document.createElement('span');
  summaryMeta.className = 'about-hero-summary-meta';
  summaryMeta.textContent = isKr ? '요약 펼치기' : 'Tap to expand';
  summary.appendChild(summaryTitle);
  summary.appendChild(summaryMeta);
  heroAccordion.appendChild(summary);

  const heroTitle = document.createElement('h1');
  heroTitle.textContent = content.hero.title || content.hero.line;
  if (isKr) heroTitle.classList.add('en-text');
  heroAccordion.appendChild(heroTitle);
  if (Array.isArray(content.hero.sublines)) {
    content.hero.sublines.forEach((text) => {
      if (!text) return;
      const sub = document.createElement('p');
      sub.className = 'about-subhead';
      sub.textContent = text;
      heroAccordion.appendChild(sub);
    });
  }
  hero.appendChild(heroAccordion);
  hero.appendChild(createLanguageToggle());
  block.appendChild(hero);

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
  block.appendChild(teaser);

  if (Array.isArray(content.credits) && content.credits.length) {
    const credits = document.createElement('div');
    credits.className = 'about-credits';
    content.credits.forEach((line, idx) => {
      const p = document.createElement('p');
      p.textContent = line;
      if (idx === 0) {
        p.classList.add('about-credits__lead');
      }
      credits.appendChild(p);
    });
    block.appendChild(credits);
  }

  if (Array.isArray(content.stats) && content.stats.length) {
    const statsWrap = document.createElement('div');
    statsWrap.className = 'about-stats';
    collectAboutStats(content).forEach((stat) => {
      const card = document.createElement('div');
      card.className = 'about-stat';

      const label = document.createElement('span');
      label.className = 'about-stat-label';
      label.textContent = stat.label;
      if (isKr) label.classList.add('en-text');
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
    block.appendChild(statsWrap);
  }

  if (Array.isArray(content.chapters) && content.chapters.length) {
    const chaptersWrap = document.createElement('div');
    chaptersWrap.className = 'about-chapters';
    content.chapters.forEach((chapter) => {
      const chapterSection = document.createElement('details');
      chapterSection.className = 'about-chapter';
      chapterSection.open = true;
      const summary = document.createElement('summary');
      summary.className = 'about-chapter-summary';
      const head = document.createElement('div');
      head.className = 'about-chapter-head';

      const title = document.createElement('span');
      title.className = 'about-chapter-title';
      const formatted = formatChapterTitle(chapter.title, lang);
      if (formatted.html) {
        title.innerHTML = formatted.html;
      } else {
        title.textContent = formatted.text;
      }
      head.appendChild(title);

      const logline = document.createElement('span');
      logline.className = 'about-chapter-logline';
      logline.textContent = chapter.logline || '';
      head.appendChild(logline);
      summary.appendChild(head);
      chapterSection.appendChild(summary);

      const list = document.createElement('ul');
      list.className = 'about-list';
      chapter.lines.forEach((line) => {
        const li = document.createElement('li');
        li.textContent = line;
        list.appendChild(li);
      });
      chapterSection.appendChild(list);
      chaptersWrap.appendChild(chapterSection);
    });
    block.appendChild(chaptersWrap);
  }

  if (Array.isArray(content.pillars) && content.pillars.length) {
    const grid = document.createElement('div');
    grid.className = 'about-grid';
    content.pillars.forEach((pillar) => {
      const card = document.createElement('article');
      card.className = 'about-card';

      if (pillar.eyebrow) {
        const eyebrow = document.createElement('p');
        eyebrow.className = 'about-card-eyebrow';
        eyebrow.textContent = pillar.eyebrow;
        if (isKr) eyebrow.classList.add('en-text');
        card.appendChild(eyebrow);
      }

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
    block.appendChild(grid);
  }

  if (content.ctaNote) {
    const ctaNote = document.createElement('p');
    ctaNote.className = 'about-cta-note';
    ctaNote.textContent = content.ctaNote;
    block.appendChild(ctaNote);
  }

  if (Array.isArray(content.ctas) && content.ctas.length) {
    const actions = document.createElement('div');
    actions.className = 'about-actions';
    content.ctas.forEach((cta) => {
      const node = document.createElement('button');
      node.className = 'about-btn';
      node.type = 'button';
      node.dataset.action = cta.action;
      node.setAttribute('aria-label', cta.label);
      const label = document.createElement('span');
      label.className = 'about-btn__label';
      label.textContent = cta.label;
      node.appendChild(label);
      const shortLabel = document.createElement('span');
      shortLabel.className = 'about-btn__short';
      shortLabel.textContent = cta.shortLabel || cta.label;
      node.appendChild(shortLabel);
      node.addEventListener('click', (e) => {
        e.preventDefault();
        navigateAboutAction(cta.action, 'about-cta');
      });

      actions.appendChild(node);
    });
    block.appendChild(actions);
  }

  return block;
}

function buildNftBlock(lang) {
  const content = getNftContent(lang);
  const isKr = lang === LANGUAGES.KR;
  const block = document.createElement('div');
  block.className = `lang-block lang-block--${lang} ${isKr ? 'kr-text' : 'en-text'}`;

  const hero = document.createElement('section');
  hero.className = 'nft-hero';
  const eyebrow = document.createElement('p');
  eyebrow.className = 'nft-eyebrow';
  eyebrow.textContent = content.hero.eyebrow;
  if (isKr) eyebrow.classList.add('en-text');
  hero.appendChild(eyebrow);

  const heroTitle = document.createElement('h1');
  heroTitle.id = `nft-title-${lang}`;
  heroTitle.textContent = content.hero.title;
  if (isKr) heroTitle.classList.add('en-text');
  hero.appendChild(heroTitle);

  const heroSubtext = document.createElement('p');
  heroSubtext.className = 'nft-subtext';
  heroSubtext.textContent = content.hero.subtext;
  if (content.hero.subtext) {
    hero.appendChild(heroSubtext);
  }

  const heroIntro = document.createElement('p');
  heroIntro.className = 'nft-intro';
  if (content.hero.intro) {
    const introLines = `${content.hero.intro}`.split('\n').map((line) => line.trim()).filter(Boolean);
    introLines.forEach((line) => {
      const lineNode = document.createElement('p');
      lineNode.className = 'nft-intro';
      lineNode.textContent = line;
      hero.appendChild(lineNode);
    });
  }

  hero.appendChild(createLanguageToggle());
  block.appendChild(hero);

  const contentWrap = document.createElement('div');
  contentWrap.className = 'nft-content';

  const makeSection = (sectionData) => {
    const section = document.createElement('details');
    section.className = 'nft-section';
    section.open = true;

    const summary = document.createElement('summary');
    summary.className = 'nft-section-summary';
    const head = document.createElement('div');
    head.className = 'nft-section-head';

    const title = document.createElement('span');
    title.className = 'nft-section-title';
    title.textContent = sectionData.title || '';
    if (isKr) title.classList.add('en-text');
    head.appendChild(title);

    const logline = document.createElement('span');
    logline.className = 'nft-section-logline';
    logline.textContent = sectionData.logline || '';
    head.appendChild(logline);

    summary.appendChild(head);
    section.appendChild(summary);

    return section;
  };

  const mainSection = makeSection(content.sections.main);
  content.sections.main.body.forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    mainSection.appendChild(p);
  });
  contentWrap.appendChild(mainSection);

  const immortalsSection = makeSection(content.sections.immortals);
  content.sections.immortals.body.forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    immortalsSection.appendChild(p);
  });
  contentWrap.appendChild(immortalsSection);

  const rulesSection = makeSection(content.sections.rules);
  const rulesIntro = document.createElement('p');
  rulesIntro.textContent = content.sections.rules.intro;
  rulesSection.appendChild(rulesIntro);

  const rulesLabel = document.createElement('p');
  const strong = document.createElement('strong');
  strong.textContent = content.sections.rules.label;
  rulesLabel.appendChild(strong);
  rulesSection.appendChild(rulesLabel);

  const rulesList = document.createElement('ul');
  rulesList.className = 'nft-list';
  content.sections.rules.list.forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    rulesList.appendChild(li);
  });
  rulesSection.appendChild(rulesList);
  contentWrap.appendChild(rulesSection);

  const utilitySection = makeSection(content.sections.utility);
  content.sections.utility.body.forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    utilitySection.appendChild(p);
  });
  if (Array.isArray(content.sections.utility.bullets)) {
    const list = document.createElement('ul');
    list.className = 'nft-list';
    content.sections.utility.bullets.forEach((text) => {
      const li = document.createElement('li');
      li.textContent = text;
      list.appendChild(li);
    });
    utilitySection.appendChild(list);
  }
  if (Array.isArray(content.sections.utility.footnotes)) {
    content.sections.utility.footnotes.forEach((text) => {
      const p = document.createElement('p');
      p.textContent = text;
      utilitySection.appendChild(p);
    });
  }
  contentWrap.appendChild(utilitySection);

  const ctaSection = document.createElement('section');
  ctaSection.className = 'nft-cta-section';
  const ctaCopy = document.createElement('p');
  ctaCopy.className = 'nft-cta-copy';
  ctaCopy.textContent = content.sections.cta.copy;
  ctaSection.appendChild(ctaCopy);
  const ctaRow = document.createElement('div');
  ctaRow.className = 'nft-cta-row';
  const ctaLink = document.createElement('a');
  ctaLink.className = 'nft-cta nft-cta--primary';
  ctaLink.href = NFT_COLLECTION_URL;
  ctaLink.target = '_blank';
  ctaLink.rel = 'noopener noreferrer';
  ctaLink.textContent = content.sections.cta.label;
  ctaRow.appendChild(ctaLink);
  ctaSection.appendChild(ctaRow);
  contentWrap.appendChild(ctaSection);

  block.appendChild(contentWrap);
  return block;
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
  DOM.stage.classList.remove('stage--merch');
  DOM.stage.classList.add('stage--about');
  setHomeView(false);
  DOM.stage.innerHTML = '';
  applyLanguageMode();

  const section = document.createElement('section');
  section.className = 'about';
  section.appendChild(buildAboutBlock(LANGUAGES.EN));
  section.appendChild(buildAboutBlock(LANGUAGES.KR));

  DOM.stage.innerHTML = '';
  DOM.stage.appendChild(section);
  setupAboutAccordion();
  if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function renderNftView() {
  if (!DOM.stage) return;
  DOM.stage.classList.remove('stage--hero');
  DOM.stage.classList.remove('stage--about');
  DOM.stage.classList.remove('stage--merch');
  DOM.stage.classList.add('stage--nft');
  setHomeView(false);
  DOM.stage.innerHTML = '';
  applyLanguageMode();

  const root = document.createElement('section');
  root.className = 'nft-root';
  root.setAttribute('aria-labelledby', 'nft-title-en nft-title-kr');
  root.appendChild(buildNftBlock(LANGUAGES.EN));
  root.appendChild(buildNftBlock(LANGUAGES.KR));
  DOM.stage.appendChild(root);
  setupNftAccordion();

  if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function createYouTubeEmbed(id, title) {
  const params = new URLSearchParams({
    autoplay: 0,
    mute: 1,
    playsinline: 1,
    controls: 0,
    modestbranding: 1,
    rel: 0,
    loop: 1,
    playlist: id
  });
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${id}?${params.toString()}`;
  iframe.title = title;
  iframe.loading = 'lazy';
  iframe.allowFullscreen = true;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.setAttribute('frameborder', '0');
  return iframe;
}

function renderMerchView() {
  if (!DOM.stage) return;
  DOM.stage.classList.remove('stage--hero');
  DOM.stage.classList.remove('stage--about');
  DOM.stage.classList.remove('stage--nft');
  DOM.stage.classList.add('stage--merch');
  setHomeView(false);
  DOM.stage.innerHTML = '';

  const root = document.createElement('section');
  root.className = 'merch-root';
  root.setAttribute('aria-labelledby', 'merch-title');

  const hero = document.createElement('section');
  hero.className = 'merch-hero';
  const eyebrow = document.createElement('p');
  eyebrow.className = 'merch-eyebrow';
  eyebrow.textContent = 'MERCH / REWARDS';
  hero.appendChild(eyebrow);

  root.appendChild(hero);

  const content = document.createElement('div');
  content.className = 'merch-content';

  const nfcSection = document.createElement('section');
  nfcSection.className = 'merch-section';
  const heading = document.createElement('h2');
  heading.textContent = 'NFC mini-CD keyring (Prototype)';
  nfcSection.appendChild(heading);

  const videoGrid = document.createElement('div');
  videoGrid.className = 'merch-video-grid';
  [
    { id: 'g9aN_rwTjtY', title: 'NFC keyring prototype · angle 01' },
    { id: 'mp3nI35Mti8', title: 'NFC keyring prototype · angle 02' }
  ].forEach((video) => {
    const frame = document.createElement('div');
    frame.className = 'merch-video-frame';
    frame.appendChild(createYouTubeEmbed(video.id, video.title));
    videoGrid.appendChild(frame);
  });

  nfcSection.appendChild(videoGrid);
  content.appendChild(nfcSection);

  const teaserSection = document.createElement('section');
  teaserSection.className = 'merch-section merch-teasers';
  const teaserHeading = document.createElement('h2');
  teaserHeading.textContent = 'Teaser mockups';
  teaserSection.appendChild(teaserHeading);

  const teaserGrid = document.createElement('div');
  teaserGrid.className = 'merch-teaser-grid';
  [
    { label: 'Teaser 01', title: 'NFC keyring kit' },
    { label: 'Teaser 02', title: 'Vault cassette drop' },
    { label: 'Teaser 03', title: 'MOTTO battle tee' }
  ].forEach((teaser, index) => {
    const card = document.createElement('article');
    card.className = 'merch-teaser-card';
    card.dataset.index = String(index + 1);
    card.innerHTML = `
      <div class="merch-teaser-art" aria-hidden="true"></div>
      <div class="merch-teaser-info">
        <span class="merch-teaser-label">${teaser.label}</span>
        <h3>${teaser.title}</h3>
        <p>Mockup preview · launching soon.</p>
      </div>
    `;
    teaserGrid.appendChild(card);
  });

  teaserSection.appendChild(teaserGrid);
  content.appendChild(teaserSection);
  root.appendChild(content);

  DOM.stage.appendChild(root);
  if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function openAboutSection(source = 'nav-link', options = {}) {
  const { skipHistory = false, replaceHistory = false } = options || {};
  const open = () => {
    if (!skipHistory) {
      commitViewState(VIEW_STATES.ABOUT, { replace: replaceHistory });
    } else {
      CURRENT_STAGE_VIEW = VIEW_STATES.ABOUT;
    }
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

function openNftView(source = 'nav-link', options = {}) {
  const { skipHistory = false, replaceHistory = false } = options || {};
  const open = () => {
    if (!skipHistory) {
      commitViewState(VIEW_STATES.NFT, { replace: replaceHistory });
    } else {
      CURRENT_STAGE_VIEW = VIEW_STATES.NFT;
    }
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

function openMerchView(source = 'nav-link', options = {}) {
  const { skipHistory = false, replaceHistory = false } = options || {};
  const open = () => {
    if (!skipHistory) {
      commitViewState(VIEW_STATES.MERCH, { replace: replaceHistory });
    } else {
      CURRENT_STAGE_VIEW = VIEW_STATES.MERCH;
    }
    trackEvent('Nav', 'Open', `Merch:${source}`);
    playTransitionOverlay(() => {
      resetStageForView();
      renderMerchView();
    }, NAV_OVERLAY_DEFAULTS);
  };

  if (MAIN_BOOTED) {
    open();
    return;
  }

  ensureMainReady()
    .then(() => open())
    .catch((err) => {
      console.error('Failed to open Merch view:', err);
    });
}

function openHomeStage(source = 'nav-home', options = {}) {
  const { skipHistory = false, replaceHistory = false } = options || {};
  const open = () => {
    if (!skipHistory) {
      commitViewState(VIEW_STATES.HOME, { replace: replaceHistory });
    } else {
      CURRENT_STAGE_VIEW = VIEW_STATES.HOME;
    }
    trackEvent('Nav', 'Open', `Home:${source}`);
    playTransitionOverlay(() => {
      resetStageForView();
      renderTodayGallery();
    }, NAV_OVERLAY_DEFAULTS);
  };

  if (MAIN_BOOTED) {
    open();
    return;
  }

  ensureMainReady()
    .then(() => open())
    .catch((err) => {
      console.error('Failed to open home stage:', err);
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
  commitViewState(VIEW_STATES.HOME, { replace: true, force: true });
  setupAudioToggle();
  ensureMobileNavEggsPlacement(2);
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
  DOM.stage?.classList.remove('stage--merch');
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
  setImmMobilePanels({ searchOpen: false, tagsOpen: false });
  openModal(DOM.immModal);
  setTimeout(() => {
    if (isModalActive(DOM.immModal)) {
      if (window.innerWidth > 768) {
        DOM.immSearch?.focus({ preventScroll: true });
      }
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
      DOM.immVideo.muted = true;
      DOM.immVideo.volume = 0;

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
    setImmMobilePanels({ searchOpen: false, tagsOpen: false });
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
let ARCHIVE_ACTIVE_ENTRY = null;
let ARCHIVE_ACTIVE_INDEX = -1;
let ARCHIVE_ACTIVE_KEY = null;
let ARCHIVE_PENDING_KEY = null;
let ARCHIVE_PENDING_SCROLL = false;
const ARCHIVE_KEY_TO_INDEX = new Map();
const ARCHIVE_ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'mp4']);
const ARCHIVE_ALLOWED_POSTER_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif']);
let ARCHIVE_FILTER_MODE = 'all';

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

function assignArchiveEntries(list) {
  const entries = Array.isArray(list) ? list : [];
  ARCHIVE_KEY_TO_INDEX.clear();
  const normalized = entries.map((entry, idx) => {
    const key = (entry.key || generateArchiveKey(entry, idx)).toLowerCase();
    const next = { ...entry, key, index: idx };
    ARCHIVE_KEY_TO_INDEX.set(key, idx);
    return next;
  });
  ARCHIVE_FILES = normalized;
  if (typeof window !== 'undefined') {
    window.__MOTTO_ARCHIVE_FILES__ = ARCHIVE_FILES;
  }
  return ARCHIVE_FILES;
}

function formatArchiveStat(value) {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe}`;
}

function updateArchiveStats(entries = ARCHIVE_FILES) {
  const list = Array.isArray(entries) ? entries : [];
  const total = list.length;
  const motion = list.filter((item) => item.type === 'video').length;
  const stills = total - motion;
  if (DOM.arcStatTotal) DOM.arcStatTotal.textContent = formatArchiveStat(total);
  if (DOM.arcStatMotion) DOM.arcStatMotion.textContent = formatArchiveStat(motion);
  if (DOM.arcStatStill) DOM.arcStatStill.textContent = formatArchiveStat(stills);
}

function syncArchiveFilterButtons() {
  const buttons = DOM.arcFilterButtons ? Array.from(DOM.arcFilterButtons) : [];
  buttons.forEach((btn) => {
    const target = (btn.dataset.archiveFilter || 'all').toLowerCase();
    const isActive = target === ARCHIVE_FILTER_MODE;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function updateArchiveFilterNotice(visibleCount, totalCount) {
  if (!DOM.arcGrid) return;
  const selector = '.archive-grid-state[data-filter-state="1"]';
  const existing = DOM.arcGrid.querySelector(selector);
  if (!totalCount) {
    existing?.remove();
    return;
  }
  if (visibleCount > 0) {
    existing?.remove();
    return;
  }
  const notice = existing || document.createElement('div');
  notice.className = 'archive-grid-state archive-grid-state--empty';
  notice.dataset.filterState = '1';
  notice.textContent = ARCHIVE_FILTER_MODE === 'motion'
    ? 'No motion captures logged yet.'
    : 'No still frames logged yet.';
  DOM.arcGrid.appendChild(notice);
}

function applyArchiveFilter() {
  if (!DOM.arcGrid) return;
  const cells = DOM.arcGrid.querySelectorAll('.cell');
  if (!cells.length) return;
  let visible = 0;
  cells.forEach((cell) => {
    const type = (cell.dataset.type || '').toLowerCase();
    let show = true;
    if (ARCHIVE_FILTER_MODE === 'motion') {
      show = type === 'video';
    } else if (ARCHIVE_FILTER_MODE === 'stills') {
      show = type !== 'video';
    }
    if (show) {
      cell.classList.remove('is-filtered-out');
      cell.removeAttribute('aria-hidden');
      cell.tabIndex = 0;
      visible += 1;
    } else {
      if (cell.classList.contains('is-focus')) {
        closeArchiveDetail();
      }
      cell.classList.add('is-filtered-out');
      cell.setAttribute('aria-hidden', 'true');
      cell.tabIndex = -1;
    }
  });
  DOM.arcGrid.classList.toggle('archive-grid--filtered', ARCHIVE_FILTER_MODE !== 'all');
  updateArchiveFilterNotice(visible, cells.length);
}

function setArchiveFilter(mode) {
  const allowed = new Set(['all', 'motion', 'stills']);
  const next = allowed.has((mode || '').toLowerCase())
    ? mode.toLowerCase()
    : 'all';
  if (ARCHIVE_FILTER_MODE === next) {
    syncArchiveFilterButtons();
    applyArchiveFilter();
    return ARCHIVE_FILTER_MODE;
  }
  ARCHIVE_FILTER_MODE = next;
  syncArchiveFilterButtons();
  applyArchiveFilter();
  return ARCHIVE_FILTER_MODE;
}

function bindArchiveFilterControls() {
  const buttons = DOM.arcFilterButtons ? Array.from(DOM.arcFilterButtons) : [];
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.archiveFilter || 'all';
      setArchiveFilter(target);
    });
  });
}

function bindArchiveTimelineLinks() {
  const items = DOM.arcTimelineItems ? Array.from(DOM.arcTimelineItems) : [];
  items.forEach((node) => {
    node.addEventListener('click', () => {
      const key = (node.dataset.archiveJump || '').toLowerCase();
      if (!key) return;
      openArchiveByKey(key, { scroll: true });
    });
  });
}

function syncArchiveTimelineState(activeKey) {
  const items = DOM.arcTimelineItems ? Array.from(DOM.arcTimelineItems) : [];
  items.forEach((node) => {
    const key = (node.dataset.archiveJump || '').toLowerCase();
    node.classList.toggle('is-active', Boolean(activeKey && key === activeKey));
  });
}

function shuffleArchiveOrder() {
  showRandomArchiveEntry();
}

function syncArchiveMetaControls() {
  if (DOM.arcSpotlightToggle) {
    const isOn = Boolean(ARCHIVE_SPOTLIGHT_ENABLED);
    DOM.arcSpotlightToggle.dataset.state = isOn ? 'on' : 'off';
    DOM.arcSpotlightToggle.textContent = isOn ? 'Spotlight on' : 'Spotlight off';
    DOM.arcSpotlightToggle.setAttribute('aria-pressed', isOn ? 'true' : 'false');
  }
}

function setArchiveSpotlightEnabled(enabled = true) {
  ARCHIVE_SPOTLIGHT_ENABLED = Boolean(enabled);
  syncArchiveSpotlightClass();
  syncArchiveMetaControls();
  return ARCHIVE_SPOTLIGHT_ENABLED;
}

function toggleArchiveSpotlightEnabled() {
  return setArchiveSpotlightEnabled(!ARCHIVE_SPOTLIGHT_ENABLED);
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
      const normalized = assignArchiveEntries(sanitized);
      updateArchiveStats(normalized);
      return normalized;
    })
    .catch((error) => {
      console.error('Failed to load archive manifest:', error);
      assignArchiveEntries([]);
      _archiveManifestPromise = null;
      updateArchiveStats([]);
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
  notice.dataset.locked = '1';
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
    cell.dataset.type = isVideo ? 'video' : 'image';
    if (item.key) {
      cell.dataset.key = item.key;
      cell.id = `archive-cell-${item.key}`;
    }
    const label = item.accessibleTitle || item.title || `Archive Item ${index + 1}`;
    cell.setAttribute('role', 'button');
    cell.setAttribute('aria-expanded', 'false');
    cell.setAttribute('aria-hidden', 'false');
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
      media = `<div class="${mediaClass}"><div class="video-wrapper"><video src="${src}" muted playsinline preload="metadata" data-archive-video${posterAttr}${loopAttr}></video></div></div>`;
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
    const isMediaInteraction = (evt) => {
      if (!evt) return false;
      const path = typeof evt.composedPath === 'function' ? evt.composedPath() : null;
      if (Array.isArray(path) && path.length) {
        return path.some((node) => node instanceof HTMLElement && node.closest?.('.archive-media'));
      }
      const target = evt.target;
      return Boolean(target && typeof target.closest === 'function' && target.closest('.archive-media'));
    };

    cell.onclick = (event) => {
      if (isMediaInteraction(event)) return;
      if (cell.classList.contains('is-focus')) return;
      openArchiveDetail(item, cell);
    };
    DOM.arcGrid.appendChild(cell);
    decorateArchiveCell(cell, item, allowHoverScrub);
  });
  syncArchiveSpotlightClass();
  applyArchiveFilter();
  syncArchiveMetaControls();
  if (entries.length) {
    showRandomArchiveEntry();
  }
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
        if (cell.classList.contains('is-focus')) return;
        const idx = Number.parseInt(cell.dataset.index || '-1', 10);
        const entry = ARCHIVE_FILES[idx] || item;
        openArchiveDetail(entry, cell);
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
  replaceHistoryPreservingState(buildHistoryBase(target));
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
  } else if (ARC_ACTIVE_KEY) {
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
    closeModal(DOM.arcModal);
    return;
  }
  if (!ARCHIVE_ACTIVE_KEY) return;
  if (e.target.closest('.cell')) return;
  closeArchiveDetail();
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
    const isMobile = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(max-width: 768px)').matches;
    const duration = isMobile ? 20 : Math.max(10, distance / speed);

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
  restartMobileMarquee();
}

function updateMarqueePlayState() {
  if (!DOM.nowText) return;
  if (!DOM.nowText.classList.contains('marquee')) return;
  DOM.nowText.classList.toggle('marquee--paused', !playing);
}

function restartMobileMarquee() {
  if (!DOM.nowText) return;
  if (typeof window === 'undefined') return;
  if (typeof window.matchMedia !== 'function') return;
  if (!window.matchMedia('(max-width: 768px)').matches) return;
  const label = DOM.nowText.getAttribute('aria-label') || '';
  let inner = DOM.nowText.querySelector('.track-title__inner');
  if (!inner) return;
  const apply = () => {
    const containerWidth = DOM.nowText.clientWidth || 1;
    const textWidth = inner.scrollWidth || containerWidth;
    const gap = Math.max(4, Math.min(containerWidth * 0.015, 8));
    const start = containerWidth;
    const distance = textWidth + containerWidth + gap;
    const duration = 20;

    DOM.nowText.classList.remove('marquee', 'marquee--paused');
    DOM.nowText.style.setProperty('--marquee-start', `${start}px`);
    DOM.nowText.style.setProperty('--marquee-distance', `${distance}px`);
    DOM.nowText.style.setProperty('--marquee-duration', `${duration}s`);
    DOM.nowText.classList.add('marquee');
    DOM.nowText.classList.toggle('marquee--paused', !playing);
    inner.style.animation = 'none';
    void inner.offsetWidth;
    inner.style.animation = '';
    inner.style.transform = '';
  };

  if (label) {
    requestAnimationFrame(() => requestAnimationFrame(apply));
  }
}


function trackEvent(category, action, label) {
  console.log(`[분석] ${category}: ${action} - ${label}`);
}

function setImmMobilePanels({ searchOpen = false, tagsOpen = false } = {}) {
  if (!DOM.immModal) return;
  DOM.immModal.classList.toggle('imm-modal--search', searchOpen);
  DOM.immModal.classList.toggle('imm-modal--tags', tagsOpen);
  DOM.immSearchToggle?.setAttribute('aria-expanded', searchOpen ? 'true' : 'false');
  DOM.immTagsToggle?.setAttribute('aria-expanded', tagsOpen ? 'true' : 'false');
  if (searchOpen) {
    setTimeout(() => DOM.immSearch?.focus(), 0);
  }
}

DOM.immSearchToggle?.addEventListener('click', () => {
  const isOpen = DOM.immModal?.classList.contains('imm-modal--search');
  setImmMobilePanels({ searchOpen: !isOpen, tagsOpen: false });
});
DOM.immTagsToggle?.addEventListener('click', () => {
  const isOpen = DOM.immModal?.classList.contains('imm-modal--tags');
  setImmMobilePanels({ searchOpen: false, tagsOpen: !isOpen });
});
DOM.immMobileBackdrop?.addEventListener('click', () => {
  setImmMobilePanels({ searchOpen: false, tagsOpen: false });
});
DOM.immTagFilters?.addEventListener('click', (e) => {
  if (e.target.closest('.imm-tag-btn')) {
    setImmMobilePanels({ searchOpen: false, tagsOpen: false });
  }
});

function setNavOpen(open) {
  if (!DOM.nav || !DOM.navToggle) return;
  DOM.nav.classList.toggle('nav-open', open);
  DOM.navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
}

DOM.navToggle?.addEventListener('click', () => {
  const isOpen = DOM.nav?.classList.contains('nav-open');
  setNavOpen(!isOpen);
});
DOM.navLinks?.addEventListener('click', (e) => {
  if (!e.target.closest('a')) return;
  setNavOpen(false);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) setNavOpen(false);
});

DOM.homeBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  openHomeStage('brand-home');
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
DOM.shopBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  openMerchView('nav-link');
});

DOM.arcNotesBtn?.addEventListener('click', () => {
  if (!DOM.arcTimeline) return;
  DOM.arcTimeline.scrollIntoView({ behavior: 'smooth', block: 'start' });
  DOM.arcTimeline.classList.add('is-highlight');
  setTimeout(() => DOM.arcTimeline?.classList.remove('is-highlight'), 1200);
});

bindArchiveFilterControls();
bindArchiveTimelineLinks();
setArchiveFilter(ARCHIVE_FILTER_MODE);
syncArchiveMetaControls();

DOM.arcShuffle?.addEventListener('click', (e) => {
  e.preventDefault();
  shuffleArchiveOrder();
  trackEvent('archive', 'shuffle', 'manual');
});
DOM.arcSpotlightToggle?.addEventListener('click', (e) => {
  e.preventDefault();
  const enabled = toggleArchiveSpotlightEnabled();
  trackEvent('archive', 'spotlight', enabled ? 'on' : 'off');
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
    if (ARC_ACTIVE_KEY != null) { closeArchiveDetail(); closed = true; }
    if (isModalActive(DOM.immDModal)) { closeModal(DOM.immDModal, { reopenImm: false }); closed = true; }
    if (isModalActive(DOM.immModal)) {
      setImmMobilePanels({ searchOpen: false, tagsOpen: false });
      closeModal(DOM.immModal);
      closed = true;
    }
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
  syncArchiveTimelineState(ARCHIVE_ACTIVE_KEY);

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
    mediaEl.autoplay = false;
  }
  setActiveArchiveEntry({
    ...item,
    src: item?.src || cell.dataset.archiveSrc
  }, cell);
  updateArchiveCaption(cell, item);
  syncArchiveSpotlightClass();
}

function setActiveArchiveEntry(entry = {}, sourceCell = null) {
  const normalized = { ...entry };
  if (!normalized.src && sourceCell?.dataset?.archiveSrc) {
    normalized.src = sourceCell.dataset.archiveSrc;
  }
  if (!normalized.src) return;
  ARCHIVE_ACTIVE_ENTRY = normalized;
  ARC_ACTIVE_CELL = sourceCell || null;
  const key = (normalized.key || '').toLowerCase();
  ARC_ACTIVE_KEY = key || null;
  renderArchiveDetailPanel(normalized);
  syncArchiveTimelineState(ARC_ACTIVE_KEY);
}

function showRandomArchiveEntry() {
  if (!ARCHIVE_FILES.length) return;
  const index = Math.floor(Math.random() * ARCHIVE_FILES.length);
  const entry = ARCHIVE_FILES[index];
  setActiveArchiveEntry(entry);
}

function renderArchiveDetailPanel(entry = {}) {
  if (!DOM.arcDetailMedia) return;
  const mediaRoot = DOM.arcDetailMedia;
  mediaRoot.innerHTML = '';
  const src = resolveAssetPath(entry.src || '');
  if (!src) {
    resetArchiveDetailPanel();
    return;
  }
  const isVideo = entry.type === 'video' || /\.mp4(?:$|\?)/i.test(src);
  mediaRoot.classList.toggle('archive-detail-media--video', isVideo);
  let media;
  if (isVideo) {
    const wrapper = document.createElement('div');
    wrapper.className = 'video-wrapper';
    media = document.createElement('video');
    media.src = src;
    media.controls = true;
    media.playsInline = true;
    media.setAttribute('playsinline', '');
    media.loop = entry.loop !== false;
    media.preload = 'metadata';
    wrapper.appendChild(media);
    media = wrapper;
  } else {
    media = document.createElement('img');
    media.src = src;
    media.alt = entry.title || entry.accessibleTitle || 'Archive media';
    media.loading = 'lazy';
    media.decoding = 'async';
  }
  mediaRoot.appendChild(media);
  if (DOM.arcDetailTitle) {
    DOM.arcDetailTitle.textContent = entry.title || entry.accessibleTitle || 'Captured signal';
  }
  if (DOM.arcDetailType) {
    const label = entry.displayType || (isVideo ? 'VIDEO' : 'STILL');
    DOM.arcDetailType.textContent = label;
  }
}

function resetArchiveDetailPanel() {
  if (DOM.arcDetailMedia) {
    DOM.arcDetailMedia.innerHTML = '';
  }
  if (DOM.arcDetailTitle) {
    DOM.arcDetailTitle.textContent = 'Select a signal to view details.';
  }
  if (DOM.arcDetailType) {
    DOM.arcDetailType.textContent = '';
  }
}

function closeArchiveDetail(opts = {}) {
  const hadSelection = ARCHIVE_ACTIVE_KEY != null;
  if (ARC_ACTIVE_CELL) {
    ARC_ACTIVE_CELL.classList.remove('is-active');
    ARC_ACTIVE_CELL = null;
  }
  clearArchiveFocus();
  ARCHIVE_ACTIVE_INDEX = -1;
  ARCHIVE_ACTIVE_KEY = null;
  ARCHIVE_ACTIVE_ENTRY = null;
  if (hadSelection && !opts.skipHash) {
    updateArchiveHash(null);
  }
  syncArchiveSpotlightClass();
  setSpotlightTarget(50, 48, true);
  syncArchiveTimelineState(null);
  resetArchiveDetailPanel();
}

ensureImmortalsData().catch((err) => {
  console.error('Initial Immortals preload failed:', err);
});

ensureArchiveManifest().catch((err) => {
  console.warn('Archive manifest preload failed:', err);
});

applyLanguageMode();
handleInitialViewRequest();
window.addEventListener('popstate', handleViewPopState);

window.MottoArchive = window.MottoArchive || {};
window.MottoArchive.setSpotlight = (enabled = true) => setArchiveSpotlightEnabled(enabled);
window.MottoArchive.toggleSpotlight = () => toggleArchiveSpotlightEnabled();
window.MottoArchive.disableOverlay = true;

window.addEventListener('hashchange', handleArchiveHashChange);
handleArchiveHashChange();
