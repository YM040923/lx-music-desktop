# YM Music

YM Music 是基于 [LX Music Desktop](https://github.com/lyswhut/lx-music-desktop) fork 后继续调整的桌面音乐播放器分支。

这个分支的主要目标是美化和整理桌面端 UI，让播放详情页、播放栏、搜索页、歌单页、排行榜、设置页和常用弹层看起来更现代、更清楚、更适合日常使用。核心播放能力、音乐源能力、同步与下载等基础功能主要继承自 LX Music。

## 项目定位

- 这是 LX Music Desktop 的 fork 分支项目，不是 LX Music 官方版本。
- 当前维护重点是 UI 美化、交互整理和 Windows 桌面端使用体验优化。
- 本项目保持免费、开源，并继续遵循原项目的 Apache-2.0 许可证及相关使用说明。
- 感谢 LX Music 原作者落雪无痕以及社区贡献者，本项目是在原项目基础上继续做个人方向的界面优化。

## 下载与更新

请从本仓库的 GitHub Releases 获取发布版本：

[https://github.com/YM040923/ym-music-desktop/releases](https://github.com/YM040923/ym-music-desktop/releases)

YM Music 的软件更新检查也会读取本仓库发布信息。其他渠道均不是本分支的官方发布来源。

## 当前版本

当前版本：`v2.12.3`

本版本完成了 YM Music 命名、更新源迁移，以及一轮以 UI 美化为主的界面调整。

## 主要界面调整

- 重新整理播放栏样式和常用播放控制。
- 优化播放详情页背景、歌词显示、评论面板和当前播放列表入口。
- 优化搜索页结果区域、分页、空状态和搜索历史体验。
- 优化歌单、排行榜、设置页以及多个下拉/浮层的层级与可读性。
- 调整应用默认背景，让界面更依赖歌曲封面色彩和更自然的 Windows 桌面观感。

## 开发

```bash
npm install
npm run dev
```

常用检查：

```bash
npm run lint
```

打包脚本沿用原 LX Music Desktop 的 Electron 构建方式，具体脚本可查看 `package.json`。

## 上游项目

- 上游项目：[LX Music Desktop](https://github.com/lyswhut/lx-music-desktop)
- 上游文档：[LX Music 文档](https://lyswhut.github.io/lx-music-doc/)

如果问题和原项目核心能力相关，可以参考上游文档；如果问题和 YM Music 的 UI、美化、打包或更新有关，请在本仓库提交 Issue。

## 许可

本项目基于 Apache-2.0 许可证发布。项目内继承自 LX Music 的代码、说明与使用限制仍应尊重原项目许可证和相关声明。
