/* Distinct botany, cached in painterly transparent tiles; not recoloured clones. */
(() => {
 const cache=new Map(),ellipse=(p,x,y,rx,ry,a,color)=>{p.save();p.translate(x,y);p.rotate(a);p.fillStyle=color;p.beginPath();p.ellipse(0,0,rx,ry,0,0,Math.PI*2);p.fill();p.restore();};
 function tile(kind){if(cache.has(kind))return cache.get(kind);const c=VF.math.canvas(320,300),p=c.getContext('2d');p.lineCap='round';p.shadowBlur=4;p.shadowColor='#c7d4c144';
  for(let i=0;i<7;i++){const x=40+i*38,y=90+(i%3)*20;p.strokeStyle='#637a46';p.lineWidth=3;p.beginPath();p.moveTo(x,290);p.quadraticCurveTo(x+18,200,x,y);p.stroke();ellipse(p,x-7,220,20,6,-.6,'#5d7846');
   if(kind==='lavender'){for(let j=0;j<12;j++){const yy=y+j*6,xx=x+(j%2?5:-5);ellipse(p,xx,yy,8,4,j*.6,['#a28aac','#c1abc5','#856c9b'][j%3]);}}
   else if(kind==='daisies'){for(let j=0;j<13;j++){const a=j/13*Math.PI*2;ellipse(p,x+Math.cos(a)*14,y+Math.sin(a)*14,13,5,a,['#f3e9da','#e4d9c9','#fff2dd'][j%3]);}ellipse(p,x,y,8,8,0,'#c5a85c');}
   else{for(let j=0;j<20;j++){const a=j*2.4,r=22*(1-j/24);ellipse(p,x+Math.cos(a)*r*.4,y+Math.sin(a)*r*.4,Math.max(4,r),Math.max(3,r*.42),a,['#ca8f98','#e5b1b0','#f0c5b5','#ae7686'][j%4]);}}
  }cache.set(kind,c);return c;
 }
 VF.FlowerStations={draw(p,s,v,t){const g=s.gallery,stations=[['roses',.33],['lavender',.49],['daisies',.64]];const seen=[];for(const [kind,u]of stations){const x=g.left+g.W*u,w=v.w*.57;if(x+w<0||x-w>v.w)continue;const im=tile(kind);p.save();p.translate(x,v.h*.82);p.rotate(Math.sin(t*.65+u)*.012);p.drawImage(im,-w/2,-w*.88,w,w*.94);p.restore();seen.push(kind);}return seen;},bytes(){return cache.size*320*300*4;}};
})();
