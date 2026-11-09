/* The companion leaves a route in the shared ground, not a reward overlay. */
(() => {
 const {ease,clamp,mix}=VMath,TAU=Math.PI*2;
 class LivingSequence {
  constructor(session){this.session=session;this.reactionAt=-100;this.stats={footprints:0,occluders:0};this.tints=new WeakMap();}
  react(index,time){if(index===2)this.reactionAt=time;}
  warm(source){if(this.tints.has(source))return this.tints.get(source);const c=document.createElement('canvas');c.width=source.width;c.height=source.height;const p=c.getContext('2d');p.drawImage(source,0,0);p.globalCompositeOperation='source-atop';p.fillStyle='#d9cd91';p.fillRect(0,0,c.width,c.height);this.tints.set(source,c);return c;}
  floor(p,{index,progress,time,w,h,direction,reduced}){
   if(index<0||index>2)return;const distance=index+progress,front=clamp((distance-1.12)/1.05);this.stats.footprints=0;p.save();
   for(let j=0;j<10;j++){const born=j/10;if(born>front)continue;const depth=1.8+born*2.6-(distance-1)*1.35;if(depth<.36)continue;const perspective=1/(depth+.4),x=w*.5+Math.sin(born*5.1)*w*.09*perspective+(j%2?1:-1)*w*.022*perspective,y=h*.33+perspective*h*.64,size=Math.min(46,26*perspective);p.globalAlpha=(.36+(this.session.has('paw')?.28:0))*ease((front-born)*8);p.drawImage(direction.icons.paw,x-size*.5,y-size*.5,size,size);this.stats.footprints++;}
   p.restore();
  }
  foreground(p,{index,progress,time,w,h,spatial,reduced,light}){
   if(index<0||index>2)return;const distance=index+progress,forest=ease((distance-1.3)/1.0),arrival=index===1?1-ease(progress/.22):index===2?1-ease(progress/.26):0,depart=index===1?ease((progress-.87)/.13):0;this.stats.occluders=2;p.save();
   const pulse=reduced?0:Math.max(0,Math.sin((time-this.reactionAt)*2.8))*Math.exp(-Math.max(0,time-this.reactionAt)*.7);
   for(const side of [-1,1]){const s=h*(.49+forest*.18),bend=(light?.x??.5)-.5,x=side<0?-s*.38:w-s*.24,y=h*.73+Math.sin(distance*1.4)*h*.08;const asset=spatial.foliage(forest>.4,false);p.globalAlpha=.70;p.drawImage(asset,x+bend*12,y-s*.55,s*.64,s);if(pulse>.01&&forest>.3){p.globalAlpha=pulse*.48;p.drawImage(this.warm(asset),x+bend*12,y-s*.55,s*.64,s);}}
   if(arrival+depart>.02){p.font='12px monospace';p.textAlign='center';p.fillStyle='#87a17f';for(let j=0;j<34;j++){const q=j/33,x=w*(.13+q*.75),y=h*(.66+.15*Math.sin(q*3.5))+(1-arrival-depart)*h*.17;p.globalAlpha=(arrival+depart)*.75;p.fillText(j%5?'/':':',x,y);}}
   p.restore();this.stats.reacting=pulse>.01;
  }
  state(){return{...this.stats};}
 }
 window.VLivingSequence=LivingSequence;
})();
