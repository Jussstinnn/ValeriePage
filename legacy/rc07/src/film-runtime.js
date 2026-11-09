/* State and internal navigation are shared by keyboard, transport and scene actions. */
(() => {
 const phases=new Set(['opening','preparing','playing','paused','waitingForReader','interacting','transitioning','ending','error']);
 class FilmRuntime {
  constructor(){this.phase='opening';this.scene='opening';this.shot=null;this.changes=0;}
  sync({id,time,paused,busy,error,cut,interacting}){
   const score=window.VScore.get(id),beat=window.VScore.beat(id,time);
   const phase=error?'error':busy?'preparing':!score?'opening':paused?'paused':cut?'transitioning':interacting?'interacting':score.kind==='ending'?'ending':time>=score.hold?'waitingForReader':'playing';
   if(!phases.has(phase))throw new Error('Invalid film phase');if(this.phase!==phase||this.scene!==id)this.changes++;
   this.phase=phase;this.scene=id;this.shot=beat?.current.id||null;return phase;
  }
  navigate(direction,{index,id,page,ready,opened}){
   const kind=window.VScore.get(id)?.kind;
   if(kind==='letter'&&direction>0&&page<2)return{type:'folio',page:page+1};
   if(kind==='letter'&&direction<0&&page>0)return{type:'folio',page:page-1};
   if(kind==='ceremony'&&direction>0){if(!opened)return{type:'open'};if(!ready)return{type:'wait'};}
   return{type:'chapter',index:index+direction};
  }
  needsFrame({id,time,paused,cut,busy,openedAt,letterAt,reduced,progress=0,guided=false}){
   if(paused||busy||reduced)return false;if(cut)return true;
   const scene=window.VScore.get(id);if(!scene)return time<4;
   if(scene.kind==='ceremony')return progress>.67||(openedAt===null?time<4:time-openedAt<11);
   if(scene.kind==='letter')return time-letterAt<4;
   if(scene.kind==='ending')return time<16;
   if(id.startsWith('memory'))return time<20||guided||(id==='memory09'&&progress>.62);
   return true;
  }
  state(){return{phase:this.phase,scene:this.scene,shot:this.shot,changes:this.changes};}
 }
 window.VFilmRuntime=FilmRuntime;
})();
