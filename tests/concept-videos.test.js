'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {list,get}=require('../src/core');
const {TOPICS,ASSIGNMENT_TOPICS,conceptVideoForAssignment}=require('../src/concept-videos');

test('all 41 CS50P assignments have a topic-matched official concept lesson',()=>{
 const catalog=list();
 assert.equal(catalog.length,41);
 assert.equal(Object.keys(ASSIGNMENT_TOPICS).length,41);
 for(const item of catalog){
  const resource=conceptVideoForAssignment(get(item.id));
  assert.ok(resource,item.id+' is missing its video');
  assert.match(resource.url,/^https:\/\/cs50\.harvard\.edu\/python\/shorts\/[a-z_]+\/$/);
  assert.ok(resource.title.length>2,item.id+' needs a topic title');
  assert.ok(resource.focus.length>15,item.id+' needs a concept description');
  assert.ok(resource.question.endsWith('?'),item.id+' needs a planning question');
  assert.ok(!/problem set|walkthrough|solution|answer key/i.test(resource.title+' '+resource.focus),item.id+' reveals a solution');
 }
 for(const id of Object.keys(ASSIGNMENT_TOPICS))assert.ok(catalog.some(a=>a.id===id),id+' not in catalog');
});

test('common problems show the appropriate concept, not assignment solution videos',()=>{
 const cases={
  'cs50p-0-indoor':'String Methods',
  'cs50p-0-faces':'Functions',
  'cs50p-2-coke':'While Loops',
  'cs50p-3-fuel':'Handling Exceptions',
  'cs50p-5-test_fuel':'pytest',
  'cs50p-6-pizza':'Reading and Writing CSVs',
  'cs50p-6-shirt':'Pillow',
  'cs50p-7-watch':'Capture Groups',
  'cs50p-8-jar':'Classes'
 };
 for(const [id,title] of Object.entries(cases)){
  assert.equal(conceptVideoForAssignment(id).title,title,id);
 }
 assert.equal(conceptVideoForAssignment('unknown'),null);
});

test('every topic has an official static Harvard page and clear reflection',()=>{
 for(const [key,topic] of Object.entries(TOPICS)){
  assert.match(key,/^[a-z_]+$/);
  assert.match(topic.slug,/^[a-z_]+$/);
  assert.equal(typeof topic.title,'string');
  assert.ok(topic.focus.length>0);
  assert.ok(topic.question.length>0);
 }
});
