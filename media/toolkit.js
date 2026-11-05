'use strict';
(() => {
 const api=acquireVsCodeApi();
 const $=id=>document.getElementById(id);
 const saved=api.getState()||{};
 let query=typeof saved.query==='string'?saved.query:'';
 let category=['all','change','check','parts'].includes(saved.category)?saved.category:'all';
 let selected=typeof saved.selected==='string'?saved.selected:null;
 let state=null;
 let lastRequestId=0;
 const post=(type,extra={})=>api.postMessage({type,...extra});
 const persist=()=>api.setState({query,category,selected});
 const current=()=>state?.toolkit?.methods?.find(method=>method.id===selected)||null;

 function renderList(){
  if(!state)return;
  const suggestion=state.toolkit.suggestion;
  const visible=state.toolkit.methods.filter(method=>
   (category==='all'||method.category===category)&&
   [method.id,method.label,method.purpose,method.tip||''].join(' ').toLowerCase().includes(query.toLowerCase())
  );
  const list=$('methodList');
  list.replaceChildren();
  $('filterCount').textContent=visible.length+' of '+state.toolkit.methods.length+' methods';
  $('noMatches').hidden=visible.length>0;
  for(const method of visible){
   const item=document.createElement('button');
   item.type='button';
   item.className='method-option';
   item.dataset.method=method.id;
   item.setAttribute('aria-pressed',String(method.id===selected));
   const name=document.createElement('span');
   name.className='method-name';
   name.textContent=method.label;
   const purpose=document.createElement('span');
   purpose.className='method-purpose';
   purpose.textContent=method.purpose;
   item.append(name,purpose);
   if(suggestion?.category===method.category){
    const tag=document.createElement('span');
    tag.className='method-group-tag';
    tag.textContent='Explore this group';
    item.append(tag);
   }
   item.addEventListener('click',()=>selectMethod(method.id));
   list.append(item);
  }
 }

 function renderDetail(){
  const method=current();
  $('emptySelection').hidden=!!method;
  $('methodDetail').hidden=!method;
  if(!method)return;
  $('methodTitle').textContent=method.label;
  $('methodPurpose').textContent=method.purpose;
  $('methodExample').textContent=method.example;
  $('methodResult').textContent=method.result;
  $('methodTip').hidden=!method.tip;
  $('methodTip').textContent=method.tip?'Good to know: '+method.tip:'';
  for(let index=0;index<2;index++){
   const option=method.args[index],number=index+1;
   $('arg'+number+'Wrap').hidden=!option;
   if(option){
    $('arg'+number+'Label').textContent=option.label+(option.required?' (required)':'');
    $('arg'+number).placeholder=option.placeholder||'';
   }
  }
 }

 function selectMethod(id){
  if(!state?.toolkit?.methods?.some(m=>m.id===id))return;
  selected=id;
  lastRequestId++;
  $('arg1').value='';
  $('arg2').value='';
  $('runPractice').disabled=false;
  $('liveResult').dataset.error='false';
  $('liveResult').textContent='Add your own text and select Run in Python.';
  persist();
  renderList();
  renderDetail();
  $('sampleText').focus();
 }

 function practicePayload(){
  const method=current();
  if(!method)return null;
  const args=[];
  if(method.args.length>0)args.push($('arg1').value);
  if(method.args.length>1)args.push($('arg2').value);
  return {method:method.id,text:$('sampleText').value,args};
 }

 function runPractice(){
  const payload=practicePayload();
  if(!payload)return;
  const requestId=++lastRequestId;
  $('liveResult').dataset.error='false';
  $('liveResult').textContent='Running your example in Python…';
  $('runPractice').disabled=true;
  post('practiceString',{...payload,requestId});
 }
 function copyPractice(){
  const payload=practicePayload();
  if(payload)post('copyStringPractice',payload);
 }
 function showState(next){
  state=next;
  $('assignmentName').textContent='Assignment: '+next.assignment.title+
   ' · Problem Set '+next.assignment.set;
  const suggestion=next.toolkit.suggestion;
  $('suggestion').hidden=!suggestion;
  $('suggestion').textContent=suggestion?
   'For this assignment, explore: '+suggestion.label+'. '+suggestion.description:'';
  if(selected&&!next.toolkit.methods.some(method=>method.id===selected))selected=null;
  renderList();
  renderDetail();
 }

 $('methodSearch').value=query;
 $('categoryFilter').value=category;
 $('methodSearch').addEventListener('input',e=>{
  query=e.target.value;persist();renderList();
 });
 $('categoryFilter').addEventListener('change',e=>{
  category=e.target.value;persist();renderList();
 });
 $('runPractice').addEventListener('click',runPractice);
 $('copyPractice').addEventListener('click',copyPractice);
 $('openVideo').addEventListener('click',()=>post('openVideo'));
 $('openDocs').addEventListener('click',()=>post('openDocs'));
 $('sampleText').addEventListener('keydown',e=>{
  if(e.key==='Enter'){e.preventDefault();runPractice();}
 });
 window.addEventListener('message',e=>{
  const message=e.data;
  if(message?.type==='toolkitState'){showState(message);return;}
  if(message?.type==='stringPracticeResult'){
   if(message.requestId!==lastRequestId)return;
   $('runPractice').disabled=false;
   $('liveResult').dataset.error=message.ok?'false':'true';
   $('liveResult').textContent=message.ok?
    'Python returns ('+message.kind+'): '+message.value:
    'Could not run: '+message.error;
   return;
  }
  if(message?.type==='copyStatus'){
   $('liveResult').dataset.error=message.ok?'false':'true';
   $('liveResult').textContent=message.ok?
    'Example copied. Paste it into a separate practice file or terminal.':
    'Could not copy: '+message.error;
  }
 });
 post('ready');
})();
