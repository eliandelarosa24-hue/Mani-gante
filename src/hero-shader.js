// Fondo del hero: curvas de nivel animadas (topografía del sur) con luz cálida del Caribe.
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision mediump float;
uniform vec2 r; uniform float t; uniform vec2 m;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1,0)), u.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), u.x), u.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for(int i = 0; i < 5; i++){ v += a*n(p); p *= 2.02; a *= 0.5; } return v; }
void main(){
  vec2 uv = gl_FragCoord.xy / r.xy;
  vec2 p = (gl_FragCoord.xy - 0.5*r.xy) / r.y;
  p += (m - 0.5) * 0.15;
  float e = fbm(p*1.6 + vec2(t*0.02, -t*0.015)) + 0.35*fbm(p*3.2 - t*0.03);
  float lines = abs(fract(e*14.0) - 0.5);
  float w = fwidth(e*14.0);
  float c = 1.0 - smoothstep(0.0, w*1.4, lines);
  vec3 ink = vec3(0.043, 0.067, 0.055);
  vec3 sea = vec3(0.165, 0.55, 0.525);
  vec3 gold = vec3(0.77, 0.64, 0.35);
  vec3 tint = mix(sea, gold, smoothstep(0.2, 0.9, uv.x + 0.25*sin(t*0.1)));
  float glow = smoothstep(1.2, 0.0, length(p - vec2(0.55, 0.15)));
  vec3 col = ink + tint * c * (0.10 + 0.32*glow) + tint * glow * 0.06;
  gl_FragColor = vec4(col, 1.0);
}`;

export function initHeroShader(canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return;
  gl.getExtension('OES_standard_derivatives');
  const frag = '#extension GL_OES_standard_derivatives : enable\n' + FRAG;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
  const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return;
  const pr = gl.createProgram();
  gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  gl.useProgram(pr);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(pr, 'r'), uT = gl.getUniformLocation(pr, 't'), uM = gl.getUniformLocation(pr, 'm');

  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  window.addEventListener('pointermove', (e) => { mouse.tx = e.clientX / innerWidth; mouse.ty = 1 - e.clientY / innerHeight; }, { passive: true });

  // Se dibuja a resolución reducida (las curvas son suaves: el navegador la escala sin que se note)
  // y se adapta al equipo: si un cuadro tarda demasiado, baja la resolución y, si no basta, queda fija.
  let scale = matchMedia('(max-width: 900px)').matches ? 0.45 : 0.6;
  const resize = () => {
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  window.addEventListener('resize', resize);

  let visible = true, raf = 0, last = 0, slow = 0, frozen = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = performance.now();
  const draw = (now) => {
    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;
    gl.uniform2f(uR, canvas.width, canvas.height);
    gl.uniform1f(uT, reduced || frozen ? 8 : (now - start) / 1000);
    gl.uniform2f(uM, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  function loop(now) {
    raf = 0;
    if (!visible || frozen) return;
    raf = requestAnimationFrame(loop);
    if (now - last < 33) return; // ~30 cuadros por segundo bastan para un fondo lento
    const gap = now - last; last = now;
    const t0 = performance.now(); draw(now); gl.finish?.();
    const cost = performance.now() - t0;
    if (cost > 14 || gap > 80) slow++; else slow = Math.max(0, slow - 1);
    if (slow > 12) { slow = 0; if (scale > 0.3) { scale *= 0.7; resize(); } else { frozen = true; draw(now); } }
  }
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf && !reduced) raf = requestAnimationFrame(loop); }).observe(canvas);
  draw(start);
  if (reduced) return;
  // El movimiento parte cuando el navegador queda libre después de la carga
  const go = () => { if (!raf) raf = requestAnimationFrame(loop); };
  if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 2500 }); else setTimeout(go, 1500);
}
