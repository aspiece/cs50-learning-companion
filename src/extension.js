'use strict';
const vscode=require('vscode');
const {html:renderSidebar}=require('./ui');
const {version}=require('../package.json');
const RELEASES_URL='https://github.com/aspiece/cs50-learning-companion/releases';
const {list,get,submissionPath,safeAssignment,guideForCodespace,explain,teachingGuide}=require('./core');
const {FILENAME,createJournal,parseJournal,updateJournal}=require('./journal');
const updater=require('./updater');
const utf=s=>Buffer.from(s,'utf8');
const shellQuote=s=>"'"+String(s).replace(/'/g,"'\\''")+"'";
function root(){return vscode.workspace.workspaceFolders?.[0]?.uri;}
const join=(...u)=>vscode.Uri.joinPath(...u);
async function exists(uri){
 try{await vscode.workspace.fs.stat(uri);return true;}
 catch(e){if(e.code==='FileNotFound')return false;throw e;}
}
async function ensureJournal(a,oldNotes={}){
 const dir=root()?join(root(),a.slug):null;
 if(!dir||!await exists(dir))return {status:'pending',notes:{}};
 const uri=join(dir,FILENAME);
 if(!await exists(uri)){
  await vscode.workspace.fs.writeFile(uri,utf(createJournal(a,oldNotes)));
 }
 const doc=await vscode.workspace.openTextDocument(uri);
 const notes=parseJournal(doc.getText());
 if(!notes)return {status:'unmanaged',notes:{}};
 return {status:'saved',notes};
}
async function writeJournalField(a,field,value,oldNotes){
 const journal=await ensureJournal(a,oldNotes);
 if(journal.status==='pending')return 'pending';
 if(journal.status==='unmanaged')throw new Error('The existing LEARNING_JOURNAL.md does not use the GCI format. It was not overwritten.');
 const uri=join(root(),a.slug,FILENAME);
 const doc=await vscode.workspace.openTextDocument(uri);
 const previous=doc.getText();
 const next=updateJournal(previous,field,value);
 if(next!==previous){
  const edit=new vscode.WorkspaceEdit();
  edit.replace(uri,new vscode.Range(doc.positionAt(0),doc.positionAt(previous.length)),next);
  if(!await vscode.workspace.applyEdit(edit))throw new Error('Could not update the Learning Journal.');
  if(!await doc.save())throw new Error('Could not save the Learning Journal.');
 }
 return 'saved';
}
async function openFormattedMarkdown(uri,viewColumn=vscode.ViewColumn.One){
 // Open the real Markdown preview editor directly in the requested pane.
 // This avoids leaving a raw README or journal tab in front of the preview.
 try{
  await vscode.commands.executeCommand(
   'vscode.openWith',uri,'vscode.markdown.preview.editor',
   {viewColumn,preview:false,preserveFocus:false}
  );
  return true;
 }catch(error){
  // Older Codespaces versions may not expose the preview editor type.
  // Try the classic built-in Markdown command before falling back to text.
  await vscode.window.showTextDocument(uri,{viewColumn,preview:false});
  try{
   await vscode.commands.executeCommand('markdown.showPreview',uri,undefined,{locked:true});
   return true;
  }catch(fallbackError){
   vscode.window.showWarningMessage('Markdown preview is unavailable here. Showing the text file instead.');
   return false;
  }
 }
}
async function openStarterFiles(a){
 const directory=root()?join(root(),a.slug):null;
 if(!directory||!await exists(directory))return false;
 const guide=join(directory,'README.md');
 const script=join(directory,a.entryFile);
 // Place the instructions on the left, and the student's Python file on the right.
 // In tests assignments, entryFile is the student test file; the source file is also accessible in Explorer.
 if(await exists(guide))await openFormattedMarkdown(guide,vscode.ViewColumn.One);
 if(await exists(script))await vscode.window.showTextDocument(script,{viewColumn:vscode.ViewColumn.Two,preview:false});
 return true;
}
async function updateStudentGuide(a){
 safeAssignment(a);
 if(!root()){vscode.window.showWarningMessage('Open your CS50 Codespace workspace first.');return false;}
 const dir=join(root(),a.slug);
 if(!await exists(dir)){vscode.window.showWarningMessage('Create the assignment folder first.');return false;}
 const readme=join(dir,'README.md');
 const next=utf(guideForCodespace(a));
 if(await exists(readme)){
  const current=await vscode.workspace.fs.readFile(readme);
  if(Buffer.compare(Buffer.from(current),next)===0){
   vscode.window.showInformationMessage('Your README already uses the latest learning guide.');
   await openStarterFiles(a);
   return false;
  }
  const choice=await vscode.window.showWarningMessage('Replace this README with the shorter Your Goal → Build It → Test It → Check It → Submit guide? A backup will be saved. Your Python code and Learning Journal will not change.',{modal:true},'Update README');
  if(choice!=='Update README')return false;
  // Preserve the previous version in the same folder before writing a new guide.
  let n=1,backup;
  do{backup=join(dir,'README.backup-'+n+'.md');n++;}while(await exists(backup));
  await vscode.workspace.fs.writeFile(backup,current);
 }
 await vscode.workspace.fs.writeFile(readme,next);
 await openStarterFiles(a);
 vscode.window.showInformationMessage('Student README updated. Your Python files were not changed.');
 return true;
}
async function createStarter(a,previousNotes={}){
 safeAssignment(a);
 if(!root()){vscode.window.showWarningMessage('Open a folder in your CS50 Codespace first.');return false;}
 const dir=join(root(),a.slug);
 if(await exists(dir)){
  await ensureJournal(a,previousNotes);
  vscode.window.showInformationMessage('Folder already exists. Your code was not changed.');
  await openStarterFiles(a);
  return false;
 }
 await vscode.workspace.fs.createDirectory(dir);
 for(const [name,content] of Object.entries(a.files)){
   await vscode.workspace.fs.writeFile(join(dir,name),utf(name==='README.md'?guideForCodespace(a):content));
 }
 await ensureJournal(a,previousNotes);
 await openStarterFiles(a);
 vscode.window.showInformationMessage('Starter ready. Read the guide, then write your own code.');
 return true;
}

class Companion {
 constructor(ctx){this.ctx=ctx;const saved=ctx.workspaceState.get('selectedAssignment');this.id=list().some(a=>a.id===saved)?saved:list()[0].id;this.hint=0;this.journalWrites=Promise.resolve();this.updateStatus={state:'idle'};this.updateReady=null;this.updateBusy=false;this.updateChecked=false;}
 resolveWebviewView(view){
  this.view=view;
  view.webview.options={enableScripts:true,localResourceRoots:[vscode.Uri.joinPath(this.ctx.extensionUri,'media')]};
  // Register the message handler before loading the page so the initial ready event is never missed.
  view.webview.onDidReceiveMessage(msg=>{void this.handle(msg);},null,this.ctx.subscriptions);
  view.webview.html=renderSidebar(view.webview,this.ctx.extensionUri);
 }

 async sendUpdateStatus(next){
  this.updateStatus=next;
  if(this.view)await this.view.webview.postMessage({type:'updateStatus',...next});
 }
 async checkUpdates(silent=false){
  if(this.updateBusy)return;
  this.updateBusy=true;
  try{
   await this.sendUpdateStatus({state:'checking'});
   const release=await updater.checkForUpdate(version);
   this.updateReady=release;
   if(!release){
    await this.sendUpdateStatus({state:'current',installed:version});
    if(!silent)vscode.window.showInformationMessage('GCI CS50 Companion v'+version+' is up to date.');
    return;
   }
   await this.sendUpdateStatus({state:'available',installed:version,latest:release.version});
   if(silent)return;
   const choice=await vscode.window.showInformationMessage(
    'GCI CS50 Companion v'+release.version+' is available (installed: v'+version+'). Install the verified update now?',
    {modal:true},'Install update'
   );
   if(choice!=='Install update')return;
   await this.sendUpdateStatus({state:'installing',latest:release.version});
   const folder=this.ctx.globalStorageUri.fsPath;
   const file=await updater.downloadVerified(release,folder);
   try{
    await updater.installWithCodeCLI(file);
   }catch(error){
    await this.sendUpdateStatus({state:'manual',latest:release.version});
    const action=await vscode.window.showWarningMessage(
     'The update was downloaded and verified, but VS Code could not install it automatically. Use Extensions → … → Install from VSIX and choose: '+file,
     'Copy VSIX path','Open Extensions'
    );
    if(action==='Copy VSIX path')await vscode.env.clipboard.writeText(file);
    if(action==='Open Extensions')await vscode.commands.executeCommand('workbench.view.extensions');
    return;
   }
   await this.sendUpdateStatus({state:'installed',latest:release.version});
   const action=await vscode.window.showInformationMessage(
    'GCI CS50 Companion v'+release.version+' installed. Reload Codespaces to start using it.',
    'Reload now','Later'
   );
   if(action==='Reload now')await vscode.commands.executeCommand('workbench.action.reloadWindow');
  }catch(error){
   const message=(error&&error.message?error.message:String(error)).slice(0,450);
   await this.sendUpdateStatus({state:'error',message});
   if(!silent)vscode.window.showWarningMessage('Could not check or install GCI updates: '+message+' You can keep using your current version.');
  }finally{this.updateBusy=false;}
 }

 key(){return 'progress:'+this.id;}
 async refresh(forceNotes=false){
  if(!this.view)return;
  await this.journalWrites.catch(()=>{});
  const a=get(this.id);
  const learning=teachingGuide(a);
  const hints=learning.hints;
  const directory=root()?join(root(),a.slug):null;
  const folderExists=directory?await exists(directory):false;
  const guideExists=folderExists?await exists(join(directory,'README.md')):false;
  const stored=this.ctx.workspaceState.get(this.key(),{});
  const journal=await ensureJournal(a,stored);
  const progress=journal.status==='saved'?{...stored,...journal.notes}:stored;
  const tested=list().filter(item=>this.ctx.workspaceState.get('progress:'+item.id,{})?.tested===true);
  const practicedSubjects=[...new Set(tested.map(item=>item.subject))];
  await this.view.webview.postMessage({type:'state',version,options:list().map(x=>({id:x.id,title:x.title,slug:x.slug,set:x.set})),assignment:{id:a.id,title:a.title,slug:a.slug,set:a.set,entryFile:a.entryFile,description:a.description},folderExists,guideExists,journalStatus:journal.status,forceNotes,hint:this.hint,hints,learning,practice:{testedCount:tested.length,subjects:practicedSubjects},progress});
 }
 async term(a,kind){
  if(!root()){vscode.window.showWarningMessage('Open a CS50 Codespace folder first.');return;}
  const dir=join(root(),a.slug);
  if(!await exists(dir)){vscode.window.showWarningMessage('Create the assignment folder first.');return;}
  const entry=a.entryFile;
  const path=submissionPath(a);
  const cmd=kind==='run'?(a.set===5?'pytest '+entry:'python '+entry):
   kind==='style'?'style50 '+entry:
   'bash '+shellQuote(join(this.ctx.extensionUri,'src','clean-cs50-command.sh').fsPath)+' '+
   shellQuote(kind==='check'?'check50':'submit50')+' '+shellQuote(path);
  const term=vscode.window.createTerminal({name:'CS50 '+a.slug,cwd:dir});term.show();
  term.sendText(cmd,true);
 }
 async handle(m){
  if(!m||typeof m.type!=='string')return;
  try{
   if(m.type==='ready'){
    await this.refresh();
    await this.sendUpdateStatus(this.updateStatus);
    if(!this.updateChecked){this.updateChecked=true;void this.checkUpdates(true);}
    if(!this.initialPreviewOpened){
     this.initialPreviewOpened=true;
     const selected=get(this.id);
     if(root()&&await exists(join(root(),selected.slug)))await openStarterFiles(selected);
    }
    return;
   }
   if(m.type==='select'){
    if(!list().some(a=>a.id===m.id))return;
    await this.journalWrites.catch(()=>{});
    this.id=m.id;this.hint=0;await this.ctx.workspaceState.update('selectedAssignment',this.id);await this.refresh();
    if(root()&&await exists(join(root(),get(this.id).slug)))await openStarterFiles(get(this.id));
    return;
   }
   const a=get(this.id);
   switch(m.type){
    case 'create':if(await createStarter(a,this.ctx.workspaceState.get(this.key(),{}))){await this.ctx.workspaceState.update(this.key(),{...this.ctx.workspaceState.get(this.key(),{}),starter:true});}await this.refresh();break;
    case 'openFiles':await openStarterFiles(a);break;
    case 'openJournal':{
     const info=await ensureJournal(a,this.ctx.workspaceState.get(this.key(),{}));
     if(info.status==='pending'){vscode.window.showWarningMessage('Create the assignment folder first.');break;}
     await openFormattedMarkdown(join(root(),a.slug,FILENAME),vscode.ViewColumn.One);
     break;
    }
    case 'editJournal':{
     const info=await ensureJournal(a,this.ctx.workspaceState.get(this.key(),{}));
     if(info.status==='pending'){vscode.window.showWarningMessage('Create the assignment folder first.');break;}
     await vscode.window.showTextDocument(join(root(),a.slug,FILENAME),{viewColumn:vscode.ViewColumn.One,preview:false});
     break;
    }
    case 'reloadJournal':await this.refresh(true);break;
    case 'updateGuide':await updateStudentGuide(a);await this.refresh();break;
    case 'checkUpdate':await this.checkUpdates(false);break;
    case 'updates':await vscode.env.openExternal(vscode.Uri.parse(RELEASES_URL));break;
    case 'official':await vscode.env.openExternal(vscode.Uri.parse(a.url));break;
    case 'guide':{
      if(!root())break;
      const uri=join(root(),a.slug,'README.md');
      if(await exists(uri))await openFormattedMarkdown(uri,vscode.ViewColumn.One);
      else vscode.window.showWarningMessage('Create the starter folder first.');
      break;
    }
    case 'hint':this.hint=Math.min(hintsCount(a),this.hint+1);await this.refresh();break;
    case 'run':case 'check':case 'style':await this.term(a,m.type);break;
    case 'submit':{
      const ok=await vscode.window.showWarningMessage('Submit your own work to CS50? The extension will use a temporary copy without the Learning Journal or generated README. Check the file list CS50 shows before you confirm.',{modal:true},'Run submit50');
      if(ok==='Run submit50')await this.term(a,'submit');
      break;
    }
    case 'explain':{
      const err=await vscode.window.showInputBox({prompt:'Paste the last line of the Python error (no personal information).'});
      if(err!==undefined)await vscode.window.showInformationMessage(explain(err),{modal:true});
      break;
    }
    case 'learning':{
      const allowed=['support','inputNotes','outputNotes','plan','prediction','observed','reflection','debugNotes'];
      if(!allowed.includes(m.field)||typeof m.value!=='string'||m.value.length>3000)break;
      const target=list().some(item=>item.id===m.id)?get(m.id):a;
      const targetKey='progress:'+target.id;
      const value=m.field==='support'&&!['guided','standard','independent'].includes(m.value)?'standard':m.value;
      const task=async()=>{
       const saved=this.ctx.workspaceState.get(targetKey,{});
       const next={...saved,[m.field]:value};
       await this.ctx.workspaceState.update(targetKey,next);
       return writeJournalField(target,m.field,value,next);
      };
      this.journalWrites=this.journalWrites.then(task,task);
      const status=await this.journalWrites;
      if(this.view&&target.id===this.id)await this.view.webview.postMessage({type:'journalSaved',status});
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
function hintsCount(a){return teachingGuide(a).hints.length;}
function activate(ctx){
 const provider=new Companion(ctx);
 ctx.subscriptions.push(vscode.window.registerWebviewViewProvider('cs50Companion.sidebar',provider));
 ctx.subscriptions.push(vscode.commands.registerCommand('cs50Companion.openReleases',()=>vscode.env.openExternal(vscode.Uri.parse(RELEASES_URL))));
 ctx.subscriptions.push(vscode.commands.registerCommand('cs50Companion.checkForUpdates',()=>provider.checkUpdates(false)));
 ctx.subscriptions.push(vscode.commands.registerCommand('cs50Companion.createStarter',async()=>{
  const choice=await vscode.window.showQuickPick(list().map(a=>({label:a.title,description:'Set '+a.set,id:a.id})),{placeHolder:'Choose an assignment'});
  if(choice)await createStarter(get(choice.id),ctx.workspaceState.get('progress:'+choice.id,{}));
 }));
}
module.exports={activate,createStarter,openStarterFiles,updateStudentGuide,ensureJournal,writeJournalField,openFormattedMarkdown};
