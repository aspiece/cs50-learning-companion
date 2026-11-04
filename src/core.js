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
function guideForCodespace(a){
 return a.files['README.md']
 .replace('in Python Lab.', 'in CS50 Codespaces.')
 .replace('## Move your code to CS50 Codespaces', '## Work in this Codespace')
 .replace(/Use \*\*Move to Codespaces\*\* in Python Lab[\s\S]*?(?=Check your code:)/,
  'Your folder and starter files are already here. Read the official instructions and write your own code. Add any data or images from the official problem page when needed.\n\n');
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
module.exports={list,get,submissionPath,safeAssignment,guideForCodespace,explain,teachingGuide};
