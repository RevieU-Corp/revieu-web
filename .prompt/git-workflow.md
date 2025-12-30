# Git Workflow
1. 检查当前分支状态
```bash
git branch -a
git status
```

2. 创建新分支
如果已经在 <type>/<issue-id>-<description> 分支上，直接提交代码即可。
否则，创建新分支
```bash
git checkout -b <type>/<issue-id>-<description>
```
3. 检查有修改的文件
```bash
git diff
```
4. 总结修改内容
```bash
git diff --stat
```
5. 写commit message
```bash
git add . 或者 git add <file> 或者 git add -a
```
6. 提交代码
```bash
git commit -m "<type>(<scope>): <commit subject>\n\n<commit body>"
```

7. 推送到远程仓库
```bash
git push origin <type>/<issue-id>-<description>
```
