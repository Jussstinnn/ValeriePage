/* Intent → anticipation → action → soft return. Runs before original IK/feet resolution. */
(() => {
 const base=VF.GuardianActing.apply,{span,pulse,mix}=VF.math;
 const acts=['beckon','welcome','shelter','support','sigh','rest-together','guard-secret','follow-light','look-back','hear-light','share-light','study-painting','wonder','nose-leaf','sniff-photo','peek-album','lean-album','feel-page','open-envelope','offer-petal'];
 VF.GuardianActing.library.push(...acts);
 VF.GuardianActing.apply=(s,b,v)=>{
  const p=s.actors.pink,g=s.actors.taupe,h=g.s*VF.rigBounds.taupe.h,t=b.age,q=span(0,1.6,t),anticipate=pulse(0,.28,.48,.75,t),act=b.acting;
  if(['beckon','follow-light'].includes(act)){p.turn=-.4*span(.1,.8,t)+.8*span(.8,1.6,t);p.head-=.15*anticipate;g.turn=-.35;g.head-=.10*span(.65,1.6,t);}
  if(act==='welcome'||act==='sigh'){p.crouch+=.17*pulse(.1,.5,1,1.8,t);g.head-=.15*q;g.earTip+=.12*Math.sin(t*3)*Math.exp(-t);}
  if(act==='look-back'){g.turn=.65*q;g.lookX=-.8;p.head-=.12*q;}
  if(act==='hear-light'){p.head-=.22*q;p.turn=.30*q;g.earL+=.35*span(.7,1.8,t);}
  if(act==='share-light'){g.head=.16*q;g.handsWorld={right:VF.Kinematics.localToWorld(g,{x:55,y:-105},'taupe')};p.handsWorld={right:VF.Kinematics.localToWorld(p,{x:37,y:-100},'pink')};}
  if(['study-painting','wonder'].includes(act)){p.head=-.24*q;g.head=-.23*q;p.lookY=g.lookY=-.7;g.turn=.25*q;}
  if(act==='nose-leaf'||act==='sniff-photo'){p.x+=h*.12*q;p.crouch+=.28*q;p.lean+=.18*q;p.head+=.21*q;g.head+=.14*span(.6,1.7,t);}
  if(act==='peek-album'){p.crouch+=.35*(1-q);p.head+=.24*q;p.turn=.3*q;g.head=-.15*q;}
  if(act==='lean-album'){g.x-=h*.12*q;g.head+=.19*q;g.lean-=.10*q;}
  if(act==='rest-together'){p.sit=g.sit=.85;p.x+=h*.075*q;g.x-=h*.075*q;p.head+=.20*q;g.head-=.16*q;p.lean=.17*q;g.lean=-.11*q;}
  if(act==='feel-page'){p.crouch+=.12*q;g.head+=.15*q;}
  if(act==='open-envelope'){p.head=.19*q;g.head=.18*q;s.envelopeOpen=span(.35,2.2,t);}
  if(act==='offer-petal')p.handsWorld={left:VF.Kinematics.localToWorld(p,{x:-43,y:-128},'pink')};
  for(const [id,a]of Object.entries(s.actors)){const box=VF.rigBounds[id],f=v.frame;a.x=VF.math.clamp(a.x,f.x-box.x*a.s+5,f.x+f.w-(box.x+box.w)*a.s-5);}
  base(s,b,v);s.score={intent:act,anticipation:anticipate,action:q,return:span(2,4,t),partnerDelay:.6};
 };
})();
