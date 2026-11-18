export const themes = [
  {
    id: "shadcn",
    label: "shadcn 默认",
    description: "中性色、细边框与克制的阴影。",
  },
  {
    id: "material",
    label: "Material",
    description: "蓝色强调、中性表面与清晰的控件层级。",
  },
  {
    id: "ios",
    label: "iOS",
    description: "系统字体、蓝色操作、分组表面与轻透浮层。",
  },
  {
    id: "retro",
    label: "复古",
    description: "纸张底色、衬线字体、粗边框与硬投影。",
  },
] as const;

export type AtlasTheme = (typeof themes)[number];
