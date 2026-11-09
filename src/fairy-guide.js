/* One illustrated character, six authored poses; spring flight on the film's clock. */
(() => {
 const {clamp,span}=VF.math;
 class FairyGuide{
  constructor(){this.x=null;this.y=null;this.vx=0;this.vy=0;this.trail=[];this.lastTime=0;this.stats={visible:false};}
  reset(){this.x=this.y=null;this.vx=this.vy=0;this.trail=[];this.stats={visible:false};}
  draw(p,s,t,v,{dt=0,paused=false,reduced=false,transitioning=false}={}){
   const im=VF.JourneyAssets.peek('fairy');if(!im)return;const b=s.guardian||{},arch=s.set==='arch',born=!arch||['unlatch','escape','mission','leave'].includes(b.id)&&!b.actionPending;
   if(!born||['photo','read','question','macro'].includes(b.view)){this.stats={visible:false,pose:'unborn'};return;}
   const target=s.fairyTarget||s.light||{x:v.w*.72,y:v.h*.37},f=v.frame;
   const wait=b.actionPending||b.kind==='choice',joy=['wish','earned','reveal'].includes(b.id),pose=b.id==='invitation'?5:joy?4:wait?1:b.id==='escape'||b.id==='arrival'&&s.set==='gallery'?2:b.departure?3:0;
   const h=Math.min(86,Math.max(60,f.w*.21)),radius=h*.40,blocked=(s.renderedActors||[]).flatMap(a=>[a.face,a.ears]).filter(Boolean);if(s.dialogueKeepout)blocked.push(s.dialogueKeepout);if(s.box?.visible)blocked.push({x:s.box.x-s.box.w*.57,y:s.box.y-s.box.h*.65,w:s.box.w*1.14,h:s.box.h*1.3});if(s.set==='rose'&&this.flower)blocked.push(this.flower);if(s.set==='rose'){const im=VF.JourneyAssets.image('rose'),r=VF.Matte.cover(im.width,im.height,{...v,frame:{y:0,h:v.h}},s.lens);blocked.push({x:r.x+r.w*.12,y:r.y+r.h*.41,w:r.w*.16,h:r.h*.17});}if(s.paintingSurface)blocked.push(s.paintingSurface);if(s.caseLayout)blocked.push({x:s.caseLayout.cx-s.caseLayout.s*.60,y:s.caseLayout.cy-s.caseLayout.s,w:s.caseLayout.s*1.2,h:s.caseLayout.s*1.4});
   const safe=q=>blocked.every(r=>q.x+radius<r.x||q.x-radius>r.x+r.w||q.y+radius<r.y||q.y-radius>r.y+r.h),flight=b.decisions?.['guide-way']==='lift'?'high':'low',base={x:clamp(target.x,26,v.w-26),y:clamp(target.y+(s.set==='rows'?(flight==='high'?-24:18):0),74+v.safe.top,v.h-v.safe.bottom-136)},candidates=[base,{x:v.w*.88,y:Math.max(v.story.y+v.story.h+radius+10,v.h*.34)},{x:v.w*.12,y:v.h*.38},{x:v.w*.86,y:v.h*.55},{x:v.w*.50,y:v.h*.29}].map(q=>({x:clamp(q.x,radius,v.w-radius),y:clamp(q.y,74+radius,v.h-136-radius)})),goal=candidates.find(safe)||candidates[0];
   if(this.x===null||reduced){this.x=goal.x;this.y=goal.y;this.vx=this.vy=0;this.trail=[];}
   if(!paused&&!reduced){const step=Math.min(.04,dt);for(const k of ['x','y']){const velocity='v'+k;this[velocity]+=(goal[k]-this[k])*26*step-this[velocity]*8*step;this[k]+=this[velocity]*step;}if(dt>0){this.trail.push({x:this.x,y:this.y});if(this.trail.length>18)this.trail.shift();}}
   const birth=arch&&b.id==='unlatch'?span(0,1.5,b.age):1,w=h*birth,flap=paused||reduced?0:Math.sin(t*8)*.018;
   p.save();for(const r of blocked){p.beginPath();p.rect(0,0,v.w,v.h);p.rect(r.x-2,r.y-2,r.w+4,r.h+4);p.clip('evenodd');}p.strokeStyle=s.effects?.forestLight==='mint'?'#c8e7be88':'#f7d6a788';p.lineWidth=1.3;p.beginPath();this.trail.forEach((q,i)=>i?p.lineTo(q.x,q.y):p.moveTo(q.x,q.y));p.stroke();p.translate(this.x,this.y);p.rotate(clamp(this.vx/800,-.13,.13)+flap);p.globalAlpha=transitioning?.5:1;
   const cw=im.naturalWidth/2,ch=im.naturalHeight/3;p.drawImage(im,(pose%2)*cw,Math.floor(pose/2)*ch,cw,ch,-w/2,-h*birth/2,w,h*birth);p.restore();
   this.lastTime=t;this.stats={visible:true,pose:['curiosity','wait','surprise','point','joy','invite'][pose],x:this.x,y:this.y,height:h*birth,flight,keepouts:blocked.length,clearOfFlowerAndFaces:true,occludedByWorld:!safe({x:this.x,y:this.y}),illustrated:true,trailPoints:this.trail.length};
  }
 }
 VF.FairyGuide=FairyGuide;
})();
