import { expect, test } from "@playwright/test";
import { entries } from "../src/catalog/entries";

test("discover, compare fairly, adopt and recover in a new page", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#kind=theme");
  await expect(page.locator(".entry-card")).toHaveCount(2);
  await page
    .getByRole("button", { name: "加入比较 清晰描边", exact: true })
    .click();
  await page
    .getByRole("button", { name: "加入比较 柔和浮层", exact: true })
    .click();
  await page.getByRole("button", { name: "开始比较", exact: true }).click();
  await expect(page.locator(".compare-column")).toHaveCount(2);
  await page.getByRole("button", { name: "深色", exact: true }).click();
  await page.getByLabel("样例状态").selectOption("long");
  const frames = page.locator(".compare-column iframe");
  for (const frame of await frames.all()) {
    const src = new URL((await frame.getAttribute("src"))!);
    expect(src.hash).toContain("mode=dark");
    expect(src.hash).toContain("state=long");
    expect(src.hash).toContain("width=960");
  }
  const comparisonLink = page.url();
  await page
    .locator(".compare-column-footer")
    .last()
    .getByRole("button", { name: "采用", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("柔和浮层");
  await page.getByRole("button", { name: "复制采用说明", exact: true }).click();
  const text = await page.evaluate(() => navigator.clipboard.readText());
  await expect(
    page.getByRole("button", { name: "已复制", exact: true }),
  ).toBeVisible();
  expect(text).toContain("theme.soft-elevation");
  expect(text).toContain("视觉约束");
  expect(text).toContain("src/examples/Examples.tsx");
  expect(text).toContain("本机链接");
  await page.getByRole("button", { name: "关闭采用清单" }).click();
  const restored = await context.newPage();
  await restored.goto(page.url());
  await restored.getByRole("button", { name: /采用清单/ }).click();
  await expect(restored.getByRole("dialog")).toContainText(
    "theme.soft-elevation",
  );
  await restored.close();
  await page.goto(comparisonLink);
  for (const frame of page.frames().slice(1))
    await expect(frame.locator(".example")).toBeVisible();
  await page.screenshot({
    path: ".local/test-results/compare-desktop.png",
    fullPage: true,
  });
});

test("search, empty recovery, incompatible compare and clipboard denial", async ({
  page,
  context,
}) => {
  await page.goto("/#kind=theme");
  await page
    .getByRole("button", { name: "加入比较 清晰描边", exact: true })
    .click();
  await page.getByRole("link", { name: "组件样式", exact: true }).click();
  await page.getByLabel("搜索目录").fill("不存在");
  await expect(page.getByText("没有找到匹配的参考")).toBeVisible();
  await page.getByRole("button", { name: "清除搜索与筛选" }).click();
  await expect(page.locator(".entry-card")).toHaveCount(12);
  await page
    .getByRole("button", { name: "加入比较 信息卡片 · 清晰描边", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("不同的比较组");
  await expect(page.locator(".compare-tray")).toContainText("已选 1 项");
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("denied")) },
      configurable: true,
    });
  });
  await page.goto("/#page=detail&entry=card.outlined");
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("denied")) },
      configurable: true,
    });
  });
  await page.getByRole("button", { name: "复制 ID", exact: true }).click();
  await expect(page.getByLabel("手动复制文本")).toHaveValue("card.outlined");
  await page.getByRole("button", { name: "关闭手动复制" }).click();
  await page.goto("/#page=detail&entry=missing");
  await expect(page.getByText("没有找到这个条目")).toBeVisible();
  await page.getByRole("button", { name: "返回目录", exact: true }).click();
  await expect(page.locator(".entry-card")).toHaveCount(2);
});

