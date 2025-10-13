# MOTTO MAX Inline Archive Notes

## Spotlight Controls & Knobs
- `MottoArchive.toggleSpotlight()`
- `MottoArchive.setSpotlight(true | false)`
- Spotlight is OFF by default; re-enable for demos via the helpers above.
- Spotlight automatically disables on coarse pointers or when `prefers-reduced-motion` is enabled.
- CSS knobs (`css/style.css` → `.archive-grid`):
  - `--spotlight-radius` (default `clamp(160px, 22vmin, 240px)`)
  - `--spotlight-feather` (soft edge, default `0.22`)
  - `--spotlight-intensity`, `--spotlight-secondary-intensity`
- JS tuning: `SPOTLIGHT_STATE` + `applySpotlightStyle` (lines ~672–740) control lerp, offsets, and intensity scaling during transitions.

## Focus / Dim & Glow Knobs
- CSS (`css/style.css`):
  - `--focus-scale` (default `1.20`)
  - `--dim-scale` (default `0.90`)
  - `--dim-saturate` (default `0.85`)
  - `--dim-blur` (default `2px`)
  - Glow blur strengths noted in the `.cell` box-shadow comments (~1515 / ~1535).
- JS (`js.app.js`): `setCellAccent` mix ratios (accent alpha / mix percentages) around line ~2148.
- View-transition wrapper `runArchiveTransition` (lines ~2416–2442) sets `.is-animating`, easing `cubic-bezier(.2,.7,.2,1)` and a 420 ms settle timeout.

## Keyboard / Navigation
- `ArrowLeft` / `ArrowRight` cycle inline focus.
- `Escape` collapses focus; when no tile is focused, `Escape` closes the archive modal.

## Hash Deep-Link
- `#archive:<id>` focuses a tile inline (id comes from manifest key).
- `#archive` keeps the modal open without an active tile.

## Layout Rhythm & Grid
- CSS rhythm (`css/style.css`): `.archive-grid:not(.has-active)` `nth-child` rules for hero/variation (lines ~1450 onwards).
- Grid width uses `repeat(auto-fit, minmax(260px, 1fr))` for full-width coverage.

## Inline Expand Behaviour
- JS (`js/app.js`): `openArchiveDetail` / `closeArchiveDetail` manage inline expansion & hash updates.
- Hover scrub throttled via `ARCHIVE_IS_ANIMATING` inside `setupVideoHoverScrub`.
- `.archive-grid.is-animating` temporarily softens glow during transitions.

