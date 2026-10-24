// @ts-nocheck
// Motor de la animación "Bombillas de ideas", portado literalmente del <script> de
// src/components/BombillasIdeas.astro. Cambios: busca sus nodos dentro de `root` (no por id global),
// respeta `autoplay`/`initialProgress` y devuelve una función de limpieza para React.

export interface BombillasOptions {
  autoplay: boolean;
  initialProgress: number;
}

export function mountBombillas(root: HTMLElement, opts: BombillasOptions): () => void {
  let disposed = false, raf = 0;
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); if (!disposed) fn(); }, ms); timers.add(id); return id; };
  const AUTO = opts.autoplay;
  const START = Math.max(0, Math.min(100, opts.initialProgress));

  const cv = root.querySelector('[data-el="cv"]');
  const ctx = cv.getContext('2d');
  const scene = root.querySelector('[data-el="scene"]');
  const range = root.querySelector('[data-el="range"]');
  const pctEl = root.querySelector('[data-el="pct"]');
  const capEl = root.querySelector('[data-el="caption"]');
  const stageBtns = [...root.querySelectorAll('[data-el="stages"] button')];
  const playBtn = root.querySelector('[data-el="play"]');
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const TH = 8;            // half thumb width: maps value to x exactly under the knob
  const GROUND_OFF = 34;   // ground line distance from bottom of scene
  let W = 0, H = 0, DPR = 1, groundY = 0;

  // ---------- palette (glass tints) ----------
  const T = {
    azafran: [224, 192, 104], terracota: [196, 71, 31], oliva: [181, 176, 122], arena: [227, 194, 155], papel: [244, 238, 228]
  };
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  // ---------- deterministic random ----------
  let seed = 20261022;
  const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const rr = (a, b) => a + rnd() * (b - a);
  const pick = arr => arr[Math.floor(rnd() * arr.length)];

  // ---------- stages ----------
  const STAGES = [
    { key: 'entender', text: 'Entender.', sub: 'Averiguar qué hay y para qué importa.' },
    { key: 'acotar',   text: 'Acotar.',   sub: 'Definir qué puedes hacer y qué no, y cuáles serán tus criterios.' },
    { key: 'elegir',   text: 'Elegir.',   sub: 'Lo que optimice tu resultado en base a tu contorno actual.' },
    { key: 'probar',   text: 'Probar.',   sub: 'Registrar el antes y el después. Lo que no se mide no se puede controlar.' },
    { key: 'aprender', text: 'Aprender.', sub: 'Lo que salió bien, pero sobre todo lo que salió mal.' }
  ];

  // ---------- generate bulbs (x in 0..1, sizes in px) ----------
  const bulbs = [];
  const add = (o) => bulbs.push(Object.assign({
    g: 0, lt: 0, sp: 0, want: false, broken: false, ph: rnd() * 100,
    bend: rr(-6, 6), type: rnd() < 0.7 ? 'pear' : 'globe', tilt: 0, flick: 0, rays: false
  }, o));

  // entender: everything at once — every colour, shape, size and height
  (() => { const n = 15, tints = [T.terracota, T.oliva, T.arena, T.azafran], types = ['pear', 'globe', 'tube', 'candle'];
    for (let j = 0; j < n; j++) add({ x: 0.012 + (j + 0.5) / n * 0.18 + rr(-0.004, 0.004), s: rr(3, 7.4), h: rr(12, 78), tint: tints[j % tints.length], type: pick(types), max: rr(0.42, 0.68) * (j % tints.length === 3 ? 0.6 : 1), stage: 0, tilt: rr(-0.12, 0.12) });
  })();
  // acotar: three tidy groups; each shares colour, shape, height and one root on the line
  (() => {
    const groups = [
      { gx: 0.238, tint: T.terracota, type: 'globe', s: 5,   h: 46 },
      { gx: 0.3,   tint: T.oliva, type: 'pear',  s: 5.6, h: 62 },
      { gx: 0.362, tint: T.arena, type: 'tube',  s: 4.6, h: 52 }
    ];
    groups.forEach(g => [-1, 0, 1].forEach(k => add({ gx: g.gx, x: g.gx + k * 0.015, s: g.s, h: g.h + (k === 0 ? 6 : 0), tint: g.tint, type: g.type, max: 0.78, stage: 1, bend: 0 })));
  })();
  // elegir: a few dim candidates around one big bright bulb
  (() => { const xs = [0.415, 0.432, 0.449, 0.551, 0.568, 0.585];
    xs.forEach(x => add({ x: x + rr(-0.003, 0.003), s: rr(3.6, 4.4), h: rr(22, 40), tint: T.arena, max: 0.22, stage: 2 }));
    add({ x: 0.5, s: 12.5, h: 116, tint: T.azafran, max: 1, stage: 2, type: 'pear', rays: true, bend: 2 });
  })();
  // probar: the chosen idea (same amber) tried in different forms, sizes and angles; some flicker
  (() => {
    const v = [
      ['pear', 5.2, 62, -0.18], ['tube', 5.4, 84, 0.08], ['globe', 7.6, 70, 0], ['candle', 6, 96, -0.1],
      ['pear', 8.2, 78, 0.16], ['globe', 4.8, 58, 0.22], ['candle', 7.2, 74, 0.05], ['tube', 6.6, 98, -0.14]
    ];
    v.forEach(([type, sz, h, tilt], j) => add({ x: 0.61 + (j + 0.5) / v.length * 0.18, s: sz, h, tilt, type, tint: j % 2 ? T.terracota : T.azafran, max: rr(0.55, 0.7), stage: 3, flick: j === 3 ? 1 : (j % 2 ? 0.7 : 0.3), bend: rr(-3, 3) }));
  })();
  // aprender: a yellow staircase; every iteration adds a step and raises the top
  let iter = 1, seedsCount = 0;
  function makeAprender() {
    for (let i = bulbs.length - 1; i >= 0; i--) if (bulbs[i].stage === 4) bulbs.splice(i, 1);
    const n = Math.min(14, 9 + iter), maxH = Math.min(140, 124 + (iter - 1) * 6);
    for (let j = 0; j < n; j++) {
      const f = j / (n - 1);
      add({ x: 0.81 + (j + 0.5) / n * 0.18, s: 5.6 + f * 3.3, h: 52 + (maxH - 52) * f, tint: T.azafran, max: 0.4 + f * 0.6, stage: 4, type: 'pear', bend: 0 });
    }
  }
  makeAprender();
  // learnings that come back become the new starting standard inside "entender"
  const SEEDS = [[0.04, 70], [0.1, 86], [0.16, 76], [0.07, 92], [0.13, 64]];
  bulbs.sort((a, b) => a.x - b.x);

  // ---------- particles ----------
  const shards = [];
  function shatter(b, cx, cy) {
    const n = 7 + Math.floor(b.s / 2);
    for (let i = 0; i < n; i++) {
      const a = rr(-Math.PI, 0) + rr(-0.3, 0.3), sp = rr(50, 150) * (b.s / 7 + 0.4);
      shards.push({ x: cx + rr(-b.s, b.s) * 0.6, y: cy + rr(-b.s, b.s) * 0.6, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40,
        r: rr(0, 6.28), vr: rr(-12, 12), life: 0, max: rr(0.8, 1.3), size: rr(1.6, 3.2) * (b.s / 7 + 0.5), tint: b.tint, spark: false });
    }
    for (let i = 0; i < 4; i++) {
      const a = rr(0, 6.28), sp = rr(80, 200);
      shards.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 0, vr: 0, life: 0, max: rr(0.18, 0.35), size: 1.4, tint: T.papel, spark: true });
    }
  }

  // ---------- easing ----------
  const clamp = v => Math.max(0, Math.min(1, v));
  const eOutCubic = t => 1 - Math.pow(1 - t, 3);
  const eOutBack = t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  function ignite(t) { // a real bulb doesn't fade in: it stutters on
    if (RM) return t > 0 ? 1 : 0;
    if (t <= 0) return 0;
    if (t < 0.05) return 0.75;
    if (t < 0.11) return 0.12;
    if (t < 0.16) return 0.9;
    if (t < 0.2) return 0.45;
    return Math.min(1, 0.7 + (t - 0.2) * 1.6);
  }

  // ---------- geometry ----------
  const xOf = nx => TH + nx * (W - 2 * TH);
  const CEN = { pear: 1.35, globe: 1.15, tube: 1.3, candle: 1.2 }; // glass centre above base top, in s
  function geom(b, t) {
    const grow = eOutCubic(clamp(b.g / 0.6));
    const len = b.h * grow;
    const sway = RM ? 0 : Math.sin(t * 0.9 + b.ph) * 1.1 * (b.h / 100);
    const x0 = xOf(b.gx ?? b.x), xb = xOf(b.x);
    const x1 = x0 + (xb - x0 + b.bend * 0.5 + sway) * grow;
    const topY = groundY - len;
    const grouped = b.gx != null;
    const ccx = grouped ? x0 : x0 + b.bend, ccy = grouped ? groundY - len * 0.6 : (groundY + topY) / 2;
    const sc = b.broken ? 0 : eOutBack(clamp((b.g - 0.42) / 0.58));
    const d = (b.s * 0.62 + CEN[b.type] * b.s) * sc, tl = b.tilt || 0;
    return { x0, x1, topY, sc, ccx, ccy, cx: x1 + Math.sin(tl) * d, cy: topY - Math.cos(tl) * d };
  }
  function lightOf(b, t) {
    if (!b.want || b.broken) return 0;
    let l = ignite(b.lt) * b.max;
    if (b.flick && !RM) {
      const n = Math.sin(t * 11.3 + b.ph) * Math.sin(t * 6.7 + b.ph * 1.7) + Math.sin(t * 23.1 + b.ph * 3) * 0.25;
      if (n > 0.72 - b.flick * 0.3) l *= 0.12 + (1 - b.flick) * 0.5;
      else l *= 1 - 0.08 * Math.abs(Math.sin(t * 31 + b.ph));
    }
    return l;
  }

  // ---------- drawing ----------
  function glassPath(s, type) {
    ctx.beginPath();
    if (type === 'globe') {
      const r = s * 1.05, c = -1.15 * s;
      ctx.moveTo(-0.36 * s, 0);
      ctx.bezierCurveTo(-0.36 * s, -0.18 * s, -0.7 * s, -0.25 * s, -0.86 * s, -0.5 * s);
      ctx.arc(0, c, r, Math.PI * 0.82, Math.PI * 0.18, false);
      ctx.bezierCurveTo(0.7 * s, -0.25 * s, 0.36 * s, -0.18 * s, 0.36 * s, 0);
    } else if (type === 'tube') {
      ctx.moveTo(-0.36 * s, 0);
      ctx.lineTo(-0.58 * s, -0.3 * s);
      ctx.lineTo(-0.58 * s, -2.1 * s);
      ctx.arc(0, -2.1 * s, 0.58 * s, Math.PI, 0, false);
      ctx.lineTo(0.58 * s, -0.3 * s);
      ctx.lineTo(0.36 * s, 0);
    } else if (type === 'candle') {
      ctx.moveTo(-0.36 * s, 0);
      ctx.bezierCurveTo(-0.36 * s, -0.3 * s, -0.78 * s, -0.6 * s, -0.78 * s, -1.1 * s);
      ctx.bezierCurveTo(-0.78 * s, -1.7 * s, -0.15 * s, -2.05 * s, 0, -2.6 * s);
      ctx.bezierCurveTo(0.15 * s, -2.05 * s, 0.78 * s, -1.7 * s, 0.78 * s, -1.1 * s);
      ctx.bezierCurveTo(0.78 * s, -0.6 * s, 0.36 * s, -0.3 * s, 0.36 * s, 0);
    } else {
      ctx.moveTo(-0.36 * s, 0);
      ctx.bezierCurveTo(-0.36 * s, -0.35 * s, -s, -0.62 * s, -s, -1.35 * s);
      ctx.arc(0, -1.35 * s, s, Math.PI, 0, false);
      ctx.bezierCurveTo(s, -0.62 * s, 0.36 * s, -0.35 * s, 0.36 * s, 0);
    }
    ctx.closePath();
  }

  function drawBulb(b, G, L, t) {
    if (G.sc <= 0.001) return;
    const s = b.s, c = -CEN[b.type] * s;
    ctx.save();
    ctx.translate(G.x1, G.topY);
    if (b.tilt) ctx.rotate(b.tilt);
    ctx.scale(G.sc, G.sc);
    // screw base (y from -bh to 0)
    const bw = s * 0.74, bh = s * 0.62;
    ctx.fillStyle = 'rgba(227,194,155,0.55)';
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-bw / 2, -bh, bw, bh, s * 0.1) : ctx.rect(-bw / 2, -bh, bw, bh); ctx.fill();
    ctx.strokeStyle = '#2B211C'; ctx.lineWidth = Math.max(0.6, s * 0.08);
    for (let k = 1; k <= 2; k++) { const y = -bh + bh * k / 3; ctx.beginPath(); ctx.moveTo(-bw / 2, y); ctx.lineTo(bw / 2, y); ctx.stroke(); }
    ctx.fillStyle = '#2B211C';
    ctx.beginPath(); ctx.ellipse(0, 0, bw * 0.24, s * 0.14, 0, 0, Math.PI * 2); ctx.fill();
    // glass
    ctx.translate(0, -bh);
    glassPath(s, b.type);
    if (L > 0.01) {
      const g = ctx.createRadialGradient(0, c, 0, 0, c, s * 1.15);
      g.addColorStop(0, `rgba(244,238,228,${0.35 + 0.65 * L})`);
      g.addColorStop(0.45, rgba(b.tint, 0.25 + 0.6 * L));
      g.addColorStop(1, rgba(b.tint, 0.1 + 0.4 * L));
      ctx.fillStyle = g;
    } else ctx.fillStyle = rgba(b.tint, 0.09);
    ctx.fill();
    ctx.strokeStyle = `rgba(244,238,228,${0.5 - 0.25 * L})`;
    ctx.lineWidth = Math.max(0.7, s * 0.1);
    ctx.stroke();
    // filament
    // filament: arena when off, papel when lit
    const fl = [Math.round(227 + 17 * L), Math.round(194 + 44 * L), Math.round(155 + 73 * L)];
    ctx.strokeStyle = `rgba(${fl[0]},${fl[1]},${fl[2]},${0.45 + 0.55 * L})`;
    ctx.lineWidth = Math.max(0.6, s * 0.075);
    const fy = c + s * 0.15;
    ctx.beginPath();
    ctx.moveTo(-0.16 * s, 0); ctx.lineTo(-0.24 * s, fy);
    for (let k = 1; k <= 5; k++) ctx.lineTo(-0.24 * s + k * 0.096 * s, fy + (k % 2 ? -0.14 : 0) * s);
    ctx.lineTo(0.16 * s, 0);
    ctx.stroke();
    // highlight
    ctx.strokeStyle = `rgba(244,238,228,${0.32 + 0.25 * L})`;
    ctx.lineWidth = Math.max(0.7, s * 0.12);
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, c, s * 0.64, Math.PI * 1.08, Math.PI * 1.38); ctx.stroke();
    // rays for the chosen idea
    if (b.rays && L > 0.05) {
      ctx.strokeStyle = rgba(b.tint, 0.75 * L);
      ctx.lineWidth = Math.max(1, s * 0.09);
      const rot = RM ? 0 : t * 0.25;
      for (let k = 0; k < 10; k++) {
        const a = rot + k * Math.PI / 5, pulse = RM ? 0 : Math.sin(t * 2.4 + k) * 0.08;
        const r0 = s * (1.45 + pulse), r1 = s * (1.95 + pulse * 2);
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * r0, c + Math.sin(a) * r0); ctx.lineTo(Math.cos(a) * r1, c + Math.sin(a) * r1); ctx.stroke();
      }
    }
    ctx.restore();
  }

  // flame: burns at the tip of the line like a fuse, leans against the direction of travel
  const flame = { x: TH, vx: 0, lean: 0 };
  const embers = [];
  function flamePath(r, h, tip) {
    ctx.beginPath();
    ctx.moveTo(tip, -h);
    ctx.quadraticCurveTo(r * 1.35 + tip * 0.3, -h * 0.38, r, 0);
    ctx.arc(0, 0, r, 0, Math.PI, false);
    ctx.quadraticCurveTo(-r * 1.35 + tip * 0.3, -h * 0.38, tip, -h);
    ctx.closePath();
  }
  function drawFlame(t) {
    const fx = flame.x, fy = groundY - 7;
    const wob = RM ? 0 : Math.sin(t * 17) * 0.12 + Math.sin(t * 29 + 1.3) * 0.08 + Math.sin(t * 7.1) * 0.05;
    const tip = flame.lean + (RM ? 0 : Math.sin(t * 13.7) * 1.2);
    // glow
    ctx.globalCompositeOperation = 'lighter';
    let g = ctx.createRadialGradient(fx, fy - 8, 0, fx, fy - 8, 34);
    g.addColorStop(0, `rgba(196,71,31,${0.4 + wob * 0.4})`); g.addColorStop(1, 'rgba(196,71,31,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(fx, fy - 8, 34, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.translate(fx, fy);
    const H = 19 * (1 + wob);
    ctx.fillStyle = 'rgba(196,71,31,0.95)'; flamePath(5.2, H, tip); ctx.fill();
    ctx.fillStyle = 'rgba(224,192,104,0.75)'; flamePath(3.7, H * 0.7, tip * 0.7); ctx.fill();
    ctx.fillStyle = 'rgba(224,192,104,1)'; flamePath(2.2, H * 0.45, tip * 0.4); ctx.fill();
    ctx.restore();
  }
  function updateEmbers(dt, moving) {
    if (!RM && Math.random() < dt * (moving ? 26 : 7)) {
      embers.push({ x: flame.x + (Math.random() - 0.5) * 4, y: groundY - 18, vx: (Math.random() - 0.5) * 18 - flame.vx * 0.05,
        vy: -30 - Math.random() * 35, life: 0, max: 0.5 + Math.random() * 0.6, size: 0.7 + Math.random() * 0.9 });
    }
    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i]; e.life += dt;
      if (e.life >= e.max) { embers.splice(i, 1); continue; }
      e.x += e.vx * dt + Math.sin(e.life * 9 + i) * 0.2; e.y += e.vy * dt; e.vy *= 0.985;
      const a = 1 - e.life / e.max;
      ctx.fillStyle = a > 0.5 ? `rgba(224,192,104,${a})` : `rgba(196,71,31,${a * 1.6})`;
      ctx.beginPath(); ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2); ctx.fill();
    }
  }
  // point on a cord (quadratic from ground to bulb base) at parameter u
  function cordPoint(b, G, u) {
    const cx = G.ccx, cy = G.ccy, v = 1 - u;
    return [v * v * G.x0 + 2 * v * u * cx + u * u * G.x1, v * v * groundY + 2 * v * u * cy + u * u * G.topY];
  }

  // ---------- state ----------
  let value = 0;
  let lastStage = -1;
  function setValue(v, fromInput) {
    value = Math.max(0, Math.min(100, v));
    if (!fromInput) range.value = value;
    pctEl.textContent = Math.round(value) + '%';
    const st = Math.min(4, Math.floor(value / 20));
    if (st !== lastStage) {
      lastStage = st;
      stageBtns.forEach((btn, i) => { btn.classList.toggle('past', i < st); btn.classList.toggle('now', i === st); });
      if (!ret) {
        const sub = STAGES[st].sub;
        capEl.innerHTML = `${STAGES[st].text} <span>${sub}</span>`;
      }
    }
    for (const b of bulbs) b.want = b.always || (b.gx ?? b.x) * 100 <= value + 0.05;
    updateBtn();
  }

  // ---------- autoplay ----------
  let anim = null;
  const RUN_MS = 17500; // full 0→100% run: ~3.5 s per stage so each sentence can be read
  function animateTo(target, dur, lin) {
    const from = value;
    if (RM) { setValue(target); return; }
    anim = { from, to: target, lin: !!lin, t0: performance.now(), dur: dur || Math.max(500, Math.abs(target - from) * 65) };
  }
  // ---------- iteration (PDCA): learning returns to the start as the new standard ----------
  const iterEl = root.querySelector('[data-el="iter"]');
  const resetBtn = root.querySelector('[data-el="reset"]');
  let soft = false, ret = null, btnMode = '';
  const ICON_PLAY = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 0.5 L9.5 5 L1 9.5 Z"/></svg>';
  const ICON_LOOP = '<svg viewBox="0 0 12 12" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.5;width:11px;height:11px"><path d="M10 6.5a4 4 0 1 1-1.3-3.6"/><path d="M9.6 0.9v2.4H7.2"/></svg>';
  function updateBtn() {
    const mode = ret ? 'busy' : value >= 99.5 ? 'iter' : 'play';
    if (mode === btnMode) return;
    btnMode = mode;
    playBtn.disabled = mode === 'busy';
    playBtn.classList.toggle('ready', mode !== 'play');
    playBtn.innerHTML = mode === 'play' ? ICON_PLAY + 'Reproducir' : ICON_LOOP + 'Iterar';
  }
  function applyIter() {
    for (const b of bulbs) {
      if (b.max0 == null) { b.max0 = b.max; b.flick0 = b.flick; }
      if (b.stage === 0) b.max = Math.min(1, b.max0 * (1 + 0.16 * (iter - 1)));   // se entiende mejor
      if (b.stage === 3) b.flick = b.flick0 * Math.pow(0.55, iter - 1);           // menos fallos al probar
    }
    iterEl.textContent = `· iteración ${iter}`;
    resetBtn.hidden = iter === 1;
  }
  function startReturn() {
    if (ret) return;
    const top = bulbs.filter(b => b.stage === 4).pop();
    const G = geom(top, performance.now() / 1000);
    const sd = SEEDS[Math.min(seedsCount, SEEDS.length - 1)];
    ret = { t0: performance.now(), dur: RM ? 10 : 2600, p0: [G.cx, G.cy], tx: sd[0], trail: [] };
    soft = true; range.disabled = true;
    capEl.innerHTML = 'Iterar y seguir creciendo.';
    animateTo(0, 2200);
    updateBtn();
  }
  function land() {
    const tx = ret.tx; ret = null;
    if (seedsCount < SEEDS.length) {
      const sd = SEEDS[seedsCount++];
      add({ x: sd[0], s: 6.2, h: sd[1], tint: T.azafran, max: 1, stage: -1, type: 'pear', always: true, bend: 0 });
    }
    if (!RM) for (let i = 0; i < 12; i++) {
      const a = rr(-Math.PI, 0), sp = rr(40, 150);
      shards.push({ x: xOf(tx), y: groundY - 2, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 0, vr: 0, life: 0, max: rr(0.3, 0.6), size: 1.4, tint: T.azafran, spark: true });
    }
    iter++; makeAprender(); applyIter(); bulbs.sort((a, b) => a.x - b.x);
    soft = false; range.disabled = false; lastStage = -1; btnMode = ''; setValue(value);
    later(() => { if (!ret && value < 1 && !anim) animateTo(100, RUN_MS, true); }, 2000);
  }
  playBtn.addEventListener('click', () => {
    if (value >= 99.5) startReturn();
    else animateTo(100, (100 - value) / 100 * RUN_MS, true);
  });
  resetBtn.addEventListener('click', () => {
    if (ret) return;
    for (let i = bulbs.length - 1; i >= 0; i--) if (bulbs[i].stage === -1) bulbs.splice(i, 1);
    iter = 1; seedsCount = 0; makeAprender(); applyIter(); bulbs.sort((a, b) => a.x - b.x);
    for (const b of bulbs) { b.g = 0; b.lt = 0; b.sp = 0; b.broken = false; }
    anim = null; lastStage = -1; setValue(0);
    later(() => { if (!ret && value < 1 && !anim) animateTo(100, RUN_MS, true); }, 400);
  });
  stageBtns.forEach((btn, i) => btn.addEventListener('click', () => { if (!ret) animateTo((i + 1) * 20 - (i === 4 ? 0 : 0.2)); }));

  // ---------- input ----------
  range.addEventListener('input', () => { if (ret) return; anim = null; setValue(parseFloat(range.value), true); });
  let dragging = false;
  const valFromEvent = e => { const r = scene.getBoundingClientRect(); return (e.clientX - r.left - TH) / (r.width - 2 * TH) * 100; };
  cv.addEventListener('pointerdown', e => { if (ret) return; dragging = true; anim = null; cv.setPointerCapture(e.pointerId); setValue(valFromEvent(e)); });
  cv.addEventListener('pointermove', e => { if (dragging) setValue(valFromEvent(e)); });
  const end = () => { dragging = false; };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);

  // ---------- sizing ----------
  function resize() {
    const r = scene.getBoundingClientRect();
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = r.height;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    groundY = H - GROUND_OFF;
    range.style.top = (groundY - 14) + 'px';
  }
  const ro = new ResizeObserver(resize); ro.observe(scene);
  resize();

  // ---------- pause while off screen (saves battery on long reads) ----------
  let onScreen = true, running = true, pausedAt = 0;
  const io = new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    if (onScreen && !running) {
      const gap = performance.now() - pausedAt;
      if (anim) anim.t0 += gap;
      if (ret) ret.t0 += gap;
      running = true; last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }); io.observe(scene);

  // ---------- loop ----------
  let last = performance.now();
  let hold = 0; // pause at 100% before the learning returns on its own
  function frame(now) {
    if (disposed) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const t = now / 1000;

    if (anim) {
      const p = clamp((now - anim.t0) / anim.dur);
      const e = anim.lin ? p : p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setValue(anim.from + (anim.to - anim.from) * e);
      if (p >= 1) anim = null;
    }

    // update bulbs
    for (const b of bulbs) {
      if (b.want) {
        b.broken = false;
        b.g = RM ? 1 : Math.min(1, b.g + dt / 0.55);
        if (b.g >= 1) {
          if (b.sp < 1) b.sp = RM ? 1 : Math.min(1, b.sp + dt * 380 / Math.max(20, b.h));
          else b.lt += dt;
        }
      } else {
        b.sp = 0;
        if (!soft && !b.broken && b.lt > 0 && b.g > 0.6) {
          const G = geom(b, t);
          if (!RM) shatter(b, G.cx, G.cy);
          b.broken = true;
        }
        b.lt = 0;
        b.g = RM ? 0 : Math.max(0, b.g - dt / 0.38);
        if (b.g === 0) b.broken = false;
      }
    }

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const hx = xOf(value / 100);
    const geo = bulbs.map(b => geom(b, t));
    const lights = bulbs.map(b => lightOf(b, t));

    // glow pass
    ctx.globalCompositeOperation = 'lighter';
    bulbs.forEach((b, i) => {
      const L = lights[i], G = geo[i];
      if (L < 0.02 || G.sc < 0.05) return;
      const r1 = Math.min(b.s * (4 + 3 * L), 46) * G.sc;
      let g = ctx.createRadialGradient(G.cx, G.cy, 0, G.cx, G.cy, r1);
      g.addColorStop(0, rgba(b.tint, (b.rays ? 0.4 : 0.26) * L)); g.addColorStop(1, rgba(b.tint, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(G.cx, G.cy, r1, 0, Math.PI * 2); ctx.fill();
      const r2 = Math.min(b.s * 9, b.rays ? 80 : 60) * G.sc;
      g = ctx.createRadialGradient(G.cx, G.cy, 0, G.cx, G.cy, r2);
      g.addColorStop(0, rgba(b.tint, (b.rays ? 0.1 : 0.035) * L)); g.addColorStop(1, rgba(b.tint, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(G.cx, G.cy, r2, 0, Math.PI * 2); ctx.fill();
      // reflection on the ground
      ctx.save(); ctx.translate(G.x0, groundY); ctx.scale(1, 0.22);
      const rr2 = b.s * 4.5;
      g = ctx.createRadialGradient(0, 0, 0, 0, 0, rr2);
      g.addColorStop(0, rgba(b.tint, 0.3 * L)); g.addColorStop(1, rgba(b.tint, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rr2, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
    ctx.globalCompositeOperation = 'source-over';

    // ground track
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(227,194,155,0.2)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(TH, groundY); ctx.lineTo(W - TH, groundY); ctx.stroke();
    if (hx > TH) {
      const lg = ctx.createLinearGradient(TH, 0, Math.max(TH + 1, hx), 0);
      lg.addColorStop(0, 'rgba(224,192,104,0.35)'); lg.addColorStop(1, 'rgba(224,192,104,0.95)');
      ctx.strokeStyle = lg; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(TH, groundY); ctx.lineTo(hx, groundY); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(227,194,155,0.32)'; ctx.lineWidth = 1;
    for (let k = 1; k < 5; k++) { const x = xOf(k / 5); ctx.beginPath(); ctx.moveTo(x, groundY + 5); ctx.lineTo(x, groundY + 10); ctx.stroke(); }

    // cords
    bulbs.forEach((b, i) => {
      const G = geo[i];
      if (b.g <= 0.001) return;
      if (b.stage === -1) { // the wedge: a learning that holds the new standard in place
        const w = 8 * eOutCubic(clamp(b.g / 0.4));
        ctx.fillStyle = 'rgba(224,192,104,0.6)';
        ctx.beginPath(); ctx.moveTo(G.x0 - w, groundY); ctx.lineTo(G.x0 + w, groundY); ctx.lineTo(G.x0 + w, groundY - w * 0.75); ctx.closePath(); ctx.fill();
      }
      ctx.strokeStyle = 'rgba(227,194,155,0.42)'; ctx.lineWidth = b.rays ? 1.8 : 1.3;
      ctx.beginPath(); ctx.moveTo(G.x0, groundY);
      ctx.quadraticCurveTo(G.ccx, G.ccy, G.x1, G.topY);
      ctx.stroke();
      // the spark climbs the cord and leaves it warm behind it
      if (b.want && b.sp > 0) {
        const L = lights[i];
        ctx.strokeStyle = b.sp < 1 ? 'rgba(224,192,104,0.9)' : `rgba(224,192,104,${0.15 + 0.3 * L})`;
        ctx.beginPath(); ctx.moveTo(G.x0, groundY);
        for (let k = 1; k <= 14; k++) { const p = cordPoint(b, G, b.sp * k / 14); ctx.lineTo(p[0], p[1]); }
        ctx.stroke();
        if (b.sp < 1) {
          const p = cordPoint(b, G, b.sp);
          ctx.globalCompositeOperation = 'lighter';
          const sg = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 9);
          sg.addColorStop(0, 'rgba(244,238,228,0.95)'); sg.addColorStop(0.35, 'rgba(224,192,104,0.6)'); sg.addColorStop(1, 'rgba(196,71,31,0)');
          ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(p[0], p[1], 9, 0, Math.PI * 2); ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    });
    // bulbs
    bulbs.forEach((b, i) => drawBulb(b, geo[i], lights[i], t));

    // shards
    for (let i = shards.length - 1; i >= 0; i--) {
      const p = shards[i];
      p.life += dt;
      if (p.life >= p.max) { shards.splice(i, 1); continue; }
      p.vy += (p.spark ? 120 : 420) * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
      if (p.y > groundY - 1) { p.y = groundY - 1; p.vy *= -0.3; p.vx *= 0.55; p.vr *= 0.5; }
      const a = 1 - p.life / p.max;
      if (p.spark) {
        ctx.fillStyle = `rgba(244,238,228,${a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = rgba(p.tint, 0.55 * a); ctx.strokeStyle = `rgba(244,238,228,${0.7 * a})`; ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(0, -p.size); ctx.lineTo(p.size * 0.8, p.size * 0.6); ctx.lineTo(-p.size * 0.6, p.size * 0.4); ctx.closePath();
        ctx.fill(); ctx.stroke(); ctx.restore();
      }
    }

    // continuous loop: after a short pause at 100%, iterate without a click
    if (AUTO && !RM && !ret && !anim && !dragging && value >= 99.5) {
      hold += dt;
      if (hold > 3.5) { hold = 0; startReturn(); }
    } else hold = 0;

    // returning learning: an arc of light from the top of the staircase back to the start
    if (ret) {
      const p = clamp((now - ret.t0) / ret.dur), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const [x0, y0] = ret.p0, x1 = xOf(ret.tx), y1 = groundY;
      const cx = (x0 + x1) / 2, cy = Math.max(-40, Math.min(y0, y1) - 150);
      const q = u => { const v = 1 - u; return [v * v * x0 + 2 * v * u * cx + u * u * x1, v * v * y0 + 2 * v * u * cy + u * u * y1]; };
      ctx.setLineDash([2, 6]); ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(224,192,104,${0.35 * (1 - clamp((p - 0.8) / 0.2))})`;
      ctx.beginPath();
      for (let k = 0; k <= 48; k++) { const pt = q(k / 48); k ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1]); }
      ctx.stroke(); ctx.setLineDash([]);
      const [ox, oy] = q(e);
      ret.trail.push([ox, oy]); if (ret.trail.length > 20) ret.trail.shift();
      ctx.globalCompositeOperation = 'lighter';
      ret.trail.forEach(([px, py], k) => { const a = (k + 1) / ret.trail.length; ctx.fillStyle = `rgba(224,192,104,${0.35 * a})`; ctx.beginPath(); ctx.arc(px, py, 1 + 3 * a, 0, Math.PI * 2); ctx.fill(); });
      const og = ctx.createRadialGradient(ox, oy, 0, ox, oy, 24);
      og.addColorStop(0, 'rgba(244,238,228,1)'); og.addColorStop(0.25, 'rgba(224,192,104,0.8)'); og.addColorStop(1, 'rgba(224,192,104,0)');
      ctx.fillStyle = og; ctx.beginPath(); ctx.arc(ox, oy, 24, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      if (p >= 1) land();
    }

    // flame rides the tip of the line
    const vx = (hx - flame.x) / Math.max(dt, 1e-3);
    flame.vx += (vx - flame.vx) * Math.min(1, dt * 8);
    flame.x = hx;
    const targetLean = Math.max(-7, Math.min(7, -flame.vx * 0.012));
    flame.lean += (targetLean - flame.lean) * Math.min(1, dt * 6);
    updateEmbers(dt, Math.abs(flame.vx) > 20);
    drawFlame(t);

    if (onScreen) raf = requestAnimationFrame(frame);
    else { running = false; pausedAt = performance.now(); }
  }

  applyIter();
  setValue(START);
  raf = requestAnimationFrame(frame);
  if (RM) setValue(100);
  else if (AUTO) later(() => { if (value === 0 && !anim) animateTo(100, RUN_MS, true); }, 500);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout);
    ro.disconnect();
    io.disconnect();
  };
}
