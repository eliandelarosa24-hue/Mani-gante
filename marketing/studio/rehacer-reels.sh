#!/bin/sh
# Voces reales + edición final de los Reels rehechos del 23 de octubre al 15 de noviembre.
# Uso: NODE_USE_ENV_PROXY=1 ELEVENLABS_API_KEY=... sh rehacer-reels.sh   (la clave nunca se guarda en archivos)
set -e
[ -n "$ELEVENLABS_API_KEY" ] || { echo "Falta ELEVENLABS_API_KEY"; exit 1; }
for w in "1 R03E R04E" "2 R05E R06E R07E R08E" "3 R09E R10E R11E R12E" "4 R13E R14E R15E R16E"; do
  set -- $w; s=$1; shift
  SEMANA=$s node voz.mjs "$@"
  SEMANA=$s node edicion.mjs "$@"
done
