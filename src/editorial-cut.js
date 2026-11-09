/* F18. Less cutting by button: retain discoveries, decisions and reading, remove redundant replies. */
(() => {
 const S=VF.GuardianScript,{beat:b,choices}=VF.StoryGraph;
 const take=(id,ids)=>{S[id]=ids.map(k=>S[id].find(x=>x.id===k)).filter(Boolean);};
 S['dos-miradas']=[b('loose-light','pink','¡La luz se escapa!','light-wobble',{kind:'thought'}),b('steady','taupe','Es más fácil entre dos. La caja del jardín nos espera.','steady-light')];
 take('te-abro-el-camino',['leaf-problem','leaf-choice','leaf-result','leaf-together']);S['te-abro-el-camino'][0].text='No cabemos. ¿Y si levantamos esa hoja?';
 take('una-patita-mas',['bank','cross','landed']);S['una-patita-mas'][0].text='Parece ancho… ¿me esperas al otro lado?';
 S['el-tiempo-de-los-dos']=[b('answer','taupe','No iba lento… te estaba esperando.','pair-care')];
 take('un-secreto-para-ti',['sleeping','meaning']);S['un-secreto-para-ti'][1].text='Curiosidad, cuidado y recuerdos. Eso puede despertarla.';
 take('tras-la-luz',['follow']);
 take('el-bosque-escucha',['glimmer','forest-choice','forest-result','forest-together']);S['el-bosque-escucha'][0].text='Una luciérnaga… y ese árbol parece escucharnos.';
 take('el-museo-de-la-noche',['ask','sky-choice','sky-result','sky-door']);
 take('el-jardin-despierta',['bloom','ask','gift-choice','gift-result','garden-care']);S['el-jardin-despierta'][1].text='Algo pequeño. ¿Cuál guardamos?';
 take('nuestro-retrato',['found','portrait-choice','portrait-result','portrait-rest','dog']);
 take('dos-sonrisas',['peek','album-choice','album-result','album-rest','laugh']);S['dos-sonrisas'][0].text='No alcanzo a mirar… ¿me haces sitio?';
 take('un-instante',['quiet','quiet-choice','quiet-result','quiet-rest','envelope']);
 take('una-carta-para-ti',['offer','seal-choice','seal-result','read','after']);choices['letter-seal'].rejoinNode='read';
 take('la-caja-rosa',['recognize','near']);take('algo-que-guarde',['opening','reveal','jewel','witness']);
 for(const id of ['leaf-holder','forest-way','museum-sky','garden-gift']){const d=choices[id],exit=S[d.chapter].find(b=>b.id===d.rejoinNode);Object.assign(exit,{text:'',speaker:null,kind:'passage',departure:true});}
 // These moments are always held even in the optional film mode.
 for(const shot of VF.content.shots)for(const beat of S[shot.id]||[])if(beat.kind==='choice'||beat.kind==='result'||['photo','read','macro','question','homecoming'].includes(beat.view)||['case','ceremony','finale','petal'].includes(shot.mode))beat.editorialHold=true;
 VF.Editorial={baselineManualSteps:85,presentable(shot){return(S[shot.id]||[]).filter(b=>!b.departure);}};
})();
