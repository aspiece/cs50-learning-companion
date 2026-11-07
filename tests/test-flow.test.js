'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {explainTerminalError}=require('../src/debugging');

const ui=fs.readFileSync(path.join(__dirname,'../src/ui.js'),'utf8');
const js=fs.readFileSync(path.join(__dirname,'../media/sidebar.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../media/sidebar.css'),'utf8');
const backend=fs.readFileSync(path.join(__dirname,'../src/extension.js'),'utf8');

test('static debug advice is solution-free and explains common failures',()=>{
 const examples=[
  ['NameError: name "score" is not defined','Unknown name'],
  ['Traceback\n  File "test.py", line 12\nTypeError: can only concatenate str (not "int") to str','Wrong kind of value'],
  ['IndexError: list index out of range','Position not found'],
  ['KeyError: "item"','Dictionary key missing'],
  ['SyntaxError: invalid syntax','Syntax error'],
  ['ModuleNotFoundError: No module named "fake"','Module not found'],
  ['FAILED tests/test.py::test_one - assert False','A Python test did not match'],
  ['FileNotFoundError: no such file','File not found']
 ];
 for(const [value,title] of examples){
  const advice=explainTerminalError(value);
  assert.equal(advice.title,title);
  assert.ok(advice.guidance.length>20);
  assert.match(advice.next,/run it again/);
  assert.equal(advice.verified,false);
  assert.doesNotMatch(advice.guidance,/answer key|solution code|copy this/i);
 }
 assert.match(explainTerminalError('File "work.py", line 22\nNameError: x').location,/line 22/);
 assert.throws(()=>explainTerminalError(''),/Paste an error/);
 assert.throws(()=>explainTerminalError('X'.repeat(6001)),/6,000/);
});

function makeElement(id){
 const markup=ui.match(new RegExp('<(?:button|textarea|select)\\b[^>]*\\bid="'+id+'"[^>]*>'))?.[0]||'';
 const action=markup.match(/data-action="([^"]+)"/)?.[1];
 const listeners={};
 return {
  id,listeners,dataset:action?{action}:{},style:{},attributes:{},
  textContent:'',innerHTML:'',value:'',disabled:false,hidden:false,open:false,
  addEventListener(name,fn){listeners[name]=fn;},
  setAttribute(name,value){this.attributes[name]=value;},
  focus(){this.focused=true;},
  closest(selector){
   if(selector==='button[data-tab]')return this.dataset.tab?this:null;
   if(selector==='button[data-action]')return this.dataset.action?this:null;
   if(selector==='button[data-select-string]')return this.dataset.selectString?this:null;
   return null;
  }
 };
}
function simulate(){
 const elements=new Map(),listeners={},messages=[],storage={};
 const get=id=>{
  if(!elements.has(id))elements.set(id,makeElement(id));
  return elements.get(id);
 };
 const document={getElementById:get,addEventListener(name,fn){listeners[name]=fn;}};
 const window={addEventListener(name,fn){listeners['window:'+name]=fn;}};
 const api={
  getState:()=>storage.saved||{},
  setState:next=>{storage.saved=next;},
  postMessage:msg=>messages.push(msg)
 };
 vm.runInNewContext(js,{document,window,acquireVsCodeApi:()=>api,setTimeout,clearTimeout,Map,Set},{timeout:2000});
 const send=(id='cs50p-0-indoor',exists=true,set=0)=>{
  listeners['window:message']({data:{
   type:'state',version:'0.7.7',options:[
    {id:'cs50p-0-indoor',title:'Indoor Voice',slug:'indoor',set:0},
    {id:'cs50p-5-test_fuel',title:'Testing Fuel',slug:'test_fuel',set:5}
   ],
   assignment:{id,title:id.includes('fuel')?'Testing Fuel':'Indoor Voice',slug:id.includes('fuel')?'test_fuel':'indoor',set,entryFile:id.includes('fuel')?'test_fuel.py':'indoor.py',description:'Practice'},
   folderExists:exists,entryExists:exists,guideExists:exists,progress:{},
   journalStatus:'saved',forceNotes:false,hint:0,hints:['Think'],
   learning:{understand:['Think'],steps:['Plan'],checks:['Normal test'],conceptVideo:null,stringToolkit:{methods:[],suggestion:null}},
   practice:{testedCount:0,subjects:[]}
  }});
 };
 const click=id=>{
  const e=get(id);
  assert.ok(e.dataset.action,'Expected button action for '+id);
  listeners.click({target:e});
 };
 const choose=(value)=>{
  get('testOutcome').value=value;
  get('testOutcome').listeners.change({target:get('testOutcome')});
 };
 const reply=data=>listeners['window:message']({data});
 return {get,send,click,choose,reply,messages,storage};
}

