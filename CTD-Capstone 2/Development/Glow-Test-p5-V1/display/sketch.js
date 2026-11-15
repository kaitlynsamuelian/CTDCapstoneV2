// MetamorphUs glow test V1: p5.js display.
// Two elements (Sunlight, Water). Keep both in their sweet spot together and the barren
// patch blooms and glows; hold the balance and the petals form a butterfly.
//
// Keys:  C = connect Arduino   M = switch buttons / knobs   H = hide or show the overlay
//        + / - = more or fewer glowing particles (to test how smoothly it runs)   R = restart
// No Arduino? Buttons mode: hold A (Sunlight) and L (Water). Knobs mode: move the mouse.

const SETTINGS = {
  band: [0.42, 0.68],   // sweet spot for both elements (0 = empty, 1 = full)
  riseRate: 0.38,       // buttons mode: how fast a level rises per second while held
  fallRate: 0.24,       // buttons mode: how fast it drains when released
  holdSeconds: 6,       // balanced time needed for the butterfly
  drainRate: 1.5,       // how fast hold progress drains when balance breaks
  revealSeconds: 9,     // how long the butterfly flies
};

const DEMO = new URLSearchParams(location.search).has('demo');  // self-playing, for screenshots
let mode = 'buttons';
let source = 'keyboard';
let serialMsg = '';
let showHud = true;
let raw = { b1: 0, b2: 0, a0: 0, a1: 0 };
let sun = 0, water = 0, life = 0, progress = 0;
let state = 'playing', revealStart = 0, lastLed = '';
let particleCount = 700;
let particles = [], plants = [], sprites = {};
let writer = null, fps = 60, lastNow = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  textFont('Helvetica');
  buildWorld();
  if (new URLSearchParams(location.search).get('demo') === 'reveal') { state = 'reveal'; life = 1; sun = water = 0.55; }
}
function windowResized() { resizeCanvas(windowWidth, windowHeight); buildWorld(); }

function buildWorld() {
  randomSeed(7);
  plants = [];
  for (let i = 0; i < 46; i++) {
    plants.push({ x: random(0.04, 0.96) * width, h: random(0.12, 0.42) * height, lean: random(-40, 40), phase: random(TWO_PI), hue: random(-25, 25), buds: floor(random(2, 5)) });
  }
  plants.sort((a, b) => a.h - b.h);
  setParticles(particleCount);
}
function setParticles(n) {
  particleCount = constrain(n, 100, 6000);
  while (particles.length < particleCount) particles.push({ x: random(width), y: random(height * 0.3, height), vx: 0, vy: 0, ph: random(TWO_PI), hue: random(360), s: random(0.5, 1.4) });
  particles.length = particleCount;
  // Butterfly-shaped targets for the reveal.
  const sc = min(width, height) * 0.115;
  for (const p of particles) {
    const th = random(TWO_PI * 2);
    const r = (exp(sin(th)) - 2 * cos(4 * th) + pow(sin((2 * th - PI) / 24), 5)) * sqrt(random());
    p.tx = sin(th) * r * sc; p.ty = -cos(th) * r * sc;
  }
}

// A soft glowing dot, pre-drawn once per colour so thousands can be stamped quickly.
function glow(hue, sat, lum) {
  const key = round(hue / 10) + '_' + sat + '_' + lum;
  if (!sprites[key]) {
    const g = document.createElement('canvas'); g.width = g.height = 64;
    const c = g.getContext('2d'), gr = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    const h = ((round(hue / 10) * 10) % 360 + 360) % 360;
    gr.addColorStop(0, `hsla(${h},${sat}%,${min(98, lum + 30)}%,1)`);
    gr.addColorStop(0.25, `hsla(${h},${sat}%,${lum}%,0.55)`);
    gr.addColorStop(1, `hsla(${h},${sat}%,${lum}%,0)`);
    c.fillStyle = gr; c.fillRect(0, 0, 64, 64);
    sprites[key] = g;
  }
  return sprites[key];
}
function stamp(x, y, size, hue, alpha, sat = 90, lum = 60) {
  const ctx = drawingContext;
  ctx.globalAlpha = constrain(alpha, 0, 1);
  ctx.drawImage(glow(hue, sat, lum), x - size / 2, y - size / 2, size, size);
}

function closeness(v) {
  const [lo, hi] = SETTINGS.band;
  if (v >= lo && v <= hi) return 1;
  return max(0, 1 - (v < lo ? lo - v : v - hi) / 0.4);
}
const inBand = v => v >= SETTINGS.band[0] && v <= SETTINGS.band[1];

