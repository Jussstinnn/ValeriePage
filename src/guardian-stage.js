/* Scene-specific composition, applied before the original animator and planted-feet solver. */
(() => {
 const Base=VF.SceneStage,{mix,clamp,span}=VF.math;
 class GuardianStage extends Base{
  act(name,id,time){if(VF.GuardianActing.library.includes(name)){this.events.push({kind:'guardian:'+name,at:time,id:id==='beige'?'taupe':id});this.events=this.events.slice(-6);return true;}return super.act(name,id,time);}
  pose(shot,t,view,options={}){
   const b=this.narrativeFrame;
   if(shot.mode==='memory'||shot.mode==='letter'&&b?.view!=='read'){
    const a=this.geometry(view,'together'),f=view.frame,s={actors:a,world:shot.mode==='memory'?['garden','museum','forest'][shot.memory]:'forest',chapter:shot.mode,memory:shot.memory,biome:0,beat:b?.id||'guardian',light:{x:f.x+f.w*.5,y:f.y+f.h*.45,strength:.65},lens:{zoom:1.06,cx:.5,cy:.58,travel:0},leaf:{visible:0,open:1},box:{visible:0,reveal:0},flower:0,contact:false};this.transition=null;return this.finish(s,shot,t,view,options);
   }
   return super.pose(shot,t,view,options);
  }
  cast(scene,view,beat,{height=.70,floor=.96,opacity=1}={}){
   const f=view.frame,h=Math.min(f.h*height,f.w*.59),previous=beat.from?.view||beat.view,currentPhoto=beat.view==='photo',oldPhoto=previous==='photo',visibility=mix(oldPhoto?0:1,currentPhoto?0:1,beat.blend)*opacity;
   for(const [id,p]of Object.entries(scene.actors)){const small=id==='pink';p.id=id;p.s=h*(small?.82:1)/VF.rigBounds[id].h;p.x=f.x+f.w*.5+h*(small?-.42:.38);p.y=p.floor=f.y+f.h*floor;p.head=small?.04:-.05;p.turn=small?.08:-.08;p.sit=.40;p.lean=0;p.crouch=0;p.airborne=0;p.gaitWeight=0;p.stride=0;p.depth=small?2:1;p.opacity=visibility;delete p.handsWorld;const bounds=VF.rigBounds[id];p.x=clamp(p.x,f.x-bounds.x*p.s+6,f.x+f.w-(bounds.x+bounds.w)*p.s-6);p.y=p.floor=clamp(p.y,f.y-bounds.y*p.s+5,f.y+f.h-(bounds.y+bounds.h)*p.s-5);p.blink=beat.age%6.5>(small?4.3:2.7)&&beat.age%6.5<(small?4.46:2.86)?Math.sin((beat.age%6.5-(small?4.3:2.7))/.16*Math.PI):0;}
   return h;
  }
  pageLayout(view,memory,kind){const f=view.frame,img=VF.MemoryAssets.image(memory),aspect=img.naturalWidth/img.naturalHeight,hHero=Math.min(f.h*.70,f.w*.59),photo=kind==='photo';const scale=Math.min(f.w*(photo?.94:.49)/img.naturalWidth,(photo?f.h*.94:hHero*.70)/img.naturalHeight),w=img.naturalWidth*scale,h=img.naturalHeight*scale;
   return{x:f.x+(photo?f.w*(memory===0?.48:memory===1?.53:.50):f.w*.5-hHero*.04),y:photo?f.y+f.h*.49:f.y+f.h*.96-hHero*.18-h*.45,w,h,angle:photo?0:memory===0?-.045:memory===1?.04:0};}
  finish(scene,shot,t,view,options={}){
   let b=this.narrativeFrame;const cueTime=options.storyTime??t,cue=this.events.filter(e=>e.kind.startsWith('guardian:')&&cueTime-e.at>=0&&cueTime-e.at<4).at(-1);if(cue)b={...b,acting:cue.kind.slice(9),age:cueTime-cue.at};if(!b)return super.finish(scene,shot,t,view,options);scene.guardian=b;scene.beat='guardians:'+b.id;scene.guardianLight={speaker:b.speaker,warmth:b.speaker==='pink'?.62:.38};
   if(shot.mode==='memory'){
    this.cast(scene,view,b);const from=this.pageLayout(view,shot.memory,b.from?.view||b.view),to=this.pageLayout(view,shot.memory,b.view),page={};for(const key of ['x','y','w','h','angle'])page[key]=mix(from[key],to[key],b.blend);if(b.view==='reveal')page.y-=Math.min(6,view.frame.h*.018)*span(.25,1.15,b.age);scene.page=page;scene.fullPhoto=this.pageLayout(view,shot.memory,'photo');scene.lens={zoom:1.08,cx:shot.memory===0?.47:shot.memory===1?.62:.72,cy:.60,travel:0};
   }
   if(shot.mode==='letter'&&b.view!=='read'){this.cast(scene,view,b);scene.envelope=true;}if(b.view==='envelope'){scene.envelope=true;const f=view.frame,h=Math.min(f.h*.70,f.w*.59),w=Math.min(f.w*.42,h*.85),hh=w*.64;scene.envelopeRect={x:f.x+f.w*.5,y:f.y+f.h*.96-h*.18-hh*.5,w,h:hh,angle:-.03};}
   if(b.view==='treasure'){this.cast(scene,view,b,{height:.62});scene.treasure=true;scene.passage=null;}
   if(shot.mode==='case'){this.cast(scene,view,b,{height:.61,floor:.98});scene.giftRecognition=true;scene.paperFold=0;}
   if(shot.mode==='ceremony'&&scene.ceremony){if(b.view==='return'){scene.ceremony.macro=1-span(0,1.2,b.age);scene.ceremony.nextReady=scene.ceremony.ready;scene.ceremony.phase='witness';}else if(b.view!=='macro')scene.ceremony.macro=0;for(const p of Object.values(scene.actors))p.opacity*=1-scene.ceremony.macro;}
   if(shot.mode==='finale'){const f=view.frame,h=Math.min(f.h*.36,f.w*.39);for(const [id,p]of Object.entries(scene.actors)){p.s=h*(id==='pink'?.82:1)/VF.rigBounds[id].h;p.x=f.x+f.w*(id==='pink'?.34:.68);p.y=p.floor=f.y+f.h*.965;}}
   this.directScene?.(scene,shot,t,view,options);this.composeChoiceCamera?.(scene,shot,view,options);VF.GuardianActing.apply(scene,b,view);this.composeNarrativeProps?.(scene,shot,view,options);for(const [id,p]of Object.entries(scene.actors)){const bb=VF.rigBounds[id],f=view.frame;p.x=clamp(p.x,f.x-bb.x*p.s+4,f.x+f.w-(bb.x+bb.w)*p.s-4);}return super.finish(scene,shot,t,view,options);
  }
 }
 VF.SceneStage=GuardianStage;
})();