test('Test tab keeps prediction, observation, debugging notes and official tools',()=>{
 const section=ui.slice(ui.indexOf('<section id="panel-test"'),ui.indexOf('<section id="panel-submit"'));
 for(const id of ['prediction','observed','debugNotes','testOutcome','errorInput','errorAdvice',
  'testTerminalStatus','testCheckStatus','runPython','runCheck50','runStyle50','testIdeas'])assert.match(section,new RegExp('id="'+id+'"'));
 for(const action of ['run','check','style','explain','analyzeError'])assert.match(section,new RegExp('data-action="'+action+'"'));
 assert.match(section,/not an automatic grade/);
 assert.match(section,/not an assignment solution/);
 assert.match(css,/\.test-next/);
 assert.match(css,/\.test-advice/);
 assert.doesNotMatch(section,/<iframe|autoplay/i);
});

test('new assignment cannot launch terminal and shows clear next action',()=>{
 const h=simulate();h.send('cs50p-0-indoor',false,0);
 assert.equal(h.get('runPython').disabled,true);
 assert.equal(h.get('runCheck50').disabled,true);
 assert.match(h.get('testTerminalStatus').textContent,/Create or locate/);
});

test('run action sends the terminal command but never claims Python passed',()=>{
 const h=simulate();h.send();
 assert.equal(h.get('testCommand').textContent,'python indoor.py');
 assert.equal(h.get('runPython').disabled,false);
 h.click('runPython');
 assert.equal(h.messages.at(-1).type,'run');
 assert.match(h.get('testTerminalStatus').textContent,/Opening/);
 h.reply({type:'testTerminalStatus',kind:'run',assignmentId:'cs50p-0-indoor',status:'opened'});
 assert.match(h.get('testTerminalStatus').textContent,/Command sent/);
 assert.doesNotMatch(h.get('testTerminalStatus').textContent,/passed|correct|success/i);
 h.choose('expected');
 assert.match(h.get('testNext').textContent,/You reported/);
 h.choose('different');
 assert.equal(h.get('debugHelp').open,true);
 assert.match(h.get('testNext').textContent,/Compare expected/);
 h.choose('error');
 assert.match(h.get('testNext').textContent,/Paste the last error/);
 h.click('runPython');
 assert.equal(h.get('testOutcome').value,'');
 assert.match(h.get('testNext').textContent,/not an automatic grade/);
});

test('pasted traceback is handled locally and stale replies are ignored',()=>{
 const h=simulate();h.send();h.choose('error');
 h.get('errorInput').value='File "indoor.py", line 3\nNameError: name "voice" is not defined';
 h.click('analyzeError');
 const msg=h.messages.at(-1);
 assert.equal(msg.type,'analyzeError');
 assert.equal(msg.assignmentId,'cs50p-0-indoor');
 assert.match(msg.errorText,/NameError/);
 h.reply({type:'testDebugAdvice',assignmentId:'cs50p-0-indoor',requestId:msg.requestId,ok:true,
   advice:explainTerminalError(msg.errorText)});
 assert.equal(h.get('debugTitle').textContent,'Unknown name');
 assert.match(h.get('debugLocation').textContent,/line 3/);
 h.reply({type:'testDebugAdvice',assignmentId:'cs50p-0-indoor',requestId:msg.requestId-1,ok:true,
   advice:{title:'Wrong reply',guidance:'bad',location:'',next:''}});
 assert.equal(h.get('debugTitle').textContent,'Unknown name');
 h.send('cs50p-5-test_fuel',true,5);
 assert.equal(h.get('errorInput').value,'');
 assert.equal(h.get('errorAdvice').hidden,true);
 h.reply({type:'testDebugAdvice',assignmentId:'cs50p-0-indoor',requestId:msg.requestId,ok:true,
   advice:{title:'Old assignment',guidance:'bad',location:'',next:''}});
 assert.equal(h.get('errorAdvice').hidden,true);
});

test('CS50P set 5 uses pytest; check50 and style50 remain separate',()=>{
 const h=simulate();h.send('cs50p-5-test_fuel',true,5);
 assert.equal(h.get('testCommand').textContent,'pytest test_fuel.py');
 assert.equal(h.get('runPython').textContent,'Run pytest');
 h.click('runCheck50');
 assert.equal(h.messages.at(-1).type,'check');
 h.reply({type:'testTerminalStatus',kind:'check',assignmentId:'cs50p-5-test_fuel',status:'opened'});
 assert.match(h.get('testCheckStatus').textContent,/Nothing was submitted/);
 h.click('runStyle50');assert.equal(h.messages.at(-1).type,'style');
 h.reply({type:'testTerminalStatus',kind:'style',assignmentId:'cs50p-5-test_fuel',status:'opened'});
 assert.match(h.get('testCheckStatus').textContent,/style50/);
});

test('backend launches terminal commands and reports launch—not test success',()=>{
 assert.match(backend,/const cmd=kind==='run'\?\(a\.set===5\?'pytest '\+entry:'python '\+entry\)/);
 assert.match(backend,/case 'run':case 'check':case 'style':await this\.term\(a,m\.type\);break/);
 assert.match(backend,/case 'analyzeError':/);
 assert.match(backend,/explainTerminalError\(m\.errorText\)/);
 assert.match(backend,/type:'testTerminalStatus',kind,assignmentId:a\.id,status/);
 assert.match(backend,/type:'testDebugAdvice'/);
 assert.match(backend,/case 'submit':/);
});
