'use strict';

// Verified PUBLIC lesson-overview links for CodeHS Introduction to Python Programming.
// These are topic lessons, not a student's private CodeHS assignment or a CS50 solution.
// When a public lesson does not closely match the topic, return null instead of guessing.
const {ASSIGNMENT_TOPICS}=require('./concept-videos');
const ROOT='https://codehs.com/course/21076/explore/module/';
const LESSONS=Object.freeze({
 string_methods:{title:'String Methods',module:'29320',lesson:'1404727'},
 variables:{title:'Variables and Types',module:'29313',lesson:'1404523'},
 functions:{title:'Functions',module:'29319',lesson:'1404645'},
 return_values:{title:'Functions and Return Values',module:'29319',lesson:'1404669'},
 conditionals:{title:'If Statements',module:'29315',lesson:'1404573'},
 boolean_expressions:{title:'Logical Operators',module:'29315',lesson:'1404592'},
 for_loops:{title:'For Loops',module:'29326',lesson:'1404614'},
 while_loops:{title:'While Loops',module:'29326',lesson:'1404606'},
 dictionaries:{title:'Dictionaries',module:'29323',lesson:'9562205'},
 dictionary_methods:{title:'Dictionaries',module:'29323',lesson:'9562205'},
 handling_exceptions:{title:'Exceptions',module:'29319',lesson:'1404680'},
 lists:{title:'Lists',module:'29322',lesson:null},
 reading_writing_files:{title:'Reading All Lines from File',module:'29325',lesson:'9551211'},
 reading_writing_csvs:{title:'What is File I/O',module:'29325',lesson:'9551206'}
});
function codehsLessonForAssignment(assignment){
 const id=typeof assignment==='string'?assignment:assignment?.id;
 const topic=ASSIGNMENT_TOPICS[id];
 const lesson=LESSONS[topic];
 if(!lesson)return null;
 return Object.freeze({
  title:lesson.title,
  url:lesson.lesson?ROOT+lesson.module+'/lesson/'+lesson.lesson:
   'https://codehs.com/course/21076/module/'+lesson.module,
  source:'CodeHS Introduction to Python Programming',
  type:lesson.lesson?'lesson':'module'
 });
}
module.exports={LESSONS,codehsLessonForAssignment};
