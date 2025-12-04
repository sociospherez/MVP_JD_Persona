import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";   // 👈 this line is essential
import "./dark.css"; // 👈
import "./light.css"; // 👈



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);