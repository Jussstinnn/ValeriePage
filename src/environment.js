/* Layered painted scenery. Trees, vines, petals and light are original Canvas artwork. */
(() => {
 const {canvas,rng,color,mix,clamp,ellipse,ease,span,TAU}=VF.math;
 class Environment {
  constructor(){this.assets=new Map();this.backgrounds=[];this.w=0;this.h=0;this.stats={draws:0,foliage:0,flower:0};this.makeAssets();}
  leaf(p,x,y,size,angle,ink,vein=true){p.save();p.translate(x,y);p.rotate(angle);p.fillStyle=ink;p.beginPath();p.moveTo(0,0);p.bezierCurveTo(-size*.26,-size*.26,-size*.54,-size*.83,0,-size);p.bezierCurveTo(size*.53,-size*.67,size*.38,-size*.16,0,0);p.fill();if(vein){p.strokeStyle='#e4e1b13b';p.lineWidth=.65;p.beginPath();p.moveTo(0,0);p.quadraticCurveTo(size*.04,-size*.4,0,-size*.9);p.stroke();}p.restore();}
  makeAssets(){
   this.glow=canvas(128,128);let p=this.glow.getContext('2d'),g=p.createRadialGradient(64,64,0,64,64,63);g.addColorStop(0,'#fff3bfe8');g.addColorStop(.12,'#f4d69580');g.addColorStop(.4,'#f0b96328');g.addColorStop(1,'#edc28b00');p.fillStyle=g;p.fillRect(0,0,128,128);
   for(let variant=0;variant<3;variant++){
    const c=canvas(420,750),p=c.getContext('2d'),random=rng(71+variant*43);
    const branch=(x,y,length,angle,width,depth)=>{p.save();p.translate(x,y);p.rotate(angle);const trunk=p.createLinearGradient(-width,0,width,0);trunk.addColorStop(0,'#192e2c');trunk.addColorStop(.60,'#566352');trunk.addColorStop(1,'#a1996a');p.fillStyle=trunk;p.beginPath();p.moveTo(-width*.7,10);p.bezierCurveTo(-width,-length*.30,-width*.5,-length*.65,0,-length);p.bezierCurveTo(width*.5,-length*.72,width*.7,-length*.23,width*.7,10);p.fill();p.strokeStyle='#c0bd7b28';p.lineWidth=1.2;p.beginPath();p.moveTo(width*.25,0);p.bezierCurveTo(width*.5,-length*.34,-width*.2,-length*.66,0,-length*.94);p.stroke();
     if(depth>0){branch(0,-length*.63,length*.70,-.48-random()*.18,width*.60,depth-1);branch(1,-length*.85,length*.55,.45+random()*.25,width*.51,depth-1);}else for(let k=0;k<13;k++){const a=k/13*TAU,size=23+random()*28;this.leaf(p,Math.cos(a)*24,-length+Math.sin(a)*35,size,a+Math.PI*.5,color('#344b43','#9ea574',random()),true);}p.restore();};
    branch(210,746,263+variant*16,-.04+variant*.035,26,3);this.assets.set('tree'+variant,c);
   }
   for(let variant=0;variant<2;variant++){
    const c=canvas(360,470),p=c.getContext('2d'),random=rng(121+variant*7);p.fillStyle='#776b51';p.beginPath();p.moveTo(173,466);p.lineTo(179,95);p.lineTo(188,91);p.lineTo(184,467);p.fill();p.strokeStyle='#c2b190';p.lineWidth=2;p.beginPath();p.moveTo(184,449);p.lineTo(188,98);p.stroke();
    for(let s of [-1,1]){p.strokeStyle='#746449';p.lineWidth=9;p.beginPath();p.moveTo(181,350);p.bezierCurveTo(170+s*30,265,175+s*80,231,175+s*141,212);p.stroke();p.strokeStyle='#829768';p.lineWidth=2.4;p.stroke();
     for(let j=0;j<14;j++){const q=j/13,x=181+s*(q*140),y=350-Math.sin(q*Math.PI*.5)*138;this.leaf(p,x,y,28+random()*23,s*(.25+q*1.7),color('#39534b','#a6aa73',random()),true);if(j%3===0){p.save();p.translate(x,y+12);for(let k=0;k<12;k++){const row=Math.floor(k/4),bx=(k%4-1.5)*7+row*3,by=row*8,r=5.8-row*.8,g=p.createRadialGradient(bx-2,by-2,0,bx,by,r);g.addColorStop(0,variant?'#cfb7b8':'#a5a6a9');g.addColorStop(1,variant?'#79697f':'#55627b');ellipse(p,bx,by,r,r*1.04,g);}p.restore();}}
    }this.assets.set('vine'+variant,c);
   }
   for(let variant=0;variant<3;variant++){
    const c=canvas(350,210),p=c.getContext('2d');p.translate(175,202);
    for(let side of [-1,1])for(let j=0;j<7;j++){const a=side*(.2+j*.15),len=108+j*10;p.save();p.rotate(a);p.strokeStyle='#456b58';p.lineWidth=2;p.beginPath();p.moveTo(0,0);p.quadraticCurveTo(13,-len*.55,0,-len);p.stroke();for(let k=1;k<12;k++){const q=k/12;this.leaf(p,5*Math.sin(q*Math.PI),-q*len,(1-q)*36+6,-.8,'#6f9671',false);this.leaf(p,5*Math.sin(q*Math.PI),-q*len,(1-q)*36+6,.9,'#87a77b',false);}p.restore();}this.assets.set('fern'+variant,c);
   }
  }
  fit(w,h){if(this.w===w&&this.h===h)return;this.w=w;this.h=h;this.backgrounds=[];
   for(let forest=0;forest<2;forest++){
    const c=canvas(w,h),p=c.getContext('2d'),sky=p.createLinearGradient(0,0,0,h);sky.addColorStop(0,forest?'#12383e':'#46575f');sky.addColorStop(.33,forest?'#335a57':'#a58b96');sky.addColorStop(.62,forest?'#6e8b70':'#d4ac9b');sky.addColorStop(1,forest?'#173c36':'#6c8270');p.fillStyle=sky;p.fillRect(0,0,w,h);
    const sun=p.createRadialGradient(w*.68,h*.28,0,w*.68,h*.28,h*.45);sun.addColorStop(0,forest?'#e6d5a427':'#ffe1b86e');sun.addColorStop(1,'#e6c9a000');p.fillStyle=sun;p.fillRect(0,0,w,h);
    for(let j=0;j<4;j++){const base=h*(.39+j*.09);p.fillStyle=forest?['#517169','#42675e','#31594e','#254c41'][j]:['#7e9190','#708779','#5c7a69','#496853'][j];p.beginPath();p.moveTo(-w*.1,h);p.lineTo(-w*.1,base);p.bezierCurveTo(w*.15,base-h*.09,w*.28,base+h*.06,w*.49,base-h*.01);p.bezierCurveTo(w*.72,base-h*.12,w*.79,base+h*.03,w*1.1,base-h*.08);p.lineTo(w*1.1,h);p.closePath();p.fill();}
    // Quiet, varied brush marks across the distant land, baked once per viewport.
    const random=rng(201+forest);p.lineWidth=.7;for(let j=0;j<950;j++){const x=random()*w,y=h*(.43+random()*.45),len=3+random()*20;p.strokeStyle=j%3?'#d1d8a80d':'#193a330e';p.beginPath();p.moveTo(x,y);p.quadraticCurveTo(x+len*.5,y-1,x+len,y+1);p.stroke();}
    this.backgrounds.push(c);
   }
   this.stats.bufferBytes=this.backgrounds.reduce((n,c)=>n+c.width*c.height*4,0)+[...this.assets.values()].reduce((n,c)=>n+c.width*c.height*4,0);
  }
  background(p,scene,time,view,profile,reduced){
   const w=view.w,h=view.h,q=scene.biome;this.fit(w,h);p.drawImage(this.backgrounds[0],0,0);p.save();p.globalAlpha=q;p.drawImage(this.backgrounds[1],0,0);p.restore();
   p.save();p.globalAlpha=.45;ellipse(p,w*.74-scene.cameraX*9,h*.22-scene.cameraY*8,15,15,'#ffecd3');p.restore();
   p.save();p.globalAlpha=.09*q;p.fillStyle='#f5edca';for(let j=0;j<4;j++){p.beginPath();p.moveTo(w*(.66+j*.025),0);p.lineTo(w*(.07+j*.23)-scene.cameraX*30,h*.76);p.lineTo(w*(.16+j*.23)-scene.cameraX*30,h*.8);p.closePath();p.fill();}p.restore();
   const horizon=h*(view.kind==='landscape'?.39:.36),count=profile==='gentle'?6:9;this.stats.foliage=0;
   for(let j=count;j>=0;j--){const z=1.4+j*.57,depth=1/(z+.3),size=h*depth*(1.22+q*.24),y=horizon+h*.68*depth+scene.cameraY*h*.02;
    for(const side of [-1,1]){const x=w*.5+side*w*(.13+depth*.54)-scene.cameraX*depth*w*.14,dx=x-size*.24,dy=y-size,sway=reduced?0:Math.sin(time*.38+j*.7)*size*.007;
     p.save();p.globalAlpha=(.55+depth*.42)*(1-q);p.drawImage(this.assets.get('vine'+j%2),dx+sway,dy+size*.16,size*.59,size*.78);p.globalAlpha=(.38+depth*.55)*q;p.drawImage(this.assets.get('tree'+j%3),dx-size*.06+sway,dy-size*.26,size*.62,size*1.23);p.restore();this.stats.foliage+=2;
    }
   }
   // One continuous illuminated path changes material between biomes.
   const path=p.createLinearGradient(0,horizon,0,h);path.addColorStop(0,q>.5?'#9aab8177':'#ddc1a16b');path.addColorStop(1,q>.5?'#456a51':'#8e9870');p.fillStyle=path;p.beginPath();p.moveTo(w*.50,horizon);p.bezierCurveTo(w*.68,h*.55,w*.27,h*.70,w*.08,h);p.lineTo(w*.94,h);p.bezierCurveTo(w*.71,h*.75,w*.49,h*.57,w*.53,horizon);p.closePath();p.fill();
   p.save();p.globalAlpha=.13;p.strokeStyle='#eff0c5';p.lineWidth=1;for(let j=0;j<18;j++){const a=j/17,y=horizon+(h-horizon)*a*a,wide=8+a*a*w*.31,x=w*(.51-Math.sin(a*3.5)*.07);p.beginPath();p.moveTo(x-wide,y);p.quadraticCurveTo(x,y-3,x+wide,y);p.stroke();}p.restore();
   this.grass(p,w,h,time,q,reduced);this.stats.draws++;
  }
  grass(p,w,h,t,forest,reduced){p.save();p.lineCap='round';for(let j=0;j<48;j++){const side=j%2?1:-1,a=(j/2|0)/24,x=side<0?w*a*.18:w*(1-a*.16),y=h*(.58+a*.42),len=13+a*32,sway=reduced?0:Math.sin(t*.65+j)*4;p.strokeStyle=color('#637d59','#5b8968',forest);p.lineWidth=1+a;p.beginPath();p.moveTo(x,y);p.quadraticCurveTo(x+side*8+sway,y-len*.55,x+side*5+sway,y-len);p.stroke();}p.restore();}
  shadow(p,actor,light){const wide=actor.s*(actor.id==='pink'?72:108),y=actor.floor??actor.y,g=p.createRadialGradient(actor.x+7,y+8,2,actor.x+7,y+8,wide);g.addColorStop(0,'#132e2b83');g.addColorStop(1,'#132e2b00');p.save();p.translate(actor.x+7,y+8);p.scale(1,.20);p.translate(-actor.x-7,-y-8);p.fillStyle=g;p.fillRect(actor.x-wide,y-wide,wide*2,wide*2);p.restore();}
  flower(p,scene,time,view,reduced){
   if(scene.biome<.35){this.flowerPoint=null;this.stats.flower=0;return;}const f=view.frame,cx=scene.flowerPoint.x,cy=f.y+f.h*.96,stemH=Math.max(28,cy-scene.flowerPoint.y),open=clamp(scene.flower),breath=reduced?0:Math.sin(time*.8)*1.5,unit=Math.min(1,f.h/380);this.stats.flower=open;this.flowerPoint={x:cx+breath,y:cy-stemH};
   p.save();p.strokeStyle='#7d9c69';p.lineWidth=3;p.lineCap='round';p.beginPath();p.moveTo(cx,cy);p.bezierCurveTo(cx-10,cy-stemH*.3,cx+8,cy-stemH*.8,cx+breath,cy-stemH);p.stroke();this.leaf(p,cx-2,cy-stemH*.28,24,-.9,'#739c67');this.leaf(p,cx+1,cy-stemH*.49,21,.9,'#a0b782');
   for(let n=0;n<3;n++){const x=cx+breath+(n-1)*18*unit,y=cy-stemH+(n%2?0:26*unit),size=(n%2?14:7)*unit;for(let k=0;k<6;k++){const a=k/6*TAU;p.save();p.translate(x,y);p.rotate(a);p.scale(.24+.76*open,1);const petal=p.createLinearGradient(0,0,0,-size*1.8);petal.addColorStop(0,'#d6b59e');petal.addColorStop(.55,'#fbecd2');petal.addColorStop(1,'#fff9e5');p.fillStyle=petal;p.beginPath();p.moveTo(0,0);p.bezierCurveTo(-size*.6,-size*.4,-size*.6,-size*1.6,0,-size*(1+open*.75));p.bezierCurveTo(size*.7,-size*1.6,size*.6,-size*.3,0,0);p.fill();p.restore();}ellipse(p,x,y,3.3,3.1,'#b18d4d');}
   p.restore();
  }
  mushroom(p,view,time,open){const f=view.frame,x=f.x+f.w*.73,y=f.y+f.h*.91,s=Math.min(f.w*.12,f.h*.10);p.save();p.translate(x,y);p.scale(s/50,s/50);p.fillStyle='#b8c4a0';p.beginPath();p.moveTo(-7,0);p.bezierCurveTo(-11,-15,-5,-35,-7,-43);p.lineTo(8,-43);p.bezierCurveTo(6,-20,14,-8,10,0);p.closePath();p.fill();const cap=p.createLinearGradient(0,-80,0,-39);cap.addColorStop(0,'#dab990');cap.addColorStop(.6,'#ad7769');cap.addColorStop(1,'#745954');p.fillStyle=cap;p.beginPath();p.moveTo(-44,-39);p.bezierCurveTo(-39,-79,-1,-91,28,-63);p.bezierCurveTo(36,-55,44,-48,46,-39);p.bezierCurveTo(16,-27,-22,-25,-44,-39);p.fill();p.strokeStyle='#ead7b3';p.lineWidth=1;for(let j=-3;j<=3;j++){p.beginPath();p.moveTo(j*2,-33);p.lineTo(j*9,-39);p.stroke();}for(const [dx,dy,r]of [[-22,-52,4],[4,-66,5],[27,-47,3.5]])ellipse(p,dx,dy,r,r*.58,'#e6d7b3');p.globalAlpha=.25+open*.6;p.drawImage(this.glow,-24,-44,48,48);p.restore();}
  foreground(p,scene,time,view,profile,reduced){
   const w=view.w,h=view.h,q=scene.biome;p.save();for(const side of [-1,1]){const asset=this.assets.get('fern'+(side<0?0:1)),s=Math.min(w*.53,h*.44),sway=reduced?0:Math.sin(time*.42+side)*5,x=side<0?-s*.48:w-s*.50,y=view.frame.y+view.frame.h*.98;p.globalAlpha=['museum','painting','sky','ceremony','case','memory','letter','finale'].includes(scene.chapter)?0:.83*q+.25;p.drawImage(asset,x+sway,y-s*.52,s,s*.60);}
   if(q>.1){const branchSize=Math.min(h*1.4,w*1.18),sweep=scene.beat==='through-the-leaves'?Math.sin(ease(q)*Math.PI)*w*.22:0;p.globalAlpha=q*.86;p.drawImage(this.assets.get('tree1'),-branchSize*.57+sweep,-branchSize*.45,branchSize*.68,branchSize*1.2);p.drawImage(this.assets.get('tree2'),w-branchSize*.15-sweep,-branchSize*.53,branchSize*.6,branchSize*1.18);}p.restore();
   const light=scene.light;p.save();p.globalCompositeOperation='screen';const r=27+Math.sin(time*1.7)*2;p.globalAlpha=.8;p.drawImage(this.glow,light.x-r,light.y-r,r*2,r*2);p.fillStyle='#fff5cc';ellipse(p,light.x,light.y,2.0,2.8,'#fff5cc');p.strokeStyle='#fff6d5';p.lineWidth=.7;p.beginPath();p.ellipse(light.x-3.5,light.y-1,3.2,1.5,-.5,0,TAU);p.ellipse(light.x+3.5,light.y-1,3.2,1.5,.5,0,TAU);p.stroke();p.restore();
   if(profile!=='gentle'&&!reduced){p.save();p.globalCompositeOperation='screen';for(let j=0;j<14;j++){const a=j*2.399,x=w*.5+Math.cos(a+time*.026)*w*(.17+(j%4)*.08),y=h*.32+(j%7)*h*.057+Math.sin(time*.19+j)*7;p.globalAlpha=(.10+Math.sin(time*.7+j)*.07)*(q*.7+.3);p.drawImage(this.glow,x-4,y-4,8,8);}p.restore();}
   // A painted footlight under the poetry keeps it legible without putting it in a card.
   if(view.kind==='landscape'){const side=p.createLinearGradient(0,0,w*.40,0);side.addColorStop(0,'#112d2ae8');side.addColorStop(.75,'#112d2aa0');side.addColorStop(1,'#112d2a00');p.fillStyle=side;p.fillRect(0,0,w*.40,h);const foot=p.createLinearGradient(0,h-70,0,h);foot.addColorStop(0,'#112d2a00');foot.addColorStop(1,'#112d2a');p.fillStyle=foot;p.fillRect(0,h-70,w,70);}else{const shade=p.createLinearGradient(0,view.captionTop-30,0,h);shade.addColorStop(0,'#112d2a00');shade.addColorStop(.25,'#112d2acb');shade.addColorStop(1,'#112d2a');p.fillStyle=shade;p.fillRect(0,view.captionTop-30,w,h-view.captionTop+30);}
  }
 }
 VF.Environment=Environment;
})();
