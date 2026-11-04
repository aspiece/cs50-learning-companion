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
 const filesNeeded=section(base,'Files your program may need')
  .replace('Move any files your code reads, such as a CSV, photo, or another Python file.','Keep any files your code reads, such as a CSV, photo, or another Python file, in your assignment folder.')
  .replace(/bring them to Codespaces too/gi,'add them to this assignment folder too')
  .replace(/bring them to Codespaces/gi,'add them to this Codespace');
 const otherNotes=section(base,'Need another file or package?')
  .replace(/Python Lab/gi,'this Codespace');
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
  '> **Important:** This guide helps you learn. [Harvard’s official instructions]('+a.url+') decide what your code must do and what to submit. If they differ, follow Harvard.','',
  '**Your path:** Start → Learn → Test → Submit. Use the matching tabs in the CS50 Companion sidebar.','',
  '## Start — Understand the assignment','',
  '### Your mission','',mission,'',
  '### Get ready','',
  '1. In the Companion, select **Open official CS50 instructions**. Keep the official page open in another browser tab or window while you code in Codespaces.',
  '2. Find your folder: '+code(a.slug+'/')+'.',
  '3. Keep this '+code('README.md')+' open for guidance, and use your Python editor to write code.',
  '4. Check the files below. Do not rename the required Python files.',
  '5. Your answers in the Companion are saved to '+code('LEARNING_JOURNAL.md')+' in this folder.','',
  '**Code files in your folder:**','',expectedFiles,'',
  '**Important:** A file needed for testing is not always a file you must submit. Follow the official page for the submission list.','',
  '## Learn — Understand, Plan, Get Unstuck','',
  '### 1. Understand','',
  'Think about these questions before you type code:','',
  listItems(guide.understand),'',
  '**Stop and check:** Can you describe the required input and output without looking at code? Write your answer in the Learn tab.','',
  '### 2. Plan','',
  'Turn the task into smaller steps. Use these ideas from the assignment:','',
  numbering(guide.steps),'',
  '**Stop and check:** Can you explain your first coding step? Write a short plan or pseudocode in the Learn tab. It saves to your Learning Journal.','',
  '### 3. Get unstuck','',
  'Try your plan first. If you are stuck, use the companion hints one at a time.','',
  '- Getting Started: use extra questions and reminders.',
  '- Some Help: use the plan and hints as needed.',
  '- Independent: try the task with fewer prompts.','',
  '**Try first:** Work on one small step. If you need help, try the next hint or review a different example. Do not copy a finished solution.','',
  '## Test — Predict, Run, Debug','',
  '### Predict before running','',
  'Choose a test input from the official page. In the Test tab, predict the result **before** you run your program. For testing assignments, predict which cases should pass or fail.','',
  '### Run and check','',
  '1. Open a terminal in the '+code(a.slug)+' folder.',
  '2. Run your program: '+code(runCmd)+'.',
  '3. Compare what happened with your prediction. Check the official examples and requirements.',
  '4. Try another input and compare the result.','',
  '**Test ideas:**','',testIdeas,'',
  '5. Run '+code(checkCmd)+' and read the results.',
  '6. If useful, run '+code('style50 '+a.entryFile)+' and review the style feedback.','',
  '### Debug with a plan','',
  'If something fails: **Read** the last error line → **Locate** the related code → **Change** one thing → **Test again**.',
  '**Stop and check:** Can you describe what failed and your next test? Record it in the Test tab.','',
  '## Submit — Check, Reflect, Send','',
  '### Before you submit','',
  '- Re-read the [official assignment page]('+a.url+') and check the exact submission requirements.',
  '- Keep needed CSV, image, or Python files in the correct folder while you run and test.',
  '- Your '+code('LEARNING_JOURNAL.md')+' is for learning, not for CS50 submission.',
  '- The Companion runs '+code('check50')+' and '+code('submit50')+' on a temporary copy without this journal or the generated README.',
  '- Check the file list shown by '+code('submit50')+' before confirming.',
  '- Do not include the generated README in your submission unless CS50 explicitly asks for it.',
  '- In the Submit tab, answer: **What did you learn? Which test gave you confidence?**','',
  '### Submit with CS50','',
  'In the '+code(a.slug)+' folder, run '+code(submitCmd)+' when your work is ready.',
  '**Stop and check:** Look for confirmation from CS50. Your Companion checklist is only your personal record. The companion checklist cannot verify your submission.','',
  '## Extra files and useful terms','',
  filesNeeded||'Check the official problem for any required data files or images.','',
  ...(otherNotes?['### Package or file notes','',otherNotes,'']:[]),
  ...(terms?['### Words to know','',terms,'']:[]),
  '## Remember','',
  'This is your learning guide, not an answer key. Use the companion for planning, hints, testing, and reflection. Follow CS50 academic honesty rules.',''
 ].join('\n');
}

module.exports={list,get,submissionPath,safeAssignment,guideForCodespace,explain,teachingGuide};
