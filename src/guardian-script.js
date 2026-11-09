/* Authored beats, never a timer-driven conversation. No invented personal history. */
(() => {
 const b=(id,speaker,text,acting='listen',view='companions',extra={})=>({id,speaker,text,emotion:speaker==='pink'?'curious':'tender',acting,view,look:'partner',lightCue:'warm',soundCue:null,close:'next',replay:true,...extra});
 VF.GuardianScript={
 'dos-miradas':[
  b('invitation','pink','Valerie… ven. Hay algo que queremos enseñarte.','invite'),
  b('together','taupe','A tu ritmo. Nosotros te acompañamos.','reassure')],
 'el-bosque-escucha':[
  b('listen','pink','¿Lo oyes? Hasta el bosque está esperando.','listen'),
  b('answer','taupe','Entonces caminemos despacio.','reassure')],
 'un-deseo-para-dos':[
  b('wish',null,'Hay luces que dan ganas de guardar.','watch','original'),
  b('star','pink','¿Podemos llevarnos una?','catch-star','treasure',{gain:'star',soundCue:'wish'}),
  b('promise','taupe','Una pequeña. Para alumbrar lo que viene.','shelter-star','treasure')],
 'el-jardin-despierta':[
  b('bloom',null,'No hace falta apresurar lo que está floreciendo.','watch','original'),
  b('petal','pink','Mira… este pétalo quiere venir con nosotros.','catch-petal','treasure',{gain:'petal',soundCue:'flower'}),
  b('carry','taupe','Lo guardamos con cuidado.','reassure','treasure')],
 'nuestro-retrato':[
  b('found','pink','Espera… hay algo entre los pétalos.','discover','discovery'),
  b('help','taupe','Déjame ayudarte. Lo sostenemos entre los dos.','lift-page','reveal',{soundCue:'memory'}),
  b('contemplate',null,'Un retrato para mirar sin prisa.','quiet','photo',{look:'photo'}),
  b('reaction','pink','Aquí también hay un pequeñito.','lean-photo','reaction'),
  b('keep','taupe','Dejemos una luz en esta página.','bookmark','reaction',{gain:'portrait'})],
 'dos-sonrisas':[
  b('peek','pink','Creo que esta página está escondiendo una sonrisa.','peek','discovery'),
  b('space','taupe','Hazme un huequito. Quiero verla contigo.','make-room','reveal',{soundCue:'memory'}),
  b('contemplate',null,'Dos sonrisas. Todo el tiempo del mundo para contemplarlas.','quiet','photo',{look:'photo'}),
  b('laugh','pink','No sé por qué… pero también me dan ganas de sonreír.','soft-hop','reaction'),
  b('stay','taupe','Hay cosas que se contagian sin hacer ruido.','nuzzle','reaction',{gain:'smiles'})],
 'un-instante':[
  b('quiet',null,'Hay recuerdos que se encuentran en voz bajita.','settle','discovery'),
  b('together','taupe','Ven, aquí cabemos los dos.','cuddle','reveal',{soundCue:'memory'}),
  b('contemplate',null,'Un instante. Puedes quedarte aquí cuanto quieras.','quiet','photo',{look:'photo'}),
  b('listen','pink','¿Y si lo siguiente no fuera un recuerdo todavía?','look-up','reaction'),
  b('envelope','taupe','Parece que alguien dejó unas palabras para ti.','find-envelope','envelope',{gain:'envelope'})],
 'una-carta-para-ti':[
  b('offer','pink','Esta sí es para ti, Valerie.','offer-envelope','envelope',{gain:'envelope'}),
  b('read',null,'Nos quedamos aquí mientras lees.','quiet','read',{close:'reader'}),
  b('after','taupe','Hay palabras que merecen un momento de silencio.','reassure','envelope')],
 'la-caja-rosa':[
  b('recognize','pink','Ese rosa… ¿no te resulta familiar?','recognize-box','gift'),
  b('wait','taupe','Sí. Guardamos esta sorpresa hasta que llegaras.','protect-gift','gift')],
 'algo-que-guarde':[
  b('opening',null,'Algunas sorpresas se abren mejor despacito.','watch','original',{close:'ceremony'}),
  b('reveal','pink','Ahí está… lo estábamos cuidando para ti.','look-up','original'),
  b('proud','taupe','Y ahora podemos enseñártelo.','reassure','original'),
  b('jewel',null,'Acércate. Este momento también puede durar.','quiet','macro',{close:'ceremony'}),
  b('witness','pink','Creo que ya sabes por qué queríamos que vinieras.','nuzzle','return')]
 };
 VF.GuardianNames={pink:'El conejito rosa',taupe:'El conejito beige'};
})();

