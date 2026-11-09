/* Optional, short tactile punctuation. Unsupported browsers continue silently. */
(() => {
 class Haptics {
  constructor(){this.enabled=false;this.supported=typeof navigator.vibrate==='function';this.last=-Infinity;}
  toggle(){this.enabled=this.supported&&!this.enabled;if(!this.enabled&&this.supported)try{navigator.vibrate(0);}catch{}return this.enabled;}
  pulse(kind){const now=performance.now();if(!this.enabled||document.hidden||now-this.last<700)return;this.last=now;try{navigator.vibrate(kind==='ring'?[12,60,18]:kind==='petal'?9:14);}catch{this.enabled=false;}}
  reset(){this.enabled=false;if(this.supported)try{navigator.vibrate(0);}catch{}}
  state(){return{enabled:this.enabled,supported:this.supported};}
 }
 window.VHaptics=Haptics;
})();
