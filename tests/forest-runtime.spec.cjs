/* Focused F23 browser contract. No recordings, screenshots, or exported private media.
   Run after npm run build + npm start: node tests/forest-runtime.spec.cjs
   Set VALERIE_URL to the release's file URL to verify the identical offline contract. */
const {chromium}=require(process.env.VALERIE_PLAYWRIGHT||'@playwright/test');
const assert=require('node:assert/strict');
const BASE=process.env.VALERIE_URL||'http://127.0.0.1:4190';
const CHAPTER='el-bosque-escucha';
const state=p=>p.evaluate(()=>Valerie.state());
const action=async p=>{const s=await state(p);assert(s.forest,'F23 must expose its canonical forest snapshot');return s.forest;};
const waitReady=p=>p.waitForFunction(()=>window.Valerie?.state().ready&&Valerie.state().transition===1);
async function openHUD(p){if(!(await state(p)).hud.visible)await p.locator('#hud-toggle').click();}
async function closeHUD(p){if((await state(p)).hud.visible)await p.locator('#hud-close').click();}
async function clickNext(p){await openHUD(p);assert.equal(await p.locator('#next').isEnabled(),true,`Next must agree with the active state: ${JSON.stringify((await state(p)).forest)}`);await p.locator('#next').click();await p.waitForTimeout(465);await waitReady(p);await closeHUD(p);}
async function enter(p,route){
 await p.evaluate(async id=>{const i=VF.content.shots.findIndex(s=>s.id===id);await Valerie.go(i,{immediate:true,replay:true});},CHAPTER);
 await waitReady(p);
 for(let n=0;n<8;n++){if((await state(p)).narrative.kind==='choice')break;await clickNext(p);}
 assert.equal((await state(p)).narrative.choiceId,'forest-way');
 assert.equal((await state(p)).narrative.kind,'choice');
 if(route==='neutral')await clickNext(p);else await p.locator(`[data-choice="forest-way"][data-option="${route}"]`).click();
 await p.waitForFunction(()=>Valerie.state().forest?.phase==='discover'&&Valerie.state().narrative.choiceResult);
 const f=await action(p);assert.equal(f.route,route);assert.equal(f.progress.discover,0);assert.equal(f.progress.shape,0);
 return f;
}
async function controls(p){await openHUD(p);
 const layout=await p.evaluate(()=>({scroll:scrollY,overflow:document.documentElement.scrollWidth>innerWidth+1,buttons:['previous','next','pause','chapters','sound','replay'].map(id=>{const e=document.getElementById(id),r=e.getBoundingClientRect(),h=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return{id,w:r.width,h:r.height,visible:r.x>=-.5&&r.y>=-.5&&r.right<=innerWidth+.5&&r.bottom<=innerHeight+.5,hit:e===h||e.contains(h)};})}));
 for(const b of layout.buttons){assert(b.w>=43.5&&b.h>=43.5,`${b.id}: touch target ${b.w}x${b.h}`);assert(b.visible&&b.hit,`${b.id}: visible and reachable`);}
 assert.equal(layout.scroll,0);assert.equal(layout.overflow,false);await closeHUD(p);
}
async function assist(p){await closeHUD(p);await p.locator('#context-assist').click();const f=await action(p);assert.equal(f.progress[f.phase],1);return f;}
async function phase(p,name){await p.waitForFunction(name=>Valerie.state().forest?.phase===name,name);assert.equal((await action(p)).phase,name);}
async function touch(p,route,{finish=true}={}){
 const s=await state(p),f=s.forest,frame=s.view.frame;
 // The renderer may publish its physical target. Otherwise normalized model coordinates
 // map to the useful cinematic frame, never CSS viewport percentages.
 const targets=f.targets||s.world?.forest?.targets||s.world?.forestTargets||[];
 const kind=route==='tree'?(f.phase==='discover'?'listen':'map'):'guide';
 const target=targets.find(t=>t.kind==='forest-'+kind||t.kind===kind||t.kind===(kind==='guide'?'light':kind==='listen'?'tree':kind));
 const source=kind==='guide'?f.light:kind==='map'?f.map:{x:.5,y:.5};
 const at=target?{x:target.x,y:target.y}:{x:frame.x+source.x*frame.w,y:frame.y+source.y*frame.h};
 const cdp=await p.context().newCDPSession(p),point={x:at.x,y:at.y,id:11};
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});
 await p.waitForTimeout(60);
 assert.equal((await action(p)).interacting,true,`${route}/${f.phase}: actual pointer hits the scene`);
 if(kind==='listen')await p.waitForTimeout(finish?2050:440);
 else for(let n=1;n<=(finish?20:3);n++){
  const x=frame.x+(.2+(n%2)*.55)*frame.w,y=frame.y+(.25+(n%3)*.15)*frame.h;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y,id:11}]});await p.waitForTimeout(22);
 }
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
 const after=await action(p);assert.equal(after.interacting,false);assert(after.progress[f.phase]>f.progress[f.phase],`${route}/${f.phase}: gesture changes world progress`);
 if(finish)assert(after.progress[f.phase]>.98,`${route}/${f.phase}: broad forgiving gesture completes ${JSON.stringify(after)}`);
 return after;
}
async function complete(p,route,{gesture=false}={}){
 const initial=await enter(p,route);await controls(p);
 await p.waitForTimeout(300);assert.equal((await action(p)).progress.discover,initial.progress.discover,'idle time cannot perform the interaction');
 if(gesture)await touch(p,route);else await assist(p);
 await clickNext(p);await phase(p,'shape');
 if(gesture)await touch(p,route);else await assist(p);
 await clickNext(p);await phase(p,'cross');
 // Do not cut flight: Next waits for settling; an explicit assistant is always available.
 if((await action(p)).canContinue===false){assert.equal(await p.locator('#next').isEnabled(),false);await closeHUD(p);await p.locator('#context-assist').click();}
 await clickNext(p);await phase(p,'rest');await controls(p);
 const result=await action(p);assert.equal(result.progress.discover,1);assert.equal(result.progress.shape,1);
 return result;
}
(async()=>{
 const browser=await chromium.launch({channel:process.env.VALERIE_BROWSER||'msedge',headless:true});
 const errors=[],results=[],httpRequests=[];
 async function page(options={}){const c=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,...options}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.stack||e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))httpRequests.push(r.url());});await p.goto(BASE);await waitReady(p);await openHUD(p);await p.locator('#chapters').click();await p.locator('#movie-mode').click();await p.locator('#close-chapters').click();await closeHUD(p);assert.equal((await state(p)).playback.mode,'manual');return p;}
 try{
  for(const route of ['firefly','tree']){const p=await page();const f=await complete(p,route,{gesture:true});results.push({route,gesture:true,phase:f.phase});console.log(`${route}: pointer discover/shape, crossing and rest passed`);await p.context().close();}
  {
   const p=await page({reducedMotion:'reduce'});await complete(p,'neutral');let s=await state(p);
   assert.equal(s.story.choices['forest-way'],undefined,'assist cannot invent a choice');assert(s.story.skipped.includes('forest-way'));
   await p.setViewportSize({width:844,height:390});await p.waitForFunction(()=>Valerie.state().view.w===844&&Valerie.state().view.h===390);await controls(p);assert.equal((await action(p)).phase,'rest');
   await p.setViewportSize({width:320,height:568});await p.waitForFunction(()=>Valerie.state().view.w===320);await controls(p);
   results.push({route:'neutral',reduced:true,landscape:true,smallPortrait:true});await p.context().close();
  }
  {
   const p=await page();await enter(p,'firefly');await touch(p,'firefly',{finish:false});const partial=await action(p);
   await p.reload();await waitReady(p);assert.equal((await state(p)).shot,CHAPTER);assert.deepEqual((await action(p)).progress,partial.progress,'reload preserves completed pointer work');assert.equal((await action(p)).interacting,false);
   await assist(p);await clickNext(p);await phase(p,'shape');await assist(p);await clickNext(p);await phase(p,'cross');
   await p.goBack();await phase(p,'shape');assert.equal((await state(p)).shot,CHAPTER);assert.equal(await p.evaluate(()=>location.hash),'#'+CHAPTER);
   await p.goForward();await phase(p,'cross');await openHUD(p);await p.locator('#previous').click();await phase(p,'shape');
   await openHUD(p);await p.locator('#replay').click();await closeHUD(p);await waitReady(p);
   for(let n=0;n<8&&!(await state(p)).narrative.choiceResult;n++){if((await state(p)).narrative.kind==='choice')await p.locator('[data-option="tree"]').click();else await clickNext(p);}
   const reset=await action(p);assert.equal(reset.phase,'discover');assert.equal(reset.progress.discover,0);assert.equal(reset.progress.shape,0);assert.equal(reset.trace.length,0);
   await controls(p);results.push({reload:true,history:true,previous:true,replay:true});await p.context().close();
  }
  assert.deepEqual(errors,[]);if(BASE.startsWith('file:'))assert.deepEqual(httpRequests,[],'Offline release must not request HTTP resources');console.log(JSON.stringify({phase:'F24',offline:BASE.startsWith('file:'),checks:results,browserErrors:errors,httpRequests:httpRequests.length,captures:0}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
