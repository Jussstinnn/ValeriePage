/* The painting becomes world-space glyph matter. No cell grid or stretched bitmap. */
(() => {
 const {ease,clamp,mix}=VMath,TAU=Math.PI*2;
 class PaintingWorld {
  constructor(){this.nodes=null;this.atlas=new Map();this.target={x:.70,y:.22};this.chosen=0;this.last=null;this.drawn=0;this.touchAt=-100;}
  enter(api){if(this.nodes||!api?.paintingField)return;
   // Host-owned primitives keep the cached field from retaining a discarded iframe realm.
   this.nodes=Array.from(api.paintingField,n=>({x:n.x,y:n.y,glyph:String(n.glyph),ink:String(n.ink),depth:n.depth}));
  }
  touch(time){this.chosen=(this.chosen+1)%3;this.target=[{x:.46,y:.38},{x:.90,y:.17},{x:.69,y:.50}][this.chosen];this.touchAt=time;}
  glyph(ch,ink){const key=ch+ink;if(this.atlas.has(key))return this.atlas.get(key);const c=document.createElement('canvas');c.width=c.height=20;const p=c.getContext('2d');p.font='bold 13px monospace';p.fillStyle=ink;p.textAlign='center';p.textBaseline='middle';p.fillText(ch,10,10);this.atlas.set(key,c);return c;}
  draw(p,{api,progress,time,rect,w,h,reduced,neighbour,place,surface}){
   if(progress<.29)return;this.enter(api);if(!this.nodes)return;const amount=ease((progress-.29)/.17),travel=reduced?.35:ease((progress-.36)/.64),view=mix(1.08,.18,travel),cx=mix(.5,this.target.x,travel),cy=mix(.45,this.target.y,travel),expansion=ease((progress-.31)/.28);
   const originalRect=rect;rect={x:mix(rect.x,0,expansion),y:mix(rect.y,0,expansion),w:mix(rect.w,w,expansion),h:mix(rect.h,h,expansion)};const unit=Math.max(rect.w/960,rect.h/760)/view;
   p.save();p.globalAlpha=amount;const sky=p.createRadialGradient(w*.6,h*.24,0,w*.5,h*.44,Math.hypot(w,h)*.8);sky.addColorStop(0,'#253863');sky.addColorStop(.6,'#101e32');sky.addColorStop(1,'#0a151d');p.fillStyle=sky;p.fillRect(0,0,w,h);
   const limit=VRuntimeProfile.name==='premium'?3000:VRuntimeProfile.name==='balanced'?1800:900,step=Math.max(1,Math.ceil(this.nodes.length/limit));this.drawn=0;
   for(let j=0;j<this.nodes.length;j+=step){const n=this.nodes[j];let u=n.x,v=n.y,depth=n.depth;
    if(!reduced&&v<.78){for(const [a,b,r]of [[.456,.379,.23],[.696,.501,.15],[.257,.280,.13]]){const dx=u-a,dy=(v-b)*.79,d=Math.hypot(dx,dy),gain=Math.max(0,1-d/r),spin=Math.sin(time*.24+d*11)*gain*.32;u=a+dx*Math.cos(spin)-dy*Math.sin(spin);v=b+(dx*Math.sin(spin)+dy*Math.cos(spin))/.79;}}
    const x=rect.x+rect.w*.5+(u-cx)*960*unit*(1+depth*travel*.12),y=rect.y+rect.h*.5+(v-cy)*760*unit*(1+depth*travel*.12);if(x<rect.x-20||x>rect.x+rect.w+20||y<rect.y-20||y>rect.y+rect.h+20)continue;
    const size=Math.min(24,Math.max(8,12*unit*(1+depth*.2)));p.drawImage(this.glyph(n.glyph,n.ink),x-size*.5,y-size*.5,size,size);this.drawn++;
   }
   // The selected painted star is the vanishing point of the moving pigment itself.
   const starX=rect.x+rect.w*.5+(this.target.x-cx)*960*unit,starY=rect.y+rect.h*.5+(this.target.y-cy)*760*unit;p.globalAlpha=amount*.8;p.fillStyle='#f4d99c';p.font='18px monospace';p.fillText('*',starX,starY);p.restore();
   const portal=neighbour?ease((progress-.82)/.18):0;
   if(portal>0){const field=place(neighbour.canvas,originalRect,neighbour.shot),frame=surface.get(neighbour.canvas,neighbour.shot,4,null),radius=Math.hypot(w,h)*portal;p.save();p.beginPath();p.ellipse(starX,starY,Math.max(.1,radius),Math.max(.1,radius*.8),0,0,TAU);p.clip();p.fillStyle='#0a151d';p.fillRect(0,0,w,h);p.globalCompositeOperation='lighten';p.drawImage(frame,field.x,field.y,field.w,field.h);p.restore();}
   this.last={zoom:1/view,travel,target:{...this.target},nodesDrawn:this.drawn,sourceNodes:this.nodes.length,expansion,portal,field:{...rect},screenStar:{x:starX,y:starY}};
  }
  state(){return this.last;}
 }
 window.VPaintingWorld=PaintingWorld;
})();