function readInputs(dt, now) {
  if (DEMO) {  // scripted: rise into balance, wobble, then hold
    sun = constrain(now * 0.11, 0, 0.55) + (now > 6 && now < 8 ? 0.25 * sin((now - 6) * PI / 2) : 0);
    water = constrain((now - 1.5) * 0.1, 0, 0.55);
    return;
  }
  let h1 = raw.b1, h2 = raw.b2;
  if (source === 'keyboard') { h1 = keyIsDown(65) ? 1 : 0; h2 = keyIsDown(76) ? 1 : 0; }
  if (mode === 'buttons') {
    sun = constrain(sun + (h1 ? SETTINGS.riseRate : -SETTINGS.fallRate) * dt, 0, 1);
    water = constrain(water + (h2 ? SETTINGS.riseRate : -SETTINGS.fallRate) * dt, 0, 1);
  } else if (source === 'arduino') {
    sun = lerp(sun, raw.a0 / 1023, 0.2); water = lerp(water, raw.a1 / 1023, 0.2);
  } else {
    sun = constrain(mouseX / width, 0, 1); water = constrain(1 - mouseY / height, 0, 1);
  }
}

function draw() {
  const now = millis() / 1000, dt = DEMO ? min(2, now - lastNow) : min(0.1, deltaTime / 1000);
  lastNow = now;
  fps = lerp(fps, frameRate(), 0.05);
  readInputs(dt, now);

  const sunOk = inBand(sun), waterOk = inBand(water), balanced = sunOk && waterOk;
  if (state === 'playing') {
    progress = balanced ? progress + dt : max(0, progress - SETTINGS.drainRate * dt);
    if (progress >= SETTINGS.holdSeconds) { state = 'reveal'; revealStart = now; }
  } else if (now - revealStart > SETTINGS.revealSeconds) { restart(); }

  const target = state === 'reveal' ? 1 : closeness(sun) * closeness(water) * 0.55 + (progress / SETTINGS.holdSeconds) * 0.45;
  life = lerp(life, target, 1 - exp(-dt * 2.4));  // time-based, so it looks the same at any frame rate
  sendLed(state === 'reveal' || balanced ? 'G' : (sunOk || waterOk) ? 'R' : 'O');

  drawSky();
  drawPlants(now);
  drawParticles(now, dt);
  drawingContext.globalAlpha = 1; drawingContext.globalCompositeOperation = 'source-over';
  if (showHud) drawHud(sunOk, waterOk);
}

function drawSky() {
  const ctx = drawingContext, g = ctx.createLinearGradient(0, 0, 0, height);
  const warm = constrain((sun - SETTINGS.band[1]) * 3, 0, 1), wet = constrain((water - SETTINGS.band[1]) * 3, 0, 1);
  // Barren: flat grey-brown. Alive: deep night indigo. Too much sun scorches, too much water floods.
  const top = lerpColor(lerpColor(color(46, 44, 42), color(10, 12, 46), life), color(120, 50, 10), warm * 0.6);
  const bot = lerpColor(lerpColor(color(70, 64, 56), color(14, 44, 52), life), color(20, 60, 140), wet * 0.6);
  g.addColorStop(0, top.toString()); g.addColorStop(1, bot.toString());
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  ctx.fillStyle = g; ctx.fillRect(0, 0, width, height);
  // Ground
  noStroke(); fill(lerpColor(color(52, 46, 40), color(8, 26, 24), life));
  rect(0, height * 0.9, width, height * 0.1);
}

function drawPlants(now) {
  const ctx = drawingContext;
  for (const p of plants) {
    const grow = constrain(life * 1.25 - 0.05, 0.12, 1);   // barren: short dead stalks
    const sway = sin(now * 0.8 + p.phase) * 14 * life;
    const baseY = height * 0.9, tipX = p.x + p.lean * grow + sway, tipY = baseY - p.h * grow;
    const hue = 140 + p.hue - sun * 60 + water * 50;          // more sun = warmer, more water = bluer
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    noFill(); strokeWeight(2 + 2 * life);
    stroke(lerpColor(color(88, 80, 70), color(`hsl(${round(((hue % 360) + 360) % 360)},70%,45%)`), life));
    bezier(p.x, baseY, p.x, baseY - p.h * grow * 0.5, tipX, tipY + p.h * grow * 0.3, tipX, tipY);
    if (life > 0.18) {
      ctx.globalCompositeOperation = 'lighter';
      const a = (life - 0.18) * 1.2, pulse = 1 + 0.12 * sin(now * 2 + p.phase);
      for (let b = 0; b < p.buds; b++) {
        const t = 1 - b * 0.16, bx = lerp(p.x, tipX, t * t), by = lerp(baseY, tipY, t);
        const bh = hue + 170 + b * 25 - sun * 40 + water * 40;
        stamp(bx + sin(p.phase + b) * 10, by, (70 + p.h * 0.18) * life * pulse * (1 - b * 0.15), bh, a);
      }
    }
  }
  noStroke();
}

