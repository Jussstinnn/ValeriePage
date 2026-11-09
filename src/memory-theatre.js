/* Three short films, not three instances of one gallery layout. All photo drawing is rigid. */
(() => {
 const SB=VF.SceneStage,WB=VF.SceneEnvironment,{clamp,span,mix,ellipse}=VF.math;
 class MemoryStage extends SB{
  cast(s,v,b,settings={}){const h=super.cast(s,v,b,settings);if(s.chapter!=='memory')return h;const f=v.frame,m=s.memory,p=s.actors.pink,g=s.actors.taupe,hero=Math.min(f.h*(m===2?.84:.77),f.w*(m===0?.65:m===1?.61:.68)),photo=b.view==='photo',old=b.from?.view==='photo',opacity=mix(old?0:1,photo?0:1,b.blend);
   for(const [id,a]of Object.entries(s.actors)){a.s=hero*(id==='pink'?.82:1)/VF.rigBounds[id].h;a.opacity=opacity;a.sit=m===2?.82:.25;a.y=a.floor=f.y+f.h*.96;}
   if(m===0){p.x=f.x+f.w*.23;g.x=f.x+f.w*.70;if(b.view==='discovery'){p.s*=1.06;g.s*=.93;g.y=g.floor-=hero*.05;}s.memoryLanguage='two-paws-under-leaves';}
   if(m===1){p.x=f.x+f.w*(b.view==='discovery'?.24:.29);g.x=f.x+f.w*.69;if(['reaction','rest'].includes(b.view)){p.x=f.x+f.w*.42-hero*.12;g.x=f.x+f.w*.56+hero*.12;}s.memoryLanguage='a-folding-album-and-room-for-two';}
   if(m===2){p.x=f.x+f.w*.42-hero*.13;g.x=f.x+f.w*.60+hero*.10;g.y=g.floor-=hero*.035;s.memoryLanguage='a-shared-seat-in-the-quiet';}
   for(const [id,a]of Object.entries(s.actors)){const box=VF.rigBounds[id];a.x=clamp(a.x,f.x-box.x*a.s+8,f.x+f.w-(box.x+box.w)*a.s-8);a.y=a.floor=clamp(a.y,f.y-box.y*a.s+5,f.y+f.h-(box.y+box.h)*a.s-5);}return hero;
  }
  directScene(s,shot,t,v,o){if(shot.mode==='memory'){if((shot.memory===1&&s.guardian.view==='rest')||(shot.memory===2&&['rest','reaction'].includes(s.guardian.view))){if(shot.memory===2&&s.guardian.view==='reaction')s.memoryClosingPhoto={...s.fullPhoto};delete s.page;delete s.fullPhoto;}s.lens.zoom=shot.memory===0?1.18:shot.memory===1?1.05:1.13;}
   if(['vine-detail','painting-close'].includes(s.guardian.view)){s.lens.zoom+=span(0,1.6,s.guardian.age)*.18;s.lens.cx=mix(s.lens.cx,.60,span(0,1.6,s.guardian.age));}
  }
  event(kind,t,point){if(['pink','taupe','both'].includes(kind)){const mode=this.last?.chapter,act=mode==='memory'?'rest-together':mode==='forest'?'hear-light':mode==='case'||mode==='ceremony'?'welcome':'look-back';this.events.push({kind:'guardian:'+act,at:t,id:kind});this.events=this.events.slice(-6);return;}super.event(kind,t,point);}
 }
 class MemoryWorld extends WB{
  photoStats(s,q,img,reveal){this.stats.photo={id:s.memory,x:q.x-q.w/2,y:q.y-q.h/2,w:q.w,h:q.h,angle:q.angle,nativeW:img.naturalWidth,nativeH:img.naturalHeight,reveal,originalBytes:true,clean:s.guardian.view==='photo',revealStyle:s.memory===0?'leaves-lifted-together':s.memory===1?'cloth-album-unfolds':'a-page-in-shared-moonlight'};this.interactionTargets=[{kind:'memory',x:q.x,y:q.y,r:Math.max(30,Math.min(q.w,q.h)*.40)}];}
  paper(p,q,img){p.translate(q.x,q.y);p.rotate(q.angle);p.fillStyle='#eddfc8';p.shadowColor='#071c2690';p.shadowBlur=13;p.shadowOffsetY=6;p.fillRect(-q.w/2-5,-q.h/2-5,q.w+10,q.h+10);p.shadowColor='transparent';p.drawImage(img,-q.w/2,-q.h/2,q.w,q.h);}
  memoryPage(p,s,v){const q=s.page,b=s.guardian;if(!q){if(s.memoryClosingPhoto){const a=s.memoryClosingPhoto,img=VF.MemoryAssets.image(s.memory),open=1-span(0,1.25,b.age);p.save();p.beginPath();p.rect(a.x-a.w/2,a.y-a.h*open/2,a.w,a.h*open);p.clip();p.drawImage(img,a.x-a.w/2,a.y-a.h/2,a.w,a.h);p.restore();}delete this.stats.photo;this.stats.memoryLanguage=s.memoryLanguage;return;}const img=VF.MemoryAssets.image(s.memory);
   if(b.view==='photo'){super.memoryPage(p,s,v);this.stats.memoryLanguage=s.memoryLanguage;return;}
   if(s.memory===0){const lift=b.view==='discovery'?0:b.view==='reaction'?1:span(.2,1.8,b.age);p.save();this.paper(p,q,img);for(const side of [-1,1]){p.save();p.translate(side*q.w*(.12+lift*.62),q.h*(.29-lift*.22));p.rotate(side*(.36+lift*.55));VF.Art.draw(p,'foliage',VF.Art.rects.foliage.leaf,-q.w*.65,-q.h*.78,q.w*1.3,q.h*1.07);p.restore();}p.restore();this.photoStats(s,q,img,lift);}
   else if(s.memory===1){const open=['discovery','album'].includes(b.view)?0:b.view==='reaction'?1-span(.1,1.3,b.age):span(.1,1.7,b.age);p.save();this.paper(p,q,img);for(const side of [-1,1]){const wing=q.w*.5*(1-open);if(wing>.01){p.save();p.shadowColor='#1b242a60';p.shadowBlur=5;p.fillStyle=side<0?'#a98375':'#c5a58b';p.fillRect(side<0?-q.w/2:q.w/2-wing,-q.h/2,wing,q.h);p.strokeStyle='#e4c7a4';p.lineWidth=.8;p.strokeRect(side<0?-q.w/2+4:q.w/2-wing+4,-q.h/2+4,Math.max(1,wing-8),q.h-8);p.restore();}}p.restore();this.photoStats(s,q,img,open);}
   else {super.memoryPage(p,s,v);}this.stats.memoryLanguage=s.memoryLanguage;
  }
  afterActors(p,s,t,v,...rest){super.afterActors(p,s,t,v,...rest);if(s.chapter==='memory'&&s.memory===2&&['rest','reaction'].includes(s.guardian.view)){const a=s.renderedActors||[],left=a.find(a=>a.id==='pink')?.hands.right,right=a.find(a=>a.id==='taupe')?.hands.left;if(left&&right){p.save();p.strokeStyle='#f1d4a18c';p.lineWidth=1.2;p.beginPath();p.moveTo(left.x,left.y);p.bezierCurveTo(left.x,left.y-35,right.x,right.y-35,right.x,right.y);p.stroke();p.restore();}}}
 }
 VF.SceneStage=MemoryStage;VF.SceneEnvironment=MemoryWorld;
})();
