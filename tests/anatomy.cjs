// Targeted regression for Anatomy 03. Pixels are inspected in memory; nothing is exported.
const {chromium}=require(process.env.VALERIE_PLAYWRIGHT||'@playwright/test'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await browser.newPage({viewport:{width:390,height:844}});await p.goto(process.env.VALERIE_URL||'http://127.0.0.1:4184');await p.waitForFunction(()=>window.Valerie?.state().ready);
 const model=await p.evaluate(()=>{
  const rig=new VF.PlushRig(),roots={},earSources={};
  for(const id of ['pink','taupe']){const m=VF.CharacterModels[id],a=rig.atlas.parts.get(id+'-body'),b=a.box,q=a.canvas.getContext('2d'),data=q.getImageData(0,0,a.canvas.width,a.canvas.height).data;let solid=0,total=0;
   for(let y=-9;y<=9;y++)for(let x=-9;x<=9;x++)if(x*x+y*y<81){const px=Math.round((m.shoulder.x+x-b.x)*2),py=Math.round((m.shoulder.y+y-b.y)*2);total++;if(data[(py*a.canvas.width+px)*4+3]>220)solid++;}roots[id]={coverage:solid/total,shoulder:m.shoulder};
  }
  for(const side of ['left','right']){const a=rig.atlas.parts.get('pink-ear-'+side);earSources[side]={...rig.prepared.cleanup['pink-ear-'+side],ink:a.ink};}
  return{roots,earSources,materials:Object.keys(rig.mittens),bytes:rig.prepared.bytes};
 });
 for(const id of ['pink','taupe'])assert(model.roots[id].coverage>.93,id+' shoulder must lie inside the opaque body, not at its edge: '+JSON.stringify(model.roots[id]));
 assert.notDeepEqual(model.earSources.left.sourceCell,model.earSources.right.sourceCell);assert.deepEqual(model.earSources.right.sourceCell,[72,559,355,391]);assert(model.earSources.left.ink.h>110);assert(model.earSources.right.ink.h>80);assert.equal(model.materials.length,4);
 const motion=await p.evaluate(()=>{const st=new VF.SceneStage(),v=Valerie.state().view,result=[];for(const t of [5.15,5.5,5.8,6.08,6.5,7.42,7.70,8.05,8.30,8.80,9.5]){st.seek();const s=st.pose(VF.content.shots[1],t,v,{paused:true}),p=s.actors.pink;result.push({t,x:p.x,y:p.y,floor:p.floor,crouch:p.crouch,air:p.airborne,feet:p.feetWorld,gait:p.gaitWeight,stride:p.stride,arms:p.arms,head:p.head});}return result;});
 const airborne=motion.filter(s=>s.air),landed=motion.filter(s=>!s.air);assert(airborne.length>=4);assert(landed.some(s=>s.crouch>.35));assert(motion.at(-1).x-motion[0].x>35);
 for(const s of motion){assert.equal(s.gait,0);assert.equal(s.stride,0);assert.equal(s.feet.left.contact,s.feet.right.contact);assert(Math.abs(s.feet.left.y-s.feet.right.y)<.001);assert(Math.abs(s.head)<.2);}
 for(const s of airborne)assert(!s.feet.left.contact&&s.y<s.floor);
 for(const s of landed)for(const foot of Object.values(s.feet))assert(foot.contact);
 assert.deepEqual(motion[0].arms,motion.at(-1).arms,'hopping must not introduce walking arm swing');
 const gait=await p.evaluate(()=>{const rig=new VF.RigAnimator(),st=new VF.SceneStage(),view=Valerie.state().view,result=[];for(let i=0;i<24;i++){const s=st.geometry(view,'together');s.pink.gaitWeight=1;s.pink.airborne=0;const p=rig.resolve({actors:s,beat:'walking-together'},i/24,view,{dt:1/24}).actors.pink;result.push([p.feetWorld.left.contact,p.feetWorld.right.contact]);}return result;});assert(gait.every(([l,r])=>l&&r),'legacy gait requests cannot restore human alternating feet');
 console.log(JSON.stringify({phase:'F8-CANDIDATA',interiorShoulders:model.roots,distinctOriginalEarCells:true,upperAndSideSpecificPaws:model.materials,pairedHopSamples:motion.length,legacyAlternatingGaitRemoved:true,atlasBytes:model.bytes,captures:0}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
