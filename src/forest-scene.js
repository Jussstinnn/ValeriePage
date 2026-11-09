/* F23. An independent painted stage: physical creek crossing / living root doorway.
   The canonical action is read-only here. All roots and contact goals are authored
   before RigAnimator resolves the original plush anatomies. No DOM, timers or input. */
(() => {
 'use strict';
 const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,Number.isFinite(n)?n:0)),mix=(a,b,q)=>a+(b-a)*q,ease=q=>{q=clamp(q);return q*q*(3-2*q);},TAU=Math.PI*2;
 const copy=o=>JSON.parse(JSON.stringify(o)),PHASES=['discover','shape','cross','rest'];
 const fallback={treeGate:{file:'assets/forest-living/tree-gate-atlas-v1.png',width:1536,height:1024,crops:{left:[0,0,768,1024],right:[768,0,768,1024]}},clearing:{file:'assets/forest-living/firefly-clearing-v1.png',width:1024,height:1536}};
 const images=new Map(),pending=new Map();let softPlate=null;
 const ForestAssets={
  descriptor(key){return window.VF_FOREST_ASSETS?.assets?.[key]||fallback[key];},
  async load(key){if(images.has(key))return images.get(key);if(pending.has(key))return pending.get(key);const item=this.descriptor(key);if(!item)throw new Error('Pieza del bosque desconocida: '+key);const task=(async()=>{const img=new Image();img.decoding='async';try{img.src=await VF.ResourceCache.url(item.file);await img.decode();if(!img.naturalWidth)throw new Error('Ilustración del bosque vacía.');images.set(key,img);return img;}catch(error){VF.ResourceCache.drop(item.file);throw error;}})();pending.set(key,task);try{return await task;}finally{pending.delete(key);}},
  prepare(){return Promise.all(['treeGate','clearing'].map(key=>this.load(key)));},
  release(){images.clear();softPlate=null;},
  plate(){if(softPlate)return softPlate;const img=this.image('clearing'),c=document.createElement('canvas');c.width=img.width;c.height=img.height;const p=c.getContext('2d');p.drawImage(img,0,0);p.globalCompositeOperation='destination-in';let mask=p.createLinearGradient(0,0,0,c.height);mask.addColorStop(0,'#0000');mask.addColorStop(.045,'#000');mask.addColorStop(.82,'#000');mask.addColorStop(1,'#0000');p.fillStyle=mask;p.fillRect(0,0,c.width,c.height);mask=p.createLinearGradient(0,0,c.width,0);mask.addColorStop(0,'#0000');mask.addColorStop(.09,'#000');mask.addColorStop(.91,'#000');mask.addColorStop(1,'#0000');p.fillStyle=mask;p.fillRect(0,0,c.width,c.height);softPlate=c;return c;},
  image(key){const value=images.get(key);if(!value)throw new Error('El bosque aún no está preparado: '+key);return value;},
  stats(){return{images:images.size,pending:pending.size,decodedBytes:[...images.values()].reduce((n,img)=>n+img.naturalWidth*img.naturalHeight*4,0)+(softPlate?softPlate.width*softPlate.height*4:0)};}
 };
 function ellipse(p,x,y,rx,ry,fill){p.beginPath();p.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,TAU);p.fillStyle=fill;p.fill();}
 function glow(p,x,y,r,alpha=1){if(r<1||alpha<.001)return;const g=p.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(255,247,207,'+(.8*alpha)+')');g.addColorStop(.12,'rgba(255,225,143,'+(.48*alpha)+')');g.addColorStop(.48,'rgba(232,184,96,'+(.12*alpha)+')');g.addColorStop(1,'rgba(232,184,96,0)');p.fillStyle=g;p.fillRect(x-r,y-r,r*2,r*2);}
 function leafPath(p,size,width=.42){p.beginPath();p.moveTo(0,0);p.bezierCurveTo(-size*width,-size*.12,-size*width,-size*.69,0,-size);p.bezierCurveTo(size*width,-size*.67,size*width,-size*.18,0,0);p.closePath();}
 function growingCurve(p,points,progress,width,ink){const q=clamp(progress);if(q<.001)return;p.beginPath();const count=30;for(let j=0;j<=count;j++){const t=j/count*q,u=1-t,x=u*u*u*points[0][0]+3*u*u*t*points[1][0]+3*u*t*t*points[2][0]+t*t*t*points[3][0],y=u*u*u*points[0][1]+3*u*u*t*points[1][1]+3*u*t*t*points[2][1]+t*t*t*points[3][1];j?p.lineTo(x,y):p.moveTo(x,y);}p.lineWidth=width;p.strokeStyle=ink;p.lineCap='round';p.stroke();}
 class ForestScene {
  constructor(rig=null){this.rig=rig;this.animator=new VF.RigAnimator();this.events=[];this.light={x:.7,y:.28,vx:0,vy:0,strength:1};this.last=null;this.transition=null;this.seekPending=true;this.narrativeFrame=null;this.actionFrame=null;this.drag=null;this.interactionTargets=[];this.flowerPoint=null;this.stats={draws:0,route:'neutral',phase:'discover',stage:'independent-forest',ready:false};}
  async prepare(){await ForestAssets.prepare();this.stats.ready=true;return this;}
  prepareShot(){return this.prepare();}
  enter(saved){this.branchOrigin=null;this.branchTransition=false;this.branchAge=0;this.animator.reset();if(saved)this.animator.restore(saved);this.seekPending=true;this.transition=null;this.display=null;this.lightMotion=null;}
  captureMotion(){return this.animator.capture();}
  cancelBranch(){this.branchOrigin=null;this.branchTransition=false;this.branchAge=0;}
  leave(){this.cancelBranch();this.animator.reset();this.transition=null;this.display=null;this.lightMotion=null;this.events=[];}
  beginBranch(scene){this.branchOrigin=scene?copy(scene):null;this.branchAge=0;this.branchTransition=!!scene;}
  reset(){this.branchOrigin=null;this.branchTransition=false;this.animator.reset();this.events=[];this.last=null;this.light={x:.7,y:.28,vx:0,vy:0,strength:1};this.drag=null;this.seekPending=true;this.transition=null;this.display=null;this.lightMotion=null;}
  seek(){this.seekPending=true;}
  begin(){this.seekPending=true;this.transition=null;}
  act(name,id,time){return this.animator.play(id==='beige'?'taupe':id,name,time);}
  event(kind,time,point){this.events.push({kind,at:time,point:point||null});if(this.events.length>6)this.events.shift();if(kind==='pink'||kind==='both')this.act('asombro','pink',time);if(kind==='taupe'||kind==='both')this.act('escucha','taupe',time);}
  grab(x,y){this.drag={x:clamp(x,.04,.96),y:clamp(y,.04,.94)};}
  release(){this.drag=null;}
  releaseForShot(){this.drag=null;}
  state(){return{branch:{active:!!this.branchTransition,age:this.branchAge||0},light:{...this.light},events:copy(this.events),beat:this.last?.beat,actors:this.last?.actors||null,forest:this.last?.forest?{route:this.last.forest.route,phase:this.last.forest.phase,progress:this.last.forest.progress}:null,animation:this.animator.state()};}
  readAction(options){const source=options.action||this.actionFrame||this.action||{},phase=PHASES.includes(source.phase)?source.phase:'discover',at=PHASES.indexOf(phase);return{...source,route:['tree','firefly','neutral'].includes(source.route)?source.route:'neutral',phase,phaseAge:clamp(source.phaseAge,0,120),progress:{discover:at>0?1:clamp(source.progress?.discover),shape:at>1?1:clamp(source.progress?.shape)},light:{x:clamp(source.light?.x??.7,.04,.96),y:clamp(source.light?.y??.28,.04,.94)},map:{x:clamp(source.map?.x??.5,.04,.96),y:clamp(source.map?.y??.54,.04,.94)},trace:source.trace||[]};}
  geometry(view,a,reduced){
   const f=view.frame,portrait=view.kind==='portrait',tree=a.route==='tree',phase=PHASES.indexOf(a.phase),discover=ease(a.progress.discover),shape=ease(a.progress.shape),cross=phase>=3?1:phase===2?ease(clamp((a.phaseAge-.85)/2.55)):0;
   // Anchor the actual creek, not an arbitrary screen line. Keep its near bank in
   // the usable frame even when phone controls consume a large part of the screen.
   const image=ForestAssets.image('clearing'),nearY=f.y+f.h*(portrait?.89:.93),zoom=1+cross*.095,scale=Math.max(Math.min(view.w/image.width,view.h/image.height),f.h*1.36/image.height)*zoom;
   const w=image.width*scale,h=image.height*scale,x=f.x+f.w*.53-w*.5,y=nearY-h*.79,projection={x,y,w,h,scale,covers:true,nativeField:true};
   const near={x:f.x+f.w*.36,y:y+h*.79},far={x:f.x+f.w*.67,y:y+h*.61},water={x:x,y:y+h*.626,w,h:h*.145};
   const gateOpen=clamp(discover*.23+shape*.77),gateH=Math.max(f.h*1.18,Math.min(view.h*1.04,f.w*(portrait?1.75:1.0))),gateW=gateH*.75,gateBottom=f.y+f.h*.96;
   const gate={h:gateH,w:gateW,bottom:gateBottom,open:gateOpen,left:f.x+f.w*.5-gateW*.80-gateOpen*f.w*.37,right:f.x+f.w*.5-gateW*.20+gateOpen*f.w*.37,knot:{x:f.x+f.w*.80+gateOpen*f.w*.07,y:f.y+f.h*.81}};
   // The map occupies the upper middle of the composition. The two faces stay in
   // a separate lower band; dragging changes the unfurl, never covers their eyes.
   const map={x:f.x+f.w*.50+clamp((a.map.x-.5)*f.w*.16,-f.w*.07,f.w*.07),y:f.y+f.h*(portrait?mix(.31,.13,cross):.29),w:Math.min(f.w*(portrait?.73:.48),f.h*1.0)*mix(1,.82,cross),h:f.h*(portrait?.25:.30)*mix(1,.82,cross),open:shape};
   return{route:a.route,phase:a.phase,phaseAge:a.phaseAge,progress:{...a.progress},discover,shape,cross,portrait,tree,projection,near,far,water,gate,map,trace:a.trace,interacting:!!a.interacting,gesture:a.gesture,light:{x:f.x+a.light.x*f.w,y:f.y+a.light.y*f.h},normalizedLight:{...a.light},reduced,frame:{...f}};
  }
  pose(shot,time,view,options={}){
   const action=this.readAction(options),dt=clamp(options.dt||0,0,.08),snap=options.reduced||options.paused&&action.revision!==this.lastActionRevision;this.lastActionRevision=action.revision;if(!this.display||this.display.route!==action.route||this.seekPending)this.display={route:action.route,...action.progress,reveal:action.phase==='discover'?0:1};
   for(const key of ['discover','shape']){const target=action.progress[key],current=this.display[key];this.display[key]=snap?target:Math.abs(target-current)<.001?target:current+clamp(target-current,-dt*1.1,dt*1.1);}
   const revealTarget=action.phase==='discover'?0:1;this.display.reveal=snap?revealTarget:this.display.reveal+clamp(revealTarget-this.display.reveal,-dt*1.25,dt*1.25);
   if(!this.lightMotion||snap||this.seekPending)this.lightMotion={...action.light,vx:0,vy:0};else if(dt){const m=this.lightMotion,target=action.light;const drift=action.interacting?.004:.012,tx=target.x+Math.sin(time*.81)*drift,ty=target.y+Math.sin(time*.63+.8)*drift;for(const axis of ['x','y']){const vel='v'+axis;m[vel]+=( (axis==='x'?tx:ty)-m[axis])*17*dt-m[vel]*6.0*dt;m[axis]=clamp(m[axis]+m[vel]*dt,.04,.94);}}
   const g=this.geometry(view,{...action,progress:{discover:this.display.discover,shape:this.display.shape},light:this.lightMotion},options.reduced),f=view.frame,portrait=g.portrait,tree=g.tree,phase=PHASES.indexOf(g.phase),age=g.phaseAge;
   const make=(id,x,y,height)=>({id,x,y,floor:y,s:height/VF.rigBounds[id].h,head:0,lean:0,turn:0,stride:0,crouch:0,earL:0,earR:0,earTip:0,lookX:0,lookY:0,blink:0,sit:.45,gaitWeight:0,airborne:0,opacity:1,depth:y,arms:{left:{x:id==='pink'?-38:-58,y:id==='pink'?-58:-54},right:{x:id==='pink'?38:58,y:id==='pink'?-58:-54}}});
   const beigeH=Math.min(f.h*(tree?.52:.48),f.w*(portrait?.59:.35)),pinkH=beigeH*.82,ground=Math.min(g.near.y,f.y+f.h*.89);
   const p=make('pink',f.x+f.w*(tree?.31:.30),ground,pinkH),b=make('taupe',f.x+f.w*(tree?.68:.70),ground,beigeH);
   if(!tree){const reveal=ease(this.display.reveal);p.x=mix(p.x,f.x+f.w*.16,reveal);b.x=mix(b.x,f.x+f.w*.87,reveal);p.s*=mix(1,.68,reveal);b.s*=mix(1,.68,reveal);}
   p.turn=.10;b.turn=-.12;p.head=.075;b.head=-.065;p.lookX=.6;b.lookX=-.6;
   if(tree){
    const listen=(1-g.shape)*(g.phase==='discover'?mix(.40,1,g.discover):1);b.earR=-.32*listen;b.earTip=-.09*listen;b.head=.12*listen;b.turn=.21*listen;b.lean=.025*listen;b.arms.right={x:64,y:-99-listen*13};p.lookY=-.6;p.head=-.07;p.earR=.16*g.discover;if(phase===0){b.lookX=.8;b.lookY=.25;p.lookX=.9;}
    if(phase>=1){p.arms.right={x:40,y:mix(-65,-138,g.shape)};b.arms.left={x:-54,y:mix(-70,-131,g.shape)};p.head=-.09;b.head=-.13;p.earL=-.08*g.shape;b.earTip=.09*g.shape;}
    if(phase>=2){const q=g.cross;p.x=mix(p.x,f.x+f.w*.40,q);b.x=mix(b.x,f.x+f.w*.64,q);p.y=mix(ground,g.far.y-18*p.s*.90,q);b.y=mix(ground,g.far.y-18*b.s*.90,q);p.floor=p.y;b.floor=b.y;p.s*=mix(1,.90,q);b.s*=mix(1,.90,q);p.head=mix(-.1,.10,q);b.head=mix(-.13,-.06,q);p.lookY=b.lookY=mix(-.5,0,q);p.arms.right={x:43,y:-76};b.arms.left={x:-65,y:-78};}
   }else{
    // Anticipation, assistance, take-off and soft landing are a single body-space
    // performance. Neither character alternates human arms or planted flight feet.
    const gaze=g.light;p.lookX=clamp((gaze.x-p.x)/100,-1,1);p.lookY=clamp((gaze.y-(p.y-210*p.s))/100,-1,1);b.lookX=clamp((gaze.x-b.x)/100,-1,1);b.lookY=clamp((gaze.y-(b.y-180*b.s))/100,-1,1);
    const liftLeaf=phase===0?g.discover:1;p.head=-.13*liftLeaf;p.earL=-.13*liftLeaf;p.earR=.19*liftLeaf;b.head=.10*liftLeaf;b.arms.left={x:-59,y:-70-liftLeaf*47};b.earL=.16*liftLeaf;
    if(phase===1){p.arms.right={x:46,y:-102-g.shape*22};b.arms.left={x:-64,y:-93-g.shape*18};p.crouch=.12*(1-g.shape);b.crouch=.08*(1-g.shape);}
    if(phase>=2){
     for(const [actor,delay,side]of [[p,0,-1],[b,.30,1]]){
      const q=phase>=3?1:clamp((age-.85-delay)/(2.55-delay)),travel=ease(q),feetStart=ground,feetEnd=g.far.y-18*actor.s*1.20,destination=g.far.x+f.w*(side<0?-.16:.09),hopPhase=clamp(q*2.1-.08),local=(hopPhase*2)%1,flight=q>.04&&q<.91?Math.sin(local*Math.PI):0;
      actor.x=mix(actor.x,destination,travel);actor.floor=mix(feetStart,feetEnd,travel);actor.y=actor.floor-flight*Math.min(f.h*.055,f.w*.065);actor.s*=mix(1,1.20,travel);actor.airborne=flight>.025?1:0;actor.jumpPhase=actor.airborne?'flight':q<.08?'anticipation':q>.90?'settle':'grounded';actor.crouch=q<.08?Math.sin(q/.08*Math.PI)*.24:q>.90?Math.sin((q-.90)/.10*Math.PI)*.15:0;actor.earL=-flight*.18;actor.earR=flight*.14;actor.earTip=-flight*.12;actor.lean=flight*.025;actor.head=-flight*.07;actor.lookY=-.2;actor.lookX=side<0?.6:-.65;actor.arms.left={x:side<0?-37:-60,y:-64-flight*5};actor.arms.right={x:side<0?39:58,y:-64-flight*5};
     }
    }
   }
   const still=options.reduced||options.paused;
   for(const actor of [p,b]){
    const bounds=VF.rigBounds[actor.id],margin=5;actor.x=clamp(actor.x,f.x-bounds.x*actor.s+margin,f.x+f.w-(bounds.x+bounds.w)*actor.s-margin);const minY=f.y-bounds.y*actor.s+margin,maxY=f.y+f.h-(bounds.y+bounds.h)*actor.s-margin;if(actor.y<minY){const adjust=minY-actor.y;actor.y+=adjust;actor.floor+=adjust;}if(actor.y>maxY){const adjust=actor.y-maxY;actor.y-=adjust;actor.floor-=adjust;}
    actor.depth=actor.floor;const blink=(time+(actor.id==='pink'?1.2:3.4))%6.3;actor.blink=still?0:blink<.14?Math.sin(blink/.14*Math.PI):0;actor.head+=still?0:Math.sin(time*.68+(actor.id==='pink'?0:1))*.009;
   }
   if(tree&&phase===0){g.gate.knot=VF.Kinematics.localToWorld(b,{x:94,y:-74},'taupe');b.handsWorld={right:{...g.gate.knot}};}
   if(phase>=2&&g.cross>.92){p.sit=b.sit=.64;const hands=VF.Kinematics.shared(p,b);if(hands.reachable){p.handsWorld={right:hands};b.handsWorld={left:hands};}}
   const light=tree?{x:g.gate.knot.x,y:g.gate.knot.y,strength:.7+g.discover*.4}:{x:g.light.x,y:g.light.y,strength:1};this.light.x=(light.x-f.x)/f.w;this.light.y=(light.y-f.y)/f.h;this.light.strength=light.strength;
   let scene={actors:{pink:p,taupe:b},world:'forest',chapter:'forest',biome:0,cameraX:0,cameraY:0,distance:g.cross,flower:0,flowerPoint:null,beat:options.beat??this.narrativeFrame?.acting??shot.mode,guardian:this.narrativeFrame,light,contact:false,leaf:{visible:0,open:1},box:{visible:0,reveal:0},lens:{zoom:1+g.cross*.095,cx:.5,cy:.57,travel:0},forest:g,actionReady:action.canContinue??g.phase==='rest'};
   const turn=options.beat||this.narrativeFrame;
   if(!turn?.choiceResult){const age=Math.max(0,turn?.age||0),signal=options.reduced?1:ease(age/2.3);if(turn?.id==='glimmer'){p.lookX=.8;p.lookY=-.65;p.head=-.12*signal;p.earL=-.12*signal;p.earR=.16*signal;b.lookX=.65;b.lookY=-.5;b.head=-.06*signal;}else if(turn?.id==='listen'){b.head=.14*signal;b.earR=-.28*signal;b.earTip=-.14*signal;p.turn=.28*signal;p.lookX=.9;p.head=.09*signal;}else if(turn?.id==='forest-together'){p.lookX=.6;b.lookX=-.6;p.lean=.05*signal;b.lean=-.025*signal;}}
   // A route choice opens a new view under the same illustrated leaf curtain.
   // Canonical state changes at the tap; the renderer transfers only under cover.
   if(this.branchTransition){
    if(!options.paused)this.branchAge+=Math.max(0,options.dt||0);
    const age=this.branchAge,origin=this.branchOrigin,entry=ease((age-.48)/.94);
    if(options.reduced){this.branchAge=1.5;this.branchTransition=false;}
    else if(age<.48){scene={...copy(origin),guardian:turn,actionReady:false};}
    else{
     for(const [id,a]of Object.entries(scene.actors)){const from=origin.actors[id];for(const k of ['x','y','floor','s'])a[k]=mix(from[k],a[k],entry);const lift=entry>0&&entry<1?Math.sin(entry*Math.PI)*Math.min(9,f.h*.023):0;a.y-=lift;a.airborne=lift>.01?1:0;a.jumpPhase=a.airborne?'flight':'settle';a.earTip-=lift*.006;delete a.handsWorld;}
     scene.actionReady=false;
    }
    if(this.branchAge>=1.46){this.branchTransition=false;this.branchOrigin=null;}
    scene.branchCover=age<.48?ease(age/.36):1-ease((age-.57)/.60);
   }
   if(options.entryPose)VF.VineyardScene.prototype.blendEntry(scene,options.entryPose,ease(clamp(options.entryProgress??1)),view);
   this.animator.resolve(scene,time,view,{dt:options.dt||0,reduced:!!options.reduced,paused:!!options.paused,seek:this.seekPending});this.seekPending=false;this.last=scene;
   this.interactionTargets=tree?[{kind:g.phase==='discover'?'forest-listen':'forest-map',x:g.phase==='discover'?g.gate.knot.x:g.map.x,y:g.phase==='discover'?g.gate.knot.y:g.map.y,r:Math.max(30,g.phase==='discover'?f.w*.13:g.map.w*.35)}]:[{kind:'forest-guide',x:g.light.x,y:g.light.y,r:Math.max(30,Math.min(f.w,f.h)*.13)}];
   this.stats.route=g.route;this.stats.phase=g.phase;this.stats.progress={...g.progress};this.stats.cross=g.cross;this.stats.assets=ForestAssets.stats();return scene;
  }
  background(p,s,time,v,profile,reduced){
   const g=s.forest,f=v.frame,projection=g.projection;this.stats.draws++;this.stats.matte=projection;delete this.stats.questProp;const image=ForestAssets.image('clearing'),cover=Math.max(v.w/image.width,v.h/image.height),bw=image.width*cover,bh=image.height*cover;p.fillStyle='#162c2c';p.fillRect(0,0,v.w,v.h);p.drawImage(image,(v.w-bw)*.5,(v.h-bh)*.5,bw,bh);p.fillStyle='#112b2b83';p.fillRect(0,0,v.w,v.h);p.drawImage(ForestAssets.plate(),projection.x,projection.y,projection.w,projection.h);
   // The stream belongs to the plate. Reflected moving light stays confined to it.
   if(!g.tree)this.water(p,g,time,v,reduced);
   const shade=p.createLinearGradient(0,0,v.w,v.h);shade.addColorStop(0,g.tree?'#0e252a8a':'#0e252a50');shade.addColorStop(.48,g.tree?'#17363545':'#203a2608');shade.addColorStop(1,'#102a265c');p.fillStyle=shade;p.fillRect(0,0,v.w,v.h);
   if(g.tree){this.gates(p,g,v);this.rootArch(p,g,v);if(g.shape>.001)this.map(p,g,time,v,reduced);}
   else{this.bridge(p,g,time,v);this.guideFern(p,g,time,v,reduced);}
   const baseShade=p.createLinearGradient(0,f.y+f.h*.85,0,v.h);baseShade.addColorStop(0,'#0b252000');baseShade.addColorStop(1,'#0b252097');p.fillStyle=baseShade;p.fillRect(0,f.y+f.h*.85,v.w,v.h-f.y-f.h*.85);
   this.stats.visualState={gateOpen:g.gate.open,bridgeOpen:g.tree?0:g.shape,mapOpen:g.tree?g.shape:0,cover:projection.covers};
  }
  water(p,g,time,v,reduced){
   const r=g.water;p.save();p.beginPath();p.rect(0,r.y,v.w,r.h);p.clip();const t=reduced?0:time;
   for(let j=0;j<14;j++){const y=r.y+r.h*(j+.3)/14,x=v.w*.48+Math.sin(j*2.7+t*.21)*v.w*.17,w=v.w*(.04+(j%4)*.022);p.strokeStyle=j%3?'#d9d2aa36':'#fff0c361';p.lineWidth=j%3?.7:1.25;p.beginPath();p.moveTo(x-w,y);p.quadraticCurveTo(x,y+Math.sin(t*.9+j)*1.4,x+w,y);p.stroke();}
   const lx=clamp(g.light.x,0,v.w);for(let j=0;j<4;j++)ellipse(p,lx+(j%2?8:-5),r.y+r.h*.56+j*4,9+j*5,1,'#f9dca027');p.restore();
  }
  gates(p,g,v){
   const img=ForestAssets.image('treeGate'),c=ForestAssets.descriptor('treeGate').crops||fallback.treeGate.crops,q=g.gate;p.save();p.globalAlpha=.97;
   p.drawImage(img,...c.left,q.left,q.bottom-q.h,q.w,q.h);p.drawImage(img,...c.right,q.right,q.bottom-q.h,q.w,q.h);p.restore();
   const x=q.knot.x,y=q.knot.y,r=Math.min(v.frame.w*.115,v.frame.h*.08),gl=p.createRadialGradient(x,y,1,x,y,r*1.7);gl.addColorStop(0,'#e7c57e88');gl.addColorStop(1,'#d3b56700');p.fillStyle=gl;p.fillRect(x-r*1.7,y-r*1.7,r*3.4,r*3.4);
   p.save();p.translate(x,y);p.rotate(-.14);for(let j=0;j<4;j++){p.strokeStyle=j%2?'#d6bc7c87':'#18332ca0';p.lineWidth=j===0?2:1;p.beginPath();p.ellipse(0,0,r*(.35+j*.14),r*(.58+j*.09),0,-1.9,4.5);p.stroke();}p.restore();
  }
  rootArch(p,g,v){
   const f=v.frame,q=g.shape;if(q<.001)return;const bottom=f.y+f.h*.91,top=f.y+f.h*.17,center=f.x+f.w*.5,width=f.w*(.10+.37*q),ink=p.createLinearGradient(center-width,top,center+width,bottom);ink.addColorStop(0,'#8f8c54');ink.addColorStop(.24,'#c2ad6a');ink.addColorStop(.48,'#52603c');ink.addColorStop(1,'#283e2c');
   for(const side of [-1,1]){p.save();p.beginPath();p.moveTo(center+side*f.w*.47,bottom);p.bezierCurveTo(center+side*width,bottom-f.h*.12,center+side*width*1.05,top+f.h*.12,center+side*f.w*.03,top);p.lineWidth=Math.max(6,f.w*.035);p.lineCap='round';p.strokeStyle='#112c246e';p.stroke();p.lineWidth=Math.max(3,f.w*.018);p.strokeStyle=ink;p.stroke();p.lineWidth=.8;p.strokeStyle='#ead39d9c';p.stroke();p.restore();}
   // Root branches draw themselves from the central listening knot into the arch.
   p.save();p.lineCap='round';for(let j=0;j<6;j++){const side=j%2?-1:1,u=(j+.5)/6,visible=clamp((q-u*.45)*2.2),x=center+side*width*(.4+.35*u),y=bottom-f.h*(.1+u*.57);p.beginPath();p.moveTo(center+side*f.w*.44,bottom);p.quadraticCurveTo(x,bottom-f.h*.18,x+side*f.w*.06*visible,mix(bottom,y,visible));p.lineWidth=3.5-j*.3;p.strokeStyle='#4e6745';p.stroke();p.lineWidth=.6;p.strokeStyle='#d0bc7f97';p.stroke();}p.restore();
   // A low, woven moss bed gives the roots weight and perspective. Fine branching
   // fibres belong to that surface, rather than three freestanding vertical tubes.
   const bed=u=>({x:f.x+f.w*(.49+.025*Math.sin(u*Math.PI)),y:mix(g.near.y+5,g.far.y,u),half:f.w*mix(.32,.19,u)});p.save();p.beginPath();for(const side of [-1,1])for(let j=0;j<=24;j++){const u=(side<0?j/24:1-j/24)*q,n=bed(u),x=n.x+side*n.half*(1+.018*Math.sin(u*37));side<0&&j===0?p.moveTo(x,n.y):p.lineTo(x,n.y);}p.closePath();const moss=p.createLinearGradient(0,g.near.y,0,g.far.y);moss.addColorStop(0,'#435a37');moss.addColorStop(.42,'#637643');moss.addColorStop(1,'#8b8f50');p.fillStyle=moss;p.shadowColor='#09252197';p.shadowBlur=6;p.shadowOffsetY=4;p.fill();p.shadowBlur=0;p.shadowOffsetY=0;p.clip();
   // Reuse painted moss from this very clearing, conserving its grain, foliage
   // and warm highlights. It reads as forest ground rather than a vector ramp.
   const near=bed(0),far=bed(1),image=ForestAssets.image('clearing'),rows=20;for(let j=0;j<rows;j++){const u=j/rows,next=(j+1)/rows,a=bed(u),b=bed(next),yy=Math.min(a.y,b.y),hh=Math.abs(a.y-b.y)+1;p.drawImage(image,170,1210+(1-u)*220,690,220/rows+2,a.x-a.half,yy,a.half*2,hh);}p.fillStyle='#354c2a23';p.fillRect(near.x-near.half,far.y,near.half*2,near.y-far.y);
   for(let j=0;j<15;j++){const side=j%2?-1:1,u=(j+.5)/16,n=bed(u),start=[n.x+side*n.half,n.y+8],tip=bed(Math.min(1,u+.24));growingCurve(p,[start,[n.x+side*n.half*.46,n.y],[tip.x+side*tip.half*.39,tip.y],[tip.x+side*tip.half*.12,tip.y-3]],clamp((q-u)*6),j%4===0?2.8:1.0,j%4===0?'#b2a66a65':'#213d2b70');}p.restore();
  }
  map(p,g,time,v,reduced){
   const m=g.map,open=ease(g.shape),w=m.w*Math.max(.02,open),h=m.h,fold=(1-open)*.36;p.save();p.translate(m.x,m.y);p.rotate(-.055+fold*.1);p.scale(1,Math.min(1,.20+open*.8));
   // A many-lobed leaf is the surface; this is deliberately neither a panel nor a card.
   p.beginPath();p.moveTo(-w*.53,h*.12);p.bezierCurveTo(-w*.42,-h*.26,-w*.16,-h*.54,w*.13,-h*.48);p.bezierCurveTo(w*.31,-h*.51,w*.46,-h*.54,w*.57,-h*.38);p.bezierCurveTo(w*.45,-h*.12,w*.37,h*.26,w*.09,h*.39);p.bezierCurveTo(-w*.15,h*.53,-w*.40,h*.38,-w*.53,h*.12);p.closePath();
   const fill=p.createLinearGradient(0,-h*.6,0,h*.6);fill.addColorStop(0,'#c1c085');fill.addColorStop(.42,'#d9c995');fill.addColorStop(1,'#849568');p.shadowColor='#0a241e80';p.shadowBlur=14;p.shadowOffsetY=6;p.fillStyle=fill;p.fill();p.shadowBlur=0;p.shadowOffsetY=0;p.save();p.clip();
   for(let j=0;j<16;j++){const yy=-h*.6+j*h*.08;p.strokeStyle=j%2?'#ffffdc11':'#466e4a12';p.lineWidth=1.3;p.beginPath();p.moveTo(-w*.6,yy);p.bezierCurveTo(-w*.2,yy+h*.07,w*.2,yy-h*.04,w*.6,yy+h*.02);p.stroke();}
   p.beginPath();p.moveTo(-w*.53,h*.12);p.bezierCurveTo(-w*.21,h*.19,w*.18,-h*.18,w*.57,-h*.38);p.strokeStyle='#49764c';p.lineWidth=2.0;p.stroke();for(let j=1;j<9;j++){const q=j/10,x=mix(-w*.48,w*.46,q),y=mix(h*.15,-h*.32,q);for(const side of [-1,1]){p.beginPath();p.moveTo(x,y);p.quadraticCurveTo(x-w*.07,y+side*h*.16,x+w*.035,y+side*h*.31*(1-Math.abs(q-.5)));p.lineWidth=.7;p.strokeStyle='#517a4785';p.stroke();}}
   const curves=[{at:0,points:[[-.42,.28],[-.10,.38],[-.13,-.30],[.41,-.27]]},{at:.16,points:[[-.23,.25],[-.18,.04],[-.40,-.16],[-.32,-.28]]},{at:.27,points:[[-.03,-.02],[.12,.23],[.31,.24],[.32,.10]]},{at:.4,points:[[.14,-.22],[.08,-.42],[.17,-.40],[.21,-.36]]}],lit=clamp((open-.1)/.9);
   for(const curve of curves){const pts=curve.points.map(([x,y])=>[x*w,y*h]),q=clamp((lit-curve.at)/(1-curve.at));growingCurve(p,pts,q,3.2,'#466c43');growingCurve(p,pts,q,.8,'#e5d69b');}
   if(lit>.92){const x=w*.41,y=-h*.27;glow(p,x,y,17,.55);for(let k=0;k<5;k++){const a=k*TAU/5;ellipse(p,x+Math.cos(a)*4,y+Math.sin(a)*4,2.5,2.2,'#e9d5a2');}ellipse(p,x,y,1.4,1.4,'#fff4c5');}
   p.restore();p.restore();
   const box={x:m.x-w*.59,y:m.y-h*.58,w:w*1.18,h:h*1.16};this.stats.questProp=box;this.stats.mapBounds=box;
  }
  bridge(p,g,time,v){
   const q=g.shape;if(q<.001)return;const f=v.frame,start=g.near,end=g.far,span=start.y-end.y,half=Math.min(f.w*.25,span*.38),count=32,dx=end.x-start.x,dy=end.y-start.y,length=Math.hypot(dx,dy),normal={x:-dy/length,y:dx/length};
   // One continuous broad leaf spans the real stream. Its curl advances along
   // the midrib, leaving an uninterrupted surface wide enough for both plushes.
   const point=(u,side=0)=>{const bulge=Math.pow(Math.max(0,Math.sin(u*Math.PI)),.72),r=half*bulge*(.94+Math.sin(u*TAU*3)*.025);return{x:mix(start.x,end.x,u)+normal.x*r*side,y:mix(start.y,end.y,u)+normal.y*r*side};};
   p.save();p.beginPath();for(const side of [-1,1])for(let j=0;j<=count;j++){const u=side<0?j/count*q:(1-j/count)*q,n=point(u,side);if(side<0&&j===0)p.moveTo(n.x,n.y);else p.lineTo(n.x,n.y);}p.closePath();const fill=p.createLinearGradient(start.x-half,start.y,end.x+half,end.y);fill.addColorStop(0,'#385e3a');fill.addColorStop(.23,'#6c8a49');fill.addColorStop(.62,'#96a85c');fill.addColorStop(1,'#bbc27a');p.fillStyle=fill;p.shadowColor='#10241cbd';p.shadowBlur=9;p.shadowOffsetY=8;p.fill();p.shadowBlur=0;p.shadowOffsetY=0;p.strokeStyle='#b6bd7e';p.lineWidth=1.1;p.stroke();
   p.save();p.clip();for(let j=0;j<50;j++){const u=j/50*q,n=point(u,-1),e=point(u,1);p.beginPath();p.moveTo(n.x,n.y);p.lineTo(e.x,e.y);p.lineWidth=.8;p.strokeStyle=j%2?'#ffffce09':'#173e1f0e';p.stroke();}p.restore();
   p.beginPath();p.moveTo(start.x,start.y+12);p.lineTo(mix(start.x,end.x,q),mix(start.y,end.y,q));p.lineWidth=4;p.strokeStyle='#3a673b';p.stroke();p.lineWidth=1.3;p.strokeStyle='#ded79b';p.stroke();
   for(let j=1;j<10;j++){const u=j/11;if(u>q)continue;const center=point(u),v1=Math.min(q,u+.11);for(const side of [-1,1]){const edge=point(v1,side);p.beginPath();p.moveTo(center.x,center.y);p.quadraticCurveTo(center.x+normal.x*half*.40*side,center.y+normal.y*half*.40*side,edge.x,edge.y);p.strokeStyle='#d4d59491';p.lineWidth=.8;p.stroke();}}
   if(q<.995){const tip=point(q);p.save();p.translate(tip.x,tip.y);p.rotate(Math.atan2(dy,dx)+Math.PI/2);p.scale(Math.max(.05,Math.sin(q*Math.PI)),.23);leafPath(p,half*.82,.9);p.fillStyle='#c2c880';p.fill();p.strokeStyle='#e7dca5';p.lineWidth=1;p.stroke();p.restore();}p.restore();this.stats.bridgeBounds={x:Math.min(start.x,end.x)-half,y:end.y-half*.3,w:Math.abs(dx)+half*2,h:span+half*.6};if(['shape','cross'].includes(g.phase))this.stats.questProp={...this.stats.bridgeBounds};
  }
  guideFern(p,g,time,v,reduced){
   const f=v.frame,open=g.discover,size=Math.min(f.w*.84,f.h*.69),x=f.x+f.w*.42,y=Math.min(g.near.y+8,f.y+f.h*.96),angle=mix(-.03,-.68,open);p.save();p.translate(x,y);p.rotate(angle);p.globalAlpha=(1-g.cross*.72)*(1-g.shape*.92);
   // Full foliage artwork carries the obstacle; interaction physically lifts it.
   const crop=VF.Art.rects.foliage.fern;VF.Art.draw(p,'foliage',crop,-size*.62,-size*.50,size,size*.59);p.restore();
   if(open>.01){const small=p.createRadialGradient(g.far.x,g.far.y,0,g.far.x,g.far.y,f.w*.42);small.addColorStop(0,'#ffe3a12b');small.addColorStop(1,'#ffe3a100');p.fillStyle=small;p.fillRect(g.far.x-f.w*.42,g.far.y-f.w*.42,f.w*.84,f.w*.84);}
  }
  shadow(p,actor){
   const ground=actor.groundY??actor.floor+18*actor.s,height=Math.max(0,actor.floor-actor.y),radius=(actor.id==='pink'?65:86)*actor.s;
   const soft=(x,y,r,flat,alpha)=>{p.save();p.translate(x,y);p.scale(1,flat);const g=p.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,'rgba(8,24,21,'+alpha+')');g.addColorStop(.4,'rgba(8,24,21,'+(alpha*.55)+')');g.addColorStop(1,'rgba(8,24,21,0)');p.fillStyle=g;p.fillRect(-r,-r,r*2,r*2);p.restore();};
   soft(actor.x,ground,radius+height*.10,.20,.49/(1+height*.02));for(const foot of Object.values(actor.feetWorld||{})){if(foot.contact===false)continue;soft(foot.x,ground,Math.max(9,actor.s*29),.18,.70);}
  }
  afterActors(p,s,time,v,profile,reduced){
   const g=s.forest,f=v.frame;p.save();
   if(!g.tree&&g.phase!=='discover'&&g.cross<.12){const hand=s.renderedActors?.find(actor=>actor.id==='taupe')?.hands?.left;if(hand){const root=g.near;p.beginPath();p.moveTo(root.x,root.y+3);p.bezierCurveTo(root.x+f.w*.18,root.y+15,hand.x-6,hand.y+29,hand.x,hand.y+2);p.lineCap='round';p.lineWidth=3.6;p.strokeStyle='#344e2b';p.stroke();p.lineWidth=1.1;p.strokeStyle='#c4bd7a';p.stroke();this.stats.stemContact={x:hand.x,y:hand.y,root:{...root}};}}else delete this.stats.stemContact;
   // A restrained light creature: its halo is rendered with the art, not an HTML
   // pointer. The recorded gesture can leave a short, fading curved wake.
   const light=g.tree?{x:g.gate.knot.x,y:g.gate.knot.y}:g.light;
   if(!g.tree&&g.trace.length>1&&g.interacting){const tail=g.trace.slice(-18);p.lineWidth=1.1;p.strokeStyle='#ffdda650';p.lineCap='round';p.beginPath();tail.forEach((n,i)=>{const x=f.x+n.x*f.w,y=f.y+n.y*f.h;if(!i)p.moveTo(x,y);else{const prev=tail[i-1];p.quadraticCurveTo(f.x+prev.x*f.w,f.y+prev.y*f.h,x,y);}});p.stroke();}
   const flutter=reduced?0:Math.sin(time*2.2)*.06;glow(p,light.x,light.y,Math.min(f.w*.18,65),.73+flutter);ellipse(p,light.x,light.y,2.3,2.8,'#fff7d1');
   if(g.tree&&g.phase==='discover'){
    const r=Math.min(f.w*.115,f.h*.08);p.lineWidth=1.1;p.strokeStyle='#f3d6909c';p.beginPath();p.arc(light.x,light.y,r*.89,-Math.PI/2,-Math.PI/2+TAU*g.discover);p.stroke();
    if(g.interacting)for(let j=0;j<3;j++){const q=((time*.3+j*.33)%1),rr=r*(1+q*.9);p.globalAlpha=(1-q)*.34;p.beginPath();p.ellipse(light.x,light.y,rr,rr*1.1,0,0,TAU);p.stroke();}p.globalAlpha=1;
   }
   // Only three environmental lights: enough to describe the opened space, never
   // confetti. Their world positions are stable during paused/restored frames.
   if(g.discover>.1)for(let j=0;j<3;j++){const x=f.x+f.w*(.30+j*.19),y=f.y+f.h*(.22+(j%2)*.07),a=(.15+g.shape*.25)*(reduced?1:.86+Math.sin(time*.7+j)*.14);glow(p,x,y,12,a);}
   p.restore();this.stats.light={x:light.x,y:light.y};
  }
  foreground(p,s,time,v,profile,reduced){
   const g=s.forest,f=v.frame,fern=VF.Art.rects.foliage.fern,size=Math.min(v.w*.60,v.h*.44),parallax=g.cross*v.w*.12;
   p.save();p.globalAlpha=.86;VF.Art.draw(p,'foliage',fern,-size*.48-parallax,v.h-size*.24,size,size*.46);p.save();p.translate(v.w+size*.43+parallax,v.h-size*.24);p.scale(-1,1);VF.Art.draw(p,'foliage',fern,0,0,size,size*.46);p.restore();p.restore();
   const vignette=p.createRadialGradient(f.x+f.w*.5,f.y+f.h*.46,f.w*.28,f.x+f.w*.5,f.y+f.h*.46,Math.max(v.w,v.h)*.83);vignette.addColorStop(0,'#0b212200');vignette.addColorStop(1,'#0b212267');p.fillStyle=vignette;p.fillRect(0,0,v.w,v.h);this.branchCurtain(p,s,v);if(s.forest.phase==='rest') {const root={x:f.x+f.w*.69,y:f.y+f.h*.42};VF.VineyardScene.prototype.signal(p,root,f.w*.18,1,s.forest.route);this.stats.exitSignal={route:s.forest.route,target:'donde-apuntan-las-raices',visible:true};}
  }
  branchCurtain(p,s,v){const cover=s.branchCover||0;if(cover<=0)return;p.save();p.beginPath();p.rect(v.w*(1-cover*1.25),0,v.w*1.4,v.h);p.clip();p.fillStyle='#254432';p.fillRect(0,0,v.w,v.h);VF.Art.draw(p,'foliage',VF.Art.rects.foliage.leaf,-v.w*.7,-v.h*.85,v.w*2.6,v.h*2.8);p.restore();}
  flower(){}
  mushroom(){}
 }
 VF.ForestAssets=ForestAssets;VF.ForestScene=ForestScene;
})();
