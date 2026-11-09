/* Three rooms, one live photograph, and a quiet observatory made from its own characters. */
(() => {
 const {ease,mix,clamp}=VMath,TAU=Math.PI*2;
 class MemoryAtelier {
  constructor(session){this.session=session;this.choice=-1;this.selectedAt=-100;this.positions=[];this.mode=null;this.reveal=null;}
  exposure(p,i,t,rect,still){
   // Clip the whole original canvas. The last frame is always the complete photograph.
   const duration=[4.4,3.8,5.8][i-6],q=still?1:ease(t/duration);this.reveal={kind:['woven-contours','two-halves-meet','quiet-development'][i-6],progress:q,complete:q>=1};if(q>=1)return;
   p.beginPath();
   if(i===6){for(let j=0;j<36;j++){const a=j/35,front=clamp(q*1.5-Math.abs(a-.5)*.9),x=rect.x+a*rect.w;p.rect(x,rect.y,rect.w/35+1,rect.h*front);}}
   else if(i===7){const half=rect.w*.5;p.rect(rect.x,rect.y,half*q,rect.h);p.rect(rect.x+rect.w-half*q,rect.y,half*q,rect.h);}
   else{p.rect(rect.x,rect.y,rect.w,rect.h);p.globalAlpha=.12+q*.88;}
   p.clip();
  }
  background(p,i,q,t,w,h,reduced){if(i<6||i>8)return;this.mode=['linen-traces','two-warm-arcs','a-quiet-vertical'][i-6];p.save();
   p.fillStyle=i===7?'#241b20':i===6?'#131b22':'#0b151c';p.fillRect(0,0,w,h);p.font='10px monospace';p.textAlign='center';
   if(i===6){p.fillStyle='#c5b8aa';for(let j=0;j<80;j++){const s=j/79;p.globalAlpha=.12+Math.sin(s*Math.PI)*.2;p.fillText(j%4?':':'·',w*.08+s*w*.22,h*.18+s*h*.58);p.fillText(j%5?'·':':',w*.92-s*w*.12,h*.16+s*h*.62);}}
   if(i===7){p.strokeStyle='#c5a68e33';for(const side of [-1,1]){p.beginPath();p.moveTo(w*.5,h*.14);p.bezierCurveTo(w*(.5+side*.48),h*.3,w*(.5+side*.44),h*.7,w*.5,h*.84);p.stroke();}}
   if(i===8){p.fillStyle='#a7beb5';p.globalAlpha=.20;for(let j=0;j<24;j++)p.fillText(j%4?':':'·',w*.13,h*.15+j*h*.025);}p.restore();
  }
  field(i,q,r){const approach=ease(q/.3),scale=mix(.91,1,approach),side=i===6?-.02:i===7?.035:0;return{x:r.x+r.w*(.5+side)-r.w*scale*.5,y:r.y+(1-scale)*r.h*.50,w:r.w*scale,h:r.h*scale};}
  observe(p,{index,progress,time,w,h,universe,reduced}){if(index!==8||progress<.62)return;const q=ease((progress-.62)/.3),radius=Math.min(w*.34,h*.23);p.save();p.globalAlpha=q;p.fillStyle='#0c1720';p.fillRect(0,0,w,h);this.positions=[];
   const groups=[...universe.matter.values()];p.font='9px monospace';p.textAlign='center';for(let g=0;g<6;g++){const a=-Math.PI*.5+g/6*TAU+(reduced?0:Math.sin(time*.09)*.07),cx=w*.5+Math.cos(a)*radius,cy=h*.44+Math.sin(a)*radius;this.positions.push({x:cx,y:cy});const nodes=groups[g]?.length?groups[g]:[{ink:'#d9c9ad',glyph:':'}],selected=this.choice===g;p.globalAlpha=q*(selected?.98:.75);for(let j=0;j<96;j++){const n=nodes[j%nodes.length],m=universe.motif(g,j*128/96|0);p.fillStyle=selected&&j%8===0?'#fff0ca':n.ink;p.fillText(n.glyph,cx+m.x*36,cy+m.y*36);}}
   const text=VStory.observatory?.[this.choice];if(text){p.fillStyle='#e9dbc4';p.globalAlpha=q;p.font='20px FilmSerif';p.fillText(text,w*.5,h*.44+radius+65,w*.85);}p.restore();this.mode='observatory-of-small-things';
  }
  touch(time,x,y){let choice=(this.choice+1)%6;if(Number.isFinite(x)&&this.positions.length){let distance=70;this.positions.forEach((n,i)=>{const d=Math.hypot(n.x-x,n.y-y);if(d<distance){distance=d;choice=i;}});}this.choice=choice;this.selectedAt=time;this.session.remember('observatory:'+choice,{seen:true});return VStory.observatory?.[choice]||'';}
  state(){return{mode:this.mode,choice:this.choice,positions:this.positions,reveal:this.reveal};}
 }
 window.VMemoryAtelier=MemoryAtelier;
})();
