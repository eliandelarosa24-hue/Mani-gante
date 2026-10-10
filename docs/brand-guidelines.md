# Casa MANI-GANTE · Guía de marca v4.0

> Última actualización: 2026-10-10 · Estado: activa
> Eslogan: **"Para gente elegante y gánster."**
> Dirección: **noir de lujo**. Un speakeasy de los años 20 con alma dominicana: terciopelo, oro champán, anillas de habano y grabado de billete. El "gánster" es estilo, lealtad y familia; nunca violencia ni nada ilegal.
> Investigación y referencias detrás de cada decisión: [`docs/identidad-casa.md`](identidad-casa.md).

## Referencia rápida

| Elemento | Valor |
|---|---|
| Tema de la marca | **Noche** (oscuro) por defecto · Marfil (claro) opcional |
| Noir | #0D0B09 fondo · #161210 superficie · #1E1915 superficie 2 |
| Oro champán | #D2AE6D (acción) · #DDBB7C (texto dorado sobre noir) · foil en degradado |
| Terciopelo | #6E1A2C (sala del maletín, lacre, cuenta) · #E2687C (acento de texto sobre noir) |
| Fieltro de casino | #1E5A43 → #0D2A1F (sala del trato) |
| Marfil | #F2EADB (texto sobre noir) · #F7F1E6 (papel: invitación, cuenta, periódico) |
| Titulares | **Bodoni Moda**: lujo editorial, cursiva dorada para la palabra clave |
| Etiquetas y números | **Big Shoulders**: inspirada en los carteles de Chicago de los años 20 |
| Texto | **Instrument Sans** |
| Firma | **Pinyon Script**: solo la firma del Jefe y la palabra "Invitación" |

---

## 1. Paleta

Todos los valores viven en `design/tokens.json`. El archivo `css/tokens.css` se genera con `node design/build-tokens.mjs`.

| Rol | Noche (marca) | Marfil (claro) | Contraste |
|---|---|---|---|
| Fondo | #0D0B09 | #F3ECDF | — |
| Texto | #F2EADB | #17120E | 16.4:1 · 15.8:1 (AAA) |
| Texto secundario | #BFB3A1 | #4E4337 | 9.5:1 · 8.2:1 (AAA) |
| Texto sutil | #968A78 | #6B5E4F | 5.8:1 · 5.4:1 (AA) |
| Dorado de texto | #DDBB7C | #6E5220 | 10.7:1 · 6.2:1 |
| Acento (terciopelo) | #E2687C | #7A1E31 | 6.1:1 · 8.7:1 |
| Éxito (fieltro) | #4FB386 | #1E6B4A | 7.6:1 · 5.5:1 |
| Error | #E06A60 | #B3332B | 6.0:1 · 5.2:1 |
| Botón dorado | texto #0D0B09 sobre #D2AE6D | igual | 9.4:1 |

**Salas con material propio:** se ven iguales en Noche y Marfil, porque son "habitaciones" de la casa (clase `.room`).
- Salón (hero): noir y terciopelo.
- La Bolsa: noir.
- El maletín: terciopelo capitoné.
- La cita: noir con foco de luz.
- El trato: fieltro verde.
- Pie de página: noir.

El papel (invitación, cuenta, periódico y telegrama) usa la clase `.paper-room`.

**Reglas**
- El oro es para acción y énfasis. Nunca se usa en párrafos.
- El foil (degradado) va solo en titulares grandes, botones principales y el logotipo del pie.
- Los colores de bancos se ven solo como franja de 6 px en las tarjetas de pago.

## 2. Tipografía

| Rol | Fuente | Uso |
|---|---|---|
| Display | Bodoni Moda 500 (cursiva 500) | Titulares con tracking −0.025em; la palabra clave va en cursiva con foil dorado |
| Deco | Big Shoulders 700–800, mayúsculas | Etiquetas de capítulo, números de ficha, precios, botones y la Bolsa. Tracking +0.14 a +0.3em |
| Texto | Instrument Sans 400–600 | Cuerpo de 16 px, interlineado 1.65 |
| Firma | Pinyon Script | Solo para "Jorge" y "Invitación", siempre a 2rem o más |

- **Precios y números** siempre en Big Shoulders: $1.000 se lee como una cifra de cartel.
- **Capítulos**: cada sección abre con `Cap. I…IX` dentro de un recuadro, seguido de su nombre.
- Las fuentes están autoalojadas en `assets/fonts/` (licencia OFL) y sus respaldos tienen ajuste métrico.

## 3. Voz de marca

### Personalidad

| Rasgo | Cómo se nota |
|---|---|
| **Elegante** | Frases cortas y seguras. Nada de gritos ni exceso de signos. |
| **Gánster de película** | Juega con la familia, el trato, la cita, el Jefe, el consigliere, la ficha y el alias. |
| **Cercano** | Habla con la voz de Jorge: dominicano con 8 años en Chile. |
| **Honesto** | Si se agota, lo dice. No inventa reseñas ni cifras. |

### El vocabulario de la casa

| En vez de… | Decimos… |
|---|---|
| Tienda / top ventas | **Los más buscados** / "Más buscado" |
| Sabor nuevo | "Recién llegado" |
| Arma tu caja | **Llena tu maletín** (evitamos "arma": en clave gánster suena a armas) |
| Reservar | **Pedir una cita con el Jefe** |
| Carrito / boleta | **La cuenta de la casa** |
| Formas de pago | **Así se cierra el trato** |
| FAQ | **La letra chica** |
| Opiniones | **La familia habla** / "telegrama" |
| Asistente IA | **El Gigante, tu consigliere** |
| Test de sabor | **El interrogatorio** → "tus cómplices ideales" |
| Promo de viernes | "Una oferta que no podrás rechazar" |
| Formatos | **El Clásico** (celofán) y **La Reserva** (doypack) |

