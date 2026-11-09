/* Safe matte geometry in CSS pixels. Camera intent is constrained by real coverage. */
(() => {
 const {clamp}=VF.math;
 function cover(iw,ih,view,lens={}){
  const {w,h,frame:f}=view,bleed=Math.max(8,Math.min(w,h)*.025),base=Math.max((w+bleed*2)/iw,(h+bleed*2)/ih),zoom=Math.max(1,lens.zoom||1),scale=base*zoom,W=iw*scale,H=ih*scale;
  const x=clamp(w*.5-W*((lens.cx??.5)+(lens.travel||0)),w+bleed-W,-bleed),y=clamp(f.y+f.h*.43-H*(lens.cy??.5),h+bleed-H,-bleed);
  return{x,y,w:W,h:H,scale,bleed,requestedZoom:lens.zoom||1,covers:x<=0&&y<=0&&x+W>=w&&y+H>=h};
 }
 VF.Matte={cover};
})();
