import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root=new URL('../',import.meta.url),manifest=JSON.parse(fs.readFileSync(new URL('assets/forest-living/manifest.json',root)));
// Supply decoded dimensions only; pose tests use the real anatomy, kinematics and animator.
class PreparedImage {
 set src(value){this.source=value;const item=Object.values(manifest.assets).find(item=>value.endsWith(item.file));assert.ok(item,'Unexpected scene asset');this.width=this.naturalWidth=item.width;this.height=this.naturalHeight=item.height;}
 async decode(){}
}
async function setup(){
 const c=vm.createContext({Image:PreparedImage,VF_FOREST_ASSETS:manifest});vm.runInContext('window=globalThis',c);
 for(const name of ['math','character-models','kinematics','animation','forest-scene'])vm.runInContext(fs.readFileSync(new URL('src/'+name+'.js',root),'utf8'),c);
 c.VF.ResourceCache={url:async file=>file,drop(){}};const scene=new c.VF.ForestScene();await scene.prepare();return{scene,VF:c.VF};
}
const views=[
 {w:390,h:844,kind:'portrait',frame:{x:22,y:72,w:346,h:490}},
 {w:844,h:390,kind:'landscape',frame:{x:296,y:60,w:526,h:238}},
 {w:320,h:568,kind:'portrait',frame:{x:16,y:64,w:288,h:290}}
];
const action=(route,phase,progress=1,phaseAge=0)=>({route,phase,phaseAge,progress:{discover:progress,shape:progress},light:{x:.7,y:.28},map:{x:.5,y:.54},trace:[]});
const pose=(scene,view,a,time=0,dt=0)=>scene.pose({mode:'forest'},time,view,{action:a,dt});
const close=(a,b,message)=>assert.ok(Math.abs(a-b)<1e-7,message+': '+a+' vs '+b);

test('first visible forest framing stays full-size and stable before either physical crossing',async()=>{
 const{scene,VF}=await setup();
 for(const view of views)for(const route of ['tree','firefly'])for(const phase of ['discover','shape'])for(const progress of [0,.5,1]){
  scene.enter();const a=action(route,phase,progress),first=pose(scene,view,a),initial={};
  close(first.forest.projection.w/first.forest.projection.h,manifest.assets.clearing.width/manifest.assets.clearing.height,'Painted creek is stretched');
  for(const actor of Object.values(first.actors))initial[actor.id]={x:actor.x,y:actor.y,s:actor.s};
  for(let i=1;i<=3;i++){
   const frame=pose(scene,view,a,i/60,1/60);
   for(const actor of Object.values(frame.actors)){
    const start=initial[actor.id],b=VF.rigBounds[actor.id],f=view.frame;assert.ok(actor.s>0);
    close(actor.s,start.s,'Character changes size during preparation');close(actor.x,start.x,'Unexpected horizontal initialization drift');close(actor.y,start.y,'Unexpected vertical initialization drift');
    assert.ok(actor.x+b.x*actor.s>=f.x-.01&&actor.x+(b.x+b.w)*actor.s<=f.x+f.w+.01,'Character silhouette exceeds horizontal safe region');
    assert.ok(actor.y+b.y*actor.s>=f.y-.01&&actor.y+(b.y+b.h)*actor.s<=f.y+f.h+.01,'Character silhouette exceeds vertical safe region');
   }
  }
 }
});

test('both plushes carry their flight paws with the pelvis through takeoff, travel and landing',async()=>{
 const{scene,VF}=await setup();
 for(const view of views)for(const route of ['firefly','tree']){
  scene.enter();const flights={pink:0,taupe:0};
  for(let age=0;age<=3.42;age+=.03){
   const frame=pose(scene,view,action(route,'cross',1,age),age,.03);
   for(const actor of Object.values(frame.actors))for(const foot of Object.values(actor.feetWorld)){
    if(actor.airborne){
     flights[actor.id]++;assert.equal(foot.contact,false);assert.equal(foot.space,'actor');
     const transformed=VF.Kinematics.localToWorld(actor,foot.local,actor.id);close(foot.x,transformed.x,'Flight paw detached horizontally');close(foot.y,transformed.y,'Flight paw left behind vertically');
    }else{assert.equal(foot.contact,true);close(foot.y,actor.groundY-25*actor.s,'Ground support differs from solved paw');}
   }
  }
  for(const id of ['pink','taupe'])if(route==='firefly')assert.ok(flights[id]>20,id+' never performed a real flight');else assert.equal(flights[id],0,'The grounded tree scene introduced an unintended hop');
  const landed=pose(scene,view,action(route,'rest'),3.5,.03);for(const actor of Object.values(landed.actors)){assert.equal(actor.airborne,0);assert.equal(actor.locomotion.space,'world');assert.ok(Object.values(actor.feetWorld).every(f=>f.contact));}
 }
});

test('the physical creek crossing begins and ends on opposing painted banks',async()=>{
 const{scene}=await setup();
 for(const view of views){
  scene.enter();const before=pose(scene,view,action('firefly','shape')),after=pose(scene,view,action('firefly','rest'),3.5);
  for(const actor of Object.values(before.actors))assert.ok(actor.groundY>=before.forest.water.y+before.forest.water.h,'Initial support lands in creek: '+view.w+' '+actor.id);
  for(const actor of Object.values(after.actors)){
   assert.ok(actor.groundY<=after.forest.water.y,'Final support lands in creek: '+view.w+' '+actor.id);
   assert.ok(Math.abs(actor.groundY-after.forest.far.y)<Math.max(3,view.frame.h*.04),'Final support misses the authored far-bank crossing');
  }
 }
});


test('tree listening target stays outside the original face and within the real forepaw reach',async()=>{
 const{scene,VF}=await setup();
 for(const view of views)for(const progress of [0,.5,1]){
  scene.enter();const frame=pose(scene,view,action('tree','discover',progress)),actor=frame.actors.taupe,knot=frame.forest.gate.knot,model=VF.CharacterModels.taupe,shoulder=VF.Kinematics.shoulder(actor,'taupe',1),posture=VF.Kinematics.posture('taupe',actor),reach=(model.arm[0]+model.arm[1]-1)*actor.s*Math.min(posture.sx,posture.sy);
  assert.ok(Math.hypot(knot.x-shoulder.x,knot.y-shoulder.y)<=reach,'Listening point requires an overstretched arm');
  const faceBottom=VF.Kinematics.localToWorld(actor,{x:0,y:model.headBox.y+model.headBox.h},'taupe');
  assert.ok(knot.y>faceBottom.y+10*actor.s,'Listening point covers the original face');
  close(actor.handsWorld.right.x,knot.x,'Hand contact loses the real tree point');close(actor.handsWorld.right.y,knot.y,'Hand contact loses the real tree point');
 }
});
