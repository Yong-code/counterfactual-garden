# Counterfactual Garden / 反事实花园

> 把决定种成植物，在未来复盘自己的判断。

Counterfactual Garden 是一个隐私优先的决策日志。你先记录选择、被放弃的备选项、对结果的预期和信心；到了约定日期，再回来填写真实结果。花园会把每次判断画成一株植物，并用简单的校准分帮助你观察：自己的“70% 确信”究竟有多可靠。

## 它有什么不同

- **先预测，后复盘**：避免在结果出现后无意中改写自己当时的想法。
- **花园式可视化**：植物高度代表信心，花苞表示等待，花朵表示完成复盘。
- **校准而非对错**：使用 Brier Score 的直观转换分数，鼓励诚实地表达不确定性。
- **快速查找与复盘**：支持关键词搜索、状态筛选和折叠式记录详情。
- **删除也可反悔**：站内确认后仍提供撤销入口，避免一次误触永久丢失记录。
- **隐私优先**：没有账号、后端、分析脚本或外部字体；数据只留在浏览器的 `localStorage`。
- **可以带走**：支持 JSON 导出与导入。
- **适配不同使用习惯**：浅色/深色模式、手机底部导航，以及减少动态、减少透明度和高对比度支持。
- **零构建依赖**：原生 HTML、CSS、JavaScript，适合刚开始学 Git 的人阅读和修改。

## 在线体验

- GitHub Pages：https://yong-code.github.io/counterfactual-garden/
- 源代码：https://github.com/Yong-code/counterfactual-garden

## 本地运行

需要 Python 3（macOS 通常可直接使用）：

```bash
git clone https://github.com/Yong-code/counterfactual-garden.git
cd counterfactual-garden
python3 -m http.server 4173
```

然后浏览器打开 http://localhost:4173 。

运行测试：

```bash
npm test
```

## GitHub / Git 零基础教程

- [GitHub 网页版教程](GITHUB_WEB_TUTORIAL_ZH.md)：只用浏览器查看、修改、上传、提交和发布。
- [本地 Git 教程](GIT_TUTORIAL_ZH.md)：学习 `add`、`commit`、`push`、分支与回退。

## 项目结构

```text
counterfactual-garden/
├── index.html          页面结构
├── styles.css         视觉设计与响应式布局
├── app.js             界面交互和浏览器存储
├── core.js            日期、状态、校准分等纯逻辑
├── tests/             不依赖第三方库的单元测试
├── GIT_TUTORIAL_ZH.md 本地 Git 零基础教程
└── GITHUB_WEB_TUTORIAL_ZH.md 只用浏览器的 GitHub 教程
```

## 下一步可以做什么

- 为不同分类设计不同植物外形
- 增加“一年后的自己”时间胶囊视图
- 添加可打印的月度复盘海报
- 做成离线可安装的 PWA
- 增加英文界面

欢迎用 Issue 留下想法，也欢迎把它 fork 成属于你自己的花园。

## License

[MIT](LICENSE)
