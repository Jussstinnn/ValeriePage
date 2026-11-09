/* Full artworks stay protected. Staging travels through available air, never through faces. */
(() => {
 class ShotComposer {
  compose(id,time,reduced,selection=null){
   const b=window.VScore.beat(id,time);if(!b)return{x:0,y:0,w:1,h:1,scale:1};
   const {ease,mix}=window.VMath,q=reduced?1:ease(b.q),a=b.current,z=b.next;
   let size=1,x=0,y=0;
   // Only pre-character establishing shots crop the source. Both open before the subject is born.
   if(!reduced&&a.crop){size=mix(a.crop[2],1,q);x=(1-size)*a.crop[0];y=(1-size)*a.crop[1];}
   const focus=[mix(a.focus[0],z.focus[0],q),mix(a.focus[1],z.focus[1],q)];
   if(id==='lily'&&selection){const t=reduced?1:ease((time-selection.at)/1.2),from=selection.from||focus;focus[0]=mix(from[0],selection.x,t);focus[1]=mix(from[1],selection.y,t);}
   return{x,y,w:size,h:size,scale:1,focus,exposure:mix(a.light,z.light,q),id:a.id,beat:a.id,actor:a.actor||'idle',authoredCamera:!!a.crop,selection};
  }
  place(source,rect,shot){
   if(!source?.width||!rect?.w||!rect?.h)return null;
   const sw=source.width*(shot?.w||1),sh=source.height*(shot?.h||1),scale=Math.min(rect.w/sw,rect.h/sh),w=sw*scale,h=sh*scale;
   const fx=shot?.focus?.[0]??.5,fy=shot?.focus?.[1]??.5;
   // Travel is bounded by the free margin of this device's composition, so nothing can be clipped.
   return{x:rect.x+(rect.w-w)*(.5+(fx-.5)*.22),y:rect.y+(rect.h-h)*(.5+(fy-.5)*.16),w,h};
  }
  toSource(point,rect,shot){return{x:(shot?.x||0)+(point.x-rect.x)/rect.w*(shot?.w||1),y:(shot?.y||0)+(point.y-rect.y)/rect.h*(shot?.h||1)};}
  fromSource(point,rect,shot){return{x:rect.x+(point.x-(shot?.x||0))/(shot?.w||1)*rect.w,y:rect.y+(point.y-(shot?.y||0))/(shot?.h||1)*rect.h};}
 }
 window.VShotComposer=ShotComposer;
})();
