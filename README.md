# blog-road

一个基于 VuePress 2 和 vuepress-theme-hope 的个人技术博客。

## 快速开始

```bash
npm install
npm run docs:dev
```

## 常用脚本

- `npm run docs:dev`：本地开发预览
- `npm run docs:clean-dev`：清理缓存后启动
- `npm run docs:build`：构建静态站点
- `npm run docs:update-package`：更新 VuePress 相关依赖

## 部署

- 运行 `./deploy.sh` 进行构建并推送到 `gh-pages`。

## 目录结构

- `src/`：站点内容
- `src/.vuepress/`：配置、主题、导航、侧边栏与样式
- `src/.vuepress/public/`：静态资源

## 写作约定

- 使用 Markdown 编写，Front Matter 维护元信息
- 文章结构化、条目化，便于快速复习
- 示例尽量可运行或说明简化点
