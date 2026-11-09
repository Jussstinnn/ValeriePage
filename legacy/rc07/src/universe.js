/* Pixels stay local. Their colour and density become the matter of the closing words. */
(() => {
 const {ease,mix,clamp,rand}=VMath,TAU=Math.PI*2;
 class Universe {
  constructor(session){this.session=session;this.matter=new Map();this.words=[];this.name=[];this.key='';this.phase='opening';this.count=0;}
  collect(id,source){if(!source||this.matter.has(id))return;const c=document.createElement('canvas');c.width=c.height=48;const p=c.getContext('2d',{willReadFrequently:true});p.drawImage(source,0,0,48,48);const d=p.getImageData(0,0,48,48).data,points=[];for(let y=0;y<48;y+=2)for(let x=0;x<48;x+=2){const n=(y*48+x)*4,lum=(d[n]*.21+d[n+1]*.72+d[n+2]*.07);if(lum>42&&d[n+3])points.push({u:x/48,v:y/48,ink:`rgb(${d[n]},${d[n+1]},${d[n+2]})`,glyph:'·:iXS#@'[Math.min(6,Math.floor(lum/37))]});}this.matter.set(id,points.slice(0,180));}
  type(lines,w,h,name=false){
   const c=document.createElement('canvas');c.width=Math.ceil(w);c.height=Math.ceil(h);const p=c.getContext('2d',{willReadFrequently:true});p.fillStyle='#fff';p.textAlign='center';p.textBaseline='middle';
   const portrait=h>w,font=name?Math.min(w*.24,140):Math.min(w*(portrait?.139:.086),h*.14,100),line=font*1.12,cy=name?h*.43:h*.46;
   for(let i=0;i<lines.length;i++){p.font=`500 ${i===0&&!name?font*.79:font}px FilmSerif`;p.fillText(lines[i],w*.5,cy+(i-(lines.length-1)/2)*line,w*.87);}
   const d=p.getImageData(0,0,c.width,c.height).data,pts=[],step=w<500?3:4;for(let y=0;y<c.height;y+=step)for(let x=0;x<c.width;x+=step)if(d[(y*c.width+x)*4+3]>100)pts.push({x,y,seed:rand(x*13+y*29)});
   return pts.filter((_,i)=>i%Math.max(1,Math.ceil(pts.length/1700))===0);
  }
  motif(g,j){const a=j/128*TAU;
   if(g===0){const r=.58+.25*Math.cos(5*a);return{x:Math.sin(a)*r,y:-Math.cos(a)*r};}
   if(g===1){if(j<64)return{x:Math.cos(a*2)*.48,y:.30+Math.sin(a*2)*.3};const toe=(j-64)/16|0,b=(j%16)/16*TAU;return{x:(toe-1.5)*.34+Math.cos(b)*.15,y:-.35+Math.abs(toe-1.5)*.10+Math.sin(b)*.21};}
   if(g===2)return{x:(j<64?-1:1)*(.12+Math.sin(a*2)**2*.6),y:Math.cos(a*2)*.65};
   if(g===3)return{x:j/127*1.6-.8,y:Math.sin(j/127*9)*.25+(j%3)*.13};
   if(g===4)return{x:j/127*1.5-.8,y:.5-j/127-Math.sin(j/127*Math.PI)*.4};
   return{x:Math.sin(a)*Math.sin(a/2)**2*.65,y:-Math.cos(a)*.8};
  }
  opening(p,t,w,h,reduced){
   const key=w+':'+h;if(this.nameKey!==key){this.name=this.type(['Valerie'],w,h,true);this.nameKey=key;}
   const q=reduced?1:ease((t-.35)/2.8);p.save();p.textAlign='center';p.font='6px monospace';
   for(let i=0;i<this.name.length;i++){const n=this.name[i],a=i*.54,r=(1-q)*Math.min(w,h)*(.16+n.seed*.5),x=mix(w*.5+Math.cos(a)*r,n.x,q),y=mix(h*.43+Math.sin(a)*r*.6,n.y,q);p.fillStyle=i%13?'#e9d9c5':'#a8c6b6';p.globalAlpha=.25+q*.75;p.fillText(q>.98?'·':i%3?':':'+',x,y);}
   const light=.8+.2*Math.sin(t*1.2);p.globalAlpha=light;p.fillStyle='#fff1ce';p.font='19px monospace';p.fillText('*',w*.5,h*.66);p.restore();this.phase='opening';
  }
  interlude(p,q,t,w,h,reduced){
   p.save();p.globalAlpha=ease(q*3);p.fillStyle='#080e16';p.fillRect(0,0,w,h);p.translate(w*.5,h*.46);
   // A reflected world, with distinct orbits and materials inherited from the actual canvases.
   const groups=[...this.matter.values()];const r=Math.min(w*.43,h*.28);p.textAlign='center';p.font='10px monospace';let total=0;
   for(let g=0;g<6;g++){const found=this.session.has(['star','paw','fairy','pigment','wish','petal'][g]);const nodes=groups[g]?.length?groups[g]:[{u:.5,v:.5,ink:'#d8c6a5',glyph:':'}],theta=g/6*TAU+(reduced?0:t*.055)+(found?.12:0),scale=mix(.1,1,ease(q*1.8));
    for(let j=0;j<128;j++){const n=nodes[j%nodes.length],shape=this.motif(g,j),x=(Math.cos(theta)*r*.7+shape.x*r*.29)*scale,y=(Math.sin(theta)*r*.80+shape.y*r*.29)*scale;p.fillStyle=found&&j%11===0?'#fff0ca':n.ink;p.globalAlpha=.45+ease(q)*.5;p.fillText(n.glyph,x,y);total++;}
   }
   p.globalAlpha=1;p.fillStyle='#e2d5ba';p.font='16px monospace';p.fillText('*',0,0);p.restore();this.phase='inside-the-jewel';this.count=total;
  }
  draw(p,t,progress,w,h,reduced){
   if(this.key!==w+':'+h){this.words=this.type(VStory.questionLines||['Valerie,','¿quieres ser','mi novia?'],w,h);this.key=w+':'+h;}
   const stage=reduced?1:ease((t-1.4)/6),orbit=reduced?0:Math.max(0,1-stage);this.phase=stage<1?'worlds-become-words':'question-held';
   p.save();p.textAlign='center';p.textBaseline='middle';p.font='6px monospace';const groups=[...this.matter.values()].flat();
   for(let i=0;i<this.words.length;i++){
    const n=this.words[i],g=i%6,a=g/6*TAU+(reduced?0:t*.035),ring=Math.min(w*.43,h*.28),shape=this.motif(g,Math.floor(i/6)%128),m=groups[i%Math.max(1,groups.length)],startX=w*.5+Math.cos(a)*ring*.7+shape.x*ring*.29,startY=h*.46+Math.sin(a)*ring*.8+shape.y*ring*.29,delay=n.seed*.25,q=ease((stage-delay)/(1-delay));
    const x=mix(startX,n.x,q),y=mix(startY,n.y,q)-Math.sin(q*Math.PI)*h*.11;
    p.globalAlpha=.24+.76*q;p.fillStyle=q>.9?'#f2e5d0':m?.ink||'#b6c5be';p.fillText(q>.96?'·':m?.glyph||':',x,y);
   }
   if(stage>.97){
    // The same silhouette gains a fine typographic interior, rather than switching to an HTML title.
    const portrait=h>w,font=Math.min(w*(portrait?.139:.086),h*.14,100),line=font*1.12,lines=VStory.questionLines||['Valerie,','¿quieres ser','mi novia?'];p.globalAlpha=ease((stage-.97)/.03)*.93;p.fillStyle='#f2e5d0';
    for(let i=0;i<lines.length;i++){p.font=`500 ${i===0?font*.79:font}px FilmSerif`;p.fillText(lines[i],w*.5,h*.46+(i-(lines.length-1)/2)*line,w*.87);}
    p.globalAlpha=.25;p.font='9px monospace';for(let j=0;j<24;j++){const x=w*.5+Math.cos(j/24*TAU)*w*.44,y=h*.46+Math.sin(j/24*TAU)*h*.30;p.fillText(j%4?'·':':',x,y+(reduced?0:Math.sin(t*.5+j)*2));}
   }p.restore();this.count=this.words.length;
  }
  state(){return{phase:this.phase,glyphs:this.count,worlds:[...this.matter.keys()]};}
 }
 window.VUniverse=Universe;
})();
