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
 const checks=bulletItems(section(readme,'Check your work')).filter(s=>!/^Run your code and compare/i.test(s)).slice(0,4);
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
 const code=value=>String.fromCharCode(96)+value+String.fromCharCode(96);
 const numbered=items=>items.map((item,i)=>(i+1)+'. '+item);
 const bullet=items=>items.map(item=>'- '+item);
 const mission=section(base,'What will you make?')||a.description;
 const fileNames=Object.keys(a.files).filter(name=>name.endsWith('.py'));
 const special={
  'cs50p-0-indoor':{
   goal:"Create a program that changes a user's message to lowercase while keeping spaces, numbers, and punctuation.",
   steps:[
    '**Get the input.** The starter code already asks the user to type a message.',
    '**Change the text.** Find a Python string method that changes uppercase letters to lowercase.',
    '**Show the result.** Display the updated message.'
   ],
   checks:[code('HELLO'),code('Hello, WORLD!'),code('Python 123')],
   thought:'Do you need a new variable, or can you change the value you already have?'
  },
  'cs50p-2-coke':{
   goal:'Create a vending machine that accepts coins, tracks money owed, and returns the correct change.',
   steps:[
    '**Start with the cost.** The starter code sets the amount due to 50 cents.',
    '**Show the amount due.** Let the user know how much they still owe.',
    '**Ask for coins.** Use a loop to keep accepting input until enough money has been added.',
    '**Check each coin.** Accept only the coin values listed in the official problem.',
    '**Update the total.** Subtract accepted coins from the amount due.',
    '**Show the change.** When payment is complete, display any change owed.'
   ],
   checks:['Paying the exact amount','Entering a coin the machine does not accept','Paying more than the cost'],
   thought:'What should happen if someone enters an invalid coin?'
  }
 };
 const details=special[a.id]||{};
 const steps=details.steps||guide.steps.slice(0,6);
 const tests=details.checks||guide.checks.slice(0,3);
 const runExamples={
  'cs50p-4-bitcoin':'python bitcoin.py 2',
  'cs50p-6-lines':'python lines.py example.py',
  'cs50p-6-pizza':'python pizza.py regular.csv',
  'cs50p-6-scourgify':'python scourgify.py before.csv after.csv',
  'cs50p-6-shirt':'python shirt.py input.jpg output.jpg'
 };
 const run=a.set===5?'pytest '+a.entryFile:(runExamples[a.id]||'python '+a.entryFile);
 const check='check50 '+submissionPath(a);
 const submit='submit50 '+submissionPath(a);
 const extra=a.extraFiles||[];
 const filesBlock=extra.map(file=>'- ['+code(file.name)+']('+file.url+') — '+file.kind);
 const neededFiles=extra.length?[
  '**Needed files:** Get the required files from Harvard. Optional samples can help with testing. Keep the files you use in this assignment folder.',
  ...filesBlock
 ]:a.slug==='lines'?[
  '**For testing:** Put a sample Python file beside '+code(a.entryFile)+' so your program has a file to read.'
 ]:[];
 const testFiles=fileNames.filter(name=>/^test_.*\.py$/.test(name));
 const testCommand=a.set!==5&&testFiles.length?'pytest '+testFiles[0]:null;
 const thought=details.thought?['**Think about it:** '+details.thought,'']:[];
 return [
  '# '+a.title,'',
  '**CS50P · Problem Set '+a.set+'**  ',
  '**File'+(fileNames.length===1?'':'s')+':** '+fileNames.map(code).join(', '),'',
  '[Read Harvard’s Official Instructions]('+a.url+')','',
  '## Your Goal','',
  details.goal||mission,'',
  '## Build It','',
  ...numbered(steps),'',
  ...thought,
  ...neededFiles,
  ...(neededFiles.length?['']:[]),
  '## Test It','',
  ...bullet(tests),
  '',
  'Compare your results with the examples and rules on Harvard’s problem page.','',
  '## Check It','',
  'Run your program'+(a.set===5?' tests':'')+': '+code(run)+'.',
  ...(testCommand?['Run your tests: '+code(testCommand)+'.']:[]),
  'Check your work: '+code(check)+'.',
  'Read any errors, make a change, and test again.','',
  '## Submit','',
  'When your work is ready, use the Companion’s **Submit** tab (or '+code(submit)+').',
  'Only send the files Harvard requests. Your README and Learning Journal are for learning, not submission.',
  ''
 ].join('\n');
}

module.exports={list,get,submissionPath,safeAssignment,guideForCodespace,explain,teachingGuide};
