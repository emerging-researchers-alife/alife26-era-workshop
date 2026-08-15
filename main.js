/* ══════════════════════════════════════════════════════════════════
   ERA @ ALIFE 2026 — page behaviour and the organic ornaments.
   No dependencies; every pattern on the page draws itself.
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

/* deterministic 0..1 hash, so the ornaments look the same on every reload */
function rnd(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 100000) / 100000;
}

const svgEl = (name, attrs = {}) => {
  const n = document.createElementNS(SVG_NS, name);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
};

const CHEVRON =
  `<svg class="ag-chev" viewBox="0 0 16 16" aria-hidden="true">` +
  `<path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" ` +
  `stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ══════════════════════════════════ time zones ═════════════════ */
/* The source sheet carries EDT only; the other two are derived from it. */
const TZ_SHIFT = { edt: 0, cest: 6, jst: 13 };

function shiftRange(range, hours) {
  if (!hours) return range;
  let rolled = false;
  const parts = range.split("-").map(part => {
    const [h, m] = part.trim().split(":").map(Number);
    const raw = h + hours;
    rolled = raw >= 24;
    return `${String(raw % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  });
  return parts.join("–") + (rolled ? " +1" : "");
}

const endOf = range => range.split("-")[1].trim();
const startOf = range => range.split("-")[0].trim();

/* ══════════════════════════════════ agenda ═════════════════════ */
/* The timetable and the talk list are one thing: a rail of slots, each
   talk opening its abstract in place. */
function renderAgenda(tz) {
  const list = $("#agenda");
  list.textContent = "";
  let prevEnd = null;

  WORKSHOP.forEach((block, bi) => {
    /* the hours between two sessions, marked but not claimed */
    if (prevEnd) list.append(gapRow(prevEnd, startOf(block.rows[0].edt), tz));

    const head = document.createElement("li");
    head.className = "ag-session";
    head.innerHTML = `<b></b><span></span>`;
    $("b", head).textContent = block.label;
    $("span", head).textContent = shiftRange(block.span.replace("–", "-"), TZ_SHIFT[tz]);
    list.append(head);

    for (const row of block.rows) {
      list.append(slotRow(row, tz));
      prevEnd = endOf(row.edt);
    }
    if (bi === WORKSHOP.length - 1) prevEnd = null;
  });
}

function gapRow(from, to, tz) {
  const li = document.createElement("li");
  li.className = "ag-gap";
  li.innerHTML = `<span class="ag-gap-time"></span><span></span>`;
  $(".ag-gap-time", li).textContent = shiftRange(`${from}-${to}`, TZ_SHIFT[tz]);
  $(".ag-gap-time", li).nextElementSibling.textContent = "no ERA session";
  return li;
}

function slotRow(row, tz) {
  const talk = TALKS.findIndex(t => t.name === row.speaker);
  const isHack = /hackathon/i.test(row.session);
  const li = document.createElement("li");
  li.className = "ag-item" + (talk >= 0 ? "" : isHack ? " ag-item--hack" : " ag-item--plain");

  const rowEl = document.createElement(talk >= 0 ? "button" : isHack ? "a" : "div");
  rowEl.className = "ag-row";
  rowEl.innerHTML =
    `<span class="ag-time"><b class="ag-t0"></b><span class="ag-t1"></span></span>` +
    `<span class="ag-node"></span>` +
    `<span class="ag-main"><span class="ag-title"></span><span class="ag-who"></span></span>` +
    (talk >= 0 ? CHEVRON : "");
  const [t0, t1] = shiftRange(row.edt, TZ_SHIFT[tz]).split("–");
  $(".ag-t0", rowEl).textContent = t0;
  $(".ag-t1", rowEl).textContent = "–" + t1;    /* hidden on narrow screens */

  if (talk >= 0) {
    const t = TALKS[talk];
    $(".ag-title", rowEl).textContent = t.title;
    $(".ag-who", rowEl).textContent = `${t.name} · ${t.affiliation}`;

    const panel = document.createElement("div");
    panel.className = "ag-panel";
    panel.id = `talk-${talk + 1}`;
    panel.append(block("Abstract", t.abstract));
    if (t.bio) panel.append(block("About the speaker", [t.bio]));
    if (t.url) {
      const p = document.createElement("p");
      p.className = "ag-link";
      const a = document.createElement("a");
      a.href = t.url; a.target = "_blank"; a.rel = "noopener";
      a.textContent = `${t.name} → ${t.urlLabel} ↗`;
      p.append(a);
      panel.append(p);
    }

    rowEl.type = "button";
    rowEl.setAttribute("aria-expanded", "false");
    rowEl.setAttribute("aria-controls", panel.id);
    rowEl.addEventListener("click", () => {
      const open = rowEl.getAttribute("aria-expanded") === "true";
      rowEl.setAttribute("aria-expanded", String(!open));
      panel.classList.toggle("is-open", !open);
      syncExpandAll();
    });

    li.append(rowEl, panel);
  } else {
    $(".ag-title", rowEl).textContent = row.session || row.speaker;
    if (isHack) {
      rowEl.href = "#hackathon";
      $(".ag-who", rowEl).textContent = "Build something ant-shaped →";
    } else {
      $(".ag-who", rowEl).remove();
    }
    li.append(rowEl);
  }
  return li;
}

