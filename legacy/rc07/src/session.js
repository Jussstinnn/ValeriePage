/* Versioned session state: small numeric staging snapshots, no photos or answers. */
(() => {
 const key='valerie.rc07.narrative',symbols=['star','paw','fairy','pigment','wish','petal'];
 const copy=value=>JSON.parse(JSON.stringify(value));
 class Session {
  constructor(){this.found=new Set();this.snapshots=new Map();this.events=new Map();this.light=null;this.memories=new Set();this.storage='memory';
   try{const d=JSON.parse(sessionStorage.getItem(key)||'{}');if(d.version===7){for(const s of d.discovered||[])if(symbols.includes(s))this.found.add(s);for(const [i,s]of Object.entries(d.chapters||{}))if(+i>=0&&+i<12&&this.validSnapshot(s))this.snapshots.set(+i,s);for(const [id,e]of Object.entries(d.events||{}))if(id.length<100&&typeof e==='object'&&e!==null)this.events.set(id,e);for(const i of d.memories||[])if([6,7,8].includes(i))this.memories.add(i);if(d.light&&Number.isFinite(d.light.x))this.light=d.light;}this.storage='session';}catch{}
  }
  validSnapshot(s){if(!s)return false;if(s.engineTime!==undefined&&(!Number.isFinite(s.engineTime)||s.engineTime<0||s.engineTime>86400))return false;if(s.ringAt!=null&&(!Number.isFinite(s.ringAt)||s.ringAt<0||s.ringAt>s.time))return false;if(s.storyProgress!==undefined&&(!Number.isFinite(s.storyProgress)||s.storyProgress<0||s.storyProgress>1))return false;if(s.letterScroll!==undefined&&(!Array.isArray(s.letterScroll)||s.letterScroll.length!==3||s.letterScroll.some(v=>!Number.isFinite(v)||v<0||v>1e7)))return false;if(s.direction&&(!Number.isFinite(s.direction.x)||!Number.isFinite(s.direction.y)))return false;return s&&Number.isFinite(s.time)&&s.time>=0&&s.time<86400&&(s.letterPage===undefined||[0,1,2].includes(s.letterPage))&&(s.selectedFlower==null||Number.isInteger(s.selectedFlower)&&s.selectedFlower>=0&&s.selectedFlower<14);}
  flush(){try{sessionStorage.setItem(key,JSON.stringify({version:7,discovered:[...this.found],chapters:Object.fromEntries(this.snapshots),events:Object.fromEntries(this.events),light:this.light,memories:[...this.memories]}));}catch{this.storage='memory';}}
  discover(id){if(!symbols.includes(id))return false;const fresh=!this.found.has(id);this.found.add(id);this.flush();return fresh;}
  remember(id,event={}){const fresh=!this.events.has(id);this.events.set(id,{...event});this.flush();return fresh;}
  getSnapshot(index){const s=this.snapshots.get(index);return s?copy(s):null;}
  saveSnapshot(index,snapshot){if(this.validSnapshot(snapshot)){this.snapshots.set(index,copy(snapshot));this.flush();}}
  replay(index){this.snapshots.delete(index);const prefix=window.VStory.chapters[index]?.id+':';for(const key of this.events.keys())if(key.startsWith(prefix))this.events.delete(key);this.flush();}
  visitMemory(index){if(this.memories.has(index))return;this.memories.add(index);this.flush();}
  reset(){this.found.clear();this.snapshots.clear();this.events.clear();this.memories.clear();this.light=null;try{sessionStorage.removeItem(key)}catch{}}
  has(id){return this.found.has(id);}
  state(){return{version:7,discovered:[...this.found],storage:this.storage,chapters:[...this.snapshots.keys()],events:[...this.events.keys()],memories:[...this.memories]};}
 }
 window.VSession=Session;
})();
