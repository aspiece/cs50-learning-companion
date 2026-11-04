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
 for(const tab of ['start','learn','test','submit']) assert.match(ui,new RegExp('id="panel-'+tab+'"'));
 for(const action of ['create','official','guide','hint','run','check','style','explain','submit','updates']) assert.match(ui,new RegExp('data-action="'+action+'"'));
 assert.match(browser,/data-step/);
 assert.match(browser,/data-tab/);
 assert.match(browser,/applyFilters/);
});
test('UI respects VS Code theme and narrow sidebar layout',()=>{
 assert.match(css,/--vscode-/);
 assert.match(css,/@media\(max-width:240px\)/);
});
test('selected problem and progress remain workspace scoped',()=>{
 assert.match(source,/selectedAssignment/);
 assert.match(source,/workspaceState/);
 assert.match(source,/folderExists/);
 assert.match(source,/guideExists/);
});
test('version is a new minor pilot release',()=>assert.equal(pkg.version,'0.4.0'));
