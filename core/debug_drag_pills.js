// =========================================================
// VerseCraft Debug Tool — Drag Choice Pills (Option B safe)
// FULL FILE REPLACEMENT
//
// Usage:
//   Open panel page with ?drag=1
//   Example:
//     dragonsoffire-panel-test.html?debug=1&drag=1
//
// Behavior:
//   - Drag choice0–choice3
//   - Positions measured as % of .panel-root
//   - Logs CSS + JSON on release
// =========================================================

(function () {
  const params = new URLSearchParams(location.search);
  if (!params.has("drag")) return;

  const root =
    document.querySelector(".panel-root") ||
    document.querySelector("[data-panel-root]");

  if (!root) {
    console.warn("[drag-pills] .panel-root not found.");
    return;
  }

  const pillIds = ["choice0", "choice1", "choice2", "choice3"];
  const pills = pillIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (!pills.length) {
    console.warn("[drag-pills] No pills found (#choice0–#choice3).");
    return;
  }

  // ---------------------------------------------------------
  // HUD
  // ---------------------------------------------------------
  const hud = document.createElement("div");
  hud.style.cssText = `
    position: fixed;
    left: calc(env(safe-area-inset-left, 0px) + 10px);
    bottom: calc(env(safe-area-inset-bottom, 0px) + 10px);
    z-index: 99999;
    background: rgba(0,0,0,0.85);
    color: #0ff;
    font: 12px/1.35 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    padding: 8px 10px;
    border-radius: 10px;
    white-space: pre;
    pointer-events: none;
  `;
  hud.textContent = "[drag-pills] ENABLED\nDrag a pill…";
  document.body.appendChild(hud);

  // ---------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const round2 = n => Math.round(n * 100) / 100;

  function getRootRect() {
    return root.getBoundingClientRect();
  }

  function pxToPct(px, base) {
    return (px / base) * 100;
  }

  function getPctGeometry(el) {
    const rr = getRootRect();
    const er = el.getBoundingClientRect();

    return {
      x: round2(pxToPct(er.left - rr.left, rr.width)),
      y: round2(pxToPct(er.top - rr.top, rr.height)),
      w: round2(pxToPct(er.width, rr.width)),
      h: round2(pxToPct(er.height, rr.height))
    };
  }

  function applyPctPosition(el, xPct, yPct) {
    el.style.left = `${xPct}%`;
    el.style.top = `${yPct}%`;
  }

  // ---------------------------------------------------------
  // Enable drag on pills
  // ---------------------------------------------------------
  pills.forEach(el => {
    el.style.touchAction = "none";
    el.style.outline = "2px dashed rgba(0,255,255,0.45)";
    el.style.outlineOffset = "-2px";
    el.dataset.dragPill = "1";
  });

  let active = null;

  function onPointerDown(e) {
    const el = e.currentTarget;
    if (!el || el.dataset.dragPill !== "1") return;

    const rr = getRootRect();
    const er = el.getBoundingClientRect();

    active = {
      el,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: er.left - rr.left,
      startTop: er.top - rr.top,
      w: er.width,
      h: er.height
    };

    try { el.setPointerCapture(e.pointerId); } catch {}
    e.preventDefault();
    e.stopPropagation();
  }

  function onPointerMove(e) {
    if (!active) return;

    const rr = getRootRect();
    const dx = e.clientX - active.startX;
    const dy = e.clientY - active.startY;

    let leftPx = active.startLeft + dx;
    let topPx  = active.startTop  + dy;

    leftPx = clamp(leftPx, 0, rr.width  - active.w);
    topPx  = clamp(topPx,  0, rr.height - active.h);

    const xPct = round2(pxToPct(leftPx, rr.width));
    const yPct = round2(pxToPct(topPx,  rr.height));

    applyPctPosition(active.el, xPct, yPct);

    const g = getPctGeometry(active.el);
    hud.textContent =
      `[drag-pills] ${active.el.id}\n` +
      `left: ${g.x}%\n` +
      `top:  ${g.y}%\n` +
      `w:    ${g.w}%\n` +
      `h:    ${g.h}%\n\nRelease to log…`;

    e.preventDefault();
    e.stopPropagation();
  }

  function onPointerUp(e) {
    if (!active) return;

    const el = active.el;
    const g = getPctGeometry(el);

    const css =
      `#${el.id} { left: ${g.x}%; top: ${g.y}%; width: ${g.w}%; height: ${g.h}%; }`;

    console.log(`[drag-pills] ${el.id}`, g);
    console.log(`[drag-pills] CSS →`, css);
    console.log(`[drag-pills] JSON →`, {
      id: el.id, x: g.x, y: g.y, w: g.w, h: g.h
    });

    hud.textContent =
      `[drag-pills] ${el.id} LOCKED\nCSS:\n${css}`;

    try { el.releasePointerCapture(e.pointerId); } catch {}
    active = null;

    e.preventDefault();
    e.stopPropagation();
  }

  pills.forEach(el => {
    el.addEventListener("pointerdown", onPointerDown, { passive: false });
    el.addEventListener("pointermove", onPointerMove, { passive: false });
    el.addEventListener("pointerup", onPointerUp, { passive: false });
    el.addEventListener("pointercancel", onPointerUp, { passive: false });
  });

  console.log("[drag-pills] Ready. Units = % of .panel-root");
})();
