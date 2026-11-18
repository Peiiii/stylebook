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

test("official docs structure, component interaction and theme", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(
    page.getByRole("heading", { name: "Button", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator('[data-slot="sidebar"] a[aria-current="page"]'),
  ).toHaveText("Button");
  await expect(themeTrigger(page)).toHaveText("shadcn 默认");
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
  await page
    .getByRole("navigation", { name: "主导航" })
    .getByRole("link", { name: "组件总览", exact: true })
    .click();
  const cards = page.locator("[data-showcase-component]");
  await expect(cards).toHaveCount(registry.components.length);
  await expect(page.getByText("正在加载…", { exact: true })).toHaveCount(0, {
    timeout: 15000,
  });
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
  await expect(page.getByText("正在加载…", { exact: true })).toHaveCount(0, {
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
  await expect(menu.getByRole("menuitemradio")).toHaveCount(5);
  await expect(
    menu.getByRole("menuitemradio", { name: "shadcn 默认" }),
  ).toHaveAttribute("aria-checked", "true");
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
  await selectTheme(page, "Ant Design");
  await expect(app.locator("html")).toHaveAttribute("data-atlas-theme", "ant");
  await expect(app.getByRole("columnheader", { name: "状态" })).toHaveCSS(
    "background-color",
    "rgb(250, 250, 250)",
  );
  await expect(row).toContainText("计划中");
  await expect(app.getByRole("row")).toHaveCount(2);
  await row.getByRole("button", { name: "更新验收项目的状态" }).click();
  await app.getByRole("menuitem", { name: "设为已完成" }).click();
  await expect(app.getByText("没有匹配的项目")).toBeVisible();
  await app.getByRole("radio", { name: "已完成", exact: true }).click();
  await expect(row).toContainText("100%");
  const nav = app.getByRole("navigation", { name: "工作室导航" });
  await nav.getByRole("button", { name: "活动", exact: true }).click();
  await expect(app.getByText("将「验收项目」设为已完成")).toBeVisible();
  await nav.getByRole("button", { name: "设置", exact: true }).click();
  await app.getByLabel("工作室名称").fill("新的工作室");
  await app.getByRole("button", { name: "保存资料" }).click();
  await page.getByRole("radio", { name: "手机预览" }).click();
  await expect(app.locator("aside")).toContainText("新的工作室");
  await nav.getByRole("button", { name: "交付", exact: true }).click();
  await expect(app.getByText("交付日历", { exact: true })).toBeVisible();
  await app.getByRole("button", { name: /2026年11月20日/ }).click();
  await expect(
    app.getByRole("list").getByText("验收项目", { exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 320, height: 720 });
  await nav.getByRole("button", { name: "项目", exact: true }).click();
  await expect
    .poll(() =>
      app.locator("html").evaluate((el) => el.scrollWidth - el.clientWidth),
    )
    .toBe(0);
});
