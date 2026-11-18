'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const {get,guideForCodespace,isGeneratedGuide,safeAssignment}=require('../src/core');
const ext=fs.readFileSync(path.join(__dirname,'../src/extension.js'),'utf8');
const start=ext.indexOf('async function openStarterFiles(a){');
const end=ext.indexOf('\nclass Companion {',start);
assert.ok(start>=0&&end>start,'Find real assignment filesystem functions');

function environment(assignment=get('cs50p-0-indoor')){
 const dirs=new Set(['/school']);
 const files=new Map();
 const opened=[];
 const notifications=[];
 let approval=false;
 const documents=[];
 const join=(...parts)=>path.posix.join(...parts);
 const exists=async uri=>dirs.has(uri)||files.has(uri);
 const vscode={
  ViewColumn:{One:1,Two:2},
  workspace:{
   textDocuments:documents,
   fs:{
    createDirectory:async uri=>{dirs.add(uri);},
    writeFile:async(uri,buffer)=>{files.set(uri,Buffer.from(buffer));},
    readFile:async uri=>{if(!files.has(uri))throw Error('Missing '+uri);return files.get(uri);}
   }
  },
  window:{
   showWarningMessage:async(text)=>{notifications.push({kind:'warning',text});return approval?(text.startsWith('Save your assignment')?'Save and continue':text.startsWith('Reload starter code')?'Back up and reload':'Update README'):undefined;},
   showInformationMessage:async(text)=>{notifications.push({kind:'info',text});},
   showTextDocument:async(uri,options)=>{opened.push({kind:'code',uri,column:options.viewColumn});}
  }
 };
 const root=()=>'/school';
 const utf=text=>Buffer.from(text,'utf8');
 const openFormattedMarkdown=async(uri,column)=>{
  opened.push({kind:'readme',uri,column});return true;
 };
 const slice=ext.slice(start,end);
 const actions=Function(
  'root','join','exists','vscode','safeAssignment','guideForCodespace',
  'utf','openFormattedMarkdown','Buffer','isGeneratedGuide',
  slice+'\nreturn {reloadStarter,createStarter,openStarterFiles,updateStudentGuide,refreshGeneratedGuide,saveAssignmentEdits};'
 )(root,join,exists,vscode,safeAssignment,guideForCodespace,utf,
  openFormattedMarkdown,Buffer,isGeneratedGuide);
 const read=uri=>files.get(uri)?.toString('utf8');
 return {
  actions,dirs,files,opened,notifications,read,assignment,documents,vscode,
  approve:()=>{approval=true;},
  set:(uri,text)=>files.set(uri,utf(text))
 };
}

test('new assignment writes expected starter, short guide without generating a journal',async()=>{
 const h=environment(),a=h.assignment;
 const created=await h.actions.createStarter(a);
 assert.equal(created,true);
 assert.ok(h.dirs.has('/school/indoor'));
 assert.equal(h.read('/school/indoor/indoor.py'),a.files['indoor.py']);
 assert.equal(h.read('/school/indoor/README.md'),guideForCodespace(a));
 assert.equal(h.read('/school/indoor/LEARNING_JOURNAL.md'),undefined);
 assert.deepEqual(h.opened.slice(-2),[
  {kind:'readme',uri:'/school/indoor/README.md',column:1},
  {kind:'code',uri:'/school/indoor/indoor.py',column:2}
 ]);
});

test('Continue coding opens files in two editor groups without rewriting code or journal',async()=>{
 const h=environment(),a=h.assignment;
 await h.actions.createStarter(a);
 const edited="print('student code is mine')\n";
 const journal='# My journal\nMy own learning notes.\n';
 h.set('/school/indoor/indoor.py',edited);
 h.set('/school/indoor/LEARNING_JOURNAL.md',journal);
 const snapshot=[...h.files].map(([key,value])=>[key,value.toString('utf8')]);
 const before=h.opened.length;
 assert.equal(await h.actions.openStarterFiles(a),true);
 assert.deepEqual([...h.files].map(([key,value])=>[key,value.toString('utf8')]),snapshot);
 assert.deepEqual(h.opened.slice(before),[
  {kind:'readme',uri:'/school/indoor/README.md',column:1},
  {kind:'code',uri:'/school/indoor/indoor.py',column:2}
 ]);
});

