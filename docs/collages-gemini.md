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

## Muestra 4 · Kuchen Haus (café y pastelería alemana, Frutillar)

Son 16 espacios, en 4 collages de 2×2. La luz es de día, cálida y luminosa, con madera clara, manteles blancos o de cuadros azules, porcelana con flores y el lago Llanquihue azul de fondo. Es lo opuesto a las muestras oscuras.

### Collage A: el lugar → `vitrina, salon, abuela, lago`

Se corta en dos pasadas: `--names vitrina,-,abuela,- --ratio 4:5` y luego `--names -,salon,-,lago --ratio 16:9`.

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. A traditional German-Chilean café and bakery in Frutillar, southern Chile, by Lake Llanquihue. Top-left: a glass pastry display case full of whole kuchen (raspberry, murta berry, apple with streusel, walnut) and Black Forest cake on lace doilies, warm morning light, shot at eye level. Top-right: the cosy café interior with light wooden tables, blue and white checkered tablecloths, porcelain cups with flowers and big windows showing the blue lake and the snowy Osorno volcano. Bottom-left: a vintage 1980s sepia-toned photograph of a smiling German-Chilean grandmother with an apron, holding a tray of kuchen in front of the bakery door. Bottom-right: the Frutillar lakeshore with colorful wooden German colonial houses, a wooden pier and the perfect cone of Osorno volcano across the lake, sunny day. Natural light, soft and warm, high detail, 8K.

### Collage B: los kuchen → `k-murta, k-frambuesa, k-manzana, k-nuez` (`--ratio 1:1`)

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. Four slices of German kuchen on vintage porcelain plates with small flowers, each on a light wooden table with soft daylight, varied angles. Top-left: murta berry kuchen with a golden butter crumble (streusel), shot at 45 degrees with a fork. Top-right: raspberry kuchen with custard and glossy fresh raspberries, shot from directly above. Bottom-left: apple and cinnamon kuchen with thin apple slices in a spiral and streusel, side view showing the layers. Bottom-right: caramelized walnut kuchen with a cup of coffee beside it, shot at 45 degrees. Food photography, appetizing, sharp detail, 8K.

### Collage C: tortas y café → `selva, strudel, cafe, pretzel` (`--ratio 1:1`)

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. German-style café specialties in southern Chile, bright and cosy, with lake light from a window. Top-left: a tall slice of Black Forest cake with whipped cream, cherries and chocolate shavings, side view. Top-right: warm apple strudel dusted with icing sugar, with a scoop of vanilla ice cream and whipped cream, 45-degree angle. Bottom-left: a cappuccino with latte art in a porcelain cup with blue flowers, shot from above, with a sugar bowl. Bottom-right: a golden Bavarian pretzel with sweet mustard and a coffee on a blue and white checkered tablecloth. Food photography, natural light, 8K.

### Collage D: el oficio y Frutillar → `manos, huerto, horno, teatro`

Se corta en dos pasadas: `--names manos,huerto,horno,- --ratio 4:3` y luego `--names -,-,-,teatro --ratio 16:9`.

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. Top-left: close-up of a baker's floury hands rubbing butter and flour into streusel crumbs in a ceramic bowl, with fresh raspberries beside it. Top-right: hands picking ripe raspberries in a sunny berry orchard in southern Chile, with the lake far behind. Bottom-left: a baker taking a large tray of golden fruit kuchen out of a wood-fired oven, warm light, slight steam. Bottom-right: the modern wooden Teatro del Lago concert hall in Frutillar on the lake at blue hour with warm lights reflecting on the water and Osorno volcano behind. Natural, high detail, 8K.

---

## Muestra 5 · Viña Los Robles (enoturismo, valle de Colchagua)

Son 16 espacios, en 4 collages de 2×2. El estilo es elegante y cálido: luz dorada de atardecer, madera de roble, adobe, terracota y vino tinto profundo. **No debe aparecer texto en etiquetas ni carteles.** Descargue cada imagen en tamaño completo.

### Collage A: la viña → `hero, cava, casona, enologa`

Se corta en dos pasadas: `--names hero,cava,-,- --ratio 16:9` y luego `--names -,-,casona,enologa --ratio 4:5`.

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. A family boutique winery in the Colchagua Valley, Chile. Top-left: rows of old carménère vines at golden hour with long shadows, the Andes mountains hazy in the background, warm sunlight. Top-right: an underground adobe wine cellar with rows of French oak barrels lit by candles and warm lamps, arched brick ceiling. Bottom-left: a traditional Chilean colonial adobe country house (casona) with a long corridor, wooden columns, terracotta roof tiles and bougainvillea, in the afternoon. Bottom-right: a young woman winemaker in a linen apron drawing red wine from a barrel with a glass wine thief in the cellar, lit softly from the side. Elegant, cinematic, warm tones, shallow depth of field, 8K.

### Collage B: las experiencias → `cata, almuerzo, bici, mezcla` (`--ratio 4:3`)

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. Wine tourism experiences in a Chilean vineyard. Top-left: a wine tasting table in a candlelit cellar with five glasses of red and white wine in a row, a spittoon and a tasting sheet with no readable text. Top-right: a long lunch table set among the vines with a white tablecloth, terracotta plates, wine glasses and summer food, guests laughing, soft afternoon light. Bottom-left: a couple riding electric bicycles along a dirt road between vineyard rows at sunset, from behind. Bottom-right: a blending workshop with glass graduated cylinders, pipettes and wine glasses on an oak table, hands mixing red wines. Elegant, warm, natural light, 8K.

