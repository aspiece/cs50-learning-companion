'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const cp=require('node:child_process');
const {list,get}=require('../src/core');
const {FILENAME,SIGNATURE,FIELD_NAMES,createJournal,parseJournal,updateJournal}=require('../src/journal');

test('journals have a readable section for each learning field across 41 CS50P problems',()=>{
 assert.equal(list().length,41);
 for(const item of list()){
  const a=get(item.id),file=createJournal(a,{plan:'Try small steps',reflection:'My own learning'});
  assert.equal(FILENAME,'LEARNING_JOURNAL.md');
  assert.ok(file.includes(SIGNATURE));
  assert.ok(file.includes(a.title));
  assert.match(file,/Do not submit this file to CS50/);
  const values=parseJournal(file);
  assert.equal(values.plan,'Try small steps');
  assert.equal(values.reflection,'My own learning');
  assert.equal(values.support,'standard');
  for(const field of FIELD_NAMES)assert.ok(Object.hasOwn(values,field),a.id+': '+field);
 }
});
test('journal updates keep other sections and student writing intact',()=>{
 const a=get('cs50p-0-indoor');
 let file=createJournal(a,{inputNotes:'some input',plan:'First\nThen',reflection:'Finished'});
 file+='## Other notes I added myself\n\nDo not delete these notes.\n';
 file=updateJournal(file,'plan','New plan\nWith a second line');
 const result=parseJournal(file);
 assert.equal(result.inputNotes,'some input');
 assert.equal(result.plan,'New plan\nWith a second line');
 assert.equal(result.reflection,'Finished');
 assert.ok(file.includes('Do not delete these notes.'));
 assert.equal(file.split('<!-- GCI:plan:start -->').length,2);
});
test('existing unrelated files are never overwritten by journal patching',()=>{
 assert.equal(parseJournal('My personal notes'),null);
 assert.throws(()=>updateJournal('My personal notes','plan','oops'),/not a GCI learning journal/);
 assert.throws(()=>updateJournal(createJournal(get('cs50p-0-indoor')),'unknown','oops'),/Unknown journal field/);
});
test('clean CS50 wrapper excludes the journal from check50 and submit50 copies',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'gci-journal-test-'));
 try{
  const dir=path.join(temp,'indoor'),bin=path.join(temp,'bin');
  fs.mkdirSync(dir);fs.mkdirSync(bin);
  fs.writeFileSync(path.join(dir,'indoor.py'),'print("student code")\n');
  fs.writeFileSync(path.join(dir,FILENAME),'my PRIVATE notes\n');
  fs.writeFileSync(path.join(dir,'README.md'),'generated guide\n');
  fs.writeFileSync(path.join(dir,'README.backup-1.md'),'old guide\n');
  for(const command of ['check50','submit50']){
   const executable=path.join(bin,command);
   fs.writeFileSync(executable,'#!/usr/bin/env bash\nset -eu\n'+
    'test -f indoor.py\n'+
    'test ! -e LEARNING_JOURNAL.md\n'+
    'test ! -e README.md\n'+
    'test ! -e README.backup-1.md\n'+
    'test "$1" = "cs50/problems/2022/python/indoor"\n'+
    'echo "clean copy passed"\n');
   fs.chmodSync(executable,0o755);
   const result=cp.spawnSync('bash',[path.join(__dirname,'../src/clean-cs50-command.sh'),command,'cs50/problems/2022/python/indoor'],{
    cwd:dir,env:{...process.env,PATH:bin+path.delimiter+process.env.PATH},encoding:'utf8'
   });
   assert.equal(result.status,0,result.stderr+'\n'+result.stdout);
   assert.match(result.stdout,/clean copy passed/);
  }
  assert.equal(fs.readFileSync(path.join(dir,FILENAME),'utf8'),'my PRIVATE notes\n');
  assert.ok(fs.existsSync(path.join(dir,'README.md')));
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
