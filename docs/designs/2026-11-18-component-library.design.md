# UI Atlas 多风格组件库

2026-11-18 已授权实施，取代 v0.1 的产品定位。参考 [shadcn/ui 文档](https://ui.shadcn.com/docs) 的开放源码、组件文档和 [Blocks](https://ui.shadcn.com/blocks) 的页面组合。视觉采用 UI Atlas 自己的蓝色文档外壳。

- C1：首页打开真实组件，导航按用途分组，组件可操作并可打开源码。
- C2：一项全局风格选择随链接、刷新和跨区导航恢复。首批为紧凑的线框、舒展的纸感，差别覆盖字阶、阴影、圆角、密度和模板容器。
- C3：项目看板和工作区设置使用目录中同一实现，完整页可独立打开。
- C4：组件、CSS、模板源码显示实际文件，注明依赖，复制可独立采用。
- C5：验证桌面、390px、键盘、交互、深链接。保留既有 v0.1 hash 链接作为历史入口。

React/Vite 沿用。复用 shadcn/ui Radix 源码，固定到 968d8cb9dc42ae5d52e8fd356cf84596ec832a26。保留上游组件结构、交互和 Tailwind 类，仅替换导入与格式。Tailwind CSS v4 生成样式，CSS 变量附在 data-atlas-theme 作用域，Radix 门户继承根主题。预览与模板共享组件导入。组件文档与整页模板各自持有演示内容。hash 区分新库与旧链接；无需 runtime registry 或 CLI。方案复核，避免组件页面和模板分别实现控件，以及复制出不匹配实际效果的代码。交付为本机与 Git main。

## 验收结果

- C1/C2：生产预览与 Chrome 实测组件按钮、搜索、主题切换、刷新恢复及对话框 Escape / 焦点归还。
- C3：390px 下实际创建项目、开关通知、保存设置并读回结果，独立模板页保留主题。
- C4：实测下载上游对话框源码。将模板、组件和主题文件复制到独立 Vite 入口，构建通过。
- C5：ESLint、TypeScript、生产构建和 8 项浏览器测试通过。比较桌面两套风格与窄屏暖纸模板的真实截图，修正主按钮对比度与移动端概览密度。旧目录六条回归继续通过。
- 个人项目大盘已在「工具与实验 / 开发与创作」登记 UI Atlas，线上三条入口均包含正式仓库链接。Cloudflare 版本 `53af5aa4-0a92-498c-adc5-63ffa76066cd`。
- 项目维护新增主题的入口由 README 与本轮设计承接。视觉偏好留给用户体验确认。浏览器证据来自 Chrome；组件库本轮以本机版本交付。

## 13:36 纠正批次

用户要求直接复制相关 shadcn 代码。六个已选组件的官方 demo 原样进入组件文档，保留英文示例文本与 DOM，改动限本地路径和 Badge 示例的未用图标导入。加入其 Label 原语依赖。预览框移植上游 ComponentPreviewTabs 的相关布局，去除 Next.js、RTL 和其他无关站点依赖。默认主题使用上游中性 token；蓝图和暖纸是项目主题。移除旧目录、比较、采用、旧数据和 Markdown/Prism 专用依赖。保留能够复用组件的看板与设置模板。

本批将六个 demo 与固定提交逐文件对比，确认只有上述导入改动。TypeScript、ESLint、构建和两条现行 Playwright 链路通过。逐项打开桌面默认主题和 390px 暖纸主题的六套官方 demo，均无运行错误及横向页面溢出。实际检查 Card 的两张截图；局部源码区可独立滚动。旧链路对应的测试已随功能删除。

## 官方文档与 Blocks 移植

14:00 用户修正范围。文档壳、导航、预览、源码展示也采用上游，亲自验证更完整的可用组件集合。固定提交同上，保留 React/Vite 和单一主题状态。

| 上游文件 | 迁入路径 | 适配范围 |
| --- | --- | --- |
| `app/(app)/docs/layout.tsx`、`app/(app)/docs/[[...slug]]/page.tsx` | `docs/DocsLayout.tsx`、`docs/DocPage.tsx` | 官方 SidebarProvider 网格、主阅读列、前后导航和右侧目录。用本地元数据替换 MDX 页树。 |
| `components/docs-sidebar.tsx`、`main-nav.tsx`、`site-header.tsx`、`command-menu.tsx` | `docs/DocsSidebar.tsx`、`docs/MainNav.tsx`、`docs/SiteHeader.tsx`、`docs/CommandMenu.tsx` | Sidebar、菜单高亮、主导航 Button 结构、窄屏 Sheet 和本地命令搜索。删站点推广、功能旗标及无关官网入口。 |
| `components/component-preview-tabs.tsx`、`component-source.tsx`、`copy-button.tsx`、`lib/highlight-code.ts`、`app/globals.css` | `docs/ComponentPreviewTabs.tsx`、`docs/ComponentSource.tsx`、`docs/CopyButton.tsx`、`docs/highlight-code.ts`、`docs/styles.css` | 保留预览与 View Code 分支、代码 figure、复制和 Shiki 渲染。删服务器文件读取、遥测、RTL 分支。 |
| `components/block-viewer.tsx`、`blocks-nav.tsx` | `docs/BlockViewer.tsx` | 保留分类横栏、Preview/Code 切换、独立页与 iframe。删分发平台入口、演示截图和调试工具。 |
| `registry/new-york-v4/{ui,examples,blocks,hooks}` | `src/library/{ui,examples,blocks,hooks}` | 39 对组件/官方示例及传递依赖，三个官方 Blocks。替换别名、Next Link，裁去未用导入；适配 Vite 头像路径与新版 Recharts 数值类型。 |

验收按生产构建运行。全部 39 个组件与三个 Blocks 逐项打开；验证 Dialog 键盘焦点归还、Checkbox 键盘切换、官方源码高亮、剪贴板内容和下载文件名。Block 验证在文档、独立标签页和 390px 的关系一致，Dashboard 在 1,374px 的桌面预览中显示侧栏、实际图表和数据表，并可查看实际入口源码。对比桌面文档和手机 Block 的真实截图。主线按现有授权提交与推送；本机预览交付。

## 组件总览

用户要求同一主题下在一页尽量紧凑地展示全部组件，移除面向浏览者的代码示例。组件总览是独立导航入口，主题卡也直接打开对应总览。继承全站主题选择和现有示例，按四个用途分组，使用两套网格分别排小控件和复杂组件，减少行高由单个大型示例撑开的空白。保留文档详情和页面模板预览，移除源码 UI、原文加载管线和高亮依赖。总览内演示只执行本地交互，沿用 Tooltip 上下文，并提供 Sonner 通知。

## 主题切换

顶栏用现有 shadcn Button 和 DropdownMenu RadioGroup，提供分组、色样和当前项，窄屏通过 Radix 定位及滚动。目录和菜单共用主题清单，主题 ID 仍随 URL 跨组件、模板及独立预览传递。主题库收录固定提交的 24 项官方基础色与强调色、经典 Gray 与 Slate、Neutral 暗色及 UI Atlas 自有的蓝图和暖纸，共 29 项。中性色的默认主题保留原有 shadcn ID。官方 token 来源为 `apps/v4/registry/themes.ts` 和 `apps/v4/public/r/themes/`。暗色同时启用 shadcn 的 dark 组件变体。

## 风格体系

29 项配色清单已退场。主题选择只呈现 shadcn 默认基准、Material、玻璃拟态和复古。复用 URL 状态、主题菜单、组件和模板。风格规则覆盖字体、控件及容器圆角、边框、投影和浮层；主题页使用实际 shadcn 组件提供并列样本。Material 参考 Material 的圆角与表面层级，代码和交互继续使用 shadcn。旧配色链接回退到默认基准。
