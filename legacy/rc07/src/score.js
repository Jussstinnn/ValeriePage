/* The score owns staging, timing, cues and exits. Renderers do not choose the story. */
(() => {
 const shot=(at,id,focus,light,extra={})=>({at,id,focus,light,...extra});
 const scene=(id,shots,extra={})=>({id,kind:'engine',shots,hold:24,...extra});
 const scenes=[
  scene('vineyard',[shot(0,'sky-awakens',[.45,.20],.24,{crop:[.35,0,.70]}),shot(4.2,'path-revealed',[.45,.55],.55),shot(8,'falling-star',[.78,.18],.78),shot(14,'invitation',[.30,.76],.48)],{symbol:'star',anchor:[.78,.18],autoAt:6.4,exit:'star-firefly',hold:27}),
  scene('rabbit',[shot(0,'arrival',[.50,.48],.40),shot(3,'listening',[.51,.30],.68,{actor:'listen'}),shot(7.2,'anticipation',[.55,.52],.60,{actor:'anticipate'}),shot(8.2,'two-steps',[.62,.62],.65,{actor:'invite'}),shot(13,'look-back',[.60,.43],.52,{actor:'lookBack'}),shot(17,'waiting-on-path',[.69,.72],.40,{actor:'wait'})],{symbol:'paw',anchor:[.64,.47],autoAt:7.4,exit:'paw-path',hold:26}),
  scene('mushroom',[shot(0,'forest-floor',[.30,.80],.22,{crop:[.20,1,.76]}),shot(2.3,'canopy',[.50,.52],.38),shot(6,'fairy-awakes',[.73,.28],.72),shot(11,'forest-recognises',[.54,.55],.55),shot(17,'toward-the-painting',[.76,.35],.35)],{symbol:'fairy',anchor:[.73,.28],autoAt:6.5,exit:'firefly-brush',hold:25}),
  scene('museum',[shot(0,'gallery-arrival',[.47,.40],.28),shot(4,'painted-sky',[.50,.29],.62),shot(8,'inside-a-brushstroke',[.67,.28],.80),shot(14,'a-star-leaves',[.72,.22],.50)],{symbol:'pigment',anchor:[.67,.28],autoAt:8.2,exit:'brush-constellation',hold:23}),
  scene('couple',[shot(0,'two-under-one-sky',[.52,.65],.30),shot(5,'a-place-for-a-wish',[.65,.18],.52),shot(9,'constellation',[.50,.23],.72),shot(15,'seed-of-the-garden',[.42,.74],.40)],{symbol:'wish',anchor:[.64,.17],autoAt:7.5,exit:'star-lily',hold:24}),
  scene('lily',[shot(0,'the-first-stem',[.50,.83],.15),shot(2.2,'rising-stems',[.48,.59],.34),shot(4.8,'opening-petals',[.49,.38],.68),shot(8.5,'fourteen-lilies',[.50,.52],.57),shot(13,'a-flower-for-you',[.50,.48],.47)],{symbol:'petal',anchor:[.33,.29],autoAt:3.1,exit:'petal-portrait',hold:22}),
  scene('memory07',[shot(0,'a-petal-becomes-a-line',[.48,.60],.26),shot(3.4,'portrait-and-companion',[.48,.43],.50),shot(9,'a-memory-held',[.50,.50],.33)],{exit:'portrait-smile',hold:13,construction:'contour'}),
  scene('memory08',[shot(0,'two-traces',[.50,.42],.38),shot(4,'two-smiles',[.54,.40],.68),shot(10,'warm-stillness',[.50,.50],.40)],{exit:'smile-instant',hold:14,construction:'expressions'}),
  scene('memory09',[shot(0,'a-quiet-instant',[.50,.56],.24),shot(6,'presence',[.50,.48],.42),shot(12,'held-in-silence',[.50,.50],.30)],{exit:'memory-letter',hold:16,construction:'slow-develop'}),
  scene('letter',[shot(0,'light-finds-words',[.50,.40],.25),shot(3,'reader-holds-the-page',[.50,.50],.32)],{kind:'letter',exit:'line-velvet',hold:4}),
  scene('ring',[shot(0,'velvet-detail',[.40,.64],.18),shot(2.6,'the-whole-box',[.50,.51],.46),shot(4,'waiting-for-your-hand',[.50,.50],.36)],{kind:'ceremony',exit:'jewel-question',hold:4}),
  scene('finale',[shot(0,'all-the-worlds-return',[.50,.28],.50),shot(2.6,'a-question-takes-shape',[.50,.48],.65),shot(6,'the-answer-is-yours',[.50,.50],.32)],{kind:'ending',hold:6})
 ];
 const paths={vineyard:[[0,.78,.18],[8,.78,.18],[14,.28,.75]],rabbit:[[0,.64,.47],[8,.64,.47],[14,.86,.79]],mushroom:[[0,.22,.78],[6,.73,.28],[17,.84,.35]],museum:[[0,.46,.66],[8,.67,.28],[16,.82,.16]],couple:[[0,.64,.17],[8,.48,.20],[17,.50,.82]],lily:[[0,.50,.90],[4,.33,.29],[11,.58,.37]]};
 const cues={'listening':'paw','fairy-awakes':'fairy','inside-a-brushstroke':'pigment','constellation':'wish','opening-petals':'petal','light-finds-words':'touch','the-whole-box':'ring','all-the-worlds-return':'star'};
 for(const s of scenes){s.lightPath=paths[s.id]||[[0,.5,.5]];for(const shot of s.shots)shot.cue=cues[shot.id]||null;}
 const byId=Object.fromEntries(scenes.map(s=>[s.id,s]));
 window.VScore={version:4,scenes,get:id=>byId[id],beat(id,time){const s=byId[id];if(!s)return null;let a=s.shots[0],b=a;for(let i=1;i<s.shots.length;i++){if(time<s.shots[i].at){b=s.shots[i];break;}a=b=s.shots[i];}const q=a===b?0:Math.max(0,Math.min(1,(time-a.at)/(b.at-a.at)));return{scene:s,current:a,next:b,q};}};
})();
