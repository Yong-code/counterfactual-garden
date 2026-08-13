# GitHub 网页版零基础教程：只用浏览器管理项目

这份教程不要求你会终端，也不要求先安装 Git。你只要已经登录 GitHub，就可以在网页上查看、修改和发布小型改动。

练习项目：

- 项目仓库：https://github.com/Yong-code/counterfactual-garden
- 在线网站：https://yong-code.github.io/counterfactual-garden/

> 最重要的安全提醒：不要上传密码、验证码、身份证件、API Key、访问令牌、`.env` 文件或其他隐私资料。即使后来删除，内容也可能仍留在 Git 历史中。

## 一、先认识 5 个词

| 名称 | 你可以先这样理解 |
| --- | --- |
| Repository（仓库） | 一个项目的主页，里面放代码、说明和历史版本 |
| Commit（提交） | 给当前改动拍一次带说明的“版本快照” |
| Branch（分支） | 从现有版本岔出的一条修改路线，不立刻影响正式版 |
| Pull Request / PR | 请求把一个分支的改动合并进正式分支 |
| Issue | 项目的待办、建议或问题记录，不会直接修改代码 |

这个项目的正式分支叫 `main`。

网页操作和本地 Git 有一个重要区别：

- 在 GitHub 网页里点击 `Commit changes`，提交会直接保存到 GitHub，不需要再 `push`。
- 在电脑本地用 Git 时，`commit` 只保存在电脑上，之后还要 `push` 才会上网。

## 二、看懂仓库首页

打开仓库后，顶部常用标签如下：

- `Code`：查看文件和 README。
- `Issues`：记录问题、建议和待办。
- `Pull requests`：检查、讨论并合并分支改动。
- `Actions`：查看自动测试和网站发布是否成功。
- `Settings`：仓库设置；不了解某项作用时不要随意修改。

文件列表上方的分支菜单通常显示 `main`。修改前先看它，避免改错分支。

## 三、只查看或下载项目

### 查看文件

1. 打开仓库的 `Code` 页面。
2. 点击文件名，例如 `README.md`、`index.html` 或 `app.js`。
3. 页面会显示文件内容。
4. 点击文件上方的 `History`，可以查看这个文件以前的提交。

### 下载一份副本

1. 回到仓库首页。
2. 点击绿色的 `Code` 按钮。
3. 点击 `Download ZIP`。
4. 下载后解压即可查看。

注意：ZIP 只是当前版本的副本，不包含 Git 历史，也不能直接用来和 GitHub 同步迭代。它适合查看或备份，不适合作为长期开发方式。

## 四、最快的练习：直接修改一个小地方

适合：你自己的仓库、文字或拼写等很小的改动。

1. 打开要修改的文件，例如 `README.md`。
2. 点击右上角的铅笔图标 `Edit this file`。
3. 修改文字；编辑 Markdown 时，可以点击 `Preview` 检查显示效果。
4. 点击右上角的 `Commit changes...`。
5. 在提交说明中写清楚做了什么，例如：

   ```text
   docs: 练习用网页修改说明
   ```

6. 如果页面允许选择：
   - 很小且确定无误的修改，可以选择直接提交到 `main`。
   - 代码修改或不确定的修改，选择创建新分支并发起 Pull Request，更安全。
7. 点击最后的 `Commit changes` 或 `Propose changes`。

完成后回到 `Code` 页面，文件列表上方应显示你的最新提交说明。

## 五、在网页上新建文件

1. 打开仓库的 `Code` 页面。
2. 点击 `Add file` → `Create new file`。
3. 在文件名输入框中写名称和扩展名，例如：

   ```text
   ideas.md
   ```

4. 如果需要同时新建文件夹，可以在名称里输入 `/`，例如：

   ```text
   docs/ideas.md
   ```

5. 在下方输入文件内容，点击 `Preview` 检查。
6. 点击 `Commit changes...`，填写提交说明，然后选择直接提交或创建新分支。

## 六、上传电脑里的文件

1. 打开仓库的 `Code` 页面。
2. 点击 `Add file` → `Upload files`。
3. 把文件拖进页面，或点击 `choose your files` 选择文件。
4. 再次检查文件名和内容，确认没有密码、令牌或隐私资料。
5. 填写提交说明。
6. 选择直接提交到当前分支，或创建新分支。
7. 点击 `Commit changes` 或 `Propose changes`。

浏览器上传目前限制为单个文件不超过 25 MiB、一次最多 100 个文件。大量文件、较大文件或需要先运行测试时，应改用 GitHub Desktop 或本地 Git。

## 七、推荐的安全流程：分支 + Pull Request

当你要修改程序、一次改多个文件，或不确定改动是否正确时，用这个流程。

