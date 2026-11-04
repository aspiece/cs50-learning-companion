'use strict';

// A human-readable journal lives alongside each assignment's source files.
// Sentinels allow the sidebar to update one answer without rewriting other notes.
const FILENAME='LEARNING_JOURNAL.md';
const SIGNATURE='<!-- GCI-CS50-JOURNAL:v1 -->';
const FIELDS=[
 ['support','Support level','How much help did you choose?'],
 ['inputNotes','What goes in?','Describe the input or information needed.'],
 ['outputNotes','What should come out?','Describe the expected result.'],
 ['plan','My plan','Write the steps or pseudocode in your own words.'],
 ['prediction','My prediction','Predict what will happen before running your code.'],
 ['observed','What actually happened?','Record the output or behavior you saw.'],
 ['debugNotes','How I debugged','Describe what went wrong and what you tried.'],
 ['reflection','What I learned','Reflect on what worked and what you learned.']
];
const FIELD_NAMES=FIELDS.map(([key])=>key);
function normalized(value){
 return String(value??'').replace(/\r\n?/g,'\n').slice(0,3000);
}
function marker(key,part){return '<!-- GCI:'+key+':'+part+' -->';}
function renderField(key,value){
 return marker(key,'start')+'\n'+normalized(value)+'\n'+marker(key,'end');
}
function createJournal(a,notes={}){
 const sections=FIELDS.map(([key,heading,question])=>
  '## '+heading+'\n\n'+question+'\n\n'+renderField(key,notes[key]??(key==='support'?'standard':'')));
 return '# Learning Journal — '+a.title+'\n\n'+SIGNATURE+'\n\n'
  +'> Personal learning notes. **Do not submit this file to CS50.**\n'
  +'> Write your own ideas. The CS50 Companion helps you plan, test, and reflect.\n\n'
  +sections.join('\n\n')+'\n';
}
function parseJournal(contents){
 const text=String(contents).replace(/\r\n?/g,'\n');
 if(!text.includes(SIGNATURE))return null;
 const result={};
 for(const key of FIELD_NAMES){
  const begin=marker(key,'start')+'\n',end='\n'+marker(key,'end');
  const start=text.indexOf(begin);
  if(start<0)continue;
  const finish=text.indexOf(end,start+begin.length);
  if(finish<0)continue;
  result[key]=text.slice(start+begin.length,finish);
 }
 return result;
}
function updateJournal(contents,key,value){
 if(!FIELD_NAMES.includes(key))throw Error('Unknown journal field: '+key);
 const text=String(contents).replace(/\r\n?/g,'\n');
 if(!text.includes(SIGNATURE))throw Error('Existing journal is not a GCI learning journal. It was not changed.');
 const begin=marker(key,'start')+'\n',end='\n'+marker(key,'end');
 const start=text.indexOf(begin);
 if(start<0)throw Error('Journal section is missing: '+key+'. It was not changed.');
 const finish=text.indexOf(end,start+begin.length);
 if(finish<0)throw Error('Journal section is incomplete: '+key+'. It was not changed.');
 return text.slice(0,start+begin.length)+normalized(value)+text.slice(finish);
}
module.exports={FILENAME,SIGNATURE,FIELDS,FIELD_NAMES,createJournal,parseJournal,updateJournal};
