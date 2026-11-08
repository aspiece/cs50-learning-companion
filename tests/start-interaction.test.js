'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

const browserSource=fs.readFileSync(path.join(__dirname,'../media/sidebar.js'),'utf8');
const uiSource=fs.readFileSync(path.join(__dirname,'../src/ui.js'),'utf8');
const markupIds=new Set([...uiSource.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]));
const {coachClues}=require('../src/coach-model');
const {get:assignmentById,assignmentCommands}=require('../src/core');

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
   return null;
  }
 };
}

function harness(saved={}){
 const elements=new Map();
 const get=id=>{
  // Match actual document.getElementById: missing IDs must not be faked.
  if(!markupIds.has(id))return null;
  if(!elements.has(id))elements.set(id,makeElement(id));
  return elements.get(id);
 };
 const listeners={};
 const messages=[],storage={state:saved};
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
 function sendState({folderExists=false,entryExists=false,guideExists=false,id='cs50p-0-indoor'}={}){
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
   folderExists,entryExists,guideExists,commands:assignmentCommands(assignmentById(id)),testExists:false,
   coach:{clues:{
     understand:coachClues({title:'Indoor Voice'},
      {understand:['What is the input?','What is the output?']},'understand'),
     coding:coachClues({title:'Indoor Voice'},
      {steps:['Begin with the input'],hints:['Try a short example']},'coding'),
     debug:coachClues({}, {},'debug')
    }
   }
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
 assert.equal(h.get('openOfficial').hidden,false);
 h.click('openOfficial');
 assert.equal(h.messages.at(-1).type,'official');
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
 assert.equal(h.get('startStatus').hidden,true);
 assert.equal(h.get('openOfficial').hidden,true);
 assert.equal(h.get('openGuide').disabled,false);
 h.click('startPrimary');
 assert.equal(h.messages.at(-1).type,'openFiles');
});

test('partial folders do not offer file creation or accidental overwrite',()=>{
 const h=harness();
 h.sendState({folderExists:true,entryExists:false,guideExists:true});
 assert.equal(h.get('startPrimary').textContent,'Inspect assignment folder');
 assert.equal(h.get('startPrimary').dataset.action,'openFolder');
 assert.equal(h.get('startStatus').hidden,false);
 assert.equal(h.get('openOfficial').hidden,true);
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
 assert.equal(h.get('startStatus').hidden,false);
 assert.equal(h.get('openOfficial').hidden,false);
 h.sendState({folderExists:true,entryExists:true,guideExists:true});
 assert.equal(h.get('startStatus').hidden,true);
 assert.equal(h.get('openOfficial').hidden,true);
 h.click('startPrimary');
 assert.equal(h.messages.at(-1).type,'openFiles');
 h.click('updateGuide');
 assert.equal(h.messages.at(-1).type,'updateGuide');
});

test('a saved Learn tab from an older version opens Start',()=>{
 const h=harness({tab:'learn'});
 h.sendState({folderExists:true,entryExists:true,guideExists:true});
 assert.equal(h.get('panel-learn'),null);
 assert.equal(h.get('panel-start').hidden,false);
 assert.equal(h.get('tab-start').attributes['aria-selected'],'true');
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
 for(const tab of ['start','test','submit']){
  assert.ok(markupIds.has('tab-'+tab));
  assert.ok(markupIds.has('panel-'+tab));
 }
});

test('students can leave Start through Test and Submit buttons',()=>{
 const h=harness();
 h.sendState({folderExists:true,entryExists:true,guideExists:true});
 assert.equal(h.get('panel-start').hidden,false);
 h.clickTab('test');
 assert.equal(h.get('panel-start').hidden,true);
 assert.equal(h.get('panel-test').hidden,false);
 assert.equal(h.get('tab-test').attributes['aria-selected'],'true');
 h.clickTab('submit');
 assert.equal(h.get('panel-submit').hidden,false);
 h.clickTab('start');
 assert.equal(h.get('panel-start').hidden,false);
});


