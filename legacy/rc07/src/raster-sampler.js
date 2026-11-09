/* Vector underpainting at the spatial bandwidth of the ASCII grid. Original
   coordinates, output resolution and character count are unchanged. */
(() => {
 const cache=new WeakMap();
 window.__filmSamplingEnabled=window.parent.VFilmSampling!==false;
 window.__filmSampleStats={reads:0,pixels:0,originalPixels:0};
 let current=null;
 const dimensions=(w,h)=>{const limit=window.__filmRasterLimit||window.parent.VRuntimeProfile?.raster||420;
  if(current&&current.w===w&&current.h===h&&current.enabled===window.__filmSamplingEnabled&&current.limit===limit)return current;
  const r=window.__filmSamplingEnabled?Math.min(1,limit/Math.max(w,h)):1,sw=Math.max(1,Math.ceil(w*r)),sh=Math.max(1,Math.ceil(h*r));
  const rows=new Uint32Array(h),columns=new Uint32Array(w);
  for(let y=0;y<h;y++)rows[y]=((y*sh/h)|0)*sw*4;
  for(let x=0;x<w;x++)columns[x]=((x*sw/w)|0)*4;
  return current={w,h,sw,sh,rows,columns,limit,enabled:window.__filmSamplingEnabled};
 };
 window.__filmRaster=(ctx,w,h)=>{
  const {sw,sh}=dimensions(w,h);
  let info=cache.get(ctx);
  if(!info){
   info={scale:1};cache.set(ctx,info);
   for(const property of ['shadowBlur','shadowOffsetX','shadowOffsetY']){
    const descriptor=Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype,property);
    if(descriptor)Object.defineProperty(ctx,property,{get:()=>descriptor.get.call(ctx)/info.scale,set:value=>descriptor.set.call(ctx,value*info.scale)});
   }
  }
  info.scale=sw/w;info.sw=sw;info.sh=sh;
  if(ctx.canvas.width!==sw||ctx.canvas.height!==sh){ctx.canvas.width=sw;ctx.canvas.height=sh;}
  ctx.setTransform(sw/w,0,0,sh/h,0,0);
 };
 window.__filmIndex=(x,y,w,h)=>{const info=dimensions(w,h);return info.rows[y]+info.columns[x];};
 window.__filmSample=(source,w,h)=>{
  const item=cache.get(source),sw=item?.sw||w,sh=item?.sh||h;
  window.__filmSampleStats.reads++;window.__filmSampleStats.pixels+=sw*sh;window.__filmSampleStats.originalPixels+=w*h;
  return source.getImageData(0,0,sw,sh).data;
 };
})();
