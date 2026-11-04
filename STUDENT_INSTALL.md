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

You should see version **0.7.2** or a newer version.

## Check that it works

1. In the companion, select **Problem Set 0 — Indoor Voice**.
2. Select **Create starter files**.
3. The `indoor/` folder should contain `indoor.py`, `README.md`, and `LEARNING_JOURNAL.md`.
4. The **formatted README** should open on the left and `indoor.py` on the right.
5. Type a short plan in the **Learn** tab. Then select **Preview formatted learning journal** to check that your notes were saved.

Harvard's official instructions open in another browser tab or window. Keep them available while coding.

## Your new assignment guide

Every **new** assignment now starts with light Python code (a few TODOs) and a short README with five sections: **Your Goal, Build It, Test It, Check It, Submit**. Use its steps to plan your own solution.

If you already made an assignment folder, your existing Python files stay exactly as they are. To replace an **older README only**, select that problem and choose **Update my README guide**. The companion asks before replacing it and saves a backup copy. Your code and Learning Journal are not changed.

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
