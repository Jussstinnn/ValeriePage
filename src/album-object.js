/* A single rigid object owns bench and intimate camera framing. */
(() => {
 const {mix,span,ease}=VF.math;
 VF.AlbumObject={
  pose(owner,cast,b,shot,v,gallery,t){
   if(shot.id!=='dos-sonrisas')return null;const im=VF.MemoryAssets.image(1),aspect=im.naturalWidth/im.naturalHeight,list=VF.GuardianScript[shot.id],at=id=>list.find(b=>b.id===id).actionPlan.start,variant=b.decisions?.['album-space']||'space';
   for(const [i,a]of Object.values(cast).entries()){const q=VF.JourneyActing.hop(a,t,at('space')+.2+i*.18,at('space')+1.5+i*.18,(i?-.02:.02)*v.w,14,'approach-album-bench'),delta=(v.h*.78-a.floor)*q;a.floor+=delta;a.y+=delta;}
   if(variant==='space'){VF.JourneyActing.hop(cast.pink,t,at('album-result')+.25,at('album-result')+1.30,-v.w*.04,13,'make-room-for-beige');cast.taupe.head=-.14;cast.pink.lookX=.7;}
   const bench={x:gallery.left+gallery.W*.49,y:v.h*.65,w:v.w*.38,h:v.w*.38/aspect,angle:-.035},scale=Math.min(v.frame.w*.94/im.naturalWidth,v.frame.h*.90/im.naturalHeight),full={x:v.w/2,y:v.frame.y+v.frame.h*.46,w:im.naturalWidth*scale,h:im.naturalHeight*scale,angle:0},photo=b.view==='photo',returning=b.id==='laugh',close=photo?span(0,2.2,b.age):returning?1-span(0,2.2,b.age):0,q=ease(close),zoom=mix(1,full.w/bench.w,q),cx=mix(bench.x,full.x,q),cy=mix(bench.y,full.y,q),camera={zoom,tx:cx-bench.x*zoom,ty:cy-bench.y*zoom},r={x:cx,y:cy,w:bench.w*zoom,h:bench.h*zoom,angle:bench.angle*(1-q)};
   const open=b.actionPending?0:photo||['laugh','leave'].includes(b.id)?1:b.id==='album-result'?span(.5,3.3,b.age):0;
   for(const [id,a]of Object.entries(cast)){a.x=a.x*zoom+camera.tx;a.y=a.y*zoom+camera.ty;a.floor=a.floor*zoom+camera.ty;a.s*=zoom;a.opacity=1-span(.65,.98,close);a.head=id==='pink'?.14:-.12;}
   return{id:'dos-sonrisas-album',...r,bench,world:{x:.49,y:.65,anchor:'gallery-bench'},camera,gallery:{...gallery,left:gallery.left*zoom+camera.tx,top:camera.ty,W:gallery.W*zoom,H:gallery.H*zoom},open,close,lift:0,variant,originalBytes:true};
  },
  hands(){},
  draw(owner,p,s,v){const a=s.album;if(!a)return;const im=VF.MemoryAssets.image(1);p.save();p.translate(a.x,a.y);p.rotate(a.angle);p.shadowColor='#07131a88';p.shadowBlur=10;p.shadowOffsetY=5;p.fillStyle='#b18d7b';p.fillRect(-a.w/2-6,-a.h/2-6,a.w+12,a.h+12);p.shadowColor='transparent';p.fillStyle='#efe0c2';p.fillRect(-a.w/2,-a.h/2,a.w,a.h);p.drawImage(im,-a.w/2,-a.h/2,a.w,a.h);
   const q=1-a.open;p.fillStyle='#9e7d75';p.strokeStyle='#e6c698';p.lineWidth=1.5;if(a.variant==='page'){p.save();p.translate(-a.w/2,0);p.transform(q,Math.sin(a.open*Math.PI)*.16,0,1,0,0);p.fillRect(0,-a.h/2,a.w,a.h);p.strokeRect(4,-a.h/2+4,a.w-8,a.h-8);if(q>.3){p.fillStyle='#f6e4c5';p.font='italic '+Math.max(12,a.w*.11)+'px FilmSerif';p.textAlign='center';p.fillText('Dos sonrisas',a.w/2,3);}p.restore();}else for(const side of [-1,1]){const w=a.w*.5*q;p.fillRect(side<0?-a.w/2:a.w/2-w,-a.h/2,w,a.h);if(q>.5){p.beginPath();p.moveTo(side*5,-a.h*.40);p.lineTo(side*5,a.h*.4);p.stroke();}}
   p.restore();owner.stats.album={...a,objectIdentity:a.id,oneSurface:true};owner.stats.photo=a.open>.95?{id:1,x:a.x-a.w/2,y:a.y-a.h/2,w:a.w,h:a.h,reveal:a.open,originalBytes:true,clean:s.guardian.view==='photo',objectIdentity:a.id}:null;owner.interactionTargets.push({kind:'memory',x:a.x,y:a.y,r:Math.max(44,a.w*.5)});
  }
 };
})();
