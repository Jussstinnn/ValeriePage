/* Private original photos: decoded locally, never sent to a network service. */
(() => {
 const pictures=new Map(),pending=new Map();VF.MemoryAssets={async load(id){if(pictures.has(id))return pictures.get(id);if(pending.has(id))return pending.get(id);const item=VF.content.memories[id];if(!item)throw new Error('Recuerdo no disponible.');const work=(async()=>{const img=new Image();img.decoding='async';const source=window.VF_PERSONAL_DATA?.[id]||item.file;try{img.src=await VF.ResourceCache.url(source);await img.decode();}catch(e){VF.ResourceCache.drop(source);throw e;}pictures.set(id,img);return img;})();pending.set(id,work);try{return await work;}finally{pending.delete(id);}},image:id=>pictures.get(id),retain(ids){const keep=new Set(ids.filter(Number.isInteger));for(const key of pictures.keys())if(!keep.has(+key)){pictures.delete(key);VF.ResourceCache.drop(window.VF_PERSONAL_DATA?.[key]||VF.content.memories[key].file);}},stats:()=>({images:pictures.size,bytes:[...pictures.values()].reduce((n,i)=>n+i.naturalWidth*i.naturalHeight*4,0),local:true})};
 const StageBase=VF.SceneStage,WorldBase=VF.SceneEnvironment,{mix,span,clamp,ellipse}=VF.math;
 class IntimateStage extends StageBase{
  describe(shot){return shot.mode==='letter'?shot.line:super.describe(shot);}
  pose(shot,time,view,options={}){
   if(!['memory','letter'].includes(shot.mode))return super.pose(shot,time,view,options);
   const from=this.transition,t=options.reduced?Math.max(shot.hold,time):time,f=view.frame,a=this.geometry(view,'together'),letter=shot.mode==='letter',h=Math.min(letter?65:f.h*.24,f.w*.25);
   for(const [id,p]of Object.entries(a)){p.id=id;p.s=h*(id==='pink'?.82:1)/VF.rigBounds[id].h;p.x=f.x+f.w*(id==='pink'?.13:.85);p.y=p.floor=f.y+f.h*.99;p.sit=.80;p.head=id==='pink'?.09:-.07;p.turn=0;p.gaitWeight=0;p.airborne=0;p.depth=id==='pink'?2:1;p.blink=options.reduced?0:((t+(id==='pink'?1:3))%6<.16?Math.sin(((t+(id==='pink'?1:3))%6)/.16*Math.PI):0);const b=VF.rigBounds[id];p.x=clamp(p.x,f.x-b.x*p.s+5,f.x+f.w-(b.x+b.w)*p.s-5);p.y=clamp(p.y,f.y-b.y*p.s+5,f.y+f.h-(b.y+b.h)*p.s-5);}
   const scene={actors:a,world:shot.world,chapter:shot.mode,memory:shot.memory,still:options.paused||options.reduced,biome:0,beat:letter?'words-held-in-a-page':'a-memory-without-hurry',light:{x:f.x+f.w*.5,y:f.y+f.h*.4,strength:letter?.5:.18},lens:{zoom:1,cx:.5,cy:.5,travel:0},leaf:{visible:0,open:1},box:{visible:0,reveal:0},flower:0,contact:false,response:0,focus:Math.max(0,...this.events.filter(e=>e.kind==='memory').map(e=>span(0,1.3,t-e.at))),folio:0};
   this.transition=null;this.finish(scene,shot,t,view,options);return this.passage(scene,from,options.transition??1);
  }
 }
 class IntimateWorld extends WorldBase{
  prepareShot(shot){if(['memory','letter'].includes(shot.mode))return;super.prepareShot(shot);}
  background(p,scene,t,view,profile,reduced){
   if(!['memory','letter'].includes(scene.chapter))return super.background(p,scene,t,view,profile,reduced);
   const {w,h,frame:f}=view,letter=scene.chapter==='letter';this.interactionTargets=[];this.flowerPoint=null;const bg=p.createLinearGradient(0,0,w,h);bg.addColorStop(0,letter?'#f5ecde':'#172631');bg.addColorStop(.58,letter?'#eee4d4':'#292d37');bg.addColorStop(1,letter?'#e4d9c7':'#17332f');p.fillStyle=bg;p.fillRect(0,0,w,h);this.stats.world=scene.world;this.stats.mattes=[];delete this.stats.painting;delete this.stats.bouquet;delete this.stats.transition;
   if(letter){p.save();p.strokeStyle='#b4aa8559';p.lineWidth=.8;p.beginPath();const x=f.x+3;p.moveTo(x,f.y-12);p.bezierCurveTo(x-8,f.y+f.h*.2,x+5,f.y+f.h*.7,x,f.y+f.h+6);p.globalAlpha=.20;p.stroke();p.restore();this.stats.reading=true;return;}
   const img=VF.MemoryAssets.image(scene.memory);if(!img)throw new Error('El recuerdo todavía no está preparado.');const availableH=f.h*.72,maxW=f.w*.96,scale=Math.min(maxW/img.naturalWidth,availableH/img.naturalHeight)*mix(.96,1,scene.focus||0),iw=img.naturalWidth*scale,ih=img.naturalHeight*scale,x=f.x+(f.w-iw)/2,y=f.y+Math.max(3,(availableH-ih)/2),q=reduced||scene.still?1:span(.15,3.0,t);
   p.save();if(scene.memory===0){p.beginPath();for(let j=0;j<18;j++){const v=clamp(q*1.4-j/18*.4);if(v>0)p.rect(x,y+ih*j/18,iw,ih/18*v+.3);}p.clip();p.drawImage(img,x,y,iw,ih);}
   else if(scene.memory===1){p.beginPath();p.rect(x+iw*(1-q)/2,y,iw*q,ih);p.clip();p.drawImage(img,x,y,iw,ih);}
   else p.drawImage(img,x,y,iw,ih);p.restore();
   p.strokeStyle='#d4bca355';p.lineWidth=.7;const margin=7;for(const [xx,yy,sx,sy]of [[x-margin,y-margin,1,1],[x+iw+margin,y+ih+margin,-1,-1]]){p.beginPath();p.moveTo(xx+16*sx,yy);p.lineTo(xx,yy);p.lineTo(xx,yy+16*sy);p.stroke();}
   this.interactionTargets=[{kind:'memory',x:x+iw/2,y:y+ih/2,r:Math.max(30,Math.min(iw,ih)*.45)}];this.stats.photo={id:scene.memory,x,y,w:iw,h:ih,nativeW:img.naturalWidth,nativeH:img.naturalHeight,reveal:scene.memory===2?1:q,originalBytes:true};this.stats.personal=VF.MemoryAssets.stats();this.stats.reading=false;
  }
  afterActors(p,s,t,v,profile,reduced){if(!['memory','letter'].includes(s.chapter))super.afterActors(p,s,t,v,profile,reduced);}
  foreground(p,s,t,v,profile,reduced){if(!['memory','letter'].includes(s.chapter))return super.foreground(p,s,t,v,profile,reduced);this.stats.bufferBytes=VF.Art.stats().decodedBytes+VF.MemoryAssets.stats().bytes;}
 }
 VF.SceneStage=IntimateStage;VF.SceneEnvironment=IntimateWorld;
})();
