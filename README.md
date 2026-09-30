# MOTTO 7777

Sean Woong과 Haz Haus의 오디오비주얼 전시·아카이브. 7,777개 작품과 음악, K.I.A., 제작 기록을 연결합니다.

## 현재 사이트 구조

- `index.html` → **최신 발매/프로젝트 메인**. 현재는 「난 모르겠어」 싱글입니다. 앞으로도 새로운 프로젝트를 먼저 보여줍니다.
- `archive.html` → **MOTTO 7777 아카이브**. `/archive.html?view=vault`처럼 섹션을 엽니다.
- `app.js` → 아카이브 편집용 소스. HTML이 직접 읽는 파일은 별도의 릴리스 사본입니다.
- `archive.html`의 마지막 `<script src>` → 실제 사용되는 릴리스 파일. 이번 로컬 수정본은 `app.20260930-entry.js`입니다. 이전 공개 파일은 `app.20260815d.js`였습니다.
- `styles.css`, `media/`, `assets/` → 아카이브 스타일과 미디어·데이터.
- `v2/` → 과거 개발 프리뷰. 현재 배포본의 수정 대상으로 사용하지 않습니다.
- `js/app.js`, `css/style.css`, `music.html` → 이전 인터페이스/호환 파일. 현재 아카이브가 읽는 파일과 구분합니다.

**로컬 수정 완료는 배포 완료를 뜻하지 않습니다.** 현재 변경·검증·배포 절차는 [관리 문서](docs/production-maintenance.md)에 기록합니다.

## 로컬 실행

```bash
python3 -m http.server 8000
```

- 최신 프로젝트: `http://localhost:8000/`
- 아카이브: `http://localhost:8000/archive.html`
- 섹션: `?view=home`, `immortals`, `originals`, `vault`, `sound`, `project`, `kia`
- Immortal 상세: `/archive.html?view=immortals&work=legend-boxer`
- Original 팩/상세: `/archive.html?view=originals&pack=military&work=1`

정적 HTML/CSS/JavaScript 사이트이며 패키지 빌드는 필요 없습니다. JSON 로딩 때문에 파일을 직접 여는 대신 HTTP 서버를 사용합니다.

## 콘텐츠와 자료

- `assets/data/immortals.json`: 77개 작품의 원본 메타데이터.
- `assets/data/collection.json`: 7개 팩 × 1,100개 Original의 정확한 소스 번호. 연속 번호로 재생성하지 않습니다.
- `media/immortals-posters/`, `media/immortals-motion/`: 아카이브 포스터/재생 영상.
- `media/controlled-motion/`: GIF에서 만든 정지 포스터와 제어 가능한 영상. 원본 GIF는 보존합니다.
- Original 원본/썸네일: `https://assets.motto7777.com/collection/`.
- 실물 자료 추가 요청: [남은 입력 자료](docs/v2-final-inputs.md).
- 크레딧·전시 원칙: [AGENTS.md](AGENTS.md).

`immortals/`, `originals/`, `vault/`, `sound/`, `project/`, `kia/`, `works/`의 HTML은 검색·공유용 메타데이터와 아카이브 이동을 제공합니다. `scripts/build_v2_seo_routes.py`는 과거 V2 전용 생성기이므로 현재 공개 경로에 결과를 그대로 덮어쓰지 않습니다.

## 보조 도구

- `scripts/build_collection_manifest.py`: R2 파일 기준 컬렉션 매니페스트 생성.
- `scripts/build_archive_manifest.py`, `scripts/check_archive.py`: 이전 아카이브 파일 매니페스트 생성·검사.
- `scripts/qa_v2.mjs`: 과거 V2 검증 도구. 현재 사이트와 문구가 다를 수 있어 그대로 합격 기준으로 쓰지 않습니다.

외부 링크와 현재 아카이브 문구는 `app.js`와 `archive.html`에서 관리합니다. `js/site-config.js`는 이전 인터페이스 설정입니다.
