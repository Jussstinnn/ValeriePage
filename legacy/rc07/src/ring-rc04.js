/* A stylized original jewel: projected hinge, velvet, occlusion and reflected light. */
(() => {
 const {ease,clamp}=window.VMath,TAU=Math.PI*2;
 class Ring {
  constructor(){
   this.surface=document.createElement('canvas');this.surface.width=this.surface.height=640;this.ctx=this.surface.getContext('2d',{willReadFrequently:true});this.ascii=document.createElement('canvas');this.ascii.width=this.ascii.height=640;this.out=this.ascii.getContext('2d');this.last='';this.phase='closed';this.drawFrames=0;
   const grain=document.createElement('canvas');grain.width=grain.height=64;const g=grain.getContext('2d');for(let i=0;i<1080;i++){const x=(i*37)%64,y=(i*19+Math.floor(i/64)*7)%64;g.fillStyle=i%3?'#d2a9b20b':'#05050b28';g.fillRect(x,y,1,2);}this.texture=this.ctx.createPattern(grain,'repeat');
  }
  draw(time,openAt,reduced=false){
   const age=openAt===null?-1:Math.max(0,time-openAt),a=age<0?0:reduced?1:ease((age-.85)/3.5);
   this.phase=reduced&&age>=0?'contemplation':age<0?'closed':age<.85?'anticipation':age<4.35?'opening':age<6.3?'revealed':'contemplation';
   const glint=age<3.7?0:reduced?.3:Math.max(0,Math.sin((age-3.7)*1.1))*Math.min(1,(age-3.7)/1.4),light=reduced?.5:.5+.5*Math.sin(time*.5);
   const key=Math.round(a*84)+':'+Math.round(glint*18)+':'+Math.round(light*10);if(key===this.last)return this.ascii;this.last=key;
   this.drawFrames++;const p=this.ctx;p.clearRect(0,0,640,640);
   const project=(x,y,z)=>[320+x*(1+z*.00065),390+z*.68-y];
   const path=points=>{p.beginPath();points.forEach(([x,y],i)=>i?p.lineTo(x,y):p.moveTo(x,y));p.closePath();};
   const poly=(points,fill,stroke)=>{path(points);p.fillStyle=fill;p.fill();if(stroke){p.strokeStyle=stroke;p.lineWidth=1.5;p.stroke();}};
   const texture=points=>{p.save();path(points);p.clip();p.fillStyle=this.texture;p.fillRect(100,120,450,440);p.restore();};
   const backLeft=project(-170,0,-90),backRight=project(170,0,-90),frontLeft=project(-190,0,90),frontRight=project(190,0,90),bottomLeft=project(-180,-80,90),bottomRight=project(180,-80,90);
   p.fillStyle='#05070bbb';p.beginPath();p.ellipse(320,535,190,17,0,0,TAU);p.fill();
   const face=p.createLinearGradient(0,410,0,540);face.addColorStop(0,'#9c727a');face.addColorStop(.23,'#684b60');face.addColorStop(1,'#33293b');
   const front=[frontLeft,frontRight,bottomRight,bottomLeft];poly(front,face,'#bd9296');texture(front);
   poly([backLeft,frontLeft,bottomLeft,project(-164,-76,-90)],'#473346','#8e6c7b');
   const inside=p.createRadialGradient(320,388,4,320,388,185);inside.addColorStop(0,'#ac888c');inside.addColorStop(.50,'#705165');inside.addColorStop(1,'#2a2335');
   const cushion=[backLeft,backRight,frontRight,frontLeft];poly(cushion,inside,'#c2a397');texture(cushion);
   // Hinge barrels and their contact occlusion stay attached to the rear edge.
   p.strokeStyle='#18172299';p.lineWidth=5;p.beginPath();p.moveTo(backLeft[0]+4,backLeft[1]+3);p.lineTo(backRight[0]-4,backRight[1]+3);p.stroke();
   for(const hx of [-105,105]){const h=project(hx,0,-90);const metal=p.createLinearGradient(0,h[1]-3,0,h[1]+5);metal.addColorStop(0,'#d8c3ac');metal.addColorStop(.5,'#796a75');metal.addColorStop(1,'#332d3b');p.fillStyle=metal;p.fillRect(h[0]-13,h[1]-2,26,7);}
   // Recess and slot stay attached to the cushion beneath the band.
   p.fillStyle='#211d2bb8';p.beginPath();p.ellipse(320,405,79,20,0,0,TAU);p.fill();p.strokeStyle='#ad899784';p.lineWidth=2;p.beginPath();p.moveTo(268,410);p.quadraticCurveTo(320,420,372,410);p.stroke();
   // Four projected corners share one actual hinge; no disconnected fading front lid.
   const theta=a*1.65,z=-90+164*Math.cos(theta),up=164*Math.sin(theta),lidTopLeft=project(-178,up,z),lidTopRight=project(178,up,z),lid=[backLeft,backRight,lidTopRight,lidTopLeft];
   const lining=p.createLinearGradient(0,lidTopLeft[1],0,backLeft[1]);lining.addColorStop(0,a>.3?'#8c697b':'#af8790');lining.addColorStop(.45,'#5f475e');lining.addColorStop(1,'#302939');
   poly(lid,lining,'#d6b6ad');texture(lid);
   const center=lid.reduce((v,point)=>[v[0]+point[0]/4,v[1]+point[1]/4],[0,0]),inner=lid.map(([x,y])=>[center[0]+(x-center[0])*.89,center[1]+(y-center[1])*.80]);
   p.save();path(inner);p.strokeStyle=a>.3?'#b798a1':'#d6b1b0';p.lineWidth=1;p.stroke();p.restore();
   // A narrow travelling reflection describes material without changing the box scale.
   p.save();path(lid);p.clip();p.globalAlpha=.12+light*.07;p.strokeStyle='#f7ddc7';p.lineWidth=2;p.beginPath();p.moveTo(180+light*170,130);p.lineTo(90+light*170,530);p.stroke();p.restore();
   if(a<.42){p.save();p.globalAlpha=1-ease(a/.42);p.fillStyle='#f0d4c1';p.textAlign='center';p.textBaseline='middle';p.font='42px FilmSerif';p.fillText('V',center[0],center[1]+2);p.strokeStyle='#d7b59d';p.lineWidth=1;
    for(const side of [-1,1]){p.beginPath();p.moveTo(320+side*35,center[1]+10);p.quadraticCurveTo(320+side*60,center[1],320+side*81,center[1]-20);for(let i=0;i<4;i++){const x=320+side*(42+i*9),y=center[1]+5-i*6;p.moveTo(x,y);p.quadraticCurveTo(x+side*10,y-12,x+side*1,y-12);p.quadraticCurveTo(x-side*5,y-5,x,y);}p.stroke();}p.restore();
   }
   // The lining occludes the jewel until the lid physically uncovers its position.
   const reveal=ease((a-.28)/.65);if(reveal>0){
    const cy=385-reveal*35,rx=38,ry=64;
    p.save();p.globalAlpha=reveal;
    p.strokeStyle='#393346';p.lineWidth=17;p.beginPath();p.ellipse(322,cy+2,rx,ry,-.14,0,TAU);p.stroke();
    const metal=p.createLinearGradient(270,0,372,0);metal.addColorStop(0,'#7a8393');metal.addColorStop(.18,'#f9e9cc');metal.addColorStop(.39,'#b5b6be');metal.addColorStop(.56,'#fff5df');metal.addColorStop(.68,'#747d91');metal.addColorStop(.88,'#eee3d0');metal.addColorStop(1,'#b5a69f');
    p.strokeStyle=metal;p.lineWidth=10;p.beginPath();p.ellipse(320,cy,rx,ry,-.14,0,TAU);p.stroke();p.strokeStyle='#fff1d8a6';p.lineWidth=1.2;p.beginPath();p.ellipse(319,cy,rx-5,ry-4,-.14,-2,1.6);p.stroke();
    const sy=cy-ry-4;
    poly([[318,sy-19],[336,sy-12],[342,sy+2],[320,sy+22],[297,sy+2],[302,sy-12]],'#b8b9cb','#fff2df');
    poly([[318,sy-19],[320,sy+22],[302,sy-12]],'#8f98b3');poly([[336,sy-12],[320,sy+22],[342,sy+2]],'#d3bdbe');poly([[302,sy-12],[318,sy-19],[336,sy-12],[320,sy-3]],'#fff8ea');
    p.strokeStyle='#fdf3df';p.lineWidth=1.5;for(const [x,y]of [[300,sy-10],[339,sy-9],[320,sy+20]]){p.beginPath();p.moveTo(x-2,y+5);p.lineTo(x+1,y-2);p.stroke();}
    p.globalAlpha=glint;p.strokeStyle='#fff4d8';p.lineWidth=1.6;p.beginPath();p.moveTo(327,sy-31);p.lineTo(327,sy+8);p.moveTo(308,sy-11);p.lineTo(346,sy-11);p.stroke();p.restore();
   }
   const data=p.getImageData(0,0,640,640).data,o=this.out,glyphs=' .·:;irsXA253hMHGS#%@';o.clearRect(0,0,640,640);o.font='9px monospace';o.textAlign='center';o.textBaseline='middle';
   for(let y=2;y<560;y+=7)for(let x=105;x<540;x+=5){const i=(y*640+x)*4,r=data[i],g=data[i+1],b=data[i+2];if(data[i+3]<30)continue;const lum=.2126*r+.7152*g+.0722*b;if(lum<20)continue;const ch=glyphs[Math.min(glyphs.length-1,Math.floor(Math.pow(lum/255,.72)*glyphs.length))];o.globalAlpha=data[i+3]/255;o.fillStyle=`rgb(${Math.pow(r/255,.78)*255|0},${Math.pow(g/255,.78)*255|0},${Math.pow(b/255,.78)*255|0})`;o.fillText(ch,x,y);}o.globalAlpha=1;
   return this.ascii;
  }
 }
 window.VRing=Ring;
})();
