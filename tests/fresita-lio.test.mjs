import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const screenplay=JSON.parse(fs.readFileSync(new URL('../src/film-script.json',import.meta.url),'utf8'));

test('Fresita and Lio: 25 complete chapters retain beats, choices and story branches',()=>{
 assert.equal(screenplay.chapters.length,25);
 assert.equal(Object.keys(screenplay.choices).length,9);
 assert.equal(new Set(screenplay.chapters.map(c=>c.id)).size,25);
 for(const chapter of screenplay.chapters){
  assert(chapter.beats.length>0,chapter.id);
  assert.equal(new Set(chapter.beats.map(b=>b.id)).size,chapter.beats.length);
  for(const beat of chapter.beats)if(beat.kind==='speech')assert(beat.text.length>0,chapter.id+':'+beat.id);
 }
 for(const [id,choice]of Object.entries(screenplay.choices)){
  assert(choice.prompt,id);
  assert.equal(choice.options.length,2,id);
  for(const option of choice.options)assert(option.label&&option.resultDialogue,id+':'+option.id);
 }
 assert.equal(screenplay.chapters[0].beats[0].text.includes('Fresita'),true);
 assert.equal(screenplay.chapters[0].beats[0].text.includes('Lio'),true);
 assert(screenplay.chapters.at(-1).beats.some(b=>b.text.includes('Valerie')));
});

test('Fresita and Lio: authoritative narrative overrides historical speaker names',()=>{
 const c=vm.createContext({VF_FILM_SCRIPT:screenplay,sessionStorage:{getItem(){},setItem(){},removeItem(){}}});
 vm.runInContext('window=globalThis',c);
 const release=JSON.parse(fs.readFileSync(new URL('../release.json',import.meta.url),'utf8'));
 for(const name of ['math','character-models','kinematics','animation','content','rig','stage','production-stage','environment',...release.sceneModules,'session']){
  vm.runInContext(fs.readFileSync(new URL('../src/'+name+'.js',import.meta.url),'utf8'),c);
 }
 assert.equal(c.VF.GuardianNames.pink,'Fresita');
 assert.equal(c.VF.GuardianNames.taupe,'Lio');
 assert.equal(c.VF.GuardianScript['antes-del-primer-pasito'][0].text,screenplay.chapters[0].beats[0].text);
 assert.equal(c.VF.StoryGraph.choices['leaf-holder'].options[0].label,'Fresita sostiene; Lio cruza primero');
 assert.equal(c.VF.StoryGraph.choices['leaf-holder'].options[1].label,'Lio sostiene; Fresita cruza primero');
});
