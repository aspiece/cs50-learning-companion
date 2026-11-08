'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {list,get,guideForCodespace,CS50_GRADEBOOK}=require('../src/core');
const {codehsLessonForAssignment,LESSONS}=require('../src/codehs-lessons');

const ui=fs.readFileSync(path.join(__dirname,'../src/ui.js'),'utf8');
const backend=fs.readFileSync(path.join(__dirname,'../src/extension.js'),'utf8');

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

test('sidebar keeps the assignment workflow and removes unrelated panels',()=>{
 for(const tab of ['start','test','submit'])assert.match(ui,new RegExp('id="panel-'+tab+'"'));
 assert.doesNotMatch(ui,/panel-learn|goLearn|learnResources|submitReflection|data-field=/);
 for(const verb of ['guide','toggleCoach','updateGuide','run','check','style','submit','cs50Status']){
  assert.ok(ui.includes('data-action="'+verb+'"'),'lost '+verb);
 }
});

test('Gradebook navigation stays external; private grades are never retrieved',()=>{
 assert.match(backend,/case 'cs50Status'/);
 assert.match(backend,/CS50_GRADEBOOK/);
 assert.match(backend,/vscode\.env\.openExternal\(vscode\.Uri\.parse\(CS50_GRADEBOOK\)\)/);
 assert.doesNotMatch(backend,/fetch\(CS50_GRADEBOOK\)|axios\.get\(CS50_GRADEBOOK\)/);
});


test('expandable sections balance correctly and cannot hide Submit or gradebook',()=>{
 let depth=0;
 for(const token of ui.matchAll(/<details\b[^>]*>|<\/details>/g)){
  if(token[0].startsWith('<details'))depth++;
  else depth--;
  assert.ok(depth>=0,'extra closing details element');
 }
 assert.equal(depth,0,'unclosed optional section could hide critical buttons');
 const area=ui.slice(ui.indexOf('id="panel-submit"'),ui.indexOf('</section>',ui.indexOf('id="panel-submit"')));
 const details=area.indexOf('<details');
 const submit=area.indexOf('data-action="submit"');
 const gradebook=area.indexOf('data-action="cs50Status"');
 assert.ok(submit>=0&&submit<gradebook&&gradebook<details,'Submit and gradebook must be visible above optional details');
});
