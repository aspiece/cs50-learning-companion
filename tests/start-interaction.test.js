'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

const browserSource=fs.readFileSync(path.join(__dirname,'../media/sidebar.js'),'utf8');
const uiSource=fs.readFileSync(path.join(__dirname,'../src/ui.js'),'utf8');
const markupIds=new Set([...uiSource.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]));
const {coachClues,nextActions}=require('../src/coach-model');

function makeElement(id){
 const listeners={};
 // The real webview parser supplies data-action attributes from the HTML.
 // Mirror those attributes here rather than hardcoding a button behavior.
 const markup=uiSource.match(new RegExp('<button\\b[^>]*\\bid="'+id+'"[^>]*>'))?.[0]||'';
 const action=markup.match(/data-action="([^"]+)"/)?.[1];
 const tab=markup.match(/data-tab="([^"]+)"/)?.[1];
 return {
  id,listeners,dataset:{...(action?{action}:{}),...(tab?{tab}:{})},style:{},attributes:{},
  value:'',innerHTML:'',textContent:'',hidden:false,disabled:false,open:false,
  addEventListener(name,fn){listeners[name]=fn;},
  setAttribute(name,value){this.attributes[name]=value;},
  getAttribute(name){return this.attributes[name];},
  focus(){this.focused=true;},
  closest(selector){
   if(selector==='button[data-tab]')return this.dataset.tab?this:null;
   if(selector==='button[data-action]')return this.dataset.action?this:null;
   if(selector==='button[data-select-string]')return this.dataset.selectString?this:null;
   return null;
  }
 };
}

function harness(){
 const elements=new Map();
 const get=id=>{
  // Match actual document.getElementById: missing IDs must not be faked.
  if(!markupIds.has(id))return null;
  if(!elements.has(id))elements.set(id,makeElement(id));
  return elements.get(id);
 };
 const listeners={};
 const messages=[],storage={};
 const document={
  getElementById:get,
  addEventListener(name,fn){listeners[name]=fn;}
 };
 const window={
  addEventListener(name,fn){listeners['window:'+name]=fn;}
 };
 const api={
  getState:()=>storage.state||{},
  setState:value=>{storage.state=value;},
  postMessage:value=>messages.push(value)
 };
 vm.runInNewContext(browserSource,{
  document,window,acquireVsCodeApi:()=>api,
  setTimeout,clearTimeout,Map,Set
 },{timeout:2000});
 function sendState({folderExists=false,entryExists=false,guideExists=false,id='cs50p-0-indoor',progress={}}={}){
  listeners['window:message']({data:{
   type:'state',version:'0.7.5',
   options:[
    {id:'cs50p-0-indoor',title:'Indoor Voice',slug:'indoor',set:0},
    {id:'cs50p-2-coke',title:'Coke Machine',slug:'coke',set:2}
   ],
   assignment:{
    id,title:id.includes('coke')?'Coke Machine':'Indoor Voice',
    slug:id.includes('coke')?'coke':'indoor',set:id.includes('coke')?2:0,
    description:'Practice writing your own code',entryFile:id.includes('coke')?'coke.py':'indoor.py'
   },
   folderExists,entryExists,guideExists,
   journalStatus:'pending',forceNotes:false,hint:0,hints:['Try an example'],
   learning:{
    understand:['What does it need?'],steps:['Read the problem'],checks:['Try a sample'],
    conceptVideo:null,stringToolkit:{methods:[],suggestion:null}
   },
   practice:{testedCount:0,subjects:[]},
   coach:{nextSteps:nextActions({folderExists,entryExists,guideExists,progress}),
    clues:{
     understand:coachClues({title:'Indoor Voice'},
      {understand:['What is the input?','What is the output?']},'understand'),
     coding:coachClues({title:'Indoor Voice'},
      {steps:['Begin with the input'],hints:['Try a short example']},'coding'),
     debug:coachClues({}, {},'debug')
    }
   },
   progress
  }});
 }
 function click(id){
  const e=get(id);
  if(!e.dataset.action)throw Error('No clickable action on '+id);
  listeners.click({target:e});
 }
 function clickTab(tab){
  const e=get('tab-'+tab);
  if(!e?.dataset.tab)throw Error('No clickable tab '+tab);
  listeners.click({target:e});
 }
 function receive(data){listeners['window:message']({data});}
 return {get,messages,sendState,click,clickTab,storage,receive};
}

test('webview boots, then new assignment action posts create',()=>{
 const h=harness();
 assert.equal(h.messages[0].type,'ready');
 h.sendState();
 assert.equal(h.get('startPrimary').textContent,'Create starter files');
 assert.equal(h.get('startPrimary').dataset.action,'create');
 assert.equal(h.get('startStatusTitle').textContent,'Ready to begin');
 assert.equal(h.get('openGuide').disabled,true);
 assert.equal(h.get('updateGuide').disabled,true);
 h.click('startPrimary');
 assert.equal(h.messages.at(-1).type,'create');
});

