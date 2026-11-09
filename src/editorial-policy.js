/* F24 editorial contract. Story facts and protected content stay in their original modules. */
(() => {
 'use strict';
 const words=text=>(typeof text==='string'?text.trim().match(/\S+/g):null)||[];
 const finite=(value,fallback)=>Number.isFinite(value)?value:fallback;
 const overrides={
  'dos-miradas:loose-light':{minReadableDuration:5.8,actionCompletion:'light-caught',exitCue:'partner-catches-light',transitionKind:'follow-cast'},
  'dos-miradas:steady':{minReadableDuration:8,actionCompletion:'cast-settled',exitCue:'look-toward-leaf',transitionKind:'follow-cast'},
  'te-abro-el-camino:leaf-problem':{minReadableDuration:5.7,actionCompletion:'obstacle-noticed',exitCue:'offer-choice',transitionKind:'follow-cast'},
  'te-abro-el-camino:leaf-result':{minReadableDuration:6.6,actionCompletion:'canopy-crossed',exitCue:'cast-rejoined',transitionKind:'follow-cast'},
  'una-patita-mas:bank':{minReadableDuration:6.2,actionCompletion:'support-offered',exitCue:'prepare-hop',transitionKind:'follow-cast'},
  'una-patita-mas:cross':{minReadableDuration:5.4,actionCompletion:'both-paws-landed',exitCue:'land-and-settle',transitionKind:'follow-cast'},
  'una-patita-mas:landed':{minReadableDuration:5.5,actionCompletion:'cast-settled',exitCue:'look-back',transitionKind:'follow-cast'},
  'el-tiempo-de-los-dos:answer':{minReadableDuration:7.2,actionCompletion:'partner-rejoined',exitCue:'leaf-passes-camera',transitionKind:'leaf-occlusion'},
  'un-secreto-para-ti:sleeping':{minReadableDuration:6.2,actionCompletion:'gift-framed',exitCue:'notice-the-secret',transitionKind:'leaf-occlusion'},
  'un-secreto-para-ti:meaning':{minReadableDuration:7,actionCompletion:'cast-settled',exitCue:'return-to-path',transitionKind:'leaf-occlusion'},
  'tras-la-luz:follow':{minReadableDuration:8.2,actionCompletion:'both-arrive-at-threshold',exitCue:'enter-forest',transitionKind:'leaf-occlusion'},
  'el-bosque-escucha:glimmer':{minReadableDuration:6.2,actionCompletion:'forest-framed',exitCue:'forest-choice',transitionKind:'root-occlusion'},
  'el-jardin-despierta:bloom':{minReadableDuration:10.8,actionCompletion:'bouquet-grown',exitCue:'look-at-the-flowers',transitionKind:'petal-match'},
  'dentro-del-cuadro:silent':{minReadableDuration:8,actionCompletion:'portal-open',exitCue:'step-through-painting',transitionKind:'frame-match'}
 };
 function forBeat(shot={},beat={},context={}){
  const explicit=beat.playback&&typeof beat.playback==='object'?beat.playback:{},text=beat.text||'',punctuation=(text.match(/[.!?…]/g)||[]).length;
  const readable=text.trim()?Math.max(shot.engine==='journey'?3.8:5.4,2.8+words(text).length/2.2+Math.min(1,punctuation*.2)):1.15;
  const transitionKind=shot.mode==='painting'||shot.mode==='museum'?'frame-match':shot.mode==='garden'||shot.mode==='sky'?'petal-match':'leaf-occlusion';
  const p={autoplay:true,minReadableDuration:readable,minSettledDuration:.55,holdReason:null,actionCompletion:'cast-settled',exitCue:beat.departure?'leave-world':'next-voice',transitionKind,focusTarget:'#narration',...overrides[shot.id+':'+beat.id],...explicit};
  p.minReadableDuration=Math.max(beat.confirmationAlreadyRead?0:beat.kind==='silence'?0:readable,finite(p.minReadableDuration,readable));
  p.minSettledDuration=Math.max(0,Math.min(3,finite(p.minSettledDuration,.55)));
  // Protected moments are semantic, independent of mode, timers and legacy editorial flags.
  if(beat.kind==='choice')Object.assign(p,{autoplay:false,holdReason:'choice',actionCompletion:'explicit-choice-or-neutral',focusTarget:'#choice-options'});
  else if(beat.view==='photo'||beat.view==='read')Object.assign(p,{autoplay:false,holdReason:'reading',actionCompletion:beat.view==='read'?'reader-explicit-next':'photo-explicit-next',focusTarget:beat.view==='read'?'#letter-reading':'#story'});
  else if(beat.actionPending){p.holdReason='narrative-gesture';p.actionCompletion='explicit-world-action';p.focusTarget='#context-assist';}
  else if((['case','ceremony','finale','petal'].includes(shot.mode)&&!(explicit.autoplay===true&&['case','ceremony'].includes(shot.mode)))||['macro','question','homecoming','revealed','return'].includes(beat.view))Object.assign(p,{autoplay:false,holdReason:'reveal',actionCompletion:shot.mode==='ceremony'?'ceremony-progress-and-explicit-next':'explicit-next',focusTarget:beat.view==='question'?'#final-question':'#context-next'});
  else if(shot.id==='el-bosque-escucha'&&beat.choiceResult){
   const a=context.forest;
   p.actionCompletion='forest-'+(a?.phase||'discover');p.minSettledDuration=.75;p.focusTarget='#choice-action';
   if(!a||!['discover','shape','cross','rest'].includes(a.phase)){p.holdReason='forest-gesture';p.autoplay=true;}
   else if(['discover','shape'].includes(a.phase)&&!(a.progress?.[a.phase]>=.999999))p.holdReason='forest-gesture';
   else if(a.phase==='rest'){p.minReadableDuration=Math.max(p.minReadableDuration,8.0);p.exitCue='leave-open-forest';p.transitionKind='root-occlusion';}
  }
  else if(beat.choiceResult&&beat.acting==='join-stars'&&!beat.interaction){
   p.actionCompletion='constellation-connected';p.focusTarget='#choice-action';
   if(context.interactionComplete!==true&&(context.touched??context.branchAction?.touched??0)<5)p.holdReason='constellation-gesture';
  }
  else if(beat.choiceResult&&!beat.confirmationAlreadyRead){p.actionCompletion='branch-performance-complete';p.minReadableDuration=Math.max(p.minReadableDuration,6.2);}
  if(beat.departure){p.minReadableDuration=text.trim()?p.minReadableDuration:.75;p.exitCue='leave-world';}
  // Explicit holds may make another dedication protected, but never unprotect a reading or reveal.
  if(explicit.autoplay===false&&!p.holdReason){p.autoplay=false;p.holdReason=explicit.holdReason||'editorial';}
  return Object.freeze(p);
 }
 const actionComplete=(s,p)=>{
  if(s.actorAirborne===true||s.actorAirborne>0||s.actionReady===false||s.visualReady===false)return false;
  if(s.shot?.id==='el-bosque-escucha'&&s.beat?.choiceResult){const a=s.forest;if(!a)return false;if(['discover','shape'].includes(a.phase))return a.progress?.[a.phase]>=.999999;if(a.phase==='cross')return a.canContinue===true;return a.phase==='rest';}
  if(p.actionCompletion==='constellation-connected')return s.interactionComplete===true||(s.touched??s.branchAction?.touched??0)>=5;
  // An explicit producer owns physical completion. Older scenes without that producer
  // retain a conservative minimum action interval rather than claiming a new choreography.
  if(s.actionReady===true)return true;
  return finite(s.beat?.age,0)>=(s.beat?.choiceResult?4:0);
 };
 VF.PlaybackPolicy=Object.freeze({version:1,for:forBeat,actionComplete,overrides:Object.freeze(overrides)});
})();
