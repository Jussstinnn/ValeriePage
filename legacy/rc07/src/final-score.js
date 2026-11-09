/* Six recognisable silhouettes retain their own matter until they become the question. */
(() => {
 const {ease,mix}=VMath,P=VUniverse.prototype,base=P.draw,oldMotif=P.motif,TAU=Math.PI*2;
 P.motif=function(g,j){
  if(g===5){const a=j/128*TAU,r=.44+.30*Math.cos(6*a);return{x:Math.sin(a)*r,y:-Math.cos(a)*r};}
  if(g===3){const q=j/128;if(q<.6){const a=q/.6*TAU;return{x:Math.cos(a)*(.45+.15*Math.cos(a*3)),y:Math.sin(a)*(.42+.12*Math.cos(a*3))};}return{x:(q-.6)/.4*1.5-.75,y:.62};}
  return oldMotif.call(this,g,j);
 };
 P.draw=function(p,t,progress,w,h,reduced){
  if(reduced){base.call(this,p,12,progress,w,h,true);return;}
  // Hold complete motifs first. Each departs toward a different line, without a new emitter.
  if(t>=3.6){base.call(this,p,t-3.6,progress,w,h,false);return;}
  const groups=[...this.matter.values()],R=Math.min(w*.35,h*.23),origin={x:w*.5,y:h*.43};this.phase='the-six-worlds-recognised';this.exitMatter=[];
  p.save();p.textAlign='center';p.textBaseline='middle';p.font='10px monospace';
  const count=VRuntimeProfile.name==='battery'?80:128;
  for(let g=0;g<6;g++){
   const a=-Math.PI*.5+g/6*TAU,cx=origin.x+Math.cos(a)*R,cy=origin.y+Math.sin(a)*R,scale=Math.min(w*.105,h*.09),nodes=groups[g]?.length?groups[g]:[{glyph:':',ink:['#e7d5a7','#c2d5b5','#a2c9b8','#c3c6de','#dbbdd7','#e1bccc'][g]}];
   for(let j=0;j<count;j++){const m=this.motif(g,j/count*128|0),n=nodes[j%nodes.length],x=cx+m.x*scale,y=cy+m.y*scale;p.globalAlpha=.74+.16*Math.sin(j*.17+g);p.fillStyle=n.ink;p.fillText(n.glyph,x,y);this.exitMatter.push({x,y,ink:n.ink,glyph:n.glyph,group:g});}
  }
  // The companion light visits the outlines, then rests at the centre before the letters form.
  const q=ease((t-.5)/2.6),a=-Math.PI*.5+q*TAU,r=R*(1-ease((t-2.4)/1.2));p.globalAlpha=.85;p.fillStyle='#fff0cd';p.font='17px monospace';p.fillText('*',origin.x+Math.cos(a)*r,origin.y+Math.sin(a)*r);p.restore();this.count=this.exitMatter.length;
 };
})();
