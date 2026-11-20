import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SceneFrame } from "./library/SceneFrame";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SceneFrame />
  </StrictMode>,
);
