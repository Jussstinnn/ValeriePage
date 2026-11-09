/* Authored camera/transition families; additional plants use the existing painted atlas. */
(() => {
 const SB=VF.SceneStage,WB=VF.SceneEnvironment,{span,mix,clamp}=VF.math;
 class CinemaStage extends SB{
  directScene(s,shot,t,v,o){super.directScene(s,shot,t,v,o);const b=s.guardian,f=v.frame;
   if(shot.mode==='crossing')s.actionReady=o.reduced||b.id!=='cross'||t>=4.9;
   if(b.view==='vine-detail'){s.lens.zoom=1.10+.19*span(0,2,b.age);s.lens.cx=.56;}
   if(b.view==='painting-close'){this.cast(s,v,b,{height:.61});s.lens.zoom=1.13;s.portal=.20*span(0,2,b.age);}
   if(shot.mode==='painting'){const crossing=b.view==='cross-frame',q=o.reduced?1:span(0,4.2,b.age);s.portal=crossing?q:0;s.lens.zoom=1.02;for(const a of Object.values(s.actors)){if(crossing){a.x+=f.w*.07*q;a.y-=f.h*.07*q;a.floor=a.y;a.opacity=1-span(.45,.95,q);}}}
   if(shot.mode==='letter'&&b.view==='read')for(const a of Object.values(s.actors))a.opacity=0;
   if(shot.mode==='forest'&&b.acting==='share-light')s.light.strength=1.05;
  }
 }
 class CinemaWorld extends WB{
  passageMask(p,passage,v){const {w,h,frame:f}=v,q=passage.progress,cx=f.x+f.w*.5,cy=f.y+f.h*.44;p.beginPath();const pair=passage.from+'>'+passage.to;
   if(pair.includes('museum')||pair.includes('painting')){const ww=(w+Math.abs(cx-w*.5))*2*q,hh=h*2*q;p.rect(cx-ww/2,cy-hh/2,ww,hh);this.stats.transitionFamily='gilded-frame';}
   else if(passage.to==='garden'){const r=Math.max(w,h)*1.8*q;p.moveTo(cx,cy-r);p.bezierCurveTo(cx+r*1.1,cy-r*.55,cx+r*.8,cy+r*.85,cx,cy+r);p.bezierCurveTo(cx-r*.8,cy+r*.85,cx-r*1.1,cy-r*.55,cx,cy-r);this.stats.transitionFamily='lily-petal';}
   else if(passage.from==='garden'||passage.to==='sky'){const r=Math.hypot(w,h)*1.4*q;p.moveTo(cx-r,cy);p.bezierCurveTo(cx-r*.2,cy-r,cx+r*.2,cy-r,cx+r,cy);p.bezierCurveTo(cx+r*.2,cy+r,cx-r*.2,cy+r,cx-r,cy);this.stats.transitionFamily='light-thread';}
   else{const r=Math.max(w,h)*1.7*q;p.moveTo(cx,cy-r);p.bezierCurveTo(cx+r,cy-r*.4,cx+r,cy+r*.5,cx,cy+r);p.bezierCurveTo(cx-r,cy+r*.5,cx-r,cy-r*.4,cx,cy-r);this.stats.transitionFamily='sheltering-leaf';}p.closePath();
  }
  background(p,s,t,v,profile,reduced){super.background(p,s,t,v,profile,reduced);if(s.chapter==='letter'&&s.guardian.view==='read'){const f=v.frame;p.save();p.strokeStyle='#b7a88870';p.lineWidth=.75;p.beginPath();p.moveTo(f.x+2,f.y+12);p.bezierCurveTo(f.x-2,f.y+f.h*.28,f.x+5,f.y+f.h*.70,f.x+2,f.y+f.h-35);p.stroke();const q=span(0,2,s.guardian.age);p.globalAlpha=.45*q;p.fillStyle='#b7887b';p.beginPath();p.ellipse(f.x+f.w-13,f.y+f.h-34,8,11,-.35,0,Math.PI*2);p.fill();p.restore();this.stats.letterStage={quiet:true,seal:true,actorsWithdrawn:true};}}
  foreground(p,s,t,v,profile,reduced){if(s.chapter==='forest'){const f=v.frame;for(let i=0;i<4;i++){const x=f.x+f.w*(i+.35)/4,y=f.y+f.h*.99,near=Math.min(...Object.values(s.actors).map(a=>Math.abs(a.x-x))),bend=(1-clamp(near/(f.w*.25)))*(reduced?0:Math.sin(t*.75+i)*.06);p.save();p.translate(x,y);p.rotate(bend);const w=Math.min(f.w*.34,f.h*.36);VF.Art.draw(p,'foliage',VF.Art.rects.foliage.fern,-w*.5,-w*.20,w,w*.36);p.restore();}this.stats.reactivePlants=4;}super.foreground(p,s,t,v,profile,reduced);}
  envelope(p,s,v){super.envelope(p,s,v);const q=s.envelopeRect,open=s.envelopeOpen||0;if(!q||open<=0)return;p.save();p.translate(q.x,q.y);p.rotate(q.angle);const rise=q.h*.75*Math.sin(open*Math.PI*.5);p.fillStyle='#f1dfbf';p.beginPath();p.moveTo(-q.w/2,-q.h/2);p.lineTo(0,-q.h/2-rise);p.lineTo(q.w/2,-q.h/2);p.closePath();p.fill();p.strokeStyle='#b79f7d';p.lineWidth=.8;p.stroke();p.fillStyle='#f5e9d3';const paper=q.h*.63*span(.25,1,open);p.fillRect(-q.w*.42,-q.h/2-paper,q.w*.84,paper);p.restore();this.stats.envelopeOpening=open;}
 }
 VF.SceneStage=CinemaStage;VF.SceneEnvironment=CinemaWorld;
})();
