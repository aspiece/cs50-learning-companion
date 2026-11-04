'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const updater=require('../src/updater');

function release(version,complete=true){
 const tag='v'+version,base='https://github.com/aspiece/cs50-learning-companion/releases/download/'+tag+'/';
 return {
  tag_name:tag,draft:false,prerelease:true,
  assets:[
   {name:'cs50-learning-companion-'+version+'.vsix',browser_download_url:base+'cs50-learning-companion-'+version+'.vsix'},
   ...(complete?[{name:'SHA256SUMS.txt',browser_download_url:base+'SHA256SUMS.txt'}]:[])
  ]
 };
}
test('semantic versions compare numerically, not alphabetically',()=>{
 assert.equal(updater.compareVersions('0.7.10','0.7.9'),1);
 assert.equal(updater.compareVersions('0.7.0','0.7.0'),0);
 assert.equal(updater.compareVersions('0.6.9','0.7.0'),-1);
 assert.throws(()=>updater.compareVersions('not-version','0.7.0'),/Invalid/);
});
test('newest verified release is selected including prereleases',()=>{
 const list=[release('0.8.0',false),release('0.7.8'),release('0.7.10'),release('0.6.0')];
 const found=updater.findAvailableRelease(list,'0.7.0');
 assert.equal(found.version,'0.7.10');
 assert.equal(updater.findAvailableRelease([release('0.7.0')],'0.7.0'),null);
 assert.equal(updater.findAvailableRelease([], '0.7.0'),null);
});
test('rejects draft, mismatched and external update assets',()=>{
 const draft=release('0.8.0');draft.draft=true;
 const hijacked=release('0.9.0');
 hijacked.assets[0].browser_download_url='https://evil.example/update.vsix';
 const incomplete=release('1.0.0',false);
 assert.equal(updater.findAvailableRelease([draft,hijacked,incomplete],'0.7.0'),null);
 assert.equal(updater.trustedReleaseUrl('https://github.com/aspiece/cs50-learning-companion/releases/download/v0.8.0/cs50-learning-companion-0.8.0.vsix','v0.8.0','cs50-learning-companion-0.8.0.vsix'),true);
 assert.equal(updater.trustedReleaseUrl('http://github.com/aspiece/cs50-learning-companion/releases/download/v0.8.0/x.vsix','v0.8.0','x.vsix'),false);
 assert.equal(updater.trustedReleaseUrl('https://github.com/other/repo/releases/download/v0.8.0/x.vsix','v0.8.0','x.vsix'),false);
});
test('release checksum is checked against the exact versioned filename',()=>{
 const name='cs50-learning-companion-0.8.0.vsix';
 const hash='a'.repeat(64);
 assert.equal(updater.expectedChecksum(hash+'  '+name+'\n',''+name),hash);
 assert.throws(()=>updater.expectedChecksum(hash+'  different.vsix\n',name),/no SHA-256/);
});
test('UI provides explicit update check, confirmation and reload after successful install',()=>{
 const extension=fs.readFileSync(path.join(__dirname,'../src/extension.js'),'utf8');
 const sidebar=fs.readFileSync(path.join(__dirname,'../src/ui.js'),'utf8');
 const client=fs.readFileSync(path.join(__dirname,'../media/sidebar.js'),'utf8');
 assert.match(sidebar,/data-action="checkUpdate"/);
 assert.match(extension,/case 'checkUpdate':await this\.checkUpdates/);
 assert.match(extension,/Install update/);
 assert.match(extension,/downloadVerified/);
 assert.match(extension,/installWithCodeCLI/);
 assert.match(extension,/workbench\.action\.reloadWindow/);
 assert.match(client,/updateStatus/);
});
test('GitHub workflow publishes versioned package only after validation',()=>{
 const flow=fs.readFileSync(path.join(__dirname,'../.github/workflows/build.yml'),'utf8');
 assert.match(flow,/needs: build/);
 assert.match(flow,/sha256sum -c SHA256SUMS.txt/);
 assert.match(flow,/gh release create "\$TAG"/);
 assert.match(flow,/gh release upload "\$TAG"/);
});
