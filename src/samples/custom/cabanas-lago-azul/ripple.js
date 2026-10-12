// Agua que responde al tacto: una malla de alturas (ecuación de onda) se sube como textura y un
// shader desplaza la fotografía del hero solo bajo la línea del horizonte, con brillo especular.
const VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;v.y=1.-v.y;gl_Position=vec4(p,0.,1.);}';
const FS = `precision mediump float;varying vec2 v;uniform sampler2D img;uniform sampler2D hgt;uniform vec2 sc;uniform vec2 off;uniform vec2 px;uniform float hz;
void main(){
  vec2 iuv=v*sc+off;
  float m=smoothstep(hz,hz+.06,iuv.y);
  float hl=texture2D(hgt,v-vec2(px.x,0.)).r, hr=texture2D(hgt,v+vec2(px.x,0.)).r;
  float hu=texture2D(hgt,v-vec2(0.,px.y)).r, hd=texture2D(hgt,v+vec2(0.,px.y)).r;
  vec2 g=vec2(hr-hl,hd-hu)*m;
  vec4 c=texture2D(img,iuv+g*.09);
  float spec=pow(max(0.,dot(normalize(vec3(-g*7.,1.)),normalize(vec3(-.4,-.6,1.)))),40.)*m;
  gl_FragColor=vec4(c.rgb+spec*.32-g.y*.35,1.);
}`;

export function initRipple({ box, area = box, canvas, url, horizon = 0.5, reduced }) {
  if (reduced || !box || !canvas || !url) return;
  const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false });
  if (!gl) return;
  const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(pr, n);
  const tex = (unit) => { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); return t; };
  const tImg = tex(0), tH = tex(1);
  gl.uniform1i(U('img'), 0); gl.uniform1i(U('hgt'), 1); gl.uniform1f(U('hz'), horizon);

  // Malla de alturas
  const W = 200, H = 112;
  let a = new Float32Array(W * H), b = new Float32Array(W * H);
  const bytes = new Uint8Array(W * H);
  gl.uniform2f(U('px'), 1 / W, 1 / H);
  const drop = (x, y, r = 3, s = 1) => {
    const cx = Math.round(x * W), cy = Math.round(y * H);
    for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) {
      const d = Math.hypot(i, j); if (d > r) continue;
      const X = cx + i, Y = cy + j; if (X < 1 || Y < 1 || X >= W - 1 || Y >= H - 1) continue;
      a[Y * W + X] += s * (Math.cos((d / r) * Math.PI) + 1) * 0.5;
    }
  };
  const step = () => {
    for (let y = 1; y < H - 1; y++) for (let x = 1, i = y * W + 1; x < W - 1; x++, i++) {
      b[i] = ((a[i - 1] + a[i + 1] + a[i - W] + a[i + W]) * 0.5 - b[i]) * 0.982;
    }
    [a, b] = [b, a];
  };

  let iw = 1, ih = 1, ready = false;
  const img = new Image(); img.crossOrigin = 'anonymous';
  img.onload = () => {
    iw = img.naturalWidth; ih = img.naturalHeight;
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tImg);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    ready = true; resize(); canvas.classList.add('is-on');
  };
  img.src = url;

  function resize() {
    const r = box.getBoundingClientRect(), dpr = Math.min(1.5, devicePixelRatio || 1);
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    // Igual que background-size: cover centrado
    const ca = r.width / r.height, ia = iw / ih;
    const sx = ca > ia ? 1 : ca / ia, sy = ca > ia ? ia / ca : 1;
    gl.uniform2f(U('sc'), sx, sy); gl.uniform2f(U('off'), (1 - sx) / 2, (1 - sy) / 2);
  }
  addEventListener('resize', () => ready && resize());

  let last = 0;
  area.addEventListener('pointermove', (e) => {
    const r = box.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    const now = performance.now(); if (now - last < 16) return; last = now;
    drop(x, y, 3, e.pointerType === 'mouse' ? 0.5 : 0.8);
  });
  area.addEventListener('pointerdown', (e) => { const r = box.getBoundingClientRect(); drop((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height, 6, 2.6); });

  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(box);
  let t = 0;
  (function loop() {
    requestAnimationFrame(loop);
    if (!ready || !visible) return;
    // Gotas ocasionales: el lago nunca está del todo quieto
    if (++t % 70 === 0) drop(0.15 + Math.random() * 0.7, horizon + 0.12 + Math.random() * 0.4, 2, 0.6);
    step();
    for (let i = 0; i < a.length; i++) bytes[i] = Math.max(0, Math.min(255, 128 + a[i] * 64));
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tH);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, W, H, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, bytes);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  })();
}
