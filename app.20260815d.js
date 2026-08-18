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
      en: "Fumes bleed.",
      ko: "연기가 스며든다."
    },
    skull: {
      en: "Sparks ignite.",
      ko: "스파크가 튄다."
    },
    rockstar: {
      en: "Smile stalls.",
      ko: "미소가 멈춘다."
    },
    drag: {
      en: "Everything screams.",
      ko: "모든 것이 비명한다."
    },
    military: {
      en: "Target locked.",
      ko: "조준이 고정된다."
    },
    boxer: {
      en: "Bell rings.",
      ko: "종이 울린다."
    },
    motorcycle: {
      en: "Veins pulse.",
      ko: "맥박이 뛴다."
    }
  };

  const IMMORTAL_DESCRIPTION_JA = Object.freeze({
    "Knockout stands.": "ノックアウトが宣告される。",
    "Eye resets.": "眼がリセットされる。",
    "Déjà vu.": "既視感。",
    "Metal creaks.": "金属がきしむ。",
    "Bell rings.": "ゴングが鳴る。",
    "Ropes bend.": "ロープがしなる。",
    "Grin cracks.": "笑みがひび割れる。",
    "Ring reruns.": "リングが再起動する。",
    "Body remembers.": "身体が記憶する。",
    "Absorb blows.": "衝撃を吸収する。",
    "Halftones smear.": "ハーフトーンがにじむ。",
    "Fumes bleed.": "煙が染み出す。",
    "Glitch shadows trail.": "グリッチの影が尾を引く。",
    "Gaze rewinds.": "視線が巻き戻る。",
    "Circuit melts.": "回路が溶ける。",
    "Eye parses.": "眼が解析する。",
    "Transmission fails.": "伝送が途切れる。",
    "Static coils.": "ノイズが巻きつく。",
    "Clean code.": "きれいなコード。",
    "Corrupted mantra.": "壊れたマントラ。",
    "Eyes shimmer.": "眼がきらめく。",
    "Beauty ruptures.": "美が破裂する。",
    "Smile twists.": "笑みがねじれる。",
    "Shell pulses.": "シェルが脈打つ。",
    "Pixels defy.": "ピクセルが抗う。",
    "Armor reboot.": "装甲が再起動する。",
    "Face rewrites.": "顔が書き換わる。",
    "Spikes shimmer.": "スパイクがきらめく。",
    "Lace glitch.": "レースがグリッチする。",
    "Pink errors.": "ピンクのエラーがにじむ。",
    "Engine prophecy.": "エンジンの予言。",
    "Helmet hums.": "ヘルメットが唸る。",
    "Pixel smoke.": "ピクセルの煙が流れる。",
    "Veins pulse.": "脈が打つ。",
    "Cracked gaze.": "ひび割れた視線。",
    "Sealed soul.": "魂が封じられる。",
    "Gear instinct.": "ギアが本能に変わる。",
    "Crash sim.": "衝突がシミュレートされる。",
    "Sparks drag.": "火花が尾を引く。",
    "Helmet smirk.": "ヘルメットがあざ笑う。",
    "Chrome joy.": "クロームの歓喜。",
    "Smile glitches.": "笑みがグリッチする。",
    "Laugh cuts.": "笑いが切り裂く。",
    "Swagger mute.": "無言のスワッグ。",
    "Noise flitters.": "ノイズが瞬く。",
    "Signal spikes.": "信号が急上昇する。",
    "Gestures pre-recorded.": "身振りは録画済み。",
    "Laugh loops.": "笑いが反復する。",
    "Highlight reel.": "ハイライト・リール。",
    "Neon twitch.": "ネオンが痙攣する。",
    "Charred code.": "焦げたコードが流れる。",
    "Fuel ignites.": "燃料が点火する。",
    "Signal screams.": "信号が叫ぶ。",
    "War replays.": "戦争が再生される。",
    "Shell cracked.": "殻が割れる。",
    "Rust leaks.": "錆が染み出す。",
    "Protocol drills.": "プロトコルが貫通する。",
    "Frame twitches.": "フレームが痙攣する。",
    "Scream loops.": "叫びが反復する。",
    "Blood denied.": "血が拒まれる。",
    "Memory erased.": "記憶が消去される。",
    "Blade hums.": "刃が唸る。",
    "Violence repeats.": "暴力が反復する。",
    "Battlefield reloads.": "戦場がリロードされる。",
    "Grief leaks.": "悲しみが漏れ出す。",
    "Protocol execute.": "プロトコル実行。",
    "Metrics only.": "指標のみ。",
    "Code motion.": "コードのように動く。",
    "Orders echo.": "命令が響く。",
    "Target locked.": "照準が固定される。",
    "Sparks ignite.": "火花が点火する。",
    "Smile stalls.": "笑みが止まる。",
    "Everything screams.": "すべてが叫ぶ。"
  });

  const COPY = {
    en: {
      homeLine: "AN AUDIOVISUAL ARCHIVE OF 7,777 WORKS",
      homeClass: "SELECTED FROM IMMORTALS 77",
      immortalsIntro: "The 77 motion works at the core of MOTTO 7777: seventy Immortals and seven Legends, each integrating the 8-bit track paired with its archetype.",
      originalsIntro: "The complete pre-K.I.A. image state of 7,700 works, preserved through seven archetype packs.",
      vaultIntro: "Release images, studies, process, objects, and wordmark work from MOTTO 7777.",
      soundIntro: "The official album, early demos, seven 8-bit versions, and studio material.",
      projectIntro: "",
      statement: "MOTTO 7777 links 7,777 visual works with seven archetypes and seven tracks.",
      statementEnd: "After the drop, half of the Originals entered K.I.A."
    },
    ko: {
      homeLine: "7,777점으로 이루어진 오디오비주얼 아카이브",
      homeClass: "IMMORTALS 77에서 선택",
      immortalsIntro: "MOTTO 7777의 중심을 이루는 77개의 모션 작품. 70개의 Immortals와 7개의 Legends 모두 해당 아키타입과 짝을 이루는 8-bit 트랙을 결합한다.",
      originalsIntro: "일곱 아키타입 팩으로 보존한 7,700개 작품의 완전한 K.I.A. 이전 이미지 상태.",
      vaultIntro: "MOTTO 7777의 발매 이미지, 스터디, 제작 과정, 오브젝트와 워드마크 작업.",
      soundIntro: "정식 앨범과 초기 데모, 일곱 개의 8-bit 버전, 스튜디오 자료.",
      projectIntro: "",
      statement: "MOTTO 7777은 7,777개의 작품과 일곱 아키타입, 일곱 트랙을 연결한다.",
      statementEnd: "발매 이후 Originals의 절반은 K.I.A.로 전환됐다."
    },
    ja: {
      homeLine: "7,777作品によるオーディオビジュアル・アーカイブ",
      homeClass: "IMMORTALS 77より選出",
      immortalsIntro: "MOTTO 7777の核をなす77点のモーション作品。70点のImmortalsと7点のLegendsはいずれも、各アーキタイプと組をなす8-bitトラックを統合している。",
      originalsIntro: "7つのアーキタイプ・パックとして保存された、7,700点の作品による完全なK.I.A.以前のイメージ状態。",
      vaultIntro: "MOTTO 7777のリリース・イメージ、スタディ、制作過程、オブジェクト、ワードマーク作品。",
      soundIntro: "公式アルバム、初期デモ、7つの8-bit版、スタジオ資料。",
      projectIntro: "",
      statement: "MOTTO 7777は、7,777点の作品、7つのアーキタイプ、7つのトラックを結ぶ。",
      statementEnd: "リリース後、Originalsの半数がK.I.A.へ転換した。"
    }
  };

  const PROJECT_NOTE = {
    short: "MOTTO 7777 is an audiovisual project comprising 7,777 works, seven archetypes, and seven tracks. This archive brings together its images, motion, music, process, and post-release history.",
    groups: [
      {
        label: "ORIGIN / 7,777",
        paragraphs: [
          "MOTTO 7777 is an audiovisual project in which the process of making 7,777 works formed a world of its own. It did not begin with a fully formed world that was later translated into images. The scope of the world and the number of works grew together through ongoing conversations between Sean Woong and Haz Haus about numbers, music, drawing, and characters.",
          "The number 7,777 did not emerge from a predetermined symbolic system. The playfulness of the number, its association with luck, and the experience of releasing Digi Engine—an earlier series of 88 works—provided a starting point. From there, Sean Woong and Haz Haus began imagining a world set in the year 7,777 and the figures who inhabited it.",
          "As the work accumulated, so did its visual vocabulary. Figures and equipment, bodies shifting between human and machine, tattooed skin, recurring motifs, patterns, and backgrounds emerged through drawing and image sampling. These elements took on different bodies, attitudes, and atmospheres within seven archetypes: Motorcycle, Dealer, Skull, Rockstar, Drag, Military, and Boxer.",
          "The world became a field in which images could repeat, mutate, and form relationships with one another. Rather than a world producing 7,777 images, it is more accurate to say that the act of making 7,777 works produced the world."
        ]
      },
      {
        label: "IMAGE / SOUND",
        paragraphs: [
          "The seven archetypes and seven tracks form fixed pairs. The relationship within each pair, however, did not always move in one direction. Sound sometimes preceded the image; at other times, images, figures, and gestures fed back into the making of the music.",
          "This relationship appears most directly in IMMORTALS 77. Haz Haus reworked each of the seven tracks as an 8-bit version, and each of the 77 motion works incorporates the version paired with its archetype. In these works, sound is built directly into the structure of each work rather than added as external accompaniment.",
          "MOTTO began with a sensation of speed drawn from footage shot from a MotoGP rider’s point of view. Haz Haus created a repeating guitar loop, and Sean Woong added his voice. The repeated sound of “more” carried that sensation of speed into motorcycle helmets, tattoo patterns, and the Motorcycle works.",
          "In 7777 (GET LO), the repeated line “Everybody get lo” intersects with ducking and evasive movement in boxing, the lowering of the body, and the imagery of an underground fight. A phrase becomes rhythm and command, then moves into gesture and scene."
        ]
      },
      {
        label: "K.I.A. / TRANSITION",
        paragraphs: [
          "MOTTO 7777 comprises 7,700 Originals and 77 motion works. The 77 consist of seventy looping Immortals and seven PROTOCOL-7 works animated from beginning to end. These seven works are also known as Legends.",
          "The drawings and visual elements accumulated while making these 77 motion works later became material for the 7,700 Originals. The image-generation process was carried out separately for each archetype, producing 1,100 Originals in each group.",
          "After all Originals had been distributed and a set period had passed, half of them—3,850 works—transitioned into K.I.A. No work was burned or removed from the market. Nor was a glitch effect simply overlaid on the existing image. Each designated static Original was replaced by a separate animated artwork characterized by signal interruption and glitch. A released work assumed a different image, format, and state.",
          "The rule was proposed during the project and implemented following discussions about the proportion of works it would affect. Once enacted, the initial state of a released work was no longer necessarily its final state."
        ]
      },
      {
        label: "ARCHIVE / AFTER RELEASE",
        paragraphs: [
          "After release, the works were distributed among different owners and wallets and recorded as individual entries across the marketplace. These records preserve ownership and current state, but they do not show how each work relates to the project as a whole. Images, music, archetypes, production processes, and the history of K.I.A. became dispersed across different locations.",
          "The Original Archive on this site preserves all 7,700 Originals as they existed before K.I.A. was executed. It does not attempt to reconstruct every K.I.A. state that currently exists. Instead, it presents the complete image system before the transition, while a separate K.I.A. exhibition and representative motion work document the form and history of that change.",
          "The archive also preserves drawings, image elements, archetype studies, and traces of image sampling. These are not supplements attached to the tokens, but production records showing how the visual material formed through the 77 motion works expanded into 7,700 Originals.",
          "What this archive preserves is not ownership, but the form and context of MOTTO 7777."
        ]
      }
    ]
  };

  const PROJECT_NOTE_KO = {
    short: "MOTTO 7777은 7,777개의 작품, 일곱 아키타입과 일곱 트랙으로 이루어진 오디오비주얼 프로젝트다. 이 아카이브는 이미지와 모션, 음악, 제작 과정과 발매 이후의 기록을 한곳에 모은다.",
    groups: [
      {
        label: "기원 / 7,777",
        paragraphs: [
          "MOTTO 7777은 7,777개의 작품을 만드는 과정이 하나의 세계를 형성한 오디오비주얼 프로젝트다. 먼저 완성된 세계관을 이미지로 옮긴 작업은 아니다. 숫자와 음악, 드로잉과 인물에 관한 Sean Woong과 Haz Haus의 대화가 이어지는 동안 세계의 범위와 작품의 수가 함께 커졌다.",
          "7,777이라는 숫자는 처음부터 고정된 상징 체계에서 나온 것이 아니었다. 숫자 자체가 주는 재미와 행운에 대한 연상, 그리고 앞서 88점으로 구성된 Digi Engine을 발매했던 경험이 하나의 출발점이 됐다. 두 사람은 이 숫자를 중심으로 서기 7,777년의 세계와 그 안의 인물들을 상상하기 시작했다.",
          "작업이 쌓이면서 시각적 어휘도 함께 축적됐다. 인물의 신체와 장비, 인간과 로봇 사이를 오가는 형태, 타투가 새겨진 피부, 반복되는 모티프, 패턴과 배경이 드로잉과 이미지 샘플링을 통해 만들어졌다. 이것들은 Motorcycle, Dealer, Skull, Rockstar, Drag, Military, Boxer라는 일곱 아키타입 안에서 각기 다른 신체와 태도, 분위기로 전개됐다.",
          "세계는 이미지가 반복되고 변형되며 서로 관계를 맺을 수 있는 장이 됐다. 하나의 세계가 7,777개의 이미지를 낳았다기보다, 7,777개의 작품을 만드는 행위가 하나의 세계를 만들었다고 보는 편이 더 가깝다."
        ]
      },
      {
        label: "이미지 / 사운드",
        paragraphs: [
          "일곱 아키타입과 일곱 트랙은 고정된 짝을 이룬다. 그러나 그 관계가 언제나 한쪽에서 다른 쪽으로만 이어진 것은 아니다. 사운드가 이미지를 선행하기도 했고, 이미지와 인물, 몸짓이 다시 음악에 영향을 주기도 했다.",
          "이 관계는 IMMORTALS 77에서 가장 직접적으로 드러난다. Haz Haus는 일곱 트랙을 각각 8-bit 버전으로 다시 만들었고, 77개의 모션 작품에는 각 아키타입과 짝을 이루는 버전이 삽입됐다. 이 작품들에서 사운드는 외부에 덧붙은 배경음이 아니라 작품의 구조에 직접 결합된 요소다.",
          "MOTTO는 MotoGP 선수의 POV 영상에서 받은 질주의 감각으로 시작됐다. Haz Haus는 반복적인 기타 루프를 만들었고, Sean Woong은 그 위에 목소리를 얹었다. 반복되는 “more”의 소리는 같은 속도감 속에서 바이크 헬멧과 타투 패턴, Motorcycle 작업으로 이어졌다.",
          "7777 (GET LO)에서는 “Everybody get lo”라는 반복 구절이 복싱의 더킹과 회피, 몸을 낮추는 움직임, 지하 격투장의 이미지와 맞물린다. 하나의 말이 리듬과 명령이 되고, 다시 몸짓과 장면으로 이동한다."
        ]
      },
      {
        label: "K.I.A. / 전환",
        paragraphs: [
          "MOTTO 7777은 7,700개의 Originals와 77개의 모션 작품으로 구성된다. 77개는 반복 재생되는 70개의 Immortals와, 처음부터 끝까지 애니메이션으로 전개되는 7개의 PROTOCOL-7 작품으로 이루어진다. 이 7개 작품은 Legends라고도 불린다.",
          "77개의 모션 작품을 제작하며 축적된 드로잉과 시각 요소들은 이후 7,700개의 Originals를 만드는 재료가 됐다. 이미지 생성 과정은 아키타입별로 독립적으로 진행됐고, 각 아키타입에서 1,100개의 Originals가 만들어졌다.",
          "모든 Originals가 배포되고 일정 시간이 지난 뒤, 그중 절반인 3,850개가 K.I.A.로 전환됐다. 작품은 소각되거나 시장에서 제거되지 않았다. 이 전환은 기존 이미지 위에 글리치 효과를 단순히 덧입힌 것이 아니다. 정지 이미지는 신호 단절과 글리치의 성격을 가진 별도의 애니메이션 아트워크로 교체됐다. 발매된 하나의 작품이 다른 이미지와 형식, 상태를 갖게 된 것이다.",
          "이 규칙은 프로젝트 진행 중에 제안되었고 비율에 관한 논의를 거쳐 실행됐다. 실행된 이후 발매된 작품은 더 이상 최초 상태에 고정되지 않았다."
        ]
      },
      {
        label: "아카이브 / 발매 이후",
        paragraphs: [
          "발매 이후 작품들은 서로 다른 소유자와 지갑, 마켓플레이스의 개별 기록으로 나뉘어 존재하게 됐다. 현재의 소유권과 상태는 각각의 기록에 남아 있지만, 그것만으로는 각 작품이 전체 프로젝트 안에서 어떤 관계를 가졌는지 한눈에 보기 어렵다. 이미지와 음악, 아키타입, 제작 과정, K.I.A.의 기록은 서로 다른 장소로 흩어졌다.",
          "이 웹의 Original Archive는 K.I.A. 실행 이전, 7,700개의 Originals가 이루고 있던 전체 이미지 상태를 보존한다. 현재 존재하는 모든 K.I.A. 상태를 재현하려는 것은 아니다. 대신 전환 이전의 전체 이미지 시스템을 보여주고, 별도의 K.I.A. 전시와 대표 모션 작품을 통해 변화의 형식과 역사를 기록한다.",
          "아카이브는 드로잉과 이미지 요소, 아키타입 스터디, 이미지 샘플링의 흔적도 함께 보존한다. 이것들은 판매된 토큰에 딸린 부속 자료가 아니라, 77개의 모션 작품에서 형성된 시각적 재료가 어떻게 7,700개의 Originals로 확장됐는지를 보여주는 제작 기록이다.",
          "이 웹이 보존하는 것은 소유권이 아니라 MOTTO 7777의 형태와 맥락이다."
        ]
      }
    ]
  };

  const PROJECT_NOTE_JA = {
    short: "MOTTO 7777は、7,777点の作品、7つのアーキタイプ、7つのトラックで構成されるオーディオビジュアル・プロジェクトである。本アーカイブは、イメージ、モーション、音楽、制作過程、リリース後の歴史を一つにまとめる。",
    groups: [
      {
        label: "起源 / 7,777",
        paragraphs: [
          "MOTTO 7777は、7,777点の作品を制作する過程そのものが一つの世界を形成したオーディオビジュアル・プロジェクトである。完成した世界観を後からイメージへ移した作品ではない。数字、音楽、ドローイング、人物をめぐるSean WoongとHaz Hausの対話が続くなかで、世界の範囲と作品数はともに拡張していった。",
          "7,777という数字は、あらかじめ定められた象徴体系から生まれたものではない。数字そのものが持つ遊び心と幸運のイメージ、そして先行する88点のシリーズDigi Engineをリリースした経験が出発点となった。二人はこの数字を軸に、西暦7,777年の世界とそこに生きる人物たちを想像し始めた。",
          "制作が積み重なるにつれ、視覚的な語彙も蓄積された。人物の身体と装備、人間と機械のあいだを移行する形態、タトゥーを刻んだ皮膚、反復するモチーフ、パターン、背景が、ドローイングとイメージ・サンプリングを通して生まれた。それらはMotorcycle、Dealer、Skull、Rockstar、Drag、Military、Boxerという7つのアーキタイプのなかで、それぞれ異なる身体、態度、空気を帯びて展開された。",
          "世界は、イメージが反復し、変形し、互いに関係を結ぶための場となった。一つの世界が7,777点のイメージを生んだというより、7,777点の作品をつくる行為そのものが一つの世界を形成したと捉えるほうが近い。"
        ]
      },
      {
        label: "イメージ / サウンド",
        paragraphs: [
          "7つのアーキタイプと7つのトラックは固定された組を形成する。しかし、その関係が常に一方向に進んだわけではない。サウンドがイメージに先行することもあれば、イメージ、人物、身振りが音楽の制作へ戻って影響することもあった。",
          "この関係はIMMORTALS 77において最も直接的に現れる。Haz Hausは7つのトラックをそれぞれ8-bit版へ再構成し、77点のモーション作品には各アーキタイプと組をなすバージョンが組み込まれた。ここでサウンドは外部から付加された伴奏ではなく、作品の構造そのものに結合している。",
          "MOTTOは、MotoGPライダーの視点映像から得た疾走感を起点としている。Haz Hausが反復するギター・ループをつくり、Sean Woongが声を重ねた。繰り返される“more”という響きは、同じ速度感のなかでバイク・ヘルメット、タトゥーのパターン、Motorcycleの作品群へと展開した。",
          "7777 (GET LO)では、“Everybody get lo”という反復句が、ボクシングにおけるダッキングや回避、身体を低くする動き、地下闘技場のイメージと交差する。一つの言葉がリズムと命令になり、さらに身振りと場面へ移行していく。"
        ]
      },
      {
        label: "K.I.A. / 転換",
        paragraphs: [
          "MOTTO 7777は、7,700点のOriginalsと77点のモーション作品で構成される。77点は、ループ再生される70点のImmortalsと、最初から最後までアニメーションとして展開する7点のPROTOCOL-7から成る。この7点はLegendsとも呼ばれる。",
          "77点のモーション作品を制作するなかで蓄積されたドローイングと視覚要素は、その後7,700点のOriginalsを生み出す素材となった。イメージ生成はアーキタイプごとに独立して行われ、各アーキタイプから1,100点のOriginalsが制作された。",
          "すべてのOriginalsが配布され、一定期間が経過した後、その半数にあたる3,850点がK.I.A.へ転換した。作品が焼却されたり、市場から取り除かれたりしたわけではない。また、既存のイメージにグリッチ効果を単純に重ねたものでもない。指定された静止画のOriginalは、信号の断絶とグリッチを特徴とする別個のアニメーション作品へ置き換えられた。リリース済みの一作品が、異なるイメージ、形式、状態を持つようになったのである。",
          "このルールはプロジェクトの進行中に提案され、適用比率についての議論を経て実行された。実行後、リリースされた作品の初期状態は、必ずしも最終状態ではなくなった。"
        ]
      },
      {
        label: "アーカイブ / リリース以後",
        paragraphs: [
          "リリース後、作品は異なる所有者とウォレットへ分散し、マーケットプレイス上の個別記録として存在するようになった。それらの記録は所有権と現在の状態を保存するが、各作品がプロジェクト全体のなかでどのような関係を持つかまでは示さない。イメージ、音楽、アーキタイプ、制作過程、K.I.A.の歴史は、異なる場所へ分散した。",
          "本サイトのOriginal Archiveは、K.I.A.が実行される以前に存在した7,700点のOriginalsの全体像を保存する。現在存在するすべてのK.I.A.状態を再構築するものではない。転換前の完全なイメージ・システムを提示し、別のK.I.A.展示と代表的なモーション作品によって、その変化の形式と歴史を記録する。",
          "アーカイブは、ドローイング、イメージ要素、アーキタイプのスタディ、イメージ・サンプリングの痕跡も保存する。これらは販売されたトークンに付随する補足資料ではなく、77点のモーション作品から形成された視覚素材が、いかに7,700点のOriginalsへ拡張したかを示す制作記録である。",
          "このアーカイブが保存するのは所有権ではなく、MOTTO 7777の形態と文脈である。"
        ]
      }
    ]
  };

  const KO_TEXT = Object.freeze({
    "ARCHIVE DATA LOADING": "아카이브 데이터를 불러오는 중",
    "WORK NOT FOUND IN THE VERIFIED MANIFEST.": "검증된 매니페스트에서 작품을 찾을 수 없습니다.",
    "ENTER IMMORTALS 77 →": "IMMORTALS 77 입장 →",
    "TOTAL WORKS": "전체 작품",
    "ARCHETYPES / TRACKS": "아키타입 / 트랙",
    "PROJECT NOTE": "프로젝트 노트",
    "A WORLD FORMED THROUGH 7,777 WORKS.": "7,777개의 작품을 통해 형성된 세계.",
    "READ THE FULL PROJECT NOTE →": "프로젝트 노트 전문 읽기 →",
    "01 / MOTION ARCHIVE": "01 / 모션 아카이브",
    "70 IMMORTALS + 7 LEGENDS": "70 IMMORTALS + 7 LEGENDS",
    "PROTOCOL-7 / LEGENDS": "PROTOCOL-7 / LEGENDS",
    "Seven archetypes in the official album order. Seven singular motion works.": "정식 앨범 순서로 배열한 일곱 아키타입과 일곱 개의 단독 모션 작품.",
    "ALL": "전체",
    "SEARCH THE 77": "77개 작품 검색",
    "Filter Immortals by archetype": "아키타입별 Immortals 필터",
    "Previous work": "이전 작품",
    "Next work": "다음 작품",
    "CONTINUE TO ORIGINAL 7700 →": "ORIGINAL 7700으로 계속 →",
    "PLAY FULL MOTION": "전체 모션 재생",
    "LOADING MOTION": "모션 불러오는 중",
    "RETRY FULL MOTION": "전체 모션 다시 불러오기",
    "PLAY 0:15": "0:15 재생",
    "PREV": "이전",
    "NEXT": "다음",
    "02 / PRE-K.I.A. ARCHIVE": "02 / K.I.A. 이전 아카이브",
    "7 PACKS / 1,100 WORKS EACH": "7개 팩 / 각 1,100점",
    "SEVEN PACKS": "일곱 개의 팩",
    "DISCOVER 28": "28점 둘러보기",
    "RESHUFFLE 28": "28점 다시 섞기",
    "AFTER THE DROP, THE ARCHIVE SPLIT.": "발매 이후 아카이브는 둘로 나뉘었다.",
    "ENTER K.I.A. →": "K.I.A. 입장 →",
    "1,100 ORIGINAL WORKS": "ORIGINAL 작품 1,100점",
    "JUMP TO SOURCE #": "원본 번호로 이동",
    "GO": "이동",
    "VISIBLE FIELD": "현재 표시 구간",
    "PRE-K.I.A.": "K.I.A. 이전",
    "EXACT SOURCE ORDER": "정확한 원본 순서",
    "03 / SPECIAL EXHIBITION": "03 / 특별 전시",
    "3,850 SURVIVED / 3,850 K.I.A.": "3,850 SURVIVED / 3,850 K.I.A.",
    "PLAY": "재생",
    "SOUND ON": "사운드 켜기",
    "SOUND OFF": "사운드 끄기",
    "PAUSE": "일시정지",
    "K.I.A. motion artwork": "K.I.A. 모션 아트워크",
    "K.I.A. motion controls": "K.I.A. 모션 컨트롤",
    "VISUAL / MOTION": "비주얼 / 모션",
    "SOUND PRODUCTION": "사운드 프로덕션",
    "AFFECTED SET": "적용 대상",
    "EXCLUDED SET": "제외 대상",
    "STATUS": "상태",
    "COMPLETED": "완료",
    "CONTINUE TO VAULT →": "VAULT로 계속 →",
    "04 / MATERIAL ARCHIVE": "04 / 물질 아카이브",
    "Immortals special pack design": "Immortals 스페셜 팩 디자인",
    "UT02 — Seven Seal animated completion reward": "UT02 — Seven Seal 애니메이션 완성 리워드",
    "Open UT02 Seven Seal at full size": "UT02 Seven Seal을 전체 크기로 열기",
    "UNRELEASED IMAGE STUDIES": "미발매 이미지 스터디",
    "DROP PAGE COVER / EARLY STUDY": "드롭 페이지 커버 / 초기 스터디",
    "UNRELEASED · SEAN WOONG": "미발매 · SEAN WOONG",
    "Early unused study for the MOTTO 7777 drop page cover": "MOTTO 7777 드롭 페이지 커버의 미사용 초기 스터디",
    "ROCKSTAR LEGEND / RE-EDITED STILL": "ROCKSTAR LEGEND / 재편집 스틸",
    "IMAGE STUDY · SEAN WOONG": "이미지 스터디 · SEAN WOONG",
    "Re-edited still derived from Rockstar Legend": "Rockstar Legend에서 가져와 재편집한 스틸",
    "PROCESS / MOTION": "제작 과정 / 모션",
    "PACK COMPOSITION STUDY": "팩 구성 스터디",
    "SCREEN RECORD EDIT · 00:18": "화면 기록 편집 · 00:18",
    "Pack composition study screen recording": "팩 구성 스터디 화면 기록",
    "3D MOTORCYCLE — ANIMATIC / FINAL": "3D MOTORCYCLE — 애니매틱 / 최종",
    "TEASER FOOTAGE · @CHEESEPIZZA · 00:10": "티저 푸티지 · @CHEESEPIZZA · 00:10",
    "3D motorcycle animatic and final teaser shot": "3D 모터사이클 애니매틱과 최종 티저 장면",
    "DROP PAGE COVER / FINAL": "드롭 페이지 커버 / 최종",
    "PUBLIC RELEASE IMAGE": "공개 발매 이미지",
    "Final MOTTO 7777 drop page cover image": "MOTTO 7777 최종 드롭 페이지 커버 이미지",
    "COLLECTION BANNER": "컬렉션 배너",
    "MOTTO 7777 Original 7700 collection banner": "MOTTO 7777 Original 7700 컬렉션 배너",
    "MOTTO 7777 Immortals 77 collection banner": "MOTTO 7777 Immortals 77 컬렉션 배너",
    "VIEW RECORD ↗": "기록 보기 ↗",
    "PROJECT OBJECT / NFC": "프로젝트 오브젝트 / NFC",
    "NFC KEYRING": "NFC 키링",
    "Links to the MOTTO 7777 archive.": "MOTTO 7777 아카이브에 연결된다.",
    "PRIVATE ARCHIVE": "비공개 아카이브",
    "WORDMARK STUDY": "워드마크 스터디",
    "MOTTO wordmark study on a black field": "검은 화면 위의 MOTTO 워드마크 스터디",
    "ANIMATED MARK": "애니메이션 마크",
    "Animated MOTTO wordmark study on a black field": "검은 화면 위의 MOTTO 애니메이션 워드마크 스터디",
    "VHS SIGNAL STUDY": "VHS 신호 스터디",
    "MOTTO wordmark distorted through a blue VHS signal": "푸른 VHS 신호로 왜곡한 MOTTO 워드마크",
    "CONTINUE TO SOUND →": "SOUND로 계속 →",
    "05 / SEVEN-TRACK SYSTEM": "05 / 일곱 트랙 시스템",
    "OFFICIAL ALBUM / DEMOS / 8-BIT / STUDIO": "정식 앨범 / 데모 / 8-BIT / 스튜디오",
    "MUSIC — MOTTO": "음악 — MOTTO",
    "OFFICIAL ALBUM COVER / INVERTED PROFILE": "정식 앨범 커버 / INVERTED PROFILE",
    "MOTTO official album cover": "MOTTO 정식 앨범 커버",
    "OFFICIAL ALBUM / 7 TRACKS": "정식 앨범 / 7개 트랙",
    "LISTEN": "듣기",
    "BUY": "구매",
    "LISTEN TO THE OFFICIAL ALBUM ↗": "정식 앨범 듣기 ↗",
    "TRACKS": "트랙",
    "RELEASE ARTISTS": "발매 아티스트",
    "COLLECTIVE": "크루",
    "7 TRACKS ↔ 7 ARCHETYPES": "7개 트랙 ↔ 7개 아키타입",
    "7777 (GET LO) VISUALIZER": "7777 (GET LO) 비주얼라이저",
    "VISUALIZER — @CHEESEPIZZA": "비주얼라이저 — @CHEESEPIZZA",
    "MOTTO SESSIONS": "MOTTO 세션",
    "Haz Haus studio equipment and MOTTO session environment": "Haz Haus의 스튜디오 장비와 MOTTO 세션 환경",
    "CONTINUE TO PROJECT →": "PROJECT로 계속 →",
    "CHANNEL": "채널",
    "TRACK": "트랙",
    "ARCHETYPE": "아키타입",
    "READY": "준비",
    "PLAYING": "재생 중",
    "PLAYBACK UNAVAILABLE": "재생할 수 없음",
    "PREVIEW UNAVAILABLE": "미리보기를 불러올 수 없음",
    "MOTION UNAVAILABLE": "모션을 불러올 수 없음",
    "A new selected Immortal is now shown.": "새로 선택한 Immortal 작품을 표시했습니다.",
    "A new balanced selection of 28 Originals is shown.": "일곱 아키타입에서 다시 고른 Originals 28점을 표시했습니다.",
    "Motion is ready. Use the video control to begin playback.": "모션을 불러왔습니다. 비디오 컨트롤을 사용해 재생하세요.",
    "Full motion could not be loaded. The poster remains available.": "전체 모션을 불러오지 못했습니다. 포스터는 계속 볼 수 있습니다.",
    "K.I.A. motion is unavailable. The high-resolution poster is shown.": "K.I.A. 모션을 불러오지 못해 고해상도 포스터를 표시합니다.",
    "DEMO": "데모",
    "OPEN PACK →": "팩 열기 →",
    "PACK ARCHIVES": "팩 아카이브",
    "SELECT ONE OF SEVEN PACKS TO VIEW ITS 1,100 ORIGINAL WORKS.": "일곱 팩 중 하나를 선택해 해당 팩의 Original 작품 1,100점을 봅니다.",
    "VIEW 1,100 ORIGINAL WORKS →": "ORIGINAL 작품 1,100점 보기 →",
    "COMPLETE IMAGES / SELECT A WORK TO VIEW FULL SIZE": "전체 이미지 / 작품을 선택해 전체 크기로 보기",
    "8-BIT VERSIONS — HAZ HAUS / INTEGRATED INTO IMMORTALS 77": "8-BIT 버전 — HAZ HAUS / IMMORTALS 77에 결합",
    "PLAY FILM": "영상 재생",
    "MOTTO PROJECT TEASER": "MOTTO 프로젝트 티저",
    "FILM — SEAN WOONG": "영상 — SEAN WOONG",
    "3D MOTORCYCLE FOOTAGE — @CHEESEPIZZA": "3D 모터사이클 푸티지 — @CHEESEPIZZA",
    "SOUND — HAZ HAUS": "사운드 — HAZ HAUS",
    "THE 7,777 SYSTEM": "7,777 시스템",
    "SURVIVED / 3,850": "생존 / 3,850",
    "LEGENDS / 7": "LEGENDS / 7",
    "UT02 — SEVEN SEAL and other protocol rewards are documented separately and are not included in the core total of 7,777 works.": "UT02 — SEVEN SEAL을 포함한 프로토콜 리워드는 별도로 기록하며, 핵심 작품 7,777점에는 포함하지 않는다.",
    "RELEASE HISTORY": "발매 기록",
    "CHRONOLOGY": "연대기",
    "AROUND JAN 2024": "2024년 1월경",
    "Project development began.": "프로젝트 개발 시작.",
    "DEC 2025": "2025년 12월",
    "Official NFT release through Crypto.com.": "Crypto.com을 통한 NFT 정식 발매.",
    "POST-DROP": "발매 이후",
    "The K.I.A. event split the 7,700 Originals evenly; Immortals were excluded.": "K.I.A. 이벤트로 7,700개 Originals가 절반씩 나뉘었으며 Immortals는 제외됐다.",
    "MOTTO album officially released.": "MOTTO 앨범 정식 발매.",
    "MAR 2026": "2026년 3월",
    "7777 (GET LO) visualizer by @cheesepizza published.": "@cheesepizza가 제작한 7777 (GET LO) 비주얼라이저 공개.",
    "PRODUCED": "제작 완료",
    "AUTHORSHIP": "제작자와 기여자",
    "WORLD BUILDING / VISUAL DIRECTION": "월드 빌딩 / 비주얼 디렉션",
    "VOICE CREDIT — OO.SEAN": "보이스 크레딧 — OO.SEAN",
    "Co-developed the world of MOTTO 7777 and directed its complete visual system: the 7,777 works, animation, pack and release imagery, K.I.A. visual and motion, UT02, project objects, teaser film and edit, and this website.": "Haz Haus와 MOTTO 7777의 세계를 공동 개발하고 전체 시각 시스템을 디렉팅했다. 7,777개의 작품, 애니메이션, 팩과 발매 이미지, K.I.A. 비주얼과 모션, UT02, 프로젝트 오브젝트, 티저 영상과 편집, 이 웹사이트를 제작했다.",
    "Sean Woong is a Seoul-based multimedia artist and tattooist working across digital illustration, animation, moving image, object design, and the web. His practice moves between authored image systems, performance identities, and physical extensions.": "Sean Woong은 서울을 기반으로 디지털 일러스트레이션, 애니메이션, 무빙 이미지, 오브젝트 디자인, 웹을 넘나드는 멀티미디어 아티스트이자 타투이스트다. 그의 작업은 작가가 구축한 이미지 시스템, 퍼포먼스 정체성, 물리적 확장 사이를 이동한다.",
    "WORLD BUILDING / SOUND DIRECTION": "월드 빌딩 / 사운드 디렉션",
    "Co-developed the world of MOTTO 7777 and led its sound system: the album, overall sound direction and production, seven 8-bit versions, K.I.A. sound, and project teaser sound.": "Sean Woong과 MOTTO 7777의 세계를 공동 개발하고 사운드 시스템을 이끌었다. 앨범과 전체 사운드 디렉션 및 프로덕션, 일곱 개의 8-bit 버전, K.I.A. 사운드, 프로젝트 티저 사운드를 제작했다.",
    "Haz Haus is an electronic music producer working across K-pop and electronic music. His practice centers on production, sound design, and genre-crossing collaborative work.": "Haz Haus는 K-pop과 전자음악을 오가며 활동하는 전자음악 프로듀서다. 프로덕션과 사운드 디자인, 장르를 가로지르는 협업을 중심으로 작업한다.",
    "CONTRIBUTED VISUAL": "비주얼 기여",
    "3D motorcycle footage used near the opening of the MOTTO Project Teaser; visualizer for 7777 (GET LO).": "MOTTO 프로젝트 티저 초반에 사용한 3D 모터사이클 푸티지와 7777 (GET LO) 비주얼라이저를 제작했다.",
    "EXHIBITION": "전시",
    "COLLABORATION / COMMISSION": "협업 / 커미션",
    "LICENSING": "라이선싱",
    "PRESS / RESEARCH": "프레스 / 리서치",
    "CONTACT VIA INSTAGRAM ↗": "INSTAGRAM으로 문의 ↗",
    "NEXT WORK →": "다음 작품 →",
    "NO WORKS MATCH THE CURRENT FILTER.": "현재 조건과 일치하는 작품이 없습니다.",
    "NUMBER / TITLE / ARCHETYPE": "번호 / 작품명 / 아키타입",
    "8-BIT TRACK": "8-BIT 트랙",
    "After the drop, 3,850 Original images were replaced by a separate K.I.A. motion artwork. No work was burned or removed.": "발매 이후 3,850개 Original 이미지가 별도의 K.I.A. 모션 아트워크로 교체됐다. 작품은 소각되거나 제거되지 않았다.",
    "7,700 STATIC IMAGES BEFORE THE SPLIT": "분기 이전 정지 이미지 7,700점",
    "3,850 REPLACED BY MOTION": "3,850점이 모션으로 교체",
    "EXCLUDED": "제외",
    "CREDITS / STATUS": "크레딧 / 상태",
    "RELEASE / STUDY / PROCESS / OBJECT": "발매 / 스터디 / 과정 / 오브젝트",
    "RELEASE MATERIALS": "발매 자료",
    "Pack design used for the Immortals edition.": "Immortals 에디션에 사용한 팩 디자인.",
    "Animated reward for collecting all seven archetypes, built from the seven-track list.": "일곱 아키타입을 모두 수집한 사람에게 제공한 애니메이션 리워드. 일곱 트랙 목록을 바탕으로 제작했다.",
    "RELEASE IMAGES": "발매 이미지",
    "PROJECT OBJECTS": "프로젝트 오브젝트",
    "LIMITED CIRCULATION": "제한적 유통",
    "WORDMARK STUDIES": "워드마크 스터디",
    "Each track is paired with one archetype; its 8-bit version appears in the corresponding works in IMMORTALS 77.": "각 트랙은 하나의 아키타입과 짝을 이루며, 해당 8-bit 버전은 IMMORTALS 77의 작품에 결합됐다.",
    "STUDIO": "스튜디오",
    "HAZ HAUS STUDIO": "HAZ HAUS 스튜디오",
    "ARTIST NOTE": "작가 서문",
    "06 / PROJECT": "06 / 프로젝트",
    "INQUIRIES": "문의",
    "Sean Woong is a Seoul-based multimedia artist and tattooist working across digital illustration, animation, moving image, object design, and the web.": "Sean Woong은 서울을 기반으로 디지털 일러스트레이션, 애니메이션, 무빙 이미지, 오브젝트 디자인, 웹을 넘나드는 멀티미디어 아티스트이자 타투이스트다.",
    "Haz Haus is an electronic music producer working across K-pop and electronic music.": "Haz Haus는 K-pop과 전자음악을 오가며 활동하는 전자음악 프로듀서다.",
    "Project structure": "프로젝트 구조",
    "Seven fixed track and archetype pairs": "고정된 일곱 트랙과 아키타입 짝",
    "Archive position shortcuts": "아카이브 위치 바로가기",
    "MOTTO album platforms": "MOTTO 앨범 플랫폼",
    "Sean Woong links": "Sean Woong 링크",
    "Haz Haus links": "Haz Haus 링크",
    "Black MOTTO 7777 NFC keyring": "검은색 MOTTO 7777 NFC 키링"
  });

  const JA_TEXT = Object.freeze({
    "ARCHIVE DATA LOADING": "アーカイブ・データを読み込み中",
    "WORK NOT FOUND IN THE VERIFIED MANIFEST.": "検証済みマニフェストに作品が見つかりません。",
    "ENTER IMMORTALS 77 →": "IMMORTALS 77へ →",
    "TOTAL WORKS": "作品総数",
    "ARCHETYPES / TRACKS": "アーキタイプ / トラック",
    "PROJECT NOTE": "プロジェクト・ノート",
    "A WORLD FORMED THROUGH 7,777 WORKS.": "7,777点の作品を通して形成された世界。",
    "READ THE FULL PROJECT NOTE →": "プロジェクト・ノート全文を読む →",
    "01 / MOTION ARCHIVE": "01 / モーション・アーカイブ",
    "70 IMMORTALS + 7 LEGENDS": "70 IMMORTALS + 7 LEGENDS",
    "PROTOCOL-7 / LEGENDS": "PROTOCOL-7 / LEGENDS",
    "Seven archetypes in the official album order. Seven singular motion works.": "公式アルバムの順序で並ぶ7つのアーキタイプと、7点の単独モーション作品。",
    "ALL": "すべて",
    "SEARCH THE 77": "77作品を検索",
    "Filter Immortals by archetype": "アーキタイプでImmortalsを絞り込む",
    "Previous work": "前の作品",
    "Next work": "次の作品",
    "CONTINUE TO ORIGINAL 7700 →": "ORIGINAL 7700へ続く →",
    "PLAY FULL MOTION": "フル・モーションを再生",
    "LOADING MOTION": "モーションを読み込み中",
    "RETRY FULL MOTION": "フル・モーションを再読み込み",
    "PLAY 0:15": "0:15を再生",
    "PREV": "前へ",
    "NEXT": "次へ",
    "02 / PRE-K.I.A. ARCHIVE": "02 / K.I.A.以前のアーカイブ",
    "7 PACKS / 1,100 WORKS EACH": "7パック / 各1,100作品",
    "SEVEN PACKS": "7つのパック",
    "DISCOVER 28": "28作品を見る",
    "RESHUFFLE 28": "28作品を再選定",
    "AFTER THE DROP, THE ARCHIVE SPLIT.": "ドロップ後、アーカイブは二つに分岐した。",
    "ENTER K.I.A. →": "K.I.A.へ →",
    "1,100 ORIGINAL WORKS": "1,100点のORIGINAL作品",
    "JUMP TO SOURCE #": "ソース番号へ移動",
    "GO": "移動",
    "VISIBLE FIELD": "表示範囲",
    "PRE-K.I.A.": "K.I.A.以前",
    "EXACT SOURCE ORDER": "正確なソース順",
    "03 / SPECIAL EXHIBITION": "03 / 特別展示",
    "3,850 SURVIVED / 3,850 K.I.A.": "3,850 SURVIVED / 3,850 K.I.A.",
    "PLAY": "再生",
    "SOUND ON": "音声オン",
    "SOUND OFF": "音声オフ",
    "PAUSE": "一時停止",
    "K.I.A. motion artwork": "K.I.A.モーション作品",
    "K.I.A. motion controls": "K.I.A.モーション操作",
    "VISUAL / MOTION": "ビジュアル / モーション",
    "SOUND PRODUCTION": "サウンド・プロダクション",
    "AFFECTED SET": "適用対象",
    "EXCLUDED SET": "除外対象",
    "STATUS": "状態",
    "COMPLETED": "完了",
    "CONTINUE TO VAULT →": "VAULTへ続く →",
    "04 / MATERIAL ARCHIVE": "04 / マテリアル・アーカイブ",
    "Immortals special pack design": "Immortalsスペシャル・パックのデザイン",
    "UT02 — Seven Seal animated completion reward": "UT02 — Seven Seal アニメーション・コンプリート報酬",
    "Open UT02 Seven Seal at full size": "UT02 Seven Sealをフルサイズで開く",
    "UNRELEASED IMAGE STUDIES": "未公開イメージ・スタディ",
    "DROP PAGE COVER / EARLY STUDY": "ドロップページ・カバー / 初期スタディ",
    "UNRELEASED · SEAN WOONG": "未公開 · SEAN WOONG",
    "Early unused study for the MOTTO 7777 drop page cover": "MOTTO 7777ドロップページ・カバーの未使用初期スタディ",
    "ROCKSTAR LEGEND / RE-EDITED STILL": "ROCKSTAR LEGEND / 再編集スチル",
    "IMAGE STUDY · SEAN WOONG": "イメージ・スタディ · SEAN WOONG",
    "Re-edited still derived from Rockstar Legend": "Rockstar Legendから派生した再編集スチル",
    "PROCESS / MOTION": "制作過程 / モーション",
    "PACK COMPOSITION STUDY": "パック構成スタディ",
    "SCREEN RECORD EDIT · 00:18": "画面収録編集 · 00:18",
    "Pack composition study screen recording": "パック構成スタディの画面収録",
    "3D MOTORCYCLE — ANIMATIC / FINAL": "3D MOTORCYCLE — アニマティック / 完成版",
    "TEASER FOOTAGE · @CHEESEPIZZA · 00:10": "ティザー映像 · @CHEESEPIZZA · 00:10",
    "3D motorcycle animatic and final teaser shot": "3Dモーターサイクルのアニマティックとティザー完成ショット",
    "DROP PAGE COVER / FINAL": "ドロップページ・カバー / 完成版",
    "PUBLIC RELEASE IMAGE": "公開リリース・イメージ",
    "Final MOTTO 7777 drop page cover image": "MOTTO 7777ドロップページ・カバーの完成イメージ",
    "COLLECTION BANNER": "コレクション・バナー",
    "MOTTO 7777 Original 7700 collection banner": "MOTTO 7777 Original 7700 コレクション・バナー",
    "MOTTO 7777 Immortals 77 collection banner": "MOTTO 7777 Immortals 77 コレクション・バナー",
    "VIEW RECORD ↗": "記録を見る ↗",
    "PROJECT OBJECT / NFC": "プロジェクト・オブジェクト / NFC",
    "NFC KEYRING": "NFCキーリング",
    "Links to the MOTTO 7777 archive.": "MOTTO 7777アーカイブへ接続する。",
    "PRIVATE ARCHIVE": "非公開アーカイブ",
    "WORDMARK STUDY": "ワードマーク・スタディ",
    "MOTTO wordmark study on a black field": "黒地に置かれたMOTTOワードマークのスタディ",
    "ANIMATED MARK": "アニメーション・マーク",
    "Animated MOTTO wordmark study on a black field": "黒地に置かれたMOTTOアニメーション・ワードマークのスタディ",
    "VHS SIGNAL STUDY": "VHSシグナル・スタディ",
    "MOTTO wordmark distorted through a blue VHS signal": "青いVHS信号で歪めたMOTTOワードマーク",
    "CONTINUE TO SOUND →": "SOUNDへ続く →",
    "05 / SEVEN-TRACK SYSTEM": "05 / 7トラック・システム",
    "OFFICIAL ALBUM / DEMOS / 8-BIT / STUDIO": "公式アルバム / デモ / 8-BIT / スタジオ",
    "MUSIC — MOTTO": "音楽 — MOTTO",
    "OFFICIAL ALBUM COVER / INVERTED PROFILE": "公式アルバム・カバー / INVERTED PROFILE",
    "MOTTO official album cover": "MOTTO公式アルバム・カバー",
    "OFFICIAL ALBUM / 7 TRACKS": "公式アルバム / 7トラック",
    "LISTEN": "聴く",
    "BUY": "購入",
    "LISTEN TO THE OFFICIAL ALBUM ↗": "公式アルバムを聴く ↗",
    "TRACKS": "トラック",
    "RELEASE ARTISTS": "リリース・アーティスト",
    "COLLECTIVE": "コレクティブ",
    "7 TRACKS ↔ 7 ARCHETYPES": "7トラック ↔ 7アーキタイプ",
    "7777 (GET LO) VISUALIZER": "7777 (GET LO) ビジュアライザー",
    "VISUALIZER — @CHEESEPIZZA": "ビジュアライザー — @CHEESEPIZZA",
    "MOTTO SESSIONS": "MOTTOセッション",
    "Haz Haus studio equipment and MOTTO session environment": "Haz Hausのスタジオ機材とMOTTOセッションの制作環境",
    "CONTINUE TO PROJECT →": "PROJECTへ続く →",
    "CHANNEL": "チャンネル",
    "TRACK": "トラック",
    "ARCHETYPE": "アーキタイプ",
    "READY": "準備完了",
    "PLAYING": "再生中",
    "PLAYBACK UNAVAILABLE": "再生できません",
    "PREVIEW UNAVAILABLE": "プレビューを表示できません",
    "MOTION UNAVAILABLE": "モーションを読み込めません",
    "A new selected Immortal is now shown.": "新しく選択したImmortalを表示しました。",
    "A new balanced selection of 28 Originals is shown.": "7つのアーキタイプから再選定した28点のOriginalsを表示しました。",
    "Motion is ready. Use the video control to begin playback.": "モーションの準備ができました。動画操作で再生を開始してください。",
    "Full motion could not be loaded. The poster remains available.": "フル・モーションを読み込めませんでした。ポスターは引き続き表示されます。",
    "K.I.A. motion is unavailable. The high-resolution poster is shown.": "K.I.A.モーションを読み込めないため、高解像度ポスターを表示します。",
    "DEMO": "デモ",
    "OPEN PACK →": "パックを開く →",
    "PACK ARCHIVES": "パック・アーカイブ",
    "SELECT ONE OF SEVEN PACKS TO VIEW ITS 1,100 ORIGINAL WORKS.": "7つのパックから一つを選び、その1,100点のOriginal作品を表示します。",
    "VIEW 1,100 ORIGINAL WORKS →": "1,100点のORIGINAL作品を見る →",
    "COMPLETE IMAGES / SELECT A WORK TO VIEW FULL SIZE": "全体イメージ / 作品を選択してフルサイズで表示",
    "8-BIT VERSIONS — HAZ HAUS / INTEGRATED INTO IMMORTALS 77": "8-BIT版 — HAZ HAUS / IMMORTALS 77に統合",
    "PLAY FILM": "映像を再生",
    "MOTTO PROJECT TEASER": "MOTTOプロジェクト・ティザー",
    "FILM — SEAN WOONG": "映像 — SEAN WOONG",
    "3D MOTORCYCLE FOOTAGE — @CHEESEPIZZA": "3Dモーターサイクル映像 — @CHEESEPIZZA",
    "SOUND — HAZ HAUS": "サウンド — HAZ HAUS",
    "THE 7,777 SYSTEM": "7,777システム",
    "SURVIVED / 3,850": "生存 / 3,850",
    "LEGENDS / 7": "LEGENDS / 7",
    "UT02 — SEVEN SEAL and other protocol rewards are documented separately and are not included in the core total of 7,777 works.": "UT02 — SEVEN SEALを含むプロトコル報酬は別途記録され、主要作品7,777点には含まれない。",
    "RELEASE HISTORY": "リリース履歴",
    "CHRONOLOGY": "年表",
    "AROUND JAN 2024": "2024年1月頃",
    "Project development began.": "プロジェクト開発開始。",
    "DEC 2025": "2025年12月",
    "Official NFT release through Crypto.com.": "Crypto.comを通じてNFTを正式リリース。",
    "POST-DROP": "ドロップ後",
    "The K.I.A. event split the 7,700 Originals evenly; Immortals were excluded.": "K.I.A.イベントによって7,700点のOriginalsは半数ずつに分かれ、Immortalsは対象外となった。",
    "MOTTO album officially released.": "MOTTOアルバムを正式リリース。",
    "MAR 2026": "2026年3月",
    "7777 (GET LO) visualizer by @cheesepizza published.": "@cheesepizza制作の7777 (GET LO)ビジュアライザーを公開。",
    "PRODUCED": "制作完了",
    "AUTHORSHIP": "作者と参加者",
    "WORLD BUILDING / VISUAL DIRECTION": "ワールド・ビルディング / ビジュアル・ディレクション",
    "VOICE CREDIT — OO.SEAN": "ボイス・クレジット — OO.SEAN",
    "Co-developed the world of MOTTO 7777 and directed its complete visual system: the 7,777 works, animation, pack and release imagery, K.I.A. visual and motion, UT02, project objects, teaser film and edit, and this website.": "Haz HausとMOTTO 7777の世界を共同構築し、7,777点の作品、アニメーション、パックとリリースのイメージ、K.I.A.のビジュアルとモーション、UT02、プロジェクト・オブジェクト、ティザー映像と編集、本ウェブサイトを含む視覚システム全体をディレクションした。",
    "Sean Woong is a Seoul-based multimedia artist and tattooist working across digital illustration, animation, moving image, object design, and the web. His practice moves between authored image systems, performance identities, and physical extensions.": "Sean Woongはソウルを拠点に、デジタル・イラストレーション、アニメーション、映像、オブジェクト・デザイン、ウェブを横断して活動するマルチメディア・アーティスト／タトゥーイストである。自ら構築するイメージ・システム、パフォーマンス上のアイデンティティ、物理的な拡張のあいだを行き来しながら制作している。",
    "WORLD BUILDING / SOUND DIRECTION": "ワールド・ビルディング / サウンド・ディレクション",
    "Co-developed the world of MOTTO 7777 and led its sound system: the album, overall sound direction and production, seven 8-bit versions, K.I.A. sound, and project teaser sound.": "Sean WoongとMOTTO 7777の世界を共同構築し、アルバム、全体のサウンド・ディレクションとプロダクション、7つの8-bit版、K.I.A.サウンド、プロジェクト・ティザーのサウンドを含む音響システムを主導した。",
    "Haz Haus is an electronic music producer working across K-pop and electronic music. His practice centers on production, sound design, and genre-crossing collaborative work.": "Haz HausはK-popと電子音楽を横断して活動する電子音楽プロデューサーである。プロダクション、サウンド・デザイン、ジャンルを越える共同制作を中心に活動している。",
    "CONTRIBUTED VISUAL": "ビジュアル協力",
    "3D motorcycle footage used near the opening of the MOTTO Project Teaser; visualizer for 7777 (GET LO).": "MOTTOプロジェクト・ティザー冒頭付近で使用した3Dモーターサイクル映像、および7777 (GET LO)のビジュアライザー。",
    "EXHIBITION": "展示",
    "COLLABORATION / COMMISSION": "コラボレーション / コミッション",
    "LICENSING": "ライセンス",
    "PRESS / RESEARCH": "プレス / リサーチ",
    "CONTACT VIA INSTAGRAM ↗": "INSTAGRAMから問い合わせ ↗",
    "NEXT WORK →": "次の作品 →",
    "NO WORKS MATCH THE CURRENT FILTER.": "現在の条件に一致する作品はありません。",
    "NUMBER / TITLE / ARCHETYPE": "番号 / 作品名 / アーキタイプ",
    "8-BIT TRACK": "8-BITトラック",
    "After the drop, 3,850 Original images were replaced by a separate K.I.A. motion artwork. No work was burned or removed.": "ドロップ後、3,850点のOriginalイメージは別個のK.I.A.モーション作品へ置き換えられた。作品が焼却または削除されたわけではない。",
    "7,700 STATIC IMAGES BEFORE THE SPLIT": "分岐前の静止画像7,700点",
    "3,850 REPLACED BY MOTION": "3,850点をモーションへ置換",
    "EXCLUDED": "対象外",
    "CREDITS / STATUS": "クレジット / 状態",
    "RELEASE / STUDY / PROCESS / OBJECT": "リリース / スタディ / 制作過程 / オブジェクト",
    "RELEASE MATERIALS": "リリース資料",
    "Pack design used for the Immortals edition.": "Immortalsエディションに使用したパック・デザイン。",
    "Animated reward for collecting all seven archetypes, built from the seven-track list.": "7つのアーキタイプをすべて収集した人に提供されたアニメーション報酬。7曲のトラックリストをもとに制作。",
    "RELEASE IMAGES": "リリース・イメージ",
    "PROJECT OBJECTS": "プロジェクト・オブジェクト",
    "LIMITED CIRCULATION": "限定流通",
    "WORDMARK STUDIES": "ワードマーク・スタディ",
    "Each track is paired with one archetype; its 8-bit version appears in the corresponding works in IMMORTALS 77.": "各トラックは一つのアーキタイプと組になり、その8-bit版がIMMORTALS 77の対応作品に組み込まれている。",
    "STUDIO": "スタジオ",
    "HAZ HAUS STUDIO": "HAZ HAUSスタジオ",
    "ARTIST NOTE": "アーティスト・ノート",
    "06 / PROJECT": "06 / プロジェクト",
    "INQUIRIES": "問い合わせ",
    "Sean Woong is a Seoul-based multimedia artist and tattooist working across digital illustration, animation, moving image, object design, and the web.": "Sean Woongはソウルを拠点に、デジタル・イラストレーション、アニメーション、映像、オブジェクト・デザイン、ウェブを横断して活動するマルチメディア・アーティスト／タトゥーイストである。",
    "Haz Haus is an electronic music producer working across K-pop and electronic music.": "Haz HausはK-popと電子音楽を横断して活動する電子音楽プロデューサーである。",
    "Project structure": "プロジェクト構成",
    "Seven fixed track and archetype pairs": "固定された7つのトラックとアーキタイプの組",
    "Archive position shortcuts": "アーカイブ位置へのショートカット",
    "MOTTO album platforms": "MOTTOアルバム配信プラットフォーム",
    "Sean Woong links": "Sean Woongへのリンク",
    "Haz Haus links": "Haz Hausへのリンク",
    "Black MOTTO 7777 NFC keyring": "黒いMOTTO 7777 NFCキーリング"
  });

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
    searchTimer: 0
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

  const SUPPORTED_LANGUAGES = new Set(["en", "ko", "ja"]);

  function preferredSupportedLanguage(languages) {
    for (const language of languages || []) {
      const primaryLanguage = String(language || "")
        .trim()
        .toLowerCase()
        .split("-")[0];
      if (SUPPORTED_LANGUAGES.has(primaryLanguage)) return primaryLanguage;
    }
    return "en";
  }

  const storedLanguage = safeStorageGet("motto-v2-lang");
  if (SUPPORTED_LANGUAGES.has(storedLanguage)) {
    state.lang = storedLanguage;
  } else {
    const browserLanguages = typeof navigator === "undefined"
      ? []
      : Array.isArray(navigator.languages) && navigator.languages.length
        ? navigator.languages
        : [navigator.language];
    state.lang = preferredSupportedLanguage(browserLanguages);
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

  function projectNote() {
    if (state.lang === "ko") return PROJECT_NOTE_KO;
    if (state.lang === "ja") return PROJECT_NOTE_JA;
    return PROJECT_NOTE;
  }

  function translateToKorean(value) {
    const text = String(value || "").trim();
    if (!text) return text;
    if (KO_TEXT[text]) return KO_TEXT[text];

    let match = text.match(/^← BACK TO (.+)$/);
    if (match) return `← ${match[1]}로 돌아가기`;
    match = text.match(/^BACK TO (.+)$/);
    if (match) return `${match[1]}로 돌아가기`;
    match = text.match(/^CHANNEL (\d+) \/ READY$/);
    if (match) return `채널 ${match[1]} / 준비`;
    match = text.match(/^(8-BIT|DEMO) \/ (READY|PLAYING)$/);
    if (match) {
      return `${match[1]} / ${match[2] === "READY" ? "준비" : "재생 중"}`;
    }
    match = text.match(/^VISIBLE (\d+)–(\d+) \/ 1,100$/);
    if (match) return `현재 ${match[1]}–${match[2]} / 1,100`;
    match = text.match(/^(.+) PACK \/ 1,100 ORIGINALS$/);
    if (match) return `${match[1]} 팩 / ORIGINALS 1,100점`;
    match = text.match(/^(.+) pack for (.+)$/);
    if (match) return `${match[2]}용 ${match[1]} 팩`;
    match = text.match(/^(.+) pack design$/);
    if (match) return `${match[1]} 팩 디자인`;
    match = text.match(/^8-BIT TRACK \/ (\d+)$/);
    if (match) return `8-BIT 트랙 / ${match[1]}`;
    match = text.match(/^Open (.+) archive$/);
    if (match) return `${match[1]} 아카이브 열기`;
    match = text.match(/^Open (.+) Original pack$/);
    if (match) return `${match[1]} Original 팩 열기`;
    match = text.match(/^Open (.+)$/);
    if (match) return `${match[1]} 열기`;
    match = text.match(/^Play (.+) on YouTube$/);
    if (match) return `YouTube에서 ${match[1]} 재생`;
    match = text.match(/^Play (.+) demo, (.+)$/);
    if (match) return `${match[1]} 데모 재생, ${match[2]}`;
    match = text.match(/^Play (.+) 8-bit version, 15 seconds$/);
    if (match) return `${match[1]} 8-bit 버전 15초 재생`;
    match = text.match(/^Select (.+), (.+) channel$/);
    if (match) return `${match[1]}, ${match[2]} 채널 선택`;
    match = text.match(/^(.+) motion preview$/);
    if (match) return `${match[1]} 모션 미리보기`;
    match = text.match(/^(.+) archive of 1,100 works$/);
    if (match) return `${match[1]} 작품 1,100점 아카이브`;
    match = text.match(/^(.+) source (\d+) shown in the archive\.$/);
    if (match) return `${match[1]} 원본 ${match[2]}번을 아카이브에 표시했습니다.`;
    match = text.match(/^Enter a source number between 1 and (\d+)\.$/);
    if (match) return `1에서 ${match[1]} 사이의 원본 번호를 입력하세요.`;
    match = text.match(/^(.+) Immortals filter selected\.$/);
    if (match) return `${match[1]} Immortals 필터를 선택했습니다.`;
    match = text.match(/^(\d+) Immortals match the current search\.$/);
    if (match) return `현재 검색과 일치하는 Immortals는 ${match[1]}점입니다.`;
    match = text.match(/^(.+), (.+) channel selected\.$/);
    if (match) return `${match[1]}, ${match[2]} 채널을 선택했습니다.`;
    return text;
  }

  function translateToJapanese(value) {
    const text = String(value || "").trim();
    if (!text) return text;
    if (JA_TEXT[text]) return JA_TEXT[text];

    let match = text.match(/^← BACK TO (.+)$/);
    if (match) return `← ${match[1]}へ戻る`;
    match = text.match(/^BACK TO (.+)$/);
    if (match) return `${match[1]}へ戻る`;
    match = text.match(/^CHANNEL (\d+) \/ READY$/);
    if (match) return `チャンネル ${match[1]} / 準備完了`;
    match = text.match(/^(8-BIT|DEMO) \/ (READY|PLAYING)$/);
    if (match) {
      return `${match[1]} / ${match[2] === "READY" ? "準備完了" : "再生中"}`;
    }
    match = text.match(/^VISIBLE (\d+)–(\d+) \/ 1,100$/);
    if (match) return `表示中 ${match[1]}–${match[2]} / 1,100`;
    match = text.match(/^(.+) PACK \/ 1,100 ORIGINALS$/);
    if (match) return `${match[1]}パック / ORIGINALS 1,100点`;
    match = text.match(/^(.+) pack for (.+)$/);
    if (match) return `${match[2]}用の${match[1]}パック`;
    match = text.match(/^(.+) pack design$/);
    if (match) return `${match[1]}パック・デザイン`;
    match = text.match(/^8-BIT TRACK \/ (\d+)$/);
    if (match) return `8-BITトラック / ${match[1]}`;
    match = text.match(/^Open (.+) archive$/);
    if (match) return `${match[1]}アーカイブを開く`;
    match = text.match(/^Open (.+) Original pack$/);
    if (match) return `${match[1]} Originalパックを開く`;
    match = text.match(/^Open (.+)$/);
    if (match) return `${match[1]}を開く`;
    match = text.match(/^Play (.+) on YouTube$/);
    if (match) return `YouTubeで${match[1]}を再生`;
    match = text.match(/^Play (.+) demo, (.+)$/);
    if (match) return `${match[1]}のデモを再生、${match[2]}`;
    match = text.match(/^Play (.+) 8-bit version, 15 seconds$/);
    if (match) return `${match[1]}の8-bit版を15秒再生`;
    match = text.match(/^Select (.+), (.+) channel$/);
    if (match) return `${match[1]}、${match[2]}チャンネルを選択`;
    match = text.match(/^(.+) motion preview$/);
    if (match) return `${match[1]}モーション・プレビュー`;
    match = text.match(/^(.+) archive of 1,100 works$/);
    if (match) return `${match[1]}作品1,100点のアーカイブ`;
    match = text.match(/^(.+) source (\d+) shown in the archive\.$/);
    if (match) return `${match[1]}のソース${match[2]}をアーカイブに表示しました。`;
    match = text.match(/^Enter a source number between 1 and (\d+)\.$/);
    if (match) return `1から${match[1]}までのソース番号を入力してください。`;
    match = text.match(/^(.+) Immortals filter selected\.$/);
    if (match) return `${match[1]}のImmortalsフィルターを選択しました。`;
    match = text.match(/^(\d+) Immortals match the current search\.$/);
    if (match) return `現在の検索に一致するImmortalsは${match[1]}点です。`;
    match = text.match(/^(.+), (.+) channel selected\.$/);
    if (match) return `${match[1]}、${match[2]}チャンネルを選択しました。`;
    return text;
  }

  function translateLocalized(value) {
    if (state.lang === "ko") return translateToKorean(value);
    if (state.lang === "ja") return translateToJapanese(value);
    return value;
  }

  function localizedText(value) {
    return translateLocalized(value);
  }

  function localizeRenderedPage(root) {
    if (state.lang === "en" || !root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const raw = node.nodeValue || "";
      const trimmed = raw.trim();
      if (!trimmed) return;
      const translated = translateLocalized(trimmed);
      if (translated === trimmed) return;
      node.nodeValue = raw.replace(trimmed, translated);
    });

    root.querySelectorAll("[aria-label], [placeholder], [title], [alt]").forEach((element) => {
      ["aria-label", "placeholder", "title", "alt"].forEach((attribute) => {
        if (!element.hasAttribute(attribute)) return;
        const value = element.getAttribute(attribute) || "";
        const translated = translateLocalized(value);
        if (translated !== value) element.setAttribute(attribute, translated);
      });
    });
  }

  function localizeShell() {
    const isKorean = state.lang === "ko";
    const isJapanese = state.lang === "ja";
    const shell = {
      skip: isKorean ? "본문으로 건너뛰기" : isJapanese ? "本文へ移動" : "Skip to content",
      home: isKorean ? "MOTTO 7777 홈" : isJapanese ? "MOTTO 7777 ホーム" : "MOTTO 7777 home",
      menu: isKorean ? "메뉴" : isJapanese ? "メニュー" : "MENU",
      close: isKorean ? "닫기" : isJapanese ? "閉じる" : "CLOSE",
      language: isKorean ? "언어" : isJapanese ? "言語" : "Language",
      primary: isKorean ? "주요 탐색" : isJapanese ? "メインナビゲーション" : "Primary",
      mobilePrimary: isKorean ? "모바일 주요 탐색" : isJapanese ? "モバイル・メインナビゲーション" : "Mobile primary",
      kia: isKorean ? "K.I.A. 특별 전시" : isJapanese ? "K.I.A. 特別展示" : "K.I.A. SPECIAL EXHIBITION",
      footer: "SEAN WOONG + HAZ HAUS",
      archive: isKorean
        ? "오디오비주얼 아카이브 / 2024—2026"
        : isJapanese
          ? "オーディオビジュアル・アーカイブ / 2024—2026"
          : "AUDIOVISUAL ARCHIVE / 2024—2026",
      collection: isKorean
        ? "역사적 컬렉션 기록 ↗"
        : isJapanese
          ? "コレクション記録 ↗"
          : "HISTORICAL COLLECTION SOURCE ↗"
    };

    const skipLink = document.querySelector(".skip-link");
    const brand = document.querySelector(".brand");
    const menuButton = document.querySelector("[data-menu-open]");
    const closeButton = document.querySelector("[data-menu-close]");
    const primaryNav = document.querySelector(".desktop-nav");
    const mobilePrimaryNav = document.querySelector(".mobile-menu nav");
    const kiaLink = document.querySelector(".mobile-menu__meta a[data-route]");
    const footerCredit = document.querySelector(".site-footer__title span:last-child");
    const footerArchive = document.querySelector(".site-footer__record span:first-child");
    const collectionLink = [...document.querySelectorAll(".site-footer__links a")]
      .find((link) => link.href.includes("crypto.com"));

    if (skipLink) skipLink.textContent = shell.skip;
    if (brand) brand.setAttribute("aria-label", shell.home);
    if (menuButton) menuButton.textContent = shell.menu;
    if (closeButton) closeButton.textContent = shell.close;
    if (primaryNav) primaryNav.setAttribute("aria-label", shell.primary);
    if (mobilePrimaryNav) mobilePrimaryNav.setAttribute("aria-label", shell.mobilePrimary);
    if (kiaLink) kiaLink.textContent = shell.kia;
    if (footerCredit) footerCredit.textContent = shell.footer;
    if (footerArchive) footerArchive.textContent = shell.archive;
    if (collectionLink) collectionLink.textContent = shell.collection;

    document.querySelectorAll(".language-switch, .mobile-menu__languages").forEach((control) => {
      control.setAttribute("aria-label", shell.language);
    });
    document.querySelectorAll('[data-lang="en"]').forEach((button) => {
      button.setAttribute("aria-label", isKorean ? "영어로 보기" : isJapanese ? "英語で表示" : "View in English");
    });
    document.querySelectorAll('[data-lang="ko"]').forEach((button) => {
      button.setAttribute("aria-label", isKorean ? "한국어로 보기" : isJapanese ? "韓国語で表示" : "View in Korean");
    });
    document.querySelectorAll('[data-lang="ja"]').forEach((button) => {
      button.setAttribute("aria-label", isKorean ? "일본어로 보기" : isJapanese ? "日本語で表示" : "View in Japanese");
    });
  }

  function immortalDescriptionData(item) {
    if (!item) return "";
    return item.description || (item.legend ? LEGEND_DESCRIPTIONS[item.archetype] : null) || "";
  }

  function immortalDescription(item) {
    const description = immortalDescriptionData(item);
    if (!description) return "";
    if (typeof description === "string") return description;
    if (state.lang === "ko") {
      return description.ko || description.kr || description.en || "";
    }
    if (state.lang === "ja") {
      return description.ja || IMMORTAL_DESCRIPTION_JA[description.en] || description.en || "";
    }
    return description.en || description.ko || description.kr || "";
  }

  function immortalBilingualDescription(item) {
    const description = immortalDescriptionData(item);
    if (!description) return { en: "", translation: "", translationLang: "" };
    if (typeof description === "string") {
      return { en: description, translation: "", translationLang: "" };
    }
    const japanese = description.ja || IMMORTAL_DESCRIPTION_JA[description.en] || "";
    const translationLang = state.lang === "ja" ? "ja" : "ko";
    return {
      en: description.en || "",
      translation: translationLang === "ja"
        ? japanese
        : description.ko || description.kr || "",
      translationLang
    };
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
      classLabel: item.legend ? "PROTOCOL-7" : "IMMORTAL"
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
      })
      .catch((error) => {
        state.dataError = error.message || "Archive data unavailable";
      });
    return dataPromise;
  }

  function buildHomePool() {
    const curatedHomeIds = [
      "legend-motorcycle",
      "drag-404",
      "skull-91",
      "legend-dealer",
      "boxer-168",
      "rockstar-696",
      "legend-soldier",
      "motorcycle-313",
      "drag-402",
      "boxer-190",
      "skull-547",
      "soldier-258"
    ];
    state.homePool = curatedHomeIds
      .map((id) => state.immortals.find((item) => item.id === id))
      .filter(Boolean);
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
    document.documentElement.lang = state.lang === "ko" ? "ko" : state.lang === "ja" ? "ja" : "en";
    app.innerHTML = renderer(route);
    localizeRenderedPage(app);
    localizeShell();
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
      } else if (preserveFocus.startsWith("immortal-filter:")) {
        const filter = preserveFocus.split(":")[1];
        document
          .querySelector(`[data-immortal-filter="${filter}"]`)
          ?.focus({ preventScroll: true });
      } else if (preserveFocus === "originals-reshuffle") {
        document.querySelector("[data-reshuffle]")?.focus({ preventScroll: true });
      } else if (preserveFocus === "home-next") {
        document.querySelector("[data-next-signal]")?.focus({ preventScroll: true });
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

      const projectNoteRequested =
        route.type === "project" &&
        new URLSearchParams(location.search).get("note") === "true";
      if (projectNoteRequested) {
        document.querySelector("#project-note")?.scrollIntoView({ block: "start" });
        return;
      }

      window.scrollTo(0, 0);
      app.focus({ preventScroll: true });
    });
  }

  function setDocumentTitle(route) {
    const isKorean = state.lang === "ko";
    const isJapanese = state.lang === "ja";
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
      ? isKorean
        ? "MOTTO 7777 — 오디오비주얼 아카이브"
        : isJapanese
          ? "MOTTO 7777 — オーディオビジュアル・アーカイブ"
          : "MOTTO 7777 — Audiovisual Archive"
      : `${pageTitle} — MOTTO 7777`;
    document.documentElement.lang = isKorean ? "ko" : isJapanese ? "ja" : "en";
    const description = document.querySelector('meta[name="description"]');
    const socialDescription = document.querySelector('meta[property="og:description"]');
    const routeDescriptions = isKorean
      ? {
          home: "MOTTO 7777 — 7,777개의 작품, 일곱 개의 고정된 트랙과 아키타입 짝, 발매 이후의 K.I.A. 전환으로 형성된 오디오비주얼 세계.",
          immortals: "IMMORTALS 77 — 70개의 Immortals와 일곱 개의 Legends. 각 작품은 해당 아키타입과 짝을 이루는 8-bit 트랙을 결합한다.",
          originals: "ORIGINAL 7700 — 일곱 아키타입 팩으로 보존한 완전한 K.I.A. 이전 이미지 상태.",
          vault: "MOTTO 7777의 발매 아티팩트, 미공개 스터디, 제작 기록, 오브젝트, 아이덴티티 작업.",
          sound: "일곱 개의 고정된 트랙과 아키타입 짝, 데모, IMMORTALS 77에 결합된 8-bit 버전, 스튜디오 기록.",
          project: "MOTTO 7777의 작가 서문과 구조, 연대기, 크레딧, 문의 기록.",
          kia: "K.I.A. — 7,700개 Original 이미지의 절반을 별도의 모션 아트워크로 교체한 발매 이후의 전환."
        }
      : isJapanese
        ? {
            home: "MOTTO 7777 — 7,777点の作品、固定された7つのトラックとアーキタイプの組、リリース後のK.I.A.転換によって形成されたオーディオビジュアルの世界。",
            immortals: "IMMORTALS 77 — 70点のImmortalsと7点のLegends。各作品には対応するアーキタイプと組をなす8-bitトラックが統合されている。",
            originals: "ORIGINAL 7700 — 7つのアーキタイプ・パックとして保存されたK.I.A.以前の完全なイメージ状態。",
            vault: "MOTTO 7777のリリース資料、未公開スタディ、制作記録、オブジェクト、ワードマーク作品。",
            sound: "固定された7つのトラックとアーキタイプの組、デモ、IMMORTALS 77に統合された8-bit版、スタジオ記録。",
            project: "MOTTO 7777のアーティスト・ノート、構造、年表、クレジット、問い合わせ記録。",
            kia: "K.I.A. — 7,700点のOriginalイメージの半数を別個のモーション作品へ置き換えた、リリース後の転換。"
          }
      : {
          home: "MOTTO 7777 — an audiovisual world formed through 7,777 works, seven fixed archetype-track pairs, and a post-release K.I.A. transition.",
          immortals: "IMMORTALS 77 — seventy Immortals and seven singular Legends, each integrating the 8-bit track paired with its archetype.",
          originals: "ORIGINAL 7700 — the complete pre-K.I.A. image state of seven archetype packs.",
          vault: "Selected release artifacts, unreleased studies, process records, objects, and identity work from MOTTO 7777.",
          sound: "Seven fixed track-archetype pairs, demos, 8-bit versions integrated into IMMORTALS 77, and studio records.",
          project: "The artist-authored project note, structure, timeline, credits, and inquiry record for MOTTO 7777.",
          kia: "K.I.A. — the completed post-drop transition that replaced half of the 7,700 Original images with a separate motion artwork."
        };
    const routeDescription =
      routeDescriptions[route.type] ||
      routeDescriptions[route.section] ||
      routeDescriptions.home;
    const finalDescription = immortal
      ? `${immortal.publicTitle} — ${immortalDescription(immortal)}`
      : route.type === "original-detail" && originalPack
        ? isKorean
          ? `${originalPack.label} ${route.number}, K.I.A. 이전 Original 상태로 보존.`
          : isJapanese
            ? `${originalPack.label} ${route.number}、K.I.A.以前のOriginal状態として保存。`
            : `${originalPack.label} ${route.number}, preserved in its original pre-K.I.A. state.`
        : routeDescription;
    const canonicalUrl = productionUrlForRoute(route);
    const original =
      route.type === "original-detail" && originalPack
        ? buildOriginalItem(originalPack, route.number)
        : null;
    const routeSocialImages = {
      home: {
        src: "https://motto7777.com/media/project-teaser-poster.jpg",
        width: 1280,
        height: 720
      },
      immortals: {
        src: "https://motto7777.com/media/vault-immortals-banner.webp",
        width: 1500,
        height: 500
      },
      originals: {
        src: "https://motto7777.com/media/vault-collection-banner.webp",
        width: 1500,
        height: 500
      },
      kia: {
        src: "https://motto7777.com/media/kia-poster.webp",
        width: 1080,
        height: 1080
      },
      vault: {
        src: "https://motto7777.com/media/vault-drop-page-cover-final.webp",
        width: 1440,
        height: 810
      },
      sound: {
        src: "https://motto7777.com/assets/images/motto_profile_static.webp",
        width: 500,
        height: 500
      },
      project: {
        src: "https://motto7777.com/media/project-teaser-poster.jpg",
        width: 1280,
        height: 720
      }
    };
    const socialImageRecord = immortal
      ? {
          src: `https://motto7777.com/${immortalPoster(immortal)}`,
          width: 500,
          height: 500
        }
      : original
        ? { src: original.url, width: 500, height: 500 }
        : route.type === "pack" && originalPack
          ? {
              src: `https://motto7777.com/${originalPack.cover}`,
              width: 696,
              height: 1012
            }
          : routeSocialImages[route.type] ||
            routeSocialImages[route.section] ||
            routeSocialImages.home;
    const socialImage = socialImageRecord.src;

    description?.setAttribute("content", finalDescription);
    socialDescription?.setAttribute("content", finalDescription);
    setMeta('meta[property="og:title"]', "content", pageTitle);
    setMeta(
      'meta[property="og:locale"]',
      "content",
      isKorean ? "ko_KR" : isJapanese ? "ja_JP" : "en_US"
    );
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:image"]', "content", socialImage);
    setMeta('meta[property="og:image:alt"]', "content", pageTitle);
    setMeta('meta[property="og:image:width"]', "content", String(socialImageRecord.width));
    setMeta('meta[property="og:image:height"]', "content", String(socialImageRecord.height));
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

  function languageValue(en, ko, ja) {
    if (state.lang === "ko") return ko;
    if (state.lang === "ja") return ja;
    return en;
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
              description: languageValue(
                "World building and visual direction",
                "월드 빌딩과 비주얼 디렉션",
                "ワールド・ビルディングとビジュアル・ディレクション"
              )
            },
            {
              "@type": "Person",
              name: "Haz Haus",
              description: languageValue(
                "World building, album production, and sound direction",
                "월드 빌딩, 앨범 프로덕션, 사운드 디렉션",
                "ワールド・ビルディング、アルバム・プロダクション、サウンド・ディレクション"
              )
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
      record.artform = languageValue("Digital art", "디지털 아트", "デジタル・アート");
      record.genre = languageValue("Audiovisual art", "오디오비주얼 아트", "オーディオビジュアル・アート");
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
        description: languageValue("Sound production", "사운드 프로덕션", "サウンド・プロダクション")
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
    const localizedMessage = localizedText(message);
    statusRegion.textContent = "";
    requestAnimationFrame(() => {
      statusRegion.textContent = localizedMessage;
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
    const note = projectNote();
    const descriptions = immortalBilingualDescription(item);
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
            ${descriptions.en || descriptions.translation ? `
              <div class="home-descriptions">
                ${descriptions.en ? `<p class="home-description home-description--en" lang="en">${escapeHTML(descriptions.en)}</p>` : ""}
                ${descriptions.translation ? `<p class="home-description home-description--translation" lang="${descriptions.translationLang}">${escapeHTML(descriptions.translation)}</p>` : ""}
              </div>
            ` : ""}
            <div class="home-actions">
              <button type="button" data-next-signal>NEXT WORK →</button>
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
        <section class="home-project-note" aria-labelledby="home-project-note-title">
          <div>
            <span class="eyebrow">PROJECT NOTE</span>
            <h2 id="home-project-note-title">A WORLD FORMED THROUGH 7,777 WORKS.</h2>
          </div>
          <div class="home-project-note__copy">
            <p>${escapeHTML(note.short)}</p>
            <a class="text-link" href="${routeHref("project", { note: true })}" data-route>READ THE FULL PROJECT NOTE →</a>
          </div>
        </section>
      </section>
    `;
  }

  function renderHomeMedia(item) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean(navigator.connection?.saveData);
    if (reduceMotion || saveData) {
      return `<img src="${immortalPoster(item)}" alt="${escapeHTML(item.publicTitle)}" width="500" height="500" fetchpriority="high" decoding="async">`;
    }
    return `
      <video
        src="${homePreviewVideo(item)}"
        poster="${immortalPoster(item)}"
        width="500"
        height="500"
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
            ${sectionHead("01", "PROTOCOL-7 / LEGENDS")}
            <div class="protocol-grid">
              ${visibleLegends.map(renderImmortalCard).join("")}
            </div>
          </section>
        ` : ""}

        <section class="section">
          ${sectionHead("02", "IMMORTALS 70")}
          ${renderImmortalFilters(visibleLegends.length + visibleWorks.length)}
          ${visibleWorks.length
            ? `<div class="immortals-grid">${visibleWorks.map(renderImmortalCard).join("")}</div>`
            : `<div class="empty-state">NO WORKS MATCH THE CURRENT FILTER.</div>`}
        </section>

        ${pageClosing(routeHref("originals"), "CONTINUE TO ORIGINAL 7700")}
      </section>
    `;
  }

  function renderImmortalFilters(visibleCount) {
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
          <span hidden data-immortal-count>${visibleCount}</span>
          <input
            type="search"
            value="${escapeHTML(state.immortalsQuery)}"
            placeholder="NUMBER / TITLE / ARCHETYPE"
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
              width="500"
              height="500"
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
    const descriptions = immortalBilingualDescription(item);
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
            <img src="${immortalPoster(item)}" alt="${escapeHTML(item.publicTitle)}" width="500" height="500" fetchpriority="high" decoding="async">
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
            ${descriptions.en || descriptions.translation ? `
              <div class="immortal-descriptions">
                ${descriptions.en ? `<p class="immortal-description immortal-description--en" lang="en">${escapeHTML(descriptions.en)}</p>` : ""}
                ${descriptions.translation ? `<p class="immortal-description immortal-description--translation" lang="${descriptions.translationLang}">${escapeHTML(descriptions.translation)}</p>` : ""}
              </div>
            ` : ""}
            ${linkedTrack ? renderLinkedTrack(linkedTrack) : ""}
          </div>
        </div>
      </section>
    `;
  }

  function renderLinkedTrack(track) {
    return `
      <div class="linked-track">
        <span class="micro-label">8-BIT TRACK / ${track.number}</span>
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
          ${sectionHead("01", "PACK ARCHIVES", "SELECT ONE OF SEVEN PACKS TO VIEW ITS 1,100 ORIGINAL WORKS.")}
          <div class="pack-wall">
            ${PACKS.map(renderPackCard).join("")}
          </div>
        </section>

        <section class="section">
          ${sectionHead("02", "DISCOVER 28")}
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
          <img src="${pack.cover}" alt="${pack.label} pack design" width="696" height="1012" loading="${index < 4 ? "eager" : "lazy"}" decoding="async">
        </div>
        <div class="pack-label">
          <span>${pack.label}</span>
          <span>${track ? `${track.number} / ${track.title}` : "1,100 WORKS"}</span>
        </div>
        <span class="pack-entry">VIEW 1,100 ORIGINAL WORKS →</span>
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
            <img src="${item.thumbUrl}" alt="${escapeHTML(item.label)}" width="320" height="320" loading="lazy" decoding="async" fetchpriority="low" data-media-label="${escapeHTML(item.label)}">
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
            <span>COMPLETE IMAGES / SELECT A WORK TO VIEW FULL SIZE</span>
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
          image.src = item.thumbUrl;
          image.width = 320;
          image.height = 320;
          image.alt = "";
          image.loading = "eager";
          image.decoding = "async";
          image.fetchPriority = index < start + layout.columns * 2 ? "high" : "auto";
          image.dataset.mediaLabel = item.label;
          link.appendChild(image);
          fragment.appendChild(link);
        }
        grid.replaceChildren(fragment);
        if (range) {
          range.textContent = localizedText(
            `VISIBLE ${start + 1}–${end} / 1,100`
          );
        }
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
            <img src="${item.url}" alt="${escapeHTML(item.label)}" width="500" height="500" fetchpriority="high" decoding="async" data-media-label="${escapeHTML(item.label)}">
          </div>
          <div class="detail-copy detail-copy--minimal">
            <span class="eyebrow">ORIGINAL / ${pack.label}</span>
            <h1>${escapeHTML(item.label)}</h1>
          </div>
        </div>
      </section>
    `;
  }

  function renderKia() {
    return `
      <section class="page">
        ${pageMast("03 / SPECIAL EXHIBITION", "K.I.A.", "After the drop, 3,850 Original images were replaced by a separate K.I.A. motion artwork. No work was burned or removed.", "3,850 SURVIVED / 3,850 K.I.A.", "kia-mast")}

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
              ${kiaFact("01", "ORIGINALS", "7,700 STATIC IMAGES BEFORE THE SPLIT")}
              ${kiaFact("02", "K.I.A.", "3,850 REPLACED BY MOTION")}
              ${kiaFact("03", "IMMORTALS 77", "EXCLUDED")}
            </div>
          </div>
        </section>

        <section class="section">
          <div class="credit-block">
            <h2>CREDITS / STATUS</h2>
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
        ${pageMast("04 / MATERIAL ARCHIVE", "VAULT", copy().vaultIntro, "RELEASE / STUDY / PROCESS / OBJECT", "mast-vault")}

        <section class="section">
          ${sectionHead("01", "RELEASE MATERIALS")}
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
              <p>Pack design used for the Immortals edition.</p>
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
              <p>Animated reward for collecting all seven archetypes, built from the seven-track list.</p>
            </article>
          </div>
        </section>

        <section class="section">
          ${sectionHead("02", "UNRELEASED IMAGE STUDIES")}
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
          ${sectionHead("03", "PROCESS / MOTION")}
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
        </section>

        <section class="section">
          ${sectionHead("04", "RELEASE IMAGES")}
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
          ${sectionHead("05", "PROJECT OBJECTS")}
          <article class="object-feature">
            <div class="object-feature__primary">
              <span class="eyebrow">PROJECT OBJECT / NFC</span>
              <h3>NFC KEYRING</h3>
              <figure class="object-feature__media">
                <img
                  src="media/nfc-keyring.webp"
                  alt="Black MOTTO 7777 NFC keyring"
                  width="960"
                  height="1280"
                  loading="lazy"
                  decoding="async"
                >
              </figure>
            </div>
            <div class="object-feature__record">
              <p>Links to the MOTTO 7777 archive.</p>
              <a class="text-link" href="https://www.youtube.com/watch?v=g9aN_rwTjtY" target="_blank" rel="noreferrer">VIEW RECORD ↗</a>
            </div>
          </article>
          <div class="object-ledger">
            ${objectRow("SHEMAGH", "LIMITED CIRCULATION")}
            ${objectRow("LEATHER GLOVES", "LIMITED CIRCULATION")}
            ${objectRow("MOTTO BAND T-SHIRT", "PRIVATE ARCHIVE")}
          </div>
        </section>

        <section class="section">
          ${sectionHead("06", "WORDMARK STUDIES")}
          <div class="identity-grid">
            ${identityFigure(assetPath("archive/Logo_motto_3.jpg"), "WORDMARK STUDY", "MOTTO wordmark study on a black field", 2732, 2048)}
            ${identityFigure(assetPath("archive/ani_motto.gif"), "ANIMATED MARK", "Animated MOTTO wordmark study on a black field", 2732, 2048)}
            ${identityFigure(assetPath("archive/motto_vhs.gif"), "VHS SIGNAL STUDY", "MOTTO wordmark distorted through a blue VHS signal", 794, 572)}
          </div>
        </section>

        ${pageClosing(routeHref("sound"), "CONTINUE TO SOUND")}
      </section>
    `;
  }

  function objectRow(title, status, url = "") {
    const statusNode = url
      ? `<a class="text-link" href="${url}" target="_blank" rel="noreferrer">${status}</a>`
      : `<span class="meta">${status}</span>`;
    return `
      <div class="object-row">
        <strong>${title}</strong>
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
          ${sectionHead("01", "MUSIC — MOTTO")}
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
              <nav class="release-platforms" aria-label="MOTTO album platforms">
                <div class="release-platforms__group">
                  <span class="release-platforms__label">LISTEN</span>
                  <div class="release-platforms__links">
                    <a class="text-link" href="https://open.spotify.com/album/2ZzpXvdQhDH4ttHATc52nT" target="_blank" rel="noreferrer">SPOTIFY ↗</a>
                    <a class="text-link" href="https://music.apple.com/kr/album/motto/1865145172" target="_blank" rel="noreferrer">APPLE MUSIC ↗</a>
                    <a class="text-link" href="https://music.youtube.com/playlist?list=OLAK5uy_mFKq6EuIV06COCZfgaRzHNqbpl4agdC8o" target="_blank" rel="noreferrer">YOUTUBE MUSIC ↗</a>
                    <a class="text-link" href="https://music.amazon.com/albums/B0GD7LDH79" target="_blank" rel="noreferrer">AMAZON MUSIC ↗</a>
                  </div>
                </div>
                <div class="release-platforms__group">
                  <span class="release-platforms__label">BUY</span>
                  <div class="release-platforms__links">
                    <a class="text-link" href="https://www.beatport.com/fr/release/motto/5761571" target="_blank" rel="noreferrer">BEATPORT ↗</a>
                  </div>
                </div>
              </nav>
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
          ${sectionHead("02", "7 TRACKS ↔ 7 ARCHETYPES", "Each track is paired with one archetype; its 8-bit version appears in the corresponding works in IMMORTALS 77.")}
          ${renderSevenChannelScore()}
        </section>

        <section class="section">
          ${sectionHead("03", "7777 (GET LO) VISUALIZER")}
          ${renderYouTubeFrame("Ec_WY5F9XUg", "7777 (GET LO) Visualizer", "media/get-lo-visualizer-poster.jpg")}
          <div class="film-credit">
            <span>MUSIC — MOTTO</span>
            <span>VISUALIZER — @CHEESEPIZZA</span>
            <a class="text-link" href="https://www.youtube.com/watch?v=Ec_WY5F9XUg" target="_blank" rel="noreferrer">YOUTUBE ↗</a>
          </div>
        </section>

        <section class="section">
          ${sectionHead("04", "STUDIO")}
          <div class="studio-document">
            <img
              src="${assetPath("archive/haz_gear_section_01.jpg")}"
              alt="Haz Haus studio equipment and MOTTO session environment"
              width="1508"
              height="1528"
              loading="lazy"
              decoding="async"
            >
            <div class="studio-document__copy">
              <span class="eyebrow">MOTTO SESSIONS</span>
              <h3>HAZ HAUS STUDIO</h3>
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

  function renderTrackPairMatrix() {
    return `
      <div class="pair-matrix" aria-label="Seven fixed track and archetype pairs">
        <div class="pair-matrix__head" aria-hidden="true">
          <span>CHANNEL</span>
          <span>TRACK</span>
          <span>ARCHETYPE</span>
        </div>
        ${TRACKS.map((track) => `
          <div class="pair-matrix__row">
            <span>${track.number}</span>
            <strong>${escapeHTML(track.title)}</strong>
            <span>${escapeHTML(track.archetype)}</span>
          </div>
        `).join("")}
        <p class="pair-matrix__note">8-BIT VERSIONS — HAZ HAUS / INTEGRATED INTO IMMORTALS 77</p>
      </div>
    `;
  }

  function renderProjectNote() {
    const note = projectNote();
    const groups = note.groups.map((group, index) => `
      <section class="project-note__group" aria-labelledby="project-note-group-${index + 1}">
        <h3 id="project-note-group-${index + 1}">${escapeHTML(group.label)}</h3>
        <div class="project-note__paragraphs">
          ${group.paragraphs.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
        </div>
        ${index === 1 ? renderTrackPairMatrix() : ""}
      </section>
    `).join("");

    return `
      <div class="project-note" id="project-note">
        <aside class="project-note__rail">
          <span class="eyebrow">ARTIST NOTE</span>
          <strong>A WORLD FORMED THROUGH 7,777 WORKS.</strong>
        </aside>
        <div class="project-note__body">${groups}</div>
      </div>
    `;
  }

  function renderProject() {
    const c = copy();
    return `
      <section class="page">
        ${pageMast("06 / PROJECT", "PROJECT", c.projectIntro, "SEAN WOONG + HAZ HAUS", "mast-project")}

        <section class="section">
          ${sectionHead("01", "MOTTO PROJECT TEASER")}
          ${renderYouTubeFrame("0j9Vhhuz5PA", "MOTTO 7777 Project Teaser", "media/project-teaser-poster.jpg")}
          <div class="film-credit">
            <span>FILM — SEAN WOONG</span>
            <span>3D MOTORCYCLE FOOTAGE — @CHEESEPIZZA</span>
            <span>SOUND — HAZ HAUS</span>
            <a class="text-link" href="https://www.youtube.com/watch?v=0j9Vhhuz5PA" target="_blank" rel="noreferrer">YOUTUBE ↗</a>
          </div>
        </section>

        <section class="section">
          ${sectionHead("02", "PROJECT NOTE")}
          ${renderProjectNote()}
        </section>

        <section class="section">
          ${sectionHead("03", "THE 7,777 SYSTEM")}
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
          ${sectionHead("04", "RELEASE HISTORY")}
          <div class="project-history project-history--single">
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
          </div>
        </section>

        <section class="section">
          ${sectionHead("05", "AUTHORSHIP")}
          <div class="author-records">
            <article class="author-record">
              <div class="author-record__identity">
                <span class="eyebrow">WORLD BUILDING / VISUAL DIRECTION</span>
                <h2>SEAN<br>WOONG</h2>
                <span class="author-record__alias">VOICE CREDIT — OO.SEAN</span>
              </div>
              <div class="author-record__body">
                <p class="author-record__contribution">Co-developed the world of MOTTO 7777 and directed its complete visual system: the 7,777 works, animation, pack and release imagery, K.I.A. visual and motion, UT02, project objects, teaser film and edit, and this website.</p>
                <p class="author-record__bio">Sean Woong is a Seoul-based multimedia artist and tattooist working across digital illustration, animation, moving image, object design, and the web.</p>
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
                <p class="author-record__bio">Haz Haus is an electronic music producer working across K-pop and electronic music.</p>
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
            <h2>INQUIRIES</h2>
            <div class="inquiry-list">
              <span>EXHIBITION</span>
              <span>COLLABORATION / COMMISSION</span>
              <span>LICENSING</span>
              <span>PRESS / RESEARCH</span>
              <a class="text-link" href="mailto:motto7777hq@gmail.com">EMAIL / MOTTO7777HQ@GMAIL.COM ↗</a>
              <a class="text-link" href="https://www.instagram.com/mottttooooooo/" target="_blank" rel="noreferrer">CONTACT VIA INSTAGRAM ↗</a>
            </div>
            <p class="rights-note">© 2024—2026 MOTTO 7777.</p>
          </div>
        </section>
      </section>
    `;
  }

  function pageMast(kicker, title, description = "", data, className = "") {
    return `
      <header class="page-mast ${className}">
        <div>
          <span class="page-kicker">${kicker}</span>
          <h1>${title}</h1>
        </div>
        <div class="page-mast__copy">
          <strong>${data}</strong>
          ${description ? `<span>${escapeHTML(description)}</span>` : ""}
        </div>
      </header>
    `;
  }

  function sectionHead(index, title, description = "") {
    return `
      <header class="section-head${description ? "" : " section-head--bare"}">
        <span class="section-index">${index}</span>
        <h2>${title}</h2>
        ${description ? `<p>${description}</p>` : ""}
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

  function bindPage(route) {
    document.querySelector("[data-next-signal]")?.addEventListener("click", () => {
      state.homeIndex = (state.homeIndex + 1) % state.homePool.length;
      render({ preserveScroll: true, preserveFocus: "home-next" });
      announce("A new selected Immortal is now shown.");
    });

    document.querySelectorAll("[data-immortal-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        state.immortalsFilter = button.dataset.immortalFilter || "all";
        render({
          preserveScroll: true,
          preserveFocus: `immortal-filter:${state.immortalsFilter}`
        });
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
      render({ preserveScroll: true, preserveFocus: "originals-reshuffle" });
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
      button.textContent = localizedText("LOADING MOTION");
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
        button.textContent = localizedText("RETRY FULL MOTION");
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
        kiaPlay.textContent = localizedText(kiaVideo.paused ? "PLAY" : "PAUSE");
        kiaSound.textContent = localizedText(kiaVideo.muted ? "SOUND ON" : "SOUND OFF");
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
        fallback.textContent = `${image.dataset.mediaLabel || image.alt || "MEDIA"} / ${localizedText("PREVIEW UNAVAILABLE")}`;
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
        fallback.textContent = `${label.toUpperCase()} / ${localizedText("MOTION UNAVAILABLE")}`;
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
      visualMeta.textContent = localizedText(
        `${track.archetype} PACK / 1,100 ORIGINALS`
      );
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
      if (action) {
        action.textContent = localizedText(
          active && !audio.paused ? "PAUSE" : "PLAY"
        );
      }
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
      const statusText = errorText && hasActiveAudio
        ? "PLAYBACK UNAVAILABLE"
        : hasActiveAudio
          ? `${modeLabel} / ${audio.paused ? "READY" : "PLAYING"}`
          : `CHANNEL ${scoreTrack.number} / READY`;
      scoreMode.textContent = localizedText(statusText);
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
      button.addEventListener("click", async () => {
        const nextLanguage = button.dataset.lang || "en";
        if (nextLanguage === state.lang) return;
        state.lang = nextLanguage;
        safeStorageSet("motto-v2-lang", state.lang);
        await render({ preserveScroll: true });
        announce(languageValue(
          "The interface is now shown in English.",
          "한국어 화면으로 전환했습니다.",
          "日本語表示に切り替えました。"
        ));
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
    cursor.classList.add("is-native");

    const artworkSelector = [
      ".home-art",
      ".detail-media",
      ".artifact-media",
      "[data-kia-video]"
    ].join(", ");

    const updateCursorMode = (target) => {
      const artwork = target instanceof Element ? target.closest(artworkSelector) : null;
      const nativeControl = target instanceof Element
        ? target.closest("input, textarea, select, audio, video[controls], button, [contenteditable]")
        : null;
      const showArtworkCursor = Boolean(artwork && !nativeControl);
      const opensArtwork = showArtworkCursor && Boolean(target.closest("a"));

      cursor.classList.toggle("is-native", !showArtworkCursor);
      cursor.classList.toggle("is-active", opensArtwork);
    };

    window.addEventListener("pointermove", (event) => {
      document.body.classList.add("cursor-ready");
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      updateCursorMode(event.target);
    }, { passive: true });

    document.addEventListener("pointerover", (event) => {
      updateCursorMode(event.target);
    });

    document.documentElement.addEventListener("pointerleave", () => {
      cursor.classList.add("is-native");
      cursor.classList.remove("is-active");
    });
  }

  history.scrollRestoration = "manual";
  setupGlobalEvents();
  render();
})();
