'use strict';
const vscode=require('vscode');
const crypto=require('node:crypto');
function html(webview,extensionUri){
 const nonce=crypto.randomBytes(16).toString('hex');
 const css=webview.asWebviewUri(vscode.Uri.joinPath(extensionUri,'media','sidebar.css'));
 const js=webview.asWebviewUri(vscode.Uri.joinPath(extensionUri,'media','sidebar.js'));
 const csp=`default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';`;
 return `<!doctype html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<link rel="stylesheet" href="${css}">
<title>CS50 Learning Companion</title></head>
<body>
<header><h1>CS50 Companion</h1><span id="version" class="version" aria-label="Installed version"></span></header>
<div class="stack">
 <div><label for="search" class="eyebrow">Find an assignment</label>
 <div class="searchrow"><input id="search" type="search" placeholder="Search all 41 problems" aria-label="Search assignments">
 <select id="setFilter" aria-label="Filter by problem set">
 <option value="-1">All sets</option>
 ${Array.from({length:9},(_,i)=>`<option value="${i}">Set ${i}</option>`).join('')}
 </select></div></div>
 <div><label for="problem" class="eyebrow">Choose a problem</label><select id="problem" aria-label="Choose assignment"></select>
 <small id="results" aria-live="polite"></small></div>
</div>
<div class="assignment">
 <div class="eyebrow" id="setTag"></div>
 <h2 id="heading"></h2>
 <p id="description"></p>
 <p><span class="folder" id="folder"></span> · <span id="folderStatus"></span></p>
</div>
<nav id="tabs" class="tabs" role="tablist" aria-label="Assignment steps">
 <button id="tab-start" type="button" class="tab" role="tab" aria-controls="panel-start" aria-selected="true" data-tab="start">Start</button>
 <button id="tab-learn" type="button" class="tab" role="tab" aria-controls="panel-learn" aria-selected="false" data-tab="learn">Learn</button>
 <button id="tab-test" type="button" class="tab" role="tab" aria-controls="panel-test" aria-selected="false" data-tab="test">Test</button>
 <button id="tab-submit" type="button" class="tab" role="tab" aria-controls="panel-submit" aria-selected="false" data-tab="submit">Submit</button>
</nav>
<section id="panel-start" class="panel" role="tabpanel" aria-labelledby="tab-start">
 <h2>Get started</h2>
 <p>Read the problem. Make your files. Then write your own code.</p>
 <button class="button" type="button" id="create" data-action="create">Create starter files</button>
 <button class="button secondary" type="button" id="openFiles" data-action="openFiles">Open README and Python file</button>
 <button class="button secondary" type="button" data-action="official">Read official instructions</button>
 <button class="button secondary" type="button" id="openGuide" data-action="guide">Open student guide</button>
 <p class="note">Your existing assignment folder will not be overwritten.</p>
</section>
<section id="panel-learn" class="panel" role="tabpanel" aria-labelledby="tab-learn" hidden>
 <h2>Learn to solve the problem</h2>
 <label class="eyebrow" for="support">How much guidance do you want?</label>
 <select id="support" data-field="support">
 <option value="guided">Getting started — more help</option>
 <option value="standard">Some help</option>
 <option value="independent">Independent — less help</option>
 </select>
 <div id="guidedQuestions" class="card">
 <h2>1. Understand</h2>
 <div id="questions"></div>
 <label for="inputNotes">What goes into the program?</label>
 <textarea id="inputNotes" data-field="inputNotes" rows="2" maxlength="3000" placeholder="My program receives..."></textarea>
 <label for="outputNotes">What should come out?</label>
 <textarea id="outputNotes" data-field="outputNotes" rows="2" maxlength="3000" placeholder="The result should..."></textarea>
 </div>
 <div class="card">
 <h2>2. Make a plan</h2>
 <div id="steps" class="note"></div>
 <label for="plan">My steps or pseudocode</label>
 <textarea id="plan" data-field="plan" rows="4" maxlength="3000" placeholder="First... Then... Finally..."></textarea>
 </div>
 <div class="card">
 <h2>3. Get unstuck</h2>
 <p>Think it through first. Use a hint only when you need one.</p>
 <button class="button secondary" type="button" data-action="hint" id="hintNumber">Show a hint</button>
 <div class="tip" id="hint" aria-live="polite" hidden></div>
 </div>
 <p class="note">Your notes are saved in this Codespace's extension storage, not sent to CS50.</p>
</section>
<section id="panel-test" class="panel" role="tabpanel" aria-labelledby="tab-test" hidden>
 <h2>Try your program</h2>
 <p>Run <span class="folder" id="entry"></span> in your Codespace terminal.</p>
 <div class="card">
 <h2>Predict, then test</h2>
 <p>Choose an input. What do you think your program will print?</p>
 <label for="prediction">My prediction</label>
 <textarea id="prediction" data-field="prediction" rows="2" maxlength="3000" placeholder="I expect..."></textarea>
 </div>
 <div class="card" id="testIdeasCard"><h2>Try these test ideas</h2><div id="testIdeas" class="note"></div></div>
 <button class="button" type="button" data-action="run">Run Python</button>
 <div class="card">
 <label for="observed">What really happened?</label>
 <textarea id="observed" data-field="observed" rows="2" maxlength="3000" placeholder="The terminal showed..."></textarea>
 <p>Compare your prediction with the actual result. What needs to change?</p>
 </div>
 <div class="actions">
 <button class="button secondary" type="button" data-action="check">Run check50</button>
 <button class="button secondary" type="button" data-action="style">Run style50</button></div>
 <button class="button link" type="button" data-action="explain">Explain a Python error</button>
 <p class="note">Debugging routine: read the error, locate the line, then change and test one thing.</p>
 <div class="card">
 <label for="debugNotes">My debugging notes</label>
 <textarea id="debugNotes" data-field="debugNotes" rows="2" maxlength="3000" placeholder="The error means... I'll check..."></textarea>
 </div>
 <p class="note">check50 and style50 show their results in the terminal.</p>
</section>
<section id="panel-submit" class="panel" role="tabpanel" aria-labelledby="tab-submit" hidden>
 <h2>Ready to submit?</h2>
 <div class="card"><p>Check your official problem page and required files. Run check50 first, then use submit50 with your own CS50 account.</p></div>
 <div class="card">
 <h2>Reflect</h2>
 <label for="reflection">What did you learn, and how did you know the code worked?</label>
 <textarea id="reflection" data-field="reflection" rows="3" maxlength="3000" placeholder="I learned... I tested..."></textarea>
 </div>
 <button class="button" type="button" data-action="submit">Open submit50 in terminal</button>
 <p class="note">Only CS50 can confirm a submission. Your checklist does not send work to Harvard.</p>
</section>
<section class="progress" aria-label="Personal progress">
 <div class="eyebrow">My progress</div>
 <p id="progressText" class="note">0 of 5 steps checked</p>
 <div class="meter" role="presentation"><div id="meter" class="meter-fill" style="width:0%"></div></div>
 <div id="checks"></div>
 <p class="note">These checkmarks are saved in this workspace and are self-reported.</p>
 <p id="practiceSummary" class="note" aria-live="polite"></p>
</section>
<footer><button type="button" data-action="updates">View releases and updates</button></footer>
<script nonce="${nonce}" src="${js}"></script>
</body></html>`;
}
module.exports={html};