### Alias de los sabores
Los alias usan **jerga dominicana** y cuentan **a qué sabe** cada sabor. Tienen que pegarse y ser fáciles de recordar, como La Chinola, Morir Soñando, La Mamajuana, El Sancocho o El Mangú.
- Máximo tres palabras.
- Sin groserías.
- Si un alias necesita explicación, no sirve.

### Mezcla dominicana-chilena
- **Dosis:** máximo 1–2 modismos por mensaje.
- **Dominicano:** "¡Chévere!", "Dímelo", "mi pana", "tranquilo".
- **Chileno:** "al tiro", "bacán", "el bajón".
- **Emoji:** máximo 1 por mensaje, nunca en errores ni pagos.
- **Claridad primero:** en pagos, horarios y pasos de reserva, el juego de palabras nunca reemplaza el dato.

### Límites (no negociables)
- **Nunca:** armas (ni el verbo "armar" en titulares: decimos "llenar", "completar"), violencia, drogas, "mercancía", "contrabando", "dealer", "soplón", ni nada que insinúe algo ilegal.
- El "gánster" es estilo, lealtad y elegancia.
- Prohibido también: "el mejor del mundo", "garantizado", reseñas inventadas.

### Sonamos así
Todos estos textos salen de `js/voice.mjs`, la única fuente de microcopy.
- "Maracuyá ya es de la familia."
- "Se nos escapó Frambuesa. Lo saqué de tu cuenta, tranquilo."
- "Ese maletín quedó de jefe."
- "La casa te guardó la cuenta: 3 bolsas. ¿Cerramos el trato?"
- "¡Dímelo! Soy *El Gigante*, el consigliere de la casa."

## 4. Logo y monograma
- **Logo:** el elefante circular de siempre. En la web lleva un anillo de oro doble.
- **Monograma "MG":** Bodoni en cursiva dentro de un medallón art déco con abanico de rayos (`monogram()` en `js/art.mjs`). Se usa en el lacre de la invitación.
- **Wordmark:** MANI-GANTE en Bodoni 600 versalitas con tracking +0.16em. El guion va en oro y en Big Shoulders.

## 5. Elementos de firma
1. **Anilla de habano:** cada bolsa lleva una banda dorada grabada con medallón de terciopelo, el elefante, "Nº" de ficha y "M·G". Es la herencia dominicana (República Dominicana es tierra de habanos).
2. **Roseta guilloché:** el grabado de los billetes, generado en SVG (`guilloche()`). Va detrás de la bolsa del salón, en el 404 y en las imágenes para compartir.
3. **La ficha:** la tarjeta de cada sabor se apoya en el fondo de rueda de reconocimiento (líneas de altura) y lleva placa "Ficha Nº", alias y esquinas doradas.
4. **La Bolsa de hoy:** el stock en vivo como cotización de bolsa (▲ en circulación · ▼ agotado). La palabra juega con "bolsa" de maní y bolsa de valores.
5. **Salas:**
   - el maletín de cuero con terciopelo capitoné y broches dorados;
   - la invitación de marfil con doble filete y lacre;
   - el periódico "El Diario de la Casa", con fotos en blanco y negro y capitular;
   - la mesa de fieltro con tarjetas de metal negro;
   - el telegrama para el Jefe.
6. **La puerta:** intro de speakeasy ("¿Quién te manda?" → "Vengo de parte de Jorge"). Aparece solo en la primera visita, se puede saltar y no aparece con reducir movimiento.
7. **El foco de luz:** en el salón y en la cita, una luz cálida sigue al puntero.

## 6. Elevación
Las sombras son negras y profundas, con un filete dorado al 8–22 %, en lugar de sombras de color.

| Token | Uso |
|---|---|
| `--elevation-card` | Fichas en reposo |
| `--elevation-raised` | Hover, botones flotantes |
| `--elevation-overlay` | Vista rápida, menús |
| `--elevation-modal` | Diálogos y la cuenta |

## 7. Forma
- **Esquinas casi rectas:** botones a 2 px y fichas a 4 px. La casa no usa píldoras.
- **Botón principal:** "plaqueta" de foil con un filete interior.
- **Botones secundarios:** solo con borde dorado.
- **Separadores:** filete con rombo art déco (`--rule`).

## 8. Movimiento
- Titulares que suben palabra por palabra, la roseta girando lento (140 s), la bolsa flotando y la Bolsa corriendo (se pausa con hover).
- Con **reducir movimiento** todo queda quieto y la puerta no aparece.

## 9. Procesos

| Proceso | Cómo |
|---|---|
| Cambiar colores o tipos | Editar `design/tokens.json`, luego `node design/build-tokens.mjs` |
| Cambio de catálogo o alias | Editar `js/catalog.mjs` (`ALIASES`), subir `CATALOG_VERSION`, luego `npm run seo` |
| Imágenes para compartir | `node tests/serve.mjs . 8787` y `node scripts/og.mjs` |
| Texto nuevo de la interfaz | Va en `js/voice.mjs`, respetando el vocabulario y los límites del §3 |
| Antes de publicar | `npm test` (incluye axe WCAG 2.2 AA en Noche y Marfil) |
