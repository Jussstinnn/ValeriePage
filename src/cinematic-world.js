/* 2.5D painted set: matte, framing vines, practical leaf, actors, gift, near ferns.
   Artwork is original and photo-referenced; no procedural F1 landscape is used. */
(() => {
 const {canvas,ellipse,clamp,mix,TAU}=VF.math;
 class CinematicWorld extends VF.Environment {
  makeAssets(){this.glow=canvas(96,96);const p=this.glow.getContext('2d'),g=p.createRadialGradient(48,48,0,48,48,47);g.addColorStop(0,'#fff4dace');g.addColorStop(.14,'#ffe6b15c');g.addColorStop(1,'#edc59600');p.fillStyle=g;p.fillRect(0,0,96,96);this.assets=new Map();}
  fit(w,h){if(this.w===w&&this.h===h)return;this.w=w;this.h=h;this.stats.bufferBytes=96*96*4+VF.Art.stats().decodedBytes;}
  background(p,scene,time,view,profile,reduced){
   this.fit(view.w,view.h);const {w,h,frame:f}=view,l=scene.lens,img=VF.Art.image('clearing'),projection=VF.Matte.cover(img.width,img.height,view,l),{x:dx,y:dy,w:iw,h:ih}=projection;
   this.projection=projection;this.stats.matte=projection;
   p.fillStyle='#18302d';p.fillRect(0,0,w,h);p.drawImage(img,dx,dy,iw,ih);
   // The upper and lower edges are naturally framed by independent foreground plates.
   const baseShade=p.createLinearGradient(0,f.y+f.h*.66,0,h);baseShade.addColorStop(0,'#19352b00');baseShade.addColorStop(1,'#11282c');p.fillStyle=baseShade;p.fillRect(0,f.y+f.h*.66,w,h-f.y-f.h*.66);
   const foliage=VF.Art.rects.foliage,framing=Math.min(w*.79,h*.68),shift=(l.cx-.5)*w*.19;
   p.save();p.globalAlpha=.93;
   VF.Art.draw(p,'foliage',foliage.left,-framing*.72-shift,-framing*.20,framing,framing*1.13);
   VF.Art.draw(p,'foliage',foliage.right,w-framing*.25-shift,-framing*.17,framing,framing*1.13);p.restore();
   // Moss banks give the characters a physical foot plane, including the intimate framing.
   const bankW=Math.min(f.w*.85,f.h*1.0),bankY=f.y+f.h*.93;
   p.save();p.globalAlpha=scene.chapter==='secret'?.70:.88;VF.Art.draw(p,'foliage',foliage.fern,f.x+f.w*.5-bankW*.57,bankY-bankW*.23,bankW,bankW*.36);p.restore();
   if(scene.chapter==='crossing')this.water(p,scene,time,view,reduced);
   this.leafDoor(p,scene.leaf,time,reduced);
   this.interactionTargets=[];this.flowerPoint=null;
   if(scene.leaf.visible>.5)this.interactionTargets.push({kind:'leaf',x:scene.leaf.x-scene.leaf.size*.28,y:scene.leaf.y-scene.leaf.size*.39,r:Math.max(26,scene.leaf.size*.28)});
   if(scene.box.visible>.5&&scene.box.reveal>.9)this.interactionTargets.push({kind:'box',x:scene.box.x,y:scene.box.y,r:Math.max(30,scene.box.w*.43)});
   this.stats.draws++;this.stats.leaf=scene.leaf.open;this.stats.case=scene.box.reveal;this.stats.lens={...l};
  }
  water(p,scene,time,view,reduced){const f=view.frame,y=f.y+f.h*.97,x=f.x+f.w*.47,w=f.w*.56;p.save();p.lineWidth=.8;for(let j=0;j<5;j++){const r=w*(.15+j*.08),phase=reduced?0:Math.sin(time*.9-j*.6)*2;p.strokeStyle=j%2?'#eed4a745':'#96b6b32d';p.beginPath();p.ellipse(x,y+j*3,r,4+j*2+phase,0,0,TAU);p.stroke();}p.restore();}
  shadow(p,actor){
   const s=actor.s,ground=actor.groundY??(actor.floor??actor.y)+18*s,height=Math.max(0,(actor.floor??actor.y)-actor.y),ambient=s*(actor.id==='pink'?55:80)+height*.08;
   const ellipseShadow=(x,y,r,flat,alpha)=>{p.save();p.translate(x,y);p.scale(1,flat);const g=p.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,`rgba(8,24,28,${alpha})`);g.addColorStop(.48,`rgba(8,24,28,${alpha*.40})`);g.addColorStop(1,'rgba(8,24,28,0)');p.fillStyle=g;p.fillRect(-r,-r,r*2,r*2);p.restore();};
   ellipseShadow(actor.x,ground+1,ambient,.17,.40/(1+height*.030));
   const m=VF.CharacterModels[actor.id];for(const foot of Object.values(actor.feetWorld||{})){
    const sole=foot.y+28*.88*s,lift=Math.max(0,ground-sole),weight=clamp(1-lift/(10*s));if(weight<.001)continue;
    ellipseShadow(foot.x+2*s,ground+.7,86*m.footWidth*s*.43+lift*.08,.17,.42*weight);
    ellipseShadow(foot.x,ground+.25,86*m.footWidth*s*.30,.095,.72*weight);
   }
  }
  leafDoor(p,leaf,time,reduced){
   if(leaf.visible<.001)return;const {x,y,rootX,rootY,size:s,open}=leaf;
   p.save();p.globalAlpha=leaf.visible;p.lineCap='round';p.strokeStyle='#1c382b';p.lineWidth=6;p.beginPath();p.moveTo(rootX,rootY);p.bezierCurveTo(rootX+s*.28,rootY-s*.09,x-s*.14,y+s*.22,x,y);p.stroke();p.strokeStyle='#b4ad6b';p.lineWidth=2;p.stroke();
   p.translate(x,y);p.rotate(mix(-.20,-.60,open));
   // The painted vein texture bends across four bands, without replacing it with geometry.
   const img=VF.Art.image('foliage'),r=VF.Art.rects.foliage.leaf;
   for(let j=0;j<4;j++){const q=j/4,band=1/4+.006,flex=reduced?0:Math.sin(time*.6+j*.25)*.008*(1-open*.5);p.save();p.rotate(flex);p.drawImage(img,r[0],r[1]+r[3]*q,r[2],Math.min(r[3]*(1-q),r[3]*band),-s*.42,-s+s*q,s*.84,Math.min(s*(1-q),s*band));p.restore();}p.restore();
  }
  afterActors(p,scene,time,view){if(scene.box.visible<.001)return;this.gift(p,scene.box,view);}
  gift(p,box,view){
   const {x,y,w,h}=box,q=clamp(box.reveal);p.save();p.globalAlpha=box.visible;
   const moss=VF.Art.rects.foliage.fern;VF.Art.draw(p,'foliage',moss,x-w*.63,y+h*.14,w*1.25,w*.35);
   p.save();const aperture=w*1.05*q;p.beginPath();p.moveTo(x,y-h*.94);p.bezierCurveTo(x+aperture*1.25,y-h*.63,x+aperture*1.25,y+h*.67,x,y+h*.98);p.bezierCurveTo(x-aperture*1.25,y+h*.67,x-aperture*1.25,y-h*.63,x,y-h*.94);p.clip();
   VF.Art.draw(p,'gift',VF.Art.rects.gift.closed,x-w*.5,y-h*.5,w,h);
   if(box.warm>.01){p.globalCompositeOperation='screen';p.globalAlpha=box.visible*box.warm*.24;p.drawImage(this.glow,x-w*.43,y-h*.35,w*.86,h*.78);}p.restore();
   for(const side of [-1,1]){p.save();p.translate(x+side*w*(.12+q*.69),y+h*.50);p.rotate(side*(.22+q*.68));p.scale(side,1);VF.Art.draw(p,'foliage',VF.Art.rects.foliage.leaf,-w*.45,-w*.83,w*.68,w*.86);p.restore();}p.restore();
  }
  mushroom(){}flower(){}
  foreground(p,scene,time,view,profile,reduced){
   const {w,h,frame:f}=view,fern=VF.Art.rects.foliage.fern,s=Math.min(w*.63,h*.39),parallax=(scene.lens.cx-.5)*w*.08;
   p.save();p.globalAlpha=['museum','painting','sky','ceremony','case','memory','letter','finale'].includes(scene.chapter)?0:.96;VF.Art.draw(p,'foliage',fern,-s*.59-parallax,f.y+f.h-s*.18,s,s*.59);VF.Art.draw(p,'foliage',fern,w-s*.43-parallax,f.y+f.h-s*.10,s,s*.59);p.restore();
   const light=scene.light;p.save();p.globalCompositeOperation='screen';p.globalAlpha=.84;const r=22;p.drawImage(this.glow,light.x-r,light.y-r,r*2,r*2);ellipse(p,light.x,light.y,1.8,2.3,'#fff7d8');p.restore();
   // Reading plane is outside the protagonists; persistent controls never get a scenery overlay.
   if(view.kind==='landscape'){const side=p.createLinearGradient(0,0,w*.41,0);side.addColorStop(0,'#10282df7');side.addColorStop(.70,'#10282dca');side.addColorStop(1,'#10282d00');p.fillStyle=side;p.fillRect(0,0,w*.41,h);}else if(view.kind==='desktop'){const side=p.createLinearGradient(0,0,w*.50,0);side.addColorStop(0,'#10282dea');side.addColorStop(.60,'#10282d85');side.addColorStop(1,'#10282d00');p.fillStyle=side;p.fillRect(0,0,w*.50,h);}
   const head=p.createLinearGradient(0,0,0,80);head.addColorStop(0,'#10282db0');head.addColorStop(1,'#10282d00');p.fillStyle=head;p.fillRect(0,0,w,80);
  }
 }
 VF.SceneEnvironment=CinematicWorld;
})();
