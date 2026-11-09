/* F24.1. Authored turns share a chapter score, not seven independent pose resets.
   A plan ends on a stable contact; its successor starts at that same score point. */
(() => {
 'use strict';
 const S=VF.GuardianScript,C=VF.StoryGraph.choices;
 const turn=(id,speaker,text,start,duration,gesture,focus='pair',extra={})=>({id,speaker,text,acting:gesture,kind:speaker?'speech':'silence',view:'original',look:'partner',lightCue:'warm',close:'action',replay:true,actionPlan:{start,duration,gesture,focus,completion:'landed-and-settled'},playback:{minReadableDuration:duration+.65,actionCompletion:'vertical-score-complete'},...extra});
 S['dos-miradas']=[
  turn('loose-light','pink','¡Ay! Era más fácil cuando no se movía.',0,3.4,'catch-miss','light'),
  turn('steady','taupe','Las cosas bonitas suelen hacer eso.',3.4,3.0,'catch-with-ear','beige'),
  turn('escape','pink','¿Y si vuelve a escaparse?',6.4,2.3,'check-light','rosa'),
  turn('together','taupe','La seguimos. Pero esta vez, juntos.',8.7,3.0,'offer-paw'),
  turn('invitation','pink','Valerie… ¿nos acompañas?',11.7,3.1,'invite-viewer','viewer')
 ];
 S['te-abro-el-camino']=[
  turn('leaf-problem','pink','Creo que esta hoja no quiere dejarnos pasar.',0,3.4,'nose-and-recoil','leaf'),
  turn('leaf-offer','taupe','Tal vez solo necesita que alguien la sostenga.',3.4,2.8,'study-leaf','leaf'),
  turn('leaf-choice','pink','¿Quién la levanta?',6.2,0,'ask-holder','leaf',{kind:'choice',choiceId:'leaf-holder'}),
  turn('leaf-result','pink','',6.2,6.5,'canopy-crossing','leaf',{kind:'result',choiceId:'leaf-holder'}),
  turn('leaf-reply','taupe','',12.7,2.6,'canopy-reunite','pair',{choiceId:'leaf-holder',branchLines:{rosa:'Uno muy valiente.',beige:'Con que no corras tanto me basta.'},neutralText:'Ahora podemos pasar juntos.'}),
  turn('leaf-together',null,'',15.3,.8,'carry-leaf','pair',{departure:true})
 ];
 C['leaf-holder'].rejoinNode='leaf-reply';
 S['una-patita-mas']=[
  turn('bank','pink','Desde aquí se ve altísimo.',0,2.5,'inspect-bank','water'),
  turn('also','taupe','Sí. Un poquito.',2.5,2.2,'step-back','beige'),
  turn('afraid','pink','¿También te da miedo?',4.7,2.0,'notice-partner','rosa'),
  turn('cross','taupe','Un poquito. Saltemos uno a la vez.',6.7,4.8,'cross-one-at-a-time','wide'),
  turn('landed','pink','¡Lo hicimos!',11.5,2.4,'relief','pair'),
  turn('reply','taupe','Y todavía tengo mis dos orejas.',13.9,2.8,'ear-check','beige')
 ];
 S['el-tiempo-de-los-dos']=[
  turn('wait','pink','¿Por qué te quedaste?',0,3.6,'return-to-beige','pair'),
  turn('answer','taupe','Porque estaba mirando cómo se movía esa flor.',3.6,2.7,'watch-flower','flower'),
  turn('notice','pink','Yo no la había visto.',6.3,2.6,'sit-beside','flower'),
  turn('worth','taupe','Entonces valió la pena detenernos.',8.9,2.5,'share-stillness','pair'),
  turn('together','pink','Creo que me gusta caminar así.',11.4,2.3,'lean-together','pair'),
  turn('silence',null,'',13.7,3.0,'quiet-breeze','pair')
 ];
 S['un-secreto-para-ti']=[
  turn('sleeping','pink','Ahí está…',0,2.4,'notice-box','box'),
  turn('not-yet','taupe','Todavía no puede abrirse.',2.4,2.5,'protect-secret','box'),
  turn('missing','pink','¿Le falta algo?',4.9,2.2,'wonder-box','rosa'),
  turn('meaning','taupe','Creo que necesita recordar cómo brillar.',7.1,2.8,'listen-to-box','box'),
  turn('teach','pink','Entonces le enseñamos. ¿Sí?',9.9,2.6,'offer-light','pair'),
  turn('resolve','taupe','Sí. Pero no con prisa.',12.5,2.8,'guard-and-depart','pair')
 ];
 S['tras-la-luz']=[
  turn('follow','pink','¡Por ahí! ¡La vi!',0,3.1,'scout-ahead','light'),
  turn('call','taupe','Rosa…',3.1,2.0,'protect-leaf','beige'),
  turn('wait','pink','Esta vez sí te esperé.',5.1,3.0,'return-and-wait','pair'),
  turn('answer','taupe','Lo vi.',8.1,2.4,'warm-laugh','beige'),
  turn('three','pink','¿Vamos los tres?',10.5,2.1,'invite-light','light'),
  turn('together','taupe','Los tres.',12.6,4.2,'enter-forest','wide')
 ];
 const b=VF.StoryGraph.beat;
 S['el-bosque-escucha']=[b('glimmer','pink','¡Está haciendo una señal!','hear-light'),b('listen','taupe','O quizás el bosque está intentando decirnos algo.','hear-light'),b('forest-choice','pink','¿Qué hacemos, Valerie?','listen',{kind:'choice',choiceId:'forest-way'}),b('forest-result',null,'','watch',{kind:'result',choiceId:'forest-way'}),b('forest-together','taupe','Solo estaba esperando que escucháramos.','share-light')];
 const copy={
  'leaf-holder':['¿Quién sostiene la hoja para que pasen?','Rosa la levanta; Beige cruza','Beige la levanta; Rosa cruza'],
  'forest-way':['¿Por dónde descubren el camino?','Seguir a la luciérnaga','Escuchar al árbol antiguo'],
  'museum-sky':['¿Cómo abrirán el cielo del cuadro?','Dibujar una estrella juntos','Unir las cinco luces'],
  'garden-gift':['¿Qué podrán cuidar en el camino?','Guardar el pétalo rosado','Proteger la pequeña flor de luz'],
  'portrait-reveal':['¿Cómo descubren lo que se esconde?','Levantar la hoja entre los dos','Pedirle luz a la luciérnaga'],
  'album-space':['¿Cómo miran juntos esta página?','Rosa le hace sitio a Beige','Beige ayuda a pasar la página'],
  'quiet-memory':['¿Cómo acompañan este instante?','Sostenerlo con una lucecita','Quedarse acurrucados'],
  'letter-seal':['¿Qué detalle acompañará la carta?','Una estrella del cielo','Un lirio del jardín']
 };
 for(const [id,[prompt,...labels]]of Object.entries(copy)){C[id].prompt=prompt;C[id].options.forEach((o,i)=>{o.label=o.accessibilityLabel=labels[i];});}
 const intro=[
  turn('intro-arrival','pink','¡Beige! ¿Ya llegó?',0,3.2,'enter-pink','pair'),
  turn('intro-beige','taupe','Creo que sí. Pero no la apuremos.',3.2,3.4,'enter-beige','pair'),
  turn('intro-rosa','pink','Yo soy Rosa. Me gusta descubrir lo que hay después del camino.',6.6,3.0,'introduce-rosa','viewer'),
  turn('intro-name','taupe','Y yo soy Beige. Me gusta asegurarme de que nadie se quede atrás.',9.6,3.0,'introduce-beige','viewer'),
  turn('intro-invite','pink','¿Nos acompañas, Valerie?',12.6,2.4,'invite-viewer','viewer'),
  turn('intro-help','taupe','Aquí algunas cosas pasan solas. Otras solo suceden cuando tú nos ayudas.',15,3.0,'invite-participation','viewer'),
  turn('intro-ready',null,'',18,0,'wait-for-valerie','pair',{playback:{autoplay:false,minReadableDuration:0,holdReason:'reveal',actionCompletion:'explicit-start'},protectedStart:true})
 ];intro.forEach(b=>b.prologue=true);S['dos-miradas'].unshift(...intro);
 S['te-abro-el-camino'].find(b=>b.id==='leaf-result').interaction={hint:'Toca la hoja para ayudarles a levantarla',label:'Levantar la hoja juntos',target:'leaf'};
 S['tras-la-luz'].find(b=>b.id==='follow').interaction={hint:'Acerca la lucecita para que encuentren el sendero',label:'Guiar la lucecita',target:'light'};
 C['leaf-holder'].options[0].resultDialogue='¡Mira! Ahora soy un techito.';C['leaf-holder'].options[0].speaker='pink';
 C['leaf-holder'].options[1].resultDialogue='¡Te debo un saltito!';C['leaf-holder'].options[1].speaker='pink';
 VF.VerticalScore={version:1,chapters:['dos-miradas','te-abro-el-camino','una-patita-mas','el-tiempo-de-los-dos','un-secreto-para-ti','tras-la-luz','el-bosque-escucha'],time(beat){const p=beat?.actionPlan;return p?p.start+Math.min(Math.max(0,beat.age||0),p.duration):Math.max(0,beat?.age||0);}};
})();
