/* Pre-IK acting layer. Approved drawings, shoulders and limb lengths are immutable. */
(() => {
 const {span,pulse,mix,clamp}=VF.math;
 const library={
  invite:{pink:{head:.13,lean:-.10,earL:-.11,earR:.07},taupe:{head:-.07}},
  reassure:{pink:{head:.10},taupe:{head:-.11,lean:.05,earL:.06}},
  listen:{pink:{head:.15,earL:-.12,earR:.08},taupe:{head:-.12,earR:.12}},
  discover:{pink:{head:.18,crouch:.18,lean:.16},taupe:{head:.08}},
  peek:{pink:{head:.20,crouch:.08},taupe:{head:-.08}},
  'lift-page':{pink:{head:.12,crouch:.06},taupe:{head:.08,crouch:.10}},
  'lean-photo':{pink:{head:.14,lean:.08},taupe:{head:.10}},
  'make-room':{pink:{head:-.09},taupe:{head:.10}},
  bookmark:{pink:{head:-.10},taupe:{head:-.14}},
  nuzzle:{pink:{head:.15,lean:.13},taupe:{head:-.12,lean:-.09}},
  cuddle:{pink:{head:.16,lean:.12},taupe:{head:-.12,lean:-.08}},
  settle:{pink:{head:.07,crouch:.06},taupe:{head:-.06,crouch:.07}},
  'find-envelope':{pink:{head:.13},taupe:{head:.09,crouch:.08}},
  'offer-envelope':{pink:{head:-.08},taupe:{head:-.07}},
  'look-up':{pink:{head:-.13,earL:-.08,earR:.05},taupe:{head:-.10}},
  'recognize-box':{pink:{head:-.15,crouch:.06,earL:-.13,earR:.08},taupe:{head:-.07}},
  'protect-gift':{pink:{head:.11},taupe:{head:-.11,lean:.07}},
  'catch-star':{pink:{head:-.14},taupe:{head:-.12}},
  'shelter-star':{pink:{head:.12},taupe:{head:.10}},
  'catch-petal':{pink:{head:-.12,earL:-.10},taupe:{head:-.08}},
  quiet:{pink:{head:.02},taupe:{head:-.03}},watch:{pink:{head:0},taupe:{head:0}},
  'soft-hop':{pink:{head:.10},taupe:{head:-.12}}
 };
 function apply(scene,beat,view){const {pink,taupe}=scene.actors,f=view.frame,t=beat.age,weights=library[beat.acting]||library.watch,q=span(0,.65,t),hopNames=['soft-hop','make-room','invite'];
  for(const [id,p]of Object.entries(scene.actors)){const spec=weights[id]||{};for(const [key,v]of Object.entries(spec))p[key]=(p[key]||0)+v*q;p.gaitWeight=0;p.stride=0;p.lookX=beat.look==='photo'?0:id==='pink'?.45:-.40;p.lookY=beat.look==='photo'?-.25:.05;
   const ownHop=hopNames.includes(beat.acting)&&id==='pink',arc=ownHop&&t>.34&&t<1.24?Math.sin((t-.34)/.90*Math.PI):0,anticipation=ownHop?pulse(0,.22,.34,.42,t)*.16:0,landing=ownHop?pulse(1.23,1.31,1.48,1.85,t)*.10:0;
   p.crouch=(p.crouch||0)+anticipation+landing;p.y-=arc*Math.min(15,f.h*.045);if(ownHop){p.airborne=arc>0?1:0;p.jumpPhase=t<.34?'anticipation':t<.48?'takeoff':t<1.24?'flight':t<1.48?'landing':t<1.85?'settle':'grounded';}p.earL=(p.earL||0)+Math.sin(t*7.5)*Math.exp(-t*1.4)*.09;p.earR=(p.earR||0)-Math.sin(t*6.5+.3)*Math.exp(-t*1.4)*.08;
  }
  if(beat.acting==='make-room'){const h=taupe.s*VF.rigBounds.taupe.h;pink.x-=h*.05*span(.35,1.4,t);taupe.x-=h*.08*span(.70,1.65,t);}
  if(beat.acting==='discover'){pink.x+=f.w*.035*q;pink.crouch+=.16*q;taupe.head+=.05*q;}
  if(beat.acting==='find-envelope'||beat.acting==='offer-envelope'){pink.handsWorld={right:VF.Kinematics.localToWorld(pink,{x:50,y:-120},'pink')};taupe.handsWorld={left:VF.Kinematics.localToWorld(taupe,{x:-62,y:-122},'taupe')};}
  if(['nuzzle','cuddle'].includes(beat.acting)){pink.x+=f.w*.035*q;taupe.x-=f.w*.035*q;}
  // Held keepsakes have reachable, posture-aware paw targets, not screen-space guesses.
  if(['catch-star','shelter-star'].includes(beat.acting))taupe.handsWorld={right:VF.Kinematics.localToWorld(taupe,{x:60,y:-160},'taupe')};
  if(beat.acting==='catch-petal')pink.handsWorld={left:VF.Kinematics.localToWorld(pink,{x:-38,y:-143},'pink')};
  // Solve the rigid paper from two reachable paws. Aspect is preserved; no stretched arms.
  if(scene.page||scene.envelopeRect){
   const lift=beat.acting==='lift-page'?span(.25,1.15,t)*14:0,L=VF.Kinematics.localToWorld(pink,{x:39,y:-70-lift},'pink'),R=VF.Kinematics.localToWorld(taupe,{x:-54,y:-65-lift},'taupe'),angle=Math.atan2(R.y-L.y,R.x-L.x),w=Math.hypot(R.x-L.x,R.y-L.y)/.94,img=scene.memory!==undefined?VF.MemoryAssets.image(scene.memory):null,h=scene.envelopeRect?w*.64:w*img.naturalHeight/img.naturalWidth,held={x:(L.x+R.x)/2+Math.sin(angle)*h*.5,y:(L.y+R.y)/2-Math.cos(angle)*h*.5,w,h,angle},full=scene.fullPhoto;
   const amount=beat.view==='photo'?beat.blend:beat.from?.view==='photo'?1-beat.blend:0,shape={};for(const key of ['x','y','w','h','angle'])shape[key]=full?mix(held[key],full[key],amount):held[key];shape.grips=[L,R];
   if(scene.envelopeRect)scene.envelopeRect=shape;else scene.page=shape;
   if(['reveal','reaction','envelope'].includes(beat.view)){pink.handsWorld={right:L};taupe.handsWorld={left:R};}
  }
  scene.acting={name:beat.acting,age:t,library:!!library[beat.acting],pairedHop:true};
 }
 VF.GuardianActing={apply,library:Object.keys(library)};
})();
