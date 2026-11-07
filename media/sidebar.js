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
 let stringCategory='all';
 let selectedStringMethod=null;
 let lastStringRequestId=0;
 let lastDebugRequestId=0;
 let lastClipboardRequestId=0;
 let coachReason=null;
 let coachIndex=0;
 let previousSupportLevel=null;
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
 function renderCodehsLesson(){
  const lesson=state?.learning?.codehsLesson;
  $('codehsSupport').hidden=!lesson;
  $('openCodehsLesson').disabled=!lesson;
  $('openCodehsLesson').textContent=lesson?'CodeHS: '+lesson.title:'No matched CodeHS lesson';
  $('codehsCourseNote').textContent=lesson?
   'Related lesson from '+lesson.source+'. Opens in your browser.':'';
 }
 function renderStringToolkit(){
  const toolkit=state?.learning?.stringToolkit;
  if(!toolkit)return;
  const suggested=toolkit.suggestion;
  $('stringSuggestion').hidden=!suggested;
  $('stringSuggestion').textContent=suggested?
   'For this problem, explore: '+suggested.label+'. '+suggested.description:'';
  const matches=toolkit.methods.filter(method=>
   (stringCategory==='all'||method.category===stringCategory)&&
   [method.label,method.purpose,method.category,method.tip||''].join(' ').toLowerCase().includes(stringQuery.toLowerCase())
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
    (method.tip?'<p class="method-tip">Good to know: '+escapeHtml(method.tip)+'</p>':'')+
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
 function resetTestReview(){
  $('testOutcome').value='';
  $('errorInput').value='';
  $('errorAdvice').hidden=true;
  $('debugHelp').open=false;
  $('testTerminalStatus').textContent='Select Run to open a Codespaces terminal. Return here after checking the output.';
  $('testCheckStatus').textContent='Read the results in the terminal. These buttons do not submit your work or mark it correct.';
  lastDebugRequestId++;
 }
 function renderTestGuidance(){
  const choice=$('testOutcome').value;
  const messages={
   expected:'You reported that this test worked. Try a different input, then use check50. This is not an automatic grade.',
   different:'Compare expected and actual output. Find one step to change, then run again.',
   error:'Open Debug one thing below. Paste the last error line, read the clue, then try again.'
  };
  $('testNext').textContent=messages[choice]||
   'After running, choose what happened above. This is your report, not an automatic grade.';
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
  if(!canRun){
   $('testTerminalStatus').textContent='Create or locate your Python file in Start before running.';
  }
  renderTestGuidance();
 }
 function handleTestTerminalStatus(message){
  if(!state||message.assignmentId!==state.assignment.id)return;
  const completed=message.status==='opened';
  if(message.kind==='run'){
   $('testTerminalStatus').textContent=completed?
    'Command sent to the Codespaces terminal. Read the output, then choose what happened in Step 2.':
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
  $('openFiles').disabled=!state.folderExists||!state.entryExists;
  $('updateGuide').disabled=!state.folderExists;
  $('updateGuide').textContent=state.guideExists?'Update my README guide':'Create missing README guide';
  renderNextSteps();
  renderCoach();
 }
 const supportModes={
  guided:{
   title:'Getting Started — step-by-step',
   description:'Work through questions about the input and output, follow a planning guide, and use optional hints or a CS50 concept video.',
   includes:'Includes: guiding questions · detailed planning steps · visible hints · concept video'
  },
  standard:{
   title:'Some Help — light guidance',
   description:'Write your own plan with a small reminder. Hints are available when you choose to open them.',
   includes:'Includes: one short planning prompt · optional hints · reference tools'
  },
  independent:{
   title:'Independent — challenge yourself',
   description:'Start from the official problem instructions, choose your own approach, and test it. Support stays available if you need it.',
   includes:'Includes: self-directed checklist · optional plan · help available on request'
  }
 };
 function renderSupportLevel(level,assignmentChanged){
  const mode=supportModes[level]||supportModes.standard;
  const changed=level!==previousSupportLevel||assignmentChanged;
  previousSupportLevel=level;
  $('supportSummary').dataset.level=level;
  $('supportTitle').textContent=mode.title;
  $('supportDescription').textContent=mode.description;
  $('supportIncludes').textContent=mode.includes;
  $('independentChallenge').hidden=level!=='independent';
  $('guidedQuestions').hidden=level!=='guided';
  $('questions').hidden=level!=='guided';
  $('steps').hidden=level!=='guided';
  $('planHeading').textContent=level==='guided'?'2. Make a plan':
   level==='independent'?'My own approach (optional)':'Make your own plan';
  $('planGuidance').textContent=level==='guided'?
   'Use the steps above to write your own plan before you start coding.':
   level==='independent'?
   'No steps are given here. Write a plan only if it helps you think.':
   'What should happen first, next, and last? Write a short plan in your own words.';
  $('hintSummary').textContent=level==='guided'?
   '3. Get unstuck — step-by-step hints':'Need a hint? Open optional help';
  if(changed)$('hintCard').open=level==='guided';
  const video=state.learning.conceptVideo;
  $('conceptVideoCard').hidden=level!=='guided'||!video;
  $('openConceptVideo').disabled=!video;
  $('conceptVideoTitle').textContent=video?.title||'';
  $('conceptVideoFocus').textContent=video?.focus||'';
  $('conceptVideoQuestion').textContent=video?('After watching: '+video.question):'';
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
  const changed=a.id!==currentAssignmentId||!!state.forceNotes;
  currentAssignmentId=a.id;
  if(changed){lastStringRequestId++;$('stringPracticeResult').textContent='Choose a method and try your own text.';$('tryStringMethod').disabled=false;}
  if(changed)$('startMore').open=false;
  if(changed){
   coachReason=null;coachIndex=0;
   $('coachPanel').hidden=true;
   $('coachToggle').textContent="I'm stuck";
   $('coachToggle').setAttribute('aria-expanded','false');
   lastClipboardRequestId++;
  }
  if(changed)resetTestReview();
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
  renderSupportLevel($('support').value,changed);
  renderCodehsLesson();
  renderStringToolkit();
  renderStartScreen();
  renderTestWorkflow();
  $('folderStatus').textContent=state.folderExists?'Folder found':'Not set up yet';
  $('openJournal').disabled=!state.folderExists;
  $('editJournal').disabled=!state.folderExists;
  $('reloadJournal').disabled=!state.folderExists;
  $('journalStatus').textContent=journalStatusMessage(state.journalStatus);
  $('runPython').textContent=a.set===5?'Run pytest':'Run Python';
  applyFilters();
  showTab();
 }
 $('search').value=query;
 $('setFilter').value=String(setFilter);
 $('search').addEventListener('input',e=>{query=e.target.value;persist();applyFilters();});
 $('setFilter').addEventListener('change',e=>{setFilter=Number(e.target.value);persist();applyFilters();});
 $('problem').addEventListener('change',e=>post('select',{id:e.target.value}));
 $('stringSearch').addEventListener('input',e=>{stringQuery=e.target.value;renderStringToolkit();});
 $('stringCategory').addEventListener('change',e=>{stringCategory=e.target.value;renderStringToolkit();});
 $('testOutcome').addEventListener('change',e=>{
  if(e.target.value==='different'||e.target.value==='error'){
   $('testReviewDetails').open=true;
   $('debugHelp').open=true;
  }
  renderTestGuidance();
 });
 document.addEventListener('click',e=>{
  const tabButton=e.target.closest('button[data-tab]');
  if(tabButton){tab=tabButton.dataset.tab;persist();showTab();render();return;}
  const choose=e.target.closest('button[data-select-string]');
  if(choose){chooseStringMethod(choose.dataset.selectString);return;}
  const b=e.target.closest('button[data-action]');
  if(b&&!b.disabled){
   if(b.dataset.action==='practiceString'){tryStringPractice();return;}
   if(b.dataset.action==='copyStringPractice'){copyStringPractice();return;}
   if(b.dataset.action==='goLearn'){tab='learn';persist();showTab();render();$('tab-learn').focus();return;}
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
    $('testReviewDetails').open=true;
    $('debugHelp').open=true;
    $('errorInput').focus();
    return;
   }
   if(b.dataset.action==='useClipboardDebug'||b.dataset.action==='useSelectedDebug'){
    const requestId=++lastClipboardRequestId;
    $('testReviewDetails').open=true;
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
    $('testOutcome').value='';
    $('errorAdvice').hidden=true;
    $('testTerminalStatus').textContent='Opening a Codespaces terminal…';
    renderTestGuidance();
   }
   if(b.dataset.action==='check'||b.dataset.action==='style'){
    $('testCheckStatus').textContent='Opening a Codespaces terminal…';
   }
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
  persist();showTab();render();$('tab-'+tab).focus();e.preventDefault();
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
    $('testReviewDetails').open=true;
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
  if(e.data?.type==='journalSaved'){
   $('journalStatus').textContent=journalStatusMessage(e.data.status);
   return;
  }
  if(e.data?.type!=='state')return;
  state=e.data;render();
 });
 post('ready');
})();
