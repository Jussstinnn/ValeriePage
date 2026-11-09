/* Lines are measured from the real typography, then revealed as small editorial phrases. */
(() => {
 class LetterScene {
  constructor(){this.lines=0;this.memoryMark=false;this.folio='';this.inkNodes=[];}
  compose(element,text,{fresh,animate,page=0}){
   element.replaceChildren();this.lines=0;this.inkNodes=[];this.folio=['light-opens-the-phrases','a-fold-becomes-ink','ink-meets-the-signature'][page];
   for(const paragraph of text.split('\n\n')){
    const fragment=document.createElement('span');fragment.className='letter-fragment';fragment.textContent=paragraph;element.append(fragment);
    const node=fragment.firstChild,range=document.createRange(),lines=[];let y=-Infinity;
    for(const match of paragraph.matchAll(/\S+/g)){range.setStart(node,match.index);range.setEnd(node,match.index+match[0].length);const top=range.getBoundingClientRect().top;if(Math.abs(top-y)>3){lines.push([]);y=top;}lines.at(-1).push(match[0]);}
    fragment.replaceChildren();
    for(const words of lines){const line=document.createElement('span');line.className='letter-line';line.textContent=words.join(' ')+' ';fragment.append(line);this.inkNodes.push(line);const i=this.lines++;if(fresh)animate(line,[{clipPath:page===0?'inset(0 48% 0 48%)':page===1?'polygon(0 0,100% 0,0 0,0 100%)':'inset(0 0 100% 0)',transform:page===1?'translateY(7px) rotate(-.4deg)':'translateY(5px)'},{clipPath:page===1?'polygon(0 0,100% 0,100% 100%,0 100%)':'inset(0 0 0 0)',transform:'none'}],{duration:850,delay:Math.min(2350,i*170),easing:'cubic-bezier(.16,1,.3,1)'});}
   }
  }
  draw(ctx,rect,elapsed,{page,scroll,memories,reduced}){
   const {ease,clamp,mix}=window.VMath,q=reduced?1:ease(elapsed/2.8);ctx.save();ctx.font='8px monospace';ctx.fillStyle='#d9c4ae';
   const visible=Math.min(rect.h,164),front=visible*q;
   for(let j=0;j<32;j++){const y=j/31*visible;if(y>front)break;ctx.globalAlpha=.25+j/95;ctx.fillText(j%9===0?':':'·',rect.x-12+Math.sin(j*.24+page)*2,rect.y+10+y);}
   if(elapsed<3.2&&!reduced&&this.inkNodes.length){
    const a=ease(elapsed/3.2),targets=this.inkNodes.map(n=>n.getBoundingClientRect()),matter=this.matter?.length?this.matter:[{u:.5,v:.5,ink:'#526958',glyph:':'}],count=Math.min(96,Math.max(32,matter.length));ctx.save();ctx.beginPath();ctx.rect(rect.x,rect.y,rect.w,rect.h);ctx.clip();
    for(let j=0;j<count;j++){const n=matter[j%matter.length],target=targets[j%targets.length],col=(j/targets.length|0)%6,tx=target.x+col*Math.min(17,target.width/8),ty=target.y+target.height*.72,s=j/Math.max(1,count-1),ox=rect.x+(n.u??s)*rect.w,oy=rect.y+(n.v??.5)*Math.min(rect.h,280),bend=Math.sin(a*Math.PI)*(page===1?-1:1)*rect.w*.18;ctx.globalAlpha=(1-a)*.38;ctx.fillStyle='#526958';ctx.fillText(n.glyph,mix(ox,tx,a)+bend,mix(oy,ty,a));}ctx.restore();
   }
   // A fine illuminated binding follows reading progress. It never passes over the words.
   const bindingX=Math.max(7,rect.x-12);ctx.strokeStyle='#627c6566';ctx.lineWidth=.65;ctx.globalAlpha=.7;ctx.beginPath();ctx.moveTo(bindingX,rect.y+10);ctx.bezierCurveTo(bindingX-3,rect.y+visible*.33,bindingX+3,rect.y+visible*.66,bindingX,rect.y+visible);ctx.stroke();ctx.fillStyle='#39534b';ctx.fillText('+',bindingX,rect.y+10+Math.min(visible,scroll*visible));
   this.memoryMark=memories===3;if(this.memoryMark){ctx.globalAlpha=.38;ctx.font='10px monospace';for(let j=0;j<3;j++)ctx.fillText(j===page?':':'·',rect.x+rect.w*.84+j*10,rect.y-8);}
   ctx.restore();return{x:rect.x-12,y:rect.y+10+Math.min(visible,scroll*visible)};
  }
  state(){return{measuredLines:this.lines,memoryMark:this.memoryMark,folio:this.folio};}
 }
 window.VLetterScene=LetterScene;
})();
