'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const {list,get}=require('../src/core');

test('all 41 assignments provide light, unsolved Python scaffolds',()=>{
 const catalog=list();
 assert.equal(catalog.length,41);
 for(const item of catalog){
  const assignment=get(item.id);
  const pythonFiles=Object.entries(assignment.files).filter(([name])=>name.endsWith('.py'));
  assert.ok(pythonFiles.length>0,item.id+' has no Python file');
  for(const [filename,content] of pythonFiles){
   assert.match(content,/README\.md/,item.id+'/'+filename+' needs a link to the learning guide');
   assert.match(content,/# TODO:/,item.id+'/'+filename+' should leave work for the student');
   assert.doesNotMatch(content,/NotImplementedError|Move to Codespaces|Python Lab/,item.id+'/'+filename+' has unwanted text');
   const count=(content.match(/# TODO:/g)||[]).length;
   if(assignment.set<=3&&!filename.startsWith('test_'))
    assert.ok(count<=3,item.id+'/'+filename+' should have at most three TODOs');
  }
 }
});

test('Indoor Voice and Coke Machine have the approved minimal starter code',()=>{
 const indoor=get('cs50p-0-indoor').files['indoor.py'];
 assert.match(indoor,/message = input\("Say something: "\)/);
 assert.match(indoor,/# TODO: Change the message to lowercase/);
 assert.match(indoor,/# TODO: Display the result/);
 assert.doesNotMatch(indoor,/\.lower\(\)|print\(/);
 const coke=get('cs50p-2-coke').files['coke.py'];
 assert.match(coke,/amount_due = 50/);
 assert.match(coke,/# TODO: Repeat until enough money is inserted/);
 assert.match(coke,/# TODO: Accept valid coins and update the amount due/);
 assert.match(coke,/# TODO: Display the change owed/);
 assert.doesNotMatch(coke,/while |if |input\(/);
});

test('test problems retain source and test files with the required APIs',()=>{
 const fuel=get('cs50p-5-test_fuel');
 assert.ok(fuel.files['fuel.py'].includes('def convert(fraction):'));
 assert.ok(fuel.files['fuel.py'].includes('def gauge(percentage):'));
 assert.ok(fuel.files['test_fuel.py'].includes('import pytest'));
 assert.ok(fuel.files['test_fuel.py'].includes('from fuel import convert, gauge'));
 const jar=get('cs50p-8-jar');
 assert.match(jar.files['jar.py'],/class Jar:/);
 for(const signature of ['deposit(self, n)','withdraw(self, n)','__init__(self, capacity=12)'])
  assert.ok(jar.files['jar.py'].includes('def '+signature+':'));
 assert.ok(jar.files['test_jar.py'].includes('from jar import Jar'));
});

test('all student Python starter files have valid Python syntax',t=>{
 const scripts={};
 for(const item of list()){
  const a=get(item.id);
  for(const [name,code] of Object.entries(a.files)){
   if(name.endsWith('.py'))scripts[item.id+'/'+name]=code;
  }
 }
 const check="import ast,json,sys\nfiles=json.load(sys.stdin)\nfor name,code in files.items():\n try: ast.parse(code,filename=name)\n except SyntaxError as error:\n  print(f'{name}: {error}',file=sys.stderr)\n  sys.exit(1)\nprint(len(files))";
 const result=spawnSync('python3',['-c',check],{input:JSON.stringify(scripts),encoding:'utf8'});
 if(result.error&&result.error.code==='ENOENT'){t.diagnostic('Python 3 unavailable; syntax check skipped');return;}
 assert.equal(result.status,0,result.stderr||result.error?.message);
 assert.ok(Number(result.stdout.trim())>=41);
});


test('required interfaces match verified Harvard specifications and optional helpers stay optional',()=>{
 const cases=[
  ['cs50p-5-test_twttr','twttr.py',['def main():','def shorten(word):']],
  ['cs50p-5-test_fuel','fuel.py',['def convert(fraction):','def gauge(percentage):']],
  ['cs50p-4-professor','professor.py',['def get_level():','def generate_integer(level):']],
  ['cs50p-7-working','working.py',['def convert(s):']],
  ['cs50p-7-numb3rs','numb3rs.py',['def validate(ip):']],
  ['cs50p-8-jar','jar.py',['def deposit(self, n):','def withdraw(self, n):','def capacity(self):','def size(self):']]
 ];
 for(const [id,file,interfaces] of cases){
  const code=get(id).files[file];
  for(const signature of interfaces)assert.ok(code.includes(signature),id+' missing '+signature);
 }
 assert.doesNotMatch(get('cs50p-7-working').files['working.py'],/def convert_time\(/);
 assert.doesNotMatch(get('cs50p-4-game').files['game.py'],/def get_guess\(/);
 assert.match(get('cs50p-8-seasons').files['seasons.py'],/def main\(/);
 assert.match(get('cs50p-8-seasons').files['test_seasons.py'],/test_date_logic/);
 assert.doesNotMatch(get('cs50p-8-shirtificate').files['shirtificate.py'],/class PDF\(/);
});

test('all 41 Codespaces READMEs align with code and increasing independence',()=>{
 const {guideForCodespace}=require('../src/core');
 const bands=['guided','supported','targeted','independent'];
 for(const item of list()){
  const a=get(item.id),guide=guideForCodespace(a);
  assert.match(guide,/Harvard CS50P problem/);
  assert.match(guide,/README|The problem/);
  for(const file of Object.keys(a.files).filter(name=>name.endsWith('.py'))){
   assert.ok(guide.includes('`'+file+'`'),item.id+' guide missing '+file);
   assert.match(a.files[file],/Learning support: (guided|supported|targeted|independent)/);
   const expected=a.set<=1?bands[0]:a.set<=3?bands[1]:a.set<=5?bands[2]:bands[3];
   assert.ok(a.files[file].includes('Learning support: '+expected));
  }
  assert.match(guide,/official|Harvard/i);
  assert.doesNotMatch(guide,/Open .+ in Python Lab|Move to Codespaces/);
  if(Object.keys(a.files).some(name=>/^test_.*\.py$/.test(name)))
   assert.match(guide,/skipped test|A skipped test/);
 }
});
