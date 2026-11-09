import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const read=p=>readFile(new URL(p,root),'utf8');
test('Nine original artworks retain their recorded SHA-256 hashes',async()=>{
 const manifest=JSON.parse(await read('ENGINE_ORIGINAL_HASHES.json'));
 assert.equal(Object.keys(manifest).length,9);
 for(const value of Object.values(manifest)){
  const data=await readFile(new URL(value.file,root));assert.equal(createHash('sha256').update(data).digest('hex'),value.sha256);
 }
});
test('One clock freezes time and all queued engine animation callbacks',async()=>{
 let win={};const context=vm.createContext({window:win,performance:{}});
 vm.runInContext(await read('src/engine-clock.js'),context);
 let draws=0;const frame=()=>{draws++;win.requestAnimationFrame(frame)};
 win.requestAnimationFrame(frame);assert.equal(draws,0);assert.equal(win.__filmClock.time,1000);
 win.__filmClock.tick(.25);assert.equal(draws,1);assert.equal(win.__filmClock.time,1250);
 assert.equal(win.__filmClock.pending,1);win.__filmClock.clear();win.__filmClock.tick(.25);assert.equal(draws,1);
});
test('Every authored chapter is reachable; memories and intimate scenes wait for the reader',async()=>{
 const context=vm.createContext({window:{}});vm.runInContext(await read('src/story.js'),context);
 const chapters=context.window.VStory.chapters;
 assert.equal(chapters.length,12);assert.equal(new Set(chapters.map(c=>c.id)).size,12);
 assert.equal(chapters.filter(c=>c.id.startsWith('memory')).length,3);
 for(const chapter of chapters.slice(6))assert.equal(chapter.duration,0);
 assert.equal(context.window.VStory.audioFile,'');
});
test('Offline edition includes all engines and both fonts with no remote runtime dependency',async()=>{
 const html=await read('VALERIE_OFFLINE.html');
 assert.ok(html.includes('window.VEngines='));assert.ok(html.includes('data:font/ttf;base64,'));
 assert.ok(!/<script[^>]+src=/.test(html));assert.ok(!/<link[^>]+href="https?:/.test(html));
 const context=vm.createContext({window:{}});vm.runInContext(await read('dist/engines.js'),context);
 assert.equal(Object.keys(context.window.VEngines).length,9);
 for(const [id,source] of Object.entries(context.window.VEngines)){
  assert.ok(source.includes('window.__filmClock'),`${id}: master clock missing`);
  assert.ok(source.includes('<canvas'),`${id}: canvas missing`);
 }
});
