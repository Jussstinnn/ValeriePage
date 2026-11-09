// Alpha-WebP conversion was deliberately rejected. Exact binary/byte contracts live in asset-codec.test.mjs.
require('node:assert/strict').equal(Object.values(JSON.parse(require('node:fs').readFileSync('assets/runtime/manifest.json'))).filter(x=>x.mime==='image/png').length,5);
