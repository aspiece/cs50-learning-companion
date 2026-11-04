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
 assert.match(content,/VERSION="\$\(node -p/);
});

test('the classroom installer reuses a clone and never assumes /workspaces paths',()=>{
 const install=fs.readFileSync(require('node:path').join(__dirname,'../scripts/install-in-codespaces.sh'),'utf8');
 assert.match(install,/TARGET="\$HOME\/cs50-learning-companion"/);
 assert.match(install,/git clone --depth 1/);
 assert.match(install,/bash "\$TARGET\/scripts\/update-in-codespaces.sh"/);
 assert.doesNotMatch(install,/cd \/workspaces/);
});
test('student install is build-only while optional dev tests remain available',()=>{
 const update=fs.readFileSync(require('node:path').join(__dirname,'../scripts/update-in-codespaces.sh'),'utf8');
 assert.match(update,/GCI_RUN_TESTS/);
 assert.match(update,/npm run package/);
 assert.match(update,/code --install-extension/);
 assert.match(update,/Install from VSIX/);
});
