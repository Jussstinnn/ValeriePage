/* F24 navigation cut model. One timeline, one cast, no timers and no scene inheritance. */
(() => {
 'use strict';
 const clamp=n=>Math.min(1,Math.max(0,Number.isFinite(n)?n:0)),smooth=n=>{n=clamp(n);return n*n*(3-2*n);},copy=o=>o?JSON.parse(JSON.stringify(o)):null;
 class TransitionDirector{
  constructor(){this.serial=0;this.current=null;this.last=null;}
  kind(from,to){const id=v=>typeof v==='number'?VF.content?.shots[v]?.id:v;return VF.Journey?.transition(id(from),id(to))||'color-ribbon';}
  start({from,to,sourcePose,sourceWorld,targetWorld,sourceCamera,targetCamera,transitionKind,reduced=false,direction=1}={}){
   this.cancel();const kind=transitionKind||this.kind(from,to),tracking=kind==='follow-cast'||kind==='frame-match';this.current={id:++this.serial,from,to,sourcePose:copy(sourcePose),targetPose:null,sourceWorld,targetWorld,sourceCamera:copy(sourceCamera),targetCamera:copy(targetCamera),kind,direction:direction<0?-1:1,duration:reduced?.18:tracking?1.35:kind==='page-turn'?1.45:kind==='doorway'?1.45:1.2,elapsed:0,progress:0,transferred:false,reduced,tracking};return this.current.id;
  }
  update(dt,{paused=false}={}){const a=this.current;if(!a)return null;if(!paused&&Number.isFinite(dt)&&dt>0){const next=clamp((a.elapsed+Math.min(.12,dt))/a.duration),gate=a.tracking?.22:.50;a.progress=!a.transferred&&next>=gate?gate:next;a.elapsed=a.progress*a.duration;}return this.state();}
  get active(){return !!this.current;}
  get transferReady(){const a=this.current;return !!a&&!a.transferred&&a.progress>=(a.tracking?.22:.50);}
  transfer(targetPose,targetCamera){const a=this.current;if(!a||a.transferred)return false;a.transferred=true;a.targetPose=copy(targetPose);a.targetCamera=copy(targetCamera);return true;}
  get complete(){return !!this.current&&this.current.transferred&&this.current.progress>=1;}
  finish(){if(!this.complete)return false;this.last=this.state();this.current=null;this.plate=null;this.matte=null;return true;}
  cancel(){this.plate=null;this.matte=null;const a=this.current;if(a)this.last={...this.state(),cancelled:true};this.current=null;this.serial++;return !!a;}
  frame(){const a=this.current;if(!a)return null;const out=a.tracking?.22:.50;return{progress:a.progress,kind:a.kind,direction:a.direction,exitProgress:!a.transferred?smooth(a.progress/out):1,entryProgress:a.transferred?smooth((a.progress-out)/(1-out)):0,occluded:!a.tracking&&a.progress>=.43&&a.progress<=.59,tracking:a.tracking,reduced:a.reduced};}
  state(){const a=this.current;return a?{id:a.id,active:true,from:a.from,to:a.to,kind:a.kind,sourceWorld:a.sourceWorld,targetWorld:a.targetWorld,sourcePose:copy(a.sourcePose),targetPose:copy(a.targetPose),sourceCamera:copy(a.sourceCamera),targetCamera:copy(a.targetCamera),progress:a.progress,transferred:a.transferred,reduced:a.reduced,phase:a.transferred?'entry':'exit'}:{active:false,last:this.last};}
  leafAnchor(){return VF_LEAF_OCCLUDER.anchor;}
  overlay(p,v){
   const a=this.current;if(!a||a.tracking)return;const w=v.w,h=v.h,q=a.progress;
   // Capture the real outgoing render, including its final supported poses, before drawing any transition.
   if(!a.transferred){if(!this.plate){this.plate=document.createElement('canvas');}if(this.plate.width!==p.canvas.width||this.plate.height!==p.canvas.height){this.plate.width=p.canvas.width;this.plate.height=p.canvas.height;}this.plate.getContext('2d').drawImage(p.canvas,0,0);return;}
   if(!this.plate)return;const u=smooth((q-.5)/.5);p.save();
   if(a.reduced){p.globalAlpha=1-u;p.drawImage(this.plate,0,0,w,Math.ceil(h/128)*128);p.restore();return;}
   const paper=a.kind==='page-turn',water=['water-reflection','path-dissolve'].includes(a.kind);
   // Full-size source stays registered. The incoming plate is revealed through a feathered travelling matte.
   this.matte??=document.createElement('canvas');const c=this.matte;if(c.width!==this.plate.width||c.height!==this.plate.height){c.width=this.plate.width;c.height=this.plate.height;}const m=c.getContext('2d');m.clearRect(0,0,c.width,c.height);m.drawImage(this.plate,0,0);m.globalCompositeOperation='destination-out';
   const sx=c.width/w,sy=c.height/(Math.ceil(h/128)*128),portal=a.sourcePose?.portal;
   if(a.kind==='doorway'&&portal&&u>0){const x=portal.x*sx*(1-u),y=portal.y*sy*(1-u),W=(portal.w+(w-portal.w)*u)*sx,H=(portal.h+(h+128-portal.h)*u)*sy;m.fillStyle='#000';m.fillRect(x,y,W,H);}
   else{const vertical=water,axis=vertical?c.height:c.width,edge=axis*(1.06-u*1.12),soft=axis*(paper?.014:.035),g=m.createLinearGradient(vertical?0:a.direction<0?axis-edge+soft:edge-soft,vertical?edge-soft:0,vertical?0:a.direction<0?axis-edge-soft:edge+soft,vertical?edge+soft:0);g.addColorStop(0,'#0000');g.addColorStop(1,'#000');m.fillStyle=g;m.fillRect(0,0,c.width,c.height);}
   m.globalCompositeOperation='source-over';p.drawImage(c,0,0,w,Math.ceil(h/128)*128);
   p.restore();
  }
 }
 VF.TransitionDirector=TransitionDirector;
})();
