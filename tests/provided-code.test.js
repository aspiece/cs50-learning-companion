'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const {list,get}=require('../src/core');
const baseline=require('./fixtures/cs50-provided-code.json');

test('review covers all 41 assignments and every supplied code baseline survives generation',()=>{
 assert.deepEqual(baseline.sources.map(x=>x.id).sort(),list().map(x=>x.id).sort());
 const cases=Object.entries(baseline.code).map(([key,expected])=>{
  const testFile=key==='8/jar-tests';
  const assignment=get('cs50p-'+(testFile?'8/jar':key).replace('/','-'));
  return {key,expected,actual:assignment.files[testFile?'test_jar.py':assignment.sourceFile]};
 });
 const check=String.raw`
import ast,json,re,sys
# Required statements must occur in order. Extra teacher scaffolding is allowed;
# placeholders may be replaced, but supplied executable statements may not vanish.
def placeholder(n):
 return isinstance(n,ast.Pass) or isinstance(n,ast.Expr) and isinstance(n.value,ast.Constant) and n.value.value is Ellipsis
def covers(expected,actual):
 if isinstance(expected,list):
  wanted=[n for n in expected if not isinstance(n,ast.AST) or not placeholder(n)]
  pos=0
  for node in wanted:
   while pos<len(actual) and not covers(node,actual[pos]):pos+=1
   if pos==len(actual):return False
   pos+=1
  return True
 if isinstance(expected,ast.AST):
  return type(expected) is type(actual) and all(covers(v,getattr(actual,k)) for k,v in ast.iter_fields(expected))
 return expected==actual
for item in json.load(sys.stdin):
 source=re.sub(r'^( +)# TODO$',r'\1pass',item['expected'],flags=re.M)
 assert covers(ast.parse(source),ast.parse(item['actual'])),item['key']+' lost supplied code'
`;
 const result=spawnSync('python3',['-c',check],{input:JSON.stringify(cases),encoding:'utf8'});
 assert.equal(result.status,0,result.stderr||result.error?.message);
});

test('Nutrition supplies the complete FDA calorie dictionary, without implementing lookup',()=>{
 const a=get('cs50p-2-nutrition');
 const result=spawnSync('python3',['-c',String.raw`
import ast,json,sys
code=ast.parse(sys.stdin.read())
assert len(code.body)==1 and isinstance(code.body[0],ast.Assign), 'Leave input and lookup to students'
assert code.body[0].targets[0].id=='calories'
print(json.dumps(ast.literal_eval(code.body[0].value)))
`],{input:a.files['nutrition.py'],encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);
 assert.deepEqual(JSON.parse(result.stdout),{
  apple:130,avocado:50,banana:110,cantaloupe:50,grapefruit:60,grapes:90,
  'honeydew melon':50,kiwifruit:90,lemon:15,lime:20,nectarine:60,orange:80,
  peach:60,pear:100,pineapple:50,plums:70,strawberries:50,'sweet cherries':100,
  tangerine:50,watermelon:80
 });
 assert.match(a.files['README.md'],/supplied fruit-calorie dictionary/);
});