test('Stuck button shows one clue at a time without sending code',()=>{
 const h=harness();
 h.sendState({folderExists:true,entryExists:true,guideExists:true});
 assert.equal(h.get('coachPanel').hidden,true);
 h.click('coachToggle');
 assert.equal(h.get('coachPanel').hidden,false);
 assert.equal(h.get('coachToggle').attributes['aria-expanded'],'true');
 h.click('coachUnderstand');
 assert.equal(h.get('coachClueBox').hidden,false);
 const first=h.get('coachClue').textContent;
 assert.match(first,/README/);
 assert.equal(h.get('coachNext').disabled,false);
 h.click('coachNext');
 assert.notEqual(h.get('coachClue').textContent,first);
 h.click('coachNext');
 assert.equal(h.get('coachNext').disabled,true);
 h.click('coachCoding');
 assert.match(h.get('coachClue').textContent,/Indoor Voice/);
 assert.equal(h.get('coachNext').disabled,false);
 h.click('coachToggle');
 assert.equal(h.get('coachPanel').hidden,true);
 assert.equal(h.messages.length,1,'No remote messages for local coaching');
});

test('Stuck error path opens existing Test and Debug instead of another tab',()=>{
 const h=harness();h.sendState({folderExists:true,entryExists:true,guideExists:true});
 h.click('coachToggle');
 h.click('coachError');
 assert.equal(h.get('coachDebug').hidden,false);
 assert.match(h.get('coachClue').textContent,/terminal/);
 h.click('coachDebug');
 assert.equal(h.get('panel-test').hidden,false);
 assert.equal(h.get('debugHelp').open,true);
 assert.equal(h.get('errorInput').focused,true);
 h.sendState({id:'cs50p-2-coke'});
 assert.equal(h.get('coachPanel').hidden,true,'new assignment resets clues');
});

test('debugging reads copied text only after a student clicks',()=>{
 const h=harness();h.sendState({folderExists:true,entryExists:true,guideExists:true});
 h.clickTab('test');
 const initial=h.messages.length;
 h.click('useClipboardDebug');
 assert.equal(h.messages.length,initial+1);
 const request=h.messages.at(-1);
 assert.equal(request.type,'useClipboardDebug');
 assert.equal(request.assignmentId,'cs50p-0-indoor');
 h.receive({type:'debugText',assignmentId:'cs50p-0-indoor',
  requestId:request.requestId,ok:true,text:':( expected "Hello", saw "hello"'});
 assert.equal(h.get('errorInput').value,':( expected "Hello", saw "hello"');
 const analyzed=h.messages.at(-1);
 assert.equal(analyzed.type,'analyzeError');
 assert.match(analyzed.errorText,/expected/);
 h.receive({type:'testDebugAdvice',assignmentId:'cs50p-0-indoor',requestId:analyzed.requestId,
  ok:true,advice:{title:'Output mismatch',guidance:'Check capitalization.',
   location:'Check the terminal.',next:'Run it again.'}});
 assert.equal(h.get('debugTitle').textContent,'Output mismatch');
 assert.equal(h.get('useSelectedDebug'),null);
});


test('Writing Python opens an optional lookup that filters by method name and purpose',()=>{
 const h=harness();
 h.sendState();
 h.click('coachToggle');
 h.click('coachUnderstand');
 assert.equal(h.get('stringLookup').hidden,true);
 h.click('coachCoding');
 assert.equal(h.get('stringLookup').hidden,false);
 const search=h.get('stringSearch');
 const methods=require('../src/string-methods');
 const rows=methods.map(({label,purpose})=>({firstElementChild:{textContent:label+' '+purpose}}));
 h.get('stringMethodList').children=rows;
 const visible=query=>{
  search.listeners.input({target:{value:query}});
  return methods.filter((_,index)=>!rows[index].hidden).map(method=>method.label);
 };
 assert.equal(methods.length,16);
 assert.deepEqual(visible('  .LSTRIP()  '),['.lstrip(chars)']);
 assert.deepEqual(visible('spaces from both'),['.strip()']);
 assert.deepEqual(visible('unmatched'),[]);
 assert.match(h.get('stringLookupStatus').textContent,/No methods found/);
 assert.equal(visible('').length,16);
 h.click('coachError');
 assert.equal(h.get('stringLookup').hidden,true);
 assert.equal(h.messages.length,1,'Lookup runs entirely in the sidebar');
});
