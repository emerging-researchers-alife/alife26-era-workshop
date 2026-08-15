/* ══════════════════════════════════════════════════════════════════
   ERA @ ALIFE 2026 — page behaviour and the organic ornaments.
   No dependencies; everything below draws itself.
   ══════════════════════════════════════════════════════════════════ */
(() => {
"use strict";

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const SVG_NS = "http://www.w3.org/2000/svg";
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* the maple leaf, in its own 500..4300 × 360..4470 coordinate space */
const MAPLE_D = $("#maple path").getAttribute("d");
const MAPLE_BOX = { x: 500, y: 360, w: 3800, h: 4110 };

/* deterministic 0..1 hash so ornaments look the same on every reload */
function rnd(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 100000) / 100000;
}

const el = (name, attrs = {}) => {
  const n = document.createElementNS(SVG_NS, name);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
};

/* ── the ERA board ──────────────────────────────────────────────── */
const BOARD = [
  ["Imy Khan", "General chair", "Independent, UK"],
  ["Martha Emerson", "Vice chair & equity chair", "University of Washington, USA"],
  ["Ane Kristine Espeseth", "ISAL board representative", "University of Oslo, Norway"],
  ["Gabriel Juliano Severino", "Communications chair", "Indiana University Bloomington, USA"],
  ["Lio Hong", "Lead digital events chair", "Independent, Singapore"],
  ["Andy Walsh", "Digital events chair", "Independent, USA"],
  ["Piotr Walas", "Lead conference chair", "Warsaw University of Technology, Poland"],
  ["Harald Michael Ludwig", "Conference chair", "Complexity Science Hub, Austria"],
  ["Iliya Zhechev", "Conference chair", "Sofia University, Bulgaria"],
];

/* ══════════════════════════════════ schedule ═══════════════════ */
function renderSchedule(tz = "edt") {
  const tbody = $("#minicon-table tbody");
  tbody.textContent = "";
  $(".tz-label").textContent = tz.toUpperCase();

  for (const row of MINICON) {
    const tr = document.createElement("tr");
    const isBreak = /break|lunch/i.test(row.session);
    if (isBreak) tr.className = "is-break";

    const t = document.createElement("td");
    t.className = "c-time";
    t.innerHTML = `<span class="t">${row[tz]}</span>`;

    const s = document.createElement("td");
    s.className = "c-sess";
    s.innerHTML = `<span class="s-title"></span>`;
    s.firstChild.textContent = row.session;
    if (row.note) {
      const n = document.createElement("span");
      n.className = "s-note";
      n.textContent = row.note;
      s.append(n);
    }

    const sp = document.createElement("td");
    sp.className = "c-spk";
    sp.textContent = row.speaker || "—";

    const m = document.createElement("td");
    m.className = "c-mode";
    if (row.mode) {
      const b = document.createElement("span");
      b.className = "mode" + (/remote/i.test(row.mode) ? " is-remote" : "");
      b.textContent = row.mode.trim();
      m.append(b);
    }

    tr.append(t, s, sp, m);
    tbody.append(tr);
  }
}

$$(".tz button").forEach(b => b.addEventListener("click", () => {
  $$(".tz button").forEach(x => x.classList.toggle("is-on", x === b));
  renderSchedule(b.dataset.tz);
}));

/* ══════════════════════════════════ lightning talks ════════════ */
function renderTalks() {
  const list = $("#talk-list");
  TALKS.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "talk";
    const pid = `talk-panel-${i}`;

    const head = document.createElement("button");
    head.type = "button";
    head.className = "t-head";
    head.setAttribute("aria-expanded", "false");
    head.setAttribute("aria-controls", pid);
    head.innerHTML =
      `<span class="t-num">${String(i + 1).padStart(2, "0")}</span>` +
      `<span><span class="t-title"></span><span class="t-by"><b></b> · <span></span></span></span>` +
      `<svg class="t-chev" viewBox="0 0 16 16" aria-hidden="true">` +
      `<path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" ` +
      `stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    $(".t-title", head).textContent = t.title;
    $(".t-by b", head).textContent = t.name;
    $(".t-by span", head).textContent = t.affiliation;

    const panel = document.createElement("div");
    panel.className = "t-panel";
    panel.id = pid;

    panel.append(section("Abstract", t.abstract));
    if (t.bio) panel.append(section("About the speaker", [t.bio]));
    if (t.url) {
      const p = document.createElement("p");
      p.className = "t-link";
      const a = document.createElement("a");
      a.href = t.url; a.target = "_blank"; a.rel = "noopener";
      a.textContent = `${t.name} → ${t.urlLabel} ↗`;
      p.append(a);
      panel.append(p);
    }

    head.addEventListener("click", () => {
      const open = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", String(!open));
      panel.classList.toggle("is-open", !open);
      syncExpandAll();
    });

    li.append(head, panel);
    list.append(li);
  });
}

function section(label, paragraphs) {
  const frag = document.createDocumentFragment();
  const h = document.createElement("h4");
  h.textContent = label;
  frag.append(h);
  for (const para of paragraphs) {
    const p = document.createElement("p");
    p.textContent = para;
    frag.append(p);
  }
  return frag;
}

function syncExpandAll() {
  const heads = $$(".t-head");
  const allOpen = heads.every(h => h.getAttribute("aria-expanded") === "true");
  const btn = $("#expand-all");
  btn.setAttribute("aria-expanded", String(allOpen));
  btn.textContent = allOpen ? "Collapse all" : "Expand all";
}

$("#expand-all").addEventListener("click", () => {
  const open = $("#expand-all").getAttribute("aria-expanded") !== "true";
  $$(".t-head").forEach(h => {
    h.setAttribute("aria-expanded", String(open));
    document.getElementById(h.getAttribute("aria-controls")).classList.toggle("is-open", open);
  });
  syncExpandAll();
});

/* ══════════════════════════════════ organisers ═════════════════ */
function renderBoard() {
  const ul = $("#people");
  for (const [name, role, aff] of BOARD) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="p-name"></span><span class="p-role"></span><span class="p-aff"></span>`;
    $(".p-name", li).textContent = name;
    $(".p-role", li).textContent = role;
    $(".p-aff", li).textContent = aff;
    ul.append(li);
  }
}

