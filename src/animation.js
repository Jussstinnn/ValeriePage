/* Production motion: named clips, layered channels, deterministic sampling and secondary springs. */
(() => {
 const {mix,clamp,ease,pulse}=VF.math,copy=o=>JSON.parse(JSON.stringify(o));
 const curves={
  saludo:{duration:3.6,tracks:{head:[[0,0],[.45,-.17],[1.1,.10],[1.6,-.13],[2.5,.04],[3.6,0]],earL:[[0,0],[.6,-.37],[1.5,.10],[2.5,-.1],[3.6,0]],earR:[[0,0],[.7,.30],[1.7,-.1],[3.6,0]]}},
  escucha:{duration:4.2,tracks:{head:[[0,0],[1,-.24],[2.7,-.16],[4.2,0]],earL:[[0,0],[.8,.55],[2.1,.42],[3.0,.12],[4.2,0]],earTip:[[0,0],[1.2,.19],[1.8,-.12],[2.5,.08],[4.2,0]]}},
  invitar:{duration:3.8,tracks:{head:[[0,0],[.8,.15],[2.3,-.08],[3.8,0]],turn:[[0,0],[.9,.65],[2,.35],[3.8,0]],earR:[[0,0],[1,.25],[3.8,0]]}},
  asombro:{duration:3.4,tracks:{head:[[0,0],[.5,-.18],[1.7,-.08],[3.4,0]],earL:[[0,0],[.4,-.29],[1.4,-.12],[3.4,0]],earR:[[0,0],[.5,.28],[1.8,.12],[3.4,0]],eyeOpen:[[0,1],[.5,1.12],[2,1],[3.4,1]]}},
  'mirar-atras':{duration:4,tracks:{turn:[[0,0],[1,-.75],[2.6,-.65],[4,0]],head:[[0,0],[1,.12],[2.5,.08],[4,0]]}},
  inclinarse:{duration:4.5,tracks:{head:[[0,0],[1.2,.26],[2.8,.22],[4.5,0]],lean:[[0,0],[1.5,.07],[3,.05],[4.5,0]],earR:[[0,0],[1.4,.20],[4.5,0]]}},
  sentarse:{duration:5,hold:true,tracks:{sit:[[0,0],[1.8,1],[5,1]],head:[[0,0],[1,.12],[2.2,-.03],[5,0]]}}
 };
 const get=(o,key)=>key.split('.').reduce((v,k)=>v?.[k],o);
 const set=(o,key,value)=>{const parts=key.split('.');let p=o;for(const k of parts.slice(0,-1))p=p[k]??={};p[parts.at(-1)]=value;};
 function sample(keys,time){if(time<=keys[0][0])return keys[0][1];for(let i=1;i<keys.length;i++){if(time<=keys[i][0])return mix(keys[i-1][1],keys[i][1],ease((time-keys[i-1][0])/(keys[i][0]-keys[i-1][0])));}return keys.at(-1)[1];}
 function spring(state,target,dt,w,z){
  const d=Math.min(.08,Math.max(0,dt)),wd=w*Math.sqrt(1-z*z),y=state.x-target,c=(state.v+z*w*y)/wd,e=Math.exp(-z*w*d),co=Math.cos(wd*d),si=Math.sin(wd*d);
  return{x:target+e*(y*co+c*si),v:e*((c*wd-z*w*y)*co+(-y*wd-z*w*c)*si)};
 }
 class RigAnimator {
  constructor(){this.states={};this.clips=[];this.serial=0;this.lastSerial=-1;this.lastTime=null;this.layoutKey='';this.steps=0;}
  play(id,name,at,strength=1){if(!VF.CharacterModels[id]||!curves[name]||!Number.isFinite(at))return false;this.clips=this.clips.filter(c=>c.id!==id||c.name!==name);this.clips.push({id,name,at,strength:clamp(strength)});if(this.clips.length>8)this.clips.shift();this.serial++;return true;}
  reset(){this.states={};this.clips=[];this.serial++;this.lastTime=null;this.layoutKey='';}
  feet(id,p,time,walking,view,reset){
   const m=VF.CharacterModels[id],state=this.states[id],phase=(time*(id==='pink'?1.05:.88)+(id==='pink'?0:.18)),ground=Math.min(p.floor+18*p.s,view.frame.y+view.frame.h-5),air=p.airborne||0,result={};
   // Contact is a support constraint. Flight feet are pelvis-local, never world anchors.
   p.locomotion={phase:p.jumpPhase||(air?'flight':p.crouch>.1?'anticipation':'grounded'),space:air?'actor':'world',lift:Math.max(0,p.floor-p.y)};
   if(air){for(const [side,name]of [[-1,'left'],[1,'right']]){const local={x:side*m.footX,y:-7},world=VF.Kinematics.localToWorld(p,local,id);result[name]={...world,local,space:'actor',angle:side*.06,contact:false};}state.feet=result;p.feetWorld=result;p.groundY=ground;return result;}
   if(id==='pink'){
    // A plush settles on both broad paws. Even legacy walk requests are resolved
    // as a paired support, never an alternating human heel-toe cycle.
    for(const [side,name]of [[-1,'left'],[1,'right']]){
     const rest=p.x+side*m.footX*p.s,previous=state.feet?.[name],planted=!air&&walking>.05&&previous?.contact&&!reset&&Math.abs(previous.x-rest)<18*p.s;
     result[name]={x:clamp(planted?previous.x:rest,view.frame.x+40*p.s,view.frame.x+view.frame.w-40*p.s),y:air?p.y-7*p.s:ground-25*p.s,angle:side*(air?.075:.035),contact:!air};
    }state.feet=result;p.feetWorld=result;p.groundY=ground;return result;
   }
   for(const [side,name]of [[-1,'left'],[1,'right']]){
    const q=(phase+(side<0?0:.5))%1,contact=walking>.05&&q<.61&&!air,rest=p.x+side*m.footX*p.s,previous=state.feet?.[name];let x=rest,y=ground-25*p.s,angle=side*.10;
    if(air){x=rest;y=p.y-5*p.s;angle=side*.2;}
    else if(walking>.05){if(contact){x=previous?.contact&&!reset?previous.x:rest+13*p.s;y=ground-25*p.s;angle=side*.10+(q/.61-.5)*.13;}else{const u=clamp((q-.61)/.39);x=rest+mix(-11,11,ease(u))*p.s;y=ground-25*p.s-Math.sin(u*Math.PI)*12*p.s;angle=side*.1+Math.sin(u*Math.PI)*.22;}}
    x=clamp(x,view.frame.x+40*p.s,view.frame.x+view.frame.w-40*p.s);result[name]={x,y,angle,contact:air?false:walking>.05?contact:true};
   }
   state.feet=result;p.feetWorld=result;p.groundY=ground;return result;
  }
  resolve(scene,time,view,{dt=0,reduced=false,paused=false,seek=false}={}){
   const key=[view.w,view.h,view.frame.w,view.frame.h].join(':'),jump=seek||this.lastTime===null||time<this.lastTime||Math.abs(time-this.lastTime)>.25,resize=key!==this.layoutKey,changed=this.serial!==this.lastSerial,snap=jump||reduced||(paused&&changed);this.layoutKey=key;
   this.clips=this.clips.filter(c=>curves[c.name]?.hold||time-c.at<curves[c.name].duration+.5);
   for(const [id,p]of Object.entries(scene.actors)){
    const m=VF.CharacterModels[id],state=this.states[id]??={ears:{},feet:{}};
    p.sit??=0;p.eyeOpen??=1;
    for(const clip of this.clips){if(clip.id!==id)continue;const spec=curves[clip.name],age=time-clip.at;if(age<0)continue;const weight=clip.strength*(spec.hold?ease(age/.4):pulse(0,.35,spec.duration-.45,spec.duration,age));
     for(const [channel,keys]of Object.entries(spec.tracks)){let value=sample(keys,age);if(id==='taupe'&&channel==='earL'&&clip.name==='saludo')value=-value*.7;set(p,channel,mix(get(p,channel)??(channel==='eyeOpen'?1:0),value,weight));}
     if(clip.name==='saludo'){
      if(id==='pink'){p.head-=weight*.045;p.crouch=(p.crouch||0)+weight*.16;p.earL+=weight*.10;p.earR-=weight*.06;}
      else{p.arms.right={x:mix(p.arms.right.x,65,weight),y:mix(p.arms.right.y,-94+Math.sin(age*3)*3,weight)};}
     }
    }
    for(const channel of ['earL','earR','earTip']){const target=clamp(p[channel]||0,-.78,.65);let s=state.ears[channel];if(!s||snap)s={x:target,v:0};else if(dt>0&&time!==this.lastTime)s=spring(s,target,dt,m.earFrequency*(channel==='earTip'?.75:1),m.earDamping);state.ears[channel]=s;p[channel]=clamp(s.x,-.80,.72);}
    p.head=clamp(p.head||0,-.4,.4);p.turn=clamp(p.turn||0,-1,1);p.breath=reduced?0:Math.sin(time*1.7+(id==='pink'?0:1))*(id==='pink'?.004:.006);
    const walking=p.gaitWeight??(['walking-together','through-the-leaves'].includes(scene.beat)?1:0);this.feet(id,p,time,walking,view,jump||resize);
   }
   this.lastTime=time;this.lastSerial=this.serial;if(dt>0)this.steps++;return scene;
  }
  capture(){return copy({states:this.states,clips:this.clips,serial:this.serial,lastTime:this.lastTime,layoutKey:this.layoutKey});}
  restore(value){this.reset();if(!value||!Number.isFinite(value.lastTime)||!Array.isArray(value.clips))return;this.clips=value.clips.filter(c=>VF.CharacterModels[c.id]&&curves[c.name]&&Number.isFinite(c.at)).slice(-8);for(const id of ['pink','taupe']){const ears={};for(const key of ['earL','earR','earTip']){const s=value.states?.[id]?.ears?.[key];if(s&&Number.isFinite(s.x)&&Number.isFinite(s.v)&&Math.abs(s.x)<2&&Math.abs(s.v)<50)ears[key]={x:s.x,v:s.v};}const feet={};for(const name of ['left','right']){const f=value.states?.[id]?.feet?.[name];if(f&&Number.isFinite(f.x)&&Number.isFinite(f.y)&&Number.isFinite(f.angle)&&Math.abs(f.x)<100000&&Math.abs(f.y)<100000)feet[name]={x:f.x,y:f.y,angle:f.angle,contact:!!f.contact};}this.states[id]={ears,feet};}this.layoutKey=typeof value.layoutKey==='string'?value.layoutKey.slice(0,100):'';this.lastTime=value.lastTime;this.lastSerial=this.serial;}
  state(){return{steps:this.steps,active:this.clips.map(c=>({id:c.id,name:c.name})),supported:Object.keys(curves),anatomies:Object.keys(VF.CharacterModels)};}
 }
 VF.MotionLibrary={clips:curves,sample};VF.RigAnimator=RigAnimator;
})();