function block(label, paragraphs) {
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
  const rows = $$("button.ag-row");
  const allOpen = rows.length > 0 && rows.every(r => r.getAttribute("aria-expanded") === "true");
  const btn = $("#expand-all");
  btn.setAttribute("aria-expanded", String(allOpen));
  btn.textContent = allOpen ? "Collapse all" : "Expand all";
}

$("#expand-all").addEventListener("click", () => {
  const open = $("#expand-all").getAttribute("aria-expanded") !== "true";
  $$("button.ag-row").forEach(r => {
    r.setAttribute("aria-expanded", String(open));
    document.getElementById(r.getAttribute("aria-controls")).classList.toggle("is-open", open);
  });
  syncExpandAll();
});

function setTz(tz) {
  $$(".tz button").forEach(b => b.classList.toggle("is-on", b.dataset.tz === tz));
  renderAgenda(tz);
  syncExpandAll();
}
$$(".tz button").forEach(b => b.addEventListener("click", () => setTz(b.dataset.tz)));

/* ══════════════════════════════════ cell tissue ════════════════ */
/* A honeycomb whose vertices are jittered through a shared lookup, so
   neighbouring cells keep their shared walls — the way tissue does. */
function drawTissue(host) {
  const w = host.clientWidth || 1200;
  const h = host.clientHeight || 600;
  const s = w < 700 ? 34 : 46;                     // cell radius
  const J = s * 0.24;                              // wall wobble
  const svg = svgEl("svg", { viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: "xMidYMid slice" });
  const walls = svgEl("g", { fill: "none", stroke: "var(--tissue-line)", "stroke-width": "1", opacity: ".16" });
  const inner = svgEl("g");
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
      walls.append(svgEl("path", {
        d: "M" + pts.map(p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("L") + "Z",
      }));

      const seed = rnd(`n${c},${r}`);
      if (seed > 0.72) {                             // a nucleus
        inner.append(svgEl("circle", {
          cx: cx.toFixed(1), cy: cy.toFixed(1), r: (s * 0.2).toFixed(1),
          fill: seed > 0.9 ? "var(--tissue-dot)" : "var(--tissue-line)",
          opacity: seed > 0.9 ? ".2" : ".11",
        }));
      } else if (seed < 0.16) {                      // organelle specks
        for (let k = 0; k < 3; k++) {
          const a = rnd(`o${c},${r},${k}`) * Math.PI * 2;
          const d = s * (0.25 + rnd(`d${c},${r},${k}`) * 0.35);
          inner.append(svgEl("circle", {
            cx: (cx + Math.cos(a) * d).toFixed(1), cy: (cy + Math.sin(a) * d).toFixed(1),
            r: (s * 0.055).toFixed(1), fill: "var(--tissue-dot)", opacity: ".22",
          }));
        }
      }
    }
  }
  svg.append(walls, inner);
  host.textContent = "";
  host.append(svg);
}

/* ══════════════════════════════════ helix rule ═════════════════ */
/* Two strands crossing, and nothing else — no over-and-under, no depth. */
function drawHelix(host) {
  const W = 190, H = 14, mid = H / 2, amp = 3.4, half = W / 8;
  const wave = up => {
    let d = `M0 ${mid}`;
    for (let i = 0; i < 8; i++) {
      const x0 = i * half;
      const peak = mid + ((i % 2 === 0) === up ? -2 : 2) * amp;
      d += ` Q${(x0 + half / 2).toFixed(1)} ${peak.toFixed(1)} ${(x0 + half).toFixed(1)} ${mid}`;
    }
    return d;
  };
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, width: W, height: H });
  for (const [up, color] of [[true, "var(--red)"], [false, "var(--ink)"]]) {
    svg.append(svgEl("path", {
      d: wave(up), fill: "none", stroke: color, "stroke-width": 1.5, "stroke-linecap": "round",
    }));
  }
  host.append(svg);
}

