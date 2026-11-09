/* F22: practical gift theatre, a jewel in context, and a return performed by the guardians. */
(() => {
 const SB=VF.SceneStage,WB=VF.SceneEnvironment,{span,mix,ellipse}=VF.math;
 function layout(v,s,t,reduced){const base=VF.GiftLayout(v,'ceremony',t,reduced),f=v.frame,q=s.ceremony?.macro||0,scale=mix(.66,.89,q),cx=f.x+f.w*.5,cy=mix(base.cy,f.y+f.h*.63,q);return{s:base.s*scale,cx,cy,project(x,y,z){const old=base.project(x,y,z);return{x:cx+(old.x-base.cx)*scale,y:cy+(old.y-base.cy)*scale};}};}
 class FinalCeremonyStage extends SB{
  directScene(s,shot,t,v,o){super.directScene(s,shot,t,v,o);const f=v.frame,b=this.narrativeFrame,p=s.actors.pink,g=s.actors.taupe,e=s.effects||{},age=b.age;
   if(shot.mode==='ceremony'){const opening=b.id==='opening',reveal=VF.RevealDirector.frame(this.revealAuthorization,o.storyTime??t,b,o.reduced),{open,macro}=reveal;Object.assign(s.ceremony,reveal);const L=layout(v,s,t,o.reduced),ground=L.project(0,-.18,.38),hero=L.s*.86;
    for(const [id,a]of Object.entries(s.actors)){a.s=hero*(id==='pink'?.82:1)/VF.rigBounds[id].h;a.x=f.x+f.w*(id==='pink'?.22:.78);a.y=a.floor=ground.y+9;a.opacity=1;a.sit=.72;a.crouch=.12*span(.4,1.7,age);a.head=-.18+span(5,7,age)*.25;a.turn=id==='pink'?.20:-.20;const side=id==='pink'?'right':'left';a.handsWorld={[side]:VF.Kinematics.localToWorld(a,{x:id==='pink'?49:-59,y:id==='pink'?mix(-93,-158,span(.3,2,age)):mix(-105,-145,span(.6,2.5,age))},id)};}
    s.cooperativeBox=opening;s.ceremonyChoreography={phase:s.ceremony.phase,pink:'lift-and-release',taupe:'brace-and-watch',ringInContext:true};s.journeyCloth=null;s.lens={zoom:1,cx:.5,cy:.5,travel:0};
   }
   if(shot.mode==='letter'&&b.choiceResult){s.envelopeOpen=span(1.9,4.5,age);p.head=.15;g.head=.14;}
   if(shot.mode==='finale'){s.returnOrder=e.albumRoute==='page'?[1,0,2]:e.quietRoute==='close'?[2,0,1]:[0,1,2];if(b.view==='homecoming'){const q=span(.4,2.7,age),forest=e.forestLight||'neutral';if(forest==='gold'){const arc=!o.reduced&&age>.8&&age<1.6?Math.sin((age-.8)/.8*Math.PI):0;p.y-=arc*Math.min(12,f.h*.04);p.airborne=arc>0?1:0;p.head=-.16*q;g.head=-.15*q;}else if(forest==='mint'){g.handsWorld={right:VF.Kinematics.localToWorld(g,{x:55,y:-147},'taupe')};g.head=.15*q;p.head=.2*q;s.leafMap=true;}p.sit=g.sit=.84+.1*span(6.5,9,age);p.lean=.14*span(6.5,9,age);g.lean=-.09*span(6.5,9,age);s.journeyCloth={open:span(3.3,5.4,age),sky:e.skyMotif||'brush-star',garden:e.gardenRelic||'rose-petal',memory:e.quietRoute==='close'?'paw':'album',seal:e.sealStyle||'neutral'};s.returnPerformance={forest,garden:e.gardenRelic||'neutral',quiet:e.quietRoute||'neutral',phase:age<3.3?'recognize':age<6?'unfold':'stay-close'};}}
  }
 }
 class FinalCeremonyWorld extends WB{
  giftLayout(v,s,t,reduced){return layout(v,s,t,reduced);}
  ringLayout(s,v,L,origin){const f=v.frame,q=s.ceremony.macro,x=mix(origin.x,f.x+f.w*.5,q),y=mix(origin.y,f.y+f.h*.28,q),h=mix(L.s*.23,Math.min(f.h*.40,f.w*.58/this.jewelMaterial.aspect),q);return{x,y,h};}
  background(p,s,t,v,...rest){if(s.chapter==='ceremony'&&s.ceremony.open<.65)delete this.stats.jewel;super.background(p,s,t,v,...rest);if(s.chapter==='ceremony'){this.giftMaterial.foreground(p,this.caseLayout);s.frontDrawnEarly=true;const points=[...this.stats.caseGeometry.corners,this.caseLayout.project(-.5,-.18,.38),this.caseLayout.project(.5,-.18,.38)],x=Math.min(...points.map(p=>p.x)),y=Math.min(...points.map(p=>p.y));this.stats.ceremonyProtectedBox={x,y,w:Math.max(...points.map(p=>p.x))-x,h:Math.max(...points.map(p=>p.y))-y};}else delete this.stats.ceremonyProtectedBox;this.currentCeremony=s.chapter==='ceremony';this.stats.ceremonyChoreography=s.ceremonyChoreography||null;this.stats.returnPerformance=s.returnPerformance||null;}
  shadow(p,a,...rest){if(!this.currentCeremony)return super.shadow(p,a,...rest);if((a.opacity??1)<.01)return;const r=a.s*(a.id==='pink'?54:75),y=(a.floor??a.y)+14*a.s;p.save();p.translate(a.x,y);p.scale(1,.17);const g=p.createRadialGradient(0,0,1,0,0,r);g.addColorStop(0,'#091c2870');g.addColorStop(1,'#091c2800');p.fillStyle=g;p.fillRect(-r,-r,r*2,r*2);p.restore();}
  afterActors(p,s,t,v,...rest){super.afterActors(p,s,t,v,...rest);if(s.chapter==='ceremony'&&this.stats.jewel){const r=this.stats.jewel,q=s.ceremony.macro;ellipse(p,r.x+r.w*.5,r.y+r.h+6,r.w*.37,Math.max(2,r.h*.025),'#201b2838');this.stats.jewel.contextual=true;this.stats.jewel.frameFraction=r.h/v.frame.h;this.stats.jewel.backgroundBoxVisible=true;}

  }
  memoryOrbit(p,s,v){const f=v.frame,b=s.guardian,leave=b.view==='question'?span(0,2.1,b.age):0,alpha=1-leave,order=s.returnOrder||[0,1,2],focus=Math.min(2,Math.floor((s.motionReduced?8:b.age)/2.6));this.stats.memoryEchoes={count:3,progress:leave,wholePhotographs:true,heldHomecoming:b.view==='homecoming',order:[...order],focus:order[focus]};if(alpha<.001)return;
   for(let slot=0;slot<3;slot++){const id=order[slot],img=VF.MemoryAssets.image(id),selected=slot===focus,boost=selected&&!s.motionReduced?1+.12*Math.sin(Math.min(1,(b.age-slot*2.6)/2.6)*Math.PI)**2:1,h=Math.min(f.h*.23,f.w*.26*img.naturalHeight/img.naturalWidth)*boost,w=h*img.naturalWidth/img.naturalHeight,x=mix(f.x+f.w*[.18,.50,.82][slot],f.x+f.w*.5,leave),y=mix(f.y+f.h*[.28,.17,.29][slot],f.y+f.h*.40,leave);p.save();p.globalAlpha=alpha;p.translate(x,y);p.rotate((slot-1)*.10*(1-leave));p.fillStyle='#e4ceb0';p.shadowColor='#071b2660';p.shadowOffsetY=5;p.shadowBlur=8;p.fillRect(-w/2-4,-h/2-4,w+8,h+8);p.shadowColor='transparent';p.drawImage(img,-w/2,-h/2,w,h);p.restore();}
  }
 }
 VF.SceneStage=FinalCeremonyStage;VF.SceneEnvironment=FinalCeremonyWorld;
})();
