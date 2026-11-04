'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const client=fs.readFileSync(path.join(__dirname,'../media/sidebar.js'),'utf8');
const ui=fs.readFileSync(path.join(__dirname,'../src/ui.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../media/sidebar.css'),'utf8');
const server=fs.readFileSync(path.join(__dirname,'../src/extension.js'),'utf8');

const start=client.indexOf(' function startScreenModel(');
const end=client.indexOf(' function renderStartScreen(){',start);
assert.ok(start>=0&&end>start,'Start screen model should be independently testable');
const screenModel=Function(client.slice(start,end)+'\nreturn startScreenModel;')();

test('new assignment has one clear Create starter files action',()=>{
 const state=screenModel(false,false,false);
 assert.equal(state.action,'create');
 assert.equal(state.button,'Create starter files');
 assert.equal(state.status,'new');
 assert.match(state.next,/README and Python/);
});
test('existing complete assignment offers Continue coding without replacing files',()=>{
 const state=screenModel(true,true,true);
 assert.equal(state.action,'openFiles');
 assert.equal(state.button,'Continue coding');
 assert.equal(state.status,'ready');
 assert.match(state.next,/not replaced/);
});
test('a folder missing a Python file is handled safely without recreating it',()=>{
 const state=screenModel(true,false,true);
 assert.equal(state.action,'openFolder');
 assert.equal(state.button,'Inspect assignment folder');
 assert.equal(state.status,'attention');
 assert.match(state.next,/not replace/);
 assert.match(server,/case 'openFolder':/);
 assert.match(server,/executeCommand\('revealInExplorer',dir\)/);
});
test('a folder missing a README keeps code accessible and offers guide recovery',()=>{
 const state=screenModel(true,true,false);
 assert.equal(state.action,'openFiles');
 assert.equal(state.button,'Continue coding');
 assert.equal(state.status,'attention');
 assert.match(state.next,/create the README/);
});
test('Start UI has only one primary CTA; supporting actions are secondary',()=>{
 const tab=ui.slice(ui.indexOf('<section id="panel-start"'),ui.indexOf('<section id="panel-learn"'));
 assert.equal((tab.match(/id="startPrimary"/g)||[]).length,1);
 assert.match(tab,/id="startPrimary"[^>]*data-action="create"/);
 assert.match(tab,/id="startStatus"/);
 assert.match(tab,/id="openGuide"/);
 assert.match(tab,/data-action="goLearn"/);
 assert.match(tab,/data-action="official"/);
 assert.match(tab,/<details id="startMore"/);
 assert.match(tab,/data-action="updateGuide"/);
 assert.match(tab,/data-action="openFiles"/);
 assert.equal((tab.match(/class="button start-primary"/g)||[]).length,1);
 assert.match(css,/\.start-quick-actions/);
 assert.match(css,/@media\(max-width:240px\)/);
});
test('Start screen rerenders for assignment changes and preserves student work',()=>{
 assert.match(client,/renderStartScreen\(\)/);
 assert.match(client,/\$\('startPrimary'\)\.dataset\.action=model\.action/);
 assert.match(client,/\$\('openGuide'\)\.disabled=!state\.guideExists/);
 assert.match(client,/\$\('openFiles'\)\.disabled=!state\.folderExists\|\|!state\.entryExists/);
 assert.match(client,/\$\('updateGuide'\)\.disabled=!state\.folderExists/);
 assert.match(client,/b\.dataset\.action==='goLearn'/);
 assert.match(client,/tab='learn';persist\(\);render\(\)/);
 assert.match(server,/const entryExists=folderExists\?await exists\(join\(directory,a\.entryFile\)\):false/);
 assert.match(server,/folderExists,guideExists,entryExists/);
 assert.match(server,/case 'openFiles':await openStarterFiles\(a\);break/);
 assert.match(server,/if\(await exists\(dir\)\)/);
});