/* ══════════════════════════════════ organelle watermark ═══════ */
function drawCellMark(host, seed) {
  const svg = svgEl("svg", { viewBox: "0 0 200 200" });
  const g = svgEl("g", { fill: "none", stroke: "var(--ink)", "stroke-width": "1.6" });

  const pts = [];
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    const r = 88 + Math.sin(a * 3 + seed) * 5 + Math.sin(a * 7 - seed * 2) * 3;
    pts.push([100 + Math.cos(a) * r, 100 + Math.sin(a) * r]);
  }
  const ring = k => "M" + pts.map(p =>
    [(p[0] - 100) * k + 100, (p[1] - 100) * k + 100].map(v => v.toFixed(1)).join(" ")).join("L") + "Z";
  g.append(svgEl("path", { d: ring(1) }));
  g.append(svgEl("path", { d: ring(0.93), "stroke-dasharray": "3 5", "stroke-width": "1" }));

  g.append(svgEl("circle", { cx: "92", cy: "96", r: "30", stroke: "var(--red)" }));
  g.append(svgEl("circle", { cx: "86", cy: "90", r: "9", stroke: "var(--red)", "stroke-width": "1" }));

  for (let i = 0; i < 3; i++) {                      // mitochondria, with cristae
    const x = 40 + rnd(`m${seed}${i}x`) * 110, y = 40 + rnd(`m${seed}${i}y`) * 120;
    const rot = rnd(`m${seed}${i}r`) * 180;
    const m = svgEl("g", { transform: `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)})` });
    m.append(svgEl("rect", { x: "-17", y: "-7", width: "34", height: "14", rx: "7" }));
    m.append(svgEl("path", { d: "M-11 -7 l6 14 M-1 -7 l6 14 M9 -7 l6 14", "stroke-width": "1" }));
    g.append(m);
  }
  for (let i = 0; i < 6; i++) {                      // vesicles
    g.append(svgEl("circle", {
      cx: (30 + rnd(`v${seed}${i}x`) * 140).toFixed(0),
      cy: (30 + rnd(`v${seed}${i}y`) * 140).toFixed(0),
      r: (2 + rnd(`v${seed}${i}r`) * 4).toFixed(1), "stroke-width": "1.1",
    }));
  }
  svg.append(g);
  host.append(svg);
}

/* ══════════════════════════════════ ant trail ═════════════════ */
/* A pheromone trail with traffic on it. About half of them are carrying. */
function antTrail(canvas) {
  const ctx = canvas.getContext("2d");
  const leaf = new Path2D(MAPLE_D);
  const INK = (getComputedStyle(document.body).getPropertyValue("--on-dark") || "#f2ebdf").trim();
  let W = 0, dpr = 1;
  const H = 150;

  const ants = Array.from({ length: 14 }, (_, i) => ({
    t: rnd(`a${i}`),
    v: 0.00018 + rnd(`v${i}`) * 0.00024,
    dir: rnd(`d${i}`) > 0.4 ? 1 : -1,
    carry: rnd(`c${i}`) > 0.5,
    wob: rnd(`w${i}`) * 6.28,
    scale: 1.7 + rnd(`s${i}`) * 0.8,
  }));

  const trailY = x => H / 2 + Math.sin(x / 190) * 26 + Math.sin(x / 55 + 1.3) * 7;

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function ant(x, y, angle, a) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + (a.dir < 0 ? Math.PI : 0));
    ctx.scale(a.scale * (a.dir < 0 ? -1 : 1), a.scale);
    ctx.strokeStyle = INK; ctx.fillStyle = INK; ctx.lineCap = "round";

    ctx.globalAlpha = .55; ctx.lineWidth = .9;         // legs, kept quiet
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
      ant(x, y, Math.atan2(trailY(x + 4) - trailY(x - 4), 8), a);
    }
    if (!reduced) requestAnimationFrame(frame);
  }

  resize();
  addEventListener("resize", () => { resize(); if (reduced) frame(0); });
  requestAnimationFrame(frame);
}

/* ══════════════════════════════════ go ═════════════════════════ */
setTz("edt");

$$(".tissue").forEach(h => drawTissue(h));
$$(".helix").forEach(drawHelix);
$$(".cell-mark").forEach((h, i) => drawCellMark(h, i * 1.7 + 0.6));
antTrail($("#trail"));

let resizeTimer;
addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => $$(".tissue").forEach(h => drawTissue(h)), 220);
});

/* a link straight to one talk opens it */
if (location.hash.startsWith("#talk-")) {
  const panel = document.getElementById(location.hash.slice(1));
  const row = panel && panel.previousElementSibling;
  if (row) { row.click(); row.scrollIntoView({ block: "center" }); }
}

})();
