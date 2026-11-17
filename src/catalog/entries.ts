export type Style = "outline" | "soft";
import type { ExampleKind } from "../examples/Examples";
export type { ExampleKind } from "../examples/Examples";
export type SampleState = "normal" | "long" | "empty" | "error";
export interface Entry {
  id: string;
  title: string;
  kind: "theme" | "component" | "scene";
  style: Style;
  example: ExampleKind;
  group: string;
  summary: string;
  tags: string[];
  suitable: string;
  avoid: string;
}
export const styles = {
  outline: {
    name: "清晰描边",
    english: "Clean Outline",
    id: "theme.clean-outline",
    features: "紧凑行结构、细边框、小圆角；层级由字重与对齐表达，少用阴影。",
  },
  soft: {
    name: "柔和浮层",
    english: "Soft Elevation",
    id: "theme.soft-elevation",
    features: "舒展留白、柔和底面、大圆角和轻阴影；独立卡片承载信息对象。",
  },
};
const components: {
  example: ExampleKind;
  title: string;
  tags: string[];
  summary: string;
}[] = [
  {
    example: "card",
    title: "信息卡片",
    tags: ["信息扫描", "内容组织"],
    summary: "让任务、进度和下一步各有归属。",
  },
  {
    example: "search",
    title: "搜索与筛选",
    tags: ["快速定位", "工具操作"],
    summary: "有边界的搜索输入，可组合的条件筛选。",
  },
  {
    example: "status",
    title: "状态与标签",
    tags: ["信息扫描", "状态反馈"],
    summary: "用语义图标识别状态，用标签区分类别。",
  },
  {
    example: "menu",
    title: "操作菜单",
    tags: ["工具操作", "渐进展示"],
    summary: "把对象的次要操作收进就地菜单。",
  },
  {
    example: "drawer",
    title: "详情抽屉",
    tags: ["内容组织", "渐进展示"],
    summary: "查看细节，保留原列表的位置与上下文。",
  },
  {
    example: "tabs",
    title: "内容页签",
    tags: ["阅读设置", "快速定位"],
    summary: "在同一对象的概览、定义和策略间切换。",
  },
];
export const entries: Entry[] = (["outline", "soft"] as const).flatMap(
  (style) => [
    {
      id: styles[style].id,
      title: styles[style].name,
      kind: "theme" as const,
      style,
      example: "activity" as const,
      group: "theme",
      summary: styles[style].features,
      tags: ["整套风格", style === "outline" ? "信息扫描" : "内容组织"],
      suitable:
        style === "outline"
          ? "高频工具、密集任务和需要快速定位的工作界面。"
          : "阅读、项目空间和需要分区的设置界面。",
      avoid:
        style === "outline"
          ? "以情绪、影像或叙事为主的展示页面。"
          : "需要在单屏容纳极高信息密度的数据表格。",
    },
    ...components.map((c) => ({
      ...c,
      id: `${c.example}.${style === "outline" ? "outlined" : "elevated"}`,
      title: `${c.title} · ${styles[style].name}`,
      kind: "component" as const,
      style,
      group: c.example,
      suitable: c.summary,
      avoid: "不要单独照搬颜色；同时保留排版、间距和交互反馈。",
    })),
    ...(["activity", "settings"] as const).map((example) => ({
      id: `page.${example}.${style === "outline" ? "outline" : "soft"}`,
      title: `${example === "activity" ? "汇报与活动流" : "定义与策略设置"} · ${styles[style].name}`,
      kind: "scene" as const,
      style,
      example,
      group: `page.${example}`,
      summary:
        example === "activity"
          ? "从活动时间线进入任务细节，连起扫描与处理。"
          : "长文阅读、Markdown 与分组参数共处一页。",
      tags: [example === "activity" ? "信息扫描" : "阅读设置", "完整场景"],
      suitable:
        example === "activity"
          ? "项目进度、交付记录和团队活动。"
          : "文档定义、规则说明和策略配置。",
      avoid: "演示交互只在当前预览中生效；不连接外部业务服务。",
    })),
  ],
);
export const findEntry = (id: string | null) =>
  entries.find((e) => e.id === id);
export const kindLabels = {
  theme: "整套风格",
  component: "组件样式",
  scene: "场景组合",
};
export const purposes = [
  "全部用途",
  "信息扫描",
  "内容组织",
  "阅读设置",
  "工具操作",
  "快速定位",
];
