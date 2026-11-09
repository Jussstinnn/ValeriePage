/* Small deterministic tools. All staging uses CSS pixels; artwork uses native rig units. */
window.VF={};
(() => {
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),mix=(a,b,q)=>a+(b-a)*q;
 const ease=q=>{q=clamp(q);return q*q*(3-2*q);};
 const span=(a,b,t)=>ease((t-a)/(b-a));
 const pulse=(a,b,c,d,t)=>span(a,b,t)*(1-span(c,d,t));
 const rng=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let n=Math.imul(seed^seed>>>15,1|seed);n=n+Math.imul(n^n>>>7,61|n)^n;return((n^n>>>14)>>>0)/4294967296;};
 const rgb=hex=>hex.match(/[a-f\d]{2}/gi).map(n=>parseInt(n,16));
 const color=(a,b,q)=>{a=rgb(a);b=rgb(b);return '#'+a.map((v,i)=>Math.round(mix(v,b[i],clamp(q))).toString(16).padStart(2,'0')).join('');}; // taste-skill-ignore: RGB hexadecimal encoding, not interface numbering.
 const canvas=(w,h)=>{const c=document.createElement('canvas');c.width=Math.ceil(w);c.height=Math.ceil(h);return c;};
 const ellipse=(p,x,y,rx,ry,fill,rotation=0)=>{p.beginPath();p.ellipse(x,y,Math.max(.001,rx),Math.max(.001,ry),rotation,0,Math.PI*2);if(fill){p.fillStyle=fill;p.fill();}};
 VF.math={clamp,mix,ease,span,pulse,rng,rgb,color,canvas,ellipse,TAU:Math.PI*2};
})();
