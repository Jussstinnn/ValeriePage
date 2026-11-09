/* A small presence with inertia. Film time owns movement, discoveries and assembly. */
(() => {
 const {ease,mix,clamp}=window.VMath,TAU=Math.PI*2;
 const ids=['star','paw','fairy','pigment','wish','petal'];
  const curve=(a,b,c,d,q)=>{const s=1-q;return s*s*s*a+3*s*s*q*b+3*s*q*q*c+q*q*q*d};
 function symbol(id){
  const c=document.createElement('canvas');c.width=c.height=96;const p=c.getContext('2d');p.translate(48,48);p.font='8px monospace';p.textAlign='center';p.textBaseline='middle';p.fillStyle='#e5d0b4';
  for(let n=0;n<64;n++){const q=n/64,a=q*TAU;let x,y;
   if(id==='star'){const r=19+11*Math.cos(5*a);x=Math.sin(a)*r;y=-Math.cos(a)*r;}
   else if(id==='paw'){if(n<32){x=Math.cos(a*2)*19;y=10+Math.sin(a*2)*12;}else{const toe=Math.floor((n-32)/8),t=(n%8)/8*TAU;x=(toe-1.5)*13+Math.cos(t)*5;y=-13+Math.abs(toe-1.5)*4+Math.sin(t)*7;}}
   else if(id==='fairy'){const side=n<32?-1:1,t=(n%32)/32*TAU;x=side*(5+Math.sin(t)*Math.sin(t)*24);y=Math.cos(t)*20;}
   else if(id==='pigment'){x=-23+q*46;y=Math.sin(q*Math.PI*3)*13+(n%3-1)*6;}
   else if(id==='wish'){x=-28+q*51;y=17-35*q+Math.sin(q*Math.PI)*-8;}
   else{x=Math.sin(a)*Math.pow(Math.sin(a/2),2)*24;y=-Math.cos(a)*28;}
   p.globalAlpha=.45+(n%5)*.1;p.fillText(n%7===0?'+':n%3===0?':':'·',x,y);
  }p.globalAlpha=1;return c;
 }
 class Direction {
  constructor(session){this.session=session;this.events=new Map();this.autoEvents=new Set();this.carry={star:false,guide:false,forest:false,wish:false};this.x=.78;this.y=.18;this.vx=this.vy=0;this.pointer=null;this.index=-1;this.time=0;this.pending=null;this.lastPoint=null;this.trailX=new Float32Array(40);this.trailY=new Float32Array(40);this.head=0;this.trailCount=0;this.icons=Object.fromEntries(ids.map(id=>[id,symbol(id)]));this.titlePoints=[];this.finaleNodes=[];this.cost=0;
   this.composer=new window.VShotComposer();this.layerSamples=new Float32Array(240);this.layerHead=0;this.layerCount=0;
   this.glow=document.createElement('canvas');this.glow.width=this.glow.height=64;const g=this.glow.getContext('2d'),h=g.createRadialGradient(32,32,0,32,32,30);h.addColorStop(0,'#ffebbf77');h.addColorStop(.2,'#f5dba02b');h.addColorStop(1,'#e2caa000');g.fillStyle=h;g.fillRect(0,0,64,64);
   this.tones=window.VStory.chapters.slice(0,6).map(scene=>{const c=document.createElement('canvas');c.width=c.height=64;const p=c.getContext('2d'),a=p.createRadialGradient(32,32,0,32,32,30);a.addColorStop(0,scene.color+'99');a.addColorStop(.24,scene.color+'3a');a.addColorStop(1,scene.color+'00');p.fillStyle=a;p.fillRect(0,0,64,64);return c;});this.toneIndex=0;this.previousTone=0;this.entryTime=0;
  }
  reset(){this.events.clear();this.autoEvents.clear();this.session?.reset();this.carry={star:false,guide:false,forest:false,wish:false};this.lastPoint=null;this.pending=null;this.trailCount=0;this.finaleNodes=[];}
  replay(index){this.events.delete(index);this.autoEvents.delete(index);this.pointer=null;this.trailCount=0;}
  enter(index,time,{snapshot=null,origin=null,rect=null}={}){
   this.previousTone=snapshot?.toneIndex??this.toneIndex;this.toneIndex=Math.min(5,Math.max(0,index));this.entryTime=snapshot?time-2:time;this.selectedFocus=snapshot?.selectedFocus||null;this.index=index;this.time=time;this.pointer=null;this.pending=null;this.layerHead=0;this.layerCount=0;const a=this.choreography(index,time);
   this.x=snapshot?.x??(origin&&rect?clamp((origin.screenX*innerWidth-rect.x)/rect.w,.02,.98):a.x);this.y=snapshot?.y??(origin&&rect?clamp((origin.screenY*innerHeight-rect.y)/rect.h,.02,.98):a.y);
   this.vx=snapshot?.vx??(origin&&rect?(origin.screenVX||0)*innerWidth/rect.w:0);this.vy=snapshot?.vy??(origin&&rect?(origin.screenVY||0)*innerHeight/rect.h:0);this.trailCount=0;
   const event=this.session?.events.get(window.VStory.chapters[index]?.id+':discovery');if(event){this.events.set(index,event);this.autoEvents.add(index);}else{this.events.delete(index);this.autoEvents.delete(index);}
  }
  snapshot(){return{x:this.x,y:this.y,vx:this.vx,vy:this.vy,selectedFocus:this.selectedFocus||null,toneIndex:this.toneIndex};}
  recordLayer(cost){this.cost=cost;this.layerSamples[this.layerHead]=cost;this.layerHead=(this.layerHead+1)%240;this.layerCount=Math.min(240,this.layerCount+1);}
  measureLayers(){const a=Array.from(this.layerSamples.slice(0,this.layerCount)).sort((x,y)=>x-y);return{samples:a.length,median:a[Math.floor(a.length*.5)]||0,p95:a[Math.floor(a.length*.95)]||0,max:a.at(-1)||0};}
  seek(index,time){this.enter(index,time);}
  shot(index,time,reduced){return this.composer.compose(window.VStory.chapters[index]?.id,time,reduced,this.selectedFocus);}
  choreography(index,time){
   const path=window.VScore.get(window.VStory.chapters[index]?.id)?.lightPath||[[0,.5,.5]];let a=path[0],b=a;
   for(let i=1;i<path.length;i++){if(time<path[i][0]){b=path[i];break;}a=b=path[i];}
   const q=a===b?0:ease((time-a[0])/(b[0]-a[0])),x=mix(a[1],b[1],q),y=mix(a[2],b[2],q)-Math.sin(q*Math.PI)*.06;
   return{x:x+Math.sin(time*.9+index)*.014,y:y+Math.cos(time*.7+index)*.012};
  }
  grab(x,y,time){this.pointer={x,y,at:time};}
  move(x,y){if(this.pointer){this.pointer.x=clamp(x,.02,.98);this.pointer.y=clamp(y,.02,.98);}}
  release(){this.pointer=null;}
  request(index,time,manual=true){
   if(index<0||index>5)return;const old=this.events.get(index);if(manual&&old?.manual&&time-old.at<1.4)return;
   this.session?.remember(window.VStory.chapters[index].id+':discovery',{at:time,manual});this.events.set(index,{at:time,manual,count:(old?.count||0)+1});this.autoEvents.add(index);this.pending={index,id:ids[index],manual,at:time};
   if(manual){this.session?.discover(ids[index]);if(index===0)this.carry.star=true;if(index===1)this.carry.guide=true;if(index===2)this.carry.forest=true;if(index===4)this.carry.wish=true;}
  }
  interact(index,time){this.request(index,time,true);}
  consume(){const event=this.pending;this.pending=null;return event;}
  update(dt,index,time,reduced){
   this.time=time;if(index!==this.index)this.enter(index,time);if(index>5)return;
   if(!this.autoEvents.has(index)&&time>=(window.VScore.get(window.VStory.chapters[index]?.id)?.autoAt??Infinity)&&!reduced)this.request(index,time,false);
   const anchor=window.VScore.get(window.VStory.chapters[index]?.id)?.anchor||[.5,.5],target=this.pointer||this.choreography(index,time);
   if(reduced){this.x=anchor[0];this.y=anchor[1];this.vx=this.vy=0;return;}
   const steps=Math.max(1,Math.ceil(dt/.025)),step=dt/steps;
   for(let i=0;i<steps;i++){this.vx+=((target.x-this.x)*14-this.vx*5.4)*step;this.vy+=((target.y-this.y)*14-this.vy*5.4)*step;this.x=clamp(this.x+this.vx*step,.02,.98);this.y=clamp(this.y+this.vy*step,.02,.98);}
   this.trailX[this.head]=this.x;this.trailY[this.head]=this.y;this.head=(this.head+1)%40;this.trailCount=Math.min(40,this.trailCount+1);
   if(this.pointer&&(Math.hypot(this.x-anchor[0],this.y-anchor[1])<.105||(index===0&&time-this.pointer.at>.7))&&!this.events.get(index)?.manual)this.request(index,time,true);
  }
  point(index,time,rect){return{x:rect.x+this.x*rect.w,y:rect.y+this.y*rect.h};}
  draw(ctx,index,time,rect,reduced){
   if(!rect||index>5)return;const point=this.point(index,time,rect);this.lastPoint=point;this.session.light={...this.snapshot(),screenX:point.x/innerWidth,screenY:point.y/innerHeight,screenVX:this.vx*rect.w/innerWidth,screenVY:this.vy*rect.h/innerHeight};
   ctx.save();ctx.globalCompositeOperation='screen';ctx.font='9px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ddcaa9';
   if(!reduced)for(let i=2;i<this.trailCount;i+=2){const n=(this.head-1-i+40)%40;ctx.globalAlpha=(1-i/40)*.48;ctx.fillText(i%6===0?':':'·',rect.x+this.trailX[n]*rect.w,rect.y+this.trailY[n]*rect.h);}
   const warmth=reduced?1:ease((time-this.entryTime)/2),brightness=reduced?.65:.75+Math.sin(time*1.7)*.13;ctx.globalAlpha=brightness*(1-warmth);ctx.drawImage(this.tones[this.previousTone],point.x-24,point.y-24,48,48);ctx.globalAlpha=brightness*warmth;ctx.drawImage(this.tones[this.toneIndex],point.x-24,point.y-24,48,48);ctx.fillStyle='#fff1cb';ctx.font='14px monospace';ctx.fillText('+',point.x,point.y);
   const event=this.events.get(index),age=event?Math.max(0,time-event.at):0;
   if(index===1&&event){for(let j=0;j<4;j++){const q=reduced?1:clamp((age-j*.65)/.8);if(!q)continue;const x=rect.x+(.62+j*.055)*rect.w,y=rect.y+(.81+j*.025)*rect.h;ctx.globalAlpha=q*.48;ctx.drawImage(this.icons.paw,x-13,y-13,26,26);}}
   if(index===2&&event){const x=rect.x+.73*rect.w,y=rect.y+.28*rect.h-Math.sin(Math.min(4,age)*.8)*18,flap=reduced?1:.65+Math.sin(time*8)*.25;ctx.globalAlpha=.85;ctx.drawImage(this.icons.fairy,x-23*flap,y-23,46*flap,46);ctx.font='12px monospace';ctx.fillText(':',x,y);}
   ctx.restore();
  }
  drawMemory(ctx,index,time,rect,reduced){
   if(!rect||reduced||time>3.8||index<6||index>8)return;
   const q=ease(time/2.4),fade=1-ease((time-2.1)/1.7);ctx.save();ctx.font='7px monospace';ctx.fillStyle='#d3b8ba';ctx.globalAlpha=fade*.5;
   if(index===7){for(let j=0;j<24;j++){const t=j/23;if(t>q)continue;ctx.fillText(j%6===0?':':'·',rect.x+rect.w*t,rect.y-7);ctx.fillText(j%6===0?':':'·',rect.x+rect.w*(1-t),rect.y+rect.h+7);}}
   else{for(let j=0;j<36;j++){const t=j/35;if(t>q)continue;ctx.fillText(j%8===0?':':'·',rect.x-4,rect.y+rect.h*(index===6?t:1-t));if(index===6)ctx.fillText(j%8===0?':':'·',rect.x+rect.w+2,rect.y+rect.h*(1-t));}}
   ctx.restore();
  }
  drawLetter(ctx,time,rect,page,reduced){
   if(!rect)return;ctx.save();ctx.fillStyle='#dec5b1';ctx.font='8px monospace';const q=reduced?1:ease(time/3);for(let j=0;j<36*q;j++){ctx.globalAlpha=.25+j/120;const x=rect.x-13+Math.sin(j*.14)*2,y=rect.y+8+j*Math.min(5,(rect.h-20)/36);ctx.fillText(j%8===0?':':'·',x,y);}ctx.restore();
  }
  prepareFinale(width,height){
   this.titlePoints=[];const pre=document.querySelector('.finale-preface').getBoundingClientRect(),controls=document.querySelector('#controls').getBoundingClientRect();
   const compact=height<700,header=document.querySelector('#frame-top').getBoundingClientRect(),end=document.querySelector('#restart').getBoundingClientRect();
   this.finaleNodes=ids.map((id,i)=>({id,discovered:!!this.session?.has(id),size:compact?20:48,x:width*(.10+i*.16),y:compact?controls.top-14:Math.max(header.bottom+28,pre.top-42)-Math.sin(i/5*Math.PI)*12}));
   for(const el of document.querySelectorAll('#finale-title span')){
    const r=el.getBoundingClientRect(),style=getComputedStyle(el),c=document.createElement('canvas');c.width=Math.ceil(r.width);c.height=Math.ceil(r.height);const p=c.getContext('2d',{willReadFrequently:true});p.font=`${style.fontWeight} ${style.fontSize} FilmSerif`;p.textBaseline='alphabetic';p.textAlign='center';p.fillStyle='#fff';p.letterSpacing=style.letterSpacing;const m=p.measureText(el.textContent);p.fillText(el.textContent,c.width/2,(r.height+m.actualBoundingBoxAscent-m.actualBoundingBoxDescent)/2);const data=p.getImageData(0,0,c.width,c.height).data,step=width<701?5:7;
    for(let y=1;y<c.height;y+=step)for(let x=1;x<c.width;x+=step)if(data[(y*c.width+x)*4+3]>100)this.titlePoints.push({x:r.x+x,y:r.y+y,seed:(x*17+y*7)%97/97});
   }
   if(this.titlePoints.length>760)this.titlePoints=this.titlePoints.filter((_,i)=>i%Math.ceil(this.titlePoints.length/760)===0);
  }
  drawFinale(ctx,time,width,height,reduced){
   if(!this.finaleNodes.length)this.prepareFinale(width,height);
   ctx.save();ctx.globalCompositeOperation='screen';const q=reduced?1:ease(time/2.6);
   for(let i=0;i<6;i++){const n=this.finaleNodes[i];ctx.globalAlpha=(n.discovered?.77:.55)*q;ctx.drawImage(this.icons[n.id],n.x-n.size/2,n.y-n.size/2,n.size,n.size);if(i){const a=this.finaleNodes[i-1];if(Math.abs(a.y-n.y)<60){ctx.strokeStyle='#d5c3a535';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo((a.x+n.x)/2,Math.min(a.y,n.y)-12,n.x,n.y);ctx.stroke();}}}
   if(!reduced&&time<4.5){const settle=ease((time-.8)/3.1);ctx.font='8px monospace';ctx.fillStyle='#edddbf';ctx.textAlign='center';ctx.textBaseline='middle';
    for(let i=0;i<this.titlePoints.length;i++){const p=this.titlePoints[i],origin=this.finaleNodes[i%6],t=clamp(settle*1.16-p.seed*.16),x=curve(origin.x,origin.x+(p.x-origin.x)*.25,p.x+Math.sin(p.seed*TAU)*25,p.x,t),y=curve(origin.y,origin.y+50+p.seed*55,p.y-20,p.y,t);ctx.globalAlpha=Math.min(1,time)*Math.min(1,(4.5-time)/.5)*(.5+p.seed*.5);ctx.fillText(i%7===0?'+':i%3===0?':':'·',x,y);}
   }ctx.restore();
  }
  transitionPoint(q,from,to){return{x:curve(from.x,from.x+(to.x-from.x)*.3,to.x-(to.x-from.x)*.15,to.x,ease(q)),y:curve(from.y,from.y-70,to.y-45,to.y,ease(q))};}
  drawPetalBridge(ctx,q,from,to){
   ctx.save();ctx.globalCompositeOperation='screen';ctx.font='9px monospace';ctx.fillStyle='#e7c5c2';ctx.textAlign='center';const t=ease(q);
   for(let i=0;i<36;i++){const s=i/35,a=from.x+from.w*(.20+.60*s),b=from.y+from.h*(.16+.50*((i*7)%17)/17),x=curve(a,a+(s-.5)*70,to.x-35,to.x,t),y=curve(b,b-80,to.y+30,to.y,t);ctx.globalAlpha=Math.sin(Math.PI*q)*(.4+(i%3)*.2);ctx.fillText(i%5===0?'+':':',x,y);}ctx.restore();
  }
  state(){return{carry:{...this.carry},events:[...this.events.entries()],light:this.lastPoint,motion:{x:this.x,y:this.y,vx:this.vx,vy:this.vy,dragging:!!this.pointer},trailCapacity:40,temperature:window.VStory.chapters[this.toneIndex].color,layerCostMs:this.cost,finale:this.finaleNodes.map(n=>({id:n.id,discovered:n.discovered,x:n.x,y:n.y,size:n.size}))};}
 }
 window.VDirection=Direction;
})();
