'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {list,get}=require('../src/core');
const {
 METHODS,CATEGORIES,SUGGESTED_GROUPS,LESSON_URL,DOCS_URL,
 toolkitForAssignment,validatePracticeRequest,practiceSnippet
}=require('../src/string-methods');
const {runStringPractice}=require('../src/string-practice');

const example=(method,text,args=[])=>({method,text,args});

test('string reference covers sixteen documented methods with correct short examples',()=>{
 assert.deepEqual(METHODS.map(x=>x.id),
  ['lower','upper','capitalize','title','strip','lstrip','rstrip','replace','split','startswith','endswith','isupper','isalpha','isalnum','isdigit','isdecimal']);
 assert.equal(new Set(METHODS.map(x=>x.id)).size,16);
 for(const item of METHODS){
  assert.ok(item.label.startsWith('.'),item.id+' must look like a Python method');
  assert.ok(item.purpose.length>8);
  assert.ok(item.example.length>4);
  assert.ok(item.result.length>0);
  assert.ok(CATEGORIES[item.category]);
 }
 assert.equal(LESSON_URL,'https://cs50.harvard.edu/python/shorts/string_methods/');
 assert.match(DOCS_URL,/docs\.python\.org\/3\/library\/stdtypes\.html#string-methods/);
});

test('toolkit is available to all 41 assignments and suggests a method family, not an answer',()=>{
 for(const item of list()){
  const toolkit=toolkitForAssignment(get(item.id));
  assert.equal(toolkit.methods.length,16);
  if(toolkit.suggestion){
   assert.ok(CATEGORIES[toolkit.suggestion.category]);
   assert.match(toolkit.suggestion.description,/Explore methods/);
   assert.ok(toolkit.methods.filter(m=>m.category===toolkit.suggestion.category).length>=1);
  }
 }
 assert.equal(toolkitForAssignment('cs50p-0-indoor').suggestion.category,'change');
 assert.equal(toolkitForAssignment('cs50p-1-extensions').suggestion.category,'check');
 assert.equal(toolkitForAssignment('cs50p-1-interpreter').suggestion.category,'parts');
 assert.equal(toolkitForAssignment('cs50p-8-jar').suggestion,null);
 assert.ok(Object.keys(SUGGESTED_GROUPS).every(id=>list().some(a=>a.id===id)));
});

test('practice input validation blocks unlisted methods, missing arguments and excess text',()=>{
 assert.deepEqual(validatePracticeRequest(example('lower','ABC')),example('lower','ABC'));
 assert.throws(()=>validatePracticeRequest(example('eval','print(1)')), /sixteen string methods/);
 assert.throws(()=>validatePracticeRequest(example('lower','A'.repeat(201))), /at most 200/);
 assert.throws(()=>validatePracticeRequest(example('startswith','hello',[''])), /required method option/);
 assert.throws(()=>validatePracticeRequest(example('replace','hello',['hi'])), /Check the practice/);
 assert.throws(()=>validatePracticeRequest(example('replace','hello',['','bye'])), /required method option/);
 assert.throws(()=>validatePracticeRequest(example('upper','hi',['extra'])), /Check the practice/);
});

test('copied snippets are fixed Python string calls and cannot become Python instructions',()=>{
 assert.equal(practiceSnippet(example('lower','HELLO')),'print("HELLO".lower())');
 assert.equal(practiceSnippet(example('replace','red bike',['red','blue'])),
  'print("red bike".replace("red", "blue"))');
 assert.equal(practiceSnippet(example('split','one two',[''])),
  'print("one two".split())');
 assert.equal(practiceSnippet(example('lstrip','  line  ',[''])),
  'print("  line  ".lstrip())');
 assert.equal(practiceSnippet(example('rstrip','cost%', ['%'])),
  'print("cost%".rstrip("%"))');
 const attack='hello");__import__("os").system("exit 1");print("';
 const snippet=practiceSnippet(example('upper',attack));
 assert.ok(snippet.startsWith('print("'));
 assert.ok(snippet.includes('\\"'));
 assert.equal(snippet.endsWith('.upper())'),true);
});

test('real Python runs all sixteen examples without changing student code',async()=>{
 const requests=[
  [example('lower','Good Morning'),"'good morning'"],
  [example('upper','good night'),"'GOOD NIGHT'"],
  [example('strip','  garden  '),"'garden'"],
  [example('lstrip','$$balance',['$']),"'balance'"],
  [example('rstrip','discount%%%',['%']),"'discount'"],
  [example('capitalize','hELLO WORLD'),"'Hello world'"],
  [example('title','blue sky'),"'Blue Sky'"],
  [example('replace','red bike',['red','blue']),"'blue bike'"],
  [example('split','red blue',['']),"['red', 'blue']"],
  [example('startswith','Python',['Py']),'True'],
  [example('endswith','picture.png',['.png']),'True'],
  [example('isdigit','2048'),'True'],
  [example('isdecimal','123'),'True'],
  [example('isupper','NASA'),'True'],
  [example('isalpha','Robotics'),'True'],
  [example('isalnum','Team2137'),'True']
 ];
 for(const [request,expected] of requests){
  const result=await runStringPractice(request);
  assert.equal(result.value,expected,request.method);
  assert.ok(['str','list','bool'].includes(result.kind));
 }
 assert.equal((await runStringPractice(example('split','a,b,c',[',']))).value,"['a', 'b', 'c']");
 assert.equal((await runStringPractice(example('isdigit','12a'))).value,'False');
 assert.equal((await runStringPractice(example('lstrip','  left  ',['']))).value,"'left  '");
 assert.equal((await runStringPractice(example('rstrip','  right  ',['']))).value,"'  right'");
 assert.equal((await runStringPractice(example('isdigit','²'))).value,'True');
 assert.equal((await runStringPractice(example('isdecimal','²'))).value,'False');
 assert.equal((await runStringPractice(example('isupper','123'))).value,'False');
 assert.equal((await runStringPractice(example('isalpha','two words'))).value,'False');
 assert.equal((await runStringPractice(example('isalnum','ABC 123'))).value,'False');
});

test('Learn tab shows searchable methods, optional practice and resources at all support levels',()=>{
 const ui=fs.readFileSync(path.join(__dirname,'../src/ui.js'),'utf8');
 const js=fs.readFileSync(path.join(__dirname,'../media/sidebar.js'),'utf8');
 const css=fs.readFileSync(path.join(__dirname,'../media/sidebar.css'),'utf8');
 const ext=fs.readFileSync(path.join(__dirname,'../src/extension.js'),'utf8');
 assert.match(ui,/id="stringToolkit"/);
 assert.match(ui,/id="stringSearch"/);
 assert.match(ui,/id="stringCategory"/);
 assert.match(js,/stringCategory==='all'/);
 assert.match(js,/method\.tip/);
 assert.match(ui,/id="stringMethodList"/);
 assert.match(ui,/data-action="practiceString"/);
 assert.match(ui,/data-action="copyStringPractice"/);
 assert.match(ui,/data-action="stringMethodsVideo"/);
 assert.match(ui,/data-action="stringMethodsDocs"/);
 const openToolkit=ui.indexOf('id="stringToolkit"');
 const guided=ui.indexOf('id="guidedQuestions"');
 assert.ok(openToolkit>ui.indexOf('id="support"')&&openToolkit<guided,'resource must be outside help-level cards');
 assert.match(js,/renderStringToolkit\(\)/);
 assert.match(js,/filter\(method=>/);
 assert.match(js,/escapeHtml\(method\.example\)/);
 assert.match(js,/data-select-string/);
 assert.match(js,/stringPracticeResult/);
 assert.match(css,/\.toolkit/);
 assert.match(ext,/stringToolkit:toolkitForAssignment\(a\)/);
 assert.match(ext,/runStringPractice\(request\)/);
 assert.match(ext,/vscode\.env\.clipboard\.writeText\(sample\)/);
});

test('practice panel does not add learning journal fields or change CS50 submissions',()=>{
 const client=fs.readFileSync(path.join(__dirname,'../media/sidebar.js'),'utf8');
 const service=fs.readFileSync(path.join(__dirname,'../src/string-practice.js'),'utf8');
 const python=fs.readFileSync(path.join(__dirname,'../src/string-practice.py'),'utf8');
 assert.match(client,/const fields=\['support','inputNotes','outputNotes','plan'/);
 assert.match(service,/spawn\(python,\['-I','-B',script\]/);
 assert.match(service,/validatePracticeRequest/);
 assert.doesNotMatch(python,/eval\(|exec\(|import os|open\(/);
 assert.doesNotMatch(service,/shell:\s*true/);
});
