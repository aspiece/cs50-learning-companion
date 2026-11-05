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
 <div class="start-quick-actions" aria-label="Learning resources">
  <button class="button secondary" id="openGuide" type="button" data-action="guide">Read README</button>
  <button class="button secondary" id="startLearningHelp" type="button" data-action="goLearn">Learning help</button>
 </div>
 <button class="button link" type="button" data-action="official">Open official CS50 instructions</button>
 <details id="startMore" class="start-more">
  <summary>More options</summary>
  <div class="start-more-actions">
   <button class="button secondary" id="openFiles" type="button" data-action="openFiles">Open README and Python side by side</button>
   <button class="button secondary" id="updateGuide" type="button" data-action="updateGuide">Update my README guide</button>
  </div>
  <p class="note">Updating the README asks for permission and saves a backup. Your Python work stays unchanged.</p>
 </details>
</section>
<section id="panel-learn" class="panel" role="tabpanel" aria-labelledby="tab-learn" hidden>
 <h2>Learn to solve the problem</h2>
 <label class="eyebrow" for="support">How much guidance do you want?</label>
 <select id="support" data-field="support">
 <option value="guided">Getting started — more help</option>
 <option value="standard">Some help</option>
 <option value="independent">Independent — less help</option>
 </select>
 <div class="card toolkit-launch">
  <h2>Python String Methods</h2>
  <p class="note">Look up 16 methods and try them with real Python in a larger editor panel.</p>
  <button id="openStringToolkit" class="button" type="button" data-action="openStringToolkit">Open String Toolkit</button>
  <p class="note">Opens on the left so your Python code can stay visible on the right.</p>
 </div>
 <details id="stringToolkit" class="card toolkit">
  <summary><strong>Quick reference in sidebar</strong> <span class="note">Optional · Small view</span></summary>
  <p class="note">A string is text in Python. Try these tools on your own examples. This reference is available at every help level.</p>
  <p id="stringSuggestion" class="toolkit-suggestion" hidden></p>
  <label for="stringSearch">Find a string method</label>
  <input id="stringSearch" type="search" placeholder="Try: lowercase, spaces, check..." aria-label="Search string methods">
  <label for="stringCategory">Show methods for</label>
  <select id="stringCategory" aria-label="Filter string methods by category">
   <option value="all">All 16 methods</option>
   <option value="change">Changing text</option>
   <option value="check">Checking text</option>
   <option value="parts">Splitting text</option>
  </select>
  <div id="stringMethodList" class="string-method-list" aria-live="polite"></div>
  <p id="stringNoResults" class="note" hidden>No methods found. Try a different word.</p>
  <div class="practice-box" id="stringPracticeBox" hidden>
   <h3>Try it yourself</h3>
   <p id="stringSelectedMethod" class="note"></p>
   <label for="stringPracticeText">Your sample text</label>
   <input id="stringPracticeText" type="text" maxlength="200" value="Hello, Python!" autocomplete="off">
   <div id="stringArg1Wrap" hidden>
    <label id="stringArg1Label" for="stringArg1"></label>
    <input id="stringArg1" type="text" maxlength="100" autocomplete="off">
   </div>
   <div id="stringArg2Wrap" hidden>
    <label id="stringArg2Label" for="stringArg2"></label>
    <input id="stringArg2" type="text" maxlength="100" autocomplete="off">
   </div>
   <div class="actions">
    <button class="button" id="tryStringMethod" type="button" data-action="practiceString">Run in Python</button>
    <button class="button secondary" type="button" data-action="copyStringPractice">Copy practice code</button>
   </div>
   <p id="stringPracticeResult" class="practice-result" role="status" aria-live="polite">Try a method to see what Python returns.</p>
   <p class="note">This practice does not edit or submit your assignment.</p>
  </div>
  <p class="note"><strong>Remember:</strong> Strings cannot be changed in place. Most string methods return a new value, so save it if you need it later.</p>
  <div class="actions">
   <button class="button link" type="button" data-action="stringMethodsVideo">Watch CS50 String Methods</button>
   <button class="button link" type="button" data-action="stringMethodsDocs">Python method docs</button>
  </div>
 </details>
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
 <div class="card" id="conceptVideoCard" hidden>
 <h2>Optional CS50 concept video</h2>
 <p class="note">Need an example of the Python skill? This official CS50 lesson explains the idea, not the assignment solution.</p>
 <p><strong id="conceptVideoTitle"></strong></p>
 <p id="conceptVideoFocus" class="note"></p>
 <button class="button secondary" type="button" id="openConceptVideo" data-action="openConceptVideo">Watch concept video in browser</button>
 <p id="conceptVideoQuestion" class="note"></p>
 <p class="note">After watching, add one idea to <strong>My steps or pseudocode</strong> above. Watching is optional.</p>
 </div>
 <button class="button secondary" type="button" id="openJournal" data-action="openJournal">Preview formatted learning journal</button>
 <button class="button secondary" type="button" id="editJournal" data-action="editJournal">Edit journal as Markdown</button>
 <button class="button link" type="button" id="reloadJournal" data-action="reloadJournal">Reload notes from journal</button>
 <p id="journalStatus" class="note" aria-live="polite">Your notes are saved in LEARNING_JOURNAL.md inside this assignment folder.</p>
 <p class="note">Markdown preview updates as your notes are saved. To edit the file directly, choose Edit journal as Markdown. Do not submit your journal to CS50.</p>
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
 <button class="button" id="runPython" type="button" data-action="run">Run Python</button>
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
 <p class="note">The companion submits from a temporary copy without your Learning Journal or generated README. Check CS50's file list before confirming. Only CS50 can confirm submission.</p>
</section>
<section class="progress" aria-label="Personal progress">
 <div class="eyebrow">My progress</div>
 <p id="progressText" class="note">0 of 5 steps checked</p>
 <div class="meter" role="presentation"><div id="meter" class="meter-fill" style="width:0%"></div></div>
 <div id="checks"></div>
 <p class="note">These checkmarks are saved in this workspace and are self-reported.</p>
 <p id="practiceSummary" class="note" aria-live="polite"></p>
</section>
<footer>
 <button class="button secondary" id="checkUpdate" type="button" data-action="checkUpdate">Check for updates</button>
 <p id="updateStatus" class="note" aria-live="polite">Update status: not checked yet.</p>
 <button type="button" data-action="updates">View GitHub releases</button>
</footer>
<script nonce="${nonce}" src="${js}"></script>
</body></html>`;
}
module.exports={html};
