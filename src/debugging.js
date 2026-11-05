'use strict';

// Private, local explanations of common Python and pytest errors.
// Never evaluates a traceback or reads assignment files.
const ADVICE=[
 ['IndentationError','Indentation error','Check the spaces at the start of this line. Lines inside a function, loop, or if statement must be indented the same way.'],
 ['TabError','Mixed indentation','This code may mix tabs and spaces. Use spaces, then line up the blocks evenly.'],
 ['SyntaxError','Syntax error','Look for a missing colon, quote, parenthesis, or extra character near the line Python points to.'],
 ['NameError','Unknown name','Check spelling and capitalization. Make sure the variable exists before you use it.'],
 ['UnboundLocalError','Variable not ready','A local variable was used before it had a value. Follow the code path and find where it should first be assigned.'],
 ['TypeError','Wrong kind of value','Check whether a value is text, a number, or something else. Review the type expected by the operation.'],
 ['ValueError','Unexpected value','The type may be right, but the value is not accepted. Try a smaller input to find what causes it.'],
 ['AttributeError','Method or attribute not found','Check the type of the value before the dot. The method may belong to a different kind of object.'],
 ['IndexError','Position not found','A list or string position is outside the available items. Check the length and the index you used.'],
 ['KeyError','Dictionary key missing','The dictionary does not have this key. Check spelling or decide how to handle an item that is not there.'],
 ['ZeroDivisionError','Division by zero','Find what becomes zero before division. Think about how the program should handle that input.'],
 ['FileNotFoundError','File not found','Check the file name, capitalization, and current folder. Make sure any needed data file is included.'],
 ['ModuleNotFoundError','Module not found','Check the import name and whether the required package is available in your Codespace.'],
 ['AssertionError','Test did not match','A test expected one result but got another. Compare the input, expected output, and actual output.'],
 ['EOFError','Input ended early','Your program asked for more input than it received. Check how input is read and whether a loop should stop.']
];
const LOOKUP=Object.fromEntries(ADVICE.map(([name,title,tip])=>[name,{title,tip}]));

function explainTerminalError(source){
 const value=typeof source==='string'?source.trim():'';
 if(!value)throw Error('Paste an error message from your terminal first.');
 if(value.length>2000)throw Error('Please paste only the error and a few nearby lines (up to 2,000 characters).');
 const lines=value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 // Use the final recognized error in a traceback. Never run or store pasted code.
 let kind=null;
 for(let i=lines.length-1;i>=0;i--){
  const match=lines[i].match(/\b([A-Za-z][A-Za-z0-9_]*(?:Error|Exception))\s*:/);
  if(match){kind=match[1];break;}
 }
 if(!kind&&/\b(?:FAILED|FAILURES|assert\s+.+==|E\s+assert)\b/i.test(value))kind='AssertionError';
 const known=LOOKUP[kind];
 const location=[...value.matchAll(/\bline\s+(\d{1,6})\b/gi)].at(-1)?.[1]||null;
 return {
  title:known?.title||(kind?'Python reported '+kind:'Start with the last error line'),
  guidance:known?.tip||'Read the last error line, then find where it happened. Check one small step and try again.',
  location:location?'Look near line '+location+' in the file named in your terminal.':'Look at the file and line shown near the end of the traceback.',
  next:'Change one thing in your code, run it again, and compare the new result.',
  verified:false
 };
}
module.exports={explainTerminalError};
