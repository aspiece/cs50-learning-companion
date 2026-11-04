'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {list,get,guideForCodespace,submissionPath}=require('../src/core');

const HEADINGS=[
 '## Your Goal',
 '## Build It',
 '## Test It',
 '## Check It',
 '## Submit'
];

test('all 41 generated READMEs use the approved five-section format',()=>{
 const assignments=list();
 assert.equal(assignments.length,41);
 for(const item of assignments){
  const a=get(item.id),readme=guideForCodespace(a);
  assert.deepEqual(readme.match(/^## .+$/gm),HEADINGS,item.id+' has the wrong sections');
  const wordCount=readme.trim().split(/\s+/).length;
  assert.ok(wordCount<=300,item.id+' README has '+wordCount+' words');
  assert.ok(readme.includes(a.url),item.id+' needs Harvard link');
  assert.ok(readme.includes('check50 '+submissionPath(a)),item.id+' needs checker');
  assert.ok(readme.includes('submit50 '+submissionPath(a)),item.id+' needs submission command');
  assert.match(readme,/^1\. .+/m,item.id+' needs numbered build steps');
  assert.match(readme,/^- .+/m,item.id+' needs test ideas');
  assert.match(readme,/Only send the files Harvard requests/,item.id+' needs submission warning');
  assert.match(readme,/Learning Journal/,item.id+' needs journal warning');
  assert.doesNotMatch(readme,/## Move your code to CS50 Codespaces|## Extra files and useful terms|## Words to know|Python Lab|Download File/i,item.id+' has obsolete directions');
  for(const file of Object.keys(a.files).filter(name=>name.endsWith('.py')))
   assert.ok(readme.includes(file),item.id+' missing '+file);
 }
});

test('Indoor Voice README matches approved short guide',()=>{
 const guide=guideForCodespace(get('cs50p-0-indoor'));
 assert.match(guide,/string method that changes uppercase letters to lowercase/);
 assert.match(guide,/Do you need a new variable/);
 for(const value of ['HELLO','Hello, WORLD!','Python 123'])assert.ok(guide.includes(value));
 assert.ok(guide.includes('python indoor.py'));
});

test('Coke Machine README includes approved six steps and edge-case tests',()=>{
 const guide=guideForCodespace(get('cs50p-2-coke'));
 assert.ok(guide.includes('6. **Show the change.**'));
 assert.match(guide,/invalid coin/);
 assert.match(guide,/Paying more than the cost/);
 assert.ok(guide.includes('python coke.py'));
});

test('test assignments list all Python files and use pytest',()=>{
 const a=get('cs50p-5-test_fuel'),guide=guideForCodespace(a);
 assert.ok(guide.includes('fuel.py'));
 assert.ok(guide.includes('test_fuel.py'));
 assert.ok(guide.includes('pytest test_fuel.py'));
 assert.ok(guide.includes('tests/fuel'));
});

test('file-dependent assignments provide concrete Harvard assets',()=>{
 for(const id of ['cs50p-6-pizza','cs50p-6-scourgify','cs50p-6-shirt','cs50p-8-shirtificate']){
  const a=get(id),guide=guideForCodespace(a);
  assert.match(guide,/\*\*Needed files:\*\*/,id);
  for(const file of a.extraFiles){
   assert.ok(guide.includes(file.name),id+' needs file '+file.name);
   assert.ok(guide.includes(file.url),id+' needs download link for '+file.name);
  }
 }
});
