// core/debug_tools.js
// =========================================================
// VerseCraft Debug Tools (Locked Model)
// - EVERYTHING behind debug1 layer (?debug=1)
// - Drag uses % of panelRoot (matches CSS measurement model)
// - HUD shows live geometry + Copy CSS / Copy JSON
// =========================================================

export function initDebugTools({
  panelRoot,
  choiceButtons,
  debugBanner,
  assetsPanel,
  calibHUD,
  btnDebug,
  btnAssets,
  btnDrag
}) {
  // -------------------------------------------------------
  // URL flags
  // -------------------------------------------------------
  const params = new URLSearchParams(location.search);
  const urlDebug = params.has("debug"); // ?debug=1
  const urlDrag = params.has("drag");   // ?drag=1 (only works if debug is on)
  const urlAssets = params.has("assets"); // ?assets=1 (only works if debug is on)

  // -------------------------------------------------------
  // Internal toggles
  // -------------------------------------------------------
  let debug = false;
  let assets = false;
  let drag = false;
  let active = null;

  // -------------------------------------------------------
  // Helpers
  // -------------------------------------------------------
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const round = (n) => Math.round(n * 100) / 100;

  function rootRect() {
    return panelRoot.getBoundingClientRect();
  }

  function pct(px, base) {
    return (px / base) * 100;
  }

  function getPctGeometry(el) {
    const r = rootRect();
    const b = el.getBoundingClientRect();

    return {
      id: el.id,
      x: round(pct(b.left - r.left, r.width)),
      y: round(pct(b.top - r.top, r.height)),
      w: round(pct(b.width, r.width)),
      h: round(pct(b.height, r.height))
    };
  }

  function setDebugUIVisible(on) {
    // debug1 layer controls *visibility* for all debug UI
    document.documentElement.classList.toggle("debug1", on);

    // Defensive: in case CSS isn’t hiding things yet,
    // hard-hide banners/panels when debug is OFF.
    debugBanner.style.display = on ? "block" : "none";
    assetsPanel.style.display = on && assets ? "block" : "none";
    calibHUD.style.display = on && drag && active?.el ? "block" : "none";

    // If the buttons live on-screen, only show them in debug.
    // (If your buttons are already behind CSS, this is redundant but safe.)
    btnDebug.style.display = on ? "inline-flex" : "none";
    btnAssets.style.display = on ? "inline-flex" : "none";
    btnDrag.style.display = on ? "inline-flex" : "none";
  }

  function updateBanner() {
    if (!debug) return;
    debugBanner.textContent = `DEBUG MODE — ${location.pathname}${location.search || ""}`;
  }

  function updateHUD(el) {
    if (!debug || !drag || !el) {
      calibHUD.style.display = "none";
      return;
    }

    const data = getPctGeometry(el);

    calibHUD.style.display = "block";
    calibHUD.innerHTML = `
      <strong>${data.id}</strong><br/>
      left: ${data.x}%<br/>
      top: ${data.y}%<br/>
      width: ${data.w}%<br/>
      height: ${data.h}%<br/><br/>
      <button id="copyCss">COPY CSS</button>
      <button id="copyJson">COPY JSON</button>
    `;

    calibHUD.querySelector("#copyCss").onclick = () => {
      const css = `#${data.id} { left:${data.x}%; top:${data.y}%; width:${data.w}%; height:${data.h}%; }`;
      navigator.clipboard?.writeText(css);
      console.log("[debug] COPY CSS →", css);
    };

    calibHUD.querySelector("#copyJson").onclick = () => {
      const json = JSON.stringify(data, null, 2);
      navigator.clipboard?.writeText(json);
      console.log("[debug] COPY JSON →", json);
    };
  }

  function updateAssetsPanel() {
    if (!debug || !assets) return;

    const cssHrefs = [...document.styleSheets].map((s) => s.href || "INLINE");
    const bg = getComputedStyle(panelRoot).backgroundImage;

    assetsPanel.textContent = [
      "ACTIVE ASSETS",
      "",
      "HTML",
      location.pathname,
      "",
      "CSS",
      ...cssHrefs,
      "",
      "PANEL BG",
      bg
    ].join("\n");
  }

  function setDragMode(on) {
    drag = !!on;

    // Outline pills when drag is active
    choiceButtons.forEach((b) => {
      b.style.touchAction = "none"; // critical for iOS pointer drag
      b.style.outline = drag ? "2px dashed cyan" : "";
      b.style.outlineOffset = drag ? "-2px" : "";
    });

    // If drag is turning off, hide HUD
    if (!drag) {
      calibHUD.style.display = "none";
      active = null;
    }
  }

  // -------------------------------------------------------
  // Button wiring (ONLY meaningful when debug is enabled)
  // -------------------------------------------------------
  btnDebug.onclick = () => {
    debug = !debug;
    updateBanner();
    setDebugUIVisible(debug);

    // If debug just turned off, also turn off tools
    if (!debug) {
      assets = false;
      setDragMode(false);
      assetsPanel.style.display = "none";
      calibHUD.style.display = "none";
    } else {
      // If debug turned on, refresh asset panel if needed
      if (assets) updateAssetsPanel();
    }
  };

  btnAssets.onclick = () => {
    if (!debug) return;
    assets = !assets;
    assetsPanel.style.display = assets ? "block" : "none";
    if (assets) updateAssetsPanel();
  };

  btnDrag.onclick = () => {
    if (!debug) return;
    setDragMode(!drag);
  };

  // -------------------------------------------------------
  // Drag logic (percent-of-panelRoot; updates inline left/top%)
  // -------------------------------------------------------
  choiceButtons.forEach((el) => {
    el.onpointerdown = (e) => {
      if (!debug || !drag) return;

      const r = rootRect();
      const b = el.getBoundingClientRect();

      active = {
        el,
        x: e.clientX,
        y: e.clientY,
        l: b.left - r.left,
        t: b.top - r.top,
        w: b.width,
        h: b.height
      };

      try {
        el.setPointerCapture(e.pointerId);
      } catch {}

      updateHUD(el);
      e.preventDefault();
      e.stopPropagation();
    };

    el.onpointermove = (e) => {
      if (!debug || !drag || !active) return;

      const r = rootRect();

      let l = clamp(active.l + (e.clientX - active.x), 0, r.width - active.w);
      let t = clamp(active.t + (e.clientY - active.y), 0, r.height - active.h);

      const xPct = round(pct(l, r.width));
      const yPct = round(pct(t, r.height));

      active.el.style.left = xPct + "%";
      active.el.style.top = yPct + "%";

      updateHUD(active.el);

      e.preventDefault();
      e.stopPropagation();
    };

    el.onpointerup = (e) => {
      if (!active) return;

      // Final log on release
      const data = getPctGeometry(active.el);
      const css = `#${data.id} { left:${data.x}%; top:${data.y}%; width:${data.w}%; height:${data.h}%; }`;

      console.log("[debug] pill locked:", data.id, data);
      console.log("[debug] CSS →", css);

      updateHUD(active.el);
      active = null;

      e.preventDefault();
      e.stopPropagation();
    };

    el.onpointercancel = () => {
      active = null;
      if (debug && drag) calibHUD.style.display = "none";
    };
  });

  // -------------------------------------------------------
  // Boot behavior
  // - Debug tools default OFF for players.
  // - Enable automatically if ?debug=1
  // - Optionally auto-enable assets/drag if their params are set
  // -------------------------------------------------------
  debug = !!urlDebug;
  assets = debug && !!urlAssets;
  setDragMode(debug && !!urlDrag);

  setDebugUIVisible(debug);
  updateBanner();

  if (debug) {
    if (assets) {
      assetsPanel.style.display = "block";
      updateAssetsPanel();
    }
    // In debug, keep banner visible
    debugBanner.style.display = "block";
  }
}
