import { lazy } from "react";

export const scenes = [
  {
    id: "workspace",
    label: "青禾工作室",
    Preview: lazy(() =>
      import("./docs/SceneShowcase").then(({ SceneShowcase }) => ({
        default: SceneShowcase,
      })),
    ),
  },
  {
    id: "bento",
    label: "Bento · 设计手记",
    Preview: lazy(() =>
      import("./docs/BentoShowcase").then(({ BentoShowcase }) => ({
        default: BentoShowcase,
      })),
    ),
  },
] as const;
