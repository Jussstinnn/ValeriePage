/* The real framed artwork is the sole surface; the gallery remains the physical world. */
(() => {
 const {mix,span,ease,clamp}=VF.math;
 function target(v){const image=VF.JourneyAssets.image('starry'),top=Math.max((v.safe?.top||0)+176,v.story.y+v.story.h+8),bottom=v.h-v.safe.bottom-152,ratio=image.naturalWidth/image.naturalHeight,w=Math.min(v.w-24,Math.max(60,bottom-top)*ratio),h=w/ratio;return{x:(v.w-w)/2,y:top,w,h};}
 VF.PaintingTheatre={
  target,
  pose(shot,time,v,o={}){
   const b=o.beat||this.narrativeFrame,plan=b.actionPlan,age=b.actionPending?0:o.reduced?plan.duration:Math.min(b.age,plan.duration),f=v.frame,im=VF.JourneyAssets.image('gallery'),baseW=im.width*v.h/im.height,goal=target(v),from=o.entryPose?.portal||goal,q=ease(clamp(o.entryProgress??1)),r={};for(const k of ['x','y','w','h'])r[k]=mix(from[k],goal[k],q);
   const cameraZoom=r.w/(.145*baseW),W=baseW*cameraZoom,H=v.h*cameraZoom,left=r.x+r.w/2-.79*W,top=r.y+r.h/2-.405*H,bottom=v.h-v.safe.bottom-152,available=Math.max(0,bottom-(r.y+r.h)-12),height=Math.min(f.w*.30,available*.84),floor=r.y+r.h+height+9,cast={};
   for(const id of ['pink','taupe']){const a=VF.JourneyActing.actor(id,v.w*(id==='pink'?.28:.72),floor,height*(id==='pink'?.82:1));a.sit=.68;a.head=id==='pink'?-.12:.10;a.lookY=-.8;a.lookX=id==='pink'?.4:-.4;a.opacity=height<70?0:.42;a.blink=o.paused||o.reduced?0:(time+(id==='pink'?1:3))%6.3<.14?1:0;if(b.id==='earned'||b.id==='wish'){a.head+=.12*span(0,2,b.age);a.earTip=.10*Math.sin(Math.min(3,b.age));}cast[id]=a;}
   const s={actors:cast,world:'museum',chapter:shot.mode,sceneStage:'painting',set:'gallery',interactivePainting:true,gallery:{left,top,W,H,axis:.79,cameraZoom},guardian:b,beat:b.id,biome:0,lens:{zoom:cameraZoom,cx:.79,cy:.405,travel:0},leaf:{visible:0},box:{visible:0},light:{x:r.x+r.w*.84,y:r.y-25,strength:.8},paintingSurface:r,paintingInputActive:b.actionPending&&b.interaction?.target==='sky',actionReady:!b.actionPending&&(o.reduced||age>=plan.duration),performance:{name:plan.gesture,phase:b.actionPending?'painting-invitation':'contemplation'},renderLayers:['gallery-panorama','authentic-starry-night','artwork-local-overlay','guardian-reflections-beside-frame','gilded-frame']};
   this.blendEntry(s,o.entryPose,q,v);this.animator.resolve(s,time,v,{dt:o.dt||0,reduced:o.reduced,paused:o.paused,seek:this.seekPending});this.seekPending=false;this.last=s;return s;
  },
  background(p,s,t,v,profile,reduced){
   VF.GalleryRoom.background.call(this,p,{...s,set:'gallery',sceneStage:null},t,v,profile,reduced);const r=s.paintingSurface,image=VF.JourneyAssets.image('starry');p.save();p.fillStyle='#8a6438';p.shadowColor='#07111dc0';p.shadowBlur=15;p.shadowOffsetY=6;p.fillRect(r.x-9,r.y-9,r.w+18,r.h+18);p.shadowColor='transparent';p.strokeStyle='#d9b980';p.lineWidth=2;p.strokeRect(r.x-5,r.y-5,r.w+10,r.h+10);p.drawImage(image,r.x,r.y,r.w,r.h);p.restore();this.stats.painting={...r,authentic:true,source:'supplied-starry-night',unchangedPixels:true,localInput:true};this.stats.renderLayers=[...s.renderLayers];this.stats.guardianReflections={outsideArtwork:true,opacity:.42,noFloor:true};this.stats.world='museum';this.interactionTargets=[];this.projection=null;s.fairyTarget={x:r.x+r.w*.90,y:r.y-45};
  },
  afterActors(){}
 };
})();
