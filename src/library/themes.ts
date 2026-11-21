export const themes = [
  {
    id: "ios",
    label: "iOS",
    description: "白色内容画布、胶囊操作与轻透导航。",
    adoption: {
      template: "login-01",
      use: "账户、设置与轻量表单",
      layout: "正文清晰，分组间多留白，控件对齐。",
      components: "分组表单、圆润输入和一个胶囊主按钮。",
      avoid: "把每个区域都做成玻璃浮层，或给输入叠加外圈。",
    },
  },
  {
    id: "material",
    label: "Material",
    description: "蓝色强调、中性表面与清晰的控件层级。",
    adoption: {
      template: "dashboard-01",
      use: "管理台、任务列表与生产力工具",
      layout: "中等密度，标题与辅助说明分级，表面按用途分层。",
      components: "侧栏、分段筛选、数据卡片和主操作。",
      avoid: "用主色填满页面或把所有控件画成胶囊。",
    },
  },
  {
    id: "fluent",
    label: "Windows 11",
    description: "Fluent 2 风格，冷调分层、桌面工具栏与蓝色导航指示条。",
    adoption: {
      template: "sidebar-07",
      use: "桌面工作区、文件与设置工具",
      layout: "紧凑工具栏，列表齐线，背景层次轻于内容。",
      components: "可折叠侧栏、面包屑和带蓝色指示条的当前项。",
      avoid: "用厚重阴影或饱和色块盖掉当前项指示。",
    },
  },
  {
    id: "ant",
    label: "Ant Design",
    description: "深色导航、白色内容区与紧凑的数据界面。",
    adoption: {
      template: "dashboard-01",
      use: "表格密集的后台、运营与数据管理",
      layout: "紧凑行高，浅灰表头，正文区域保持白色。",
      components: "深色 Sidebar、表格、筛选项和状态标签。",
      avoid: "把深色扩到整个页面，或给表格和表单加大圆角。",
    },
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    description: "白色画布、胶囊控件与克制的黑白层级。",
    adoption: {
      template: "sidebar-07",
      use: "对话、阅读或输入驱动的工具",
      layout: "浅色侧栏和白色内容区，正文留足阅读宽度。",
      components: "轻量侧栏、胶囊主操作和低强调的次要动作。",
      avoid: "给每一块内容都加底卡，或引入多种高饱和强调色。",
    },
  },
  {
    id: "claude",
    label: "Claude",
    description: "暖白表面、衬线标题与陶土色操作。",
    adoption: {
      template: "sidebar-07",
      use: "长文、文档工作区与写作工具",
      layout: "暖白表面，衬线标题与易扫读的正文分层。",
      components: "暖色侧栏、长文区域和少量陶土色主操作。",
      avoid: "把暖色用作全屏深底，或让正文和大标题同样抢眼。",
    },
  },
  {
    id: "retro",
    label: "复古",
    description: "纸张底色、衬线字体、粗边框与硬投影。",
    adoption: {
      template: "sidebar-07",
      use: "纸感目录、个人项目和创意工具",
      layout: "纸色底、衬线标题，矩形区块按线对齐。",
      components: "粗边框面板、硬投影与清晰的按压反馈。",
      avoid: "把硬投影改成柔光，或用细边线抹平纸张轮廓。",
    },
  },
  {
    id: "editorial",
    label: "墨刊",
    description: "新闻纸底、铅字衬线标题、单线报头与朱砂印记。",
    adoption: {
      template: "sidebar-07",
      use: "刊物、内容管理和文章型页面",
      layout: "衬线标题、新闻纸色与单线分隔，列表密度高于文章。",
      components: "单线报头、下划线输入、细线表格与朱砂选中标记。",
      avoid: "添加双线报头、满屏朱红或大圆角浮卡。",
    },
  },
  {
    id: "aurora",
    label: "极光",
    description: "极光渐变底上的磨砂玻璃表面与流光主操作。",
    adoption: {
      template: "login-01",
      use: "轻量工具、入口页或低密度内容",
      layout: "渐变留在底层，前景用清晰的文字和少量透色表面。",
      components: "磨砂面板、对比清晰的渐变主按钮与短表单。",
      avoid: "层层叠玻璃，或把渐变用在大段正文上。",
    },
  },
  {
    id: "clay",
    label: "软陶",
    description: "圆润黏土体块、内凹输入槽与可按下的珊瑚色按钮。",
    adoption: {
      template: "login-01",
      use: "轻量创意工具、短表单与引导界面",
      layout: "圆润体块需要间距，正文保持简洁。",
      components: "立体卡片、内凹输入和能按下的主按钮。",
      avoid: "用相同阴影装饰内外层，或把这套密度套给大表格。",
    },
  },
  {
    id: "pop",
    label: "波普",
    description: "粗墨描边、硬投影、明黄高光与海报点阵底。",
    adoption: {
      template: "dashboard-01",
      use: "活动工具、创意后台与需要醒目操作的页面",
      layout: "粗描边与较强标题形成节奏，正文和数据保持清楚。",
      components: "硬投影卡片、明黄主操作和清晰区隔的表格。",
      avoid: "所有按钮都用同样强的色块或硬投影。",
    },
  },
  {
    id: "shadcn",
    label: "shadcn 基准",
    description: "中性色、细边框与克制的阴影。",
    adoption: {
      template: "dashboard-01",
      use: "通用工作台、表单与产品原型",
      layout: "中性色、规整间距和稳定的字号层级。",
      components: "语义化按钮、表单、侧栏与表格。",
      avoid: "混用不一致的圆角、状态色和阴影。",
    },
  },
] as const;

export type AtlasTheme = (typeof themes)[number];

export function resolveTheme(id: string) {
  const requested = id === "glass" ? "ios" : id;
  return themes.find((entry) => entry.id === requested) ?? themes[0];
}
