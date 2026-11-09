/* World-space paths for the acts preceding the already approved threshold. */
(() => {
 const {span,mix}=VF.math;
 VF.PathDepth={
  apply(owner,set,t,v,beats,cast,lens){
   if(!['arch','rows','tunnel'].includes(set))return null;
   const at=id=>beats.find(b=>b.id===id)?.actionPlan.start||0,paths={
    arch:[{a:.15,b:1.6,from:[.12,.02],to:[.30,.24]},{a:at('leave')+.1,b:at('leave')+3.2,from:[.30,.24],to:[.43,.62]}],
    rows:[{a:.1,b:2.4,from:[.26,.12],to:[.34,.36]},{a:at('leave'),b:at('leave')+3.2,from:[.34,.36],to:[.45,.78]}],
    tunnel:[{a:.1,b:1.5,from:[.28,.12],to:[.44,.34]},{a:1.8,b:3.1,from:[.44,.34],to:[.29,.16]},{a:at('follow')+.2,b:at('follow')+4.5,from:[.29,.16],to:[.44,1.05]}]
   }[set];
   for(const [i,id]of ['pink','taupe'].entries()){
    let point={x:paths[0].from[0]+i*.37,z:paths[0].from[1],air:0,lift:22};
    for(const path of paths){const delay=i*.25;if(t<path.a+delay)break;point=VF.WorldPath.sample({x:path.from[0]+i*.37,z:path.from[1]},{x:path.to[0]+i*.37,z:path.to[1]+i*.04},t,path.a+delay,path.b-path.a,2,20);}
    const pose=VF.WorldPath.actor(id,point,v,Math.min(v.frame.w*.64,v.frame.h*.57)),a=cast[id];for(const key of ['x','y','floor','s','airborne','jumpPhase','worldPosition','depth'])a[key]=pose[key];a.crouch+=pose.crouch||0;a.gaitWeight=0;
   }
   const z=(cast.pink.worldPosition.z+cast.taupe.worldPosition.z)/2;lens.travel=z;lens.cx=.50+.015*z;
   return{z,worldSpace:true,cast:['pink','taupe'],layers:3};
  },
  foreground(p,s,v,t){if(!s.pathDepth)return;const z=s.pathDepth.z,size=v.w*.66;for(const [i,side]of [-1,1].entries()){p.save();p.translate(side<0?-size*.72-z*v.w*.13:v.w-size*.20+z*v.w*.13,v.h*.10-z*v.h*.08);p.rotate(side*.12*z);VF.Art.draw(p,'foliage',VF.Art.rects.foliage[side<0?'left':'right'],0,0,size,size*1.15);p.restore();}}
 };
})();
