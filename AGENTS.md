# MOTTO 7777 Working Rules

## Product goal

MOTTO 7777 is an artist-authored audiovisual exhibition and archive. It is not an active NFT storefront, a generic portfolio, or a raw file dump.

The public experience should prioritize:

1. memorable artwork;
2. legible archive structure;
3. proof of authorship and process;
4. a quiet path to exhibition, collaboration, licensing, and press inquiries.

## Production structure

- `/` presents the newest release/project. Preserve this editorial priority.
- `/archive.html` is the MOTTO 7777 archive home and canonical; archive maintenance must not replace the newest-project landing page.
- Edit `app.js` as the archive source, then create the release snapshot referenced by `archive.html`. See `docs/production-maintenance.md`.

## V2 boundary

- Build V2 inside `v2/` until the user approves the complete connected preview.
- Do not overwrite the current root interface or deploy V2 before that approval.
- Reuse verified content, metadata, R2 collection data, audio, and existing media.
- The old visual shell, page layout, navigation, and global player do not need to be preserved.
- Never revert or overwrite unrelated user changes in the existing dirty worktree.

## Information and credit rules

- Total: 7,777 works = 7,700 Originals + 77 Immortals.
- Immortals: 70 Immortals + 7 Legends / Protocol-7.
- Originals: seven packs with exactly 1,100 works each.
- The K.I.A. event split the 7,700 Originals into 3,850 survived and 3,850 K.I.A.; Immortals were excluded.
- Use `MILITARY` as the public pack name and `Soldier` in official work titles.
- Use `MOTORCYCLE` as the public pack name and `Motto` in official work titles.
- Visual art, animation, pack/release images, K.I.A. visual/motion, UT02, project teaser film, and web: Sean Woong.
- Music: MOTTO. Album, 8-bit, and K.I.A. sound production: Haz Haus.
- Project teaser sound: Haz Haus.
- `7777 (GET LO)` visualizer: @cheesepizza. Selected 3D motorcycle footage by @cheesepizza is also used in the project teaser; the teaser film and edit remain Sean Woong’s credit.
- Crypto.com is the historical release platform, not a creative credit.
- Do not invent descriptions, dates, roles, BPM, key, traits, rarity, or technical metadata.
- Shared dates and credits appear at section level instead of repeating on every card.

## Design system

- The artwork supplies almost all color. The interface is a quiet black editorial frame.
- Use warm off-white text, neutral gray metadata, one restrained cyan interaction accent, and magenta only inside K.I.A.
- Use space and thin rules instead of rounded cards, glass panels, glow borders, or shadows.
- Use a clean grotesk for statements and a restrained mono face for labels and data.
- The artist approved a dismissible, approximately 3-second archive introduction on first visit only (2026-09-30), localized to EN/KO/JA. Remember dismissal/first viewing for later visits.
- No other forced intro, continuous glitch, autoplay, persistent global player, marketplace emphasis, prices, downloads, or floating close button.
- Finished artworks and pack designs use `object-fit: contain`; documentary footage may use `cover` only when the crop is harmless.
- Detail views use a visible in-flow Back action, browser Back, and Escape.
- The custom cursor must remain small, precise, optional, and above overlays; native cursor remains on touch devices.

## Density by role

- HOME: one dominant work and maximum negative space.
- IMMORTALS: medium-density exhibition grid.
- ORIGINAL pack covers: all seven shown together as a complete uncropped chapter system; avoid oversized single-card treatment.
- DISCOVER: medium grid with four works from each archetype.
- Pack archive: micro contact sheet showing complete images, 10–12 columns on wide screens, 7 on tablet, 4 on mobile, with virtualization.
- Detail: one large uncropped work.
- K.I.A.: one focused motion work.
- VAULT: editorial alternation of selected process, artifact, object, and identity records.
- SOUND: disciplined track list with one active player.
- PROJECT: calm long-form case study.

## Implementation and review

- Use real project media in all meaningful previews.
- Load posters first and full motion only after selection.
- Never request all 77 master videos or all 7,700 images at once.
- Preserve exact Original source-number arrays from `assets/data/collection.json`.
- Keep public page controls visible without hover and keyboard accessible.
- Respect reduced motion and keep touch behavior complete.
- Validate at wide desktop, tablet, and approximately 390 px mobile widths.
- Before user review, check: page role, artwork hierarchy, density, rhythm, copy accuracy, keyboard/touch behavior, media failure states, mobile overflow, and performance.
- The user approves global direction and the connected preview; do not make them micromanage every element.

## Source documents

- `docs/site-blueprint.md`
- `docs/page-blueprints-phase-2.md`
- `docs/visual-style-system.md`
- `docs/content-inventory.md`
- `docs/reference-audit-v2.md`
