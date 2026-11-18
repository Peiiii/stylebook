import { expect, test } from "@playwright/test";
import registry from "../src/library/registry.json" with { type: "json" };

test("official docs structure, component interaction, theme and source", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
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
  await page.getByRole("button", { name: "查看示例源码" }).click();
  const inline = page.locator('[data-slot="code"]');
  await expect(inline.locator("[data-line-numbers]")).toContainText(
    "DialogDemo",
  );
  await inline.getByRole("button", { name: "复制源码", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "DialogDemo",
  );
  await page.getByLabel("源码文件").selectOption("ui/dialog.tsx");
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "下载源码" }).click();
  expect((await download).suggestedFilename()).toBe("dialog.tsx");
  await expect(page.locator("#source")).toContainText("DialogPrimitive");
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
      page.locator('[data-slot="preview"] .preview > :first-child'),
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
  await page.getByRole("tab", { name: "源码" }).click();
  await expect(page.getByLabel("源码文件")).toHaveValue(
    "blocks/dashboard-01/page.tsx",
  );
  await expect(
    page.getByText("ChartAreaInteractive", { exact: true }).first(),
  ).toBeVisible();
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
