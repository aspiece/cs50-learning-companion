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

module.exports={coachClues};