test('already-existing folder is never re-created or overwritten by Create',async()=>{
 const h=environment(),a=h.assignment;
 h.dirs.add('/school/indoor');
 h.set('/school/indoor/indoor.py',"print('existing student work')");
 const created=await h.actions.createStarter(a);
 assert.equal(created,false);
 assert.equal(h.read('/school/indoor/indoor.py'),"print('existing student work')");
 assert.equal(h.read('/school/indoor/README.md'),undefined);
 assert.ok(h.notifications.some(x=>x.text.includes('Your code was not changed')));
});

test('a missing README can be restored without overwriting code',async()=>{
 const h=environment(),a=h.assignment;
 h.dirs.add('/school/indoor');
 h.set('/school/indoor/indoor.py','student_code = 12');
 const result=await h.actions.updateStudentGuide(a);
 assert.equal(result,true);
 assert.equal(h.read('/school/indoor/indoor.py'),'student_code = 12');
 assert.equal(h.read('/school/indoor/README.md'),guideForCodespace(a));
 assert.equal([...h.files.keys()].filter(x=>x.includes('README.backup')).length,0);
});

test('README refresh asks first, backs up old README, and preserves student code',async()=>{
 const h=environment(),a=h.assignment;
 h.dirs.add('/school/indoor');
 h.set('/school/indoor/indoor.py','my_personal_solution = True');
 h.set('/school/indoor/README.md','# My old guide');
 let result=await h.actions.updateStudentGuide(a);
 assert.equal(result,false,'canceled update does not proceed');
 assert.equal(h.read('/school/indoor/README.md'),'# My old guide');
 assert.equal(h.read('/school/indoor/indoor.py'),'my_personal_solution = True');
 h.approve();
 result=await h.actions.updateStudentGuide(a);
 assert.equal(result,true);
 assert.equal(h.read('/school/indoor/README.backup-1.md'),'# My old guide');
 assert.equal(h.read('/school/indoor/README.md'),guideForCodespace(a));
 assert.equal(h.read('/school/indoor/indoor.py'),'my_personal_solution = True');
});

test('auto-refresh upgrades only known untouched guides and skips open unsaved edits',async()=>{
 const h=environment(),a=h.assignment;
 const uri='/school/indoor/README.md';
 h.dirs.add('/school/indoor');
 h.set('/school/indoor/indoor.py','student work');
 const body='# Previous generated guide\n';
 const digest=createHash('sha256').update(body).digest('hex');
 const prior='<!-- gci-cs50-guide '+a.id+' '+digest+' -->\n'+body;
 h.set(uri,prior+'Student note\n');
 assert.equal(await h.actions.refreshGeneratedGuide(a,'/school'),false);
 assert.match(h.read(uri),/Student note/);
 h.set(uri,prior);
 h.documents.push({uri,isDirty:true});
 assert.equal(await h.actions.refreshGeneratedGuide(a,'/school'),false);
 assert.equal(h.read(uri),prior);
 assert.equal(await h.actions.updateStudentGuide(a),false);
 h.documents.pop();
 assert.equal(await h.actions.refreshGeneratedGuide(a,'/school'),true);
 assert.equal(h.read(uri),guideForCodespace(a));
 assert.equal(await h.actions.refreshGeneratedGuide(a,'/school'),false);
 assert.equal(h.read('/school/indoor/indoor.py'),'student work');
});

test('terminal save asks first and touches only files in the selected assignment',async()=>{
 const h=environment();
 const uri=path=>({scheme:'file',authority:'',path});
 const directory=uri('/school/indoor');
 const source={uri:uri('/school/indoor/indoor.py'),isDirty:true,save:async()=>{source.isDirty=false;return true;}};
 const elsewhere={uri:uri('/school/indoor2/work.py'),isDirty:true,save:()=>assert.fail('Unrelated save')};
 h.documents.push(source,elsewhere);
 assert.equal(await h.actions.saveAssignmentEdits(directory),false);
 assert.equal(source.isDirty,true);
 h.approve();
 assert.equal(await h.actions.saveAssignmentEdits(directory),true);
 assert.equal(source.isDirty,false);
 assert.equal(elsewhere.isDirty,true);
 source.isDirty=true;
 source.save=async()=>false;
 assert.equal(await h.actions.saveAssignmentEdits(directory),false);
});


