/* Sample once, transport a small, meaningful set of characters; no video or raster replacement. */
(() => {
 const TAU=Math.PI*2,{ease,clamp,mix}=window.VMath;
 const profile=kind=>({firefly:'wings',path:'path',brush:'brush',constellation:'stars',lily:'lily',portrait:'portrait',smile:'smile',instant:'frame',letter:'writing',velvet:'box',question:'question'})[kind.split('-').at(-1)]||'petal';
 function shape(type,i,n){const t=i/(n-1),a=t*TAU;
  if(type==='wings')return{x:.5+Math.sin(a)*Math.abs(Math.cos(a))*.36,y:.45+Math.cos(a)*.23};
  if(type==='path')return{x:.20+t*.60+Math.sin(t*Math.PI*2)*.04,y:.88-t*.64};
  if(type==='brush')return{x:.14+t*.72,y:.40+Math.sin(t*Math.PI*2.6)*.12+(i%3-1)*.018};
  if(type==='stars'){const j=i%5,b=j/4;return{x:.19+b*.64,y:.28+Math.sin(j*2.1)*.12};}
  if(type==='lily'){const r=.13+.06*Math.cos(6*a);return{x:.49+Math.sin(a)*r,y:i<n*.7?.30+Math.cos(a)*r:.3+(i/n-.7)*1.8};}
  if(type==='smile')return{x:(i<n/2?.28:.70)+Math.cos(a*2)*.16,y:.44+Math.abs(Math.sin(a*2))*.13};
  if(type==='portrait'||type==='frame')return{x:.50+Math.sin(a)*.29,y:.48+Math.cos(a)*.40};
  if(type==='writing'){const row=i%4;return{x:.15+t*.70,y:.28+row*.14+Math.sin(t*12+row)*.012};}
  if(type==='box')return{x:.50+Math.sin(a)*.32,y:.50+Math.cos(a)*.19};
  return{x:.5+Math.sin(a)*.21,y:.45+Math.cos(a)*.30};
 }
 class GlyphTransition {
  constructor({kind,source,from,to,origin,titlePoints=[]}){
   this.kind=kind;this.points=[];this.to=to;this.origin=origin;this.type=profile(kind);this.sampled=0;this.lastQ=0;
   const small=document.createElement('canvas');small.width=small.height=96;const p=small.getContext('2d',{willReadFrequently:true}),f=from?.w>1&&from?.h>1?from:{x:0,y:0,w:innerWidth,h:innerHeight};
   const sx=source.width/innerWidth,sy=source.height/innerHeight;p.drawImage(source,f.x*sx,f.y*sy,f.w*sx,f.h*sy,0,0,96,96);const data=p.getImageData(0,0,96,96).data,candidates=[];
   for(let y=3;y<94;y+=5)for(let x=3;x<94;x+=5){const k=(y*96+x)*4;if(Math.max(data[k],data[k+1],data[k+2])>88)candidates.push({x:f.x+x/96*f.w,y:f.y+y/96*f.h,color:`rgb(${data[k]},${data[k+1]},${data[k+2]})`});}
   this.sampled=candidates.length;const count=96;
   for(let i=0;i<count;i++){const start=candidates.length?candidates[Math.floor(i/count*candidates.length)]:{x:origin.x,y:origin.y,color:'#e7d5b4'},n=shape(this.type,i,count),target=this.type==='question'&&titlePoints.length?titlePoints[Math.floor(i/count*titlePoints.length)]:{x:to.x+n.x*to.w,y:to.y+n.y*to.h};this.points.push({x:start.x,y:start.y,tx:target.x,ty:target.y,color:start.color,seed:(i*37%97)/97});}
  }
  draw(ctx,q,width,height,outgoing){
   this.lastQ=q;const n=ease(q);ctx.save();
   // Individual character-bearing strips peel along the destination's vector field.
   for(let j=0;j<12;j++){const local=ease(clamp((q-j*.012)/.79));if(local>=1)continue;ctx.globalAlpha=1-local;const h=height/12,y=j*h,drift=this.type==='brush'?Math.sin(j*.7)*local*width*.035:(j%2?1:-1)*local*width*.014;ctx.drawImage(outgoing,0,y/height*outgoing.height,outgoing.width,outgoing.height/12,drift,y-local*height*.025,width,h+1);}
   ctx.globalCompositeOperation='screen';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='9px monospace';
   for(let i=0;i<this.points.length;i++){const p=this.points[i],t=ease(clamp((q-p.seed*.08)/.90)),arc=Math.sin(t*Math.PI),x=mix(p.x,p.tx,t)+arc*(p.seed-.5)*48,y=mix(p.y,p.ty,t)-arc*(24+p.seed*44);ctx.globalAlpha=Math.sin(Math.PI*q)*(.55+p.seed*.4);ctx.fillStyle=p.color;ctx.fillText(q<.48?(i%5===0?'*':':'):this.type==='path'?(i%3?'·':':'):this.type==='writing'?(i%4?'—':'.'):(i%7===0?'+':'·'),x,y);}
   ctx.restore();
  }
  state(){return{kind:this.kind,type:this.type,nodes:this.points.length,sampled:this.sampled,progress:this.lastQ};}
 }
 window.VGlyphTransition=GlyphTransition;
})();
