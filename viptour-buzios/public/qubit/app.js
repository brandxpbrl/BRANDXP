const canvas = document.getElementById("earthCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const nodeCount = document.getElementById("nodeCount");
const eventCount = document.getElementById("eventCount");
const deltaTotal = document.getElementById("deltaTotal");
const nodesEl = document.getElementById("nodes");
const eventsEl = document.getElementById("events");
const mpeEl = document.getElementById("mpe");
const mpeMetricsEl = document.getElementById("mpeMetrics");

let state = { nodes: [], events: [], total_events: 0, total_delta_points: 0, mpe: null };
let stars = [];

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(600, Math.floor(rect.width * devicePixelRatio));
  canvas.height = Math.max(360, Math.floor(rect.height * devicePixelRatio));
  stars = Array.from({ length: 180 }, (_, i) => ({
    x: pseudoRandom(i * 17 + 3),
    y: pseudoRandom(i * 31 + 9),
    r: 0.45 + pseudoRandom(i * 47 + 13) * 2.4,
    a: 0.18 + pseudoRandom(i * 53 + 21) * 0.75,
  }));
}

function pseudoRandom(seed) {
  const x = Math.sin(seed * 999.17) * 10000;
  return x - Math.floor(x);
}

function draw() {
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.36;
  const t = performance.now() * 0.001;

  drawCosmicBackground(w, h, t);
  drawHorizonField(cx, cy, radius, t);

  const gradient = ctx.createRadialGradient(cx, cy, radius * 0.08, cx, cy, radius);
  gradient.addColorStop(0, "rgba(255,255,255,0.22)");
  gradient.addColorStop(0.42, "rgba(87,216,255,0.18)");
  gradient.addColorStop(0.7, "rgba(255,79,145,0.12)");
  gradient.addColorStop(1, "rgba(245,184,75,0.08)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  drawGenesisSphere(cx, cy, radius, t);
  drawSkyGeometry(cx, cy, radius, t);
  drawTetrahedron(cx, cy, radius, t);
  drawHelix(cx, cy, radius, t);
  drawLayers(cx, cy, radius, t);
  drawCross(cx, cy, radius);

  ctx.strokeStyle = "rgba(245,184,75,0.26)";
  ctx.lineWidth = 1 * devicePixelRatio;
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.arc(cx, cy, (radius * i) / 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  const nodes = state.nodes || [];
  const placedNodes = placeNodes(nodes, cx, cy, radius, t);

  placedNodes.forEach((node) => drawEnergyStream(cx, cy, node.x, node.y, node.coherence || 0, t));
  placedNodes.forEach((node) => drawCubeNode(node, t));

  drawCoreCube(cx, cy, radius, t);

  requestAnimationFrame(draw);
}

function drawCosmicBackground(w, h, t) {
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.47, 10, w * 0.5, h * 0.47, Math.max(w, h) * 0.75);
  bg.addColorStop(0, "rgba(39,23,58,0.95)");
  bg.addColorStop(0.34, "rgba(7,12,25,0.98)");
  bg.addColorStop(1, "rgba(1,2,6,1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  stars.forEach((star, i) => {
    const flicker = 0.65 + Math.sin(t * 1.7 + i) * 0.35;
    ctx.fillStyle = `rgba(255,245,216,${star.a * flicker})`;
    ctx.beginPath();
    ctx.arc(star.x * w, star.y * h, star.r * devicePixelRatio, 0, Math.PI * 2);
    ctx.fill();
  });

  drawGalaxy(w * 0.18, h * 0.22, Math.min(w, h) * 0.11, -0.45, t);
  drawGalaxy(w * 0.84, h * 0.20, Math.min(w, h) * 0.09, 0.62, -t);
  drawGalaxy(w * 0.86, h * 0.82, Math.min(w, h) * 0.08, -0.25, t * 0.7);
  drawGalaxy(w * 0.13, h * 0.80, Math.min(w, h) * 0.07, 0.35, -t * 0.6);
}

