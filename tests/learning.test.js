'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {list,get,teachingGuide}=require('../src/core');
test('every CS50P assignment has learning prompts and safe conceptual hints',()=>{
 assert.equal(list().length,41);
 for(const p of list()){
  const guide=teachingGuide(get(p.id));
  assert.ok(guide.understand.length>=2,p.id);
  assert.ok(guide.steps.length>=1,p.id);
  assert.equal(guide.hints.length,3,p.id);
  assert.ok(typeof guide.concept==='string');
  assert.ok(guide.hints.every(h=>!h.includes('submit50 ')));
 }
});
test('early assignments have assignment-specific guidance',()=>{
 const a=teachingGuide(get('cs50p-0-indoor'));
 const b=teachingGuide(get('cs50p-0-faces'));
 assert.notDeepEqual(a.hints,b.hints);
});
