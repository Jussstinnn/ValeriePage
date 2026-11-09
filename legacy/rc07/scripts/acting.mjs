// Reproducible derivations only. Original nine source files remain byte-identical.
const replace=(source,from,to)=>{if(!source.includes(from))throw new Error('Acting adapter marker missing: '+from.slice(0,65));return source.replace(from,to)};
export function directOriginal(id,html){
 const runningRestore={mushroom:['asciiMushroom','running','updatePlay'],museum:['asciiMuseum','playing','update'],couple:['asciiStargazers','running','updatePlay']}[id];
 if(runningRestore){const [api,flag,update]=runningRestore;html=replace(html,`window.${api}={`,`window.${api}={restore(t){state.time=Math.max(0,t);state.${flag}=false;last=0;${update}();wake();},`);}
 if(id==='vineyard')html=replace(html,'window.asciiVineyard={','window.asciiVineyard={restore(t){st.time=Math.max(0,t);pause();},');
 if(id==='mushroom'){
  const start=html.indexOf('function affection(){'),end=html.indexOf("\n$('restart')",start);if(start<0||end<0)throw new Error('Forest interaction marker missing');
  html=html.slice(0,start)+'function affection(){state.awaken++;state.reactionAt=state.time;wake()}'+html.slice(end);
 }
 if(id==='couple'){
  const start=html.indexOf('function wish(){'),end=html.indexOf("\n$('restart')",start);if(start<0||end<0)throw new Error('Wish interaction marker missing');
  html=html.slice(0,start)+'function wish(){state.wishes++;state.extraMeteor=state.time;wake()}'+html.slice(end);
 }
 if(id==='museum')html=replace(html,'function wish(){state.wishes++;state.lastWish=Math.max(8.5,state.time);if(state.time<8.5)state.time=8.5;wake()}','function wish(){state.wishes++;state.lastWish=state.time;wake()}');
 if(id==='rabbit'){
  html=replace(html,'state.hold>0&&age<1.6?','state.hold>0&&age>=0&&age<1.6?');
  html=replace(html,'function bunny(t){',`let filmLookX=0,filmLookY=0,filmStoryTime=0;
function filmPose(t){const s=filmStoryTime||t,invite=smooth(7.8,9.4,s)*(1-smooth(12.5,14,s)),back=smooth(12.5,13.4,s)*(1-smooth(15,16.5,s)),advance=smooth(7.8,10.6,s)*28,hop=s>8&&s<10.6?Math.max(0,Math.sin((s-8)*Math.PI*1.6))*6:0,anticipate=smooth(7.1,7.8,s)*(1-smooth(7.8,8.2,s))*2;g.translate(360+advance-back*4,430+Math.sin(s*1.2)*1.2-hop+anticipate);g.rotate(invite*.012-back*.008);g.scale(1.08,1.08);g.translate(-360,-430);}
function bunny(t){`);
  html=replace(html,'bunny(t);paws(t);carrot(t);holdCarrot(t);','g.save();filmPose(t);bunny(t);paws(t);carrot(t);holdCarrot(t);g.restore();');
  for(const [x,y]of [[301,393],[419,392],[297,387],[415,386],[306,401],[423,401]])html=replace(html,`ellipse(${x},${y},`,`ellipse(${x}+filmLookX,${y}+filmLookY,`);
  html=replace(html,'const sway=Math.sin(t*1.3)*.018+nod;','const listen=smooth(3,3.5,filmStoryTime)*(1-smooth(5.2,5.7,filmStoryTime));const sway=Math.sin(t*1.3)*.018+nod+Math.sin(filmStoryTime*3.4)*.035*listen;');
  const start=html.indexOf('function hearts(){'),end=html.indexOf("\n$('replay')",start);
  if(start<0||end<0)throw new Error('Rabbit greeting marker missing');
  html=html.slice(0,start)+'function hearts(){state.hold=state.t;needs=true;wake()}'+html.slice(end);
  html=replace(html,'window.asciiBunny={getState:()=>({...state}),',`window.asciiBunny={restore(t){state.t=Math.max(0,t);state.playing=false;last=0;needs=true;updatePause();wake();},direct(x,y,time){filmStoryTime=time;const back=smooth(12.5,13.5,time)*(1-smooth(15,16,time));filmLookX=clamp((x-.5)*20,-6,6)*(1-back)-back*6;filmLookY=clamp((y-.46)*13,-3,3);},getState:()=>({...state,acting:{lookX:filmLookX,lookY:filmLookY,beat:filmStoryTime<3?'arrival':filmStoryTime<8?'waiting':filmStoryTime<13?'inviting':filmStoryTime<16?'looking-back':'waiting-on-path'}}),`);
 }
 if(id==='lily'){
  html=replace(html,'  function drawLily(f,t) {',`  let filmSelected=-1,filmSelectedAt=-100;
  function drawLily(f,t) {
    const age=current-filmSelectedAt;
    if(f.id===filmSelected){t+=.32*Math.sin(Math.min(1,Math.max(0,age/1.8))*Math.PI);const glow=paint.createRadialGradient(f.x,f.y,2,f.x,f.y,f.s*1.12);glow.addColorStop(0,'#ffe4b84a');glow.addColorStop(1,'#ffe4b800');paint.save();paint.fillStyle=glow;paint.fillRect(f.x-f.s*1.12,f.y-f.s*1.12,f.s*2.24,f.s*2.24);paint.restore();}`);
  html=replace(html,'window.bouquetDebug={',`const filmFlowerPoints=[flowers.map(f=>({x:f.x/W,y:f.y/H})),flowers.map(f=>({x:(320+(f.x-320)*1.115)/W,y:(348+(f.y-348)*1.115)/H}))];
  window.bouquetDebug={selectFlower(id){filmSelected=Math.max(0,Math.min(13,id|0));filmSelectedAt=current;render(current);},get flowerPoints(){return filmFlowerPoints[isEmbedded&&matchMedia('(max-width: 480px) and (orientation: portrait)').matches?1:0];},`);
  html=replace(html,'flowers:flowers.length,stems:allStems.length','selectedFlower:filmSelected,flowers:flowers.length,stems:allStems.length');
 }
 return html;
}
