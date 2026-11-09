// Numeric asset/renderer verification. No screenshots, image exports or recordings.
const {chromium}=require(process.env.VALERIE_PLAYWRIGHT||'@playwright/test'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{const p=await b.newPage({viewport:{width:390,height:844}});await p.goto(process.env.VALERIE_URL||'http://127.0.0.1:4184');await p.waitForFunction(()=>window.Valerie?.state().ready);
 const result=await p.evaluate(()=>{
  const rig=new VF.PlushRig(),summary={cleanup:rig.prepared.cleanup,ocular:{},lenses:[]};
  for(const id of ['pink','taupe']){
   const m=VF.CharacterModels[id],box=m.headBox,c=document.createElement('canvas');c.width=Math.ceil(box.w*2);c.height=Math.ceil(box.h*2);const q=c.getContext('2d'),draw=(blink,eyeOpen)=>{q.setTransform(1,0,0,1,0,0);q.clearRect(0,0,c.width,c.height);q.scale(2,2);q.translate(-box.x,-box.y);rig.atlas.head(q,id,{blink,eyeOpen},0);return q.getImageData(0,0,c.width,c.height).data;};
   const neutral=draw(0,1),closed=draw(.95,1),open=draw(0,1.12);let changedClosed=0,changedOpen=0,outsideChanges=0,opaqueN=0,opaqueC=0;
   for(let i=0;i<neutral.length;i+=4){const at=i/4,x=at%c.width/2+box.x,y=Math.floor(at/c.width)/2+box.y,inside=m.eyes.some(([ex,ey])=>Math.abs(x-ex)<=20&&Math.abs(y-ey)<=23),delta=Math.max(...[0,1,2].map(k=>Math.abs(neutral[i+k]-closed[i+k])));if(neutral[i+3]>200)opaqueN++;if(closed[i+3]>200)opaqueC++;if(delta){changedClosed++;if(!inside&&neutral[i+3]>200&&delta>2)outsideChanges++;}if(neutral[i]!==open[i]||neutral[i+1]!==open[i+1])changedOpen++;}
   summary.ocular[id]={changedClosed,changedOpen,outsideChanges,coverage:opaqueC/opaqueN};
  }return summary;
 });
 assert(result.cleanup['pink-body'].removedCorePixels>500);assert(result.cleanup['pink-ear-left'].removedCorePixels>1000);
 for(const [id,v]of Object.entries(result.ocular)){assert(v.changedClosed>100,id+' blink deforms real painted eye pixels');assert(v.changedOpen>100,id+' asombro affects painted eyes');assert.equal(v.outsideChanges,0,id+' face identity outside eye patches is unchanged');assert(v.coverage>.9995,id+' no holes introduced');}
 const lenses=[];for(let i=0;i<5;i++){await p.evaluate(async i=>{await Valerie.go(i,{immediate:true,replay:true});Valerie.seek(8);},i);lenses.push(await p.evaluate(()=>Valerie.state().props.lens.zoom));}assert.equal(new Set(lenses).size,5);
 await p.evaluate(async()=>{await Valerie.go(0,{immediate:true,replay:true});Valerie.seek(4);});const s=await p.evaluate(()=>Valerie.state()),g=s.actors.find(a=>a.id==='taupe');assert(g.ears.bottom>g.face.bottom+35*g.native.s,'long ears hang clearly below the chin');
 console.log(JSON.stringify({phase:'F8-CANDIDATA',neighbourFragmentsRemoved:true,ocular:result.ocular,distinctLenses:lenses,longEarsBelowChin:true,imagesExported:0}));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
