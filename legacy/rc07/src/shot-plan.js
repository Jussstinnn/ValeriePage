/* Object-normalized lenses. Only named details may omit the body, never a rest shot. */
(() => {
 const {ease,mix,clamp}=VMath;
 const beat=(p,name,box,detail=false)=>({p,name,box,detail});
 const plans={
  vineyard:[beat(0,'inside-the-star',[.66,.19,.36,.68],true),beat(.22,'descending-between-vines',[.52,.47,.58,.94]),beat(.64,'a-path-at-eye-level',[.50,.56,1,1]),beat(1,'the-light-finds-a-companion',[.50,.62,.72,1])],
  mushroom:[beat(0,'under-the-canopy',[.49,.69,.78,.62],true),beat(.34,'the-whole-living-garden',[.50,.50,1,1]),beat(.65,'a-breath-beneath-the-cap',[.51,.45,.67,.64],true),beat(1,'a-light-for-the-painting',[.50,.50,1,1])],
  museum:[beat(0,'the-painted-room',[.50,.50,1,1]),beat(.22,'the-frame-fills-the-world',[.51,.38,.60,.72]),beat(.61,'toward-the-painted-star',[.60,.24,.27,.36],true),beat(1,'the-pigment-becomes-sky',[.68,.21,.11,.16],true)],
  couple:[beat(0,'a-star-becomes-our-sky',[.60,.24,.46,.58],true),beat(.3,'two-under-the-whole-sky',[.5,.5,1,1]),beat(1,'a-wish-descends',[.5,.5,1,1])]
 };
 function sample(id,p){const plan=plans[id];if(!plan)return null;let a=plan[0],b=a;for(let j=1;j<plan.length;j++){b=plan[j];if(p<=b.p)break;a=b;}const q=ease((p-a.p)/Math.max(.001,b.p-a.p)),v=a.box.map((x,i)=>mix(x,b.box[i],q));return{cx:v[0],cy:v[1],w:v[2],h:v[3],id:a.name,detail:a.detail};}
 window.VShotPlan={plans,sample,rabbit(p,state){const b=state?.acting?.bounds||{x:.2,y:.1,w:.5,h:.75},close=ease((p-.12)/.10)*(1-ease((p-.30)/.12));return{cx:mix(.5,b.x+b.w*.50,close),cy:mix(.5,b.y+b.h*.32,close),w:mix(1,Math.min(1,b.w*1.28),close),h:mix(1,Math.min(1,b.h*.70),close),id:close>.6?'listening-close-up':p>.88?'a-farewell-at-the-path':'following-the-companion',detail:close>.1};}};
})();
