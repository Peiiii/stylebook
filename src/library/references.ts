import type { AtlasTheme } from "./themes";

export const repositoryUrl = "https://github.com/Peiiii/stylebook";
const previewUrl = "https://stylebook.peiiii.com/";

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
