/* Original sparse voicing, synthesized locally. Silence is the initial state. */
(() => {
  class Sound {
    constructor(){this.ctx=null;this.enabled=false;this.allowed=true;this.voices=new Set();this.noteAt=0;this.step=0;this.file=null;this.chapter=0;this.volume=.45;this.master=null;this.generation=0;this.lastBeat=null;this.lastError=null;}
    reset(){this.enabled=false;this.allowed=false;this.generation++;this.step=0;this.noteAt=0;this.lastBeat=null;this.lastAction=null;this.actionAt=0;this.volume=.45;this.suspend().catch(()=>{});document.getElementById('volume').value='45';}
    setChapter(index){this.chapter=index;this.lastBeat=null;this.updateMix();}
    action(beat,position=.5){if(this.lastAction===beat)return;this.lastAction=beat;const now=this.ctx?.currentTime||0;if(now<(this.actionAt||0)+1.5)return;this.actionAt=now;const cue={'recognising-valerie':'touch','anticipating-jump':'paw',leaping:'paw',landing:'petal','returning-to-valerie':'touch','through-the-canopy':'fairy',greeting:'paw'}[beat];if(cue)this.cue(cue,position);}
    distance(progress){const band=Math.round(progress*10);if(this.distanceBand===band)return;this.distanceBand=band;this.updateMix();}
    updateMix(){const intensity=(this.chapter===11?.38:this.chapter===9?.48:this.chapter>=6?.60:.92)*(.91+.09*Math.sin((this.distanceBand||0)/10*Math.PI));if(this.master){const now=this.ctx.currentTime;this.master.gain.cancelScheduledValues(now);this.master.gain.setValueAtTime(this.master.gain.value,now);this.master.gain.setTargetAtTime(this.volume*intensity,now,.35);}if(this.file)this.file.volume=.28*this.volume;}
    setVolume(value){this.volume=Math.max(0,Math.min(1,value));this.updateMix();}
    score(scene,shot){const key=scene+':'+shot;if(key===this.lastBeat)return;this.lastBeat=key;const beat=window.VScore.get(scene)?.shots.find(s=>s.id===shot);if(beat?.cue)this.cue(beat.cue);}
    fallback(){this.file?.pause();this.file=null;this.lastError='La pista no pudo cargarse. Continúo con el ambiente original.';this.refreshTimer();document.dispatchEvent(new CustomEvent('valerie:audio-fallback',{detail:this.lastError}));}
    refreshTimer(){clearInterval(this.timer);this.timer=null;if(this.enabled&&this.allowed&&this.ctx?.state==='running'&&!this.file){this.tick(this.ctx.currentTime);this.timer=setInterval(()=>this.tick(this.ctx.currentTime),350);}}
    async toggle(){
      if(!this.ctx){this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=0;this.master.connect(this.ctx.destination);}this.generation++;
      this.enabled=!this.enabled;
      if(this.enabled&&this.allowed){await this.ctx.resume();if(window.VStory.audioFile){this.file??=new Audio(window.VStory.audioFile);this.file.loop=true;this.file.volume=.28*this.volume;this.file.onerror=()=>this.fallback();try{await this.file.play()}catch{this.fallback()}}}
      else await this.suspend();
      this.updateMix();this.refreshTimer();return this.enabled;
    }
    async suspend(){
      clearInterval(this.timer);this.timer=null;
      this.file?.pause();
      if(!this.ctx)return;
      const serial=this.generation;if(this.ctx.state==='running'&&this.master){const now=this.ctx.currentTime;this.master.gain.cancelScheduledValues(now);this.master.gain.setValueAtTime(this.master.gain.value,now);this.master.gain.linearRampToValueAtTime(0,now+.04);await new Promise(resolve=>setTimeout(resolve,45));if(this.generation!==serial||this.enabled&&this.allowed)return;}
      for(const voice of this.voices){try{voice.stop()}catch{}}
      this.voices.clear();
      await this.ctx.suspend();this.noteAt=0;
    }
    async setAllowed(value){this.generation++;this.allowed=value;if(!value)await this.suspend();else if(this.enabled){await this.ctx?.resume();this.updateMix();if(this.file)await this.file.play().catch(()=>this.fallback());}this.refreshTimer();}
    tone(hz,duration=2.8,volume=.018,pan=0,bright=false){
      if(!this.enabled||!this.allowed||this.file||this.ctx?.state!=='running'||this.voices.size>=8)return;
      const ctx=this.ctx,osc=ctx.createOscillator(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();
      osc.type='sine';osc.frequency.value=hz;
      filter.type='lowpass';filter.frequency.value=bright?1700:this.chapter>=6?620:900;
      gain.gain.setValueAtTime(0,ctx.currentTime);gain.gain.linearRampToValueAtTime(volume,ctx.currentTime+.16);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);
      const space=ctx.createStereoPanner?.();osc.connect(filter).connect(gain);if(space){space.pan.value=pan;gain.connect(space).connect(this.master)}else gain.connect(this.master);osc.start();osc.stop(ctx.currentTime+duration+.05);
      this.voices.add(osc);osc.onended=()=>{osc.disconnect();filter.disconnect();gain.disconnect();space?.disconnect();this.voices.delete(osc)};
    }
    tick(time){
      if(!this.enabled||!this.allowed||time<this.noteAt)return;
      const fields=[[146.83,220,293.66,329.63],[196,246.94,293.66,220],[164.81,246.94,329.63,293.66],[146.83,220,349.23,293.66],[196,293.66,392,329.63],[220,329.63,440,293.66]];
      const notes=fields[Math.min(this.chapter,5)],reading=this.chapter>=6;
      const note=notes[[0,1,2,3,1,0,2,1][this.step%8]];
      this.tone(note,reading?4.1:3.1,reading?.009:.014);
      if(this.step%4===0)this.tone(note/2,4.5,.008);
      this.step++;this.noteAt=time+(reading?3.1:2.1);
    }
    cue(kind,position=.5){
      const motifs={star:[440,659.25],paw:[293.66,392],fairy:[523.25,783.99],pigment:[349.23,523.25],wish:[392,587.33],petal:[329.63,493.88],ring:[587.33,880],cut:[220,329.63],touch:[440,659.25]},notes=motifs[kind]||motifs.touch,pan=(position-.5)*1.1;
      this.tone(notes[0],2.8,.010,pan,true);this.tone(notes[1],3.7,.005,-pan*.3,true);
    }
    state(){return{enabled:this.enabled,allowed:this.allowed,state:this.ctx?.state||'uninitialized',voices:this.voices.size,custom:!!this.file,volume:this.volume,lastError:this.lastError,independentClock:true};}
  }
  window.VSound=Sound;
})();