/* ══════════════════════════════════ cell tissue ════════════════ */
/* A honeycomb whose vertices are jittered through a shared lookup, so
   neighbouring cells keep their shared walls — the way tissue does.   */
function drawTissue(host) {
  const w = host.clientWidth || 1200;
  const h = host.clientHeight || 620;
  const s = w < 700 ? 34 : 46;                 // cell radius
  const J = s * 0.24;                          // wall wobble
  const svg = el("svg", { viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: "xMidYMid slice" });
  const cells = el("g", { fill: "none", stroke: "var(--ink)", "stroke-width": "1", opacity: ".16" });
  const inner = el("g");
  const seen = new Map();

  const vert = (x, y) => {
    const k = `${Math.round(x)},${Math.round(y)}`;
    let v = seen.get(k);
    if (!v) {
      v = [x + (rnd(k) * 2 - 1) * J, y + (rnd(k + "~") * 2 - 1) * J];
      seen.set(k, v);
    }
    return v;
  };

  const cols = Math.ceil(w / (1.5 * s)) + 2;
  const rows = Math.ceil(h / (Math.sqrt(3) * s)) + 2;

  for (let c = -1; c < cols; c++) {
    for (let r = -1; r < rows; r++) {
      const cx = c * 1.5 * s;
      const cy = r * Math.sqrt(3) * s + (Math.abs(c % 2) ? Math.sqrt(3) * s / 2 : 0);
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        pts.push(vert(cx + s * Math.cos(a), cy + s * Math.sin(a)));
      }
      cells.append(el("path", {
        d: "M" + pts.map(p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("L") + "Z",
      }));

      /* a few cells get a nucleus, fewer get organelle specks */
      const seed = rnd(`n${c},${r}`);
      if (seed > 0.72) {
        inner.append(el("circle", {
          cx: cx.toFixed(1), cy: cy.toFixed(1), r: (s * 0.2).toFixed(1),
          fill: seed > 0.9 ? "var(--red)" : "var(--ink)", opacity: seed > 0.9 ? ".2" : ".11",
        }));
      } else if (seed < 0.16) {
        for (let k = 0; k < 3; k++) {
          const a = rnd(`o${c},${r},${k}`) * Math.PI * 2;
          const d = s * (0.25 + rnd(`d${c},${r},${k}`) * 0.35);
          inner.append(el("circle", {
            cx: (cx + Math.cos(a) * d).toFixed(1), cy: (cy + Math.sin(a) * d).toFixed(1),
            r: (s * 0.055).toFixed(1), fill: "var(--red)", opacity: ".22",
          }));
        }
      }
    }
  }
  svg.append(cells, inner);
  host.textContent = "";
  host.append(svg);
}

