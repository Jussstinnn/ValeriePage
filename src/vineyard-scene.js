/* F24. Standalone vineyard direction. Every trajectory and contact is authored
   before the approved RigAnimator; the original plush atlases and solver stay intact. */
(() => {
 'use strict';
 const {clamp,mix,ease,span,pulse,TAU}=VF.math;
 const copy=o=>JSON.parse(JSON.stringify(o));
 const IDS=['dos-miradas','te-abro-el-camino','una-patita-mas','el-tiempo-de-los-dos','un-secreto-para-ti','tras-la-luz'];
 const scalar=['head','turn','lean','crouch','sit','earL','earR','earTip','lookX','lookY'];
 const finite=n=>Number.isFinite(n);
 function glow(p,x,y,r,strength=1){const g=p.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(255,244,202,${.78*strength})`);g.addColorStop(.15,`rgba(247,214,148,${.30*strength})`);g.addColorStop(1,'#e8c68a00');p.fillStyle=g;p.fillRect(x-r,y-r,r*2,r*2);p.fillStyle='#fff5cf';p.beginPath();p.ellipse(x,y,2,2.8,0,0,TAU);p.fill();}
 function actor(id,x,floor,height){return{id,x,y:floor,floor,s:height/VF.rigBounds[id].h,head:0,turn:0,lean:0,crouch:0,sit:.42,earL:0,earR:0,earTip:0,lookX:0,lookY:0,blink:0,gaitWeight:0,stride:0,airborne:0,opacity:1,depth:id==='pink'?2:1,arms:{left:{x:id==='pink'?-38:-58,y:-72},right:{x:id==='pink'?38:58,y:-72}}};}
 function hop(a,t,start,end,dx,lift,tag='hop'){
  const q=clamp((t-start)/(end-start)),air=t>start&&t<end?Math.sin(q*Math.PI):0;
  a.x+=ease(q)*dx;a.y-=air*lift;a.airborne=Math.max(a.airborne,air>.001?1:0);a.crouch+=.28*pulse(start-.35,start-.12,start,start+.06,t)+.20*pulse(end,end+.12,end+.24,end+.54,t);
  a.head-=air*.10;a.earL-=air*.22;a.earR+=air*.18;a.earTip-=air*.09;
  if(air>.001)a.jumpPhase='flight';else if(t>=start-.35&&t<start)a.jumpPhase='anticipation';else if(t>=end&&t<end+.54)a.jumpPhase='settle';
  a.performance={name:tag,progress:q,phase:a.jumpPhase||'grounded'};return q;
 }
 function plMission(s,v){return{x:v.w*.50,y:Math.max(v.story.y+v.story.h+42,v.h*.35)};}
 function mapPoint(point,from,to){return{x:to.x+(point.x-from.x)/Math.max(1,from.w)*to.w,y:to.y+(point.y-from.y)/Math.max(1,from.h)*to.h};}
 class VineyardScene{
  constructor(){this.animator=new VF.RigAnimator();this.events=[];this.light={x:.52,y:.45,vx:0,vy:0,strength:1};this.drag=null;this.last=null;this.narrativeFrame=null;this.transition=null;this.seekPending=true;this.entry=null;this.stats={world:'vineyard',stage:'continuous-vineyard',draws:0};this.interactionTargets=[];this.flowerPoint=null;}
  prepareShot(shot){return VF.Art.prepareShot(shot);}
  enter(saved){this.stats={world:'vineyard',stage:'continuous-vineyard',draws:0};this.animator.reset();if(saved)this.animator.restore(saved);this.seekPending=true;this.transition=null;}
  reset(){this.animator.reset();this.events=[];this.light={x:.52,y:.45,vx:0,vy:0,strength:1};this.drag=null;this.last=null;this.entry=null;this.seekPending=true;}
  begin(){this.seekPending=true;this.transition=null;}
  seek(){this.seekPending=true;}
  setEntry(sourcePose,view){this.entry=sourcePose?{...copy(sourcePose),frame:sourcePose.frame||view?.frame}:null;}
  captureMotion(){return this.animator.capture();}
  act(name,id,time){return this.animator.play(id==='beige'?'taupe':id,name,time);}
  event(kind,time,point){this.events.push({kind,at:time,point:point||null});this.events=this.events.slice(-6);if(['pink','both','light'].includes(kind))this.act('asombro','pink',time);if(['taupe','both','light'].includes(kind))this.act('escucha','taupe',time);}
  grab(x,y){this.drag={x:clamp(x,.04,.96),y:clamp(y,.04,.94)};}
  release(){this.drag=null;}
  releaseForShot(current,next){this.release();if(![current,next].some(s=>s?.sceneStage==='ceremony')){this.giftMaterial=null;this.jewelMaterial=null;this.giftLining=null;this.quietLid=null;this.questionLetters=null;this.plateCache=null;this.stats.bufferBytes=this.rosePatch?.width*this.rosePatch?.height*4||0;}if(![current,next].some(s=>s?.set==='rose'))this.rosePatch=null;}
  state(){return{world:'vineyard',light:{...this.light},events:copy(this.events),beat:this.last?.beat,actors:this.last?.actors||null,animation:this.animator.state(),cinemaCamera:this.last?.cinemaCamera||null,performance:this.last?.performance||null};}
  blendEntry(s,source,q,view){
   if(!source?.actors||q>=1)return;if(source.set!==s.set&&!['gallery','ceremony'].includes(s.sceneStage))return;s.entryBlend=q;const f=view.frame,from=source.frame||source.view?.frame||f;
   for(const [id,a]of Object.entries(s.actors)){const previous=source.actors[id];if(!previous)continue;const p=mapPoint(previous,from,f),floor=mapPoint({x:previous.x,y:previous.floor??previous.y},from,f);a.x=mix(p.x,a.x,q);a.y=mix(p.y,a.y,q);a.floor=mix(floor.y,a.floor,q);a.s=mix(previous.s*f.w/Math.max(1,from.w),a.s,q);for(const key of scalar)a[key]=mix(previous[key]||0,a[key]||0,q);for(const side of ['left','right'])if(previous.arms?.[side])for(const axis of ['x','y'])a.arms[side][axis]=mix(previous.arms[side][axis],a.arms[side][axis],q);const transferFlight=0;if(transferFlight>.001){a.y-=transferFlight*Math.min(11,f.h*.026);a.airborne=1;a.jumpPhase='flight';a.earTip-=transferFlight*.08;}if(q<.001&&previous.airborne)a.airborne=1;}
   if(source.lens)for(const key of (source.set===s.set?['zoom','cx','cy','travel']:[]))s.lens[key]=mix(source.lens[key]??s.lens[key],s.lens[key],q);
   for(const name of ['leaf','box','light']){if(name!=='light'&&source.set!==s.set)continue;const old=source[name],target=s[name];if(!old||!target)continue;const pos=finite(old.x)&&finite(old.y)?mapPoint(old,from,f):null;if(pos){target.x=mix(pos.x,target.x,q);target.y=mix(pos.y,target.y,q);}for(const key of ['w','h','size'])if(finite(old[key])&&finite(target[key]))target[key]=mix(old[key]*f.w/Math.max(1,from.w),target[key],q);for(const key of ['visible','open','reveal','strength'])if(finite(old[key])&&finite(target[key]))target[key]=mix(old[key],target[key],q);if(name==='leaf'&&finite(old.rootX)){const root=mapPoint({x:old.rootX,y:old.rootY},from,f);target.rootX=mix(root.x,target.rootX,q);target.rootY=mix(root.y,target.rootY,q);}}
  }
  plate(v,s){const region=v.scenic||{x:0,y:0,w:v.w,h:v.h},im=VF.JourneyAssets.image(s.set),fit=VF.Matte.cover(im.width,im.height,{...region,frame:{y:0,h:region.h}},{zoom:s.lens?.zoom||1,cx:s.lens?.cx??.5,cy:s.lens?.cy??.5});return{...fit,image:im,region,point:(x,y)=>({x:fit.x+fit.w*x,y:fit.y+fit.h*y})};}
  pose(shot,time,view,o={}){
   const f=view.frame,b=o.beat||this.narrativeFrame,plan=b.actionPlan||{start:0,duration:3},age=b.actionPending?0:o.reduced?plan.duration:Math.min(b.age||0,plan.duration),t=plan.start+age,defs=VF.GuardianScript[shot.id],start=id=>defs.find(b=>b.id===id)?.actionPlan.start||0,q=(id,d=3)=>span(start(id),start(id)+d,t),h=Math.min(f.h*.65,f.w*.61),floor=f.y+f.h*.86;
   const p=actor('pink',f.x+f.w*.34,floor+f.h*.012,h*.82),g=actor('taupe',f.x+f.w*.67,floor,h),cast={pink:p,taupe:g},set=shot.set,lens={zoom:1.015,cx:.5,cy:.5,travel:0};
   let threshold=null,contact=false,lightGoal={x:f.x+f.w*.54,y:f.y+f.h*.36};const leaf={visible:0,held:false,id:'taupe',side:'left',holder:'beige',open:0,x:f.x+f.w*.52,y:floor-f.h*.18,rootX:f.x+f.w*.52,rootY:floor+8,size:f.w*.69,angle:-.12},box={visible:0,reveal:1,x:f.x+f.w*.52,y:floor-f.h*.08,w:Math.min(f.w*.43,170),h:0};box.h=box.w*.60;
   const step=(a,at,d,dx,lift,name)=>hop(a,t,at,at+d,dx*f.w,Math.min(lift,f.h*.10),name);
   // Each stage has persistent root paths with an anticipation and settling interval.
   if(set==='arch'){
    p.x=f.x-f.w*.10;g.x=f.x+f.w*1.08;p.opacity=span(.15,.32,t);g.opacity=span(.70,.90,t);
    step(p,.15,1.1,.43,29,'eager-rosa-nearly-tips-lantern');step(g,.7,1.4,-.425,18,'beige-catches-the-ribbon');
    step(p,1.6,.85,-.035,9,'rosa-checks-her-paws');
    g.arms.left={x:-58,y:-150};p.arms.right={x:45,y:-112};
    const catchQ=pulse(.5,.95,1.4,2.8,t),release=q('unlatch',2.8),escape=q('escape',2.7);
    g.lean=-.08*catchQ;g.crouch=.16*catchQ;p.earL=-.15*catchQ;p.earR=.22*catchQ;p.head=.14*catchQ;g.head=-.12;p.lookY=g.lookY=-.5;
    this.lantern={open:release,escaped:escape,tilt:.15*Math.sin(t*5)*catchQ,cordHand:VF.Kinematics.localToWorld(g,g.arms.left,'taupe')};
    const lamp=this.plate(view,{set,lens}).point(.365,.275);lightGoal={x:mix(lamp.x,f.x+f.w*.75,escape),y:mix(lamp.y,f.y+f.h*.27,escape)};
    step(p,start('escape')+.25,1.05,.06,24,'surprised-living-light');
    const mission=pulse(start('mission'),start('mission')+.7,start('mission')+2.2,start('mission')+3,t);p.lookX=.65*mission;g.lookX=-.55*mission;p.earL-=.19*mission;p.earR+=.16*mission;g.earTip+=.11*mission;g.arms.left.y=mix(-150,-127,escape);
    step(p,start('leave')+.4,1.1,.055,20,'rosa-makes-room');step(g,start('leave')+1.8,1.15,.035,13,'beige-follows-guide');
   }else if(set==='rows'){
    const rescue=start('together'),lift=b.decisions?.['guide-way']==='lift',n=span(rescue,rescue+4,t);
    step(p,.4,1.05,.08,20,'rosa-notices-caught-ribbon');step(g,start('steady')+.2,1.2,-.04,12,'beige-keeps-cord-loose');
    p.head=-.12;g.head=.10;g.arms.left={x:-64,y:-120};p.arms.right={x:43,y:mix(-76,lift?-166:-103,n)};
    if(t>=rescue&&b.kind!=='choice'){if(lift){step(p,rescue+.8,1.1,-.07,15,'rosa-lifts-ribbon');g.crouch=.18*n;g.lookY=-.8;}else{step(g,rescue+.8,1.4,-.07,10,'beige-offers-refuge');g.arms.left={x:-62,y:mix(-110,-145,n)};p.sit=.42+.24*n;p.lookY=.4;}}
    lightGoal={x:f.x+f.w*(lift?.60:.58),y:f.y+f.h*(lift?mix(.43,.22,n):mix(.40,.55,n))};
    if(!lift&&t>=rescue&&t<start('reply')){const hand=VF.Kinematics.localToWorld(g,g.arms.left,'taupe');lightGoal={x:mix(lightGoal.x,hand.x,n),y:mix(lightGoal.y,hand.y-29,n)};}if(t>=start('reply')){p.lookX=.7;g.lookX=.7;lightGoal.y=f.y+f.h*.30;}
   }else if(set==='pergola'){
    threshold=VF.ThresholdLeaf.pose(this,shot,t,view,b,cast,leaf,lens);this.canopyVariant=threshold.holder==='pink'?'rosa-roof-beige-crosses':'beige-roof-rosa-crosses';lightGoal={x:leaf.x+view.frame.w*.2,y:leaf.y-90};
   }else if(set==='creek'){
    // Exact top-surface anchors annotated from the new creek painting.
    const pl=this.plate(view,{set,lens}),stones=[[.24,.635],[.51,.594],[.70,.548],[.82,.506]].map(([x,y])=>pl.point(x,y));this.stones=stones;
    p.s*=.80;g.s*=.80;p.x=stones[0].x-f.w*.035;g.x=stones[0].x+f.w*.13;p.floor=stones[0].y-18*p.s;g.floor=stones[0].y-18*g.s;p.y=p.floor;g.y=g.floor;
    p.head=-.15;p.lookY=.5;g.lookY=.6;g.arms.left={x:-60,y:-92};
    const chosen=b.interactionValue==='far'?2:1,a=start('cross'),first=stones[chosen],end=stones[3],move=(actor,begin,dest,duration,tag)=>{const before={x:actor.x,y:actor.floor},n=span(begin,begin+duration,t);hop(actor,t,begin,begin+duration,dest.x-before.x,Math.min(34,f.h*.085),tag);const ground=dest.y-18*actor.s;actor.floor=mix(before.y,ground,n);actor.y+=actor.floor-before.y;};
    move(p,a+.6,first,1.6,'rosa-first-stone');move(p,a+3.0,end,1.55,'rosa-far-bank');move(g,a+4.9,first,1.5,'beige-waits-for-rosa');move(g,a+7.0,{x:end.x-f.w*.12,y:end.y+3},1.35,'beige-second-landing');
    if(t>a+2.2){p.turn=.30;p.lookX=-.8;}if(t>a+8.6){p.lookX=-.7;g.lookX=.5;g.earL=.15*pulse(start('reply'),start('reply')+.8,start('reply')+2,start('reply')+3,t);g.earR=-g.earL;}
    const shake=pulse(start('landed'),start('landed')+.7,start('landed')+1.2,start('landed')+2,t);p.head+=.12*Math.sin(shake*5);p.earTip=.2*shake;lightGoal={...end,y:end.y-35};this.stats.creek={banks:2,stones:stones.map(s=>({...s})),chosen,flow:!o.reduced};
   }else if(set==='rose'){
    step(p,.4,1,.09,18,'rosa-starts-before-looking');step(p,start('answer')+.6,1.3,-.09,15,'return-for-rose');p.lookX=-.7;g.lookX=-.8;g.head=-.13;p.head=.12*q('flower',2);p.sit=mix(.42,.66,q('slow',3));g.sit=mix(.42,.64,q('slow',3));p.lean=.06*q('stay',3);g.lean=-.025*q('stay',3);contact=t>=start('stay');
    const touched=this.events.filter(e=>e.kind==='flower').at(-1),response=touched?Math.max(0,1-(time-touched.at)/5):0;this.roseResponse=response;p.earR=.25*pulse(start('slow'),start('slow')+1.2,start('slow')+2,start('slow')+3,t)+.20*response;g.earTip=.12*response;
    const pl=this.plate(view,{set,lens});this.flowerPoint=pl.point(.20,.49);lightGoal={x:mix(this.flowerPoint.x,f.x+f.w*.68,q('leave',3)),y:mix(this.flowerPoint.y,f.y+f.h*.34,q('leave',3))};
   }else if(set==='alcove'){
    p.x=f.x+f.w*.26;g.x=f.x+f.w*.75;p.s*=.88;g.s*=.88;box.visible=1;box.w=f.w*.37;box.h=box.w*.60;const pedestal=this.plate(view,{set,lens}).point(.49,.543);box.x=pedestal.x;box.y=pedestal.y-box.h*.43;p.lookY=g.lookY=.4;g.head=-.12;
    g.arms.left={x:-60,y:-135-20*q('meaning',2)};p.arms.right={x:45,y:-89};p.head=.14*pulse(start('all'),start('all')+.5,start('all')+2,start('all')+3,t);
    this.projection=q('together',4);lightGoal={x:mix(box.x, f.x+f.w*.83,q('leave',4)),y:mix(box.y-box.h*.35,f.y+f.h*.34,q('leave',4))};
   }else if(set==='tunnel'){
    step(p,.4,1.1,.12,22,'scout-then-look-back');step(p,2.1,1.1,-.12,18,'wait-for-beige');step(g,start('reply')+.3,1.1,.035,11,'beige-catches-up');p.turn=.3*(1-q('together',2));p.lookX=.8;g.lookX=-.6;p.head=.08;g.head=-.08;contact=t>=start('together');
    const a=start('follow');step(p,a+.6,1.2,.06,20,'rosa-enters-fern-arch');step(g,a+2,1.3,.04,14,'beige-enters-with-rosa');lightGoal={x:f.x+f.w*.68,y:f.y+f.h*.29};
   }else if(set==='roots'){
    const rosaHelps=b.decisions?.['leaf-holder']==='rosa',scout=rosaHelps?g:p,helper=rosaHelps?p:g,sign=rosaHelps?1:-1;step(scout,.4,1.1,sign*.08,18,'wrong-side-of-fork');scout.turn=-sign*.34;scout.lookX=-sign*.8;helper.lookX=sign*.7;helper.arms[rosaHelps?'right':'left']={x:rosaHelps?45:-63,y:-120};const a=start('reveal');step(scout,a+2.3,1.25,-sign*.08,16,'take-companion-paw');step(helper,a+3.6,1.05,sign*.025,10,'steady-root-step');this.stats.rootCooperation={helper:helper.id,scout:scout.id};contact=t>=a+4.7;this.rootReveal=q('reveal',4.8);lightGoal={x:f.x+f.w*(.31+.42*this.rootReveal),y:f.y+f.h*(.67-.34*this.rootReveal)};
   }else if(set==='glasshouse'){
    const a=start('open'),door=q('open',3.4),through=q('through',4.6);this.doorOpen=door;
    step(p,.4,1.1,.03,15,'approach-gallery');step(g,start('sky')+.5,1.1,-.025,10,'recognize-etched-frame');p.lookY=g.lookY=-.6;p.head=-.16;g.head=-.09;g.arms.left={x:-61,y:-108-25*door};p.arms.right={x:45,y:-105};
    const pl=this.plate(view,{set,lens}),sill=pl.point(.53,.56),handle=pl.point(.451,.4285),approach=.55*span(start('sky')+.3,start('sky')+1.6,t)+.45*span(start('enter')+.2,start('enter')+1.5,t);
    g.s*=mix(1,.78,approach);p.s*=mix(1,.82,approach);g.arms.left={x:-61,y:-133};const hand=VF.Kinematics.localToWorld(g,g.arms.left,'taupe'),dx=handle.x-hand.x,dy=handle.y-hand.y;
    hop(g,t,start('sky')+.3,start('sky')+1.6,dx*.55,14,'beige-approaches-the-handle');hop(g,t,start('enter')+.2,start('enter')+1.5,dx*.45,10,'beige-at-the-latch');g.floor+=dy*approach;g.y+=dy*approach;
    const px=handle.x-f.w*.08-p.x,py=g.floor+f.h*.035-p.floor;hop(p,t,start('sky')+.6,start('sky')+1.9,px*.55,17,'rosa-follows-to-door');hop(p,t,start('enter')+.5,start('enter')+1.8,px*.45,11,'rosa-waits-by-beige');const pinkApproach=.55*span(start('sky')+.6,start('sky')+1.9,t)+.45*span(start('enter')+.5,start('enter')+1.8,t);p.floor+=py*pinkApproach;p.y+=py*pinkApproach;
    this.doorGrip=approach>=.999&&through<.001?{x:pl.point(.651,.247).x-(pl.w*.244)*.82*Math.cos(door*1.48),y:pl.point(.651,.247).y+pl.h*.313*.58-(pl.w*.244)*.082*Math.sin(door*1.48)}:null;
    for(const [actor,delay,side]of [[p,0,-1],[g,.9,1]]){const a=start('through')+delay,n=.55*span(a+.3,a+1.6,t)+.45*span(a+2,a+3.3,t);actor.s*=mix(1,.57,n);const ground=mix(actor.floor,sill.y-18*actor.s,n),dx=sill.x+side*f.w*.035-actor.x;hop(actor,t,start('through')+delay+.3,start('through')+delay+1.6,dx*.55,13,'cross-gallery-threshold');hop(actor,t,start('through')+delay+2,start('through')+delay+3.3,dx*.45,9,'inside-the-door');actor.y+=ground-actor.floor;actor.floor=ground;actor.lookY=-.4;}
    lightGoal={x:sill.x,y:sill.y-70};this.stats.threshold={visible:true,sill,open:door,crossed:through};
   }else if(set==='vestibule'){
    step(p,.5,1.15,.045,15,'enter-tiled-hall');step(g,2,1.2,-.025,10,'beige-enters-behind');g.earL=-.20*q('chosen',2);p.lookY=g.lookY=-.7;p.head=-.16;g.head=-.11;const a=start('listen');step(p,a+.4,1.15,.035,15,'toward-the-painting');step(g,a+1.8,1.1,-.025,11,'together-at-frame');lightGoal={x:f.x+f.w*.5,y:f.y+f.h*.29};
   }
   const pathDepth=VF.PathDepth.apply(this,set,t,view,defs,cast,lens);if(set==='arch')this.lantern.cordHand=VF.Kinematics.localToWorld(g,g.arms.left,'taupe');if(set==='rows'&&b.decisions?.['guide-way']==='shelter'&&t>=start('together')&&t<start('reply')){const palm=VF.Kinematics.localToWorld(g,g.arms.left,'taupe');lightGoal={x:palm.x,y:palm.y-29};}
   const detail=this.events.filter(e=>['vine-hint','light'].includes(e.kind)&&time-e.at<7).at(-1);if(detail){const q=pulse(0,.5,3,6,time-detail.at);p.head-=.13*q;g.earTip+=.13*q;p.lookX=.8*q;g.lookX=.7*q;if(detail.kind==='light'){lightGoal.x=mix(lightGoal.x,f.x+f.w*.58,q);lightGoal.y=mix(lightGoal.y,f.y+f.h*.35,q);}}
   const speaker=cast[b.speaker];if(speaker){const response=pulse(plan.start,plan.start+.7,plan.start+1.7,plan.start+2.8,t);speaker.head+=.045*response;const partner=speaker===p?g:p;partner.lookX=speaker.x>partner.x?.65:-.65;partner.earTip+=.055*response;}
   // A motivated lens moves the entire physical world once, before IK and support.
   const originalPlate=this.plate(view,{set,lens});
   const cameraPlans={arch:[1.13-.10*span(0,6,t),.50],rows:[1.025+.095*pulse(0,2.8,start('return'),start('reply'),t),.50+.028*q('attract',4)],pergola:[1.015+.065*q('leaf-result',2),.50],creek:[1.0,.50],rose:[1.025+.13*pulse(start('answer'),start('slow'),start('stay'),start('leave'),t),.46],alcove:[1.05+.095*q('meaning',3),.51],tunnel:[1.015+.105*q('follow',5),.53],roots:[1.015+.075*q('reveal',5),.54],glasshouse:[1.015+.105*q('through',5),.53],vestibule:[1.015+.13*q('listen',4.6),.55]};
   const [zoom,cx]=cameraPlans[set];lens.zoom=zoom;lens.cx=cx;const projected=this.plate(view,{set,lens}),factor=projected.w/originalPlate.w,map=point=>({x:projected.x+(point.x-originalPlate.x)*factor,y:projected.y+(point.y-originalPlate.y)*factor});
   for(const a of Object.values(cast)){const pos=map(a),ground=map({x:a.x,y:a.floor});a.x=pos.x;a.y=pos.y;a.floor=ground.y;a.s*=factor;}
   for(const prop of [leaf,box]){const pos=map(prop);prop.x=pos.x;prop.y=pos.y;for(const key of ['size','w','h'])if(Number.isFinite(prop[key]))prop[key]*=factor;}const root=map({x:leaf.rootX,y:leaf.rootY});leaf.rootX=root.x;leaf.rootY=root.y;lightGoal=map(lightGoal);
   if(set==='creek'){this.stones=this.stones.map(map);this.stats.creek.stones=this.stones.map(p=>({...p}));}if(set==='rose')this.flowerPoint=map(this.flowerPoint);if(set==='arch')this.lantern.cordHand=map(this.lantern.cordHand);if(set==='glasshouse'){this.stats.threshold.sill=map(this.stats.threshold.sill);if(this.doorGrip)this.doorGrip=map(this.doorGrip);}
   let scene={actors:cast,world:shot.world||'vineyard',chapter:shot.mode,set,biome:0,beat:b.id,guardian:b,light:{...lightGoal,strength:.9},leaf,box,lens,contact,threshold,pathDepth,performance:{name:set==='pergola'?this.canopyVariant:plan.gesture,phase:b.actionPending?'awaiting-touch':b.id,scoreTime:t,progress:plan.duration?age/plan.duration:1,companionResponds:true},actionReady:!b.actionPending&&(o.reduced||age>=plan.duration)&&!Object.values(cast).some(a=>a.airborne),actionProgress:plan.duration?age/plan.duration:1,cinemaCamera:{kind:set==='creek'?'bank-to-stone':set==='glasshouse'?'door-threshold':set==='vestibule'?'painting-axis':set+'-blocking',progress:plan.duration?age/plan.duration:1,lens},exitIntent:{kind:shot.exit,direction:'right',destination:VF.Journey.order[VF.Journey.order.indexOf(shot.id)+1]}};
   const source=o.entryPose||this.entry,entry=ease(clamp(o.entryProgress??1));this.blendEntry(scene,source,entry,view);
   for(const [id,a]of Object.entries(cast)){const bounds=VF.rigBounds[id];if(set!=='arch'||t>=7)a.x=clamp(a.x,f.x-bounds.x*a.s+4,f.x+f.w-(bounds.x+bounds.w)*a.s-4);const top=f.y-bounds.y*a.s+3;if(a.y<top){a.floor+=top-a.y;a.y=top;}a.gaitWeight=0;a.stride=0;a.depth=a.floor;const blink=(time+(id==='pink'?1.2:3.4))%6.3;a.blink=o.reduced||o.paused?0:blink<.14?Math.sin(blink/.14*Math.PI):0;if(!o.reduced&&!o.paused)a.head+=Math.sin(time*.7+(id==='pink'?0:1))*.008;delete a.handsWorld;}
   if(threshold){const first=cast[threshold.holder],second=cast[threshold.visitor],a=VF.Kinematics.localToWorld(first,first.arms.right,first.id),z=VF.Kinematics.localToWorld(second,second.arms.right,second.id),attach=span(0.8,1.75,t-start('leaf-result'));if(attach>0){leaf.x=mix(leaf.x,mix(a.x,z.x,ease(threshold.handover)),attach);leaf.y=mix(leaf.y,mix(a.y,z.y,ease(threshold.handover)),attach);}if(threshold.handover<.5&&attach>=1)first.handsWorld={right:a};else if(threshold.handover>=.5)second.handsWorld={right:z};leaf.attachment={id:threshold.handover<.5?first.id:second.id,side:'right',target:{x:leaf.x,y:leaf.y},ready:attach>=1&&(threshold.handover===0||threshold.handover===1)};}
   if(set==='glasshouse'&&this.doorGrip)g.handsWorld={left:{...this.doorGrip}};
   if(contact){const hand=VF.Kinematics.shared(p,g);if(hand.reachable){p.handsWorld={right:hand};g.handsWorld={left:hand};scene.sharedContact=hand;}}
   if(leaf.held&&!leaf.threshold){const a=cast[leaf.id],hand=VF.Kinematics.localToWorld(a,a.arms[leaf.side],leaf.id);a.handsWorld={...(a.handsWorld||{}),[leaf.side]:hand};leaf.x=mix(leaf.x,hand.x,leaf.gripBlend);leaf.y=mix(leaf.y,hand.y,leaf.gripBlend);if(leaf.handoff){const k=leaf.handoff,from=cast[k.from.id],to=cast[k.to.id],u=VF.Kinematics.localToWorld(from,from.arms[k.from.side],k.from.id),v=VF.Kinematics.localToWorld(to,to.arms[k.to.side],k.to.id);leaf.x=mix(u.x,v.x,k.progress);leaf.y=mix(u.y,v.y,k.progress);leaf.angle=mix(leaf.handoff.from.id==='pink'?.34:-.36,leaf.handoff.from.id==='pink'?-.36:.34,k.progress);}leaf.attachment={id:leaf.id,side:leaf.side,target:leaf.handoff?{x:leaf.x,y:leaf.y}:hand,ready:leaf.gripBlend>=.999};}
   const target=this.drag||{x:(lightGoal.x-f.x)/f.w,y:(lightGoal.y-f.y)/f.h},dt=Math.min(.08,Math.max(0,o.dt||0));if(this.seekPending||o.reduced){this.light.x=target.x;this.light.y=target.y;this.light.vx=this.light.vy=0;}else for(const axis of ['x','y']){const vel='v'+axis;this.light[vel]+=(target[axis]-this.light[axis])*19*dt-this.light[vel]*6.5*dt;this.light[axis]+=this.light[vel]*dt;}
   scene.light={x:f.x+this.light.x*f.w,y:f.y+this.light.y*f.h,strength:.9};if(source?.light&&entry<1){const old=mapPoint(source.light,source.frame||f,f);scene.light.x=mix(old.x,scene.light.x,entry);scene.light.y=mix(old.y,scene.light.y,entry);}
   if(this.drag)for(const a of Object.values(cast)){a.lookX=clamp((scene.light.x-a.x)/100,-1,1);a.lookY=clamp((scene.light.y-a.y+190*a.s)/100,-1,1);}
   this.animator.resolve(scene,time,view,{dt,reduced:!!o.reduced,paused:!!o.paused,seek:this.seekPending});this.seekPending=false;this.last=scene;this.stats.performance=scene.performance;this.stats.set=set;this.stats.actionReady=scene.actionReady;this.stats.cinemaCamera=scene.cinemaCamera;return scene;
  }
  background(p,s,t,v,profile,reduced){
   const pl=this.plate(v,s);this.projectionPlate=pl;p.fillStyle='#17332e';p.fillRect(0,0,v.w,v.h);p.drawImage(pl.image,pl.x,pl.y,pl.w,pl.h);this.interactionTargets=[];this.flowerPoint=s.set==='rose'?this.flowerPoint:null;delete this.stats.questProp;delete this.stats.emptySockets;this.stats.matte={set:s.set,x:pl.x,y:pl.y,w:pl.w,h:pl.h};this.stats.draws++;
   const touch=this.events.filter(e=>e.kind==='touch-feedback').at(-1);if(touch&&t-touch.at<.7){const a=Math.max(0,1-(t-touch.at)/.7);glow(p,touch.point.x,touch.point.y,22,a*.6);}
   const point=pl.point;
   if(['arch','rows'].includes(s.set)){const clue=point(.75,.46),event=this.events.filter(e=>e.kind==='vine-hint'&&t-e.at<7).at(-1),q=event?pulse(0,.6,4.4,7,t-event.at):0;this.interactionTargets.push({kind:'vine-hint',...clue,r:30});if(q>0){p.save();p.translate(clue.x,clue.y);p.rotate(-.65*q);VF.Art.draw(p,'foliage',VF.Art.rects.foliage.leaf,-v.w*.10,-v.w*.16,v.w*.25,v.w*.27);p.restore();for(let i=0;i<5;i++)glow(p,clue.x-(i+1)*v.w*.07,clue.y+Math.sin(i*.6)*25+i*8,10,q*.75);}this.stats.vineHint={revealed:q,pathPoints:q>0?5:0};}
   if(s.set==='arch'){const lamp=point(.365,.275),hand=this.lantern.cordHand,brooch={x:hand.x,y:hand.y-10};p.strokeStyle='#c6a373';p.lineWidth=1.6;p.beginPath();p.moveTo(lamp.x,lamp.y+24);p.bezierCurveTo(lamp.x-12,lamp.y+55,hand.x-6,hand.y-30,hand.x,hand.y);p.stroke();glow(p,lamp.x,lamp.y,34,1-this.lantern.escaped*.7);p.fillStyle='#edcda7';p.beginPath();p.ellipse(brooch.x,brooch.y,7,10,this.lantern.open*.9,0,TAU);p.fill();this.interactionTargets.push({kind:'lantern',...brooch,r:40});this.stats.lantern={...this.lantern,anchor:lamp};}
   if(s.set==='rows'){
    const beats=VF.GuardianScript['dos-miradas'],at=beats.find(b=>b.id==='together').actionPlan.start,q=span(at,at+4,s.performance.scoreTime),lift=s.guardian.decisions?.['guide-way']==='lift',g=s.actors.taupe,a=s.actors.pink,hand=VF.Kinematics.localToWorld(g,g.arms.left,'taupe'),other=VF.Kinematics.localToWorld(a,a.arms.right,'pink'),light=s.light;
    if(q<1){p.save();p.strokeStyle='#dfb78c';p.lineWidth=2.2;p.lineCap='round';p.beginPath();p.moveTo(hand.x,hand.y);p.bezierCurveTo(hand.x-35,hand.y-45,light.x-28,light.y-20*(1-q),light.x,light.y);p.bezierCurveTo(light.x+25*(1-q),light.y+20*(1-q),other.x+20,other.y-12,other.x,other.y);p.stroke();p.restore();}
    this.stats.guideRescue={variant:lift?'over-ribbon':'palm-refuge',released:q,physicalRibbon:true};
   }
   if(s.set==='creek'){
    // Water caustics stay within the actual painted channel, never over the rock tops.
    const water=point(.65,.75);p.save();p.globalCompositeOperation='screen';p.strokeStyle='#d6e9d82e';p.lineWidth=1;for(let j=0;j<(profile==='gentle'?5:11);j++){const x=water.x+Math.sin(j*9.3)*v.w*.3,y=water.y+j*5,q=reduced?0:(t*.13+j*.17)%1;p.beginPath();p.ellipse(x+q*8,y,14+j*2,2,0,0,TAU);p.stroke();}p.restore();this.stones.slice(1,3).forEach((stone,i)=>{this.interactionTargets.push({kind:'stone',...stone,r:Math.max(27,v.w*.07),value:i?'far':'near'});if(s.guardian.actionPending)glow(p,stone.x,stone.y-2,28,.7+(reduced?0:Math.sin(t*2+i)*.15));});
    for(const a of Object.values(s.actors))if(a.jumpPhase==='settle'){const n=a.performance?.progress||1;p.strokeStyle='#ead8b88c';p.beginPath();p.ellipse(a.x,a.floor+18*a.s,18+n*13,3+n*2,0,0,TAU);p.stroke();}
   }
   if(s.set==='rose'){this.windRose(p,pl,t,reduced);const flower=this.flowerPoint,amount=this.roseResponse||0;this.interactionTargets.push({kind:'flower',...flower,r:44});this.stats.storyFlower={...flower,w:pl.w*.20,h:pl.h*.14,visible:true,beforeMention:s.guardian.id==='notice'};if(amount>0)glow(p,flower.x,flower.y,70,amount*.7);this.stats.roseResponse=amount;}
   if(s.set==='alcove'){const b=s.box;p.fillStyle='#17282288';p.beginPath();p.ellipse(b.x,b.y+b.h*.43,b.w*.55,8,0,0,TAU);p.fill();this.stats.questProp={x:b.x-b.w*.5,y:b.y-b.h*.5,w:b.w,h:b.h};if(this.projection>0)this.signal(p,point(.72,.47),v.w*.14,this.projection,'tree');}
   const route=s.guardian.decisions?.['forest-way']||'neutral';if(['roots','glasshouse','vestibule'].includes(s.set)){const reveal=s.set==='roots'?this.rootReveal:1,anchor=point(s.set==='roots'?.43:.52,s.set==='roots'?.65:.42);this.signal(p,anchor,v.w*.18,.16+.84*reveal,route);this.stats.routeEcho={route,reveal,recognizable:true};if(s.set==='roots')this.interactionTargets.push({kind:'roots',...anchor,r:55});}
   if(s.set==='glasshouse'){const door={a:point(.407,.247),b:point(.651,.56)},open=this.doorOpen||0,w=door.b.x-door.a.x,h=door.b.y-door.a.y,im=pl.image;
    // Hinged painted door leaf: texture is taken from the real illustrated door, not a flat rectangle.
    p.save();p.translate(door.b.x,door.a.y);p.transform(Math.max(.035,Math.cos(open*1.48)),Math.sin(open*1.48)*.10,0,1,0,0);p.drawImage(im,im.width*.606,im.height*.255,im.width*.046,im.height*.30,-w,0,w,h);p.strokeStyle='#6c4b2c';p.lineWidth=2;p.strokeRect(-w,0,w,h);p.fillStyle='#c5a15a';p.beginPath();p.arc(-w*.82,h*.58,4,0,TAU);p.fill();p.restore();const knob={x:door.b.x-w*.82,y:door.a.y+h*.58};this.interactionTargets.push({kind:'door',...knob,r:42});this.stats.door={open,hinge:{x:door.b.x,y:door.a.y},bounds:{x:door.a.x,y:door.a.y,w,h}};
   }
   if(s.set==='vestibule'){const center=point(.565,.414),w=pl.w*.26,h=w*.79;p.fillStyle='#a38957';p.fillRect(center.x-w*.54,center.y-h*.55,w*1.08,h*1.1);p.drawImage(VF.NightPainting(),center.x-w*.5,center.y-h*.5,w,h);this.stats.arrivalPainting={x:center.x-w*.5,y:center.y-h*.5,w,h};}
   if(s.set==='tunnel'){const open=s.guardian.id==='follow'?span(.15,4.6,s.guardian.age):s.guardian.actionPlan.start>VF.GuardianScript['tras-la-luz'].find(b=>b.id==='follow').actionPlan.start?1:0;s.branchAperture=open;s.fairyTarget={x:v.w*mix(.66,.53,open),y:v.h*mix(.43,.29,open)};this.stats.branchAperture={open,gesture:s.guardian.id==='follow',physicalBranches:2};}
   if(!s.threshold)this.canopy(p,s.leaf,v,t,reduced);if(s.leaf.visible>.2)this.interactionTargets.push({kind:'leaf',x:s.leaf.x,y:s.leaf.y-s.leaf.size*.4,r:Math.max(32,s.leaf.size*.25)});
   if(s.guardian.actionPending&&s.guardian.interaction?.target==='light')this.interactionTargets.push({kind:'light',x:s.light.x,y:s.light.y,r:45});
  }
  windRose(p,pl,time,reduced){
   const crop={x:.035,y:.385,w:.31,h:.27};if(!this.rosePatch){const c=VF.math.canvas(320,400),q=c.getContext('2d');q.drawImage(pl.image,pl.image.width*crop.x,pl.image.height*crop.y,pl.image.width*crop.w,pl.image.height*crop.h,0,0,c.width,c.height);this.rosePatch=c;this.stats.bufferBytes=c.width*c.height*4;}
   const c=this.rosePatch,left=pl.x+pl.w*crop.x,top=pl.y+pl.h*crop.y,width=pl.w*crop.w,height=pl.h*crop.h,wind=reduced?0:Math.sin(time*.8)*3+Math.sin(time*.37+1)*1.5,response=this.roseResponse||0,grid=[];
   for(let y=0;y<=3;y++)for(let x=0;x<=4;x++){const u=x/4,v=y/3,weight=Math.sin(Math.PI*u)*Math.sin(Math.PI*v);grid.push({sx:u*c.width,sy:v*c.height,x:left+u*width+weight*(wind+(u-.5)*response*8),y:top+v*height+weight*(v-.45)*response*6});}
   const triangle=(a,b,d)=>{const ux=b.sx-a.sx,uy=b.sy-a.sy,vx=d.sx-a.sx,vy=d.sy-a.sy,det=ux*vy-vx*uy,dx=b.x-a.x,dy=b.y-a.y,ex=d.x-a.x,ey=d.y-a.y,A=(dx*vy-ex*uy)/det,B=(dy*vy-ey*uy)/det,C=(ex*ux-dx*vx)/det,D=(ey*ux-dy*vx)/det;p.save();p.beginPath();p.moveTo(a.x,a.y);p.lineTo(b.x,b.y);p.lineTo(d.x,d.y);p.closePath();p.clip();p.transform(A,B,C,D,a.x-A*a.sx-C*a.sy,a.y-B*a.sx-D*a.sy);p.drawImage(c,0,0);p.restore();};
   for(let y=0;y<3;y++)for(let x=0;x<4;x++){const a=grid[y*5+x],b=grid[y*5+x+1],d=grid[(y+1)*5+x],e=grid[(y+1)*5+x+1];triangle(a,b,d);triangle(b,e,d);}
  }
  signal(p,a,size,reveal,route){p.save();p.globalAlpha=.9*reveal;p.strokeStyle=route==='tree'?'#b5d9a7':'#f7d496';p.lineWidth=2.5;p.lineCap='round';for(let j=0;j<5;j++){const q=j/4,x=a.x-size*.5+q*size,y=a.y-Math.sin(q*Math.PI)*size*.55;if(route!=='tree')glow(p,x,y,10,.7);if(route!=='firefly'){p.beginPath();p.moveTo(x,y+12);p.quadraticCurveTo(x-8,y-2,x+6,y-16);p.stroke();}}p.restore();}
  canopy(p,l,v,time,reduced){if(l.visible<.001)return;const size=l.size;p.save();p.globalAlpha=l.visible;p.strokeStyle='#344c2a';p.lineWidth=4;p.beginPath();p.moveTo(l.rootX,l.rootY);p.bezierCurveTo(l.rootX-size*.10,l.rootY-size*.18,l.x+size*.12,l.y+size*.13,l.x,l.y);p.stroke();p.strokeStyle='#c5bd83';p.lineWidth=1;p.stroke();p.translate(l.x,l.y);p.rotate(l.angle+(reduced?0:Math.sin(time*.5)*.006));const r=VF.Art.rects.foliage.leaf,from=l.handoff?mix(l.handoff.from.id==='pink'?-.12:-.86,l.handoff.to.id==='pink'?-.12:-.86,l.handoff.progress):l.holder==='rosa'?-.12:-.86;p.shadowColor='#0b251c66';p.shadowBlur=5;p.shadowOffsetY=3;const img=VF.Art.image('foliage');for(let j=0;j<6;j++){const q=j/6,flex=reduced?0:Math.sin(time*.6+j*.3)*.009;p.save();p.rotate(flex);p.drawImage(img,r[0],r[1]+r[3]*q,r[2],Math.min(r[3]*(1-q),r[3]/6+1),size*from,-size*.96+size*1.05*q,size,size*1.05/6+1);p.restore();}p.shadowColor='transparent';p.restore();}
  shadow(p,a){if((a.opacity??1)<.01)return;const ground=a.groundY??a.floor+18*a.s,lift=Math.max(0,a.floor-a.y),r=(a.id==='pink'?58:84)*a.s+lift*.10;p.save();p.translate(a.x,ground);p.scale(1,.18);const g=p.createRadialGradient(0,0,1,0,0,r);g.addColorStop(0,`rgba(8,24,22,${.5/(1+lift*.03)})`);g.addColorStop(.45,'#091f1b4a');g.addColorStop(1,'#091f1b00');p.fillStyle=g;p.fillRect(-r,-r,r*2,r*2);p.restore();for(const foot of Object.values(a.feetWorld||{})){if(!foot.contact)continue;const rr=Math.max(7,a.s*24);p.save();p.translate(foot.x,ground);p.scale(1,.14);const q=p.createRadialGradient(0,0,0,0,0,rr);q.addColorStop(0,'#081b18b3');q.addColorStop(1,'#081b1800');p.fillStyle=q;p.fillRect(-rr,-rr,rr*2,rr*2);p.restore();}}
  actorLayer(p,a,s,t,v,reduced){if(s.threshold)VF.ThresholdLeaf.actorLayer(p,a,s,v,t,reduced);}
  afterActors(p,s,t,v){
   if(s.threshold)VF.ThresholdLeaf.draw(p,s,v,t,false);
   if(s.box.visible&&s.set!=='alcove'){const b=s.box;p.save();p.globalAlpha=b.visible;VF.Art.draw(p,'gift',VF.Art.rects.gift.closed,b.x-b.w*.5,b.y-b.h*.5,b.w,b.h);p.restore();this.stats.gift={...b,closed:true,originalReference:true};}
   if(s.set==='arch'&&s.guardian.id==='mission'){const c=plMission(s,v);for(let i=0;i<3;i++)VF.RelicVisual.draw(p,['forest','sky','garden'][i],['firefly','paint','petal'][i],c.x+(i-1)*v.w*.17,c.y,v.w*.17,null,.64);this.stats.mission={threeSignals:true,preview:true};}
   if(s.set==='alcove'){
    const b=s.box,L={s:b.w*.90,cx:b.x,cy:b.y-b.w*.02,project:(x,y,z)=>({x:b.x+(x*.986-z*.165)*b.w*.90,y:b.y-b.w*.02+(-y+(z*.986+x*.165)*.35)*b.w*.90})},G=VF.GiftGeometry.for(L,0);
    if(!this.giftMaterial)this.giftMaterial=new VF.GiftMaterials({blank:true});this.giftMaterial.back(p,L,0,G);this.giftMaterial.foreground(p,L,G);
    VF.CeremonyTheatre.plates.call(this,p,{giftGeometry:G,placement:{forest:0,sky:0,garden:0},ceremony:{openAuthorized:false}});
    this.stats.emptySockets=3;this.stats.introSockets=G.slotFrames;this.stats.gift={...b,closed:true,sharedGeometry:true};
   }
   if(s.set==='rose')this.stats.roseObservation={harvested:false,wind:true};
  }
  foreground(p,s,t,v,profile,reduced){
   if(!['glasshouse','vestibule','creek'].includes(s.set)){const size=v.w*.38,wind=reduced?0:Math.sin(t*.45)*4;p.save();p.globalAlpha=.85;VF.Art.draw(p,'foliage',VF.Art.rects.foliage.left,-size*.8+wind,-size*.08,size,size*1.13);VF.Art.draw(p,'foliage',VF.Art.rects.foliage.right,v.w-size*.15-wind,-size*.12,size,size*1.13);p.restore();}
   if(s.set==='tunnel'){const open=s.branchAperture||0,size=v.w*.94;for(const side of [-1,1]){p.save();p.translate(side<0?v.w*.13:v.w*.87,v.h*.44);p.rotate(side*open*.68);p.translate(side*open*v.w*.34,0);VF.Art.draw(p,'foliage',VF.Art.rects.foliage[side<0?'left':'right'],side<0?-size*.82:-size*.18,-size*.42,size,size*1.13);p.restore();}}
   VF.PathDepth.foreground(p,s,v,t);
   glow(p,s.light.x,s.light.y,28,s.light.strength);if(this.drag)glow(p,s.light.x,s.light.y,45,.5);
   // The location continues beneath reading/HUD overlays, without a synthetic floor band.
  }
  flower(){}mushroom(){}
 }
 VF.JourneyActing={actor,hop};VF.VineyardScene=VineyardScene;
})();
