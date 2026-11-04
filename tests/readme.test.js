'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {list,get,guideForCodespace,submissionPath}=require('../src/core');

test('all 41 generated READMEs match Start Learn Test Submit instructional process',()=>{
 const assignments=list();
 assert.equal(assignments.length,41);
 for(const problem of assignments){
  const a=get(problem.id);
  const readme=guideForCodespace(a);
  const headings=[
   '## Start — Understand the assignment',
   '## Learn — Understand, Plan, Get Unstuck',
   '## Test — Predict, Run, Debug',
   '## Submit — Check, Reflect, Send'
  ];
  let last=-1;
  for(const heading of headings){
   const index=readme.indexOf(heading);
   assert.ok(index>last,problem.id+' missing or misordered '+heading);
   last=index;
  }
  assert.ok(readme.includes(a.url),problem.id+' missing official link');
  assert.ok(readme.includes('check50 '+submissionPath(a)),problem.id+' missing test command');
  assert.ok(readme.includes('submit50 '+submissionPath(a)),problem.id+' missing submit command');
  assert.ok(readme.includes('python '+a.entryFile),problem.id+' missing run command');
  for(const file of Object.keys(a.files).filter(x=>x.endsWith('.py'))){
   assert.ok(readme.includes(file),problem.id+' missing dependency '+file);
  }
  assert.doesNotMatch(readme,/## Move your code to CS50 Codespaces|right-click each code file|Python Lab|Move any files your code reads|bring them to Codespaces/i,problem.id+' contains obsolete handoff steps');
  assert.ok(readme.includes('The companion checklist cannot verify your submission.'),problem.id+' missing integrity notice');
  assert.ok(readme.length>800,problem.id+' incomplete student guidance');
 }
});
test('unit test assignments list source and test files',()=>{
 const a=get('cs50p-5-test_fuel');
 const guide=guideForCodespace(a);
 assert.ok(guide.includes('fuel.py'));
 assert.ok(guide.includes('test_fuel.py'));
 assert.ok(guide.includes('tests/fuel'));
});
test('special file instructions survive the new format',()=>{
 for(const id of ['cs50p-6-pizza','cs50p-6-scourgify','cs50p-6-shirt','cs50p-8-shirtificate']){
  const a=get(id),guide=guideForCodespace(a);
  assert.ok(guide.includes('## Extra files and useful terms'));
  assert.ok(/csv|png|zip/i.test(guide),id+' needs file notes');
 }
});
