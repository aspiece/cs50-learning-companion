# Student Installation Guide — GCI CS50 Learning Companion

**For students using Harvard's CS50 Codespaces**

This companion helps you plan, code, test, and reflect on CS50P problems. It gives hints, but it does **not** provide completed solutions.

## Install in three steps

### 1. Open your CS50 Codespace

1. Visit [cs50.dev](https://cs50.dev/) and sign in.
2. Wait for the VS Code editor to load.
3. From the top menu, choose **Terminal → New Terminal**.

**Run these commands in the Codespace terminal, not Windows Command Prompt or your computer's terminal.**

### 2. Copy and paste ONE command

Copy the complete line below, paste it into the Codespace terminal, and press **Enter**.

```bash
curl -fsSL https://raw.githubusercontent.com/aspiece/cs50-learning-companion/main/scripts/install-in-codespaces.sh -o /tmp/gci-cs50-install.sh && bash /tmp/gci-cs50-install.sh
```

You only need **one command**. It works for first-time setup and future updates. It also works no matter which folder your terminal starts in.

The installer downloads the companion to a separate folder in your home directory. **It will not remove your Python assignments.** It then builds the extension and installs it. If a step cannot finish, the terminal explains what stopped.

### 3. Reload VS Code

After the installer says **Installation complete**:

1. Press **Ctrl + Shift + P** (Windows or Chromebook) or **Cmd + Shift + P** (Mac).
2. Type **Developer: Reload Window**.
3. Choose that command.
4. Find the **GCI** letters in the left sidebar. Select them to open **CS50 Companion**.

You should see version **0.8.1** or a newer version.

## If the Companion is stuck on Start

If **Learning help** or the **Learn, Test, Submit** tabs will not open, your Codespace may have the older v0.7.7 sidebar.

1. Scroll to the bottom of the Companion and select **Check for updates**.
2. Install **v0.7.8** (or later) and reload Codespaces.
3. If the update button does not work, open a **Codespaces terminal** and use the one-line installation command in Step 2 above. Then reload VS Code.

This fix does not delete or replace your Python files, README, or Learning Journal.

## Check that it works

1. In the companion, select **Problem Set 0 — Indoor Voice**.
2. Select **Create starter files**.
3. The `indoor/` folder should contain `indoor.py`, `README.md`, and `LEARNING_JOURNAL.md`.
4. The **formatted README** should open on the left and `indoor.py` on the right.
5. Type a short plan in the **Learn** tab. Then select **Preview formatted learning journal** to check that your notes were saved.

Harvard's official instructions open in another browser tab or window. Keep them available while coding.

## Get help without extra steps

On **Start**, select **I'm stuck**. Choose what you need: **Understanding the problem**, **Writing Python**, or **Debugging an error**. You will see one clue. Select **Another clue** only if you need more. You can close help whenever you want.

**What should I do next?** shows up to three suggestions based on where you are. They are not assignments or grades. You still decide when your code is ready.

For errors, open **Test → Review or debug a result → Debug one thing**. Paste your Python traceback or a failed check50 result. You can also copy text from the terminal, then select **Use copied output**. If you selected error text inside an editor, choose **Use selected text**. The Companion explains what to look at and one thing to try. It does not fix code for you, access the terminal automatically, or send your text to an AI service.

## A simpler place to work

The Companion shows only the next actions. Extra tools are still there when you need them:

- **Choose a problem:** Use the problem picker. Expand **Search and filter assignments** to find another one.
- **Start:** Create or continue your code. Extra file and README options are under **More options**.
- **Learn:** Select your support level. If a related CodeHS lesson is available, choose **CodeHS: [topic]** to open it in a browser. Other reference tools and your journal are under **More learning tools and journal**.
- **Test:** Run your Python program. Expand **Review or debug a result** if you want to compare results or get a Python error clue. Use check50 to see Harvard's checks.
- **Submit:** Submit with your own CS50 account, then select **Check my CS50P submission status** to open Harvard's official gradebook. The Companion cannot read your grades.
- **My progress** is an optional checklist at the bottom.

### The problem is in your README

Open **Read README** to see the problem explained in short, student-friendly steps, how to test it, and the CS50 and CodeHS lessons that may help you. **Harvard's linked problem page has the exact rules**—check it for special cases before you submit.

If you already started an assignment and want the new README, use **Start → More options → Update my README guide**. Read the prompt before approving. The Companion backs up your previous README. It never replaces your Python solution or Learning Journal.

## A simpler Start tab

Choose a problem. The Start tab shows the **next action**:

- **Create starter files:** This appears for a new problem. The companion creates your folder and opens the README and Python file.
- **Continue coding:** This appears when your Python file is already there. It opens your existing work without replacing it.
- **Inspect assignment folder:** If the folder exists but the main Python file is missing, look inside the folder before making changes. The companion won't overwrite your work.

Use **Read README** to view the instructions, **Learning help** to open the Learn tab, or **Open official CS50 instructions** to read Harvard's assignment page. Additional actions are in **More options**.

If you need to refresh the README for an older problem, expand **More options** and choose **Update my README guide**. The companion asks first and saves a backup when replacing an older README. It does not change your Python code.

## Your new assignment guide

Every **new** assignment now starts with light Python code (a few TODOs) and a short README with five sections: **Your Goal, Build It, Test It, Check It, Submit**. Use its steps to plan your own solution.

If you already made an assignment folder, your existing Python files stay exactly as they are. To replace an **older README only**, select that problem, open **More options**, and choose **Update my README guide**. The companion asks before replacing it and saves a backup copy. Your code and Learning Journal are not changed.

## Test your program in four steps

Open the **Test** tab when you have written some code.

1. **Predict and run:** Write what you think will happen. Select **Run Python** (or **Run pytest** in Problem Set 5). Check the results in your Codespace terminal.
2. **Review the result:** Tell the Companion if your result matched, looked different, or showed an error. This is **your report**, not a grade.
3. **Debug one thing:** If something went wrong, open **Debug one thing**. You can paste the last line of a Python error and select **Explain this error**. Check one thing in your code, then run it again.
4. **Check with CS50:** After testing different inputs, select **Run check50** to see Harvard's checks. **Run style50** helps with formatting. Read the results in the terminal.

The Companion cannot automatically read or grade your terminal results. It will not change your code, mark a test as passed, or submit work for you. Your prediction, test notes, and debugging notes still save to your assignment Learning Journal. Pasted error text is used only to show a clue in the extension; it is not saved in the journal.

## Choose how much learning help you need

In the **Learn** tab, use **How much guidance do you want?** You can change levels any time.

- **Getting Started:** See questions about the program's input and output, detailed steps to help you plan, optional hints, and a CS50 concept video when available.
- **Some Help:** Make your own plan using one short prompt. Open hints only if you need them.
- **Independent:** Try the challenge on your own without step-by-step questions. You can still write a plan or open hints if you get stuck.

You should see the summary and learning sections change **right away** when you choose a different level. Your existing notes stay saved, and the String Methods Toolkit is available in every mode. These options do not change your Python code or reveal a solution.

## Python String Methods Toolkit

You can look up Python string methods from the **Learn** tab at every guidance level.

1. Select **Learn → Open String Toolkit**. A larger editor panel opens on the left so you can keep your Python code visible on the right.
2. Choose a group (**Changing text**, **Checking text**, or **Splitting text**) or choose **All 16 methods**. Search for a topic, such as *lowercase*, *spaces*, or *check*.
3. Select a method to see an example and the result Python would return.
4. Enter your own short text in **Try it yourself**. If needed, fill in an extra option such as a search word, replacement, or separator.
5. Select **Run in Python** to see the real result or **Copy practice code** to copy a standalone example.
6. You can close the toolkit tab when finished. To reopen it, return to **Learn → Open String Toolkit**.

For a smaller reference inside the sidebar, expand **Quick reference in sidebar**. It has the same methods and practice tools.

Look for the **For this problem, explore** note when working on text-related assignments. It's a suggestion for which kind of tool to study, not the answer.

Tip: `.strip()` cleans both ends, `.lstrip()` cleans the start, and `.rstrip()` cleans the end. `.isdigit()` and `.isdecimal()` also have slightly different rules.

Remember: Most Python string methods return a new value. They do not change the original string. The practice tool does not edit your files or submit anything to CS50.

## Optional CS50 concept videos

If you want extra help with an assignment:

1. Open the Companion's **Learn** tab.
2. Choose **Getting Started — more help** from the guidance menu.
3. Find **Optional CS50 concept video** and select **Watch concept video in browser**.
4. The official Harvard CS50 page opens in a separate browser tab. Learn the Python idea there, then return to your code.
5. Answer the short **After watching** question in **My steps or pseudocode**. Your notes are saved in the Learning Journal.

The video is optional. It teaches a Python skill, **not the answer to your assignment**. If you select **Some Help** or **Independent**, the video card is hidden. You can change the guidance level whenever you want.

## If the installation stops

**Don't delete your Codespace or your Python files.** Read the last few lines in the terminal.

| Terminal message | What to do |
| --- | --- |
| `curl: command not found` | Ask your teacher to help with the Codespace setup. |
| `Could not clone` or `repository not found` | Check that GitHub loads in your browser, then try again. |
| `Node.js 20 or newer is required` | Your Codespace needs a newer Node.js version; show your teacher the error. |
| `npm could not install` | Check the internet connection and share the error with your teacher. |
| `Git could not update` | Your companion source may have local edits; ask your teacher before changing them. |
| The extension built, but `code` could not install it | In the **Extensions** panel, choose **… → Install from VSIX** and select the file path printed by the installer. Then reload. |
| GCI icon is missing | Reload the window, then search for **CS50 Learning Companion** under installed extensions. |

If you're not sure what happened, copy the **last 10–20 lines** from the terminal and send them to your teacher. Do not share passwords or access tokens.

## Updating later (v0.7.0 and newer)

After your first installation, you do **not** need to copy terminal commands for normal updates.

1. Open your CS50 Codespace and select the **GCI** icon.
2. At the bottom of the companion sidebar, look for **Check for updates**.
3. If a newer version is available, select **Install update** when prompted.
4. When the extension finishes installing, choose **Reload now**.

The companion checks for newer versions when its sidebar opens, but **never installs without asking**. The update comes from the official GCI companion GitHub release and is checked for download errors. Your Python assignments and Learning Journal files are not replaced.

If you are still using **v0.6.2 or earlier**, the built-in update button is not available yet. Run the one-line installation command from Step 2 one more time to upgrade to v0.7.0. After that, use the sidebar for future updates.

If the built-in installation cannot run on your Codespace, the companion will show where it saved the verified VSIX file and explain how to install it using **Extensions → … → Install from VSIX**.

## Your Learning Journal

Your planning, predictions, test notes, and reflections are stored in `LEARNING_JOURNAL.md` inside each assignment folder.

- Select **Preview formatted learning journal** to read your notes.
- Select **Edit journal as Markdown** to edit the file.
- Select **Reload notes from journal** to copy file edits into the sidebar.
- Do not include the Learning Journal in CS50 submissions. The companion's check50 and submit50 buttons use a temporary copy that leaves it out. Still review the file list before confirming any submission.

**Remember:** Follow CS50's official instructions and academic honesty rules. Write your own code.
