'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const cp=require('node:child_process');
test('clean CS50 wrapper excludes the journal from check50 and submit50 copies',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'gci-journal-test-'));
 try{
  const dir=path.join(temp,'indoor'),bin=path.join(temp,'bin');
  fs.mkdirSync(dir);fs.mkdirSync(bin);
  fs.writeFileSync(path.join(dir,'indoor.py'),'print("student code")\n');
  fs.writeFileSync(path.join(dir,'LEARNING_JOURNAL.md'),'my PRIVATE notes\n');
  fs.writeFileSync(path.join(dir,'required.csv'),'name,value\n');
  fs.writeFileSync(path.join(dir,'README.md'),'generated guide\n');
  fs.writeFileSync(path.join(dir,'README.backup-1.md'),'old guide\n');
  for(const command of ['check50','submit50']){
   const executable=path.join(bin,command);
   fs.writeFileSync(executable,'#!/usr/bin/env bash\nset -eu\n'+
    'test -f indoor.py\n'+
    'test -f required.csv\n'+
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
  assert.equal(fs.readFileSync(path.join(dir,'LEARNING_JOURNAL.md'),'utf8'),'my PRIVATE notes\n');
  assert.ok(fs.existsSync(path.join(dir,'README.md')));
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