test('reload backs up all source/test files before replacing them, preserving other work',async()=>{
 const h=environment(get('cs50p-5-test_fuel')),a=h.assignment;
 await h.actions.createStarter(a);
 h.set('/school/test_fuel/fuel.py','student implementation');
 h.set('/school/test_fuel/test_fuel.py','student tests');
 h.set('/school/test_fuel/extra.py','extra helper');
 h.set('/school/test_fuel/README.md','my notes');
 h.set('/school/test_fuel/LEARNING_JOURNAL.md','my journal');
 const before=[...h.files].map(([k,v])=>[k,v.toString()]);
 assert.equal(await h.actions.reloadStarter(a),false);
 assert.deepEqual([...h.files].map(([k,v])=>[k,v.toString()]),before);
 h.approve();
 assert.equal(await h.actions.reloadStarter(a),true);
 for(const name of ['fuel.py','test_fuel.py'])assert.equal(h.read('/school/test_fuel/'+name),a.files[name]);
 assert.equal(h.read('/school/starter-code-backups/test_fuel/reload-1/fuel.py'),'student implementation');
 assert.equal(h.read('/school/starter-code-backups/test_fuel/reload-1/test_fuel.py'),'student tests');
 assert.equal(h.read('/school/test_fuel/extra.py'),'extra helper');
 assert.equal(h.read('/school/test_fuel/README.md'),'my notes');
 assert.equal(h.read('/school/test_fuel/LEARNING_JOURNAL.md'),'my journal');
 assert.equal(await h.actions.reloadStarter(a),true);
 assert.equal(h.read('/school/starter-code-backups/test_fuel/reload-1/fuel.py'),'student implementation');
 assert.equal(h.read('/school/starter-code-backups/test_fuel/reload-2/fuel.py'),a.files['fuel.py']);
});

test('reload blocks unsaved code and concurrent edits during confirmation',async()=>{
 const h=environment(),a=h.assignment;
 await h.actions.createStarter(a);h.approve();
 const uri='/school/indoor/indoor.py';
 h.documents.push({uri,isDirty:true});
 assert.equal(await h.actions.reloadStarter(a),false);
 assert(![...h.dirs].some(x=>x.includes('starter-code-backups')));
 h.documents.pop();
 h.vscode.window.showWarningMessage=async()=>{h.set(uri,'changed during prompt');return 'Back up and reload';};
 assert.equal(await h.actions.reloadStarter(a),false);
 assert.equal(h.read(uri),'changed during prompt');
});

test('failed backup prevents any starter replacement',async()=>{
 const h=environment(get('cs50p-5-test_fuel')),a=h.assignment;
 await h.actions.createStarter(a);h.approve();
 h.set('/school/test_fuel/fuel.py','my code');h.set('/school/test_fuel/test_fuel.py','my tests');
 const write=h.vscode.workspace.fs.writeFile;
 h.vscode.workspace.fs.writeFile=async(uri,bytes)=>{
  if(uri.includes('starter-code-backups')&&uri.endsWith('test_fuel.py'))throw Error('Disk full');
  return write(uri,bytes);
 };
 assert.equal(await h.actions.reloadStarter(a),false);
 assert.equal(h.read('/school/test_fuel/fuel.py'),'my code');
 assert.equal(h.read('/school/test_fuel/test_fuel.py'),'my tests');
});

test('reload restores missing starter file and includes supplied Nutrition dictionary',async()=>{
 const h=environment(get('cs50p-2-nutrition')),a=h.assignment;
 h.dirs.add('/school/nutrition');h.approve();
 assert.equal(await h.actions.reloadStarter(a),true);
 assert.equal(h.read('/school/nutrition/nutrition.py'),a.files['nutrition.py']);
 assert.match(h.read('/school/nutrition/nutrition.py'),/"apple": 130/);
 assert.equal(h.read('/school/nutrition/README.md'),undefined);
});
