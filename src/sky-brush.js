/* A bounded, resampled finger trace in normalized sky coordinates; never a giant blur. */
(() => {
 const {clamp}=VF.math;
 class SkyBrush{
  constructor(raw){this.points=Array.isArray(raw?.points)?raw.points.filter(q=>Number.isFinite(q.x)&&Number.isFinite(q.y)&&q.x>=0&&q.x<=1&&q.y>=0&&q.y<=1).slice(0,160):[];this.active=false;this.complete=raw?.complete===true&&this.points.length>2;this.distance=0;}
  serialize(){return{points:this.points.map(q=>({...q})),complete:this.complete};}
  clear(){this.points=[];this.active=false;this.complete=false;this.distance=0;}
  point(x,y,v){return{x:clamp((x-v.frame.x)/v.frame.w,.03,.97),y:clamp((y-v.frame.y)/v.frame.h,.04,.76)};}
  begin(x,y,v){this.clear();this.active=true;this.points.push(this.point(x,y,v));}
  move(x,y,v){if(!this.active)return;const q=this.point(x,y,v),last=this.points.at(-1),d=Math.hypot(q.x-last.x,q.y-last.y);if(d<.008)return;this.distance+=d;this.points.push(q);if(this.points.length>160)this.points.splice(1,1);}
  end(){this.active=false;this.complete=this.points.length>=3&&this.distance>.08;return this.complete;}
  cancel(){if(this.active)this.clear();}
  assist(v,kind){if(this.complete)return;this.clear();for(let i=0;i<=70;i++){const a=-Math.PI/2+i/70*Math.PI*2,r=kind==='constellation'?.19:.13*(i%14<7?1:.52);this.points.push({x:.5+Math.cos(a)*r,y:.33+Math.sin(a)*r*.65});}this.complete=true;}
  current(p,s,t,v,surface){
   if(!surface||!this.points.length||!VF.NightPainting)return;
   const image=VF.NightPainting(),f=v.frame,tip=this.points.at(-1),radius=Math.min(68,f.w*.21),cx=f.x+tip.x*f.w,cy=f.y+tip.y*f.h,grid=[],N=4,strength=this.active?6:2.5;
   for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){const u=i/N,z=j/N,x=cx+(u-.5)*radius*2,y=cy+(z-.5)*radius*2,weight=Math.sin(u*Math.PI)*Math.sin(z*Math.PI),flow=Math.sin(t*.8+(u-z)*2)*strength*weight;grid.push({sx:(x-surface.x)/surface.w*image.width,sy:(y-surface.y)/surface.h*image.height,x:x-(z-.5)*flow,y:y+(u-.5)*flow});}
   const tri=(a,b,c)=>{const ux=b.sx-a.sx,uy=b.sy-a.sy,vx=c.sx-a.sx,vy=c.sy-a.sy,d=ux*vy-vx*uy;if(Math.abs(d)<1e-6)return;const A=((b.x-a.x)*vy-(c.x-a.x)*uy)/d,B=((b.y-a.y)*vy-(c.y-a.y)*uy)/d,C=((c.x-a.x)*ux-(b.x-a.x)*vx)/d,D=((c.y-a.y)*ux-(b.y-a.y)*vx)/d;p.save();p.beginPath();p.moveTo(a.x,a.y);p.lineTo(b.x,b.y);p.lineTo(c.x,c.y);p.closePath();p.clip();p.transform(A,B,C,D,a.x-A*a.sx-C*a.sy,a.y-B*a.sx-D*a.sy);p.drawImage(image,0,0);p.restore();};
   p.save();p.beginPath();p.rect(cx-radius,cy-radius,radius*2,radius*2);p.clip();for(let j=0;j<N;j++)for(let i=0;i<N;i++){const a=grid[j*(N+1)+i],b=grid[j*(N+1)+i+1],c=grid[(j+1)*(N+1)+i],d=grid[(j+1)*(N+1)+i+1];tri(a,b,c);tri(b,d,c);}p.restore();
  }
  draw(p,s,t,v,surface){if(s.chapter!=='painting')return;const b=s.guardian;if(!b)return;
   const choice=b.decisions?.['museum-sky']||'paint',f=v.frame,points=this.points;if(!points.length)return;this.current(p,s,t,v,surface);
   p.save();if(this.active){const tip=points.at(-1);p.fillStyle='#fff2bd';p.beginPath();p.arc(f.x+tip.x*f.w,f.y+tip.y*f.h,4,0,Math.PI*2);p.fill();}p.lineJoin=p.lineCap='round';p.strokeStyle='#f3d485';p.lineWidth=3;p.shadowColor='#e6bd62';p.shadowBlur=9;p.beginPath();points.forEach((q,i)=>{const x=f.x+q.x*f.w,y=f.y+q.y*f.h;if(!i)p.moveTo(x,y);else{const prev=points[i-1];p.quadraticCurveTo(f.x+prev.x*f.w,f.y+prev.y*f.h,x,y);}});p.stroke();p.shadowBlur=0;p.strokeStyle='#fff3c8';p.lineWidth=1;p.stroke();
   if(choice==='constellation')for(let i=0;i<points.length;i+=Math.max(1,Math.floor(points.length/7))){const q=points[i],x=f.x+q.x*f.w,y=f.y+q.y*f.h;p.fillStyle='#fff0ad';p.beginPath();p.arc(x,y,4,0,Math.PI*2);p.fill();}else if(this.complete){const q=points.at(-1);p.translate(f.x+q.x*f.w,f.y+q.y*f.h);p.strokeStyle='#fff6d1';p.lineWidth=2;p.beginPath();p.moveTo(-9,0);p.lineTo(9,0);p.moveTo(0,-9);p.lineTo(0,9);p.stroke();}
   p.restore();s.fairyTarget=points.length?{x:f.x+points.at(-1).x*f.w,y:f.y+points.at(-1).y*f.h}:s.light;
  }
  stats(){return{points:this.points.length,active:this.active,complete:this.complete,distance:this.distance};}
 }
 VF.SkyBrush=SkyBrush;
})();
