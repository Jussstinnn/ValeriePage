/* Three intentional actions: brush, loosen, then lift-and-clean together. Idle never digs. */
(() => {
 const clamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
 class GardenDig{
  constructor(raw,earned=false){this.restore(raw,earned);}
  restore(raw,earned=false){this.phase=earned?4:raw?.version===2?[0,1,2,4].includes(raw.phase)?raw.phase:0:raw?.version===1?raw.cycles>=8?4:raw.cycles>=5?2:raw.cycles>=3?1:0:0;this.work=raw?.version===2?clamp(raw.work):0;this.cycles=this.phase===4?3:this.phase;this.strokes=(raw?.version===2&&Array.isArray(raw.strokes)?raw.strokes:[]).filter(a=>Number.isFinite(a.x)&&Number.isFinite(a.y)).slice(-48).map(a=>({x:clamp(a.x),y:clamp(a.y)}));this.active=null;this.feedback=0;this.strokeAge=0;this.liftDistance=0;return this;}
  reset(){return this.restore(null);}
  start(){if(this.phase===4||this.active)return false;this.active={age:0,phase:this.phase,actor:this.phase===1?'taupe':'pink',duration:this.phase===2?3.2:this.phase===1?1.9:1.7,from:this.work};this.feedback=1;return true;}
  stroke(x,y,distance,up=0){if(this.active||this.phase===4)return false;this.feedback=1;this.strokeAge=0;if(this.phase===2){this.liftDistance+=Math.max(0,up)+Math.max(0,distance)*.45;if(this.liftDistance>=55)return this.start();return false;}const step=Math.min(32,Math.max(0,distance))/(this.phase===0?180:125);this.work=clamp(this.work+step);this.strokes.push({x:clamp(x),y:clamp(y)});if(this.strokes.length>48)this.strokes.shift();if(this.work>=1)this.finish();return true;}
  finish(){this.phase=this.phase===2?4:this.phase+1;this.cycles=this.phase===4?3:this.phase;this.work=0;this.active=null;}
  update(dt,{paused=false}={}){if(paused)return;dt=Math.max(0,Math.min(.08,dt));this.feedback=Math.max(0,this.feedback-dt*.9);this.strokeAge+=dt;if(!this.active)return;this.active.age+=dt;this.work=clamp(this.active.from+(1-this.active.from)*this.active.age/this.active.duration);if(this.work>=1)this.finish();}
  serialize(){return{version:2,phase:this.phase,work:this.active?this.active.from:this.work,strokes:this.strokes.slice(-48)};}
  snapshot(){const q=this.work,phase=this.phase===2&&q>.55?3:this.phase,stage=phase===3?(q-.55)/.45:this.phase===2?q/.55:q,active=this.active?{...this.active,actor:this.phase===0?(q<.55?'pink':'taupe'):this.phase===1?'taupe':q<.55?'taupe':'pink'}:this.feedback>0&&this.phase<2?{age:this.strokeAge,phase:this.phase,actor:this.phase===0?(q<.55?'pink':'taupe'):'taupe',stroke:true,duration:.7}:null;return{...this.serialize(),phase,cycles:this.cycles,phaseName:['uncover','loosen','lift','clean','safe'][phase],label:['Apartar la tierra','Aflojar las raíces','Levantar y limpiar','Limpiar con Fresita','Recuerdo a salvo'][phase],active,stageProgress:clamp(stage),progress:this.phase===4?1:(this.phase+q)/3,ready:this.phase===4,feedback:this.feedback};}
 }
 VF.GardenDig=GardenDig;
})();
