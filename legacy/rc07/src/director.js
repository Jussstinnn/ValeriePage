(() => {
 'use strict';
 const $=id=>document.getElementById(id),{clamp,ease,mix}=window.VMath;
 const story=window.VStory,chapters=story.chapters,canvas=$('screen'),ctx=canvas.getContext('2d',{alpha:false});
 const session=new window.VSession(),fx=new window.VEffects(),sound=new window.VSound(),ring=new window.VRing(),direction=new window.VDirection(session),runtime=new window.VFilmRuntime(),worlds=new window.VWorldStage(session),letterScene=new window.VLetterScene(),ceremony=new window.VCeremonyScene(ring),composer=new window.VShotComposer();
 const budget=new VRenderBudget(),policy=new VNavigationPolicy(session),spatial=new VSpatialWorld(),paintingWorld=new VPaintingWorld(),atelier=new VMemoryAtelier(session);
 const living=new VLivingSequence(session),haptics=new VHaptics();
 const creative=new VCreativeStage(),universe=new VUniverse(session),editorial=new VEditorial();
 const journey=new VJourney({policy,request:i=>go(i,{instant:true,fromScroll:true}),change:()=>{if(!busy&&!reduced.matches&&index>=0&&index<9)spatial.preview(index,journey.progress,width,height);draw();if(!paused)schedule();},state:()=>({index,busy})});
 const letterLight=$('letter-light'),letterLightCtx=letterLight.getContext('2d');
 const blended=document.createElement('canvas'),blendCtx=blended.getContext('2d'),edgeMask=document.createElement('canvas'),maskCtx=edgeMask.getContext('2d');
 let width=innerWidth,height=innerHeight,dpr=1,index=-1,time=0,totalTime=0,paused=false,automatic=false,busy=false;
 let active=null,raf=0,last=0,coverTime=0,artRect=null,paintRect=null,cut=null,letterPage=0,ringAt=null;
 let chromeAt=0,dialogWasPaused=false,loaderTimer=0,toastTimer=0,epoch=0,clockBeforeHidden=false,artExpanded=false,lastUi=-1,lastBlended=null,lastBlendRevision=-1;
 const saved=session.snapshots,animations=new Set(),metrics={frames:0,maxEngineCost:0,slow:0,quality:'full',sample:[]};
 const presentation={phase:'opening',ready:false,loads:[]};let preparingFrame=null;
 let selectedFlower=null,finaleIntro=false,pointerDown=null,ringCompleted=false;
 let queuedNavigation=null,lastVisibleIndex=-1;
 let layerUpdateCost=0,awakeUntil=0,fontsReady=false;
 let letterArtAt=0,letterIntro=false,letterSeen=new Set(),letterScroll=[0,0,0];
 const ceremonyReady=()=>ceremony.ready(time,ringAt,reduced.matches);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const isPortrait=()=>width<701&&height>width;
 function announce(text){$('status').textContent=text;$('status').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('status').classList.remove('visible'),2600);}
 function animate(el,keyframes,options){if(reduced.matches||paused)return;const a=el.animate(keyframes,{fill:'both',...options});animations.add(a);a.finished.then(()=>{animations.delete(a);a.cancel()}).catch(()=>animations.delete(a));}
 function showChrome(){chromeAt=totalTime;document.body.dataset.chrome='visible';$('controls').inert=false;}
 function schedule(){if(!raf&&!document.hidden)raf=requestAnimationFrame(tick);}
 async function size(){
  const oldWidth=width,oldHeight=height;
  const held=index>=0?takeSnapshot():null;
  if(index>=0)cut=null;
  const viewport=canvas.getBoundingClientRect();width=viewport.width||innerWidth;height=viewport.height||innerHeight;dpr=Math.min(devicePixelRatio||1,budget.profile.dpr);
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  letterLight.width=Math.round(width*dpr);letterLight.height=Math.round(height*dpr);letterLightCtx.setTransform(dpr,0,0,dpr,0,0);fx.fit(width,height);if(index===10)renderRingCopy();layout();
  if(active?.ready&&!busy&&Math.abs(oldWidth-width)<2&&(oldHeight>oldWidth)===(height>width)){draw();return;}
  if(active?.ready&&!busy){
   const engine=active;busy=true;presentation.phase='resizing';presentation.ready=false;preparingFrame=held;document.body.dataset.preparing='true';draw();
   try{do{await engine.resize(width,height)}while(active===engine&&(Number(engine.frame?.width)!==width||Number(engine.frame?.height)!==height));
   if(active===engine){busy=false;presentation.phase='visible';presentation.ready=true;document.body.dataset.preparing='false';layout();lastBlended=null;draw();preparingFrame=null;if(queuedNavigation){const q=queuedNavigation;queuedNavigation=null;go(q.next,q.options)}else if(!paused)schedule();}}catch(error){if(active===engine)handleSceneError(error);}
  }else{if(index===9){letterScroll[letterPage]=$('letter-reading').scrollTop;renderLetter(letterPage,{restore:true});}if(index===11)universe.key='';universe.endingKey='';draw();}
 }
 function layout(){
  const zone=$('art-zone');
  const paceParent=width>height&&height<=550?$('frame-top'):document.querySelector('.progress-row');
  if($('volume-control').parentElement!==paceParent){if(paceParent.id==='frame-top')paceParent.insertBefore($('volume-control'),document.querySelector('.top-actions'));else paceParent.append($('volume-control'));}
  if($('auto').parentElement!==paceParent){const focused=document.activeElement===$('auto');if(paceParent.id==='frame-top')paceParent.insertBefore($('auto'),document.querySelector('.top-actions'));else paceParent.prepend($('auto'));if(focused)$('auto').focus({preventScroll:true});}
  zone.style.top='';zone.style.bottom='';
  const caption=$('scene-bottom');document.body.style.setProperty('--caption-height',Math.ceil(caption.hidden?140:caption.getBoundingClientRect().height)+'px');
  const r=zone.getBoundingClientRect();artRect={x:r.x,y:r.y,w:r.width,h:r.height};
 }
 function copy(chapter){
  $('scene-act').textContent=chapter.act;$('story-reader-title').textContent=chapter.name;$('story-reader-text').textContent=chapter.line||'';$('read-story').hidden=false;
  $('scene-title').textContent=chapter.name;
  $('scene-line').replaceChildren();$('scene-line').setAttribute('aria-label',chapter.line||'');
  $('scene-line').textContent=chapter.line||'';editorial.enter(chapter,time);animate($('scene-line'),[{opacity:.65,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:750,easing:'cubic-bezier(.16,1,.3,1)'});
  $('full-bouquet').hidden=index!==5;document.body.dataset.flowerSelected='false';$('interact').textContent=index===8?'Explorar las luces':chapter.action||'';$('art-hint').textContent=chapter.hint||'';
  $('art-touch').setAttribute('aria-label',`${chapter.short}. ${chapter.line} ${chapter.hint}`);
  $('memory-dial').hidden=chapter.layout!=='memory';
  document.querySelectorAll('[data-memory]').forEach(b=>b.setAttribute('aria-current',String(+b.dataset.memory===index)));
  animate($('scene-title'),[{opacity:.2,transform:'translateX(-12px)'},{opacity:1,transform:'none'}],{duration:1000,easing:'cubic-bezier(.2,.8,.2,1)'});
 }
 function updateUI(){
  policy.stage({index,page:letterPage,opened:ringAt!==null,ready:ceremonyReady(),busy,error:presentation.phase==='error'});
  runtime.sync({id:chapters[index]?.id||'opening',time,paused,busy,error:presentation.phase==='error',cut,interacting:!!pointerDown});
  document.body.dataset.filmState=runtime.phase;document.body.dataset.shot=runtime.shot||'';
  $('pause').setAttribute('aria-label',paused?'Reanudar la historia':'Pausar la historia');$('pause').title=paused?'Reanudar la historia':'Pausar la historia';
  $('pause-icon').innerHTML=paused?'<path d="m8 5 11 7-11 7Z" fill="currentColor"/>':'<path d="M8 5v14M16 5v14" fill="none" stroke="currentColor" stroke-width="2"/>';
  const c=chapters[index];if(!c){$('previous').disabled=true;$('next').disabled=false;$('next').querySelector('span').textContent='Entrar';$('progress').value=0;$('progress-label').textContent='Inicio';return;}
  $('previous').setAttribute('aria-label','Capítulo anterior');$('replay').setAttribute('aria-label',index===10?'Repetir la apertura':index===9?'Volver al primer folio':'Repetir esta escena');
  $('previous').disabled=index===0;$('next').disabled=index===chapters.length-1;
  $('next').querySelector('span').textContent=index===0?'Seguir la luz':index===1?'Seguir al conejito':index===2?'Entrar en la noche':index===5?'Los recuerdos':index===8?'La carta':index===9?'La sorpresa':index===10?'La última página':'Siguiente';
  if(index===9){$('next').querySelector('span').textContent=letterPage<2?'Seguir leyendo':'La sorpresa';$('previous').setAttribute('aria-label',letterPage>0?'Folio anterior':'Volver a los recuerdos');}
  else if(index===10)$('next').querySelector('span').textContent=ringAt===null?'Abrir la cajita':ceremonyReady()?(journey.progress<.75?'Entrar en el brillo':'La última página'):'Contempla la apertura';
  const local=journey.active?journey.progress:index<6?Math.min(1,time/c.duration):index<9?Math.min(1,time/c.engineDuration):index===9?(letterPage+1)/3:index===10?(ringAt===null?0:.8):1;
  $('progress').value=(index+local)/chapters.length*100;
  $('progress-label').textContent=`${index+1} / ${chapters.length}`;
  $('act-progress').textContent=index<6?'Un mundo para ti':index<9?'Los recuerdos':index===9?'La carta':index===10?'La sorpresa':'Una nueva página';
  $('auto').textContent=journey.mode==='guided'?'Modo guiado':'Explorar';$('auto').setAttribute('aria-pressed',String(automatic));$('auto').setAttribute('aria-label',automatic?'Explorar deslizando':'Activar reproducción guiada');
  document.querySelectorAll('[data-chapter]').forEach(b=>{if(+b.dataset.chapter===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
 }
 function setPause(value,{silent=false}={}){
  paused=!!value;
  if(paused){active?.pause();for(const a of document.getAnimations())a.pause();if(raf){cancelAnimationFrame(raf);raf=0;}}
  else{awakeUntil=Math.max(awakeUntil,time+8);if(index<9)active?.play();for(const a of document.getAnimations())a.play();last=0;schedule();}
  sound.setAllowed(!paused&&!document.hidden&&!$('chapter-dialog').open).catch(()=>{});
  updateUI();showChrome();draw();
  if(!silent&&index>=0)announce(paused?'Historia en pausa. Quédate aquí cuanto quieras.':'La historia continúa.');
 }
 function save(){if(index<0||!presentation.ready)return;const s=active?.state();if(index===9)letterScroll[letterPage]=$('letter-reading').scrollTop;session.saveSnapshot(index,{time,storyProgress:journey.index===index?journey.progress:(saved.get(index)?.storyProgress||0),engineTime:Number(s?.time??s?.t)||0,paused,letterPage,letterScroll:[...letterScroll],letterSeen:[...letterSeen],ringAt,ringCompleted,selectedFlower,fullBouquet:!!creative.fullBouquet,engineState:active?.narrativeState()||null,direction:direction.snapshot()});}
 function sceneBounds(i){if(i<0)return{x:0,y:0,w:width,h:height};const el=i===9?$('letter-reading'):i===11?$('finale-title'):null;if(el){const r=el.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};}return paintRect?{...paintRect}:null;}
 function takeSnapshot(){const c=document.createElement('canvas');c.width=canvas.width;c.height=canvas.height;c.getContext('2d').drawImage(canvas,0,0);return c;}
 function normalizeRoute(i){const url=i>=0?'#'+chapters[i].id:location.pathname+location.search;if((i>=0&&location.hash!==url)||(i<0&&location.hash))history.replaceState({world:i},'',url);}
 async function go(next,{replay=false,instant=false,fromScroll=false}={}){
  if(next===index&&!replay&&busy&&presentation.phase==='preparing'){normalizeRoute(index);return;}
  const requested=policy.resolve(next);if(requested.index<0){normalizeRoute(index);return;}if(requested.blocked){next=requested.index;fromScroll=false;announce(next===9?'La carta te espera. Puedes leerla o elegir saltarla.':'La cajita te espera. Puedes abrirla o elegir saltar la ceremonia.');if(next===index){journey.align(index,journey.progress);history.replaceState(null,'','#'+chapters[index].id);setPause(paused,{silent:true});return;}}
  if(busy){if(presentation.phase==='preparing'){++epoch;active?.dispose();active=null;busy=false;clearTimeout(loaderTimer);queuedNavigation=null;return go(next,{replay,instant,fromScroll});}queuedNavigation={next,options:{replay,instant,fromScroll}};return;}
  if(next===index&&!replay){normalizeRoute(index);return;}
  if(pointerDown){for(const id of ['art-touch','light-grip'])if($(id).hasPointerCapture?.(pointerDown.id))$(id).releasePointerCapture(pointerDown.id);pointerDown=null;direction.release();}
  busy=true;const token=++epoch;if(index===10&&next===11&&ceremonyReady())ringCompleted=true;save();if(replay){session.replay(next);policy.replay(next);}
  const from=lastVisibleIndex>=0?chapters[lastVisibleIndex]:null,outgoing=takeSnapshot();
  cut=null;
  const outgoingArt=sceneBounds(index);
  const nextChapter=chapters[next];
  const loadStart=performance.now();presentation.phase='preparing';presentation.ready=false;preparingFrame=outgoing;document.body.dataset.preparing='true';
  if(replay)direction.replay(next);
  sound.setChapter(next);
  if(active?.canvas){universe.collect(active.chapter.id,active.canvas);spatial.remember(index,index===3||(index===5&&selectedFlower!==null)?canvas:active.canvas,index===3||(index===5&&selectedFlower!==null)?{x:artRect.x/width,y:artRect.y/height,w:artRect.w/width,h:artRect.h/height}:creative.camera||{x:0,y:0,w:1,h:1});}
  active?.dispose();active=null;lastBlended=null;lastBlendRevision=-1;
  for(const a of animations)a.cancel();animations.clear();
  const state=!replay?session.getSnapshot(next):null;
  journey.entered(next,fromScroll,state?.storyProgress||0);
  index=next;time=state?.time||0;creative.fullBouquet=!!state?.fullBouquet;creative.eventAt=state?time-3:time;creative.previousLens=null;awakeUntil=0;paused=state?.paused??paused;last=0;ringAt=state?.ringAt??null;ringCompleted=state?.ringCompleted||false;letterPage=state?.letterPage||0;letterScroll=state?.letterScroll||[0,0,0];letterSeen=new Set(state?.letterSeen||[]);artExpanded=false;selectedFlower=state?.selectedFlower??null;
  document.body.dataset.mode='film';document.body.dataset.layout=nextChapter.layout||nextChapter.id;document.body.dataset.scene=nextChapter.id;document.body.dataset.ringOpen='false';document.body.style.setProperty('--accent',nextChapter.color);
  document.body.classList.remove('scene-copy-focus');
  $('cover').hidden=true;$('read-story').hidden=next>=9;if(!$('story-reader').hidden&&!readerWasPaused)paused=false;$('story-reader').hidden=true;$('read-story').setAttribute('aria-expanded','false');$('controls').hidden=false;$('wake-controls').hidden=false;
  for(const id of ['scene-copy','art-zone','scene-bottom','letter','ring','finale'])$(id).hidden=true;
  showChrome();$('scene-error').hidden=true;
  updateUI();
  loaderTimer=setTimeout(()=>{$('loader').hidden=false;},450);
  try{
   await document.fonts.ready;
   if(token!==epoch)return;
   if(next<9){
    $('scene-copy').hidden=false;$('scene-bottom').hidden=false;$('art-zone').hidden=false;copy(nextChapter);layout();
    const warm=spatial.take(next),engine=warm||new window.VEngine(nextChapter);active=engine;
    if(!warm)await engine.prepare(width,height);engine.setProfile(budget.profile);
    if(token!==epoch){engine.dispose();return;}
    while(Number(engine.frame.width)!==width||Number(engine.frame.height)!==height){await engine.resize(width,height);if(token!==epoch)return;}
    direction.enter(index,time,{snapshot:state?.direction,origin:state?null:session.light,rect:fitArt(engine.canvas,artRect,direction.shot(index,time,reduced.matches))});if(index===1)engine.api.direct?.(direction.x,direction.y,Math.max(journey.progress*25,Math.min(time,6.8)),'listen');
    if(reduced.matches){time=nextChapter.focus;engine.seek(nextChapter.engineDuration);}
    else if(state){engine.restore(state.engineTime,state.engineState);}
    else engine.seek(next===0?3:next===1?4.5:next===2?6.7:next===3?10:next===4?6:3.4);
    if(next===5&&!state){engine.api.seedFlower?.(worlds.gardenSeed());engine.seek(reduced.matches?nextChapter.engineDuration:3.4);}
    if(next===5&&selectedFlower!==null)selectFlower(selectedFlower,false,{silent:true});
    if(!paused&&!reduced.matches)engine.play();
   }else if(next===9){$('letter').hidden=false;letterScene.matter=[...universe.matter.values()].flat().slice(-96);renderLetter(letterPage,{restore:!!state,newScene:true});}
   else if(next===10){$('ring').hidden=false;renderRingCopy();}
   else{$('finale').hidden=false;if(!state)time=0;revealFinale(!!state);}
   if(!instant&&!reduced.matches&&!paused){cut={from:outgoing,art:outgoingArt,kind:from?window.VScore.get(from.id).exit:'opening-path',time:0,duration:from?.transition==='petals'?2.8:2.0,point:session.light?{x:session.light.screenX*width,y:session.light.screenY*height}:{x:width*.72,y:height*.52},morph:null};sound.cue('cut');}
   if(next>=9)direction.enter(index,time,{snapshot:state?.direction});worlds.enter(nextChapter.id);if(next===5&&selectedFlower!==null){worlds.selectedFlower=selectedFlower;active?.api.restoreSelection?.(selectedFlower);}
   if(queuedNavigation){const q=queuedNavigation;queuedNavigation=null;if(q.next!==index||q.options.replay){clearTimeout(loaderTimer);busy=false;return go(q.next,q.options);}}
   if(reduced.matches){paused=true;sound.setAllowed(false).catch(()=>{});}
   clearTimeout(loaderTimer);$('loader').hidden=true;busy=false;document.body.dataset.preparing='false';presentation.phase='visible';presentation.ready=true;lastVisibleIndex=index;sound.setAllowed(!paused&&!document.hidden).catch(()=>{});layout();$('scene-line').tabIndex=$('scene-line').scrollHeight>$('scene-line').clientHeight+2?0:-1;updateUI();draw();
   const probe={chapter:nextChapter.id,loadMs:performance.now()-loadStart,firstVisibleRafMs:null,firstFrame:active?.prepared||null,rect:{...paintRect},viewport:{width,height,dpr},fonts:document.fonts.status};presentation.loads.push(probe);if(presentation.loads.length>60)presentation.loads.shift();requestAnimationFrame(()=>{if(token===epoch&&presentation.phase==='visible')probe.firstVisibleRafMs=performance.now()-loadStart});preparingFrame=null;
   if(location.hash!=='#'+nextChapter.id)history[fromScroll?'replaceState':'pushState']({world:next},'','#'+nextChapter.id);
   if(!paused){last=0;schedule();}
  }catch(error){
   if(token!==epoch)return;
   return handleSceneError(error);
  }
 }
 function handleSceneError(error){
   active?.dispose();active=null;clearTimeout(loaderTimer);$('loader').hidden=true;busy=false;document.body.dataset.preparing='false';presentation.phase='error';presentation.ready=false;
   const queued=queuedNavigation;queuedNavigation=null;if(queued&&queued.next!==index){return go(queued.next,queued.options);}
   normalizeRoute(index);presentation.error=String(error.message||error);setPause(true,{silent:true});$('scene-error').hidden=false;announce('Esta obra no pudo prepararse. Puedes reintentar o continuar.');updateUI();
 }
 function renderLetter(page,{restore=false,newScene=false}={}){
  if(!restore&&!newScene)letterScroll[letterPage]=$('letter-reading').scrollTop;
  page=clamp(page,0,2);const fresh=!restore&&!letterSeen.has(page);letterSeen.add(page);
  letterArtAt=fresh?time:time-4;letterIntro=fresh&&!paused&&!reduced.matches;last=0;
  letterPage=page;document.body.dataset.folio=String(page);const part=story.letter[letterPage];
  $('letter-folio').textContent=`${letterPage+1} de 3 · Una carta para Valerie`;
  $('letter-section').textContent=part.title;$('letter-text').replaceChildren();$('signature').hidden=letterPage!==2;
  letterScene.compose($('letter-text'),part.text,{fresh,animate,page});
  $('signature').textContent=story.signature;
  $('letter-back').disabled=letterPage===0;$('letter-next').firstChild.textContent=letterPage===2?'Hay una sorpresa ':'Seguir leyendo ';
  $('letter-reading').scrollTop=letterScroll[letterPage]||0;
  requestAnimationFrame(()=>{$('letter-scroll-note').hidden=$('letter-reading').scrollHeight<=$('letter-reading').clientHeight+2;});
  if(letterPage===2&&fresh)animate($('signature'),[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:1700,delay:300});
  updateUI();
  draw();if(!paused)schedule();
 }
 function renderRingCopy(){
  const open=ringAt!==null,compact=width>height&&height<=550;
  $('ring-note').textContent=compact?(open?'Quédate aquí cuanto quieras.':'Ábrela cuando estés lista.'):open?'Un pequeño detalle para acompañar algo que quiero preguntarte.':'Ábrela cuando estés lista.';
  $('open-ring').firstChild.textContent=open?(ceremonyReady()?(journey.progress<.75?'Entrar en el brillo ':'La última página '):(compact?'Abriéndose ':'Contempla la apertura ')):(compact?'Abrir cajita ':'Abrir la cajita ');
  $('open-ring').disabled=open&&!ceremonyReady();$('skip-ceremony').hidden=!open||ceremonyReady();$('menu-skip-ceremony').hidden=index!==10;
  document.body.dataset.ringOpen=String(open);updateUI();
 }
 function revealFinale(restored=false){
  finaleIntro=!restored&&!paused&&!reduced.matches;document.body.dataset.questionForming=String(finaleIntro);universe.key='';universe.endingKey='';
  if(!restored)animate($('finale-note'),[{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:1200,delay:3800});
 }
 function fitArt(source,rect,sourceRect=null){
  return composer.place(source,rect,sourceRect);
 }
 function art(source,rect,shot=null){
  const r=fitArt(source,rect,shot);if(!r)return;
  let surface=source;
  if(index<9){
   if(blended.width!==source.width||blended.height!==source.height){
    lastBlended=null;
    blended.width=edgeMask.width=source.width;blended.height=edgeMask.height=source.height;
    const w=source.width,h=source.height;
    const horizontal=maskCtx.createLinearGradient(0,0,w,0);horizontal.addColorStop(0,'#fff0');horizontal.addColorStop(.04,'#fff');horizontal.addColorStop(.96,'#fff');horizontal.addColorStop(1,'#fff0');maskCtx.fillStyle=horizontal;maskCtx.fillRect(0,0,w,h);
    const vertical=maskCtx.createLinearGradient(0,0,0,h);vertical.addColorStop(0,'#fff0');vertical.addColorStop(.035,'#fff');vertical.addColorStop(.965,'#fff');vertical.addColorStop(1,'#fff0');maskCtx.globalCompositeOperation='destination-in';maskCtx.fillStyle=vertical;maskCtx.fillRect(0,0,w,h);maskCtx.globalCompositeOperation='source-over';
   }
   if(lastBlended!==source||lastBlendRevision!==active?.revision){blendCtx.clearRect(0,0,blended.width,blended.height);blendCtx.drawImage(source,0,0);blendCtx.globalCompositeOperation='destination-in';blendCtx.drawImage(edgeMask,0,0);blendCtx.globalCompositeOperation='source-over';lastBlended=source;lastBlendRevision=active?.revision;}surface=blended;
  }
  ctx.save();
  // Multiply a precomputed soft edge on a small intermediary avoids visible iframe/page edges.
  ctx.globalCompositeOperation='lighten';
  if(shot)ctx.drawImage(surface,(shot.x||0)*surface.width,(shot.y||0)*surface.height,shot.w*surface.width,shot.h*surface.height,r.x,r.y,r.w,r.h);else ctx.drawImage(surface,r.x,r.y,r.w,r.h);
  ctx.restore();paintRect=r;
 }
 function draw(){
  const drawStart=performance.now();
  ctx.setTransform(dpr,0,0,dpr,0,0);
  if(busy&&preparingFrame){const scale=Math.min(width/preparingFrame.width,height/preparingFrame.height),w=preparingFrame.width*scale,h=preparingFrame.height*scale;ctx.fillStyle='#090e12';ctx.fillRect(0,0,width,height);ctx.drawImage(preparingFrame,(width-w)/2,(height-h)/2,w,h);return;}
  if(index<0){fx.sky(ctx,coverTime);if(fontsReady)universe.opening(ctx,coverTime,width,height,reduced.matches);return;}
  const exposure=direction.shot(index,time,reduced.matches).exposure||.5;fx.sky(ctx,index>=6&&index<=9?0:time,index>=6&&index<=9?.42:.32+exposure*.48);
  if(index<9&&active?.canvas){
   const shot=creative.cameraFor(index,journey.progress,time,active.api,selectedFlower,reduced.matches,active.canvas);
   if(index<3)spatial.background(ctx,index,journey.progress,time,width,height,reduced.matches);else if(index>=6)atelier.background(ctx,index,journey.progress,time,width,height,reduced.matches);else creative.background(ctx,index,journey.progress,time,width,height);
   living.floor(ctx,{index,progress:journey.progress,time,w:width,h:height,direction,reduced:reduced.matches});active.canvas.__revision=active.revision;
   const field=index>=6?atelier.field(index,journey.progress,artRect):artRect;ctx.save();if(index>=6)atelier.exposure(ctx,index,time,field,reduced.matches||paused);paintRect=spatial.compose(ctx,{index,progress:journey.progress,source:active.canvas,shot,field,place:(source,rect,lens)=>creative.place(source,rect,lens),reduced:reduced.matches,light:{x:shot.x+direction.x*shot.w,y:shot.y+direction.y*shot.h}});ctx.restore();
   if(index===5&&selectedFlower!==null&&creative.macroMix>0){active.api.setSpecimenLight?.(direction.x,direction.y,reduced.matches||paused);const macro=active.api.macroFrame?.(selectedFlower);if(macro){ctx.save();ctx.globalAlpha=creative.macroMix;ctx.drawImage(macro,paintRect.x,paintRect.y,paintRect.w,paintRect.h);ctx.restore();}}
   if(index===3)paintingWorld.draw(ctx,{api:active.api,progress:journey.progress,time,rect:artRect,w:width,h:height,reduced:reduced.matches,neighbour:spatial.neighbour(4),place:(s,r,l)=>creative.place(s,r,l),surface:spatial.surface});
   const layerStart=performance.now();
   direction.draw(ctx,index,time,paintRect,reduced.matches);direction.drawMemory(ctx,index,time,paintRect,reduced.matches);
   if(index<3)living.foreground(ctx,{index,progress:journey.progress,time,w:width,h:height,spatial,reduced:reduced.matches,light:{x:direction.x,y:direction.y}});else creative.foreground(ctx,index,journey.progress,time,width,height);
   worlds.draw(ctx,{id:chapters[index].id,time,rect:paintRect,source:active.canvas,api:active.api,shot,direction,reduced:reduced.matches});
   if(index===5&&selectedFlower!==null){drawFlowerSelection();}atelier.observe(ctx,{index,progress:journey.progress,time,w:width,h:height,universe,reduced:reduced.matches});
   direction.recordLayer(performance.now()-layerStart+layerUpdateCost);
  }else if(index===9){
   const layerStart=performance.now(),reader=$('letter-reading');letterLightCtx.clearRect(0,0,width,height);const light=letterScene.draw(letterLightCtx,reader.getBoundingClientRect(),letterIntro?time-letterArtAt:4,{page:letterPage,scroll:reader.scrollTop/Math.max(1,reader.scrollHeight-reader.clientHeight),memories:session.memories.size,reduced:reduced.matches});direction.lastPoint=light;session.light={...direction.snapshot(),screenX:light.x/width,screenY:light.y/height};direction.recordLayer(performance.now()-layerStart);
  }else if(index===10){
   const copyEnd=document.querySelector('.ceremony-copy').getBoundingClientRect().bottom,actionStart=document.querySelector('.ceremony-action').getBoundingClientRect().top;
   const top=Math.max(height*.20,copyEnd+8),rect=isPortrait()?{x:16,y:top,w:width-32,h:Math.max(80,actionStart-top-22)}:{x:width*.37,y:height*.13,w:width*.57,h:height*.66};
   art(ceremony.frame(time,ringAt,reduced.matches),rect,ceremony.camera(time,ringAt,reduced.matches));
   if(ringAt!==null&&ceremonyReady()&&journey.progress>.67)universe.interlude(ctx,ease((journey.progress-.67)/.30),time,width,height,reduced.matches,{origin:ceremony.light(paintRect),jewel:ring.canvas});
   const jewel=ceremony.light(paintRect,time,ringAt,reduced.matches);
   ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=.75;ctx.drawImage(direction.glow,jewel.x-18,jewel.y-18,36,36);ctx.fillStyle='#fff0cb';ctx.font='10px monospace';ctx.fillText('+',jewel.x,jewel.y);ctx.restore();direction.lastPoint=jewel;session.light={...direction.snapshot(),screenX:jewel.x/width,screenY:jewel.y/height};
  }else if(index===11){const layerStart=performance.now();universe.draw(ctx,finaleIntro?time:Math.max(12,time),journey.progress,width,height,reduced.matches);direction.recordLayer(performance.now()-layerStart);}
  const grip=$('light-grip'),lightPoint=direction.lastPoint;grip.hidden=index<0||index>5||!lightPoint||busy;if(!grip.hidden){grip.style.left=Math.max(0,Math.min(width-48,lightPoint.x-24))+'px';grip.style.top=Math.max(65,Math.min(height-180,lightPoint.y-24))+'px';}
  if(cut){
   const q=clamp(Math.max(cut.time/cut.duration,journey.progress<.24?journey.progress/.24:0)),target=sceneBounds(index)||artRect;
   if(!cut.morph)cut.morph=new window.VGlyphTransition({kind:cut.kind,source:cut.from,from:cut.art,to:target,origin:cut.point,titlePoints:direction.titlePoints});
   cut.morph.draw(ctx,q,width,height,cut.from);
   const destination=index===11?(direction.finaleNodes[2]||{x:width*.5,y:height*.2}):direction.point(index,time,target),point=direction.transitionPoint(q,cut.point,destination);
   ctx.save();ctx.globalAlpha=.8;ctx.drawImage(direction.glow,point.x-18,point.y-18,36,36);ctx.restore();
  }
  budget.record(performance.now()-drawStart,active?.cost||0);
 }
 function tick(stamp){
  raf=0;
  if(document.hidden)return;
  if(last&&stamp-last<(1000/budget.profile.fps)){schedule();return;}
  const dt=last?Math.min(.12,(stamp-last)/1000):0;last=stamp;
  totalTime+=dt;
  if(index<0){if(paused||!fontsReady)return;coverTime+=dt;draw();if(coverTime<4&&!reduced.matches)schedule();return;}
  if(paused||busy)return;
  time+=dt;editorial.update(time);journey.step(dt,{paused,busy,reduced:reduced.matches});const layerStart=performance.now();direction.update(dt,index,time,reduced.matches);layerUpdateCost=performance.now()-layerStart;applyDiscovery(direction.consume());
  if(index===1){const lens=creative.camera||{x:0,y:0,w:1,h:1};active?.api.direct?.(lens.x+direction.x*lens.w,lens.y+direction.y*lens.h,Math.max(journey.progress*25,Math.min(time,6.8)),creative.camera?.actor||'listen');}
  if((index<6||time<20||selectedFlower!==null)&&!(index===3&&journey.progress>.46))active?.step(dt);
  if(index===1)sound.action(active?.state()?.acting?.beat,direction.x);
  if(index===11)document.body.dataset.questionForming=String(finaleIntro&&time<4.05&&!reduced.matches);
  if(cut){cut.time+=dt;if(cut.time>=cut.duration)cut=null;}
  const c=chapters[index];
  if(index>=6&&index<9&&time>=Math.min(window.VScore.get(c.id).hold,c.engineDuration*.85))session.visitMemory(index);
  if(index<9){
   if(active){metrics.maxEngineCost=Math.max(metrics.maxEngineCost,active.cost);if(active.cost>40){metrics.slow++;if(metrics.slow>5){active.balance();fx.quality=.55;metrics.quality='balanced';}}}
  }
  metrics.frames++;
  if(metrics.sample.length<180&&dt>0)metrics.sample.push(Math.round(dt*10000)/10);
  // Guided mode advances the native distance; manual scenes never expire.
  if(totalTime-lastUi>.2){if(index===10)renderRingCopy();else updateUI();lastUi=totalTime;}draw();
  const phase=runtime.sync({id:c.id,time,paused,busy,cut,interacting:!!pointerDown});
  document.body.dataset.filmState=phase;document.body.dataset.shot=runtime.shot;sound.score(c.id,runtime.shot);sound.distance(journey.progress);
  if(runtime.needsFrame({id:c.id,time,paused,busy,cut,openedAt:ringAt,letterAt:letterArtAt,reduced:reduced.matches,progress:journey.progress,guided:journey.mode==='guided'}))schedule();
 }
 function interact(nx=.5,ny=index===0?.2:.45){
  if(index<0||index>8||busy)return;
  journey.event('touch-'+chapters[index].id);living.react(index,time);if(index===8&&journey.progress>.62){announce(atelier.touch(time));draw();return;}if(index===3)paintingWorld.touch(time);
  showChrome();
  awakeUntil=Math.max(awakeUntil,time+4);last=0;if(!paused)schedule();
  if(index===5){selectFlower(selectedFlower===null?0:(selectedFlower+1)%14,true);return;}
  if(paused&&!reduced.matches){announce('Reanuda la historia para ver la respuesta.');return;}
  if(index<6){direction.interact(index,time);applyDiscovery(direction.consume());}
  else active?.interact(nx,ny);
  fx.touch={x:nx,y:ny,at:time};
  if(index===0)$('art-hint').textContent='La estrella dejó una huella.';
  if(index===1)$('art-hint').textContent='Él conoce el sendero.';
  if(index===2)$('art-hint').textContent='El bosque ya está despierto.';
  draw();
 }
 function applyDiscovery(event){
  if(!event||event.index!==index)return;worlds.event(chapters[index].id,event);awakeUntil=Math.max(awakeUntil,time+8);
  if(index===5){const seed=worlds.gardenSeed();active?.api.selectFlower?.(seed);if(event.manual)selectFlower(seed,false);}
  else{const shot=direction.shot(index,time,reduced.matches);active?.interact(shot.x+direction.x*shot.w,shot.y+direction.y*shot.h);}
  if(event.manual){sound.cue(event.id,direction.x);haptics.pulse(event.id);}
 }
 function flowerPosition(id){
  const f=active?.api.flowerPoints?.[id];if(!f||!paintRect)return null;
  return composer.fromSource(f,paintRect,creative.camera||direction.shot(index,time,reduced.matches));
 }
 function selectFlower(id,discover,{silent=false}={}){
  journey.event('flower-'+id);creative.fullBouquet=false;creative.snapSelection=paused;
  const f=active?.api.flowerPoints?.[id],focus=direction.shot(index,time,reduced.matches).focus;direction.selectedFocus=f?{x:f.x,y:f.y,at:time,from:focus}:null;
  document.body.dataset.flowerSelected='true';$('full-bouquet').hidden=false;selectedFlower=id;if(silent){active?.api.restoreSelection?.(id);worlds.restoreFlower(id,time);}else{active?.api.selectFlower?.(id);worlds.selectFlower(id,time,{color:active?.api.flowerProfiles?.[id]?.color});awakeUntil=Math.max(awakeUntil,time+4);last=0;if(!paused)schedule();}if(active)active.revision++;if(discover){direction.interact(5,time);direction.consume();}
  $('scene-line').textContent=story.gardenDedications[id];editorial.text=story.gardenDedications[id];$('story-reader-text').textContent=story.gardenDedications[id];$('scene-line').setAttribute('aria-label',story.gardenDedications[id]);$('interact').textContent='Descubrir otra flor';$('art-hint').textContent='Un detalle para guardar.';if(!silent){sound.cue('petal');haptics.pulse('petal');}draw();
 }
 function drawFlowerSelection(){
  const p=flowerPosition(selectedFlower);if(!p)return;
  ctx.save();ctx.fillStyle='#efd6c3';ctx.font='10px monospace';ctx.textAlign='center';ctx.globalAlpha=.65;
  for(let j=0;j<12;j++){const a=j/12*Math.PI*2;ctx.fillText(j%3===0?':':'·',p.x+Math.cos(a)*28,p.y+Math.sin(a)*22);}ctx.restore();
 }
 function home(){
  $('light-grip').hidden=true;$('read-story').hidden=true;$('story-reader').hidden=true;
  ++epoch;busy=false;queuedNavigation=null;save();spatial.cancel();journey.exit();active?.dispose();active=null;lastBlended=null;lastBlendRevision=-1;lastVisibleIndex=-1;index=-1;time=0;cut=null;paused=false;coverTime=0;last=0;
  for(const a of animations)a.cancel();animations.clear();
  for(const id of ['scene-copy','art-zone','scene-bottom','letter','ring','finale','wake-controls','scene-error'])$(id).hidden=true;$('controls').hidden=false;presentation.phase='opening';presentation.ready=false;
  $('cover').hidden=false;document.body.dataset.mode='cover';document.body.dataset.chrome='visible';document.body.classList.remove('scene-copy-focus');fx.namePoints=[];fx.nameRect=null;
  clearTimeout(loaderTimer);$('loader').hidden=true;history.replaceState(null,'',location.pathname+location.search);sound.setAllowed(false).catch(()=>{});updateUI();draw();schedule();$('begin').focus({preventScroll:true});
 }
 function openDialog(){
  dialogWasPaused=paused;
  setPause(true,{silent:true});$('chapter-dialog').showModal();document.body.classList.add('dialog-open');
 }
 function closeDialog({resume=true}={}){
  $('chapter-dialog').close();document.body.classList.remove('dialog-open');
  if(resume&&!dialogWasPaused)setPause(false,{silent:true});$('chapters').focus({preventScroll:true});
 }
 $('begin').onclick=()=>{sound.setAllowed(true).catch(()=>{});go(0,{instant:false});};
 function restart(){home();spatial.reset();session.reset();direction.reset();atelier.choice=-1;atelier.positions=[];paintingWorld.chosen=0;paintingWorld.target={x:.70,y:.22};creative.selected=null;ring.last='';universe.exitMatter=[];metrics.frames=0;metrics.maxEngineCost=0;metrics.slow=0;metrics.sample=[];journey.reset();policy.reset();universe.matter.clear();worlds.nodes=[];worlds.selectedFlower=null;selectedFlower=null;letterPage=0;letterSeen.clear();letterScroll=[0,0,0];ringAt=null;ringCompleted=false;paused=false;automatic=false;pointerDown=null;direction.x=.78;direction.y=.18;direction.vx=direction.vy=0;direction.pointer=null;direction.selectedFocus=null;sound.reset();haptics.reset();$('haptics').setAttribute('aria-pressed','false');$('haptics').textContent='Respuesta táctil: apagada';$('sound').setAttribute('aria-pressed','false');$('sound-label').textContent='Sonido apagado';$('sound').setAttribute('aria-label','Activar ambiente sonoro');updateUI();draw();}
 $('home').onclick=home;$('restart').onclick=restart;
 function navigateNarrative(direction){
  if(index===10&&direction>0&&ceremonyReady()&&journey.progress<.75){journey.align(10,.83);last=0;draw();schedule();renderRingCopy();return;}
  if(busy)return;const action=runtime.navigate(direction,{index,id:chapters[index]?.id,page:letterPage,ready:ceremonyReady(),opened:ringAt!==null});
  if(action.type==='folio')renderLetter(action.page);else if(action.type==='open')$('open-ring').click();else if(action.type==='wait')announce('La joya está tomando forma. Puedes contemplarla o pasar a la pregunta.');else go(action.index);
 }
 function advanceNarrative(){if(index===9&&letterPage===2){policy.release('letter','continue');journey.updateLimit();}if(index===10&&ceremonyReady()&&journey.progress>=.75){policy.release('ring','continue');journey.updateLimit();}navigateNarrative(1)}
 function retreatNarrative(){navigateNarrative(-1)}
 $('previous').onclick=retreatNarrative;$('next').onclick=advanceNarrative;
 $('retry-scene').onclick=()=>go(index,{replay:true});$('continue-scene').onclick=()=>go(Math.min(index+1,chapters.length-1));$('menu-skip-ceremony').onclick=()=>{closeDialog({resume:false});paused=dialogWasPaused;policy.release('ring','skip');journey.updateLimit();go(11);};
 $('skip-ceremony').onclick=()=>{policy.release('ring','skip');journey.updateLimit();go(11);};
 $('skip-letter').onclick=()=>{policy.release('letter','skip');journey.updateLimit();go(10);};
 $('pause').onclick=()=>setPause(!paused);
 $('replay').onclick=()=>{if(index<0){home();return}if(index<9)saved.delete(index);go(index,{replay:true});};
 $('auto').onclick=()=>{if(reduced.matches){announce('Movimiento reducido: usa Siguiente para recorrer la historia con calma.');return;}automatic=journey.toggle()==='guided';last=0;schedule();showChrome();updateUI();announce(automatic?'Recorrido guiado. La carta y la sorpresa esperan por ti.':'Explora deslizando. La cámara sigue tu recorrido.');};
 $('quality').onclick=()=>budget.cycle();document.addEventListener('valerie:quality',()=>{active?.setProfile(budget.profile);$('quality').textContent='Calidad: '+({premium:'máxima',balanced:'equilibrada',battery:'ahorro'})[budget.name];size().catch(handleSceneError);});
 let readerWasPaused=false;$('read-story').onclick=()=>{readerWasPaused=paused;$('story-reader').hidden=false;$('read-story').setAttribute('aria-expanded','true');setPause(true,{silent:true});$('close-story').focus({preventScroll:true});};$('close-story').onclick=()=>{$('story-reader').hidden=true;$('read-story').setAttribute('aria-expanded','false');if(!readerWasPaused)setPause(false,{silent:true});$('read-story').focus({preventScroll:true});};
 $('volume').oninput=e=>sound.setVolume(Number(e.target.value)/100);
 $('haptics').hidden=!haptics.supported;$('haptics').onclick=()=>{const on=haptics.toggle();$('haptics').setAttribute('aria-pressed',String(on));$('haptics').textContent=on?'Respuesta táctil: encendida':'Respuesta táctil: apagada';};
 document.addEventListener('valerie:audio-fallback',e=>announce(e.detail));
 $('sound').onclick=async()=>{try{sound.allowed=!paused&&!document.hidden;const on=await sound.toggle();$('sound').setAttribute('aria-pressed',String(on));$('sound').setAttribute('aria-label',on?'Silenciar ambiente sonoro':'Activar ambiente sonoro');$('sound-label').textContent=on?'Sonido encendido':'Sonido apagado';if(index<0&&on){sound.allowed=true;sound.tone(220,3,.018);}if(on&&!paused){last=0;schedule();}announce(on?'Ambiente original activado.':'Sonido apagado.');}catch{announce('No se pudo activar el audio. Puedes continuar en silencio.');}};
 $('interact').onclick=()=>interact();
 $('light-grip').addEventListener('pointerdown',e=>{if(!paintRect||paused)return;pointerDown={x:e.clientX,y:e.clientY,id:e.pointerId};e.currentTarget.setPointerCapture(e.pointerId);direction.grab(clamp((e.clientX-paintRect.x)/paintRect.w),clamp((e.clientY-paintRect.y)/paintRect.h),time);schedule();});
 $('light-grip').addEventListener('pointermove',e=>{if(!pointerDown||!paintRect||paused)return;direction.move(clamp((e.clientX-paintRect.x)/paintRect.w),clamp((e.clientY-paintRect.y)/paintRect.h));if(index===4)worlds.trace(clamp((e.clientX-paintRect.x)/paintRect.w),clamp((e.clientY-paintRect.y)/paintRect.h),time);});
 for(const kind of ['pointerup','pointercancel'])$('light-grip').addEventListener(kind,()=>{direction.release();pointerDown=null;});
 $('light-grip').onclick=e=>{if(e.detail===0)interact();};
 $('full-bouquet').onclick=()=>{creative.fullBouquet=true;direction.selectedFocus={x:.5,y:.5,at:time,from:direction.shot(index,time,reduced.matches).focus};selectedFlower=null;worlds.selectedFlower=null;active?.api.restoreSelection?.(-1);if(active)active.revision++;$('full-bouquet').hidden=false;document.body.dataset.flowerSelected='false';awakeUntil=time+2;last=0;draw();if(!paused)schedule();};
 $('art-touch').addEventListener('pointerdown',e=>{
  if(!paintRect||(paused&&index!==5)||busy)return;
  pointerDown={x:e.clientX,y:e.clientY,id:e.pointerId};
  if(e.pointerType==='mouse'||e.shiftKey)$('art-touch').setPointerCapture(e.pointerId);
  if(index<=5&&!paused)direction.grab(clamp((e.clientX-paintRect.x)/paintRect.w),clamp((e.clientY-paintRect.y)/paintRect.h),time);
  else interact(clamp((e.clientX-paintRect.x)/paintRect.w),clamp((e.clientY-paintRect.y)/paintRect.h));
  awakeUntil=Math.max(awakeUntil,time+5);last=0;if(!paused)schedule();
 });
 $('art-touch').addEventListener('pointermove',e=>{if(!paintRect||paused||!pointerDown)return;const p=composer.toSource({x:e.clientX,y:e.clientY},paintRect,creative.camera||direction.shot(index,time,reduced.matches));direction.move(p.x,p.y);if(index===4)worlds.trace(p.x,p.y,time);});
 $('art-touch').addEventListener('pointerup',e=>{
  if([0,2,3].includes(index)&&pointerDown&&Math.hypot(e.clientX-pointerDown.x,e.clientY-pointerDown.y)<14)interact();
  if(index===1&&pointerDown&&Math.hypot(e.clientX-pointerDown.x,e.clientY-pointerDown.y)<14)interact();
  if(index===5&&pointerDown&&Math.hypot(e.clientX-pointerDown.x,e.clientY-pointerDown.y)<15){let nearest=-1,distance=65;for(let i=0;i<14;i++){const p=flowerPosition(i);if(p){const d=Math.hypot(e.clientX-p.x,e.clientY-p.y);if(d<distance){nearest=i;distance=d}}}if(nearest>=0)selectFlower(nearest,true);}
  if(index===4&&pointerDown&&worlds.nodes.length>=2&&!paused){direction.interact(index,time);applyDiscovery(direction.consume());}
  direction.release();pointerDown=null;
 });
 $('art-touch').addEventListener('pointercancel',()=>{direction.release();pointerDown=null;});
 // Native button click from keyboard, separate from pointerdown to avoid duplicate reactions.
 $('art-touch').addEventListener('click',e=>{if(e.detail===0)interact();});
 document.querySelectorAll('[data-memory]').forEach(b=>b.onclick=()=>go(+b.dataset.memory));
 $('letter-back').onclick=()=>{retreatNarrative();showChrome();};
 $('letter-reading').addEventListener('scroll',()=>{$('letter-scroll-note').hidden=$('letter-reading').scrollTop+$('letter-reading').clientHeight>=$('letter-reading').scrollHeight-3;draw();},{passive:true});
 $('letter-next').onclick=()=>{advanceNarrative();showChrome();};
 $('open-ring').onclick=()=>{
  if(ringAt!==null){if(ceremonyReady())advanceNarrative();return;}
  journey.event('ceremony-opening');journey.align(10,0);haptics.pulse('ring');
  if(paused&&!reduced.matches)setPause(false,{silent:true});ringAt=time;last=0;sound.cue('ring');renderRingCopy();draw();schedule();
 };
 $('wake-controls').onclick=()=>{showChrome();$('pause').focus({preventScroll:true});};
 $('film-main').addEventListener('pointermove',()=>{if(index>=0)showChrome();},{passive:true});
 $('film-main').addEventListener('pointerdown',()=>{if(index>=0)showChrome();},{passive:true});
 $('chapters').onclick=openDialog;$('close-chapters').onclick=()=>closeDialog();
 $('chapter-dialog').addEventListener('cancel',e=>{e.preventDefault();closeDialog();});
 $('chapter-dialog').addEventListener('click',e=>{if(e.target===$('chapter-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
 $('dialog-home').onclick=()=>{closeDialog({resume:false});home();};$('new-story').onclick=()=>{closeDialog({resume:false});restart();};
 chapters.forEach((c,i)=>{
  const li=document.createElement('li'),button=document.createElement('button');button.dataset.chapter=String(i);button.textContent=c.short;
  const small=document.createElement('small');small.textContent=c.name;button.append(small);button.onclick=()=>{closeDialog({resume:false});paused=dialogWasPaused;if(index===i)setPause(dialogWasPaused,{silent:true});else go(i);};li.append(button);$('chapter-list').append(li);
 });
 document.addEventListener('keydown',e=>{
  if(e.key==='Tab')showChrome();
  if($('chapter-dialog').open||e.target.matches('input,textarea,select,[contenteditable]')||e.target.closest('.letter-reading,.scene-line')||e.ctrlKey||e.altKey||e.metaKey)return;
  if(index>=0&&e.code==='Space'&&e.target.tagName!=='BUTTON'){e.preventDefault();setPause(!paused)}
  if(index>=0&&e.key==='ArrowRight'&&e.target.tagName!=='BUTTON'){e.preventDefault();advanceNarrative()}
  if(index>=0&&e.key==='ArrowLeft'&&e.target.tagName!=='BUTTON'){e.preventDefault();retreatNarrative()}
  if(e.key==='Escape'&&!$('story-reader').hidden){$('close-story').click();return;}if(e.key==='Escape'&&index>=0){showChrome();}
 });
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden){spatial.cancel();clockBeforeHidden=paused;setPause(true,{silent:true});}
  else{last=0;draw();if(index<0)schedule();else announce('La historia te esperó. Reanúdala cuando quieras.');}
 });
 let contextWasPaused=false;canvas.addEventListener('contextlost',e=>{e.preventDefault();contextWasPaused=paused;setPause(true,{silent:true});presentation.phase='recovering';spatial.cancel();announce('El escenario está recuperando la luz.');});canvas.addEventListener('contextrestored',()=>{presentation.phase='visible';size().then(()=>setPause(contextWasPaused,{silent:true})).catch(handleSceneError);});window.addEventListener('pageshow',e=>{if(e.persisted){last=0;if(!paused){active?.play();schedule();}draw();sound.setAllowed(!paused&&!document.hidden).catch(()=>{});}});
 window.addEventListener('pagehide',()=>{save();spatial.cancel();if(raf)cancelAnimationFrame(raf);sound.setAllowed(false).catch(()=>{});active?.pause();});
 const captionsObserver=new ResizeObserver(()=>{if(index>=0&&index<9&&!busy){layout();draw();}});captionsObserver.observe($('scene-bottom'));
 let resizeFrame=0;
 window.visualViewport?.addEventListener('resize',()=>{if(resizeFrame)cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;size().catch(handleSceneError)});},{passive:true});
 window.addEventListener('resize',()=>{if(resizeFrame)cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;size().catch(handleSceneError)});},{passive:true});
 reduced.addEventListener('change',()=>{if(reduced.matches){spatial.cancel();automatic=false;journey.mode='explore';if(index<9&&active?.ready)active.seek(chapters[index].engineDuration);setPause(true,{silent:true});}draw();});
 // Explicit inspection API: capabilities and measured state, no fake seek support.
 window.Valerie={
  measureLayers:()=>direction.measureLayers(),
  go,home,restart,next:advanceNarrative,previous:retreatNarrative,pause:()=>setPause(true,{silent:true}),play:()=>setPause(false,{silent:true}),
  seek(seconds){if(index<0||index>=9)return;for(const a of animations)a.finish();cut=null;time=Math.max(0,seconds);direction.seek(index,time);if(index===1)active?.api.direct?.(direction.x,direction.y,time,direction.shot(index,time,reduced.matches).actor);active?.seek(time);setPause(true,{silent:true});layout();$('scene-line').getAnimations().forEach(a=>a.finish());draw();},
  state:()=>({haptics:haptics.state(),living:living.state(),editorial:editorial.state(),atelier:atelier.state(),painting:paintingWorld.state(),budget:budget.state(),spatial:spatial.state(),navigation:policy.state(),journey:journey.state(),creative:creative.state(),universe:universe.state(),film:runtime.state(),index,chapter:chapters[index]?.id||'opening',time,paused,automatic,busy,letterPage,letterScroll:[...letterScroll],selectedFlower,session:session.state(),ringOpened:ringAt!==null,ceremony:{...ceremony.state(),phase:ringCompleted?'finished':ring.phase,ready:ceremonyReady(),drawFrames:ring.drawFrames,camera:ceremony.cameraState},cut:cut?.kind||null,engines:document.querySelectorAll('#engine-host iframe').length,engine:active?.state()||null,engineStats:active?.stats()||null,audio:sound.state(),artRect,paintRect,reduced:reduced.matches,metrics,direction:direction.state(),world:worlds.state(),letter:letterScene.state(),transition:cut?.morph?.state()||null,shot:direction.shot(index,time,reduced.matches),presentation}),
  capabilities:{pause:true,replay:true,seek:'original engine time; nine artworks',singleClock:true,noNetwork:true}
 };
 size();
 $('controls').hidden=false;updateUI();
 document.fonts.ready.then(()=>{fontsReady=true;document.body.dataset.fontsReady='true';fx.nameRect=null;layout();draw();schedule();});
 if(reduced.matches){coverTime=4;draw();}else schedule();
 let deep='';try{deep=decodeURIComponent(location.hash.slice(1));}catch{}const initial=chapters.findIndex(c=>c.id===deep);
 if(initial>=0)go(initial,{instant:true});else{const restored=journey.restore();if(restored>=0)go(restored,{instant:true,fromScroll:true});else normalizeRoute(-1);}
})();
