/* Pure reveal contract: a clock measures an authorized action; it never authorizes it. */
(() => {
 const {span,ease}=VF.math;
 VF.RevealDirector={
  frame(openAction,time,beat={},reduced=false,revealAction=null){
   const opened=openAction?.done===true&&Number.isFinite(openAction.at),openAge=opened?Math.max(0,time-openAction.at):0,open=opened?(reduced?1:ease(span(3.15,7.5,openAge))):0;
   const authorized=opened&&revealAction?.done===true&&Number.isFinite(revealAction.at)&&revealAction.at>=openAction.at,age=authorized?Math.max(0,time-revealAction.at):0,revealProgress=authorized&&open>=.999?(reduced?1:ease(span(.35,2.7,age))):0,ringVisible=authorized&&revealProgress>0,revealed=authorized&&revealProgress>=.999;
   const macro=revealed&&beat.view==='macro'?(reduced?1:span(0,2,beat.age)):revealed&&beat.view==='return'?(reduced?0:1-span(0,1.5,beat.age)):0;
   const state=!opened?'CLOSED':open<.999?'UNLATCHED':!authorized?'OPEN_HIDDEN':!revealed?'REVEAL':beat.view==='question'?'QUESTION':'CONTEMPLATE';
   return{state,phase:state,open,revealProgress,ringVisible,revealed,macro,authorized,openAuthorized:opened,cover:1-revealProgress,openAge,revealAge:age,ready:open>=.999,nextReady:beat.id==='opening'?open>=.999&&(reduced||openAge>=8.2):beat.id==='unveil'?revealed&&(reduced||age>=7):revealed&&(beat.view!=='macro'||macro>=.999)};
  },
  alcove(p,v,lens={zoom:1.02,cx:.5,cy:.5}){const image=VF.JourneyAssets.image('alcove'),r=VF.Matte.cover(image.naturalWidth,image.naturalHeight,{...v,frame:{y:0,h:v.h}},lens);p.drawImage(image,r.x,r.y,r.w,r.h);const shade=p.createLinearGradient(0,0,v.w,v.h);shade.addColorStop(0,'#102438a8');shade.addColorStop(.6,'#151d328c');shade.addColorStop(1,'#081923b0');p.fillStyle=shade;p.fillRect(0,0,v.w,v.h);return{...r,set:'alcove',samePhysicalPlace:true,nocturnal:true};}
 };
})();
