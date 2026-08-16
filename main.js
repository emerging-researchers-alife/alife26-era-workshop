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
  if (!hours) return range.replace("-", "–");
  let rolled = false;
  const parts = range.split("-").map(part => {
    const [h, m] = part.trim().split(":").map(Number);
    const raw = h + hours;
    rolled = raw >= 24;
    return `${String(raw % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  });
  return parts.join("–") + (rolled ? " +1" : "");
}

/* ══════════════════════════════════ agenda ═════════════════════ */
/* The timetable and the talk list are one thing: a rail of slots, each
   talk opening its abstract in place. */
function renderAgenda(tz) {
  const list = $("#agenda");
  list.textContent = "";

  for (const block of WORKSHOP) {
    const head = document.createElement("li");
    head.className = "ag-session";
    head.innerHTML = `<b></b><span></span>`;
    $("b", head).textContent = block.label;
    $("span", head).textContent = shiftRange(block.span.replace("–", "-"), TZ_SHIFT[tz]);
    list.append(head);

    for (const row of block.rows) list.append(slotRow(row, tz));
  }
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
  $(".ag-t1", rowEl).textContent = t1 ? "–" + t1 : "";   /* hidden on narrow screens */

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
    });

    li.append(rowEl, panel);
  } else if (row.speaker && !isHack) {
    /* scheduled, but no abstract submitted for it yet. A row may still carry a
       title of its own, in which case it reads like the rest of the rail. */
    li.className = "ag-item ag-item--tba";
    $(".ag-title", rowEl).textContent = row.title || row.speaker;
    $(".ag-who", rowEl).textContent = row.title ? row.speaker : "Lightning talk";
    li.append(rowEl);
  } else {
    $(".ag-title", rowEl).textContent = row.session || row.speaker;
    if (isHack) {
      rowEl.href = "#hackathon";
      $(".ag-who", rowEl).textContent = "Build something ant-shaped →";
      const leaf = svgEl("svg", { class: "ag-hack-leaf", viewBox: "0 0 100 100" });
      leaf.append(svgEl("use", { href: "#maple", width: 100, height: 100 }));
      rowEl.append(leaf);
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

function setTz(tz) {
  $$(".tz button").forEach(b => b.classList.toggle("is-on", b.dataset.tz === tz));
  renderAgenda(tz);
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
/* Two strands crossing the full width, and nothing else — no depth. */
function drawHelix(host) {
  const W = Math.max(host.clientWidth || 1200, 360);
  const H = 14, mid = H / 2, amp = 3.6;
  const segs = Math.max(8, Math.round(W / 26));
  const half = W / segs;
  const wave = up => {
    let d = `M0 ${mid}`;
    for (let i = 0; i < segs; i++) {
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
  host.textContent = "";
  host.append(svg);
}

/* ══════════════════════════════════ marching ants ═════════════ */
/* Winding trails across the hackathon band. The dashes do the walking. */
function drawAntPaths(host) {
  const w = host.clientWidth || 1200;
  const h = host.clientHeight || 400;
  const svg = svgEl("svg", { viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: "none" });

  for (let i = 0; i < 7; i++) {
    const base = h * (0.1 + 0.13 * i);
    const amp = 14 + rnd(`amp${i}`) * 34;
    const period = 190 + rnd(`per${i}`) * 260;
    const phase = rnd(`ph${i}`) * 6.283;
    const drift = (rnd(`dr${i}`) - 0.5) * 0.16;      // a slow slope along the band

    let d = "";
    for (let x = -20; x <= w + 20; x += 14) {
      const y = base + Math.sin(x / period + phase) * amp
                     + Math.sin(x / (period * 0.37) + phase * 2) * amp * 0.32
                     + x * drift;
      d += (d ? "L" : "M") + x.toFixed(0) + " " + y.toFixed(1);
    }
    svg.append(svgEl("path", {
      d,
      opacity: (0.14 + rnd(`op${i}`) * 0.24).toFixed(2),
      style: `animation-duration:${(1.7 + rnd(`sp${i}`) * 2.6).toFixed(2)}s;` +
             (rnd(`rev${i}`) > 0.5 ? "animation-direction:reverse;" : ""),
    }));
  }
  host.textContent = "";
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

/* ══════════════════════════════════ go ═════════════════════════ */
setTz("edt");

$$(".tissue").forEach(h => drawTissue(h));
$$(".helix").forEach(drawHelix);
$$(".antpaths").forEach(drawAntPaths);
$$(".cell-mark").forEach((h, i) => drawCellMark(h, i * 1.7 + 0.6));

let resizeTimer;
addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    $$(".tissue").forEach(h => drawTissue(h));
    $$(".helix").forEach(drawHelix);
    $$(".antpaths").forEach(drawAntPaths);
$$(".antpaths").forEach(drawAntPaths);
  }, 220);
});

/* a link straight to one talk opens it */
if (location.hash.startsWith("#talk-")) {
  const panel = document.getElementById(location.hash.slice(1));
  const row = panel && panel.previousElementSibling;
  if (row) { row.click(); row.scrollIntoView({ block: "center" }); }
}

})();
