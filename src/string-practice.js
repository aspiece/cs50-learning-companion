'use strict';
const path=require('node:path');
const {spawn}=require('node:child_process');
const {validatePracticeRequest}=require('./string-methods');

// Uses Python already installed in CS50 Codespaces. Only fixed whitelisted
// operations run, with JSON passed over stdin (never shell commands or eval).
function runStringPractice(request,{python='python3',script=path.join(__dirname,'string-practice.py')}={}){
 const input=validatePracticeRequest(request);
 return new Promise((resolve,reject)=>{
  let settled=false,stdout='',stderr='',child;
  const finish=(error,result)=>{
   if(settled)return;
   settled=true;clearTimeout(deadline);
   if(error)reject(error);else resolve(result);
  };
  try{
   child=spawn(python,['-I','-B',script],{stdio:['pipe','pipe','pipe']});
  }catch(error){
   return reject(new Error('Python is unavailable in this Codespace.'));
  }
  const deadline=setTimeout(()=>{
   child.kill();
   finish(new Error('Practice took too long. Please try again.'));
  },3500);
  child.stdout.on('data',chunk=>{
   stdout+=chunk.toString('utf8');
   if(stdout.length>8192){child.kill();finish(new Error('Practice result was too long.')); }
  });
  child.stderr.on('data',chunk=>{
   stderr+=chunk.toString('utf8');
   if(stderr.length>2048){child.kill();finish(new Error('Python returned too much error text.')); }
  });
  child.on('error',()=>finish(new Error('Python 3 could not start in this Codespace.')));
  child.on('close',code=>{
   if(settled)return;
   if(code!==0)return finish(new Error('Practice could not run. Open the Python terminal to check Python 3.'));
   try{
    const result=JSON.parse(stdout);
    if(!result.ok)return finish(new Error(result.error||'Could not run that method.'));
    finish(null,{value:String(result.value).slice(0,6000),kind:String(result.kind)});
   }catch(error){finish(new Error('Practice did not return a valid Python result.'));}
  });
  child.stdin.on('error',()=>{});
  child.stdin.end(JSON.stringify(input));
 });
}
module.exports={runStringPractice};
