# Conventions — mariaeugenia-ui (kit de marca Maria Eugenia Álvarez)

Personal-brand system for a Spanish-language site about AI engineering. Write all UI copy in **Spanish**. Tone: calm, editorial, warm paper and ink — not a SaaS dashboard.

## Setup
No provider is needed. `styles.css` defines every token on `:root` plus the kit classes, and loads Newsreader, Geist and Geist Mono from Google Fonts. Body text, `h1`–`h4`, links and `code` are styled globally, so plain semantic HTML already looks on-brand. Dark mode follows the OS; force it with `data-theme="dark"` (or `"light"`) on `<html>`.

## Styling idiom: CSS custom properties, plus a small set of kit classes
Use `var(--*)` for layout glue. Never invent hex colours.
- **Semantic colours** (switch with the theme): `--color-bg`, `--color-surface`, `--color-text`, `--color-text-secondary`, `--color-brand`, `--color-link`, `--color-accent`, `--color-action`, `--color-on-action`, `--color-label`, `--color-border`.
- **Fixed palette**: `--papel` `--tinta` `--noche` `--terracota` `--terracota-texto` `--oro` `--oro-viejo` `--arena` `--oliva` `--oliva-clara`. Gradients: `--grad-campo`, `--oro-metalico`.
- **Type**: `--font-titulos` (Newsreader, headings), `--font-cuerpo` (Geist, body), `--font-mono` (Geist Mono, labels/data). Sizes: `--fs-h1`…`--fs-h4`, `--fs-body-lg`, `--fs-body`, `--fs-label`. Weights are only 400 and 500.
- **Space**: `--space-1 2 3 4 6 8 12 16` (4 px scale). **Radius**: `--radius-sm` (8 px), `--radius-md` (12 px).
- **Classes**, when not using the components: `label`, `destacado`, `texto-oro`, `dato`, `btn btn-primario|btn-oro|btn-borde`, `bloque-arena`, `bloque-terracota`, `seccion-campo`, `tarjeta`, `panel-noche`, `container`, `prose`.

## Components (`window.MariaEugeniaUI`)
- **Kit**: `Label`, `Destacado`, `TextoOro`, `Dato`, `Button`, `Surface`.
- **Sitio**: `Container`, `Prose`, `SiteHeader`, `SiteFooter`, `Hero`, `LatestPost`, `FeatureSteps`, `ArticleCard`, `PostHeader`.
- **Interactivo**: `BombillasIdeas`.

Read each `components/<grupo>/<Name>/<Name>.prompt.md` and `.d.ts` before use.

## Brand rules that break silently
- `Button variant="borde"` takes the page text colour, so it is invisible on `Surface variant="noche"` in light mode. On dark panels use `variant="oro"`.
- `Surface variant="terracota"` only holds text 24 px or larger. `TextoOro` is only for large text or on `noche`/`campo`.
- `Label` turns oro on `Surface variant="campo"`. Keep it in the top (dark oliva) half of the gradient.
- Highlight 1–2 words in a headline with `<Destacado>`, never a whole sentence.
- `BombillasIdeas` animates on its own. Inside cards or narrow columns pass `bleed={false}`; to show a fixed state, use `autoplay={false} initialProgress={0–100}`.

## Example
```jsx
const { SiteHeader, Hero, Destacado, FeatureSteps, Surface, Label } = window.MariaEugeniaUI;
<>
  <SiteHeader name="Maria Eugenia" links={[{ href: '/', label: 'Inicio', current: true }, { href: '/transversales/', label: 'Transversales' }]} />
  <Hero label="Ingeniera de IA"
    title={<>Saber <Destacado>cuándo</Destacado> usar IA es mi trabajo.</>}
    bio="Implemento sistemas de IA con desarrollo propio o integrando herramientas de terceros."
    cta={{ href: '/transversales/', label: 'Leer el último artículo' }} />
  <div className="container" style={{ display: 'grid', gap: 'var(--space-6)' }}>
    <Surface variant="arena" padding={6}><Label>Nota</Label><p>Lo que no se mide no se puede controlar.</p></Surface>
  </div>
</>
```