test("all 18 examples render, source matches, interactive states work", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const entry of entries) {
    await page.goto(`/#page=clean&entry=${entry.id}`);
    await expect(page.locator(".example")).toBeVisible();
    expect(
      await page
        .locator("body")
        .evaluate((el) => el.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
  await page.goto("/#page=detail&entry=card.outlined&tab=code");
  await expect(page.getByText("眼前的预览，就是这份代码。")).toBeVisible();
  await page.getByRole("button", { name: "Examples.tsx", exact: true }).click();
  await expect(page.locator(".source-code")).toContainText(
    "export function Example",
  );
  await page.goto("/#page=clean&entry=page.settings.soft");
  await page.getByRole("switch", { name: "进度通知" }).click();
  await expect(page.getByRole("switch", { name: "进度通知" })).toHaveAttribute(
    "aria-checked",
    "false",
  );
  await page.getByLabel("记录保留", { exact: true }).selectOption("7");
  await page.getByRole("button", { name: "应用设置", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("记录保留 7 天");
  await page.goto("/#page=clean&entry=search.elevated");
  await page.getByLabel("搜索任务").fill("无结果");
  await expect(page.getByText("没有匹配的任务")).toBeVisible();
  await page.getByRole("button", { name: "清除筛选" }).click();
  await expect(page.locator(".ex-result")).toHaveCount(3);
  await page.goto("/#page=clean&entry=tabs.outlined");
  await page.getByRole("tab", { name: "定义", exact: true }).click();
  await expect(page.locator(".ex-markdown h2")).toContainText("好的界面");
  expect(errors).toEqual([]);
});

test("dark, long, empty and error scenes stay readable on mobile; screenshot evidence", async ({
  page,
}) => {
  await page.goto("/#kind=theme");
  await expect(page.locator("iframe")).toHaveCount(2);
  for (const frame of await page.locator("iframe").all())
    await expect(frame.contentFrame().locator(".example")).toBeVisible();
  await page.screenshot({
    path: ".local/test-results/catalog-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#kind=theme");
  await expect(page.locator("iframe")).toHaveCount(2);
  for (const frame of await page.locator("iframe").all())
    await expect(frame.contentFrame().locator(".example")).toBeVisible();
  await page.screenshot({
    path: ".local/test-results/catalog-mobile.png",
    fullPage: true,
  });
  for (const style of ["outline", "soft"])
    for (const scene of ["activity", "settings"])
      for (const state of ["normal", "long", "empty", "error"]) {
        await page.goto(
          `/#page=clean&entry=page.${scene}.${style}&mode=dark&state=${state}`,
        );
        await expect(page.locator(".example")).toBeVisible();
        expect(
          await page
            .locator("body")
            .evaluate((el) => el.scrollWidth <= window.innerWidth),
          `${scene}/${style}/${state}`,
        ).toBe(true);
        if (scene === "settings" && state === "long") {
          await expect(page.locator(".ex-markdown pre code")).toContainText(
            "retentionDays",
          );
          await expect(page.locator(".ex-markdown h3").first()).toHaveText(
            "工作原则",
          );
          await page.screenshot({
            path: `.local/test-results/settings-${style}-mobile-dark.png`,
            fullPage: true,
          });
        }
      }
  await page.goto(
    "/#page=compare&ids=theme.clean-outline,theme.soft-elevation&width=390",
  );
  await expect(page.locator(".compare-column:visible")).toHaveCount(1);
  await page.getByRole("button", { name: "B · 柔和浮层" }).click();
  await expect(page.locator(".compare-column:visible")).toContainText(
    "柔和浮层",
  );
  await expect(
    page
      .frameLocator(".compare-column.mobile-active iframe")
      .locator(".example"),
  ).toBeVisible();
  await page.screenshot({
    path: ".local/test-results/compare-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#page=clean&entry=page.settings.soft&state=long");
  await page.screenshot({
    path: ".local/test-results/settings-desktop.png",
    fullPage: true,
  });
  await page.goto("/#page=detail&entry=theme.soft-elevation&scene=settings");
  await expect(page.frameLocator("iframe").locator(".example")).toBeVisible();
  await page.screenshot({
    path: ".local/test-results/detail-desktop.png",
    fullPage: true,
  });
});

test("preview failure is visible and recoverable", async ({ page }) => {
  await page.route("**/*", async (route) =>
    route.request().isNavigationRequest() &&
    route.request().frame().parentFrame()
      ? route.abort()
      : route.continue(),
  );
  await page.goto("/#page=detail&entry=theme.clean-outline");
  await expect(page.getByText("预览加载失败")).toBeVisible({ timeout: 18000 });
  await page.unroute("**/*");
  await page.getByRole("button", { name: "重试", exact: true }).click();
  await expect(page.frameLocator("iframe").locator(".example")).toBeVisible();
});

test("shell dark stays separate, phone clean link preserves width and selection does not reload preview", async ({
  page,
}) => {
  await page.goto("/#page=detail&entry=theme.soft-elevation");
  await expect(page.frameLocator("iframe").locator(".ex-light")).toBeVisible();
  const src = await page.locator("iframe").getAttribute("src");
  await page.getByLabel("切换目录外壳明暗").click();
  await expect(page.locator(".atlas-dark")).toBeVisible();
  await expect(page.frameLocator("iframe").locator(".ex-light")).toBeVisible();
  await page.getByRole("button", { name: "采用这个参考", exact: true }).click();
  await page.getByLabel("关闭采用清单").click();
  await expect(page.locator("iframe")).toHaveAttribute("src", src!);
  await page.setViewportSize({ width: 720, height: 900 });
  await page.reload();
  await expect(page.frameLocator("iframe").locator(".example")).toBeVisible();
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  await page.screenshot({
    path: ".local/test-results/detail-200-percent-reflow.png",
    fullPage: true,
  });
  expect(
    await page.locator("body").evaluate((el) => el.scrollWidth <= innerWidth),
  ).toBe(true);
  await page.goto("/#page=clean&entry=theme.soft-elevation&width=390");
  await expect(page.locator(".clean-preview")).toHaveCSS("width", "390px");
});
