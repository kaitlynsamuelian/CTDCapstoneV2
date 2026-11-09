// MetamorphUs feasibility test V1: p5.js display for the Arduino controllers.
// Keys: C = connect Arduino, R = start a new round, D = download the round log (CSV).
// With no Arduino connected, it runs in mouse mode: mouse left/right = Sunlight,
// mouse up/down = Water, hold Space = Bloom.

// ---- Settings to experiment with between test rounds ----
const SETTINGS = {
  sunRange: [0.45, 0.65],   // healthy Sunlight band (0 = knob fully left, 1 = fully right)
  waterRange: [0.30, 0.50], // healthy Water band
  holdSeconds: 10,          // how long the group must stay balanced to unlock the butterfly
  onBreak: 'reset',         // 'reset' = progress drops to 0; 'drain' = progress slowly drains
  drainPerSecond: 2,        // used only with 'drain'
  requireMovement: false,   // true = a knob counts only if someone touched it recently
  movementWindow: 3,        // seconds (used only with requireMovement)
  revealSeconds: 8,         // how long the butterfly shows before a new round
};

let input = { sun: 0, water: 0, bloom: false, sunAnchor: 0, waterAnchor: 0, sunMoved: -99, waterMoved: -99 };
let source = 'mouse';
let serialMsg = '';
let state = 'playing';
let progress = 0, wasBalanced = false, breaks = 0, round = 1, roundStart = 0, revealStart = 0;
const roundLog = [];
const particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Helvetica');
  for (let i = 0; i < 500; i++) particles.push({ x: random(width), y: random(height), t: random(TWO_PI) });
  roundStart = millis() / 1000;
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }

function draw() {
  const now = millis() / 1000;
  const dt = deltaTime / 1000;

  if (source === 'mouse') {
    setKnob('sun', constrain(mouseX / width, 0, 1), now);
    setKnob('water', constrain(mouseY / height, 0, 1), now);
    input.bloom = keyIsDown(32);
  }

  const c = checks(now);
  if (state === 'playing') {
    if (c.balanced) {
      progress += dt;
    } else {
      if (wasBalanced) breaks++;
      progress = SETTINGS.onBreak === 'reset' ? 0 : max(0, progress - SETTINGS.drainPerSecond * dt);
    }
    wasBalanced = c.balanced;
    if (progress >= SETTINGS.holdSeconds) {
      state = 'reveal';
      revealStart = now;
      roundLog.push([round, (now - roundStart).toFixed(1), breaks, SETTINGS.holdSeconds, SETTINGS.onBreak, SETTINGS.requireMovement]);
    }
  } else if (now - revealStart > SETTINGS.revealSeconds) {
    newRound();
  }

  const health = state === 'reveal' ? 1 : progress / SETTINGS.holdSeconds;
  drawScene(health, now);
  if (state === 'reveal') {
    // Dim the scene so the glowing butterfly stands out.
    noStroke(); fill(10, 15, 40, min(200, (now - revealStart) * 200)); rect(0, 0, width, height);
  }
  drawParticles(health, now);
  if (state === 'playing') {
    drawMeters(c);
    drawProgress();
  } else {
    fill(255); noStroke(); textAlign(CENTER); textSize(28);
    text('The ecosystem transformed together', width / 2, height * 0.85);
  }
  drawHud();
}

// ---- Input ----
function setKnob(name, v, now) {
  // Counts as "moved" only past a small threshold, so electrical noise doesn't count as a touch.
  if (abs(v - input[name + 'Anchor']) > 0.02) {
    input[name + 'Moved'] = now;
    input[name + 'Anchor'] = v;
  }
  input[name] = v;
}

function checks(now) {
  const fresh = (k) => !SETTINGS.requireMovement || now - input[k + 'Moved'] < SETTINGS.movementWindow;
  const sunOK = inRange(input.sun, SETTINGS.sunRange) && fresh('sun');
  const waterOK = inRange(input.water, SETTINGS.waterRange) && fresh('water');
  const bloomOK = input.bloom;
  return { sunOK, waterOK, bloomOK, balanced: sunOK && waterOK && bloomOK };
}

function inRange(v, r) { return v >= r[0] && v <= r[1]; }

function newRound() {
  round++;
  progress = 0; breaks = 0; wasBalanced = false;
  state = 'playing';
  roundStart = millis() / 1000;
}

// ---- Drawing ----
function drawScene(health, now) {
  background(lerpColor(color(70, 60, 55), color(120, 190, 235), health));
  noStroke();
  fill(255, 210, 80, 60 + input.sun * 195);
  circle(width * 0.15, height * 0.18, 40 + input.sun * 140);

  stroke(150, 190, 255, 180); strokeWeight(2);
  const drops = floor(input.water * 70);
  for (let i = 0; i < drops; i++) {
    const x = (i * 97.3) % width;
    const y = (now * 400 + i * 53) % (height * 0.7);
    line(x, y, x - 3, y + 12);
  }

  noStroke();
  const groundY = height * 0.7;
  fill(lerpColor(color(110, 85, 60), color(70, 150, 70), health));
  rect(0, groundY, width, height - groundY);

  for (let i = 0; i < 9; i++) {
    const x = width * (0.1 + i * 0.1);
    const h = 15 + health * height * 0.3 * (0.6 + 0.4 * sin(i * 1.7));
    stroke(lerpColor(color(120, 100, 60), color(40, 140, 50), health)); strokeWeight(4);
    line(x, groundY, x, groundY - h);
    if (input.bloom && health > 0.3) {
      noStroke(); fill(255, 120 + i * 12, 180);
      circle(x, groundY - h, 10 + health * 18);
    }
  }
}

