import {change} from './checked-adapters.mjs';
export function actRC04(id,html){
 if(id==='rabbit'){
  const a=html.indexOf('function filmPose(t){'),b=html.indexOf('\nfunction bunny(t){',a);if(a<0||b<0)throw new Error('RC04 rabbit pose boundary missing');
  html=html.slice(0,a)+`let filmHeadTilt=0,filmEarL=0,filmEarR=0,filmTravel=0,filmBeat='arrival',filmCommand='idle';
function filmPose(t){const s=filmStoryTime||t,greet=state.hold>0&&t-state.hold>=0&&t-state.hold<2.1?Math.sin(Math.min(1,(t-state.hold)/2.1)*Math.PI):0;
 const step1=smooth(8.25,9.25,s),step2=smooth(10.2,11.35,s),hop1=s>8.25&&s<9.25?Math.sin((s-8.25)*Math.PI)*7:0,hop2=s>10.2&&s<11.35?Math.sin((s-10.2)/1.15*Math.PI)*5:0,back=smooth(12.8,13.8,s)*(1-smooth(16,17,s)),listen=filmCommand==='listen'?smooth(3,3.5,s)*(1-smooth(6.1,6.7,s)):0,anticipation=filmCommand==='anticipate'?smooth(7.2,8,s)*(1-smooth(8,8.3,s)):0;
 filmTravel=step1*15+step2*13;filmHeadTilt=listen*filmLookX*.002-back*.025+greet*.035;filmEarL=Math.sin(s*2.1)*.028*listen+anticipation*.045-greet*.045;filmEarR=Math.sin(s*1.7+.8)*.033*listen-anticipation*.035+greet*.03;
 filmBeat=greet>.05?'greeting':({listen:'listening',anticipate:'anticipation',invite:'inviting',lookBack:'looking-back',wait:'waiting-on-path'})[filmCommand]||'arrival';
 g.translate(360+filmTravel,430+anticipation*3-hop1-hop2);g.scale(1.08,1.08);g.translate(-360,-430);}
`+html.slice(b);
  html=change(html,'direct(x,y,time){filmStoryTime=time;','direct(x,y,time,command){filmCommand=command||\'idle\';filmStoryTime=time;');
  html=change(html,'g.translate(0,1);g.rotate(sway);','g.translate(285,335);g.rotate(sway+filmEarL+filmHeadTilt*.35);g.translate(-285,-334);');
  html=change(html,'g.rotate(-.12+Math.sin(t*1.53+.7)*.035-nod*.7);','g.rotate(-.12+Math.sin(t*1.53+.7)*.035-nod*.7+filmEarR+filmHeadTilt*.35);');
  html=change(html,'  shadowPath(()=>{g.moveTo(359,270);','  g.save();g.translate(370,438);g.rotate(filmHeadTilt);g.translate(-370,-438);\n  shadowPath(()=>{g.moveTo(359,270);');
  html=change(html,'  for(let i=0;i<10;i++){const x=299+i*13','  g.restore();\n  for(let i=0;i<10;i++){const x=299+i*13');
  html=change(html,"beat:filmStoryTime<3?'arrival':filmStoryTime<8?'waiting':filmStoryTime<13?'inviting':filmStoryTime<16?'looking-back':'waiting-on-path'",'beat:filmBeat,head:filmHeadTilt,ears:[filmEarL,filmEarR],travel:filmTravel');
 }
 if(id==='museum')html=change(html,'window.asciiMuseum={','window.asciiMuseum={get paintingBounds(){const r=layout();return{x:r.left/r.W,y:r.top/r.H,w:r.pw/r.W,h:r.ph/r.H};},');
 if(id==='lily'){
  html=change(html,'let filmSelected=-1,filmSelectedAt=-100;','let filmSelected=-1,filmSelectedAt=-100,filmGestureAge=4;');
  html=change(html,'const age=current-filmSelectedAt;','const age=filmGestureAge;');
  html=change(html,'paint.rotate(f.a);','paint.rotate(f.a+(f.id===filmSelected?Math.sin(Math.min(1,filmGestureAge/(1.7+f.id%4*.17))*Math.PI)*(.018+(f.id%3)*.009)*(f.id%2?1:-1):0));');
  html=change(html,'filmSelectedAt=current;render(current);','filmSelectedAt=current;filmGestureAge=0;render(current);');
  html=change(html,'window.bouquetDebug={',`const filmFlowerProfiles=flowers.map(f=>({id:f.id,color:palettes[f.c].mid,start:f.start}));window.bouquetDebug={get flowerProfiles(){return filmFlowerProfiles;},advancePerformance(dt){if(filmGestureAge>=3.5)return false;filmGestureAge+=dt;if(current>=DURATION-.01){render(current);return true;}return false;},restoreSelection(id){filmSelected=id;filmGestureAge=4;render(current);},`);
  html=change(html,'selectedFlower:filmSelected,flowers:','selectedFlower:filmSelected,gestureAge:filmGestureAge,flowers:');
 }
 const fields={vineyard:['st',['interactions','hopAt','wishAt','wishes']],rabbit:['state',['hold']],mushroom:['state',['awaken','reactionAt']],museum:['state',['wishes','lastWish']],couple:['state',['wishes','extraMeteor']]}[id];
 if(fields){const [object,names]=fields,api={vineyard:'asciiVineyard',rabbit:'asciiBunny',mushroom:'asciiMushroom',museum:'asciiMuseum',couple:'asciiStargazers'}[id];html=change(html,`window.${api}={`,`window.${api}={captureNarrative(){return Object.fromEntries(${JSON.stringify(names)}.map(key=>[key,${object}[key]]));},restoreNarrative(data){for(const key of ${JSON.stringify(names)})if(Number.isFinite(data[key]))${object}[key]=data[key];},`);}
 return html;
}
