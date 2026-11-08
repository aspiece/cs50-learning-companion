'use strict';
const vscode=require('vscode');
const crypto=require('node:crypto');
const stringMethods=require('./string-methods');

function escapeText(value){
 return value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

function renderStringMethods(){
 return stringMethods.map(({label,purpose,example,result,tip})=>`
  <details class="string-method">
   <summary><code>${escapeText(label)}</code> <span>${escapeText(purpose)}</span></summary>
   <pre><code>${escapeText(example)}</code></pre>
   <p>Returns <code>${escapeText(result)}</code></p>
   ${tip?`<p class="note">${escapeText(tip)}</p>`:''}
  </details>`).join('');
}
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
 <details class="quiet-details" id="assignmentFilters"><summary>Search and filter assignments</summary><div><label for="search" class="eyebrow">Find an assignment</label>
 <div class="searchrow"><input id="search" type="search" placeholder="Search all 41 problems" aria-label="Search assignments">
 <select id="setFilter" aria-label="Filter by problem set">
 <option value="-1">All sets</option>
 ${Array.from({length:9},(_,i)=>`<option value="${i}">Set ${i}</option>`).join('')}
 </select></div></div></details>
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
 <button id="tab-test" type="button" class="tab" role="tab" aria-controls="panel-test" aria-selected="false" data-tab="test">Test</button>
 <button id="tab-submit" type="button" class="tab" role="tab" aria-controls="panel-submit" aria-selected="false" data-tab="submit">Submit</button>
</nav>
<section id="panel-start" class="panel" role="tabpanel" aria-labelledby="tab-start">
 <h2>Start your assignment</h2>
 <div id="startStatus" class="start-status" role="status" aria-live="polite">
  <span id="startStatusIcon" class="start-status-icon" aria-hidden="true">○</span>
  <div>
   <p id="startStatusTitle" class="start-status-title">Ready to begin</p>
   <p id="startStatusDescription" class="note">Create your starter files to begin.</p>
  </div>
 </div>
 <button class="button start-primary" id="startPrimary" type="button" data-action="create">Create starter files</button>
 <p id="startNextStep" class="note start-next-step">Opens your README and Python file side by side.</p>
 <div class="start-quick-actions" aria-label="Assignment support">
  <button class="button secondary" id="openGuide" type="button" data-action="guide">Read README</button>
  <button class="button secondary" id="coachToggle" type="button" data-action="toggleCoach" aria-expanded="false" aria-controls="coachPanel">I'm stuck</button>
 </div>
 <div class="coach-panel" id="coachPanel" hidden>
  <h3>What do you need help with?</h3>
  <div class="coach-choices" role="group" aria-label="Choose one kind of help">
   <button type="button" class="button secondary" id="coachUnderstand" data-action="coachUnderstand">Understanding the problem</button>
   <button type="button" class="button secondary" id="coachCoding" data-action="coachCoding">Writing Python</button>
   <button type="button" class="button secondary" id="coachError" data-action="coachError">Debugging an error</button>
  </div>
  <div id="coachClueBox" class="coach-clue" hidden aria-live="polite">
   <strong id="coachTopic"></strong>
   <p id="coachClue"></p>
   <button id="coachNext" class="button secondary" type="button" data-action="coachNext">Another clue</button>
   <button id="coachDebug" class="button link" type="button" data-action="coachDebug" hidden>Open error helper</button>
  </div>
  <details class="quiet-details" id="stringLookup" hidden>
   <summary>Look up Python string methods</summary>
   <label for="stringSearch">Find a method</label>
   <input id="stringSearch" type="search" placeholder="Try lowercase, spaces, or split">
   <p class="note" id="stringLookupStatus" role="status"></p>
   <div id="stringMethodList">${renderStringMethods()}</div>
  </details>
  <p class="note">One clue at a time. No finished solutions or changes to your code.</p>
 </div>
 <details id="startMore" class="start-more">
  <summary>More options</summary>
  <div class="start-more-actions">
   <button class="button link" type="button" data-action="official">Open official CS50 instructions</button>
   <button class="button secondary" id="updateGuide" type="button" data-action="updateGuide">Update my README guide</button>
  </div>
  <p class="note">Updating the README asks for permission and saves a backup. Your Python work stays unchanged.</p>
 </details>
</section>
<section id="panel-test" class="panel" role="tabpanel" aria-labelledby="tab-test" hidden>
 <h2>Test and debug your program</h2>
 <p class="note test-intro">Run your program and compare its output with the examples in your README.</p>
 <div class="card test-step">
  <h2>Run your program</h2>
  <p class="test-command">Terminal command: <code id="testCommand"></code></p>
  <button class="button" id="runPython" type="button" data-action="run">Run Python</button>
  <p class="note" id="testTerminalStatus" aria-live="polite">Select Run to open a Codespaces terminal. Return here after checking the output.</p>
 </div>
 <details class="card test-step test-debug quiet-details" id="debugHelp">
  <summary>Debug one thing</summary>
  <p>Find the last error line in the terminal. Paste it here to get a clue, not an assignment solution.</p>
  <label for="errorInput">Error message (optional)</label>
  <textarea id="errorInput" rows="3" maxlength="6000" placeholder="Paste a Python traceback or a failed check50 result here."></textarea>
  <button class="button secondary" id="useClipboardDebug" type="button" data-action="useClipboardDebug">Use copied output</button>
  <button class="button secondary" id="analyzeError" type="button" data-action="analyzeError">Explain this result</button>
  <div id="errorAdvice" class="test-advice" role="status" aria-live="polite" hidden>
   <h3 id="debugTitle"></h3>
   <p id="debugGuidance"></p>
   <p id="debugLocation" class="note"></p>
   <p id="debugNext" class="note"></p>
  </div>
 </details>
 <div class="card test-step">
  <h2>Check with CS50</h2>
  <p>After trying your own tests, use check50 to see which checks need more work. style50 checks formatting.</p>
  <div class="actions">
   <button class="button secondary" type="button" data-action="check" id="runCheck50">Run check50</button>
   <button class="button secondary" type="button" data-action="style" id="runStyle50">Run style50</button>
  </div>
  <p class="note" id="testCheckStatus" aria-live="polite">Read the results in the terminal. These buttons do not submit your work or mark it correct.</p>
 </div>
</section>
<section id="panel-submit" class="panel" role="tabpanel" aria-labelledby="tab-submit" hidden>
 <h2>Ready to submit?</h2>
 <div class="card"><p>Check your official problem page and required files. Run check50 first, then use submit50 with your own CS50 account.</p></div>
 <button class="button" id="submitProblem" type="button" data-action="submit">Open submit50 in terminal</button>
 <button id="cs50Status" type="button" class="button secondary" data-action="cs50Status">Check my CS50P submission status</button>
 <p class="note">Opens the official CS50P gradebook in your browser. Sign in with your CS50 GitHub account. This app does not read your grades.</p>
 <details class="quiet-details"><summary>About submitting safely</summary>
  <p class="note">The companion submits from a temporary copy without guide files or old journals. Check CS50's file list before confirming. Only CS50 can confirm submission.</p>
 </details>
</section>
<footer>
 <button class="button secondary" id="checkUpdate" type="button" data-action="checkUpdate">Check for updates</button>
 <p id="updateStatus" class="note" aria-live="polite">Update status: not checked yet.</p>
</footer>
<script nonce="${nonce}" src="${js}"></script>
</body></html>`;
}
module.exports={html};
