/* A small software 3D pipeline: meshes, perspective, depth buffer, normals and materials.
   This is the complete Canvas path, including devices without WebGL. */
(() => {
 const {ease,mix,clamp}=VMath,TAU=Math.PI*2;
 const sub=(a,b)=>a.map((v,i)=>v-b[i]),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>{const n=Math.hypot(...a)||1;return a.map(v=>v/n);};
 class JewelMesh {
  constructor(){this.canvas=document.createElement('canvas');this.canvas.width=640;this.canvas.height=740;this.ctx=this.canvas.getContext('2d');this.raw=document.createElement('canvas');this.rawCtx=this.raw.getContext('2d');this.mesh=[];this.last='';this.drawFrames=0;this.phase='closed';this.geometry='rounded-shell-depth-buffer';this.build();}
  triangle(a,b,c,material,part=0){this.mesh.push({v:[a,b,c],material,part});}
  quad(a,b,c,d,material,part=0){this.triangle(a,b,c,material,part);this.triangle(a,c,d,material,part);}
  contour(w,d,r,y){const points=[];for(let k=0;k<4;k++){const sx=k===0||k===3?1:-1,sz=k<2?1:-1,cx=sx*(w-r),cz=sz*(d-r);for(let j=0;j<6;j++){const a=k*Math.PI/2+j/5*Math.PI/2;points.push([cx+Math.cos(a)*r,y,cz+Math.sin(a)*r]);}}return points;}
  build(){
   // Counter-clockwise rounded rectangle, four genuine radiused corners.
   const loop=(w,d,r,y)=>{const pts=[];for(const [cx,cz,start] of [[w-r,d-r,0],[-w+r,d-r,Math.PI/2],[-w+r,-d+r,Math.PI],[w-r,-d+r,Math.PI*1.5]])for(let j=0;j<6;j++){const a=start+j/5*Math.PI/2;pts.push([cx+Math.cos(a)*r,y,cz+Math.sin(a)*r]);}return pts;};
   const shell=(bottom,top,mat,part=0)=>{for(let j=0;j<bottom.length;j++){const k=(j+1)%bottom.length;this.quad(bottom[j],bottom[k],top[k],top[j],mat,part);}};
   const bottom=loop(116,82,25,-73),edge=loop(126,92,29,-8),rim=loop(119,85,27,0),inner=loop(108,74,25,-5);
   shell(bottom,edge,'leather');shell(edge,rim,'gold');shell(rim,inner,'velvet');for(let j=0;j<inner.length;j++)this.triangle([0,-45,0],inner[j],inner[(j+1)%inner.length],'velvet');
   // Curved cushion, with a physical recess through which the band emerges.
   for(let j=0;j<12;j++)for(let k=0;k<16;k++){const point=(x,z)=>[x,-12+8*(1-(x/108)**2)*(1-(z/75)**2),z];const x=-105+k*210/16,z=-72+j*144/12;this.quad(point(x,z),point(x+210/16,z),point(x+210/16,z+12),point(x,z+12),'felt');}
   const lidBase=loop(126,92,29,10),lidBevel=loop(123,89,27,28),lidTop=loop(116,82,24,34);shell(lidBase,lidBevel,'leather',1);shell(lidBevel,lidTop,'gold',1);
   for(let j=0;j<lidTop.length;j++){this.triangle([0,34,0],lidTop[j],lidTop[(j+1)%lidTop.length],'leather',1);this.triangle([0,9,0],lidBase[(j+1)%lidBase.length],lidBase[j],'lining',1);}
   // A stitched inset is geometry on the top, not a painted icon.
   const stitch=loop(107,73,21,34.3);for(let j=0;j<stitch.length;j++){const a=stitch[j],b=stitch[(j+1)%stitch.length];for(let k=0;k<3;k++){const x=mix(a[0],b[0],k/3),z=mix(a[2],b[2],k/3);this.quad([x-1,34.5,z],[x+1,34.5,z],[x+1,34.5,z+2],[x-1,34.5,z+2],'thread',1);}}
   for(const x of [-76,76])for(let j=0;j<10;j++){const a=j/10*TAU,b=(j+1)/10*TAU;this.quad([x-12,6+Math.sin(a)*6,-88+Math.cos(a)*6],[x+12,6+Math.sin(a)*6,-88+Math.cos(a)*6],[x+12,6+Math.sin(b)*6,-88+Math.cos(b)*6],[x-12,6+Math.sin(b)*6,-88+Math.cos(b)*6],'gold');}
   const torus=(a,b)=>[(27+3.2*Math.cos(b))*Math.cos(a),-28+(27+3.2*Math.cos(b))*Math.sin(a),3.2*Math.sin(b)];
   for(let j=0;j<48;j++)for(let k=0;k<8;k++){const a=j/48*TAU,b=k/8*TAU;this.quad(torus(a,b),torus(a+TAU/48,b),torus(a+TAU/48,b+TAU/8),torus(a,b+TAU/8),'silver',2);}
   const lower=[],upper=[];for(let j=0;j<10;j++){const a=j/10*TAU;lower.push([Math.cos(a)*11,5,Math.sin(a)*8]);upper.push([Math.cos(a)*7,15,Math.sin(a)*5]);}
   for(let j=0;j<10;j++){const k=(j+1)%10;this.quad(lower[j],lower[k],upper[k],upper[j],j%3?'crystal':'reflection',2);this.triangle([0,-1,0],lower[k],lower[j],'crystal',2);this.triangle([0,15,0],upper[j],upper[k],'reflection',2);}
   for(let j=0;j<4;j++){const a=j/4*TAU,x=Math.cos(a)*11,z=Math.sin(a)*8;this.quad([x-1,1,z],[x+1,1,z],[x+1,11,z],[x-1,11,z],'silver',2);}
   this.faces=this.mesh.length;
  }
  draw(time,openedAt,reduced){
   const age=openedAt===null?-1:Math.max(0,time-openedAt),open=age<0?0:reduced?1:ease((age-1.15)/4.2),macro=age<0?0:reduced?.7:ease((age-6.3)/3.7),intro=reduced?1:ease(time/3.5);
   this.phase=age<0?'closed':age<1.15?'anticipation':age<5.35?'opening':age<8?'revealed':age<10.5?'macro-jewel':'contemplation';
   const profile=window.VRuntimeProfile?.name||'balanced',W=profile==='premium'?320:profile==='balanced'?256:208,H=Math.round(W*740/640),key=[profile,Math.round(open*72),Math.round(macro*48),Math.round(intro*40)].join(':');if(key===this.last)return this.canvas;this.last=key;this.drawFrames++;
   if(this.raw.width!==W||this.raw.height!==H){this.raw.width=W;this.raw.height=H;this.image=this.rawCtx.createImageData(W,H);this.depth=new Float32Array(W*H);this.owner=new Uint8Array(W*H);}
   const data=this.image.data;data.fill(0);this.depth.fill(Infinity);this.owner.fill(0);
   const yaw=mix(-.68,-.23,intro)+macro*.43,dist=mix(390,570,intro)*(1-macro*.76),target=[0,mix(-14,52,macro),0],eye=[Math.sin(yaw)*dist,mix(240,72,macro),Math.cos(yaw)*dist],forward=norm(sub(target,eye)),right=norm(cross(forward,[0,1,0])),up=cross(right,forward),focal=W*1.65;
   const project=v=>{const d=sub(v,eye),z=dot(d,forward);return[W*.5+dot(d,right)*focal/z,H*.49-dot(d,up)*focal/z,z];};
   const palettes={leather:[45,65,65],gold:[189,153,100],velvet:[31,47,52],felt:[63,87,84],lining:[170,165,139],thread:[167,167,133],silver:[198,210,219],crystal:[143,179,204],reflection:[229,230,203]},light=norm([-1,2,1.5]),view=norm(sub(eye,target)),theta=open*1.94,lift=ease((open-.4)/.6)*27+macro*45;
   for(const face of this.mesh){
    const world=face.v.map(v=>{let[x,y,z]=v;if(face.part===1){const d=z+88;y=6+(v[1]-6)*Math.cos(theta)+d*Math.sin(theta);z=-88+d*Math.cos(theta)-(v[1]-6)*Math.sin(theta);}if(face.part===2)y+=lift;return[x,y,z];});
    const a=project(world[0]),b=project(world[1]),c=project(world[2]);if(a[2]<5||b[2]<5||c[2]<5)continue;
    let n=norm(cross(sub(world[1],world[0]),sub(world[2],world[0])));if(dot(n,view)<0)n=n.map(v=>-v);const lambert=Math.max(0,dot(n,light)),half=norm(light.map((v,j)=>v+view[j])),metal=face.material==='silver'||face.material==='gold',glass=face.material==='crystal'||face.material==='reflection',shine=Math.pow(Math.max(0,dot(n,half)),glass?55:metal?28:6)*(metal||glass?.8:.07),fresnel=Math.pow(1-Math.max(0,dot(n,view)),3)*.25,base=palettes[face.material];
    const den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);if(Math.abs(den)<.001)continue;
    const minX=Math.max(0,Math.floor(Math.min(a[0],b[0],c[0]))),maxX=Math.min(W-1,Math.ceil(Math.max(a[0],b[0],c[0]))),minY=Math.max(0,Math.floor(Math.min(a[1],b[1],c[1]))),maxY=Math.min(H-1,Math.ceil(Math.max(a[1],b[1],c[1])));
    for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){const u=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/den,v=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/den,w=1-u-v;if(u<0||v<0||w<0)continue;const z=1/(u/a[2]+v/b[2]+w/c[2]),ix=y*W+x;if(z>=this.depth[ix])continue;this.depth[ix]=z;this.owner[ix]=face.part===2?2:1;const wx=u*world[0][0]+v*world[1][0]+w*world[2][0],wz=u*world[0][2]+v*world[1][2]+w*world[2][2],grain=metal||glass?1:.9+.1*Math.sin(wx*2.7+wz*1.8)*Math.cos(wz*2.3),occlusion=face.part===2?1:face.material==='velvet'?.72+.28*open:1,brightness=(.28+lambert*.76+fresnel)*grain*occlusion;for(let j=0;j<3;j++)data[ix*4+j]=Math.min(255,(base[j]*brightness+shine*235+(glass?(j===2?20:5):0))*(face.part===2?1:mix(1,.13,macro)));data[ix*4+3]=255;}
   }
   this.rawCtx.putImageData(this.image,0,0);const o=this.ctx;o.clearRect(0,0,640,740);o.textAlign='center';o.textBaseline='middle';o.font='bold 9px monospace';const glyphs=' .:irsX3hMH#%@',sx=profile==='battery'?4:3,sy=profile==='battery'?5:4;
   for(let y=1;y<H;y+=sy)for(let x=1;x<W;x+=sx){const k=(y*W+x)*4;if(!data[k+3]||(macro>.3&&this.owner[y*W+x]!==2&&((x+y)%3!==0)))continue;const r=data[k],g=data[k+1],b=data[k+2],l=(r*.21+g*.72+b*.07)/255;o.fillStyle=`rgb(${Math.min(255,r*1.1+8)|0},${Math.min(255,g*1.1+8)|0},${Math.min(255,b*1.1+8)|0})`;o.fillText(glyphs[Math.min(glyphs.length-1,Math.max(this.owner[y*W+x]===2?3:1,l*glyphs.length|0))],x/W*640,y/H*740);}
   let minX=W,minY=H,maxX=0,maxY=0,pixels=0;for(let k=0;k<this.owner.length;k++)if(this.owner[k]===2){const x=k%W,y=k/W|0;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);pixels++;}const hole=project([0,-28+lift,0]),hx=Math.round(hole[0]),hy=Math.round(hole[1]);this.silhouette={pixels,x:pixels?minX/W:0,y:pixels?minY/H:0,w:pixels?(maxX-minX)/W:0,h:pixels?(maxY-minY)/H:0,holeOpen:hx>=0&&hx<W&&hy>=0&&hy<H&&this.owner[hy*W+hx]!==2};const jewel=project([0,15+lift,0]);this.jewelPoint={x:jewel[0]/W,y:jewel[1]/H};this.camera={yaw,distance:dist,macro,opening:open};return this.canvas;
  }
 }
 window.VJewelMesh=JewelMesh;
})();