function drawParticles(now, dt) {
  const ctx = drawingContext; ctx.globalCompositeOperation = 'lighter';
  const reveal = state === 'reveal', rt = now - revealStart;
  const cx = width / 2 + (reveal ? sin(rt * 0.7) * width * 0.16 : 0), cy = height * 0.3 + (reveal ? cos(rt * 1.1) * height * 0.07 : 0);
  const flap = 0.45 + 0.55 * abs(cos(rt * 3));
  for (const p of particles) {
    if (reveal) {
      const k = constrain(rt * 0.6, 0, 1) * (1 - exp(-dt * 5.5));
      p.x = lerp(p.x, cx + p.tx * flap, k); p.y = lerp(p.y, cy + p.ty, k);
      stamp(p.x, p.y, 14 * p.s, p.hue + now * 40, 0.7);
    } else {
      p.x += sin(now * 0.6 + p.ph) * 22 * dt + (noise(p.ph, now * 0.1) - 0.5) * 30 * dt;
      p.y -= (6 + 26 * life) * p.s * dt;
      if (p.y < height * 0.15) { p.y = height * 0.9; p.x = random(width); }
      if (p.x < 0) p.x += width; if (p.x > width) p.x -= width;
      const tw = 0.5 + 0.5 * sin(now * 3 + p.ph);
      stamp(p.x, p.y, (10 + 14 * life) * p.s, 60 - sun * 40 + water * 150 + p.hue * 0.15, life * (0.25 + 0.6 * tw));
    }
  }
}

function drawHud(sunOk, waterOk) {
  const x = 28, w = 260;
  meter(x, height - 96, w, 'Sunlight' + (source === 'keyboard' && mode === 'buttons' ? '  (hold A)' : ''), sun, sunOk, color(255, 200, 70));
  meter(x, height - 48, w, 'Water' + (source === 'keyboard' && mode === 'buttons' ? '  (hold L)' : ''), water, waterOk, color(90, 170, 255));
  // Hold progress
  if (state === 'playing') {
    fill(255, 40); rect(x + w + 30, height - 62, w, 10, 5);
    fill(140, 230, 190); rect(x + w + 30, height - 62, w * progress / SETTINGS.holdSeconds, 10, 5);
    fill(255, 220); textSize(14); textAlign(LEFT);
    text(sunOk && waterOk ? 'Balanced: hold it together…' : (sunOk || waterOk) ? 'Half right: one element is in its sweet spot' : 'Bring both elements into the bright zone', x + w + 30, height - 72);
  }
  fill(255, 190); textSize(13); textAlign(LEFT);
  const lines = [
    'MetamorphUs glow test V1 (p5.js)',
    `Input: ${source === 'arduino' ? 'Arduino' : DEMO ? 'demo' : 'keyboard / mouse'} · mode: ${mode}`,
    `${fps.toFixed(0)} frames per second · ${particleCount} glowing particles · ${width} × ${height}`,
    'C connect · M buttons/knobs · +/- particles · H hide · R restart',
  ];
  if (serialMsg) lines.push(serialMsg);
  lines.forEach((l, i) => text(l, 28, 32 + i * 19));
}
function meter(x, y, w, label, v, ok, col) {
  noStroke(); fill(255, 220); textSize(14); textAlign(LEFT); text(label, x, y - 8);
  fill(255, 35); rect(x, y, w, 12, 6);
  fill(255, 90); rect(x + w * SETTINGS.band[0], y - 2, w * (SETTINGS.band[1] - SETTINGS.band[0]), 16, 4);
  fill(ok ? col : color(200, 200, 200)); rect(x, y, w * v, 12, 6);
}

function restart() { state = 'playing'; progress = 0; sun = 0; water = 0; }

function keyPressed() {
  const k = key.toLowerCase();
  if (k === 'c') connectSerial();
  if (k === 'm') mode = mode === 'buttons' ? 'knobs' : 'buttons';
  if (k === 'h') showHud = !showHud;
  if (k === 'r') restart();
  if (key === '+' || key === '=') setParticles(round(particleCount * 1.5));
  if (key === '-') setParticles(round(particleCount / 1.5));
}

// ---- Web Serial (Chrome or Edge; open the page from http://localhost) ----
async function connectSerial() {
  if (!('serial' in navigator)) { serialMsg = 'Web Serial not available: use Chrome and open http://localhost:8000'; return; }
  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    writer = port.writable.getWriter();
    source = 'arduino'; serialMsg = 'Arduino connected'; lastLed = '';
    const reader = port.readable.pipeThrough(new TextDecoderStream()).getReader();
    let buf = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += value;
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const parts = buf.slice(0, i).trim().split(',').map(Number);
        buf = buf.slice(i + 1);
        if (parts.length === 4 && parts.every(n => !isNaN(n))) raw = { b1: parts[0], b2: parts[1], a0: parts[2], a1: parts[3] };
      }
    }
  } catch (err) {
    serialMsg = 'Serial: ' + err.message; source = 'keyboard'; writer = null;
  }
}
function sendLed(c) {
  if (!writer || c === lastLed) return;
  lastLed = c;
  writer.write(new TextEncoder().encode(c)).catch(() => {});
}
