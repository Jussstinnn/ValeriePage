/* Native distance, living time and event time share one score, never one clock. */
(() => {
 const clamp=v=>Math.max(0,Math.min(1,v));
 class Journey {
  constructor({request,change,state,policy}){
   this.policy=policy;this.request=request;this.change=change;this.inspect=state;this.active=false;this.mode='explore';this.index=0;this.progress=0;this.worldTime=0;this.eventTime=0;this.generation=0;this.pending=null;this.frame=0;this.lastInput=0;
   this.lengths=[1.35,1.8,1.5,1.65,1.35,1.8,1.15,1.15,1.15,1,1.8,1.8];
   this.track=document.createElement('div');this.track.id='journey-track';this.track.setAttribute('aria-hidden','true');document.body.append(this.track);
   this.sections=VStory.chapters.map((c,i)=>{const s=document.createElement('div');s.dataset.world=c.id;s.style.height=this.lengths[i]*100+'svh';this.track.append(s);return s;});
   this.resize();
   addEventListener('scroll',()=>{if(!this.active)return;if(!this.frame)this.frame=requestAnimationFrame(()=>{this.frame=0;this.read();});},{passive:true});
   addEventListener('wheel',()=>{this.lastInput=performance.now();},{passive:true});
   addEventListener('pointermove',e=>{if(e.pointerType==='touch'||e.buttons)this.lastInput=performance.now();},{passive:true});
   addEventListener('keydown',e=>{if(['PageDown','PageUp','ArrowDown','ArrowUp','Home','End'].includes(e.key))this.lastInput=performance.now();});
   addEventListener('resize',()=>{const w=innerWidth,h=innerHeight;if(this.viewport&&Math.abs(w-this.viewport.w)<2&&Math.abs(h-this.viewport.h)<160)return;const i=this.index,p=this.progress;this.resize();if(this.active)this.align(i,p);},{passive:true});
   addEventListener('hashchange',()=>this.route());addEventListener('popstate',()=>this.route());
   addEventListener('pagehide',()=>this.persist());
   document.addEventListener('pointerdown',()=>{this.lastInput=performance.now();},{passive:true});
   this.track.hidden=true;
  }
  resize(){const h=Math.max(240,document.documentElement.clientHeight||innerHeight);this.viewport={w:innerWidth,h:innerHeight};this.offsets=[0];for(const n of this.lengths)this.offsets.push(this.offsets.at(-1)+Math.round(n*h));this.track.style.paddingBottom='0px';for(let i=0;i<12;i++)this.sections[i].style.height=(this.offsets[i+1]-this.offsets[i])+'px';this.updateLimit();}
  updateLimit(){const limit=this.policy.limit();this.track.style.height=(this.offsets[limit+1]+this.viewport.h-1)+'px';this.track.style.overflow='hidden';}
  activate(){this.active=true;this.track.hidden=false;document.body.dataset.journey='true';this.resize();}
  align(i,p=0){if(!this.active)this.activate();i=this.policy.resolve(i).index;if(i<0)return;this.index=i;this.progress=this.policy.progress(i,clamp(p));this.updateLimit();this.pending=null;const y=this.offsets[i]+(this.offsets[i+1]-this.offsets[i])*this.progress;scrollTo({top:y,behavior:'instant'});this.persist();}
  read(){
   if(!this.active)return;
   const y=scrollY;let i=0;while(i<11&&y>=this.offsets[i+1])i++;
   const choice=this.policy.resolve(i);if(choice.index!==i){this.align(choice.index,.99);i=choice.index;}this.index=i;this.progress=clamp((Math.min(scrollY,this.offsets[i+1]-1)-this.offsets[i])/(this.offsets[i+1]-this.offsets[i]));
   const s=this.inspect();if(i!==s.index&&this.pending!==i){this.pending=i;++this.generation;Promise.resolve(this.request(i)).finally(()=>{if(this.pending===i)this.pending=null;});}
   if(this.policy.progress(i,this.progress)<this.progress)this.align(i,this.policy.progress(i,this.progress));this.change();this.persist();
  }
  route(){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{this.request(this.inspect().index);return;}const i=VStory.chapters.findIndex(c=>c.id===id);if(i<0){this.request(this.inspect().index);return;}this.request(i);}
  entered(i,fromScroll,progress=0){if(!fromScroll)this.align(i,progress);else{this.active=true;this.track.hidden=false;document.body.dataset.journey='true';}this.pending=null;}
  reset(){this.mode='explore';this.index=0;this.progress=0;this.worldTime=this.eventTime=0;this.eventKind=null;this.generation++;this.pending=null;this.exit();this.updateLimit();}
  event(kind){this.eventKind=kind;this.eventTime=0;}
  step(dt,{paused,busy,reduced}){if(paused||busy)return;this.worldTime+=dt;if(this.eventKind)this.eventTime+=dt;if(this.mode==='guided'&&!reduced&&this.index<9&&performance.now()-this.lastInput>1500){const c=VStory.chapters[this.index],duration=Math.max(19,c.duration||22,c.editorial?.minSeconds||0),distance=this.offsets[this.index+1]-this.offsets[this.index],hold=c.editorial?.autoAdvance===false,ceiling=this.offsets[this.index]+distance*.96;if(hold&&scrollY>=ceiling)return;const next=scrollY+dt*distance/duration;scrollTo({top:hold?Math.min(ceiling,next):next,behavior:'instant'});}}
  toggle(){this.mode=this.mode==='explore'?'guided':'explore';this.lastInput=performance.now();return this.mode;}
  exit(){if(this.frame)cancelAnimationFrame(this.frame);this.frame=0;this.active=false;this.track.hidden=true;document.body.dataset.journey='false';scrollTo({top:0,behavior:'instant'});this.persist();}
  persist(){try{if(!this.active){sessionStorage.removeItem('valerie.rc07.journey');return;}sessionStorage.setItem('valerie.rc07.journey',JSON.stringify({index:this.index,progress:this.progress,mode:this.mode}));}catch{}}
  restore(){try{const d=JSON.parse(sessionStorage.getItem('valerie.rc07.journey')||'null');if(d&&Number.isInteger(d.index)&&d.index>=0&&d.index<12){this.align(d.index,Number.isFinite(d.progress)?d.progress:0);return d.index;}}catch{}return-1;}
  state(){return{mode:this.mode,story:{index:this.index,progress:this.progress},worldTime:this.worldTime,event:{kind:this.eventKind||null,time:this.eventTime},generation:this.generation,active:this.active};}
 }
 window.VJourney=Journey;
})();
