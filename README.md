# UI Atlas

UI Atlas 将 shadcn/ui 的组件文档和 Blocks 按需移植到 Vite。顶部主题选择器提供 shadcn Default、Blueprint 和 Warm Paper，同样作用于组件、Blocks 和新标签页预览。

## 运行

需要 Node.js 22.12+。

```sh
npm ci
npm run dev
```

打开 [组件文档](http://127.0.0.1:5173/)。 默认使用简体中文，并支持按中文组件名、英文组件名或 ID 搜索。官方组件示例及其源码保留上游原文。左侧按用途整理 39 个组件。示例来自官方 registry，可以展开高亮示例源码，或在 Source files 切换、复制和下载实际文件。Blocks 提供 `login-01`、`sidebar-07`、`dashboard-01` 和各自的源文件。

## 使用与维护

- 组件、示例、Blocks 和本地依赖关系见 [registry.json](src/library/registry.json)。把所需文件按显示路径保存，React 项目用 Tailwind CSS v4 编译并导入 [theme.css](src/library/theme.css)。第三方依赖的已验证版本见 [package.json](package.json)。
- 主题应用于 `html[data-atlas-theme]`，值为 `shadcn`、`blueprint` 或 `paper`。新增主题在主题 CSS 中声明语义变量，并登记到主题选择器。
- Sidebar 与 Dashboard 的演示头像从 [public/avatars/shadcn.jpg](public/avatars/shadcn.jpg) 读取。迁入其他 Vite 项目时按相同路径保存头像。
- [官方上游固定提交](https://github.com/shadcn-ui/ui/tree/968d8cb9dc42ae5d52e8fd356cf84596ec832a26/apps/v4)，许可见 [上游 MIT](src/library/ui/LICENSE.md)。`src/library/ui`、`examples`、`blocks` 采用 New York Radix 源码。`src/library/docs` 保留官方文档结构、导航、预览、代码展示与 Block Viewer 中适用的代码，Next.js 和 MDX 的数据接入改为 Vite 本地 registry。具体来源见 [移植记录](docs/designs/2026-11-18-component-library.design.md#官方文档与-blocks-移植)。

```sh
npm run lint
npm run build
npm test
npm run preview
```

浏览器测试使用本机 Chrome。预览服务器启动后，也可用 `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4173 npm test` 验证生产构建。

[项目目标](docs/product-brief.md) · [仓库](https://github.com/Peiiii/ui-atlas)
