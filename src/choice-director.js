/* Session-only choices. Changing an option replaces derived consequences, never piles up rewards. */
(() => {
 const clean=raw=>{const out={version:1,choices:{},skipped:[],reading:'bubbles'};if(!raw||typeof raw!=='object'||![undefined,0,1].includes(raw.version))return out;out.reading=['subtitles','both','bubbles'].includes(raw.reading)?raw.reading:'bubbles';for(const [id,value]of Object.entries(raw.choices||{}))if(Object.hasOwn(VF.StoryGraph.choices,id)&&VF.StoryGraph.choices[id]?.options.some(o=>o.id===value))out.choices[id]=value;out.skipped=Array.isArray(raw.skipped)?[...new Set(raw.skipped.filter(id=>Object.hasOwn(VF.StoryGraph.choices,id)&&!out.choices[id]))].slice(0,Object.keys(VF.StoryGraph.choices).length):[];return out;};
 class StoryChoiceDirector{
  constructor(session){this.session=session;session.story=clean(session.story);}
  select(id,value){const def=Object.hasOwn(VF.StoryGraph.choices,id)?VF.StoryGraph.choices[id]:null,op=def?.options.find(o=>o.id===value);if(!op||def.preconditions.some(p=>!this.session.story.choices[p]))return false;this.session.story.choices[id]=value;this.session.story.skipped=this.session.story.skipped.filter(x=>x!==id);this.session.flush();return true;}
  skip(id){if(!Object.hasOwn(VF.StoryGraph.choices,id))return;delete this.session.story.choices[id];if(!this.session.story.skipped.includes(id))this.session.story.skipped.push(id);this.session.flush();}
  option(id){return Object.hasOwn(VF.StoryGraph.choices,id)?VF.StoryGraph.choices[id]?.options.find(o=>o.id===this.session.story.choices[id])||null:null;}
  restore(raw){const reading=this.session.story.reading;this.session.story=clean({version:1,...raw,reading});VF.Journey?.syncRoute(this.session);this.session.flush();}
  effects(){return Object.assign({},...Object.keys(this.session.story.choices).map(id=>this.option(id)?.stateEffects||{}));}
  state(){return{...this.session.story,choices:{...this.session.story.choices},skipped:[...this.session.story.skipped],effects:this.effects()};}
  reset(){const reading=this.session.story.reading;this.session.story=clean(null);this.session.story.reading=reading;}
 }
 const Base=VF.NarrativeDirector;
 class AdventureNarrative extends Base{
  frame(shot,t){const b=super.frame(shot,t),state=this.session.story||clean(null),def=VF.StoryGraph.choices[b.choiceId],chosen=def?.options.find(o=>o.id===state.choices[b.choiceId]);b.decisions={...state.choices};b.branch=chosen||null;b.choiceDefinition=def||null;
   if(b.kind==='result'){b.speaker=chosen?.speaker||'taupe';b.text=chosen?.resultDialogue||'Sin prisa. Seguimos juntos.';b.acting=chosen?.immediateAction||'rest-together';b.kind='speech';b.choiceResult=true;}
   if(b.branchLines)b.text=b.branchLines[chosen?.id]||b.neutralText||'';
   for(const [id,value]of Object.entries(state.choices)){const op=VF.StoryGraph.choices[id]?.options.find(o=>o.id===value),line=op?.futureDialogue?.[shot.id];if(line&&line.beatId===b.id&&!b.choiceResult){b.text=line.text;b.speaker=line.speaker||b.speaker;b.kind=b.speaker?'speech':b.kind;}}
   b.effects=Object.assign({},...Object.entries(state.choices).filter(([id])=>VF.content.shots.findIndex(s=>s.id===VF.StoryGraph.choices[id]?.chapter)<=VF.content.shots.findIndex(s=>s.id===shot.id)).map(([id,value])=>VF.StoryGraph.choices[id]?.options.find(o=>o.id===value)?.stateEffects||{}));
   return b;
  }
 }
 VF.StoryChoiceDirector=StoryChoiceDirector;VF.sanitizeStory=clean;VF.NarrativeDirector=AdventureNarrative;
})();
