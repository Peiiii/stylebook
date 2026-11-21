import { createRoot } from "react-dom/client";
import MultiThemeAdoption from "./library/examples/multi-theme-adoption";
import "./library/theme.css";
import "./library/themes.css";

createRoot(document.getElementById("root")!).render(<MultiThemeAdoption />);
