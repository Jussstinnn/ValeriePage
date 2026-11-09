/* Concrete, bounded consequences rendered in the final Canvas, never hidden iframe DOM. */
(() => {
 const {clamp,ease,mix}=window.VMath,TAU=Math.PI*2;
 class WorldStage {
  constructor(session){this.session=session;this.nodes=[];this.scene='';this.lastEffect=null;this.frames=0;this.strokeSamples=0;this.selectedAt=-100;this.selectedFlower=null;}
  enter(id){this.scene=id;this.selectedFlower=id==='lily'?this.session.events.get('lily:selection')?.flower??null:null;this.nodes=(this.session.events.get('couple:constellation')?.nodes||[]).map(p=>({...p}));this.lastEffect=null;}
  event(id,event){this.lastEffect={...event,scene:id};this.session.remember(id+':discovery',{at:event.at,manual:event.manual});if(id==='lily'&&!this.session.events.has('lily:selection'))this.selectFlower(0,event.at,{manual:false});if(id==='couple'&&!this.nodes.length)this.nodes=this.defaultStars();}
  defaultStars(){const shift=this.session.has('pigment')?.025:0;return[{x:.24,y:.20},{x:.36,y:.13+shift},{x:.49,y:.25},{x:.65,y:.14},{x:.77,y:.22}];}
  gardenSeed(){const nodes=this.session.events.get('couple:constellation')?.nodes||[];return nodes.length?Math.max(0,Math.min(13,Math.round(nodes.reduce((s,n)=>s+n.x,0)/nodes.length*13))):0;}
  trace(x,y,time){if(y>.44)return false;const p={x:clamp(x,.13,.86),y:clamp(y,.08,.40)},magnet=this.defaultStars().find(s=>Math.hypot(s.x-p.x,s.y-p.y)<.09);if(magnet){p.x=mix(p.x,magnet.x,.78);p.y=mix(p.y,magnet.y,.78);}const last=this.nodes.at(-1);if(last&&Math.hypot(p.x-last.x,p.y-last.y)<.075)return false;if(this.nodes.length>=6)this.nodes.shift();this.nodes.push(p);this.session.remember('couple:constellation',{nodes:this.nodes.map(p=>({...p})),at:time});return true;}
  restoreFlower(id,time){this.selectedFlower=id;this.selectedAt=this.session.events.get('lily:selection')?.at??time-4;}
  selectFlower(id,time,{manual=true,color='#e3c5c9'}={}){this.selectedFlower=id;this.selectedAt=time;this.session.remember('lily:selection',{flower:id,at:time,manual,color});}
  draw(ctx,{id,time,rect,source,api,shot,direction,reduced}){
   if(!rect)return;this.frames++;ctx.save();ctx.beginPath();ctx.rect(rect.x,rect.y,rect.w,rect.h);ctx.clip();
   const event=this.session.events.get(id+':discovery'),age=event?Math.max(0,time-event.at):-1;
   if(id==='mushroom')this.forest(ctx,rect,time,direction,reduced);
   // RC05's traversable painting owns deformation; the legacy inset effect is not stacked on it.
   if(id==='couple'&&age>=0)this.sky(ctx,rect,age,time,reduced);
   if(id==='lily'&&this.selectedFlower!==null)this.flower(ctx,rect,time,direction,reduced);
   if(id.startsWith('memory'))this.memory(ctx,rect,time,id,direction,reduced);
   ctx.restore();
  }
  forest(p,r,time,d,reduced){
   if(!this.session.events.has('rabbit:discovery')&&!this.session.has('paw'))return;
   p.save();p.globalAlpha=.28*ease(time/3);for(let j=0;j<3;j++){const x=r.x+r.w*(.22+j*.10),y=r.y+r.h*(.91-j*.035);p.drawImage(d.icons.paw,x-10,y-10,20,20);}p.restore();
  }
  museum(p,source,b,r,age,time,d,reduced){
   if(!b)return;const x=r.x+b.x*r.w,y=r.y+b.y*r.h,w=b.w*r.w,h=b.h*r.h;
   const activity=reduced?0:Math.sin(Math.min(1,age/7.5)*Math.PI),gain=activity*(this.session.has('fairy')?1.3:1);
   p.save();p.beginPath();p.rect(x+2,y+2,w-4,h-4);p.clip();
   if(gain>.001){const rows=10,band=b.h*source.height/rows;p.globalCompositeOperation='source-over';for(let j=0;j<rows;j++){const shift=Math.sin(time*.8+j*.61)*gain*Math.min(2.0,w*.007);p.drawImage(source,b.x*source.width,b.y*source.height+j*band,b.w*source.width,band,x+shift,y+j*h/rows,w,h/rows+1);}this.strokeSamples+=rows;}
   p.globalCompositeOperation='screen';p.font='8px monospace';p.textAlign='center';
   for(let j=0;j<36;j++){const t=j/35,front=clamp(age/3);if(t>front&&!reduced)continue;const flow=t*5.5+time*.18,xx=x+w*(.20+t*.61),yy=y+h*(.40+Math.sin(flow)*.10);p.globalAlpha=(reduced?.25:activity*.55);p.fillStyle=j%4?'#bdcece':'#ead597';p.fillText(j%7===0?':':'·',xx,yy);}
   // A painted star detaches and becomes the next world's actual constellation seed.
   const q=reduced?1:ease((age-2.3)/3),sx=x+w*mix(.68,.88,q),sy=y+h*mix(.30,.08,q);p.globalAlpha=.48+.22*activity;p.drawImage(d.icons.star,sx-14,sy-14,28,28);p.restore();
  }
  sky(p,r,age,time,reduced){
   const nodes=this.nodes.length>=2?this.nodes:this.defaultStars(),front=reduced?1:ease(age/3.5);p.save();p.strokeStyle='#c7d6df83';p.lineWidth=.7;p.fillStyle='#f5e4c6';p.textAlign='center';p.font='12px monospace';
   for(let j=0;j<nodes.length;j++){const n=nodes[j],x=r.x+n.x*r.w,y=r.y+n.y*r.h;if(j){const a=nodes[j-1],t=clamp(front*(nodes.length-1)-(j-1));p.globalAlpha=.50;p.beginPath();p.moveTo(r.x+a.x*r.w,r.y+a.y*r.h);p.quadraticCurveTo(r.x+mix(a.x,n.x,t*.5)*r.w,r.y+(Math.min(a.y,n.y)-.015)*r.h,r.x+mix(a.x,n.x,t)*r.w,r.y+mix(a.y,n.y,t)*r.h);p.stroke();}p.globalAlpha=clamp(front*nodes.length-j);p.fillText(j===nodes.length-1?'+':'*',x,y);}
   if(age>4){const q=reduced?1:ease((age-4)/4),n=nodes.at(-1);p.globalAlpha=.55;p.fillText(':',r.x+mix(n.x,.50,q)*r.w,r.y+mix(n.y,.82,q)*r.h);}p.restore();
  }
  flower(p,r,time,d,reduced){
   const age=Math.max(0,time-this.selectedAt),id=this.selectedFlower;if(age>3.2)return;p.save();p.globalAlpha=(reduced?.4:Math.sin(Math.min(1,age/3.2)*Math.PI))*.65;
   // The selected petal's identity returns in the album, rather than spawning unrelated confetti.
   const point=d.lastPoint||{x:r.x+r.w*.5,y:r.y+r.h*.5};p.drawImage(d.icons.petal,point.x-13,point.y-13,26,26);p.restore();
  }
  memory(p,r,time,id,d,reduced){
   const choice=this.session.events.get('lily:selection');if(!choice||time>4.5||reduced)return;
   const q=ease(time/4.5),side=id==='memory08'?1:-1,x=side<0?r.x+14:r.x+r.w-14,y=r.y+18+q*28;p.save();p.globalAlpha=(1-q)*.45;p.fillStyle=choice.color||'#e3c5c9';p.font='9px monospace';for(let j=0;j<18;j++){const a=j/18*TAU;p.fillText(j%(3+choice.flower%3)?'·':':',x+Math.sin(a)*7,y+Math.cos(a)*11);}p.restore();d.lastPoint={x,y};this.session.light={...d.snapshot(),screenX:x/innerWidth,screenY:y/innerHeight};
  }
  state(){return{scene:this.scene,nodes:this.nodes.map(p=>({...p})),lastEffect:this.lastEffect,frames:this.frames,museumStripDraws:this.strokeSamples,selectedFlower:this.selectedFlower};}
 }
 window.VWorldStage=WorldStage;
})();
