# UI Atlas

面向所有人的 UI 风格选型与沟通目录。看真实效果、同条件比较，再用截图、链接与采用说明和 AI 或开发者沟通；也可直接复用源码。

## 打开首版

需要 Node.js 22.12+（本轮实测 22.23.2）。

```sh
npm ci
npm run dev
```

打开终端显示的本机地址，默认 [http://127.0.0.1:5173/](http://127.0.0.1:5173/)。仅在本机使用，无账号、数据库、AI API 或密钥。

- **选型**：在整套风格、组件样式、场景组合中浏览或搜索。将同组条目加入比较，点击底部“开始比较”。
- **比较**：共享视口、浅深色、样例状态与场景。页面预览标明真实内容宽度和显示比例；手机可切换 A/B。
- **采用**：选择整体风格或局部样式后，复制包含稳定 ID、视觉约束、参考链接与代码位置的 Markdown。选择写入 URL，复制链接或刷新可恢复；更换整体风格会替换旧风格。
- **截图**：详情页点击“干净预览”，独立页面只显示样例，可直接浏览器截图。链接保留预览条件；手机内容宽度为 390px。首版不提供自动 PNG 导出。
- **复用**：详情的“可用代码”提供实际运行的 TSX、CSS 与导入方式。复制两个完整文件即可使用，无需目录外壳。

本地地址不能供他人远程访问，请同时传递截图与采用说明。本轮未部署公网网站。

## 内容与实现

两套完整风格：`theme.clean-outline`（清晰描边）和 `theme.soft-elevation`（柔和浮层）。六组组件各两种风格：卡片、搜索筛选、状态标签、菜单、抽屉、页签。活动流与定义/策略两个完整场景各两种风格，共 18 个条目。提供正常、长内容、空内容和异常状态；演示内容为通用虚构项目，交互只影响当前预览。

React + TypeScript + Vite，原生 CSS；Lucide 图标、react-markdown 和 Prism 源码高亮。依赖版本由 `package-lock.json` 固定。样例通过同源 iframe 隔离渲染；源码从同一实际模块以 raw 导入，避免维护另一份展示代码。源码高亮按需加载。

```text
src/catalog/     条目元数据与 CatalogStore（URL 状态 owner）
src/examples/    可独立复用的真实 TSX 与样式
src/preview/     隔离预览、缩放和错误恢复
src/pages/       源码展示
src/components/  复制与失败回退
src/App.tsx      浏览、详情、比较和采用界面
```

项目事实：[产品目标](docs/product-brief.md) · [设计与技术决策](docs/designs/2026-11-18-catalog-v0.1.design.md) · [首版验证记录](docs/validation/2026-11-18-v0.1.md)。公开仓库：[Peiiii/ui-atlas](https://github.com/Peiiii/ui-atlas)。

## 验证与静态构建

```sh
npm run typecheck
npm run lint
npm run build
npm test
npm run preview
```

浏览器测试默认使用本机 Google Chrome；未安装时运行 `npx playwright install chromium`，并将 `playwright.config.ts` 的 `channel: 'chrome'` 删除。测试会自动启动或复用 5173 端口服务，证据截图写到 `docs/validation/`，临时输出在忽略的 `.local/`。覆盖选型、比较公平性、采用说明、URL 恢复、18 个条目、窄屏深色长文、错误恢复、剪贴板拒绝和源码入口。构建输出 `dist/`，使用 hash 路由，无需服务端路由重写。

开发体系接入检查：

```sh
node ../../ai-development-system/bin/ai-development-system.mjs check --target .
```

## 来源与 License

原创目录、样例与文案采用 [MIT](LICENSE)。图标为 [Lucide](https://lucide.dev/)（ISC），Markdown 由 [react-markdown](https://github.com/remarkjs/react-markdown)（MIT）渲染，高亮由 [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer)（MIT）提供。无复制的第三方视觉资产或私人数据。开发体系文件来源见 `.agents/ai-development-system.lock.json`。
