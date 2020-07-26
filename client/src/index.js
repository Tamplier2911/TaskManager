import "./index.scss";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";

// routing
import { BrowserRouter } from "react-router-dom";

// generator function runtime - e.g. async / await enabler
import "core-js/stable";
import "regenerator-runtime/runtime";

// in cases where the eventual publicPath of output files isn't known at compile time,
// it can be left blank and set dynamically at runtime via the __webpack_public_path__
// variable in the entry point file:
// const myRuntimePublicPath = "";
// __webpack_public_path__ = myRuntimePublicPath;

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
