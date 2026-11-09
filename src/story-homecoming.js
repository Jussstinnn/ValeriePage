/* The same question, carrying the particular little journey Valerie made. */
(() => {
 const Base=VF.SceneEnvironment,{span,mix,ellipse}=VF.math;
 class StoryHomecoming extends Base{
  motif(p,type,x,y,size){if(['brush-star','constellation','rose-petal','light-flower'].includes(type))return this.relic(p,type,x,y,size);p.save();p.lineWidth=1.1;p.strokeStyle=type==='tree'?'#bdd8bb':'#edcf9f';p.fillStyle='#edcf9f';
   if(type==='leaf'||type==='tree'){p.beginPath();p.moveTo(x-size*.7,y+size*.7);p.bezierCurveTo(x-size,y-size*.8,x+size*.8,y-size,x+size*.7,y-size*.5);p.bezierCurveTo(x+size*.8,y+size*.4,x,y+size*.7,x-size*.7,y+size*.7);p.moveTo(x-size*.7,y+size*.7);p.lineTo(x+size*.4,y-size*.3);p.stroke();}
   else if(type==='album'){p.strokeRect(x-size,y-size*.65,size*2,size*1.3);p.beginPath();p.moveTo(x,y-size*.65);p.lineTo(x,y+size*.65);p.stroke();}
   else if(type==='paw'){ellipse(p,x,y+size*.18,size*.53,size*.38,'#dfbfa7');for(const n of [-1,0,1])ellipse(p,x+n*size*.43,y-size*.4,size*.20,size*.23,'#dfbfa7');}
   else{p.globalCompositeOperation='screen';p.drawImage(this.glow,x-size*2,y-size*2,size*4,size*4);ellipse(p,x,y,size*.14,size*.30,'#fff0c8');if(type==='firefly'){ellipse(p,x-size*.35,y-size*.15,size*.40,size*.18,'#e7d5a580',-.6);ellipse(p,x+size*.35,y-size*.15,size*.40,size*.18,'#e7d5a580',.6);}}
   p.restore();
  }
  glyphTargets(v){const key=this.questionKey;if(!this.questionCanvas)return[];if(key===this.threadTargetKey)return this.threadTargets;this.threadTargetKey=key;const c=this.questionCanvas,W=c.width,H=c.height,a=c.getContext('2d').getImageData(0,0,W,H).data,points=[];
   for(let y=2;y<H;y+=12)for(let x=2;x<W;x+=12)if(a[(y*W+x)*4+3]>140)points.push({x:v.frame.x+x/2,y:v.frame.y+y/2});this.threadTargets=points.filter((_,i)=>i%Math.max(1,Math.floor(points.length/16))===0).slice(0,16);return this.threadTargets;
  }
  finalRelics(p,s,t,v,reduced){const f=v.frame,b=s.guardian,e=s.effects||{},a=s.renderedActors||[],pink=a.find(a=>a.id==='pink'),g=a.find(a=>a.id==='taupe'),sky=e.skyMotif||'brush-star',garden=e.gardenRelic||'rose-petal',forest=e.forestLight==='mint'?'tree':'firefly',hand=(id,side)=>a.find(a=>a.id===id)?.hands[side],left=hand('pink','left'),right=hand('taupe','right');
   for(const [type,point]of [[sky,right],[garden,left]])if(point)this.motif(p,type,point.x,point.y-6,type==='constellation'?26:23);
   const question=b.view==='question',q=question?(reduced?1:span(.08,3.3,b.age)):0,motifs=[forest,'leaf',sky,'paw',garden,'album',e.quietRoute==='close'?'paw':'light',e.sealStyle==='sky'?sky:garden],targets=question?this.glyphTargets(v):[];
   // A small, readable company of forms. Every curve ends on an actual letter stroke.
   if(question&&q<1&&targets.length){for(let i=0;i<16;i++){const type=motifs[i%motifs.length],from=i%2?right:left;if(!from)continue;const to=targets[i%targets.length],u=span(i*.018,.64+i*.018,q),bend=Math.sin(u*Math.PI),x=mix(from.x,to.x,u)+bend*f.w*(i%2?.15:-.15),y=mix(from.y-10,to.y,u)-bend*f.h*(.17+(i%3)*.03);p.save();p.globalAlpha=(1-u)*.85;this.motif(p,type,x,y,Math.max(3,10*(1-u)));p.restore();}}
   else if(!question){const x=f.x+f.w*(e.forestLight==='mint'?.90:.10),y=f.y+f.h*.47;this.motif(p,forest,x,y,12);if(e.canopy)this.motif(p,'leaf',f.x+f.w*(e.canopy==='pink'?.14:.86),f.y+f.h*.62,13);}
   this.stats.storyMontage={motifs:[...new Set(motifs)],forest,sky,garden,seal:e.sealStyle||'neutral',portrait:e.portraitRoute||'neutral',album:e.albumRoute||'neutral',quiet:e.quietRoute||'neutral',progress:q,letterTargets:targets.length,neutralComplete:!Object.keys(s.decisions||{}).length,question:'Valerie, ¿quieres ser mi novia?'};
  }
 }
 VF.SceneEnvironment=StoryHomecoming;
})();