### 1. 创建分支

1. 在 `Code` 页面点击显示 `main` 的分支菜单。
2. 输入一个新名称，例如：

   ```text
   docs/update-homepage
   ```

3. 点击创建新分支的选项。

分支名建议用英文小写和短横线，看到名称就能知道用途。

### 2. 在新分支修改并提交

确认页面上的分支名已经不是 `main`，再按照前面的编辑、新建或上传步骤操作。

### 3. 创建 Pull Request

1. 提交后，如果页面出现 `Compare & pull request`，点击它。
2. 确认：
   - `base` 是 `main`，表示准备合入的目标。
   - `compare` 是刚创建的分支，表示你的修改来源。
3. 填写标题和说明。
4. 查看 `Files changed`，确认只有你本来想改的内容。
5. 点击 `Create pull request`。

### 4. 合并

确认内容正确、自动检查通过后：

1. 点击 `Merge pull request`。
2. 点击 `Confirm merge`。
3. 页面若提供 `Delete branch`，可删除这个已经合并的临时分支；它不会删除已经合入 `main` 的内容。

Pull Request 必须比较两个不同分支。它的价值是：正式发布前，你可以先看完整差异，再决定是否合并。

## 八、用 Issue 管理下一步计划

Issue 不会改代码，它只是把想法变成可以追踪的任务。

1. 点击仓库顶部的 `Issues`。
2. 点击 `New issue`。
3. 填写标题，例如：

   ```text
   增加月度复盘海报
   ```

4. 在正文写清目标和检查清单：

   ```markdown
   目标：让用户可以导出本月的决策复盘。

   - [ ] 设计海报布局
   - [ ] 增加导出按钮
   - [ ] 在手机上测试
   ```

5. 点击 `Submit new issue`。

做完后可以勾选清单，并点击 `Close issue` 关闭任务。

## 九、怎么看历史，改错了怎么办

### 查看整个仓库的提交

1. 打开 `Code` 页面。
2. 点击文件列表上方的提交数量或 `History`。
3. 点击某个提交，可以查看它改了哪些文件和行。

### 恢复一个文件的旧内容

对初学者，最稳妥的方法不是删除历史，而是再提交一个修正版本：

1. 打开出错的文件。
2. 点击 `History`。
3. 打开改错之前的版本。
4. 复制正确的旧内容。
5. 回到当前版本，点击铅笔图标，把内容改回去。
6. 提交说明写：

   ```text
   fix: 恢复误改的文件内容
   ```

这样错误和修复都会留下记录，以后仍能查清发生了什么。

## 十、确认网站是否发布成功

这个项目使用 GitHub Pages。合并或直接提交到 `main` 后：

1. 点击仓库顶部的 `Actions`。
2. 查看最新的网站发布任务。
3. 绿色对勾表示成功；红色叉号表示失败，点击任务可以看错误位置。
4. 成功后打开：https://yong-code.github.io/counterfactual-garden/
5. 如果页面还是旧内容，可以稍等片刻后强制刷新浏览器。

也可以打开 `Settings` → `Pages` 查看发布来源和网站地址。这个项目的入口文件是仓库顶层的 `index.html`；如果入口文件被改名、删除或移出发布目录，网站可能出现 404。

## 十一、什么时候不建议只用网页版

以下情况优先使用 GitHub Desktop 或本地 Git：

- 一次修改多个相互关联的代码文件。
- 修改后必须先在电脑上运行测试。
- 上传大量文件或较大文件。
- 需要离线工作。
- 出现分支冲突，需要仔细比较和处理。

简单判断：修改 README、错别字、小文档，用网页很方便；修改功能，先在电脑上测试再发布。

## 十二、现在就做一次 3 分钟练习

1. 打开：https://github.com/Yong-code/counterfactual-garden
2. 点击 `README.md`。
3. 点击铅笔图标。
4. 在“下一步可以做什么”中增加一条自己的想法。
5. 点击 `Commit changes...`。
6. 提交说明写 `docs: 增加一个项目想法`。
7. 这次只是 README 小改动，可以直接提交到 `main`。
8. 回到仓库首页，确认最新提交已经出现。

完成这一次，你就已经独立做完了：修改文件 → 检查内容 → 创建版本 → 发布到 GitHub。

## 官方资料

- 编辑文件：https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files
- 新建文件：https://docs.github.com/en/repositories/working-with-files/managing-files/creating-new-files
- 上传文件：https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- 创建 Pull Request：https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request
- 创建 Issue：https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue
- 下载项目：https://docs.github.com/en/get-started/start-your-journey/downloading-files-from-github

想继续学习电脑本地的版本管理，请看 [Git 零基础教程](GIT_TUTORIAL_ZH.md)。
