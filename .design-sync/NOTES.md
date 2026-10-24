# design-sync notes — mariaeugenia-ui

- The repo is an Astro site, not a component library. The design system is the React port in `design-system/` (standalone npm package, own lockfile; not an npm workspace, so it never touches the Astro build). Build: `cd design-system && npm ci && npm run build`.
- `design-system/dist/styles.css` = `public/brand.css` + `design-system/src/styles.css`, concatenated at build time, so the kit tokens have a single source (`public/brand.css`). Kit classes are unprefixed (from brand.css); site-pattern classes are prefixed `me-`.
- Converter run: `--node-modules design-system/node_modules --entry ./design-system/dist/index.js`. `cssEntry` is package-relative (`dist/styles.css`).
- Groups come from category stubs in `.design-sync/groups/*.md` via `docsMap` (Kit / Sitio / Interactivo).
- `BombillasIdeas` engine (`design-system/src/components/bombillas-engine.ts`) is GENERATED from the `<script>` in `src/components/BombillasIdeas.astro` by a string-replacement port (lookups via `data-el`, cleanup, `autoplay`/`initialProgress`). Its CSS is the Astro `<style>` prefixed with `.me-bombillas`.
- Playwright: the cached browser is chromium-1223 → `playwright@1.60.0` in `.ds-sync/`.
- Fonts come from Google Fonts via a remote `@import` in brand.css (`[FONT_REMOTE]`, expected).

## Known render warns
- None open. (`TextoOro` uses `cardMode: column` after `[GRID_OVERFLOW]`.)

## Re-sync risks
- **Duplication with the Astro site**: the React components are ports of `src/layouts/Base.astro`, `src/pages/index.astro`, `src/pages/transversales/*.astro` and `src/components/BombillasIdeas.astro`. Any change to those `.astro` files (markup or scoped `<style>`) does NOT reach the package until it's mirrored in `design-system/src/`. Diff them on every re-sync.
- `bombillas-engine.ts` must be regenerated (or hand-merged) when the Astro script changes; the port script expects exact counts of `getElementById`, `setTimeout` (3) and `requestAnimationFrame(frame)` (3).
- `.btn-borde` uses `--color-text` (theme-dependent): invisible on `panel-noche` in light mode. Documented in conventions.md. The kit has no disabled button style.
- `ArticleCard` preview loads the thumbnail from the live site (https://mariaeugenia-alvarez.github.io/img/...).
