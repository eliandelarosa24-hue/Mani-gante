# Imágenes de las muestras con collages de Gemini

Como la API de imágenes cobra aparte de Gemini Plus y ChatGPT Plus, las imágenes se generan en la **app** de Gemini (o ChatGPT) como collages y luego se cortan aquí.

## Paso a paso

1. Abra gemini.google.com, elija el modelo de imágenes y pegue uno de los prompts de abajo, tal cual.
2. Descargue la imagen en tamaño completo (botón de descarga, no captura de pantalla).
3. Súbala al chat con Claude diciendo qué collage es (por ejemplo, "Domos, collage A").
4. Claude ejecuta el corte y la ampliación:

   ```bash
   npm run collage -- collage-a.png --sample domos-cielo-austral --grid 2x2 --names unidad-1,unidad-2,unidad-3,unidad-4 --ratio 4:3
   ```

   El script recorta cada celda dejando fuera las líneas de unión, la amplía (Lanczos y enfoque suave) y la guarda como WebP en `public/muestras/<slug>/img/`. La página la usa automáticamente en lugar de la foto de Unsplash.

**Reglas para todos los prompts:** cuadrícula exacta, sin bordes ni separaciones blancas, sin texto ni logos, sin personas mirando a cámara, fotorrealista y con la máxima resolución.

---

## Muestra 1 · Domos Cielo Austral (astroturismo, Curarrehue)

Hay 11 espacios. Se cubren con 3 collages de 2×2; sobra una celda, que queda de reserva.

### Collage A: los cuatro domos → `unidad-1..4` (4:3)

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. Each panel shows a different transparent geodesic glamping dome in the Andes of southern Chile (Araucanía) at night, under a sky full of stars. Top-left: a tall dome on a wooden deck with a private wooden hot tub that is steaming, the Milky Way overhead, from a low angle. Top-right: a family dome seen from the side with warm interior light, a small telescope at the entrance and araucaria trees. Bottom-left: a compact dome for couples in a forest clearing, photographed from above with a drone, with the Magellanic Clouds visible. Bottom-right: a dome with a large panoramic window facing a snow-capped volcano, at blue hour turning to night. Long-exposure astrophotography style, sharp stars, warm amber interiors contrasting with a deep violet-blue sky, high detail, 8K quality.

### Collage B: galería, primera parte → `g1, g2, g3, cierre`

Se corta en dos pasadas: `--names g1,g2,g3,- --ratio 4:3` y luego `--names -,-,-,cierre --ratio 16:9`.

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. Astrotourism in the Chilean Andes. Top-left: the bright core of the Milky Way arching over a dark mountain valley, with a lone geodesic dome glowing softly below. Top-right: interior of a glamping dome at night seen from the bed, looking up through the transparent ceiling at the stars, with cosy blankets and warm lamp light. Bottom-left: an astronomer guide from behind, pointing a green laser at the Southern Cross while a small group watches, silhouettes against the starry sky. Bottom-right: a wide panorama of four illuminated domes in a valley under star trails, with snowy peaks on the horizon. Long-exposure night photography, deep blues and violets with warm amber accents, ultra sharp, 8K.

### Collage C: galería, segunda parte → `g4, g5, g6` (`--ratio 4:3`; la cuarta celda es de reserva)

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. Details of a stargazing lodge in Patagonia-style Andes. Top-left: close-up of an 8-inch Dobsonian telescope on a wooden deck pointing at the sky, with stars behind it. Top-right: a steaming wooden hot tub under the Milky Way, with two glasses of red wine on its edge. Bottom-left: the full Moon rising over volcanic mountains, telephoto view showing craters. Bottom-right: breakfast at sunrise on a dome terrace, with coffee, bread, jam and mist over the valley. Natural colors, cinematic, high detail, 8K.

---

Las otras 9 muestras tendrán sus prompts cuando se rediseñe cada una.
