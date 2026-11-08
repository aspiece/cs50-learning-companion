'use strict';
(() => {
 const api=acquireVsCodeApi();
 const $=id=>document.getElementById(id);
 const steps=[['starter','Files ready'],['tested','Program tested'],['checked','check50 reviewed'],['submitted','Submission verified by me']];
 const tabs=['start','test','submit'];
 let currentAssignmentId=null;
 let state=null;
 const saved=api.getState()||{};
 let tab=tabs.includes(saved.tab)?saved.tab:'start';
 let query=typeof saved.query==='string'?saved.query:'';
 let setFilter=Number.isInteger(saved.set)?saved.set:-1;
 let lastDebugRequestId=0;
 let lastClipboardRequestId=0;
 let coachReason=null;
 let coachIndex=0;
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
 function resetTest(){
  $('errorInput').value='';
  $('errorAdvice').hidden=true;
  $('debugHelp').open=false;
  $('testTerminalStatus').textContent='Select Run to open a Codespaces terminal. Return here after checking the output.';
  $('testCheckStatus').textContent='Read the results in the terminal. These buttons do not submit your work or mark it correct.';
  lastDebugRequestId++;
 }
 function renderTestWorkflow(){
  if(!state)return;
  const assignment=state.assignment;
  const canRun=!!state.entryExists;
  $('runPython').textContent=assignment.set===5?'Run pytest':'Run Python';
  $('testCommand').textContent=(assignment.set===5?'pytest ':'python ')+assignment.entryFile;
  $('runPython').disabled=!canRun;
  $('runCheck50').disabled=!canRun;
  $('runStyle50').disabled=!canRun;
  $('submitProblem').disabled=!canRun;
  if(!canRun){
   $('testTerminalStatus').textContent='Create or locate your Python file in Start before running.';
  }
 }
 function handleTestTerminalStatus(message){
  if(!state||message.assignmentId!==state.assignment.id)return;
  const completed=message.status==='opened';
  if(message.kind==='run'){
   $('testTerminalStatus').textContent=completed?
    'Command sent to the Codespaces terminal. Compare the output with the examples in your README.':
    'Could not open the command. Check your assignment folder in Start.';
  }else{
   $('testCheckStatus').textContent=completed?
    (message.kind==='check'?'check50':'style50')+
    ' was sent to the terminal. Read its results there. Nothing was submitted.':
    'Could not open the command. Check your assignment folder in Start.';
  }
 }
 function requestErrorAdvice(){
  const raw=$('errorInput').value.trim();
  if(!raw){
   $('errorAdvice').hidden=false;
   $('debugTitle').textContent='Paste an error first';
   $('debugGuidance').textContent='Copy the last line of the error from the terminal, then try again.';
   $('debugLocation').textContent='';
   $('debugNext').textContent='';
   return;
  }
  const requestId=++lastDebugRequestId;
  $('errorAdvice').hidden=false;
  $('debugTitle').textContent='Reading your error…';
  $('debugGuidance').textContent='';
  $('debugLocation').textContent='';
  $('debugNext').textContent='';
  post('analyzeError',{requestId,assignmentId:state.assignment.id,errorText:raw});
 }
 function renderNextSteps(){
  const ideas=state?.coach?.nextSteps||[];
  $('nextStepsList').innerHTML=ideas.slice(0,3).map(item=>
   '<li>'+escapeHtml(item)+'</li>'
  ).join('');
 }
 function renderCoach(){
  const clues=coachReason?state?.coach?.clues?.[coachReason]||[]:[];
  $('coachClueBox').hidden=!coachReason;
  if(!coachReason)return;
  const titles={understand:'Understanding the problem',coding:'Writing Python',debug:'Debugging an error'};
  $('coachTopic').textContent=titles[coachReason]||'A small clue';
  $('coachClue').textContent=clues[coachIndex]||'Read the problem in your README and try one small step.';
  $('coachNext').disabled=coachIndex>=clues.length-1;
  $('coachNext').textContent=coachIndex>=clues.length-1?'All clues shown':'Another clue';
  $('coachDebug').hidden=coachReason!=='debug';
 }
 function setCoachReason(reason){
  if(!['understand','coding','debug'].includes(reason))return;
  coachReason=reason;
  coachIndex=0;
  renderCoach();
 }
 function toggleCoach(){
  const show=$('coachPanel').hidden;
  $('coachPanel').hidden=!show;
  $('coachToggle').textContent=show?'Close help':"I'm stuck";
  $('coachToggle').setAttribute('aria-expanded',String(show));
  if(show&&!coachReason){
   $('coachClueBox').hidden=true;
  }
 }
 function startScreenModel(folderExists,entryExists,guideExists){
  if(!folderExists)return {
   title:'Ready to begin',
   description:'Your assignment folder has not been created yet.',
   action:'create',button:'Create starter files',
   next:'Creates a folder and opens your README and Python file side by side.',
   status:'new',symbol:'○'
  };
  if(!entryExists)return {
   title:'Folder needs attention',
   description:'Your folder exists, but the main Python file is missing. Your other files are safe.',
   action:'openFolder',button:'Inspect assignment folder',
   next:'Check the files in Explorer. The Companion will not replace your work.',
   status:'attention',symbol:'!'
  };
  if(!guideExists)return {
   title:'Your code is ready',
   description:'Your Python file is here, but the README is missing.',
   action:'openFiles',button:'Continue coding',
   next:'You can create the README from More options without changing your code.',
   status:'attention',symbol:'!'
  };
  return {
   title:'Starter files ready',
   description:'Your assignment folder and Python file are here.',
   action:'openFiles',button:'Continue coding',
   next:'Opens your README and Python file side by side. Your work is not replaced.',
   status:'ready',symbol:'✓'
  };
 }
 function renderStartScreen(){
  const model=startScreenModel(state.folderExists,state.entryExists,state.guideExists);
  $('startStatus').dataset.status=model.status;
  $('startStatusTitle').textContent=model.title;
  $('startStatusDescription').textContent=model.description;
  $('startStatusIcon').textContent=model.symbol;
  $('startPrimary').textContent=model.button;
  $('startPrimary').dataset.action=model.action;
  $('startNextStep').textContent=model.next;
  $('openGuide').disabled=!state.guideExists;
  $('updateGuide').disabled=!state.folderExists;
  $('updateGuide').textContent=state.guideExists?'Update my README guide':'Create missing README guide';
  renderNextSteps();
  renderCoach();
 }
 function showTab(){
  // Keep basic navigation independent of assignment rendering. If another
  // section fails to render, students can still move between tabs.
  tabs.forEach(id=>{
   const btn=$('tab-'+id),panel=$('panel-'+id),active=id===tab;
   btn.setAttribute('aria-selected',String(active));
   btn.tabIndex=active?0:-1;
   panel.hidden=!active;
  });
 }
 function render(){
  if(!state)return;
  const a=state.assignment,p=state.progress||{};
  const changed=a.id!==currentAssignmentId;
  currentAssignmentId=a.id;
  if(changed)$('startMore').open=false;
  if(changed){
   coachReason=null;coachIndex=0;
   $('coachPanel').hidden=true;
   $('coachToggle').textContent="I'm stuck";
   $('coachToggle').setAttribute('aria-expanded','false');
   lastClipboardRequestId++;
  }
  if(changed)resetTest();
  $('heading').textContent=a.title;
  $('setTag').textContent='Problem Set '+a.set;
  $('description').textContent=a.description;
  $('folder').textContent=a.slug+'/';
  $('version').textContent='v'+state.version;
  const count=steps.filter(([key])=>p[key]===true).length;
  $('progressText').textContent=count+' of '+steps.length+' steps checked';
  $('meter').style.width=(count/steps.length*100)+'%';
  $('checks').innerHTML=steps.map(([key,label])=>'<label class="check"><input type="checkbox" data-step="'+key+'" '+(p[key]?'checked':'')+'><span>'+escapeHtml(label)+'</span></label>').join('');
  $('testIdeas').innerHTML=state.testIdeas.length?'<ul>'+state.testIdeas.map(x=>'<li>'+escapeHtml(x)+'</li>').join('')+'</ul>':'Test one ordinary case and one unusual case from the official problem instructions.';
  renderStartScreen();
  renderTestWorkflow();
  $('folderStatus').textContent=state.folderExists?'Folder found':'Not set up yet';
  applyFilters();
  showTab();
 }
 $('search').value=query;
 $('setFilter').value=String(setFilter);
 $('search').addEventListener('input',e=>{query=e.target.value;persist();applyFilters();});
 $('setFilter').addEventListener('change',e=>{setFilter=Number(e.target.value);persist();applyFilters();});
 $('problem').addEventListener('change',e=>post('select',{id:e.target.value}));
 document.addEventListener('click',e=>{
  const tabButton=e.target.closest('button[data-tab]');
  if(tabButton){tab=tabButton.dataset.tab;persist();showTab();render();return;}
  const b=e.target.closest('button[data-action]');
  if(b&&!b.disabled){
   if(b.dataset.action==='analyzeError'){requestErrorAdvice();return;}
   if(b.dataset.action==='toggleCoach'){toggleCoach();return;}
   if(b.dataset.action==='coachUnderstand'){setCoachReason('understand');return;}
   if(b.dataset.action==='coachCoding'){setCoachReason('coding');return;}
   if(b.dataset.action==='coachError'){setCoachReason('debug');return;}
   if(b.dataset.action==='coachNext'){
    const length=state?.coach?.clues?.[coachReason]?.length||0;
    if(coachIndex<length-1)coachIndex++;
    renderCoach();return;
   }
   if(b.dataset.action==='coachDebug'){
    tab='test';persist();showTab();render();
    $('debugHelp').open=true;
    $('errorInput').focus();
    return;
   }
   if(b.dataset.action==='useClipboardDebug'||b.dataset.action==='useSelectedDebug'){
    const requestId=++lastClipboardRequestId;
    $('debugHelp').open=true;
    $('errorAdvice').hidden=false;
    $('debugTitle').textContent='Getting the text you selected…';
    $('debugGuidance').textContent='';
    $('debugLocation').textContent='';
    $('debugNext').textContent='';
    post(b.dataset.action,{assignmentId:state.assignment.id,requestId});
    return;
   }
   if(b.dataset.action==='run'){
    $('errorAdvice').hidden=true;
    $('testTerminalStatus').textContent='Opening a Codespaces terminal…';
   }
   if(b.dataset.action==='check'||b.dataset.action==='style'){
    $('testCheckStatus').textContent='Opening a Codespaces terminal…';
   }
   post(b.dataset.action);
  }
 });
 document.addEventListener('change',e=>{
  if(e.target.matches('input[data-step]'))post('progress',{step:e.target.dataset.step,value:e.target.checked});
 });
 $('tabs').addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  const i=tabs.indexOf(tab);
  tab=e.key==='Home'?tabs[0]:e.key==='End'?tabs.at(-1):tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];
  persist();showTab();render();$('tab-'+tab).focus();e.preventDefault();
 });
 window.addEventListener('message',e=>{
  if(e.data?.type==='updateStatus'){updateDisplay(e.data);return;}
  if(e.data?.type==='debugText'){
   if(!state||e.data.assignmentId!==state.assignment.id||
    e.data.requestId!==lastClipboardRequestId)return;
   if(!e.data.ok){
    $('errorAdvice').hidden=false;
    $('debugTitle').textContent='No output selected';
    $('debugGuidance').textContent=e.data.error||'Copy the relevant error text first.';
    $('debugLocation').textContent='';
    $('debugNext').textContent='';
   }else{
    $('errorInput').value=e.data.text;
    $('debugHelp').open=true;
    requestErrorAdvice();
   }
   return;
  }
  if(e.data?.type==='testTerminalStatus'){handleTestTerminalStatus(e.data);return;}
  if(e.data?.type==='testDebugAdvice'){
   if(!state||e.data.assignmentId!==state.assignment.id||
    e.data.requestId!==lastDebugRequestId)return;
   $('errorAdvice').hidden=false;
   $('debugTitle').textContent=e.data.ok?e.data.advice.title:'Could not explain the error';
   $('debugGuidance').textContent=e.data.ok?e.data.advice.guidance:e.data.error;
   $('debugLocation').textContent=e.data.ok?e.data.advice.location:'';
   $('debugNext').textContent=e.data.ok?e.data.advice.next:'';
   return;
  }
  if(e.data?.type!=='state')return;
  state=e.data;render();
 });
 post('ready');
})();
