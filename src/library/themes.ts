export const themes = [
  {
    id: "ios",
    label: "iOS",
    description: "白色内容画布、胶囊操作与轻透导航。",
  },
  {
    id: "material",
    label: "Material",
    description: "蓝色强调、中性表面与清晰的控件层级。",
  },
  {
    id: "fluent",
    label: "Windows 11",
    description: "Fluent 2 风格，冷调分层、桌面工具栏与蓝色导航指示条。",
  },
  {
    id: "ant",
    label: "Ant Design",
    description: "深色导航、白色内容区与紧凑的数据界面。",
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    description: "白色画布、胶囊控件与克制的黑白层级。",
  },
  {
    id: "claude",
    label: "Claude",
    description: "暖白表面、衬线标题与陶土色操作。",
  },
  {
    id: "retro",
    label: "复古",
    description: "纸张底色、衬线字体、粗边框与硬投影。",
  },
  {
    id: "editorial",
    label: "墨刊",
    description: "新闻纸底、铅字衬线标题、单线报头与朱砂印记。",
  },
  {
    id: "aurora",
    label: "极光",
    description: "极光渐变底上的磨砂玻璃表面与流光主操作。",
  },
  {
    id: "clay",
    label: "软陶",
    description: "圆润黏土体块、内凹输入槽与可按下的珊瑚色按钮。",
  },
  {
    id: "pop",
    label: "波普",
    description: "粗墨描边、硬投影、明黄高光与海报点阵底。",
  },
  {
    id: "shadcn",
    label: "shadcn 基准",
    description: "中性色、细边框与克制的阴影。",
  },
] as const;

export type AtlasTheme = (typeof themes)[number];

export function resolveTheme(id: string) {
  const requested = id === "glass" ? "ios" : id;
  return themes.find((entry) => entry.id === requested) ?? themes[0];
}
