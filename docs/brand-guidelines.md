# MANI-GANTE · Guía de marca v3.0

> Última actualización: 2026-10-09 · Estado: activa
> Dirección: **"Premium artesanal"**: lujo cálido y oscuro (espresso + oro) con materiales reales del producto (papel kraft, sello, tinta del elefante).

## Referencia rápida

| Elemento | Valor |
|---------|-------|
| Color principal | Espresso #140D08 |
| Color secundario | Kraft #C9A470 |
| Acento | Oro miel #C8963E |
| Fuente titulares | Fraunces (serif suave, óptica variable) |
| Fuente cuerpo | Manrope |
| Fuente manuscrita | Caveat (solo notas de Jorge, máx. 1 por sección) |
| Voz | Cercana, orgullosa del oficio, con humor de campus |

---

## 1. Paleta de color

Extraída del logo (pergamino y tinta del elefante) y de las fotos reales del empaque (kraft).

### Primary Colors (principales)

| Nombre | Hex | Uso |
|------|-----|-------|
| Espresso | #140D08 | Fondos oscuros, hero, historia, footer |
| Tinta | #1D140D | Texto principal en modo claro |
| Oro miel | #C8963E | CTAs, acentos, cursivas destacadas |
| Oro claro | #E2B765 | Acentos sobre fondos oscuros |

### Secondary Colors (materiales)

| Nombre | Hex | Uso |
|------|-----|-------|
| Kraft | #C9A470 | Etiquetas, tarjetas tipo bolsa, texturas |
| Kraft claro | #E5CEB3 | Superficies de "papel" |
| Pergamino | #F6EEDC | Fondo de la página (modo claro) |
| Elefante | #5F6467 | Detalles gráficos e ilustración |
| Arcilla | #B5651D | Sellos "hecho a mano", estados de oferta |

### Neutral (neutros)

| Nombre | Hex | Uso |
|------|-----|-------|
| Background | #F6EEDC | Fondo de página |
| Surface | #FFFAF0 | Tarjetas |
| Text Primary | #1D140D | Titulares y texto |
| Text Secondary | #5B4A3B | Texto secundario |
| Border | #E2D5BC | Bordes |

### Semantic (semánticos)

| Estado | Hex | Uso |
|-------|-----|-------|
| Success | #2F9E5B | Disponible, confirmaciones |
| Warning | #B5651D | Últimas unidades / promos |
| Error | #C2413B | Agotado, errores |
| Info | #1FA855 | Acciones de WhatsApp |

### Accesibilidad
- Tinta sobre pergamino: 15:1 (AAA). Texto secundario sobre pergamino: 7:1 (AAA).
- Oro miel **nunca** como color de texto pequeño sobre pergamino (2.4:1): usar #7A5414 (oro tinta, 6.1:1).
- Sobre espresso, el oro claro #E2B765 alcanza 9:1.

---

## 2. Tipografía

| Rol | Fuente | Peso | Notas |
|------|------|--------|-------|
| Display / H1–H2 | Fraunces | 400–500, cursiva para palabras clave | `opsz` alto, interletrado −2 % |
| Cuerpo | Manrope | 400–700 | 16 px base, interlineado 1.6 |
| Etiquetas | Manrope | 700–800 | Mayúsculas, interletrado +0.14em |
| Nota manuscrita | Caveat | 500–700 | Solo para la "voz de Jorge" |

### Font Stack

```css
--font-heading: 'Fraunces', Georgia, serif;
--font-body: 'Manrope', system-ui, sans-serif;
--font-mono: 'Caveat', cursive;
```

---

## 3. Voz de marca

### Brand Personality

| Rasgo | Descripción |
|-------|-------------|
| **Artesano orgulloso** | Habla del oficio con datos concretos |
| **Cercano** | Tutea, voz de Jorge: dominicano con 8 años en Chile |
| **Con humor de campus** | El antojo, la prueba, el día largo |
| **Honesto** | Si se agota, lo dice; no inventa reseñas |

### Prohibited Terms

| Evitar |
|--------|
| el mejor del mundo |
| disruptivo |
| garantizado |
| reseñas inventadas |

### Somos
- **Artesanos orgullosos**: hablamos del oficio (lotes pequeños, tostado, baño a mano) con datos concretos, sin exagerar.
- **Cercanos**: tuteamos con la voz de Jorge, un dominicano que lleva años en Chile. Mezclamos suave el dominicano ("chévere", "dímelo", "mi pana", "tranquilo") con el chileno de campus ("al tiro", "bacán", "el bajón"). Sin garabatos.
- **Con humor de campus**: el antojo, la prueba difícil, el día largo.
- **Honestos**: si algo está agotado, lo decimos. No inventamos reseñas ni cifras.

### Sonamos así
- "Hecho a mano, en lotes chicos, cada semana."
- "Para ese bajón de media tarde."
- "Si se acaba, lo verás marcado al instante."

### No sonamos así
- "El mejor maní del universo" (exagerado)
- "Experiencia gastronómica disruptiva" (corporativo)
- Reseñas o estadísticas que no podemos probar

### Mezcla dominicana-chilena (v3)
Jorge es dominicano y vive en Temuco. La marca suena como él: cálida, rápida y con cariño.

