/* Original, locally synthesized material recordings. Cached at 24 kHz; no network/sample library.
   Each gesture has its own excitation, resonances and temporal envelope, rather than one filtered hiss. */
(() => {
 const specs={
  soil:{duration:.62,family:'earth',rms:.19,gain:.72},crackle:{duration:.78,family:'root',rms:.16,gain:.66},pebble:{duration:.48,family:'gravel',rms:.16,gain:.68},lift:{duration:.88,family:'lift',rms:.16,gain:.65},brush:{duration:.67,family:'brush',rms:.15,gain:.68},
  step:{duration:.32,family:'plush',rms:.17,gain:.66},grass:{duration:.82,family:'grass',rms:.13,gain:.55},leaf:{duration:.80,family:'leaf',rms:.15,gain:.62},twig:{duration:.32,family:'wood',rms:.17,gain:.60},wood:{duration:.50,family:'wood',rms:.16,gain:.62},knock:{duration:.45,family:'knock',rms:.18,gain:.64},
  water:{duration:.95,family:'splash',rms:.17,gain:.72},ripple:{duration:1.30,family:'water',rms:.12,gain:.52},drip:{duration:.78,family:'drop',rms:.15,gain:.55},wind:{duration:1.6,family:'wind',rms:.11,gain:.52},insect:{duration:1.1,family:'insect',rms:.07,gain:.45},
  door:{duration:1.35,family:'door',rms:.16,gain:.68},hinge:{duration:1.5,family:'hinge',rms:.15,gain:.67},latch:{duration:.65,family:'latch',rms:.17,gain:.68},clasp:{duration:.8,family:'metal',rms:.16,gain:.66},
  paper:{duration:1.05,family:'paper',rms:.15,gain:.64},ribbon:{duration:.9,family:'silk',rms:.12,gain:.60},cloth:{duration:.9,family:'cloth',rms:.13,gain:.63},swish:{duration:1.3,family:'paint',rms:.13,gain:.60},paint:{duration:.45,family:'paint',rms:.12,gain:.55},
  wings:{duration:.65,family:'wings',rms:.10,gain:.50},chime:{duration:2.25,family:'glass',rms:.12,gain:.62},jewel:{duration:3.25,family:'jewel',rms:.13,gain:.64},bloom:{duration:2.1,family:'bloom',rms:.13,gain:.62},breath:{duration:.8,family:'breath',rms:.08,gain:.40}
 };
 const TAU=Math.PI*2,clamp=n=>Math.max(-1,Math.min(1,n));
 function synth(context,kind,variant=0){const spec=specs[kind];if(!spec)return null;const rate=24000,N=Math.ceil(rate*spec.duration),out=context.createBuffer(2,N,rate);let seed=33503+variant*107+Object.keys(specs).indexOf(kind)*7919,low=0,slow=0;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/2147483648-1;},pulses=Array.from({length:spec.family==='water'?25:12},(_,i)=>({at:(i+(rnd()+1)*.3)/13*spec.duration,f:330+(rnd()+1)*1500,a:.35+(rnd()+1)*.25}));
  for(let ch=0;ch<2;ch++){const data=out.getChannelData(ch);low=slow=0;for(let i=0;i<N;i++){const t=i/rate,u=t/spec.duration,n=rnd();low=low*.91+n*.09;slow=slow*.985+n*.015;const high=n-low,fade=Math.min(1,t/.012)*Math.min(1,(spec.duration-t)/.06),env=Math.pow(1-u,1.8);let x=0;
   const modal=(f,decay=10,at=0)=>{const d=t-at;return d<0?0:Math.sin(TAU*f*d)*Math.exp(-d*decay)*(1-Math.exp(-d*800));};
   const grains=(speed=31)=>Math.pow(.5+.5*Math.sin(TAU*t*speed+Math.sin(t*83)*2),5);
   switch(spec.family){
    case 'earth':x=(low*2+high*.22)*(.18+.82*grains(19))*env+modal(230,40)*.35;break;
    case 'root':x=(low*.7+high*.30)*grains(13)*env+modal(490,30,.19)*.32+modal(910,45,.36)*.22;break;
    case 'gravel':for(const a of pulses)x+=modal(a.f,28,a.at*.4)*a.a*.16;x+=high*.12*grains(43)*env;break;
    case 'lift':x=(low*1.7+high*.10)*Math.sin(Math.PI*u)*grains(7)+modal(260,25,.18)*.15;break;
    case 'brush':x=high*.46*(.2+.8*grains(5))*Math.sin(Math.PI*u)+low*.16*env;break;
    case 'plush':x=modal(190,27)*.8+modal(340,40,.025)*.24+low*.9*Math.exp(-t*22)+high*.08*Math.exp(-t*10);break;
    case 'grass':case 'leaf':x=(high*.34+low*.75)*(.15+.85*grains(spec.family==='grass'?11:6))*Math.sin(Math.PI*u);break;
    case 'wood':case 'knock':x=modal(275,18)*.7+modal(487,25)*.3+modal(823,40)*.15+high*.10*Math.exp(-t*80);break;
    case 'splash':case 'water':case 'drop':for(const a of pulses){const at=spec.family==='drop'?a.at*.18:a.at,d=t-at;if(d>=0)x+=Math.sin(TAU*(a.f*d+440*d*d))*Math.exp(-d*(spec.family==='water'?18:26))*.18*a.a;}x+=low*(spec.family==='splash'?1.7:.4)*Math.exp(-t*4)+high*.06*env;break;
    case 'wind':x=slow*3*Math.sin(Math.PI*u)**2+low*.18*Math.sin(Math.PI*u);break;
    case 'insect':x=Math.sin(TAU*3650*t+Math.sin(t*90)*.4)*Math.pow(Math.max(0,Math.sin(TAU*13*t)),8)*Math.sin(Math.PI*u)*.15;break;
    case 'door':case 'hinge':{const f=spec.family==='door'?185:390;const friction=.5+.5*Math.sin(t*38+Math.sin(t*7)*3);x=(Math.sin(TAU*(f*t+18*t*t))+Math.sin(TAU*(f*2.03*t+27*t*t))*.22)*friction*Math.sin(Math.PI*u)*.22+low*.5*env+modal(270,20,spec.duration*.82)*.3;break;}
    case 'latch':case 'metal':x=modal(1640,12)*.38+modal(2670,17)*.32+modal(3937,25)*.2+modal(480,35,.015)*.36+high*.18*Math.exp(-t*90);break;
    case 'paper':x=(high*.4+low*.7)*(.08+.92*grains(8))*Math.sin(Math.PI*u)+modal(1450,70,.16)*.09+modal(2100,80,.47)*.08;break;
    case 'silk':case 'cloth':x=(low*1.5+high*.15)*Math.sin(Math.PI*u)**2*(.6+.4*Math.sin(t*43));break;
    case 'paint':x=(low*.8+high*.25)*Math.sin(Math.PI*u)*(.5+.5*Math.sin(t*37)**2);break;
    case 'wings':x=(high*.35+Math.sin(TAU*630*t)*.12)*(.2+.8*Math.sin(TAU*19*t)**4)*Math.sin(Math.PI*u);break;
    case 'glass':case 'jewel':case 'bloom':{const base=spec.family==='jewel'?659.25:spec.family==='bloom'?392:523.25;for(let k=0;k<4;k++)x+=modal(base*[1,1.5,2,2.52][k],2.6+k*.7,.11*k)/(3+k);x+=high*.035*Math.exp(-t*6);break;}
    case 'breath':x=low*1.8*Math.sin(Math.PI*u)**2;break;
   }data[i]=x*fade*(ch===0?1:.96);
  }}
  let energy=0,peak=0;for(const a of [out.getChannelData(0),out.getChannelData(1)])for(const x of a){energy+=x*x;peak=Math.max(peak,Math.abs(x));}const scale=Math.min(spec.rms/Math.max(.00001,Math.sqrt(energy/(N*2))),.90/Math.max(.00001,peak));for(const a of [out.getChannelData(0),out.getChannelData(1)])for(let i=0;i<N;i++)a[i]=clamp(a[i]*scale);return out;
 }
 function ambience(context,kind){const rate=24000,N=rate*8,b=context.createBuffer(2,N,rate);for(let ch=0;ch<2;ch++){let seed=29771+ch*3911,lo=0,slow=0;const a=b.getChannelData(ch);for(let i=0;i<N;i++){seed=(seed*1664525+1013904223)>>>0;const n=seed/2147483648-1,t=i/rate;lo=lo*.94+n*.06;slow=slow*.993+n*.007;const gust=.64+.17*Math.sin(TAU*t/8)+.11*Math.sin(TAU*t/4+ch*.5);a[i]=kind==='water'?(lo*1.8+(n-lo)*.045)*gust:kind==='leaves'?(lo*1.1+(n-lo)*.065)*gust*(.65+.35*Math.sin(t*2.7+Math.sin(t*.8))**2):kind==='room'?slow*1.8:slow*3*gust+lo*.10;}
    if(kind==='water')for(let k=0;k<26;k++){const at=Math.floor((k+.1)*N/27),f=780+(k*173)%1800;for(let j=0;j<rate*.13&&at+j<N;j++){const t=j/rate;a[at+j]+=Math.sin(TAU*(f*t+800*t*t))*Math.exp(-t*45)*.06;}}
    // A short seam at the wrap avoids a click; the eight-second bed is reused, not regenerated per frame.
    const seam=rate*.04;for(let i=0;i<seam;i++){a[i]*=i/seam;a[N-1-i]*=i/seam;}let e=0,peak=0;for(const x of a){e+=x*x;peak=Math.max(peak,Math.abs(x));}const gain=Math.min(.11/Math.sqrt(e/N),.55/peak);for(let i=0;i<N;i++)a[i]*=gain;
   }return b;}
 VF.SoundMaterials=Object.freeze({specs:Object.freeze(specs),synth,ambience});
})();
