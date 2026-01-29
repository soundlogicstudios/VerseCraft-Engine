export function initDebugTools({ panelRoot, choiceButtons, debugBanner, assetsPanel, calibHUD, btnDebug, btnAssets, btnDrag }) {
  let debug=false, assets=false, drag=false, active=null;

  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const round=n=>Math.round(n*100)/100;

  function rootRect(){ return panelRoot.getBoundingClientRect(); }
  function pct(px, base){ return px/base*100; }

  function updateHUD(el){
    if(!debug||!el){ calibHUD.style.display="none"; return; }
    const r=rootRect(), b=el.getBoundingClientRect();
    const data={
      id: el.id,
      x: round(pct(b.left-r.left,r.width)),
      y: round(pct(b.top-r.top,r.height)),
      w: round(pct(b.width,r.width)),
      h: round(pct(b.height,r.height)),
    };
    calibHUD.style.display="block";
    calibHUD.innerHTML = `
      <strong>${data.id}</strong><br/>
      left: ${data.x}%<br/>
      top: ${data.y}%<br/>
      width: ${data.w}%<br/>
      height: ${data.h}%<br/><br/>
      <button id="copyCss">COPY CSS</button>
      <button id="copyJson">COPY JSON</button>
    `;
    calibHUD.querySelector("#copyCss").onclick=()=>{
      navigator.clipboard.writeText(`#${data.id} { left:${data.x}%; top:${data.y}%; width:${data.w}%; height:${data.h}%; }`);
    };
    calibHUD.querySelector("#copyJson").onclick=()=>{
      navigator.clipboard.writeText(JSON.stringify(data,null,2));
    };
  }

  btnDebug.onclick=()=>{
    debug=!debug;
    document.documentElement.classList.toggle("debug",debug);
    debugBanner.style.display=debug?"block":"none";
    debugBanner.textContent=`DEBUG MODE — ${location.pathname}`;
    if(!debug){ calibHUD.style.display="none"; }
  };

  btnAssets.onclick=()=>{
    assets=!assets;
    assetsPanel.style.display=assets?"block":"none";
    assetsPanel.textContent=[
      "ACTIVE ASSETS",
      "",
      "HTML",
      location.pathname,
      "",
      "CSS",
      ...[...document.styleSheets].map(s=>s.href||"INLINE"),
      "",
      "PANEL BG",
      getComputedStyle(panelRoot).backgroundImage
    ].join("\n");
  };

  btnDrag.onclick=()=>{
    drag=!drag;
    choiceButtons.forEach(b=>b.style.outline=drag?"2px dashed cyan":"");
  };

  choiceButtons.forEach(el=>{
    el.onpointerdown=e=>{
      if(!drag)return;
      const r=rootRect(), b=el.getBoundingClientRect();
      active={el,x:e.clientX,y:e.clientY,l:b.left-r.left,t:b.top-r.top,w:b.width,h:b.height};
      el.setPointerCapture(e.pointerId);
      updateHUD(el);
    };
    el.onpointermove=e=>{
      if(!active||!drag)return;
      const r=rootRect();
      let l=clamp(active.l+(e.clientX-active.x),0,r.width-active.w);
      let t=clamp(active.t+(e.clientY-active.y),0,r.height-active.h);
      el.style.left=round(pct(l,r.width))+"%";
      el.style.top=round(pct(t,r.height))+"%";
      updateHUD(el);
    };
    el.onpointerup=e=>{
      if(!active)return;
      updateHUD(el);
      active=null;
    };
  });
}
