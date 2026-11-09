/* RC05 lenses, genuine foreground geometry and a traversable painted surface. */
(() => {
 const {clamp,ease,mix}=VMath,TAU=Math.PI*2;
 const between=(a,b,p)=>mix(a,b,ease(p));
 class CreativeStage {
  constructor(){this.camera=null;this.flow=document.createElement('canvas');this.flow.width=this.flow.height=192;this.flowCtx=this.flow.getContext('2d');this.eventAt=-100;this.selected=null;this.previousLens=null;this.flowerLens={x:.5,y:.5,w:1,h:1};this.lastTime=0;this.stats={strips:0,foregroundGlyphs:0};}
  cameraFor(i,p,time,api,selected,reduced,source){
   let x=.5,y=.5,w=1,h=1;const q=reduced?.5:p;
   if(i===0){w=between(.48,1,Math.min(1,q*2.2));h=w;x=between(.58,.5,q);y=between(.26,.53,q);}
   if(i===1){w=1-.20*Math.sin(q*Math.PI);h=w;x=.5;y=.50-.045*Math.sin(q*Math.PI);}
   if(i===2){w=between(.65,1,Math.min(1,q*2.6));h=w;x=.5;y=between(.72,.5,q);}
   if(i===3&&api?.paintingBounds){const b=api.paintingBounds,a=ease((q-.12)/.62);w=mix(1,b.w*.79,a);h=mix(1,b.h*.79,a);x=mix(.5,b.x+b.w*.51,a);y=mix(.5,b.y+b.h*.42,a);}
   if(i===4){w=between(.64,1,Math.min(1,q*3));h=w;x=.5;y=between(.26,.5,q);}
   if(i===5){
    if(selected!==this.selected){this.previousLens={...this.flowerLens};this.selected=selected;this.eventAt=this.snapSelection?time-3:time;this.snapSelection=false;}
    const f=api?.flowerPoints?.[selected];const amount=f?ease((time-this.eventAt)/1.5):0;
    const base=this.fullBouquet?1:q<.32?between(.66,1,q/.32):1;
    const target=f?{x:f.x,y:f.y,w:.39,h:.39}:{x:.5,y:this.fullBouquet?.5:q<.32?between(.48,.5,q/.32):.5,w:base,h:base};
    const a=reduced?1:ease((time-this.eventAt)/1.5);const old=this.previousLens||target;
    this.flowerLens={x:mix(old.x,target.x,a),y:mix(old.y,target.y,a),w:mix(old.w,target.w,a),h:mix(old.h,target.h,a)};
    ({x,y,w,h}=this.flowerLens);this.stats.macro=!!f&&amount>.8;this.macroMix=f?(reduced?1:ease((time-this.eventAt-1)/.7)):0;
   }
   const plan=i===1?VShotPlan.rabbit(q,api?.getState?.()):VShotPlan.sample(VStory.chapters[i]?.id,q);
   if(plan){x=plan.cx;y=plan.cy;w=plan.w;h=plan.h;this.stats.plan=plan.id;this.stats.intentionalDetail=plan.detail;}
   // Crop only an authored detail; both endpoints include a complete protected view.
   x=clamp(x-w/2,0,1-w);y=clamp(y-h/2,0,1-h);
   return this.camera={x,y,w,h,focus:[.5,.5],scale:1,exposure:.6,actor:i===1?(q<.18?'listen':q<.32?'anticipate':q<.73?'invite':q<.88?'lookBack':'wait'):'idle',id:plan?.id||'rc06-'+i,storyProgress:p};
  }
  place(source,field,shot){const sw=source.width*shot.w,sh=source.height*shot.h;const scale=Math.min(field.w/sw,field.h/sh);return{x:field.x+(field.w-sw*scale)/2,y:field.y+(field.h-sh*scale)/2,w:sw*scale,h:sh*scale};}
  branch(p,x,y,length,angle,depth,t,ink){
   p.save();p.translate(x,y);p.rotate(angle);p.font=(depth>1?13:10)+'px monospace';p.fillStyle=ink;
   for(let j=0;j<22;j++){const a=j/21;p.fillText(j%3?'·':':',Math.sin(a*2.8+t*.25)*7,-a*length);if(j%4===0){const side=j%8?1:-1;for(let k=0;k<5;k++)p.fillText(k%2?'/':',',side*k*5,-a*length-k*2);}}
   if(depth>0){this.branch(p,0,-length*.65,length*.54,-.55,depth-1,t,ink);this.branch(p,0,-length*.82,length*.42,.62,depth-1,t,ink);}p.restore();
  }
  background(p,i,s,t,w,h){
   if(i<3){
    // Three independent depths of vineyard rows become a branching forest path.
    const forest=i===2?ease(s*2):0,advance=s+(i===1?1:0);p.save();p.textAlign='center';p.font='11px monospace';
    for(let layer=0;layer<3;layer++){
     const speed=[.08,.2,.48][layer],color=['#263e40','#3a5550','#64745c'][layer];p.fillStyle=color;p.globalAlpha=.45;
     for(let side of [-1,1])for(let j=0;j<12;j++){const z=((j/12+advance*speed)%1),pers=z*z;const y=h*.32+pers*h*.75,x=w*.5+side*(w*.08+pers*w*.61);this.branch(p,x,y,(18+pers*110)*(1+forest),side*(.16+forest*.15),layer===2?1:0,t,color);}
    }
    p.globalAlpha=.7;p.fillStyle='#9a9c79';for(let j=0;j<60;j++){const z=j/59,x=w*.5+Math.sin(z*3+s)*w*.065,y=h*.38+z*z*h*.62;p.fillText(j%2?'·':':',x,y);}p.restore();
   }
   if(i>=6&&i<=8){p.save();p.strokeStyle='#bbab9633';p.lineWidth=1;const centre=w*(i===6?.4:i===7?.63:.49),v=h*.46;for(let j=0;j<9;j++){const y=v+Math.pow(j/8,2)*(h-v);p.beginPath();p.moveTo(0,y);p.lineTo(w,y);p.stroke();}for(let j=-3;j<=3;j++){p.beginPath();p.moveTo(centre+j*10,v);p.lineTo(centre+j*w*.3,h);p.stroke();}p.restore();}
  }
  foreground(p,i,s,t,w,h){this.stats.foregroundGlyphs=0;if(i>2)return;p.save();p.globalAlpha=.9;const drift=Math.sin(t*.32)*.018;for(let k=0;k<4;k++){const side=k%2?1:-1,x=side<0?-w*.03:w*1.03,y=h*(.6+(k>>1)*.45)+(s-.5)*(k<2?150:250);this.branch(p,x,y,h*(.35+(k>>1)*.13),side*(.50+drift),2,t,'#657b64');this.stats.foregroundGlyphs+=150;}p.restore();}
  painting(p,source,rect,shot,progress,t,reduced){
   if(progress<.46)return;const amount=ease((progress-.46)/.3);p.save();p.beginPath();p.rect(rect.x,rect.y,rect.w,rect.h);p.clip();const cols=12,rows=18;this.stats.strips=cols*rows;
   // The actual painting's ASCII cells bend into a flowing corridor, not a replacement image.
   for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
    const u=x/cols,v=y/rows,cx=(shot.x+u*shot.w)*source.width,cy=(shot.y+v*shot.h)*source.height;
    const wave=reduced?0:Math.sin(v*8+t*.55+u*3)*amount,dx=wave*rect.w*.052*(.3+v),dy=reduced?0:Math.cos(u*7-t*.4+v*5)*rect.h*.022*amount;
    p.drawImage(source,cx,cy,source.width*shot.w/cols+1,source.height*shot.h/rows+1,rect.x+u*rect.w+dx,rect.y+v*rect.h+dy,rect.w/cols+2,rect.h/rows+2);
   }p.restore();
  }
  state(){return{camera:this.camera,...this.stats};}
 }
 window.VCreativeStage=CreativeStage;
})();
