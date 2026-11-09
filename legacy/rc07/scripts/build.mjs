import {readFile,writeFile,mkdir,cp,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import {directOriginal} from './acting.mjs';
import {actRC07} from './acting-rc07.mjs';
import {actRC06} from './acting-rc06.mjs';
import {actRC05} from './acting-rc05.mjs';
import {actRC04} from './acting-rc04.mjs';
import {change,changeAll} from './checked-adapters.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFile(path.join(root,p),'utf8');
await mkdir(path.join(root,'dist/assets/fonts'),{recursive:true});
const clocks=await read('src/engine-clock.js');
const sampler=await read('src/raster-sampler.js');
const ids=['vineyard','rabbit','mushroom','museum','couple','lily','memory07','memory08','memory09'];
const folders=['07_retrato','08_dos_sonrisas','09_un_instante'];
const originals={},engines={};
const expectedOriginals=JSON.parse(await read('ENGINE_ORIGINAL_HASHES.json'));
for(const [i,id] of ids.entries()){
 const file=i<6?`engines/${id}/index.html`:`memories/${folders[i-6]}/index.html`;
 const raw=await readFile(path.join(root,file));
 originals[id]={file,sha256:createHash('sha256').update(raw).digest('hex'),bytes:raw.length};
 if(originals[id].sha256!==expectedOriginals[id]?.sha256)throw new Error(`Original artwork changed: ${id}. Restore it and put adaptations in build.mjs.`);
 let html=raw.toString('utf8');
 // Derivations only: source files and their hashes stay untouched.
 if(id==='memory07'){
   html=change(html,'  ambientSparkles();',`  window.__portrait07={
     seek(sec){paused=true;start=performance.now()-Math.max(0,Math.min(DURATION,sec))*1000;pausedAt=performance.now();draw(performance.now());},
     replay,
     pause(){if(!paused){paused=true;pausedAt=performance.now();}},
     play(){paused=false;pausedAt=performance.now();},
     getState(){return {time:Math.max(0,Math.min(DURATION,(performance.now()-start)/1000)),playing:!paused,ready};}
   };`);
   // Embedded DOM flourishes and labels are excluded; the original ASCII renderer remains.
   html=change(html,'bg(t); frame(); renderAscii(t); overlays(t);','bg(t); renderAscii(t); filmHearts();');
   html=change(html,'  function overlays(t){',`  function filmHearts(){
     for(let i=hearts.length-1;i>=0;i--){const h=hearts[i];h.life+=1/30;const p=1-h.life/h.max;if(p<=0){hearts.splice(i,1);continue;}drawHeart(h.x+h.vx*h.life*30,h.y+h.vy*h.life*30,h.size*p,p*.8,h.rot,h.hue);}
   }
   function overlays(t){`);
   // Repair the original inverted luminance mapping: bright faces formerly got tiny dots.
   html=change(html,'const cols = W < 700 ? 74 : 92;','const cols = 140;');
   html=change(html,'CHARS[Math.floor((1-sharpLum)*(CHARS.length-1))]','CHARS[Math.max(1,Math.floor(Math.pow(sharpLum,.7)*(CHARS.length-1)))]');
   html=change(html,'ctx.fillStyle=`rgba(${r},${g},${b},${alpha})`;','ctx.fillStyle=`rgba(${Math.min(255,Math.pow(r/255,.68)*255+12)|0},${Math.min(255,Math.pow(g/255,.68)*255+12)|0},${Math.min(255,Math.pow(b/255,.68)*255+12)|0},${Math.max(.6,alpha)})`;');
   html=change(html,'  function renderAscii(t){','  function renderAsciiOriginal(t){');
   html=change(html,'  function overlays(t){',`  const filmPortraitCache=document.createElement('canvas');filmPortraitCache.width=W;filmPortraitCache.height=H;
   let filmPortraitReady=false;
   function renderAscii(t){
     if(!filmPortraitReady){ctx.save();ctx.clearRect(0,0,W,H);bg(0);renderAsciiOriginal(DURATION);filmPortraitCache.getContext('2d').drawImage(canvas,0,0);ctx.restore();filmPortraitReady=true;bg(t);}
     const reveal=clamp((t-1.2)/6.1,0,1),front=(1-Math.pow(1-reveal,2))*H;
     if(reveal<=0)return;
     ctx.save();ctx.beginPath();ctx.rect(0,0,W,front);ctx.clip();ctx.globalAlpha=Math.min(1,reveal*2);ctx.drawImage(filmPortraitCache,0,0);ctx.restore();
   }
   function overlays(t){`);
 }
 if(id==='vineyard')html=change(html," && !document.body.classList.contains('embed')",'');
 if(id==='rabbit'){
  // A deliberate acknowledgement: anticipate, nod, settle; affects the original ear geometry.
  html=change(html,'function hearts(){', 'function hearts(){state.hold=state.t;');
  html=change(html,'const sway=Math.sin(t*1.3)*.018;', 'const age=t-state.hold;const nod=state.hold>0&&age<1.6?Math.sin(age*7.8)*Math.exp(-age*2.2)*.13:0;const sway=Math.sin(t*1.3)*.018+nod;');
  html=change(html,'g.rotate(-.12+Math.sin(t*1.53+.7)*.035);','g.rotate(-.12+Math.sin(t*1.53+.7)*.035-nod*.7);');
  html=change(html,'replay:restart,pause:()=>','replay:restart,play:()=>{state.playing=true;last=0;updatePause();wake()},pause:()=>');
 }
 if(id==='lily')html=change(html,'window.bouquetDebug={setTime:', "window.bouquetDebug={setDensity:value=>{if(densitySpec[value]){density=value;adaptiveEnabled=false;render(current);}},play:()=>{running=true;lastStamp=null;updatePlayButton();ensureLoop();},pause:()=>{running=false;updatePlayButton();},setTime:");
 const sampleContext={vineyard:['s','w','h'],rabbit:['g','W','H'],mushroom:['p','W','H'],museum:['g','W','H'],couple:['g','W','H'],lily:['paint','W','H']}[id];
 if(sampleContext){const [context,w,h]=sampleContext;html=changeAll(html,`${context}.getImageData(0,0,${w},${h}).data`,`window.__filmSample(${context},${w},${h})`);}
 const rasterStart={vineyard:['function source(t){','function source(t){window.__filmRaster(s,w,h);'],rabbit:['function paint(t){','function paint(t){window.__filmRaster(g,W,H);'],mushroom:['function scene(t){','function scene(t){window.__filmRaster(p,W,H);'],couple:['function scene(t){','function scene(t){window.__filmRaster(g,W,H);'],lily:['  function drawPainting(t) {','  function drawPainting(t) {window.__filmRaster(paint,W,H);']}[id];
 if(rasterStart)html=change(html,...rasterStart);
 if(id==='vineyard')html=change(html,'(y*w+x)*4','window.__filmIndex(x,y,w,h)');
 if(['rabbit','mushroom','couple'].includes(id))html=change(html,'(y*W+x)*4','window.__filmIndex(x,y,W,H)');
 if(id==='museum'){
  html=change(html,'if(work.width!==W||work.height!==H){work.width=W;work.height=H}if(visitors.width!==W||visitors.height!==H){visitors.width=W;visitors.height=H}', 'window.__filmRaster(g,W,H);window.__filmRaster(visitorG,W,H);');
  html=changeAll(html,'((y|0)*W+(x|0))*4','window.__filmIndex(x|0,y|0,W,H)');
  html=change(html,'visitorG.clearRect(0,0,visitors.width,visitors.height)','visitorG.clearRect(0,0,canvas.width,canvas.height)');
  html=change(html,'visitorG.getImageData(0,0,visitors.width,visitors.height).data','window.__filmSample(visitorG,canvas.width,canvas.height)');
 }
 if(id==='lily')for(const [x,y] of [['x0','y0'],['x1','y0'],['x0','y1'],['x1','y1']])html=change(html,`(${y}*W+${x})*4`,`window.__filmIndex(${x},${y},W,H)`);
 html=actRC07(id,actRC06(id,actRC05(id,actRC04(id,directOriginal(id,html)))));
 const drawMarker={vineyard:'function render(t){',rabbit:'function ascii(t){',mushroom:'function draw(){',museum:'function draw(){',couple:'function draw(){',lily:'function render(t) {',memory07:'function draw(now){',memory08:'function draw(){',memory09:'function render(t){'}[id];
 if(!html.includes(drawMarker))throw new Error('Draw instrumentation marker missing: '+id);
 html=change(html,drawMarker,drawMarker+'window.__filmDraws=(window.__filmDraws||0)+1;');
 // srcdoc has the host URL. Force the embed branch before engine initialization.
 html=change(html,/<head(?: lang="es")?>/,'<head><script>'+clocks+sampler+'</script>');
 // Optional embed spelling; parent/frame checks remain authoritative.
 html=html.replace(/params\.get\('embed'\) === '1'/g,'true');
 // Optional embed spelling; parent/frame checks remain authoritative.
 html=html.replace(/new URLSearchParams\(location.search\)\.get\('embed'\)==='1'/g,'true');
 // Optional embed spelling; parent/frame checks remain authoritative.
 html=html.replace(/q\.get\('embed'\)==='1'/g,'true');
 // Optional embed spelling; parent/frame checks remain authoritative.
 html=html.replace(/query\.get\('embed'\)==='1'/g,'true');
 // Museum's painted room is landscape in embedded mode; retain its complete frame.
 const css=`<style>html,body{overflow:hidden!important}*,*::before,*::after{animation:none!important;transition:none!important}canvas{border-radius:0!important;box-shadow:none!important}.hint{display:none!important}</style>`;
 html=change(html,'</head>',css+'</head>');
 if(!html.includes('window.__filmDraws')||!html.includes('window.__filmClock'))throw new Error('Incomplete derived engine: '+id);
 await mkdir(path.join(root,'dist/derived'),{recursive:true});
 await writeFile(path.join(root,'dist/derived',id+'.html'),html);
 engines[id]=html;
}
await writeFile(path.join(root,'ENGINE_MANIFEST.json'),JSON.stringify(originals,null,2)+'\n');
await writeFile(path.join(root,'dist/engines.js'),'window.VEngines='+JSON.stringify(engines).replace(/<\/script/gi,'<\\/script')+';');
const names=['story','personal-story','editorial','session','asset-ready','scene-adapters','engine','audio','haptics','effects','score','film-runtime','shot-composer','glyph-transitions','worlds','cinematography','letter-scene','jewel-mesh','ring','ceremony-scene','render-budget','navigation-policy','journey','shot-plan','creative-stage','surface-blend','spatial-world','living-sequence','painting-world','memory-atelier','universe','universe-rc06','final-score','world-bridge','director'];
const sourceFiles=await Promise.all(names.map(n=>read(`src/${n}.js`)));
const scripts=sourceFiles.join('\n');new vm.Script(scripts,{filename:'film.js'});
let offlineScripts=scripts;
const settings={window:{}};vm.runInNewContext(sourceFiles[0],settings);
const audioFile=settings.window.VStory.audioFile;
if(audioFile){
 const audioPath=path.resolve(root,audioFile);
 if(!audioPath.startsWith(path.join(root,'assets','audio')+path.sep))throw new Error('audioFile must be inside assets/audio/');
 const bytes=await readFile(audioPath),ext=path.extname(audioPath).toLowerCase(),mime=ext==='.ogg'?'audio/ogg':ext==='.wav'?'audio/wav':ext==='.m4a'?'audio/mp4':'audio/mpeg';
 await cp(path.join(root,'assets/audio'),path.join(root,'dist/assets/audio'),{recursive:true});
 offlineScripts=[sourceFiles[0]+'\nwindow.VStory.audioFile='+JSON.stringify(`data:${mime};base64,${bytes.toString('base64')}`)+';',...sourceFiles.slice(1)].join('\n');
}
const css=await read('src/film.css')+'\n'+await read('src/composition.css')+'\n'+await read('src/rc04.css')+'\n'+await read('src/rc05.css')+'\n'+await read('src/rc06.css')+'\n'+await read('src/rc07.css');
let html=await read('src/index.html');
await writeFile(path.join(root,'dist/film.js'),scripts);
await writeFile(path.join(root,'dist/film.css'),css);
await writeFile(path.join(root,'dist/index.html'),html);
await cp(path.join(root,'assets/fonts'),path.join(root,'dist/assets/fonts'),{recursive:true});
// Single-file edition uses exactly the production scripts, fonts and engine adaptations.
let offlineCss=css;
for(const font of ['CormorantGaramond','DMSans']){
 const bytes=await readFile(path.join(root,`assets/fonts/${font}.ttf`));
 offlineCss=offlineCss.replace(`assets/fonts/${font}.ttf`,`data:font/ttf;base64,${bytes.toString('base64')}`);
}
const engineScript=await readFile(path.join(root,'dist/engines.js'),'utf8');
let offline=html.replace(/<link[^>]*rel="preload"[^>]*>/g,'').replace('<link rel="stylesheet" href="film.css">','<style>'+offlineCss+'</style>');
offline=offline.replace('<script src="engines.js" defer></script>','<script>'+engineScript+'</script>');
offline=offline.replace('<script src="film.js" defer></script>','<script>'+offlineScripts+'</script>');
if(/<script[^>]+src=/.test(offline)||!offline.includes('window.VEngines=')||!offline.includes('data:font/ttf;base64,'))throw new Error('Offline production invariant failed');
await writeFile(path.join(root,'VALERIE_OFFLINE.html'),offline);
await writeFile(path.join(root,'dist/favicon.ico'),Buffer.alloc(0));
console.log('Built dist/index.html and VALERIE_OFFLINE.html. Nine original hashes recorded.');
