import type { AtlasTheme } from "./themes";

export const repositoryUrl = "https://github.com/Peiiii/stylebook";
const previewUrl = "https://stylebook.peiiii.com/";
export const adoptionGuideUrl = `${repositoryUrl}/blob/main/docs/adopt-stylebook.md`;
export const stylebookSetupPrompt = [
  "请为当前项目接入 Stylebook Skill，方便我之后用 Stylebook 的风格或组件。",
  `请先读取 Skill 源文件 https://raw.githubusercontent.com/Peiiii/stylebook/main/skills/stylebook/SKILL.md（出处：${repositoryUrl}/tree/main/skills/stylebook）。`,
  "如果你的工具支持项目级 Skill，请按它的方式加入当前项目。若不支持，请把这份文件作为本次对话的参考说明。",
  "准备好后告诉我。等我发来具体风格、组件或页面需求，再修改应用。",
].join("\n");

function sourceLink(file: string) {
  return `${repositoryUrl}/blob/main/${file}`;
}

export type StylebookReference = {
  name: string;
  text: string;
  sourceHref: string;
};

export function themeReference(theme: AtlasTheme): StylebookReference {
  const sourceHref = sourceLink("src/library/themes.css");
  const { adoption } = theme;
  return {
    name: theme.label,
    sourceHref,
    text: [
      `Stylebook · ${theme.label}`,
      "类型：UI 风格",
      `标识：${theme.id}`,
      `简介：${theme.description}`,
      `预览：${previewUrl}#view=showcase&theme=${theme.id}`,
      `开源仓库：${repositoryUrl}`,
      `主题源码：${sourceHref}`,
      `源码定位：data-atlas-theme="${theme.id}"`,
      `适用场景：${adoption.use}`,
      `推荐模板：${previewUrl}#view=blocks&template=${adoption.template}&theme=${theme.id}`,
      `排版与空间：${adoption.layout}`,
      `组件组合：${adoption.components}`,
      `避免：${adoption.avoid}`,
      `采用指南：${adoptionGuideUrl}`,
    ].join("\n"),
  };
}

export function componentReference(
  component: {
    id: string;
    title: string;
    files: string[];
    zh: { description: string };
  },
  theme: AtlasTheme,
): StylebookReference {
  const file = `ui/${component.id}.tsx`;
  const sourceHref = sourceLink(`src/library/${file}`);
  const related = component.files.filter((entry) => entry !== file);
  return {
    name: component.title,
    sourceHref,
    text: [
      `Stylebook · ${component.title}`,
      "类型：UI 组件",
      `标识：${component.id}`,
      `简介：${component.zh.description}`,
      `预览风格：${theme.label}（${theme.id}）`,
      `预览：${previewUrl}#view=components&component=${component.id}&theme=${theme.id}`,
      `开源仓库：${repositoryUrl}`,
      `组件源码：${sourceHref}`,
      `风格源码：${sourceLink("src/library/themes.css")} · data-atlas-theme="${theme.id}"`,
      ...related.map(
        (entry) => `关联文件：${sourceLink(`src/library/${entry}`)}`,
      ),
    ].join("\n"),
  };
}