/* ══════════════════════════════════ braided rule ═══════════════ */
/* Two strands weaving: per half-period the strand on top is drawn with a
   paper-coloured casing beneath it, which is what makes it read as over. */
function drawBraid(host) {
  const W = 2200, H = 22, mid = H / 2, amp = 5.5, segs = 88;
  const step = W / segs;
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, width: W, height: H });
  const arch = (i, up) => {
    const x0 = i * step, x1 = x0 + step;
    return `M${x0.toFixed(1)} ${mid} Q${(x0 + step / 2).toFixed(1)} ${mid + (up ? -2 : 2) * amp} ${x1.toFixed(1)} ${mid}`;
  };
  const stroke = (d, color, width, cap) =>
    el("path", { d, fill: "none", stroke: color, "stroke-width": width, "stroke-linecap": cap || "round" });

  for (let i = 0; i < segs; i++) {
    const aUp = i % 2 === 0;                  // strand A arches up on even segments
    const A = { d: arch(i, aUp), c: "var(--red)" };
    const B = { d: arch(i, !aUp), c: "var(--ink)" };
    const [under, over] = aUp ? [B, A] : [A, B];   // …and passes over there too
    svg.append(stroke(under.d, under.c, 2.2));
    svg.append(stroke(over.d, "var(--paper)", 6, "butt"));   // casing, cut to its own segment
    svg.append(stroke(over.d, over.c, 2.2));
  }
  host.append(svg);
}

/* ══════════════════════════════════ organelle watermark ═══════ */
function drawCellMark(host, seed) {
  const svg = el("svg", { viewBox: "0 0 200 200" });
  const g = el("g", { fill: "none", stroke: "var(--ink)", "stroke-width": "1.6" });

  /* wobbly membrane */
  const pts = [];
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    const r = 88 + Math.sin(a * 3 + seed) * 5 + Math.sin(a * 7 - seed * 2) * 3;
    pts.push([100 + Math.cos(a) * r, 100 + Math.sin(a) * r]);
  }
  g.append(el("path", { d: "M" + pts.map(p => p.map(v => v.toFixed(1)).join(" ")).join("L") + "Z" }));
  g.append(el("path", {
    d: "M" + pts.map(p => [(p[0] - 100) * .93 + 100, (p[1] - 100) * .93 + 100]
      .map(v => v.toFixed(1)).join(" ")).join("L") + "Z",
    "stroke-dasharray": "3 5", "stroke-width": "1",
  }));

  /* nucleus */
  g.append(el("circle", { cx: "92", cy: "96", r: "30", stroke: "var(--red)" }));
  g.append(el("circle", { cx: "86", cy: "90", r: "9", stroke: "var(--red)", "stroke-width": "1" }));

  /* mitochondria, with cristae */
  for (let i = 0; i < 3; i++) {
    const x = 40 + rnd(`m${seed}${i}x`) * 110, y = 40 + rnd(`m${seed}${i}y`) * 120;
    const rot = rnd(`m${seed}${i}r`) * 180;
    const m = el("g", { transform: `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)})` });
    m.append(el("rect", { x: "-17", y: "-7", width: "34", height: "14", rx: "7" }));
    m.append(el("path", { d: "M-11 -7 l6 14 M-1 -7 l6 14 M9 -7 l6 14", "stroke-width": "1" }));
    g.append(m);
  }
  /* vesicles */
  for (let i = 0; i < 6; i++) {
    g.append(el("circle", {
      cx: (30 + rnd(`v${seed}${i}x`) * 140).toFixed(0),
      cy: (30 + rnd(`v${seed}${i}y`) * 140).toFixed(0),
      r: (2 + rnd(`v${seed}${i}r`) * 4).toFixed(1), "stroke-width": "1.1",
    }));
  }
  svg.append(g);
  host.append(svg);
}

