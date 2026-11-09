/* One reusable solver for both plush anatomies; contact goals may be in world space. */
(() => {
 const {clamp,mix}=VF.math;
 function arm(id,side,target){
  const m=VF.CharacterLibrary.model(id),origin={x:m.shoulder.x*side,y:m.shoulder.y},[l1,l2]=m.arm,dx=target.x-origin.x,dy=target.y-origin.y,requested=Math.hypot(dx,dy),d=clamp(requested,8,l1+l2-1),a=Math.atan2(dy,dx),bend=Math.acos(clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1));
  return{origin,joint:{x:origin.x+Math.cos(a-side*bend)*l1,y:origin.y+Math.sin(a-side*bend)*l1},end:{x:origin.x+Math.cos(a)*d,y:origin.y+Math.sin(a)*d},residual:Math.max(0,requested-d),lengths:[l1,l2]};
 }
 // Shoulder and contact constraints use the same compact plush posture as the renderer.
 function posture(id,p){const sit=clamp(p.sit||0),c=p.crouch||0,pink=id==='pink';return{lean:(p.lean||0)*(pink?.30:.50),dy:c*(pink?9:11)+sit*9,sx:1+c*(pink?.045:.055)+sit*.045,sy:1-c*(pink?.075:.09)-sit*.08};}
 function localToWorld(p,n,id=p.id||'taupe'){const b=posture(id,p),c=Math.cos(b.lean),s=Math.sin(b.lean),x=n.x*b.sx,y=n.y*b.sy+b.dy;return{x:p.x+(x*c-y*s)*p.s,y:p.y+(x*s+y*c)*p.s};}
 function shoulder(p,id,side){const m=VF.CharacterModels[id];return localToWorld(p,{x:m.shoulder.x*side,y:m.shoulder.y},id);}
 function shared(p,g){
  const a=VF.CharacterModels.pink,b=VF.CharacterModels.taupe,pa=shoulder(p,'pink',1),pb=shoulder(g,'taupe',-1),paScale=posture('pink',p),pbScale=posture('taupe',g),ra=(a.arm[0]+a.arm[1]-1.5)*p.s*Math.min(paScale.sx,paScale.sy),rb=(b.arm[0]+b.arm[1]-1.5)*g.s*Math.min(pbScale.sx,pbScale.sy);
  return{x:mix(pa.x,pb.x,ra/(ra+rb)),y:mix(pa.y,pb.y,ra/(ra+rb)),reachable:Math.hypot(pb.x-pa.x,pb.y-pa.y)<=ra+rb};
 }
 VF.Kinematics={arm,shared,posture,shoulder,localToWorld};
})();
