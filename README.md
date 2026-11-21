# Stylebook

Stylebook 将 shadcn/ui 的组件文档和 Blocks 按需移植到 Vite。首页试验台和顶栏菜单都可以切换风格。首次打开默认使用 iOS，shadcn 作为基准风格保留。风格通过字体、形状、边框、阴影和表面效果作用于同一套组件、页面模板与独立预览。

公开站点：[stylebook.peiiii.com](https://stylebook.peiiii.com/)。发布使用 `npm run build` 和 `wrangler deploy`，自定义域名由 `wrangler.jsonc` 管理。

## 运行

需要 Node.js 22.12+。

```sh
npm ci
npm run dev
```

打开 [组件总览](http://127.0.0.1:5173/#view=showcase)。同一页面按用途聚合 39 个官方组件预览，控件可直接操作。切换顶部主题可查看整套组件的效果；小控件最多四列，复杂组件使用更宽的空间。单项详情保留英文组件名、中文说明和中英文搜索。页面模板提供 `login-01`、`sidebar-07`、`dashboard-01` 的预览。

## 在其他项目中使用

[在线接入教程](https://stylebook.peiiii.com/#view=adopt)提供单主题和多主题示例。[采用指南](docs/adopt-stylebook.md)覆盖模板选择、从零接入、侧栏使用契约和目标项目验收。

- 在 Stylebook 选中一套风格或一个组件，点击「复制引用」，把引用和你的用途一起发给 AI 编程工具。
- 第一次使用时，在[在线接入教程](https://stylebook.peiiii.com/#view=adopt)点「复制给 AI」，把提示词发到正在开发目标项目的对话里。
- [Stylebook Skill](skills/stylebook/SKILL.md) 随仓库维护。主题标识、引用格式或源码路径变更时，检查 Skill 和下面的源码入口。主题与组件清单沿用现有源码。

## 使用与维护

- 组件名称保留英文，演示内容与模板默认使用简体中文；日历使用内置 zhCN locale，品牌、网址、邮箱和代码标识保留原文。

- 组件、示例、Blocks 和本地依赖关系见 [registry.json](src/library/registry.json)。把所需文件按显示路径保存，React 项目用 Tailwind CSS v4 编译并导入 [theme.css](src/library/theme.css)。第三方依赖的已验证版本见 [package.json](package.json)。
- 主题应用于 `html[data-atlas-theme]`，预设清单见 [themes.ts](src/library/themes.ts)，风格变量与组件样式见 [themes.css](src/library/themes.css)。新增主题在主题 CSS 中声明语义变量，并在清单中登记。
- Sidebar 与 Dashboard 的演示头像从 [public/avatars/shadcn.jpg](public/avatars/shadcn.jpg) 读取。迁入其他 Vite 项目时按相同路径保存头像。
- [官方上游固定提交](https://github.com/shadcn-ui/ui/tree/968d8cb9dc42ae5d52e8fd356cf84596ec832a26/apps/v4)，许可见 [上游 MIT](src/library/ui/LICENSE.md)。`src/library/ui`、`examples`、`blocks` 采用 New York Radix 源码。`src/library/docs` 保留官方文档结构、导航、预览与 Block Viewer 中适用的代码，Next.js 和 MDX 的数据接入改为 Vite 本地 registry。具体来源见 [移植记录](docs/designs/2026-11-18-component-library.design.md#官方文档与-blocks-移植)。

```sh
npm run lint
npm run build
npm test
npm run preview
```

浏览器测试使用本机 Chrome。预览服务器启动后，也可用 `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4173 npm test` 验证生产构建。

[项目目标](docs/product-brief.md) · [仓库](https://github.com/Peiiii/stylebook)
