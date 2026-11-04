'use strict';
// This library is copied from aspiece/python-lab; it contains original, unsolved starters.
global.window=global.window||{};
require('../content/cs50p-starters.js');
const catalog=global.window.pythonLabCS50P;
if(!catalog || catalog.catalog().length!==41) throw new Error('CS50P catalog could not load');
function list(){return catalog.catalog();}
function get(id){return catalog.get(id);}
function submissionPath(a){
 const slug=a.set===5?'tests/'+a.slug.replace(/^test_/,''):a.slug;
 return 'cs50/problems/2022/python/'+slug;
}
function safeAssignment(a){
 if(!a || !/^cs50p-[0-8]-[a-z0-9_]+$/.test(a.id)) throw Error('Invalid assignment');
 if(!/^[a-z0-9_]+$/.test(a.slug)) throw Error('Unsafe folder');
 for(const file of Object.keys(a.files)){
  if(!/^[a-z0-9_.-]+$/i.test(file)||file==='.'||file==='..') throw Error('Unsafe filename');
 }
 return a;
}
function explain(error){
 if(/IndentationError|TabError/i.test(error))return 'Check the spaces before each line. Code inside an if, loop, or function must be indented evenly.';
 if(/NameError/i.test(error))return 'Python does not recognize a name. Check spelling and whether you created that variable first.';
 if(/SyntaxError/i.test(error))return 'Look for a missing colon, quote, parenthesis, or an extra character near this line.';
 if(/ModuleNotFoundError/i.test(error))return 'Python cannot find an imported library. Check its name and the official setup instructions.';
 if(/FileNotFoundError/i.test(error))return 'Python cannot find a file. Check its filename and where your program is running.';
 if(/TypeError|ValueError/i.test(error))return 'Check the kind of data you gave the function and whether it can be converted.';
 return 'Read the last line of the error and find the filename and line number above it. Try a smaller test.';
}

