/* The only authoritative visible screenplay. Historical bootstraps cannot overwrite it. */
(() => {
 const source=VF_FILM_SCRIPT,freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
 if(source.version!==4)throw Error('Unsupported film screenplay');const registry={},shots=[];
 for(const entry of source.chapters){const {beats,...shot}=entry;if(registry[shot.id]||!beats?.length)throw Error('Invalid chapter '+shot.id);if(new Set(beats.map(b=>b.id)).size!==beats.length)throw Error('Duplicate beat '+shot.id);registry[shot.id]=beats;shots.push(shot);}
 VF.content.shots.splice(0,VF.content.shots.length,...shots);Object.defineProperty(VF,'GuardianScript',{value:freeze(registry),writable:false,configurable:false});VF.GuardianNames={pink:'Fresita',taupe:'Lio'};VF.StoryGraph.choices=freeze(source.choices);
 const old=VF.Journey,links=source.connections,order=shots.map(s=>s.id),definitions=Object.fromEntries(shots.filter(s=>s.engine==='journey').map(s=>[s.id,{set:s.set,title:s.title,beats:registry[s.id]}]));
 VF.Journey=Object.freeze({...old,version:4,order,links,definitions,actionKeys:shots.flatMap(s=>registry[s.id].filter(b=>b.interaction).map(b=>s.id+':'+b.id)),transition(a,b){return links[a+'>'+b]||links[b+'>'+a]||'color-ribbon';}});
 // Missing objects hold at the box; they never reorder the film by silently sending the viewer back.
 const previousAccess=VF.ReadingPolicy.resolve;VF.ReadingPolicy.resolve=(requested,session)=>{const resolved=previousAccess(requested,session),home=shots.findIndex(s=>s.mode==='case');return resolved>home&&Object.keys(VF.RelicJourney.sanitize(session.relics)).length<3?home:resolved;};

 VF.FilmScript=freeze({version:4,source:'src/film-script.json',ownership:Object.fromEntries(order.map(id=>[id,'src/film-script.json'])),landmark:source.landmark});VF.VerticalScore={version:4,chapters:Object.keys(definitions),time:b=>b?.actionPlan?b.actionPlan.start+Math.min(b.age||0,b.actionPlan.duration):b?.age||0};
})();
