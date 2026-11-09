/* Stable editorial IDs. Fiction belongs to the plushes; personal photo notes stay author-owned. */
(() => {
 const b=(id,speaker,text,acting,view='original',extra={})=>({id,speaker,text,acting,view,emotion:speaker==='pink'?'curious':'gentle',look:'partner',lightCue:'warm',soundCue:null,close:'next',replay:true,...extra}),S=VF.GuardianScript;

 S['dos-miradas']=[b('invitation','pink','¿Vienes, Valerie?','beckon'),b('together','taupe','Te estábamos esperando.','welcome')];
 S['te-abro-el-camino']=[b('shelter',null,'A veces, cuidar es hacer un poquito de espacio.','shelter'),b('leaf','taupe','Por aquí. Yo sostengo la hoja.','shelter','vine-detail',{gain:'leaf'})];
 S['una-patita-mas']=[b('cross',null,'Si el paso parece grande, aquí tienes mi patita.','support','original',{close:'action'}),b('landed','pink','¿Viste? Me animé.','sigh','vine-detail')];
 S['el-tiempo-de-los-dos']=[b('quiet',null,'Qué bonito cuando nadie tiene que correr.','rest-together','vine-detail')];
 S['un-secreto-para-ti']=[b('secret','pink','No es el momento… todavía.','guard-secret'),b('safe','taupe','Está a salvo.','welcome')];
 S['tras-la-luz']=[b('path',null,'Una luz pequeña también puede encontrar un camino.','follow-light'),b('wait','taupe','¿Seguimos los tres?','look-back')];
 S['el-bosque-escucha']=[b('listen','pink','¿Nos está escuchando?','hear-light'),b('answer','taupe','Creo que quiere venir.','share-light')];
 S['el-museo-de-la-noche']=[b('stir','taupe','Algo se mueve dentro.','study-painting'),b('welcome','pink','Creo que nos hizo un huequito.','wonder','painting-close',{gain:'museum',soundCue:'painting'})];
 S['dentro-del-cuadro']=[b('frame',null,'Hasta la noche puede abrir una puerta.','study-painting','brush-frame'),b('passage',null,'','follow-light','cross-frame')];
 S['un-deseo-para-dos']=[b('wish',null,'Hay luces que dan ganas de guardar.','watch'),b('star','pink','¿Nos llevamos una?','catch-star','treasure',{gain:'star',soundCue:'wish'}),b('promise','taupe','La más pequeña. Así cabrá en mi patita.','shelter-star','treasure')];
 S['el-jardin-despierta']=[b('bloom',null,'No hace falta apresurar lo que está floreciendo.','watch'),b('petal','pink','Este pétalo quiere venir.','catch-petal','treasure',{gain:'petal',soundCue:'flower'}),b('carry','taupe','Con cuidado… es muy suave.','welcome','treasure')];
 S['un-lirio-para-ti']=[b('lily',null,'Un lirio para detener el mundo un momento.','watch'),b('offer','pink','¿Lo cuidamos juntos?','offer-petal','treasure')];
 S['nuestro-retrato']=[b('found','pink','Hay un brillo bajo esa hoja.','nose-leaf','discovery'),b('help','taupe','Despacio… de este lado la sostengo yo.','lift-page','reveal',{soundCue:'memory'}),b('contemplate',null,'Un retrato para mirar sin prisa.','quiet','photo',{look:'photo'}),b('reaction','pink','¡Hay un perrito!','sniff-photo','reaction',{gain:'portrait'})];
 S['dos-sonrisas']=[b('peek','pink','Tengo algo aquí…','peek-album','discovery'),b('welcome','taupe','¿Y por qué lo escondes?','lean-album','album'),b('space','pink','No lo escondo. ¡Te estoy haciendo sitio!','make-room','reveal',{soundCue:'memory'}),b('contemplate',null,'Dos sonrisas. Ninguna prisa.','quiet','photo',{look:'photo'}),b('laugh','pink','A mí también se me está pegando.','soft-hop','reaction'),b('stay',null,'','rest-together','rest',{gain:'smiles'})];
 S['un-instante']=[b('quiet',null,'Hay instantes que no necesitan decir nada.','rest-together','rest'),b('contemplate',null,'Puedes quedarte aquí.','quiet','photo',{look:'photo'}),b('listen','pink','Hay algo tibio entre las páginas.','feel-page','reaction'),b('envelope','taupe','Es para Valerie.','find-envelope','envelope',{gain:'envelope'})];
 S['una-carta-para-ti']=[b('offer','pink','Esta sí es para ti.','offer-envelope','envelope',{gain:'envelope'}),b('open','taupe','La abrimos… y te dejamos leer.','open-envelope','envelope'),b('read',null,'','quiet','read',{close:'reader'}),b('after',null,'Hay palabras que merecen un momento de silencio.','rest-together','envelope')];
})();
