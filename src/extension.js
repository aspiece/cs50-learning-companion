'use strict';
const vscode=require('vscode');
const {html:renderSidebar}=require('./ui');
const {version}=require('../package.json');
const RELEASES_URL='https://github.com/aspiece/cs50-learning-companion/releases';
const {list,get,submissionPath,safeAssignment,guideForCodespace,explain,teachingGuide}=require('./core');
const utf=s=>Buffer.from(s,'utf8');
function root(){return vscode.workspace.workspaceFolders?.[0]?.uri;}
const join=(...u)=>vscode.Uri.joinPath(...u);
async function exists(uri){
 try{await vscode.workspace.fs.stat(uri);return true;}
 catch(e){if(e.code==='FileNotFound')return false;throw e;}
}
async function openStarterFiles(a){
 const directory=root()?join(root(),a.slug):null;
 if(!directory||!await exists(directory))return false;
 const guide=join(directory,'README.md');
 const script=join(directory,a.entryFile);
 // Place the instructions on the left, and the student's Python file on the right.
 // In tests assignments, entryFile is the student test file; the source file is also accessible in Explorer.
 if(await exists(guide))await vscode.window.showTextDocument(guide,{viewColumn:vscode.ViewColumn.One,preview:false,preserveFocus:true});
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
  const choice=await vscode.window.showWarningMessage('Replace this assignment README with the new Start → Learn → Test → Submit guide? A backup copy will be saved. Python code will not change.',{modal:true},'Update README');
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
async function createStarter(a){
 safeAssignment(a);
 if(!root()){vscode.window.showWarningMessage('Open a folder in your CS50 Codespace first.');return false;}
 const dir=join(root(),a.slug);
 if(await exists(dir)){
  vscode.window.showInformationMessage('Folder already exists. Opening your work without changing it.');
  await openStarterFiles(a);
  return false;
 }
 await vscode.workspace.fs.createDirectory(dir);
 for(const [name,content] of Object.entries(a.files)){
   await vscode.workspace.fs.writeFile(join(dir,name),utf(name==='README.md'?guideForCodespace(a):content));
 }
 await openStarterFiles(a);
 vscode.window.showInformationMessage('Starter ready. Read the guide, then write your own code.');
 return true;
}

class Companion {
 constructor(ctx){this.ctx=ctx;const saved=ctx.workspaceState.get('selectedAssignment');this.id=list().some(a=>a.id===saved)?saved:list()[0].id;this.hint=0;}
 resolveWebviewView(view){
  this.view=view;
  view.webview.options={enableScripts:true,localResourceRoots:[vscode.Uri.joinPath(this.ctx.extensionUri,'media')]};
  // Register the message handler before loading the page so the initial ready event is never missed.
  view.webview.onDidReceiveMessage(msg=>{void this.handle(msg);},null,this.ctx.subscriptions);
  view.webview.html=renderSidebar(view.webview,this.ctx.extensionUri);
 }
 key(){return 'progress:'+this.id;}
 async refresh(){
  if(!this.view)return;
  const a=get(this.id);
  const learning=teachingGuide(a);
  const hints=learning.hints;
  const directory=root()?join(root(),a.slug):null;
  const folderExists=directory?await exists(directory):false;
  const guideExists=folderExists?await exists(join(directory,'README.md')):false;
  const tested=list().filter(item=>this.ctx.workspaceState.get('progress:'+item.id,{})?.tested===true);
  const practicedSubjects=[...new Set(tested.map(item=>item.subject))];
  await this.view.webview.postMessage({type:'state',version,options:list().map(x=>({id:x.id,title:x.title,slug:x.slug,set:x.set})),assignment:{id:a.id,title:a.title,slug:a.slug,set:a.set,entryFile:a.entryFile,description:a.description},folderExists,guideExists,hint:this.hint,hints,learning,practice:{testedCount:tested.length,subjects:practicedSubjects},progress:this.ctx.workspaceState.get(this.key(),{})});
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
    this.id=m.id;this.hint=0;await this.ctx.workspaceState.update('selectedAssignment',this.id);await this.refresh();return;
   }
   const a=get(this.id);
   switch(m.type){
    case 'create':if(await createStarter(a)){await this.ctx.workspaceState.update(this.key(),{...this.ctx.workspaceState.get(this.key(),{}),starter:true});}await this.refresh();break;
    case 'openFiles':await openStarterFiles(a);break;
    case 'updateGuide':await updateStudentGuide(a);await this.refresh();break;
    case 'updates':await vscode.env.openExternal(vscode.Uri.parse(RELEASES_URL));break;
    case 'official':await vscode.env.openExternal(vscode.Uri.parse(a.url));break;
    case 'guide':{
      if(!root())break;
      const uri=join(root(),a.slug,'README.md');
      if(await exists(uri))await vscode.window.showTextDocument(uri);
      else vscode.window.showWarningMessage('Create the starter folder first.');
      break;
    }
    case 'hint':this.hint=Math.min(hintsCount(a),this.hint+1);await this.refresh();break;
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
    case 'learning':{
      const allowed=['support','inputNotes','outputNotes','plan','prediction','observed','reflection','debugNotes'];
      if(!allowed.includes(m.field)||typeof m.value!=='string'||m.value.length>3000)break;
      const value=m.field==='support'&& !['guided','standard','independent'].includes(m.value)?'standard':m.value;
      await this.ctx.workspaceState.update(this.key(),{...this.ctx.workspaceState.get(this.key(),{}),[m.field]:value});
      // Do not redraw the webview while a student is typing; its local input stays active.
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
 ctx.subscriptions.push(vscode.commands.registerCommand('cs50Companion.createStarter',async()=>{
  const choice=await vscode.window.showQuickPick(list().map(a=>({label:a.title,description:'Set '+a.set,id:a.id})),{placeHolder:'Choose an assignment'});
  if(choice)await createStarter(get(choice.id));
 }));
}
module.exports={activate,createStarter,openStarterFiles,updateStudentGuide};
