// React
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Components
import App from "./App";

const root = createRoot(document.getElementById("root"))
root.render(
    <App />
)