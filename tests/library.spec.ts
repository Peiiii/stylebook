import { expect, test } from "@playwright/test";
import registry from "../src/library/registry.json" with { type: "json" };

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
  await expect(page.getByLabel("主题")).toHaveValue("shadcn");
  await page.getByLabel("主题").selectOption("paper");
  await page.getByRole("link", { name: "Checkbox", exact: true }).click();
  await page.reload();
  await expect(page.getByLabel("主题")).toHaveValue("paper");
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
  const trigger = page.getByRole("button", { name: "Open Dialog" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Edit profile");
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
    await page.goto(`/#view=full&template=${block.id}&theme=paper`);
    await expect(
      page.locator('[data-slot="block-preview"] > :first-child'),
    ).toBeVisible();
    await expect(
      page.getByText("正在加载页面模板…", { exact: true }),
    ).toHaveCount(0);
    await expect(page.locator("html")).toHaveAttribute(
      "data-atlas-theme",
      "paper",
    );
  }
  await page.goto("/#view=blocks&template=dashboard-01&theme=paper");
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
  await page.goto("/#theme=blueprint");
  await page.getByRole("button", { name: "打开导航", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "可折叠侧栏", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "可折叠侧栏", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("主题")).toHaveValue("blueprint");
  const block = page.frameLocator("iframe");
  await block.getByRole("button", { name: "Toggle Sidebar" }).click();
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
  await page.getByLabel("主题").selectOption("paper");
  await expect(page.getByText("暖纸 · 39 个组件")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute(
    "data-atlas-theme",
    "paper",
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
  await page.getByRole("button", { name: "Show Toast" }).click();
  await expect(
    page.getByText("Event has been created", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "弹层", exact: true }).click();
  await expect(page.getByRole("region", { name: "弹层" })).toBeFocused();
  const trigger = cards
    .filter({ has: page.getByRole("heading", { name: "Dialog", exact: true }) })
    .getByRole("button", { name: "Open Dialog" });
  await trigger.click();
  await expect(
    page.getByRole("dialog", { name: "Edit profile" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(cards).toHaveCount(registry.components.length);
  await expect(page.getByText("正在加载…", { exact: true })).toHaveCount(0, {
    timeout: 15000,
  });
  await expect(page.getByLabel("主题")).toHaveValue("paper");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.setViewportSize({ width: 320, height: 800 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});
