/* Measured work, not user-agent guesses. Conservative first profile on touch devices. */
(() => {
 const profiles={premium:{dpr:1.8,fps:30,engineFPS:24,raster:420,nodes:96,glyphs:1700},balanced:{dpr:1.35,fps:24,engineFPS:18,raster:320,nodes:60,glyphs:1100},battery:{dpr:1,fps:18,engineFPS:12,raster:240,nodes:36,glyphs:720}};
 class RenderBudget {
  constructor(){this.name=matchMedia('(pointer:coarse)').matches?'balanced':'premium';this.manual=false;this.samples=[];this.frames=0;this.lastChange=0;this.engineMs=0;this.compositorMs=0;this.publish();}
  publish(){window.VRuntimeProfile={name:this.name,...profiles[this.name]};}
  set(name,manual=false){if(!profiles[name])return;this.name=name;this.manual=manual;this.samples=[];this.publish();document.dispatchEvent(new CustomEvent('valerie:quality',{detail:this.name}));}
  cycle(){const names=Object.keys(profiles);this.set(names[(names.indexOf(this.name)+1)%3],true);}
  record(ms,engineMs){this.frames++;this.compositorMs=this.compositorMs*.9+ms*.1;this.engineMs=engineMs;if(this.manual)return;this.samples.push(ms+engineMs);if(this.samples.length<24)return;const a=this.samples.sort((x,y)=>x-y),p90=a[Math.floor(a.length*.9)];this.samples=[];if(p90>1000/profiles[this.name].fps*.82&&this.name!=='battery')this.set(this.name==='premium'?'balanced':'battery');}
  get profile(){return window.VRuntimeProfile;}
  state(){return{name:this.name,manual:this.manual,frames:this.frames,engineMs:this.engineMs,compositorMs:this.compositorMs,profile:this.profile};}
 }
 window.VRenderBudget=RenderBudget;
})();
