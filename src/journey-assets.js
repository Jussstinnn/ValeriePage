/* Local location plates: bounded current/next window; source paintings remain immutable. */
(() => {
 const images=new Map(),pending=new Map();let wanted=new Set();
 const keys=shot=>!shot?[]:[...new Set(['fairy','relics',shot.set,...(shot.set==='garden-walk'?['soil-bed']:[]),...(shot.set==='gallery'?['scream','starry']:shot.mode==='painting'?['starry']:[])].filter(Boolean))];
 VF.JourneyAssets={
  async prepare(shot){if(!shot?.set)return;const id=shot.set;if(images.has(id))return;wanted.add(id);if(pending.has(id))return pending.get(id);const item=VF_JOURNEY_ASSETS.assets[id];if(!item)throw Error('Escenario desconocido: '+id);const work=(async()=>{const im=new Image();im.decoding='async';try{im.src=await VF.ResourceCache.url(item.file);await im.decode();if(wanted.has(id))images.set(id,im);else VF.ResourceCache.drop(item.file);}catch(e){VF.ResourceCache.drop(item.file);throw e;}})();pending.set(id,work);try{await work;}finally{pending.delete(id);}},
  async prepareScene(shot){await Promise.all(keys(shot).map(set=>this.prepare({set})));},
  image(id){const im=images.get(id);if(!im)throw Error('Escenario no preparado: '+id);return im;},peek:id=>images.get(id),
  retain(...shots){wanted=new Set(shots.flatMap(keys));for(const id of images.keys())if(!wanted.has(id)){images.delete(id);VF.ResourceCache.drop(VF_JOURNEY_ASSETS.assets[id].file);}},
  stats(){return{ids:[...images.keys()],decodedBytes:[...images.values()].reduce((n,i)=>n+i.naturalWidth*i.naturalHeight*4,0),pending:pending.size};}
 };
})();