test('real UI switches to Continue coding for an existing assignment',()=>{
 const h=harness();
 h.sendState({folderExists:true,entryExists:true,guideExists:true});
 assert.equal(h.get('startPrimary').textContent,'Continue coding');
 assert.equal(h.get('startPrimary').dataset.action,'openFiles');
 assert.equal(h.get('startStatusTitle').textContent,'Starter files ready');
 assert.equal(h.get('openGuide').disabled,false);
 assert.equal(h.get('openFiles').disabled,false);
 h.click('startPrimary');
 assert.equal(h.messages.at(-1).type,'openFiles');
});

test('partial folders do not offer file creation or accidental overwrite',()=>{
 const h=harness();
 h.sendState({folderExists:true,entryExists:false,guideExists:true});
 assert.equal(h.get('startPrimary').textContent,'Inspect assignment folder');
 assert.equal(h.get('startPrimary').dataset.action,'openFolder');
 assert.equal(h.get('openFiles').disabled,true);
 h.click('startPrimary');
 assert.equal(h.messages.at(-1).type,'openFolder');
});

test('missing README preserves Continue coding and exposes recovery action',()=>{
 const h=harness();
 h.sendState({folderExists:true,entryExists:true,guideExists:false});
 assert.equal(h.get('startPrimary').textContent,'Continue coding');
 assert.equal(h.get('openGuide').disabled,true);
 assert.equal(h.get('updateGuide').disabled,false);
 assert.equal(h.get('updateGuide').textContent,'Create missing README guide');
 h.click('startPrimary');
 assert.equal(h.messages.at(-1).type,'openFiles');
 h.click('updateGuide');
 assert.equal(h.messages.at(-1).type,'updateGuide');
});

test('Learning help switches to Learn without changing files or sending a backend command',()=>{
 const h=harness();
 h.sendState({folderExists:true,entryExists:true,guideExists:true});
 const previousMessages=h.messages.length;
 h.click('startLearningHelp');
 assert.equal(h.messages.length,previousMessages);
 assert.equal(h.get('panel-learn').hidden,false);
 assert.equal(h.get('panel-start').hidden,true);
 assert.equal(h.get('tab-learn').attributes['aria-selected'],'true');
 assert.equal(h.storage.state.tab,'learn');
 assert.equal(h.get('tab-learn').focused,true);
});

test('switching assignments updates Start action and collapses More options',()=>{
 const h=harness();
 h.sendState({folderExists:true,entryExists:true,guideExists:true});
 h.get('startMore').open=true;
 h.sendState({folderExists:false,entryExists:false,guideExists:false,id:'cs50p-2-coke'});
 assert.equal(h.get('heading').textContent,'Coke Machine');
 assert.equal(h.get('startPrimary').dataset.action,'create');
 assert.equal(h.get('startMore').open,false);
});


test('every sidebar element referenced by a literal ID exists in the rendered HTML',()=>{
 const referenced=[...browserSource.matchAll(/\$\('([^']+)'\)/g)].map(match=>match[1]);
 const missing=[...new Set(referenced.filter(id=>!markupIds.has(id)))];
 assert.deepEqual(missing,[],'Missing HTML element IDs can crash render() before tabs switch');
 for(const tab of ['start','learn','test','submit']){
  assert.ok(markupIds.has('tab-'+tab));
  assert.ok(markupIds.has('panel-'+tab));
 }
 for(const index of [1,2]){
  for(const suffix of ['Wrap','Label',''])assert.ok(markupIds.has('stringArg'+index+suffix));
 }
});

test('students can leave Start through Learning help, Test and Submit buttons',()=>{
 const h=harness();
 h.sendState({folderExists:true,entryExists:true,guideExists:true});
 assert.equal(h.get('panel-start').hidden,false);
 h.click('startLearningHelp');
 assert.equal(h.get('panel-learn').hidden,false);
 assert.equal(h.get('panel-start').hidden,true);
 h.clickTab('test');
 assert.equal(h.get('panel-test').hidden,false);
 assert.equal(h.get('panel-learn').hidden,true);
 assert.equal(h.get('tab-test').attributes['aria-selected'],'true');
 h.clickTab('submit');
 assert.equal(h.get('panel-submit').hidden,false);
 h.clickTab('start');
 assert.equal(h.get('panel-start').hidden,false);
 h.click('startLearningHelp');
 assert.equal(h.get('panel-learn').hidden,false);
});
