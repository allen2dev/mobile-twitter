# mobile-twitter

移动风格社交时间线界面，使用 **Next.js 15**（App Router）与 **Tailwind CSS v4** 构建，动效使用 **Framer Motion**。产物为**静态导出**，可通过 **GitHub Pages** 托管预览。

## 在线预览

启用仓库 **Settings → Pages**，来源选择 **GitHub Actions**。部署成功后访问：

`https://allen2dev.github.io/mobile-twitter/`

（与 `next.config.ts` 中的 `basePath: "/mobile-twitter"` 一致。若仓库名或 Pages 根路径不同，请同步修改 `basePath`。）

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:3000/mobile-twitter](http://localhost:3000/mobile-twitter)（开发模式同样使用 `basePath`，与生产一致。）

## 构建

```bash
npm run build
```

静态文件输出在 `out/` 目录。`public/.nojekyll` 会复制到 `out/.nojekyll`，避免 GitHub Pages 的 Jekyll 忽略 `_next` 等下划线目录。

## 技术说明

- **output: "export"**：纯静态，无 Node 服务器。
- **images.unoptimized**：静态托管兼容。
- 工作流见 `.github/workflows/pages.yml`：在 `master` / `main` 推送时构建并部署到 GitHub Pages。

## 许可证

MIT（见 [LICENSE](LICENSE)）。
