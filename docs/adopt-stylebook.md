# 在自己的项目里采用 Stylebook

先确定用在哪个页面，以及要采用整套风格还是单个组件。然后在 [主题页](https://stylebook.peiiii.com/#view=themes) 打开对应风格的「采用要点」，查看排版、空间和组件组合，再打开推荐模板。复制风格引用时，这些信息会一起带给 AI。把具体用途写在引用旁边。

## 从完整模板起步

| 目标页面         | 起点           | 建议保留的结构                                 |
| ---------------- | -------------- | ---------------------------------------------- |
| 后台和数据工作台 | `dashboard-01` | 侧栏、内容区、指标与图表、筛选和数据表格的层级 |
| 工具或内容工作区 | `sidebar-07`   | 侧栏与主体的关系、分组、当前项、折叠与手机抽屉 |
| 登录或轻量表单   | `login-01`     | 表单、字段标签、主操作和辅助入口的顺序         |

可以替换业务文案、数据、栏目和图标。需要还原风格时，保留模板里与目标页面有关的布局层级、内容密度、表面分层和交互状态。只取用一个组件时，在目标项目现有结构中集成它，用对应预览核对组件状态。

## 从零跑通 Ant Design 的可折叠侧栏

下面的例子适用于 Vite、React 和 Tailwind CSS v4。所需依赖及项目验证版本见 [package.json](../package.json)。从源仓库的同一提交取文件，便于以后升级和比对。

在新项目中安装运行和构建所需依赖。

```sh
npm init -y
npm install react react-dom radix-ui lucide-react class-variance-authority clsx tailwind-merge
npm install -D vite @vitejs/plugin-react tailwindcss@4 @tailwindcss/vite@4 tw-animate-css
```

在 [registry.json](../src/library/registry.json) 的 `blocks` 中找到 `sidebar-07`，将它的 `files` 全部复制到项目的 `src/library/` 下，保留相对路径。再复制 [theme.css](../src/library/theme.css)、[themes.css](../src/library/themes.css) 到同一目录，以及 [头像](../public/avatars/shadcn.jpg) 到 `public/avatars/shadcn.jpg`。复用源码时保留 [项目许可](../LICENSE) 和 [组件许可](../src/library/ui/LICENSE.md)。

项目根目录的 `vite.config.mjs` 启用 Tailwind 和 React。

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default defineConfig({ plugins: [react(), tailwind()] });
```

在 `index.html` 的 `html` 元素设置主题，让挂到 `body` 的弹窗和移动侧栏也能继承它。

```html
<!doctype html>
<html lang="zh-CN" data-atlas-theme="ant">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Stylebook 接入示例</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

在 `src/main.tsx` 先引入基础变量，再引入风格。

```tsx
import { createRoot } from "react-dom/client";
import SidebarPage from "./library/blocks/sidebar-07/page";
import "./library/theme.css";
import "./library/themes.css";

createRoot(document.getElementById("root")!).render(<SidebarPage />);
```

运行 `npx vite`，对照同风格的 [可折叠侧栏](https://stylebook.peiiii.com/#view=blocks&template=sidebar-07&theme=ant)。在已有项目中按当前 Tailwind 入口合并所需 token 和风格规则，避免再次引入同一套 Tailwind 基础样式。

### 侧栏契约

使用源仓库的 [Sidebar](../src/library/ui/sidebar.tsx) 和它导出的菜单组件。样式作用在 Sidebar 提供的 `data-sidebar="sidebar"` 表面，支持固定侧栏、可折叠侧栏和手机抽屉。给当前项传 `isActive`，并按链接或页面导航的语义设置 `aria-current="page"`。它们分别提供样式状态和可访问的当前页标记。

移植样式到另一个组件实现时，核对它的实际 slot 和状态属性。保留或映射 `data-sidebar="menu-button"`、`data-sidebar="menu-sub-button"` 和选中状态。使用 Radix 的 `asChild` 包装菜单项时，这两个标记仍可识别菜单项。场景专用的项目状态、报表布局等规则可以按目标业务单独取舍。

## 从单主题扩展到多主题

先按上面的步骤准备项目，依赖和基础 CSS 共用一次。然后复制 [themes.ts](../src/library/themes.ts) 到 `src/library/`，以及 [多主题示例](../src/library/examples/multi-theme-adoption.tsx) 到 `src/library/examples/`。把 `index.html` 中的主题属性改成 `data-atlas-theme="ios"`。在 `src/main.tsx` 将原来的页面导入和渲染替换为这个示例。

```tsx
import { createRoot } from "react-dom/client";
import MultiThemeAdoption from "./library/examples/multi-theme-adoption";
import "./library/theme.css";
import "./library/themes.css";

createRoot(document.getElementById("root")!).render(<MultiThemeAdoption />);
```

应用的可选项由示例里的 `themeIds` 决定，第一项是默认值。用项目自己的 `storageKey` 保存偏好，避免多个应用共享域名时互相覆盖。示例只保存允许的主题 ID，切换时更新应用根元素。继续使用同一套组件和样式文件，浮层也会跟随根元素的主题。

在已有应用中，保留你的页面和组件。把同样的允许清单、偏好读取与根元素更新放进现有设置逻辑。将初始 HTML 的 `data-atlas-theme` 改成你的默认主题。

运行 `npx vite`。切到 Ant Design，刷新后核对选择是否保留，再缩窄窗口并展开侧栏，确认抽屉继承了当前风格。也可以先在 [接入教程](https://stylebook.peiiii.com/#view=adopt) 在线试用。

## 在目标项目验收

- 打开同风格模板，在同样的视口宽度和状态下比较。核对正文与标题的字号层级、导航与内容的关系、列表密度、表面、圆角和边框。
- 操作页面中的主按钮、当前导航项、表单和浮层。分别检查默认、悬停、键盘聚焦、选中和禁用状态。用窄屏复测侧栏抽屉和弹窗，确认样式仍然生效且页面无横向溢出。
- 给出目标项目中已核对的页面、参考预览和使用的 Stylebook 提交。记录有意变化的业务结构和待确认的差异。
