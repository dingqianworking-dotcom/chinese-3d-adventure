// Real-Time 60FPS GPU WebGL 3D Toy-Shader Diorama & Particle Engine
function mat4Identity() {
  return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
}
function mat4Mul(a, b) {
  const o = new Float32Array(16);
  for (let i = 0; i < 4; i++) {
    const ai0 = a[i], ai1 = a[i+4], ai2 = a[i+8], ai3 = a[i+12];
    o[i]    = ai0*b[0]  + ai1*b[1]  + ai2*b[2]  + ai3*b[3];
    o[i+4]  = ai0*b[4]  + ai1*b[5]  + ai2*b[6]  + ai3*b[7];
    o[i+8]  = ai0*b[8]  + ai1*b[9]  + ai2*b[10] + ai3*b[11];
    o[i+12] = ai0*b[12] + ai1*b[13] + ai2*b[14] + ai3*b[15];
  }
  return o;
}
function mat4Perspective(fovy, aspect, near, far) {
  const f = 1.0 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0
  ]);
}
function mat4LookAt(eye, center, up) {
  let zx = eye[0] - center[0], zy = eye[1] - center[1], zz = eye[2] - center[2];
  let len = Math.hypot(zx, zy, zz) || 1;
  zx /= len; zy /= len; zz /= len;
  let xx = up[1]*zz - up[2]*zy, xy = up[2]*zx - up[0]*zz, xz = up[0]*zy - up[1]*zx;
  len = Math.hypot(xx, xy, xz) || 1;
  xx /= len; xy /= len; xz /= len;
  const yx = zy*xz - zz*xy, yy = zz*xx - zx*xz, yz = zx*xy - zy*xx;
  return new Float32Array([
    xx, yx, zx, 0,
    xy, yy, zy, 0,
    xz, yz, zz, 0,
    -(xx*eye[0] + xy*eye[1] + xz*eye[2]),
    -(yx*eye[0] + yy*eye[1] + yz*eye[2]),
    -(zx*eye[0] + zy*eye[1] + zz*eye[2]),
    1
  ]);
}
function mat4TRS(pos, rot, scl) {
  const [px, py, pz] = pos;
  const [rx, ry, rz] = rot;
  const [sx, sy, sz] = scl;
  const cx = Math.cos(rx), sxn = Math.sin(rx);
  const cy = Math.cos(ry), syn = Math.sin(ry);
  const cz = Math.cos(rz), szn = Math.sin(rz);
  const r00 = cy*cz, r01 = sxn*syn*cz - cx*szn, r02 = cx*syn*cz + sxn*szn;
  const r10 = cy*szn, r11 = sxn*syn*szn + cx*cz, r12 = cx*syn*szn - sxn*cz;
  const r20 = -syn,   r21 = sxn*cy,              r22 = cx*cy;
  return new Float32Array([
    r00*sx, r10*sx, r20*sx, 0,
    r01*sy, r11*sy, r21*sy, 0,
    r02*sz, r12*sz, r22*sz, 0,
    px, py, pz, 1
  ]);
}

