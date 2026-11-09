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
 function mapPoint(point,from,to){return{x:to.x+(point.x-from.x)/Math.max(1,from.w)*to.w,y:to.y+(point.y-from.y)/Math.max(1,from.h)*to.h};}
 class VineyardScene{
  constructor(){this.animator=new VF.RigAnimator();this.events=[];this.light={x:.52,y:.45,vx:0,vy:0,strength:1};this.drag=null;this.last=null;this.narrativeFrame=null;this.transition=null;this.seekPending=true;this.entry=null;this.stats={world:'vineyard',stage:'continuous-vineyard',draws:0};this.interactionTargets=[];this.flowerPoint=null;}
  prepareShot(shot){return VF.Art.prepareShot(shot);}
  enter(saved){this.animator.reset();if(saved)this.animator.restore(saved);this.seekPending=true;this.transition=null;}
  reset(){this.animator.reset();this.events=[];this.light={x:.52,y:.45,vx:0,vy:0,strength:1};this.drag=null;this.last=null;this.entry=null;this.seekPending=true;}
  begin(){this.seekPending=true;this.transition=null;}
  seek(){this.seekPending=true;}
  setEntry(sourcePose,view){this.entry=sourcePose?{...copy(sourcePose),frame:sourcePose.frame||view?.frame}:null;}
  captureMotion(){return this.animator.capture();}
  act(name,id,time){return this.animator.play(id==='beige'?'taupe':id,name,time);}
  event(kind,time,point){this.events.push({kind,at:time,point:point||null});this.events=this.events.slice(-6);if(['pink','both','light'].includes(kind))this.act('asombro','pink',time);if(['taupe','both','light'].includes(kind))this.act('escucha','taupe',time);}
  grab(x,y){this.drag={x:clamp(x,.04,.96),y:clamp(y,.04,.94)};}
  release(){this.drag=null;}
  releaseForShot(){this.release();}
  state(){return{world:'vineyard',light:{...this.light},events:copy(this.events),beat:this.last?.beat,actors:this.last?.actors||null,animation:this.animator.state(),cinemaCamera:this.last?.cinemaCamera||null,performance:this.last?.performance||null};}
  blendEntry(s,source,q,view){
   if(!source?.actors||q>=1)return;s.entryBlend=q;const f=view.frame,from=source.frame||source.view?.frame||f;
   for(const [id,a]of Object.entries(s.actors)){const previous=source.actors[id];if(!previous)continue;const p=mapPoint(previous,from,f),floor=mapPoint({x:previous.x,y:previous.floor??previous.y},from,f);a.x=mix(p.x,a.x,q);a.y=mix(p.y,a.y,q);a.floor=mix(floor.y,a.floor,q);a.s=mix(previous.s*f.w/Math.max(1,from.w),a.s,q);for(const key of scalar)a[key]=mix(previous[key]||0,a[key]||0,q);for(const side of ['left','right'])if(previous.arms?.[side])for(const axis of ['x','y'])a.arms[side][axis]=mix(previous.arms[side][axis],a.arms[side][axis],q);const transferFlight=q>.06&&q<.94?Math.sin((q-.06)/.88*Math.PI):0;if(transferFlight>.001){a.y-=transferFlight*Math.min(11,f.h*.026);a.airborne=1;a.jumpPhase='flight';a.earTip-=transferFlight*.08;}if(q<.001&&previous.airborne)a.airborne=1;}
   if(source.lens)for(const key of ['zoom','cx','cy','travel'])s.lens[key]=mix(source.lens[key]??s.lens[key],s.lens[key],q);
   for(const name of ['leaf','box','light']){const old=source[name],target=s[name];if(!old||!target)continue;const pos=finite(old.x)&&finite(old.y)?mapPoint(old,from,f):null;if(pos){target.x=mix(pos.x,target.x,q);target.y=mix(pos.y,target.y,q);}for(const key of ['w','h','size'])if(finite(old[key])&&finite(target[key]))target[key]=mix(old[key]*f.w/Math.max(1,from.w),target[key],q);for(const key of ['visible','open','reveal','strength'])if(finite(old[key])&&finite(target[key]))target[key]=mix(old[key],target[key],q);if(name==='leaf'&&finite(old.rootX)){const root=mapPoint({x:old.rootX,y:old.rootY},from,f);target.rootX=mix(root.x,target.rootX,q);target.rootY=mix(root.y,target.rootY,q);}}
  }
  pose(shot,time,view,o={}){
   const f=view.frame,portrait=view.kind==='portrait',at=Math.max(0,IDS.indexOf(shot.id)),b=o.beat||this.narrativeFrame||{id:'original',age:time},rawAge=Math.max(0,b.age||0),age=o.reduced?Math.max(9,rawAge):rawAge,plan=b.actionPlan,t=plan?plan.start+(o.reduced?plan.duration:Math.min(rawAge,plan.duration)):age;
   const h=Math.min(f.h*.67,f.w*(portrait?.68:.36)),floor=f.y+f.h*(portrait?.87:.90),p=actor('pink',f.x+f.w*.35,floor+f.h*.015,h*.82),g=actor('taupe',f.x+f.w*.65,floor,h),cast={pink:p,taupe:g};p.turn=.10;g.turn=-.14;p.lookX=.7;g.lookX=-.7;p.head=.06;g.head=-.06;
   let minimum=2.8,name='shared-presence',phase='quiet',progress=span(0,3,age),contact=false;
   const leaf={visible:at===0?.35:0,held:false,id:'taupe',side:'left',holder:'beige',open:0,x:f.x+f.w*.83,y:floor-f.h*.08,rootX:f.x+f.w*.93,rootY:floor+f.h*.03,size:Math.min(f.w*.27,f.h*.28),angle:-.2};
   const box={visible:0,reveal:0,x:f.x+f.w*.5,y:f.y+f.h*.79,w:Math.min(f.w*.73,f.h*.61,320),h:0,warm:0};box.h=box.w*.60;
   const lens={zoom:1.13,cx:.48,cy:.55,travel:0};let lightGoal=null;
   if(at===0&&b.prologue){p.x=f.x+f.w*.05;g.x=f.x+f.w*1.01;hop(p,t,.4,1.3,f.w*.20,Math.min(20,f.h*.06),'rosa-enters');hop(g,t,3.6,4.6,-f.w*.13,Math.min(12,f.h*.035),'beige-enters');hop(g,t,5.2,6,-f.w*.08,Math.min(10,f.h*.03),'beige-settles');p.turn=.10;g.turn=-.14;const greeting=pulse(6.6,7.3,8.5,9.6,t),reply=pulse(9.6,10.4,11.8,12.6,t);p.head=.06+greeting*.08;g.head=-.06+reply*.10;p.earR=greeting*.2;g.earTip=reply*.14;p.lookX=mix(.7,0,span(6.6,9.6,t));g.lookX=mix(-.7,0,span(9.6,12.6,t));p.arms.right={x:38,y:mix(-72,-101,pulse(12.6,13.2,14.2,15,t))};lens.zoom=1.10;lens.cx=.51;name='the-first-little-step';phase=t<3.2?'rosa-arrives':t<6.6?'beige-follows':t<12.6?'meet-the-guardians':'invitation';}
   if(at===0&&!b.prologue){
    p.x=f.x+f.w*.25;g.x=f.x+f.w*.80;
    hop(p,t,.65,1.55,f.w*.09,Math.min(25,f.h*.062),'catch-and-miss');
    hop(g,t,3.50,4.35,-f.w*.105,Math.min(11,f.h*.030),'arrive-to-help');
    hop(g,t,4.90,5.65,-f.w*.045,Math.min(8,f.h*.022),'catch-with-ear');
    p.head=-.20*pulse(.2,.9,1.8,3.4,t)+.15*span(3.5,5.9,t);g.head=-.08+.18*span(3.4,6.0,t);g.crouch+=.13*pulse(3.4,4.8,5.7,6.4,t);
    g.earL=.34*pulse(3.5,4.7,5.8,7.2,t);g.earTip=-.16*pulse(4,4.8,5.7,7,t);
    p.arms.right={x:46,y:-110-43*pulse(.2,.8,1.7,3.4,t)};g.arms.left={x:-58,y:mix(-72,-139,span(8.7,10.5,t))};p.arms.right.y=mix(p.arms.right.y,-136,span(8.7,10.5,t));
    contact=t>9.5;const viewer=span(11.7,13.6,t);p.turn=mix(.18,0,viewer);p.lookX=mix(.8,0,viewer);p.lookY=mix(-.2,.15,viewer);g.lookX=mix(-.8,.2,viewer);g.head-=.08*viewer;
    leaf.visible=.20*span(12,14.8,t);lens.zoom=1.10+.06*span(3.4,6.4,t);lens.cx=mix(.51,.48,span(8.7,11.7,t));
    const hand=VF.Kinematics.localToWorld(g,g.arms.left,'taupe'),ear=VF.Kinematics.localToWorld(g,{x:-38,y:-265},'taupe'),escape=pulse(.15,.9,2.8,4.1,t);
    const reach=span(3.4,5.1,t),share=span(7.2,10.5,t);lightGoal={x:mix(f.x+f.w*(.38+escape*.20),mix(ear.x,hand.x,share),reach),y:mix(f.y+f.h*(.42-escape*.14),mix(ear.y,hand.y-12,share),reach)};
    name='catch-miss-help-and-invite';phase=t<3.4?'rosa-misses':t<6.4?'beige-catches':t<11.7?'offer-paw':'invite-valerie';
   }
   if(at===1){
    const holder=b.branch?.id||b.decisions?.['leaf-holder']||(b.effects?.canopy==='pink'?'rosa':b.effects?.canopy==='taupe'?'beige':null),active=t>6.2||b.choiceResult,neutral=!holder,id=holder==='rosa'?'pink':'taupe',carrier=cast[id],side=id==='pink'?'right':'left',q=active?span(6.2,7.65,t):0;
    p.x=f.x+f.w*.28;g.x=f.x+f.w*.72;p.head=-.12;g.head=-.08;p.lookY=g.lookY=-.4;
    hop(p,t,.55,1.25,f.w*.065,Math.min(10,f.h*.026),'nose-leaf');hop(p,t,1.55,2.35,-f.w*.065,Math.min(14,f.h*.034),'gentle-recoil');p.head-=.16*pulse(.3,.8,1.2,2.5,t);g.earTip=.12*pulse(1.6,2.4,3.3,4.2,t);
    Object.assign(leaf,{visible:1,held:active,id,side,holder:holder||'both',open:q,size:Math.min(f.w*.64,f.h*.66),x:f.x+f.w*.53,y:floor-f.h*.12,rootX:f.x+f.w*.52,rootY:floor+f.h*.025,angle:mix(-.05,id==='pink'?.33:-.39,q)});
    if(active){carrier.arms[side]={x:mix(id==='pink'?38:-58,id==='pink'?48:-61,q),y:mix(-72,-163,q)};carrier.crouch=.12*q;carrier.earL-=.09*q;carrier.head=mix(id==='pink'?-.12:-.08,-.20,q);leaf.gripBlend=q;
     if(neutral){p.arms.right={x:mix(38,48,q),y:mix(-72,-155,q)};g.arms.left={x:mix(-58,-61,q),y:mix(-72,-155,q)};contact=true;}
     else{const visitor=id==='pink'?g:p,sign=id==='pink'?-1:1;
      hop(visitor,t,8.05,8.95,sign*f.w*.10,Math.min(15,f.h*.038),'first-canopy-hop');hop(visitor,t,9.55,10.40,sign*f.w*.085,Math.min(12,f.h*.030),'second-canopy-hop');hop(visitor,t,11.10,11.90,-sign*f.w*.035,Math.min(9,f.h*.022),'turn-back-to-help');
      visitor.crouch+=.18*pulse(7.4,8.1,10.6,11.5,t);visitor.turn=mix(visitor.turn,sign*.2*(1-span(11.9,13.5,t)),q);visitor.lookX=mix(visitor.lookX,-sign*.8,span(7.65,8.5,t));const helpingSide=id==='pink'?'right':'left',help=span(11.9,13.5,t);visitor.arms[helpingSide]={x:mix(visitor.arms[helpingSide].x,id==='pink'?60:-42,help),y:mix(-72,-131,help)};
     }
    }
    name=id==='pink'?'rosa-roof-beige-crosses':'beige-roof-rosa-crosses';phase=t<3?'try-and-recoil':t<=6.2?'ask-holder':t<7.65?'lift':t<11.9?'cross-under':'return-to-help';lens.zoom=1.14+.045*span(6.2,8,t);lens.cx=.50;lens.cy=.59;
   }
   if(at===2){
    p.x=f.x+f.w*.27;g.x=f.x+f.w*.66;
    hop(g,t,2.75,3.45,-f.w*.035,Math.min(7,f.h*.018),'a-little-afraid');hop(g,t,5.60,6.30,f.w*.035,Math.min(7,f.h*.018),'offer-courage');
    p.head=-.12*pulse(0,.6,2.4,4.7,t);g.head=.10*pulse(2.5,3.3,4.1,4.7,t);p.lookX=t<4.7?.45:.8;g.lookX=-.65;
    p.arms.right={x:47,y:mix(-75,-137,span(5.7,6.7,t))};g.arms.left={x:-61,y:mix(-74,-137,span(5.7,6.7,t))};contact=t>=6.3&&t<7.1;
    hop(p,t,7.20,8.25,f.w*.15,Math.min(37,f.h*.085),'rosa-crosses-first');hop(g,t,9.10,10.30,f.w*.075,Math.min(29,f.h*.068),'beige-crosses-after-landing');
    p.turn=.32*pulse(8.5,9,10.3,11.5,t);p.lookX=.7;g.lookX=-.7;const laugh=pulse(13.9,14.4,15.3,16.7,t);g.earL=.21*laugh;g.earR=-.17*laugh;g.head=-.06*laugh;p.head=.12*laugh;p.earL=.08*laugh;
    name='two-separate-brave-hops';phase=t<6.7?'share-a-little-fear':t<8.25?'rosa-crosses':t<9.1?'beige-waits':t<10.9?'beige-crosses':'relief';lens.zoom=1.08;lens.cx=.52;lens.cy=.59;
   }
   if(at===3){
    p.x=f.x+f.w*.44;g.x=f.x+f.w*.67;
    hop(p,t,.40,1.15,f.w*.075,Math.min(16,f.h*.040),'start-to-leave');hop(p,t,1.95,2.85,-f.w*.12,Math.min(17,f.h*.041),'return-for-beige');
    const back=pulse(1.1,1.6,2.8,3.6,t),sit=span(6.3,8.9,t),lean=span(11.4,13.7,t);p.turn=.40*back;p.lookX=.7*back;p.lookY=mix(0,.7,span(3.6,6.3,t));g.lookX=-.4;g.lookY=.7;g.head=-.12;p.head=.06+.10*back;
    p.sit=mix(.42,.72,sit);g.sit=mix(.42,.68,sit);p.lean=.08*lean;g.lean=-.035*lean;p.earR=.09*span(8.9,11.4,t);g.earTip=.08*Math.sin(t*1.5)*span(3.6,6.3,t);contact=t>12;
    name='return-notice-flower-and-stay';phase=t<3.6?'return':t<8.9?'notice-flower':t<13.7?'lean-together':'shared-silence';lens.zoom=mix(1.12,1.25,span(3.6,11.4,t));lens.cx=.57;lens.cy=.58;
   }
   if(at===4){
    p.s*=.82;g.s*=.82;p.x=f.x+f.w*.27;g.x=f.x+f.w*.74;p.y=p.floor=f.y+f.h*.65;g.y=g.floor=f.y+f.h*.64;p.sit=g.sit=.65;
    box.visible=1;box.reveal=span(.3,2.1,t);box.y=f.y+f.h*.81;box.w=Math.min(f.w*.75,f.h*.64,320);box.h=box.w*.60;box.warm=.5+.5*Math.sin(t*1.8);
    p.head=-.1+.18*span(9.9,12.5,t);g.head=-.08+.13*span(12.5,15.3,t);p.lookY=g.lookY=.7;g.earL=.15*pulse(2.4,3.2,4.2,4.9,t);p.arms.right={x:43,y:-90-30*span(9.9,12.2,t)};g.arms.left={x:-58,y:-94};
    name='closed-box-needs-its-light';phase=t<4.9?'secret-closed':t<9.9?'fading-light':'we-will-help';lens.zoom=1.15;lens.cx=.53;lens.cy=.59;lightGoal={x:box.x,y:box.y-box.h*.21};
   }
   if(at===5){
    p.x=f.x+f.w*.26;g.x=f.x+f.w*.65;
    hop(p,t,.55,1.35,f.w*.12,Math.min(21,f.h*.050),'scout-first');hop(p,t,1.95,2.75,f.w*.07,Math.min(18,f.h*.044),'scout-second');hop(p,t,5.25,6.25,-f.w*.13,Math.min(19,f.h*.047),'return-and-wait');
    hop(g,t,8.75,9.60,f.w*.045,Math.min(11,f.h*.027),'answer-the-invitation');
    hop(p,t,12.85,13.65,f.w*.045,Math.min(17,f.h*.040),'threshold-first');hop(g,t,13.70,14.50,f.w*.045,Math.min(12,f.h*.029),'threshold-companion');hop(p,t,14.55,15.30,f.w*.035,Math.min(13,f.h*.033),'threshold-second');hop(g,t,15.35,16.10,f.w*.030,Math.min(9,f.h*.022),'threshold-together');
    const check=pulse(3.1,3.6,8.1,9,t);p.turn=.42*check+.14*(1-check);p.lookX=.8;p.lookY=.35*check-.2*(1-check);p.head=.10*check;g.turn=.15;g.lookX=.6;g.head=-.12+.1*pulse(8.1,8.5,9.5,10.5,t);g.earTip=.10*pulse(8.1,8.5,9.5,10.5,t);
    const holder=b.decisions?.['leaf-holder']||'beige';Object.assign(leaf,{visible:.95,held:true,id:holder==='rosa'?'pink':'taupe',side:holder==='rosa'?'right':'left',holder,open:1,size:Math.min(f.w*.38,f.h*.40),angle:holder==='rosa'?.32:-.40});cast[leaf.id].arms[leaf.side]={x:leaf.id==='pink'?49:-63,y:-158};
    name='scout-return-wait-and-enter-together';phase=t<3.1?'rosa-ahead':t<5.1?'beige-calls':t<8.1?'rosa-returns':t<12.6?'wait-together':'forest-threshold';lens.zoom=mix(1.09,1.18,span(5.1,16.4,t));lens.cx=mix(.51,.61,span(0,16.4,t));lens.cy=.57;lightGoal={x:f.x+f.w*(.65+.13*span(10.5,16.4,t)),y:f.y+f.h*.37};
   }
   minimum=plan?.duration??minimum;progress=plan?span(plan.start,plan.start+plan.duration,t):progress;
   if(at===2||at===3){const holder=b.decisions?.['leaf-holder']||'beige',id=holder==='rosa'?'pink':'taupe',side=id==='pink'?'right':'left';Object.assign(leaf,{visible:.86,held:true,id,side,holder,open:1,size:Math.min(f.w*.36,f.h*.38),angle:id==='pink'?.28:-.36});cast[id].arms[side]={x:id==='pink'?49:-63,y:-150};}
   // Camera projection belongs to the physical scene, before contacts and IK.
   // Faces, roots, held objects and their shadows share the same lens movement.
   const cameraScale=at===0&&!b.prologue?1+.14*pulse(3.4,4.7,5.4,6.4,t)+.045*span(11.7,14.8,t):at===2?1+.10*span(11.5,16.7,t):at===3?1+.10*span(6.3,13.7,t):at===5?1+.06*span(10.5,16.8,t):1;
   const camera={scale:cameraScale,x:f.x+f.w*(at===0?.57:at===3?.55:.52),y:floor};
   const project=point=>({x:camera.x+(point.x-camera.x)*camera.scale,y:camera.y+(point.y-camera.y)*camera.scale});
   for(const a of Object.values(cast)){const pos=project(a),ground=project({x:a.x,y:a.floor});a.x=pos.x;a.y=pos.y;a.floor=ground.y;a.s*=camera.scale;}
   for(const prop of [leaf,box]){const pos=project(prop);prop.x=pos.x;prop.y=pos.y;for(const key of ['w','h','size'])if(finite(prop[key]))prop[key]*=camera.scale;}
   const root=project({x:leaf.rootX,y:leaf.rootY});leaf.rootX=root.x;leaf.rootY=root.y;if(lightGoal)lightGoal=project(lightGoal);lens.zoom*=camera.scale;
   const exit=o.exitFrame,exitQ=exit?clamp(exit.progress||0):0;
   if(exit&&exitQ>0){const sign=exit.direction==='left'?-1:1;for(const [id,a]of Object.entries(cast)){const t=clamp((exitQ-(id==='taupe'?.1:0))/(id==='taupe'?.9:1)),air=t>.23&&t<.83?Math.sin((t-.23)/.60*Math.PI):0;a.x+=sign*f.w*.028*ease(t);a.y-=air*Math.min(6,f.h*.014);a.airborne=Math.max(a.airborne,air>.001?1:0);a.crouch+=.13*pulse(0,.13,.23,.3,t)+.10*pulse(.83,.88,.94,1,t);a.turn=mix(a.turn,sign*.18,ease(t));a.earTip-=air*.09;if(air>.001)a.jumpPhase='flight';}lens.cx+=sign*exitQ*.012;}
   let scene={actors:cast,world:'vineyard',chapter:shot.mode,biome:0,cameraX:lens.cx,cameraY:0,distance:at+progress,flower:0,flowerPoint:{x:0,y:0},beat:b.id||shot.mode,guardian:b,light:{x:f.x+f.w*.52,y:f.y+f.h*.45,strength:.85},leaf,box,contact,lens,performance:{name,phase,progress,scoreTime:t,plan:b.actionPlan||null,companionResponds:true},actionReady:o.reduced||rawAge>=minimum&&!Object.values(cast).some(a=>a.airborne),actionProgress:progress,cameraProjection:camera,cinemaCamera:{projection:{...camera},kind:at===4?'secret-detail':at===5?'tracking-to-forest':at===2?'crossing-wide':at===3?'intimate-pair':'shared-path',progress,lens:{...lens}},exitIntent:{kind:at===5?'leaf-door':at===3||at===4?'leaf-detail':'tracking',direction:'right',destination:at===5?'forest':'vineyard'}};
   const source=o.entryPose||this.entry,entry=source?ease(clamp(o.entryProgress??1)):1;this.blendEntry(scene,source,entry,view);
   for(const [id,a]of Object.entries(cast)){const bounds=VF.rigBounds[id],margin=5;if(!b.prologue||t>=6.6)a.x=clamp(a.x,f.x-bounds.x*a.s+margin,f.x+f.w-(bounds.x+bounds.w)*a.s-margin);const low=f.y-bounds.y*a.s+margin,high=f.y+f.h-(bounds.y+bounds.h)*a.s-margin;if(a.y<low){const d=low-a.y;a.y+=d;a.floor+=d;}if(a.y>high){const d=a.y-high;a.y-=d;a.floor-=d;}a.gaitWeight=0;a.stride=0;const blink=(time+(id==='pink'?1.2:3.4))%6.3;a.blink=o.reduced?0:blink<.14?Math.sin(blink/.14*Math.PI):0;if(!o.reduced)a.head+=Math.sin(time*.68+(id==='pink'?0:1))*.008;delete a.handsWorld;}
   if(contact){const shared=VF.Kinematics.shared(p,g);if(shared.reachable){p.handsWorld={right:shared};g.handsWorld={left:shared};scene.sharedContact={...shared};}}
   // Entry contacts travel with the same root interpolation, rather than popping
   // onto the new grip after the camera has already moved.
   if(source?.actors&&entry<1){const from=source.frame||source.view?.frame||f;for(const [id,a]of Object.entries(cast))for(const side of ['left','right']){const old=source.actors[id]?.handsWorld?.[side];if(!old)continue;const before=mapPoint(old,from,f),goal=a.handsWorld?.[side]||VF.Kinematics.localToWorld(a,a.arms[side],id);a.handsWorld={...(a.handsWorld||{}),[side]:{x:mix(before.x,goal.x,entry),y:mix(before.y,goal.y,entry)}};}}
   if(scene.leaf.held&&scene.leaf.visible>.01){const id=scene.leaf.id,carrier=cast[id],side=scene.leaf.side,local=carrier.arms[side],point=carrier.handsWorld?.[side]||VF.Kinematics.localToWorld(carrier,local,id);carrier.handsWorld={...(carrier.handsWorld||{}),[side]:point};const grip=scene.leaf.gripBlend??1;scene.leaf.x=mix(scene.leaf.x,point.x,grip);scene.leaf.y=mix(scene.leaf.y,point.y,grip);scene.leaf.attachment={id,side,ready:grip>=.999,target:{...point}};}
   if(!lightGoal){const shared=scene.sharedContact,carrier=scene.leaf.held?scene.leaf.attachment?.target:null;if(shared)lightGoal={x:shared.x,y:shared.y-12};else if(carrier)lightGoal={x:carrier.x-8,y:carrier.y-14};else{const hand=VF.Kinematics.localToWorld(p,p.arms.right,'pink'),escape=at===0&&b.id==='loose-light'?pulse(.35,1,1.65,3,age):0;lightGoal={x:hand.x+escape*42,y:hand.y-12-escape*35};}}
   const authoredLight=this.drag||{x:clamp((lightGoal.x-f.x)/f.w,.03,.97),y:clamp((lightGoal.y-f.y)/f.h,.03,.96)},sourceLight=source?.light&&entry<1?mapPoint(source.light,source.frame||source.view?.frame||f,f):null;
   // The light crosses the same transfer boundary as the cast. Seed its spring
   // from the outgoing normalized point before integrating the incoming target.
   const target=sourceLight?{x:mix((sourceLight.x-f.x)/f.w,authoredLight.x,entry),y:mix((sourceLight.y-f.y)/f.h,authoredLight.y,entry)}:authoredLight,dt=Math.min(.08,Math.max(0,o.dt||0)),snap=this.seekPending||o.reduced||(o.paused&&!!this.drag);
   if(snap){this.light.x=target.x;this.light.y=target.y;this.light.vx=this.light.vy=0;}else{for(const axis of ['x','y']){const vel='v'+axis;this.light[vel]+=(target[axis]-this.light[axis])*19*dt-this.light[vel]*6.5*dt;this.light[axis]=clamp(this.light[axis]+this.light[vel]*dt,.03,.97);}}
   const lightStrength=(at===4?mix(.70,.28,span(2.4,9.9,t))+.14*span(9.9,15.3,t):.86)+(o.reduced?0:Math.sin(time*1.5)*.06);this.light.strength=sourceLight?mix(source.light.strength??lightStrength,lightStrength,entry):lightStrength;scene.light={x:f.x+this.light.x*f.w,y:f.y+this.light.y*f.h,strength:this.light.strength};if(this.drag)for(const a of Object.values(cast)){a.lookX=clamp((scene.light.x-a.x)/95,-1,1);a.lookY=clamp((scene.light.y-(a.y-190*a.s))/90,-1,1);}
   this.animator.resolve(scene,time,view,{dt,reduced:!!o.reduced,paused:!!o.paused,seek:this.seekPending});this.seekPending=false;this.last=scene;this.stats.performance={...scene.performance};this.stats.actionReady=scene.actionReady;this.stats.cinemaCamera=scene.cinemaCamera;return scene;
  }
  background(p,s,t,v,profile,reduced){
   const img=VF.Art.image('clearing'),projection=VF.Matte.cover(img.width,img.height,v,s.lens),f=v.frame;p.fillStyle='#18302d';p.fillRect(0,0,v.w,v.h);p.drawImage(img,projection.x,projection.y,projection.w,projection.h);this.stats.matte=projection;this.stats.lens={...s.lens};this.stats.draws++;this.interactionTargets=[];delete this.stats.questProp;
   const foliage=VF.Art.rects.foliage,framing=Math.min(v.w*.76,v.h*.64),shift=(s.lens.cx-.5)*v.w*.23+(reduced?0:Math.sin(t*.36)*2.4);p.save();p.globalAlpha=.94;VF.Art.draw(p,'foliage',foliage.left,-framing*.72-shift,-framing*.20,framing,framing*1.13);VF.Art.draw(p,'foliage',foliage.right,v.w-framing*.25-shift,-framing*.17,framing,framing*1.13);p.restore();
   const bankW=Math.min(f.w*.98,f.h*1.1),bankY=f.y+f.h*.94;p.save();p.globalAlpha=.70;VF.Art.draw(p,'foliage',foliage.fern,f.x+f.w*.5-bankW*.55,bankY-bankW*.22,bankW,bankW*.35);p.restore();
   if(['leaf','crossing'].includes(s.chapter))this.creek(p,s,t,v,reduced);if(s.chapter==='crossing'){const y=f.y+f.h*.91;for(let j=0;j<5;j++){p.strokeStyle=j%2?'#e6d7b547':'#91aca04a';p.lineWidth=.8;p.beginPath();p.ellipse(f.x+f.w*.49,y+j*3,f.w*(.05+j*.022),2+j*.6,0,0,TAU);p.stroke();}}
   if(s.chapter==='tender'){const c=s.cameraProjection||{x:0,y:0,scale:1},x=c.x+(f.x+f.w*.57-c.x)*c.scale,y=c.y+(f.y+f.h*.91-c.y)*c.scale,detail=span(1,4,s.performance.scoreTime),size=Math.min(26,f.w*.085)*(1+.15*detail),sway=reduced?0:Math.sin(t*1.1)*4;p.save();p.strokeStyle='#a3bc84';p.lineWidth=2.5;p.beginPath();p.moveTo(x,y);p.bezierCurveTo(x+size*.8,y-size,x-size*.4,y-size*1.4,x+sway,y-size*2);p.stroke();p.fillStyle='#739c72';p.beginPath();p.ellipse(x+size*.32,y-size*.8,size*.48,size*.16,-.6,0,TAU);p.fill();for(let k=0;k<6;k++){const a=k*TAU/6;p.fillStyle=k%2?'#e7bfc3':'#f6ddd1';p.beginPath();p.ellipse(x+sway+Math.cos(a)*size*.37,y-size*2+Math.sin(a)*size*.29,size*.34,size*.23,a,0,TAU);p.fill();}p.fillStyle='#e9cf8c';p.beginPath();p.arc(x+sway,y-size*2,size*.18,0,TAU);p.fill();p.restore();this.stats.storyFlower={x:x+sway,y:y-size*2,w:size*1.5,h:size*2.8,visible:true,beforeMention:s.performance.scoreTime<3.6};}this.canopy(p,s.leaf,v,t,reduced);if(s.leaf.visible>.35)this.interactionTargets.push({kind:'leaf',x:s.leaf.x,y:s.leaf.y-s.leaf.size*.42,r:Math.max(28,s.leaf.size*.22)});if(s.box.visible>.01)this.stats.questProp={x:s.box.x-s.box.w*.52,y:s.box.y-s.box.h*.55,w:s.box.w*1.04,h:s.box.h*1.1};
   const shade=p.createLinearGradient(0,f.y+f.h*.78,0,v.h);shade.addColorStop(0,'#10282d00');shade.addColorStop(1,'#10282db5');p.fillStyle=shade;p.fillRect(0,f.y+f.h*.78,v.w,v.h-f.y-f.h*.78);
  }
  creek(p,s,t,v,reduced){const f=v.frame,y=f.y+f.h*.86,h=Math.max(30,f.h*.13),x=f.x+f.w*.07,w=f.w*.86;p.save();p.beginPath();p.moveTo(x,y);p.bezierCurveTo(x+w*.3,y-14,x+w*.55,y+8,x+w,y-3);p.lineTo(x+w,y+h);p.bezierCurveTo(x+w*.6,y+h+8,x+w*.3,y+h-10,x,y+h+4);p.closePath();p.clip();const water=p.createLinearGradient(0,y,0,y+h);water.addColorStop(0,'#102f36');water.addColorStop(.45,'#426966');water.addColorStop(1,'#152f35');p.fillStyle=water;p.fillRect(x,y-20,w,h+40);p.strokeStyle='#c9dfc84a';p.lineWidth=1;for(let j=0;j<9;j++){const shift=reduced?0:(t*12+j*37)%w;p.beginPath();p.moveTo(x+shift-w*.1,y+4+j*h/10);p.quadraticCurveTo(x+shift,y+j*h/10,x+shift+w*.14,y+4+j*h/10);p.stroke();}for(const a of Object.values(s.actors)){const q=a.performance?.progress;if(a.jumpPhase==='settle'&&q>=.99){p.strokeStyle='#f1e3bd88';p.beginPath();p.ellipse(a.x,a.floor+12*a.s,18+Math.sin(t*5)*3,3,0,0,TAU);p.stroke();}}p.restore();p.strokeStyle='#9baf80';p.lineWidth=4;p.beginPath();p.moveTo(x,y);p.bezierCurveTo(x+w*.3,y-14,x+w*.55,y+8,x+w,y-3);p.stroke();p.strokeStyle='#526e50';p.lineWidth=7;p.beginPath();p.moveTo(x,y+h);p.bezierCurveTo(x+w*.3,y+h-7,x+w*.6,y+h+10,x+w,y+h);p.stroke();this.stats.creek={x,y,w,h,banks:2,flow:!reduced};}
  canopy(p,l,v,time,reduced){if(l.visible<.001)return;const size=l.size;p.save();p.globalAlpha=l.visible;p.strokeStyle='#344c2a';p.lineWidth=4;p.beginPath();p.moveTo(l.rootX,l.rootY);p.bezierCurveTo(l.rootX-size*.10,l.rootY-size*.18,l.x+size*.12,l.y+size*.13,l.x,l.y);p.stroke();p.strokeStyle='#c5bd83';p.lineWidth=1;p.stroke();p.translate(l.x,l.y);p.rotate(l.angle+(reduced?0:Math.sin(time*.5)*.006));const r=VF.Art.rects.foliage.leaf,from=l.holder==='rosa'?-.12:-.86;p.shadowColor='#0b251c66';p.shadowBlur=5;p.shadowOffsetY=3;const img=VF.Art.image('foliage');for(let j=0;j<6;j++){const q=j/6,flex=reduced?0:Math.sin(time*.6+j*.3)*.009;p.save();p.rotate(flex);p.drawImage(img,r[0],r[1]+r[3]*q,r[2],Math.min(r[3]*(1-q),r[3]/6+1),size*from,-size*.96+size*1.05*q,size,size*1.05/6+1);p.restore();}p.shadowColor='transparent';p.restore();}
  shadow(p,a){const ground=a.groundY??a.floor+18*a.s,lift=Math.max(0,a.floor-a.y),r=(a.id==='pink'?58:84)*a.s+lift*.10;p.save();p.translate(a.x,ground);p.scale(1,.18);const g=p.createRadialGradient(0,0,1,0,0,r);g.addColorStop(0,`rgba(8,24,22,${.5/(1+lift*.03)})`);g.addColorStop(.45,'#091f1b4a');g.addColorStop(1,'#091f1b00');p.fillStyle=g;p.fillRect(-r,-r,r*2,r*2);p.restore();for(const foot of Object.values(a.feetWorld||{})){if(!foot.contact)continue;const rr=Math.max(7,a.s*24);p.save();p.translate(foot.x,ground);p.scale(1,.14);const q=p.createRadialGradient(0,0,0,0,0,rr);q.addColorStop(0,'#081b18b3');q.addColorStop(1,'#081b1800');p.fillStyle=q;p.fillRect(-rr,-rr,rr*2,rr*2);p.restore();}}
  afterActors(p,s,t,v){if(s.chapter==='crossing'){const f=v.frame,y=f.y+f.h*.95,height=Math.min(190,f.h*.55),d=v.dpr||1;p.save();p.beginPath();p.rect(f.x,y,f.w,Math.min(25,f.h*.07));p.clip();p.globalAlpha=.13;p.translate(0,y*1.13);p.scale(1,-.13);p.drawImage(p.canvas,f.x*d,(y-height)*d,f.w*d,height*d,f.x,y-height,f.w,height);p.restore();}const box=s.box;if(box.visible>.001){p.save();p.globalAlpha=box.visible;const aperture=Math.max(.001,box.reveal)*box.w*.62;p.beginPath();p.ellipse(box.x,box.y,aperture,box.h*.75,0,0,TAU);p.clip();VF.Art.draw(p,'gift',VF.Art.rects.gift.closed,box.x-box.w*.5,box.y-box.h*.5,box.w,box.h);p.restore();for(const side of [-1,1]){p.save();p.translate(box.x+side*box.w*(.13+.58*box.reveal),box.y+box.h*.45);p.rotate(side*(.22+.64*box.reveal));VF.Art.draw(p,'foliage',VF.Art.rects.foliage.leaf,-box.w*.38,-box.w*.65,box.w*.58,box.w*.78);p.restore();}this.stats.gift={x:box.x,y:box.y,w:box.w,h:box.h,reveal:box.reveal,originalReference:true};}
   const a=s.leaf.attachment;if(a&&s.renderedActors){const hand=s.renderedActors.find(p=>p.id===a.id)?.hands?.[a.side];this.stats.canopyAttachment=hand?Math.hypot(hand.x-s.leaf.x,hand.y-s.leaf.y):null;}else this.stats.canopyAttachment=null;
  }
  foreground(p,s,t,v,profile,reduced){const f=v.frame,size=Math.min(v.w*.60,v.h*.34),shift=(s.lens.cx-.5)*v.w*.09;p.save();p.globalAlpha=.91;VF.Art.draw(p,'foliage',VF.Art.rects.foliage.fern,-size*.58-shift,f.y+f.h-size*.10,size,size*.48);VF.Art.draw(p,'foliage',VF.Art.rects.foliage.fern,v.w-size*.40-shift,f.y+f.h-size*.07,size,size*.46);p.restore();glow(p,s.light.x,s.light.y,30,s.light.strength);
   if(v.kind!=='portrait'){const side=p.createLinearGradient(0,0,v.w*.43,0);side.addColorStop(0,'#10282de8');side.addColorStop(1,'#10282d00');p.fillStyle=side;p.fillRect(0,0,v.w*.43,v.h);}const head=p.createLinearGradient(0,0,0,76);head.addColorStop(0,'#10282d80');head.addColorStop(1,'#10282d00');p.fillStyle=head;p.fillRect(0,0,v.w,76);
  }
  flower(){}mushroom(){}
 }
 VF.VineyardScene=VineyardScene;
})();
