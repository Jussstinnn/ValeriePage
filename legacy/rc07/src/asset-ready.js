/* Completion is not success. The same gate covers DOM images and cancellation. */
(() => {
 window.VImageReady=async function(img,signal){
  const valid=()=>{if(!(img.naturalWidth>0&&img.naturalHeight>0))throw new Error('No se pudo cargar la fotografía de este recuerdo.');};
  if(signal?.aborted)throw new DOMException('Preparation cancelled','AbortError');
  if(!img.complete)await new Promise((resolve,reject)=>{
   const clean=()=>{img.removeEventListener('load',loaded);img.removeEventListener('error',failed);signal?.removeEventListener('abort',aborted);};
   const loaded=()=>{clean();resolve();},failed=()=>{clean();reject(new Error('No se pudo cargar la fotografía de este recuerdo.'));},aborted=()=>{clean();reject(new DOMException('Preparation cancelled','AbortError'));};
   img.addEventListener('load',loaded,{once:true});img.addEventListener('error',failed,{once:true});signal?.addEventListener('abort',aborted,{once:true});
  });
  valid();if(img.decode)await img.decode();valid();
 };
})();
