/* RC06 choreography replaces the previous formation, retaining only local samples and motifs. */
(() => {
 const {ease,mix,clamp}=VMath,TAU=Math.PI*2,P=VUniverse.prototype;
 P.opening=function(p,t,w,h,reduced){
  if(this.nameKey!==w+':'+h){this.name=this.type(['Valerie'],w,h,true);this.nameKey=w+':'+h;}
  const q=reduced?1:ease((t-.2)/3.1);p.save();p.textAlign='center';p.font='7px monospace';
  for(let i=0;i<this.name.length;i++){const n=this.name[i],u=n.x/w,a=u*TAU*1.4+t*.10,depth=(i%9)/9,ox=w*.5+Math.cos(a)*w*(.3+depth*.32),oy=h*.39+Math.sin(a)*h*.27+depth*h*.18,x=mix(ox,n.x,q),y=mix(oy,n.y-h*.04,q);p.globalAlpha=.18+q*.82;p.fillStyle=i%11?'#efe1c8':'#9fbeb0';p.fillText(i%8?':':'*',x,y);}
  // Three depth planes of the same sky open into the path below the name.
  for(let j=0;j<96;j++){const a=j*2.399,r=(.15+(j%17)/17*.5)*Math.min(w,h),z=1+(j%7)*.3,x=w*.5+Math.cos(a+t*.022)*r/z,y=h*.44+Math.sin(a+t*.022)*r/z;p.globalAlpha=.15+(j%5)*.06;p.fillStyle=j%9?'#b6c6b9':'#edd4ad';p.fillText(j%11?'·':'+',x,y);}
  p.globalAlpha=.8;p.font='17px monospace';p.fillStyle='#f9e2b5';p.fillText('*',w*.5,h*.66);p.restore();this.phase='a-name-in-depth';
 };
 P.interlude=function(p,q,t,w,h,reduced,{origin={x:w*.5,y:h*.45},jewel=null}={}){
  const a=ease(q),cx=mix(origin.x,w*.5,a),cy=mix(origin.y,h*.44,a),radius=Math.hypot(w,h)*a;
  p.save();p.beginPath();p.ellipse(cx,cy,Math.max(.01,radius*.85),Math.max(.01,radius),0,0,TAU);p.clip();p.fillStyle='#0a1520';p.fillRect(0,0,w,h);
  if(jewel&&a<.8){p.globalAlpha=1-a;const s=80+a*Math.max(w,h)*2;p.drawImage(jewel,jewel.width*.32,jewel.height*.23,jewel.width*.36,jewel.height*.36,cx-s*.5,cy-s*.5,s,s);}
  p.globalAlpha=1;p.font='10px monospace';p.textAlign='center';this.exitMatter=this.exitMatter||[];this.exitMatter.length=0;const groups=[...this.matter.values()],count=VRuntimeProfile.name==='battery'?64:112,R=Math.min(w*.36,h*.24);
  for(let g=0;g<6;g++){const nodes=groups[g]?.length?groups[g]:[{ink:'#dccbad',glyph:':'}],angle=-Math.PI*.5+g/6*TAU+(reduced?0:Math.sin(t*.065)*.08),depth=.7+(g%3)*.15,ox=cx+Math.cos(angle)*R*a,oy=cy+Math.sin(angle)*R*a/depth;
   for(let j=0;j<count;j++){const m=this.motif(g,j/count*128|0),n=nodes[j%nodes.length],scale=(38+g%2*12)*a,x=ox+m.x*scale,y=oy+m.y*scale;p.fillStyle=n.ink;p.globalAlpha=.48+a*.48;p.fillText(n.glyph,x,y);this.exitMatter.push({x,y,ink:n.ink,glyph:n.glyph,group:g});}
  }
  p.restore();this.phase='inside-the-jewel';this.count=this.exitMatter.length;
 };
 P.prepareV6=function(w,h){
  const portrait=h>w,lines=portrait?VStory.endingPortrait:VStory.endingLandscape,font=Math.min(w*(portrait?.165:.070),h*(portrait?.086:.19),105),line=font*1.02,cy=h*(portrait?.43:.44),c=document.createElement('canvas');const ratio=Math.min(devicePixelRatio||1,VRuntimeProfile.dpr);c.width=Math.ceil(w*ratio);c.height=Math.ceil(h*ratio);const p=c.getContext('2d',{willReadFrequently:true});p.scale(ratio,ratio);p.fillStyle='#f0e2c8';p.textAlign='center';p.textBaseline='middle';
  for(let j=0;j<lines.length;j++){const size=j===0?font*1.06:font;p.font=`500 ${size}px FilmSerif`;p.fillText(lines[j],w*.5,cy+(j-(lines.length-1)/2)*line,w*.88);}
  const data=p.getImageData(0,0,c.width,c.height).data,points=[],step=Math.max(2,Math.round((w<600?3:4)*ratio));for(let y=1;y<c.height;y+=step)for(let x=1;x<c.width;x+=step)if(data[(y*c.width+x)*4+3]>100){const row=clamp(Math.round((y/ratio-cy)/line+(lines.length-1)/2),0,lines.length-1);points.push({x:x/ratio,y:y/ratio,row,seed:((x*17+y*31)%127)/127});}
  const max=VRuntimeProfile.glyphs,stride=Math.max(1,Math.ceil(points.length/max));this.endingPoints=points.filter((_,j)=>j%stride===0);this.endingInk=c;this.endingKey=w+':'+h+':'+max;this.endingLines=lines;
 };
 P.draw=function(p,t,progress,w,h,reduced){
  if(this.endingKey!==w+':'+h+':'+VRuntimeProfile.glyphs)this.prepareV6(w,h);
  const complete=reduced||t>=12;this.phase=complete?'question-held':'rivers-become-the-question';this.count=this.endingPoints.length;p.save();
  if(!complete){p.font='7px monospace';p.textAlign='center';const matter=this.exitMatter?.length?this.exitMatter:null,groups=[...this.matter.values()].flat();
   for(let j=0;j<this.endingPoints.length;j++){const n=this.endingPoints[j],g=j%6,angle=g/6*TAU-Math.PI*.5,m=this.motif(g,(j/6|0)%128),R=Math.min(w*.36,h*.24),origin=matter?matter[j%matter.length]:{x:w*.5+Math.cos(angle)*R+m.x*38,y:h*.44+Math.sin(angle)*R+m.y*38,ink:groups[j%Math.max(1,groups.length)]?.ink||'#d7c8ae',glyph:':'},delay=n.row===0?1.3:3.8+n.row*.75,q=ease((t-delay-n.seed*.7)/4.0),arc=Math.sin(q*Math.PI),side=g%2?1:-1,x=mix(origin.x,n.x,q)+arc*side*w*(g===3?.24:.08),y=mix(origin.y,n.y,q)+arc*(g===4?h*.20:g===5?-h*.18:Math.sin(g)*h*.1);
    p.globalAlpha=.32+q*.68;p.fillStyle=q>.96?'#f0e2c8':origin.ink;p.fillText(q>.94?'·':origin.glyph,x,y);
   }
   if(t>10){p.globalAlpha=ease((t-10)/2);p.drawImage(this.endingInk,0,0,w,h);}
  }else{p.drawImage(this.endingInk,0,0,w,h);p.font='9px monospace';p.textAlign='center';for(let j=0;j<36;j++){const a=j/36*TAU,R=Math.min(w*.46,h*.33);p.globalAlpha=.18+.06*(reduced?0:Math.sin(t*.45+j));p.fillStyle='#acc0b0';p.fillText(j%5?'·':':',w*.5+Math.cos(a)*R,h*.44+Math.sin(a)*R*.90);}}
  p.restore();
 };
})();
