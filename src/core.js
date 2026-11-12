'use strict';
const {createHash}=require('node:crypto');
const legacyGuideHashes=require('../content/legacy-guide-hashes.json');
// This library is copied from aspiece/python-lab; it contains original, unsolved starters.
global.window=global.window||{};
require('../content/cs50p-starters.js');
const catalog=global.window.pythonLabCS50P;
const {codehsLessonForAssignment}=require('./codehs-lessons');
const {conceptVideoForAssignment}=require('./concept-videos');
const CS50_GRADEBOOK='https://cs50.me/cs50p';
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

const runArguments={
 'cs50p-4-bitcoin':'2',
 'cs50p-6-lines':'lines.py',
 'cs50p-6-pizza':'regular.csv',
 'cs50p-6-scourgify':'before.csv after.csv',
 'cs50p-6-shirt':'before1.jpg after1.jpg'
};
const packages={
 emojize:'emoji',figlet:'pyfiglet',adieu:'inflect',bitcoin:'requests',
 pizza:'tabulate',shirt:'Pillow',response:'validators',seasons:'inflect',shirtificate:'fpdf2'
};
const setupNotes={
 bitcoin:'Get a CoinCap API key and follow Harvard’s CoinCap v3 instructions. Keep your key private and out of files you submit.',
 lines:'The sample command uses lines.py as its own input file. You can also try a second Python file in this folder.',
 shirt:'For the sample command, run `unzip muppets.zip` there to get before1.jpg.',
 shirtificate:'After running your code, open shirtificate.pdf in Explorer to inspect it. Leave the PDF out of your submission.'
};
const setTwoExamples={
 camel:['Type `firstName`. Expect `first_name`.','Type `name`. Expect `name`.'],
 coke:['Enter `25` and `25` on separate lines. Expect `Change Owed: 0`.','Enter `25`, `10`, `10`, then `10`. Expect `Change Owed: 5`.'],
 twttr:['Type `Twitter`. Expect `Twttr`.','Type `CS50!`. Expect `CS50!`.'],
 plates:['Type `CS50`. Expect `Valid`.','Type `CS05`. Expect `Invalid`.'],
 nutrition:['Type `apple`. Expect `Calories: 130`.','Type `banana bread`. Expect no calorie output.']
};

function assignmentCommands(a){
 safeAssignment(a);
 const testFile=Object.keys(a.files).find(name=>/^test_.*\.py$/.test(name));
 const pytest=testFile?'pytest '+testFile:null;
 const args=runArguments[a.id];
 return {
  run:a.set===5?pytest:'python '+a.entryFile+(args?' '+args:''),
  test:a.set===5?null:pytest,
  testFile
 };
}

function guideHash(text){return createHash('sha256').update(text).digest('hex');}

function isGeneratedGuide(a,text){
 if(legacyGuideHashes[a.id]?.includes(guideHash(text)))return true;
 const header=/^<!-- gci-cs50-guide (cs50p-[0-8]-[a-z0-9_]+) ([a-f0-9]{64}) -->\n/.exec(text);
 return Boolean(header&&header[1]===a.id&&header[2]===guideHash(text.slice(header[0].length)));
}

