/* Focused anatomy polish of the existing illustrated direction.
   Original stuffed limbs, interior shoulder roots and tucked toes retain F2 control. */
(() => {
 const {canvas,clamp}=VF.math;
 class IllustratedAtlas {
  constructor(){this.parts=new Map();this.bytes=0;this.fibres=0;this.tracker=null;this.cleanup={};this.faceBuffers=new Map();this.faceUpdates=0;}
  addImage(key,img,source,box,options={}){
   const ratio=2,c=canvas(Math.ceil(box.w*ratio),Math.ceil(box.h*ratio)),p=c.getContext('2d');
   const sample=canvas(source[2],source[3]),sp=sample.getContext('2d');sp.drawImage(img,...source,0,0,sample.width,sample.height);
   const image=sp.getImageData(0,0,sample.width,sample.height),pixels=image.data,sw=sample.width,sh=sample.height,n=sw*sh,labels=new Int32Array(n),queue=new Int32Array(n);let serial=0,largest=0,largeCount=0,total=0;
   // Atlas cells have irregular silhouettes. Retain the principal connected part,
   // not neighbouring pieces whose rectangular bounds happen to overlap the cell.
   for(let i=0;i<n;i++)if(!labels[i]&&pixels[i*4+3]>32){const label=++serial;let head=0,tail=1;queue[0]=i;labels[i]=label;while(head<tail){const k=queue[head++],x=k%sw,y=(k/sw)|0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const xx=x+dx,yy=y+dy;if(xx<0||xx>=sw||yy<0||yy>=sh)continue;const at=yy*sw+xx;if(!labels[at]&&pixels[at*4+3]>32){labels[at]=label;queue[tail++]=at;}}}total+=tail;if(tail>largeCount){largeCount=tail;largest=label;}}
   let keep=new Uint8Array(n);for(let i=0;i<n;i++)if(labels[i]===largest)keep[i]=1;
   // Two-pixel fringe preserves the faint wisps without keeping disconnected atlas debris.
   for(let pass=0;pass<2;pass++){const next=keep.slice();for(let i=0;i<n;i++)if(keep[i]){const x=i%sw;if(x)next[i-1]=1;if(x<sw-1)next[i+1]=1;if(i>=sw)next[i-sw]=1;if(i<n-sw)next[i+sw]=1;}keep=next;}
   let sx=sw,sy=sh,ex=0,ey=0;for(let i=0;i<n;i++){if(!keep[i])pixels[i*4+3]=0;if(labels[i]===largest){const x=i%sw,y=(i/sw)|0;sx=Math.min(sx,x);sy=Math.min(sy,y);ex=Math.max(ex,x);ey=Math.max(ey,y);}}
   sp.putImageData(image,0,0);this.cleanup[key]={removedCorePixels:total-largeCount,retainedCorePixels:largeCount};
   sx=Math.max(0,sx-2);sy=Math.max(0,sy-2);ex=Math.min(sample.width,ex+3);ey=Math.min(sample.height,ey+3);
   if(options.upright){
    // Orient the actual cleaned ear along its textile axis before sizing it. Both
    // original ear cells remain distinct; the folded right ear keeps its own fold.
    let count=0,mx=0,my=0;for(let i=0;i<n;i++)if(labels[i]===largest){count++;mx+=i%sw;my+=(i/sw)|0;}mx/=count;my/=count;
    let xx=0,yy=0,xy=0;for(let i=0;i<n;i++)if(labels[i]===largest){const x=i%sw-mx,y=((i/sw)|0)-my;xx+=x*x;yy+=y*y;xy+=x*y;}
    let axis=.5*Math.atan2(2*xy,xx-yy);if(Math.sin(axis)<0)axis+=Math.PI;const angle=Math.PI/2-axis,size=Math.ceil(Math.hypot(sw,sh))+8,oriented=canvas(size,size),oq=oriented.getContext('2d');oq.translate(size/2,size/2);oq.rotate(angle);oq.drawImage(sample,-mx,-my);
    const rgba=oq.getImageData(0,0,size,size).data;let ax=size,ay=size,bx=0,by=0;for(let i=0;i<size*size;i++)if(rgba[i*4+3]>16){const x=i%size,y=(i/size)|0;ax=Math.min(ax,x);ay=Math.min(ay,y);bx=Math.max(bx,x);by=Math.max(by,y);}
    const scale=Math.min(c.width/(bx-ax+5),c.height/(by-ay+5)),dw=(bx-ax+5)*scale,dh=(by-ay+5)*scale;
    p.drawImage(oriented,ax-2,ay-2,bx-ax+5,by-ay+5,(c.width-dw)/2,c.height-dh,dw,dh);this.cleanup[key].axisRotation=angle;this.cleanup[key].sourceCell=source.slice();
   }else p.drawImage(sample,sx,sy,ex-sx,ey-sy,0,0,c.width,c.height);

   const data=p.getImageData(0,0,c.width,c.height).data;let x0=c.width,y0=c.height,x1=0,y1=0;
   for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(data[(y*c.width+x)*4+3]>32){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
   if(x1<=x0||y1<=y0)throw new Error('Pieza ilustrada vacía: '+key);
   const warm=canvas(c.width,c.height),g=warm.getContext('2d');g.drawImage(c,0,0);g.globalCompositeOperation='source-atop';g.fillStyle='#ffd4a122';g.fillRect(0,0,c.width,c.height);
   this.parts.set(key,{canvas:c,warm,box,ink:{x:box.x+x0/ratio,y:box.y+y0/ratio,w:(x1-x0+1)/ratio,h:(y1-y0+1)/ratio}});this.bytes+=c.width*c.height*8;
  }
  track(p,key,r){if(!this.tracker)return;const m=p.getTransform(),d=this.tracker.dpr,points=[[r.x,r.y],[r.x+r.w,r.y],[r.x,r.y+r.h],[r.x+r.w,r.y+r.h]].map(([x,y])=>({x:(m.a*x+m.c*y+m.e)/d,y:(m.b*x+m.d*y+m.f)/d})),rect={x:Math.min(...points.map(n=>n.x)),y:Math.min(...points.map(n=>n.y)),right:Math.max(...points.map(n=>n.x)),bottom:Math.max(...points.map(n=>n.y))};this.tracker.boxes.push(rect);if(key.endsWith('-head'))this.tracker.head=rect;if(key.includes('-ear-'))this.tracker.ears.push(rect);}
  draw(p,key,light=0){const a=this.parts.get(key),b=a.box;p.drawImage(a.canvas,b.x,b.y,b.w,b.h);this.track(p,key,a.ink);if(light>.03){p.save();p.globalAlpha=clamp(light)*.35;p.drawImage(a.warm,b.x,b.y,b.w,b.h);p.restore();}}
  strip(p,key,start,end){const a=this.parts.get(key),b=a.box,sy=a.canvas.height*start,sh=a.canvas.height*(end-start),y=b.y+b.h*start,h=b.h*(end-start);p.drawImage(a.canvas,0,sy,a.canvas.width,sh,b.x,y,b.w,h);this.track(p,key,{x:b.x,y,w:b.w,h});}
  head(p,id,pose,light){
   const blink=clamp(pose.blink||0),open=clamp(pose.eyeOpen??1,.2,1.12),key=id+'-head',part=this.parts.get(key),b=part.box;
   if(blink<.015&&Math.abs(open-1)<.015){this.draw(p,key,light);return;}
   const cacheKey=Math.round(blink*16)+':'+Math.round(open*40);let cache=this.faceBuffers.get(id);
   if(!cache){const c=canvas(part.canvas.width,part.canvas.height);cache={canvas:c,warm:canvas(c.width,c.height),key:null};this.faceBuffers.set(id,cache);}
   if(cache.key!==cacheKey){
    const q=cache.canvas.getContext('2d'),eyes=VF.CharacterModels[id].eyes,rx=id==='pink'?14:17,ry=20;
    q.setTransform(1,0,0,1,0,0);q.clearRect(0,0,cache.canvas.width,cache.canvas.height);q.scale(2,2);q.translate(-b.x,-b.y);
    q.save();q.beginPath();q.rect(b.x,b.y,b.w,b.h);for(const [ex,ey]of eyes)q.rect(ex-rx,ey-ry,rx*2,ry*2);q.clip('evenodd');q.drawImage(part.canvas,b.x,b.y,b.w,b.h);q.restore();
    const triangle=(source,dest)=>{const [a,bp,c]=source,[u,v,w]=dest,det=(bp.x-a.x)*(c.y-a.y)-(bp.y-a.y)*(c.x-a.x),aa=((v.x-u.x)*(c.y-a.y)-(w.x-u.x)*(bp.y-a.y))/det,cc=((w.x-u.x)*(bp.x-a.x)-(v.x-u.x)*(c.x-a.x))/det,bb=((v.y-u.y)*(c.y-a.y)-(w.y-u.y)*(bp.y-a.y))/det,dd=((w.y-u.y)*(bp.x-a.x)-(v.y-u.y)*(c.x-a.x))/det;
     q.save();q.beginPath();const center={x:(u.x+v.x+w.x)/3,y:(u.y+v.y+w.y)/3};for(const [i,z]of dest.entries()){const x=center.x+(z.x-center.x)*1.18,y=center.y+(z.y-center.y)*1.18;if(i)q.lineTo(x,y);else q.moveTo(x,y);}q.closePath();q.clip();q.transform(aa,bb,cc,dd,u.x-aa*a.x-cc*a.y,u.y-bb*a.x-dd*a.y);q.drawImage(part.canvas,b.x,b.y,b.w,b.h);q.restore();};
    for(const [ex,ey]of eyes){const warp=z=>{const nx=(z.x-ex)/rx,ny=(z.y-ey)/ry,weight=Math.max(0,1-nx*nx)**2*Math.max(0,1-ny*ny)**2;return{x:z.x,y:z.y+(z.y-ey)*((open-1)-blink*.94)*weight};};for(let row=0;row<8;row++)for(let col=0;col<6;col++){const x=ex-rx+col*rx/3,y=ey-ry+row*ry/4,dx=rx/3,dy=ry/4,a={x,y},bb={x:x+dx,y},c={x:x+dx,y:y+dy},d={x,y:y+dy};triangle([a,bb,c],[warp(a),warp(bb),warp(c)]);triangle([a,c,d],[warp(a),warp(c),warp(d)]);}}
    const warm=cache.warm.getContext('2d');warm.setTransform(1,0,0,1,0,0);warm.clearRect(0,0,cache.warm.width,cache.warm.height);warm.globalCompositeOperation='source-over';warm.drawImage(cache.canvas,0,0);warm.globalCompositeOperation='source-atop';warm.fillStyle='#ffd4a122';warm.fillRect(0,0,cache.warm.width,cache.warm.height);warm.globalCompositeOperation='source-over';
    cache.key=cacheKey;this.faceUpdates++;
   }
   p.drawImage(cache.canvas,b.x,b.y,b.w,b.h);if(light>.03){p.save();p.globalAlpha=clamp(light)*.35;p.drawImage(cache.warm,b.x,b.y,b.w,b.h);p.restore();}this.track(p,key,part.ink);
  }
 }
 class PlushRig {
  constructor({cached=true}={}){
   this.atlas=new IllustratedAtlas();if(cached&&VF.RigAssets?.ready())VF.RigAssets.fill(this.atlas);else VF.CharacterLibrary.bake(this.atlas);this.mittens={};
   for(const id of ['pink','taupe'])for(const side of ['left','right']){
    // A short stuffed limb, painted upper + the matching original rounded paw.
    // The paw blends into the same fur, rather than sitting on an elbow disk.
    const c=canvas(128,232),q=c.getContext('2d'),upper=this.atlas.parts.get(id+'-upper'),paw=this.atlas.parts.get(id+'-paw-'+side);q.scale(2,2);q.drawImage(upper.canvas,11,0,42,108);
    const tip=canvas(128,232),t=tip.getContext('2d');t.scale(2,2);t.drawImage(paw.canvas,10,64,44,46);t.globalCompositeOperation='destination-in';const mask=t.createLinearGradient(0,64,0,86);mask.addColorStop(0,'#0000');mask.addColorStop(.45,'#0008');mask.addColorStop(1,'#000');t.fillStyle=mask;t.fillRect(0,0,64,116);q.drawImage(tip,0,0,64,116);
    const warm=canvas(128,232),w=warm.getContext('2d');w.drawImage(c,0,0);w.globalCompositeOperation='source-atop';w.fillStyle='#ffd4a122';w.fillRect(0,0,128,232);
    const front=canvas(128,232),f=front.getContext('2d');f.drawImage(c,0,0);f.globalCompositeOperation='destination-in';const blend=f.createLinearGradient(0,56,0,132);blend.addColorStop(0,'#0000');blend.addColorStop(.40,'#0003');blend.addColorStop(.75,'#000c');blend.addColorStop(1,'#000');f.fillStyle=blend;f.fillRect(0,0,128,232);
    const frontWarm=canvas(128,232),fw=frontWarm.getContext('2d');fw.drawImage(front,0,0);fw.globalCompositeOperation='source-atop';fw.fillStyle='#ffd4a122';fw.fillRect(0,0,128,232);
    this.mittens[id+'-'+side]={back:c,warm,front,frontWarm};this.atlas.bytes+=128*232*4*4;
   }
   this.prepared={parts:this.atlas.parts.size,bytes:this.atlas.bytes,fibres:0,identity:'existing painted plush faces; compact stuffed bodies',assets:VF.Art.stats(),cleanup:this.atlas.cleanup,ocular:'localized painted-texture deformation',ocularUpdates:0,limbs:'original upper and side-specific paws; interior shoulders; no sleeve or thigh tubes'};
  }
  part(p,id,key,x,y,angle=0,sx=1,sy=1,light=0){p.save();p.translate(x,y);p.rotate(angle);p.scale(sx,sy);this.atlas.draw(p,id+'-'+key,light);p.restore();}
  armPlan(id,side,target){return VF.Kinematics.arm(id,side,target);}
  stuffedArm(p,id,side,plan,light,front=false){
   const mat=this.mittens[id+'-'+(side<0?'left':'right')],S=plan.origin,E=plan.end,len=Math.hypot(E.x-S.x,E.y-S.y),width=id==='pink'?.91:1.12;
   p.save();p.translate(S.x,S.y);p.rotate(Math.atan2(E.y-S.y,E.x-S.x)-Math.PI/2);p.scale(width,len/68);
   p.drawImage(front?mat.front:mat.back,-32,-20,64,116);if(light>.03){p.save();p.globalAlpha*=clamp(light)*.35;p.drawImage(front?mat.frontWarm:mat.warm,-32,-20,64,116);p.restore();}
   if(!front)this.atlas.track(p,id+'-stuffed-arm',{x:-23,y:-16,w:46,h:108});p.restore();
  }
  ear(p,id,side,pose,light){
   const m=VF.CharacterModels[id],root=m.earRoots[side<0?0:1],key=id+'-ear-'+(side<0?'left':'right');p.save();p.translate(...root);
   if(id==='pink'){p.rotate((side<0?-.18:.20)+clamp(side<0?pose.earL:pose.earR,-.5,.5)*.15);this.atlas.draw(p,key,light);}
   else{
    p.rotate(clamp((side<0?.025:-.025)+(side<0?pose.earL:pose.earR)*.31,-.19,.19));
    // Four continuous texture bands bend the heavy hanging tip, keeping its full length.
    const b=this.atlas.parts.get(key).box;
    for(let j=0;j<4;j++){p.save();const pivot=b.y+b.h*j/4;p.translate(0,pivot);p.rotate((pose.earTip||0)*.20*(j/3));p.translate(0,-pivot);this.atlas.strip(p,key,Math.max(0,j/4-.008),Math.min(1,(j+1)/4+.008));p.restore();}
   }p.restore();
  }
  draw(p,id,pose,{light,reduced,time,dpr=1}){
   const model=VF.CharacterModels[id],s=pose.s,b=model.envelope,breath=pose.breath||0,lit=clamp(1-Math.hypot(pose.x-light.x,pose.y-s*180-light.y)/320)*light.strength;
   const tracked=this.atlas.tracker={dpr,boxes:[],head:null,ears:[]};p.save();p.translate(pose.x,pose.y);p.scale(s,s);
   const body=VF.Kinematics.posture(id,pose),{lean,dy,sx:bodySX,sy:bodySY}=body;
   const feet={};for(const [name,side]of [['left',-1],['right',1]]){
    const foot=pose.feetWorld?.[name],x=foot?(foot.x-pose.x)/s:side*model.footX,y=foot?(foot.y-pose.y)/s:-7;
    // The pelvis is the original broad belly. Only the tucked toe emerges beneath
    // it; a rotated forearm is never used as a disconnected upper leg.
    if(foot?.space==='actor'){p.save();p.rotate(lean);p.translate(0,dy);p.scale(bodySX,bodySY);this.part(p,id,'foot',foot.local.x,foot.local.y,foot.angle,model.footWidth,.88,lit);p.restore();}else this.part(p,id,'foot',x,y,foot?.angle??side*.045,model.footWidth,.88,lit);feet[name]=foot?{...foot}:{x:pose.x+x*s,y:pose.y+y*s,contact:false};
   }
   p.rotate(lean);p.translate(0,dy);p.scale(bodySX,bodySY);
   const inverse=p.getTransform().inverse(),goal=(name,fallback)=>{const w=pose.handsWorld?.[name];return w?{x:inverse.a*w.x*dpr+inverse.c*w.y*dpr+inverse.e,y:inverse.b*w.x*dpr+inverse.d*w.y*dpr+inverse.f}:fallback;},arms=pose.arms,lp=this.armPlan(id,-1,goal('left',arms.left)),rp=this.armPlan(id,1,goal('right',arms.right));
   this.stuffedArm(p,id,-1,lp,lit);this.stuffedArm(p,id,1,rp,lit);
   p.save();p.translate(0,-60);p.scale(1+breath,1-breath);p.translate(0,60);this.atlas.draw(p,id+'-body',lit);p.restore();
   // Distal portions return in front through a soft root blend, not a circular joint.
   this.stuffedArm(p,id,-1,lp,lit,true);this.stuffedArm(p,id,1,rp,lit,true);
   const am=p.getTransform(),point=(m,n)=>({x:(m.a*n.x+m.c*n.y+m.e)/dpr,y:(m.b*n.x+m.d*n.y+m.f)/dpr}),hands={left:point(am,lp.end),right:point(am,rp.end)};
   p.save();p.translate(0,model.headPivot.y-breath*50);p.rotate((pose.head||0)*(id==='pink'?.50:.68)+(pose.lookX||0)*.008);p.scale(1-Math.abs(pose.turn||0)*(id==='pink'?.055:.09),1);p.translate((pose.turn||0)*5,-model.headPivot.y);
   this.ear(p,id,-1,pose,lit);this.ear(p,id,1,pose,lit);this.atlas.head(p,id,pose,lit);this.prepared.ocularUpdates=this.atlas.faceUpdates;
   // Black bead eyes and stitched muzzle are painted identity, never replaced by cartoon eyes.
   const hm=p.getTransform(),eyes=model.eyes.map(([x,y])=>point(hm,{x,y}));p.restore();p.restore();this.atlas.tracker=null;
   const rect=boxes=>{const r={x:Math.min(...boxes.map(n=>n.x)),y:Math.min(...boxes.map(n=>n.y)),right:Math.max(...boxes.map(n=>n.right)),bottom:Math.max(...boxes.map(n=>n.bottom))};r.w=r.right-r.x;r.h=r.bottom-r.y;return r;};
   return{id,body:{x:pose.x+b.x*s,y:pose.y+b.y*s,w:b.w*s,h:b.h*s},ink:rect(tracked.boxes),face:rect([tracked.head]),ears:rect(tracked.ears),eyes,hands,feet,native:pose};
  }
 }
 VF.PlushRig=PlushRig;
})();
