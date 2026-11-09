/* Adapter between authored choreography and the reusable animation library. */
(() => {
 const Base=VF.Stage,copy=o=>JSON.parse(JSON.stringify(o));
 class ProductionStage extends Base {
  constructor(){super();this.animator=new VF.RigAnimator();this.seekPending=false;}
  reset(){super.reset();this.animator?.reset();}
  enter(saved){this.animator.reset();if(saved)this.animator.restore(saved);}
  seek(){this.seekPending=true;}
  act(name,id,time){return this.animator.play(id==='beige'?'taupe':id,name,time);}
  event(kind,time,point){super.event(kind,time,point);if(['pink','both','light'].includes(kind))this.act('saludo','pink',time);if(['taupe','both','light'].includes(kind))this.act(kind==='taupe'?'escucha':'saludo','taupe',time);}
  finish(scene,shot,time,view,options){
   const t=options.reduced?Math.max(shot.hold,time):time;
   for(const [id,p]of Object.entries(scene.actors)){
    p.gaitWeight??=(['walk','passage'].includes(shot.mode)?VF.math.pulse(.3,1.2,7.1,8.8,t):0);p.airborne??=(id==='pink'&&shot.mode==='play'&&t>2.2&&t<3.5?1:0);
   }
   if(['together','rest'].includes(shot.mode)&&!scene.beat.startsWith('responding')){const target=VF.Kinematics.shared(scene.actors.pink,scene.actors.taupe);if(target.reachable){scene.actors.pink.handsWorld={right:target};scene.actors.taupe.handsWorld={left:target};}}
   if(shot.mode==='flower'&&t>=2.8&&t<=6.2)scene.actors.taupe.handsWorld={left:scene.flowerPoint};
   this.animator.resolve(scene,options.storyTime??t,view,{...options,seek:this.seekPending});this.seekPending=false;this.last=copy(scene);return scene;
  }
  pose(shot,time,view,options={}){return this.finish(super.pose(shot,time,view,options),shot,time,view,options);}
  captureMotion(){return this.animator.capture();}
  state(){return{...super.state(),animation:this.animator.state()};}
 }
 VF.ChoreographyStage=Base;VF.ProductionStage=ProductionStage;VF.Stage=ProductionStage;
})();
