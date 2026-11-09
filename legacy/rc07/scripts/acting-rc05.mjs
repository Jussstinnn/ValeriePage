import {change} from './checked-adapters.mjs';
// Extend the original rig in the painter before ASCII rasterization. Never patch originals.
export function actRC05(id,html){
 if(id==='rabbit'){
  const start=html.indexOf('function filmPose(t){'),end=html.indexOf('\nfunction bunny(t){',start);if(start<0||end<0)throw new Error('RC05 rig not found');
  html=html.slice(0,start)+`let filmStride=0,filmTurn=0;
function filmPose(t){
 const s=filmStoryTime,greet=state.hold>0&&t-state.hold>=0&&t-state.hold<2.4?Math.sin((t-state.hold)/2.4*Math.PI):0;
 const emerge=smooth(0,4,s),walk=smooth(6,16,s),back=smooth(16,18,s)*(1-smooth(21,23,s));
 filmStride=s>6&&s<16?Math.sin((s-6)*Math.PI*1.15):0;filmTurn=back;
 filmTravel=-155+emerge*85+walk*245;
 filmHeadTilt=back*-.22+greet*.16+(filmCommand==='listen'?Math.sin(t*1.8)*.06:0);
 filmEarL=-.18*(1-emerge)+Math.sin(t*2)*.04+greet*-.28+back*.11;
 filmEarR=.21*(1-emerge)+Math.sin(t*1.5+.8)*.035+greet*.2-back*.15;
 filmBeat=greet>.05?'greeting':s<4?'emerging':s<6?'listening':s<16?'walking':s<21?'looking-back':'waiting-on-path';
 const size=.74+emerge*.13+Math.sin(s/25*Math.PI)*.07;
 g.translate(360+filmTravel,645-Math.abs(filmStride)*22+greet*9);g.rotate(filmStride*.035-back*.075);g.scale(size*(1-back*.14),size*(1+Math.abs(filmStride)*.045));g.translate(-360,-645);
}
`+html.slice(end);
  // Feet have alternating planted and lifted key poses in the original glyph painter.
  html=change(html,'function paws(t){','function paws(t){g.save();g.translate(filmStride*14,-Math.max(0,filmStride)*18);');
  const p=html.indexOf('function paws(t){'),next=html.indexOf('\nfunction ',p+20);if(next<0)throw new Error('RC05 paws boundary');const region=html.slice(p,next);const close=region.lastIndexOf('}');html=html.slice(0,p)+region.slice(0,close)+'g.restore();'+region.slice(close)+html.slice(next);
  html=change(html,'travel:filmTravel','travel:filmTravel,stride:filmStride,turn:filmTurn');
  html=change(html,'ellipse(293,721,77,31,','ellipse(293+filmStride*17,721-Math.max(0,filmStride)*22,77,31,');
  html=change(html,'ellipse(450,719,74,31,','ellipse(450-filmStride*17,719-Math.max(0,-filmStride)*22,74,31,');
  html=change(html,'ellipse(267+k*17,733-(k%2)*4,','ellipse(267+k*17+filmStride*17,733-(k%2)*4-Math.max(0,filmStride)*22,');
  html=change(html,'ellipse(422+k*17,732+(k%2)*2,','ellipse(422+k*17-filmStride*17,732+(k%2)*2-Math.max(0,-filmStride)*22,');
 }
 return html;
}
