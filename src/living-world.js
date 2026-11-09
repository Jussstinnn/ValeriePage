/* Scene-specific 2.5D direction. Scenery changes; approved plush drawings never do. */
(() => {
 const Base=VF.SceneEnvironment,{canvas,clamp,mix,span,pulse,ellipse,TAU}=VF.math;
 class LivingWorld extends Base{
  prepareShot(shot){if(['museum','painting','sky'].includes(shot.mode))this.painting=VF.NightPainting();if(['garden','petal'].includes(shot.mode)){if(!this.lilies){this.lilies=new VF.LilyGarden();this.lilies.prime();}}}
  matte(p,key,scene,view){const img=key==='sky'?this.painting:VF.Art.image(key),r=VF.Matte.cover(img.width,img.height,view,scene.lens);p.drawImage(img,r.x,r.y,r.w,r.h);this.projection=r;this.stats.matte=r;this.mattes.push({world:key,...r});return r;}
  background(p,scene,t,view,profile,reduced){
   this.prepareShot({mode:scene.chapter});for(const key of ['fairy','painting','wish','bouquet','lilies'])delete this.stats[key];this.stats.lens={...scene.lens};this.mattes=[];this.interactionTargets=[];this.flowerPoint=null;this.paintWorld(p,scene,t,view,profile,reduced);
   const passage=scene.passage;
   if(passage&&passage.progress<1){
    // A rooted opening moves across the matte; the incoming painting exists at
    // full scale before this mask opens. No black plate or opacity-only cut.
    this.paintWorld(p,passage.source,t,view,profile,reduced);
    const q=passage.progress,{w,h}=view,cx=view.frame.x+view.frame.w*.52,half=(w+Math.abs(cx-w*.5))*q*1.45,left=cx-half,right=cx+half;
    p.save();this.passageMask(p,passage,view);if(q<.001){p.restore();}else{p.clip();this.paintWorld(p,scene,t,view,profile,reduced);p.restore();}
   }
   this.stats.world=scene.world;this.stats.mattes=this.mattes;this.stats.transition=passage?{from:passage.from,to:passage.to,progress:passage.progress}:null;this.stats.draws++;
  }
  paintWorld(p,scene,t,view,profile,reduced){
   if(!scene.world||scene.world==='vineyard'){super.background(p,scene,t,view,profile,reduced);this.mattes.push({world:'vineyard',...this.projection});return;}
   const {frame:f}=view,kind=scene.world;
   this.prepareShot({mode:scene.chapter});
   if(kind==='forest'){
    const r=this.matte(p,'forest',scene,view);this.forestLife(p,scene,t,view,profile,reduced);
    // Independently painted foreground plants drift relative to the deep matte.
    const leaf=VF.Art.rects.foliage.fern,w=f.w*.72;for(const side of [-1,1]){p.save();p.translate(side<0?f.x-w*.36:f.x+f.w-w*.42,f.y+f.h-w*.13);p.rotate((reduced?0:Math.sin(t*.45+side)*.012)+side*.07);VF.Art.draw(p,'foliage',leaf,0,0,w,w*.45);p.restore();}
   }else if(kind==='museum'){
    this.matte(p,'museum',scene,view);this.gallery(p,scene,t,view,reduced);
   }else if(kind==='sky'){
    this.matte(p,'sky',scene,view);this.skyMotion(p,this.projection,scene,t,reduced);
    const bankW=f.w*1.05;VF.Art.draw(p,'foliage',VF.Art.rects.foliage.fern,f.x-bankW*.04,f.y+f.h-bankW*.13,bankW,bankW*.29);
   }else if(kind==='garden'){
    this.matte(p,'garden',scene,view);this.garden(p,scene,t,view,reduced);
   }
   const shade=p.createLinearGradient(0,f.y+f.h*.76,0,f.y+f.h+34);shade.addColorStop(0,'#142c3000');shade.addColorStop(1,kind==='museum'?'#211e2466':'#10282d9c');p.fillStyle=shade;p.fillRect(0,f.y+f.h*.76,view.w,f.h*.24+34);
  }
  forestLife(p,scene,t,view,profile,reduced){
   const origin=scene.forestPoint;if(!origin)return;const f=view.frame,settled=scene.actors.taupe,pink=scene.actors.pink,handG=VF.Kinematics.localToWorld(settled,{x:55,y:-95},'taupe'),handP=VF.Kinematics.localToWorld(pink,{x:38,y:-85},'pink'),visit=span(3.5,6.5,t),reply=span(9,12,t),x=mix(mix(origin.x,handG.x,visit),handP.x,reply),y=mix(mix(origin.y-9,handG.y,visit),handP.y,reply)-(reduced?0:Math.sin(t*1.2)*3),born=span(.8,2.7,t);
   const n=profile==='gentle'?8:15;p.save();p.globalCompositeOperation='screen';for(let i=0;i<n;i++){const q=i/n,xx=origin.x+Math.sin(i*2.13+t*.14)*f.w*.20,yy=origin.y-Math.abs(Math.cos(i*1.7+t*.11))*f.h*.28,light=9+Math.sin(i*2.4+t*.4)*2;p.globalAlpha=.23+scene.response*.12;p.drawImage(this.glow,xx-light,yy-light,light*2,light*2);}p.globalAlpha=.65*born;p.drawImage(this.glow,x-28,y-28,56,56);p.globalCompositeOperation='source-over';
   const flap=reduced?.45:.50+Math.sin(t*8)*.17;ellipse(p,x-5,y-3,7*flap,4,'#e7f1dc8c',-.65);ellipse(p,x+5,y-3,7*flap,4,'#e7f1dc8c',.65);ellipse(p,x,y,1.8,4.5,'#fff2c7');p.restore();
   this.interactionTargets.push({kind:'forest',x,y,r:28});this.stats.fairy={x,y,visit,reply,born};
  }
  paintingRect(view){const f=view.frame,w=Math.min(f.w*.93,f.h*.60*960/760),h=w*760/960;return{x:f.x+(f.w-w)/2,y:f.y+f.h*.025,w,h};}
  gallery(p,scene,t,view,reduced){
   const start=scene.paintingAnchor||this.paintingRect(view),end=VF.Matte.cover(960,760,view,{zoom:1.02,cx:.5,cy:.5}),q=scene.portal||0,r={x:mix(start.x,end.x,q),y:mix(start.y,end.y,q),w:mix(start.w,end.w,q),h:mix(start.h,end.h,q)};
   p.save();p.shadowColor='#1d172a88';p.shadowBlur=12;p.shadowOffsetY=6;p.fillStyle='#543b2b';p.fillRect(r.x-13,r.y-13,r.w+26,r.h+26);p.restore();
   const border=p.createLinearGradient(r.x-10,r.y,r.x+12,r.y);border.addColorStop(0,'#58432b');border.addColorStop(.36,'#dab57a');border.addColorStop(.6,'#f5d7a0');border.addColorStop(1,'#58412c');p.fillStyle=border;p.fillRect(r.x-10,r.y-10,r.w+20,r.h+20);p.strokeStyle='#f7dfaa';p.lineWidth=1;p.strokeRect(r.x-5,r.y-5,r.w+10,r.h+10);const authentic=scene.chapter==='painting'&&VF.JourneyAssets.peek('starry');if(authentic&&q<.82){const ah=r.w*authentic.naturalHeight/authentic.naturalWidth;p.fillStyle='#16293c';p.fillRect(r.x,r.y,r.w,r.h);p.drawImage(authentic,r.x,r.y+(r.h-ah)/2,r.w,ah);if(q>.03){p.save();const R=Math.hypot(r.w,r.h)*span(.03,.82,q),cx=r.x+r.w*.7,cy=r.y+r.h*.35;p.beginPath();for(let i=0;i<10;i++){const angle=-Math.PI/2+i*Math.PI/5,rad=i%2?R*.48:R;i?p.lineTo(cx+Math.cos(angle)*rad,cy+Math.sin(angle)*rad):p.moveTo(cx+Math.cos(angle)*rad,cy+Math.sin(angle)*rad);}p.closePath();p.clip();p.drawImage(this.painting,r.x,r.y,r.w,r.h);p.restore();}}else p.drawImage(this.painting,r.x,r.y,r.w,r.h);
   p.save();p.beginPath();p.rect(r.x,r.y,r.w,r.h);p.clip();this.skyMotion(p,r,scene,t,reduced);p.restore();this.interactionTargets.push({kind:'painting',x:r.x+r.w*.55,y:r.y+r.h*.30,r:Math.max(32,Math.min(r.w*.45,100))});this.stats.painting={...r,portal:q,source:'preserved RC07 original procedural painting'};VF.SetDressing.museum(p,scene,t,view,this.stats.painting);this.stats.museumDressing={wallLights:2,vegetation:false,preservedPainting:true};
   if(q>.995){this.projection=end;this.mattes.push({world:'painting-portal',...end});}
  }
  skyMotion(p,r,scene,t,reduced){
   const scale=r.w/960;p.save();p.translate(r.x,r.y);p.scale(scale,scale);p.globalCompositeOperation='screen';p.lineCap='round';
   const power=.10+(scene.response||0)*.24;for(let j=0;j<6;j++){p.beginPath();for(let i=0;i<=60;i++){const z=i/60,x=-40+1040*z,y=365-138*Math.sin(Math.PI*z*1.22)+90*Math.sin(2.6*Math.PI*z+.25)+j*4+(reduced?0:Math.sin(t*.65+z*8+j*.2)*9);if(!i)p.moveTo(x,y);else p.lineTo(x,y);}p.lineWidth=1.4;p.strokeStyle=`rgba(238,224,163,${power})`;p.stroke();}
   for(const [i,[x,y,radius]]of [[112,84,28],[240,103,34],[487,85,30],[625,109,35],[862,128,67]].entries()){const a=reduced?.3:.16+.12*Math.sin(t*.8+i)**2;p.globalAlpha=a+(scene.response||0)*.25;p.drawImage(this.glow,x-radius,y-radius,radius*2,radius*2);}p.restore();
  }
  garden(p,scene,t,view,reduced){
   const f=view.frame,detail=scene.chapter==='petal',top=Math.max(f.y+f.h*.015,view.story.y+view.story.h+12),available=Math.max(80,f.y+f.h*.85-top),s=Math.min(f.w*.96/540,available/640),rect={x:f.x+f.w*.5-540*s/2,y:top,w:540*s,h:640*s};
   let targets=[];
   if(!detail){targets=this.lilies.draw(p,t,rect,{still:reduced,selected:scene.selected,response:scene.response});this.stats.bouquet={...rect,flowers:14,grownAt:t};}
   else{
    const flower=this.lilies.specs[scene.selected],x=f.x+f.w*.50,y=f.y+f.h*.36,scale=Math.min(f.w*.36/flower.s,f.h*.26/flower.s);
    p.strokeStyle='#557c4b';p.lineWidth=Math.max(2,scale*3);p.beginPath();p.moveTo(x,y+10);p.bezierCurveTo(x+18,y+f.h*.18,x-22,f.y+f.h*.82,x-9,f.y+f.h*.95);p.stroke();this.lilies.detail(p,t,scene.selected,x,y,scale,reduced);targets=[{id:scene.selected,x,y,r:Math.max(44,flower.s*scale),open:1}];this.stats.bouquet={detail:scene.selected,flowers:14,scale,x,y};
   }
   this.interactionTargets.push(...targets.filter(f=>f.open>.65).map(f=>({kind:'flower-'+f.id,x:f.x,y:f.y,r:f.r})));this.stats.lilies=this.lilies.stats();
  }
  afterActors(p,scene,t,view,profile,reduced){super.afterActors(p,scene,t,view,profile,reduced);if(scene.world!=='sky')return;const f=view.frame,q=scene.wish||0,points=[[.24,.37],[.31,.25],[.39,.35],[.47,.22],[.57,.33],[.66,.24],[.74,.37]];p.save();p.lineWidth=1.2;p.strokeStyle='#f0d2a888';p.beginPath();const visible=points.slice(0,Math.floor(q*(points.length-1))+1);for(const [i,[x,y]]of visible.entries()){const xx=f.x+x*f.w,yy=f.y+y*f.h;if(!i)p.moveTo(xx,yy);else p.lineTo(xx,yy);}p.stroke();for(const [x,y]of visible)ellipse(p,f.x+x*f.w,f.y+y*f.h,2.2,2.2,'#fff0ce');p.restore();this.interactionTargets.push({kind:'wish',x:f.x+f.w*.5,y:f.y+f.h*.3,r:Math.max(40,f.w*.35)});this.stats.wish=q;}
  foreground(p,scene,t,view,profile,reduced){super.foreground(p,scene,t,view,profile,reduced);this.stats.bufferBytes=VF.Art.stats().decodedBytes+(this.painting?960*760*4:0)+(this.lilies?.stats().bytes||0);}
 }
 VF.SceneEnvironment=LivingWorld;
})();
