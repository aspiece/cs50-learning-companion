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
 function render(){
  if(!state)return;
  const a=state.assignment,p=state.progress||{};
  const changed=a.id!==currentAssignmentId||!!state.forceNotes;
  currentAssignmentId=a.id;
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
 document.addEventListener('click',e=>{
  const tabButton=e.target.closest('button[data-tab]');
  if(tabButton){tab=tabButton.dataset.tab;persist();render();return;}
  const b=e.target.closest('button[data-action]');
  if(b&&!b.disabled)post(b.dataset.action);
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
  if(e.data?.type==='journalSaved'){
   $('journalStatus').textContent=journalStatusMessage(e.data.status);
   return;
  }
  if(e.data?.type!=='state')return;
  state=e.data;render();
 });
 post('ready');
})();
