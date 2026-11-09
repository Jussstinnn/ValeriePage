import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import fs from 'node:fs';
function setup({advance}={}){
 let now=0,moves=0;const c=vm.createContext({VF:{},performance:{now:()=>now},setTimeout(){throw new Error('Editorial time must not own a timeout')},clearTimeout(){throw new Error('Editorial time must not own a timeout')}});
 for(const name of ['editorial-policy','cinema-clock'])vm.runInContext(fs.readFileSync('src/'+name+'.js','utf8'),c);
 const s={shot:{id:'a',mode:'recognise'},beat:{id:'one',text:'Una luz para el jardín.',age:0},ready:true,paused:false,hidden:false,loading:false,dialog:false,transition:1,actionReady:true,actorAirborne:false,visualReady:true};
 const clock=new c.VF.CinemaClock(()=>s,detail=>{moves++;return advance?advance(s,detail):undefined;},()=>now);
 return{s,clock,VF:c.VF,get moves(){return moves},run(seconds){let left=seconds;while(left>1e-9){const dt=Math.min(.1,left);now+=dt*1000;s.beat.age=(s.beat.age||0)+dt;clock.update(dt);left-=dt;}}};
}

test('Cinema is the default and advances complete dialogue from the renderer loop without autonomous timers',()=>{
 const t=setup();assert.equal(t.clock.state().mode,'cinema');assert.equal(t.clock.state().state,'PLAYING');t.run(5.3);assert.equal(t.moves,0);t.run(.3);assert.equal(t.moves,1);t.run(100);assert.equal(t.moves,1,'A single beat may issue only one advance');assert.equal(t.clock.timer,null);
});

test('Pause, hidden tab, dialogue, loading and transitions freeze editorial time exactly',()=>{
 for(const blocked of ['paused','hidden','dialog','loading','transition']){const t=setup();t.run(3);const before=t.clock.capture();t.s[blocked]=blocked==='transition'?.4:true;t.clock.sync();t.run(40);assert.equal(t.clock.state().elapsed,before.elapsed,blocked);assert.equal(t.moves,0);assert.equal(t.clock.state().state,['paused','hidden','dialog'].includes(blocked)?'PAUSED':'TRANSITIONING');t.s[blocked]=blocked==='transition'?1:false;t.clock.sync();t.run(2.5);assert.equal(t.moves,1,blocked+' resume retains the previous reading interval');}
});

test('Decisions, photographs, letter folios, gift, ring and final question never expire',()=>{
 for(const [mode,beat]of [['forest',{id:'choice',kind:'choice'}],['memory',{id:'photo',view:'photo'}],['letter',{id:'read',view:'read'}],['case',{id:'near'}],['ceremony',{id:'jewel',view:'macro'}],['finale',{id:'question',view:'question'}],['petal',{id:'dedication'}]]){
  const t=setup();Object.assign(t.s,{shot:{id:'protected',mode},beat:{...beat,text:'Este momento puede durar.'}});t.run(500);assert.equal(t.moves,0,mode);const state=t.clock.state();assert(state.waiting);assert.notEqual(state.state,'PLAYING');assert.equal(state.policy.autoplay,false);assert(state.policy.focusTarget);
 }
});

test('A reading timer cannot interrupt takeoff, flight, incomplete action or its settling interval',()=>{
 const t=setup();t.s.actorAirborne=true;t.s.actionReady=false;t.run(20);assert.equal(t.moves,0);assert.equal(t.clock.state().state,'PLAYING','An authored flight is not a demand for user input');t.s.actorAirborne=false;t.s.actionReady=true;t.run(.4);assert.equal(t.moves,0);t.run(.2);assert.equal(t.moves,1);
});

test('Manual mode is explicit, preserves elapsed reading, and replay grants a full fresh interval',()=>{
 const t=setup();t.run(4);t.clock.setMode('manual');t.run(40);assert.equal(t.moves,0);assert.equal(t.clock.state().state,'AWAITING_INTERACTION');assert(Math.abs(t.clock.state().elapsed-4)<1e-8);t.clock.setMode('cinema');t.clock.restartTurn();t.run(5.3);assert.equal(t.moves,0);t.run(.3);assert.equal(t.moves,1);
});

