import {
  lazy,
  StrictMode,
  Suspense,
  useEffect,
  useSyncExternalStore,
} from "react";
import { createRoot } from "react-dom/client";
import { catalog } from "./catalog/store";
import { Library } from "./library/Library";
import "./app.css";

const LegacyCatalog = lazy(() => import("./App"));

function Root() {
  useSyncExternalStore(catalog.subscribe, catalog.snapshot);
  useEffect(catalog.start, []);
  return catalog.get("page") || catalog.get("kind") ? (
    <Suspense fallback={null}>
      <LegacyCatalog />
    </Suspense>
  ) : (
    <Library />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