function section(readme,heading){
 const start=readme.indexOf('## '+heading+'\n');
 if(start<0)return '';
 const rest=readme.slice(start+heading.length+4);
 return rest.split(/\n## /)[0].trim();
}
function bulletItems(text){
 return text.split('\n').map(line=>line.replace(/^\s*(?:\d+\.|[-*])\s+/,'').trim()).filter(line=>line&&!/^##?\s/.test(line));
}
function teachingGuide(a){
 safeAssignment(a);
 const readme=a.files['README.md']||'';
 const tasks=bulletItems(section(readme,'Step-by-step plan')).slice(0,6);
 const checks=bulletItems(section(readme,'Check your work')).filter(s=>s.startsWith('Try ')||s.startsWith('Check ')||s.startsWith('Test ')).slice(0,4);
 const subject=a.subject||'Python';
 const custom={
  'cs50p-0-indoor':{
   understand:['What changes when a message is made quiet?','What should happen to spaces and punctuation?'],
   hints:['What kind of data is a message in Python?','Look up a string method that changes letter case. Practice it with a word of your own.','Test a word with uppercase and lowercase letters. Compare your prediction with the result.']
  },
  'cs50p-0-playback':{
   understand:['What separates the words in an ordinary sentence?','What should appear between words in the output?'],
   hints:['Treat the message as a single string.','Explore a Python string method that replaces one piece of text with another.','Try replacing a character in a different sentence before returning to the assignment.']
  },
  'cs50p-0-faces':{
   understand:['Which parts of the message should change?','Should other words and punctuation stay the same?'],
   hints:['Think about separating a text change into a function.','Review functions with parameters and returned values.','Practice replacing a short symbol in an unrelated string before writing your solution.']
  }
 };
 const specific=custom[a.id]||{};
 const understand=specific.understand||[
  'What information does this program start with?',
  'What result should it produce?',
  'Which details in the official task must stay the same?'
 ];
 const hints=specific.hints||[
  'Read the first step in your README. Explain it in your own words.',
  'This problem practices '+subject+'. Review one small example from class or the CS50 notes.',
  'Choose one step from your plan and test that idea with a different example.'
 ];
 return {understand,steps:tasks,checks,hints,concept:subject};
}

function guideForCodespace(a){
 safeAssignment(a);
 const base=a.files['README.md']||'';
 const guide=teachingGuide(a);
 const mission=section(base,'What will you make?')||a.description;
 const terms=section(base,'Words to know');
 const filesNeeded=section(base,'Files your program may need');
 const otherNotes=section(base,'Need another file or package?');
 const codeFiles=Object.keys(a.files).filter(name=>name.endsWith('.py'));
 const code=text=>String.fromCharCode(96)+text+String.fromCharCode(96);
 const listItems=items=>items.map(item=>'- '+item).join('\n');
 const numbering=items=>items.map((item,i)=>(i+1)+'. '+item).join('\n');
 const runCmd='python '+a.entryFile;
 const checkCmd='check50 '+submissionPath(a);
 const submitCmd='submit50 '+submissionPath(a);
 const expectedFiles=codeFiles.map(name=>'- '+code(name)).join('\n');
 const testIdeas=guide.checks.length?listItems(guide.checks):'- Try a common input from the official instructions.\n- Try an edge case listed in the problem.';
 return [
  '# '+a.title,'',
  '**CS50P · Problem Set '+a.set+' · Student learning guide**','',
  '> This README is a help sheet. The [official CS50 problem instructions]('+a.url+') are the source of truth for requirements, tests, and submission. Write your own code.','',
  '**Use the CS50 Companion sidebar:** Start → Learn → Test → Submit.','',
  '## Start — Understand the assignment','',
  '### Your mission','',mission,'',
  '### Get ready','',
  '1. Read the [official CS50 problem]('+a.url+') carefully.',
  '2. Find your folder: '+code(a.slug+'/')+'.',
  '3. Open '+code('README.md')+' and your Python file side by side.',
  '4. Check the files below. Do not rename the required Python files.','',
  '**Code files in your folder:**','',expectedFiles,'',
  'Your program may need other files to **run**, even if CS50 does not ask you to **submit** them.','',
  '## Learn — Understand, Plan, Get Unstuck','',
  '### 1. Understand','',
  'Think about these questions before you type code:','',
  listItems(guide.understand),'',
  'In the companion, write down the input and the expected output in your own words.','',
  '### 2. Plan','',
  'Turn the task into smaller steps. Use these ideas from the assignment:','',
  numbering(guide.steps),'',
  'Write a short plan or pseudocode in the Learn tab. You can change it as you work.','',
  '### 3. Get unstuck','',
  'Try your plan first. If you are stuck, use the companion hints one at a time.','',
  '- Getting Started: use extra questions and reminders.',
  '- Some Help: use the plan and hints as needed.',
  '- Independent: try the task with fewer prompts.','',
  'Try to understand each change before you add it to your program. Do not copy a completed solution.','',
  '## Test — Predict, Run, Debug','',
  '### Predict before running','',
  'Pick an input from the official problem. Write down what you think the output will be.','',
  '### Run and check','',
  '1. Open a terminal in the '+code(a.slug)+' folder.',
  '2. Run your program: '+code(runCmd)+'.',
  '3. Compare the output with your prediction and the official examples.',
  '4. Try another input. Use these test ideas:','',
  testIdeas,'',
  '5. Run '+code(checkCmd)+' and read the results.',
  '6. If useful, run '+code('style50 '+a.entryFile)+' and review the style feedback.','',
  '### Debug with a plan','',
  'If your code does not work, read the error message. Find the related line. Change one thing, then run it again.',
  'Use the companion to explain common errors and record what you tried.','',
  '## Submit — Check, Reflect, Send','',
  '### Before you submit','',
  '- Check the [official assignment page]('+a.url+') for the exact required files.',
  '- Keep needed CSV, image, or Python files in the correct folder while you run and test.',
  '- Do not include this README in your submission unless CS50 explicitly asks for it.',
  '- Reflect: What did you learn? Which tests helped you know your code worked?','',
  '### Submit with CS50','',
  'In the '+code(a.slug)+' folder, run '+code(submitCmd)+' when your work is ready.',
  'Follow the prompts and confirm submission with CS50. The companion checklist cannot verify your submission.','',
  '## Extra files and useful terms','',
  filesNeeded||'Check the official problem for any required data files or images.','',
  ...(otherNotes?['### Package or file notes','',otherNotes,'']:[]),
  ...(terms?['### Words to know','',terms,'']:[]),
  '## Remember','',
  'This is your learning guide, not an answer key. Use the companion for planning, hints, testing, and reflection. Follow CS50 academic honesty rules.',''
 ].join('\n');
}

module.exports={list,get,submissionPath,safeAssignment,guideForCodespace,explain,teachingGuide};
