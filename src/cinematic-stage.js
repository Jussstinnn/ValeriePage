/* A single clearing, five authored shots. Props and paws share world-space anchors. */
(() => {
 const {mix,span,pulse,clamp,ease}=VF.math,clone=o=>JSON.parse(JSON.stringify(o));
 const blend=(a,b,q)=>typeof b==='number'?mix(typeof a==='number'?a:b,b,q):b&&typeof b==='object'?Object.fromEntries(Object.keys(b).map(k=>[k,blend(a?.[k],b[k],q)])):b;
 class CinematicStage extends VF.ProductionStage {
  event(kind,time,point){
   this.events.push({kind,at:time,point:point||null});if(this.events.length>6)this.events.shift();
   if(kind==='pink')this.act('asombro','pink',time);
   if(kind==='taupe')this.act('escucha','taupe',time);
  }
  pose(shot,time,view,options={}){
   const {reduced=false,dt=0,transition=1}=options,t=reduced?Math.max(shot.hold,time):time,f=view.frame,portrait=view.kind==='portrait',mode=shot.mode;
   const a=this.geometry(view,'together'),p=a.pink,g=a.taupe;
   const plans={recognise:{height:.85,depth:.77,px:.27,gx:.64,lens:1.12,cx:.46,cy:.43},leaf:{height:.77,depth:.88,px:.24,gx:.65,lens:1.40,cx:.41,cy:.56},crossing:{height:.68,depth:.92,px:.28,gx:.65,lens:.94,cx:.50,cy:.65},tender:{height:.85,depth:.87,px:.29,gx:.66,lens:1.63,cx:.59,cy:.61},secret:{height:.68,depth:.66,px:.26,gx:.74,lens:1.16,cx:.63,cy:.51}},plan=plans[mode];
   const h=Math.min(f.h*(mode==='tender'?.86:.78),f.w*(portrait?plan.height:.47));
   g.s=h/VF.rigBounds.taupe.h;p.s=h*.82/VF.rigBounds.pink.h;
   g.x=f.x+f.w*(portrait?plan.gx:.67);p.x=f.x+f.w*(portrait?plan.px:.34);
   g.y=g.floor=f.y+f.h*(portrait?plan.depth:.92);p.y=p.floor=f.y+f.h*.96;
   p.turn=.36;g.turn=-.30;p.lookX=.9;g.lookX=-.8;p.lookY=-.3;g.lookY=.5;
   p.gaitWeight=g.gaitWeight=0;p.airborne=g.airborne=0;
   let beat='two-quiet-presences',leafOpen=0,boxReveal=0,contact=false,camera=0;
   const event=this.events.at(-1),age=event?t-event.at:100,response=pulse(0,.5,3.2,4.7,age),help=event&&['both','leaf','light','box'].includes(event.kind)?response:0;
   if(mode==='recognise'){
    const glance=span(.8,2.3,t),answer=span(2.7,4.2,t),invite=span(5.6,7.8,t);
    p.head=mix(-.13,.18,glance)-invite*.10;p.earL=-.12-glance*.22;p.earR=.15+glance*.22;
    g.head=.08-answer*.21;g.earL=answer*.43;g.earR=-answer*.09;g.earTip=pulse(3,3.7,4.8,5.8,t)*.16;
    p.lookX=mix(0,1,glance);g.lookX=mix(0,-1,answer);g.turn=mix(0,-.5,answer);p.turn=mix(0,.5,glance);
    g.arms.left={x:-65,y:-56-invite*19};p.arms.right={x:39,y:-58-invite*7};
    beat=t<2.5?'first-look':t<5.5?'the-long-ear-answers':'an-invitation-without-words';camera=span(0,9,t)*.16;
   }
   if(mode==='leaf'){
    const notice=span(.4,1.7,t),lift=span(2.0,4.8,t),duck=pulse(4.7,5.3,8.8,9.6,t);
    leafOpen=clamp(lift+help*(lift>.9?-.18:.18));
    // Two whole-plush scoots: anticipation, both feet leave together, then settle.
    // There is no alternating stride, arm swing or continuously sliding root.
    let travel=0,bounce=0,anticipation=0,settle=0,follow=0;
    for(const [takeoff,land]of [[5.55,6.30],[7.75,8.50]]){
     const q=clamp((t-takeoff)/(land-takeoff)),air=t>takeoff&&t<land?Math.sin(q*Math.PI):0;
     travel+=span(takeoff,land,t)*.08;bounce+=air;anticipation+=pulse(takeoff-.42,takeoff-.12,takeoff,takeoff+.08,t);settle+=pulse(land,land+.12,land+.24,land+.62,t);follow+=pulse(land-.10,land+.08,land+.22,land+.70,t);
    }
    p.x+=f.w*travel;p.y-=bounce*Math.min(f.h*.037,14);p.airborne=bounce>.001?1:0;p.crouch=duck*.20+anticipation*.42+settle*.34;p.head=.10*duck-.08*bounce+.04*settle;p.earL=.18*duck-.30*bounce+.17*follow;p.earR=-.12*duck+.20*bounce-.10*follow;
    p.gaitWeight=0;p.stride=0;p.lookX=.6;p.lookY=-.4;g.head=-notice*.17;g.earL=notice*.28;g.turn=-.40;
    g.arms.left={x:-90,y:mix(-88,-175,leafOpen)};g.arms.right={x:58,y:-54};
    beat=t<2?'noticing-the-low-leaf':t<5?'lifting-a-real-leaf':t<9.6?'making-room-for-the-other':'the-path-is-open';camera=span(3,10,t)*.38;
   }
   if(mode==='crossing'){
    const prepare=pulse(1.1,1.8,2.0,2.35,t),flight=t>2.35&&t<3.8?Math.sin((t-2.35)/1.45*Math.PI):0,landing=pulse(3.8,4.0,4.2,4.9,t),join=span(.45,1.2,t),rest=span(5.1,7.3,t);
    // A modest, tangible crossing, with a long support pause before and after it.
    p.x=f.x+f.w*.28+span(2.35,3.8,t)*f.w*.06;g.x=f.x+f.w*.65;
    p.floor=f.y+f.h*.95;g.floor=f.y+f.h*(portrait?.91:.95);p.y=p.floor-flight*Math.min(f.h*.095,42);g.y=g.floor;
    p.crouch=prepare*.8+landing*.6;p.airborne=flight>0?1:0;p.jumpPhase=t<1.1?'grounded':t<2.35?'anticipation':t<2.48?'takeoff':t<3.8?'flight':t<4.2?'landing':t<4.9?'settle':'grounded';p.head=-flight*.18+landing*.1;g.head=-.16+rest*.1;
    p.earL=-flight*.40;p.earR=flight*.25;g.earTip=landing*.18;g.turn=-.40;p.turn=.36;
    contact=join>.99;p.arms.right={x:49,y:-84};g.arms.left={x:-65,y:-96};leafOpen=1;
    beat=t<2.35?'offering-support':flight>.01?'a-hop-with-a-helping-paw':t<5?'soft-landing':'we-can-stay-here';camera=.4;
   }
   if(mode==='tender'){
    p.x=f.x+f.w*.30;g.x=f.x+f.w*.65;p.y=p.floor=f.y+f.h*.96;g.y=g.floor=f.y+f.h*(portrait?.87:.96);
    const lean=span(1.2,3.8,t),back=span(6.0,8.3,t);p.head=.24*lean;g.head=-.17*lean;p.turn=.38*(1-back);g.turn=-.35*(1-back);
    p.lookX=1-back;g.lookX=-1+back;p.lookY=-.2;g.lookY=.35;p.earL=-.15;p.earR=.20;g.earL=.13;
    contact=true;leafOpen=1;beat=t<4?'a-pause-for-two':'they-look-back-for-you';camera=.42;
   }
   if(mode==='secret'){
    const sit=span(.7,2.6,t),reveal=span(3,7.2,t),lookback=span(8.4,10.5,t);
    p.x=f.x+f.w*(portrait?.28:.35);g.x=f.x+f.w*(portrait?.70:.72);
    g.s*=.87;p.s*=.93;p.y=p.floor=f.y+f.h*(portrait?.66:.93);g.y=g.floor=f.y+f.h*(portrait?.64:.91);p.sit=g.sit=sit;
    p.head=-.14;g.head=.10;p.turn=.36*(1-lookback);g.turn=-.25*(1-lookback);p.lookY=-.8+lookback*.8;g.lookY=-.7+lookback*.7;
    p.lookX=.6*(1-lookback);g.lookX=-.6*(1-lookback);p.earR=.20;g.earL=.15;leafOpen=1;boxReveal=reveal;
    beat=t<3?'settling-beside-a-secret':t<7.2?'leaves-uncover-the-case':'a-secret-kept-for-you';camera=.55;
   }
   if(response>0){
    if(event.kind==='pink'){p.head-=response*.12;p.lookX=0;p.lookY=0;}
    else if(event.kind==='taupe'){g.lookX=0;g.lookY=0;}
    else{p.head+=response*.08;g.head-=response*.07;p.lookX=.7;g.lookX=-.7;}
   }
   for(const [id,actor]of Object.entries(a)){
    const b=VF.rigBounds[id],margin=5;
    actor.x=clamp(actor.x,f.x-b.x*actor.s+margin,f.x+f.w-(b.x+b.w)*actor.s-margin);
    actor.y=clamp(actor.y,f.y-b.y*actor.s+margin,f.y+f.h-(b.y+b.h)*actor.s-margin);if(!actor.airborne)actor.floor=actor.y;
    if(!reduced){const blink=(t+(id==='pink'?1.1:3.1))%6.2;actor.blink=blink<.17?Math.sin(blink/.17*Math.PI):0;actor.head+=Math.sin(t*.68+(id==='pink'?0:1.4))*.009;}
   }
   // The pink crosses in front of the larger plush, including while airborne.
   // Sorting by head/body height would incorrectly hide it midway through a jump.
   p.depth=2;g.depth=1;
   if(contact){
    const pm=VF.CharacterModels.pink,gm=VF.CharacterModels.taupe,pp=VF.Kinematics.posture('pink',p),gp=VF.Kinematics.posture('taupe',g),rp=(pm.arm[0]+pm.arm[1]-2)*p.s*Math.min(pp.sx,pp.sy),rg=(gm.arm[0]+gm.arm[1]-2)*g.s*Math.min(gp.sx,gp.sy),reach=(rp+rg)*.78,sp=VF.Kinematics.shoulder(p,'pink',1),sg=VF.Kinematics.shoulder(g,'taupe',-1),sy=sg.y-sp.y,dx=sg.x-sp.x,wanted=Math.sqrt(Math.max(4,reach*reach-sy*sy)),move=Math.max(0,dx-wanted);
    p.x+=move*.52;g.x-=move*.48;
    const target=VF.Kinematics.shared(p,g);if(target.reachable){p.handsWorld={right:target};g.handsWorld={left:target};}
   }
   const leafTarget=VF.Kinematics.localToWorld(g,{x:-90,y:mix(-88,-175,leafOpen)},'taupe');
   if(mode==='leaf')g.handsWorld={left:leafTarget};
   const leaf={x:leafTarget.x,y:leafTarget.y,rootX:f.x+f.w*.11,rootY:f.y+f.h*.94,size:Math.min(f.w*.43,f.h*.39),open:leafOpen,held:mode==='leaf',visible:mode==='leaf'?1:0};
   const boxW=Math.min(f.w*(portrait?.80:.37),f.h*.82,340),box={x:f.x+f.w*(portrait?.50:.52),y:f.y+f.h*(portrait?.81:.71),w:boxW,h:boxW*.60,reveal:boxReveal,visible:mode==='secret'?1:0,warm:help};
   let light=this.updateLight(dt,'together',t,view,a,reduced,{x:leaf.x,y:leaf.y});
   if(!this.drag){const goal=contact?p.handsWorld?.right:mode==='leaf'?{x:leaf.x-5,y:leaf.y-12}:mode==='secret'?{x:box.x,y:box.y+box.h*.15}:null;if(goal){light={x:goal.x,y:goal.y,strength:.85+help*.4};this.light.x=(light.x-f.x)/f.w;this.light.y=(light.y-f.y)/f.h;}}
   else for(const actor of [p,g]){actor.lookX=clamp((light.x-actor.x)/80,-1,1);actor.lookY=clamp((light.y-(actor.y-190*actor.s))/60,-1,1);}
   let scene={actors:a,biome:1,cameraX:camera,cameraY:0,distance:camera,flower:0,flowerPoint:{x:0,y:0},beat,light,leaf,box,contact,chapter:mode,lens:{zoom:plan.lens,cx:plan.cx,cy:plan.cy,travel:reduced?0:span(0,9,t)*.012}};
   // The camera transports the whole cast and their constraints together, never independent CSS scales.
   if(this.transition&&transition<1)scene=blend(this.transition,scene,ease(transition));else this.transition=null;
   // Preserve physical constraints during the travelling cut, not only at its endpoint.
   if(scene.leaf.held)scene.actors.taupe.handsWorld={left:{x:scene.leaf.x,y:scene.leaf.y}};
   if(scene.contact){const target=VF.Kinematics.shared(scene.actors.pink,scene.actors.taupe);if(target.reachable){scene.actors.pink.handsWorld={right:target};scene.actors.taupe.handsWorld={left:target};}}
   return this.finish(scene,shot,t,view,options);
  }
 }
 VF.SceneStage=CinematicStage;
})();
