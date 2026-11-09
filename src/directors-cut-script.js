/* F24.3 authoritative edit: stable chapter IDs; one editorial and physical score. */
(() => {
 const S=VF.GuardianScript,C=VF.StoryGraph.choices,shots=VF.content.shots;
 const make=rows=>{let start=0;return rows.map(([id,speaker,text,gesture,duration,extra={}])=>{const b={id,speaker,text,acting:gesture,kind:speaker?'speech':'silence',view:'original',close:'action',actionPlan:{start,duration,gesture,focus:'pair',completion:'landed-and-settled'},playback:{minReadableDuration:duration,actionCompletion:'authored-score-complete'},...extra};start+=duration;return b;});};
 S['antes-del-primer-pasito']=make([
  ['arrival','pink','¡Yo llevo la luz!','lantern-almost-falls',2.8],
  ['lantern','taupe','Despacio, Rosa… primero las dos patitas.','catch-lantern',3.2],
  ['unlatch',null,'','lantern-release',3.6,{interaction:{label:'Soltar el broche del farol',hint:'Toca el broche que Beige sostiene',target:'lantern'}}],
  ['escape','pink','¡Tiene alas!','meet-the-guide',3.8],
  ['leave','taupe','Entonces habrá que hacerle sitio.','arch-departure',3.6,{departure:true}]
 ]);
 C['guide-way']={choiceId:'guide-way',chapter:'dos-miradas',prompt:'La pequeña guía se enredó en la cinta. ¿La ayudamos?',preconditions:[],rejoinNode:'reply',options:[
  {id:'lift',label:'Rosa levanta la cinta',accessibilityLabel:'Rosa levanta la cinta para que el hada pase por arriba',speaker:'pink',immediateAction:'lift-ribbon',sceneVariant:'over-vine',stateEffects:{guideFlight:'high'},resultDialogue:'¡Por arriba! Yo te hago un huequito.',futureDialogue:{}},
  {id:'shelter',label:'Beige le ofrece refugio',accessibilityLabel:'Beige recoge la cinta y ofrece una patita al hada',speaker:'taupe',immediateAction:'shelter-fairy',sceneVariant:'palm-refuge',stateEffects:{guideFlight:'low'},resultDialogue:'Aquí puedes descansar. Nosotros esperamos.',futureDialogue:{}}
 ]};
 S['dos-miradas']=make([
  ['loose-light','pink','¡Espera! Tu ala se quedó en la cinta.','notice-snag',3.4],
  ['steady','taupe','No tires. Vamos a desenredarla juntos.','hold-ribbon',3.6],
  ['escape','pink','Valerie, ¿le prestamos una patita?','ask-guide',0,{kind:'choice',choiceId:'guide-way'}],
  ['together',null,'','guide-rescue',6.2,{kind:'result',choiceId:'guide-way'}],
  ['reply','taupe','Ahora sí. Tú nos muestras por dónde.','release-guide',3.7],
  ['leave',null,'','rows-departure',3.5,{departure:true}]
 ]);
 // Gallery is a physical set, shared by its three destinations and the private album.
 const galleryIds=['el-vestibulo-de-las-historias','el-museo-de-la-noche','dos-sonrisas'];
 for(const id of galleryIds){const shot=shots.find(s=>s.id===id);shot.engine='journey';shot.set='gallery';}
 S['el-vestibulo-de-las-historias']=make([
  ['entry','pink','¡Aquí el suelo devuelve nuestros pasitos!','gallery-entry',4.2],
  ['wait','taupe','Ven. Hay sitio para los dos.','gallery-wait',3.8],
  ['leave',null,'','walk-to-scream',4.6,{departure:true}]
 ]);
 S['el-museo-de-la-noche']=make([
  ['arrival','pink','¡Ah! ¿También se le escapó una luciérnaga?','scream-surprise',4.6],
  ['mimic','taupe','O quizá le faltó alguien con quien mirarla.','shy-mimic',4.7],
  ['lamp',null,'','light-the-work',2.8,{interaction:{label:'Encender la lámpara del cuadro',hint:'Toca el aplique junto a El grito',target:'lamp'}}],
  ['soft','pink','Así da menos susto.','relieved-ears',3.8],
  ['leave','taupe','Mira… esa página nos está esperando.','walk-to-album',4.8,{departure:true}]
 ]);
 C['album-space'].chapter='dos-sonrisas';C['album-space'].rejoinNode='contemplate';
 S['dos-sonrisas']=make([
  ['peek','pink','Hay algo guardado aquí. Esta vez no voy a tirar de la cinta.','album-peek',4.6],
  ['space','taupe','Abrámoslo con cuidado.','album-offer',3.6],
  ['album-choice','pink','¿Nos hacemos un huequito?','album-seat',0,{kind:'choice',choiceId:'album-space'}],
  ['album-result',null,'','album-support',3.8,{kind:'result',choiceId:'album-space',interaction:{label:'Descubrir Dos sonrisas',hint:'Toca el álbum cerrado',target:'memory'}}],
  ['contemplate',null,'Dos sonrisas. Todo el tiempo para mirarlas.','quiet-photo',1,{view:'photo'}],
  ['laugh','pink','Ahora también me dan ganas de sonreír.','soft-hop',4.2,{view:'reaction'}],
  ['leave','taupe','Nos llevamos esa luz.','walk-to-night',4.4,{departure:true}]
 ]);
 const album=shots.splice(shots.findIndex(s=>s.id==='dos-sonrisas'),1)[0];
 shots.splice(shots.findIndex(s=>s.id==='dentro-del-cuadro'),0,album,{id:'la-noche-en-la-pared',title:'Una noche dentro del marco',mode:'museum',world:'museum',engine:'journey',set:'gallery',hold:20,line:'Primero, mirar. Después, cruzar.'});
 S['la-noche-en-la-pared']=make([
  ['arrival','pink','Beige… aquí la noche no está dormida.','reach-starry-night',4.5],
  ['recognize','taupe','Mira sus remolinos. Parece que todo el cielo respira.','look-at-authentic-work',4.8],
  ['invitation',null,'','contemplate-authentic-work',2.5,{interaction:{label:'Seguir al hada dentro del cuadro',hint:'Contempla La noche estrellada de Vincent van Gogh cuanto quieras. Toca su marco cuando quieras entrar.',target:'painting'}}],
  ['leave',null,'','cross-the-frame',3.2,{departure:true}]
 ]);
 C['museum-sky'].chapter='dentro-del-cuadro';C['museum-sky'].rejoinNode='earned';
 S['dentro-del-cuadro']=make([
  ['inside','pink','¡El suelo se está volviendo pinceladas!','painting-arrival',5],
  ['ask','taupe','Hay una parte de este cielo que todavía podemos dibujar.','offer-brush',4.7],
  ['sky-choice','pink','Valerie, ¿qué dejamos en él?','watch',0,{kind:'choice',choiceId:'museum-sky'}],
  ['sky-result',null,'','paint-with-light',5.6,{kind:'result',choiceId:'museum-sky',interaction:{label:'Dibujar nuestro deseo',hint:'Traza sobre el cielo con el dedo; el botón también dibuja un trazo completo',target:'sky'}}],
  ['earned','taupe','Recorrimos todo este camino buscando una luz…','see-the-wish',4.8],
  ['wish','pink','Y Valerie es nuestro mayor deseo.','shared-wish',5.4],
  ['leave',null,'','follow-the-painted-trail',4.3,{departure:true}]
 ]);
 // A protected, explicitly opened ceremony. No elapsed scene time authorizes the ring.
 S['la-caja-rosa']=make([
  ['recognize','pink','Volvimos. Es la misma piedra… y la misma caja.','recognize-box',4,{view:'gift'}],
  ['near','taupe','Esta vez traemos el camino con nosotros.','protect-gift',4,{view:'gift'}]
 ]);
 S['algo-que-guarde']=make([
  ['opening',null,'Ellos sostienen la tapa. Tú decides cuándo abrir el broche.','support-lid',5.8,{interaction:{label:'Abrir el broche de la caja',hint:'Toca el cierre. El anillo permanece oculto hasta que la tapa se abra.',target:'box'}}],
  ['reveal','pink','Ahí está. Lo cuidamos hasta que llegaras.','wonder',4.5],
  ['jewel',null,'Puedes acercarte todo el tiempo que quieras.','quiet',2,{view:'macro'}],
  ['witness','taupe','Ahora ya no tenemos que guardar el secreto.','rest-together',4,{view:'return'}]
 ]);
 for(const shot of shots)if(['case','ceremony','finale'].includes(shot.mode))shot.set='alcove';
 const old=VF.Journey,order=shots.map(s=>s.id),links={};for(let i=0;i<shots.length-1;i++){
  const a=shots[i],b=shots[i+1];links[a.id+'>'+b.id]=a.set==='gallery'&&b.set==='gallery'?'follow-cast':a.id==='la-noche-en-la-pared'?'frame-match':a.id==='la-casa-de-las-ventanas'?'doorway':a.id==='el-vestibulo-de-las-historias'?'follow-cast':old.links[a.id+'>'+b.id]||(['memory','letter'].includes(a.mode)?'page-turn':'leaf-occlusion');
 }
 const actionKeys=shots.flatMap(s=>(S[s.id]||[]).filter(b=>b.interaction).map(b=>s.id+':'+b.id));
 const definitions=Object.fromEntries(shots.filter(s=>s.engine==='journey').map(s=>[s.id,{title:s.title,set:s.set,beats:S[s.id]}]));
 VF.Journey=Object.freeze({...old,definitions,version:3,order,links,actionKeys,transition(a,b){return links[a+'>'+b]||links[b+'>'+a]||'leaf-occlusion';}});
 VF.VerticalScore={...VF.VerticalScore,version:3,chapters:[...new Set([...VF.VerticalScore.chapters,...galleryIds,'la-noche-en-la-pared','dentro-del-cuadro'])]};
})();
