import { Suspense, useEffect, useSyncExternalStore } from "react";
import { ThemeProvider } from "next-themes";
import { route } from "./route";
import { resolveScene } from "./scenes";
import { resolveTheme } from "./themes";
import { Toaster } from "./ui/sonner";
import "./theme.css";
import "./docs/styles.css";
import "./themes.css";

export function useDocumentTheme(theme: string) {
  useEffect(() => {
    document.documentElement.dataset.atlasTheme = theme;
    return () => {
      delete document.documentElement.dataset.atlasTheme;
    };
  }, [theme]);
}

export function PreviewPending() {
  return (
    <span className="sr-only" role="status">
      正在加载预览
    </span>
  );
}

// Standalone scene view (`#view=scene-full`), also used as the scene iframe.
// The dedicated preview entry loads it without the catalog shell.
export function SceneFrame() {
  useSyncExternalStore(route.subscribe, route.snapshot);
  const scene = resolveScene(route.get("scene"));
  const ScenePreview = scene.Preview;
  useDocumentTheme(resolveTheme(route.get("theme")).id);
  return (
    <ThemeProvider
      forcedTheme="light"
      attribute="class"
      enableSystem={false}
      enableColorScheme={false}
    >
      <Toaster />
      <Suspense fallback={<PreviewPending />}>
        <ScenePreview key={scene.id} />
      </Suspense>
    </ThemeProvider>
  );
}
