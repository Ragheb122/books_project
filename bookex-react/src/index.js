import React from "react";

// main component
import App from "./App";
import ReactDOM from "react-dom/client";

// style
import "./style/index.scss";

// router
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
