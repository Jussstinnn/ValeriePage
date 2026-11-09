const {chromium}=require(process.env.VALERIE_PLAYWRIGHT||'@playwright/test'),assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true}),context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.stack));
 const state=()=>page.evaluate(()=>Valerie.state()),go=async(i,t=0)=>{await page.evaluate(async({i,t})=>{await Valerie.go(i,{immediate:true,replay:true});Valerie.seek(t);},{i,t});};
 try{
  await page.goto(process.env.VALERIE_URL||'http://127.0.0.1:4184');await page.waitForFunction(()=>window.Valerie?.state().ready);assert.equal((await state()).version,'F8-CANDIDATA');assert((await state()).metrics.firstFrameReady);assert.equal(await page.locator('[data-shot]').count(),19);assert.equal(await page.locator('iframe').count(),0);
  let measured=0,headOverlap=0;
  for(const size of [{width:320,height:568},{width:390,height:844},{width:844,height:390},{width:1440,height:900}]){
   await page.setViewportSize(size);await page.waitForFunction(()=>Valerie.state().view.w===innerWidth&&Valerie.state().view.h===innerHeight);
   for(let i=0;i<5;i++)for(const t of [0,1.8,3.05,4.1,6.5,10.5,15]){
    await go(i,t);const s=await state(),f=s.view.frame;
    for(const actor of s.actors){const r=actor.ink;assert(r.x>=f.x-2&&r.y>=f.y-2&&r.right<=f.x+f.w+2&&r.bottom<=f.y+f.h+3,'silhouette '+JSON.stringify({size,i,t,id:actor.id,r,f}));}
    const pink=s.actors.find(a=>a.id==='pink'),beige=s.actors.find(a=>a.id==='taupe');
    for(const eye of beige.eyes)assert(!(eye.x>pink.face.x&&eye.x<pink.face.right&&eye.y>pink.face.y&&eye.y<pink.face.bottom),'foreground pink must not hide beige eyes');
    if(s.props.contact&&t>=1.8){const p=pink.hands.right,g=beige.hands.left;assert(Math.hypot(p.x-g.x,p.y-g.y)<2.5,'shared paw '+JSON.stringify({size,i,t,p,g}));}
    if(i===1){const p=beige.hands.left,l=s.props.leaf;assert(Math.hypot(p.x-l.x,p.y-l.y)<2.5,'leaf must meet actual drawn paw '+JSON.stringify({size,t,p,l}));}
    const a=pink.face,b=beige.face,over=Math.max(0,Math.min(a.right,b.right)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y));headOverlap=Math.max(headOverlap,over/Math.min(a.w*a.h,b.w*b.h));
    const hit=await page.evaluate(()=>{const errors=[];for(const id of ['sound','chapters','interact','previous','next','pause','replay']){const e=document.getElementById(id),r=e.getBoundingClientRect();if(r.height<43.5||r.width<43.5)errors.push(id+':small');if(e.disabled)continue;const p=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);if(!(p===e||e.contains(p)))errors.push(id+':covered');}return{errors,overflow:document.documentElement.scrollWidth>innerWidth+1||scrollY!==0,caption:document.querySelector('#narration').getBoundingClientRect().bottom,controls:document.querySelector('#controls').getBoundingClientRect().top};});assert.deepEqual(hit.errors,[]);assert(!hit.overflow);assert(hit.caption<hit.controls);measured++;
   }
  }
  await page.setViewportSize({width:390,height:844});await go(1,3);const before=await state();await page.evaluate(()=>Valerie.react('leaf'));const after=await state();assert(after.props.leaf.open>before.props.leaf.open+.1);assert.notDeepEqual(after.actors.find(a=>a.id==='taupe').hands,before.actors.find(a=>a.id==='taupe').hands);await page.reload();await page.waitForFunction(()=>window.Valerie?.state().ready);assert.equal((await state()).time,3);assert((await state()).paused);assert((await state()).stage.events.some(e=>e.kind==='leaf'));
  // Pause is a stable pose, including secondary ears and planted feet.
  const still=await state();await page.waitForTimeout(170);assert.deepEqual((await state()).actors,still.actors);
  await page.mouse.wheel(0,5000);await page.keyboard.press('End');assert.equal((await state()).index,1);assert.equal(await page.evaluate(()=>scrollY),0);
  await page.evaluate(()=>Valerie.restart());await page.evaluate(()=>{for(let i=0;i<4;i++)document.getElementById('next').click();});assert.equal((await state()).index,1);await page.waitForFunction(()=>Valerie.state().transition===1);await page.evaluate(()=>Valerie.pause());
  await go(2,8);await go(3,8);await page.goBack();await page.waitForFunction(()=>Valerie.state().index===2);assert.equal(await page.evaluate(()=>location.hash),'#una-patita-mas');
  await go(4,15);assert((await state()).props.box.reveal===1);const text=await page.locator('#narration').innerText();await page.waitForTimeout(200);assert.equal(await page.locator('#narration').innerText(),text);assert(text.includes('guardé para'));
  await page.evaluate(()=>{Valerie.play();});await page.locator('#sound').click();await page.waitForFunction(()=>Valerie.state().audio.state==='running');await page.locator('#pause').click();await page.waitForFunction(()=>Valerie.state().audio.state==='suspended');assert.equal((await state()).audio.voices,0);
  await page.emulateMedia({reducedMotion:'reduce'});for(let i=0;i<5;i++){await go(i,0);assert.equal((await state()).transition,1);}
  const offline=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),q=await offline.newPage(),requests=[];q.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});q.on('pageerror',e=>errors.push(e.stack));await q.goto(pathToFileURL(path.resolve('VALERIE_ILLUSTRATED_F8.html')).href);await q.waitForFunction(()=>window.Valerie?.state().ready);for(let i=0;i<5;i++){await q.evaluate(i=>Valerie.go(i,{immediate:true}),i);assert.equal(await q.evaluate(()=>Valerie.state().index),i);}assert.deepEqual(requests,[]);await offline.close();assert.deepEqual(errors,[]);
  console.log(JSON.stringify({phase:'F3',measured,maximumFaceRectangleOverlap:headOverlap,actualLeafAndSharedPawConstraints:true,controls44:true,heldNarration:true,offlineShots:5,captures:0}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
