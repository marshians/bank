import React from "react";
import ReactDOM from "react-dom";

import "../node_modules/@marshians/bootstrap/dist/marshians.css";

import "../node_modules/bootstrap/dist/js/bootstrap.min.js";

import "./index.css";

import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);
