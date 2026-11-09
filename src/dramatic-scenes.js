/* F19: two physical scenes. Roots and all contacts are authored before the approved solver. */
(() => {
 const SB=VF.SceneStage,WB=VF.SceneEnvironment,{span,mix,pulse,clamp,ellipse}=VF.math;
 const oldClock=VF.CompanionPerformance.clock;
 VF.CompanionPerformance.clock=(shot,b,t)=>shot.mode==='leaf'?(b.choiceResult?4.8:1.2):shot.mode==='recognise'?Math.min(b.age+(b.id==='steady'?4:0),8):oldClock(shot,b,t);
 VF.GuardianScript['dos-miradas'][1].text='Espera, patitas rápidas. La caja del jardín necesita esa luz.';
 const ops=VF.StoryGraph.choices['leaf-holder'].options;ops[0].resultDialogue='¡Arriba! Beige… cuida esas orejas.';ops[1].resultDialogue='Pasa primero. Yo soy el techo.';
 class DramaticStage extends SB{
  pair(s,v,width=.62){const f=v.frame,h=Math.min(f.h*.73,f.w*width);for(const [id,a]of Object.entries(s.actors)){a.s=h*(id==='pink'?.82:1)/VF.rigBounds[id].h;a.x=f.x+f.w*(id==='pink'?.24:.68);a.y=a.floor=f.y+f.h*.96;a.id=id;a.sit=.42;a.crouch=0;a.lean=0;a.airborne=0;a.gaitWeight=0;a.stride=0;a.opacity=1;delete a.handsWorld;}return h;}
  directScene(s,shot,t,v,o){super.directScene(s,shot,t,v,o);const f=v.frame,b=this.narrativeFrame,p=s.actors.pink,g=s.actors.taupe,age=b.age;
   if(shot.mode==='recognise'){this.pair(s,v,.60);const steady=b.id==='steady',a=steady?5+age:age,tryHop=!o.reduced&&a>1.05&&a<1.85?Math.sin((a-1.05)/.8*Math.PI):0;
    p.x+=f.w*.055*span(.7,1.85,a);g.x-=f.w*.045*span(1.5,3.5,a);p.y-=tryHop*Math.min(14,f.h*.05);p.airborne=tryHop>0?1:0;p.jumpPhase=tryHop>0?'flight':a<1?'anticipation':'grounded';p.crouch=.22*pulse(.2,.6,1.05,1.18,a)+.12*pulse(1.85,2,2.2,2.6,a);g.crouch=.14*span(1.5,2.7,a);p.head=-.2*span(.2,1.2,a)+.29*span(2.1,3.7,a);g.head=-.12+span(2,4,a)*.23;g.earL=.23*span(1.6,3.5,a);
    p.handsWorld={right:VF.Kinematics.localToWorld(p,{x:48,y:mix(-110,-168,pulse(.3,.85,1.4,2.6,a))},'pink')};g.handsWorld={left:VF.Kinematics.localToWorld(g,{x:-59,y:mix(-83,-135,span(1.3,3.6,a))},'taupe')};s.lightMission=null;s.directedLight={age:a,steady,dragged:!!this.drag,point:s.light};s.lens={zoom:1.18,cx:mix(.47,.52,span(0,5,a)),cy:.54,travel:0};s.dramaticAction={name:'catch-miss-help',phase:a<1?'anticipation':a<2?'miss':a<4?'help':'shared',shared:span(2,4,a)};
   }
   if(shot.mode==='leaf'){this.pair(s,v,.60);s.branchLeaf=null;s.leaf.visible=0;const active=b.choiceResult,chosen=b.branch?.id,holder=chosen==='rosa'?'pink':chosen==='beige'?'taupe':'both',role=holder==='pink'?p:g,id=holder==='pink'?'pink':'taupe',side=holder==='pink'?'right':'left',q=active?span(.2,1.3,age):0;
    if(active){role.handsWorld={[side]:VF.Kinematics.localToWorld(role,{x:holder==='pink'?49:-63,y:mix(-87,-178,q)},id)};role.head=-.20*q;const other=holder==='pink'?g:p;if(holder!=='both'){let travel=0,bounce=0;for(const [start,end]of [[1.35,2.05],[2.4,3.10]]){travel+=span(start,end,age)*.09;if(!o.reduced&&age>start&&age<end)bounce+=Math.sin((age-start)/(end-start)*Math.PI);other.crouch+=.22*pulse(start-.3,start-.1,start,start+.1,age)+.16*pulse(end,end+.13,end+.3,end+.55,age);}other.x+=(holder==='pink'?-1:1)*travel*f.w;other.y-=bounce*Math.min(12,f.h*.045);other.airborne=bounce>.001?1:0;other.jumpPhase=bounce>0?'flight':'grounded';other.crouch+=.28*pulse(.8,1.3,3.1,3.8,age);other.head=.17*span(1,3.3,age);other.earL+=.18*Math.sin(age*4)*Math.exp(-Math.max(0,age-2));}else{p.handsWorld={right:VF.Kinematics.localToWorld(p,{x:44,y:mix(-85,-150,q)},'pink')};g.handsWorld={left:VF.Kinematics.localToWorld(g,{x:-56,y:mix(-85,-157,q)},'taupe')};}}
    const hand=active?role.handsWorld[side]:{x:f.x+f.w*.5,y:f.y+f.h*.94};s.storyLeaf={active,holder,side,id,hand,open:q,w:Math.min(f.w*.60,f.h*.75),age};s.dramaticAction={name:'living-canopy',phase:!active?'obstacle':age<1.3?'lift':age<3.5?'pass-under':'shelter',holder};s.lens={zoom:1.27,cx:.48,cy:.62,travel:0};
   }
  }
 }
 class DramaticWorld extends WB{
  background(p,s,t,v,...rest){super.background(p,s,t,v,...rest);this.stats.dramaticAction=s.dramaticAction||null;if(s.storyLeaf){const l=s.storyLeaf,h=Math.min(l.w*1.08,Math.max(30,l.hand.y-v.frame.y-8)),sign=l.holder==='pink'?1:-1;p.save();p.translate(l.hand.x,l.hand.y);p.rotate(sign*.18*l.open);VF.Art.draw(p,'foliage',VF.Art.rects.foliage.leaf,-l.w*(l.holder==='pink'?.08:.82),-h,l.w,h);p.restore();this.stats.branchAction={type:'living-canopy',holder:l.holder,open:l.open};}}
  foreground(p,s,t,v,...rest){const original=s.light;if(s.directedLight||s.storyLeaf)s.light={...original,x:-1000,y:-1000};super.foreground(p,s,t,v,...rest);s.light=original;}
  afterActors(p,s,t,v,...rest){super.afterActors(p,s,t,v,...rest);if(s.directedLight){const a=s.renderedActors.find(a=>a.id==='pink')?.hands.right,z=s.renderedActors.find(a=>a.id==='taupe')?.hands.left;if(a&&z){const d=s.directedLight,q=span(2,4,d.age),escape=pulse(.5,1.2,1.7,2.8,d.age),lead=d.steady?span(2.7,5.5,s.actionAge):0,x=d.dragged?d.point.x:mix(mix(a.x,z.x,q)+escape*42,v.frame.x+v.frame.w*.67,lead),y=d.dragged?d.point.y:mix(mix(a.y,z.y,q)-12-escape*36,v.frame.y+v.frame.h*.33,lead);p.save();p.globalCompositeOperation='screen';p.drawImage(this.glow,x-24,y-24,48,48);ellipse(p,x,y,2.5,3.7,'#fff0c5');p.restore();s.light={x,y,strength:1};this.stats.missionLight={x,y,shared:q,escapes:escape,leads:lead};}}
   if(s.storyLeaf?.active){const l=s.storyLeaf,h=s.renderedActors.find(a=>a.id===l.id)?.hands[l.side];this.stats.canopyAttachment=h?Math.hypot(h.x-l.hand.x,h.y-l.hand.y):null;}
  }
 }
 VF.SceneStage=DramaticStage;VF.SceneEnvironment=DramaticWorld;
})();
