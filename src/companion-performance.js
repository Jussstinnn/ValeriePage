/* Two complete plush reactions: approach/listen and steady/share. No model or atlas changes. */
(() => {
 const base=VF.GuardianActing.apply,{span,pulse}=VF.math;
 const names=['pair-curiosity','pair-care'];VF.GuardianActing.library.push(...names);
 VF.CompanionPerformance={names,clock(shot,b,t){if(shot.mode!=='crossing')return t;return b.id==='bank'?1.1:b.id==='offer'?2:b.id==='cross'?2+b.age:['landed','reply'].includes(b.id)?5.6+b.age:t;}};
 const beat=VF.StoryGraph.beat;VF.GuardianScript['una-patita-mas']=[beat('bank','pink','Parece más ancho desde aquí.','listen',{kind:'thought'}),beat('offer','taupe','Te espero al otro lado.','support'),beat('cross',null,'','support',{close:'action'}),beat('landed','pink','¡Lo hicimos!','welcome'),beat('reply','taupe','Tú saltaste. Yo te estaba esperando.','pair-care')];
 VF.GuardianActing.apply=(s,b,v)=>{if(names.includes(b.acting)){
   const p=s.actors.pink,g=s.actors.taupe,t=s.motionReduced?1.8:b.age,h=g.s*VF.rigBounds.taupe.h,returning=1-span(2.8,3.8,t),q=span(0,1.5,t)*returning,dir=g.x>p.x?1:-1;
   if(b.acting==='pair-curiosity'){const arc=!p.airborne&&!s.motionReduced&&t>.4&&t<1.25?Math.sin((t-.4)/.85*Math.PI):0;p.crouch+=pulse(0,.2,.4,.5,t)*.28;p.x+=dir*Math.min(19,h*.09)*span(.4,1.25,t)*returning;p.y-=arc*Math.min(13,v.frame.h*.045);if(arc>0){p.airborne=1;p.jumpPhase='flight';}p.head+=.22*q;p.earL-=.17*q;g.head-=.18*span(.7,1.7,t)*returning;g.turn=-.28*q;}
   else{g.x-=dir*Math.min(12,h*.05)*q;g.sit+=.30*q;g.head-=.22*q;g.earTip+=.12*Math.sin(t*3)*returning;p.head+=.19*span(.65,1.6,t)*returning;p.lean+=.15*q;if(!s.page&&!s.envelopeRect&&!s.branchLeaf&&!s.lightMission){const target=VF.Kinematics.shared(p,g);if(target.reachable){p.handsWorld={right:target};g.handsWorld={left:target};}}}
   s.companionPerformance={name:b.acting,phase:t<.4?'anticipation':t<1.5?'action':t<2.8?'response':'return',partnerResponds:true};
  }base(s,b,v);
 };
})();
