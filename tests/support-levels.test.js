'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

const ui=fs.readFileSync(path.join(__dirname,'../src/ui.js'),'utf8');
const script=fs.readFileSync(path.join(__dirname,'../media/sidebar.js'),'utf8');
const htmlIds=new Set([...ui.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));

function element(id){
 const source=ui.match(new RegExp('<(?:input|textarea|button|select)\\b[^>]*\\bid="'+id+'"[^>]*>'))?.[0]||'';
 const attributes={};
 for(const m of source.matchAll(/\b(data-[a-z-]+)="([^"]+)"/g))attributes[m[1].slice(5).replace(/-([a-z])/g,(_,x)=>x.toUpperCase())]=m[2];
 return {
  id,dataset:attributes,style:{},children:[],textContent:'',innerHTML:'',
  hidden:false,disabled:false,value:'',open:false,
  setAttribute(k,v){this[k]=v;},
  focus(){this.focused=true;},
  addEventListener(k,fn){(this.listeners||(this.listeners={}))[k]=fn;},
  matches(selector){
   if(selector==='[data-field]'||selector==='textarea[data-field]')return !!this.dataset.field&&(selector[0]!=='t'||source.startsWith('<textarea'));
   if(selector==='input[data-step]')return !!this.dataset.step;
   return false;
  },
  closest(selector){
   if(selector==='button[data-tab]')return this.dataset.tab?this:null;
   if(selector==='button[data-action]')return this.dataset.action?this:null;
   if(selector==='button[data-select-string]')return this.dataset.selectString?this:null;
   return null;
  }
 };
}

function harness(){
 const els=new Map(),events={},messages=[],storage={};
 const get=id=>{
  if(!htmlIds.has(id))return null;
  if(!els.has(id))els.set(id,element(id));
  return els.get(id);
 };
 const document={getElementById:get,addEventListener:(event,cb)=>{events[event]=cb;}};
 const window={addEventListener:(event,cb)=>{events['window:'+event]=cb;}};
 const api={
  getState:()=>storage.saved||{},
  setState:next=>{storage.saved=next;},
  postMessage:msg=>messages.push(msg)
 };
 vm.runInNewContext(script,{document,window,acquireVsCodeApi:()=>api,
  setTimeout,clearTimeout,Map,Set},{timeout:3000});
 function state({
  id='cs50p-0-indoor',support='standard',video=true,forceNotes=false
 }={}){
  const isCoke=id.includes('coke');
  events['window:message']({data:{
   type:'state',version:'0.7.9',
   options:[{id:'cs50p-0-indoor',title:'Indoor Voice',slug:'indoor',set:0},
    {id:'cs50p-2-coke',title:'Coke Machine',slug:'coke',set:2}],
   assignment:{id,title:isCoke?'Coke Machine':'Indoor Voice',slug:isCoke?'coke':'indoor',
    set:isCoke?2:0,description:'Practice',entryFile:isCoke?'coke.py':'indoor.py'},
   folderExists:true,guideExists:true,entryExists:true,
   journalStatus:'saved',forceNotes,hint:0,hints:['First hint','Second hint'],
   learning:{
    understand:['Which inputs?','Which output?'],
    steps:['Understand the text','Try a small example','Write your own logic','Check the result'],
    checks:['Ordinary example'],conceptVideo:video?{
     title:'String Methods',focus:'Changing text',question:'What changed?'
    }:null,
    stringToolkit:{methods:[],suggestion:null}
   },
   practice:{testedCount:0,subjects:[]},progress:{support}
  }});
 }
 function choose(level){
  const e=get('support');
  e.value=level;
  events.change({target:e});
 }
 function clickTab(tab){
  events.click({target:get('tab-'+tab)});
 }
 return {get,events,messages,state,choose,clickTab};
}

