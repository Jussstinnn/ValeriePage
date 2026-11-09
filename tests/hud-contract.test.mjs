import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const read=name=>fs.readFileSync(new URL('../src/'+name,import.meta.url),'utf8'),json=o=>JSON.parse(JSON.stringify(o));
function setup(){
 const properties={},nodes=new Map(),document={activeElement:null,body:{dataset:{}},documentElement:{style:{setProperty(k,v){properties[k]=v;}}},events:{},getElementById:id=>nodes.get(id)||null,addEventListener(name,fn){this.events[name]=fn;},removeEventListener(name){delete this.events[name];}};
 class Element{constructor(id){this.id=id;this.hidden=false;this.inert=false;this.disabled=false;this.textContent='';this.dataset={};this.attrs={};this.events={};this.parent=null;this.clicks=0;nodes.set(id,this);}getBoundingClientRect(){return{height:this.hidden?0:184.2};}addEventListener(name,fn){this.events[name]=fn;}setAttribute(k,v){this.attrs[k]=v;}contains(n){for(;n;n=n.parent)if(n===this)return true;return false;}focus(){document.activeElement=this;}click(){if(this.disabled)return;this.clicks++;this.events.click?.({});}querySelector(){return nodes.get('hud-close');}}
 for(const id of ['controls','hud-toggle','hud-close','contextual-action','context-next','context-assist','next','choice-action','chapter-dialog'])new Element(id);
 for(const id of ['hud-close','next','choice-action'])nodes.get(id).parent=nodes.get('controls');for(const id of ['context-next','context-assist'])nodes.get(id).parent=nodes.get('contextual-action');nodes.get('choice-action').hidden=true;
 const c=vm.createContext({VF:{},document});vm.runInContext(read('composition.js'),c);vm.runInContext(read('cinematic-hud.js'),c);return{VF:c.VF,document,nodes,hud:new c.VF.CinematicHUD()};
}
const snapshot=(state='PLAYING',extra={})=>({playback:{state,mode:'cinema'},paused:false,ready:true,hasNext:true,nextLabel:'Siguiente',...extra});
test('safe cinematic framing cannot change when controls, focus or playback state change',()=>{
 const{VF}=setup();for(const [w,h]of [[320,568],[390,844],[568,280],[844,390],[1280,800]])for(const protectedPlane of [false,true]){
  const options={w,h,safe:{top:25,right:13,bottom:21,left:11},reading:protectedPlane},first=VF.Composition.measure(options),second=VF.Composition.measure({...options,hudVisible:true,paused:true,focused:'next'});
  assert.deepEqual(json(first.frame),json(second.frame));const f=first.frame;assert(f.x>=0&&f.y>=0&&f.w>0&&f.h>0&&f.x+f.w<=w&&f.y+f.h<=h);assert(f.y+f.h<=h-21-60,'Scene enters contextual touch region');
 }
});
test('requested controls have real hidden/inert state and focused transport cannot auto-close',()=>{
 const{hud,nodes,document}=setup();hud.update(snapshot());assert.equal(nodes.get('controls').hidden,true);assert.equal(nodes.get('controls').inert,true);assert.equal(hud.state().contextVisible,false);
 hud.open();assert.equal(nodes.get('controls').hidden,false);assert.equal(nodes.get('controls').inert,false);assert.equal(nodes.get('hud-toggle').attrs['aria-expanded'],'true');nodes.get('next').focus();assert.equal(hud.close(),false);assert.equal(hud.state().visible,true);
 hud.close({explicit:true,returnFocus:false});assert.equal(document.activeElement.id,'hud-toggle');assert.equal(nodes.get('controls').hidden,true);assert.equal(nodes.get('controls').inert,true);
});
test('pausing opens once and an explicit close remains respected until the next pause edge',()=>{
 const{hud}=setup();hud.update(snapshot('PAUSED',{paused:true,ready:false}));assert.equal(hud.state().visible,false);hud.update(snapshot('PAUSED',{paused:true}));assert.equal(hud.state().visible,true);hud.close({explicit:true});hud.update(snapshot('PAUSED',{paused:true}));assert.equal(hud.state().visible,false);hud.update(snapshot());hud.update(snapshot('PAUSED',{paused:true}));assert.equal(hud.state().visible,true);
});
test('choices exclude transport while protected continuation and a single assistance channel are delegated',()=>{
 const{hud,nodes}=setup();hud.update(snapshot('AWAITING_CHOICE',{choice:true}));assert.equal(hud.state().nextVisible,false);assert.equal(nodes.get('next').hidden,true);assert.equal(nodes.get('context-next').hidden,true);hud.update(snapshot('AWAITING_READING'));nodes.get('context-next').click();assert.equal(nodes.get('next').clicks,1);
 nodes.get('choice-action').hidden=false;nodes.get('choice-action').textContent='Desplegar las raíces';hud.update(snapshot('AWAITING_INTERACTION'));assert.equal(hud.state().assistVisible,true);assert.equal(nodes.get('choice-action').hidden,true);assert.equal(nodes.get('choice-action').inert,true);nodes.get('context-assist').click();assert.equal(nodes.get('choice-action').clicks,1);
 hud.update(snapshot('AWAITING_INTERACTION'));assert.equal(hud.state().assistVisible,true,'A render update must not forget a suppressed source button');
 nodes.get('next').disabled=true;hud.update(snapshot('AWAITING_INTERACTION'));assert.equal(nodes.get('context-next').disabled,true);
});
test('leaving a contextual action returns focus safely; protected final has no forced continuation',()=>{
 const{hud,nodes,document}=setup();hud.update(snapshot('AWAITING_READING'));nodes.get('context-next').focus();hud.update(snapshot());assert.equal(hud.state().contextVisible,false);assert.equal(document.activeElement.id,'hud-toggle');hud.update(snapshot('PAUSED',{paused:true,reading:true,playback:{state:'PAUSED',underlyingState:'AWAITING_READING',mode:'cinema'}}));hud.close({explicit:true});assert.equal(hud.state().nextVisible,true,'Reading continuation survives an explicitly closed pause HUD');hud.update(snapshot('AWAITING_REVEAL',{hasNext:false}));assert.equal(hud.state().contextVisible,false);
 hud.update(snapshot('PLAYING',{playback:{state:'PLAYING',mode:'manual'}}));assert.equal(hud.state().nextVisible,true);hud.update(snapshot('TRANSITIONING'));assert.equal(hud.state().contextVisible,false);
});
test('HTML preserves every old command once and provides recoverable contextual landmarks',()=>{
 const html=read('index.html'),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
 for(const id of ['controls','previous','next','pause','replay','progress','place','boundary','sound','chapters','movie-mode','reading-mode','letter-reading','choice-panel','choice-action','hud-toggle','hud-close','context-next','context-assist','safe-area-metrics'])assert(ids.includes(id),id+' lost');assert(html.includes('aria-controls="controls"'));assert(html.includes('id="controls" aria-label="Controles de la película" hidden inert'));
});
