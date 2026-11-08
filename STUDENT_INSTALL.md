# Student Installation Guide — GCI CS50 Learning Companion

**For students using Harvard's CS50 Codespaces**

Use the Companion to open, code, test, and submit CS50P problems.

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

You should see version **0.9.4** or a newer version.

## Complete a problem

1. **Start.** Choose a CS50P problem and select **Create starter files** or **Continue coding**. Read the README on the left and write your code on the right. If Harvard lists required files, put them in the assignment folder.
2. **Test.** Run your code and compare its output with the examples in your README. Use **Run check50** for CS50’s checks and **Run style50** for formatting. Open **Debug one thing** and paste an error or choose **Use copied output** for a clue.
3. **Submit.** Select **Open submit50 in terminal**. Review the file list before you confirm. Open **Check my CS50P submission status** and sign in to see the official result.

Choose **I’m stuck** on Start for one clue at a time. Under **Writing Python**, open **Look up Python string methods**. Search by name or try a word like “spaces.” Open a method to see an example and its result. The README has links to Harvard’s full instructions, related CS50 shorts, and a matching CodeHS lesson where available.

After an update, reload Codespaces and open **CS50 Companion**. It refreshes old guides it recognizes as untouched. If you changed a guide, use **More options → Update my README guide** to replace it and keep a backup. Save any open README edits first.

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
