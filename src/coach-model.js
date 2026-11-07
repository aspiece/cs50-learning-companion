'use strict';

// One small clue at a time; never returns completed CS50P solutions.
function coachClues(assignment,learning,reason){
 const topic=assignment?.title||'this problem';
 const understand=Array.isArray(learning?.understand)?learning.understand:[];
 const planning=Array.isArray(learning?.steps)?learning.steps:[];
 const hints=Array.isArray(learning?.hints)?learning.hints:[];
 if(reason==='understand')return [
  'Read the problem summary in your README. In your own words, what should the program do?',
  understand[0]||'What information goes into your program?',
  understand[1]||'What should your program print or return? Compare it with one example from Harvard.'
 ];
 if(reason==='coding')return [
  'Choose just one small part of '+topic+'. Write what that part should do before writing any Python.',
  planning[0]||'Start with the input or the first step described in your README.',
  hints[0]||'Try a tiny example that is different from the assignment. Then use the idea in your own code.'
 ];
 if(reason==='debug')return [
  'Read the last lines of the terminal output. Find the error name, file, or line number.',
  'Copy the error or check50 result, then open Test → Debug one thing for a clue.',
  'Change one thing in your code, run it again, and compare what happened.'
 ];
 return [];
}

function nextActions(state){
 const p=state?.progress||{};
 if(!state?.folderExists)return [
  'Create the assignment folder with starter files.',
  'Read the problem summary in your README.',
  'Write and run one small part of your program.'
 ];
 if(!state.entryExists)return [
  'Inspect the existing folder for your Python file.',
  'Check the required filenames on Harvard’s problem page.',
  'Restore the missing file yourself without replacing other work.'
 ];
 if(!state.guideExists)return [
  'Open your Python file and keep your existing code.',
  'Use More options to create the missing README.',
  'Run your code with one simple input.'
 ];
 if(p.submitted===true)return [
  'Open the official CS50P gradebook to confirm your submission.',
  'Check the results using your own CS50 account.',
  'If needed, fix your code and resubmit through CS50.'
 ];
 if(p.checked===true)return [
  'Review the actual check50 output in your terminal.',
  'Fix anything that still needs work and run check50 again.',
  'Submit only when you are ready, then check your CS50P gradebook.'
 ];
 if(p.tested===true)return [
  'Compare the result with your prediction and the official examples.',
  'Run check50 and style50, then read their terminal output.',
  'Fix problems you find before submitting.'
 ];
 return [
  'Read your README and check Harvard’s exact instructions.',
  'Write or revise one small part of your Python file.',
  'Run your program with an ordinary and an unusual input.'
 ];
}
module.exports={coachClues,nextActions};
