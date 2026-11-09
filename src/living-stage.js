/* F4: new worlds continue the approved cast; character models/rig are immutable. */
(() => {
 const Base=VF.SceneStage,{mix,clamp,span,pulse,ease}=VF.math,copy=o=>JSON.parse(JSON.stringify(o));
 const blend=(a,b,q)=>typeof b==='number'?mix(typeof a==='number'?a:b,b,q):b&&typeof b==='object'?Object.fromEntries(Object.keys(b).map(k=>[k,blend(a?.[k],b[k],q)])):b;
 class LivingStage extends Base{
  begin(){this.transition=this.last?copy(this.last):null;if(this.transition)delete this.transition.passage;}
  event(kind,time,point){if(kind==='flower'){const last=this.events.filter(e=>/^flower-\d+$/.test(e.kind)).at(-1),id=((last?+last.kind.slice(7):0)+1)%14;kind='flower-'+id;}super.event(kind,time,point);if(kind==='forest')this.act('escucha','taupe',time);if(kind==='painting'||kind==='wish')this.act('asombro','pink',time);}
  selected(){const e=this.events.filter(e=>/^flower-\d+$/.test(e.kind)).at(-1);return e?clamp(+e.kind.slice(7),0,13):0;}
  describe(shot){return ['garden','petal'].includes(shot.mode)&&(shot.mode==='petal'||this.events.some(e=>e.kind.startsWith('flower-')))?shot.line+' '+VF.content.dedications[this.selected()]:shot.line;}
  passage(scene,from,q){if(from&&q<1&&(from.world||'vineyard')!==scene.world)scene.passage={from:from.world||'vineyard',to:scene.world,progress:ease(q),source:from};this.last=copy(scene);return scene;}
  pose(shot,time,view,options={}){
   const source=this.transition,q=options.transition??1;
   if(!shot.world){const scene=super.pose(shot,time,view,options);scene.world='vineyard';return this.passage(scene,source,q);}
   const {reduced=false,dt=0}=options,t=reduced?Math.max(shot.hold,time):time,f=view.frame,portrait=view.kind==='portrait',mode=shot.mode,a=this.geometry(view,'together'),p=a.pink,g=a.taupe;
   const small=['museum','painting','sky'].includes(mode),garden=['garden','petal'].includes(mode),height=Math.min(f.h*(small?.38:garden?.27:mode==='forest'?.54:.73),f.w*(small?.46:garden?.39:.83));
   g.s=height/VF.rigBounds.taupe.h;p.s=height*.82/VF.rigBounds.pink.h;g.x=f.x+f.w*(garden?.84:.68);p.x=f.x+f.w*(garden?.14:.29);p.y=p.floor=f.y+f.h*.98;g.y=g.floor=f.y+f.h*(small||garden?.98:.88);
   for(const [id,v]of Object.entries(a)){v.id=id;v.gaitWeight=0;v.airborne=0;v.turn=id==='pink'?.22:-.18;v.head=id==='pink'?.08:-.08;v.depth=id==='pink'?2:1;v.lookX=id==='pink'?.6:-.6;v.blink=reduced?0:((t+(id==='pink'?1.1:3.1))%6.2<.17?Math.sin(((t+(id==='pink'?1.1:3.1))%6.2)/.17*Math.PI):0);}
   const event=this.events.at(-1),age=event?t-event.at:100,response=pulse(0,.6,3.2,4.8,age),lens={zoom:1.06,cx:.46,cy:.54,travel:reduced?0:span(0,12,t)*.018};let beat=mode;
   if(mode==='path'){
    const hop=(v,start)=>{const z=clamp((t-start)/.85),flight=t>start&&t<start+.85?Math.sin(z*Math.PI):0;v.x+=f.w*.065*span(start,start+.85,t);v.y-=flight*12;v.airborne=flight>.001?1:0;v.crouch=pulse(start-.4,start-.1,start,start+.08,t)*.38+pulse(start+.85,start+.99,start+1.12,start+1.5,t)*.26;v.earTip=flight*.16;};hop(g,1.9);hop(p,3.4);g.head-=pulse(3.3,4,5.2,6.3,t)*.14;p.earL-=pulse(3.4,3.8,4.25,4.9,t)*.20;beat=t<3?'the-larger-plush-goes-first':t<5?'the-small-one-follows':'waiting-together-at-the-roots';
   }
   if(mode==='forest'){lens.zoom=1.20;lens.cx=portrait?.76:.63;g.x=f.x+f.w*.59;p.x=f.x+f.w*.24;g.y=g.floor=f.y+f.h*.98;g.head=-.19;p.head=-.08;g.earL=.38*span(1,3,t);g.earTip=pulse(3,3.6,4.3,5.3,t)*.22;p.head-=response*.08;beat=t<3?'the-long-ear-finds-a-presence':'a-forest-light-recognises-you';}
   if(small){lens.cx=.5;lens.cy=.50;lens.zoom=1.02;g.y=g.floor=p.y=p.floor=f.y+f.h*.99;p.head=-.16;g.head=-.17;p.lookY=g.lookY=-.8;if(mode==='sky'){lens.travel=0;p.sit=g.sit=span(.5,2.4,t);p.head=-.12;g.head=-.10;beat='a-wish-kept-between-two-paws';}else beat=mode==='painting'?'the-painting-becomes-a-place':'two-visitors-under-a-painted-sky';}
   if(garden){lens.travel=0;lens.cx=.52;lens.cy=.62;lens.zoom=1.08;p.head=.14;g.head=-.13;g.sit=p.sit=.55;g.lookY=p.lookY=-.4;p.earR=.12;beat=mode==='petal'?'one-lily-a-whole-dedication':'fourteen-lilies-unfurl-in-order';}
   for(const [id,v]of Object.entries(a)){const b=VF.rigBounds[id];v.x=clamp(v.x,f.x-b.x*v.s+5,f.x+f.w-(b.x+b.w)*v.s-5);v.y=clamp(v.y,f.y-b.y*v.s+5,f.y+f.h-(b.y+b.h)*v.s-5);}
   if(mode==='forest'){g.handsWorld={right:VF.Kinematics.localToWorld(g,{x:55,y:-95},'taupe')};p.handsWorld={right:VF.Kinematics.localToWorld(p,{x:38,y:-85},'pink')};}
   const projection=VF.Matte.cover(1536,1024,view,lens),forestPoint={x:clamp(projection.x+projection.w*.80,f.x+f.w*.45,f.x+f.w*.87),y:clamp(projection.y+projection.h*.46,f.y+f.h*.20,f.y+f.h*.62)};
   let light=this.updateLight(dt,'together',t,view,a,reduced,forestPoint);if(!this.drag){const x=mode==='forest'?forestPoint.x:f.x+f.w*.52,y=mode==='forest'?forestPoint.y:f.y+f.h*(small?.34:garden?.43:.45);light={x,y,strength:.78+response*.45};this.light.x=(x-f.x)/f.w;this.light.y=(y-f.y)/f.h;}
   const scene={actors:a,world:shot.world,biome:shot.biome,cameraX:0,cameraY:0,distance:0,flower:0,flowerPoint:{x:0,y:0},beat,light,leaf:{visible:0,open:1},box:{visible:0,reveal:0},contact:false,chapter:mode,lens,forestPoint,response,selected:this.selected(),portal:mode==='painting'?Math.max(span(1.3,10.5,t),event?.kind==='painting'?span(0,3,age):0):mode==='sky'?1:0,wish:mode==='sky'?Math.max(span(2,7,t),event?.kind==='wish'?response:0):0};
   let result=scene;if(source&&q<1)result=blend(source,scene,ease(q));else this.transition=null;
   result.world=shot.world;this.finish(result,shot,t,view,options);return this.passage(result,source,q);
  }
 }
 VF.SceneStage=LivingStage;
})();
