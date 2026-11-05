'use strict';
const vscode=require('vscode');
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');

// A workspace editor webview: no student files, source editor, or journal are modified.
function toolkitHtml(webview,extensionUri){
 const nonce=crypto.randomBytes(16).toString('hex');
 const css=webview.asWebviewUri(vscode.Uri.joinPath(extensionUri,'media','toolkit.css'));
 const js=webview.asWebviewUri(vscode.Uri.joinPath(extensionUri,'media','toolkit.js'));
 const csp="default-src 'none'; style-src "+webview.cspSource+"; script-src 'nonce-"+nonce+"';";
 const template=fs.readFileSync(path.join(__dirname,'../media/toolkit.html'),'utf8');
 return template
  .replace('%%CSP%%',csp)
  .replace('%%CSS%%',String(css))
  .replace('%%JS%%',String(js))
  .replace('%%NONCE%%',nonce);
}
module.exports={toolkitHtml};