function hexToRgb(hex) {
  const v = parseInt(hex.replace('#', ''), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

// Procedural 3D Mesh Builders (returns { pos, norm, idx })
function buildSphere(lat = 18, lon = 24) {
  const pos = [], norm = [], idx = [];
  for (let y = 0; y <= lat; y++) {
    const v = y / lat, theta = v * Math.PI;
    const st = Math.sin(theta), ct = Math.cos(theta);
    for (let x = 0; x <= lon; x++) {
      const u = x / lon, phi = u * Math.PI * 2;
      const nx = -Math.cos(phi) * st, ny = ct, nz = Math.sin(phi) * st;
      pos.push(nx * 0.5, ny * 0.5, nz * 0.5);
      norm.push(nx, ny, nz);
    }
  }
  for (let y = 0; y < lat; y++) {
    for (let x = 0; x < lon; x++) {
      const a = y * (lon + 1) + x, b = a + lon + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  return { pos, norm, idx };
}

function buildCylinder(rTop = 0.5, rBot = 0.5, seg = 20) {
  const pos = [], norm = [], idx = [];
  const slope = rBot - rTop;
  for (let y = 0; y <= 1; y++) {
    const r = y === 0 ? rBot : rTop;
    const py = y - 0.5;
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      const c = Math.cos(a), s = Math.sin(a);
      const nl = Math.hypot(1, slope);
      pos.push(c * r, py, s * r);
      norm.push(c / nl, slope / nl, s / nl);
    }
  }
  for (let i = 0; i < seg; i++) {
    const a = i, b = i + seg + 1;
    idx.push(a, a + 1, b, a + 1, b + 1, b);
  }
  // Top cap
  if (rTop > 0.001) {
    const tc = pos.length / 3;
    pos.push(0, 0.5, 0); norm.push(0, 1, 0);
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      pos.push(Math.cos(a) * rTop, 0.5, Math.sin(a) * rTop);
      norm.push(0, 1, 0);
    }
    for (let i = 0; i < seg; i++) idx.push(tc, tc + i + 2, tc + i + 1);
  }
  // Bottom cap
  if (rBot > 0.001) {
    const bc = pos.length / 3;
    pos.push(0, -0.5, 0); norm.push(0, -1, 0);
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      pos.push(Math.cos(a) * rBot, -0.5, Math.sin(a) * rBot);
      norm.push(0, -1, 0);
    }
    for (let i = 0; i < seg; i++) idx.push(bc, bc + i + 1, bc + i + 2);
  }
  return { pos, norm, idx };
}

function buildBox() {
  const faces = [
    { n:[0,0,1],  v:[[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]] },
    { n:[0,0,-1], v:[[.5,-.5,-.5],[-.5,-.5,-.5],[-.5,.5,-.5],[.5,.5,-.5]] },
    { n:[0,1,0],  v:[[-.5,.5,.5],[.5,.5,.5],[.5,.5,-.5],[-.5,.5,-.5]] },
    { n:[0,-1,0], v:[[-.5,-.5,-.5],[.5,-.5,-.5],[.5,-.5,.5],[-.5,-.5,.5]] },
    { n:[1,0,0],  v:[[.5,-.5,.5],[.5,-.5,-.5],[.5,.5,-.5],[.5,.5,.5]] },
    { n:[-1,0,0], v:[[-.5,-.5,-.5],[-.5,-.5,.5],[-.5,.5,.5],[-.5,.5,-.5]] },
  ];
  const pos = [], norm = [], idx = [];
  faces.forEach((f, fi) => {
    f.v.forEach((p) => { pos.push(...p); norm.push(...f.n); });
    const o = fi * 4;
    idx.push(o, o+1, o+2, o, o+2, o+3);
  });
  return { pos, norm, idx };
}

function buildTorus(R = 0.4, r = 0.12, seg = 28, tube = 14, arc = Math.PI * 2) {
  const pos = [], norm = [], idx = [];
  for (let i = 0; i <= seg; i++) {
    const u = (i / seg) * arc;
    const cu = Math.cos(u), su = Math.sin(u);
    for (let j = 0; j <= tube; j++) {
      const v = (j / tube) * Math.PI * 2;
      const cv = Math.cos(v), sv = Math.sin(v);
      const nx = cu * cv, ny = su * cv, nz = sv;
      pos.push((R + r * cv) * cu, (R + r * cv) * su, r * sv);
      norm.push(nx, ny, nz);
    }
  }
  for (let i = 0; i < seg; i++) {
    for (let j = 0; j < tube; j++) {
      const a = i * (tube + 1) + j, b = a + tube + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  return { pos, norm, idx };
}

function buildStar(points = 5, outerR = 0.5, innerR = 0.23, depth = 0.16) {
  const pos = [], norm = [], idx = [];
  const total = points * 2;
  const ring = [];
  for (let i = 0; i < total; i++) {
    const a = (i / total) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    ring.push([Math.cos(a) * r, -Math.sin(a) * r]);
  }
  const addTri = (p0, p1, p2) => {
    const ux = p1[0]-p0[0], uy = p1[1]-p0[1], uz = p1[2]-p0[2];
    const vx = p2[0]-p0[0], vy = p2[1]-p0[1], vz = p2[2]-p0[2];
    let nx = uy*vz - uz*vy, ny = uz*vx - ux*vz, nz = ux*vy - uy*vx;
    const l = Math.hypot(nx, ny, nz) || 1;
    nx /= l; ny /= l; nz /= l;
    const base = pos.length / 3;
    pos.push(...p0, ...p1, ...p2);
    norm.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
    idx.push(base, base + 1, base + 2);
  };
  for (let i = 0; i < total; i++) {
    const [x0, y0] = ring[i];
    const [x1, y1] = ring[(i + 1) % total];
    addTri([0, 0, depth], [x0, y0, 0], [x1, y1, 0]);
    addTri([0, 0, -depth], [x1, y1, 0], [x0, y0, 0]);
  }
  return { pos, norm, idx };
}

class Node3D {
  constructor(opts = {}) {
    this.geo = opts.geo || null;
    this.color = opts.color ? hexToRgb(opts.color) : [1, 1, 1];
    this.pos = opts.pos ? [...opts.pos] : [0, 0, 0];
    this.rot = opts.rot ? [...opts.rot] : [0, 0, 0];
    this.scale = opts.scale
      ? (typeof opts.scale === 'number' ? [opts.scale, opts.scale, opts.scale] : [...opts.scale])
      : [1, 1, 1];
    this.gloss = opts.gloss !== undefined ? opts.gloss : 0.55;
    this.rim = opts.rim !== undefined ? opts.rim : 0.35;
    this.alpha = opts.alpha !== undefined ? opts.alpha : 1.0;
    this.emissive = opts.emissive !== undefined ? opts.emissive : 0.0;
    this.children = [];
    this.tag = opts.tag || '';
  }
  add(child) {
    this.children.push(child);
    return child;
  }
}

class World3DEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    this.sceneKey = 'hub_g1';
    this.petId = 'shiba';
    this.time = 0;
    this.userYaw = 0;
    this.targetYaw = 0;
    this.dragging = false;
    this.lastX = 0;
    this.fever = false;
    this.bossHpRatio = 1.0;
    this.bossHitFlash = 0;
    this.petCheerTimer = 0;
    this.gachaSpinTimer = 0;
    this.showcasePetId = null;
    this.particles = [];
    this.projectiles = [];
    this.root = new Node3D();
    this.diorama = new Node3D();
    this.petRoot = new Node3D({ pos: [2.35, -0.35, 0.8] });
    this.cloudsRoot = new Node3D();
    this.root.add(this.cloudsRoot);
    this.root.add(this.diorama);
    this.root.add(this.petRoot);

    if (this.gl) this.initGL();
    this.buildClouds();
    this.setScene('hub_g1');
    this.setPet('shiba');
    this.bindInput();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  initGL() {
    const gl = this.gl;
    const vs = `
      attribute vec3 aPos;
      attribute vec3 aNorm;
      uniform mat4 uMVP;
      uniform mat4 uModel;
      varying vec3 vNorm;
      varying vec3 vWorldPos;
      void main() {
        vec4 wp = uModel * vec4(aPos, 1.0);
        vWorldPos = wp.xyz;
        vNorm = normalize(mat3(uModel) * aNorm);
        gl_Position = uMVP * vec4(aPos, 1.0);
      }
    `;
    const fs = `
      precision mediump float;
      varying vec3 vNorm;
      varying vec3 vWorldPos;
      uniform vec3 uColor;
      uniform vec3 uEye;
      uniform float uGloss;
      uniform float uRim;
      uniform float uAlpha;
      uniform float uEmissive;
      uniform float uFlash;
      void main() {
        vec3 N = normalize(vNorm);
        vec3 L = normalize(vec3(0.55, 0.85, 0.65));
        vec3 V = normalize(uEye - vWorldPos);
        vec3 H = normalize(L + V);

        float ndl = dot(N, L);
        // Smooth Pixar/Nintendo warm toon-diffuse
        float diff = smoothstep(-0.22, 0.65, ndl) * 0.68 + 0.36;
        vec3 hemi = mix(vec3(0.84, 0.88, 1.0), vec3(1.04, 1.01, 0.96), N.y * 0.5 + 0.5);

        float spec = pow(max(dot(N, H), 0.0), 28.0) * uGloss;
        float fres = pow(1.0 - max(dot(N, V), 0.0), 2.6) * uRim;

        vec3 col = uColor * hemi * diff + vec3(1.0, 0.98, 0.92) * spec * 0.65 + mix(uColor, vec3(1.0), 0.65) * fres;
        col = mix(col, uColor * 1.25 + vec3(0.28), uEmissive);
        col = mix(col, vec3(1.0, 0.96, 0.82), uFlash);
        gl_FragColor = vec4(col, uAlpha);
      }
    `;
    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    this.prog = prog;

    this.locs = {
      aPos: gl.getAttribLocation(prog, 'aPos'),
      aNorm: gl.getAttribLocation(prog, 'aNorm'),
      uMVP: gl.getUniformLocation(prog, 'uMVP'),
      uModel: gl.getUniformLocation(prog, 'uModel'),
      uColor: gl.getUniformLocation(prog, 'uColor'),
      uEye: gl.getUniformLocation(prog, 'uEye'),
      uGloss: gl.getUniformLocation(prog, 'uGloss'),
      uRim: gl.getUniformLocation(prog, 'uRim'),
      uAlpha: gl.getUniformLocation(prog, 'uAlpha'),
      uEmissive: gl.getUniformLocation(prog, 'uEmissive'),
      uFlash: gl.getUniformLocation(prog, 'uFlash'),
    };

    const upload = (m) => {
      const pb = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pb);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(m.pos), gl.STATIC_DRAW);
      const nb = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, nb);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(m.norm), gl.STATIC_DRAW);
      const ib = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(m.idx), gl.STATIC_DRAW);
      return { pb, nb, ib, count: m.idx.length };
    };

    this.meshes = {
      sphere: upload(buildSphere(18, 24)),
      cyl: upload(buildCylinder(0.5, 0.5, 20)),
      cone: upload(buildCylinder(0.0, 0.5, 20)),
      frustum: upload(buildCylinder(0.36, 0.52, 20)),
      bowl: upload(buildCylinder(0.55, 0.34, 22)),
      box: upload(buildBox()),
      torus: upload(buildTorus(0.42, 0.1, 26, 12)),
      arch: upload(buildTorus(0.5, 0.06, 28, 10, Math.PI)),
      star: upload(buildStar(5, 0.5, 0.23, 0.16)),
    };

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  bindInput() {
    const start = (x) => { this.dragging = true; this.lastX = x; };
    const move = (x) => {
      if (!this.dragging) return;
      const dx = x - this.lastX;
      this.lastX = x;
      this.targetYaw += dx * 0.01;
    };
    const end = () => { this.dragging = false; };
    this.canvas.addEventListener('mousedown', (e) => start(e.clientX));
    window.addEventListener('mousemove', (e) => move(e.clientX));
    window.addEventListener('mouseup', end);
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches[0]) start(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches[0]) move(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchend', end);
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(300, this.canvas.clientWidth || window.innerWidth);
    const h = Math.max(220, this.canvas.clientHeight || window.innerHeight);
    if (this.canvas.width !== Math.floor(w * dpr) || this.canvas.height !== Math.floor(h * dpr)) {
      this.canvas.width = Math.floor(w * dpr);
      this.canvas.height = Math.floor(h * dpr);
    }
    if (this.gl) this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  buildClouds() {
    this.cloudsRoot.children = [];
    // 1. Fluffy 3D clouds
    const positions = [
      [-3.3, 1.05, -2.5, 0.78],
      [3.4, 1.12, -2.6, 0.84],
      [-1.85, 1.35, -3.1, 0.65],
      [1.85, 1.32, -3.0, 0.68],
    ];
    positions.forEach(([x, y, z, s], idx) => {
      const c = new Node3D({ pos: [x, y, z], scale: s, tag: `cloud_${idx}` });
      c.add(new Node3D({ geo: 'sphere', pos: [0, 0, 0], scale: [1.1, 0.62, 0.68], color: '#ffffff', gloss: 0.25, alpha: 0.92 }));
      c.add(new Node3D({ geo: 'sphere', pos: [-0.48, -0.08, 0.05], scale: [0.75, 0.48, 0.52], color: '#f8fafc', gloss: 0.2, alpha: 0.92 }));
      c.add(new Node3D({ geo: 'sphere', pos: [0.48, -0.06, 0.04], scale: [0.8, 0.5, 0.55], color: '#f8fafc', gloss: 0.2, alpha: 0.92 }));
      this.cloudsRoot.add(c);
    });

    // 2. Glowing 3D Sun + spinning ray star
    const sun = new Node3D({ pos: [-3.15, 1.05, -3.3] });
    sun.add(new Node3D({ geo: 'sphere', scale: 0.58, color: '#fde047', emissive: 0.75, gloss: 0.85 }));
    sun.add(new Node3D({ geo: 'star', pos: [0, 0, -0.08], scale: 1.05, color: '#fb923c', emissive: 0.45, tag: 'spin_slow' }));
    this.cloudsRoot.add(sun);

    // 3. 7-Color 3D Rainbow Arch spanning the sky behind the main island
    const rainbowColors = ['#ef4444', '#f97316', '#fde047', '#4ade80', '#38bdf8', '#6366f1', '#c084fc'];
    const rainbow = new Node3D({ pos: [0, -0.45, -3.8] });
    rainbowColors.forEach((col, i) => {
      const s = 4.6 - i * 0.22;
      rainbow.add(new Node3D({
        geo: 'arch',
        pos: [0, 0, -i * 0.02],
        scale: [s, s * 0.78, 0.85],
        color: col,
        emissive: 0.35,
        alpha: 0.88,
      }));
    });
    this.cloudsRoot.add(rainbow);

    // 4. Two Floating Satellite Mini-Islands with pine trees & stars
    [
      { pos: [-2.85, -0.18, -1.75], top: '#4ade80', rock: '#d97706', scale: 0.48 },
      { pos: [2.95, 0.02, -1.85], top: '#34d399', rock: '#b45309', scale: 0.44 },
    ].forEach((mini, idx) => {
      const mi = new Node3D({ pos: mini.pos, scale: mini.scale, tag: `cloud_${idx + 4}` });
      mi.add(new Node3D({ geo: 'cyl', pos: [0, 0.1, 0], scale: [1.6, 0.24, 1.6], color: mini.top }));
      mi.add(new Node3D({ geo: 'cone', pos: [0, -0.35, 0], scale: [1.3, 0.75, 1.3], rot: [Math.PI, 0, 0], color: mini.rock }));
      mi.add(new Node3D({ geo: 'cone', pos: [-0.25, 0.55, 0], scale: [0.55, 0.85, 0.55], color: '#16a34a' }));
      mi.add(new Node3D({ geo: 'star', pos: [0.35, 0.55, 0.1], scale: 0.32, color: '#fde047', emissive: 0.55, tag: 'spin' }));
      this.cloudsRoot.add(mi);
    });

    // 5. Two Drifting 3D Hot-Air Balloons
    [
      { pos: [-2.1, 0.72, -2.35], c1: '#fb7185', c2: '#fde047' },
      { pos: [2.25, 0.82, -2.45], c1: '#38bdf8', c2: '#c084fc' },
    ].forEach((b, idx) => {
      const bal = new Node3D({ pos: b.pos, scale: 0.42, tag: `cloud_${idx + 6}` });
      bal.add(new Node3D({ geo: 'sphere', pos: [0, 0.45, 0], scale: [0.75, 0.88, 0.75], color: b.c1, gloss: 0.75 }));
      bal.add(new Node3D({ geo: 'torus', pos: [0, 0.45, 0], rot: [Math.PI / 2, 0, 0], scale: 0.9, color: b.c2, gloss: 0.6 }));
      bal.add(new Node3D({ geo: 'box', pos: [0, -0.32, 0], scale: 0.3, color: '#b45309' }));
      this.cloudsRoot.add(bal);
    });

    // 6. Floating 3D sky stars for extra depth & sparkle
    [[-2.55, 0.35, -2.1], [2.7, 0.48, -2.0], [-0.95, 1.25, -2.4], [1.05, 1.22, -2.4]].forEach(([x, y, z], i) => {
      this.cloudsRoot.add(new Node3D({
        geo: 'star',
        pos: [x, y, z],
        scale: 0.22 + (i % 2) * 0.06,
        color: '#fde047',
        emissive: 0.55,
        tag: 'spin',
      }));
    });
  }

  makeIslandBase(topColor = '#4ade80', rockColor = '#d97706') {
    const base = new Node3D({ pos: [0, -0.82, 0] });
    base.add(new Node3D({ geo: 'cyl', pos: [0, 0.16, 0], scale: [3.02, 0.28, 3.02], color: topColor, gloss: 0.5 }));
    base.add(new Node3D({ geo: 'torus', pos: [0, 0.14, 0], rot: [Math.PI / 2, 0, 0], scale: [3.45, 3.45, 0.55], color: '#fde047', gloss: 0.85, emissive: 0.18 }));
    base.add(new Node3D({ geo: 'frustum', pos: [0, -0.32, 0], scale: [2.65, 0.76, 2.65], color: rockColor, gloss: 0.25 }));
    base.add(new Node3D({ geo: 'cone', pos: [0, -0.86, 0], scale: [1.3, 0.62, 1.3], color: '#38bdf8', rot: [Math.PI, 0, 0], gloss: 0.9, emissive: 0.45 }));
    return base;
  }

  makeEyes(parent, y = 0.08, z = 0.42, spread = 0.16, size = 0.09) {
    [-spread, spread].forEach((x) => {
      parent.add(new Node3D({ geo: 'sphere', pos: [x, y, z], scale: size, color: '#1e293b', gloss: 0.9 }));
      parent.add(new Node3D({ geo: 'sphere', pos: [x + 0.02, y + 0.025, z + 0.035], scale: size * 0.36, color: '#ffffff', emissive: 0.6 }));
    });
  }

  buildPetModel(petId) {
    const p = new Node3D();
    // Floating mini star pad under pet
    const pad = new Node3D({ pos: [0, -0.52, 0] });
    pad.add(new Node3D({ geo: 'cyl', pos: [0, 0, 0], scale: [0.95, 0.14, 0.95], color: '#fde047', gloss: 0.7 }));
    pad.add(new Node3D({ geo: 'cyl', pos: [0, -0.1, 0], scale: [0.78, 0.12, 0.78], color: '#f59e0b', gloss: 0.5 }));
    p.add(pad);

    const body = new Node3D({ pos: [0, 0, 0], tag: 'pet_body' });
    p.add(body);

    const configs = {
      shiba: { c1: '#f59e0b', c2: '#fef3c7', ear: 'cone', tail: '#f59e0b' },
      unicorn: { c1: '#f9a8d4', c2: '#ffffff', horn: '#fde047', ear: 'cone' },
      koi: { c1: '#fb7185', c2: '#fde047', fin: true },
      bunny: { c1: '#ffffff', c2: '#fbcfe8', longEar: true },
      sheep: { c1: '#f8fafc', c2: '#fde68a', fluffy: true },
      deer: { c1: '#fb923c', c2: '#fef08a', antler: true },
      alien: { c1: '#4ade80', c2: '#bbf7d0', threeEyes: true, antenna: true },
      panda: { c1: '#ffffff', c2: '#1e293b', roundEar: true },
      lion: { c1: '#fbbf24', c2: '#ea580c', mane: true },
      butterfly: { c1: '#a78bfa', c2: '#f472b6', wings: true },
      dino: { c1: '#34d399', c2: '#fef08a', crown: true },
      dragon: { c1: '#facc15', c2: '#ef4444', horn: '#ffffff', wings: true, crown: true },
    };
    const cfg = configs[petId] || configs.shiba;

    // Torso & Head
    body.add(new Node3D({ geo: 'sphere', pos: [0, -0.16, 0], scale: [0.56, 0.52, 0.52], color: cfg.c1, gloss: 0.65 }));
    const head = new Node3D({ geo: 'sphere', pos: [0, 0.24, 0.04], scale: [0.58, 0.52, 0.54], color: cfg.c1, gloss: 0.7 });
    body.add(head);
    body.add(new Node3D({ geo: 'sphere', pos: [0, 0.18, 0.25], scale: [0.3, 0.22, 0.18], color: cfg.c2, gloss: 0.5 }));
    // Cheeks
    [-0.2, 0.2].forEach((x) => {
      body.add(new Node3D({ geo: 'sphere', pos: [x, 0.18, 0.25], scale: [0.1, 0.07, 0.06], color: '#fb7185', emissive: 0.25 }));
    });

    if (cfg.threeEyes) {
      [-0.14, 0, 0.14].forEach((x) => {
        body.add(new Node3D({ geo: 'sphere', pos: [x, 0.28, 0.29], scale: 0.085, color: '#0f172a', gloss: 0.9 }));
      });
    } else {
      this.makeEyes(body, 0.27, 0.28, 0.14, 0.085);
    }

    if (cfg.ear === 'cone') {
      [-0.18, 0.18].forEach((x) => {
        body.add(new Node3D({ geo: 'cone', pos: [x, 0.52, 0.04], scale: [0.18, 0.24, 0.16], rot: [0, 0, x < 0 ? 0.25 : -0.25], color: cfg.c1 }));
      });
    }
    if (cfg.longEar) {
      [-0.15, 0.15].forEach((x) => {
        body.add(new Node3D({ geo: 'sphere', pos: [x, 0.62, 0.02], scale: [0.15, 0.44, 0.1], color: '#ffffff' }));
        body.add(new Node3D({ geo: 'sphere', pos: [x, 0.62, 0.06], scale: [0.09, 0.32, 0.06], color: '#f472b6' }));
      });
    }
    if (cfg.roundEar) {
      [-0.22, 0.22].forEach((x) => {
        body.add(new Node3D({ geo: 'sphere', pos: [x, 0.5, 0.02], scale: 0.18, color: cfg.c2 }));
      });
      [-0.14, 0.14].forEach((x) => {
        body.add(new Node3D({ geo: 'sphere', pos: [x, 0.27, 0.24], scale: [0.15, 0.13, 0.08], color: '#1e293b' }));
      });
    }
    if (cfg.fluffy) {
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        body.add(new Node3D({ geo: 'sphere', pos: [Math.cos(a)*0.22, 0.35 + Math.sin(a)*0.08, Math.sin(a)*0.18], scale: 0.22, color: '#ffffff' }));
      }
    }
    if (cfg.mane) {
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        body.add(new Node3D({ geo: 'sphere', pos: [Math.cos(a)*0.29, 0.25 + Math.sin(a)*0.28, -0.02], scale: 0.18, color: '#ea580c' }));
      }
    }
    if (cfg.horn) {
      body.add(new Node3D({ geo: 'cone', pos: [0, 0.6, 0.15], scale: [0.12, 0.32, 0.12], rot: [0.3, 0, 0], color: cfg.horn, emissive: 0.35 }));
    }
    if (cfg.antler) {
      [-0.18, 0.18].forEach((x) => {
        body.add(new Node3D({ geo: 'cyl', pos: [x, 0.58, 0.02], scale: [0.06, 0.32, 0.06], rot: [0, 0, x < 0 ? 0.3 : -0.3], color: '#eab308' }));
        body.add(new Node3D({ geo: 'cyl', pos: [x * 1.4, 0.64, 0.02], scale: [0.05, 0.18, 0.05], rot: [0, 0, x < 0 ? 0.9 : -0.9], color: '#eab308' }));
      });
    }
    if (cfg.antenna) {
      body.add(new Node3D({ geo: 'cyl', pos: [0, 0.56, 0.04], scale: [0.05, 0.24, 0.05], color: '#22c55e' }));
      body.add(new Node3D({ geo: 'sphere', pos: [0, 0.7, 0.04], scale: 0.12, color: '#fde047', emissive: 0.5 }));
    }
    if (cfg.wings) {
      [-0.34, 0.34].forEach((x) => {
        body.add(new Node3D({ geo: 'sphere', pos: [x, -0.04, -0.14], scale: [0.36, 0.28, 0.08], rot: [0, x < 0 ? 0.4 : -0.4, 0], color: cfg.c2, emissive: 0.2 }));
      });
    }
    if (cfg.fin) {
      body.add(new Node3D({ geo: 'cone', pos: [0, -0.15, -0.36], scale: [0.34, 0.32, 0.14], rot: [-Math.PI/2, 0, 0], color: '#fde047' }));
    }
    if (cfg.crown) {
      body.add(new Node3D({ geo: 'cyl', pos: [0, 0.55, 0.04], scale: [0.26, 0.14, 0.26], color: '#facc15', emissive: 0.3 }));
      body.add(new Node3D({ geo: 'star', pos: [0, 0.65, 0.16], scale: 0.14, color: '#ef4444', emissive: 0.4 }));
    }
    return p;
  }

  setPet(petId) {
    this.petId = petId || 'shiba';
    this.petRoot.children = [this.buildPetModel(this.petId)];
  }

  cheerPet() {
    this.petCheerTimer = 1.1;
    this.spawnBurst([2.2, 0.25, 0.9], 18, ['#fde047', '#fb7185', '#38bdf8', '#4ade80']);
  }

  fireBossCannon() {
    this.projectiles.push({
      pos: [1.8, -0.2, 1.8],
      target: [0, 0.35, 0],
      t: 0,
    });
  }

  spawnBurst(origin = [0, 0.3, 0.5], count = 24, palette = ['#fde047', '#fb7185', '#38bdf8', '#4ade80', '#fb923c']) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const up = 1.4 + Math.random() * 2.6;
      const spd = 1.1 + Math.random() * 2.4;
      this.particles.push({
        pos: [...origin],
        vel: [Math.cos(a) * spd, up, Math.sin(a) * spd],
        rot: [Math.random()*3, Math.random()*3, 0],
        scale: 0.14 + Math.random() * 0.15,
        color: hexToRgb(palette[i % palette.length]),
        geo: i % 2 === 0 ? 'star' : 'sphere',
        life: 1.0,
      });
    }
  }

  setScene(key) {
    this.sceneKey = key;
    this.userYaw = 0;
    this.targetYaw = 0;
    this.diorama.children = [];
    this.showcasePetId = null;
    const d = this.diorama;

    // Keep WebGL purely for 3D starlight bursts & cannonballs outside Gacha so Pixar 3D artwork shines cleanly!
    this.petRoot.scale = [0.001, 0.001, 0.001];
    this.cloudsRoot.scale = [0.001, 0.001, 0.001];
    if (key !== 'gacha') return;

    if (key === 'hub_g1' || key === 'hub_g2') {
      const isG1 = key === 'hub_g1';
      d.add(this.makeIslandBase(isG1 ? '#38bdf8' : '#4ade80', isG1 ? '#0284c7' : '#d97706'));
      // Central Magical Tower / Lighthouse
      d.add(new Node3D({ geo: 'frustum', pos: [0, -0.28, 0], scale: [0.82, 1.05, 0.82], color: '#fef9c3' }));
      d.add(new Node3D({ geo: 'cone', pos: [0, 0.48, 0], scale: [1.1, 0.58, 1.1], color: isG1 ? '#fb7185' : '#f97316' }));
      const topStar = new Node3D({ geo: 'star', pos: [0, 0.96, 0], scale: 0.42, color: '#fde047', emissive: 0.45, tag: 'spin' });
      d.add(topStar);
      // Orbiting mini islands representing lessons!
      const colors = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#f472b6'];
      const count = isG1 ? 7 : 6;
      const ring = new Node3D({ tag: 'orbit_ring' });
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const mini = new Node3D({ pos: [Math.cos(a) * 1.95, 0.12 + (i % 2) * 0.2, Math.sin(a) * 1.95] });
        mini.add(new Node3D({ geo: 'cyl', pos: [0, 0, 0], scale: [0.55, 0.14, 0.55], color: colors[i % colors.length] }));
        mini.add(new Node3D({ geo: 'cone', pos: [0, -0.18, 0], scale: [0.42, 0.28, 0.42], rot: [Math.PI, 0, 0], color: '#b45309' }));
        mini.add(new Node3D({ geo: 'star', pos: [0, 0.24, 0], scale: 0.22, color: '#fde047', emissive: 0.3 }));
        ring.add(mini);
      }
      d.add(ring);
    } else if (key === 'g1_L1') {
      // L1 小船: 3D Ocean waves + Origami Paper Boat + Jumping Fish
      d.add(this.makeIslandBase('#0ea5e9', '#0369a1'));
      for (let i = -2; i <= 2; i++) {
        d.add(new Node3D({ geo: 'cyl', pos: [i * 0.48, -0.72, 0], scale: [0.38, 0.12, 2.2], rot: [0, 0, Math.PI/2], color: '#38bdf8', tag: `sea_wave_${i+2}` }));
      }
      const boat = new Node3D({ pos: [0, -0.35, 0], tag: 'boat' });
      boat.add(new Node3D({ geo: 'frustum', pos: [0, 0, 0], scale: [1.45, 0.34, 0.72], rot: [Math.PI, 0, 0], color: '#ffffff', gloss: 0.7 }));
      boat.add(new Node3D({ geo: 'cone', pos: [0, 0.45, 0], scale: [0.75, 0.72, 0.14], color: '#fef08a', gloss: 0.5 }));
      boat.add(new Node3D({ geo: 'cone', pos: [0.35, 0.32, 0], scale: [0.45, 0.48, 0.12], color: '#bae6fd' }));
      d.add(boat);
      [-1, 1].forEach((dir, idx) => {
        const fish = new Node3D({ pos: [dir * 0.95, -0.3, dir * 0.55], tag: `fish_${idx}` });
        fish.add(new Node3D({ geo: 'sphere', pos: [0, 0, 0], scale: [0.34, 0.22, 0.18], color: '#fb923c', gloss: 0.8 }));
        fish.add(new Node3D({ geo: 'cone', pos: [-0.22, 0, 0], scale: [0.18, 0.22, 0.1], rot: [0, 0, -Math.PI/2], color: '#f97316' }));
        d.add(fish);
      });
    } else if (key === 'g1_L2') {
      // L2 印手印: Flower Garden + Giant Colorful 3D Handprint Totem
      d.add(this.makeIslandBase('#4ade80', '#ca8a04'));
      const hand = new Node3D({ pos: [0, -0.08, 0], tag: 'wave_hand' });
      hand.add(new Node3D({ geo: 'sphere', pos: [0, 0, 0], scale: [0.78, 0.72, 0.26], color: '#fb7185', gloss: 0.75 }));
      const fingerAngles = [-0.55, -0.25, 0, 0.26, 0.56];
      const fingerCols = ['#facc15', '#fb923c', '#f43f5e', '#a855f7', '#38bdf8'];
      fingerAngles.forEach((a, i) => {
        hand.add(new Node3D({
          geo: 'cyl',
          pos: [Math.sin(a) * 0.52, Math.cos(a) * 0.52, 0],
          scale: [0.16, 0.44, 0.16],
          rot: [0, 0, -a],
          color: fingerCols[i],
        }));
      });
      this.makeEyes(hand, 0.04, 0.14, 0.15, 0.08);
      d.add(hand);
      // 3D Flowers
      [[-0.9, -0.65, 0.6, '#f43f5e'], [0.92, -0.65, 0.55, '#facc15'], [-0.65, -0.65, -0.7, '#38bdf8'], [0.75, -0.65, -0.6, '#fb923c']].forEach(([x, y, z, col]) => {
        const fl = new Node3D({ pos: [x, y, z] });
        fl.add(new Node3D({ geo: 'cyl', pos: [0, 0.15, 0], scale: [0.06, 0.3, 0.06], color: '#16a34a' }));
        fl.add(new Node3D({ geo: 'sphere', pos: [0, 0.32, 0], scale: 0.14, color: '#fde047' }));
        for (let p = 0; p < 5; p++) {
          const pa = (p / 5) * Math.PI * 2;
          fl.add(new Node3D({ geo: 'sphere', pos: [Math.cos(pa)*0.15, 0.32, Math.sin(pa)*0.15], scale: 0.13, color: col }));
        }
        d.add(fl);
      });
    } else if (key === 'g1_L3') {
      // L3 吹泡泡: Glossy Floating 3D Bubbles + Magic Bubble Wand
      d.add(this.makeIslandBase('#86efac', '#d97706'));
      const wand = new Node3D({ pos: [-0.75, -0.2, 0.2], rot: [0, 0, -0.35] });
      wand.add(new Node3D({ geo: 'cyl', pos: [0, -0.25, 0], scale: [0.1, 0.65, 0.1], color: '#f43f5e' }));
      wand.add(new Node3D({ geo: 'torus', pos: [0, 0.25, 0], scale: 0.65, color: '#facc15', gloss: 0.9 }));
      d.add(wand);
      const bCols = ['#67e8f9', '#f9a8d4', '#fde047', '#c4b5fd', '#86efac', '#fda4af'];
      for (let i = 0; i < 8; i++) {
        const b = new Node3D({
          geo: 'sphere',
          pos: [-0.2 + (i % 3) * 0.55 - 0.3, -0.35 + Math.floor(i / 3) * 0.52, (i % 2 ? 0.35 : -0.3)],
          scale: 0.32 + (i % 3) * 0.14,
          color: bCols[i % bCols.length],
          gloss: 1.0,
          rim: 0.95,
          alpha: 0.78,
          tag: `bubble_${i}`,
        });
        d.add(b);
      }
    } else if (key === 'g1_L4') {
      // L4 你好: Twin Green Mountains + Expanding Golden Echo Sound Rings
      d.add(this.makeIslandBase('#4ade80', '#92400e'));
      d.add(new Node3D({ geo: 'cone', pos: [-0.65, -0.05, -0.15], scale: [1.35, 1.55, 1.35], color: '#16a34a' }));
      d.add(new Node3D({ geo: 'cone', pos: [-0.65, 0.48, -0.15], scale: [0.48, 0.48, 0.48], color: '#ffffff' }));
      d.add(new Node3D({ geo: 'cone', pos: [0.68, -0.18, 0.12], scale: [1.15, 1.28, 1.15], color: '#22c55e' }));
      d.add(new Node3D({ geo: 'cone', pos: [0.68, 0.28, 0.12], scale: [0.38, 0.38, 0.38], color: '#ffffff' }));
      for (let i = 0; i < 3; i++) {
        d.add(new Node3D({ geo: 'torus', pos: [0, 0.25, 0.25], scale: 0.4 + i * 0.3, rot: [0, 0.3, 0], color: '#fde047', emissive: 0.45, tag: `echo_${i}` }));
      }
    } else if (key === 'g1_L5') {
      // L5 外星人: Spinning 3D Planet + Ringed Planet + UFO & 3-Eyed Alien
      const spaceGroup = new Node3D({ tag: 'ufo_scene' });
      const earth = new Node3D({ pos: [-0.85, -0.45, -0.25], tag: 'spin' });
      earth.add(new Node3D({ geo: 'sphere', pos: [0, 0, 0], scale: 0.95, color: '#0ea5e9', gloss: 0.6 }));
      earth.add(new Node3D({ geo: 'sphere', pos: [0.22, 0.15, 0.32], scale: [0.38, 0.28, 0.22], color: '#22c55e' }));
      earth.add(new Node3D({ geo: 'sphere', pos: [-0.28, -0.12, -0.28], scale: [0.35, 0.3, 0.24], color: '#4ade80' }));
      spaceGroup.add(earth);

      const saturn = new Node3D({ pos: [1.05, 0.55, -0.6], rot: [0.4, 0, -0.3] });
      saturn.add(new Node3D({ geo: 'sphere', pos: [0, 0, 0], scale: 0.55, color: '#a855f7' }));
      saturn.add(new Node3D({ geo: 'torus', pos: [0, 0, 0], scale: [1.1, 1.1, 0.25], rot: [Math.PI/2, 0, 0], color: '#fde047' }));
      spaceGroup.add(saturn);

      const ufo = new Node3D({ pos: [0.25, 0.25, 0.35], tag: 'ufo' });
      ufo.add(new Node3D({ geo: 'sphere', pos: [0, 0, 0], scale: [1.35, 0.34, 1.35], color: '#cbd5e1', gloss: 0.95 }));
      ufo.add(new Node3D({ geo: 'torus', pos: [0, -0.02, 0], scale: [1.4, 1.4, 0.5], rot: [Math.PI/2, 0, 0], color: '#38bdf8', emissive: 0.4 }));
      ufo.add(new Node3D({ geo: 'sphere', pos: [0, 0.22, 0], scale: [0.68, 0.52, 0.68], color: '#67e8f9', alpha: 0.65, gloss: 1.0 }));
      // Little green alien inside dome
      ufo.add(new Node3D({ geo: 'sphere', pos: [0, 0.22, 0], scale: 0.34, color: '#4ade80' }));
      ufo.add(new Node3D({ geo: 'cone', pos: [0, -0.65, 0], scale: [0.95, 1.1, 0.95], color: '#fef08a', alpha: 0.32, emissive: 0.5 }));
      spaceGroup.add(ufo);
      d.add(spaceGroup);
    } else if (key === 'g1_L6') {
      // L6 小金魚: Translucent Crystal Fishbowl + 2 Red-Flower-Tail Goldfish
      d.add(this.makeIslandBase('#fde68a', '#d97706'));
      const swim = new Node3D({ pos: [0, -0.1, 0], tag: 'spin' });
      [-1, 1].forEach((dir) => {
        const gf = new Node3D({ pos: [dir * 0.42, dir * 0.1, 0], rot: [0, dir > 0 ? 0 : Math.PI, 0] });
        gf.add(new Node3D({ geo: 'sphere', pos: [0, 0, 0], scale: [0.46, 0.34, 0.28], color: '#ef4444', gloss: 0.85 }));
        // Big Red Flower Tail!
        gf.add(new Node3D({ geo: 'cone', pos: [-0.32, 0.08, 0], scale: [0.28, 0.35, 0.14], rot: [0, 0, -1.2], color: '#fb7185', emissive: 0.2 }));
        gf.add(new Node3D({ geo: 'cone', pos: [-0.32, -0.08, 0], scale: [0.28, 0.35, 0.14], rot: [0, 0, -1.9], color: '#f43f5e', emissive: 0.2 }));
        gf.add(new Node3D({ geo: 'sphere', pos: [0.16, 0.06, 0.11], scale: 0.08, color: '#0f172a' }));
        swim.add(gf);
      });
      d.add(swim);
      // Translucent crystal fishbowl outer shell
      d.add(new Node3D({ geo: 'sphere', pos: [0, -0.08, 0], scale: [1.75, 1.55, 1.75], color: '#7dd3fc', alpha: 0.38, gloss: 1.0, rim: 0.9 }));
      d.add(new Node3D({ geo: 'torus', pos: [0, 0.58, 0], scale: [1.3, 1.3, 0.8], rot: [Math.PI/2, 0, 0], color: '#bae6fd', gloss: 0.9 }));
    } else if (key === 'g1_L7') {
      // L7 紅紅的春: Festive Red Gate + Swaying Red Lanterns + Golden Couplet Diamond
      d.add(this.makeIslandBase('#fca5a5', '#b91c1c'));
      const gate = new Node3D({ pos: [0, -0.1, 0], scale: 0.86 });
      gate.add(new Node3D({ geo: 'cyl', pos: [-0.82, -0.1, 0], scale: [0.22, 1.45, 0.22], color: '#dc2626' }));
      gate.add(new Node3D({ geo: 'cyl', pos: [0.82, -0.1, 0], scale: [0.22, 1.45, 0.22], color: '#dc2626' }));
      gate.add(new Node3D({ geo: 'box', pos: [0, 0.68, 0], scale: [2.25, 0.28, 0.45], color: '#eab308', gloss: 0.8 }));
      gate.add(new Node3D({ geo: 'frustum', pos: [0, 0.92, 0], scale: [2.4, 0.34, 0.7], color: '#b91c1c' }));
      // Red Diamond 春聯 in center
      gate.add(new Node3D({ geo: 'box', pos: [0, -0.05, 0.08], scale: [0.78, 0.78, 0.12], rot: [0, 0, Math.PI/4], color: '#ef4444', emissive: 0.2 }));
      gate.add(new Node3D({ geo: 'star', pos: [0, -0.05, 0.16], scale: 0.38, color: '#fde047', emissive: 0.45 }));
      // Swaying Lanterns
      [-1.15, 1.15].forEach((x, idx) => {
        const lan = new Node3D({ pos: [x, 0.35, 0.15], tag: `lantern_${idx}` });
        lan.add(new Node3D({ geo: 'sphere', pos: [0, 0, 0], scale: [0.38, 0.44, 0.38], color: '#ef4444', emissive: 0.35 }));
        lan.add(new Node3D({ geo: 'cyl', pos: [0, -0.28, 0], scale: [0.12, 0.2, 0.12], color: '#facc15' }));
        gate.add(lan);
      });
      d.add(gate);
    } else if (key === 'g2_L7') {
      // G2 L7 等兔子來撞樹: Big Tree + Stump + Hopping White Rabbit with cute face!
      d.add(this.makeIslandBase('#4ade80', '#92400e'));
      d.add(new Node3D({ geo: 'cyl', pos: [-0.35, -0.2, -0.15], scale: [0.38, 1.15, 0.38], color: '#78350f' }));
      d.add(new Node3D({ geo: 'sphere', pos: [-0.35, 0.52, -0.15], scale: 1.08, color: '#16a34a' }));
      d.add(new Node3D({ geo: 'sphere', pos: [-0.82, 0.32, 0.05], scale: 0.75, color: '#22c55e' }));
      d.add(new Node3D({ geo: 'sphere', pos: [0.15, 0.38, -0.05], scale: 0.78, color: '#15803d' }));
      // Stump
      d.add(new Node3D({ geo: 'cyl', pos: [0.35, -0.62, 0.35], scale: [0.42, 0.34, 0.42], color: '#92400e' }));
      d.add(new Node3D({ geo: 'cyl', pos: [0.35, -0.44, 0.35], scale: [0.38, 0.04, 0.38], color: '#fde68a' }));
      // Hopping Rabbit facing camera/front-left
      const rab = new Node3D({ pos: [0.88, -0.45, 0.38], rot: [0, 0.35, 0], tag: 'hop_bunny' });
      rab.add(new Node3D({ geo: 'sphere', pos: [0, 0, 0], scale: [0.38, 0.35, 0.42], color: '#ffffff' }));
      rab.add(new Node3D({ geo: 'sphere', pos: [0, 0.24, 0.12], scale: 0.32, color: '#ffffff' }));
      this.makeEyes(rab, 0.26, 0.27, 0.08, 0.065);
      rab.add(new Node3D({ geo: 'sphere', pos: [0, 0.22, 0.29], scale: 0.05, color: '#fb7185' }));
      rab.add(new Node3D({ geo: 'sphere', pos: [-0.08, 0.52, 0.1], scale: [0.09, 0.34, 0.08], color: '#fbcfe8' }));
      rab.add(new Node3D({ geo: 'sphere', pos: [0.08, 0.52, 0.1], scale: [0.09, 0.34, 0.08], color: '#fbcfe8' }));
      d.add(rab);
    } else if (key === 'g2_L8') {
      // G2 L8 角和腳: Shimmering River + Proud Antlered Deer + Lion with eyes!
      d.add(this.makeIslandBase('#86efac', '#b45309'));
      d.add(new Node3D({ geo: 'box', pos: [0, -0.62, 0.48], scale: [2.25, 0.08, 0.72], color: '#38bdf8', gloss: 0.98 }));
      // Spotted Deer
      const deer = new Node3D({ pos: [0.45, -0.28, 0.05], tag: 'hop_bunny' });
      deer.add(new Node3D({ geo: 'sphere', pos: [0, 0, 0], scale: [0.62, 0.38, 0.34], color: '#f97316' }));
      deer.add(new Node3D({ geo: 'sphere', pos: [-0.1, 0.08, 0.16], scale: 0.08, color: '#fef08a' }));
      deer.add(new Node3D({ geo: 'sphere', pos: [0.08, 0.04, 0.16], scale: 0.08, color: '#fef08a' }));
      deer.add(new Node3D({ geo: 'cyl', pos: [0.24, 0.28, 0], scale: [0.16, 0.38, 0.16], rot: [0, 0, -0.25], color: '#fb923c' }));
      deer.add(new Node3D({ geo: 'sphere', pos: [0.34, 0.48, 0], scale: [0.28, 0.24, 0.24], color: '#fb923c' }));
      deer.add(new Node3D({ geo: 'sphere', pos: [0.38, 0.5, 0.11], scale: 0.055, color: '#0f172a' }));
      deer.add(new Node3D({ geo: 'sphere', pos: [0.38, 0.5, -0.11], scale: 0.055, color: '#0f172a' }));
      // Proud golden antlers!
      [-0.08, 0.08].forEach((z) => {
        deer.add(new Node3D({ geo: 'cyl', pos: [0.32, 0.72, z], scale: [0.05, 0.34, 0.05], rot: [z*2, 0, 0.2], color: '#facc15', emissive: 0.25 }));
        deer.add(new Node3D({ geo: 'cyl', pos: [0.24, 0.79, z*1.5], scale: [0.04, 0.2, 0.04], rot: [0, 0, 0.9], color: '#facc15' }));
      });
      // Long slender legs!
      [[-0.2, -0.1], [-0.2, 0.1], [0.2, -0.1], [0.2, 0.1]].forEach(([lx, lz]) => {
        deer.add(new Node3D({ geo: 'cyl', pos: [lx, -0.32, lz], scale: [0.06, 0.42, 0.06], color: '#ea580c' }));
      });
      d.add(deer);
      // Chasing Lion with eyes
      const lion = new Node3D({ pos: [-0.75, -0.38, -0.1] });
      lion.add(new Node3D({ geo: 'sphere', pos: [0, 0, 0], scale: [0.55, 0.38, 0.36], color: '#eab308' }));
      lion.add(new Node3D({ geo: 'sphere', pos: [0.26, 0.18, 0], scale: 0.4, color: '#b45309' }));
      lion.add(new Node3D({ geo: 'sphere', pos: [0.32, 0.18, 0.04], scale: 0.28, color: '#facc15' }));
      lion.add(new Node3D({ geo: 'sphere', pos: [0.39, 0.21, 0.12], scale: 0.055, color: '#0f172a' }));
      lion.add(new Node3D({ geo: 'sphere', pos: [0.45, 0.16, 0.05], scale: 0.055, color: '#7c2d12' }));
      d.add(lion);
    } else if (key === 'g2_L9') {
      // G2 L9 赤腳國王: Royal Castle + Levitating Golden Crown + Red Carpet
      d.add(this.makeIslandBase('#fde68a', '#b45309'));
      d.add(new Node3D({ geo: 'box', pos: [0, -0.78, 0.45], scale: [0.65, 0.08, 1.5], color: '#ef4444' }));
      d.add(new Node3D({ geo: 'box', pos: [0, -0.28, -0.35], scale: [1.3, 0.9, 0.72], color: '#fef9c3' }));
      [-0.72, 0.72].forEach((x) => {
        d.add(new Node3D({ geo: 'cyl', pos: [x, -0.18, -0.35], scale: [0.4, 1.12, 0.4], color: '#fef08a' }));
        d.add(new Node3D({ geo: 'cone', pos: [x, 0.56, -0.35], scale: [0.52, 0.46, 0.52], color: '#ef4444' }));
      });
      const crown = new Node3D({ pos: [0, 0.45, 0.25], tag: 'spin' });
      crown.add(new Node3D({ geo: 'frustum', pos: [0, 0, 0], scale: [0.72, 0.34, 0.72], rot: [Math.PI, 0, 0], color: '#facc15', gloss: 0.95, emissive: 0.25 }));
      crown.add(new Node3D({ geo: 'star', pos: [0, 0.26, 0], scale: 0.26, color: '#f43f5e', emissive: 0.4 }));
      d.add(crown);
    } else if (key === 'g2_L10') {
      // G2 L10 去農場玩: Green Farm + Spinning Windmill + Marshmallow Sheep with eyes!
      d.add(this.makeIslandBase('#4ade80', '#15803d'));
      d.add(new Node3D({ geo: 'frustum', pos: [-0.65, -0.18, -0.35], scale: [0.55, 1.08, 0.55], color: '#ef4444' }));
      d.add(new Node3D({ geo: 'cone', pos: [-0.65, 0.52, -0.35], scale: [0.65, 0.4, 0.65], color: '#7f1d1d' }));
      const blades = new Node3D({ pos: [-0.65, 0.2, -0.04], tag: 'windmill' });
      blades.add(new Node3D({ geo: 'box', pos: [0, 0, 0], scale: [1.1, 0.12, 0.05], color: '#fef9c3' }));
      blades.add(new Node3D({ geo: 'box', pos: [0, 0, 0], scale: [0.12, 1.1, 0.05], color: '#fef9c3' }));
      d.add(blades);
      // 3 Fluffy Cotton-Cloud Sheep!
      [[0.35, -0.52, 0.35], [0.85, -0.52, -0.1], [0.05, -0.52, -0.2]].forEach(([x, y, z], i) => {
        const sh = new Node3D({ pos: [x, y, z], tag: `fish_${i%2}` });
        sh.add(new Node3D({ geo: 'sphere', pos: [0, 0, 0], scale: [0.46, 0.38, 0.38], color: '#ffffff' }));
        sh.add(new Node3D({ geo: 'sphere', pos: [-0.14, 0.08, 0], scale: 0.32, color: '#f8fafc' }));
        sh.add(new Node3D({ geo: 'sphere', pos: [0.18, 0.08, 0.08], scale: 0.24, color: '#334155' }));
        sh.add(new Node3D({ geo: 'sphere', pos: [0.22, 0.11, 0.19], scale: 0.045, color: '#ffffff', emissive: 0.5 }));
        sh.add(new Node3D({ geo: 'sphere', pos: [0.12, 0.11, 0.19], scale: 0.045, color: '#ffffff', emissive: 0.5 }));
        d.add(sh);
      });
    } else if (key === 'g2_L11') {
      // G2 L11 幸福湯圓: Warm Porcelain Bowl + 8 Colorful Tangyuan Balls!
      d.add(this.makeIslandBase('#fed7aa', '#c2410c'));
      d.add(new Node3D({ geo: 'bowl', pos: [0, -0.32, 0], scale: [2.1, 0.92, 2.1], color: '#ffffff', gloss: 0.9 }));
      d.add(new Node3D({ geo: 'torus', pos: [0, -0.18, 0], scale: [2.25, 2.25, 0.7], rot: [Math.PI/2, 0, 0], color: '#fb7185' }));
      d.add(new Node3D({ geo: 'cyl', pos: [0, -0.05, 0], scale: [1.85, 0.1, 1.85], color: '#fef3c7', alpha: 0.85 }));
      const tyCols = ['#fb7185', '#ffffff', '#fde047', '#c084fc', '#4ade80', '#fb923c', '#ffffff', '#f472b6'];
      tyCols.forEach((col, i) => {
        const a = (i / tyCols.length) * Math.PI * 2;
        const r = i < 6 ? 0.55 : 0.16;
        d.add(new Node3D({
          geo: 'sphere',
          pos: [Math.cos(a) * r, 0.08, Math.sin(a) * r],
          scale: 0.34,
          color: col,
          gloss: 0.95,
          tag: `bubble_${i}`,
        }));
      });
    } else if (key === 'g2_L12') {
      // G2 L12 到野外上課: Giant 7-Band 3D Rainbow Arch + Flapping Butterflies + Nature
      d.add(this.makeIslandBase('#4ade80', '#15803d'));
      const rbCols = ['#ef4444', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#c084fc'];
      rbCols.forEach((col, i) => {
        const s = 2.4 - i * 0.18;
        d.add(new Node3D({ geo: 'arch', pos: [0, -0.75, -0.25], scale: [s, s, 1.2], color: col, emissive: 0.22 }));
      });
      d.add(new Node3D({ geo: 'cone', pos: [-0.65, -0.35, 0.25], scale: [0.65, 0.85, 0.65], color: '#16a34a' }));
      // Butterflies
      [[-0.35, 0.32, 0.45, '#f472b6'], [0.55, 0.42, 0.35, '#facc15']].forEach(([x, y, z, col], i) => {
        const bf = new Node3D({ pos: [x, y, z], tag: `butterfly_${i}` });
        bf.add(new Node3D({ geo: 'sphere', pos: [-0.14, 0, 0], scale: [0.24, 0.3, 0.06], color: col, emissive: 0.25 }));
        bf.add(new Node3D({ geo: 'sphere', pos: [0.14, 0, 0], scale: [0.24, 0.3, 0.06], color: col, emissive: 0.25 }));
        bf.add(new Node3D({ geo: 'cyl', pos: [0, 0, 0], scale: [0.06, 0.26, 0.06], color: '#1e293b' }));
        d.add(bf);
      });
    } else if (key === 'boss') {
      // Final Exam Boss: 3D Ink-Dragon Boss hovering cleanly inside frame!
      d.add(this.makeIslandBase('#fb7185', '#881337'));
      const boss = new Node3D({ pos: [0, -0.05, 0], tag: 'boss_dragon' });
      boss.add(new Node3D({ geo: 'sphere', pos: [0, -0.1, 0], scale: [0.96, 0.88, 0.86], color: '#e11d48', gloss: 0.8 }));
      boss.add(new Node3D({ geo: 'sphere', pos: [0, -0.14, 0.34], scale: [0.6, 0.56, 0.28], color: '#fde047' }));
      boss.add(new Node3D({ geo: 'sphere', pos: [0, 0.42, 0.12], scale: [0.78, 0.66, 0.72], color: '#be123c', gloss: 0.85 }));
      // Horns
      [-0.25, 0.25].forEach((x) => {
        boss.add(new Node3D({ geo: 'cone', pos: [x, 0.82, 0.1], scale: [0.2, 0.36, 0.2], rot: [0, 0, x < 0 ? 0.35 : -0.35], color: '#facc15', emissive: 0.35 }));
      });
      // Glowing Dragon Eyes
      [-0.18, 0.18].forEach((x) => {
        boss.add(new Node3D({ geo: 'sphere', pos: [x, 0.5, 0.43], scale: 0.13, color: '#fef08a', emissive: 0.7 }));
        boss.add(new Node3D({ geo: 'sphere', pos: [x, 0.5, 0.48], scale: 0.065, color: '#0f172a' }));
      });
      // Flapping Dragon Wings
      [-0.72, 0.72].forEach((x, idx) => {
        boss.add(new Node3D({
          geo: 'cone',
          pos: [x, 0.14, -0.15],
          scale: [0.78, 0.6, 0.15],
          rot: [0, 0, x < 0 ? 1.15 : -1.15],
          color: '#fb923c',
          tag: `wing_${idx}`,
        }));
      });
      d.add(boss);
    } else if (key === 'gacha') {
      // 3D Gacha Capsule Toy Machine — scaled & positioned cleanly inside viewport!
      const mach = new Node3D({ pos: [0, -0.62, 0], scale: 0.82, tag: 'gacha_machine' });
      mach.add(new Node3D({ geo: 'frustum', pos: [0, -0.15, 0], scale: [1.35, 0.85, 1.35], color: '#ef4444', gloss: 0.85 }));
      mach.add(new Node3D({ geo: 'cyl', pos: [0, 0.3, 0], scale: [1.38, 0.12, 1.38], color: '#facc15', gloss: 0.9 }));
      // Crank Handle
      const crank = new Node3D({ pos: [0, -0.1, 0.66], tag: 'gacha_crank' });
      crank.add(new Node3D({ geo: 'cyl', pos: [0, 0, 0], scale: [0.34, 0.12, 0.34], rot: [Math.PI/2, 0, 0], color: '#facc15' }));
      crank.add(new Node3D({ geo: 'box', pos: [0, 0, 0.08], scale: [0.46, 0.11, 0.08], color: '#fef08a' }));
      mach.add(crank);
      // Colorful 3D Capsules inside dome!
      const capCols = ['#f43f5e', '#38bdf8', '#facc15', '#4ade80', '#a855f7', '#fb923c', '#f472b6'];
      const caps = new Node3D({ pos: [0, 0.85, 0], tag: 'gacha_balls' });
      capCols.forEach((col, i) => {
        const a = (i / capCols.length) * Math.PI * 2;
        caps.add(new Node3D({
          geo: 'sphere',
          pos: [Math.cos(a) * 0.36, (i % 3 - 1) * 0.22, Math.sin(a) * 0.36],
          scale: 0.32,
          color: col,
          gloss: 0.95,
        }));
      });
      mach.add(caps);
      // Translucent Glass Globe + Top Hat & Star
      mach.add(new Node3D({ geo: 'sphere', pos: [0, 0.92, 0], scale: 1.52, color: '#e0f2fe', alpha: 0.38, gloss: 1.0, rim: 0.95 }));
      mach.add(new Node3D({ geo: 'cone', pos: [0, 1.72, 0], scale: [0.65, 0.32, 0.65], color: '#ef4444' }));
      mach.add(new Node3D({ geo: 'star', pos: [0, 1.98, 0], scale: 0.28, color: '#fde047', emissive: 0.45 }));
      d.add(mach);
    }
  }

  showGachaPet(petId) {
    this.showcasePetId = petId;
    this.spawnBurst([0, 0.35, 0.55], 48);
  }

  triggerGachaSpin() {
    this.gachaSpinTimer = 1.0;
  }

  animateNode(node, dt) {
    const t = this.time;
    if (node.tag === 'spin') node.rot[1] = t * 1.1;
    if (node.tag === 'spin_slow') node.rot[1] = t * 0.85;
    if (node.tag === 'orbit_ring') node.rot[1] = t * 0.35;
    if (node.tag === 'windmill') node.rot[2] = -t * 1.8;
    if (node.tag === 'boat') {
      node.rot[2] = Math.sin(t * 2.2) * 0.12;
      node.pos[1] = -0.35 + Math.sin(t * 2.6) * 0.06;
    }
    if (node.tag.startsWith('sea_wave_')) {
      const idx = Number(node.tag.split('_')[2] || 0);
      node.pos[1] = -0.72 + Math.sin(t * 3 + idx) * 0.05;
    }
    if (node.tag.startsWith('fish_')) {
      const idx = Number(node.tag.split('_')[1] || 0);
      node.pos[1] = -0.35 + Math.abs(Math.sin(t * 2.8 + idx * 1.6)) * 0.38;
      node.rot[2] = Math.cos(t * 2.8 + idx * 1.6) * 0.3;
    }
    if (node.tag === 'wave_hand') {
      node.rot[2] = Math.sin(t * 3.0) * 0.18;
    }
    if (node.tag.startsWith('bubble_')) {
      const idx = Number(node.tag.split('_')[1] || 0);
      node.pos[1] += Math.sin(t * 2.4 + idx) * 0.0025;
    }
    if (node.tag.startsWith('echo_')) {
      const idx = Number(node.tag.split('_')[1] || 0);
      const s = 0.35 + ((t * 0.65 + idx * 0.33) % 1) * 1.15;
      node.scale = [s, s, s];
    }
    if (node.tag === 'ufo') {
      node.pos[1] = 0.25 + Math.sin(t * 2.4) * 0.12;
      node.rot[1] = t * 1.4;
    }
    if (node.tag.startsWith('lantern_')) {
      const idx = Number(node.tag.split('_')[1] || 0);
      node.rot[2] = Math.sin(t * 2.5 + idx) * 0.16;
    }
    if (node.tag === 'hop_bunny') {
      node.pos[1] = -0.4 + Math.abs(Math.sin(t * 3.4)) * 0.24;
    }
    if (node.tag.startsWith('butterfly_')) {
      const idx = Number(node.tag.split('_')[1] || 0);
      node.pos[1] = 0.35 + Math.sin(t * 3.5 + idx) * 0.12;
      node.rot[1] = Math.sin(t * 6 + idx) * 0.45;
    }
    if (node.tag === 'boss_dragon') {
      const s = 0.62 + 0.32 * Math.max(0.15, this.bossHpRatio);
      node.pos[1] = -0.05 + Math.sin(t * 2.8) * 0.1;
      node.rot[1] = Math.sin(t * 1.4) * 0.28;
      node.scale = [s, s, s];
      if (this.bossHitFlash > 0) {
        node.pos[2] = -Math.sin(this.bossHitFlash * Math.PI) * 0.35;
      } else {
        node.pos[2] = 0;
      }
    }
    if (node.tag.startsWith('wing_')) {
      const idx = Number(node.tag.split('_')[1] || 0);
      const dir = idx === 0 ? 1 : -1;
      node.rot[2] = dir * (1.05 + Math.sin(t * 7.5) * 0.35);
    }
    if (node.tag === 'gacha_crank' && this.gachaSpinTimer > 0) {
      node.rot[2] += dt * 14;
    }
    if (node.tag === 'gacha_balls') {
      node.rot[1] += dt * (this.gachaSpinTimer > 0 ? 9.5 : 0.9);
      node.rot[0] = Math.sin(t * (this.gachaSpinTimer > 0 ? 14 : 1.5)) * 0.25;
    }
    if (node.tag === 'pet_body') {
      if (this.petCheerTimer > 0) {
        const p = 1 - this.petCheerTimer / 1.1;
        node.pos[1] = Math.sin(p * Math.PI) * 0.65;
        node.rot[1] = p * Math.PI * 2;
      } else {
        node.pos[1] = Math.abs(Math.sin(t * (this.fever ? 5.2 : 2.8))) * 0.12;
        node.rot[1] = Math.sin(t * 1.5) * 0.25;
      }
    }
    if (node.tag.startsWith('cloud_')) {
      const idx = Number(node.tag.split('_')[1] || 0);
      node.pos[0] += Math.sin(t * 0.25 + idx) * 0.0018;
    }
    node.children.forEach((c) => this.animateNode(c, dt));
  }

  drawNode(node, parentMat, vpMat, isBossSubtree = false) {
    const gl = this.gl;
    const local = mat4TRS(node.pos, node.rot, node.scale);
    const world = mat4Mul(parentMat, local);
    const bossFlag = isBossSubtree || node.tag === 'boss_dragon';

    if (node.geo && this.meshes[node.geo]) {
      const m = this.meshes[node.geo];
      const mvp = mat4Mul(vpMat, world);
      gl.uniformMatrix4fv(this.locs.uMVP, false, mvp);
      gl.uniformMatrix4fv(this.locs.uModel, false, world);
      gl.uniform3fv(this.locs.uColor, node.color);
      gl.uniform1f(this.locs.uGloss, node.gloss);
      gl.uniform1f(this.locs.uRim, node.rim);
      gl.uniform1f(this.locs.uAlpha, node.alpha);
      gl.uniform1f(this.locs.uEmissive, node.emissive + (this.fever ? 0.12 : 0));
      gl.uniform1f(this.locs.uFlash, bossFlag ? this.bossHitFlash : 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, m.pb);
      gl.enableVertexAttribArray(this.locs.aPos);
      gl.vertexAttribPointer(this.locs.aPos, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, m.nb);
      gl.enableVertexAttribArray(this.locs.aNorm);
      gl.vertexAttribPointer(this.locs.aNorm, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.ib);
      gl.drawElements(gl.TRIANGLES, m.count, gl.UNSIGNED_SHORT, 0);
    }
    node.children.forEach((c) => this.drawNode(c, world, vpMat, bossFlag));
  }

  loop(nowMs) {
    const now = nowMs * 0.001;
    const dt = Math.min(0.05, now - (this.lastTime || now));
    this.lastTime = now;
    this.time += dt;

    if (!this.dragging) {
      this.targetYaw += dt * 0.22;
    }
    this.userYaw += (this.targetYaw - this.userYaw) * 0.1;
    this.diorama.rot[1] = this.userYaw;
    this.diorama.pos[1] = Math.sin(this.time * 1.6) * 0.06;

    if (this.bossHitFlash > 0) this.bossHitFlash = Math.max(0, this.bossHitFlash - dt * 2.8);
    if (this.petCheerTimer > 0) this.petCheerTimer = Math.max(0, this.petCheerTimer - dt);
    if (this.gachaSpinTimer > 0) this.gachaSpinTimer = Math.max(0, this.gachaSpinTimer - dt);

    this.animateNode(this.root, dt);

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const pr = this.projectiles[i];
      pr.t += dt * 2.8;
      if (pr.t >= 1) {
        this.projectiles.splice(i, 1);
        this.bossHitFlash = 1.0;
        this.spawnBurst([0, 0.35, 0.35], 32, ['#fde047', '#fb7185', '#38bdf8', '#ffffff']);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt * 1.15;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.vel[1] -= dt * 4.8;
      p.pos[0] += p.vel[0] * dt;
      p.pos[1] += p.vel[1] * dt;
      p.pos[2] += p.vel[2] * dt;
      p.rot[0] += dt * 5;
      p.rot[1] += dt * 6;
    }

    if (this.gl) {
      const gl = this.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const aspect = this.canvas.width / Math.max(1, this.canvas.height);
      const eye = [0, 1.28, aspect < 1.1 ? 5.95 : 4.85];
      const proj = mat4Perspective(0.72, aspect, 0.1, 40.0);
      const view = mat4LookAt(eye, [0.15, 0.05, 0], [0, 1, 0]);
      const vp = mat4Mul(proj, view);
      gl.uniform3fv(this.locs.uEye, eye);

      this.drawNode(this.root, mat4Identity(), vp);

      // Draw active 3D cannonballs
      this.projectiles.forEach((pr) => {
        const t = pr.t;
        const px = pr.pos[0] + (pr.target[0] - pr.pos[0]) * t;
        const py = pr.pos[1] + (pr.target[1] - pr.pos[1]) * t + Math.sin(t * Math.PI) * 0.9;
        const pz = pr.pos[2] + (pr.target[2] - pr.pos[2]) * t;
        const ball = new Node3D({ geo: 'star', pos: [px, py, pz], rot: [t*8, t*10, 0], scale: 0.48, color: '#fde047', emissive: 0.8 });
        this.drawNode(ball, mat4Identity(), vp);
      });

      // Draw 3D particles
      this.particles.forEach((p) => {
        const pn = new Node3D({
          geo: p.geo,
          pos: p.pos,
          rot: p.rot,
          scale: p.scale * p.life,
          gloss: 0.9,
          emissive: 0.55,
          alpha: Math.min(1, p.life * 1.4),
        });
        pn.color = p.color;
        this.drawNode(pn, mat4Identity(), vp);
      });
    }

    requestAnimationFrame(this.loop);
  }
}

module.exports = { World3DEngine };
