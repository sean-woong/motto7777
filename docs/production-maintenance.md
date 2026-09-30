# Production maintenance

## Ownership and URL policy

`/` is the newest release/project landing page, not the archive home. Do not replace it during archive maintenance. `/archive.html` is the archive home. Clean section/work entry pages provide static social metadata and redirect directly to `archive.html` with query parameters. The sitemap includes both the latest-project root and the archive.

## Source and release

1. Inspect `git status`; preserve unrelated work.
2. Edit archive behavior in root `app.js`, styles in `styles.css`, shell in `archive.html`.
3. Copy `app.js` and `styles.css` to new versioned release files; update the archive shell script reference. The current local revision uses `app.20260930.js` and `styles.20260930.css`. It includes the prior motion fixes.
4. Verify `app.js` and the referenced release snapshot are byte-identical. Historical release files are retained unchanged. Changing only `app.js` does not update the served app.
5. Preview through a local HTTP server. Check 1440px, 768px, 390px, keyboard and touch, first-click playback, pause/resume, media failure/retry, reduced motion and route changes.
6. Publish only the reviewed archive changes and required media using the established deployment workflow. Deployment authorized by the artist on 2026-09-30. No credentials belong in the repository.
7. Verify public HTML references the new release and CSS version; test canonical URLs and first-play behavior on the public site. Local verification is not proof of publication.

The current public release was `app.20260815d.js` when this maintenance pass began. `v2/`, `js/app.js`, and `css/style.css` are separate historical implementations. Do not copy them over the current archive.

## Motion assets

`media/controlled-motion/` contains MP4/WebP derivatives of the existing UT02, animated mark, VHS signal, and album profile GIFs. Original files remain the source of truth. Playback is requested explicitly; GIF hover previews have been removed because they cannot be paused. Video posters load first, only selected motion loads. Native controls become available after first selection for home/process videos; short GIF-derived loops use the explicit play/pause button to keep controls legible on small screens; visible buttons remain available for play/pause/retry. New playback pauses other local media. Hidden documents and enabling reduced motion pause video without automatic resume.

Maintain exact source dimensions and frame timing when regenerating derivatives. Any encoded frame-timing difference must be checked; do not invent artwork metadata.

## Confirmed credits and pending material

The artist confirmed @cheesepizza authored the GET LO visualizer and the selected motorcycle clip used in the project teaser. Sean Woong retains teaser film/edit credit; Haz Haus retains teaser sound credit. Existing public credits should remain.

Public email and EN/KO/JA are already visible. Japanese editorial sign-off and external service/access status are not inferred from old launch notes. Received 2026-09-27: leather gloves (one photograph) and shemagh (two wearing photographs), integrated locally without cropping. The MOTTO band T-shirt video has also been supplied and integrated. No required object record remains empty. Original and web-delivery files are mapped in `source-media/objects/manifest.json`; Downloads is not a runtime dependency.

## Local verification for this revision

`python3 scripts/qa_archive_motion.py` starts a temporary localhost server and uses installed Python Playwright plus Chrome. It covers all eight controlled players at 1440/768/390px (keyboard and touch), initial poster-only loading, play/pause/resume, reduced-motion changes, single-active playback, VHS looping, failed media retry, canonical/entry routes and preservation of the latest-project root. GIF-derived videos preserve source dimensions and frame counts; measured duration differences from encoding are below 7ms per cycle. This is local Chromium verification, not an iOS Safari or public deployment test.

## Release scope — 2026-09-30

Publish the reviewed archive source, fingerprinted JS/CSS, archive shell, static route metadata, sitemap and web media under `media/controlled-motion/` and `media/vault-objects/`. Keep the latest-project `index.html` unchanged. Raw object sources in `source-media/objects/` remain locally preserved and are not required for public delivery. Earlier unshipped snapshots and unrelated worktree changes are excluded.
