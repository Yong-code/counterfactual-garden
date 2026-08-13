# Git 零基础上手：用这个项目学会“保存版本”

这份教程只讲你现在最常用的部分。先记住一句话：

> Git 管理你电脑上的版本；GitHub 保存并展示你推送到网上的版本。

## 先理解四个位置

```text
你正在修改的文件
      │ git add
      ▼
准备提交的暂存区
      │ git commit
      ▼
电脑上的 Git 历史
      │ git push
      ▼
GitHub 上的仓库
```

`commit` 不是上传，`push` 才是上传。

## 第一次打开项目

打开 macOS 的“终端”，输入 `cd `（注意后面有一个空格），然后把项目文件夹拖进终端窗口，按回车。这样不用手敲很长的路径。

先确认自己在哪里：

```bash
pwd
```

再看当前状态：

```bash
git status
```

如果出现 `not a git repository`，通常是进入了错误的文件夹。不要继续提交，先重新用上面的拖拽方法进入 `counterfactual-garden`。

## 每次迭代只用这 5 步

### 1. 先拿到 GitHub 上的最新版本

```bash
git pull --rebase
```

如果只有你自己在一台电脑上修改，通常会显示 `Already up to date.`。

### 2. 修改并测试

例如把首页一句文字改掉，然后运行：

```bash
npm test
```

### 3. 看看改了什么

```bash
git status
git diff
```

`git status` 看文件清单，`git diff` 看每一行变化。按 `q` 可以退出长页面。

### 4. 保存一个本地版本

确认终端就在这个项目文件夹后：

```bash
git add .
git commit -m "feat: 修改首页介绍"
```

提交说明建议写清“做了什么”：

- `feat: 增加月度回顾`：新功能
- `fix: 修复日期显示错误`：修复问题
- `docs: 补充使用说明`：只改文档
- `style: 调整手机端间距`：只改样式

### 5. 上传 GitHub

```bash
git push
```

刷新 GitHub 网页，就能看到新的提交。GitHub Pages 通常会在稍后自动显示新版页面。

## 怎么撤销刚才的操作

以下命令只处理一个明确文件，比较适合初学者。

文件还没有 `git add`，想撤销某个文件的修改：

```bash
git restore index.html
```

已经 `git add`，但还没有 `commit`：

```bash
git restore --staged index.html
```

这只会把文件移出暂存区，不会删除你写的内容。

如果已经 `commit` 或 `push`，先不要使用网上看到的 `reset --hard` 或强制推送。把 `git status` 和报错文字发给 Codex，再决定怎样恢复。

## 三个安全习惯

1. 每次先运行 `pwd` 和 `git status`，确认自己在正确项目里。
2. 不要提交密码、Token、身份证件、私人数据或 `.env` 文件。
3. 看不懂错误时不要连续换命令尝试；完整复制错误信息再处理。

## 你的第一次练习

在 `index.html` 找到：

```html
<p class="privacy-note">...</p>
```

把这句隐私说明改成你喜欢的表达，保存后依次运行：

```bash
git status
git diff
npm test
git add index.html
git commit -m "docs: 优化首页隐私说明"
git push
```

这就是一次完整、真实、风险很低的项目迭代。
