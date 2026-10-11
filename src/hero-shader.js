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

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  window.addEventListener('resize', resize);

  let visible = true, raf = 0;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf) loop(); }).observe(canvas);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = performance.now();
  function loop() {
    raf = 0;
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    gl.uniform2f(uR, canvas.width, canvas.height);
    gl.uniform1f(uT, reduced ? 8 : (performance.now() - start) / 1000);
    gl.uniform2f(uM, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (visible && !reduced) raf = requestAnimationFrame(loop);
  }
  loop();
}
