'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {list,get,teachingGuide}=require('../src/core');
const {coachClues,nextActions}=require('../src/coach-model');
const {explainTerminalError}=require('../src/debugging');
const extension=fs.readFileSync(path.join(__dirname,'../src/extension.js'),'utf8');
const ui=fs.readFileSync(path.join(__dirname,'../src/ui.js'),'utf8');
const sidebar=fs.readFileSync(path.join(__dirname,'../media/sidebar.js'),'utf8');

test('all 41 assignments have short, solution-free clues for three needs',()=>{
 assert.equal(list().length,41);
 for(const item of list()){
  const a=get(item.id),learning=teachingGuide(a);
  for(const reason of ['understand','coding','debug']){
   const clues=coachClues(a,learning,reason);
   assert.equal(clues.length,3,item.id+' '+reason);
   assert.ok(clues.every(t=>typeof t==='string'&&t.length>15&&t.length<260));
   assert.doesNotMatch(clues.join(' '),/submit50 |solution\s*=\s*|NotImplementedError|answer key/i);
  }
 }
 assert.deepEqual(coachClues({}, {},'unknown'),[]);
});

test('three next steps reflect file state and self-reports without grading',()=>{
 const cases=[
  [{folderExists:false},'Create the assignment folder'],
  [{folderExists:true,entryExists:false},'Inspect the existing folder'],
  [{folderExists:true,entryExists:true,guideExists:false},'missing README'],
  [{folderExists:true,entryExists:true,guideExists:true,progress:{}},'Write or revise'],
  [{folderExists:true,entryExists:true,guideExists:true,progress:{tested:true}},'Run check50'],
  [{folderExists:true,entryExists:true,guideExists:true,progress:{checked:true}},'actual check50 output'],
  [{folderExists:true,entryExists:true,guideExists:true,progress:{submitted:true}},'gradebook']
 ];
 for(const [state,expected] of cases){
  const items=nextActions(state);
  assert.equal(items.length,3);
  assert.ok(items.every(t=>typeof t==='string'&&t.length>10));
  assert.ok(items.some(t=>t.includes(expected)),expected);
  assert.doesNotMatch(items.join(' '),/passed|score of 100|grade confirmed|auto-graded/i);
 }
});

test('Python errors and pytest failures explain a next step without code changes',()=>{
 const python=explainTerminalError('Traceback:\n  File "indoor.py", line 7\nNameError: name "s" is not defined');
 assert.equal(python.category,'python');
 assert.equal(python.title,'Unknown name');
 assert.match(python.location,/line 7/);
 assert.equal(python.verified,false);
 const pytest=explainTerminalError('FAILED test_fuel.py::test_valid\nE assert "E" == "F"');
 assert.equal(pytest.category,'pytest');
 assert.match(pytest.guidance,/expected value/);
 assert.equal(pytest.verified,false);
 assert.throws(()=>explainTerminalError('x'.repeat(6001)),/6,000/);
});

test('check50 mismatch, prompts, timeouts and skips have distinct clues',()=>{
 const examples=[
  [':( greeting\nexpected "Hello", saw "hello"','The actual output did not match',/capitalization/],
  [':( missing input prompt\nexpected prompt','Check how your program asks for input',/prompt/],
  [':( loop test\ntimed out','Your program may not be stopping',/loop/],
  [':| skipped after earlier failure','A check was skipped',/earlier/],
  [':) passing example','Some checks appear to have passed',/full check50/]
 ];
 for(const [source,title,guidance] of examples){
  const result=explainTerminalError(source);
  assert.equal(result.category,'check50');
  assert.equal(result.title,title);
  assert.match(result.guidance,guidance);
  assert.equal(result.verified,false);
  assert.match(result.next,/run it again/i);
 }
});

test('text is read only for explicit clipboard or editor-selection actions',()=>{
 assert.match(extension,/case 'useClipboardDebug':case 'useSelectedDebug':/);
 assert.match(extension,/vscode\.env\.clipboard\.readText\(\)/);
 assert.match(extension,/editor\.document\.getText\(editor\.selection\)/);
 assert.match(extension,/content\.length>6000/);
 assert.match(sidebar,/lastClipboardRequestId/);
 assert.match(sidebar,/e\.data\?\.type==='debugText'/);
 assert.match(ui,/data-action="useClipboardDebug"/);
 assert.match(ui,/data-action="useSelectedDebug"/);
});

test('coaching stays in Start and Debug, with no new tab or forced documentation',()=>{
 const start=ui.slice(ui.indexOf('id="panel-start"'),ui.indexOf('id="panel-learn"'));
 const testUI=ui.slice(ui.indexOf('id="panel-test"'),ui.indexOf('id="panel-submit"'));
 for(const id of ['coachToggle','coachPanel','coachUnderstand','coachCoding',
  'coachError','coachClueBox','coachNext','coachDebug','nextStepsList'])
  assert.ok(start.includes('id="'+id+'"'),id);
 assert.match(start,/aria-expanded="false"/);
 assert.match(testUI,/id="errorAdvice"/);
 assert.equal((ui.match(/role="tab"/g)||[]).length,4);
});
