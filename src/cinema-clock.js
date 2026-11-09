/* F24 event-driven editorial FSM. The renderer owns the sole animation/timing loop.
   No timeout can navigate independently of physical completion, pause or protected content. */
(() => {
 'use strict';
 const STATES=Object.freeze(['PLAYING','TRANSITIONING','AWAITING_CHOICE','AWAITING_INTERACTION','AWAITING_READING','AWAITING_REVEAL','PAUSED']);
 const finite=(n,f=0)=>Number.isFinite(n)?n:f,clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
 class CinemaClock{
  constructor(read,advance,clock=()=>performance.now()){
   this.read=read;this.advance=advance;this.clock=clock;this.mode='cinema';this.key='';this.elapsed=0;this.settled=0;this.last=clock();this.timer=null;
   this.generation=0;this.inFlight=false;this.issuedKey=null;this.retryRemaining=0;this.failure=null;this.current=null;
  }
  keyFor(s){return s?.shot?.id&&s?.beat?.id?s.shot.id+':'+s.beat.id+(s.shot.id==='el-bosque-escucha'&&s.beat.choiceResult?':'+(s.forest?.phase||'discover'):''):'';}
  _policy(s){return VF.PlaybackPolicy.for(s?.shot,s?.beat,s);}
  _observe(){
   const s=this.read()||{},key=this.keyFor(s);
   if(key!==this.key){this.key=key;this.elapsed=0;this.settled=0;this.generation++;this.inFlight=false;this.issuedKey=null;this.retryRemaining=0;this.failure=null;}
   const policy=this._policy(s);let underlying='PLAYING';
   if(!s.ready||s.loading||s.transitioning||typeof s.transition==='number'&&s.transition<1||this.inFlight)underlying='TRANSITIONING';
   else if(policy.holdReason==='choice')underlying='AWAITING_CHOICE';
   else if(policy.holdReason==='reading')underlying='AWAITING_READING';
   else if(policy.holdReason==='reveal')underlying='AWAITING_REVEAL';
   else if(policy.holdReason||this.mode==='manual'||!policy.autoplay||this.failure)underlying='AWAITING_INTERACTION';
   const paused=!!(s.paused||s.hidden||s.dialog),state=paused?'PAUSED':underlying,complete=VF.PlaybackPolicy.actionComplete(s,policy);
   this.current={s,policy,state,underlying,complete};this.waiting=state!=='PLAYING';return this.current;
  }
  sync(){this.last=this.clock();return this._public(this._observe());}
  duration(beat){return this._policy({shot:this.read()?.shot,beat}).minReadableDuration;}
  eligible(s=this.read()){const p=this._policy(s);return this.mode==='cinema'&&p.autoplay&&!p.holdReason;}
  setMode(value){const mode=value==='manual'?'manual':'cinema';if(mode!==this.mode){this.mode=mode;this.invalidate();}return this.sync();}
  invalidate(){this.generation++;this.inFlight=false;this.issuedKey=null;this.retryRemaining=0;this.failure=null;this.last=this.clock();}
  restartTurn(){this.invalidate();this.elapsed=0;this.settled=0;return this.sync();}
  update(seconds){
   let observed=this._observe();const {state,underlying,policy,complete}=observed,dt=clamp(finite(seconds),0,.25);this.last=this.clock();
   if(state==='PAUSED'||underlying==='TRANSITIONING'||!observed.s.ready)return this._public(observed);
   if(this.retryRemaining>0)this.retryRemaining=Math.max(0,this.retryRemaining-dt);
   const readingMayAccrue=underlying==='PLAYING'||underlying==='AWAITING_INTERACTION'&&this.mode==='cinema'&&policy.autoplay;
   if(readingMayAccrue){this.elapsed=Math.min(3600,this.elapsed+dt);this.settled=complete?Math.min(60,this.settled+dt):0;}
   if(underlying==='PLAYING'&&this.mode==='cinema'&&policy.autoplay&&complete&&this.elapsed+1e-8>=policy.minReadableDuration&&this.settled+1e-8>=policy.minSettledDuration&&this.retryRemaining<=0&&this.issuedKey!==this.key)this._dispatch(observed);
   return this._public(this._observe());
  }
  _dispatch(observed){
   const key=this.key,token=++this.generation;this.inFlight=true;this.issuedKey=key;let result;
   try{result=this.advance({source:'cinema',key,policy:observed.policy});}catch(error){this._resolve(token,key,false,error);return;}
   if(result&&typeof result.then==='function')Promise.resolve(result).then(value=>this._resolve(token,key,value),error=>this._resolve(token,key,false,error));
   else this._resolve(token,key,result);
  }
  _resolve(token,key,value,error){
   if(token!==this.generation||key!==this.key)return;
   this.inFlight=false;
   if(value===false){this.issuedKey=null;this.retryRemaining=.5;this.failure=error?'continuation-error':'continuation-blocked';}
   this._observe();
  }
  // Compatibility for a caller that supplies a monotonic clock; never schedules itself.
  pump(){const now=this.clock(),dt=Math.max(0,(now-this.last)/1000);this.last=now;return this.update(dt);}
  needsFrames(){const c=this._observe();return this.mode==='cinema'&&c.state==='PLAYING'&&c.policy.autoplay&&this.issuedKey!==this.key;}
  capture(){this._observe();return{version:1,key:this.key,mode:this.mode,elapsed:clamp(this.elapsed,0,3600)};}
  restore(raw,{restoreMode=false}={}){
   this._observe();if(!raw||raw.version!==1||typeof raw.key!=='string'||raw.key!==this.key||!Number.isFinite(raw.elapsed)||raw.elapsed<0||raw.elapsed>3600)return false;
   this.invalidate();this.elapsed=raw.elapsed;this.settled=0;if(restoreMode&&['manual','cinema'].includes(raw.mode))this.mode=raw.mode;this.sync();return true;
  }
  _public(c){return{mode:this.mode,state:c.state,underlyingState:c.underlying,waiting:c.state!=='PLAYING',elapsed:this.elapsed,duration:c.policy.minReadableDuration,settled:this.settled,actionComplete:c.complete,canAdvance:c.state==='PLAYING'&&c.policy.autoplay&&c.complete&&this.elapsed>=c.policy.minReadableDuration&&this.settled>=c.policy.minSettledDuration,policy:{...c.policy},inFlight:this.inFlight,key:this.key,error:this.failure};}
  state(){return this._public(this._observe());}
 }
 VF.CinemaClock=CinemaClock;VF.PlaybackStates=STATES;
})();
