(() => {
 const TAU=Math.PI*2,clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a+(b-a)*t;
 const ease=t=>{t=clamp(t);return t*t*(3-2*t);};
 const rand=n=>{const v=Math.sin(n*127.13+311.7)*43758.5453;return v-Math.floor(v);};
 class Effects {
  constructor(){this.namePoints=[];this.nameRect=null;this.branch=[];this.touch={x:.7,y:.5,at:-100};this.quality=1;}
  fit(w,h){this.w=w;this.h=h;this.portrait=w<h&&w<701;this.namePoints=[];this.nameRect=null;}
  name(){
   const el=document.getElementById('film-title'),rect=el.getBoundingClientRect(),style=getComputedStyle(el);
   const c=document.createElement('canvas');c.width=Math.ceil(rect.width);c.height=Math.ceil(rect.height);const p=c.getContext('2d',{willReadFrequently:true});
   p.font=`${style.fontWeight} ${style.fontSize} FilmSerif`;p.fillStyle='#fff';p.textBaseline='alphabetic';
   p.letterSpacing=style.letterSpacing;
   const metrics=p.measureText('Valerie');
   const baseline=(rect.height+metrics.actualBoundingBoxAscent-metrics.actualBoundingBoxDescent)/2;
   p.fillText('Valerie',0,baseline);
   const data=p.getImageData(0,0,c.width,c.height).data,step=this.portrait?4:6;
   this.namePoints=[];
   for(let y=0;y<c.height;y+=step)for(let x=0;x<c.width;x+=step){if(data[(y*c.width+x)*4+3]>90)this.namePoints.push({x:rect.left+x,y:rect.top+y,seed:rand(x*7+y*9)});}
   this.nameRect=rect;
  }
  sky(p,t,strength=1){
   const {w,h}=this;
   p.fillStyle='#090e12';p.fillRect(0,0,w,h);
   // Very low-contrast depth; no full-screen CSS filters or continuously rasterized grain.
   const light=p.createRadialGradient(w*.73,h*.55,0,w*.66,h*.55,w*.77);
   light.addColorStop(0,'#172029');light.addColorStop(.55,'#0e151c');light.addColorStop(1,'#090e12');p.fillStyle=light;p.globalAlpha=strength;p.fillRect(0,0,w,h);p.globalAlpha=1;
   for(let i=0;i<95*this.quality;i++){
    const x=rand(i*7+1)*w,y=rand(i*13+7)*h;
    p.globalAlpha=(.13+rand(i*3)*.30)*strength*(.85+.15*Math.sin(t*.45+i));p.fillStyle=i%7===0?'#d5beb8':'#c5ced6';
    const size=rand(i*5)>.96?1.5:.7;p.fillRect(x,y,size,size);
   }p.globalAlpha=1;
  }
  botanical(p,t,mode='cover'){
   const {w,h,portrait}=this;
   p.save();
   const isFinal=mode==='finale';
   const anchorX=isFinal?w*.5:(portrait?w*.73:w*.76);
   const anchorY=isFinal?h*.92:(portrait?h*.81:h*.87);
   const scale=isFinal?Math.min(w/650,h/850):(portrait?Math.min(w/850,h/1350):Math.min(w/1050,h/850));
   p.translate(anchorX,anchorY);p.scale(scale,scale);
   const stems=isFinal?[-290,290]:[0,-105,83];
   for(const [stem,offset] of stems.entries()){
    const height=isFinal?220:(stem===0?510:stem===1?340:390),sx=offset;
    const sway=Math.sin(t*.3+stem)*3;
    const topX=sx+(stem%2?24:-35)+sway,topY=-height;
    p.font='11px monospace';p.textAlign='center';p.textBaseline='middle';
    // Each glyph follows the tangent of a growing botanical curve.
    for(let j=0;j<75;j++){
     const q=j/74,x=mix(sx,topX,q)+Math.sin(q*3.5)*18,y=-height*q;
     p.globalAlpha=.2+.35*q;p.fillStyle='#9cb5a2';p.fillText(j%6===0?':':'·',x,y);
    }
    for(let leaf=0;leaf<4;leaf++){
     const s=.22+leaf*.14,cy=-height*s,cx=mix(sx,topX,s)+Math.sin(s*3.5)*18,side=leaf%2?1:-1;
     for(let j=0;j<30;j++){
      const u=j/29,xx=cx+side*(u*76),yy=cy-46*u+Math.sin(u*Math.PI)*-18;
      p.globalAlpha=.24+Math.sin(u*Math.PI)*.2;p.fillStyle='#9cb5a2';p.fillText(j%4===0?'/':'·',xx,yy);
      p.globalAlpha=.16;p.fillText(':',cx+side*u*76,cy-46*u+Math.sin(u*Math.PI)*10);
     }
    }
    const radius=stem===0?82:62;
    for(let petal=0;petal<6;petal++){
     const angle=petal*TAU/6-.4;
     for(let j=0;j<47;j++){
      const u=j/46,len=radius*Math.sin(u*Math.PI),a=angle+(u-.5)*.68;
      const xx=topX+Math.cos(a)*len,yy=topY+Math.sin(a)*len*.72;
      p.globalAlpha=.3+Math.sin(u*Math.PI)*.55;p.fillStyle=petal%2?'#d6b6b8':'#d9cebb';
      p.fillText(j%8===0?'*':j%4===0?'+':':',xx,yy);
      if(j%2===0){p.globalAlpha=.16;p.fillText('·',mix(topX,xx,.65),mix(topY,yy,.65));}
     }
    }
    p.globalAlpha=.9;p.fillStyle='#d9c69f';p.fillText('*',topX,topY);
   }
   p.restore();
  }
  opening(p,t,reduced){
   this.sky(p,t);this.botanical(p,t);
   if(!this.nameRect)this.name();
   const complete=reduced||t>3.8;
   document.body.dataset.nameForming=String(!complete);
   if(complete)return;
   const q=ease((t-.1)/3.1),a=ease((t-3.1)/.7);
   p.save();p.font=this.portrait?'5px monospace':'7px monospace';p.textBaseline='middle';
   for(const [i,point] of this.namePoints.entries()){
    const delay=point.seed*.19,progress=ease((q-delay)/(1-delay));
    const theta=point.seed*TAU+progress*1.7;
    const sx=this.w*.7+Math.cos(theta)*(90+point.seed*180),sy=this.h*.55+Math.sin(theta)*100;
    const bend=Math.sin(progress*Math.PI)*(point.seed-.5)*120;
    const x=mix(sx,point.x,progress),y=mix(sy,point.y,progress)+bend;
    p.globalAlpha=(.35+.6*progress)*(1-a);p.fillStyle=i%7?'#eee7dd':'#c6aeaa';p.fillText(i%11===0?'+':i%3===0?':':'·',x,y);
   }p.restore();
  }
  fairies(p,t,rect){
   p.save();
   for(let i=0;i<4;i++){
    const phase=t*.32+i*1.8,x=rect.x+rect.w*(.12+i*.24)+Math.sin(phase)*rect.w*.09,y=rect.y+rect.h*(.25+(i%2)*.27)+Math.cos(phase*1.3)*rect.h*.08;
    const flap=.4+.6*Math.pow(Math.sin(t*8+i),2),size=2.8+i*.25;
    const proximity=1-clamp(Math.hypot(x/this.w-this.touch.x,y/this.h-this.touch.y)*3);
    const reach=Math.exp(-Math.max(0,t-this.touch.at)*.7)*proximity;
    p.fillStyle='#e4d9ac';p.globalAlpha=.7+reach*.3;p.fillRect(x-1,y-2,2,5);
    p.strokeStyle='#c9dfdc';p.lineWidth=.7;p.globalAlpha=.45+reach*.4;
    for(const s of [-1,1]){p.beginPath();p.ellipse(x+s*size,y-1,size*flap,size*.6,-s*.5,0,TAU);p.stroke();}
    p.fillStyle='#f3dfb4';p.globalAlpha=.7;p.fillRect(x-1,y-5,2,2);
    for(let j=1;j<5;j++){p.globalAlpha=.15*(1-j/5);p.fillRect(x-Math.cos(phase)*j*4,y+Math.sin(phase)*j*3,1,1);}
   }p.restore();
  }
  transition(p,kind,q,rect){
   const {w,h}=this;
   p.save();p.globalCompositeOperation='screen';
   const fade=Math.sin(Math.PI*q);
   if(kind==='meteor'||kind==='trail'){
    const x=mix(-w*.2,w*1.3,q),y=mix(h*.18,h*.75,q);
    const length=kind==='meteor'?w*.35:w*.12;
    for(let i=0;i<55;i++){p.globalAlpha=fade*(1-i/55)*.7;p.fillStyle='#e6d2b7';p.font=`${7+(i%4)}px monospace`;p.fillText(kind==='trail'?':':'·',x-i*length/55,y-i*length/55*.34);}
    p.globalAlpha=fade;p.fillStyle='#fff4de';p.fillRect(x,y,5,2);
   }else if(kind==='firefly'||kind==='swirl'){
    const cx=mix(w*.75,w*.57,ease(q)),cy=mix(h*.6,h*.4,ease(q));
    for(let i=0;i<110;i++){const r=(1-q)*w*.35+q*16,angle=i*2.399+q*TAU;const x=cx+Math.cos(angle)*r*Math.sqrt(i/110),y=cy+Math.sin(angle)*r*.65*Math.sqrt(i/110);p.globalAlpha=fade*(.2+rand(i)*.7);p.font=`${7+rand(i+4)*6}px monospace`;p.fillStyle=kind==='swirl'?'#bdcce0':'#d6dbac';p.fillText(i%9===0?'+':'·',x,y);}
   }else if(kind==='petals'||kind==='develop'||kind==='ink'){
    const count=kind==='petals'?130:80;
    for(let i=0;i<count;i++){
     const a=i*2.399,d=(1-q)*Math.min(w,h)*.5+q*Math.min(w,h)*.1,x=w*.6+Math.cos(a+q*.5)*d*Math.sqrt(i/count),y=h*.45+Math.sin(a+q*.5)*d*1.2*Math.sqrt(i/count);
     p.globalAlpha=fade*(.2+rand(i)*.6);p.fillStyle='#d4b8c2';p.font='12px monospace';p.fillText(i%5===0?';':':',x,y);
    }
   }else{
    for(let i=0;i<70;i++){
     const a=i*2.399,x=w*.5+Math.cos(a)*Math.min(w,h)*(.08+.5*Math.sin(q*Math.PI))*Math.sqrt(i/70),y=h*.5+Math.sin(a)*Math.min(w,h)*(.08+.5*Math.sin(q*Math.PI))*Math.sqrt(i/70);
     p.globalAlpha=fade*.7;p.fillStyle='#ddc8b2';p.font='10px monospace';p.fillText(i%13===0?'+':'·',x,y);
    }
   }
   p.restore();
  }
 }
 window.VEffects=Effects;
 window.VMath={clamp,mix,ease,rand};
})();
