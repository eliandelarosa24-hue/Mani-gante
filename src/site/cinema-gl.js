// Proyector WebGL de la portada: una sola superficie a pantalla completa que muestra la foto de cada obra
// y pasa a la siguiente con un corte de cine (onda de luz que avanza con ruido, desplazamiento y grano).
// Sin librerías: un cuadro, dos texturas y un shader. Solo se usa en equipos con mouse y sin "reducir movimiento".

const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uA, uB;
uniform vec2 uRes, uSizeA, uSizeB, uPointer;
uniform float uMix, uTime, uVel, uDim, uSeed, uBlur, uZoom;
uniform vec3 uGlow;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }

// Encuadre "cover" con zoom lento y paralaje del puntero
vec2 cover(vec2 uv, vec2 size, float zoom, vec2 drift){
  float rs = uRes.x / uRes.y, ri = size.x / size.y;
  vec2 s = rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
  return (uv - 0.5) * s / zoom + 0.5 + drift;
}

// Muestra con separación de color y desenfoque de foco (sesgo de mipmap: el proyector cambia de foco)
vec3 sample3(sampler2D t, vec2 uv, float split){
  float b = uBlur * 4.5;
  return vec3(texture2D(t, uv + vec2(0.0, split), b).r, texture2D(t, uv, b).g, texture2D(t, uv - vec2(0.0, split), b).b);
}

