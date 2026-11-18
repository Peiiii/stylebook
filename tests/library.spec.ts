import { expect, test } from "@playwright/test";

test("navigate the library, persist theme, download actual component source", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "按钮 button" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "保存修改" }).click();
  await expect(page.getByRole("status")).toHaveText("修改已保存");
  await page.getByLabel("当前风格").selectOption("paper");
  await page.getByLabel("搜索组件").fill("dialog");
  await page.getByRole("link", { name: "对话框 dialog" }).click();
  await page.reload();
  await expect(page.getByLabel("当前风格")).toHaveValue("paper");
  const trigger = page.getByRole("button", { name: "打开对话框" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toHaveAccessibleName("项目设置");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.getByRole("link", { name: "源码", exact: true }).click();
  await expect(page.locator(".lib-code")).toContainText("DialogPrimitive");
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "下载当前文件" }).click();
  expect((await download).suggestedFilename()).toBe("dialog.tsx");
});

test("templates use the chosen theme and remain usable at 390px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#view=templates&template=dashboard&theme=paper");
  await page.getByRole("button", { name: "新建项目" }).click();
  await page.getByLabel("项目名称").fill("设计复核");
  await page.getByRole("button", { name: "添加项目" }).click();
  await expect(page.getByText("设计复核", { exact: true })).toBeVisible();
  const popup = page.waitForEvent("popup");
  await page.getByRole("link", { name: "打开完整页面" }).click();
  const full = await popup;
  await expect(full.getByRole("heading", { name: "项目看板" })).toBeVisible();
  await expect(full.locator("html")).toHaveAttribute(
    "data-atlas-theme",
    "paper",
  );
  await expect(full.getByRole("navigation", { name: "主导航" })).toHaveCount(0);
  await page.getByRole("link", { name: "工作区设置", exact: true }).click();
  const toggle = page.getByRole("switch", { name: /项目更新/ });
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAttribute("aria-checked", "false");
  await page.getByLabel("工作区名称").fill("设计工作室");
  await page.getByRole("button", { name: "保存设置" }).click();
  await expect(page.getByRole("status")).toContainText("设计工作室");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});
