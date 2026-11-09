import {change} from './checked-adapters.mjs';
export function actRC06(id,html){
 if(id==='rabbit'){
  const a=html.indexOf('function filmPose(t){'),b=html.indexOf('\nfunction bunny(t){',a);if(a<0||b<0)throw new Error('RC06 original rig boundary missing');
  html=html.slice(0,a)+`let filmJump=0,filmSquat=0,filmScale=.86;
function filmPose(t){
 const s=filmStoryTime,enter=smooth(0,3,s),walk=smooth(6,11,s),launch=smooth(12,14,s),returning=smooth(17,20,s),guide=smooth(21,25,s);
 const greet=state.hold>0&&t-state.hold>=0&&t-state.hold<2.6?Math.sin((t-state.hold)/2.6*Math.PI):0;
 filmJump=s>12&&s<14?Math.sin((s-12)/2*Math.PI)*116:0;filmSquat=smooth(10.8,11.8,s)*(1-smooth(11.8,12.1,s))*.19+smooth(14,14.15,s)*(1-smooth(14.15,14.8,s))*.13;
 filmStride=(s>6&&s<11?Math.sin((s-6)*Math.PI*1.5):s>21?Math.sin((s-21)*Math.PI*1.5):0);filmTurn=smooth(16.4,17.4,s)*(1-smooth(20,21,s));
 filmTravel=-155+enter*80+walk*156+launch*90-returning*35+guide*40;
 const sniff=smooth(3,3.6,s)*(1-smooth(5.8,6,s));filmHeadTilt=sniff*(-.12+Math.sin(t*2.2)*.07)-filmTurn*.31+greet*.20;
 filmEarL=-.30*(1-enter)+sniff*.19+Math.sin(t*1.7)*.03-filmSquat*1.7-greet*.35;
 filmEarR=.34*(1-enter)-sniff*.12+Math.sin(t*1.3+.8)*.035+filmSquat*.7+greet*.28;
 filmBeat=greet>.05?'greeting':s<3?'emerging':s<6?'sniffing-light':s<11?'walking':s<12?'anticipating-jump':s<14?'leaping':s<16?'landing':s<20?'looking-back':s<21?'waiting':s<24?'guiding':'farewell';
 filmScale=.84+enter*.04;
 g.translate(360+filmTravel,645-filmJump-Math.abs(filmStride)*12+filmSquat*50);g.rotate(filmStride*.05-filmTurn*.10+greet*.04);g.scale(filmScale*(1-filmTurn*.22+filmSquat*.5),filmScale*(1-filmSquat));g.translate(-360,-645);
}
`+html.slice(b);
  html=change(html,'direct(x,y,time,command){', 'direct(x,y,time,command){filmLightX=x;filmLightY=y;');
  html=change(html,'let filmJump=0,filmSquat=0,filmScale=.86;', 'let filmJump=0,filmSquat=0,filmScale=.86,filmLightX=.7,filmLightY=.3;');
  html=change(html,'out.fillStyle=`rgba(${R},${G},${B},${alpha})`;', 'const near=Math.max(0,1-Math.hypot(xx/W-filmLightX,yy/H-filmLightY)/.22);R=Math.min(255,R*(1+near*.25));G=Math.min(255,G*(1+near*.18));B=Math.min(255,B*(1+near*.08));out.fillStyle=`rgba(${R},${G},${B},${alpha})`;');
  // The native actor now paints a transparent layer in the shared world, not a whole separate garden.
  const start=html.indexOf('function paint(t){'),end=html.indexOf('\nconst chars=',start);if(start<0||end<0)throw new Error('RC06 actor painter missing');
  html=html.slice(0,start)+`function paint(t){window.__filmRaster(g,W,H);g.clearRect(0,0,W,H);g.save();filmPose(t);bunny(t);paws(t);carrot(t);holdCarrot(t);g.restore();}\n`+html.slice(end);
  html=change(html,"out.fillStyle='#07080b';out.fillRect(0,0,W,H);","out.clearRect(0,0,W,H);");
  html=change(html,'travel:filmTravel,stride:filmStride,turn:filmTurn','travel:filmTravel,stride:filmStride,turn:filmTurn,jump:filmJump,squat:filmSquat,bounds:{x:(360+filmTravel-185*filmScale)/W,y:(645-565*filmScale-filmJump)/H,w:370*filmScale/W,h:680*filmScale/H}');
 }
 if(id==='mushroom'){
  html=change(html,'function scene(t){window.__filmRaster(p,W,H);pulse=t;background(t);vines(t);forestFloor(t);blossomingGarden(t);companionMushrooms(t);centralStem(t);centralCap(t);fireflies(t);petals(t)}','function scene(t){window.__filmRaster(p,W,H);p.clearRect(0,0,W,H);pulse=t;blossomingGarden(t);companionMushrooms(t);centralStem(t);centralCap(t);fireflies(t)}');
  html=change(html,"ctx.fillStyle='#06080d';ctx.fillRect(0,0,W,H);","ctx.clearRect(0,0,W,H);");
 }
 if(id==='museum'){
  html=change(html,'window.asciiMuseum={',`let filmField=null;window.asciiMuseum={get paintingField(){if(!filmField){filmField=[];const chars='.:iXS#@',inks=['#21497b','#3a6997','#699caf','#b1c1b3','#e5c775','#f4e3a0'];for(let y=6;y<760;y+=12)for(let x=6;x<960;x+=12){const j=(y*960+x)*4,r=paintingPixels[j],g=paintingPixels[j+1],b=paintingPixels[j+2],l=(r*.21+g*.72+b*.07)/255;if(l<.12)continue;const gold=r>g*1.1&&r>b*1.2;filmField.push({x:x/960,y:y/760,glyph:chars[Math.min(6,l*9|0)],ink:inks[gold?4+(l>.6?1:0):Math.min(3,l*6|0)],depth:gold?.85:y<520?.35:0});}}return filmField;},`);
 }
 if(id==='lily'){
  html=change(html,'function asciiCells(name) {',"function asciiCells(name) {const cacheKey=name+':'+(window.__filmRasterLimit||window.parent.VRuntimeProfile?.raster||420);");
  html=change(html,'asciiGridCache.has(name))return asciiGridCache.get(name);','asciiGridCache.has(cacheKey))return asciiGridCache.get(cacheKey);');
  html=change(html,'asciiGridCache.set(name,cells);','if(asciiGridCache.size>4)asciiGridCache.clear();asciiGridCache.set(cacheKey,cells);');
  html=change(html,"const mobileCamera=isEmbedded && matchMedia('(max-width: 480px) and (orientation: portrait)').matches;",'const mobileCamera=false;');
  html=change(html,"filmFlowerPoints[isEmbedded&&matchMedia('(max-width: 480px) and (orientation: portrait)').matches?1:0]",'filmFlowerPoints[0]');
  html=change(html,'window.bouquetDebug={',`let filmMacro=-1,filmMacroKey='',filmMacroCanvas=document.createElement('canvas');filmMacroCanvas.width=640;filmMacroCanvas.height=740;const filmMacroCtx=filmMacroCanvas.getContext('2d');
  function filmMacroFrame(id){const f=flowers[id];if(!f)return null;const key=id+':'+density+':'+Math.round(current*20)+':'+Math.round(filmGestureAge*12);if(key===filmMacroKey)return filmMacroCanvas;filmMacroKey=key;const oldLimit=window.__filmRasterLimit;window.__filmRasterLimit=640;window.__filmRaster(paint,W,H);paint.clearRect(0,0,W,H);paint.save();paint.translate(320,370);const zoom=2.35;paint.scale(zoom,zoom);paint.translate(-f.x,-f.y);drawLily(f,Math.max(8.5,current));paint.restore();filmMacroCtx.fillStyle='#0c1016';filmMacroCtx.fillRect(0,0,640,740);drawAscii(filmMacroCtx);window.__filmRasterLimit=oldLimit;drawPainting(current);return filmMacroCanvas;}
  window.bouquetDebug={seedFlower(id){const f=flowers[id];if(f)f.start=Math.min(f.start,1.6);},macroFrame:filmMacroFrame,get macroMode(){return filmMacro;},`);
 }
 return html;
}