test('Guided, Some Help, and Independent have different immediately visible learning surfaces',()=>{
 const h=harness();
 h.state();
 h.clickTab('learn');
 assert.equal(h.get('support').value,'standard');
 assert.match(h.get('supportTitle').textContent,/Some Help/);
 assert.equal(h.get('supportSummary').dataset.level,'standard');
 assert.equal(h.get('guidedQuestions').hidden,true);
 assert.equal(h.get('independentChallenge').hidden,true);
 assert.equal(h.get('steps').hidden,true);
 assert.equal(h.get('hintCard').open,false);
 assert.equal(h.get('conceptVideoCard').hidden,true);
 assert.equal(h.get('planCard').hidden,false);

 h.choose('guided');
 assert.equal(h.get('panel-learn').hidden,false);
 assert.match(h.get('supportTitle').textContent,/Getting Started/);
 assert.equal(h.get('supportSummary').dataset.level,'guided');
 assert.equal(h.get('guidedQuestions').hidden,false);
 assert.equal(h.get('questions').hidden,false);
 assert.equal(h.get('steps').hidden,false);
 assert.match(h.get('steps').innerHTML,/Understand the text/);
 assert.equal(h.get('hintCard').open,true);
 assert.equal(h.get('conceptVideoCard').hidden,false);
 assert.equal(h.get('independentChallenge').hidden,true);

 h.choose('independent');
 assert.match(h.get('supportTitle').textContent,/Independent/);
 assert.equal(h.get('guidedQuestions').hidden,true);
 assert.equal(h.get('steps').hidden,true);
 assert.equal(h.get('independentChallenge').hidden,false);
 assert.equal(h.get('hintCard').open,false);
 assert.equal(h.get('conceptVideoCard').hidden,true);
 assert.match(h.get('planHeading').textContent,/optional/);

 h.choose('standard');
 assert.match(h.get('supportTitle').textContent,/Some Help/);
 assert.equal(h.get('guidedQuestions').hidden,true);
 assert.equal(h.get('independentChallenge').hidden,true);
 assert.equal(h.get('hintCard').open,false);
 assert.equal(h.get('planCard').hidden,false);
 assert.match(h.get('planGuidance').textContent,/first, next, and last/);
});

test('support changes save the selected mode and do not clear student plan or notes',()=>{
 const h=harness();h.state({support:'standard'});
 h.get('plan').value='My own plan that must not disappear';
 h.get('inputNotes').value='My input details';
 const before=h.messages.length;
 h.choose('guided');
 assert.equal(h.messages.length,before+1);
 assert.equal(h.messages.at(-1).type,'learning');
 assert.equal(h.messages.at(-1).field,'support');
 assert.equal(h.messages.at(-1).value,'guided');
 assert.equal(h.messages.at(-1).id,'cs50p-0-indoor');
 h.choose('independent');
 assert.equal(h.get('plan').value,'My own plan that must not disappear');
 assert.equal(h.get('inputNotes').value,'My input details');
 assert.equal(h.messages.at(-1).value,'independent');
});

test('saved support mode restores on another assignment or fresh webview state',()=>{
 const h=harness();
 h.state({support:'guided'});
 assert.equal(h.get('support').value,'guided');
 h.state({id:'cs50p-2-coke',support:'independent'});
 assert.equal(h.get('support').value,'independent');
 assert.equal(h.get('independentChallenge').hidden,false);
 h.state({id:'cs50p-0-indoor',support:'guided'});
 assert.equal(h.get('support').value,'guided');
 assert.equal(h.get('guidedQuestions').hidden,false);
});

test('hints and reference tools remain accessible without forcing guided mode',()=>{
 const h=harness();
 h.state({support:'independent',video:false});
 assert.equal(h.get('hintCard').open,false);
 h.get('hintCard').open=true;
 h.clickTab('test');
 h.clickTab('learn');
 assert.equal(h.get('hintCard').open,true,'manual help choice should not be lost when tabs change');
 assert.equal(h.get('openStringToolkit').hidden,false);
 assert.equal(h.get('stringToolkit').hidden,false);
 assert.equal(h.get('conceptVideoCard').hidden,true);
 h.choose('guided');
 assert.equal(h.get('conceptVideoCard').hidden,true,'no video should remain hidden');
});

test('all referenced support elements are present in real HTML',()=>{
 for(const id of ['supportSummary','supportTitle','supportDescription','supportIncludes',
   'independentChallenge','guidedQuestions','questions','planCard','planHeading',
   'planGuidance','steps','hintCard','hintSummary','conceptVideoCard',
   'openStringToolkit','stringToolkit'])
  assert.ok(htmlIds.has(id),id);
 assert.match(ui,/data-field="support"/);
 assert.match(script,/renderSupportLevel\(\$\('support'\)\.value,changed\)/);
});
