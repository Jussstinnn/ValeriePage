/* F23 action model. Rendering, narrative navigation and pointer hit testing stay outside.
   Session.actions is canonical; pointer capture is transient and never restored. */
(() => {
 const CHAPTER='el-bosque-escucha',PHASES=['discover','shape','cross','rest'],ROUTES=['firefly','tree','neutral'],CROSS_SECONDS=3.4,MAX_TRACE=64;
 const own=(o,k)=>!!o&&typeof o==='object'&&Object.hasOwn(o,k),finite=n=>typeof n==='number'&&Number.isFinite(n),clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n)),unit=(n,f=0)=>finite(n)?clamp(n):f;
 const point=(raw,fallback)=>({x:finite(raw?.x)?clamp(raw.x,.04,.96):fallback.x,y:finite(raw?.y)?clamp(raw.y,.04,.94):fallback.y});
 const copy=o=>JSON.parse(JSON.stringify(o));
 function record(raw){
  const fresh={version:1,route:'neutral',phase:'discover',phaseAge:0,progress:{discover:0,shape:0},light:{x:.70,y:.28},map:{x:.50,y:.54,openness:0},trace:[],revision:0};
  if(!raw||typeof raw!=='object'||![undefined,0,1].includes(raw.version))return fresh;
  if(ROUTES.includes(raw.route))fresh.route=raw.route;
  if(PHASES.includes(raw.phase))fresh.phase=raw.phase;
  fresh.phaseAge=finite(raw.phaseAge)?clamp(raw.phaseAge,0,120):0;
  fresh.progress.discover=unit(raw.progress?.discover);fresh.progress.shape=unit(raw.progress?.shape);
  const at=PHASES.indexOf(fresh.phase);if(at>0)fresh.progress.discover=1;if(at>1)fresh.progress.shape=1;if(at===3)fresh.phaseAge=Math.max(CROSS_SECONDS,fresh.phaseAge);
  fresh.light=point(raw.light,fresh.light);const map=point(raw.map,fresh.map);fresh.map={...map,openness:fresh.progress.shape};
  if(Array.isArray(raw.trace))fresh.trace=raw.trace.filter(p=>finite(p?.x)&&finite(p?.y)).slice(-MAX_TRACE).map(p=>point(p,{x:.5,y:.5}));
  fresh.revision=Number.isInteger(raw.revision)?clamp(raw.revision,0,1000000):0;
  return fresh;
 }
 function sanitize(raw){const out={version:1,chapters:{}};if(!raw||typeof raw!=='object'||![undefined,0,1].includes(raw.version))return out;if(own(raw.chapters,CHAPTER))out.chapters[CHAPTER]=record(raw.chapters[CHAPTER]);return out;}
 function canonical(r){return r&&r.version===1&&ROUTES.includes(r.route)&&PHASES.includes(r.phase)&&finite(r.phaseAge)&&r.phaseAge>=0&&r.phaseAge<=120&&finite(r.progress?.discover)&&r.progress.discover>=0&&r.progress.discover<=1&&finite(r.progress?.shape)&&r.progress.shape>=0&&r.progress.shape<=1&&finite(r.light?.x)&&r.light.x>=.04&&r.light.x<=.96&&finite(r.light?.y)&&r.light.y>=.04&&r.light.y<=.94&&finite(r.map?.x)&&r.map.x>=.04&&r.map.x<=.96&&finite(r.map?.y)&&r.map.y>=.04&&r.map.y<=.94&&r.map.openness===r.progress.shape&&Array.isArray(r.trace)&&r.trace.length<=MAX_TRACE&&r.trace.every(p=>finite(p?.x)&&p.x>=.04&&p.x<=.96&&finite(p?.y)&&p.y>=.04&&p.y<=.94)&&Number.isInteger(r.revision)&&r.revision>=0&&r.revision<=1000000;}
 const validId=id=>(typeof id==='string'&&id.length>0&&id.length<65)||(Number.isInteger(id)&&id>=0&&id<=0x7fffffff);
 class ForestAction{
  constructor(session){this.session=session;session.actions=sanitize(session.actions);this.pointer=null;this.ref=null;this.dirty=false;this.reduced=false;this._record();}
  _record(){let all=this.session.actions;if(!all||Array.isArray(all)||all.version!==1||!all.chapters||Array.isArray(all.chapters)||typeof all.chapters!=='object'){all=this.session.actions=sanitize(all);}if(!own(all.chapters,CHAPTER))all.chapters[CHAPTER]=record(null);let r=all.chapters[CHAPTER];if(!canonical(r))r=all.chapters[CHAPTER]=record(r);if(this.ref!==r){this.ref=r;this.pointer=null;}return r;}
  _touch(){const r=this._record();r.revision=(r.revision+1)%1000001;this.dirty=true;}
  commit(){if(this.dirty){try{this.session.flush?.();}catch{/* An unavailable store never invalidates the local scene. */}this.dirty=false;}return this.serialize();}
  bind(raw){this.pointer=null;if(raw!==undefined)this.session.actions=sanitize(raw);this.ref=null;this._record();return this.snapshot();}
  serialize(){return copy(this._record());}
  snapshot(){const r=this.serialize();return{...r,canContinue:this.canContinue(),interacting:!!this.pointer,gesture:this.pointer?.kind||null};}
  restore(raw){const next=record(raw);this.pointer=null;const all=this.session.actions=sanitize(this.session.actions);all.chapters[CHAPTER]=next;this.ref=next;this.dirty=true;this.commit();return this.snapshot();}
  select(route,{replay=false}={}){if(!ROUTES.includes(route))return false;if(this._record().route===route&&!replay)return false;this.reset(route);return true;}
  reset(route=this._record().route){const revision=(this._record().revision+1)%1000001,next=record({route:ROUTES.includes(route)?route:'neutral'});next.revision=revision;this.session.actions.chapters[CHAPTER]=next;this.ref=next;this.pointer=null;this.dirty=true;this.commit();return this.snapshot();}
  update(seconds,{paused=false,reduced=false}={}){const r=this._record();this.reduced=!!reduced;if(reduced&&r.phase==='cross')r.phaseAge=Math.max(CROSS_SECONDS,r.phaseAge);else if(!paused&&!reduced&&finite(seconds)&&seconds>0)r.phaseAge=clamp(r.phaseAge+Math.min(seconds,.25),0,120);return this.snapshot();}
  canContinue(){const r=this._record();return r.phase==='rest'||r.phase==='cross'&&r.phaseAge>=CROSS_SECONDS||['discover','shape'].includes(r.phase)&&r.progress[r.phase]>=.999999;}
  assist(){const r=this._record();this.pointer=null;if(r.phase==='cross')r.phaseAge=Math.max(CROSS_SECONDS,r.phaseAge);else if(r.phase!=='rest'){r.progress[r.phase]=1;r.map.openness=r.progress.shape;r.phaseAge=0;}this._touch();this.commit();return this.snapshot();}
  advance({force=false}={}){const r=this._record(),at=PHASES.indexOf(r.phase);if(at===3||!force&&!this.canContinue())return false;if(r.phase==='discover'||r.phase==='shape')r.progress[r.phase]=1;r.phase=PHASES[at+1];r.phaseAge=0;r.map.openness=r.progress.shape;this.pointer=null;this._touch();this.commit();return true;}
  retreat(){const r=this._record(),at=PHASES.indexOf(r.phase);if(!at)return false;r.phase=PHASES[at-1];r.phaseAge=0;this.pointer=null;this._touch();this.commit();return true;}
  _kind(kind,r){const expected=r.route==='tree'?(r.phase==='discover'?'listen':'map'):'guide',alias={world:expected,light:'guide',tree:'listen',guide:'guide',listen:'listen',map:'map'};return own(alias,kind)&&alias[kind]===expected?expected:null;}
  pointerStart(id,x,y,kind='world'){const r=this._record();if(this.pointer||!validId(id)||!finite(x)||!finite(y)||!['discover','shape'].includes(r.phase))return false;const resolved=this._kind(kind,r);if(!resolved)return false;const p=point({x,y},{x:.5,y:.5});this.pointer={id,kind:resolved,last:p,travel:0};if(resolved==='guide')r.light=p;else if(resolved==='map')r.map={...p,openness:r.progress.shape};this._trace(p);this._touch();return true;}
  _trace(p){const r=this._record(),last=r.trace.at(-1);if(!last||Math.hypot(p.x-last.x,p.y-last.y)>.007){r.trace.push({...p});if(r.trace.length>MAX_TRACE)r.trace.shift();}}
  pointerMove(id,x,y){const r=this._record(),capture=this.pointer;if(!capture||capture.id!==id||!['discover','shape'].includes(r.phase)||!finite(x)||!finite(y))return false;const p=point({x,y},capture.last),distance=Math.min(.15,Math.hypot(p.x-capture.last.x,p.y-capture.last.y));capture.travel+=distance;capture.last=p;if(capture.kind==='guide'){r.light=p;r.progress[r.phase]=clamp(r.progress[r.phase]+distance*1.9);r.map.openness=r.progress.shape;}else if(capture.kind==='map'){r.map={...p,openness:r.progress.shape};r.progress.shape=clamp(r.progress.shape+distance*2.6);r.map.openness=r.progress.shape;}this._trace(p);this._touch();return true;}
  pointerHold(id,seconds){const r=this._record();if(!this.pointer||this.pointer.id!==id||!['discover','shape'].includes(r.phase)||!finite(seconds)||seconds<=0)return false;const dt=Math.min(seconds,.25),rate=this.pointer.kind==='listen'?.56:this.pointer.kind==='guide'?.13:.10;r.progress[r.phase]=clamp(r.progress[r.phase]+dt*rate);r.map.openness=r.progress.shape;this._touch();return true;}
  pointerEnd(id){if(!this.pointer||this.pointer.id!==id)return false;this.pointer=null;this.commit();return true;}
  pointerCancel(id){if(!this.pointer||id!==undefined&&this.pointer.id!==id)return false;this.pointer=null;this.commit();return true;}
 }
 VF.sanitizeSceneActions=sanitize;VF.ForestAction=ForestAction;VF.ForestActionContract=Object.freeze({version:1,chapter:CHAPTER,phases:Object.freeze(PHASES.slice()),routes:Object.freeze(ROUTES.slice()),crossSeconds:CROSS_SECONDS,maxTrace:MAX_TRACE});
})();
