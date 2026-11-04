'use strict';

// Short, original practice examples. The method list is reference material;
// examples deliberately do not implement a CS50P assignment solution.
const METHODS=Object.freeze([
 {id:'lower',label:'.lower()',category:'change',purpose:'Make letters lowercase.',example:'"Good Morning".lower()',result:"'good morning'",args:[]},
 {id:'upper',label:'.upper()',category:'change',purpose:'Make letters uppercase.',example:'"good night".upper()',result:"'GOOD NIGHT'",args:[]},
 {id:'capitalize',label:'.capitalize()',category:'change',purpose:'Capitalize the first letter and make the rest lowercase.',example:'"hELLO WORLD".capitalize()',result:"'Hello world'",args:[]},
 {id:'title',label:'.title()',category:'change',purpose:'Capitalize the start of each word.',example:'"blue sky".title()',result:"'Blue Sky'",args:[]},
 {id:'strip',label:'.strip()',category:'change',purpose:'Remove spaces from both ends.',example:'"  garden  ".strip()',result:"'garden'",args:[],tip:'Use lstrip() or rstrip() to clean just one end.'},
 {id:'lstrip',label:'.lstrip(chars)',category:'change',purpose:'Remove spaces or chosen characters from the start.',example:'"$$balance".lstrip("$")',result:"'balance'",args:[{label:'Characters to remove (optional)',placeholder:'Leave blank to remove spaces',required:false}],tip:'The argument is a set of characters, not an exact starting word.'},
 {id:'rstrip',label:'.rstrip(chars)',category:'change',purpose:'Remove spaces or chosen characters from the end.',example:'"discount%%%".rstrip("%")',result:"'discount'",args:[{label:'Characters to remove (optional)',placeholder:'Leave blank to remove spaces',required:false}],tip:'The argument is a set of characters, not an exact ending word.'},
 {id:'replace',label:'.replace(old, new)',category:'change',purpose:'Replace matching text with new text.',example:'"red bike".replace("red", "blue")',result:"'blue bike'",args:[{label:'Find this text',placeholder:'red',required:true},{label:'Replace it with',placeholder:'blue',required:false}]},
 {id:'split',label:'.split()',category:'parts',purpose:'Break text into a list of pieces.',example:'"red blue".split()',result:"['red', 'blue']",args:[{label:'Separator (optional)',placeholder:'Leave blank for spaces',required:false}]},
 {id:'startswith',label:'.startswith(prefix)',category:'check',purpose:'Check whether text begins with something.',example:'"Python".startswith("Py")',result:'True',args:[{label:'Beginning to check',placeholder:'Py',required:true}]},
 {id:'endswith',label:'.endswith(suffix)',category:'check',purpose:'Check whether text ends with something.',example:'"picture.png".endswith(".png")',result:'True',args:[{label:'Ending to check',placeholder:'.png',required:true}]},
 {id:'isupper',label:'.isupper()',category:'check',purpose:'Check whether letters are all uppercase.',example:'"NASA".isupper()',result:'True',args:[]},
 {id:'isalpha',label:'.isalpha()',category:'check',purpose:'Check whether every character is a letter.',example:'"Robotics".isalpha()',result:'True',args:[]},
 {id:'isalnum',label:'.isalnum()',category:'check',purpose:'Check whether every character is a letter or number.',example:'"Team2137".isalnum()',result:'True',args:[]},
 {id:'isdigit',label:'.isdigit()',category:'check',purpose:'Check whether every character is a digit.',example:'"2048".isdigit()',result:'True',args:[],tip:'Some special digit symbols also pass this check. Compare isdecimal().'},
 {id:'isdecimal',label:'.isdecimal()',category:'check',purpose:'Check whether every character is a decimal digit.',example:'"123".isdecimal()',result:'True',args:[],tip:'Try ²: isdigit() returns True, while isdecimal() returns False.'}
]);

const CATEGORIES=Object.freeze({
 change:{label:'Changing text',description:'Explore methods that change or clean up text.'},
 check:{label:'Checking text',description:'Explore methods that test text and return True or False.'},
 parts:{label:'Breaking up text',description:'Explore methods that split text into pieces.'}
});

// Suggestions name a *family* of methods, not an assignment answer.
const SUGGESTED_GROUPS=Object.freeze({
 'cs50p-0-indoor':'change',
 'cs50p-0-playback':'change',
 'cs50p-0-faces':'change',
 'cs50p-1-deep':'change',
 'cs50p-1-bank':'check',
 'cs50p-1-extensions':'check',
 'cs50p-1-interpreter':'parts',
 'cs50p-2-camel':'change',
 'cs50p-2-twttr':'check',
 'cs50p-2-plates':'check',
 'cs50p-2-nutrition':'change',
 'cs50p-3-outdated':'parts',
 'cs50p-7-watch':'parts',
 'cs50p-7-working':'parts',
 'cs50p-7-response':'check'
});
const VALID_METHODS=Object.freeze(Object.fromEntries(METHODS.map(method=>[method.id,method])));
const LESSON_URL='https://cs50.harvard.edu/python/shorts/string_methods/';
const DOCS_URL='https://docs.python.org/3/library/stdtypes.html#string-methods';

function toolkitForAssignment(a){
 const id=typeof a==='string'?a:a?.id;
 const category=SUGGESTED_GROUPS[id]||null;
 const suggestion=category?{category,...CATEGORIES[category]}:null;
 return {methods:METHODS,suggestion};
}
function validatePracticeRequest(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Choose a string method to practice.');
 const method=VALID_METHODS[input.method];
 if(!method)throw Error('Choose one of the sixteen string methods.');
 if(typeof input.text!=='string'||input.text.length>200)throw Error('Practice text must be at most 200 characters.');
 if(!Array.isArray(input.args)||input.args.length!==method.args.length||
  input.args.some(arg=>typeof arg!=='string'||arg.length>100))throw Error('Check the practice options.');
 if(method.args.some((arg,index)=>arg.required&&!input.args[index].length))
  throw Error('Fill in the required method option.');
 return {method:method.id,text:input.text,args:input.args};
}

function practiceSnippet(input){
 const {method,text,args}=validatePracticeRequest(input);
 const repr=value=>JSON.stringify(value);
 let params=args.map(repr);
 if(['split','lstrip','rstrip'].includes(method)&&args[0]==='')params=[];
 return 'print('+repr(text)+'.'+method+'('+params.join(', ')+'))';
}

module.exports={
 METHODS,CATEGORIES,SUGGESTED_GROUPS,LESSON_URL,DOCS_URL,
 toolkitForAssignment,validatePracticeRequest,practiceSnippet
};
