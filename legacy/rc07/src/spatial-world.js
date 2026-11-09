/* Shared world-space geometry, cached ASCII foliage, and a bounded neighbour stage. */
(() => {
 const {clamp,ease,mix}=VMath,TAU=Math.PI*2;
 class SpatialWorld {
  constructor(){this.surface=new VSurfaceBlend();this.cache=new Map();this.nodes=[];this.atlas=new Map();this.warm=null;this.generation=0;this.drawCalls=0;this.phase=null;this.blend=null;this.layer=null;
   for(let j=0;j<120;j++)this.nodes.push({x:(j%2?1:-1)*(1.1+(j%7)*.42),z:1.3+(j/2|0)*.19,seed:j,scale:.7+(j%5)*.12});
  }
  foliage(forest,far){const key=(forest?'tree':'vine')+far;if(this.atlas.has(key))return this.atlas.get(key);const c=document.createElement('canvas');c.width=192;c.height=300;const p=c.getContext('2d');p.font='9px monospace';p.textAlign='center';const ink=far?'#355956':'#78957a';p.fillStyle=ink;
   const branch=(x,y,len,a,depth)=>{p.save();p.translate(x,y);p.rotate(a);for(let j=0;j<24;j++){const q=j/23;p.fillText(j%4?':':'|',Math.sin(q*2)*4,-q*len);if(j%3===0)for(let k=1;k<6;k++)p.fillText(k%2?'/':',',(j%2?1:-1)*k*4,-q*len-k*2);}if(depth>0){branch(0,-len*.45,len*.57,-.64,depth-1);branch(0,-len*.74,len*.44,.67,depth-1);}p.restore();};
   branch(96,288,forest?173:105,0,forest?2:1);if(!forest){for(let j=0;j<20;j++){const a=j*2.4;p.fillStyle=j%3?'#a09880':'#bba7aa';p.fillText('o',96+Math.cos(a)*34,192+Math.sin(a)*25);}}
   this.atlas.set(key,c);return c;
  }
  background(p,index,progress,t,w,h,reduced){
   if(index>2)return;const distance=index+progress,forest=ease((distance-1.35)/.9),horizon=h*mix(.23,.39,ease(distance/2.4)),travel=distance*2.3;
   p.save();p.textAlign='center';p.font='10px monospace';
   // Paths and row positions use perspective, with the same vanishing point across scene boundaries.
   for(let j=0;j<45;j++){const z=1+j*.15,d=1/(z+.2),y=horizon+d*h*.62,x=w*.5+Math.sin(z*.6+distance)*w*.04;p.globalAlpha=.18+d*.55;p.fillStyle=forest>.5?'#9eaa82':'#c1ab85';p.fillText(j%3?':':'·',x,y);for(const side of [-1,1])p.fillText(':',x+side*d*w*.18,y);}
   const count=VRuntimeProfile?.nodes||60;const ordered=this.nodes.slice(0,count).map(n=>{let z=(n.z-travel)%10;if(z<.5)z+=10;return{...n,z};}).sort((a,b)=>b.z-a.z);
   for(const n of ordered){const scale=1/(n.z+.6),x=w*.5+n.x*w*.32*scale,y=horizon+h*.70*scale,size=h*scale*n.scale*(.74+forest*.30);const sway=reduced?0:Math.sin(t*.35+n.seed)*size*.012;const alpha=.32+scale*.6;p.globalAlpha=alpha*(1-forest);p.drawImage(this.foliage(false,n.z>4),x-size*.32+sway,y-size,size*.64,size);p.globalAlpha=alpha*forest;p.drawImage(this.foliage(true,n.z>4),x-size*.32+sway,y-size,size*.64,size);this.drawCalls+=2;}
   // A near canopy is an independent occluder, with a much larger travel baseline than distant rows.
   for(let side of [-1,1]){const s=h*(.8+forest*.3),y=h*.79+Math.sin(distance*1.7)*h*.15;p.globalAlpha=.66;p.drawImage(this.foliage(forest>.5,false),side<0?-s*.46:w-s*.18,y-s,s*.64,s);}
   p.restore();this.phase=forest>.5?'forest-path':index===1?'footprint-path':'vineyard-depth';
  }
  remember(i,source,shot){if(!source)return;const scale=Math.min(1,600/source.width),c=document.createElement('canvas');c.width=Math.round(source.width*scale);c.height=Math.round(source.height*scale);c.getContext('2d').drawImage(source,0,0,c.width,c.height);this.cache.delete(i);this.cache.set(i,{canvas:c,shot:{...shot},index:i});while(this.cache.size>3)this.cache.delete(this.cache.keys().next().value);}
  preview(i,p,w,h){const desired=i<8&&p>.72?i+1:i>0&&i<9&&p<.18?i-1:-1;if(desired<0){if(this.warm){this.warm.engine.dispose();this.warm=null;this.generation++;}return;}if(this.cache.has(desired)){if(this.warm?.index!==desired)this.cancel();return;}if(this.warm?.index===desired)return;this.cancel();const gen=++this.generation,engine=new VEngine(VStory.chapters[desired]);const warm=this.warm={index:desired,engine,ready:false};engine.prepare(w,h).then(()=>{if(gen!==this.generation)return engine.dispose();engine.setProfile(VRuntimeProfile);if(desired===1)engine.api.direct?.(.7,.3,0,'listen');engine.seek(desired===1?4.5:desired===2?6.7:desired===5?3.4:Math.max(4,VStory.chapters[desired].focus));engine.pause();const lens=desired===1?VShotPlan.rabbit(0,engine.state()):VShotPlan.sample(VStory.chapters[desired].id,0);warm.shot=lens?{x:clamp(lens.cx-lens.w/2,0,1-lens.w),y:clamp(lens.cy-lens.h/2,0,1-lens.h),w:lens.w,h:lens.h}:{x:0,y:0,w:1,h:1};warm.ready=true;}).catch(()=>{engine.dispose();if(this.warm===warm)this.warm=null;});}
  cancel(){this.generation++;if(this.warm)this.warm.engine.dispose();this.warm=null;}
  take(i){if(this.warm?.index===i&&this.warm.ready){const engine=this.warm.engine;this.warm=null;this.generation++;return engine;}this.cancel();return null;}
  neighbour(i){if(this.warm?.index===i&&this.warm.ready)return{index:i,canvas:this.warm.engine.canvas,shot:this.warm.shot};return this.cache.get(i);}
  compose(p,{index,progress,source,shot,field,place,reduced,light}){
   let from=null,to=null,q=0;
   if(!reduced&&index<8&&progress>.78&&(to=this.neighbour(index+1))){from={canvas:source,shot,index};q=(progress-.78)/.44;}
   else if(!reduced&&index>0&&index<9&&progress<.22&&(from=this.neighbour(index-1))){to={canvas:source,shot,index};q=(progress+.22)/.44;}
   const paint=(asset,transform=false)=>{const r=place(asset.canvas,field,asset.shot);if(!r)return null;const scale=transform?1+q*.56:1,x=r.x-(scale-1)*r.w*.5,y=r.y+(transform?q*r.h*.18:0)-(scale-1)*r.h*.5,w=r.w*scale,h=r.h*scale;p.save();const softened=this.surface.get(asset.canvas,asset.shot,asset.index??index,asset.canvas===source?light:null);p.globalCompositeOperation='lighten';if(softened)p.drawImage(softened,x,y,w,h);else p.drawImage(asset.canvas,(asset.shot.x||0)*asset.canvas.width,(asset.shot.y||0)*asset.canvas.height,asset.shot.w*asset.canvas.width,asset.shot.h*asset.canvas.height,x,y,w,h);p.restore();return{x,y,w,h};};
   if(!from||!to){this.blend=null;return paint({canvas:source,shot,index});}
   q=clamp(q);const cx=field.x+field.w*.54,cy=field.y+field.h*.64,r=Math.max(.1,Math.hypot(field.w,field.h)*ease(q)),outgoing=index-(progress<.22?1:0);
   const reveal=()=>{if(outgoing===1){p.moveTo(cx-r*.5,cy-r);p.bezierCurveTo(cx+r*.9,cy-r,cx+r*.30,cy+r,cx+r*.55,cy+r);p.bezierCurveTo(cx-r*.85,cy+r,cx-r*.25,cy-r,cx-r*.5,cy-r);p.closePath();}else if(outgoing===2||outgoing===5){p.moveTo(cx,cy-r);p.bezierCurveTo(cx+r*1.05,cy-r*.25,cx+r*.75,cy+r*.5,cx,cy+r);p.bezierCurveTo(cx-r*.75,cy+r*.5,cx-r*1.05,cy-r*.25,cx,cy-r);p.closePath();}else if(outgoing>=6){p.moveTo(cx-r,cy-r*.75);p.lineTo(cx+r,cy-r*1.1);p.lineTo(cx+r,cy+r*.75);p.lineTo(cx-r,cy+r*1.1);p.closePath();}else p.ellipse(cx,cy,r*.70,r,0,0,TAU);};
   p.save();p.beginPath();p.rect(field.x-100,field.y-100,field.w+200,field.h+200);reveal();p.clip('evenodd');const old=paint(from,true);p.restore();p.save();p.beginPath();reveal();p.clip();const next=paint(to);p.restore();
   this.blend={from:index-(progress<.22?1:0),to:index+(progress>.78?1:0),progress:q,reversible:true};return progress>.78?old:next;
  }
  reset(){this.cancel();this.cache.clear();this.blend=null;}
  state(){return{surface:{...this.surface.stats},phase:this.phase,drawCalls:this.drawCalls,cached:[...this.cache.keys()],warm:this.warm?{index:this.warm.index,ready:this.warm.ready}:null,blend:this.blend,atlas:this.atlas.size};}
 }
 window.VSpatialWorld=SpatialWorld;
})();
