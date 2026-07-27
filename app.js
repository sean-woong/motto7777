(() => {
  "use strict";

  const app = document.querySelector("#app");
  const header = document.querySelector("[data-header]");
  const footer = document.querySelector("[data-footer]");
  const audio = document.querySelector("[data-audio-engine]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const cursor = document.querySelector("[data-cursor]");
  const statusRegion = document.querySelector("[data-status]");
  const structuredData = document.querySelector("[data-structured-data]");

  const COLLECTION_BASE = "https://assets.motto7777.com/collection/originals";
  const COLLECTION_THUMBS_BASE = "https://assets.motto7777.com/collection/thumbs";

  function assetPath(relativePath) {
    const cleanPath = String(relativePath || "")
      .replace(/^(\.\.\/)?assets\//, "")
      .replace(/^\/+/, "");
    const prefix = window.location.pathname.includes("/v2/") ? "../assets" : "assets";
    return `${prefix}/${cleanPath}`;
  }

  const PACKS = [
    {
      id: "military",
      manifest: "SOLDIER",
      label: "MILITARY",
      work: "SOLDIER",
      cover: assetPath("images/original-packs/military.webp")
    },
    {
      id: "motorcycle",
      manifest: "MOTORCYCLE",
      label: "MOTORCYCLE",
      work: "MOTTO",
      cover: assetPath("images/original-packs/motorcycle.webp")
    },
    {
      id: "drag",
      manifest: "DRAG",
      label: "DRAG",
      work: "DRAG",
      cover: assetPath("images/original-packs/drag.webp")
    },
    {
      id: "boxer",
      manifest: "BOXER",
      label: "BOXER",
      work: "BOXER",
      cover: assetPath("images/original-packs/boxer.webp")
    },
    {
      id: "rockstar",
      manifest: "ROCKSTAR",
      label: "ROCKSTAR",
      work: "ROCKSTAR",
      cover: assetPath("images/original-packs/rockstar.webp")
    },
    {
      id: "dealer",
      manifest: "DEALER",
      label: "DEALER",
      work: "DEALER",
      cover: assetPath("images/original-packs/dealer.webp")
    },
    {
      id: "skull",
      manifest: "SKULL",
      label: "SKULL",
      work: "SKULL",
      cover: assetPath("images/original-packs/skull.webp")
    }
  ];

  const PACK_BY_ID = new Map(PACKS.map((pack) => [pack.id, pack]));

  const TRACKS = [
    {
      id: "doomsday",
      number: "01",
      title: "DOOMSDAY",
      archetype: "MILITARY",
      duration: "2:47",
      src: assetPath("audio/doomsday.mp3"),
      bit: "media/8bit/doomsday.mp3"
    },
    {
      id: "motto",
      number: "02",
      title: "MOTTO",
      archetype: "MOTORCYCLE",
      duration: "3:10",
      src: assetPath("audio/motto.mp3"),
      bit: "media/8bit/motto.mp3"
    },
    {
      id: "drag",
      number: "03",
      title: "DRAG",
      archetype: "DRAG",
      duration: "3:32",
      src: assetPath("audio/drag.mp3"),
      bit: "media/8bit/drag.mp3"
    },
    {
      id: "get-lo",
      number: "04",
      title: "7777 (GET LO)",
      archetype: "BOXER",
      duration: "3:08",
      src: assetPath("audio/7777_getlo.mp3"),
      bit: "media/8bit/get-lo.mp3"
    },
    {
      id: "dna-ferrari",
      number: "05",
      title: "DNA FERRARI",
      archetype: "ROCKSTAR",
      duration: "2:10",
      src: assetPath("audio/dna_ferrari.mp3"),
      bit: "media/8bit/dna-ferrari.mp3"
    },
    {
      id: "break",
      number: "06",
      title: "BREAK",
      archetype: "DEALER",
      duration: "1:50",
      src: assetPath("audio/break.mp3"),
      bit: "media/8bit/break.mp3"
    },
    {
      id: "close-encounter",
      number: "07",
      title: "CLOSE ENCOUNTER",
      archetype: "SKULL",
      duration: "1:45",
      src: assetPath("audio/close_encounter.mp3"),
      bit: "media/8bit/close-encounter.mp3"
    }
  ];

  const LEGEND_DESCRIPTIONS = {
    dealer: {
      en: "Dealer — Loop Glitch · Fumes bleed.",
      ko: "딜러 — 루프 글리치 · 연기가 스며든다."
    },
    skull: {
      en: "Skull — Fragment Protocol · Sparks ignite.",
      ko: "스컬 — 프래그먼트 프로토콜 · 스파크가 튄다."
    },
    rockstar: {
      en: "Rockstar — Stall Stage · Smile stalls.",
      ko: "록스타 — 스톨 스테이지 · 미소가 멈춘다."
    },
    drag: {
      en: "Drag — Recode Glam · Everything screams.",
      ko: "드랙 — 리코드 글램 · 모든 것이 비명한다."
    },
    military: {
      en: "Military — Reload Combat · Target locked.",
      ko: "밀리터리 — 리로드 컴뱃 · 조준이 고정된다."
    },
    boxer: {
      en: "Boxer — Loop Fight · Bell rings.",
      ko: "복서 — 루프 파이트 · 종이 울린다."
    },
    motorcycle: {
      en: "Motorcycle — Skid Speed · Veins pulse.",
      ko: "모터사이클 — 스키드 스피드 · 맥박이 뛴다."
    }
  };

  const COPY = {
    en: {
      homeLine: "AN AUDIOVISUAL ARCHIVE OF 7,777 WORKS",
      homeClass: "SELECTED FROM IMMORTALS 77",
      immortalsIntro: "The 77 motion works at the core of MOTTO 7777: seventy Immortals and seven Legends.",
      originalsIntro: "The 7,700 pre-K.I.A. works preserved through seven archetype packs.",
      vaultIntro: "Selected release artifacts, unreleased image studies, process records, physical extensions, and identity work.",
      soundIntro: "The official seven-track album, earlier demo tapes, seven short 8-bit versions, and selected studio records.",
      projectIntro: "The authoritative structure, history, credits, and inquiry record for MOTTO 7777.",
      statement: "MOTTO 7777 links 7,777 visual works with seven archetypes and seven tracks.",
      statementEnd: "After the drop, half of the Originals entered K.I.A."
    },
    ko: {
      homeLine: "7,777점으로 이루어진 오디오비주얼 아카이브",
      homeClass: "IMMORTALS 77에서 선택",
      immortalsIntro: "MOTTO 7777의 중심에 있는 77개의 모션 작품: 70 Immortals와 7 Legends.",
      originalsIntro: "일곱 아키타입 팩으로 보존된 K.I.A. 이전의 7,700개 원본 작품.",
      vaultIntro: "선별된 발매 아티팩트, 미공개 이미지 스터디, 제작 기록, 실물 오브젝트와 아이덴티티 작업.",
      soundIntro: "정식 발매된 일곱 트랙, 이전 데모 테이프, 일곱 개의 짧은 8-bit 버전과 선별된 스튜디오 기록.",
      projectIntro: "MOTTO 7777의 구조, 역사, 크레딧과 문의를 정리한 공식 기록.",
      statement: "MOTTO 7777은 7,777개의 작품과 일곱 아키타입, 일곱 트랙을 연결한다.",
      statementEnd: "드롭 이후 Originals의 절반은 K.I.A. 상태로 전환되었다."
    },
    ja: {
      homeLine: "7,777作品によるオーディオビジュアル・アーカイブ",
      homeClass: "IMMORTALS 77より選出",
      immortalsIntro: "MOTTO 7777の核となる77のモーション作品。70 Immortalsと7 Legends。",
      originalsIntro: "7つのアーキタイプ・パックに保存されたK.I.A.以前の7,700点。",
      vaultIntro: "選定されたリリース資料、未公開イメージ、制作記録、フィジカル作品、アイデンティティ研究。",
      soundIntro: "7曲の公式アルバム、初期デモ、7つの短い8-bit版、選定されたスタジオ記録。",
      projectIntro: "MOTTO 7777の構造、歴史、クレジット、問い合わせの公式記録。",
      statement: "MOTTO 7777は7,777の作品、7つのアーキタイプ、7つの楽曲を結ぶ。",
      statementEnd: "ドロップ後、Originalsの半数がK.I.A.へ移行した。"
    }
  };

  const state = {
    lang: "en",
    immortals: [],
    collection: null,
    dataError: "",
    immortalsFilter: "all",
    immortalsQuery: "",
    discoverRound: 1,
    homePool: [],
    homeIndex: 0,
    currentRoute: "",
    packScroll: new Map(),
    cleanups: [],
    currentAudioId: "",
    currentAudioMode: "",
    soundChannel: "doomsday",
    searchTimer: 0,
    useOriginalThumbnails: false
  };

  let dataPromise;
  let menuReturnFocus = null;

  function safeStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Preference persistence is optional.
    }
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function copy() {
    return COPY[state.lang] || COPY.en;
  }

  function immortalDescription(item) {
    if (!item) return "";
    const description = item.description || (item.legend ? LEGEND_DESCRIPTIONS[item.archetype] : null);
    if (!description) return "";
    if (typeof description === "string") return description;
    if (state.lang === "ko") {
      return description.ko || description.kr || description.en || "";
    }
    if (state.lang === "ja") {
      return description.ja || description.en || "";
    }
    return description.en || description.ko || description.kr || "";
  }

  function normalizeImmortal(item) {
    const rawArchetype = String(item.archetype || item.category || "").toLowerCase();
    const archetype = rawArchetype === "soldier" ? "military" : rawArchetype;
    const pack = PACK_BY_ID.get(archetype);
    const numberMatch = String(item.title || item.id || "").match(/\d+/);
    const number = numberMatch ? Number(numberMatch[0]) : null;
    const workName = pack?.work || String(item.category || "").toUpperCase();
    const title = item.legend
      ? `${titleCase(workName)} Legend`
      : `Immortals #${number} (${titleCase(workName)})`;

    return {
      ...item,
      archetype,
      number,
      publicArchetype: pack?.label || String(item.category || "").toUpperCase(),
      publicTitle: title,
      classLabel: item.legend ? "LEGEND / PROTOCOL-7" : "IMMORTAL"
    };
  }

  function immortalPoster(item) {
    return `media/immortals-posters/${encodeURIComponent(item.id)}.webp`;
  }

  function immortalMotion(item) {
    return assetPath(item.thumb);
  }

  function immortalVideo(item) {
    return `media/immortals-motion/${encodeURIComponent(item.id)}.mp4`;
  }

  function homePreviewVideo(item) {
    return `media/home-motion/${encodeURIComponent(item.id)}.mp4`;
  }

  function trackForArchetype(archetype) {
    const pack = PACK_BY_ID.get(archetype);
    return TRACKS.find((track) => track.archetype === pack?.label);
  }

  function immortalSearchText(item) {
    return [
      item.publicTitle,
      item.publicArchetype,
      item.classLabel,
      ...(Array.isArray(item.tags) ? item.tags : []),
      immortalDescription(item)
    ]
      .join(" ")
      .toLowerCase();
  }

  function matchesImmortalQuery(item) {
    const query = state.immortalsQuery.trim().toLowerCase();
    return !query || immortalSearchText(item).includes(query);
  }

  function titleCase(value) {
    const string = String(value || "").toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function loadData() {
    if (dataPromise) return dataPromise;
    dataPromise = Promise.all([
      fetch(assetPath("data/immortals.json")).then((response) => {
        if (!response.ok) throw new Error("Immortals data unavailable");
        return response.json();
      }),
      fetch(assetPath("data/collection.json")).then((response) => {
        if (!response.ok) throw new Error("Original collection data unavailable");
        return response.json();
      })
    ])
      .then(([immortals, collection]) => {
        state.immortals = immortals.map(normalizeImmortal);
        state.collection = collection;
        buildHomePool();
        probeOriginalThumbnails().then((available) => {
          const changed = available && !state.useOriginalThumbnails;
          state.useOriginalThumbnails = available;
          if (changed && getRoute().section === "originals") {
            render({ preserveScroll: true });
          }
        });
      })
      .catch((error) => {
        state.dataError = error.message || "Archive data unavailable";
      });
    return dataPromise;
  }

  function probeOriginalThumbnails() {
    return new Promise((resolve) => {
      const image = new Image();
      const timer = window.setTimeout(() => resolve(false), 2500);
      image.onload = () => {
        window.clearTimeout(timer);
        resolve(true);
      };
      image.onerror = () => {
        window.clearTimeout(timer);
        resolve(false);
      };
      image.src = `${COLLECTION_THUMBS_BASE}/_ready.webp`;
    });
  }

  function buildHomePool() {
    const curatedIds = [
      "dealer-471",
      "skull-57",
      "rockstar-251",
      "drag-233",
      "soldier-397",
      "motorcycle-267",
      "boxer-376"
    ];
    const legends = sortByOfficialArchetype(
      state.immortals.filter((item) => item.legend)
    );
    const selected = curatedIds
      .map((id) => state.immortals.find((item) => item.id === id))
      .filter(Boolean);

    PACKS.forEach((pack) => {
      if (!selected.some((item) => item.archetype === pack.id)) {
        const fallback = state.immortals.find(
          (item) => !item.legend && item.archetype === pack.id
        );
        if (fallback) selected.push(fallback);
      }
    });

    const selectedByArchetype = sortByOfficialArchetype(selected);
    state.homePool = legends.flatMap((legend, index) => {
      const companion = selectedByArchetype[index];
      return companion ? [legend, companion] : [legend];
    });
    state.homeIndex = 0;
  }

  function sortByOfficialArchetype(items) {
    const order = new Map(PACKS.map((pack, index) => [pack.id, index]));
    return [...items].sort((a, b) => {
      const archetypeOrder =
        (order.get(a.archetype) ?? 99) - (order.get(b.archetype) ?? 99);
      if (archetypeOrder !== 0) return archetypeOrder;
      if (Boolean(a.legend) !== Boolean(b.legend)) return a.legend ? -1 : 1;
      return (a.number ?? 0) - (b.number ?? 0);
    });
  }

  function interleaveImmortals(items) {
    const groups = PACKS.map((pack) =>
      items
        .filter((item) => item.archetype === pack.id)
        .sort((a, b) => (a.number ?? 0) - (b.number ?? 0))
    );
    const result = [];
    const length = Math.max(0, ...groups.map((group) => group.length));
    for (let index = 0; index < length; index += 1) {
      groups.forEach((group) => {
        if (group[index]) result.push(group[index]);
      });
    }
    return result;
  }

  function shuffle(input, seed = Date.now()) {
    const result = [...input];
    const random = seededRandom(seed);
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1));
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  }

  function seededRandom(seed) {
    let value = seed >>> 0;
    return () => {
      value += 0x6d2b79f5;
      let t = value;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function getRoute() {
    const params = new URLSearchParams(location.search);
    const queryView = params.get("view");
    const legacyRaw = location.hash.replace(/^#\/?/, "");
    const raw = queryView || legacyRaw || "home";
    const parts = legacyRaw && !queryView ? legacyRaw.split("/").filter(Boolean) : [];
    const section = queryView || parts[0] || "home";

    if (queryView === "immortals" && params.get("work")) {
      return {
        type: "immortal-detail",
        section: "immortals",
        id: params.get("work") || ""
      };
    }
    if (queryView === "originals" && params.get("pack")) {
      const packId = params.get("pack") || "";
      const work = params.get("work");
      if (work) {
        return {
          type: "original-detail",
          section: "originals",
          packId,
          number: Number(work)
        };
      }
      return { type: "pack", section: "originals", packId };
    }

    if (section === "immortals" && parts[1] === "work") {
      return { type: "immortal-detail", section: "immortals", id: parts[2] || "" };
    }
    if (section === "originals" && parts[1]) {
      if (parts[2]) {
        return {
          type: "original-detail",
          section: "originals",
          packId: parts[1],
          number: Number(parts[2])
        };
      }
      return { type: "pack", section: "originals", packId: parts[1] };
    }
    if (section === "kia") return { type: "kia", section: "originals" };
    if (["home", "immortals", "originals", "vault", "sound", "project"].includes(section)) {
      return { type: section, section };
    }
    return { type: "home", section: "home" };
  }

  function routeHref(view, options = {}) {
    const params = new URLSearchParams({ view });
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });
    return `?${params.toString()}`;
  }

  function navigate(href, replace = false) {
    const url = new URL(href, location.href);
    const next = `${url.pathname}${url.search}`;
    history[replace ? "replaceState" : "pushState"]({}, "", next);
    render();
  }

  function routeKey(route) {
    return [route.type, route.packId, route.number, route.id].filter(Boolean).join(":");
  }

  function cleanPage() {
    state.cleanups.forEach((cleanup) => {
      try {
        cleanup();
      } catch {
        // Page cleanup should not block navigation.
      }
    });
    state.cleanups = [];
    document.querySelectorAll("video").forEach((video) => {
      try {
        video.pause();
      } catch {
        // Ignore media cleanup failures.
      }
    });
  }

  async function render(options = {}) {
    const { preserveScroll = false, preserveFocus = "" } = options;
    const previousScroll = window.scrollY;
    const route = getRoute();
    const key = routeKey(route);
    const previousRoute = state.currentRoute;

    cleanPage();
    closeMenu(false);
    if (route.type !== "sound") stopAudio();

    await loadData();

    const renderers = {
      home: renderHome,
      immortals: renderImmortals,
      "immortal-detail": renderImmortalDetail,
      originals: renderOriginals,
      pack: renderPackArchive,
      "original-detail": renderOriginalDetail,
      kia: renderKia,
      vault: renderVault,
      sound: renderSound,
      project: renderProject
    };

    const renderer = renderers[route.type] || renderHome;
    app.innerHTML = renderer(route);
    document.body.dataset.section = route.type === "kia" ? "kia" : route.section;
    bindPage(route);
    bindMediaFallbacks();
    setActiveNav(route.section);
    setDocumentTitle(route);
    state.currentRoute = key;

    requestAnimationFrame(() => {
      if (preserveFocus === "immortal-search") {
        const input = document.querySelector("[data-immortal-search]");
        input?.focus({ preventScroll: true });
        if (input instanceof HTMLInputElement) {
          input.setSelectionRange(input.value.length, input.value.length);
        }
      }
      if (preserveScroll) {
        window.scrollTo(0, previousScroll);
        return;
      }

      const returningToPack =
        route.type === "pack" &&
        previousRoute.startsWith(`original-detail:${route.packId}`);
      if (returningToPack && state.packScroll.has(route.packId)) {
        window.scrollTo(0, state.packScroll.get(route.packId));
        return;
      }

      window.scrollTo(0, 0);
      app.focus({ preventScroll: true });
    });
  }

  function setDocumentTitle(route) {
    const labels = {
      home: "MOTTO 7777",
      immortals: "IMMORTALS 77",
      originals: "ORIGINAL 7700",
      vault: "VAULT",
      sound: "SOUND",
      project: "PROJECT",
      kia: "K.I.A."
    };
    const immortal =
      route.type === "immortal-detail"
        ? state.immortals.find((item) => item.id === route.id)
        : null;
    const originalPack =
      route.section === "originals" ? PACK_BY_ID.get(route.packId) : null;
    const pageTitle = immortal?.publicTitle ||
      (route.type === "original-detail" && originalPack
        ? `${originalPack.label} ${route.number}`
        : route.type === "pack" && originalPack
          ? `${originalPack.label} / ORIGINAL 7700`
          : labels[route.type] || labels[route.section] || "MOTTO 7777");
    document.title = route.type === "home"
      ? "MOTTO 7777 — Audiovisual Archive"
      : `${pageTitle} — MOTTO 7777`;
    document.documentElement.lang = state.lang === "ko" ? "ko" : state.lang === "ja" ? "ja" : "en";
    const description = document.querySelector('meta[name="description"]');
    const socialDescription = document.querySelector('meta[property="og:description"]');
    const routeDescription = {
      home: "MOTTO 7777 — an audiovisual archive of 7,777 works.",
      immortals: "IMMORTALS 77 — seventy Immortals and seven singular Legends.",
      originals: "ORIGINAL 7700 — seven archetype packs preserved before K.I.A.",
      vault: "Selected release artifacts, unreleased studies, process records, objects, and identity work from MOTTO 7777.",
      sound: "Seven tracks, seven archetypes, demos, 8-bit versions, and studio records.",
      project: "The structure, timeline, credits, and inquiry record for MOTTO 7777.",
      kia: "K.I.A. — the completed post-drop event that split the 7,700 Originals."
    }[route.type] || {
      immortals: "IMMORTALS 77 — seventy Immortals and seven singular Legends.",
      originals: "ORIGINAL 7700 — seven archetype packs preserved before K.I.A."
    }[route.section] || "MOTTO 7777 — an audiovisual archive of 7,777 works.";
    const finalDescription = immortal
      ? `${immortal.publicTitle} — ${immortalDescription(immortal)}`
      : route.type === "original-detail" && originalPack
        ? `${originalPack.label} ${route.number}, preserved in its original pre-K.I.A. state.`
        : routeDescription;
    const canonicalUrl = productionUrlForRoute(route);
    const socialImage = immortal
      ? `https://motto7777.com/${immortalPoster(immortal)}`
      : route.type === "vault"
        ? "https://motto7777.com/media/vault-drop-page-cover-final.webp"
        : "https://motto7777.com/media/project-teaser-poster.jpg";

    description?.setAttribute("content", finalDescription);
    socialDescription?.setAttribute("content", finalDescription);
    setMeta('meta[property="og:title"]', "content", pageTitle);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:image"]', "content", socialImage);
    setMeta('meta[property="og:image:alt"]', "content", pageTitle);
    setMeta('meta[property="og:image:width"]', "content", immortal ? "500" : "1280");
    setMeta('meta[property="og:image:height"]', "content", immortal ? "500" : "720");
    setMeta('meta[name="twitter:title"]', "content", pageTitle);
    setMeta('meta[name="twitter:description"]', "content", finalDescription);
    setMeta('meta[name="twitter:image"]', "content", socialImage);
    setMeta('meta[name="twitter:image:alt"]', "content", pageTitle);
    setMeta('link[rel="canonical"]', "href", canonicalUrl);
    updateStructuredData(route, pageTitle, finalDescription, canonicalUrl, socialImage);
  }

  function productionUrlForRoute(route) {
    const base = "https://motto7777.com/";
    if (route.type === "immortal-detail") {
      return `${base}works/immortals/${encodeURIComponent(route.id)}/`;
    }
    if (route.type === "original-detail") {
      return `${base}${routeHref("originals", {
        pack: route.packId,
        work: route.number
      })}`;
    }
    if (route.type === "pack") {
      return `${base}originals/${encodeURIComponent(route.packId)}/`;
    }
    const view = route.type === "kia" ? "kia" : route.section || "home";
    return view === "home" ? base : `${base}${encodeURIComponent(view)}/`;
  }

  function setMeta(selector, attribute, value) {
    document.querySelector(selector)?.setAttribute(attribute, value);
  }

  function updateStructuredData(route, title, description, url, image) {
    if (!structuredData) return;
    const isJointProjectRecord =
      route.type === "home" || route.section === "project";
    const workType =
      route.type === "immortal-detail" || route.type === "original-detail"
        ? "VisualArtwork"
        : route.type === "pack" ||
            route.section === "immortals" ||
            route.section === "originals"
          ? "CollectionPage"
        : "CreativeWork";
    const record = {
      "@context": "https://schema.org",
      "@type": workType,
      name: title,
      url,
      image,
      description,
      inLanguage: document.documentElement.lang,
      dateCreated: "2024",
      datePublished: "2025-12",
      creator: isJointProjectRecord
        ? [
            {
              "@type": "Person",
              name: "Sean Woong",
              description: "World building and visual direction"
            },
            {
              "@type": "Person",
              name: "Haz Haus",
              description: "World building, album production, and sound direction"
            }
          ]
        : {
            "@type": "Person",
            name: "Sean Woong"
          },
      isPartOf: {
        "@type": "CreativeWork",
        name: "MOTTO 7777",
        url: "https://motto7777.com/"
      }
    };
    if (workType === "VisualArtwork") {
      record.artform = "Digital art";
      record.genre = "Audiovisual art";
    }
    const includesSoundAuthorship =
      route.type === "home" ||
      route.type === "immortal-detail" ||
      route.type === "kia" ||
      route.section === "immortals" ||
      route.section === "sound" ||
      route.section === "project";
    if (includesSoundAuthorship && !isJointProjectRecord) {
      record.contributor = {
        "@type": "Person",
        name: "Haz Haus",
        description: "Sound production"
      };
    }
    structuredData.textContent = JSON.stringify(record);
  }

  function setActiveNav(section) {
    document.querySelectorAll("[data-nav]").forEach((link) => {
      const active = link.dataset.nav === section;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
    document.querySelectorAll("[data-lang]").forEach((button) => {
      const active = button.dataset.lang === state.lang;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function announce(message) {
    if (!statusRegion) return;
    statusRegion.textContent = "";
    requestAnimationFrame(() => {
      statusRegion.textContent = message;
    });
  }

  function renderDataError() {
    return `<div class="empty-state">${escapeHTML(state.dataError || "ARCHIVE DATA LOADING")}</div>`;
  }

  function renderHome() {
    if (!state.homePool.length) {
      return `<section class="page page--home">${renderDataError()}</section>`;
    }
    const item = state.homePool[state.homeIndex % state.homePool.length];
    const c = copy();
    const description = immortalDescription(item);
    return `
      <section class="page page--home">
        <div class="home-stage">
          <a class="home-art" href="${routeHref("immortals", { work: item.id })}" data-route aria-label="Open ${escapeHTML(item.publicTitle)}">
            ${renderHomeMedia(item)}
          </a>
          <div class="home-copy">
            <span class="eyebrow">${escapeHTML(c.homeLine)}</span>
            <h1>${escapeHTML(item.publicTitle)}</h1>
            <div class="home-copy__class">${escapeHTML(item.classLabel)} · ${escapeHTML(item.publicArchetype)}</div>
            ${description ? `<p class="home-description">${escapeHTML(description)}</p>` : ""}
            <div class="home-actions">
              <button type="button" data-next-signal>NEXT SIGNAL →</button>
              <a class="text-link" href="${routeHref("immortals")}" data-route>ENTER IMMORTALS 77 →</a>
            </div>
          </div>
        </div>
        <div class="home-ledger" aria-label="Project structure">
          ${homeLedgerCell("TOTAL WORKS", "7,777")}
          ${homeLedgerCell("ORIGINALS", "7,700")}
          ${homeLedgerCell("IMMORTALS", "77")}
          ${homeLedgerCell("ARCHETYPES / TRACKS", "7 / 7")}
        </div>
      </section>
    `;
  }

  function renderHomeMedia(item) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean(navigator.connection?.saveData);
    if (reduceMotion || saveData) {
      return `<img src="${immortalPoster(item)}" alt="${escapeHTML(item.publicTitle)}" fetchpriority="high">`;
    }
    return `
      <video
        src="${homePreviewVideo(item)}"
        poster="${immortalPoster(item)}"
        muted
        loop
        autoplay
        playsinline
        preload="metadata"
        aria-label="${escapeHTML(item.publicTitle)} motion preview"
        data-home-video
      ></video>
    `;
  }

  function homeLedgerCell(label, value) {
    return `
      <div class="home-ledger__cell">
        <span class="data-label">${label}</span>
        <strong>${value}</strong>
      </div>
    `;
  }

  function renderImmortals() {
    if (!state.immortals.length) {
      return `<section class="page">${renderDataError()}</section>`;
    }
    const legends = sortByOfficialArchetype(
      state.immortals.filter((item) => item.legend)
    );
    const immortalWorks = state.immortals.filter((item) => !item.legend);
    const filteredLegends =
      state.immortalsFilter === "all"
        ? legends
        : legends.filter((item) => item.archetype === state.immortalsFilter);
    const filteredWorks =
      state.immortalsFilter === "all"
        ? immortalWorks
        : immortalWorks.filter((item) => item.archetype === state.immortalsFilter);
    const visibleLegends = filteredLegends.filter(matchesImmortalQuery);
    const visibleWorks = state.immortalsFilter === "all"
      ? interleaveImmortals(filteredWorks.filter(matchesImmortalQuery))
      : filteredWorks
          .filter(matchesImmortalQuery)
          .sort((a, b) => (a.number ?? 0) - (b.number ?? 0));

    return `
      <section class="page">
        ${pageMast("01 / MOTION ARCHIVE", "IMMORTALS<br>77", copy().immortalsIntro, "70 IMMORTALS + 7 LEGENDS", "mast-immortals")}

        ${visibleLegends.length ? `
          <section class="section">
            ${sectionHead("01", "PROTOCOL-7 / LEGENDS", "Seven archetypes in the official album order. Seven singular motion works.")}
            <div class="protocol-grid">
              ${visibleLegends.map(renderImmortalCard).join("")}
            </div>
          </section>
        ` : ""}

        <section class="section">
          ${sectionHead("02", "IMMORTALS 70", `<span data-immortal-count>${visibleWorks.length}</span> works in the current field.`)}
          ${renderImmortalFilters()}
          ${visibleWorks.length
            ? `<div class="immortals-grid">${visibleWorks.map(renderImmortalCard).join("")}</div>`
            : `<div class="empty-state">NO IMMORTALS MATCH THE CURRENT SIGNAL.</div>`}
        </section>

        ${pageClosing(routeHref("originals"), "CONTINUE TO ORIGINAL 7700")}
      </section>
    `;
  }

  function renderImmortalFilters() {
    const filters = [
      ["all", "ALL"],
      ...PACKS.map((pack) => [pack.id, pack.label])
    ];
    return `
      <div class="immortal-tools">
        <div class="filter-row" aria-label="Filter Immortals by archetype">
          ${filters
            .map(
              ([id, label]) => `
                <button type="button" data-immortal-filter="${id}" aria-pressed="${state.immortalsFilter === id}" class="${state.immortalsFilter === id ? "is-active" : ""}">
                  ${label}
                </button>
              `
            )
            .join("")}
        </div>
        <label class="immortal-search">
          <span>SEARCH THE 77</span>
          <input
            type="search"
            value="${escapeHTML(state.immortalsQuery)}"
            placeholder="NUMBER / ARCHETYPE / SIGNAL"
            data-immortal-search
            autocomplete="off"
          >
        </label>
      </div>
    `;
  }

  function renderImmortalCard(item) {
    return `
      <article class="work-card" data-immortal-card>
        <a class="work-card__button" href="${routeHref("immortals", { work: item.id })}" data-route aria-label="Open ${escapeHTML(item.publicTitle)}">
          <div class="work-card__media">
            <img
              src="${immortalPoster(item)}"
              data-static-src="${immortalPoster(item)}"
              data-motion-src="${immortalMotion(item)}"
              alt="${escapeHTML(item.publicTitle)}"
              loading="lazy"
              decoding="async"
            >
          </div>
          <div class="work-caption">
            <span>${escapeHTML(item.publicTitle)}</span>
            <span>${escapeHTML(item.classLabel)} · ${escapeHTML(item.publicArchetype)}</span>
          </div>
        </a>
      </article>
    `;
  }

  function renderImmortalDetail(route) {
    const item = state.immortals.find((entry) => entry.id === route.id);
    if (!item) {
      return `<section class="page">${renderDataError()}</section>`;
    }
    const description = immortalDescription(item);
    const related = state.immortals
      .filter((entry) => entry.archetype === item.archetype)
      .sort((a, b) => {
        if (Boolean(a.legend) !== Boolean(b.legend)) return a.legend ? -1 : 1;
        return (a.number ?? 0) - (b.number ?? 0);
      });
    const index = related.findIndex((entry) => entry.id === item.id);
    const previous = related[(index - 1 + related.length) % related.length];
    const next = related[(index + 1) % related.length];
    const linkedTrack = trackForArchetype(item.archetype);

    return `
      <section class="page detail-page">
        <div class="detail-bar">
          <a class="back-link" href="${routeHref("immortals")}" data-route>← BACK TO IMMORTALS</a>
          <span class="meta">${index + 1} / ${related.length} · ${escapeHTML(item.publicArchetype)}</span>
          <div class="detail-nav">
            <a href="${routeHref("immortals", { work: previous.id })}" data-route aria-label="Previous work">PREV</a>
            <a href="${routeHref("immortals", { work: next.id })}" data-route aria-label="Next work">NEXT</a>
          </div>
        </div>
        <div class="detail-stage">
          <div class="detail-media" data-motion-field>
            <img src="${immortalPoster(item)}" alt="${escapeHTML(item.publicTitle)}" fetchpriority="high">
            <button
              class="detail-media__motion-button"
              type="button"
              data-load-motion
              data-src="${immortalVideo(item)}"
              data-title="${escapeHTML(item.publicTitle)}"
            >PLAY FULL MOTION</button>
          </div>
          <div class="detail-copy">
            <span class="eyebrow">${escapeHTML(item.classLabel)} / ${escapeHTML(item.publicArchetype)}</span>
            <h1>${escapeHTML(item.publicTitle)}</h1>
            ${description
              ? `<p class="immortal-description">${escapeHTML(description)}</p>`
              : `<p>One of the seven singular Legends in IMMORTALS 77.</p>`}
            ${linkedTrack ? renderLinkedTrack(linkedTrack) : ""}
            <span class="detail-note">FULL MOTION LOADS ON SELECTION / SOUND REMAINS UNDER VISITOR CONTROL</span>
          </div>
        </div>
      </section>
    `;
  }

  function renderLinkedTrack(track) {
    return `
      <div class="linked-track">
        <span class="micro-label">LINKED 8-BIT SIGNAL / ${track.number}</span>
        <button
          type="button"
          data-audio-track="${track.id}"
          data-audio-mode="8bit"
          data-src="${track.bit}"
          data-title="${escapeHTML(track.title)}"
        >
          <span>${escapeHTML(track.title)}</span>
          <span class="track-action">PLAY 0:15</span>
        </button>
      </div>
    `;
  }

  function renderOriginals() {
    if (!state.collection) {
      return `<section class="page">${renderDataError()}</section>`;
    }
    const discover = buildDiscoverItems();
    return `
      <section class="page">
        ${pageMast("02 / PRE-K.I.A. ARCHIVE", "ORIGINAL<br>7700", copy().originalsIntro, "7 PACKS / 1,100 WORKS EACH", "mast-originals")}

        <section class="section">
          ${sectionHead("01", "SEVEN PACKS", "Chapter covers in the official seven-track order. Military is the public pack; Soldier is its work title.")}
          <div class="pack-wall">
            ${PACKS.map(renderPackCard).join("")}
          </div>
        </section>

        <section class="section">
          ${sectionHead("02", "DISCOVER 28", "Four real source works from each archetype, interleaved across the field.")}
          <div class="section-tools"><button type="button" data-reshuffle>RESHUFFLE 28</button></div>
          <div class="discover-grid">
            ${discover.map(renderOriginalCard).join("")}
          </div>
        </section>

        <section class="section">
          <a class="kia-entry" href="${routeHref("kia")}" data-route>
            <h2>AFTER THE DROP, THE ARCHIVE SPLIT.</h2>
            <span class="text-link">ENTER K.I.A. →</span>
          </a>
        </section>
      </section>
    `;
  }

  function renderPackCard(pack, index) {
    const track = trackForArchetype(pack.id);
    return `
      <a class="pack-card" href="${routeHref("originals", { pack: pack.id })}" data-route aria-label="Open ${pack.label} archive">
        <div class="pack-card__image">
          <img src="${pack.cover}" alt="${pack.label} pack design" loading="${index < 4 ? "eager" : "lazy"}" decoding="async">
        </div>
        <div class="pack-label">
          <span>${pack.label}</span>
          <span>${track ? `${track.number} / ${track.title}` : "1,100 WORKS"}</span>
        </div>
        <span class="pack-count">1,100 ORIGINAL WORKS</span>
      </a>
    `;
  }

  function getManifestPack(pack) {
    return state.collection?.packs?.find((entry) => entry.name === pack.manifest);
  }

  function buildOriginalItem(pack, number) {
    const manifest = getManifestPack(pack);
    const prefix = String(manifest?.prefix || "").trim();
    const filename = `${prefix ? `${prefix} ` : ""}${number}.png`;
    return {
      pack,
      number,
      filename,
      url: `${COLLECTION_BASE}/${encodeURIComponent(filename)}`,
      thumbUrl: `${COLLECTION_THUMBS_BASE}/${encodeURIComponent(filename.replace(/\.png$/i, ".webp"))}`,
      label: pack.id === "military" || pack.id === "motorcycle"
        ? `${pack.label} — ${pack.work} ${number}`
        : `${pack.label} ${number}`
    };
  }

  function buildDiscoverItems() {
    const groups = PACKS.map((pack, packIndex) => {
      const manifest = getManifestPack(pack);
      const numbers = shuffle(
        manifest?.numbers || [],
        state.discoverRound * 997 + packIndex * 131
      ).slice(0, 4);
      return numbers.map((number) => buildOriginalItem(pack, number));
    });
    const interleaved = [];
    for (let row = 0; row < 4; row += 1) {
      groups.forEach((group) => {
        if (group[row]) interleaved.push(group[row]);
      });
    }
    return interleaved;
  }

  function renderOriginalCard(item) {
    return `
      <article class="work-card">
        <a
          class="work-card__button"
          href="${routeHref("originals", { pack: item.pack.id, work: item.number })}"
          data-route
          data-store-pack-scroll="${item.pack.id}"
          aria-label="Open ${escapeHTML(item.label)}"
        >
          <div class="work-card__media">
            <img src="${state.useOriginalThumbnails ? item.thumbUrl : item.url}" alt="${escapeHTML(item.label)}" loading="lazy" decoding="async" fetchpriority="low" data-media-label="${escapeHTML(item.label)}">
          </div>
          <div class="work-caption">
            <span>${escapeHTML(item.label)}</span>
          </div>
        </a>
      </article>
    `;
  }

  function renderPackArchive(route) {
    const pack = PACK_BY_ID.get(route.packId);
    const manifest = pack && getManifestPack(pack);
    const track = pack && trackForArchetype(pack.id);
    if (!pack || !manifest) {
      return `<section class="page">${renderDataError()}</section>`;
    }
    const numbers = manifest.numbers || [];
    const maxSource = Math.max(...numbers);
    const chapterSources = [0, 249, 499, 749, 999]
      .map((index) => numbers[index])
      .filter(Number.isFinite);
    return `
      <section class="page">
        <div class="pack-archive-head">
          <div>
            <a class="back-link" href="${routeHref("originals")}" data-route>← BACK TO ORIGINAL 7700</a>
            <h1>${pack.label}</h1>
          </div>
          <div class="archive-counter">
            <strong>1,100 ORIGINAL WORKS</strong>
            <span>PRE-K.I.A. / ${track ? `${track.number} ${track.title}` : "EXACT SOURCE ORDER"}</span>
          </div>
        </div>
        <div class="archive-jump" data-archive-jump>
          <form data-jump-form>
            <label for="archive-number">JUMP TO SOURCE #</label>
            <input id="archive-number" type="number" min="1" max="${maxSource}" inputmode="numeric" placeholder="1–${maxSource}" data-jump-number>
            <button type="submit">GO</button>
          </form>
          <div class="archive-chapters" aria-label="Archive position shortcuts">
            ${chapterSources.map((value) => `<button type="button" data-jump-number-shortcut="${value}">${value}</button>`).join("")}
          </div>
        </div>
        <div class="micro-archive-wrap">
          <div class="micro-archive-note">
            <span>COMPLETE IMAGES / CONTACT SHEET SCALE</span>
            <span data-visible-range>VISIBLE FIELD</span>
          </div>
          <div
            class="micro-archive"
            data-micro-archive
            data-pack="${pack.id}"
            aria-label="${pack.label} archive of 1,100 works"
          ></div>
        </div>
        <div class="page-closing">
          <a class="next-link" href="${routeHref("kia")}" data-route>ENTER K.I.A. →</a>
        </div>
      </section>
    `;
  }

  function setupMicroArchive(pack) {
    const grid = document.querySelector("[data-micro-archive]");
    const range = document.querySelector("[data-visible-range]");
    const jumpForm = document.querySelector("[data-jump-form]");
    const jumpInput = document.querySelector("[data-jump-number]");
    const manifest = getManifestPack(pack);
    if (!grid || !manifest) return;
    const numbers = manifest.numbers || [];
    const maxSource = Math.max(...numbers);
    let frame = 0;
    let layout = null;
    let lastSignature = "";

    const measure = () => {
      const width = grid.clientWidth;
      const viewportWidth = window.innerWidth;
      const columns = viewportWidth <= 560 ? 4 : viewportWidth <= 980 ? 7 : 12;
      const gap = viewportWidth <= 560 ? 3 : 4;
      const cell = Math.floor((width - gap * (columns - 1)) / columns);
      const rowHeight = cell + gap;
      const rows = Math.ceil(numbers.length / columns);
      const top = grid.getBoundingClientRect().top + window.scrollY;
      layout = { width, columns, gap, cell, rowHeight, rows, top };
      grid.style.height = `${rows * rowHeight - gap}px`;
      lastSignature = "";
      draw();
    };

    const draw = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!layout) return;
        const relativeTop = Math.max(0, window.scrollY - layout.top);
        const relativeBottom = Math.max(
          0,
          window.scrollY + window.innerHeight - layout.top
        );
        const startRow = Math.max(0, Math.floor(relativeTop / layout.rowHeight) - 1);
        const endRow = Math.min(
          layout.rows,
          Math.ceil(relativeBottom / layout.rowHeight) + 2
        );
        const start = startRow * layout.columns;
        const end = Math.min(numbers.length, endRow * layout.columns);
        const signature = `${start}:${end}:${layout.columns}:${layout.cell}`;
        if (signature === lastSignature) return;
        lastSignature = signature;

        const fragment = document.createDocumentFragment();
        for (let index = start; index < end; index += 1) {
          const number = numbers[index];
          const item = buildOriginalItem(pack, number);
          const row = Math.floor(index / layout.columns);
          const column = index % layout.columns;
          const link = document.createElement("a");
          link.className = "micro-work";
          link.href = routeHref("originals", { pack: pack.id, work: number });
          link.dataset.route = "";
          link.dataset.label = String(number);
          link.dataset.storePackScroll = pack.id;
          link.setAttribute("aria-label", `Open ${item.label}`);
          link.style.width = `${layout.cell}px`;
          link.style.height = `${layout.cell}px`;
          link.style.left = `${column * layout.rowHeight}px`;
          link.style.top = `${row * layout.rowHeight}px`;
          const image = document.createElement("img");
          image.src = state.useOriginalThumbnails ? item.thumbUrl : item.url;
          image.alt = "";
          image.loading = "eager";
          image.decoding = "async";
          image.fetchPriority = index < start + layout.columns * 2 ? "high" : "auto";
          image.dataset.mediaLabel = item.label;
          link.appendChild(image);
          fragment.appendChild(link);
        }
        grid.replaceChildren(fragment);
        if (range) range.textContent = `VISIBLE ${start + 1}–${end} / 1,100`;
        bindPackScrollLinks(grid);
      });
    };

    const jumpToSource = (sourceNumber) => {
      if (!layout) return;
      const exactIndex = numbers.indexOf(sourceNumber);
      const index = exactIndex >= 0
        ? exactIndex
        : numbers.reduce((closest, value, currentIndex) => {
            const currentDistance = Math.abs(value - sourceNumber);
            const closestDistance = Math.abs(numbers[closest] - sourceNumber);
            return currentDistance < closestDistance ? currentIndex : closest;
          }, 0);
      const row = Math.floor(index / layout.columns);
      window.scrollTo({
        top: Math.max(0, layout.top + row * layout.rowHeight - 120),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth"
      });
      announce(`${pack.label} source ${numbers[index]} shown in the archive.`);
    };

    const onJump = (event) => {
      event.preventDefault();
      const value = Number(jumpInput?.value);
      if (!Number.isFinite(value) || value < 1 || value > maxSource) {
        announce(`Enter a source number between 1 and ${maxSource}.`);
        jumpInput?.focus();
        return;
      }
      jumpToSource(value);
    };

    jumpForm?.addEventListener("submit", onJump);
    document.querySelectorAll("[data-jump-number-shortcut]").forEach((button) => {
      button.addEventListener("click", () => {
        const value = Number(button.dataset.jumpNumberShortcut);
        if (jumpInput) jumpInput.value = String(value);
        jumpToSource(value);
      });
    });

    window.addEventListener("scroll", draw, { passive: true });
    window.addEventListener("resize", measure);
    state.cleanups.push(() => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", draw);
      window.removeEventListener("resize", measure);
      jumpForm?.removeEventListener("submit", onJump);
    });
    measure();
  }

  function renderOriginalDetail(route) {
    const pack = PACK_BY_ID.get(route.packId);
    const manifest = pack && getManifestPack(pack);
    if (!pack || !manifest) {
      return `<section class="page">${renderDataError()}</section>`;
    }
    const numbers = manifest.numbers || [];
    const index = numbers.indexOf(route.number);
    if (index < 0) {
      return `<section class="page"><div class="empty-state">WORK NOT FOUND IN THE VERIFIED MANIFEST.</div></section>`;
    }
    const item = buildOriginalItem(pack, route.number);
    const previous = numbers[(index - 1 + numbers.length) % numbers.length];
    const next = numbers[(index + 1) % numbers.length];
    return `
      <section class="page detail-page">
        <div class="detail-bar">
          <a class="back-link" href="${routeHref("originals", { pack: pack.id })}" data-route>← BACK TO ${pack.label}</a>
          <span class="meta">${index + 1} / 1,100 · PRE-K.I.A.</span>
          <div class="detail-nav">
            <a href="${routeHref("originals", { pack: pack.id, work: previous })}" data-route aria-label="Previous work">PREV</a>
            <a href="${routeHref("originals", { pack: pack.id, work: next })}" data-route aria-label="Next work">NEXT</a>
          </div>
        </div>
        <div class="detail-stage">
          <div class="detail-media">
            <img src="${item.url}" alt="${escapeHTML(item.label)}" data-media-label="${escapeHTML(item.label)}">
          </div>
          <div class="detail-copy">
            <span class="eyebrow">ORIGINAL / ${pack.label}</span>
            <h1>${escapeHTML(item.label)}</h1>
            <p>Original pre-K.I.A. state. Source number preserved from the verified ${pack.label} manifest.</p>
          </div>
        </div>
      </section>
    `;
  }

  function renderKia() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean(navigator.connection?.saveData);
    const shouldAutoplay = !reduceMotion && !saveData;
    return `
      <section class="page">
        ${pageMast("03 / SPECIAL EXHIBITION", "K.I.A.", "Killed in Action: a completed post-drop event affecting the 7,700 Originals only.", "3,850 SURVIVED / 3,850 K.I.A.", "kia-mast")}

        <section class="section">
          <div class="kia-field">
            <div class="kia-work" data-kia-field>
              <video
                poster="media/kia-poster.webp"
                muted
                loop
                playsinline
                preload="none"
                data-kia-video
                data-kia-autoplay="${shouldAutoplay}"
                aria-label="K.I.A. motion artwork"
              >
                <source media="(max-width: 640px)" data-src="media/kia-720.mp4" type="video/mp4">
                <source data-src="media/kia-1080.mp4" type="video/mp4">
              </video>
              <div class="kia-controls" aria-label="K.I.A. motion controls">
                <button type="button" data-kia-play>PLAY</button>
                <button type="button" data-kia-sound>SOUND ON</button>
              </div>
            </div>
            <div class="kia-facts">
              ${kiaFact("01", "ORIGINAL STATE", "7,700 pre-K.I.A. works were released.")}
              ${kiaFact("02", "POST-DROP EVENT", "The archive split evenly as planned.")}
              ${kiaFact("03", "ARCHIVE STATE", "3,850 survived; 3,850 entered K.I.A. Immortals were excluded.")}
            </div>
          </div>
        </section>

        <section class="section">
          <div class="credit-block">
            <h2>ONE IRREVERSIBLE EVENT.</h2>
            <div class="credit-list">
              ${creditRow("VISUAL / MOTION", "SEAN WOONG")}
              ${creditRow("SOUND PRODUCTION", "HAZ HAUS")}
              ${creditRow("AFFECTED SET", "ORIGINAL 7700")}
              ${creditRow("EXCLUDED SET", "IMMORTALS 77")}
              ${creditRow("STATUS", "COMPLETED")}
            </div>
          </div>
        </section>

        ${pageClosing(routeHref("vault"), "CONTINUE TO VAULT")}
      </section>
    `;
  }

  function kiaFact(number, title, description) {
    return `
      <div class="kia-fact">
        <span class="section-index">${number}</span>
        <div>
          <strong>${title}</strong>
          <p>${description}</p>
        </div>
      </div>
    `;
  }

  function renderVault() {
    return `
      <section class="page">
        ${pageMast("04 / MATERIAL ARCHIVE", "VAULT", copy().vaultIntro, "ARTIFACT / STUDY / PROCESS / RECORD / OBJECT", "mast-vault")}

        <section class="section">
          ${sectionHead("01", "RELEASE ARTIFACTS", "Two distinct objects: the Immortals release pack and the seven-archetype completion reward.")}
          <div class="artifact-grid">
            <article class="artifact">
              <div class="artifact-media">
                <img
                  src="media/immortals-special-pack.webp"
                  alt="Immortals special pack design"
                  width="1000"
                  height="1454"
                  loading="lazy"
                  decoding="async"
                >
              </div>
              <h3>IMMORTALS SPECIAL PACK</h3>
              <p>A release-specific pack design used for the Immortals edition. It remains separate from the seven Original pack covers.</p>
            </article>
            <article class="artifact">
              <a class="artifact-media" href="media/ut02-seven-seal.gif" target="_blank" rel="noreferrer" aria-label="Open UT02 Seven Seal at full size">
                <img
                  src="media/ut02-seven-seal.gif"
                  alt="UT02 — Seven Seal animated completion reward"
                  width="2048"
                  height="2048"
                  loading="lazy"
                  decoding="async"
                >
              </a>
              <h3>UT02 — SEVEN SEAL</h3>
              <p>Animated completion reward for collecting all seven archetypes. The visual structure derives from the seven-track list.</p>
            </article>
          </div>
        </section>

        <section class="section">
          ${sectionHead("02", "UNRELEASED IMAGE STUDIES", "Two self-contained visual studies made during the project and held outside the final release system.")}
          <div class="study-grid">
            <figure class="study-record study-record--wide">
              <img
                src="media/vault-drop-page-study.webp"
                alt="Early unused study for the MOTTO 7777 drop page cover"
                width="1440"
                height="810"
                loading="lazy"
                decoding="async"
              >
              <figcaption class="record-caption">
                <span>DROP PAGE COVER / EARLY STUDY</span>
                <span>UNRELEASED · SEAN WOONG</span>
              </figcaption>
            </figure>
            <figure class="study-record study-record--portrait">
              <img
                src="media/vault-rockstar-study.webp"
                alt="Re-edited still derived from Rockstar Legend"
                width="1500"
                height="1500"
                loading="lazy"
                decoding="async"
              >
              <figcaption class="record-caption">
                <span>ROCKSTAR LEGEND / RE-EDITED STILL</span>
                <span>IMAGE STUDY · SEAN WOONG</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section class="section">
          ${sectionHead("03", "PROCESS / MOTION", "Two concise records of decisions and development: pack composition, then the teaser motorcycle from animatic to final shot.")}
          <div class="process-records">
            <figure class="process-record process-record--pack">
              <div class="process-record__media">
                <video
                  controls
                  controlslist="nodownload"
                  playsinline
                  preload="none"
                  poster="media/vault-pack-composition-poster.webp"
                  data-vault-video
                  aria-label="Pack composition study screen recording"
                >
                  <source data-src="media/vault-pack-composition.mp4" type="video/mp4">
                </video>
              </div>
              <figcaption class="record-caption">
                <span>PACK COMPOSITION STUDY</span>
                <span>SCREEN RECORD EDIT · 00:18</span>
              </figcaption>
            </figure>

            <figure class="process-record process-record--motorcycle">
              <div class="process-record__media">
                <video
                  controls
                  controlslist="nodownload"
                  playsinline
                  preload="none"
                  poster="media/vault-motorcycle-development-poster.webp"
                  data-vault-video
                  aria-label="3D motorcycle animatic and final teaser shot"
                >
                  <source data-src="media/vault-motorcycle-development.mp4" type="video/mp4">
                </video>
              </div>
              <figcaption class="record-caption">
                <span>3D MOTORCYCLE — ANIMATIC / FINAL</span>
                <span>TEASER FOOTAGE · @CHEESEPIZZA · 00:10</span>
              </figcaption>
            </figure>
          </div>
          <p class="footnote section-footnote">MOTION LOADS NEAR VIEW / PLAYBACK REMAINS UNDER VISITOR CONTROL</p>
        </section>

        <section class="section">
          ${sectionHead("04", "PUBLIC RELEASE RECORD", "The final drop-page cover and two collection banners retained from the public release system.")}
          <div class="release-record">
            <figure class="release-record__cover">
              <img
                src="media/vault-drop-page-cover-final.webp"
                alt="Final MOTTO 7777 drop page cover image"
                width="1440"
                height="810"
                loading="lazy"
                decoding="async"
              >
              <figcaption class="record-caption">
                <span>DROP PAGE COVER / FINAL</span>
                <span>PUBLIC RELEASE IMAGE</span>
              </figcaption>
            </figure>
          </div>
          <div class="release-banners">
            <figure>
              <img
                src="media/vault-collection-banner.webp"
                alt="MOTTO 7777 Original 7700 collection banner"
                width="1500"
                height="500"
                loading="lazy"
                decoding="async"
              >
              <figcaption class="record-caption">
                <span>COLLECTION BANNER</span>
                <span>ORIGINAL 7700</span>
              </figcaption>
            </figure>
            <figure>
              <img
                src="media/vault-immortals-banner.webp"
                alt="MOTTO 7777 Immortals 77 collection banner"
                width="1500"
                height="500"
                loading="lazy"
                decoding="async"
              >
              <figcaption class="record-caption">
                <span>COLLECTION BANNER</span>
                <span>IMMORTALS 77</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section class="section">
          ${sectionHead("05", "PHYSICAL EXTENSIONS", "Produced objects with limited circulation. This is an archive record, not a shop or fulfillment claim.")}
          <div class="object-ledger">
            ${objectRow("NFC WEB KEYRING", "Produced / web-linked object", "VIEW RECORD ↗", "https://www.youtube.com/watch?v=g9aN_rwTjtY")}
            ${objectRow("SHEMAGH", "Produced project object", "SELECTED CIRCULATION")}
            ${objectRow("LEATHER GLOVES", "Produced project object", "SELECTED CIRCULATION")}
            ${objectRow("MOTTO BAND T-SHIRT", "Produced project object", "PRIVATE ARCHIVE")}
          </div>
          <p class="footnote section-footnote">PROJECT OBJECTS / SELECTED RECORD</p>
        </section>

        <section class="section">
          ${sectionHead("06", "IDENTITY STUDIES", "Three selected works showing the wordmark, motion, and signal language of MOTTO.")}
          <div class="identity-grid">
            ${identityFigure(assetPath("archive/Logo_motto_3.jpg"), "WORDMARK STUDY", "MOTTO wordmark study on a black field", 2732, 2048)}
            ${identityFigure(assetPath("archive/ani_motto.gif"), "ANIMATED MARK", "Animated MOTTO wordmark study on a black field", 2732, 2048)}
            ${identityFigure(assetPath("archive/motto_vhs.gif"), "VHS SIGNAL STUDY", "MOTTO wordmark distorted through a blue VHS signal", 794, 572)}
          </div>
          <p class="footnote section-footnote">IDENTITY ART / MOTION / SELECTED RECORD</p>
        </section>

        ${pageClosing(routeHref("sound"), "CONTINUE TO SOUND")}
      </section>
    `;
  }

  function objectRow(title, description, status, url = "") {
    const statusNode = url
      ? `<a class="text-link" href="${url}" target="_blank" rel="noreferrer">${status}</a>`
      : `<span class="meta">${status}</span>`;
    return `
      <div class="object-row">
        <strong>${title}</strong>
        <span>${description}</span>
        ${statusNode}
      </div>
    `;
  }

  function identityFigure(src, caption, alt, width, height) {
    return `
      <figure>
        <img
          src="${src}"
          alt="${alt}"
          width="${width}"
          height="${height}"
          loading="lazy"
          decoding="async"
        >
        <figcaption>${caption}</figcaption>
      </figure>
    `;
  }

  function renderSound() {
    const albumCover = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? assetPath("images/motto_profile_static.webp")
      : assetPath("archive/motto_profile_inverted.gif");
    return `
      <section class="page">
        ${pageMast("05 / SEVEN-TRACK SYSTEM", "SOUND", copy().soundIntro, "OFFICIAL ALBUM / DEMOS / 8-BIT / STUDIO", "mast-sound")}

        <section class="section sound-opening">
          ${sectionHead("01", "MUSIC — MOTTO", "The official seven-track album is the primary release record.")}
          <div class="sound-release">
            <figure class="sound-release__cover">
              <img
                src="${albumCover}"
                alt="MOTTO official album cover"
                width="500"
                height="500"
                fetchpriority="high"
                decoding="async"
              >
              <figcaption>OFFICIAL ALBUM COVER / INVERTED PROFILE</figcaption>
            </figure>
            <div class="sound-release__copy">
              <span class="eyebrow">OFFICIAL ALBUM / 7 TRACKS</span>
              <h2>MOTTO</h2>
              <p class="sound-release__date">05 JAN 2026</p>
              <a class="text-link" href="https://open.spotify.com/album/2ZzpXvdQhDH4ttHATc52nT?si=5sDQu1dVS3SkL0j6O1OsvQ" target="_blank" rel="noreferrer">LISTEN TO THE OFFICIAL ALBUM ↗</a>
            </div>
          </div>
          <div class="sound-release__credits">
            <div class="credit-list">
              ${creditRow("TRACKS", "7")}
              ${creditRow("RELEASE ARTISTS", "MOTTO / HAZ HAUS / OO.SEAN")}
              ${creditRow("SOUND PRODUCTION", "HAZ HAUS")}
              ${creditRow("COLLECTIVE", "HOMEBOY LUDENS")}
            </div>
          </div>
        </section>

        <section class="section">
          ${sectionHead("02", "SEVEN-CHANNEL SCORE", "Seven tracks map one-to-one to seven archetypes. Select a channel to hear its earlier demo or the 15-second 8-bit version embedded in the corresponding Immortals.")}
          ${renderSevenChannelScore()}
        </section>

        <section class="section">
          ${sectionHead("03", "7777 (GET LO) VISUALIZER", "A separate visual record: music and visualizer credits remain distinct.")}
          ${renderYouTubeFrame("Ec_WY5F9XUg", "7777 (GET LO) Visualizer", "media/get-lo-visualizer-poster.jpg")}
          <div class="film-credit">
            <span>MUSIC — MOTTO</span>
            <span>VISUALIZER — @CHEESEPIZZA</span>
            <a class="text-link" href="https://www.youtube.com/watch?v=Ec_WY5F9XUg" target="_blank" rel="noreferrer">YOUTUBE ↗</a>
          </div>
        </section>

        <section class="section">
          ${sectionHead("04", "STUDIO DOCUMENT", "A selected record of the production environment from the MOTTO sessions.")}
          <div class="studio-document">
            <img
              src="${assetPath("archive/haz_gear_section_01.jpg")}"
              alt="Haz Haus studio equipment and MOTTO session environment"
              width="1508"
              height="1528"
              loading="eager"
              fetchpriority="low"
              decoding="async"
            >
            <div class="studio-document__copy">
              <span class="eyebrow">RAW STUDIO DOCUMENT / SELECTED RECORD</span>
              <h3>MOTTO SESSIONS</h3>
              <p>Selected equipment and working environment from the sessions in which Haz Haus developed the album and seven 8-bit versions.</p>
              <span class="footnote">SOUND PRODUCTION — HAZ HAUS</span>
            </div>
          </div>
        </section>

        ${pageClosing(routeHref("project"), "CONTINUE TO PROJECT")}
      </section>
    `;
  }

  function renderSevenChannelScore() {
    const selectedTrack =
      TRACKS.find((track) => track.id === (state.currentAudioId || state.soundChannel)) ||
      TRACKS[0];
    const selectedPack =
      PACKS.find((pack) => pack.label === selectedTrack.archetype) || PACKS[0];
    return `
      <div class="channel-score" data-channel-score>
        <div class="audio-now score-now" aria-live="polite">
          <span class="micro-label" data-score-now-mode>CHANNEL ${selectedTrack.number} / READY</span>
          <span class="audio-now__title" data-score-now-title>${escapeHTML(selectedTrack.title)} / ${escapeHTML(selectedTrack.archetype)}</span>
          <span class="audio-time" data-score-now-time>00:00</span>
          <div class="audio-progress" aria-hidden="true"><span data-score-now-progress></span></div>
        </div>

        <div class="channel-score__layout">
          <div class="channel-score__index">
            ${TRACKS.map((track) => {
              const pack =
                PACKS.find((entry) => entry.label === track.archetype) || PACKS[0];
              const selected = track.id === selectedTrack.id;
              return `
                <article class="score-channel${selected ? " is-selected" : ""}" data-score-channel="${track.id}">
                  <button
                    class="score-channel__select"
                    type="button"
                    data-score-select="${track.id}"
                    aria-pressed="${String(selected)}"
                    aria-label="Select ${escapeHTML(track.title)}, ${escapeHTML(track.archetype)} channel"
                  >
                    <img
                      class="score-channel__thumb"
                      src="${pack.cover}"
                      alt=""
                      width="696"
                      height="1012"
                      loading="lazy"
                      decoding="async"
                    >
                    <span class="track-number">${track.number}</span>
                    <span class="score-channel__identity">
                      <strong>${escapeHTML(track.title)}</strong>
                      <span>${escapeHTML(track.archetype)}</span>
                    </span>
                  </button>
                  <div class="score-channel__actions">
                    <button
                      class="score-channel__audio"
                      type="button"
                      data-audio-track="${track.id}"
                      data-audio-mode="demo"
                      data-src="${track.src}"
                      data-title="${escapeHTML(track.title)}"
                      aria-label="Play ${escapeHTML(track.title)} demo, ${track.duration}"
                      aria-pressed="false"
                    >
                      <span class="track-action">PLAY</span>
                      <span>DEMO · ${track.duration}</span>
                    </button>
                    <button
                      class="score-channel__audio"
                      type="button"
                      data-audio-track="${track.id}"
                      data-audio-mode="8bit"
                      data-src="${track.bit}"
                      data-title="${escapeHTML(track.title)}"
                      aria-label="Play ${escapeHTML(track.title)} 8-bit version, 15 seconds"
                      aria-pressed="false"
                    >
                      <span class="track-action">PLAY</span>
                      <span>8-BIT · 0:15</span>
                    </button>
                    <a
                      class="score-channel__link"
                      href="${routeHref("originals", { pack: pack.id })}"
                      data-route
                    >OPEN PACK →</a>
                  </div>
                </article>
              `;
            }).join("")}
          </div>

          <figure class="channel-score__visual">
            <a
              href="${routeHref("originals", { pack: selectedPack.id })}"
              data-route
              data-score-visual-link
              aria-label="Open ${escapeHTML(selectedPack.label)} Original pack"
            >
              <img
                src="${selectedPack.cover}"
                alt="${escapeHTML(selectedPack.label)} pack for ${escapeHTML(selectedTrack.title)}"
                width="696"
                height="1012"
                decoding="async"
                data-score-visual-image
              >
            </a>
            <figcaption class="record-caption">
              <span data-score-visual-title>${selectedTrack.number} / ${escapeHTML(selectedTrack.title)}</span>
              <span data-score-visual-meta>${escapeHTML(selectedTrack.archetype)} PACK / 1,100 ORIGINALS</span>
            </figcaption>
          </figure>
        </div>
        <p class="footnote section-footnote">OFFICIAL ALBUM ABOVE / DEMOS + 8-BIT VERSIONS PLAY ON REQUEST</p>
      </div>
    `;
  }

  function renderYouTubeFrame(videoId, title, poster) {
    return `
      <div class="film-frame" data-youtube-frame>
        <button
          class="film-launch"
          type="button"
          data-youtube-id="${videoId}"
          data-youtube-title="${escapeHTML(title)}"
          aria-label="Play ${escapeHTML(title)} on YouTube"
        >
          <img
            src="${poster}"
            alt=""
            width="1280"
            height="720"
            loading="lazy"
            decoding="async"
          >
          <span>PLAY FILM</span>
        </button>
      </div>
    `;
  }

  function renderProject() {
    const c = copy();
    return `
      <section class="page">
        ${pageMast("06 / AUTHORITATIVE RECORD", "PROJECT", c.projectIntro, "WORLD BUILDING — SEAN WOONG + HAZ HAUS", "mast-project")}

        <section class="section">
          ${sectionHead("01", "MOTTO PROJECT TEASER", "The film introduces the project before the case study begins. Playback starts only after visitor action.")}
          ${renderYouTubeFrame("0j9Vhhuz5PA", "MOTTO 7777 Project Teaser", "media/project-teaser-poster.jpg")}
          <div class="film-credit">
            <span>FILM — SEAN WOONG</span>
            <span>3D MOTORCYCLE FOOTAGE — @CHEESEPIZZA</span>
            <span>SOUND — HAZ HAUS</span>
            <a class="text-link" href="https://www.youtube.com/watch?v=0j9Vhhuz5PA" target="_blank" rel="noreferrer">YOUTUBE ↗</a>
          </div>
        </section>

        <section class="section">
          ${sectionHead("02", "THE 7,777 SYSTEM", "A fixed core total. Later states and protocol rewards remain clearly separated from it.")}
          <p class="project-statement project-statement--system">
            ${escapeHTML(c.statement)}
            <em>${escapeHTML(c.statementEnd)}</em>
          </p>
          <div class="system-diagram">
            <div class="system-block">
              <span class="eyebrow">ORIGINALS</span>
              <span class="system-block__number">7,700</span>
              <div class="system-block__split">
                <span>SURVIVED / 3,850</span>
                <span>K.I.A. / 3,850</span>
              </div>
            </div>
            <div class="system-block">
              <span class="eyebrow">IMMORTALS</span>
              <span class="system-block__number">77</span>
              <div class="system-block__split">
                <span>IMMORTALS / 70</span>
                <span>LEGENDS / 7</span>
              </div>
            </div>
          </div>
          <p class="system-note">UT02 — SEVEN SEAL and other protocol rewards are documented separately and are not included in the core total of 7,777 works.</p>
        </section>

        <section class="section">
          ${sectionHead("03", "RELEASE HISTORY", "Chronology and completed outcomes are kept together; past utilities are not presented as current benefits.")}
          <div class="project-history">
            <div class="project-history__column">
              <span class="eyebrow project-history__label">CHRONOLOGY</span>
              <div class="timeline">
                ${timelineRow("AROUND JAN 2024", "Project development began.")}
                ${timelineRow("DEC 2025", "Official NFT release through Crypto.com.")}
                ${timelineRow("POST-DROP", "The K.I.A. event split the 7,700 Originals evenly; Immortals were excluded.")}
                ${timelineRow("05 JAN 2026", "MOTTO album officially released.")}
                ${timelineRow("MAR 2026", "7777 (GET LO) visualizer by @cheesepizza published.")}
              </div>
            </div>
            <div class="project-history__column">
              <span class="eyebrow project-history__label">RELEASE OUTCOMES</span>
              <div class="project-outcomes">
                ${outcomeRow("SOUNDTRACK ACCESS", "ANNOUNCED AT RELEASE")}
                ${outcomeRow("UT02 — SEVEN SEAL", "PRODUCED")}
                ${outcomeRow("KEYRING / SHEMAGH / GLOVES / T-SHIRT", "PRODUCED / LIMITED CIRCULATION")}
                ${outcomeRow("PLANNED COLLECTOR DELIVERY", "NOT COMPLETED")}
              </div>
              <p class="system-note project-history__note">Planned recipients did not submit delivery addresses. Selected project objects now circulate privately among friends and artists.</p>
            </div>
          </div>
        </section>

        <section class="section">
          ${sectionHead("04", "AUTHORSHIP", "Primary authorship, artist context, and contributed work in one record. Work-specific credits remain beside the relevant work.")}
          <div class="author-records">
            <article class="author-record">
              <div class="author-record__identity">
                <span class="eyebrow">WORLD BUILDING / VISUAL DIRECTION</span>
                <h2>SEAN<br>WOONG</h2>
                <span class="author-record__alias">VOICE CREDIT — OO.SEAN</span>
              </div>
              <div class="author-record__body">
                <p class="author-record__contribution">Co-developed the world of MOTTO 7777 and directed its complete visual system: the 7,777 works, animation, pack and release imagery, K.I.A. visual and motion, UT02, project objects, teaser film and edit, and this website.</p>
                <p class="author-record__bio">Sean Woong is a Seoul-based multimedia artist and tattooist working across digital illustration, animation, moving image, object design, and the web. His practice moves between authored image systems, performance identities, and physical extensions.</p>
                <div class="artist-record__links" aria-label="Sean Woong links">
                  <a href="https://www.instagram.com/sean_woong/" target="_blank" rel="noreferrer">ART / @SEAN_WOONG ↗</a>
                  <a href="https://www.instagram.com/skin.2.screen/" target="_blank" rel="noreferrer">TATTOO / @SKIN.2.SCREEN ↗</a>
                  <a href="https://www.youtube.com/@sean_woong" target="_blank" rel="noreferrer">YOUTUBE / @SEAN_WOONG ↗</a>
                </div>
              </div>
            </article>
            <article class="author-record">
              <div class="author-record__identity">
                <span class="eyebrow">WORLD BUILDING / SOUND DIRECTION</span>
                <h2>HAZ<br>HAUS</h2>
              </div>
              <div class="author-record__body">
                <p class="author-record__contribution">Co-developed the world of MOTTO 7777 and led its sound system: the album, overall sound direction and production, seven 8-bit versions, K.I.A. sound, and project teaser sound.</p>
                <p class="author-record__bio">Haz Haus is an electronic music producer working across K-pop and electronic music. His practice centers on production, sound design, and genre-crossing collaborative work.</p>
                <div class="artist-record__links" aria-label="Haz Haus links">
                  <a href="https://www.youtube.com/@hazhaus" target="_blank" rel="noreferrer">YOUTUBE / @HAZHAUS ↗</a>
                  <a href="https://www.instagram.com/haz.haus/" target="_blank" rel="noreferrer">INSTAGRAM / @HAZ.HAUS ↗</a>
                  <a href="https://x.com/HazHaus" target="_blank" rel="noreferrer">X / @HAZHAUS ↗</a>
                </div>
              </div>
            </article>
            <article class="contributor-record">
              <div>
                <span class="eyebrow">CONTRIBUTED VISUAL</span>
                <h3>@CHEESEPIZZA</h3>
              </div>
              <p>3D motorcycle footage used near the opening of the MOTTO Project Teaser; visualizer for 7777 (GET LO).</p>
            </article>
          </div>
        </section>

        <section class="section">
          <div class="inquiry-block">
            <h2>MAKE THE NEXT SIGNAL.</h2>
            <div class="inquiry-list">
              <span>EXHIBITION</span>
              <span>COLLABORATION / COMMISSION</span>
              <span>LICENSING</span>
              <span>PRESS / RESEARCH</span>
              <a class="text-link" href="https://www.instagram.com/mottttooooooo/" target="_blank" rel="noreferrer">CONTACT VIA INSTAGRAM ↗</a>
            </div>
            <p class="rights-note">© 2024—2026 MOTTO 7777. CREATIVE CREDITS AS LISTED.</p>
          </div>
        </section>
      </section>
    `;
  }

  function pageMast(kicker, title, description, data, className = "") {
    return `
      <header class="page-mast ${className}">
        <div>
          <span class="page-kicker">${kicker}</span>
          <h1>${title}</h1>
        </div>
        <div class="page-mast__copy">
          <strong>${data}</strong>
          ${escapeHTML(description)}
        </div>
      </header>
    `;
  }

  function sectionHead(index, title, description) {
    return `
      <header class="section-head">
        <span class="section-index">${index}</span>
        <h2>${title}</h2>
        <p>${description}</p>
      </header>
    `;
  }

  function pageClosing(href, label) {
    return `
      <div class="page-closing">
        <a class="next-link" href="${href}" data-route>${label} →</a>
      </div>
    `;
  }

  function creditRow(role, name) {
    return `
      <div class="credit-row">
        <span>${role}</span>
        <span>${name}</span>
      </div>
    `;
  }

  function timelineRow(date, text) {
    return `
      <div class="timeline-row">
        <time>${date}</time>
        <p>${text}</p>
      </div>
    `;
  }

  function outcomeRow(record, status) {
    return `
      <div class="outcome-row">
        <strong>${record}</strong>
        <span class="meta">${status}</span>
      </div>
    `;
  }

  function bindPage(route) {
    document.querySelector("[data-next-signal]")?.addEventListener("click", () => {
      state.homeIndex = (state.homeIndex + 1) % state.homePool.length;
      render({ preserveScroll: true });
      announce("A new selected Immortal is now shown.");
    });

    document.querySelectorAll("[data-immortal-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        state.immortalsFilter = button.dataset.immortalFilter || "all";
        render({ preserveScroll: true });
        announce(`${button.textContent.trim()} Immortals filter selected.`);
      });
    });

    document.querySelector("[data-immortal-search]")?.addEventListener("input", (event) => {
      state.immortalsQuery = event.currentTarget.value || "";
      window.clearTimeout(state.searchTimer);
      state.searchTimer = window.setTimeout(() => {
        render({ preserveScroll: true, preserveFocus: "immortal-search" });
        const count = document.querySelector("[data-immortal-count]")?.textContent || "0";
        announce(`${count} Immortals match the current search.`);
      }, 140);
    });

    document.querySelectorAll("[data-motion-src]").forEach((image) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const showMotion = () => {
        image.src = image.dataset.motionSrc || image.src;
      };
      const showStatic = () => {
        image.src = image.dataset.staticSrc || image.src;
      };
      image.closest("a")?.addEventListener("pointerenter", showMotion);
      image.closest("a")?.addEventListener("pointerleave", showStatic);
      image.closest("a")?.addEventListener("focus", showMotion);
      image.closest("a")?.addEventListener("blur", showStatic);
    });

    document.querySelector("[data-reshuffle]")?.addEventListener("click", () => {
      state.discoverRound += 1;
      render({ preserveScroll: true });
      announce("A new balanced selection of 28 Originals is shown.");
    });

    document.querySelector("[data-load-motion]")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      const field = button.closest("[data-motion-field]");
      if (!field) return;
      const video = document.createElement("video");
      video.src = button.dataset.src;
      video.controls = true;
      video.setAttribute("controlslist", "nodownload");
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute("aria-label", button.dataset.title || "Full motion work");
      button.disabled = true;
      button.textContent = "LOADING MOTION";
      field.classList.add("is-loading");
      const showVideo = () => {
        field.classList.remove("is-loading");
        field.replaceChildren(video);
        video.play().catch(() => {
          announce("Motion is ready. Use the video control to begin playback.");
        });
      };
      const showError = () => {
        field.classList.remove("is-loading");
        button.disabled = false;
        button.textContent = "RETRY FULL MOTION";
        announce("Full motion could not be loaded. The poster remains available.");
      };
      video.addEventListener("canplay", showVideo, { once: true });
      video.addEventListener("error", showError, { once: true });
      video.load();
    });

    const kiaVideo = document.querySelector("[data-kia-video]");
    const kiaPlay = document.querySelector("[data-kia-play]");
    const kiaSound = document.querySelector("[data-kia-sound]");
    if (kiaVideo && kiaPlay && kiaSound) {
      let kiaLoaded = false;
      const loadKia = () => {
        if (kiaLoaded) return;
        kiaVideo.querySelectorAll("source[data-src]").forEach((source) => {
          source.src = source.dataset.src || "";
        });
        kiaVideo.load();
        kiaLoaded = true;
      };
      const updateKiaControls = () => {
        kiaPlay.textContent = kiaVideo.paused ? "PLAY" : "PAUSE";
        kiaSound.textContent = kiaVideo.muted ? "SOUND ON" : "SOUND OFF";
        kiaPlay.setAttribute("aria-pressed", String(!kiaVideo.paused));
        kiaSound.setAttribute("aria-pressed", String(!kiaVideo.muted));
      };
      kiaPlay.addEventListener("click", () => {
        loadKia();
        if (kiaVideo.paused) {
          kiaVideo.play().catch(updateKiaControls);
        } else {
          kiaVideo.pause();
        }
        updateKiaControls();
      });
      kiaSound.addEventListener("click", () => {
        loadKia();
        kiaVideo.muted = !kiaVideo.muted;
        if (kiaVideo.paused) kiaVideo.play().catch(updateKiaControls);
        updateKiaControls();
      });
      kiaVideo.addEventListener("play", updateKiaControls);
      kiaVideo.addEventListener("pause", updateKiaControls);
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          loadKia();
          if (kiaVideo.dataset.kiaAutoplay === "true") {
            kiaVideo.play().catch(updateKiaControls);
          }
          observer.disconnect();
        }, { rootMargin: "320px 0px" });
        observer.observe(kiaVideo);
        state.cleanups.push(() => observer.disconnect());
      } else {
        loadKia();
      }
      updateKiaControls();
    }

    document.querySelectorAll("[data-audio-track]").forEach((button) => {
      button.addEventListener("click", () => toggleAudio(button));
    });
    document.querySelectorAll("[data-score-select]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.scoreSelect || "";
        if (state.currentAudioId && state.currentAudioId !== id) {
          stopAudio();
        }
        selectSoundChannel(id);
        updateAudioUI();
      });
    });
    if (document.querySelector("[data-channel-score]")) {
      selectSoundChannel(state.currentAudioId || state.soundChannel, false);
      updateAudioUI();
    }

    document.querySelectorAll("[data-youtube-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const frame = button.closest("[data-youtube-frame]");
        if (!frame) return;
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(button.dataset.youtubeId)}?rel=0&autoplay=1`;
        iframe.title = button.dataset.youtubeTitle || "MOTTO 7777 film";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        frame.replaceChildren(iframe);
      });
    });

    const vaultVideos = [...document.querySelectorAll("[data-vault-video]")];
    if (vaultVideos.length) {
      const loadVaultVideo = (video) => {
        if (video.dataset.loaded === "true") return;
        video.querySelectorAll("source[data-src]").forEach((source) => {
          source.src = source.dataset.src || "";
        });
        video.preload = "metadata";
        video.dataset.loaded = "true";
        video.load();
      };

      vaultVideos.forEach((video) => {
        video.addEventListener("pointerdown", () => loadVaultVideo(video), { once: true });
        video.addEventListener("focusin", () => loadVaultVideo(video), { once: true });
        video.addEventListener("play", () => {
          vaultVideos.forEach((otherVideo) => {
            if (otherVideo !== video && !otherVideo.paused) otherVideo.pause();
          });
        });
      });

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            loadVaultVideo(entry.target);
            observer.unobserve(entry.target);
          });
        }, { rootMargin: "320px 0px" });
        vaultVideos.forEach((video) => observer.observe(video));
        state.cleanups.push(() => observer.disconnect());
      } else {
        vaultVideos.forEach(loadVaultVideo);
      }
    }

    if (route.type === "pack") {
      const pack = PACK_BY_ID.get(route.packId);
      if (pack) setupMicroArchive(pack);
    }

    bindPackScrollLinks(document);
  }

  function bindMediaFallbacks() {
    document.querySelectorAll("img").forEach((image) => {
      const showImageFallback = () => {
        const container = image.parentElement;
        if (!container || container.classList.contains("media-unavailable")) return;
        container.classList.add("media-unavailable");
        image.hidden = true;
        const fallback = document.createElement("span");
        fallback.className = "media-fallback";
        fallback.textContent = `${image.dataset.mediaLabel || image.alt || "MEDIA"} / PREVIEW UNAVAILABLE`;
        container.appendChild(fallback);
      };
      image.addEventListener("error", showImageFallback, { once: true });
      if (image.complete && image.naturalWidth === 0) {
        queueMicrotask(showImageFallback);
      }
    });

    document.querySelectorAll("video").forEach((video) => {
      video.addEventListener("error", () => {
        const label = video.getAttribute("aria-label") || "Motion record";
        const poster = video.getAttribute("poster");
        if (video.matches("[data-kia-video]")) {
          video.closest("[data-kia-field]")?.querySelector(".kia-controls")?.remove();
          const fallback = document.createElement("img");
          fallback.src = "media/kia-poster.webp";
          fallback.alt = "K.I.A. motion artwork poster";
          video.replaceWith(fallback);
          announce("K.I.A. motion is unavailable. The high-resolution poster is shown.");
          return;
        }
        if (poster) {
          const fallback = document.createElement("img");
          fallback.src = poster;
          fallback.alt = `${label} poster`;
          fallback.dataset.mediaLabel = label;
          video.replaceWith(fallback);
          announce(`${label} motion is unavailable. Its poster is shown.`);
          return;
        }
        const fallback = document.createElement("span");
        fallback.className = "media-fallback";
        fallback.textContent = `${label.toUpperCase()} / MOTION UNAVAILABLE`;
        video.replaceWith(fallback);
      }, { once: true });
    });

    const homeVideo = document.querySelector("[data-home-video]");
    homeVideo?.play().catch(() => {
      homeVideo.removeAttribute("autoplay");
    });
  }

  function bindPackScrollLinks(root) {
    root.querySelectorAll("[data-store-pack-scroll]").forEach((link) => {
      if (link.dataset.scrollBound === "true") return;
      link.dataset.scrollBound = "true";
      link.addEventListener("click", () => {
        state.packScroll.set(link.dataset.storePackScroll, window.scrollY);
      });
    });
  }

  function toggleAudio(button) {
    const id = button.dataset.audioTrack || "";
    const mode = button.dataset.audioMode || "";
    const src = button.dataset.src || "";
    const sameTrack = state.currentAudioId === id && state.currentAudioMode === mode;

    if (document.querySelector("[data-channel-score]")) {
      selectSoundChannel(id, false);
    }

    if (sameTrack && !audio.paused) {
      audio.pause();
      updateAudioUI();
      return;
    }

    if (!sameTrack) {
      audio.src = src;
      state.currentAudioId = id;
      state.currentAudioMode = mode;
    }

    audio.play().catch(() => {
      updateAudioUI("PLAYBACK UNAVAILABLE");
    });
    updateAudioUI();
  }

  function selectSoundChannel(id, shouldAnnounce = true) {
    const track = TRACKS.find((entry) => entry.id === id) || TRACKS[0];
    const pack =
      PACKS.find((entry) => entry.label === track.archetype) || PACKS[0];
    state.soundChannel = track.id;

    document.querySelectorAll("[data-score-channel]").forEach((channel) => {
      const selected = channel.dataset.scoreChannel === track.id;
      channel.classList.toggle("is-selected", selected);
      channel
        .querySelector("[data-score-select]")
        ?.setAttribute("aria-pressed", String(selected));
    });

    const visualLink = document.querySelector("[data-score-visual-link]");
    const visualImage = document.querySelector("[data-score-visual-image]");
    const visualTitle = document.querySelector("[data-score-visual-title]");
    const visualMeta = document.querySelector("[data-score-visual-meta]");
    if (visualLink) {
      visualLink.setAttribute("href", routeHref("originals", { pack: pack.id }));
      visualLink.setAttribute(
        "aria-label",
        `Open ${pack.label} Original pack`,
      );
    }
    if (visualImage) {
      if (visualImage.getAttribute("src") !== pack.cover) {
        visualImage.setAttribute("src", pack.cover);
      }
      visualImage.setAttribute(
        "alt",
        `${pack.label} pack for ${track.title}`,
      );
    }
    if (visualTitle) {
      visualTitle.textContent = `${track.number} / ${track.title}`;
    }
    if (visualMeta) {
      visualMeta.textContent = `${track.archetype} PACK / 1,100 ORIGINALS`;
    }
    if (shouldAnnounce) {
      announce(`${track.title}, ${track.archetype} channel selected.`);
    }
  }

  function stopAudio() {
    if (!audio.paused) audio.pause();
    audio.removeAttribute("src");
    audio.load();
    state.currentAudioId = "";
    state.currentAudioMode = "";
  }

  function updateAudioUI(errorText = "") {
    document.querySelectorAll("[data-audio-track]").forEach((row) => {
      const active =
        row.dataset.audioTrack === state.currentAudioId &&
        row.dataset.audioMode === state.currentAudioMode;
      row.classList.toggle("is-active", active);
      row.setAttribute("aria-pressed", String(active && !audio.paused));
      const action = row.querySelector(".track-action");
      if (action) action.textContent = active && !audio.paused ? "PAUSE" : "PLAY";
    });

    const scoreTrack =
      TRACKS.find(
        (entry) => entry.id === (state.currentAudioId || state.soundChannel),
      ) || TRACKS[0];
    const scoreMode = document.querySelector("[data-score-now-mode]");
    const scoreTitle = document.querySelector("[data-score-now-title]");
    const scoreTime = document.querySelector("[data-score-now-time]");
    const scoreProgress = document.querySelector("[data-score-now-progress]");
    const hasActiveAudio = Boolean(state.currentAudioId && state.currentAudioMode);
    if (scoreMode) {
      const modeLabel =
        state.currentAudioMode === "8bit" ? "8-BIT" : "DEMO";
      scoreMode.textContent = errorText && hasActiveAudio
        ? "PLAYBACK UNAVAILABLE"
        : hasActiveAudio
          ? `${modeLabel} / ${audio.paused ? "READY" : "PLAYING"}`
          : `CHANNEL ${scoreTrack.number} / READY`;
    }
    if (scoreTitle) {
      scoreTitle.textContent = `${scoreTrack.title} / ${scoreTrack.archetype}`;
    }
    if (scoreTime) {
      scoreTime.textContent = hasActiveAudio
        ? formatTime(audio.currentTime)
        : "00:00";
    }
    if (scoreProgress) {
      const ratio =
        hasActiveAudio &&
        Number.isFinite(audio.duration) &&
        audio.duration > 0
          ? audio.currentTime / audio.duration
          : 0;
      scoreProgress.style.transform = `scaleX(${Math.max(0, Math.min(1, ratio))})`;
    }
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  }

  function openMenu() {
    menuReturnFocus = document.activeElement;
    mobileMenu.inert = false;
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
    app.inert = true;
    footer.inert = true;
    document.querySelector("[data-menu-open]")?.setAttribute("aria-expanded", "true");
    document.querySelector("[data-menu-close]")?.focus();
  }

  function closeMenu(restoreFocus = true) {
    const wasOpen = mobileMenu.classList.contains("is-open");
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenu.inert = true;
    document.body.classList.remove("menu-open");
    app.inert = false;
    footer.inert = false;
    document.querySelector("[data-menu-open]")?.setAttribute("aria-expanded", "false");
    if (restoreFocus && wasOpen && menuReturnFocus instanceof HTMLElement) {
      menuReturnFocus.focus();
    }
    menuReturnFocus = null;
  }

  function setupGlobalEvents() {
    document.querySelector("[data-menu-open]")?.addEventListener("click", openMenu);
    document.querySelector("[data-menu-close]")?.addEventListener("click", () => closeMenu());
    mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMenu(false)));

    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.addEventListener("click", () => {
        state.lang = button.dataset.lang || "en";
        safeStorageSet("motto-v2-lang", state.lang);
        render({ preserveScroll: true });
      });
    });

    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest("a[data-route]");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href) return;
      event.preventDefault();
      navigate(href);
    });

    window.addEventListener("popstate", () => render());
    window.addEventListener("hashchange", () => render());
    window.addEventListener("scroll", () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }, { passive: true });

    document.addEventListener("keydown", (event) => {
      if (mobileMenu.classList.contains("is-open") && event.key === "Tab") {
        const focusable = [...mobileMenu.querySelectorAll("a, button")].filter(
          (element) => !element.hasAttribute("disabled")
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
        return;
      }
      if (event.key !== "Escape") return;
      if (mobileMenu.classList.contains("is-open")) {
        closeMenu();
        return;
      }
      const route = getRoute();
      if (route.type === "immortal-detail") navigate(routeHref("immortals"));
      if (route.type === "original-detail") {
        navigate(routeHref("originals", { pack: route.packId }));
      }
    });

    audio.addEventListener("timeupdate", () => updateAudioUI());
    audio.addEventListener("play", () => updateAudioUI());
    audio.addEventListener("pause", () => updateAudioUI());
    audio.addEventListener("ended", () => updateAudioUI());

    setupCursor();
  }

  function setupCursor() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(forced-colors: active)").matches) return;
    if (window.matchMedia("(prefers-contrast: more)").matches) return;
    document.body.classList.add("cursor-enabled");

    window.addEventListener("pointermove", (event) => {
      document.body.classList.add("cursor-ready");
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    document.addEventListener("pointerover", (event) => {
      const nativeTarget = event.target.closest(
        "input, textarea, select, video, button:disabled"
      );
      cursor.classList.toggle("is-native", Boolean(nativeTarget));
      cursor.classList.toggle(
        "is-active",
        !nativeTarget && Boolean(event.target.closest("a, button"))
      );
    });
  }

  history.scrollRestoration = "manual";
  setupGlobalEvents();
  render();
})();
