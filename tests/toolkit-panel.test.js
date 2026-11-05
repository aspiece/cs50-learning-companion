'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {get}=require('../src/core');
const {toolkitForAssignment,validatePracticeRequest,practiceSnippet,LESSON_URL,DOCS_URL}=require('../src/string-methods');
const {runStringPractice}=require('../src/string-practice');

const ext=fs.readFileSync(path.join(__dirname,'../src/extension.js'),'utf8');
const uiSource=fs.readFileSync(path.join(__dirname,'../src/toolkit-panel.js'),'utf8');
const template=fs.readFileSync(path.join(__dirname,'../media/toolkit.html'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../media/toolkit.css'),'utf8');
const script=fs.readFileSync(path.join(__dirname,'../media/toolkit.js'),'utf8');
const sidebar=fs.readFileSync(path.join(__dirname,'../src/ui.js'),'utf8');

test('panel renders a dedicated editor layout with local assets and strict CSP',()=>{
 const vscode={Uri:{joinPath:(...parts)=>parts.join('/')}};
 const webview={cspSource:'vscode-test:',asWebviewUri:p=>'local:'+p};
 const module={exports:{}};
 Function('require','module','__dirname',uiSource)(
  name=>name==='vscode'?vscode:require(name),module,path.join(__dirname,'../src')
 );
 const html=module.exports.toolkitHtml(webview,'/extension');
 for(const id of ['methodSearch','categoryFilter','methodList','methodDetail','sampleText',
  'runPractice','copyPractice','liveResult','openDocs','openVideo','assignmentName'])
  assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(html,/default-src 'none'/);
 assert.match(html,/script-src 'nonce-/);
 assert.match(html,/local:\/extension\/media\/toolkit\.css/);
 assert.match(html,/local:\/extension\/media\/toolkit\.js/);
 assert.doesNotMatch(html,/%%CSP%%|%%NONCE%%|%%JS%%|%%CSS%%/);
 assert.doesNotMatch(html,/<iframe|<script[^>]+src="https:|<style/);
 assert.match(css,/grid-template-columns:minmax\(220px,290px\) minmax\(0,1fr\)/);
 assert.match(css,/@media\(max-width:750px\)/);
 assert.match(sidebar,/data-action="openStringToolkit"/);
 assert.match(sidebar,/Quick reference in sidebar/);
});

test('editor panel backend is reusable and syncs the selected assignment',async()=>{
 const posts=[],external=[],copied=[],created=[];
 let receive=null,dispose=null;
 const panel={
  reveal(column){this.revealed=column;},
  webview:{
   onDidReceiveMessage(fn){receive=fn;},
   postMessage:async m=>{posts.push(m);return true;},
   set html(v){this._html=v;},get html(){return this._html;}
  },
  onDidDispose(fn){dispose=fn;}
 };
 const vscode={
  ViewColumn:{One:1},
  Uri:{joinPath:(...parts)=>parts.join('/'),parse:value=>value},
  window:{
   createWebviewPanel:(...args)=>{created.push(args);return panel;},
   showWarningMessage:()=>{}
  },
  env:{
   openExternal:async uri=>external.push(uri),
   clipboard:{writeText:async value=>copied.push(value)}
  }
 };
 const start=ext.indexOf(' async sendToolkitState(){');
 const end=ext.indexOf(' async term(a,kind){',start);
 assert.ok(start>=0&&end>start);
 const Cls=Function('vscode','get','toolkitForAssignment','toolkitHtml',
  'validatePracticeRequest','runStringPractice','practiceSnippet',
  'LESSON_URL','DOCS_URL',
  'return class CompanionToolkit { constructor(){this.id="cs50p-0-indoor";this.ctx={extensionUri:"/extension",subscriptions:[]};this.toolkitPanel=null;}'+
   ext.slice(start,end)+'\n}'
 )(vscode,get,toolkitForAssignment,()=>'<!doctype html>Toolbox',
   validatePracticeRequest,runStringPractice,practiceSnippet,LESSON_URL,DOCS_URL);
 const companion=new Cls();
 await companion.openStringToolkit();
 assert.equal(created.length,1);
 assert.equal(created[0][2],1,'put toolkit in left editor so code stays on right');
 assert.equal(created[0][3].enableScripts,true);
 assert.equal(created[0][3].retainContextWhenHidden,true);
 assert.match(panel.webview.html,/Toolbox/);
 await companion.handleToolkitMessage({type:'ready'},panel);
 assert.equal(posts.at(-1).type,'toolkitState');
 assert.equal(posts.at(-1).assignment.title,'Indoor Voice');
 assert.equal(posts.at(-1).toolkit.methods.length,16);
 companion.id='cs50p-2-coke';
 await companion.sendToolkitState();
 assert.equal(posts.at(-1).assignment.title,'Coke Machine');
 await companion.openStringToolkit();
 assert.equal(created.length,1,'do not stack duplicate editor panels');
 assert.equal(panel.revealed,1);
 await companion.handleToolkitMessage({type:'practiceString',requestId:4,
  method:'upper',text:'quick test',args:[]},panel);
 assert.deepEqual(JSON.parse(JSON.stringify(posts.at(-1))),{
  type:'stringPracticeResult',requestId:4,ok:true,value:"'QUICK TEST'",kind:'str'
 });
 await companion.handleToolkitMessage({type:'practiceString',requestId:5,
  method:'__import__',text:'unsafe',args:[]},panel);
 assert.equal(posts.at(-1).ok,false);
 await companion.handleToolkitMessage({type:'copyStringPractice',
  method:'lower',text:'ABC',args:[]},panel);
 assert.deepEqual(copied,['print("ABC".lower())']);
 assert.equal(posts.at(-1).type,'copyStatus');
 await companion.handleToolkitMessage({type:'openVideo'},panel);
 await companion.handleToolkitMessage({type:'openDocs'},panel);
 assert.deepEqual(external,[LESSON_URL,DOCS_URL]);
 dispose();
 assert.equal(companion.toolkitPanel,null);
});

function fakeElement(id){
 return {
  id,children:[],dataset:{},attributes:{},listeners:{},
  hidden:false,disabled:false,textContent:'',value:'',placeholder:'',
  append(...items){this.children.push(...items);},
  replaceChildren(...items){this.children=[...items];},
  setAttribute(name,value){this.attributes[name]=value;},
  addEventListener(name,callback){this.listeners[name]=callback;},
  focus(){this.focused=true;}
 };
}
function panelClient(){
 const elements=new Map(),windows={},messages=[],saved={};
 const $=id=>{
  if(!elements.has(id))elements.set(id,fakeElement(id));
  return elements.get(id);
 };
 const api={
  getState:()=>saved.data||{},
  setState:data=>{saved.data=data;},
  postMessage:msg=>messages.push(msg)
 };
 const document={
  getElementById:$,
  createElement:name=>fakeElement(name)
 };
 const window={addEventListener:(name,fn)=>{windows[name]=fn;}};
 vm.runInNewContext(script,{document,window,acquireVsCodeApi:()=>api});
 const load=(id='cs50p-0-indoor')=>{
  const a=get(id);
  windows.message({data:{type:'toolkitState',
   assignment:{id:a.id,title:a.title,set:a.set},toolkit:toolkitForAssignment(a)
  }});
 };
 return {$,messages,saved,load,windows};
}

test('real panel client searches, filters, selects, and runs a method without touching files',()=>{
 const h=panelClient();
 assert.equal(h.messages[0].type,'ready');
 h.load();
 assert.equal(h.$('methodList').children.length,16);
 assert.match(h.$('assignmentName').textContent,/Indoor Voice/);
 h.$('categoryFilter').listeners.change({target:{value:'check'}});
 assert.ok(h.$('methodList').children.length>3);
 assert.ok(h.$('methodList').children.length<16);
 h.$('methodSearch').value='decimal';
 h.$('methodSearch').listeners.input({target:h.$('methodSearch')});
 assert.ok(h.$('methodList').children.length>=1);
 const button=h.$('methodList').children.find(x=>x.dataset.method==='isdecimal');
 assert.equal(button.dataset.method,'isdecimal');
 button.listeners.click();
 assert.equal(h.$('methodTitle').textContent,'.isdecimal()');
 assert.equal(h.$('emptySelection').hidden,true);
 assert.equal(h.$('methodDetail').hidden,false);
 assert.equal(h.$('sampleText').focused,true);
 h.$('sampleText').value='123';
 h.$('runPractice').listeners.click();
 assert.equal(h.messages.at(-1).type,'practiceString');
 assert.equal(h.messages.at(-1).method,'isdecimal');
 assert.equal(h.messages.at(-1).text,'123');
 const requestId=h.messages.at(-1).requestId;
 h.windows.message({data:{type:'stringPracticeResult',requestId,ok:true,value:'True',kind:'bool'}});
 assert.match(h.$('liveResult').textContent,/True/);
 assert.equal(h.$('runPractice').disabled,false);
 const copyBefore=h.messages.length;
 h.$('copyPractice').listeners.click();
 assert.equal(h.messages.length,copyBefore+1);
 assert.equal(h.messages.at(-1).type,'copyStringPractice');
});

test('toolkit panel keeps search and method but follows changed assignments',()=>{
 const h=panelClient();
 h.load('cs50p-0-indoor');
 h.$('methodSearch').value='lower()';
 h.$('methodSearch').listeners.input({target:h.$('methodSearch')});
 assert.equal(h.$('methodList').children.length,1);
 h.$('methodList').children[0].listeners.click();
 h.load('cs50p-2-coke');
 assert.match(h.$('assignmentName').textContent,/Coke Machine/);
 assert.equal(h.$('methodSearch').value,'lower()');
 assert.equal(h.$('methodTitle').textContent,'.lower()');
 assert.equal(h.$('methodList').children.length,1);
 assert.match(h.$('suggestion').textContent,/For this assignment, explore/);
});
