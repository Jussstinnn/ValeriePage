/* A source-driven aperture: the previous world changes scale around the travelling light. */
(() => {
 const {ease,clamp,mix}=VMath,TAU=Math.PI*2;
 class WorldBridge {
  constructor({kind,source,origin}){this.kind=kind;this.origin=origin;this.nodes=[];const c=document.createElement('canvas');c.width=c.height=48;const p=c.getContext('2d',{willReadFrequently:true});p.drawImage(source,0,0,48,48);const d=p.getImageData(0,0,48,48).data;for(let y=0;y<48;y+=2)for(let x=0;x<48;x+=2){const n=(y*48+x)*4,lum=d[n]*.21+d[n+1]*.72+d[n+2]*.07;if(lum>35)this.nodes.push({u:x/48,v:y/48,ink:`rgb(${d[n]},${d[n+1]},${d[n+2]})`,g:'·:iXS#@'[Math.min(6,lum/37|0)]});}this.nodes=this.nodes.slice(0,360);}
  draw(p,progress,w,h,source){
   const q=ease(progress),cx=this.origin?.x??w*.5,cy=this.origin?.y??h*.5,diagonal=Math.hypot(w,h),r=q*diagonal;
   const path=this.kind.includes('paw'),painting=this.kind.includes('brush'),petal=this.kind.includes('petal'),letter=this.kind.includes('letter')||this.kind.includes('velvet');
   p.save();p.beginPath();p.rect(0,0,w,h);
   if(path){p.moveTo(cx-r*.5,cy-r);p.bezierCurveTo(cx+r,cy-r,cx+r*.7,cy+r,cx+r*.5,cy+r);p.bezierCurveTo(cx-r,cy+r,cx-r*.7,cy-r,cx-r*.5,cy-r);}
   else if(letter)p.rect(cx-r,cy-r*.35,r*2,r*.7);
   else p.ellipse(cx,cy,r*(painting?1.5:1),Math.max(.01,r*(petal?.65:1)),petal?-.6:0,0,TAU);
   p.clip('evenodd');const z=1+q*(painting?2.8:1.1);p.translate(cx,cy);p.scale(z,z);p.translate(-cx,-cy);p.drawImage(source,0,0,w,h);p.restore();
   p.save();p.font='9px monospace';p.textAlign='center';
   for(let i=0;i<this.nodes.length;i++){const n=this.nodes[i],a=(i/this.nodes.length)*TAU,s=Math.sin(q*Math.PI),ex=path?w*.5+Math.sin(n.v*4)*w*.12:cx+Math.cos(a)*r*.48,ey=path?h*.3+n.v*h*.7:cy+Math.sin(a)*r*.48;const x=mix(n.u*w,ex,q),y=mix(n.v*h,ey,q);p.globalAlpha=s*.8;p.fillStyle=n.ink;p.fillText(n.g,x,y);}p.restore();
  }
  state(){return{kind:this.kind,sourceGlyphs:this.nodes.length,aperture:true};}
 }
 window.VGlyphTransition=WorldBridge;
})();
