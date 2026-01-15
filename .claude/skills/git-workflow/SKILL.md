---
name: git-workflow
description: Exec a complete git workflow when user want to commit and push. Enforces naming & conventional commits.
---

# Git Workflow
## 1. Prep
If user don't provide issue id, wait and tell user to provide issue id.
**Cmd**: `git branch`
**Logic**: 
- IF branch != `dev`: **STOP EXECUTION**. Wait for user to: `git checkout dev && git pull`.
- IF branch == `dev`: **NEXT**.
## 2. Branch
**Fmt**: `<type>/<id>-<desc>`
**Types**: `feat` `fix` `docs` `style` `refactor` `test` `chore`
**Cmd**: `git checkout -b <type>/<id>-<desc>`
## 3. Stage
**Cmds**:
`git status`
`git diff --stat`
`git add .`
summarize changes for commit.
## 4. Commit
**Fmt**: `<type>(scope): <subject> (#<id>)`
**Rule**: type lowercase, id mandatory.
**Ex**: `feat(auth): jwt login (#42)`
**Cmd**: `git commit -m "<fmt>"`
## 5. Push
**Cmd**: `git push -u origin HEAD`
**Task**: Create PR -> `dev`. Assign reviewers.
## 6. Cleanup
**Logic**: **STOP**. Wait for merge confirmation and user to continue to next step.
**Cmds**:
```bash
git checkout dev
git pull
git fetch -p
git branch -d <old_branch>
```