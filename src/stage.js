/* Distance is authored by the shot. World time animates actors; gestures never navigate. */
(() => {
 const {mix,ease,span,pulse,clamp}=VF.math;
 const clone=v=>JSON.parse(JSON.stringify(v));
 const blend=(a,b,q)=>{if(typeof b==='number')return mix(typeof a==='number'?a:b,b,q);if(b&&typeof b==='object'){const c={};for(const key of Object.keys(b))c[key]=blend(a?.[key],b[key],q);return c;}return b;};
 class Stage {
  constructor(){this.light={x:.70,y:.23,vx:0,vy:0,strength:1};this.drag=null;this.events=[];this.last=null;this.transition=null;}
  reset(){this.light={x:.70,y:.23,vx:0,vy:0,strength:1};this.events=[];this.drag=null;this.last=null;this.transition=null;}
  event(kind,time,point){this.events.push({kind,at:time,point:point||null});if(this.events.length>6)this.events.shift();}
  begin(){this.transition=this.last?clone(this.last):null;}
  grab(x,y){this.drag={x:clamp(x,.04,.96),y:clamp(y,.04,.94)};}
  release(){this.drag=null;}
  geometry(view,mode){
   const f=view.frame,portrait=view.kind==='portrait',small=view.kind==='landscape',close=['meet','listen','flower'].includes(mode);
   let h=Math.min(f.h*(close?.89:.76),f.w*(close?.94:.77)),pinkH=h*(close?.79:.74),gx=.67,px=.23,gy=.91,py=.91;
   if(portrait&&close){gx=.64;px=.26;gy=.75;py=.99;}
   if(mode==='flower'&&portrait){gx=.65;px=.24;gy=.80;py=.97;h*=.95;pinkH*=.91;}
   if(mode==='play'){h*=.92;pinkH*=.97;gx=.71;px=.27;gy=.90;py=.94;}
   if(mode==='together'||mode==='rest'){h*=.98;pinkH=h*.77;gx=.62;px=.30;gy=py=.88;}
   if(mode==='walk'){px=.30;gx=.58;}
   if(mode==='passage'){h*=.88;pinkH*=.91;gx=.67;px=.26;gy=py=.89;}
   if(!portrait){h=Math.min(f.h*(close?.96:.88),f.w*.47);pinkH=h*.76;gx=.65;px=.32;gy=py=.93;if(small&&close){gx=.70;px=.29;}if(mode==='together'||mode==='rest'){gx=.62;px=.38;}}
   const actor=(id,x,y,height)=>({x:f.x+f.w*x,y:f.y+f.h*y,floor:f.y+f.h*y,s:height/VF.rigBounds[id].h,head:0,lean:0,turn:0,stride:0,crouch:0,earL:0,earR:0,earTip:0,lookX:0,lookY:0,blink:0,arms:{left:{x:id==='pink'?-38:-58,y:id==='pink'?-58:-54},right:{x:id==='pink'?38:58,y:id==='pink'?-58:-54}}});
   return{pink:actor('pink',px,py,pinkH),taupe:actor('taupe',gx,gy,h)};
  }
  updateLight(dt,mode,time,view,actors,still,flowerPoint){
   const f=view.frame,p=actors.pink,g=actors.taupe,q=span(1,6,time);let tx=.64,ty=.20;
   if(mode==='meet'){tx=mix(.76,.48,q);ty=mix(.18,.42,q);}
   if(mode==='walk'){tx=.76;ty=.38;}
   if(mode==='play'){tx=mix(.28,.68,span(2.8,5,time));ty=.23+Math.sin(span(2.8,5,time)*Math.PI)*-.12;}
   if(mode==='passage'){tx=.55;ty=.24;}
   if(mode==='listen'){tx=.47;ty=.62;}
   if(mode==='flower'){tx=(flowerPoint.x-f.x)/f.w;ty=(flowerPoint.y-f.y)/f.h;}
   if(mode==='together'||mode==='rest'){tx=.51;ty=.47;}
   const event=this.events.at(-1),age=event?time-event.at:100,attention=pulse(0,.4,2.5,4,age);
   if(event&&attention>0){const actor=event.kind==='taupe'?g:p;tx=mix(tx,(actor.x-f.x)/f.w,attention*.55);ty=mix(ty,(actor.y-f.y-175*actor.s)/f.h,attention*.55);}
   if(!still){tx+=Math.sin(time*.82)*.019;ty+=Math.sin(time*.61+.9)*.018;}
   const target=this.drag||{x:tx,y:ty};
   if(still){this.light.x=target.x;this.light.y=target.y;this.light.vx=this.light.vy=0;}
   else{const a=this.drag?23:7,damping=this.drag?7.5:4.0;this.light.vx+=(target.x-this.light.x)*a*dt-this.light.vx*damping*dt;this.light.vy+=(target.y-this.light.y)*a*dt-this.light.vy*damping*dt;this.light.x=clamp(this.light.x+this.light.vx*dt,.03,.97);this.light.y=clamp(this.light.y+this.light.vy*dt,.03,.96);}
   this.light.strength=.8+(still?0:Math.sin(time*2.1)*.13)+attention*.35;return{x:f.x+this.light.x*f.w,y:f.y+this.light.y*f.h,strength:this.light.strength};
  }
  pose(shot,time,view,{reduced=false,dt=0,transition=1}={}){
   const mode=shot.mode,t=reduced?Math.max(shot.hold,time):time,a=this.geometry(view,mode),p=a.pink,g=a.taupe,f=view.frame;
   let biome=shot.biome,cameraX=0,cameraY=0,distance=0,flower=mode==='flower'||mode==='together'||mode==='rest'?1:0,beat=mode;
   if(mode==='arrival'){
    const greet=pulse(.9,2,4,5.3,t);p.head=-.09+greet*.12;p.earL=-.08-greet*.18;p.earR=.08+greet*.17;g.head=.07-greet*.11;g.earL=greet*.13;g.lookX=-.8;p.lookX=.7;distance=.1;
   }
   if(mode==='meet'){
    const approach=span(.7,4.4,t),look=pulse(3.8,4.6,7.3,8.5,t);p.x+=mix(-f.w*.07,f.w*.035,approach);g.x+=mix(f.w*.06,-f.w*.025,approach);p.stride=Math.sin(t*6)*pulse(.7,1.3,3.5,4.4,t);g.stride=-Math.sin(t*5)*pulse(1.1,1.8,3.5,4.4,t);p.head=.12+look*.16;g.head=-.1-look*.12;p.turn=.24;g.turn=-.21;p.earL=-.2*look;p.earR=.3*look;g.earL=.32*look;g.earTip=Math.sin(t*2.2)*look*.12;p.arms.right={x:72,y:-98-look*33};g.arms.left={x:-99,y:-106-look*16};p.lookX=1;g.lookX=-1;p.lookY=-.8;g.lookY=.8;beat=t<4.4?'approach-and-recognise':'shared-gaze';
   }
   if(mode==='walk'||mode==='passage'){
    const walking=pulse(.3,1.2,7.1,8.8,t),travel=span(.6,8.6,t),stride=Math.sin(t*6.4);p.x+=(travel-.5)*f.w*.18;g.x+=(span(1.2,9.2,t)-.5)*f.w*.18;p.stride=stride*walking;g.stride=-Math.sin(t*5.3+.6)*walking;p.y-=Math.abs(stride)*4*walking;g.y-=Math.abs(Math.sin(t*5.3+.6))*3*walking;p.lean=walking*.045;g.lean=walking*.025;p.head=.09;g.head=-.06;p.turn=.22;g.turn=.08;p.lookX=.6;g.lookX=.2;p.earL=Math.sin(t*3.2)*walking*.14;g.earTip=Math.sin(t*3.2-1.1)*walking*.19;cameraX=travel*.65;distance=travel*.8;beat=walking>.1?'walking-together':'waiting-at-the-path';
    if(mode==='passage'){biome=span(.6,8.8,t);cameraY=span(2,8,t)*.5;distance=1+travel;beat=biome<.7?'through-the-leaves':'the-forest-opens';}
   }
   if(mode==='play'){
    const crouch=pulse(1.4,2.0,2.2,2.4,t),flight=t>2.2&&t<3.5?Math.sin((t-2.2)/1.3*Math.PI):0,land=pulse(3.5,3.65,3.9,4.3,t),show=pulse(3.1,4.2,6.0,7.2,t);p.crouch=crouch*.9+land*.55;p.y-=flight*Math.min(95,f.h*.19);p.x+=span(2.2,3.5,t)*f.w*.08;p.lean=flight*.10;p.head=-flight*.17;p.earL=-flight*.48;p.earR=flight*.34;g.head=-show*.18;g.earR=-show*.25;g.arms.left={x:-97,y:-45-show*134};p.arms.right={x:53+flight*18,y:-43-flight*66};p.lookX=.8;g.lookX=-.9;cameraY=flight*.14;beat=flight>.05?'a-real-leap':show>.2?'the-other-keeps-the-light':'anticipation-and-rest';
   }
   if(mode==='listen'){
    const listen=pulse(.8,2.1,5.1,6.8,t),reply=pulse(4.4,5.8,8.5,10,t);g.head=-.21*listen;g.earL=.57*listen;g.earR=-.10*listen;g.earTip=Math.sin((t-1.8)*2.1)*listen*.19;g.turn=-listen*.22;p.head=.15*reply;p.earL=-reply*.21;p.earR=reply*.31;p.turn=reply*.18;g.arms.left={x:-86,y:-51-listen*27};p.lookY=.8;g.lookY=.8;flower=span(3,6,t)*.7;beat=listen>.2?'the-long-ear-listens':reply>.2?'a-small-reply':'quiet-under-the-canopy';
   }
   if(mode==='flower'){
    const bend=pulse(.8,2.8,6.2,8,t),sniff=pulse(3.5,4.5,7.5,9,t);g.head=-.22*bend;g.lean=-.045*bend;g.arms.left={x:-103,y:-43+bend*13};g.earL=.19*bend;p.head=.24*sniff;p.lean=.08*sniff;p.earL=.14*sniff;p.earR=-.13*sniff;g.lookX=-.7;p.lookX=.7;g.lookY=p.lookY=.9;flower=span(2.5,5.8,t);beat=flower<.9?'a-paw-awakens-the-flower':'two-looking-at-one-flower';
   }
   if(mode==='together'||mode==='rest'){
    const hand=mode==='rest'?1:span(.8,3.8,t),target={x:mix(p.x+41*p.s,g.x-63*g.s,.5),y:mix(p.y-108*p.s,g.y-114*g.s,.5)+12};p.arms.right={x:mix(51,(target.x-p.x)/p.s,hand),y:mix(-43,(target.y-p.y)/p.s,hand)};g.arms.left={x:mix(-79,(target.x-g.x)/g.s,hand),y:mix(-43,(target.y-g.y)/g.s,hand)};p.head=.07*hand;g.head=-.075*hand;p.turn=.15*(1-span(5,7,t));g.turn=-.13*(1-span(5,7,t));p.lookX=1-span(5,8,t);g.lookX=-p.lookX;p.earL=-.09;g.earTip=.025;beat=hand>.9?'paws-together':'reaching-for-each-other';
   }
   const event=this.events.at(-1),age=event?t-event.at:100,answer=pulse(0,.45,2.2,3.5,age);
   if(event&&answer>.001){
    if(event.kind==='pink'||event.kind==='both'||event.kind==='light'){p.head-=answer*.17;p.arms.left={x:-73-answer*22,y:-43-answer*(105+Math.sin(age*6)*12)};p.earL-=answer*.35;p.earR+=answer*.30;p.lookX=-.1;p.lookY=-.4;}
    if(event.kind==='taupe'||event.kind==='both'||event.kind==='light'){g.head+=answer*.15;g.arms.right={x:99+Math.sin(age*5)*answer*9,y:-43-answer*112};g.earR-=answer*.36;g.earL+=answer*.12;g.earTip=Math.sin(age*3)*answer*.2;g.lookX=.1;}
    if(event.kind==='flower'||event.kind==='forest')flower=1;beat='responding-'+event.kind;
   }
   for(const [id,pose]of Object.entries(a)){
    const b=VF.rigBounds[id],r=view.frame,margin=4;
    // Entire reference silhouette and ear envelope stay inside the usable art rectangle.
    pose.x=clamp(pose.x,r.x-b.x*pose.s+margin,r.x+r.w-(b.x+b.w)*pose.s-margin);
    pose.y=clamp(pose.y,r.y-b.y*pose.s+margin,r.y+r.h-(b.y+b.h)*pose.s-margin);
    const cycle=(t+(id==='pink'?1.1:3.0))%5.7;pose.blink=reduced?0:cycle<.16?Math.sin(cycle/.16*Math.PI):0;
    if(!reduced){pose.head+=Math.sin(t*.9+(id==='pink'?0:1))*.012;pose.earL+=Math.sin(t*1.2)*.012;pose.earR+=Math.sin(t*1.1+.8)*.012;}
   }
   const calm=mode==='together'||mode==='rest';let flowerPoint={x:f.x+f.w*.48,y:f.y+f.h*.96-Math.min(calm?65:135,f.h*(calm?.13:.29))};
   if((mode==='together'||mode==='rest')&&answer<.01){
    const q=mode==='rest'?1:span(.8,3.8,t),rp=81*p.s,rg=88*g.s;
    let shoulderP={x:p.x+41*p.s,y:p.y-117*p.s},shoulderG={x:g.x-63*g.s,y:g.y-121*g.s};
    const dy=shoulderG.y-shoulderP.y,dx=shoulderG.x-shoulderP.x,reach=(rp+rg)*.84,wanted=Math.sqrt(Math.max(25,reach*reach-dy*dy)),close=Math.max(0,dx-wanted);
    p.x+=close*.55;g.x-=close*.45;
    for(const [id,actor]of Object.entries(a)){const box=VF.rigBounds[id];actor.x=clamp(actor.x,f.x-box.x*actor.s+4,f.x+f.w-(box.x+box.w)*actor.s-4);}
    shoulderP={x:p.x+41*p.s,y:p.y-117*p.s};shoulderG={x:g.x-63*g.s,y:g.y-121*g.s};
    const target={x:mix(shoulderP.x,shoulderG.x,rp/(rp+rg)),y:mix(shoulderP.y,shoulderG.y,rp/(rp+rg))};
    p.arms.right={x:mix(51,(target.x-p.x)/p.s,q),y:mix(-43,(target.y-p.y)/p.s,q)};
    g.arms.left={x:mix(-79,(target.x-g.x)/g.s,q),y:mix(-43,(target.y-g.y)/g.s,q)};
   }
   if(mode==='flower'){
    const q=pulse(.8,2.8,6.2,8,t),nx=-7,ny=-60,c=Math.cos(g.lean),sn=Math.sin(g.lean);
    flowerPoint={x:g.x+(nx*c-ny*sn)*g.s,y:g.y+(nx*sn+ny*c)*g.s};
    g.arms.left={x:mix(-79,nx,q),y:mix(-43,ny,q)};
    for(const actor of [p,g]){actor.lookX=clamp((flowerPoint.x-actor.x)/90,-1,1);actor.lookY=clamp((flowerPoint.y-(actor.y-190*actor.s))/80,-1,1);}p.head=-.16*pulse(3.5,4.5,7.5,9,t);
   }
   const light=this.updateLight(dt,mode,t,view,a,reduced,flowerPoint);for(const pose of Object.values(a)){if(this.drag){pose.lookX=clamp((light.x-pose.x)/100,-1,1);pose.lookY=clamp((light.y-(pose.y-190*pose.s))/90,-1,1);pose.turn=pose.lookX*.28;}}
   let result={actors:a,biome,cameraX,cameraY,distance,flower,flowerPoint,beat,light};if(this.transition&&transition<1){result=blend(this.transition,result,ease(transition));}else this.transition=null;this.last=clone(result);return result;
  }
  state(){return{light:{...this.light},events:clone(this.events),beat:this.last?.beat,biome:this.last?.biome,actors:this.last?.actors||null};}
 }
 VF.Stage=Stage;
})();
