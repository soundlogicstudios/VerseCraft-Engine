export function initDebugTools({ panelRoot, choiceButtons, debugBanner, assetsPanel, btnDebug, btnAssets, btnDrag }) {
  let debug=false, assets=false, drag=false, active=null;

  btnDebug.onclick=()=>{
    debug=!debug;
    document.documentElement.classList.toggle("debug",debug);
    debugBanner.style.display=debug?"block":"none";
    debugBanner.textContent=location.pathname;
  };

  btnAssets.onclick=()=>{
    assets=!assets;
    assetsPanel.style.display=assets?"block":"none";
    assetsPanel.textContent=[...document.styleSheets].map(s=>s.href).join("\n");
  };

  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const round=n=>Math.round(n*100)/100;

  btnDrag.onclick=()=>{
    drag=!drag;
    choiceButtons.forEach(b=>{
      b.style.outline=drag?"2px dashed cyan":"";
      b.style.touchAction="none";
    });
  };

  choiceButtons.forEach(el=>{
    el.onpointerdown=e=>{
      if(!drag)return;
      const r=panelRoot.getBoundingClientRect();
      const b=el.getBoundingClientRect();
      active={el,x:e.clientX,y:e.clientY,l:b.left-r.left,t:b.top-r.top,w:b.width,h:b.height,r};
      el.setPointerCapture(e.pointerId);
    };
    el.onpointermove=e=>{
      if(!active||!drag)return;
      let dx=e.clientX-active.x,dy=e.clientY-active.y;
      let l=clamp(active.l+dx,0,active.r.width-active.w);
      let t=clamp(active.t+dy,0,active.r.height-active.h);
      el.style.left=round(l/active.r.width*100)+"%";
      el.style.top=round(t/active.r.height*100)+"%";
    };
    el.onpointerup=e=>{
      if(!active)return;
      const r=panelRoot.getBoundingClientRect();
      const b=el.getBoundingClientRect();
      console.log(`#${el.id} { left:${round((b.left-r.left)/r.width*100)}%; top:${round((b.top-r.top)/r.height*100)}%; width:${round(b.width/r.width*100)}%; height:${round(b.height/r.height*100)}%; }`);
      active=null;
    };
  });
}
