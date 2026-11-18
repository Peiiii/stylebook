export const themes = [
  {
    id: "shadcn",
    label: "shadcn 默认",
    description: "中性色、细边框与克制的阴影。",
  },
  {
    id: "material",
    label: "Material",
    description: "圆润控件、柔和色阶与分层表面。",
  },
  {
    id: "glass",
    label: "玻璃拟态",
    description: "透光面板、细亮边框与背景模糊。",
  },
  {
    id: "retro",
    label: "复古",
    description: "纸张底色、衬线标题、粗边框与硬投影。",
  },
] as const;

export type AtlasTheme = (typeof themes)[number];
