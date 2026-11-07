'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {list,get,guideForCodespace,CS50_GRADEBOOK}=require('../src/core');
const {codehsLessonForAssignment,LESSONS}=require('../src/codehs-lessons');

const ui=fs.readFileSync(path.join(__dirname,'../src/ui.js'),'utf8');
const client=fs.readFileSync(path.join(__dirname,'../media/sidebar.js'),'utf8');
const backend=fs.readFileSync(path.join(__dirname,'../src/extension.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../media/sidebar.css'),'utf8');

test('every matched CodeHS resource goes to a real topic lesson, without guessed paths',()=>{
 const problems=list();
 const links=problems.map(a=>({a,lesson:codehsLessonForAssignment(a)}));
 assert.equal(problems.length,41);
 assert.ok(links.filter(x=>x.lesson).length>=18);
 for(const {a,lesson} of links){
  if(!lesson)continue;
  assert.ok(lesson.title.length>3,a.id);
  assert.match(lesson.url,/^https:\/\/codehs\.com\/course\/(?:5657|21076)\/(?:explore\/module\/\d+\/lesson\/\d+|module\/\d+)$/);
  assert.ok(lesson.source.startsWith('CodeHS '));
 }
 assert.match(codehsLessonForAssignment('cs50p-0-indoor').url,/5657\/explore\/module\/7892\/lesson\/1404727$/);
 assert.match(codehsLessonForAssignment('cs50p-1-bank').url,/5657\/explore\/module\/7889\/lesson\/1404573$/);
 assert.match(codehsLessonForAssignment('cs50p-3-grocery').url,/5657\/explore\/module\/7894\/lesson\/9562205$/);
 assert.match(codehsLessonForAssignment('cs50p-6-lines').url,/21076\/explore\/module\/29325\/lesson\/9551211$/);
 assert.equal(codehsLessonForAssignment('cs50p-7-numb3rs'),null,'No invented regular expressions lesson');
 assert.equal(codehsLessonForAssignment('unknown-id'),null);
 assert.equal(CS50_GRADEBOOK,'https://cs50.me/cs50p');
});

test('README contains standalone problem, steps, tests and CS50 support links for all problems',()=>{
 for(const info of list()){
  const assignment=get(info.id),guide=guideForCodespace(assignment);
  assert.match(guide,/## The problem/);
  assert.match(guide,/## Test your program/);
  assert.match(guide,/## Need help\? \(optional\)/);
  assert.match(guide,/## Check and submit/);
  assert.match(guide,/^\*\*Your task:\*\*$/m);
  assert.match(guide,/^1\. /m);
  assert.match(guide,/^- /m);
  assert.match(guide,/Harvard.s page has the exact rules and special cases/i);
  assert.match(guide,/https:\/\/cs50\.me\/cs50p/);
  assert.match(guide,/CS50P license \(CC BY-NC-SA 4\.0\)/);
  assert.ok(guide.includes(assignment.url),info.id);
  assert.match(guide,/CS50P short:/);
  const lesson=codehsLessonForAssignment(info.id);
  if(lesson) assert.ok(guide.includes(lesson.url),info.id+' CodeHS link missing');
  else assert.doesNotMatch(guide,/CodeHS: /,info.id+' invented CodeHS lesson');
  assert.doesNotMatch(guide,/raise NotImplementedError|YOUR SOLUTION HERE|Answer key/i);
 }
});

test('student sidebar hides optional noise but leaves actions and tabs intact',()=>{
 for(const name of ['assignmentFilters','learnResources','progressDetails',
  'testReviewDetails','submitReflection'])
  assert.match(ui,new RegExp('<details[^>]*id="'+name+'"'));
 for(const name of ['openCodehsLesson','codehsSupport','codehsCourseNote','cs50Status'])
  assert.match(ui,new RegExp('id="'+name+'"'));
 assert.match(ui,/data-action="openCodehsLesson"/);
 assert.match(ui,/data-action="cs50Status"/);
 assert.match(ui,/Check my CS50P submission status/);
 assert.match(client,/renderCodehsLesson/);
 assert.ok(client.includes("$('codehsSupport').hidden=!lesson"));
 assert.ok(css.includes('.quiet-details'));
 for(const tab of ['start','learn','test','submit'])assert.match(ui,new RegExp('id="panel-'+tab+'"'));
 for(const verb of ['openFiles','openJournal','editJournal','updateGuide','run','check','style','submit']){
  assert.ok(ui.includes('data-action="'+verb+'"'),'lost '+verb);
 }
});

test('CodeHS and gradebook navigation stays external; private grades are never retrieved',()=>{
 assert.match(backend,/case 'openCodehsLesson'/);
 assert.match(backend,/case 'cs50Status'/);
 assert.match(backend,/codehsLessonForAssignment\(a\)/);
 assert.match(backend,/CS50_GRADEBOOK/);
 assert.match(backend,/vscode\.env\.openExternal\(vscode\.Uri\.parse\(lesson\.url\)\)/);
 assert.match(backend,/vscode\.env\.openExternal\(vscode\.Uri\.parse\(CS50_GRADEBOOK\)\)/);
 assert.doesNotMatch(backend,/fetch\(CS50_GRADEBOOK\)|axios\.get\(CS50_GRADEBOOK\)/);
});
