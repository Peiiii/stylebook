import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Library } from "./library/Library";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Library />
  </StrictMode>,
);