function guideForCodespace(a){
 safeAssignment(a);
 const base=a.files['README.md']||'';
 const guide=teachingGuide(a);
 const codehs=codehsLessonForAssignment(a);
 const cs50Video=conceptVideoForAssignment(a);
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
 const tests=[...(details.checks||guide.checks.slice(0,3)),
  ...(a.set===2?setTwoExamples[a.slug]:[])];
 const {run,test:testCommand,testFile}=assignmentCommands(a);
 const check='check50 '+submissionPath(a);
 const submit='submit50 '+submissionPath(a);
 const extra=a.extraFiles||[];
 const filesBlock=extra.map(file=>'- ['+code(file.name)+']('+file.url+') — '+file.kind);
 const setup=[
  ...(packages[a.slug]?['If Python says a package is missing, run '+code('python -m pip install '+packages[a.slug])+' in the Codespaces terminal.']:[]),
  ...(extra.length?['**Needed files:** Save these in the same Codespaces folder as '+code(a.entryFile)+'.\n\n'+filesBlock.join('\n')]:[]),
  ...(setupNotes[a.slug]?[setupNotes[a.slug]]:[]),
  ...(a.set===5?['If you finished the earlier problem, copy its '+code(a.sourceFile)+' into this test folder and adapt it to the function rules on Harvard’s page. If you need a fresh start, use the scaffold here.']:[])
 ];
 const thought=details.thought?['**Think about it:** '+details.thought,'']:[];
 const helpLevel=a.set<=1?'Getting started':a.set<=3?'Build the algorithm':a.set<=5?'Use the required interfaces':'Plan independently';
 const starterGuidance={
  'cs50p-5-test_fuel':'Test both returned values and the exceptions the two functions must raise.',
  'cs50p-7-working':'Keep convert(s) as the required interface. Any additional helper is your choice.',
  'cs50p-8-seasons':'Harvard requires at least one function besides main(). Choose its name and test it in test_seasons.py.',
  'cs50p-8-jar':'Use the exact Jar methods and parameter names shown on Harvard\'s page.',
  'cs50p-8-shirtificate':'A PDF subclass and header override are optional design choices, not requirements.'
 };
 const startHint=a.set<=1?'The starter includes a first action. Find the TODOs and make one small change.':
  a.set<=3?'Read the TODOs, then plan the loop or condition before writing it.':
  a.set<=5?'Use the required function signatures and write the core logic yourself.':
  'Plan the implementation from the official requirements. The starter only provides essential structure.';
 const body=[
  '# '+a.title,'',
  '**CS50P · Problem Set '+a.set+'**  ',
  '**Python file'+(fileNames.length===1?'':'s')+':** '+fileNames.map(code).join(', '),'',
  '## The problem','',
  details.goal||mission,'',
  '**Your task:**','',
  ...numbered(steps),'',
  '**'+helpLevel+':** '+startHint,
  ...(starterGuidance[a.id]?['', '**Important:** '+starterGuidance[a.id]]:[]),
  '',
  ...thought,
  '**Full instructions:** [Harvard CS50P problem, examples, and hints]('+a.url+').',
  'This is a student-friendly summary. Harvard’s page has the exact rules and special cases.','',
  ...(setup.length?['**Before you run**','',setup.join('\n\n'),'']:[]),
  '## Test your program','',
  ...bullet(tests),
  ...(testFile?[
   '- In '+code(testFile)+', replace each '+code('pytest.skip(...)')+' with a meaningful '+code('assert')+' or '+code('pytest.raises(...)')+' check.',
   '- A skipped test does not show that the code is correct. Include a normal case, a boundary case, and an invalid case when appropriate.'
  ]:[]),'',
  'Try an ordinary input and one unusual input. Compare the result with Harvard’s examples.','',
  '## Need help? (optional)','',
  ...(codehs?['- [CodeHS: '+codehs.title+']('+codehs.url+') — a related Python lesson overview.']:[]),
  ...(cs50Video?['- [CS50P short: '+cs50Video.title+']('+cs50Video.url+') — an official concept lesson.']:[]),
  '- [Harvard’s full problem page]('+a.url+') — official instructions, any provided hints, and demo.',
  '- Choose **I’m stuck** in the Companion for a clue about this problem.','',
  '## Check and submit','',
  'Run: '+code(run)+'.',
  ...(testCommand?['Run your tests: '+code(testCommand)+'.']:[]),
  'Check: '+code(check)+'.',
  'Submit: '+code(submit)+'.',
  'Read any errors, make one change, and test again.','',
  '**[Check my official CS50P submission status]('+CS50_GRADEBOOK+')** — sign in with the GitHub account you used for CS50.',
  'The Companion cannot read your gradebook or confirm your submission.',
  'Only send the files Harvard requests. Leave out this guide and any old Learning Journal.','',
  '*Based on Harvard CS50P problem specifications. Summary and support text adapted for GCI students; [Harvard CS50P license (CC BY-NC-SA 4.0)](https://cs50.harvard.edu/python/license/). This is not an official Harvard publication.*',
  ''
 ].join('\n');
 return '<!-- gci-cs50-guide '+a.id+' '+guideHash(body)+' -->\n'+body;
}

module.exports={list,get,submissionPath,safeAssignment,guideForCodespace,isGeneratedGuide,assignmentCommands,teachingGuide,CS50_GRADEBOOK};
