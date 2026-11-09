/* Crop-local soft boundaries, transparent native worlds and light on actual glyph alpha. */
(() => {
 class SurfaceBlend {
  constructor(){this.cache=new WeakMap();this.masks=new Map();this.stats={renders:0,hits:0,transparentWorlds:true};}
  mask(w,h){const key=w+':'+h;if(this.masks.has(key))return this.masks.get(key);const c=document.createElement('canvas');c.width=w;c.height=h;const p=c.getContext('2d');const x=p.createLinearGradient(0,0,w,0);x.addColorStop(0,'#fff0');x.addColorStop(.13,'#fff');x.addColorStop(.87,'#fff');x.addColorStop(1,'#fff0');p.fillStyle=x;p.fillRect(0,0,w,h);p.globalCompositeOperation='destination-in';const y=p.createLinearGradient(0,0,0,h);y.addColorStop(0,'#fff0');y.addColorStop(.10,'#fff');y.addColorStop(.90,'#fff');y.addColorStop(1,'#fff0');p.fillStyle=y;p.fillRect(0,0,w,h);if(this.masks.size>5)this.masks.clear();this.masks.set(key,c);return c;}
  get(source,shot,index,light){if(![0,1,2,4].includes(index))return null;const scale=Math.min(1,800/Math.max(source.width*shot.w,source.height*shot.h)),w=Math.max(1,Math.round(source.width*shot.w*scale)),h=Math.max(1,Math.round(source.height*shot.h*scale)),key=[source.__revision||0,index,shot.x.toFixed(3),shot.y.toFixed(3),shot.w.toFixed(3),shot.h.toFixed(3),light?Math.round(light.x*100):0,light?Math.round(light.y*100):0].join(':');let a=this.cache.get(source);if(a?.key===key){this.stats.hits++;return a.canvas;}if(!a){a={canvas:document.createElement('canvas'),key:null};this.cache.set(source,a);}const c=a.canvas;if(c.width!==w||c.height!==h){c.width=w;c.height=h;}const p=c.getContext('2d');p.clearRect(0,0,w,h);p.drawImage(source,shot.x*source.width,shot.y*source.height,shot.w*source.width,shot.h*source.height,0,0,w,h);
   if(index===0||index===4){p.globalCompositeOperation='destination-in';p.drawImage(this.mask(w,h),0,0);}
   if(light){const x=(light.x-shot.x)/shot.w*w,y=(light.y-shot.y)/shot.h*h,r=Math.max(w,h)*.25,g=p.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'#ffecc766');g.addColorStop(.45,'#e8cd8722');g.addColorStop(1,'#fff0');p.globalCompositeOperation='source-atop';p.fillStyle=g;p.fillRect(0,0,w,h);}
   p.globalCompositeOperation='source-over';a.key=key;this.stats.renders++;return c;
  }
 }
 window.VSurfaceBlend=SurfaceBlend;
})();
