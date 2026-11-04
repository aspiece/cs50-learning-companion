'use strict';
(() => {
 const api=acquireVsCodeApi();
 const $=id=>document.getElementById(id);
 const steps=[['starter','Files ready'],['planned','Plan written'],['tested','Program tested'],['checked','check50 reviewed'],['submitted','Submission verified by me']];
 const tabs=['start','learn','test','submit'];
 const fields=['support','inputNotes','outputNotes','plan','prediction','observed','reflection','debugNotes'];
 let currentAssignmentId=null;
 let state=null;
 const saved=api.getState()||{};
 let tab=tabs.includes(saved.tab)?saved.tab:'start';
 let query=typeof saved.query==='string'?saved.query:'';
 let setFilter=Number.isInteger(saved.set)?saved.set:-1;
 const escapeHtml=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function persist(){api.setState({tab,query,set:setFilter});}
 function post(type,extra={}){api.postMessage({type,...extra});}
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
  const changed=a.id!==currentAssignmentId;
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
   for(const field of fields){const element=$(field);if(element)element.value=p[field]??(field==='support'?'standard':'');}
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
 document.addEventListener('change',e=>{
  if(e.target.matches('input[data-step]'))post('progress',{step:e.target.dataset.step,value:e.target.checked});
  if(e.target.matches('[data-field]')){
   post('learning',{field:e.target.dataset.field,value:e.target.value});
   if(e.target.id==='support')render();
  }
 });
 // Only transmit completed edits (change/blur), not individual keystrokes.
 document.addEventListener('focusout',e=>{
  if(e.target.matches('textarea[data-field]'))post('learning',{field:e.target.dataset.field,value:e.target.value});
 });
 $('tabs').addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  const i=tabs.indexOf(tab);
  tab=e.key==='Home'?tabs[0]:e.key==='End'?tabs.at(-1):tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];
  persist();render();$('tab-'+tab).focus();e.preventDefault();
 });
 window.addEventListener('message',e=>{
  if(e.data?.type!=='state')return;
  state=e.data;render();
 });
 post('ready');
})();