test('Forest gestures stay optional and explicit; completing one resumes cinema only after the visible transformation settles',()=>{
 const t=setup();t.s.shot={id:'el-bosque-escucha',mode:'forest'};t.s.beat={id:'forest-result',choiceResult:true,text:'Yo sujeto el tallo. Tú puedes desplegar la hoja.',age:0};t.s.forest={phase:'discover',progress:{discover:0,shape:0},canContinue:false};t.s.actionReady=false;t.clock.sync();assert.equal(t.clock.state().state,'AWAITING_INTERACTION');t.run(20);assert.equal(t.moves,0);assert.equal(t.s.forest.progress.discover,0,'Waiting cannot perform the gesture');
 t.s.forest.progress.discover=1;t.s.forest.canContinue=true;t.s.actionReady=true;t.s.visualReady=false;t.clock.sync();t.run(2);assert.equal(t.moves,0);t.s.visualReady=true;t.run(.7);assert.equal(t.moves,0);t.run(.1);assert.equal(t.moves,1);
 t.s.forest.phase='shape';t.s.forest.canContinue=false;t.s.actionReady=false;t.clock.sync();assert.equal(t.clock.state().elapsed,0);assert.equal(t.clock.state().state,'AWAITING_INTERACTION');
});

test('A physical forest crossing and constellation assistance use real completion rather than expired elapsed time',()=>{
 const f=setup();f.s.shot={id:'el-bosque-escucha',mode:'forest'};f.s.beat={id:'forest-result',choiceResult:true,text:'Un pasito y te espero.',age:0};f.s.forest={phase:'cross',progress:{discover:1,shape:1},canContinue:false};f.s.actionReady=false;f.run(40);assert.equal(f.moves,0);f.s.forest.canContinue=true;f.s.actionReady=true;f.run(.8);assert.equal(f.moves,1);
 const s=setup();s.s.shot={id:'el-museo-de-la-noche',mode:'museum'};s.s.beat={id:'sky-result',choiceResult:true,acting:'join-stars',text:'Estas luces se estaban buscando.',age:0};s.s.touched=0;s.run(40);assert.equal(s.moves,0);assert.equal(s.clock.state().state,'AWAITING_INTERACTION');s.s.touched=5;s.clock.sync();s.run(.6);assert.equal(s.moves,1);
});

test('Safe capture/restore requires the exact narrative anchor and never restores a pointer or pending advance',()=>{
 const a=setup();a.run(3);const saved=a.clock.capture(),b=setup();assert.equal(b.clock.restore(saved),true);assert(Math.abs(b.clock.state().elapsed-3)<1e-8);assert.equal(b.clock.inFlight,false);b.run(2.5);assert.equal(b.moves,1);
 for(const raw of [null,{version:2,key:saved.key,elapsed:3},{version:1,key:'another:beat',elapsed:3},{version:1,key:saved.key,elapsed:NaN},{version:1,key:saved.key,elapsed:1e8}])assert.equal(b.clock.restore(raw),false);
});

test('Async navigation is issued once; replay invalidates stale promise completion and blocked loads wait for explicit recovery',async()=>{
 let resolve;const t=setup({advance:()=>new Promise(r=>{resolve=r})});t.run(8);assert.equal(t.moves,1);assert.equal(t.clock.state().state,'TRANSITIONING');const old=t.clock.capture();t.run(40);assert.equal(t.moves,1);assert.equal(t.clock.state().elapsed,old.elapsed);t.clock.restartTurn();assert.equal(t.clock.state().elapsed,0);resolve(false);await Promise.resolve();assert.equal(t.clock.state().error,null,'A stale failure must not poison the replay');assert.equal(t.clock.state().state,'PLAYING');
 const failed=setup({advance:()=>false});failed.run(20);assert.equal(failed.moves,1);assert.equal(failed.clock.state().state,'AWAITING_INTERACTION');assert.equal(failed.clock.state().error,'continuation-blocked');failed.run(20);assert.equal(failed.moves,1);failed.clock.restartTurn();assert.equal(failed.clock.state().error,null);
});

test('Every policy exposes the complete semantic contract and a long Spanish message receives more reading time',()=>{
 const t=setup(),short=t.VF.PlaybackPolicy.for({id:'x',mode:'recognise'},{id:'short',text:'Te espero.'}),long=t.VF.PlaybackPolicy.for({id:'x',mode:'recognise'},{id:'long',text:'Hay palabras que merecen tiempo para leerse con calma, sin interrumpir el gesto de quien nos acompaña a descubrir este pequeño mundo.'});
 assert(long.minReadableDuration>short.minReadableDuration);for(const key of ['autoplay','minReadableDuration','holdReason','actionCompletion','exitCue','transitionKind','focusTarget'])assert(Object.hasOwn(short,key),key);
 const forced=t.VF.PlaybackPolicy.for({id:'x',mode:'ceremony'},{id:'unsafe',view:'macro',playback:{autoplay:true}});assert.equal(forced.autoplay,false);
});
