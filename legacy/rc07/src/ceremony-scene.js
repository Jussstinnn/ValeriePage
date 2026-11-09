(() => {
 class CeremonyScene {
  constructor(ring){this.ring=ring;this.cameraState=null;}
  ready(time,openedAt,reduced){return openedAt!==null&&(reduced||time-openedAt>=10.5);}
  camera(){return this.cameraState={x:0,y:0,w:1,h:1,scale:1,focus:[.5,.5],beat:this.ring.phase};}
  frame(time,openedAt,reduced){return this.ring.draw(openedAt===null?Math.min(time,4):Math.min(time,openedAt+11),openedAt,reduced);}
  light(rect){const point=this.ring.jewelPoint||{x:.5,y:.42};return{x:rect.x+rect.w*point.x,y:rect.y+rect.h*point.y};}
  state(){return{camera:this.ring.camera,phase:this.ring.phase,geometry:this.ring.geometry,faces:this.ring.faces,silhouette:this.ring.silhouette,drawFrames:this.ring.drawFrames};}
 }
 window.VCeremonyScene=CeremonyScene;
})();
