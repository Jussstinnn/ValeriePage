/* Branch briefly, live the consequence, rejoin. Dialogue is fiction of the plushes. */
(() => {
 const beat=(id,speaker,text,acting='watch',extra={})=>({id,speaker,text,acting,view:'original',kind:speaker?'speech':'narration',emotion:speaker==='pink'?'curious':'gentle',look:'partner',lightCue:'warm',close:'next',replay:true,...extra});
 const option=(id,label,action,variant,effects,line,speaker)=>({id,label,accessibilityLabel:label,immediateAction:action,sceneVariant:variant,stateEffects:effects,resultDialogue:line,futureDialogue:{},speaker});
 const choices={
  'leaf-holder':{choiceId:'leaf-holder',chapter:'te-abro-el-camino',prompt:'¿Quién sostiene la hoja?',preconditions:[],rejoinNode:'leaf-together',options:[option('rosa','Rosa sostiene la hoja','leaf-pink','pink-canopy',{canopy:'pink'},'¡Ahora sí cabemos!','pink'),option('beige','Beige sostiene la hoja','leaf-taupe','taupe-canopy',{canopy:'taupe'},'Pasa. Yo la sostengo.','taupe')]},
  'forest-way':{choiceId:'forest-way',chapter:'el-bosque-escucha',prompt:'¿Qué hacemos con esa lucecita?',preconditions:[],rejoinNode:'forest-together',options:[option('firefly','Seguir a la luciérnaga','follow-spark','lantern-path',{forestLight:'gold'},'¡Espera! Solo quiero mirarte…','pink'),option('tree','Escuchar al árbol','listen-tree','listening-grove',{forestLight:'mint'},'No estaba dormido. Nos escuchaba.','taupe')]}
 };
 VF.StoryGraph={version:1,choices,beat,option};VF.GuardianNames={pink:'Rosa',taupe:'Beige'};
 Object.assign(VF.GuardianScript,{
 'dos-miradas':[beat('loose-light','pink','Se me escapa…','light-wobble',{kind:'thought'}),beat('steady','taupe','Es más fácil entre dos.','steady-light'),beat('invitation','pink','¿Vienes con nosotros?','beckon'),beat('garden','taupe','La caja del jardín nos espera.','look-back')],
 'te-abro-el-camino':[beat('leaf-problem','pink','La hoja tapa el camino.','nose-leaf'),beat('leaf-offer','taupe','Podemos levantarla.','shelter'),beat('leaf-choice','pink','¿Me ayudas?','listen',{kind:'choice',choiceId:'leaf-holder'}),beat('leaf-result',null,'','watch',{kind:'result',choiceId:'leaf-holder'}),beat('leaf-together',null,'Una hoja puede convertirse en refugio.','rest-together')],
 'el-tiempo-de-los-dos':[beat('wait','pink','Pensé que ibas muy lento.','look-back'),beat('answer','taupe','Te estaba esperando.','welcome'),beat('together',null,'','rest-together')],
 'un-secreto-para-ti':[beat('sleeping','pink','Esa caja está dormida.','guard-secret'),beat('three','taupe','Le faltan tres destellos.','study-painting',{kind:'thought'}),beat('meaning','taupe','Curiosidad. Cuidado. Recuerdos.','welcome'),beat('resolve','pink','Entonces… vamos a buscarlos.','beckon')],
 'tras-la-luz':[beat('follow','pink','¿Y si no encontramos el camino?','follow-light',{kind:'thought'}),beat('answer','taupe','Lo encontramos juntos.','look-back')],
 'el-bosque-escucha':[beat('glimmer','pink','¿Lo seguimos?','hear-light'),beat('listen','taupe','¿O escuchamos primero?','hear-light'),beat('forest-choice','pink','Valerie, ¿por dónde?','listen',{kind:'choice',choiceId:'forest-way'}),beat('forest-result',null,'','watch',{kind:'result',choiceId:'forest-way'}),beat('forest-together','taupe','Una luz para el camino.','share-light')]
 });
})();
