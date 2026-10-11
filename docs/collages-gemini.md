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

## Muestra 2 · Fogón Mapu (cocina mapuche contemporánea, Temuco)

Son 16 espacios, repartidos en 4 collages de 2×2. Todos tienen la misma luz: fuego, brasas, fondos oscuros de madera y piedra, y vapor o humo suave. La paleta es carbón, ámbar, cobre y verde musgo.

### Collage A: el lugar → `hero, chef, salon, cierre`

Se corta en dos pasadas: `--names hero,-,salon,cierre --ratio 16:9` y luego `--names -,chef,-,- --ratio 4:5`.

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. A contemporary Mapuche fine-dining restaurant in Temuco, southern Chile, where everything is cooked over open fire. Top-left: a dramatic low-angle close-up of a wood-fire hearth (fogón) with glowing embers, flames and cast-iron pots, sparks rising into darkness. Top-right: an Indigenous Mapuche woman chef seen from behind and slightly to the side, wearing a dark linen apron and a silver trarilonko headband, tending the fire with a long iron tool, her face lit warm orange. Bottom-left: a long communal wooden table (like a trawün) in a dim restaurant with clay bowls, wool runners with Mapuche geometric patterns, candles and the fire glowing at the back, shot from the end of the table. Bottom-right: a wide atmospheric view of the dining room at night through drifting smoke, with warm pendant lights and silhouettes of diners. Cinematic food photography, chiaroscuro, deep shadows, warm amber and copper tones, shallow depth of field, 8K.

### Collage B: menú degustación, primera parte → `tiempo-1..4` (`--ratio 1:1`)

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. Four plated courses of a Mapuche-inspired tasting menu, shot from directly above (top-left and bottom-right) and at 45 degrees (top-right and bottom-left), on dark handmade ceramic and rough wood. Top-left: warm rustic flatbread «catuto» made of wheat mote, with a quenelle of red smoked merkén butter. Top-right: a bright ceviche of cochayuyo seaweed and wild changle mushrooms with herbs and edible flowers. Bottom-left: golden pumpkin sopaipillas with a fresh pebre of digüeñe mushrooms. Bottom-right: a velvety araucaria pine nut (piñón) cream in a black clay bowl with sautéed wild coigüe mushrooms and herb oil. Fine-dining plating, natural side light, steam rising, ultra detailed textures, 8K.

### Collage C: menú degustación, segunda parte → `tiempo-5..8` (`--ratio 1:1`)

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. Four plated courses of a Mapuche-inspired tasting menu, on dark handmade ceramic and rough wood, varied angles. Top-left: lake trout cooked inside a giant nalca leaf, opened at the table to show the pink fish with quinoa salad, steam rising. Top-right: slow-cooked lamb from the embers, glossy and dark, over a pine nut purée with charred leeks, shot at 45 degrees. Bottom-left: a small chilled glass of purple muday (fermented corn drink) with maqui berries and frost, as a pre-dessert, macro shot. Bottom-right: a dessert of mote with dried peach and deep purple maqui syrup, with murta berries and goat milk cream, shot from above. Fine-dining plating, chiaroscuro, warm firelight, ultra detailed, 8K.

### Collage D: los productores → `comunidad-1..4` (`--ratio 4:5`)

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. Ingredients and the hands of Mapuche producers in the Araucanía region of Chile, documentary style, no faces visible. Top-left: weathered hands holding freshly harvested araucaria pine nuts (piñones) beside a woven basket, with araucaria trees and snow in the background. Top-right: red chili peppers being smoked over a wooden fire to make merkén, with smoke and a hand stirring them. Bottom-left: bright orange digüeñe fungi growing on a mossy coigüe branch in a rainy forest, macro shot. Bottom-right: hands picking wild maqui berries into a clay bowl at golden hour, with a rural field behind. Natural light, rich earthy colors, shallow depth of field, ultra detailed, 8K.

---

## Muestra 3 · Pucón Aventura (turismo aventura, Pucón)

Son 7 espacios, en 2 collages de 2×2. El estilo es fotografía de aventura: acción real, luz natural intensa, colores vivos y cascos y ropa técnica de colores (naranjo, rojo).

### Collage A: tours → `tour-1..4` (`--ratio 4:3`)

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. Adventure tourism in Pucón, southern Chile. Top-left: a roped group of climbers with orange jackets, helmets and ice axes ascending the snowy slope of Villarrica volcano at sunrise, with the smoking crater above and Lake Villarrica far below, shot from behind and below. Top-right: an orange raft with six people in helmets crashing through a big white-water rapid on the Trancura river, between dark volcanic rock walls, action shot with water splashing. Bottom-left: a family with two children aged 9 and 11 laughing in a raft on calm turquoise rapids, with a guide at the back, sunny day and green forest. Bottom-right: a person on a zipline flying over a native forest canopy and turquoise waterfalls, shot from the platform behind. Professional adventure photography, vivid natural colors, sharp, 8K.

### Collage B: naturaleza, termas y cierre → `tour-5, tour-6, cierre`

Se corta en dos pasadas: `--names tour-5,tour-6,-,- --ratio 4:3` y luego `--names -,-,cierre,- --ratio 16:9` (la cuarta celda queda de reserva).

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. Top-left: hikers on a trail among ancient araucaria trees beside a deep green mountain lake in Huerquehue National Park, Chile. Top-right: natural hot spring pools at night connected by red wooden walkways in a fern-covered canyon, lit by candles and lanterns, with steam rising (Termas Geométricas style). Bottom-left: a wide epic view from the summit crater rim of Villarrica volcano at sunrise, with a climber in an orange jacket silhouetted and a sea of clouds and other snowy volcanoes (Lanín) on the horizon. Bottom-right: guides in helmets preparing climbing gear (crampones, ice axes) beside a van at dawn. Professional adventure photography, vivid natural colors, 8K.

---

Las otras 7 muestras tendrán sus prompts cuando se rediseñe cada una.
