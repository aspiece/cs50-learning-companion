# Student Installation Guide — GCI CS50 Learning Companion

**For students using Harvard's CS50 Codespaces**

The GCI CS50 Learning Companion helps you start CS50P assignments, plan your code, test your work, and understand errors. **It does not write the answers for you.**

## Before you begin

You need:
- Your own CS50 Codespace at **https://cs50.dev/**.
- A working internet connection.
- Your teacher's permission to install the extension.

**Important:** Install this **inside cs50.dev**, not in regular VS Code on your computer.

## Step 1 — Open your Codespace

1. Go to **https://cs50.dev/**.
2. Sign in using the account you use for CS50.
3. Wait for the VS Code editor to open.
4. Open the **Terminal** menu and select **New Terminal**.

You should see a line where you can type commands. It may end with a `$`.

## Step 2 — Install the companion

Copy and paste **both lines** below into the Codespaces terminal. Press **Enter** if they do not run on their own.

```bash
git clone https://github.com/aspiece/cs50-learning-companion.git "$HOME/cs50-learning-companion"
bash "$HOME/cs50-learning-companion/scripts/update-in-codespaces.sh"
```

You will see text appear as the extension installs. Look for the message that says to reload Codespaces. **Do not close the browser or interrupt the command while it is running.**

**If the terminal says `destination path ... already exists`:** You probably installed it before. Skip the first command. Run just this line:

```bash
bash "$HOME/cs50-learning-companion/scripts/update-in-codespaces.sh"
```

## Step 3 — Reload Codespaces

1. Press **Ctrl + Shift + P** (Windows or Chromebook) or **Cmd + Shift + P** (Mac).
2. Type **Developer: Reload Window**.
3. Select that command.

## Step 4 — Find the extension

1. Look at the icon bar on the **left side** of VS Code.
2. Find **CS50 Companion** (the GCI letters).
3. Select the icon to open the learning sidebar.
4. Look at the top of the sidebar to check the installed version. The class pilot started at **v0.5.3**; a newer version is also fine.

If you don't see the icon, open the Extensions panel and search for **CS50 Learning Companion** under your installed extensions. Ask your teacher if it is missing.

## Step 5 — Try your first assignment

1. In **CS50 Companion**, find **Problem Set 0 → Indoor Voice**.
2. Select **Create starter files**.
3. The `indoor/` folder will be created with `README.md` and `indoor.py`.
4. Your guide should open in one editor group and your Python file in the other.
5. Use the tabs in the companion:
   - **Start:** Read the assignment and official CS50 page.
   - **Learn:** Make a plan and request a hint if you need one.
   - **Test:** Predict the results, run your code, and review `check50`.
   - **Submit:** Check your required files, reflect, and submit **your own** work.

**Harvard's official problem page is the source of truth.** The companion is a study tool, not a replacement for the official instructions. It cannot confirm that your assignment was submitted.

## Where your planning notes are saved

When you write a plan, prediction, debugging note, or reflection in the companion, it saves to **LEARNING_JOURNAL.md** in that assignment's folder.

- Choose **Open learning journal file** in the Learn tab to read or edit your notes.
- Choose **Reload notes from journal** if you changed the file yourself and want to see those changes in the sidebar.
- Your journal is separate from your Python code. The companion's **check50** and **submit50** buttons use a temporary copy that leaves the journal out.
- If you type `submit50` yourself in the terminal, **check the files CS50 lists before you confirm**. Your journal should not be part of the submission.
- Keep a backup of your important notes if you plan to delete or move to another Codespace.

## When your teacher announces an update

Open a new terminal in **cs50.dev** and run:

```bash
bash "$HOME/cs50-learning-companion/scripts/update-in-codespaces.sh"
```

Then use **Developer: Reload Window** again. Updating the extension does not erase your Python assignment files.

## If something doesn't work

| Problem | What to try |
| --- | --- |
| `git: command not found` or `npm: command not found` | Check that you are in the official CS50 Codespace. Show your teacher the message. |
| The folder already exists | Use the **update command**, not the `git clone` command. |
| `No such file or directory` for the update script | Check the command was copied exactly. If you cloned it in a different folder, ask your teacher for help. |
| You can't find the GCI icon | Reload the window, then check the Extensions panel. |
| Official CS50 directions are blank inside the editor | Select **Open official CS50 page in browser** instead. |
| The installation fails | Copy the **full terminal error** and share it with your teacher. |

## Installation check

- [ ] I can open my own Codespace at cs50.dev.
- [ ] I can see the **CS50 Companion** icon on the left.
- [ ] I can select an assignment.
- [ ] I can open both the `README.md` and the Python starter file.
- [ ] I know where to find **Start, Learn, Test, and Submit**.

**Reminder:** Use your own words and your own code. Follow your teacher's directions and CS50's academic honesty rules.
