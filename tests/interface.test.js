'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const pkg=require('../package.json');
const source=fs.readFileSync(path.join(__dirname,'../src/extension.js'),'utf8');
const ui=fs.readFileSync(path.join(__dirname,'../src/ui.js'),'utf8');
const browser=fs.readFileSync(path.join(__dirname,'../media/sidebar.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../media/sidebar.css'),'utf8');
test('sidebar resources are present and browser scripts use CSP nonces',()=>{
 assert.match(ui,/Content-Security-Policy/);
 assert.match(ui,/nonce=/);
 assert.match(ui,/media','sidebar.js/);
 assert.match(ui,/media','sidebar.css/);
 assert.match(source,/localResourceRoots/);
 assert.match(source,/registerWebviewViewProvider/);
});
test('all navigation panels and existing actions remain available',()=>{
 for(const tab of ['start','test','submit']) assert.match(ui,new RegExp('id="panel-'+tab+'"'));
 for(const action of ['create','official','guide','toggleCoach','run','check','style','submit','checkUpdate']) assert.match(ui,new RegExp('data-action="'+action+'"'));
 assert.doesNotMatch(ui,/progressDetails|nextStepsList|testIdeasCard|useSelectedDebug/);
 assert.match(browser,/data-tab/);
 assert.match(browser,/applyFilters/);
});
test('UI respects VS Code theme and narrow sidebar layout',()=>{
 assert.match(css,/--vscode-/);
 assert.match(css,/@media\(max-width:240px\)/);
});
test('selected problem remains workspace scoped',()=>{
 assert.match(source,/selectedAssignment/);
 assert.match(source,/workspaceState/);
 assert.match(source,/folderExists/);
 assert.match(source,/guideExists/);
});
test('version is a new minor pilot release',()=>assert.equal(pkg.version,'0.9.3'));

test('starter opens the README and entry Python file in separate editor columns',()=>{
 assert.match(source,/async function openStarterFiles/);
 assert.match(source,/openFormattedMarkdown\(guide,vscode\.ViewColumn\.One\)/);
 assert.match(source,/showTextDocument\(script,\{viewColumn:vscode\.ViewColumn\.Two/);
 assert.match(source,/if\(await exists\(dir\)\)/);
 assert.match(source,/await openStarterFiles\(a\)/);
});
test('students can refresh existing README without overwriting Python files',()=>{
 assert.match(ui,/data-action="updateGuide"/);
 assert.match(browser,/updateGuide/);
 assert.match(source,/async function updateStudentGuide/);
 assert.match(source,/README\.backup-/);
 assert.match(source,/choice!=='Update README'/);
 assert.match(source,/case 'updateGuide'/);
});

test('official CS50 instructions open directly in the regular browser',()=>{
 assert.match(source,/case 'official':await vscode\.env\.openExternal\(vscode\.Uri\.parse\(a\.url\)\)/);
 assert.doesNotMatch(source,/simpleBrowser\.|workbench\.action\.browser\.open|officialExternal/);
 assert.match(ui,/data-action="official">Open official CS50 instructions/);
 assert.doesNotMatch(ui,/data-action="officialExternal"|instructions in editor/);
});

test('check50 and submit50 run from isolated copies without the journal',()=>{
 assert.match(source,/clean-cs50-command\.sh/);
 assert.match(source,/case 'submit'/);
});

test('Markdown previews render student guides without changing files',()=>{
 assert.match(source,/async function openFormattedMarkdown/);
 assert.match(source,/executeCommand\(\s*'vscode\.openWith',uri,'vscode\.markdown\.preview\.editor'/);
 assert.match(source,/executeCommand\('markdown\.showPreview',uri/);
 assert.match(source,/case 'guide'/);
 assert.match(ui,/Read README/);
});

test('assignment selection and first sidebar opening automatically show the formatted preview',()=>{
 assert.match(source,/if\(m\.type==='ready'\)/);
 assert.match(source,/this\.initialPreviewOpened=true/);
 assert.match(source,/if\(root\(\)&&await exists\(join\(root\(\),selected\.slug\)\)\)await openStarterFiles\(selected\)/);
 assert.match(source,/if\(root\(\)&&await exists\(join\(root\(\),get\(this\.id\)\.slug\)\)\)await openStarterFiles\(get\(this\.id\)\)/);
 assert.match(source,/await openFormattedMarkdown\(guide,vscode\.ViewColumn\.One\)/);
 assert.match(source,/await vscode\.window\.showTextDocument\(script,\{viewColumn:vscode\.ViewColumn\.Two/);
});
test('direct Markdown preview chooses the requested editor group and falls back safely',async()=>{
 const start=source.indexOf('async function openFormattedMarkdown');
 const end=source.indexOf('async function openStarterFiles',start);
 assert.ok(start>=0&&end>start);
 const calls=[];
 const mock={
  ViewColumn:{One:1},
  commands:{executeCommand:async(...args)=>calls.push(args)},
  window:{showTextDocument:async()=>calls.push(['showTextDocument']),showWarningMessage:()=>{}}
 };
 const openPreview=Function('vscode',source.slice(start,end)+';return openFormattedMarkdown;')(mock);
 assert.equal(await openPreview('readme-uri',1),true);
 assert.deepEqual(calls[0].slice(0,3),['vscode.openWith','readme-uri','vscode.markdown.preview.editor']);
 assert.equal(calls[0][3].viewColumn,1);
 assert.equal(calls.length,1,'should not open raw Markdown when preview succeeds');
 const fallback=[];
 mock.commands.executeCommand=async(...args)=>{fallback.push(args);if(args[0]==='vscode.openWith')throw Error('Unsupported');};
 mock.window.showTextDocument=async(...args)=>fallback.push(['showTextDocument',...args]);
 assert.equal(await openPreview('readme-uri',1),true);
 assert.equal(fallback[0][0],'vscode.openWith');
 assert.equal(fallback[1][0],'showTextDocument');
 assert.equal(fallback[2][0],'markdown.showPreview');
});
