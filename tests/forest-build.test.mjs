import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';

const root=new URL('../',import.meta.url),read=file=>readFile(new URL(file,root)),json=async file=>JSON.parse(await read(file));
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const extract=(text,name)=>{const prefix='var '+name+'=',start=text.indexOf(prefix);assert.ok(start>=0,'Missing '+name);return JSON.parse(text.slice(start+prefix.length,text.indexOf(';\n',start)));};

test('forest distribution preserves native PNGs, metadata and resource versions',async()=>{
 const manifest=await json('assets/forest-living/manifest.json'),film=(await read('dist/film.js')).toString(),distributed=await json('dist/assets/forest-living/manifest.json');
 assert.deepEqual(distributed,manifest);assert.deepEqual(extract(film,'VF_FOREST_ASSETS'),manifest);
 const revisions=extract(film,'VF_RESOURCE_VERSION');
 for(const item of Object.values(manifest.assets)){const bytes=await read('dist/'+item.file);assert.equal(digest(bytes),item.sha256);assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.equal(bytes.readUInt32BE(16),item.width);assert.equal(bytes.readUInt32BE(20),item.height);assert.equal(revisions[item.file],item.sha256.slice(0,16));}
});

test('offline forest descriptor resolves through existing codec without network files',async()=>{
 const release=await json('release.json'),offline=(await read(release.offline)).toString(),manifest=extract(offline,'VF_FOREST_ASSETS'),embedded=extract(offline,'VF_EMBEDDED_ASSETS');
 const context={VF:{},Uint8Array};vm.createContext(context);vm.runInContext((await read('src/asset-codec.js')).toString(),context);
 for(const item of Object.values(manifest.assets)){assert.equal(item.file,'vfembed:'+item.sourceFile);const body=embedded[item.sourceFile];assert.ok(body);assert.equal(body.mime,'image/png');const bytes=context.VF.AssetCodec.decode(body.body,body.bytes);assert.equal(digest(bytes),item.sha256);}
 assert.ok(!/<script[^>]+src=/.test(offline),'External script remains in offline build');
});
