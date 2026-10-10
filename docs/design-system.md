# MANI-GANTE · Design system v3

Componentes del sitio documentados para pasarlos tal cual a **Storybook (CSF) o MDX**. Cada ficha incluye:
- **Anatomía**: el HTML mínimo;
- **Variantes**;
- **Estados**;
- **Tokens** que consume;
- **A11y**: el contrato de accesibilidad.

Fuente de los tokens: `design/tokens.json` → `css/tokens.css`. Los componentes están en `css/styles.css`, y el panel en `css/admin.css`.

> Regla: ningún componente usa colores, sombras ni duraciones literales nuevas. Todo pasa por `var(--…)`.

## Tokens base

| Capa | Ejemplos |
|---|---|
| Primitivos | `--primitive-space-1…10` (4 → 128, grilla de 8 pt) · `--primitive-font-size-xs…hero` · `--primitive-leading-tight/snug/normal` · `--primitive-tracking-display/heading/body/label` · `--primitive-radius-sm…full` · `--primitive-elevation-1…4` · `--primitive-duration-instant/fast/normal/slow` · `--primitive-easing-out/in-out/back` · `--primitive-z-*` |
| Semánticos | `--color-background`, `--color-foreground`, `--color-primary*`, `--color-kraft*`, `--color-surface*`, `--color-muted*`, `--color-status-good/warning/critical`, `--color-chart-mark`, `--color-ring`, `--color-grain-opacity`, `--elevation-card/raised/overlay/modal` |
| Modo oscuro | Los mismos nombres, redefinidos en `[data-theme="dark"]` y en `prefers-color-scheme: dark` (con sus propios valores, no invertidos) |

Capas z: nav 50 · fab 60 · scrim 70 · drawer 75 · agente 80 · grano 200 · toast 260.

---

## Button · `.btn`
- **Anatomía:** `<button class="btn btn-gold"><svg class="i">…</svg> Texto</button>`
- **Variantes:**
  - `btn-gold` (CTA principal, una por vista);
  - `btn-ink`;
  - `btn-paper`;
  - `btn-ghost` y `btn-ghost-dark`;
  - `btn-glass` (sobre fotos);
  - `btn-wa` (solo para acciones de WhatsApp).
- **Tamaños y modificadores:** `btn-lg` y `btn-block`.
- **Estados:** hover (sube con `--elevation-raised`), active (vuelve a su lugar), `:focus-visible` (anillo `--color-ring` de 3 px con offset), `disabled` o `aria-disabled`.
- **A11y:** alto mínimo de 44 px; si solo tiene ícono, lleva `aria-label`.

## Chip / Filter · `.chip`, `.filter`
- **Anatomía:** `<button class="filter" aria-pressed="false">Disponibles</button>` dentro de `.filters`. Los filtros se envuelven en `.shop-bar`, que es sticky bajo el nav.
- **Estados:** `aria-pressed="true"` (relleno espresso o oro), con contador opcional.
- **A11y:** botones de alternar con `aria-pressed`, nunca con color solo.

## Product card · `.card`
- **Anatomía:** `.card[data-tilt]` > `.card-art` (bolsa generativa de `art.mjs` + `.paper-sheen`) + info + `.card-foot` (precio, stepper `[data-inc]/[data-dec]`).
- **Variantes:**
  - `.badge` con los tipos "Top", "Nuevo" y "Agotado";
  - agotada: en lugar del stepper muestra el botón "Avísame".
- **Estados:**
  - tilt 3D con las variables `--rx/--ry/--gx/--gy`, solo con puntero fino y sin reducir movimiento;
  - el catálogo pinta al instante desde `catalog.mjs` (no necesita skeleton); la tarjeta "Estado en vivo" del hero usa `.skeleton` + `aria-busy` mientras llega el stock;
  - estado vacío: `.empty` con una bolsa `.empty-bag` y el texto de `VOICE.emptySearch`.
- **Tokens:** `--elevation-card` → `--elevation-raised` al hover; `--color-kraft*`; `--primitive-radius-lg`.

## Quick view · `.quick-*`
- **Anatomía:**
  - `dialog` > `.quick-grid`;
  - `.quick-media` contiene `.quick-photo`, `.quick-art` y `.media-toggle`;
  - `.quick-info` contiene `.quick-status`, formatos, `.quick-buy`, `.quick-notes`, alérgenos y `.quick-ctas`.
- **A11y:** `<dialog>` nativo con foco inicial en el título y `Esc` para cerrar. El toggle de foto/ilustración usa `aria-pressed`.

## Boleta (drawer) · `.drawer`
- **Anatomía:** `.drawer-head`, `.drawer-promo` (cinta de viernes), `.drawer-body` (líneas + `.upsell`), `.drawer-foot` (`.pay-pick`, total, CTA de WhatsApp) y `.drawer-links` (compartir e historial).
- **A11y:** `role="dialog"` + `aria-modal`; `trapFocus()` de `js/ui.mjs`; el resto de la página queda `inert`; al cerrar, el foco vuelve al disparador.

## Ticket de reserva · `.ticket`
- **Anatomía:** `.ticket-head`, `.ticket-main` (formulario + `#rfLive`, resumen en vivo con `aria-live="polite"`) y `.ticket-stub` (código y código de barras).
- **Subcomponentes:**
  - `.slot-picker` > `.slot` (radio con `small` "quedan N"; deshabilitado si está lleno);
  - `.pay-pick` (radios de medio de pago).
- **Post-reserva:** descarga de PNG, `.ics` y Google Calendar, más `stampMoment()`.

## Toast · `.toast`
- **API:** `toast(text, { tone: "success"|"info"|"alert"|"error", color, action: { label, onClick } })` en `js/ui.mjs`.
- **Textos:** siempre desde `js/voice.mjs`.
- **A11y:** `role="status"` (en `error` usa `alert`); en móvil aparece arriba para no tapar la boleta.

## Banners · `.promo-ribbon`, `.away-banner`
- La cinta del viernes solo aparece si `fridayPromo().active`.
- El banner de "Jorge no está" lo controla `/api/status` (`campus.away`).
- Ambos llevan ícono + texto: el estado nunca se comunica solo con color.

## Stamp moment · `.stamp-moment`
- `stampMoment(target, text)` muestra el sello "Hecho a mano" sobre un elemento por un instante. Con reducir movimiento no se muestra.

## Historial · `.history-*`
- `dialog#historyDlg` > `.history-list` > `.history-item` (`.history-top` + `.history-actions`: repetir, ya pagué, recibido, borrar).

## UGC · `.ugc`
- `.ugc-track` con scroll horizontal y snap; `.ugc-card` (foto, nombre, texto). Solo contenido curado desde el panel.

## Panel (admin) · `css/admin.css`
- KPIs como stat tiles (`.a-kpi`).
- Gráficos SVG de columnas:
  - un solo eje, ticks enteros, tooltip al hover y botón "Ver tabla";
  - dorado de gráficos validado para daltonismo (`--color-chart-mark`).
- Web Vitals con ícono + etiqueta (Bien / Mejorable / Mal), según `--color-status-*`.

---

## Llevarlo a Storybook

1. `npx storybook@latest init --type html`.
2. En `.storybook/preview.js`, importa `../css/tokens.css`, `../css/fonts.css` y `../css/styles.css`. Agrega un decorator que cambie `data-theme`.
3. Escribe una historia por ficha usando la anatomía de arriba como `render`. Usa los textos de `js/voice.mjs` como args.
4. Agrega `@storybook/addon-a11y`: los mismos chequeos axe que ya corren en `tests/a11y.spec.mjs`.
