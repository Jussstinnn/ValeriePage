import {change} from './checked-adapters.mjs';
export function actRC07(id,html){
 if(['vineyard','rabbit','mushroom','couple'].includes(id))html=change(html,"canvas.getContext('2d',{alpha:false})","canvas.getContext('2d',{alpha:true})");
 if(id==='vineyard')html=change(html,'o.fillStyle=sky;o.fillRect(0,0,w,h);','o.clearRect(0,0,w,h);');
 if(id==='couple')html=change(html,'out.fillStyle=bg;out.fillRect(0,0,W,H);','out.clearRect(0,0,W,H);');
 if(id==='rabbit'){
  const a=html.indexOf('function filmPose(t){'),b=html.indexOf('\nfunction bunny(t){',a);if(a<0||b<0)throw new Error('RC07 rig boundary missing');
  html=html.slice(0,a)+`function filmPose(t){
 const s=filmStoryTime,enter=smooth(0,3.8,s),walk=smooth(7,12,s),jump=smooth(12.6,14.6,s),back=smooth(16,19,s),leave=smooth(22,25,s),greet=state.hold>0&&t-state.hold>=0&&t-state.hold<3?Math.sin((t-state.hold)/3*Math.PI):0;
 filmJump=s>12.6&&s<14.6?Math.sin((s-12.6)/2*Math.PI)*112:0;filmSquat=smooth(11.8,12.5,s)*(1-smooth(12.5,12.8,s))*.22;
 filmStride=s>7&&s<12?Math.sin((s-7)*Math.PI*1.65):s>22?Math.sin((s-22)*Math.PI*1.6):0;filmTurn=smooth(15.5,17,s)*(1-smooth(20.3,21.5,s));
 filmTravel=-165+enter*60+walk*135+jump*86-back*72+leave*112;
 const sniff=smooth(3.8,4.8,s)*(1-smooth(6.7,7.2,s));filmHeadTilt=-filmTurn*.34+sniff*(Math.sin(t*2.3)*.08-.10)+greet*.23;
 filmEarL=-.40*(1-enter)+sniff*.23+Math.sin(t*1.6)*.025-greet*.43-filmSquat*1.8;filmEarR=.32*(1-enter)-sniff*.18+Math.sin(t*1.3+.8)*.03+greet*.32+filmSquat*.8;
 filmScale=.82+enter*.08+back*.13-leave*.31;
 filmBeat=greet>.05?'greeting':s<3.8?'from-the-leaves':s<7?'recognising-valerie':s<12?'crossing-the-path':s<12.6?'anticipating-jump':s<14.6?'leaping':s<16?'landing':s<19?'returning-to-valerie':s<22?'waiting-for-you':'through-the-canopy';
 g.translate(360+filmTravel,645-filmJump-Math.abs(filmStride)*14+filmSquat*54+leave*-45);g.rotate(filmStride*.045-filmTurn*.11+greet*.05);g.scale(filmScale*(1-filmTurn*.22+filmSquat*.42),filmScale*(1-filmSquat));g.translate(-360,-645);
}
`+html.slice(b);
 }
 if(id==='lily'){
  html=change(html,"let filmMacro=-1,filmMacroKey=''","var filmMacro=-1,filmMacroId=-1,filmStill=false,filmLightX=.5,filmLightY=.4,filmMacroKey=''");
  html=change(html,'const open=smooth((t-f.start)/1.60);','const open=filmMacro===f.id?(filmStill?1:smooth((filmGestureAge+.8)/(3.1+f.id%4*.13))):smooth((t-f.start)/1.60);');
  html=change(html,'drawLily(f,Math.max(8.5,current));paint.restore();','filmMacro=id;filmMacroId=id;drawLily(f,Math.max(8.5,current));paint.restore();');
  html=change(html,'drawAscii(filmMacroCtx);window.__filmRasterLimit=oldLimit;','drawAscii(filmMacroCtx);filmMacro=-1;window.__filmRasterLimit=oldLimit;');
  html=change(html,'window.bouquetDebug={',`window.bouquetDebug={setSpecimenLight(x,y,still){const a=Math.round(x*25)/25,b=Math.round(y*25)/25;if(a!==filmLightX||b!==filmLightY||!!still!==filmStill){filmLightX=a;filmLightY=b;filmStill=!!still;filmMacroKey='';}},get specimenState(){return{flower:filmMacroId,gestureAge:filmGestureAge,still:filmStill};},`);
  html=change(html,'const color=`rgb(${brightTable[r]},${brightTable[g]},${brightTable[b]})`;','const glint=filmMacro>=0?Math.max(0,1-Math.hypot(x/W-filmLightX,y/H-filmLightY)/.43)*.28:0;const color=`rgb(${Math.min(255,brightTable[r]*(1+glint))|0},${Math.min(255,brightTable[g]*(1+glint*.7))|0},${Math.min(255,brightTable[b]*(1+glint*.4))|0})`;');
 }
 return html;
}
