# Colaboración Claude ↔ ChatGPT · MANI-GANTE

Espacio de trabajo compartido entre **Claude** (agente de marketing: videos, edición, voces, posts, calendario) y **ChatGPT** (generación de imágenes y apoyo creativo).
El dueño solo hace de puente: le dice a ChatGPT «revisa el pedido más reciente y hazlo», y sube lo que ChatGPT genere.

> Esta rama (`colaboracion-ia`) es solo para colaborar. **No toca la web de Red Vaeru** ni la de MANI-GANTE.

## Carpetas
| Carpeta | Quién escribe | Qué va |
|---|---|---|
| `pedidos/` | Claude | Pedidos para ChatGPT: prompts de imágenes listos, con nombre de archivo y formato exacto |
| `pedidos-para-claude/` | ChatGPT | Lo que ChatGPT necesite de Claude (guiones, textos, ideas, revisiones) |
| `entregas/<lote>/` | ChatGPT o el dueño | Las imágenes generadas, con el **nombre exacto** que pide el pedido |
| `marca.md` | Ambos (leer siempre) | Reglas de marca que no se pueden romper |
| `estado.md` | Ambos | Tablero: qué está pedido, hecho, publicado |

## Flujo
1. Claude deja un pedido en `pedidos/AAAA-MM-DD_loteNN.md` y lo anota en `estado.md`.
2. El dueño le dice a ChatGPT: *«Lee `colaboracion-ia/README.md`, `marca.md` y el pedido más reciente de `colaboracion-ia/pedidos/` en la rama `colaboracion-ia` del repo `eliandelarosa24-hue/mani-gante`, y genera todas las imágenes».*
3. Las imágenes se suben a `entregas/<lote>/` con el nombre exacto (en GitHub: **Add file → Upload files**, rama `colaboracion-ia`). Si ChatGPT no puede subirlas, el dueño las descarga y las sube, o se las manda a Claude por el chat.
4. Claude las toma de `entregas/`, las edita (color, recorte 9:16, títulos de la Casa) y las usa en videos, posts e historias.
5. Cuando se publica algo, se marca en `estado.md`.

## Reglas de entrega
- Formato: **vertical 9:16** (1080×1920 o mayor) salvo que el pedido diga otro.
- **Sin texto dentro de la imagen** (títulos, sellos, badges): los pone Claude con la tipografía de la Casa.
- La bolsa debe verse **igual a la real**: adjunta en ChatGPT una foto real de la bolsa como referencia (etiqueta crema redonda con el elefante, «MANI-GANTE · PARA GENTE ELEGANTE Y GÁNSTER», QR y franja burdeo «ESCANEA PARA SABORES Y PAGO»).
- Nada de interfaces falsas (likes, vistas, logos de redes) ni marcas de terceros.
