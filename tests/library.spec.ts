import { expect, test, type Page } from "@playwright/test";
import registry from "../src/library/registry.json" with { type: "json" };

const themeTrigger = (page: Page) =>
  page.getByRole("button", { name: "切换主题", exact: true });

async function selectTheme(page: Page, label: string) {
  await themeTrigger(page).click();
  await page
    .getByRole("menuitemradio", { name: new RegExp(`^${label}(?: |$)`) })
    .click();
  await expect(themeTrigger(page)).toHaveText(label);
}

test("home introduces the catalog and restyles the artwork while themes change", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "GitHub" }).locator("svg"),
  ).toHaveCSS("width", "20px");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /先看风格.*再做界面/,
  );
  const nav = page.getByRole("navigation", { name: "主导航" });
  const picker = page.getByRole("radiogroup", { name: "选择界面风格" });
  await expect(page.getByRole("main").getByRole("radiogroup")).toHaveCount(1);
  const choices = picker.getByRole("radio");
  await expect(choices).toHaveCount(8);
  await expect(choices.first()).toHaveAccessibleName("iOS");
  await expect(choices.first()).toBeChecked();
  await expect(choices.last()).toHaveAccessibleName("shadcn 基准");
  await expect(nav.getByRole("link", { name: "首页" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  const artwork = page.getByRole("figure", { name: "同一套界面的多风格插图" });
  await expect(artwork.locator("figcaption")).toContainText("iOS");
  await expect(artwork).toHaveCount(1);
  const sheet = artwork.locator('[data-artwork-sheet="current"]');
  await expect(sheet).toHaveCSS("background-color", "rgb(245, 245, 247)");
  await expect(sheet).toHaveCSS("border-top-left-radius", "16px");
  const ant = picker.getByRole("radio", { name: "Ant Design", exact: true });
  await ant.click();
  await expect(page.locator("html")).toHaveAttribute("data-atlas-theme", "ant");
  await expect(ant).toBeChecked();
  await expect(themeTrigger(page)).toHaveText("Ant Design");
  await expect(artwork.locator("figcaption")).toContainText("Ant Design");
  await expect(sheet).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(sheet).toHaveCSS("border-top-left-radius", "8px");
  await expect(nav.getByRole("link", { name: "首页" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await page.getByRole("link", { name: "浏览组件总览" }).click();
  await expect(nav.getByRole("link", { name: "组件总览" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await page.getByRole("link", { name: "Stylebook", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "先看风格",
  );
  await expect(themeTrigger(page)).toHaveText("Ant Design");
  await page.setViewportSize({ width: 320, height: 720 });
  await page.evaluate(() => window.scrollTo(0, 110));
  await expect
    .poll(() =>
      picker.evaluate((group) => {
        const viewport = group.parentElement!;
        return viewport.scrollWidth - viewport.clientWidth;
      }),
    )
    .toBeGreaterThan(0);
  await picker.getByRole("radio", { name: "shadcn 基准" }).press("Enter");
  await expect(page.locator("html")).toHaveAttribute(
    "data-atlas-theme",
    "shadcn",
  );
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(90);
  await expect
    .poll(() => page.locator("html").evaluate((root) => root.scrollWidth))
    .toBe(320);
  await expect(
    page.getByRole("link", { name: /Bento · 设计手记/ }),
  ).toBeVisible();
});

test("the homepage and Toggle Group demo share the iOS segmented selection", async ({
  page,
}) => {
  await page.goto("/");
  const picker = page.getByRole("radiogroup", { name: "选择界面风格" });
  await expect(picker).toHaveAttribute("data-slot", "segmented-control");
  await expect(picker).toHaveCSS("background-color", "rgb(240, 240, 242)");
  const ios = picker.getByRole("radio", { name: "iOS", exact: true });
  await expect(ios).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(ios).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");
  await expect(ios).toHaveCSS("color", "rgb(28, 28, 30)");

  await page.goto("/#component=toggle-group&theme=ios");
  const range = page.getByRole("radiogroup", { name: "选择时间范围" });
  await expect(range).toHaveAttribute("data-slot", "segmented-control");
  const week = range.getByRole("radio", { name: "周", exact: true });
  await expect(week).toBeChecked();
  await week.press("ArrowRight");
  const month = range.getByRole("radio", { name: "月", exact: true });
  await expect(month).toBeFocused();
  await expect(month).toHaveCSS("outline-width", "2px");
  await page.keyboard.press("Space");
  await expect(month).toBeChecked();
  await expect(month).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await page.keyboard.press("Space");
  await expect(month).toBeChecked();
  await expect(
    page.getByRole("toolbar", { name: "文本格式" }).getByRole("button"),
  ).toHaveCount(3);
});

test("Material connects segments and keeps their selection visible", async ({
  page,
}) => {
  await page.goto("/#view=home&theme=material");
  const picker = page.getByRole("radiogroup", { name: "选择界面风格" });
  const first = picker.getByRole("radio", { name: "iOS", exact: true });
  const material = picker.getByRole("radio", { name: "Material", exact: true });
  await expect(material).toBeChecked();
  await expect(picker).toHaveCSS("column-gap", "0px");
  await expect(first).toHaveCSS("border-top-left-radius", "999px");
  await expect(first).toHaveCSS("border-top-right-radius", "0px");
  await expect(material).toHaveCSS("border-left-width", "0px");
  await expect(material).toHaveCSS("background-color", "rgb(211, 227, 253)");
  await expect(material).toHaveCSS("box-shadow", "none");

  await page.goto("/#component=toggle-group&theme=material");
  const range = page.getByRole("radiogroup", { name: "选择时间范围" });
  await expect(range.getByRole("radio", { name: "周" })).toHaveCSS(
    "background-color",
    "rgb(211, 227, 253)",
  );
  const tools = page.getByRole("toolbar", { name: "文本格式" });
  const bold = tools.getByRole("button", { name: "切换加粗" });
  const italic = tools.getByRole("button", { name: "切换斜体" });
  await expect(bold).toHaveAttribute("aria-pressed", "true");
  await expect(italic).toHaveCSS("border-left-width", "0px");
  await italic.click();
  await expect(italic).toHaveAttribute("aria-pressed", "true");
  await expect(italic).toHaveCSS("background-color", "rgb(211, 227, 253)");
  await expect(bold).toHaveAttribute("aria-pressed", "true");
});

test("all eight themes style the shared segmented control on the homepage and in the catalog", async ({
  page,
}) => {
  test.setTimeout(60_000);
  const cases = [
    {
      id: "ios",
      label: "iOS",
      track: "rgb(240, 240, 242)",
      selected: "rgb(255, 255, 255)",
      radius: "9px",
    },
    {
      id: "material",
      label: "Material",
      track: "rgba(0, 0, 0, 0)",
      selected: "rgb(211, 227, 253)",
      radius: "0px",
    },
    {
      id: "fluent",
      label: "Windows 11",
      track: "rgba(0, 0, 0, 0)",
      selected: "rgb(238, 244, 251)",
      radius: "4px",
    },
    {
      id: "ant",
      label: "Ant Design",
      track: "rgb(245, 245, 245)",
      selected: "rgb(255, 255, 255)",
      radius: "4px",
    },
    {
      id: "chatgpt",
      label: "ChatGPT",
      track: "rgba(0, 0, 0, 0)",
      selected: "rgb(235, 235, 235)",
      radius: "999px",
    },
    {
      id: "claude",
      label: "Claude",
      track: "rgb(244, 242, 236)",
      selected: "rgb(237, 229, 217)",
      radius: "10px",
    },
    {
      id: "retro",
      label: "复古",
      track: "rgb(237, 223, 195)",
      selected: "rgb(255, 246, 229)",
      radius: "4px",
    },
    {
      id: "shadcn",
      label: "shadcn 基准",
      track: /^oklch\(0\.97 /,
      selected: /^oklch\(1 /,
      radius: "8px",
    },
  ];

  for (const { id, label, track, selected, radius } of cases) {
    await page.goto(`/#view=home&theme=${id}`);
    const picker = page.getByRole("radiogroup", { name: "选择界面风格" });
    const current = picker.getByRole("radio", { name: label, exact: true });
    await expect(current).toBeChecked();
    await expect(picker).toHaveCSS("background-color", track);
    await expect(current).toHaveCSS("background-color", selected);
    await expect(current).toHaveCSS("border-top-left-radius", radius);
    if (id === "retro") {
      await expect(current).toHaveCSS("border-top-color", "rgb(139, 62, 45)");
      const stroke = current.locator("svg");
      await expect(stroke).toHaveCSS("stroke", "rgb(55, 41, 33)");
      await expect(current).toHaveCSS("color", "rgb(55, 41, 33)");
      const offset = await current.evaluate((segment) => {
        const icon = segment.querySelector("svg")!.getBoundingClientRect();
        const text = segment.querySelector("span")!.getBoundingClientRect();
        return Math.abs(
          icon.top + icon.height / 2 - text.top - text.height / 2,
        );
      });
      expect(offset).toBeLessThan(1);
    }

    await page.goto(`/#component=toggle-group&theme=${id}`);
    const demo = page.getByRole("radiogroup", { name: "选择时间范围" });
    await expect(demo).toHaveCSS("background-color", track);
    await expect(
      demo.getByRole("radio", { name: "周", exact: true }),
    ).toHaveCSS("background-color", selected);
    const formatting = page.getByRole("toolbar", { name: "文本格式" });
    await expect(
      formatting.getByRole("button", { name: "切换加粗" }),
    ).toHaveCSS("background-color", id === "shadcn" ? track : selected);
  }
});

test("copies declarative theme and component references from compact actions", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const copied = () => page.evaluate(() => navigator.clipboard.readText());
  await page.goto("/#view=showcase&theme=ant");
  await page
    .getByRole("button", { name: "复制引用：Ant Design", exact: true })
    .click();
  await expect
    .poll(copied)
    .toContain("Stylebook · Ant Design\n类型：UI 风格\n标识：ant");
  expect(await copied()).toContain('源码定位：data-atlas-theme="ant"');

  const card = page.locator('[data-showcase-component="button"]');
  const action = card.getByRole("button", {
    name: "复制引用：Button",
    exact: true,
  });
  const reveal = card.locator(".reference-reveal");
  await page.mouse.move(1, 1);
  await expect(reveal).toHaveCSS("opacity", "0");
  await card.hover();
  await expect(reveal).toHaveCSS("opacity", "1");
  await page.mouse.move(1, 1);
  await action.focus();
  await expect(reveal).toHaveCSS("opacity", "1");
  await action.press("Enter");
  await expect
    .poll(copied)
    .toContain("Stylebook · Button\n类型：UI 组件\n标识：button");
  expect(await copied()).toContain("预览风格：Ant Design（ant）");
  expect(await copied()).toContain(
    "https://github.com/Peiiii/stylebook/blob/main/src/library/ui/button.tsx",
  );

  await card.getByRole("link", { name: "Button", exact: true }).click();
  const source = page.getByRole("link", {
    name: "查看源码：Button",
    exact: true,
  });
  await expect(source).toHaveAttribute(
    "href",
    "https://github.com/Peiiii/stylebook/blob/main/src/library/ui/button.tsx",
  );
  await page
    .getByRole("button", { name: "复制引用：Button", exact: true })
    .click();
  await expect
    .poll(copied)
    .toContain(
      "关联文件：https://github.com/Peiiii/stylebook/blob/main/src/library/ui/cn.ts",
    );
  await page.goto("/#view=themes");
  await page
    .getByRole("button", { name: "复制引用：Claude", exact: true })
    .click();
  await expect.poll(copied).toContain("类型：UI 风格\n标识：claude");

  await page.goto("/#view=home&theme=ant");
  const guide = page.getByRole("region", { name: "把组件带到 AI 会话" });
  await expect(guide.getByText("预览风格：Ant Design（ant）")).toBeVisible();
  await guide.getByRole("button", { name: "复制引用：Button" }).click();
  await expect
    .poll(copied)
    .toContain("Stylebook · Button\n类型：UI 组件\n标识：button");
  expect(await copied()).toContain("预览风格：Ant Design（ant）");
  await page.setViewportSize({ width: 320, height: 720 });
  await expect
    .poll(() => page.locator("html").evaluate((el) => el.scrollWidth))
    .toBe(320);
  await expect(guide.getByText("AI 会话示意")).toBeVisible();
});

test("Ant Design distinguishes navigation, search input, and the keyboard highlight", async ({
  page,
}) => {
  await page.goto("/#view=themes&theme=ant");
  const nav = page.getByRole("navigation", { name: "主导航" });
  const active = nav.getByRole("link", { name: "主题", exact: true });
  const neighbor = nav.getByRole("link", { name: "页面模板", exact: true });
  await neighbor.hover();
  await expect(active).toHaveAttribute("aria-current", "page");
  const underline = (link: HTMLElement) =>
    getComputedStyle(link, "::after").backgroundColor;
  await expect.poll(() => active.evaluate(underline)).toBe("rgb(9, 88, 217)");
  await expect(neighbor).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  expect(await neighbor.evaluate(underline)).toBe("rgba(0, 0, 0, 0)");

  await page.getByRole("button", { name: "搜索文档" }).click();
  const dialog = page.getByRole("dialog", { name: "搜索文档" });
  const input = dialog.getByRole("combobox");
  await expect(input).toBeFocused();
  const field = dialog.locator('[data-slot="command-input-wrapper"]');
  await expect(field).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(field).toHaveCSS("border-top-color", "rgb(22, 119, 255)");
  const first = dialog.getByRole("option", { name: "Button", exact: true });
  await expect(first).toHaveCSS("background-color", "rgb(230, 244, 255)");
  await input.press("ArrowDown");
  const second = dialog.getByRole("option", { name: "Input", exact: true });
  await expect(second).toHaveCSS("background-color", "rgb(230, 244, 255)");
  await expect(first).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await input.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Input", exact: true }),
  ).toBeVisible();
});

test("official docs structure, component interaction and theme", async ({
  page,
}) => {
  await page.goto("/#component=button");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(
    page.getByRole("heading", { name: "Button", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator('[data-slot="sidebar"] a[aria-current="page"]'),
  ).toHaveText("Button");
  await expect(themeTrigger(page)).toHaveText("iOS");
  await selectTheme(page, "复古");
  await page.getByRole("link", { name: "Checkbox", exact: true }).click();
  await page.reload();
  await expect(themeTrigger(page)).toHaveText("复古");
  const checkbox = page.locator("#terms");
  await checkbox.focus();
  await page.keyboard.press("Space");
  await expect(checkbox).toBeChecked();
  await page.keyboard.press("Control+k");
  const search = page.getByRole("dialog", { name: "搜索文档" });
  await search.getByRole("combobox").fill("对话框");
  await expect(
    search.getByRole("option", { name: "Dialog", exact: true }),
  ).toBeVisible();
  await search.getByRole("combobox").fill("dialog");
  await search.getByRole("option", { name: "Dialog", exact: true }).click();
  const trigger = page.getByRole("button", { name: "打开对话框" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toHaveAccessibleName("编辑个人资料");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(page.locator('[data-slot="preview"]')).toBeVisible();
  await expect(page.getByText("查看示例源码", { exact: true })).toHaveCount(0);
});

test("all 39 official demos and three Blocks resolve at their entry points", async ({
  page,
}) => {
  test.setTimeout(60_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const item of registry.components) {
    await page.goto(`/#component=${item.id}`);
    await expect(
      page.getByRole("heading", { name: item.title, exact: true }),
    ).toBeVisible();

    await expect(
      page.locator('[data-slot="preview"] > :first-child'),
    ).toBeVisible();
    await expect(page.getByText("正在加载预览…", { exact: true })).toHaveCount(
      0,
    );
  }
  for (const block of registry.blocks) {
    await page.goto(`/#view=full&template=${block.id}&theme=retro`);
    await expect(
      page.locator('[data-slot="block-preview"] > :first-child'),
    ).toBeVisible();
    await expect(
      page.getByText("正在加载页面模板…", { exact: true }),
    ).toHaveCount(0);
    await expect(page.locator("html")).toHaveAttribute(
      "data-atlas-theme",
      "retro",
    );
  }
  await page.goto("/#view=blocks&template=dashboard-01&theme=retro");
  await expect(
    page.frameLocator("iframe").getByRole("table").first(),
  ).toBeVisible();
  const popup = page.waitForEvent("popup");
  await page.getByRole("link", { name: "在新标签页打开" }).click();
  const full = await popup;
  await expect(full.getByRole("table").first()).toBeVisible();
  await expect(full.getByText("总收入", { exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "源码" })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("mobile navigation reaches a Block and preserves the selected theme", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#theme=material");
  await page.getByRole("button", { name: "打开导航", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "可折叠侧栏", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "可折叠侧栏", exact: true }),
  ).toBeVisible();
  await expect(themeTrigger(page)).toHaveText("Material");
  const block = page.frameLocator("iframe");
  await block.getByRole("button", { name: "展开或收起侧栏" }).click();
  await expect(block.getByRole("dialog")).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});

test("showcase renders all components together and keeps one theme", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "浏览组件总览", exact: true }).click();
  const cards = page.locator("[data-showcase-component]");
  await expect(cards).toHaveCount(registry.components.length);
  await expect(page.getByText("正在加载预览", { exact: true })).toHaveCount(0, {
    timeout: 15000,
  });
  await expect(
    page.getByRole("heading", { name: "组件总览", exact: true }),
  ).toBeInViewport();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(cards.locator('[data-slot="preview"]')).toHaveCount(
    registry.components.length,
  );
  await expect(page.locator(".showcase-grid").first()).toHaveCSS(
    "grid-template-columns",
    /^(\S+ ){3}\S+$/,
  );
  const control = cards.locator('[data-slot="button"]').first();
  const original = await control.evaluate((element) => {
    const css = getComputedStyle(element);
    return {
      radius: css.borderRadius,
      font: css.fontFamily,
      shadow: css.boxShadow,
    };
  });
  await selectTheme(page, "复古");
  await expect(page.getByText("复古 · 39 个组件")).toBeVisible();
  const retro = await control.evaluate((element) => {
    const css = getComputedStyle(element);
    return {
      radius: css.borderRadius,
      font: css.fontFamily,
      shadow: css.boxShadow,
    };
  });
  expect(retro.radius).not.toBe(original.radius);
  expect(retro.font).not.toBe(original.font);
  expect(retro.shadow).not.toBe(original.shadow);
  await expect(page.locator("html")).toHaveAttribute(
    "data-atlas-theme",
    "retro",
  );
  const dupes = await page.locator("main").evaluate((root) => {
    const ids = [...root.querySelectorAll("[id]")].map((el) => el.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  });
  expect(dupes).toEqual([]);
  const command = cards
    .filter({
      has: page.getByRole("heading", { name: "Command", exact: true }),
    })
    .getByRole("button", { name: "打开命令面板" });
  await command.click();
  const commandDialog = page.getByRole("dialog", { name: "Command" });
  await commandDialog.getByRole("combobox").fill("账单");
  await expect(
    commandDialog.getByRole("option", { name: /账单/ }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(command).toBeFocused();
  const toggle = cards
    .filter({ has: page.getByRole("heading", { name: "Switch", exact: true }) })
    .getByRole("switch");
  await toggle.click();
  await expect(toggle).toBeChecked();
  await page.getByRole("button", { name: "显示通知" }).click();
  await expect(page.getByText("日程已创建", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "弹层", exact: true }).click();
  await expect(page.getByRole("region", { name: "弹层" })).toBeFocused();
  const trigger = cards
    .filter({ has: page.getByRole("heading", { name: "Dialog", exact: true }) })
    .getByRole("button", { name: "打开对话框" });
  await trigger.click();
  await expect(
    page.getByRole("dialog", { name: "编辑个人资料" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(cards).toHaveCount(registry.components.length);
  await expect(page.getByText("正在加载预览", { exact: true })).toHaveCount(0, {
    timeout: 15000,
  });
  await expect(themeTrigger(page)).toHaveText("复古");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.setViewportSize({ width: 320, height: 800 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});

test("theme menu exposes all presets and updates the block iframe", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/#view=blocks&template=login-01");
  const trigger = themeTrigger(page);
  await trigger.focus();
  await page.keyboard.press("Enter");
  const menu = page.getByRole("menu", { name: "切换主题" });
  await expect(menu.getByRole("menuitemradio")).toHaveCount(8);
  await expect(
    menu.getByRole("menuitemradio", { name: "iOS" }),
  ).toHaveAttribute("aria-checked", "true");
  await expect(menu.getByRole("menuitemradio").last()).toHaveText(
    "shadcn 基准",
  );
  const rect = await menu.boundingBox();
  expect(rect!.x).toBeGreaterThanOrEqual(0);
  expect(rect!.x + rect!.width).toBeLessThanOrEqual(320);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await selectTheme(page, "iOS");
  const frame = page.frameLocator("iframe");
  await expect(frame.locator("html")).toHaveAttribute(
    "data-atlas-theme",
    "ios",
  );
  await trigger.click();
  await expect(page.getByRole("menu")).toHaveCSS("backdrop-filter", /blur/);
  await page.keyboard.press("Escape");
  await selectTheme(page, "Material");
  await expect(frame.locator("html")).toHaveAttribute(
    "data-atlas-theme",
    "material",
  );
  await expect(frame.locator('[data-slot="button"]').first()).toHaveCSS(
    "border-top-left-radius",
    "999px",
  );
  await page.reload();
  await expect(trigger).toHaveText("Material");
  await expect(page.locator("html")).toHaveAttribute(
    "data-atlas-theme",
    "material",
  );
});

test("scene showcase keeps workbench state while switching themes", async ({
  page,
}) => {
  await page.goto("/#view=scene");
  const app = page.frameLocator("iframe");
  await expect(app.getByRole("heading", { name: "项目工作台" })).toBeVisible();
  await app.getByRole("button", { name: "新建项目" }).click();
  await app.getByLabel("项目名称").fill("验收项目");
  await app.getByLabel("交付日期").fill("2026-11-20");
  await app.getByRole("button", { name: "创建项目", exact: true }).click();
  await app.getByRole("radio", { name: "计划中", exact: true }).click();
  const search = app.getByRole("textbox", { name: "搜索项目" });
  await search.fill("验收");

  await selectTheme(page, "iOS");
  await expect(app.locator("html")).toHaveAttribute("data-atlas-theme", "ios");
  await expect(search).toHaveValue("验收");
  const row = app.getByRole("row").filter({ hasText: "验收项目" });
  await expect(row).toContainText("计划中");
  await selectTheme(page, "Windows 11");
  await expect(app.locator("html")).toHaveAttribute(
    "data-atlas-theme",
    "fluent",
  );
  await expect(app.getByRole("columnheader", { name: "状态" })).toHaveCSS(
    "background-color",
    "rgb(245, 247, 251)",
  );
  await expect(row).toContainText("计划中");
  await selectTheme(page, "Ant Design");
  await expect(app.locator("html")).toHaveAttribute("data-atlas-theme", "ant");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  await expect(app.locator("body")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  await expect(app.getByRole("columnheader", { name: "状态" })).toHaveCSS(
    "background-color",
    "rgb(250, 250, 250)",
  );
  await selectTheme(page, "ChatGPT");
  await expect(app.locator("html")).toHaveAttribute(
    "data-atlas-theme",
    "chatgpt",
  );
  await expect(app.getByRole("button", { name: "新建项目" })).toHaveCSS(
    "border-top-left-radius",
    "999px",
  );
  await selectTheme(page, "Claude");
  await expect(app.locator("html")).toHaveAttribute(
    "data-atlas-theme",
    "claude",
  );
  await expect(app.locator("body")).toHaveCSS(
    "background-color",
    "rgb(250, 249, 245)",
  );
  await expect(app.getByRole("heading", { name: "团队项目" })).toHaveCSS(
    "font-family",
    /Georgia/,
  );
  await expect(row).toContainText("计划中");
  await expect(app.getByRole("row")).toHaveCount(2);
  await row.getByRole("button", { name: "更新验收项目的状态" }).click();
  await app.getByRole("menuitem", { name: "设为已完成" }).click();
  await expect(app.getByText("没有匹配的项目")).toBeVisible();
  await app.getByRole("radio", { name: "已完成", exact: true }).click();
  await expect(row).toContainText("100%");
  const nav = app.getByRole("navigation", { name: "工作室导航" });
  const collaboration = nav.getByRole("button", {
    name: "团队协作",
    exact: true,
  });
  await expect(collaboration).toHaveAttribute("aria-expanded", "false");
  await collaboration.click();
  await nav.getByRole("button", { name: "活动", exact: true }).click();
  await expect(app.getByText("将「验收项目」设为已完成")).toBeVisible();
  await nav.getByRole("button", { name: "工作室管理", exact: true }).click();
  await nav.getByRole("button", { name: "设置", exact: true }).click();
  await app.getByLabel("工作室名称").fill("新的工作室");
  await app.getByRole("button", { name: "保存资料" }).click();
  const sidebar = app.locator('[data-slot="workspace-sidebar"]');
  const footer = sidebar.locator('[data-slot="sidebar-footer"]');
  await expect
    .poll(() =>
      footer.evaluate((el) =>
        Math.abs(
          el.getBoundingClientRect().bottom -
            el
              .closest('[data-slot="workspace-sidebar"]')!
              .getBoundingClientRect().bottom,
        ),
      ),
    )
    .toBeLessThan(2);
  await expect(
    nav.getByRole("button", { name: "工作台", exact: true }),
  ).toHaveCount(0);
  const group = nav.getByRole("button", { name: "项目管理", exact: true });
  const projects = nav.getByRole("button", { name: "项目", exact: true });
  const toggle = app.getByRole("button", {
    name: "切换工作室侧栏",
    exact: true,
  });
  await group.click();
  await expect(group).toHaveAttribute("aria-expanded", "false");
  await expect(projects).toBeHidden();
  await toggle.click();
  await expect(group).toHaveAttribute("aria-expanded", "false");
  await expect(projects).toBeHidden();
  await group.click();
  await expect(projects).toBeVisible();
  await projects.click();
  await expect(projects).toHaveAttribute("aria-current", "page");
  await footer.getByRole("button", { name: "林沐的账户菜单" }).click();
  await app.getByRole("menuitemcheckbox", { name: "交付提醒" }).click();
  await nav.getByRole("button", { name: "设置", exact: true }).click();
  await expect(app.getByRole("switch", { name: "交付提醒" })).not.toBeChecked();
  await page.getByRole("radio", { name: "手机预览" }).click();
  await expect(nav).toBeHidden();
  await toggle.click();
  await expect(sidebar).toContainText("新的工作室");
  await collaboration.click();
  await nav.getByRole("button", { name: "交付", exact: true }).click();
  await expect(nav).toBeHidden();
  await expect(app.getByText("交付日历", { exact: true })).toBeVisible();
  await app.getByRole("button", { name: /2026年11月20日/ }).click();
  await expect(
    app.getByRole("list").getByText("验收项目", { exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 320, height: 720 });
  await toggle.click();
  await group.click();
  await projects.click();
  await expect
    .poll(() =>
      app.locator("html").evaluate((el) => el.scrollWidth - el.clientWidth),
    )
    .toBe(0);
});

test("workspace sidebar switches teams and manages project shortcuts", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#view=scene&theme=ant");
  const app = page.frameLocator("iframe");
  const sidebar = app.locator('[data-slot="workspace-sidebar"]');
  const nav = app.getByRole("navigation", { name: "工作室导航" });
  const scope = sidebar.getByRole("button", { name: /切换团队/ });
  for (const name of ["项目管理", "团队协作", "团队资源", "工作室管理"]) {
    await expect(
      nav.getByRole("button", { name, exact: true }),
    ).toHaveAttribute("aria-expanded", name === "项目管理" ? "true" : "false");
  }

  await scope.click();
  await app.getByRole("menuitemradio", { name: "内容组", exact: true }).click();
  await expect(scope).toHaveAccessibleName("切换团队，当前：内容组");
  await expect(
    nav.getByRole("button", { name: "品牌网站改版", exact: true }),
  ).toHaveCount(0);
  const shortcut = nav.getByRole("button", {
    name: "十二月内容计划",
    exact: true,
  });
  await shortcut.click();
  await expect(
    app.getByRole("dialog", { name: "十二月内容计划" }),
  ).toBeVisible();
  await app.getByRole("button", { name: "关闭详情" }).click();
  await expect(shortcut).toBeFocused();

  const more = nav.getByRole("button", { name: "十二月内容计划的更多操作" });
  await more.focus();
  await more.press("Enter");
  await app.getByRole("menuitem", { name: "分享项目" }).click();
  await expect(app.getByRole("textbox", { name: "项目摘要" })).toHaveValue(
    /内容组/,
  );
  await app.getByRole("button", { name: "复制摘要" }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("十二月内容计划");
  await app.getByRole("button", { name: "关闭", exact: true }).click();
  await expect(more).toBeFocused();

  await more.focus();
  await more.press("Enter");
  await app.getByRole("menuitem", { name: "取消收藏" }).click();
  await expect(shortcut).toHaveCount(0);
  await nav.getByRole("button", { name: "查看全部项目" }).click();
  await expect(
    app.getByRole("row").filter({ hasText: "十二月内容计划" }),
  ).toBeVisible();
  await expect(
    app.getByRole("row").filter({ hasText: "品牌网站改版" }),
  ).toHaveCount(0);
  await app.getByRole("button", { name: "更新十二月内容计划的状态" }).click();
  await app.getByRole("menuitem", { name: "收藏项目" }).click();
  await expect(shortcut).toBeVisible();

  await sidebar.getByRole("button", { name: "林沐的账户菜单" }).click();
  await app.getByRole("menuitem", { name: "通知中心" }).click();
  await expect(app.getByRole("heading", { name: "通知中心" })).toBeVisible();
  await app.getByRole("button", { name: "标为已读" }).click();
  await expect(app.locator('[data-slot="unread-indicator"]')).toHaveCount(0);

  await page.getByRole("radio", { name: "手机预览" }).click();
  const toggle = app.getByRole("button", { name: "切换工作室侧栏" });
  await toggle.click();
  await scope.click();
  await app.getByRole("menuitemradio", { name: "产品组", exact: true }).click();
  await expect(nav).toBeHidden();
  await toggle.click();
  await nav.getByRole("button", { name: "新手引导优化", exact: true }).click();
  await expect(nav).toBeHidden();
  await expect(app.getByRole("dialog", { name: "新手引导优化" })).toBeVisible();
  await app.getByRole("button", { name: "关闭详情" }).click();
  await expect(toggle).toBeFocused();
});

test("bento case can be selected, themed, and opened on its own", async ({
  page,
}) => {
  await page.goto("/#view=scene&theme=chatgpt");
  const app = page.frameLocator("iframe");
  await expect(app.getByRole("heading", { name: "项目工作台" })).toBeVisible();
  await page
    .getByRole("link", { name: "Bento · 设计手记", exact: true })
    .click();
  await expect(
    app.getByRole("heading", { name: "从日常里找设计灵感" }),
  ).toBeVisible();
  await app.getByRole("button", { name: "收藏手记" }).click();
  await selectTheme(page, "Claude");
  await expect(app.locator("html")).toHaveAttribute(
    "data-atlas-theme",
    "claude",
  );
  await expect(app.getByRole("button", { name: "已收藏" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.setViewportSize({ width: 320, height: 720 });
  await page.getByRole("radio", { name: "手机预览" }).click();
  await expect
    .poll(() =>
      app.locator("html").evaluate((el) => el.scrollWidth - el.clientWidth),
    )
    .toBe(0);
  const opened = page.waitForEvent("popup");
  await page.getByRole("link", { name: "独立打开" }).click();
  const full = await opened;
  await expect(
    full.getByRole("heading", { name: "从日常里找设计灵感" }),
  ).toBeVisible();
  await expect(full.locator("html")).toHaveAttribute(
    "data-atlas-theme",
    "claude",
  );
});
