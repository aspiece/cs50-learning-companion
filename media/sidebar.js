'use strict';
(() => {
 const api=acquireVsCodeApi();
 const $=id=>document.getElementById(id);
 const steps=[['starter','Files ready'],['planned','Plan written'],['tested','Program tested'],['checked','check50 reviewed'],['submitted','Submission verified by me']];
 const tabs=['start','learn','test','submit'];
 const fields=['support','inputNotes','outputNotes','plan','prediction','observed','reflection','debugNotes'];
 let currentAssignmentId=null;
 const noteTimers=new Map();
 const lastSent=new Map();
 let state=null;
 const saved=api.getState()||{};
 let tab=tabs.includes(saved.tab)?saved.tab:'start';
 let query=typeof saved.query==='string'?saved.query:'';
 let setFilter=Number.isInteger(saved.set)?saved.set:-1;
 let stringQuery='';
 let selectedStringMethod=null;
 let lastStringRequestId=0;
 const escapeHtml=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function persist(){api.setState({tab,query,set:setFilter});}
 function post(type,extra={}){api.postMessage({type,...extra});}
 function updateDisplay(message){
  if(!message)return;
  const state=message.state;
  const descriptions={
   idle:'Update status: not checked yet.',
   checking:'Checking for new versions...',
   current:'You have the latest companion version (v'+(message.installed||'?')+').',
   available:'Update available: v'+message.latest+'. Installed: v'+message.installed+'.',
   installing:'Installing the verified update v'+message.latest+'...',
   installed:'Update v'+message.latest+' installed. Reload Codespaces to use it.',
   manual:'Update v'+message.latest+' verified. Install the saved VSIX using the Extensions menu.',
   error:'Update check failed: '+(message.message||'Please try again later.')
  };
  $('updateStatus').textContent=descriptions[state]||'Check for updates when you are ready.';
  $('checkUpdate').disabled=state==='checking'||state==='installing';
  $('checkUpdate').textContent=state==='available'?'Install v'+message.latest:'Check for updates';
 }
 function journalStatusMessage(status){
  if(status==='saved')return 'Saved to LEARNING_JOURNAL.md in this assignment folder.';
  if(status==='pending')return 'Notes are stored in this Codespace for now. Create starter files to make the journal.';
  return 'This folder already has a journal in a different format. The Companion will not overwrite it.';
 }
 function sendLearning(element){
  if(!state)return;
  const id=state.assignment.id,field=element.dataset.field,value=element.value;
  const key=id+':'+field;
  if(lastSent.get(key)===value)return;
  lastSent.set(key,value);
  $('journalStatus').textContent='Saving your notes...';
  post('learning',{id,field,value});
 }
 function scheduleLearning(element,immediate=false){
  const id=state?.assignment.id,field=element.dataset.field;
  if(!id||!field)return;
  const key=id+':'+field;
  if(noteTimers.has(key))clearTimeout(noteTimers.get(key));
  noteTimers.delete(key);
  if(immediate){sendLearning(element);return;}
  const value=element.value;
  noteTimers.set(key,setTimeout(()=>{
   noteTimers.delete(key);
   if(lastSent.get(key)===value)return;
   lastSent.set(key,value);
   post('learning',{id,field,value});
  },650));
 }
 function applyFilters(){
  if(!state)return;
  const options=state.options.filter(a=>(setFilter<0||a.set===setFilter)&&[a.title,a.slug,String(a.set)].join(' ').toLowerCase().includes(query.toLowerCase()));
  const select=$('problem');
  const chosen=state.assignment.id;
  // Keep the current selection visible even when the search query excludes it.
  if(!options.some(x=>x.id===chosen)){options.unshift(state.options.find(x=>x.id===chosen));}
  select.innerHTML=options.map(a=>'<option value="'+escapeHtml(a.id)+'">'+escapeHtml('Set '+a.set+' · '+a.title)+'</option>').join('');
  select.value=chosen;
  $('results').textContent=options.length+' assignment'+(options.length===1?'':'s')+' shown';
 }
 function currentStringMethod(){
  const methods=state?.learning?.stringToolkit?.methods||[];
  return methods.find(item=>item.id===selectedStringMethod)||null;
 }
 function stringPracticePayload(){
  const method=currentStringMethod();
  if(!method)return null;
  const args=[];
  if(method.args.length>0)args.push($('stringArg1').value);
  if(method.args.length>1)args.push($('stringArg2').value);
  return {method:method.id,text:$('stringPracticeText').value,args};
 }
 function renderStringToolkit(){
  const toolkit=state?.learning?.stringToolkit;
  if(!toolkit)return;
  const suggested=toolkit.suggestion;
  $('stringSuggestion').hidden=!suggested;
  $('stringSuggestion').textContent=suggested?
   'For this problem, explore: '+suggested.label+'. '+suggested.description:'';
  const matches=toolkit.methods.filter(method=>
   [method.label,method.purpose,method.category].join(' ').toLowerCase().includes(stringQuery.toLowerCase())
  );
  $('stringNoResults').hidden=matches.length>0;
  $('stringMethodList').innerHTML=matches.map(method=>{
   const recommended=!!suggested&&method.category===suggested.category;
   return '<details class="method-entry" data-string-method="'+escapeHtml(method.id)+'"'+
    (method.id===selectedStringMethod?' open':'')+'>'+
    '<summary><code>'+escapeHtml(method.label)+'</code>'+
    (recommended?'<span class="method-recommended">Explore this group</span>':'')+
    '<span class="method-purpose">'+escapeHtml(method.purpose)+'</span></summary>'+
    '<p>Example</p><pre><code>'+escapeHtml(method.example)+'</code></pre>'+
    '<p>Python returns</p><pre><code>'+escapeHtml(method.result)+'</code></pre>'+
    '<button class="button secondary" type="button" data-select-string="'+escapeHtml(method.id)+'">Try this method</button>'+
    '</details>';
  }).join('');
  const method=currentStringMethod();
  $('stringPracticeBox').hidden=!method;
  if(!method)return;
  $('stringSelectedMethod').textContent='Selected: '+method.label+' — '+method.purpose;
  for(let i=0;i<2;i++){
   const arg=method.args[i],index=i+1;
   $('stringArg'+index+'Wrap').hidden=!arg;
   if(arg){
    $('stringArg'+index+'Label').textContent=arg.label+(arg.required?' (required)':'');
    $('stringArg'+index).placeholder=arg.placeholder||'';
   }
  }
 }
 function chooseStringMethod(id){
  const methods=state?.learning?.stringToolkit?.methods||[];
  if(!methods.some(m=>m.id===id))return;
  selectedStringMethod=id;
  lastStringRequestId++;
  $('stringArg1').value='';
  $('stringArg2').value='';
  $('stringPracticeResult').textContent='Add your own text, then run this method.';
  $('stringPracticeResult').dataset.error='false';
  $('tryStringMethod').disabled=false;
  renderStringToolkit();
  $('stringPracticeText').focus();
 }
 function tryStringPractice(){
  const payload=stringPracticePayload();
  if(!payload)return;
  const requestId=++lastStringRequestId;
  $('stringPracticeResult').dataset.error='false';
  $('stringPracticeResult').textContent='Running your example with Python...';
  $('tryStringMethod').disabled=true;
  post('practiceString',{...payload,requestId});
 }
 function copyStringPractice(){
  const payload=stringPracticePayload();
  if(payload)post('copyStringPractice',payload);
 }
 function render(){
  if(!state)return;
  const a=state.assignment,p=state.progress||{};
  const changed=a.id!==currentAssignmentId||!!state.forceNotes;
  currentAssignmentId=a.id;
  if(changed){lastStringRequestId++;$('stringPracticeResult').textContent='Choose a method and try your own text.';$('tryStringMethod').disabled=false;}
  $('heading').textContent=a.title;
  $('setTag').textContent='Problem Set '+a.set;
  $('description').textContent=a.description;
  $('folder').textContent=a.slug+'/';
  $('version').textContent='v'+state.version;
  const count=steps.filter(([key])=>p[key]===true).length;
  $('progressText').textContent=count+' of '+steps.length+' steps checked';
  $('meter').style.width=(count/steps.length*100)+'%';
  $('checks').innerHTML=steps.map(([key,label])=>'<label class="check"><input type="checkbox" data-step="'+key+'" '+(p[key]?'checked':'')+'><span>'+escapeHtml(label)+'</span></label>').join('');
  $('hint').hidden=!state.hint;
  $('hint').textContent=state.hint?state.hints[state.hint-1]:'';
  $('hintNumber').textContent=state.hint?('Hint '+state.hint+' of '+state.hints.length):'Show a hint';
  $('hintNumber').disabled=state.hint>=state.hints.length;
  if(state.hint>=state.hints.length)$('hintNumber').textContent='All hints shown';
  $('questions').innerHTML='<ul>'+state.learning.understand.map(x=>'<li>'+escapeHtml(x)+'</li>').join('')+'</ul>';
  $('steps').innerHTML='<p>Use these ideas to make your own plan:</p><ol>'+state.learning.steps.map(x=>'<li>'+escapeHtml(x)+'</li>').join('')+'</ol>';
  $('testIdeas').innerHTML=state.learning.checks.length?'<ul>'+state.learning.checks.map(x=>'<li>'+escapeHtml(x)+'</li>').join('')+'</ul>':'Test one ordinary case and one unusual case from the official problem instructions.';
  $('practiceSummary').textContent='Practice so far: '+state.practice.testedCount+' problems marked tested'+(state.practice.subjects.length?' · Topics: '+state.practice.subjects.join(', '):'')+'. This is practice, not proof of mastery.';
  if(changed){
   for(const field of fields){
    const element=$(field);
    lastSent.delete(a.id+':'+field);
    if(element)element.value=p[field]??(field==='support'?'standard':'');
   }
  }
  const level=$('support').value;
  $('guidedQuestions').hidden=level==='independent';
  $('questions').hidden=level!=='guided';
  $('steps').hidden=level==='independent';
  renderStringToolkit();
  const video=state.learning.conceptVideo;
  $('conceptVideoCard').hidden=level!=='guided'||!video;
  $('openConceptVideo').disabled=!video;
  $('conceptVideoTitle').textContent=video?.title||'';
  $('conceptVideoFocus').textContent=video?.focus||'';
  $('conceptVideoQuestion').textContent=video?('After watching: '+video.question):'';
  $('create').textContent=state.folderExists?'Starter folder already exists':'Create starter files';
  $('create').disabled=!!state.folderExists;
  $('openGuide').disabled=!state.guideExists;
  $('openFiles').disabled=!state.folderExists;
  $('updateGuide').disabled=!state.folderExists;
  $('folderStatus').textContent=state.folderExists?'Folder found':'Not set up yet';
  $('openJournal').disabled=!state.folderExists;
  $('editJournal').disabled=!state.folderExists;
  $('reloadJournal').disabled=!state.folderExists;
  $('journalStatus').textContent=journalStatusMessage(state.journalStatus);
  $('entry').textContent=a.entryFile;
  $('runPython').textContent=a.set===5?'Run pytest':'Run Python';
  applyFilters();
  tabs.forEach(id=>{
   const btn=$('tab-'+id),panel=$('panel-'+id),active=id===tab;
   btn.setAttribute('aria-selected',String(active));btn.tabIndex=active?0:-1;panel.hidden=!active;
  });
 }
 $('search').value=query;
 $('setFilter').value=String(setFilter);
 $('search').addEventListener('input',e=>{query=e.target.value;persist();applyFilters();});
 $('setFilter').addEventListener('change',e=>{setFilter=Number(e.target.value);persist();applyFilters();});
 $('problem').addEventListener('change',e=>post('select',{id:e.target.value}));
 $('stringSearch').addEventListener('input',e=>{stringQuery=e.target.value;renderStringToolkit();});
 document.addEventListener('click',e=>{
  const tabButton=e.target.closest('button[data-tab]');
  if(tabButton){tab=tabButton.dataset.tab;persist();render();return;}
  const choose=e.target.closest('button[data-select-string]');
  if(choose){chooseStringMethod(choose.dataset.selectString);return;}
  const b=e.target.closest('button[data-action]');
  if(b&&!b.disabled){
   if(b.dataset.action==='practiceString'){tryStringPractice();return;}
   if(b.dataset.action==='copyStringPractice'){copyStringPractice();return;}
   post(b.dataset.action);
  }
 });
 document.addEventListener('input',e=>{
  if(e.target.matches('textarea[data-field]'))scheduleLearning(e.target);
 });
 document.addEventListener('change',e=>{
  if(e.target.matches('input[data-step]'))post('progress',{step:e.target.dataset.step,value:e.target.checked});
  if(e.target.matches('[data-field]')){
   scheduleLearning(e.target,true);
   if(e.target.id==='support')render();
  }
 });
 document.addEventListener('focusout',e=>{
  if(e.target.matches('textarea[data-field]'))scheduleLearning(e.target,true);
 });
 $('tabs').addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  const i=tabs.indexOf(tab);
  tab=e.key==='Home'?tabs[0]:e.key==='End'?tabs.at(-1):tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];
  persist();render();$('tab-'+tab).focus();e.preventDefault();
 });
 window.addEventListener('message',e=>{
  if(e.data?.type==='updateStatus'){updateDisplay(e.data);return;}
  if(e.data?.type==='stringPracticeResult'){
   if(e.data.requestId!==lastStringRequestId)return;
   $('tryStringMethod').disabled=false;
   $('stringPracticeResult').dataset.error=e.data.ok?'false':'true';
   $('stringPracticeResult').textContent=e.data.ok?
    'Python returns ('+e.data.kind+'): '+e.data.value:
    'Could not run: '+e.data.error;
   return;
  }
  if(e.data?.type==='journalSaved'){
   $('journalStatus').textContent=journalStatusMessage(e.data.status);
   return;
  }
  if(e.data?.type!=='state')return;
  state=e.data;render();
 });
 post('ready');
})();