function drawGalaxy(x, y, size, rotation, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation + Math.sin(t * 0.12) * 0.08);
  for (let arm = 0; arm < 2; arm++) {
    ctx.strokeStyle = arm === 0 ? "rgba(245,184,75,0.22)" : "rgba(255,79,145,0.18)";
    ctx.lineWidth = 1.2 * devicePixelRatio;
    ctx.beginPath();
    for (let i = 0; i < 120; i++) {
      const p = i / 119;
      const angle = p * Math.PI * 4 + arm * Math.PI;
      const r = size * p;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r * 0.34;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, size * 0.42);
  glow.addColorStop(0, "rgba(255,255,255,0.42)");
  glow.addColorStop(0.35, "rgba(245,184,75,0.22)");
  glow.addColorStop(1, "rgba(245,184,75,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.42, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGenesisSphere(cx, cy, radius, t) {
  const sphere = ctx.createRadialGradient(cx, cy, radius * 0.04, cx, cy, radius * 0.96);
  sphere.addColorStop(0, "rgba(255,255,255,0.42)");
  sphere.addColorStop(0.18, "rgba(245,184,75,0.20)");
  sphere.addColorStop(0.62, "rgba(245,184,75,0.08)");
  sphere.addColorStop(1, "rgba(245,184,75,0)");
  ctx.fillStyle = sphere;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.96, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(245,184,75,0.44)";
  ctx.lineWidth = 1.6 * devicePixelRatio;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(
      cx,
      cy,
      radius * (0.72 + i * 0.08),
      radius * (0.26 + i * 0.035),
      (Math.PI / 5) * i + Math.sin(t * 0.18) * 0.08,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  const burst = ctx.createRadialGradient(cx, cy, 1, cx, cy, radius * 0.34);
  burst.addColorStop(0, "rgba(255,255,255,0.94)");
  burst.addColorStop(0.18, "rgba(245,184,75,0.58)");
  burst.addColorStop(0.48, "rgba(255,79,145,0.20)");
  burst.addColorStop(1, "rgba(255,79,145,0)");
  ctx.fillStyle = burst;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.34, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1 * devicePixelRatio;
  for (let i = 0; i < 36; i++) {
    const angle = (Math.PI * 2 * i) / 36 + t * 0.08;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * radius * 0.08, cy + Math.sin(angle) * radius * 0.08);
    ctx.lineTo(cx + Math.cos(angle) * radius * 0.98, cy + Math.sin(angle) * radius * 0.98);
    ctx.stroke();
  }
}

function drawTetrahedron(cx, cy, radius, t) {
  const top = { x: cx, y: cy - radius * 0.72 };
  const left = { x: cx - radius * 0.52, y: cy + radius * 0.43 };
  const right = { x: cx + radius * 0.52, y: cy + radius * 0.43 };
  const bottom = { x: cx, y: cy + radius * 0.76 };
  ctx.strokeStyle = "rgba(245,184,75,0.70)";
  ctx.lineWidth = 2 * devicePixelRatio;
  ctx.beginPath();
  ctx.moveTo(top.x, top.y);
  ctx.lineTo(left.x, left.y);
  ctx.lineTo(right.x, right.y);
  ctx.closePath();
  ctx.moveTo(top.x, top.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.moveTo(left.x, left.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.moveTo(right.x, right.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.stroke();

  [top, left, right, bottom].forEach((p, i) => {
    const glow = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, radius * 0.08);
    glow.addColorStop(0, "rgba(255,255,255,0.9)");
    glow.addColorStop(0.35, "rgba(245,184,75,0.48)");
    glow.addColorStop(1, "rgba(245,184,75,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius * (0.065 + Math.sin(t * 2 + i) * 0.008), 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawHelix(cx, cy, radius, t) {
  const height = radius * 1.38;
  const amp = radius * 0.19;
  for (let strand = 0; strand < 2; strand++) {
    ctx.strokeStyle = strand === 0 ? "rgba(245,184,75,0.86)" : "rgba(154,92,255,0.78)";
    ctx.lineWidth = 2.6 * devicePixelRatio;
    ctx.beginPath();
    for (let i = 0; i < 220; i++) {
      const p = i / 219;
      const y = cy - height / 2 + p * height;
      const angle = p * Math.PI * 7.2 + t * 1.15 + strand * Math.PI;
      const x = cx + Math.sin(angle) * amp * (0.6 + Math.sin(p * Math.PI) * 0.4);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255,255,255,0.42)";
  ctx.lineWidth = 1.2 * devicePixelRatio;
  ctx.beginPath();
  ctx.moveTo(cx, cy - height * 0.55);
  ctx.lineTo(cx, cy + height * 0.55);
  ctx.stroke();
}

function drawHorizonField(cx, cy, radius, t) {
  const horizonY = cy + radius * 0.18;
  const vanishingY = cy - radius * 0.42;
  const rows = 18;
  const cols = 34;

  ctx.strokeStyle = "rgba(245,184,75,0.16)";
  ctx.lineWidth = 1 * devicePixelRatio;
  for (let i = -cols; i <= cols; i++) {
    const x = cx + i * radius * 0.065;
    ctx.beginPath();
    ctx.moveTo(cx, vanishingY);
    ctx.lineTo(x, cy + radius * 1.16);
    ctx.stroke();
  }

  for (let r = 0; r < rows; r++) {
    const p = r / rows;
    const y = horizonY + Math.pow(p, 1.8) * radius * 1.02;
    const width = radius * (0.15 + p * 2.2);
    ctx.strokeStyle = `rgba(255,79,145,${0.08 + p * 0.18})`;
    ctx.beginPath();
    ctx.ellipse(cx, y, width, radius * (0.018 + p * 0.045), 0, 0, Math.PI * 2);
    ctx.stroke();

    const dotCount = Math.max(6, Math.floor(12 + p * 34));
    for (let i = 0; i < dotCount; i++) {
      const dx = (i / (dotCount - 1) - 0.5) * width * 2;
      const glow = 0.25 + Math.sin(t * 3 + i + r) * 0.12;
      ctx.fillStyle = `rgba(245,184,75,${glow})`;
      ctx.beginPath();
      ctx.arc(cx + dx, y, (1.2 + p * 2.4) * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const portal = ctx.createRadialGradient(cx, horizonY, 2, cx, horizonY, radius * 0.28);
  portal.addColorStop(0, "rgba(255,255,255,0.42)");
  portal.addColorStop(0.35, "rgba(245,184,75,0.28)");
  portal.addColorStop(1, "rgba(245,184,75,0)");
  ctx.fillStyle = portal;
  ctx.beginPath();
  ctx.arc(cx, horizonY, radius * 0.28, 0, Math.PI * 2);
  ctx.fill();
}

function drawSkyGeometry(cx, cy, radius, t) {
  const skyY = cy - radius * 0.28;
  ctx.strokeStyle = "rgba(245,184,75,0.28)";
  ctx.lineWidth = 1.2 * devicePixelRatio;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(cx, skyY, radius * (0.22 + i * 0.095), 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255,79,145,0.28)";
  for (let i = 0; i < 2; i++) {
    ctx.beginPath();
    ctx.ellipse(cx, skyY, radius * (0.46 + i * 0.08), radius * 0.18, Math.PI / 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, skyY, radius * (0.46 + i * 0.08), radius * 0.18, -Math.PI / 4, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = `rgba(255,255,255,${0.35 + Math.sin(t * 5) * 0.12})`;
  ctx.beginPath();
  ctx.arc(cx, skyY, radius * 0.035, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.24)";
  ctx.beginPath();
  ctx.moveTo(cx, skyY);
  ctx.lineTo(cx, cy + radius * 1.08);
  ctx.stroke();
}

function drawLayers(cx, cy, radius, t) {
  const colors = [
    "rgba(245,184,75,0.16)",
    "rgba(255,79,145,0.13)",
    "rgba(87,216,255,0.13)",
    "rgba(255,255,255,0.10)",
  ];
  const labels = ["Fisica", "Energetica", "Informacion", "Coordinacion"];
  const top = cy - radius * 0.78;
  const step = (radius * 1.56) / 3;
  colors.forEach((color, i) => {
    const y = top + step * i + Math.sin(t + i) * 3 * devicePixelRatio;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5 * devicePixelRatio;
    ctx.beginPath();
    ctx.ellipse(cx, y, radius * 0.92, radius * 0.14, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = color.replace("0.1", "0.35");
    ctx.font = `${11 * devicePixelRatio}px Segoe UI`;
    ctx.fillText(labels[i], cx - radius * 0.9, y - 8 * devicePixelRatio);
  });
}

function drawCross(cx, cy, radius) {
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 1 * devicePixelRatio;
  ctx.beginPath();
  ctx.moveTo(cx - radius * 1.1, cy);
  ctx.lineTo(cx + radius * 1.1, cy);
  ctx.moveTo(cx, cy - radius * 1.1);
  ctx.lineTo(cx, cy + radius * 1.1);
  ctx.stroke();
}

function placeNodes(nodes, cx, cy, radius, t) {
  const count = Math.max(nodes.length, 12);
  const ring = [];
  for (let i = 0; i < count; i++) {
    const source = nodes[i] || {
      node_id: `ghost_world_${i + 1}`,
      coherence: 0.15,
      delta_points: 0,
      event_count: 0,
      ghost: true,
    };
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / count;
    const pulse = Math.sin(t * 1.3 + i) * radius * 0.025;
    ring.push({
      ...source,
      x: cx + Math.cos(angle) * (radius * 0.88 + pulse),
      y: cy + Math.sin(angle) * (radius * 0.72 + pulse),
      angle,
    });
  }
  return ring;
}

function drawEnergyStream(x1, y1, x2, y2, coherence, t) {
  const alpha = 0.12 + coherence * 0.36;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const bend = Math.sin(t * 2 + x2 * 0.01) * 48 * devicePixelRatio;
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, `rgba(245,184,75,${alpha})`);
  gradient.addColorStop(0.5, `rgba(255,79,145,${alpha + 0.08})`);
  gradient.addColorStop(1, `rgba(87,216,255,${alpha})`);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = (1.2 + coherence * 2.6) * devicePixelRatio;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(mx + bend, my - bend * 0.35, x2, y2);
  ctx.stroke();
}

function drawCoreCube(cx, cy, radius, t) {
  const size = radius * 0.23;
  drawCube(cx, cy, size, "rgba(245,184,75,0.98)", "rgba(255,79,145,0.45)");
  drawPyramid(cx, cy, size * 0.78, "rgba(255,255,255,0.72)");
  drawSphere(cx, cy, size * 0.16, `rgba(255,255,255,${0.78 + Math.sin(t * 4) * 0.18})`);
}

function drawCubeNode(node, t) {
  const coherence = Math.max(0, Math.min(1, node.coherence || 0));
  const size = (node.ghost ? 20 : 25 + coherence * 14) * devicePixelRatio;
  const alpha = node.ghost ? 0.26 : 0.95;
  drawCube(node.x, node.y, size, `rgba(245,184,75,${alpha})`, `rgba(87,216,255,${0.16 + coherence * 0.22})`);
  drawPyramid(node.x, node.y, size * 0.72, `rgba(255,79,145,${node.ghost ? 0.22 : 0.58})`);
  drawSphere(node.x, node.y, size * 0.12, `rgba(255,255,255,${node.ghost ? 0.25 : 0.88})`);
  if (!node.ghost) {
    ctx.fillStyle = "rgba(238,244,255,0.92)";
    ctx.font = `${11 * devicePixelRatio}px Segoe UI`;
    ctx.fillText(node.node_id, node.x + size * 0.75, node.y + 4 * devicePixelRatio);
  }
}

function drawCube(x, y, size, stroke, fill) {
  const s = size / 2;
  const d = size * 0.34;
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.4 * devicePixelRatio;
  ctx.beginPath();
  ctx.rect(x - s, y - s, size, size);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - s, y - s);
  ctx.lineTo(x - s + d, y - s - d);
  ctx.lineTo(x + s + d, y - s - d);
  ctx.lineTo(x + s, y - s);
  ctx.moveTo(x + s, y - s);
  ctx.lineTo(x + s + d, y - s - d);
  ctx.lineTo(x + s + d, y + s - d);
  ctx.lineTo(x + s, y + s);
  ctx.moveTo(x + s + d, y + s - d);
  ctx.lineTo(x - s + d, y + s - d);
  ctx.lineTo(x - s, y + s);
  ctx.stroke();
}

function drawPyramid(x, y, size, stroke) {
  const s = size / 2;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1 * devicePixelRatio;
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x - s, y + s);
  ctx.lineTo(x + s, y + s);
  ctx.closePath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x, y + s * 0.55);
  ctx.stroke();
}

function drawSphere(x, y, radius, fill) {
  ctx.fillStyle = fill;
  ctx.shadowColor = "rgba(255,255,255,0.8)";
  ctx.shadowBlur = 18 * devicePixelRatio;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

const getApiUrl = () => {
  if (typeof window !== "undefined") {
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      return "http://127.0.0.1:8787";
    }
  }
  return "";
};

async function refresh() {
  try {
    const res = await fetch(`${getApiUrl()}/api/state`, { cache: "no-store" });
    state = await res.json();
    renderPanels();
  } catch (error) {
    console.error(error);
  }
}

function renderPanels() {
  const nodes = state.nodes || [];
  const events = state.events || [];
  if (nodeCount) nodeCount.textContent = nodes.length;
  if (eventCount) eventCount.textContent = state.total_events || 0;
  if (deltaTotal) deltaTotal.textContent = Number(state.total_delta_points || 0).toFixed(4);
  renderMpe(state.mpe);
  renderMpeMetrics((state.mpe && state.mpe.metrics) || calculateMpeMetrics(events));

  if (nodesEl) {
    nodesEl.innerHTML = nodes
      .slice()
      .sort((a, b) => (b.delta_points || 0) - (a.delta_points || 0))
      .map(
        (node) => `<div class="item">
          <strong>${node.node_id}</strong>
          <span>coherencia ${Number(node.coherence || 0).toFixed(3)} · reputacion ${Number(node.reputation || 0).toFixed(3)}</span>
          <span>${node.trust_level || "unknown"} · ${node.signed ? "firmado" : "lab sin firma"} · DELTA ${Number(node.delta_points || 0).toFixed(5)}</span>
        </div>`
      )
      .join("");
  }

  if (eventsEl) {
    eventsEl.innerHTML = events
      .slice(-12)
      .reverse()
      .map(
        (event) => `<div class="item">
          <strong>${event.node_id}</strong>
          <span>${event.label || event.type} · +${Number(event.delta_points || 0).toFixed(6)} DELTA test</span>
        </div>`
      )
      .join("");
  }
}

function renderMpe(mpe) {
  if (!mpeEl) return;
  if (!mpe) {
    mpeEl.innerHTML = `<div class="mpe-pattern">sin datos</div><p>Esperando memoria reciente de QUBIT.</p>`;
    return;
  }

  const confidence = Number(mpe.confidence || 0);
  mpeEl.innerHTML = `<div class="mpe-head">
      <strong>${mpe.pattern || "transicion"}</strong>
      <span>${confidence.toFixed(2)}</span>
    </div>
    <p>${mpe.hypothesis || "MPE esperando secuencia temporal suficiente."}</p>`;
}

function renderMpeMetrics(metrics) {
  if (!mpeMetricsEl) return;
  const rows = [
    ["mean_signal", metrics && metrics.mean_signal],
    ["drift", metrics && metrics.drift],
    ["variance", metrics && metrics.variance],
    ["jitter", metrics && metrics.jitter],
    ["shift", metrics && metrics.shift],
  ];

  mpeMetricsEl.innerHTML = rows
    .map(([label, value]) => {
      const numeric = Number(value);
      const display = Number.isFinite(numeric) ? numeric.toFixed(6) : "0.000000";
      return `<div class="metric">
        <span>${label}</span>
        <strong>${display}</strong>
      </div>`;
    })
    .join("");
}

function calculateMpeMetrics(events) {
  const values = (events || [])
    .slice(-48)
    .map(eventSignal)
    .filter((value) => Number.isFinite(value));

  if (values.length < 2) {
    return {
      mean_signal: 0,
      drift: 0,
      variance: 0,
      jitter: 0,
      shift: 0,
    };
  }

  const meanSignal = mean(values);
  const drift = values[values.length - 1] - values[0];
  const varianceValue = mean(values.map((value) => (value - meanSignal) ** 2));
  const steps = values.slice(1).map((value, index) => Math.abs(value - values[index]));
  const jitter = mean(steps);
  const mid = Math.floor(values.length / 2);
  const shift = mean(values.slice(mid)) - mean(values.slice(0, mid));

  return {
    mean_signal: meanSignal,
    drift,
    variance: varianceValue,
    jitter,
    shift,
  };
}

function eventSignal(event) {
  const parts = ["coherence", "confidence", "delta_points"]
    .map((key) => Number(event && event[key]))
    .filter((value) => Number.isFinite(value))
    .map((value) => Math.max(0, Math.min(1, value)));

  const porScore = Number(event && event.por && event.por.score);
  if (Number.isFinite(porScore)) {
    parts.push(Math.max(0, Math.min(1, porScore)));
  }

  return parts.length ? mean(parts) : NaN;
}

function mean(values) {
  return values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
setInterval(refresh, 1000);
refresh();
draw();
