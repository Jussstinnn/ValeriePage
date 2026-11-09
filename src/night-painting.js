/* Derived from the preserved RC07 museum's hand-authored painting.
   Original swirl fields, star positions, village and cypress; no ASCII resampling. */
(() => {let cached=null;VF.NightPainting=()=>{if(cached)return cached;const painting=VF.math.canvas(960,760),pg=painting.getContext('2d'),TAU=Math.PI*2,clamp=VF.math.clamp;
function rnd(seed){let v=Math.sin(seed*127.71+34.12)*43758.546;return v-Math.floor(v)}
function rad(ctx,x,y,r,stops){const grad=ctx.createRadialGradient(x,y,0,x,y,r);for(const [t,c] of stops)grad.addColorStop(t,c);return grad}
function linear(ctx,x,y,X,Y,stops){const grad=ctx.createLinearGradient(x,y,X,Y);for(const [t,c] of stops)grad.addColorStop(t,c);return grad}
function ell(ctx,x,y,rx,ry,color,rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,TAU);ctx.fill();ctx.restore()}
function stroke(ctx,points,col,width=2){ctx.beginPath();ctx.moveTo(points[0],points[1]);for(let i=2;i<points.length;i+=2)ctx.lineTo(points[i],points[i+1]);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=col;ctx.lineWidth=width;ctx.stroke()}
function bez(ctx,p,color,width=2){ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.bezierCurveTo(p[2],p[3],p[4],p[5],p[6],p[7]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()}
function colorAt(x,y,z){const wave=Math.sin(x*.011+y*.032+z)*.5+.5;const tints=[['#144487','#1b5aa0','#227cc0','#6badcf','#aacfd1'],['#152d66','#234c9e','#426db5','#87b8cc','#c4e0c7']];const ix=Math.floor(clamp(wave*4.99));return tints[y>520?1:0][ix]}
function makePainting(){const W=960,H=760;
 // Original, hand-authored procedural interpretation of Van Gogh's 1889 composition.
 pg.fillStyle=linear(pg,0,0,0,H,[[0,'#101c45'],[.37,'#173a79'],[.65,'#17417b'],[.78,'#1f456c'],[1,'#131e32']]);pg.fillRect(0,0,W,H);
 function b(x,y,X,Y,c,w=2){bez(pg,[x,y,x+(X-x)*.35,y-4,x+(X-x)*.73,Y+3,X,Y],c,w)}
 const night=['#142454','#1c407c','#244f91','#2763a0','#3679ae','#418caf','#699dbb','#8bb8be','#c3d1bc'];
 const yellows=['#f5e49a','#ecd05f','#e6b549','#efe194','#c9d3a6'];
 // Curvilinear coherent sky strokes. Direction field bends around three vortex cores.
 const cores=[{x:460,y:294,s:235,k:4.2},{x:677,y:390,s:110,k:2.4},{x:247,y:220,s:128,k:2.0}];
 function velocity(x,y){let u=1.45,v=.13 + .26*Math.sin(x*.006 + y*.013);
  for(const c of cores){const xx=x-c.x,yy=y-c.y,d2=xx*xx+yy*yy+1200,infl=c.k*Math.exp(-d2/(c.s*c.s*1.2));const norm=Math.sqrt(d2);u-=yy/norm*infl;v+=xx/norm*infl}
  // long sky-current arcs trace a directional S
  const river=288 + 110*Math.sin((x-175)/430*Math.PI) - 24*Math.sin(x*.010);const dif=y-river;
  const push=Math.exp(-(dif*dif)/(170*170)); v+=Math.cos((x-160)/430*Math.PI)*1.8*push;return Math.atan2(v,u)}
 // Deep underpainted bands, undulating rather than horizontal.
 for(let j=0;j<26;j++){const y=22+j*20;for(let layer=0;layer<3;layer++){
   const arr=[];for(let x=-35;x<=1000;x+=9){const ang=velocity(x,y);const yy=y+23*Math.sin(x*.012+j*.51)+9*Math.sin(x*.027+j*.64)+layer*3;arr.push(x,yy)}
   stroke(pg,arr,night[(j+layer*2)%night.length],(layer===1?7:3.7));
 }}
 // Dense impasto marks, generated along the local directional field.
 for(let i=0;i<8600;i++){
   const x=rnd(i*19+9)*W, y=rnd(i*37+31)*H*.81;
   const angle=velocity(x,y),len=7+27*rnd(i*13+7),w=.95+rnd(i*23+13)*2.8;
   const hue=night[(Math.floor(rnd(i*17+4)*night.length)+Math.floor(y/100))%night.length];
   const color=(i%19===0?yellows[i%yellows.length]:hue);
   const cx=Math.cos(angle),cy=Math.sin(angle);
   bez(pg,[x-len*cx*.5,y-len*cy*.5,x-len*cx*.15-len*cy*.06,y-len*cy*.15+len*cx*.06,x+len*cx*.15+len*cy*.05,y+len*cy*.15-len*cx*.05,x+len*cx*.5,y+len*cy*.5],color,w)
 }
 // Major, continuous luminous S-current: layered narrow ribbons and segmented impasto.
 function riverPoint(t,delta){const x=-45+1040*t;const y=365-138*Math.sin(Math.PI*t*1.22)+90*Math.sin(2.6*Math.PI*t+.25)-10*t+delta;return [x,y]}
 for(let lane=-10;lane<=10;lane++){
   const pts=[];for(let n=0;n<=185;n++){const q=n/185,[x,y]=riverPoint(q,lane*3.65);pts.push(x,y+4*Math.sin(q*22+lane*.3))}
   const col=['#0b285a','#2b5b9e','#4d94bc','#9bcdc8','#e9d98b','#c3cdb1','#3685b2','#1d477d'][((lane+16)%8)];stroke(pg,pts,col, lane%4===0?4.6:2.5)
 }
 // Cohesive whirlpool contours; broken ribbons imply hand-laid strokes.
 function eddy(cx,cy,rx,ry,twist){
  for(let lane=0;lane<14;lane++){
   const phase=lane*.24,curvePts=[];const count=170;
   for(let n=0;n<=count;n++){
    const q=n/count,ang=(q*2.1+phase)*TAU*.85,rad=Math.min(1.05,.05+q*.84+lane*.015);
    let x=cx+Math.cos(ang+twist)*rx*rad*(1+.07*Math.sin(ang*3+lane));
    let y=cy+Math.sin(ang+twist)*ry*rad*(1+.05*Math.cos(ang*4-lane));curvePts.push(x,y)
   }
   stroke(pg,curvePts,['#d7d7ae','#69b1bf','#316ba5','#a5c6cb','#e5d999','#2d5694'][lane%6],lane%3===0?4.4:2.8)
  }
 }
 eddy(438,288,183,104,.26);eddy(668,381,109,88,-.36);eddy(247,213,94,65,.28);
 // Bright halo-rich stars at visually deliberate placements; the crescent moon at upper right.
 const stars=[[112,84,28],[240,103,34],[335,76,24],[487,85,30],[625,109,35],[752,217,31],[862,128,67],[769,332,29],[528,449,24],[297,417,24],[155,316,25],[62,404,26]];
 for(let i=0;i<stars.length;i++){const [x,y,r]=stars[i];
   pg.fillStyle=rad(pg,x,y,r*2.5,[[0,'#fff4c9'],[.11,'#fce28bd9'],[.25,'#eccb5dbb'],[.47,'#90bbd4a0'],[.76,'#245b9d52'],[1,'#00000000']]);pg.fillRect(x-r*3,y-r*3,r*6,r*6);
   for(let ring=0;ring<11;ring++){pg.lineCap='round';pg.lineWidth=1.7+1.8*rnd(i*9+ring);pg.strokeStyle=['#f8e4a0','#efcc5a','#8bb8b8','#e2d390','#467eb5'][ring%5];pg.beginPath();pg.ellipse(x,y,r*(.33+ring*.13),r*(.25+ring*.105),ring*.13,ring*.17,TAU-ring*.08);pg.stroke()}
   ell(pg,x,y,r*.20,r*.20,'#fff0bd');
 }
 // The distant blue Alpilles and low village line.
 pg.fillStyle=linear(pg,0,534,0,760,[[0,'#356791'],[.35,'#284d80'],[1,'#101c3e']]);pg.beginPath();pg.moveTo(0,574);
 for(let x=0;x<=960;x+=7){pg.lineTo(x,600-30*Math.sin((x+50)*.009)-21*Math.sin(x*.029+.7))}pg.lineTo(960,760);pg.lineTo(0,760);pg.closePath();pg.fill();
 for(let i=0;i<770;i++){const x=rnd(i*4+38)*W,y=584+rnd(i*7+24)*172;
  const angle=-.35 + Math.sin(x*.012)*.3,len=7+rnd(i*19)*22;
  bez(pg,[x,y,x+len*.32,y+len*.10,x+len*.7,y-len*.08,x+len,y+len*Math.sin(angle)*.26],['#27548b','#5983a5','#4879a2','#7a978f','#315c7d'][i%5],.8+2.3*rnd(i*11))}
 // Village: rooftops, windows, the famous church spire.
 const homes=[[290,652,47],[341,663,48],[401,637,54],[470,653,42],[526,657,55],[611,665,47],[681,656,50],[746,664,52],[807,679,47],[870,668,46]];
 for(let j=0;j<homes.length;j++){
  const [x,y,w]=homes[j],h=34+j%3*8;pg.fillStyle=['#81929e','#c2b69b','#7c9daa','#a8aba7'][j%4];pg.fillRect(x,y,w,h);
  pg.fillStyle='#1a355c';pg.beginPath();pg.moveTo(x-7,y);pg.lineTo(x+w*.52,y-20-(j%3)*5);pg.lineTo(x+w+8,y);pg.closePath();pg.fill();
  for(let k=0;k<3;k++){pg.fillStyle='#dbb663';pg.fillRect(x+6+k*11,y+13,5,7)}
 }
 pg.fillStyle='#a0b7b7';pg.fillRect(575,576,21,111);pg.fillStyle='#cad0b9';pg.beginPath();pg.moveTo(561,592);pg.lineTo(586,527);pg.lineTo(610,592);pg.closePath();pg.fill();
 // Tall dark cypress in foreground, more organic and asymmetrical.
 pg.fillStyle='#111e29';pg.beginPath();pg.moveTo(139,760);pg.bezierCurveTo(124,697,131,636,144,570);pg.bezierCurveTo(121,526,148,457,131,418);pg.bezierCurveTo(109,377,126,301,140,243);pg.bezierCurveTo(123,200,135,105,166,28);pg.bezierCurveTo(203,86,182,176,205,240);pg.bezierCurveTo(188,310,220,376,209,429);pg.bezierCurveTo(241,498,228,559,258,633);pg.bezierCurveTo(271,677,290,710,286,760);pg.closePath();pg.fill();
 for(let i=0;i<1100;i++){
  const y=29+rnd(i*13+35)*733;const center=164+Math.sin(y*.021)*13+(y/760)*18;
  const radius=17+Math.sin(y*.009+1.6)*11+y*.060;
  const x=center+(rnd(i*17+3)-.5)*radius*1.6;
  if(x<center-radius*.67||x>center+radius*.73)continue;
  const len=5+18*rnd(i*31+8);const angle=-1.25+Math.sin(y*.031+i*.13)*.43;
  bez(pg,[x,y,x+Math.cos(angle)*len*.3,y+Math.sin(angle)*len*.3,x+Math.cos(angle)*len*.8,y+Math.sin(angle)*len*.8,x+Math.cos(angle)*len,y+Math.sin(angle)*len],['#273d38','#3e5944','#486051','#3e4840','#6a6244','#1d3537'][i%6],1.0+rnd(i*5)*2.3)
 }
}
makePainting();cached=painting;return cached;};VF.NightPainting.release=()=>{cached=null;};})();
