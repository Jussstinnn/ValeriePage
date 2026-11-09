/* F24: visibility and focus are real state. The HUD never owns story time or Canvas input. */
(() => {
 'use strict';
 const by=id=>document.getElementById(id),stateName=input=>typeof input==='string'?input:input?.state||'PLAYING';
 const setAvailable=(element,visible)=>{if(!element)return;element.hidden=!visible;element.inert=!visible;};
 function controlsFor(s){
  const state=stateName(s.playback),underlying=state==='PAUSED'?(s.playback?.underlyingState||state):state,manual=s.playback?.mode==='manual',blocked=!s.ready||s.transitioning||underlying==='TRANSITIONING';
  const choice=underlying==='AWAITING_CHOICE',interaction=underlying==='AWAITING_INTERACTION'&&!!s.assistAvailable;
  const protectedHold=['AWAITING_READING','AWAITING_REVEAL'].includes(underlying);
  return{next:!blocked&&!choice&&!interaction&&s.hasNext!==false&&(protectedHold||manual),assist:!blocked&&interaction&&!s.paused,hint:!blocked&&interaction&&!s.paused&&!!s.interactionHint,choice};
 }
 class CinematicHUD{
  constructor(){
   this.panel=by('controls');this.toggleButton=by('hud-toggle');this.closeButton=by('hud-close');this.context=by('contextual-action');this.next=by('context-next');this.assist=by('context-assist');this.sourceNext=by('next');this.sourceAssist=by('choice-action');
   this.visible=false;this.reason='immersed';this.lastPaused=false;this.hasReadyPause=false;this.snapshot={};this.closing=false;
   this.toggleButton?.addEventListener('click',()=>this.toggle());this.closeButton?.addEventListener('click',()=>this.close({explicit:true}));
   this.next?.addEventListener('click',e=>{if(this.next.disabled)return;if(!this.sourceNext.disabled)this.sourceNext.click();});
   this.assist?.addEventListener('click',()=>{if(!this.sourceAssist.disabled)this.sourceAssist.click();});
   this.onKey=e=>{if(e.key==='Escape'&&this.visible&&!by('chapter-dialog')?.open){e.preventDefault();this.close({explicit:true});}else if((e.key==='Escape'||e.key==='F10')&&!this.visible&&!by('chapter-dialog')?.open){e.preventDefault();this.open('keyboard');this.firstFocusable()?.focus({preventScroll:true});}};
   document.addEventListener('keydown',this.onKey);setAvailable(this.panel,false);setAvailable(this.context,false);this.renderExpanded();
  }
  firstFocusable(){return this.panel?.querySelector('button:not([disabled]):not([hidden])');}
  placeDecision(){if(this.visible&&this.panel){const h=this.panel.getBoundingClientRect().height;if(h>0)document.documentElement.style.setProperty('--hud-panel-height',Math.ceil(h)+'px');}}
  renderExpanded(){this.placeDecision();this.toggleButton?.setAttribute('aria-expanded',String(this.visible));this.toggleButton?.setAttribute('aria-label',this.visible?'Cerrar controles de la película':'Abrir controles de la película');const changed=document.body.dataset.hud!==String(this.visible);document.body.dataset.hud=String(this.visible);if(changed&&typeof CustomEvent==='function')document.dispatchEvent?.(new CustomEvent('vf-hud-change',{detail:{visible:this.visible}}));}
  open(reason='requested'){
   if(!this.snapshot.ready&&reason!=='keyboard')return false;
   this.reason=reason;if(!this.visible){this.visible=true;setAvailable(this.panel,true);this.panel.dataset.arrival='enter';}
   this.renderExpanded();this.renderContext();return true;
  }
  close({returnFocus=true,explicit=false}={}){
   const focused=this.panel?.contains(document.activeElement);
   if(focused&&!explicit)return false;
   if(!this.visible)return true;
   // Transfer focus before hiding a subtree. Hidden controls never remain active.
   if(focused||returnFocus&&explicit)this.toggleButton?.focus({preventScroll:true});
   this.visible=false;this.reason='immersed';setAvailable(this.panel,false);this.renderExpanded();this.renderContext();return true;
  }
  toggle(){return this.visible?this.close({explicit:true}):this.open('requested');}
  renderContext(){
   const s=this.snapshot,name=stateName(s.playback),policy=controlsFor({...s,assistAvailable:this.assistanceAvailable});
   const showNext=!this.visible&&policy.next&&(!s.requestOnly||s.playback?.policy?.holdReason==='reveal'),showAssist=!this.visible&&policy.assist;
   const priorFocus=document.activeElement,losesNext=priorFocus===this.next&&!showNext,losesAssist=priorFocus===this.assist&&!showAssist;
   if(losesNext||losesAssist){if(showNext)this.next.focus({preventScroll:true});else if(showAssist)this.assist.focus({preventScroll:true});else this.toggleButton.focus({preventScroll:true});}
   const label=s.nextLabel||'Continuar el camino';
   this.next.textContent=label;this.next.disabled=!!this.sourceNext?.disabled;this.assist.textContent=this.assistanceLabel||'Ayudarles';this.assist.disabled=!!this.sourceAssist?.disabled;
   const hint=by('interaction-hint'),showHint=!this.visible&&policy.hint;if(hint){hint.textContent=s.interactionHint||'';setAvailable(hint,showHint);}
   setAvailable(this.sourceNext,policy.next);setAvailable(this.next,showNext);setAvailable(this.assist,showAssist);setAvailable(this.context,showNext||showAssist||showHint);this.context.dataset.state=name;
   document.body.dataset.contextual=String(showNext||showAssist);document.body.dataset.playback=name;
  }
  update(snapshot={}){
   // Sample source assistance before removing its duplicate visual/focus target.
   const interaction=(snapshot.playback?.underlyingState||stateName(snapshot.playback))==='AWAITING_INTERACTION';this.assistanceAvailable=snapshot.assistAvailable??(interaction&&(!this.sourceAssist?.hidden||this.assistanceAvailable));this.assistanceLabel=this.sourceAssist?.textContent;
   this.snapshot={...snapshot};this.toggleButton.disabled=!snapshot.ready;const paused=!!snapshot.paused;
   if(paused&&snapshot.ready&&!this.hasReadyPause){this.open('pause');this.hasReadyPause=true;}if(!paused)this.hasReadyPause=false;this.lastPaused=paused;
   if(!snapshot.ready){if(this.panel?.contains(document.activeElement))this.toggleButton?.focus({preventScroll:true});this.visible=false;setAvailable(this.panel,false);}
   if(this.sourceAssist){if(document.activeElement===this.sourceAssist)this.toggleButton?.focus({preventScroll:true});setAvailable(this.sourceAssist,false);}
   this.renderExpanded();this.renderContext();return this.state();
  }
  state(){return{visible:this.visible,reason:this.reason,contextVisible:!!this.context&&!this.context.hidden,nextVisible:!!this.next&&!this.next.hidden,assistVisible:!!this.assist&&!this.assist.hidden,focused:document.activeElement?.id||null,inert:!!this.panel?.inert};}
  destroy(){document.removeEventListener('keydown',this.onKey);}
 }
 VF.CinematicHUD=CinematicHUD;
 VF.ControlPolicy=controlsFor;
})();
