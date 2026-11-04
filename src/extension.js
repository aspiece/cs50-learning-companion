'use strict';
const vscode=require('vscode');
const crypto=require('node:crypto');
const {list,get,submissionPath,safeAssignment,guideForCodespace,explain}=require('./core');
const utf=s=>Buffer.from(s,'utf8');
function root(){return vscode.workspace.workspaceFolders?.[0]?.uri;}
const join=(...u)=>vscode.Uri.joinPath(...u);
async function exists(uri){
 try{await vscode.workspace.fs.stat(uri);return true;}
 catch(e){if(e.code==='FileNotFound')return false;throw e;}
}
async function createStarter(a){
 safeAssignment(a);
 if(!root()){vscode.window.showWarningMessage('Open a folder in your CS50 Codespace first.');return false;}
 const dir=join(root(),a.slug);
 if(await exists(dir)){vscode.window.showInformationMessage('The '+a.slug+' folder already exists. Your work was not changed.');return false;}
 await vscode.workspace.fs.createDirectory(dir);
 for(const [name,content] of Object.entries(a.files)){
   await vscode.workspace.fs.writeFile(join(dir,name),utf(name==='README.md'?guideForCodespace(a):content));
 }
 await vscode.window.showTextDocument(join(dir,'README.md'),{preview:false});
 vscode.window.showInformationMessage('Starter created. Read the guide and write your own code.');
 return true;
}
class Companion {
 constructor(ctx){this.ctx=ctx;this.id=list()[0].id;this.hint=0;}
 resolveWebviewView(view){
  this.view=view;
  view.webview.options={enableScripts:true};
  view.webview.html=this.html();
  view.webview.onDidReceiveMessage(msg=>{void this.handle(msg);},null,this.ctx.subscriptions);
 }
 html(){
  const nonce=crypto.randomBytes(16).toString('hex');
  return `<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';"><style nonce="${nonce}">
  body{font-family:var(--vscode-font-family);font-size:var(--vscode-font-size);color:var(--vscode-foreground);padding:8px}
  button,select{font:inherit;box-sizing:border-box;width:100%;padding:8px;margin:5px 0;border-radius:5px}
  button{background:var(--vscode-button-background);color:var(--vscode-button-foreground);border:0;cursor:pointer;text-align:left}
  button:hover{background:var(--vscode-button-hoverBackground)}
  button:focus-visible,select:focus-visible{outline:2px solid var(--vscode-focusBorder)}
  select{color:var(--vscode-input-foreground);background:var(--vscode-input-background);border:1px solid var(--vscode-input-border)}
  section{border-top:1px solid var(--vscode-panel-border);margin-top:13px;padding-top:10px}
  p,li{line-height:1.5}h2{font-size:1.08em}.muted{opacity:.8}
  .hint{background:var(--vscode-editor-inactiveSelectionBackground);padding:10px}
  .check{display:flex;align-items:start;gap:7px;margin:7px 0}.check input{margin-top:3px}
  </style></head><body><h2>CS50 Learning Companion</h2><p class="muted">Plan • Code • Test • Submit</p>
  <label for="problem">Choose an assignment</label><select id="problem"></select><div id="details" aria-live="polite"></div>
  <script nonce="${nonce}">
  const api=acquireVsCodeApi(),picker=document.getElementById('problem'),el=document.getElementById('details');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const send=(type,extra={})=>api.postMessage({type,...extra});
  picker.addEventListener('change',()=>send('select',{id:picker.value}));
  document.addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(b)send(b.dataset.action)});
  document.addEventListener('change',e=>{if(e.target.matches('input[data-step]'))send('progress',{step:e.target.dataset.step,value:e.target.checked})});
  window.addEventListener('message',e=>{const s=e.data;if(s?.type!=='state')return;
    picker.innerHTML=s.options.map(x=>'<option value="'+esc(x.id)+'">Set '+x.set+': '+esc(x.title)+'</option>').join('');
    picker.value=s.assignment.id;
    const a=s.assignment,h=s.hint,p=s.progress;
    el.innerHTML='<p>'+esc(a.description)+'</p><p class="muted">Folder: '+esc(a.slug)+'</p>'+
      '<section><h2>1. Prepare</h2><button data-action="create">Create starter files</button><button data-action="official">Open official CS50 problem</button><button data-action="guide">Open my README guide</button><p class="muted">Existing work is never overwritten.</p></section>'+
      '<section><h2>2. Plan</h2><p>Read the official problem. Decide what goes in, what changes, and what comes out.</p><button data-action="hint">Show a learning hint</button>'+(h?'<p class="hint">'+esc(s.hints[h-1])+'</p>':'')+'</section>'+
      '<section><h2>3. Test</h2><button data-action="run">Run Python in terminal</button><button data-action="check">Run check50</button><button data-action="style">Run style50</button><button data-action="explain">Explain a Python error</button></section>'+
      '<section><h2>4. Submit</h2><button data-action="submit">Submit with confirmation</button><p class="muted">Only CS50 can confirm your submission.</p></section>'+
      '<section><h2>My checklist</h2>'+[['starter','Files are ready'],['planned','I planned the code'],['tested','I tested my code'],['checked','I reviewed check50'],['submitted','I confirmed my submission with CS50']].map(([k,label])=>'<label class="check"><input data-step="'+k+'" type="checkbox" '+(p[k]?'checked':'')+'>'+label+'</label>').join('')+'<p class="muted">Progress is self-reported in this workspace.</p></section>';
  });
  send('ready');
  </script></body></html>`;
 }
 key(){return 'progress:'+this.id;}
 async refresh(){
  if(!this.view)return;
  const a=get(this.id);
  const hints=[
   'What does the program need to read or receive?',
   'Which Python concept could help? Try a small, different example.',
   'Check your plan against the official instructions before writing more code.'
  ];
  await this.view.webview.postMessage({type:'state',options:list().map(x=>({id:x.id,title:x.title,set:x.set})),assignment:{id:a.id,title:a.title,slug:a.slug,description:a.description},hint:this.hint,hints,progress:this.ctx.workspaceState.get(this.key(),{})});
 }
 async term(a,kind){
  if(!root()){vscode.window.showWarningMessage('Open a CS50 Codespace folder first.');return;}
  const dir=join(root(),a.slug);
  if(!await exists(dir)){vscode.window.showWarningMessage('Create the assignment folder first.');return;}
  const entry=a.entryFile;
  const path=submissionPath(a);
  const cmd=kind==='run'?'python '+entry:kind==='check'?'check50 '+path:kind==='style'?'style50 '+entry:'submit50 '+path;
  const term=vscode.window.createTerminal({name:'CS50 '+a.slug,cwd:dir});term.show();
  term.sendText(cmd,true);
 }
 async handle(m){
  if(!m||typeof m.type!=='string')return;
  try{
   if(m.type==='ready'){await this.refresh();return;}
   if(m.type==='select'){
    if(!list().some(a=>a.id===m.id))return;
    this.id=m.id;this.hint=0;await this.refresh();return;
   }
   const a=get(this.id);
   switch(m.type){
    case 'create':if(await createStarter(a)){await this.ctx.workspaceState.update(this.key(),{...this.ctx.workspaceState.get(this.key(),{}),starter:true});}await this.refresh();break;
    case 'official':await vscode.env.openExternal(vscode.Uri.parse(a.url));break;
    case 'guide':{
      if(!root())break;
      const uri=join(root(),a.slug,'README.md');
      if(await exists(uri))await vscode.window.showTextDocument(uri);
      else vscode.window.showWarningMessage('Create the starter folder first.');
      break;
    }
    case 'hint':this.hint=this.hint%3+1;await this.refresh();break;
    case 'run':case 'check':case 'style':await this.term(a,m.type);break;
    case 'submit':{
      const ok=await vscode.window.showWarningMessage('Submit your own work to CS50? Check the current official instructions first.',{modal:true},'Run submit50');
      if(ok==='Run submit50')await this.term(a,'submit');
      break;
    }
    case 'explain':{
      const err=await vscode.window.showInputBox({prompt:'Paste the last line of the Python error (no personal information).'});
      if(err!==undefined)await vscode.window.showInformationMessage(explain(err),{modal:true});
      break;
    }
    case 'progress':{
      if(!['starter','planned','tested','checked','submitted'].includes(m.step)||typeof m.value!=='boolean')break;
      await this.ctx.workspaceState.update(this.key(),{...this.ctx.workspaceState.get(this.key(),{}),[m.step]:m.value});
      await this.refresh();
      break;
    }
   }
  }catch(e){vscode.window.showErrorMessage('CS50 Companion: '+(e.message||String(e)));}
 }
}
function activate(ctx){
 const provider=new Companion(ctx);
 ctx.subscriptions.push(vscode.window.registerWebviewViewProvider('cs50Companion.sidebar',provider));
 ctx.subscriptions.push(vscode.commands.registerCommand('cs50Companion.createStarter',async()=>{
  const choice=await vscode.window.showQuickPick(list().map(a=>({label:a.title,description:'Set '+a.set,id:a.id})),{placeHolder:'Choose an assignment'});
  if(choice)await createStarter(get(choice.id));
 }));
}
module.exports={activate,createStarter};
