import { useLayoutEffect, useState, type CSSProperties } from "react";
import { resolveTheme, type AtlasTheme } from "../themes";
import { Input } from "../ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";

const themeIds = [
  "ios",
  "ant",
  "editorial",
] as const satisfies readonly AtlasTheme["id"][];
const choices = themeIds.map(resolveTheme);
const defaultTheme = themeIds[0];
const storageKey = "stylebook-adoption-theme";

function readTheme() {
  try {
    const saved = localStorage.getItem(storageKey);
    return themeIds.find((id) => id === saved) ?? defaultTheme;
  } catch {
    return defaultTheme;
  }
}

export default function MultiThemeAdoption() {
  const [theme, setTheme] = useState(readTheme);

  useLayoutEffect(() => {
    // The document root also covers mobile drawers rendered into body.
    document.documentElement.dataset.atlasTheme = theme;
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // Switching still works for the current page if storage is unavailable.
    }
  }, [theme]);

  return (
    <SidebarProvider style={{ "--sidebar-width": "10.5rem" } as CSSProperties}>
      <Sidebar collapsible="icon">
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive tooltip="账户设置">
                <a href="#account" aria-current="page">
                  <span>账户设置</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-w-0 bg-background">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b px-3 py-2.5 sm:px-5">
          <SidebarTrigger />
          <label className="flex items-center gap-2 text-sm font-medium">
            界面风格
            <select
              className="rounded-md border border-input bg-background px-2 py-1.5"
              value={theme}
              onChange={(event) => {
                const next = themeIds.find(
                  (id) => id === event.currentTarget.value,
                );
                if (next) setTheme(next);
              }}
            >
              {choices.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </header>
        <main id="account" className="grid content-start gap-3 p-4 sm:p-6">
          <h1 className="text-xl font-semibold">账户设置</h1>
          <label className="grid max-w-xs gap-2 text-sm font-medium">
            显示名称
            <Input defaultValue="林沐" />
          </label>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
