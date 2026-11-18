export const themeGroups = [
  {
    label: "基础色",
    themes: [
      { id: "shadcn", label: "shadcn 默认", search: "neutral" },
      { id: "dark", label: "暗色", search: "dark" },
      { id: "stone", label: "石灰", search: "stone" },
      { id: "zinc", label: "锌灰", search: "zinc" },
      { id: "mauve", label: "灰紫", search: "mauve" },
      { id: "olive", label: "橄榄", search: "olive" },
      { id: "mist", label: "雾灰", search: "mist" },
      { id: "taupe", label: "灰褐", search: "taupe" },
      { id: "gray", label: "灰色", search: "gray" },
      { id: "slate", label: "石板灰", search: "slate" },
    ],
  },
  {
    label: "强调色",
    themes: [
      { id: "amber", label: "琥珀", search: "amber" },
      { id: "blue", label: "蓝色", search: "blue" },
      { id: "cyan", label: "青色", search: "cyan" },
      { id: "emerald", label: "翡翠", search: "emerald" },
      { id: "fuchsia", label: "玫紫", search: "fuchsia" },
      { id: "green", label: "绿色", search: "green" },
      { id: "indigo", label: "靛蓝", search: "indigo" },
      { id: "lime", label: "青柠", search: "lime" },
      { id: "orange", label: "橙色", search: "orange" },
      { id: "pink", label: "粉色", search: "pink" },
      { id: "purple", label: "紫色", search: "purple" },
      { id: "red", label: "红色", search: "red" },
      { id: "rose", label: "玫瑰", search: "rose" },
      { id: "sky", label: "天蓝", search: "sky" },
      { id: "teal", label: "蓝绿", search: "teal" },
      { id: "violet", label: "紫罗兰", search: "violet" },
      { id: "yellow", label: "黄色", search: "yellow" },
    ],
  },
  {
    label: "自有风格",
    themes: [
      { id: "blueprint", label: "蓝图", search: "blueprint" },
      { id: "paper", label: "暖纸", search: "paper" },
    ],
  },
];

export const themes = themeGroups.flatMap((group) => group.themes);
export type AtlasTheme = (typeof themes)[number];
