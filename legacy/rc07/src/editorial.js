/* Captions belong to the film. The reader is an optional second presentation. */
(() => {
 class Editorial {
  constructor(){this.chapter=null;this.text='';this.entered=0;this.elapsed=0;}
  enter(chapter,time){this.chapter=chapter.id;this.text=chapter.line||'';this.entered=time;this.elapsed=0;}
  update(time){this.elapsed=Math.max(0,time-this.entered);}
  state(){return{chapter:this.chapter,text:this.text,elapsed:this.elapsed,persistent:true};}
 }
 window.VEditorial=Editorial;
})();
