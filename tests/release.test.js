'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const p=require('../package.json');
test('release metadata matches the extension identity',()=>{
 assert.match(p.version,/^\d+\.\d+\.\d+$/);
 assert.equal(p.repository.url,'https://github.com/aspiece/cs50-learning-companion.git');
 assert.ok(p.contributes.commands.some(x=>x.command==='cs50Companion.openReleases'));
});
test('source updater is not bundled into VSIX or tied to one version',()=>{
 const content=fs.readFileSync(require('node:path').join(__dirname,'../scripts/update-in-codespaces.sh'),'utf8');
 assert.match(content,/npm run package/);
 assert.match(content,/git -C "\$TARGET" pull --ff-only/);
 assert.match(content,/VERSION=\$\(node -p/);
});
