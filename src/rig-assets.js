/* Same approved atlas output, prepared offline. No runtime alpha readback. */
(() => {
 const loaded=new Map();let pending=null;
 VF.RigAssets={
  prepare(){if(this.ready())return Promise.resolve();if(pending)return pending;pending=Promise.all(Object.values(VF_RIG_CACHE.parts).flatMap(p=>[p.normal,p.warm]).map(async item=>{if(loaded.has(item.file))return;const image=new Image();image.decoding='async';image.src=await VF.ResourceCache.url(item.file);await image.decode();if(!image.naturalWidth)throw Error('No se pudo preparar una textura del peluche.');loaded.set(item.file,image);})).finally(()=>{pending=null;});return pending;},
  ready(){return loaded.size===Object.keys(VF_RIG_CACHE.parts).length*2;},
  fill(atlas){for(const [key,item]of Object.entries(VF_RIG_CACHE.parts)){atlas.parts.set(key,{canvas:loaded.get(item.normal.file),warm:loaded.get(item.warm.file),box:{...item.box},ink:{...item.ink}});atlas.cleanup[key]={...item.cleanup};atlas.bytes+=item.width*item.height*8;}},
  stats(){return{parts:Object.keys(VF_RIG_CACHE.parts).length,images:loaded.size,prebaked:true};}
 };
})();
