/* Scene-owned world coordinates. Roots, floor, perspective and flight resolve before IK. */
(() => {
 const {clamp,ease,pulse}=VF.math;
 function path(from,to,time,start,duration,hops=3,lift=24){
  let u=0,air=0,crouch=0,phase='grounded';const slot=duration/hops;
  for(let i=0;i<hops;i++){const a=start+i*slot,b=a+slot*.78,q=clamp((time-a)/(b-a));u+=(ease(q)/hops);if(time>a&&time<b){air=Math.sin(q*Math.PI);phase='flight';}else if(time>=b&&time<b+.30)phase='settle';crouch+=.22*pulse(a-.24,a-.08,a,a+.04,time)+.15*pulse(b,b+.08,b+.17,b+.30,time);}
  return{x:from.x+(to.x-from.x)*u,z:from.z+(to.z-from.z)*u,air,flight:air>.001,crouch,phase,u,lift};
 }
 function actor(id,point,v,height){const f=v.frame,perspective=1/(1+.70*point.z),floor=f.y+f.h*(.93-.36*point.z),a=VF.JourneyActing.actor(id,f.x+f.w*(.5+(point.x-.5)*perspective),floor,height*(id==='pink'?.82:1)*perspective);a.y-=point.air*point.lift*perspective;a.airborne=point.flight?1:0;a.crouch=point.crouch||0;a.jumpPhase=point.phase;a.earL=-point.air*.20;a.earR=point.air*.18;a.earTip=-point.air*.10;a.depth=floor;a.worldPosition={x:point.x,z:point.z,perspective};a.gaitWeight=0;return a;}
 VF.WorldPath=Object.freeze({sample:path,actor});
})();
