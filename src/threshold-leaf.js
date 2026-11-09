/* One anchored vine leaf, two complete crossings into depth, one continuous handover. */
(() => {
 const {span,mix,ease}=VF.math;
 VF.ThresholdLeaf={
  pose(owner,shot,t,v,b,cast,leaf,lens){
   const list=VF.GuardianScript[shot.id],start=list.find(b=>b.id==='leaf-result').actionPlan.start,age=t-start,rosa=b.decisions?.['leaf-holder']==='rosa',holder=rosa?'pink':'taupe',visitor=rosa?'taupe':'pink',H=Math.min(v.frame.h*.65,v.frame.w*.61),initial={pink:{x:.18,z:.35},taupe:{x:.70,z:.05}},near={pink:{x:.18,z:.35},taupe:{x:.13,z:.35}},far={pink:{x:.42,z:.96},taupe:{x:.59,z:1.02}};
   const travellerStart=rosa?initial.taupe:{x:.69,z:.08};
   for(const id of ['pink','taupe']){
    let point={...initial[id],air:0,lift:22};
    if(!rosa&&age>=0){const dest=id==='taupe'?near.taupe:travellerStart;point=VF.WorldPath.sample(initial[id],dest,t,start+.10,start+1.70-(start+.10),2,18);}
    if(id===visitor&&age>=3.1)point=VF.WorldPath.sample(travellerStart,far[id],t,start+3.1,3.05,3,24);
    if(id===holder&&age>=7.7)point=VF.WorldPath.sample(near[id],far[id],t,start+7.7,3.3,3,24);
    Object.assign(cast[id],VF.WorldPath.actor(id,point,v,H));cast[id].head=id===visitor?-.10:.10;cast[id].lookX=id===holder?.7:-.7;
   }
   const carrier=cast[holder],friend=cast[visitor],lift=span(start+1.7,start+3.0,t),handover=span(start+6.15,start+7.60,t),attach=span(start+.8,start+1.75,t),side='right';
   carrier.arms.right={x:holder==='pink'?49:58,y:holder==='pink'?-155:-107};friend.arms.right={x:visitor==='pink'?49:58,y:visitor==='pink'?-155:-107};
   const pl=owner.plate(v,{set:'pergola',lens}),fixed=pl.point(.365,.67),root=pl.point(.16,.37),first=VF.Kinematics.localToWorld(carrier,carrier.arms.right,holder),second=VF.Kinematics.localToWorld(friend,friend.arms.right,visitor),q=ease(handover),grip={x:mix(mix(fixed.x,first.x,attach),second.x,q),y:mix(mix(fixed.y,first.y,attach),second.y,q)};
   Object.assign(leaf,{visible:1,held:age>=1.75,id:handover>=1?visitor:holder,holder:holder==='pink'?'rosa':'beige',side,open:lift,x:grip.x,y:grip.y,rootX:root.x,rootY:root.y,size:v.frame.w*.90,angle:mix(.02,-.98,lift),gripBlend:1,anchored:true,threshold:true,imageOffset:-.12});
   if(age>=1.75&&age<7.6)carrier.handsWorld={right:first};if(age>=7.6)friend.handsWorld={right:second};
   return{holder,visitor,progress:Math.max(0,age)/12.6,lift,handover,leafLayerDepth:.45,anchoredRoot:root,travellerReachedFar:cast[visitor].worldPosition.z>.9,bothReachedFar:Object.values(cast).every(a=>a.worldPosition.z>.9),drawn:false};
  },
  draw(p,s,v,t,reduced){if(s.threshold.drawn||s.leaf.visible<.001)return;s.threshold.drawn=true;const l=s.leaf;p.save();p.strokeStyle='#455634';p.lineWidth=5;p.beginPath();p.moveTo(l.rootX,l.rootY);p.bezierCurveTo(l.rootX-12,l.rootY+55,l.x-22,l.y-28,l.x,l.y);p.stroke();p.strokeStyle='#bfbd83';p.lineWidth=1.1;p.stroke();p.translate(l.x,l.y);p.rotate(l.angle);p.scale(1,1-.12*l.open);p.shadowColor='#10221d77';p.shadowBlur=9;p.shadowOffsetY=6;VF.Art.draw(p,'foliage',VF.Art.rects.foliage.leaf,l.size*l.imageOffset,-l.size*.96,l.size,l.size*1.05);p.restore();},
  actorLayer(p,a,s,v,t,reduced){if(s.threshold&&!s.threshold.drawn&&(a.worldPosition?.z||0)<s.threshold.leafLayerDepth)this.draw(p,s,v,t,reduced);}
 };
})();