function butterflyPoint(t, s) {
  const r = exp(cos(t)) - 2 * cos(4 * t) - pow(sin(t / 12), 5);
  return { x: width / 2 + s * sin(t) * r, y: height * 0.4 - s * cos(t) * r };
}

function drawParticles(health, now) {
  const reveal = state === 'reveal';
  const s = min(width, height) / 14;
  blendMode(ADD); noStroke();
  particles.forEach((p, i) => {
    if (reveal) {
      const tgt = butterflyPoint((i / particles.length) * 12 * PI + now * 0.05, s);
      p.x = lerp(p.x, tgt.x, 0.06);
      p.y = lerp(p.y, tgt.y, 0.06);
      fill(255, 190, 110, 140); circle(p.x, p.y, 6);
      fill(255, 240, 200, 35); circle(p.x, p.y, 20);
    } else {
      p.x = (p.x + sin(now + p.t) * 0.6 + width) % width;
      p.y = (p.y + cos(now * 0.7 + p.t) * 0.4 + height) % height;
      fill(255, 255, 210, 20 + health * 80); circle(p.x, p.y, 3);
    }
  });
  blendMode(BLEND);
}

function drawMeters(c) {
  const w = min(260, width / 3.6), h = 70, y = height - h - 24;
  const meters = [
    { label: 'SUNLIGHT', v: input.sun, range: SETTINGS.sunRange, ok: c.sunOK },
    { label: 'WATER', v: input.water, range: SETTINGS.waterRange, ok: c.waterOK },
    { label: 'BLOOM (hold)', v: input.bloom ? 1 : 0, range: null, ok: c.bloomOK },
  ];
  meters.forEach((m, i) => {
    const x = width / 2 + (i - 1) * (w + 20) - w / 2;
    fill(0, 150); stroke(m.ok ? color(110, 255, 140) : color(255, 255, 255, 80)); strokeWeight(3);
    rect(x, y, w, h, 10);
    noStroke(); fill(255); textAlign(LEFT); textSize(14);
    text(m.label + (m.ok ? '  ✓' : ''), x + 12, y + 22);
    const bx = x + 12, by = y + 36, bw = w - 24, bh = 18;
    fill(255, 40); rect(bx, by, bw, bh, 4);
    if (m.range) { fill(110, 255, 140, 90); rect(bx + m.range[0] * bw, by, (m.range[1] - m.range[0]) * bw, bh); }
    fill(255); rect(bx + m.v * bw - 3, by - 3, 6, bh + 6);
  });
}

function drawProgress() {
  const w = min(500, width * 0.6), x = width / 2 - w / 2, y = 30;
  noStroke(); fill(0, 120); rect(x, y, w, 16, 8);
  fill(255, 220, 120); rect(x, y, w * (progress / SETTINGS.holdSeconds), 16, 8);
  fill(255); textAlign(CENTER); textSize(14);
  text(`Balance held: ${progress.toFixed(1)} / ${SETTINGS.holdSeconds} s`, width / 2, y + 36);
}

function drawHud() {
  fill(255, 200); noStroke(); textAlign(LEFT); textSize(12);
  const lines = [
    source === 'arduino' ? 'Input: Arduino' : 'Input: mouse mode (X = Sunlight, Y = Water, hold Space = Bloom)',
    `Round ${round} · breaks this round: ${breaks} · rounds logged: ${roundLog.length}`,
    'C = connect Arduino · R = new round · D = download log',
  ];
  if (serialMsg) lines.push(serialMsg);
  lines.forEach((l, i) => text(l, 12, height - 95 - 24 - (lines.length - 1 - i) * 16));
}

// ---- Keys ----
function keyPressed() {
  const k = key.toLowerCase();
  if (k === 'c') connectSerial();
  if (k === 'r') newRound();
  if (k === 'd') {
    const rows = ['round,seconds_to_reveal,breaks,hold_seconds,on_break,require_movement', ...roundLog.map((r) => r.join(','))];
    saveStrings(rows, 'metamorphus-test-log', 'csv');
  }
  if (key === ' ') return false; // stop Space from scrolling the page
}

// ---- Web Serial (Chrome only; page must be served from localhost) ----
async function connectSerial() {
  if (!('serial' in navigator)) { serialMsg = 'Web Serial not available: use Chrome and open via http://localhost'; return; }
  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    const decoder = new TextDecoderStream();
    port.readable.pipeTo(decoder.writable);
    const reader = decoder.readable.getReader();
    source = 'arduino';
    serialMsg = '';
    let buf = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += value;
      const lines = buf.split('\n');
      buf = lines.pop();
      lines.forEach(parseLine);
    }
  } catch (err) {
    serialMsg = 'Serial error: ' + err.message;
    source = 'mouse';
  }
}

function parseLine(line) {
  const p = line.trim().split(',');
  if (p.length !== 3) return;
  const now = millis() / 1000;
  setKnob('sun', Number(p[0]) / 1023, now);
  setKnob('water', Number(p[1]) / 1023, now);
  input.bloom = p[2] === '1';
}
