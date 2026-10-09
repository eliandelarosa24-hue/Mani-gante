"""Post-proceso de css/tokens.css: el generador del design-system emite el modo oscuro como `.dark`;
aquí se reescribe para que responda a [data-theme="dark"] y a prefers-color-scheme."""
import sys
p = sys.argv[1] if len(sys.argv) > 1 else "css/tokens.css"
s = open(p).read()
i = s.index("/* === DARK MODE === */")
dark = s[i:]
body = dark[dark.index("{") + 1:dark.rindex("}")]
s = s[:i] + '/* === DARK MODE === */\n:root[data-theme="dark"] {' + body + '}\n@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {' + body.replace("\n  ", "\n    ") + "  }\n}\n"
open(p, "w").write(s)
