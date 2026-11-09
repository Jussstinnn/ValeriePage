// Measures connectivity of rendered alpha silhouettes; never saves or emits images.
const {chromium}=require(process.env.VALERIE_PLAYWRIGHT||'@playwright/test'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{const p=await b.newPage({viewport:{width:390,height:844}});await p.goto(process.env.VALERIE_URL||'http://127.0.0.1:4184');await p.waitForFunction(()=>window.Valerie?.state().ready);await p.evaluate(()=>{window.__jointRig=new VF.PlushRig();window.__jointCanvas=document.createElement('canvas');});let measured=0,largestDetached=0,detachedCases=[];
 for(let shot=0;shot<5;shot++)for(const time of [0,1.8,3.05,4.1,6.5,9,15]){
  await p.evaluate(async({shot,time})=>{await Valerie.go(shot,{immediate:true,replay:true});Valerie.seek(time);},{shot,time});
  const result=await p.evaluate(()=>{const s=Valerie.state(),c=window.__jointCanvas;c.width=s.view.w;c.height=s.view.h;const q=c.getContext('2d'),result=[];
   for(const a of s.actors){q.clearRect(0,0,c.width,c.height);const r=window.__jointRig.draw(q,a.id,a.native,{light:{x:200,y:150,strength:1},time:s.time,dpr:1,reduced:false}).ink,x=Math.max(0,Math.floor(r.x)-2),y=Math.max(0,Math.floor(r.y)-2),w=Math.min(c.width-x,Math.ceil(r.w)+4),h=Math.min(c.height-y,Math.ceil(r.h)+4),data=q.getImageData(x,y,w,h).data,n=w*h,seen=new Uint8Array(n),queue=new Int32Array(n),parts=[];
    for(let i=0;i<n;i++)if(!seen[i]&&data[i*4+3]>64){let head=0,tail=1;seen[i]=1;queue[0]=i;while(head<tail){const k=queue[head++],xx=k%w,yy=(k/w)|0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=xx+dx,ny=yy+dy;if(nx<0||nx>=w||ny<0||ny>=h)continue;const at=ny*w+nx;if(!seen[at]&&data[at*4+3]>64){seen[at]=1;queue[tail++]=at;}}}parts.push(tail);}
    parts.sort((a,b)=>b-a);result.push({id:a.id,parts:parts.filter(n=>n>10),detached:parts[1]||0,total:parts.reduce((a,b)=>a+b,0)});
   }return result;});
  for(const r of result){measured++;largestDetached=Math.max(largestDetached,r.detached);if(r.detached>24&&r.detached/r.total>.002)detachedCases.push({shot,time,...r});}
 }
 console.log(JSON.stringify({measured,largestDetached,detachedCases,imagesExported:0}));assert.equal(detachedCases.length,0,'articulated pieces must remain connected');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
