/* Physical gallery coordinates: three bays on one panoramic plate, one cast, one camera. */
(() => {
 const Base=VF.VineyardScene,{actor,hop}=VF.JourneyActing,{span,mix,clamp,ease}=VF.math;
 const axes={'el-vestibulo-de-las-historias':[.15,.21],'el-museo-de-la-noche':[.21,.49],'dos-sonrisas':[.49,.79],'la-noche-en-la-pared':[.79,.79]};
 class GalleryTheatre extends Base{
  pose(shot,time,v,o={}){
   if(shot.sceneStage==='painting')return VF.PaintingTheatre.pose.call(this,shot,time,v,o);if(shot.sceneStage==='garden')return VF.GardenPromenade.pose.call(this,shot,time,v,o);if(shot.sceneStage==='ceremony')return VF.CeremonyTheatre.pose.call(this,shot,time,v,o);
   if(shot.set!=='gallery')return super.pose(shot,time,v,o);
   const b=o.beat||this.narrativeFrame,plan=b.actionPlan,age=b.actionPending?0:o.reduced?plan.duration:Math.min(b.age,plan.duration),t=plan.start+age,beats=VF.GuardianScript[shot.id],depart=beats.find(b=>b.departure)?.actionPlan.start||999;
   const [from,to]=axes[shot.id],travel=span(depart,depart+4.2,t),f=v.frame,im=VF.JourneyAssets.image('gallery'),scale=v.h/im.height,W=im.width*scale,H=v.h;
   const ground=H*.855,h=Math.min(f.w*.61,H*.29),p=actor('pink',from*W-v.w*.19,ground+3,h*.82),g=actor('taupe',from*W+v.w*.19,ground,h),cast={pink:p,taupe:g},entry=shot.id==='el-vestibulo-de-las-historias',total=(to-from)*W;
   // Feet and roots move through the room; the lens follows their actual midpoint.
   // Between hops, both the scenery and every world-space support remain at rest.
   for(const [i,a]of [p,g].entries()){
    const initial=entry?total*.5:0;if(entry)for(let k=0;k<2;k++)hop(a,t,.15+k*1.25+i*.1,1+k*1.25+i*.1,initial/2,14,'gallery-entry-hop');
    const count=total?5:2;for(let k=0;k<count;k++)hop(a,t,depart+.15+k*.80+i*.10,depart+.80+k*.80+i*.10,(total-initial)/count,total?20:10,'gallery-room-traversal');
   }
   let axis=(p.x+g.x)/(2*W);const source=o.entryPose;if(source?.set==='gallery'&&o.entryProgress<1)axis=mix(source.lens.cx,axis,ease(o.entryProgress));
   const left=clamp(v.w*.5-axis*W,v.w-W,0);for(const a of Object.values(cast))a.x+=left;
   p.lookY=g.lookY=-.6;p.head=.1;g.head=-.1;
   if(shot.id==='el-museo-de-la-noche'){
    const gasp=b.id==='arrival'?span(.15,1,age)*(1-span(2.6,4.2,age)):0,imitate=b.id==='mimic'?span(.3,1.2,age)*(1-span(3.2,4.5,age)):0;
    p.earL=-.28*gasp;p.earR=.3*gasp;p.arms={left:{x:-38,y:-150*gasp-70*(1-gasp)},right:{x:38,y:-150*gasp-70*(1-gasp)}};p.crouch=.12*gasp;g.earTip=.16*imitate;g.arms.left={x:-58,y:-88-55*imitate};g.head+=.19*imitate;
   }
   const photo=b.view==='photo';if(photo)p.opacity=g.opacity=0;
   if(shot.id==='dos-sonrisas'&&!photo){p.head=-.14;g.head=.14;p.sit=g.sit=.72;if(b.id==='laugh')hop(p,age,.35,1.25,0,13,'a-small-smile-hop');}
   for(const [id,a]of Object.entries(cast)){a.lookX=id==='pink'?.4:-.4;a.gaitWeight=0;const z=VF.rigBounds[id];a.x=clamp(a.x,f.x-z.x*a.s+3,f.x+f.w-(z.x+z.w)*a.s-3);a.blink=o.paused||o.reduced?0:(time+(id==='pink'?1:3))%6.4<.13?Math.sin((time+(id==='pink'?1:3))%6.4/.13*Math.PI):0;}
   const album=VF.AlbumObject.pose(this,cast,b,shot,v,{left,W,H,axis},t);
   const scene={actors:cast,world:'museum',chapter:shot.mode,memory:shot.memory,album,set:'gallery',beat:b.id,guardian:b,biome:0,leaf:{visible:0},box:{visible:0},light:{x:v.w*.68,y:H*.35,strength:.8},lens:{zoom:1,cx:axis,cy:.5,travel},gallery:album?.gallery||{left,W,H,axis},contact:false,actionReady:!b.actionPending&&(o.reduced||age>=plan.duration)&&!Object.values(cast).some(a=>a.airborne),performance:{name:plan.gesture,scoreTime:t,phase:b.actionPending?'awaiting-touch':'acting'}};
   this.blendEntry(scene,source,ease(clamp(o.entryProgress??1)),v);if(this.last?.set==='gallery'&&(o.entryProgress??1)>=1){const old=this.last.gallery,now=scene.gallery;for(const state of Object.values(this.animator.states))for(const foot of Object.values(state.feet||{}))if(foot.contact){foot.x=now.left+(foot.x-old.left)/old.W*now.W;foot.y=(now.top||0)+(foot.y-(old.top||0))/old.H*now.H;}}this.animator.resolve(scene,time,v,{dt:o.dt||0,reduced:o.reduced,paused:o.paused,seek:this.seekPending});this.seekPending=false;this.last=scene;return scene;
  }
  background(p,s,t,v,profile,reduced){
   if(s.sceneStage==='painting')return VF.PaintingTheatre.background.call(this,p,s,t,v,profile,reduced);if(s.sceneStage==='garden')return VF.GardenPromenade.background.call(this,p,s,t,v,profile,reduced);if(s.sceneStage==='ceremony')return VF.CeremonyTheatre.background.call(this,p,s,t,v,profile,reduced);
   if(s.set!=='gallery')return super.background(p,s,t,v,profile,reduced);
   const {left,W,H}=s.gallery,im=VF.JourneyAssets.image('gallery');p.drawImage(im,left,s.gallery.top||0,W,H);this.interactionTargets=[];this.flowerPoint=null;delete this.stats.photo;delete this.stats.jewel;
   this.stats.world='museum';this.stats.set='gallery';this.stats.matte={set:'gallery',x:left,y:s.gallery.top||0,w:W,h:H};this.stats.gallery={axis:s.gallery.axis,panorama:true,floor:H*.855,bays:3};
   const drawWork=(id,cx,cy,width,title)=>{
    const image=VF.JourneyAssets.image(id),w=width*W,h=w*image.naturalHeight/image.naturalWidth,x=left+cx*W-w/2,y=(s.gallery.top||0)+cy*H-h/2;if(x>v.w+20||x+w< -20)return null;
    p.save();p.shadowColor='#080d15b0';p.shadowBlur=14;p.shadowOffsetY=7;p.fillStyle='#8c6535';p.fillRect(x-12,y-12,w+24,h+24);p.shadowColor='transparent';p.strokeStyle='#d9b875';p.lineWidth=3;p.strokeRect(x-7,y-7,w+14,h+14);p.fillStyle='#292324';p.fillRect(x-2,y-2,w+4,h+4);p.drawImage(image,x,y,w,h);p.restore();
    p.fillStyle='#eee0c7';p.font='10px FilmSans';p.textAlign='center';p.fillText(title,x+w/2,y+h+31);return{x,y,w,h,source:id,authentic:true,aspect:image.naturalWidth/image.naturalHeight};
   };
   const scream=drawWork('scream',.205,.405,.135,'Edvard Munch · El grito · 1893'),starry=s.interactivePainting?null:drawWork('starry',.79,.405,.145,'Vincent van Gogh · La noche estrellada · 1889');
   this.stats.works=[scream,starry].filter(Boolean);this.stats.painting=starry||scream;
   const b=s.guardian,lamp={x:clamp((scream?.x||30)-12,30,v.w-30),y:Math.max(100,(scream?.y||200)-25)},lit=VF.GuardianScript['el-museo-de-la-noche'].findIndex(x=>x.id===b.id)>=2&&!b.actionPending;
   if(scream){p.save();p.globalAlpha=lit?.07:.29;p.fillStyle='#071321';p.fillRect(scream.x,scream.y,scream.w,scream.h);p.restore();if(lit){const glow=p.createRadialGradient(lamp.x,lamp.y,0,lamp.x,lamp.y,v.w*.62);glow.addColorStop(0,'#ffe0a72e');glow.addColorStop(1,'#ffe0a700');p.fillStyle=glow;p.fillRect(0,70,v.w,H*.6);}this.interactionTargets.push({kind:'lamp',...lamp,r:44});p.fillStyle=lit?'#ffe6b3':'#bda777';p.beginPath();p.arc(lamp.x,lamp.y,8,0,Math.PI*2);p.fill();this.stats.lamp={...lamp,lit};}
   if(starry)this.interactionTargets.push({kind:'painting',x:starry.x+starry.w/2,y:starry.y+starry.h/2,r:Math.max(44,starry.w*.5)});
   if(s.memory===1&&s.album.lift<=.001)VF.AlbumObject.draw(this,p,s,v);
   s.fairyTarget=starry&&s.guardian.id!=='leave'?{x:starry.x+starry.w*.8,y:starry.y-16}:scream?{x:scream.x+scream.w*.83,y:scream.y-18}:{x:v.w*.68,y:H*.42};
  }
  shadow(p,a,...args){if(this.last?.sceneStage==='painting')return;return super.shadow(p,a,...args);}
  afterActors(p,s,t,v,...args){if(s.sceneStage==='painting')return VF.PaintingTheatre.afterActors.call(this,p,s,t,v,...args);if(s.sceneStage==='garden')return VF.GardenPromenade.afterActors.call(this,p,s,t,v,...args);if(s.sceneStage==='ceremony')return VF.CeremonyTheatre.afterActors.call(this,p,s,t,v,...args);if(s.album&&s.album.lift>.001)VF.AlbumObject.draw(this,p,s,v);if(s.set!=='gallery')return super.afterActors(p,s,t,v,...args);}
  foreground(p,s,t,v,...args){if(s.sceneStage==='painting')return;if(s.sceneStage==='garden')return VF.GardenPromenade.foreground.call(this,p,s,t,v,...args);if(s.sceneStage==='ceremony')return VF.CeremonyTheatre.foreground.call(this,p,s,t,v,...args);if(s.set!=='gallery')return super.foreground(p,s,t,v,...args);}
 }
 VF.GalleryRoom={background:GalleryTheatre.prototype.background};VF.VineyardScene=GalleryTheatre;
})();
