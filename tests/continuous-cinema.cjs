/* F24 end-to-end contract. Deliberately exports no images, video or private photo content. */
const {chromium}=require(process.env.VALERIE_PLAYWRIGHT||'@playwright/test');
const assert=require('node:assert/strict');
const BASE=process.env.VALERIE_URL||'http://127.0.0.1:4190';
const state=p=>p.evaluate(()=>Valerie.state());
const near=(a,b,label,epsilon=1e-7)=>assert(Math.abs(a-b)<epsilon,`${label}: ${a} / ${b}`);
const CASE=process.env.VALERIE_CASE;
const summary=s=>({age:s.narrative.age,time:s.time,frames:s.metrics.frames,elapsed:s.playback.elapsed,complete:s.playback.actionComplete,inFlight:s.playback.inFlight,actionReady:s.world.actionReady,index:s.index,beat:s.narrative.id,view:s.narrative.view,playback:s.playback.state,error:s.playback.error,cut:s.cut?.phase,forest:s.forest?.phase,paused:s.paused,hud:s.hud});
async function advanceUntil(p,predicate,{seconds=30,step=500,inspect=null,label='condition'}={}){
 const attempts=Math.ceil(seconds*1000/step);
 let previous='';for(let i=0;i<=attempts;i++){const s=await state(p);if(process.env.VALERIE_TRACE){const key=s.index+':'+s.narrative.id+':'+s.playback.state;if(key!==previous){console.log(label+' '+JSON.stringify(summary(s)));previous=key;}}if(inspect)await inspect(p,s);if(predicate(s))return s;if(i<attempts)await p.clock.runFor(step);}
 throw new Error(label+' did not arrive: '+JSON.stringify(summary(await state(p))));
}
async function openHUD(p){if(!(await state(p)).hud.visible)await p.locator('#hud-toggle').click();assert(await p.locator('#controls').isVisible());}
async function closeHUD(p){if((await state(p)).hud.visible)await p.locator('#hud-close').click();assert(await p.locator('#controls').evaluate(e=>e.hidden&&e.inert));}
async function contextNext(p){await closeHUD(p);await p.locator('#context-next').click();await p.clock.runFor(550);}
async function jump(p,index){await p.evaluate(index=>Valerie.go(index,{force:true,immediate:true,replay:true}),index);await p.waitForFunction(()=>Valerie.state().ready&&Valerie.state().transition===1);}
async function targets(p,ids){
 const boxes=await p.evaluate(ids=>ids.map(id=>{const e=document.getElementById(id),r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return{id,w:r.width,h:r.height,inside:r.x>=-.5&&r.y>=-.5&&r.right<=innerWidth+.5&&r.bottom<=innerHeight+.5,hit:hit===e||e.contains(hit),hidden:e.hidden,inert:e.inert};}),ids);
 for(const b of boxes){assert(b.w>=43.5&&b.h>=43.5,`${b.id}: target ${b.w}x${b.h}`);assert(b.inside&&b.hit&&!b.hidden&&!b.inert,`${b.id}: reachable`);}
}
async function rootProbe(p,stats){
 const data=await p.evaluate(()=>{const s=Valerie.state();return{index:s.index,frames:s.metrics.frames,actors:s.actors.map(rendered=>{const a=rendered.native;return{id:rendered.id,airborne:a.airborne,space:a.locomotion?.space,feet:Object.values(a.feetWorld||{}).map(foot=>({contact:foot.contact,space:foot.space,x:foot.x,y:foot.y,expected:foot.local?VF.Kinematics.localToWorld(a,foot.local,rendered.id):null}))};})};});
 if(stats.lastFrame===data.frames)return;stats.lastFrame=data.frames;assert.equal(data.actors.length,2,'A frame contains exactly the original pair');
 for(const a of data.actors)if(a.airborne){stats.flight[a.id]=(stats.flight[a.id]||0)+1;assert.equal(a.space,'actor');for(const f of a.feet){assert.equal(f.contact,false);assert.equal(f.space,'actor');near(f.x,f.expected.x,'Flight paw x',1e-6);near(f.y,f.expected.y,'Flight paw y',1e-6);}}
}
(async()=>{
 const browser=await chromium.launch({channel:process.env.VALERIE_BROWSER||'msedge',headless:true}),errors=[],checks=[],httpRequests=[];
 async function page(options={}){const c=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,...options}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))httpRequests.push(r.url());});await p.clock.install();await p.goto(BASE);await p.waitForFunction(()=>window.Valerie?.state().ready);return p;}
 try{
  // Fresh opening: no Next click and no optional movie-mode activation.
  if(!CASE||CASE==='opening'){
   const p=await page(),roots={flight:{},lastFrame:-1};let s=await state(p);assert.equal(s.playback.mode,'cinema');assert.equal(s.playback.state,'PLAYING');assert.equal(s.hud.visible,false);assert.equal(s.audio.state,'uninitialized');assert(await p.locator('#controls').evaluate(e=>e.hidden&&e.inert));
   await advanceUntil(p,s=>s.narrative.id==='steady',{seconds:10,step:200,inspect:p=>rootProbe(p,roots),label:'second automatic line'});
   await openHUD(p);await p.locator('#pause').click();const paused=await state(p),frame=paused.view.frame,scales=paused.actors.map(a=>a.native.s);assert.equal(paused.playback.state,'PAUSED');
   await p.clock.fastForward(20000);s=await state(p);near(s.time,paused.time,'Paused world time');near(s.playback.elapsed,paused.playback.elapsed,'Paused editorial time');assert.deepEqual(s.props.lens,paused.props.lens);
   await closeHUD(p);assert.deepEqual((await state(p)).view.frame,frame);assert.deepEqual((await state(p)).actors.map(a=>a.native.s),scales);await openHUD(p);assert.deepEqual((await state(p)).view.frame,frame);await targets(p,['hud-toggle','hud-close','previous','pause','replay','chapters','sound']);await p.locator('#pause').click();await closeHUD(p);
   await advanceUntil(p,s=>s.cut.active,{seconds:12,step:200,label:'first physical camera transition'});
   await openHUD(p);await p.locator('#pause').click();const cut=await state(p);await p.clock.fastForward(20000);s=await state(p);near(s.cut.progress,cut.cut.progress,'Paused travelling cut');assert.equal(s.index,cut.index);assert.deepEqual(s.props.lens,cut.props.lens);await p.locator('#pause').click();await closeHUD(p);
   await advanceUntil(p,s=>s.index===1&&s.narrative.kind==='choice',{seconds:20,step:400,inspect:p=>rootProbe(p,roots),label:'first decision'});s=await state(p);assert.equal(s.playback.state,'AWAITING_CHOICE');assert(await p.locator('#choice-panel').isVisible());assert(await p.locator('#context-next').isVisible());
   await p.clock.fastForward(120000);s=await state(p);assert.equal(s.index,1);assert.equal(s.narrative.kind,'choice');assert.equal(s.story.choices['leaf-holder'],undefined);assert.equal(s.hud.visible,false);
   await p.locator('[data-choice="leaf-holder"][data-option="rosa"]').click();await p.clock.runFor(2300);s=await state(p);assert.equal(s.props.leaf.holder,'rosa');assert.equal(s.props.leaf.id,'pink');assert.equal(s.playback.state,'PLAYING');await rootProbe(p,roots);
   await advanceUntil(p,s=>s.index===6&&s.narrative.kind==='choice',{seconds:90,step:200,inspect:p=>rootProbe(p,roots),label:'continuous vineyard into original forest'});
   assert(roots.flight.pink>2,'Rosa performs whole-plush flight');assert(roots.flight.taupe>1,'Beige also performs a whole-plush flight');s=await state(p);assert.equal(s.story.choices['leaf-holder'],'rosa');assert.equal(s.playback.state,'AWAITING_CHOICE');assert.equal(s.audio.state,'uninitialized');assert.equal(s.cut.active,false);assert.equal(s.cut.last.targetWorld,'forest');assert.equal(s.cut.last.kind,'leaf-threshold');
   checks.push({opening:'automatic',automaticLines:true,automaticChapterChange:true,firstChoiceHeld:true,chosenCarrier:'rosa',physicalVineyardToForest:true,flightSamples:roots.flight,pause:true,pauseDuringTransition:true,hudGeometryStable:true});
   console.log('checkpoint '+checks.length+' '+JSON.stringify(checks.at(-1)));await p.context().close();
  }
  // The alternative canopy has a different carrier; forest remains an optional real action.
  if(!CASE||CASE==='forest'){
   const p=await page();await jump(p,1);await advanceUntil(p,s=>s.narrative.kind==='choice',{seconds:12});await p.locator('[data-choice="leaf-holder"][data-option="beige"]').click();await p.clock.runFor(2300);let s=await state(p);assert.equal(s.props.leaf.id,'taupe');assert.equal(s.props.leaf.holder,'beige');assert(s.actors.find(a=>a.id==='pink').native.airborne>0,'Rosa passes while Beige carries the leaf');
   await jump(p,6);await advanceUntil(p,s=>s.narrative.kind==='choice',{seconds:12});await p.locator('[data-option="tree"]').click();s=await state(p);assert.equal(s.forest.route,'tree');assert.equal(s.playback.state,'AWAITING_INTERACTION');assert.equal(s.hud.visible,false);assert(await p.locator('#context-assist').isVisible());
   const initial=s.forest.progress.discover;await p.clock.fastForward(20000);assert.equal((await state(p)).forest.progress.discover,initial,'Time alone never listens to the tree');
   await p.locator('#context-assist').click();await advanceUntil(p,s=>s.forest?.phase==='shape',{seconds:15});assert(await p.locator('#context-assist').isVisible());await p.locator('#context-assist').click();await advanceUntil(p,s=>s.forest?.phase==='cross',{seconds:15});assert.equal((await state(p)).playback.state,'PLAYING');await advanceUntil(p,s=>s.forest?.phase==='rest',{seconds:15});assert.equal((await state(p)).forest.route,'tree');
   await p.setViewportSize({width:844,height:390});await p.clock.runFor(100);await targets(p,['hud-toggle']);await openHUD(p);await targets(p,['hud-close','previous','pause','replay','chapters','sound']);await closeHUD(p);
   checks.push({chosenCarrier:'beige',treeRoutePreserved:true,optionalAssistance:true,completionResumesAutomatically:true,landscapeHUD:true});console.log('checkpoint '+checks.length+' '+JSON.stringify(checks.at(-1)));await p.context().close();
  }
  // Reduced motion is still cinema; protected content only advances through explicit controls.
  if(!CASE||CASE==='protected'){
   const p=await page({viewport:{width:320,height:568},reducedMotion:'reduce'});await jump(p,6);await advanceUntil(p,s=>s.narrative.kind==='choice',{seconds:12});await contextNext(p);let s=await state(p);assert.equal(s.forest.route,'neutral');assert.equal(s.story.choices['forest-way'],undefined);assert(s.story.skipped.includes('forest-way'));await contextNext(p);await contextNext(p);await advanceUntil(p,s=>s.forest?.phase==='rest',{seconds:15});assert.equal((await state(p)).forest.progress.shape,1);
   await jump(p,12);await advanceUntil(p,s=>s.narrative.kind==='choice',{seconds:15});await p.locator('[data-choice="portrait-reveal"][data-option="leaf"]').click();await advanceUntil(p,s=>s.narrative.view==='photo',{seconds:20});s=await state(p);const photoId=s.narrative.id;assert.equal(s.playback.state,'AWAITING_READING');assert(s.world.photo.clean&&s.world.photo.originalBytes);await p.clock.fastForward(180000);assert.equal((await state(p)).narrative.id,photoId);
   await jump(p,15);await advanceUntil(p,s=>s.narrative.kind==='choice',{seconds:15});await p.locator('[data-choice="letter-seal"]').first().click();await advanceUntil(p,s=>s.reader.active,{seconds:20});const pageAnchor=(await state(p)).reader.anchor;await p.clock.fastForward(180000);assert.deepEqual((await state(p)).reader.anchor,pageAnchor);await p.evaluate(()=>Valerie.go(18,{force:true,immediate:true}));assert.equal((await state(p)).index,15,'Hash/imperative navigation cannot skip the unread letter');
   let pages=0;while((await state(p)).reader.active&&pages++<50)await contextNext(p);assert(pages<50);assert((await state(p)).reader.complete);
   await jump(p,16);const caseBeat=(await state(p)).narrative.id;await p.clock.fastForward(180000);assert.equal((await state(p)).narrative.id,caseBeat);assert.equal((await state(p)).playback.state,'AWAITING_REVEAL');
   await p.evaluate(()=>Valerie.go(18,{force:true,immediate:true}));s=await state(p);assert.equal(s.index,17,'The final question cannot skip the real ring ceremony');assert.equal(s.ceremonyReleased,false);const opening=s.narrative.id;await p.clock.fastForward(180000);s=await state(p);assert.equal(s.narrative.id,opening);assert.equal(s.props.ceremony.open,1);assert.equal(s.playback.state,'AWAITING_REVEAL');
   for(let i=0;i<6&&(await state(p)).narrative.view!=='macro';i++)await contextNext(p);s=await state(p);assert.equal(s.narrative.view,'macro');const macro=s.narrative.id;await p.clock.fastForward(180000);assert.equal((await state(p)).narrative.id,macro);
   for(let i=0;i<8&&(await state(p)).index!==18;i++)await contextNext(p);assert.equal((await state(p)).index,18);assert.equal((await state(p)).ceremonyReleased,true);const homecoming=(await state(p)).narrative.id;await p.clock.fastForward(180000);assert.equal((await state(p)).narrative.id,homecoming);await contextNext(p);s=await state(p);assert.equal(s.narrative.text,'Valerie, ¿quieres ser mi novia?');await p.clock.fastForward(180000);assert.equal((await state(p)).narrative.view,'question');assert.equal(await p.locator('#context-next').isVisible(),false);assert.equal((await state(p)).audio.state,'uninitialized');
   checks.push({reducedCinema:true,neutralRoute:true,protectedPhoto:true,protectedLetter:true,protectedCase:true,protectedRing:true,protectedFinal:true,pages});console.log('checkpoint '+checks.length+' '+JSON.stringify(checks.at(-1)));await p.context().close();
  }
  // Navigation tokens discard a superseded asynchronous destination without a hanging promise.
  if(!CASE||CASE==='races'){
   const p=await page({reducedMotion:'reduce'});const result=await p.evaluate(async()=>Promise.all([Valerie.go(4,{force:true}),Valerie.go(5,{force:true,immediate:true})]));assert.equal(result[0],false);assert.equal(result[1],true);let s=await state(p);assert.equal(s.index,5);assert.equal(s.loadingScene,false);assert.equal(s.cut.active,false);assert.equal(await p.evaluate(()=>location.hash),'#tras-la-luz');await p.reload();await p.waitForFunction(()=>Valerie.state().ready);s=await state(p);assert.equal(s.index,5);assert.equal(s.playback.mode,'cinema');checks.push({supersededNavigation:true,reload:true});console.log('checkpoint '+checks.length+' '+JSON.stringify(checks.at(-1)));await p.context().close();
  }
  assert.deepEqual(errors,[]);if(BASE.startsWith('file:'))assert.deepEqual(httpRequests,[],'The standalone film must not request HTTP resources');console.log(JSON.stringify({phase:'F24',offline:BASE.startsWith('file:'),checks,browserErrors:errors,httpRequests:httpRequests.length,captures:0,recordings:0}));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
