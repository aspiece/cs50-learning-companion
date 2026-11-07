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
 if(!value)throw Error('Paste an error message or a check50 result first.');
 if(value.length>6000)throw Error('Copy only the error and nearby details (up to 6,000 characters).');
 const lines=value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 // Prefer a specific Python traceback even when check50 also reports a failure.
 // No code is executed, changed, stored, or sent to a remote service.
 let kind=null;
 for(let i=lines.length-1;i>=0;i--){
  const match=lines[i].match(/\b([A-Za-z][A-Za-z0-9_]*(?:Error|Exception))\s*:/);
  if(match){kind=match[1];break;}
 }
 const location=[...value.matchAll(/\bline\s+(\d{1,6})\b/gi)].at(-1)?.[1]||null;
 const where=location?
  'Look near line '+location+' in the file named in your terminal.':
  'Look at the file and line shown near the end of the traceback.';
 const next='Change one thing in your code, run it again, and compare the new result.';
 if(kind){
  const known=LOOKUP[kind];
  return {
   title:known?.title||'Python reported '+kind,
   guidance:known?.tip||'Read the last error line, then find where it happened. Check one small step and try again.',
   location:where,
   next,
   category:'python',
   verified:false
  };
 }
 const failedCheck=/(?:^|\n)\s*:\(\s/m.test(value);
 const passedCheck=/(?:^|\n)\s*:\)\s/m.test(value);
 const skippedCheck=/(?:^|\n)\s*:\|\s/m.test(value);
 const likelyCheck=failedCheck||passedCheck||skippedCheck||
  /\bcheck50\b/i.test(value)||/\bexpected\b[\s\S]{0,300}\bsaw\b/i.test(value);
 if(likelyCheck){
  let title='A CS50 check needs attention';
  let guidance='Read the first failed check. Compare the input and the exact output that Harvard expects with what your program produced.';
  if(/timed out|time.?out|waited too long|did not exit/i.test(value)){
   title='Your program may not be stopping';
   guidance='Check your loop ending condition or whether your program is waiting for another input.';
  }else if(/prompt|input prompt/i.test(value)){
   title='Check how your program asks for input';
   guidance='Compare your input prompt and number of input requests with the official instructions. Extra text can change a check.';
  }else if(/\bexpected\b[\s\S]{0,350}\b(?:saw|got|instead)\b/i.test(value)){
   title='The actual output did not match';
   guidance='Compare capitalization, spaces, punctuation, and output format with the official examples. First test one short input.';
  }else if(!failedCheck&&passedCheck){
   title='Some checks appear to have passed';
   guidance='The pasted text shows a passing mark. Review the full check50 report for any failed or skipped checks. This is not a confirmed grade.';
  }else if(!failedCheck&&skippedCheck){
   title='A check was skipped';
   guidance='Read the nearby check50 details to see why this check did not run. Fix any earlier errors first.';
  }
  return {
   title,guidance,
   location:'Look for a :( failed check (or :| skipped check) in the terminal. The complete CS50 report has the details.',
   next:'Test that exact situation again in your own program, then run it again with check50.',
   category:'check50',
   verified:false
  };
 }
 if(/\b(?:FAILED|FAILURES|assert\s+.+==|E\s+assert|AssertionError)\b/i.test(value)){
  return {
   title:'A Python test did not match',
   guidance:'Compare the test input, expected value, and actual value. Find the first place your result differs.',
   location:where,
   next,
   category:'pytest',
   verified:false
  };
 }
 return {
  title:'Find the last important output line',
  guidance:'Start with the last error or unexpected message. If this is check50, copy the failed check and its details. If it is Python, copy the traceback.',
  location:'Look near the end of your terminal output.',
  next,
  category:'unknown',
  verified:false
 };
}
module.exports={explainTerminalError};