/* ══════════════════════════════════ ant trail ═════════════════ */
/* A pheromone trail with traffic on it. Some of them are carrying. */
function antTrail(canvas) {
  const ctx = canvas.getContext("2d");
  const leaf = new Path2D(MAPLE_D);
  const INK = (getComputedStyle(document.body).getPropertyValue("--on-dark") || "#f2ebdf").trim();
  let W = 0, H = 120, dpr = 1;

  const ants = Array.from({ length: 17 }, (_, i) => ({
    t: rnd(`a${i}`),
    v: 0.00018 + rnd(`v${i}`) * 0.00024,
    dir: rnd(`d${i}`) > 0.4 ? 1 : -1,
    carry: rnd(`c${i}`) > 0.5,
    wob: rnd(`w${i}`) * 6.28,
    scale: 1.05 + rnd(`s${i}`) * 0.5,
  }));

  const trailY = x => H / 2 + Math.sin(x / 150) * 22 + Math.sin(x / 47 + 1.3) * 6;

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function ant(x, y, ang, a) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang + (a.dir < 0 ? Math.PI : 0));
    ctx.scale(a.scale * (a.dir < 0 ? -1 : 1), a.scale);
    ctx.strokeStyle = INK; ctx.fillStyle = INK;
    ctx.lineCap = "round";

    ctx.globalAlpha = .55;                             // legs, kept quiet
    ctx.lineWidth = .9;
    ctx.beginPath();
    for (const [hx, kx, ky, fx, fy] of [[-1.5, -5, 4, -8, 6.5], [1, 1.5, 5, -1, 8], [4, 7.5, 4, 10, 7]]) {
      ctx.moveTo(hx, .5); ctx.lineTo(kx, ky); ctx.lineTo(fx, fy);
      ctx.moveTo(hx, -.5); ctx.lineTo(kx, -ky); ctx.lineTo(fx, -fy);
    }
    ctx.stroke();

    ctx.globalAlpha = .85;                             // antennae
    ctx.beginPath();
    ctx.moveTo(7.5, -1.4); ctx.lineTo(11, -5); ctx.lineTo(15, -4.5);
    ctx.moveTo(7.5, 1.4); ctx.lineTo(11, -2); ctx.lineTo(15, -1);
    ctx.stroke();

    ctx.globalAlpha = 1;                               // gaster, mesosoma, head
    for (const [ex, rx, ry] of [[-6.4, 4.6, 3.6], [-.2, 3, 2.4], [6, 3.4, 2.9]]) {
      ctx.beginPath(); ctx.ellipse(ex, 0, rx, ry, 0, 0, 6.2832); ctx.fill();
    }

    if (a.carry) {                                     // a maple leaf, overhead
      ctx.save();
      const k = 15 / MAPLE_BOX.h;
      ctx.translate(5.5, -10.5);
      ctx.rotate(-0.4);
      ctx.scale(k, k);
      ctx.translate(-MAPLE_BOX.x - MAPLE_BOX.w / 2, -MAPLE_BOX.y - MAPLE_BOX.h / 2);
      ctx.fillStyle = "#d52b1e";
      ctx.fill(leaf);
      ctx.restore();
    }
    ctx.restore();
  }

  function frame(now) {
    ctx.clearRect(0, 0, W, H);

    ctx.beginPath();                                   // the pheromone trail
    for (let x = 0; x <= W; x += 6) x ? ctx.lineTo(x, trailY(x)) : ctx.moveTo(x, trailY(x));
    ctx.strokeStyle = "rgba(200,16,46,.32)";
    ctx.lineWidth = 7; ctx.setLineDash([2, 9]); ctx.lineCap = "round";
    ctx.stroke();
    ctx.setLineDash([]);

    for (const a of ants) {
      if (!reduced) a.t = (a.t + a.v * a.dir + 1) % 1;
      const x = a.t * W;
      const y = trailY(x) + Math.sin(now / 700 + a.wob) * 2.5;
      const ang = Math.atan2(trailY(x + 4) - trailY(x - 4), 8);
      ant(x, y, ang, a);
    }
    if (!reduced) requestAnimationFrame(frame);
  }

  resize();
  addEventListener("resize", () => { resize(); if (reduced) frame(0); });
  requestAnimationFrame(frame);
}

/* ══════════════════════════════════ go ═════════════════════════ */
renderSchedule();
renderTalks();
renderBoard();
syncExpandAll();

drawTissue($(".tissue"));
$$(".braid").forEach(drawBraid);
$$(".cell-mark").forEach((h, i) => drawCellMark(h, i * 1.7 + 0.6));
antTrail($("#trail"));

let t;
addEventListener("resize", () => {
  clearTimeout(t);
  t = setTimeout(() => drawTissue($(".tissue")), 220);
});

/* open a talk if the page was linked straight to it */
if (location.hash.startsWith("#talk-")) {
  const i = Number(location.hash.slice(6)) - 1;
  const head = $$(".t-head")[i];
  if (head) head.click();
}

})();