### Collage C: la vendimia → `uvas, cosecha, pisada, copa` (`--ratio 1:1`)

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. Grape harvest (vendimia) in Chile in autumn. Top-left: macro of a ripe dark carménère grape bunch on the vine with morning dew and backlight. Top-right: weathered hands cutting a grape bunch with pruning shears into a wooden harvest crate. Bottom-left: happy visitors stomping grapes barefoot in a large wooden vat, purple juice splashing, festive. Bottom-right: a glass of deep red wine being swirled, with the sunset vineyard blurred behind. Vivid autumn colors, warm, 8K.

### Collage D: el valle → `cierre, barricas, queso, otono`

Se corta en dos pasadas: `--names cierre,barricas,-,- --ratio 16:9` y luego `--names -,-,queso,otono --ratio 4:3`.

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. Colchagua Valley, Chile. Top-left: a breathtaking sunset over endless vineyard hills with a lone old oak tree (roble) and the Andes glowing pink. Top-right: a long symmetric aisle of stacked oak barrels in a dim cellar with dramatic light. Bottom-left: a rustic pairing board with local goat cheeses, olives, walnuts, honey and a glass of red wine on an oak table. Bottom-right: a vineyard in autumn with red, orange and yellow vine leaves in perfect rows. Cinematic, warm, 8K.

---

## Muestra 6 · Cabañas Lago Azul (seis cabañas, lago Villarrica)

Son 16 espacios, en 4 collages de 2×2. El estilo es fotografía de arquitectura para revista de diseño: luz natural suave, encuadres limpios y simétricos, madera nativa clara, grandes ventanales y paleta fría y serena (azul lago, gris niebla, verde arrayán). Sin personas mirando a cámara, sin texto. Descargue cada imagen en tamaño completo.

### Collage A: cuatro cabañas → `cab-muelle, cab-bosque, cab-arrayan, cab-mirador` (`--ratio 4:3`)

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. Architectural photography of four different contemporary wooden cabins on the shore of Lake Villarrica, Chile, each a different design, published in a design magazine. Top-left: a low cabin with a large covered deck right at the water's edge and a small wooden pier, the snow-capped Villarrica volcano across the lake, soft morning light. Top-right: a larger two-story family cabin among native arrayán trees with cinnamon-colored bark, a stone barbecue area beside it. Bottom-left: a tiny minimalist black timber cabin for couples in a green clearing, with one big window. Bottom-right: a cabin raised on a slope with a floor-to-ceiling glass corner facing the volcano and a wooden hot tub on its terrace, at golden hour. Natural light, calm, high detail, 8K.

### Collage B: dos cabañas e interiores → `cab-playa, cab-refugio, int-living, int-dormitorio` (`--ratio 4:3`)

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. Lake Villarrica, Chile, interior design magazine style. Top-left: a light wooden cabin with a sliding glass door opening directly onto a dark volcanic sand beach, kayaks resting on the sand. Top-right: a small A-frame loft cabin in the forest at dusk with warm light inside and smoke from the chimney. Bottom-left: a bright cabin living room with pale wood walls, a cast-iron wood stove, a linen sofa and a huge window framing the lake and the volcano. Bottom-right: a serene bedroom with white linen bedding, wool blankets, a wooden ceiling and a window to the trees, morning light. Calm, Scandinavian-Chilean style, 8K.

### Collage C: la vida en el lago → `kayak, quincho, tinaja, muelle-ninos` (`--ratio 4:3`)

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. Life at a lakeside cabin resort in southern Chile, editorial documentary style, people seen from behind or far away. Top-left: two kayaks gliding on a glassy lake at dawn with mist and the volcano reflected. Top-right: a family barbecue at dusk in a wooden quincho with a fire, string lights and a long table, seen from a distance. Bottom-left: a wooden hot tub steaming at night under the stars next to a cabin with warm windows. Bottom-right: children jumping off a wooden pier into the clear lake on a sunny summer afternoon, seen from behind. Natural colors, 8K.

### Collage D: el lago → `hero, niebla, otono, cierre`

Se corta en dos pasadas: `--names hero,-,-,cierre --ratio 16:9` y luego `--names -,niebla,otono,- --ratio 4:5`.

> Create a single photorealistic image arranged as an exact 2x2 grid of four equal panels, with no borders, no gaps, no text and no logos. Lake Villarrica, Chile. Top-left: a wide, calm, minimalist view of the lake at blue hour with a long wooden pier, the perfect snow-capped cone of Villarrica volcano reflected in still water. Top-right: early morning fog over the lake between dark trees, very quiet and moody. Bottom-left: a forest path of arrayán trees with orange bark in autumn light leading to the lake. Bottom-right: a sunset over the lake from the end of the pier, orange and pink sky, the volcano silhouette. Fine art landscape photography, 8K.

---

Las otras 4 muestras tendrán sus prompts cuando se rediseñe cada una.
