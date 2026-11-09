/* Capabilities are measured from each prepared native API, not promised by every engine. */
(() => {
 const definitions={vineyard:{api:'asciiVineyard'},rabbit:{api:'asciiBunny',signal:'ascii-bunny-host'},mushroom:{api:'asciiMushroom',signal:'ascii-mushroom-host'},museum:{api:'asciiMuseum'},couple:{api:'asciiStargazers',signal:'ascii-stargazers-host'},lily:{api:'bouquetDebug',signal:'bouquet'},memory07:{api:'__portrait07'},memory08:{api:'__asciiPortrait'},memory09:{api:'ASCIIAtelier'}};
 window.VSceneAdapters={version:4,get:id=>definitions[id],inspect(id,api){
  if(!definitions[id]||typeof api?.getState!=='function')throw new Error('Scene contract missing: '+id);
  const time=typeof api.seek==='function'||typeof api.setTime==='function';if(!time)throw new Error('Scene time contract missing: '+id);
  return Object.freeze({prepare:true,firstFrameReady:true,play:typeof api.play==='function'||!!definitions[id].signal,pause:typeof api.pause==='function'||id==='lily',replay:time,seek:time,restore:time,interact:true,resize:true,stats:true,dispose:true,flowers:typeof api.selectFlower==='function',actor:typeof api.direct==='function',nativeRestore:typeof api.restore==='function'});
 }};
})();
