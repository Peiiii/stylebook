# UI Atlas

基于 shadcn/ui 的精选多风格 React 组件库。默认使用 shadcn 的中性主题，也可切换「蓝图」或「暖纸」。组件预览和页面模板使用同一套风格。模板直接组合库内组件。

## 运行

需要 Node.js 22.12+。

```sh
npm ci
npm run dev
```

在 [本机组件文档](http://127.0.0.1:5173/) 打开组件预览。「源码」提供组件、官方示例、所需依赖源码、主题样式和许可文件。可复制或逐个下载。选择页面模板后可以打开完整页面，风格随链接保留。

## 内容与扩展

- 组件：Button、Input、Card、Badge、Switch、Dialog。
- 模板：项目看板、工作区设置。
- 组件源码来自 [shadcn/ui 的 Radix 新纽约实现](https://github.com/shadcn-ui/ui/tree/968d8cb9dc42ae5d52e8fd356cf84596ec832a26/apps/v4/registry/new-york-v4/ui)。本地只调整导入路径与格式，保留组件 API、交互原语和样式类。许可见 [上游 MIT](src/library/ui/LICENSE.md)。
- 在 [theme.css](src/library/theme.css) 新增主题变量和外观规则，在 [Library.tsx](src/library/Library.tsx) 登记风格。新组件沿相同方式从选定的上游版本引入，并通过真实组件预览验证。
- 官方示例来自同一提交的 [examples](https://github.com/shadcn-ui/ui/tree/968d8cb9dc42ae5d52e8fd356cf84596ec832a26/apps/v4/registry/new-york-v4/examples)。预览直接导入这些文件，调整仅涉及本地导入和移除未使用的图标。Card、Dialog、Switch 的 Label 也是上游原件。

```sh
npm run lint
npm run build
npm test
npm run preview
```

Playwright 使用本机 Chrome。静态构建输出 `dist/`，hash 深链接无需服务器重写。

[本轮设计与验收](docs/designs/2026-11-18-component-library.design.md) · [项目目标](docs/product-brief.md) · [开源仓库](https://github.com/Peiiii/ui-atlas)

原创内容采用 [MIT](LICENSE)。第三方代码与依赖保留各自许可。
