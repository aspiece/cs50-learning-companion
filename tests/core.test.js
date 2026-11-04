'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const c=require('../src/core');
test('all 41 Python Lab assignments load and have safe paths',()=>{
 const all=c.list();assert.equal(all.length,41);
 assert.equal(new Set(all.map(x=>x.id)).size,41);
 for(const p of all){const a=c.safeAssignment(c.get(p.id));assert.ok(a.files[a.entryFile]);assert.ok(a.files['README.md']);}
});
test('CS50P command slugs including problem set 5',()=>{
 assert.equal(c.submissionPath(c.get('cs50p-0-indoor')),'cs50/problems/2022/python/indoor');
 assert.equal(c.submissionPath(c.get('cs50p-5-test_fuel')),'cs50/problems/2022/python/tests/fuel');
});
test('no completed answer placeholders',()=>assert.doesNotMatch(c.get('cs50p-0-indoor').files['indoor.py'],/NotImplementedError/));
test('view declares webview provider type',()=>{
 const p=require('../package.json');
 assert.equal(p.contributes.views.cs50Companion[0].type,'webview');
});
