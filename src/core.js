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
module.exports={list,get,submissionPath,safeAssignment,guideForCodespace,explain};
