/* The fiction is in the guardians' discoveries. Photographs and personal words stay intact. */
(() => {
 const {choices,beat:b,option:o}=VF.StoryGraph,{span,mix,ellipse}=VF.math,S=VF.GuardianScript;
 const define=(id,chapter,prompt,rejoinNode,options)=>choices[id]={choiceId:id,chapter,prompt,preconditions:[],rejoinNode,options};
 define('portrait-reveal','nuestro-retrato','¿Cómo miramos debajo?','portrait-rest',[
  o('leaf','Levantar la hoja entre dos','lift-leaf-pair','leaf-curtain',{portraitRoute:'leaf'},'Yo este lado. Tú el otro.','taupe'),
  o('glow','Invitar a la luciérnaga','invite-photo-light','light-curtain',{portraitRoute:'glow'},'¡Mira! Nos encontró otra vez.','pink')]);
 define('album-space','dos-sonrisas','¿Le hacemos sitio?','album-rest',[
  o('space','Hacernos un huequito','room-for-partner','shared-album',{albumRoute:'space'},'Ahora sí cabemos los dos.','taupe'),
  o('page','Dar la vuelta a la página','turn-cloth-page','turning-album',{albumRoute:'page'},'Ah… estaba del otro lado.','pink')]);
 define('quiet-memory','un-instante','¿Nos quedamos un momento?','quiet-rest',[
  o('light','Compartir la pequeña luz','share-photo-glow','light-aperture',{quietRoute:'light'},'Un poquito para ti. Otro para mí.','pink'),
  o('close','Sentarnos bien cerquita','sit-by-partner','quiet-seat',{quietRoute:'close'},'Aquí. No hace falta decir nada.','taupe')]);
 define('letter-seal','una-carta-para-ti','Un pequeño detalle para el sobre','seal-rest',[
  o('sky','El cielo que dibujamos','seal-sky','sky-envelope',{sealStyle:'sky'},'Que esta luz cuide las palabras.','taupe'),
  o('garden','Lo que cuidamos en el jardín','seal-garden','garden-envelope',{sealStyle:'garden'},'Así viajará con ellas.','pink')]);
 S['nuestro-retrato']=[b('found','pink','Hay algo debajo…','nose-leaf',{view:'discovery'}),b('edge','taupe','La hoja se mueve. Yo sujeto el borde.','lift-page',{view:'discovery'}),b('portrait-choice','pink','¿Lo vemos?','watch',{kind:'choice',choiceId:'portrait-reveal',view:'discovery'}),b('portrait-result',null,'','watch',{kind:'result',choiceId:'portrait-reveal',view:'reveal'}),b('portrait-rest',null,'Un retrato para mirar sin prisa.','quiet',{view:'photo',look:'photo'}),b('dog','pink','¡Hay un perrito!','sniff-photo',{view:'reaction',gain:'portrait'}),b('carry','taupe','Llevémoslo sin doblar las esquinas.','lift-page',{view:'reaction'})];
 S['dos-sonrisas']=[b('peek','pink','No alcanzo a mirar…','peek-album',{view:'discovery'}),b('answer','taupe','Espera. Te hago sitio.','lean-album',{view:'album'}),b('album-choice','pink','¿Por aquí o por allá?','watch',{kind:'choice',choiceId:'album-space',view:'album'}),b('album-result',null,'','watch',{kind:'result',choiceId:'album-space',view:'reveal'}),b('album-rest',null,'Dos sonrisas. Ninguna prisa.','quiet',{view:'photo',look:'photo'}),b('laugh','pink','A mí también se me está pegando.','soft-hop',{view:'reaction'}),b('stay',null,'','rest-together',{view:'rest',gain:'smiles'})];
 S['un-instante']=[b('quiet',null,'Hay instantes que no necesitan decir nada.','rest-together',{view:'rest'}),b('ask','pink','¿Y si nos quedamos aquí?','feel-page',{view:'quiet-glow',kind:'thought'}),b('quiet-choice','taupe','¿Cómo lo acompañamos?','watch',{kind:'choice',choiceId:'quiet-memory',view:'quiet-glow'}),b('quiet-result',null,'','watch',{kind:'result',choiceId:'quiet-memory',view:'quiet-glow'}),b('quiet-rest',null,'Puedes quedarte aquí.','quiet',{view:'photo',look:'photo'}),b('listen','pink','Hay algo tibio entre las páginas.','feel-page',{view:'reaction'}),b('envelope','taupe','Es para Valerie.','find-envelope',{view:'envelope',gain:'envelope'})];
 S['una-carta-para-ti']=[b('offer','pink','Esta sí es para ti.','offer-envelope',{view:'envelope',gain:'envelope'}),b('seal-choice','taupe','¿Qué dejamos en el sobre?','watch',{view:'envelope',kind:'choice',choiceId:'letter-seal'}),b('seal-result',null,'','watch',{view:'envelope',kind:'result',choiceId:'letter-seal'}),b('seal-rest','taupe','La abrimos… y te dejamos leer.','open-envelope',{view:'envelope'}),b('read',null,'','quiet',{view:'read',close:'reader'}),b('after',null,'Hay palabras que merecen un momento de silencio.','rest-together',{view:'envelope'})];
 S['algo-que-guarde'][0]={...S['algo-que-guarde'][0],speaker:'taupe',text:'Yo sostengo. Tú levanta despacito.',acting:'open-together'};
 const SB=VF.SceneStage,WB=VF.SceneEnvironment;
 class AdventureMemories extends SB{
  directScene(s,shot,t,v,opt){super.directScene(s,shot,t,v,opt);const b=s.guardian,f=v.frame,p=s.actors.pink,g=s.actors.taupe,act=s.choiceAction,q=span(.2,1.8,s.actionAge);
   if(shot.mode==='memory'){s.memoryAdventure=act;s.memoryPath=s.effects[['portraitRoute','albumRoute','quietRoute'][shot.memory]]||'neutral';
    if(act==='lift-leaf-pair'){p.crouch=.2*(1-q);g.head=.14*q;p.head=-.12*q;g.earL=.13*q;}
    if(act==='invite-photo-light'){p.turn=-.32*q;p.head=-.2*q;g.head=-.16*span(.7,2,s.actionAge);}
    if(act==='room-for-partner'){g.x+=f.w*.045*q;p.x+=f.w*.025*q;g.head=-.15*q;p.head=.12*q;}
    if(act==='turn-cloth-page'){g.head=.14*q;p.lean=.09*q;p.turn=.25*q;}
    if(shot.memory===2&&b.view!=='photo'){p.sit=g.sit=.9;p.head=.10;g.head=-.10;if(act==='sit-by-partner'){p.x+=f.w*.025*q;g.x-=f.w*.025*q;p.lean=.13*q;g.lean=-.09*q;}if(act==='share-photo-glow'){p.handsWorld={right:VF.Kinematics.localToWorld(p,{x:36,y:-100},'pink')};g.handsWorld={left:VF.Kinematics.localToWorld(g,{x:-51,y:-103},'taupe')};}}
   }
   if(shot.mode==='ceremony'&&b.id==='opening'){const L=VF.GiftLayout(v,'ceremony',t,opt.reduced);for(const [id,a]of Object.entries(s.actors)){const pos=L.project(id==='pink'?-.54:.54,-.15,.20);a.x=pos.x;a.y=a.floor=pos.y;a.opacity=1;a.head=-.17;a.turn=id==='pink'?.2:-.2;a.handsWorld={[id==='pink'?'right':'left']:VF.Kinematics.localToWorld(a,{x:id==='pink'?48:-62,y:-110},id)};}s.cooperativeBox=true;}
   if(act==='seal-sky'||act==='seal-garden'){p.head=.18*q;g.head=.15*q;s.stampProgress=q;}
  }
 }
 class AdventureMemoryWorld extends WB{
  background(p,s,t,v,...rest){super.background(p,s,t,v,...rest);if(s.guardian.choiceResult&&['memory','letter'].includes(s.chapter))this.stats.branchAction={type:s.choiceAction,progress:span(.12,2.3,s.actionAge)};}
  memoryPage(p,s,v){const b=s.guardian,q=s.page;if(!q||b.view==='photo'||['reaction','envelope','rest'].includes(b.view))return super.memoryPage(p,s,v);const img=VF.MemoryAssets.image(s.memory),a=s.actionAge??b.age,progress=b.choiceResult?span(.12,2.3,a):0,path=s.memoryPath||'neutral';
   p.save();p.translate(q.x,q.y);p.rotate(q.angle);p.fillStyle='#e7d7bd';p.shadowColor='#071c2690';p.shadowBlur=12;p.shadowOffsetY=5;p.fillRect(-q.w/2-5,-q.h/2-5,q.w+10,q.h+10);p.shadowColor='transparent';
   if(s.memory===0){p.drawImage(img,-q.w/2,-q.h/2,q.w,q.h);for(const side of [-1,1]){p.save();p.translate(side*q.w*(.06+progress*.76),q.h*(.16-progress*(path==='glow'?.48:.2)));p.rotate(side*(.18+progress*(path==='glow'?.85:.5)));VF.Art.draw(p,'foliage',VF.Art.rects.foliage.leaf,-q.w*.65,-q.h*.75,q.w*1.3,q.h*1.22);p.restore();}}
   else if(s.memory===1){p.drawImage(img,-q.w/2,-q.h/2,q.w,q.h);const turn=path==='page',width=q.w*(1-progress);p.fillStyle='#b79880';if(turn){p.save();p.translate(-q.w/2,0);p.transform(1-progress,Math.sin(progress*Math.PI)*.25,0,1,0,0);p.fillRect(0,-q.h/2,q.w,q.h);p.strokeStyle='#dfc4a2';p.strokeRect(4,-q.h/2+4,q.w-8,q.h-8);p.restore();}else{for(const side of [-1,1]){p.fillStyle=side<0?'#a98376':'#c6a68a';p.fillRect(side<0?-q.w/2:q.w/2-width/2,-q.h/2,width/2,q.h);}}}
   else {p.save();p.beginPath();if(path==='close')p.rect(-q.w/2,-q.h/2,q.w,q.h*progress);else p.ellipse(0,0,Math.max(.01,q.w*.74*progress),Math.max(.01,q.h*.74*progress),0,0,Math.PI*2);p.clip();p.drawImage(img,-q.w/2,-q.h/2,q.w,q.h);p.restore();}
   p.restore();this.photoStats(s,q,img,progress);this.stats.photo.revealStyle=['two-paw-petal-curtain','physical-cloth-album','shared-light-and-silence'][s.memory];this.stats.memoryAdventure={action:s.memoryAdventure,path,progress};if(b.choiceResult)this.stats.branchAction={type:s.memoryAdventure,progress};
   if(b.choiceResult&&s.memory===0&&path==='glow'){const x=mix(v.frame.x+v.frame.w*.10,q.x,q.h?progress:0),y=q.y-q.h*.5-13;p.save();p.globalCompositeOperation='screen';p.drawImage(this.glow,x-22,y-22,44,44);ellipse(p,x,y,3,4,'#fbefbc');p.restore();}
  }
  envelope(p,s,v){super.envelope(p,s,v);const q=s.envelopeRect,type=s.effects?.sealStyle==='sky'?(s.effects.skyMotif||'brush-star'):s.effects?.sealStyle==='garden'?(s.effects.gardenRelic||'rose-petal'):null;if(!q||!type)return;const end={x:q.x,y:q.y+q.h*.13},progress=s.stampProgress??1,sourceActor=s.actors?.[s.guardian.speaker],from=sourceActor?(sourceActor.handsWorld?.right||VF.Kinematics.localToWorld(sourceActor,sourceActor.arms.right,s.guardian.speaker)):{x:end.x+18,y:end.y-20};const key=s.effects.sealStyle==='sky'?'sky':'garden',variant=key==='garden'?'flower':this.relicState?.items.sky?.variant||'paint',size=Math.min(44,q.w*.29);VF.RelicVisual.draw(p,key,variant,mix(from.x,end.x,progress),mix(from.y,end.y,progress),size,this.paintingInput,1,'decoration');this.stats.envelopeRelic={type,variant,illustrated:true,usesOwnWish:key==='sky'};if(s.guardian.choiceResult)this.stats.branchAction={type:s.choiceAction,progress};}
  afterActors(p,s,t,v,...rest){super.afterActors(p,s,t,v,...rest);if(s.chapter==='memory'&&s.memory===2&&s.guardian.choiceResult){const left=s.renderedActors.find(a=>a.id==='pink')?.hands.right,right=s.renderedActors.find(a=>a.id==='taupe')?.hands.left;if(left&&right&&s.memoryPath==='light'){const x=mix(left.x,right.x,.5),y=mix(left.y,right.y,.5)-8;p.save();p.globalCompositeOperation='screen';p.drawImage(this.glow,x-25,y-25,50,50);p.restore();}}if(s.cooperativeBox)this.stats.cooperativeBox={actors:['pink','taupe'],roles:['lift','brace'],open:s.ceremony.open};}
 }
 VF.SceneStage=AdventureMemories;VF.SceneEnvironment=AdventureMemoryWorld;
})();
