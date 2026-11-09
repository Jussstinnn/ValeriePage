/* Manual editorial clock. History stores beat anchors; sessions contain no photo data. */
(() => {
 class NarrativeDirector{
  constructor(session){this.session=session;this.id=null;this.started=0;this.snap=false;this.from=0;this.currentTime=0;}
  beats(shot){return VF.GuardianScript[shot.id]||[{id:'silent',speaker:null,text:shot.line,acting:'watch',view:'original',close:'next'}];}
  record(shot){let r=this.session.narrative[shot.id];if(!r)r=this.session.narrative[shot.id]={beat:0,complete:false,elapsed:0};const list=this.beats(shot),named=list.findIndex(b=>b.id===r.beatId);if(named>=0)r.beat=named;r.beat=Math.max(0,Math.min(list.length-1,r.beat|0));const read=list.findIndex(b=>b.view==='read');if(shot.mode==='letter'&&!this.session.letter.complete&&r.beat>read)r.beat=read;r.beatId=list[r.beat].id;return r;}
  enter(shot,t,{replay=false,snap=false}={}){this.id=shot.id;let r=this.record(shot);if(replay){r.beat=0;r.beatId=this.beats(shot)[0].id;r.complete=false;r.elapsed=0;}else if(r.complete&&shot.mode==='memory'){r.beat=this.beats(shot).findIndex(b=>b.view==='photo');r.beatId=this.beats(shot)[r.beat].id;r.elapsed=5;}this.started=t-Math.min(120,r.elapsed||0);this.from=r.beat;this.snap=snap;this.currentTime=t;this.gain(shot);}
  gain(shot){const b=this.beats(shot)[this.record(shot).beat];if(b.gain&&!this.session.keeps.includes(b.gain))this.session.keeps.push(b.gain);}
  frame(shot,t){const r=this.record(shot),list=this.beats(shot),age=this.snap?5:Math.max(0,t-this.started);r.elapsed=Math.min(120,age);this.currentTime=t;return{...list[r.beat],text:shot.mode==='memory'&&list[r.beat].view==='photo'?(VF.PersonalNotes?.[shot.memory]||list[r.beat].text):list[r.beat].text,index:r.beat,total:list.length,age,blend:this.snap?1:VF.math.span(0,1.15,age),from:list[this.from]||list[r.beat],complete:r.complete,keeps:this.session.keeps.slice()};}
  move(shot,delta,t,snap=false){const r=this.record(shot),next=r.beat+delta;if(next<0)return false;if(next>=this.beats(shot).length){r.complete=true;this.session.flush();return false;}this.from=r.beat;r.beat=next;r.beatId=this.beats(shot)[next].id;r.elapsed=0;this.started=t;this.snap=snap;this.gain(shot);this.session.flush();return true;}
  anchor(shot){return{beat:this.record(shot).beat,beatId:this.record(shot).beatId};}
  restore(shot,anchor,t,snap=true){if(anchor?.beatId){const n=this.beats(shot).findIndex(b=>b.id===anchor.beatId);if(n>=0)anchor={...anchor,beat:n};}if(!anchor||!Number.isInteger(anchor.beat)||anchor.beat<0||anchor.beat>=this.beats(shot).length)return false;const r=this.record(shot);this.from=r.beat;r.beat=anchor.beat;r.beatId=this.beats(shot)[anchor.beat].id;this.started=t;this.snap=snap;this.gain(shot);return true;}
  resume(t){if(this.snap){this.started=t-5;this.snap=false;}}
  settle(){this.snap=true;}
  reset(){this.session.narrative={};this.session.keeps=[];this.id=null;}
  state(shot,t){return this.frame(shot,t);}
 }
 VF.NarrativeDirector=NarrativeDirector;
})();
