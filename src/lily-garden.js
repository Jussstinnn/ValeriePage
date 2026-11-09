/* V6 botanical renderer adapted from the preserved original, without ASCII/UI.
   Its fourteen lilies, growth curves, unfurling, veins and petal textures are retained. */
(() => {class LilyGarden{constructor(){const W=640,H=720,TAU=Math.PI*2,hidden=VF.math.canvas(W,H);let paint=hidden.getContext('2d'),active=-1,gesture=0;
  function rnd(seed) { const v = Math.sin(seed * 127.1 + 78.233) * 43758.5453; return v - Math.floor(v); }
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = v => 1 - Math.pow(1 - clamp(v), 3);
  const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
  const lerp = (a, b, t) => a + (b - a) * t;
  const rgba = (hex, a) => {
    const s = hex.replace('#', '');
    return `rgba(${parseInt(s.slice(0,2),16)},${parseInt(s.slice(2,4),16)},${parseInt(s.slice(4,6),16)},${a})`;
  };

  const palettes = {
    ruby: { base: '#851c2e', mid: '#f5353e', tip: '#ff7169', shadow: '#60121b', vein: '#6c1624', pollen: '#ecc187' },
    blush: { base: '#8d346c', mid: '#e978c2', tip: '#ffcae7', shadow: '#78345e', vein: '#b4548c', pollen: '#b97543' },
    cream: { base: '#af8f7c', mid: '#edcfb5', tip: '#fff4da', shadow: '#927768', vein: '#b78c72', pollen: '#9a5a2e' },
    amber: { base: '#9e6122', mid: '#f1bd39', tip: '#ffed7b', shadow: '#905323', vein: '#b2762c', pollen: '#a45722' },
    coral: { base: '#8e2748', mid: '#e46c89', tip: '#ffceca', shadow: '#813040', vein: '#a44159', pollen: '#b56841' },
    wine: { base: '#421020', mid: '#b52d4e', tip: '#ed7182', shadow: '#5c1129', vein: '#6a2136', pollen: '#e39b5a' },
    ivory: { base: '#9f8b85', mid: '#f4e8d8', tip: '#fff9ea', shadow: '#a68f85', vein: '#ba998d', pollen: '#a15e3e' }
  };

  // x / y / radio / color / aparición / orientación / profundidad.
  const flowers = [
    { x: 210, y: 215, s: 66, c: 'ivory', start: 3.25, a: -.15, z: 0, pitch:.75 },
    { x: 398, y: 213, s: 63, c: 'amber', start: 3.50, a:  .23, z: 0, pitch:.81 },
    { x: 159, y: 344, s: 62, c: 'amber', start: 4.05, a: -.49, z: 1, pitch:.86 },
    { x: 464, y: 343, s: 61, c: 'coral', start: 4.43, a:  .46, z: 1, pitch:.83 },
    { x: 150, y: 460, s: 58, c: 'amber', start: 4.72, a: -.52, z: 1, pitch:.78 },
    { x: 480, y: 465, s: 53, c: 'wine', start: 5.00, a:  .50, z: 1, pitch:.88 },
    { x: 362, y: 327, s: 65, c: 'ivory', start: 4.57, a:  .07, z: 2, pitch:.91 },
    { x: 312, y: 262, s: 86, c: 'ruby', start: 4.10, a: -.06, z: 3, pitch:.91 },
    { x: 243, y: 412, s: 91, c: 'blush', start: 4.94, a: -.35, z: 4, pitch:1.00 },
    { x: 356, y: 469, s: 99, c: 'cream', start: 5.38, a:  .13, z: 5, pitch:.94 },
    { x: 283, y: 521, s: 51, c: 'coral', start: 5.85, a: -.26, z: 2, pitch:.80 },
    { x: 462, y: 248, s: 41, c: 'amber', start: 5.45, a:  .55, z: 0, pitch:.75 },
    { x: 163, y: 408, s: 40, c: 'blush', start: 5.65, a: -.31, z: 0, pitch:.85 },
    { x: 332, y: 148, s: 44, c: 'wine', start: 4.18, a:  .14, z: 0, pitch:.80 },
  ].map((f, i) => ({ ...f, id: i, root: 320 + (rnd(i + 40) - .5) * 85 }));
  const buds = [
    [140, 287], [183, 169], [235, 117], [275, 105], [354, 103], [405, 135],
    [497, 247], [520, 361], [120, 512], [502, 533], [414, 158]
  ].map(([x,y], i) => ({x,y, root: 318+(rnd(130+i)-.5)*100,id:flowers.length+i}));
  const allStems = [...flowers, ...buds];
  const stars = Array.from({length: 86}, (_,i) => ({ x: rnd(i+219)*W, y: rnd(i+683)*(H-95)+12, radius: .35 + rnd(i+600)*.9, alpha: .07+rnd(i+444)*.25, phase: rnd(i+900)*TAU }));

  function bezier(a,b,c,d,t) {
    const q = 1-t;
    return q*q*q*a+3*q*q*t*b+3*q*t*t*c+t*t*t*d;
  }
  function stemPoint(f,t) {
    const dx = f.x-f.root;
    const rootY = 674;
    return { x: bezier(f.root, f.root+dx*.18, f.x-dx*.20, f.x, t),
      y: bezier(rootY, 535, f.y+lerp(90,250,rnd(f.id+34)), f.y, t) };
  }
  function taperedLeaf(x,y,dx,dy,w,color,progress=1) {
    if (progress <= 0) return;
    dx *= ease(progress); dy *= ease(progress); w *= Math.max(.05, ease(progress));
    const nx = -dy/Math.max(1,Math.hypot(dx,dy)), ny = dx/Math.max(1,Math.hypot(dx,dy));
    paint.beginPath(); paint.moveTo(x,y);
    paint.bezierCurveTo(x+dx*.33+nx*w, y+dy*.35+ny*w, x+dx*.83+nx*w*.48, y+dy*.89+ny*w*.48, x+dx,y+dy);
    paint.bezierCurveTo(x+dx*.72-nx*w*.42, y+dy*.72-ny*w*.42, x+dx*.30-nx*w*.26,y+dy*.35-ny*w*.26,x,y);
    const grad = paint.createLinearGradient(x,y,x+dx,y+dy);
    grad.addColorStop(0,'#173420'); grad.addColorStop(.47,color); grad.addColorStop(1,'#9dad60');
    paint.fillStyle=grad; paint.fill();
    paint.strokeStyle='#a9ba738c'; paint.lineWidth=.85; paint.beginPath(); paint.moveTo(x,y); paint.quadraticCurveTo(x+dx*.55,y+dy*.52,x+dx,y+dy); paint.stroke();
  }
  function drawStem(f,t) {
    const start = .14 + f.id*.046;
    const progress = ease((t-start)/2.16);
    if (progress<=0) return;
    const total = Math.max(3,Math.round(progress*37));
    paint.lineCap='round'; paint.lineJoin='round';
    for (let pass=0;pass<2;pass++) {
      paint.beginPath();
      for(let i=0;i<=total;i++) {
        const p=stemPoint(f,progress*i/total);
        if (!i) paint.moveTo(p.x,p.y); else paint.lineTo(p.x,p.y);
      }
      paint.lineWidth = pass===0 ? 4.6 : 1.25;
      paint.strokeStyle = pass===0 ? '#274b2c' : '#92a45b'; paint.stroke();
    }
    for(let j=0;j<3;j++) {
      const at = .23 + j*.19 + rnd(f.id*4+j)*.07;
      if (progress < at) continue;
      const p=stemPoint(f,at);
      const dir=((f.id+j)%2===0 ? 1 : -1);
      const length=34 + rnd(f.id*22+j)*24;
      taperedLeaf(p.x,p.y,dir*length,-(14+rnd(j+f.id*11)*33),8+rnd(j*10+f.id)*8, j%2?'#5e8c45':'#739b54', (progress-at)/.22);
    }
  }
  function drawGrass(t) {
    const g=ease((t-.2)/1.9);
    if(g<=0)return;
    for(let i=0;i<32;i++) {
      const rootX=318+(rnd(i+1200)-.5)*74;
      const rootY=675+rnd(i+2000)*6;
      const dir=rnd(i+133)*2-1;
      const length=34+rnd(i+500)*63;
      const endX=rootX+dir*length*1.82;
      const endY=rootY-20-rnd(i+302)*99;
      taperedLeaf(rootX,rootY,endX-rootX,endY-rootY,2.7+rnd(i+29)*5.5,i%2?'#608e49':'#3c7b3b',g);
    }
  }
  function drawBud(f,t) {
    const stemDone=ease((t-(.14+f.id*.046))/2.16);
    if(stemDone<.93) return;
    const bloom=flowers.includes(f)? clamp((t-f.start+.45)/.42):0;
    if(bloom>=1) return;
    const sz=flowers.includes(f)?14:9;
    paint.save(); paint.translate(f.x,f.y); paint.rotate(.22*Math.sin(f.id));
    paint.scale(.75+.25*stemDone, .75+.25*stemDone);
    const grad=paint.createLinearGradient(0,-sz,sz,sz);
    const colored=flowers.includes(f);
    const tone=colored?palettes[f.c].mid:'#9a9b73';
    grad.addColorStop(0,colored?tone:'#b3b483');
    grad.addColorStop(.34,colored?palettes[f.c].base:'#7b9161');
    grad.addColorStop(.72,'#536c44');grad.addColorStop(1,'#243c27');
    paint.fillStyle=grad; paint.globalAlpha=1-bloom;
    paint.beginPath(); paint.moveTo(0,sz*.75);
    paint.bezierCurveTo(-sz*.65,3,-sz*.55,-sz*.9,0,-sz*1.2);
    paint.bezierCurveTo(sz*.72,-sz*.8,sz*.65,3,0,sz*.75); paint.fill();
    paint.strokeStyle='#a6a379';paint.lineWidth=1;paint.beginPath();paint.moveTo(0,sz*.6);paint.lineTo(0,-sz*.85);paint.stroke();
    // Sepals frame each colored lily bud before its petals unfold.
    paint.strokeStyle='rgba(130,168,83,.8)';paint.lineWidth=1.3;
    paint.beginPath();paint.moveTo(-sz*.52,sz*.15);paint.quadraticCurveTo(-sz*.56,-sz*.37,-sz*.24,-sz*.7);
    paint.moveTo(sz*.52,sz*.15);paint.quadraticCurveTo(sz*.56,-sz*.37,sz*.24,-sz*.7);paint.stroke();
    paint.restore();
  }
  // Perfil botánico: la anchura máxima se desplaza hacia los hombros de cada tépalo.
  // Puntas torcidas y bordes orgánicos; textura y nervaduras recortadas dentro de la silueta.
  function drawPetal(palette, angle, length, width, id, rear=false) {
    paint.save();paint.rotate(angle);
    const L=length, w=width;
    const bend=(rnd(id*43+2)-.5)*L*.18;
    const shoulder=.61+rnd(id*13+7)*.10;
    const taper=.88+rnd(id*9+24)*.09;
    paint.beginPath();paint.moveTo(-3.2,7);
    paint.bezierCurveTo(-w*.60,-L*.16, bend-w*1.09,-L*shoulder, bend-w*.23,-L*taper);
    paint.bezierCurveTo(bend-w*.18,-L*.98,bend-w*.12,-L*1.025,bend,-L*1.11);
    paint.bezierCurveTo(bend+w*.18,-L*.99,bend+w*.18,-L*.91,bend+w*.31,-L*taper);
    paint.bezierCurveTo(bend+w*1.05,-L*(shoulder+.03),w*.68,-L*.15,3.2,7);
    paint.closePath();
    const grad=paint.createLinearGradient(-w*.6,2,bend+w*.45,-L);
    grad.addColorStop(0,palette.base);
    grad.addColorStop(.22,palette.mid);
    grad.addColorStop(.61,palette.tip);
    grad.addColorStop(.88,palette.mid);
    grad.addColorStop(1,palette.base);
    paint.fillStyle=grad;paint.fill();
    paint.save();paint.clip();
    // Sombreado suave que modela la torsión de la superficie.
    const relief=paint.createLinearGradient(-w*.73,-L*.25,w*.68,-L*.8);
    relief.addColorStop(0,'rgba(31,8,16,.28)');
    relief.addColorStop(.38,'rgba(255,250,233,.16)');
    relief.addColorStop(.63,'rgba(255,252,241,.035)');
    relief.addColorStop(1,'rgba(31,11,22,.32)');
    paint.fillStyle=relief;paint.fillRect(-w*1.3,-L*1.3,w*2.9,L*1.5);
    paint.beginPath();paint.moveTo(0,0);paint.bezierCurveTo(-w*.12,-L*.22,bend*.4,-L*.68,bend,-L*1.05);
    paint.strokeStyle=rgba(palette.vein,rear?.43:.61);paint.lineWidth=1.35;paint.stroke();
    paint.beginPath();paint.moveTo(3,-L*.13);paint.bezierCurveTo(4,-L*.39,bend*.53+3,-L*.73,bend+2,-L*1.01);
    paint.strokeStyle='rgba(255,249,235,.43)';paint.lineWidth=.85;paint.stroke();
    for(const side of [-1,1]) for(let b=0;b<7;b++) {
      const q=.16+b*.105, vy=-L*q, span=w*(.54-q*.2);
      paint.beginPath();paint.moveTo(bend*q*.55,vy*.82);
      paint.quadraticCurveTo(bend*q+side*span*.48,vy-L*.025,bend*q+side*span,vy-L*.11);
      paint.strokeStyle=rgba(palette.vein,.19);paint.lineWidth=.8;paint.stroke();
    }
    // Punteado botánico y textura pastel: la información sobrevive al remuestreo ASCII.
    for(let k=0;k<77;k++) {
      const fy=.1+rnd(id*201+k)*.8, dy=-L*fy;
      const nx=bend*fy+(rnd(id*217+k)-.5)*w*(.54-fy*.19)*2;
      paint.fillStyle=rgba(palette.shadow,.12+rnd(k+id*23)*.35);
      paint.beginPath();paint.ellipse(nx,dy,.42+rnd(id+k*8)*1.1,.8+rnd(k*14+id)*1.45,.28,0,TAU);paint.fill();
    }
    for(let k=0;k<26;k++) {
      const q=.18+rnd(id*71+k)*.74, px=bend*q+(rnd(id*49+k)-.5)*w*.95;
      paint.fillStyle='rgba(255,247,228,.14)';
      paint.fillRect(px,-L*q,1.1,2.0);
    }
    // Luminous folded ridge: makes each petal read as a separate curled surface.
    paint.beginPath();
    paint.moveTo(-w*.09,-L*.12);
    paint.bezierCurveTo(-w*.23,-L*.39,bend-w*.16,-L*.70,bend-w*.035,-L*.99);
    paint.strokeStyle='rgba(255,249,224,.24)';paint.lineWidth=Math.max(1.1,w*.075);paint.stroke();
    // Leopard-lily-like basal freckles stay inside the petal mask.
    for(let k=0;k<23;k++){
      const q=.13+rnd(id*313+k*23)*.34;
      const px=bend*q*.45+(rnd(id*59+k*11)-.5)*w*(.22+q*.26)*2;
      paint.fillStyle=rgba(palette.vein,.24+rnd(id*41+k*7)*.36);
      paint.beginPath();paint.ellipse(px,-L*q,.75+rnd(k*9+id)*1.55,1.25+rnd(id*5+k)*1.8,.18,0,TAU);paint.fill();
    }
    paint.restore();
    // Dark, restrained border improves separation of overlapping blossoms in ASCII.
    paint.strokeStyle=rgba(palette.shadow,rear?.67:.83);paint.lineWidth=1.85;paint.stroke();
    paint.restore();
  }
  // V6: each petal's grain, veins and gradient are immutable. Pre-render it
  // once, then transform only its bitmap during the unfurl animation.
  // This preserves all botanical details while avoiding thousands of Canvas
  // fills/curves on every frame, especially important on mid-range phones.
  const petalCache=new Map();
  function drawCachedPetal(palette,L,wd,id,rear){
    let sprite=petalCache.get(id);
    if(!sprite){
      const x0=Math.ceil(wd*1.55+L*.14+8),y0=Math.ceil(L*1.22+16);
      sprite=document.createElement('canvas');
      sprite.width=x0*2;sprite.height=y0+18;
      sprite.anchorX=x0;sprite.anchorY=y0;
      const previous=paint;
      try{
        paint=sprite.getContext('2d',{alpha:true});
        paint.translate(sprite.anchorX,sprite.anchorY);
        drawPetal(palette,0,L,wd,id,rear);
      }finally{paint=previous;}
      petalCache.set(id,sprite);
    }
    paint.drawImage(sprite,-sprite.anchorX,-sprite.anchorY);
  }

  const shadowCache=new Map();
  function separationShadow(size){
    const key=Math.round(size);
    if(shadowCache.has(key))return shadowCache.get(key);
    const r=Math.ceil(size*1.19),c=document.createElement('canvas');
    c.width=c.height=r*2+4;
    const sc=c.getContext('2d');
    const gr=sc.createRadialGradient(r+2,r+6,size*.3,r+2,r+6,size*1.19);
    gr.addColorStop(0,'rgba(15,3,11,.95)');gr.addColorStop(1,'rgba(15,3,11,0)');
    sc.fillStyle=gr;sc.beginPath();sc.arc(r+2,r+6,size*1.19,0,TAU);sc.fill();
    shadowCache.set(key,c);return c;
  }
  function drawLily(f,t) {
    const open=smooth((t-f.start)/1.60);
    if(open<=0)return;
    const palette=palettes[f.c];
    const sway=Math.sin(t*.77+f.id*.91)*1.55*smooth((t-2.6)/3);
    paint.save();paint.translate(f.x+sway,f.y);paint.rotate(f.a);
    paint.scale(1,f.pitch||1);
    const scale=.25+.75*ease(open);
    paint.scale(scale,scale);
    const flowerRotation=f.id*.41-.12;
    // Soft depth between foreground lilies; no expensive canvas shadowBlur.
    if(f.z>=2 && open>.38){
      paint.save();paint.globalAlpha=.16*smooth((open-.38)/.36);
      const sh=separationShadow(f.s);
      paint.drawImage(sh,-sh.width/2,-sh.height/2);
      paint.restore();
    }
    const petalOrder=[0,2,4,1,3,5];
    for(let j=0;j<petalOrder.length;j++) {
      const petal=petalOrder[j],rear=j<3;
      const stagger=rear?j*.025:(j-3)*.035+.06;
      const unfurl=ease((open-stagger)/(.90-stagger));
      if(unfurl<=0)continue;
      const target=petal*TAU/6+flowerRotation;
      const closed=-.14+(petal-2.5)*.073;
      const rotation=lerp(closed,target,unfurl);
      const L=f.s*(rear?.88:1.14)*(.93+rnd(f.id*31+petal)*.19);
      const wd=f.s*(rear?.34:.42)*(.94+rnd(f.id*19+petal)*.13);
      paint.save();
      paint.rotate(rotation);
      paint.scale(.26+.74*ease(unfurl),.45+.55*ease(unfurl));
      drawCachedPetal(palette,L,wd,f.id*10+petal,rear);
      paint.restore();
    }
    // Garganta abierta, estambres y seis anteras.
    const reveal=smooth((open-.25)/.60);
    if(reveal>0) {
      paint.globalAlpha=reveal;
      const throat=paint.createRadialGradient(0,0,0,0,0,16);
      throat.addColorStop(0,rgba(palette.shadow,.94));
      throat.addColorStop(.54,rgba(palette.base,.76));
      throat.addColorStop(1,rgba(palette.base,0));
      paint.fillStyle=throat;paint.beginPath();paint.arc(0,0,16,0,TAU);paint.fill();
      for(let k=0;k<6;k++) {
        const a=k*TAU/6+.37,len=f.s*(.22+(k%3)*.05),tx=Math.cos(a)*len,ty=Math.sin(a)*len;
        paint.beginPath();paint.moveTo(0,0);paint.quadraticCurveTo(tx*.53,ty*.38-4,tx,ty);
        paint.strokeStyle=rgba(palette.pollen,.9);paint.lineWidth=1.6;paint.stroke();
        paint.beginPath();paint.ellipse(tx,ty,3.9,2.5,a,0,TAU);
        paint.fillStyle=k%2?'#7b4434':palette.pollen;paint.fill();
      }
      paint.strokeStyle=rgba(palette.pollen,.93);
      paint.lineWidth=2.2;paint.beginPath();paint.moveTo(0,1);
      paint.quadraticCurveTo(-2,-8,3,-f.s*.24);paint.stroke();
      paint.fillStyle='#d7bc72';paint.beginPath();paint.ellipse(3,-f.s*.24,3.4,4.7,-.18,0,TAU);paint.fill();
      paint.fillStyle='#402a20';paint.beginPath();paint.arc(0,0,3.2,0,TAU);paint.fill();
    }
    paint.restore();
  }
  function drawPainting(t) {
    paint.clearRect(0,0,W,H);
    allStems.forEach(f=>drawStem(f,t));
    drawGrass(t);
    allStems.forEach(f=>drawBud(f,t));
    flowers.slice().sort((a,b)=>a.z-b.z).forEach(f=>drawLily(f.id===active?{...f,a:f.a+gesture}:f,t));
  }

 this.specs=flowers.map(f=>({...f}));this.canvas=hidden;
 this.draw=(p,t,rect,{still=false,selected=-1,response=0}={})=>{const at=still?10:t;active=selected;gesture=response*.075;drawPainting(at);if(selected>=0&&at>7){const f=flowers[selected],g=paint.createRadialGradient(f.x,f.y,2,f.x,f.y,f.s*1.2);g.addColorStop(0,'#ffe1a84d');g.addColorStop(1,'#ffe1a800');paint.save();paint.globalCompositeOperation='source-atop';paint.fillStyle=g;paint.fillRect(f.x-f.s*1.2,f.y-f.s*1.2,f.s*2.4,f.s*2.4);paint.restore();}p.drawImage(hidden,50,65,540,640,rect.x,rect.y,rect.w,rect.h);return flowers.map(f=>({id:f.id,x:rect.x+(f.x-50+Math.sin(at*.77+f.id*.91)*1.55*smooth((at-2.6)/3))/540*rect.w,y:rect.y+(f.y-65)/640*rect.h,r:Math.max(22,f.s/540*rect.w*.67),open:smooth((at-f.start)/1.60)}));};
 this.detail=(p,t,id,x,y,s,still)=>{const previous=paint;try{paint=p;p.save();p.translate(x,y);p.scale(s,s);drawLily({...flowers[id],x:0,y:0},still?10:Math.max(t,8));p.restore();}finally{paint=previous;}};
 this.prime=()=>{drawPainting(10);};
 this.stats=()=>({flowers:flowers.length,petalTextures:petalCache.size,bytes:W*H*4+[...petalCache.values(),...shadowCache.values()].reduce((n,c)=>n+c.width*c.height*4,0)});
 }}VF.LilyGarden=LilyGarden;})();
