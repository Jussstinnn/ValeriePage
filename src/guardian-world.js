/* Existing paintings become three intimate stages. Photos are rigid, whole and byte-original. */
(() => {
 const Base=VF.SceneEnvironment,{mix,span,clamp,ellipse,TAU}=VF.math;
 class GuardianWorld extends Base{
  background(p,s,t,v,profile,reduced){
   const b=s.guardian,custom=s.chapter==='memory'||s.envelope||s.giftRecognition;
   if(!custom){delete this.stats.photo;delete this.stats.envelope;delete this.stats.recognizedGift;if(['memory','letter'].includes(s.passage?.source?.chapter))s.passage=null;super.background(p,s,t,v,profile,reduced);if(s.treasure)this.treasureVeil(p,s,v);return;}
   this.interactionTargets=[];this.flowerPoint=null;delete this.stats.photo;delete this.stats.jewel;delete this.stats.caseGeometry;const key=s.chapter==='memory'?['garden','museum','forest'][s.memory]:s.giftRecognition?'clearing':'forest',img=VF.Art.image(key),cover=VF.Matte.cover(img.naturalWidth,img.naturalHeight,v,s.lens);
   p.drawImage(img,cover.x,cover.y,cover.w,cover.h);this.stats.world=s.world;this.stats.mattes=[{world:key,...cover}];this.stats.matte=cover;
   const {frame:f}=v,shade=p.createLinearGradient(0,0,0,v.h);shade.addColorStop(0,'#10282d33');shade.addColorStop(.65,'#10282d18');shade.addColorStop(1,'#10282deb');p.fillStyle=shade;p.fillRect(0,0,v.w,v.h);
   if(s.chapter==='memory'&&!s.envelope)this.memoryPage(p,s,v);
   if(s.envelope)this.envelope(p,s,v);
   if(s.giftRecognition){const home=VF.RevealDirector.alcove(p,v);this.stats.homecoming=home;this.stats.dedicatedSet='same-alcove-at-night';const r=VF.Art.rects.gift.closed,scale=Math.min(f.w*.37/r[2],f.h*.27/r[3]),w=r[2]*scale,h=r[3]*scale,x=home.x+home.w*.49,y=home.y+home.h*.543-h*.43;p.save();p.fillStyle='#081d2580';p.beginPath();p.ellipse(x,y+h*.48,w*.52,h*.14,0,0,TAU);p.fill();p.restore();VF.Art.draw(p,'gift',r,x-w/2,y-h/2,w,h);this.stats.recognizedGift={x:x-w/2,y:y-h/2,w,h,reference:'original gift atlas'};}
   if(b.speaker){const a=s.actors[b.speaker],face=VF.Kinematics.localToWorld(a,{x:0,y:b.speaker==='pink'?-230:-198},b.speaker);p.save();p.globalCompositeOperation='screen';p.globalAlpha=.14;const rr=Math.min(f.w*.45,f.h*.4);p.drawImage(this.glow,face.x-rr,face.y-rr,rr*2,rr*2);p.restore();}this.stats.draws++;
  }
  memoryPage(p,s,v){
   const b=s.guardian,q=s.page,img=VF.MemoryAssets.image(s.memory),first=b.view==='discovery',before=b.from?.view==='discovery',reveal=first?0:b.view==='reveal'?b.blend:before?b.blend:1,covered=b.view==='envelope';
   p.save();p.translate(q.x,q.y);p.rotate(q.angle);p.shadowColor='#071c26b0';p.shadowBlur=Math.min(17,q.w*.08);p.shadowOffsetY=8;p.fillStyle='#eddfc8';p.fillRect(-q.w/2-5,-q.h/2-5,q.w+10,q.h+10);p.shadowColor='transparent';
   // Three different rigid-photo reveals: lifted petal veil, opening book, shared light aperture.
   p.save();p.beginPath();if(s.memory===0)p.rect(-q.w/2,-q.h/2,q.w,q.h*reveal);else if(s.memory===1)p.rect(-q.w*reveal/2,-q.h/2,q.w*reveal,q.h);else{const radius=Math.hypot(q.w,q.h)*reveal;p.arc(0,0,Math.max(.01,radius),0,TAU);}p.clip();if(!covered)p.drawImage(img,-q.w/2,-q.h/2,q.w,q.h);p.restore();
   if(first||covered){p.fillStyle=s.memory===1?'#c6b496':'#e1cbb3';p.fillRect(-q.w/2,-q.h/2,q.w,q.h);p.strokeStyle='#98886b';p.lineWidth=1;p.beginPath();if(s.memory===1){p.moveTo(0,-q.h/2);p.lineTo(0,q.h/2);}else{p.moveTo(-q.w/2,-q.h/2);p.lineTo(0,q.h*.12);p.lineTo(q.w/2,-q.h/2);}p.stroke();this.seal(p,0,q.h*.10,8);}
   if(reveal<1&&!first){p.strokeStyle='#edcf9b';p.lineWidth=2;p.beginPath();if(s.memory===0){p.moveTo(-q.w/2,-q.h/2+q.h*reveal);p.quadraticCurveTo(0,-q.h/2+q.h*reveal+6,q.w/2,-q.h/2+q.h*reveal);}else if(s.memory===1){p.moveTo(-q.w*reveal/2,-q.h/2);p.lineTo(-q.w*reveal/2,q.h/2);p.moveTo(q.w*reveal/2,-q.h/2);p.lineTo(q.w*reveal/2,q.h/2);}p.stroke();}p.restore();
   this.stats.photo={id:s.memory,x:q.x-q.w/2,y:q.y-q.h/2,w:q.w,h:q.h,angle:q.angle,nativeW:img.naturalWidth,nativeH:img.naturalHeight,reveal,originalBytes:true,clean:b.view==='photo',revealStyle:['petal-veil','opening-folio','shared-light'][s.memory]};this.interactionTargets=[{kind:'memory',x:q.x,y:q.y,r:Math.max(30,Math.min(q.w,q.h)*.42)}];
  }
  seal(p,x,y,r){p.save();p.translate(x,y);p.fillStyle='#b67870';p.beginPath();p.arc(0,0,r,0,TAU);p.fill();p.strokeStyle='#efc7ab';p.lineWidth=.9;p.beginPath();p.moveTo(-r*.45,0);p.quadraticCurveTo(0,r*.9,r*.45,0);p.stroke();p.restore();}
  envelope(p,s,v){const q=s.envelopeRect;if(!q)return;const {w,h:hh,x,y}=q;p.save();p.translate(x,y);p.rotate(q.angle);p.fillStyle='#e8d4b7';p.shadowColor='#071e26a0';p.shadowBlur=12;p.shadowOffsetY=5;p.fillRect(-w/2,-hh/2,w,hh);p.shadowColor='transparent';p.strokeStyle='#ac997d';p.lineWidth=1;p.beginPath();p.moveTo(-w/2,-hh/2);p.lineTo(0,hh*.14);p.lineTo(w/2,-hh/2);p.moveTo(-w/2,hh/2);p.lineTo(-w*.08,-hh*.05);p.moveTo(w/2,hh/2);p.lineTo(w*.08,-hh*.05);p.stroke();this.seal(p,0,hh*.13,Math.min(10,w*.07));p.restore();this.stats.envelope={...q};}
  garden(p,s,t,v,reduced){if(!s.treasure)return super.garden(p,s,t,v,reduced);const f=v.frame,flower=this.lilies.specs[s.selected],x=f.x+f.w*.5,y=f.y+f.h*.22,scale=Math.min(f.w*.23/flower.s,f.h*.18/flower.s);p.strokeStyle='#6b8a57';p.lineWidth=Math.max(2,scale*2);p.beginPath();p.moveTo(x,y+5);p.bezierCurveTo(x+8,y+f.h*.09,x-10,y+f.h*.20,x-5,y+f.h*.30);p.stroke();this.lilies.detail(p,t,s.selected,x,y,scale,reduced);this.stats.bouquet={detail:s.selected,flowers:14,scale,x,y,guardianPetal:true};this.stats.lilies=this.lilies.stats();}
  treasureVeil(p,s,v){const f=v.frame,g=p.createLinearGradient(0,f.y,0,f.y+f.h);g.addColorStop(0,'#10282d00');g.addColorStop(.6,'#10282d39');g.addColorStop(1,'#10282dc0');p.fillStyle=g;p.fillRect(0,f.y,v.w,f.h);}
  afterActors(p,s,t,v,profile,reduced){
   if(s.chapter==='finale')this.memoryEchoes(p,s,v);if(!(s.chapter==='memory'||s.envelope||s.giftRecognition))super.afterActors(p,s,t,v,profile,reduced);
   this.keepsakes(p,s,t,v);this.stats.guardian={beat:s.guardian?.id,view:s.guardian?.view,acting:s.acting,keeps:s.guardian?.keeps||[],speaker:s.guardian?.speaker||null};
  }
  memoryEchoes(p,s,v){const f=v.frame,q=s.finalProgress,fade=1-span(.20,.47,q);this.stats.memoryEchoes={count:3,progress:q,wholePhotographs:true};if(fade<.001)return;for(let i=0;i<3;i++){const img=VF.MemoryAssets.image(i);if(!img)continue;const h=Math.min(f.h*.20,f.w*.22/img.naturalWidth*img.naturalHeight),w=h*img.naturalWidth/img.naturalHeight,x=mix(f.x+f.w*[.18,.79,.52][i],f.x+f.w*.5,q),y=mix(f.y+f.h*[.25,.34,.53][i],f.y+f.h*.60,q);p.save();p.globalAlpha=fade;p.translate(x,y);p.rotate((i-1)*.12*(1-q));p.fillStyle='#e1ccb0';p.fillRect(-w/2-3,-h/2-3,w+6,h+6);p.drawImage(img,-w/2,-h/2,w,h);p.restore();}}
  keepsakes(p,s,t,v){const b=s.guardian;if(!b||b.view==='read'||b.view==='photo'||s.chapter==='ceremony'&&s.ceremony.macro>.5)return;const hands=s.renderedActors||[],point=(id,side)=>hands.find(a=>a.id===id)?.hands?.[side];this.stats.keepsakes=[];
   for(const [name,id,side]of [['star','taupe','right'],['petal','pink','left']]){if(!b.keeps.includes(name))continue;const hand=point(id,side);if(!hand)continue;let x=hand.x,y=hand.y-2,alpha=.92;if((name==='star'&&b.acting==='catch-star')||(name==='petal'&&b.acting==='catch-petal')){const f=v.frame,q=span(0,1.5,b.age);x=mix(f.x+f.w*.5,x,q)+Math.sin(q*Math.PI)*(name==='star'?1:-1)*Math.min(42,f.w*.10);y=mix(f.y+f.h*.22,y,q)-Math.sin(q*Math.PI)*Math.min(35,f.h*.08);}if(s.chapter==='finale'){const f=v.frame,q=s.finalProgress;x=mix(x,f.x+f.w*.5,q*.75);y=mix(y,f.y+f.h*.60,q*.75);}p.save();p.globalAlpha=alpha;
    if(name==='star'){p.globalCompositeOperation='screen';p.drawImage(this.glow,x-20,y-20,40,40);p.strokeStyle='#fff0c6';p.lineWidth=1.5;p.beginPath();for(let i=0;i<8;i++){const a=-Math.PI/2+i*Math.PI/4,r=i%2?2:7;if(i)p.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);else p.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}p.closePath();p.stroke();}else{ellipse(p,x,y,5,10,'#f5d2b9',-.5);p.strokeStyle='#aa8b70';p.lineWidth=.6;p.beginPath();p.moveTo(x-2,y+4);p.quadraticCurveTo(x+2,y,x+2,y-5);p.stroke();}p.restore();this.stats.keepsakes.push({name,id,side,x,y});
   }
   if(s.chapter==='finale'&&b.keeps.includes('envelope')){const f=v.frame;p.save();p.globalAlpha=.38;p.strokeStyle='#e7c9aa';p.lineWidth=1;for(let i=0;i<3;i++){p.beginPath();p.moveTo(f.x+f.w*.43+i*3,f.y+f.h*.68+i*3);p.quadraticCurveTo(f.x+f.w*.48,f.y+f.h*.65,f.x+f.w*.57+i*3,f.y+f.h*.68+i*3);p.stroke();}p.restore();}
  }
  foreground(p,s,t,v,profile,reduced){
   if(!(s.chapter==='memory'||s.envelope||s.giftRecognition))return super.foreground(p,s,t,v,profile,reduced);
   if(s.chapter==='memory'&&s.guardian?.view==='photo'){this.stats.cleanPhotoPlane=true;return;}
   const f=v.frame;
   if(v.kind!=='portrait'){const g=p.createLinearGradient(0,0,f.x+20,0);g.addColorStop(0,'#10282def');g.addColorStop(.7,'#10282dca');g.addColorStop(1,'#10282d00');p.fillStyle=g;p.fillRect(0,0,f.x+20,v.h);}const h=p.createLinearGradient(0,0,0,80);h.addColorStop(0,'#10282dbb');h.addColorStop(1,'#10282d00');p.fillStyle=h;p.fillRect(0,0,v.w,80);this.stats.bufferBytes=VF.Art.stats().decodedBytes+VF.MemoryAssets.stats().bytes;
  }
 }
 VF.SceneEnvironment=GuardianWorld;
})();