| Regla | Detalle |
|---|---|
| Dosis | Máximo **1–2 modismos por mensaje**. El resto, español neutro y claro. |
| Dominicano | "¡Chévere!", "Dímelo", "mi pana", "tranquilo", "qué lo qué" (solo en saludos informales) |
| Chileno | "al tiro", "bacán", "el bajón", "la prueba", "el campus" |
| Emoji | Máximo 1 por mensaje, nunca en errores ni pagos |
| Claridad primero | En reservas, pagos y errores: cero modismos si restan claridad. |

**Ejemplos (salen de `js/voice.mjs`, la única fuente de microcopy):**
- Agregar: "Maracuyá a la boleta. ¡Chévere!"
- Compartir: "Link copiado, mándaselo a tu pana"
- Agotado: "Se nos acabó Frambuesa. Lo saqué de tu boleta, tranquilo."
- Ausente: "Hoy Jorge no está en el campus. Puedes reservar para cuando vuelva."
- Agente: "¡Dímelo! Soy *El Gigante*…"

Todo texto nuevo de feedback (toasts, estados vacíos, errores) se agrega en `js/voice.mjs` y no queda suelto en el código.

### Tono por contexto
| Contexto | Tono |
|---------|------|
| Titulares | Poético-breve, una palabra en cursiva dorada |
| Catálogo | Sensorial: sabor + textura en ≤ 8 palabras |
| Reservas / pagos | Claro y tranquilizador, pasos numerados |
| Asistente IA | Amable, breve, máximo 1 emoji |
| Errores | Empático y con salida: "Uy, se agotó. ¿Probamos…?" |

---

## 4. Logo

- Elefante con maní sobre pergamino. Versión circular (sticker) para avatar, favicon y sello.
- Espacio libre mínimo: 25 % del diámetro. Nunca sobre fotos sin un círculo pergamino de fondo.

## 5. Elementos gráficos de firma
- **Etiqueta kraft**: tarjetas de producto con textura de papel kraft y ventana como el doypack real.
- **Sello circular**: "Hecho a mano · Temuco" girando lentamente.
- **Grano**: textura de ruido al 6–8 % sobre las superficies oscuras.
- **Nota manuscrita**: comentarios de Jorge en Caveat con flecha dibujada.


---

## 6. Elevación (v3)

Sombra cálida en cuatro niveles. El tono viene del espresso, nunca negro puro. En modo oscuro las sombras son más profundas y se acompañan de un borde de luz.

| Token | Uso |
|---|---|
| `--elevation-card` (nivel 1) | Tarjetas en reposo, chips |
| `--elevation-raised` (nivel 2) | Hover, boleta, ticket |
| `--elevation-overlay` (nivel 3) | Popovers, vista rápida, dock |
| `--elevation-modal` (nivel 4) | Diálogos, drawer |

## 7. Tipografía óptica y escala (v3)
- Fraunces usa el eje `opsz`: 144 fijo en el hero y en las cursivas doradas; en H2/H3 se ajusta solo al tamaño (`font-optical-sizing: auto`). `SOFT` sube a 100 en las cursivas y en las citas, y `WONK` se activa solo en las cursivas doradas.
- Tracking: display −0.035em · heading −0.02em · cuerpo 0 · etiquetas +0.14em.
- Escala: xs 12 · sm 14 · base 16 · md 18 · lg 22 · xl 28 · 2xl–hero con `clamp()`.
- Espaciado de 8 pt: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
- Las fuentes están autoalojadas en `assets/fonts` (OFL) y sus fallbacks tienen ajuste métrico (sin saltos al cargar).

## 8. Modo oscuro pensado
No se invierte la paleta: tiene sus propios valores. Fondo espresso, kraft tostado, oro más claro para el texto y el grano sube al 8 %. Los gráficos del panel usan su propio dorado validado para daltonismo (#B5822F oscuro / #A87526 claro).

## 9. Momentos de marca
- **Sello "Hecho a mano"**: aparece al completar una caja, una reserva o un pedido (`stampMoment` en `js/ui.mjs`). No usarlo en más lugares para que no pierda valor.
- **Papel real**: las tarjetas se inclinan levemente y tienen brillo de papel (`data-tilt`). Se desactiva con "reducir movimiento" y en pantallas táctiles.
- **Estados vacíos con bolsa** y mensaje de Jorge; skeleton en la tarjeta "Estado en vivo" mientras llega el stock.

## 10. Procesos
| Proceso | Cómo |
|---|---|
| Cambio de catálogo | Editar `js/catalog.mjs` → subir `CATALOG_VERSION` + `CATALOG_CHANGELOG` → `npm run seo` → `npm test` |
| Stock del día | Sheets (con webhook) o el panel. El panel manda. |
| Ausencia | Panel → "Jorge no está". Se refleja en la web, en el agente y en las reservas. |
| Nuevo componente | Solo tokens (`var(--…)`), con objetivo táctil ≥ 44 px, foco visible y modo oscuro revisado; documentarlo en `docs/design-system.md` |
| Antes de publicar | `npm test` (incluye axe WCAG 2.2 AA en claro y oscuro) |
