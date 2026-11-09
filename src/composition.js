/* F24: cinematic composition is editorial geometry, never a measurement of a HUD. */
(() => {
 'use strict';
 const finite=(v,f=0)=>Number.isFinite(v)?v:f;
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const insets=raw=>({top:Math.max(0,finite(raw?.top)),right:Math.max(0,finite(raw?.right)),bottom:Math.max(0,finite(raw?.bottom)),left:Math.max(0,finite(raw?.left))});
 function measure({w,h,safe,reading=false,photo=false,finale=false,captionHeight=120,captionPlacement='below'}={}){
  w=Math.max(160,finite(w,390));h=Math.max(160,finite(h,844));safe=insets(safe);
  const kind=w>h&&h<=550?'landscape':w>=900&&h>550?'desktop':'portrait';
  const gutter=kind==='desktop'?w*.04:w<=350?16:kind==='landscape'?18:22;
  const left=Math.max(gutter,safe.left),right=Math.max(gutter,safe.right),top=safe.top+(kind==='desktop'?78:kind==='landscape'?60:66);
  const protectedPlane=reading||photo||finale,contextBottom=safe.bottom+(kind==='landscape'?12:18),contextHeight=48;
  let frame,captionTop,story;
  if(kind==='landscape'){
   const storyW=Math.max(110,w*.29),artX=protectedPlane?left:Math.max(w*.35,left),bottom=h-safe.bottom-70;
   frame={x:artX,y:top,w:Math.max(60,w-right-artX),h:Math.max(56,bottom-top)};
   story={x:left,y:safe.top+60,w:storyW,h:Math.max(92,h-safe.top-safe.bottom-136)};captionTop=story.y;
  }else if(kind==='desktop'){
   const artX=protectedPlane?left:w*.33,bottom=h-safe.bottom-91;
   frame={x:artX,y:top,w:Math.max(80,w-right-artX),h:Math.max(100,bottom-top)};
   story={x:left,y:h-safe.bottom-244,w:w*.26,h:164};captionTop=story.y;
  }else{
   // Stage geometry is a shot contract. Text can grow/reflow without moving feet,
   // camera or photographic framing; its surface overlays the scenic viewport.
   const caption=h-safe.bottom-78-captionHeight,bottom=h-safe.bottom-86;
   frame={x:left,y:top,w:Math.max(80,w-left-right),h:Math.max(80,bottom-top)};
   const readingY=captionPlacement==='above'?top+8:caption;story={x:left,y:readingY,w:Math.max(80,w-left-right),h:captionHeight};captionTop=readingY;
  }
  // Bound exceptionally short windows without touching proportions or CSS transforms.
  frame.x=clamp(frame.x,0,w-40);frame.y=clamp(frame.y,0,h-40);frame.w=Math.min(frame.w,w-frame.x);frame.h=Math.min(frame.h,h-frame.y);
  return{w,h,kind,safe,frame,scenic:{x:0,y:0,w,h},captionTop,story,header:{x:left,y:safe.top+8,w:w-left-right,h:48},context:{bottom:contextBottom,height:contextHeight},protectedPlane};
 }
 function readSafeArea(){
  const probe=document.getElementById('safe-area-metrics');
  if(probe){const style=getComputedStyle(probe),read=side=>Math.max(0,parseFloat(style['padding'+side])||0);return{top:read('Top'),right:read('Right'),bottom:read('Bottom'),left:read('Left')};}
  return{top:0,right:0,bottom:0,left:0};
 }
 VF.Composition={measure,insets,readSafeArea};
})();
