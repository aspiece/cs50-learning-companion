'use strict';

// CS50P's official concept-only Shorts. These teach Python topics, not
// the finished CS50P problem-set solutions.
// Official index: https://cs50.harvard.edu/python/shorts/
const BASE='https://cs50.harvard.edu/python/shorts/';
const TOPICS={
 string_methods:{
  title:'String Methods',slug:'string_methods',
  focus:'Explore ways Python can change text.',
  question:'Which string method could help with your first coding step?'
 },
 functions:{
  title:'Functions',slug:'functions',
  focus:'Learn how to break a program into smaller tasks.',
  question:'Which part of your program could become a function?'
 },
 variables:{
  title:'Variables',slug:'variables',
  focus:'See how names store values you can use later.',
  question:'What value will your program need to remember?'
 },
 return_values:{
  title:'Return Values',slug:'return_values',
  focus:'Learn how a function sends a result back to your code.',
  question:'What should your function return to the rest of the program?'
 },
 conditionals:{
  title:'Conditionals',slug:'conditionals',
  focus:'Practice choosing what code runs when a rule is true.',
  question:'What decision does your program need to make?'
 },
 boolean_expressions:{
  title:'Boolean Expressions',slug:'boolean_expressions',
  focus:'Learn how to combine true-or-false checks.',
  question:'What condition must be true for your program to continue?'
 },
 for_loops:{
  title:'For Loops',slug:'for_loops',
  focus:'Practice repeating steps for each item or character.',
  question:'What items or characters does your program need to check?'
 },
 while_loops:{
  title:'While Loops',slug:'while_loops',
  focus:'Learn how to repeat a step until a condition changes.',
  question:'What condition should make your loop stop?'
 },
 dictionaries:{
  title:'Dictionaries',slug:'dictionaries',
  focus:'Learn how to match keys to values.',
  question:'Which keys and values belong in your program?'
 },
 dictionary_methods:{
  title:'Dictionary Methods',slug:'dictionary_methods',
  focus:'Practice reading and changing dictionary entries.',
  question:'How will your program track an item it sees again?'
 },
 handling_exceptions:{
  title:'Handling Exceptions',slug:'handling_exceptions',
  focus:'Learn how to handle unexpected input without crashing.',
  question:'What input might cause an error, and how could you respond?'
 },
 lists:{
  title:'Lists',slug:'lists',
  focus:'Learn how to collect several values in one place.',
  question:'What values should your program collect before using them?'
 },
 packages:{
  title:'Creating Modules and Packages',slug:'creating_modules_packages',
  focus:'Explore how Python organizes code into reusable modules.',
  question:'Which imported tool or package will you use in your program?'
 },
 random:{
  title:'random',slug:'random',
  focus:'Explore how to choose numbers at random.',
  question:'Where does your program need a random value?'
 },
 api_calls:{
  title:'API Calls',slug:'api_calls',
  focus:'Learn how programs request data from an online service.',
  question:'What information does your program need from the service?'
 },
 pytest:{
  title:'pytest',slug:'pytest',
  focus:'Learn to check expected results with unit tests.',
  question:'What one input and expected result could you test?'
 },
 reading_writing_files:{
  title:'Reading and Writing Files',slug:'reading_writing_files',
  focus:'Learn how to open, read, and save file data.',
  question:'What file will your program read or write?'
 },
 reading_writing_csvs:{
  title:'Reading and Writing CSVs',slug:'reading_and_writing_csvs',
  focus:'Learn how Python handles rows and columns of CSV data.',
  question:'Which columns does your program need to read or create?'
 },
 pillow:{
  title:'Pillow',slug:'pillow',
  focus:'Explore tools that can open and edit pictures in Python.',
  question:'What change does your program need to make to an image?'
 },
 patterns:{
  title:'Patterns',slug:'patterns',
  focus:'Learn how patterns find or check parts of text.',
  question:'What pattern should your program look for?'
 },
 capture_groups:{
  title:'Capture Groups',slug:'capture_groups',
  focus:'Learn how to pull pieces of text from a pattern match.',
  question:'Which part of a matching string do you need to keep?'
 },
 class_methods:{
  title:'Class Methods and Class Variables',slug:'class_methods_class_variables',
  focus:'Explore methods and values attached to a class.',
  question:'Which date-related class method might help you?'
 },
 classes:{
  title:'Classes',slug:'classes',
  focus:'Learn how a class organizes values and actions.',
  question:'What information does an object need to remember?'
 }
};

// One topic per assignment. This is intentionally independent of starter-file
// contents so updates cannot change or overwrite student work.
const ASSIGNMENT_TOPICS={
 'cs50p-0-indoor':'string_methods',
 'cs50p-0-playback':'string_methods',
 'cs50p-0-faces':'functions',
 'cs50p-0-einstein':'variables',
 'cs50p-0-tip':'return_values',
 'cs50p-1-deep':'boolean_expressions',
 'cs50p-1-bank':'conditionals',
 'cs50p-1-extensions':'conditionals',
 'cs50p-1-interpreter':'conditionals',
 'cs50p-1-meal':'return_values',
 'cs50p-2-camel':'for_loops',
 'cs50p-2-coke':'while_loops',
 'cs50p-2-twttr':'for_loops',
 'cs50p-2-plates':'boolean_expressions',
 'cs50p-2-nutrition':'dictionaries',
 'cs50p-3-fuel':'handling_exceptions',
 'cs50p-3-taqueria':'dictionaries',
 'cs50p-3-grocery':'dictionary_methods',
 'cs50p-3-outdated':'handling_exceptions',
 'cs50p-4-emojize':'packages',
 'cs50p-4-figlet':'packages',
 'cs50p-4-adieu':'lists',
 'cs50p-4-game':'random',
 'cs50p-4-professor':'random',
 'cs50p-4-bitcoin':'api_calls',
 'cs50p-5-test_twttr':'pytest',
 'cs50p-5-test_bank':'pytest',
 'cs50p-5-test_plates':'pytest',
 'cs50p-5-test_fuel':'pytest',
 'cs50p-6-lines':'reading_writing_files',
 'cs50p-6-pizza':'reading_writing_csvs',
 'cs50p-6-scourgify':'reading_writing_csvs',
 'cs50p-6-shirt':'pillow',
 'cs50p-7-numb3rs':'patterns',
 'cs50p-7-watch':'capture_groups',
 'cs50p-7-working':'patterns',
 'cs50p-7-um':'patterns',
 'cs50p-7-response':'patterns',
 'cs50p-8-seasons':'class_methods',
 'cs50p-8-jar':'classes',
 'cs50p-8-shirtificate':'classes'
};

function conceptVideoForAssignment(assignment){
 const id=typeof assignment==='string'?assignment:assignment?.id;
 const key=ASSIGNMENT_TOPICS[id];
 const topic=TOPICS[key];
 if(!topic)return null;
 return Object.freeze({
  title:topic.title,
  focus:topic.focus,
  question:topic.question,
  url:BASE+topic.slug+'/',
  source:'Harvard CS50P Shorts'
 });
}

module.exports={BASE,TOPICS,ASSIGNMENT_TOPICS,conceptVideoForAssignment};
