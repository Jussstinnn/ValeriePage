/* Semantic permission is independent of document distance. All routes consult this policy. */
(() => {
 class NavigationPolicy {
  constructor(session){this.session=session;this.last=null;}
  released(id){return ['continue','skip'].includes(this.session.events.get('checkpoint:'+id)?.choice);}
  limit(){return !this.released('letter')?9:!this.released('ring')?10:11;}
  resolve(requested){
   if(!Number.isInteger(requested)||requested<0||requested>11)return{index:-1,blocked:true,reason:'invalid'};
   const limit=this.limit(),index=Math.min(requested,limit);
   return this.last={index,requested,blocked:index!==requested,reason:index!==requested?(limit===9?'letter':'ring'):null};
  }
  release(id,choice){if(!['letter','ring'].includes(id)||!['continue','skip'].includes(choice))return;this.session.remember('checkpoint:'+id,{choice});}
  replay(index){if(index===9)this.session.events.delete('checkpoint:letter');if(index===10)this.session.events.delete('checkpoint:ring');this.session.flush();}
  progress(index,value){return index===10&&!this.released('ring')&&['ring-closed','ring-opening','entering'].includes(this.semantic)?Math.min(.64,value):value;}
  reset(){this.last=null;this.semantic='opening';}
  stage({index,page,opened,ready,busy,error}){this.semantic=error?'recovering':busy?'entering':index===9?'reading-folio-'+page:index===10?!opened?'ring-closed':ready?'ring-contemplation':'ring-opening':index===11?'finale':index<0?'opening':'exploring';}
  state(){return{semantic:this.semantic,limit:this.limit(),letter:this.released('letter'),ring:this.released('ring'),last:this.last};}
 }
 window.VNavigationPolicy=NavigationPolicy;
})();