void main(){
  vec2 uv = vUv;
  float m = uMix;
  // Frente de la transición: avanza de abajo hacia arriba con bordes de humo
  float n = fbm(uv * vec2(2.2, 3.4) + vec2(uSeed, uTime * 0.05));
  float front = uv.y * 0.62 + n * 0.38;
  float edgeW = 0.12;
  float k = smoothstep(m * (1.0 + edgeW) - edgeW, m * (1.0 + edgeW), front);   // 1 = sigue la imagen A
  float edge = (1.0 - abs(k * 2.0 - 1.0)) * step(0.001, m) * step(m, 0.999);

  vec2 drift = (uPointer - 0.5) * vec2(-0.012, 0.008);
  float breathe = 0.012 * sin(uTime * 0.18);
  float split = uVel * 0.003 + edge * 0.0035;

  // A se aleja y sube mientras se va; B llega desde un leve acercamiento
  vec2 uvA = cover(uv + vec2(0.0, -m * 0.06) + edge * vec2(0.0, 0.03) * (n - 0.5), uSizeA, 1.04 + m * 0.08 + breathe + uZoom * 0.1, drift);
  vec2 uvB = cover(uv + vec2(0.0, (1.0 - m) * 0.05) - edge * vec2(0.0, 0.03) * (n - 0.5), uSizeB, 1.16 - m * 0.12 + breathe, drift);
  vec3 a = sample3(uA, uvA, split);
  vec3 b = sample3(uB, uvB, split);
  vec3 col = mix(b, a, k);

  // Luz del proyector en el borde del corte
  col += uGlow * edge * edge * 0.75;

  // Lectura: oscurece la parte baja y los bordes (viñeta), deja respirar el centro
  float v = smoothstep(1.25, 0.25, length((uv - vec2(0.5, 0.55)) * vec2(1.1, 1.3)));
  float floorShade = smoothstep(0.0, 0.55, uv.y);
  float side = smoothstep(0.0, 0.78, uv.x);                       // el texto vive a la izquierda
  col *= mix(0.42, 1.0, v) * mix(0.55, 1.0, floorShade) * mix(0.6, 1.0, side) * uDim;

  // Grano de película
  float g = hash(uv * uRes + fract(uTime * 13.7) * 91.0) - 0.5;
  col += g * 0.055;
  gl_FragColor = vec4(col, 1.0);
}`;

export function createCinema(canvas, { onFirstFrame } = {}) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' })
    || canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) return null;
  const isGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;

  const sh = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  try {
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) { console.warn('cine: sin WebGL', e); return null; }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = {};
  for (const n of ['uA', 'uB', 'uRes', 'uSizeA', 'uSizeB', 'uPointer', 'uMix', 'uTime', 'uVel', 'uDim', 'uSeed', 'uGlow', 'uBlur', 'uZoom']) U[n] = gl.getUniformLocation(prog, n);
  gl.uniform1i(U.uA, 0);
  gl.uniform1i(U.uB, 1);

  // Texturas: se cargan a pedido y se guardan
  const tex = new Map(); // url -> { t, w, h, ready }
  const blank = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, blank);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([10, 9, 8, 255]));

  function load(url) {
    if (!url || tex.has(url)) return tex.get(url);
    const entry = { t: null, w: 16, h: 9, ready: false };
    tex.set(url, entry);
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    img.decode().then(() => {
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (isGL2) { gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); }
      else gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      Object.assign(entry, { t, w: img.naturalWidth, h: img.naturalHeight, ready: true });
      dirty = true;
    }).catch(() => {});
    return entry;
  }

  let urls = [], glows = [], pos = 0, vel = 0, dim = 1, blur = 0, zoom = 0, pointer = [0.5, 0.5], target = [0.5, 0.5];
  let dirty = true, raf = 0, running = false, visible = true, first = true;
  const t0 = performance.now();

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.uRes, w, h);
    dirty = true;
  }

  function frame(now) {
    raf = running ? requestAnimationFrame(frame) : 0;
    if (!visible) return;
    pointer[0] += (target[0] - pointer[0]) * 0.06;
    pointer[1] += (target[1] - pointer[1]) * 0.06;
    const i = Math.max(0, Math.min(urls.length - 1, Math.floor(pos)));
    const j = Math.min(urls.length - 1, i + 1);
    const m = i === j ? 0 : pos - i;
    const A = load(urls[i]), B = load(urls[j]);
    // Precarga la siguiente escena
    load(urls[j + 1]);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, A?.ready ? A.t : blank);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, B?.ready ? B.t : (A?.ready ? A.t : blank));
    gl.uniform2f(U.uSizeA, A?.w || 16, A?.h || 9);
    gl.uniform2f(U.uSizeB, (B?.ready ? B : A)?.w || 16, (B?.ready ? B : A)?.h || 9);
    gl.uniform1f(U.uMix, B?.ready ? m : 0);
    gl.uniform1f(U.uTime, (now - t0) / 1000);
    gl.uniform1f(U.uVel, Math.min(1, Math.abs(vel)));
    gl.uniform1f(U.uDim, dim);
    gl.uniform1f(U.uBlur, blur);
    gl.uniform1f(U.uZoom, zoom);
    gl.uniform1f(U.uSeed, i * 3.17);
    gl.uniform2f(U.uPointer, pointer[0], pointer[1]);
    const g = glows[j] || [1, 0.8, 0.6];
    gl.uniform3f(U.uGlow, g[0], g[1], g[2]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (first && A?.ready) { first = false; onFirstFrame?.(); }
    vel *= 0.9;
    dirty = false;
  }

  const hex = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16) / 255);
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const api = {
    setScenes(list) { urls = list.map((s) => s.image); glows = list.map((s) => hex(s.accent || '#ffcc99')); load(urls[0]); load(urls[1]); dirty = true; },
    set(p, v = 0) { pos = p; vel = v; dirty = true; },
    pointer(x, y) { target = [x, y]; },
    dim(d) { dim = d; },
    blur(b, z = 0) { blur = b; zoom = z; },
    visible(v) { visible = v; },
    start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } },
    stop() { running = false; cancelAnimationFrame(raf); },
    preload(url) { load(url); },
    destroy() { api.stop(); ro.disconnect(); for (const e of tex.values()) if (e.t) gl.deleteTexture(e.t); },
  };
  return api;
}
