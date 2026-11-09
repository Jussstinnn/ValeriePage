/* F24.2: final, single authored source for the rebuilt first act and gallery arrival. */
(() => {
 const S=VF.GuardianScript,C=VF.StoryGraph.choices,oldOrder=VF.content.shots.map(s=>s.id);
 const definitions={
  'antes-del-primer-pasito':{title:'El camino que prepararon',set:'arch',beats:[
   ['arrival','pink','¡Beige! ¡Creo que ya llegó!','pink-entry',3.8],['lantern','taupe','Entonces tenemos que hacerlo bien.','lantern-straighten',3.6],
   ['first-step','pink','Yo preparé el primer pasito.','early-hop',3.4],['second-step','taupe','Y yo preparé el segundo, por si saltas dos de golpe.','steady-ribbon',3.8],
   ['rosa-name','pink','Hola, Valerie. Yo soy Rosa.','greet-viewer',3.2],['beige-name','taupe','Y yo soy Beige. Hay un camino que queríamos mostrarte.','offer-path',3.6],
   ['alone','pink','Algunas cosas se mueven solitas…','watch-lantern',3],['help','taupe','…y otras esperan a que nos ayudes.','offer-ribbon',3.2],
   ['unlatch',null,'','lantern-release',4,{label:'Abrir el broche del farol',hint:'Toca la cinta para despertar el camino',target:'lantern'}],
   ['escape','pink','¡Ay! ¡Se nos escapó!','lantern-escape',4],['leave',null,'','arch-departure',3.8]
  ]},
  'dos-miradas':{set:'rows',beats:[
   ['loose-light','pink','¡Se nos escapó!','chase-light',3.8],['steady','taupe','Todavía podemos verla.','leave-lantern',3.4],['escape','pink','¿Y si se pierde de verdad?','check-light',3.5],
   ['together','taupe','Entonces no corremos cada uno por su lado.','offer-paw',4],['return','pink','Está bien. Pero si vuelve a volar…','return-to-beige',3.5],['reply','taupe','La seguimos juntos.','pair-gaze',3.5],
   ['attract',null,'','attract-light',4.6,{label:'Atraer la luz hacia el sendero',hint:'Acerca el dedo a la lucecita o ayúdalos con el botón',target:'light'}],['leave',null,'','rows-departure',3.5]
  ]},
  'te-abro-el-camino':{set:'pergola',beats:[
   ['leaf-problem','pink','¡Esta hoja pesa más que yo!','nose-leaf',3.4],['leaf-offer','taupe','Si uno la levanta, el otro puede cruzar debajo.','test-leaf',3.5],
   ['leaf-choice','pink','¿Quién nos presta una patita?','ask-holder',0,null,'leaf-holder'],['leaf-result','pink','','canopy-crossing',8.6,{label:'Ayudar a levantar la hoja',hint:'Toca o eleva la hoja; ellos sostienen los dos lados',target:'leaf'},'result'],
   ['leaf-reply','taupe','Ahora te sostengo yo. Pasa despacito.','swap-support',3.8],['leaf-together',null,'','pergola-departure',3.4]
  ]},
  'una-patita-mas':{set:'creek',beats:[
   ['bank','pink','Desde aquí parece lejísimos.','peer-water',3.2],['also','taupe','No hace falta hacerlo de un solo salto.','test-stone',3.5],['afraid','pink','¿Y si resbalo?','small-recoil',3.2],
   ['offer','taupe','Entonces te espero. Mira, esta es firme.','offer-stone',3.7],['cross',null,'','two-stone-crossing',8.8,{label:'Ayudar a encontrar la piedra',hint:'Toca una de las piedras iluminadas para abrir el paso',target:'stone'}],
   ['landed','pink','¡Sigo teniendo las dos patas!','shake-droplet',3.5],['reply','taupe','Y yo sigo teniendo las dos orejas.','check-ears',3.6],['leave',null,'','wet-footprints',3.4]
  ]},
  'el-tiempo-de-los-dos':{set:'rose',beats:[
   ['notice','pink','¿Te quedaste atrás?','return-for-beige',3.4],['answer','taupe','Mira cómo se inclina cuando pasa el viento.','notice-rose',3.8],['flower','pink','¡No la había visto!','lean-to-rose',3.5],
   ['slow','taupe','Hay cosas que se ven cuando caminamos más despacio.','petal-ear',4.8],['stay','pink','Entonces esperamos… pero solo un poquito.','snuggle-pause',4.5],['silence',null,'','shared-silence',4.2],['leave',null,'','rose-reflection',3.4]
  ]},
  'un-secreto-para-ti':{set:'alcove',beats:[
   ['sleeping','pink','Pensé que ya estaría despierta.','arrive-box',3.8],['meaning','taupe','Tal vez necesita que le contemos el camino.','touch-closed-box',4.2],['all','pink','¿Todo el camino?','wonder-box',3.2],
   ['together','taupe','Solo el que vivamos juntos.','projection-on-stone',5],['leave',null,'','light-enters-tunnel',4]
  ]},
  'tras-la-luz':{set:'tunnel',beats:[
   ['wait','pink','Esta vez sí te esperé.','scout-and-return',4.5],['reply','taupe','Lo vi.','beige-catches-up',3.5],['three','pink','¿Entramos?','ask-threshold',3.2],
   ['together','taupe','Si vamos juntos, sí.','threshold-pair',3.8],['follow',null,'','enter-forest',5,{label:'Guiar la luz entre las ramas',hint:'Acerca la lucecita al umbral del bosque',target:'light'}]
  ]},
  'donde-apuntan-las-raices':{title:'Donde apuntan las raíces',set:'roots',beats:[
   ['not-end','pink','¡No era el final del bosque!','fork-and-check',4],['signal','taupe','Es una señal. Mira las ventanas.','trace-root',4.2],
   ['reveal',null,'','root-reveal',5.6,{label:'Revelar el camino entre las raíces',hint:'Toca o sigue las marcas de la raíz',target:'roots'}],
   ['house','pink','Parece una casa hecha para guardar estrellas.','window-reaction',4.2],['leave',null,'','root-passage',4]
  ]},
  'la-casa-de-las-ventanas':{title:'La casa de las ventanas',set:'glasshouse',beats:[
   ['home','pink','¿Aquí vive la luz?','approach-glass',4],['sky','taupe','No lo sé… pero alguien guardó el cielo detrás de ese vidrio.','recognize-window',4.5],
   ['enter','pink','¿Entramos?','touch-handle',3.4],['care','taupe','Primero abramos la puerta, sin romper nada.','support-door',3.7],
   ['open',null,'','open-door',7,{label:'Abrir la puerta de la galería',hint:'Toca el picaporte; ellos esperan a que se abra',target:'door'}],['through',null,'','walk-through-door',5]
  ]},
  'el-vestibulo-de-las-historias':{title:'El vestíbulo de las historias',set:'vestibule',beats:[
   ['worlds','pink','¡Hay mundos enteros en estas paredes!','enter-vestibule',4],['chosen','taupe','Y esa luz eligió uno.','frame-with-ear',3.8],
   ['how','pink','¿Y cómo se entra a una pintura?','look-at-painting',3.7],['listen','taupe','Primero tenemos que escuchar lo que nos muestra.','approach-painting',4.6],['leave',null,'','painting-arrival',4]
  ]}
 };
 const make=(id,d)=>{let start=0;return d.beats.map(([beatId,speaker,text,gesture,duration,interaction,kind])=>{const b={id:beatId,speaker,text,kind:kind==='leaf-holder'?'choice':kind==='result'?'result':speaker?'speech':'silence',view:'original',acting:gesture,close:'action',actionPlan:{start,duration,gesture,focus:'pair',completion:'landed-and-settled'},playback:{minReadableDuration:duration,actionCompletion:'journey-score-complete'}};if(kind)b.choiceId=kind==='result'?'leaf-holder':kind;if(interaction)b.interaction=interaction;if(beatId==='leave'||beatId==='through'||beatId==='leaf-together')b.departure=true;start+=duration;return b;});};
 const prologue={id:'antes-del-primer-pasito',title:definitions['antes-del-primer-pasito'].title,mode:'prologue',world:'vineyard',biome:0,hold:20,line:'El camino que prepararon',action:'Abrir el farol'};
 VF.content.shots.unshift(prologue);
 const bridge=['donde-apuntan-las-raices','la-casa-de-las-ventanas','el-vestibulo-de-las-historias'].map(id=>({id,title:definitions[id].title,mode:'journey',world:id.includes('raices')?'forest':'museum',biome:0,hold:20,line:'La luz encuentra el camino.',action:'Ayudarles'}));
 VF.content.shots.splice(VF.content.shots.findIndex(s=>s.id==='el-museo-de-la-noche'),0,...bridge);
 for(const [id,d]of Object.entries(definitions)){const shot=VF.content.shots.find(s=>s.id===id);shot.engine='journey';shot.set=d.set;shot.entry='path-left';shot.exit=id==='la-casa-de-las-ventanas'?'door':'path-right';S[id]=make(id,d);}
 C['leaf-holder'].rejoinNode='leaf-reply';C['leaf-holder'].options[0].label=C['leaf-holder'].options[0].accessibilityLabel='Rosa sostiene; Beige pasa primero';C['leaf-holder'].options[1].label=C['leaf-holder'].options[1].accessibilityLabel='Beige sostiene; Rosa pasa primero';
 C['leaf-holder'].options[0].resultDialogue='¡Ahora sí! Yo sostengo, tú pasa.';C['leaf-holder'].options[0].speaker='pink';C['leaf-holder'].options[1].resultDialogue='Yo la sostengo. Tú primero, Rosa.';C['leaf-holder'].options[1].speaker='taupe';
 for(const [i,b]of S['el-museo-de-la-noche'].entries())if(b.kind!=='choice'&&!b.choiceId&&i<2){b.id='arrival-'+i;b.text=i===0?'La luz entró en ese cielo. ¿La viste, Beige?':'Sí. El marco de las raíces nos trajo hasta aquí.';}
 const order=VF.content.shots.map(s=>s.id),links={};for(let i=0;i<order.length-1;i++){const a=order[i],b=order[i+1];links[a+'>'+b]=a==='la-casa-de-las-ventanas'?'doorway':a==='el-vestibulo-de-las-historias'?'gallery-approach':VF.content.shots[i].engine==='journey'||a==='el-bosque-escucha'?'spatial-passage':a==='el-museo-de-la-noche'?'frame-match':a==='dentro-del-cuadro'?'light-match':a==='un-deseo-para-dos'?'petal-match':['case','ceremony','finale'].includes(VF.content.shots[i].mode)||['case','ceremony','finale'].includes(VF.content.shots[i+1].mode)?'gift-detail':['memory','letter'].includes(VF.content.shots[i].mode)&&['memory','letter'].includes(VF.content.shots[i+1].mode)?'page-turn':'leaf-occlusion';}
 const routeChapters=['donde-apuntan-las-raices','la-casa-de-las-ventanas','el-vestibulo-de-las-historias'];
 const invalidateRoute=session=>{for(const id of routeChapters){delete session.frames[id];delete session.narrative[id];for(const key of Object.keys(session.gestures))if(key.startsWith(id+':'))delete session.gestures[key];}session.journeyRoute=session.story.choices['forest-way']||'neutral';};
 VF.Journey=Object.freeze({version:2,invalidateRoute,syncRoute(session){const route=session.story.choices['forest-way']||'neutral';if(session.journeyRoute&&session.journeyRoute!==route)invalidateRoute(session);session.journeyRoute=route;},definitions,legacyOrder:oldOrder,order,links,actionKeys:Object.entries(definitions).flatMap(([id])=>S[id].filter(b=>b.interaction).map(b=>id+':'+b.id)),engine:shot=>shot?.engine==='journey',transition(a,b){return links[a+'>'+b]||links[b+'>'+a]||'leaf-occlusion';}});
 VF.VerticalScore={version:2,chapters:Object.keys(definitions),time:b=>b?.actionPlan?b.actionPlan.start+Math.min(b.age||0,b.actionPlan.duration):b?.age||0};
})();
