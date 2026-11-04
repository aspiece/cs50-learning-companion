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

You should see version **0.6.2** or a newer version.

## Check that it works

1. In the companion, select **Problem Set 0 — Indoor Voice**.
2. Select **Create starter files**.
3. The `indoor/` folder should contain `indoor.py`, `README.md`, and `LEARNING_JOURNAL.md`.
4. The **formatted README** should open on the left and `indoor.py` on the right.
5. Type a short plan in the **Learn** tab. Then select **Preview formatted learning journal** to check that your notes were saved.

Harvard's official instructions open in another browser tab or window. Keep them available while coding.

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

## Updating later

Use the **same one-line installation command** from Step 2. It checks for a copy already installed, updates the companion, and leaves your assignment work alone.

## Your Learning Journal

Your planning, predictions, test notes, and reflections are stored in `LEARNING_JOURNAL.md` inside each assignment folder.

- Select **Preview formatted learning journal** to read your notes.
- Select **Edit journal as Markdown** to edit the file.
- Select **Reload notes from journal** to copy file edits into the sidebar.
- Do not include the Learning Journal in CS50 submissions. The companion's check50 and submit50 buttons use a temporary copy that leaves it out. Still review the file list before confirming any submission.

**Remember:** Follow CS50's official instructions and academic honesty rules. Write your own code.
