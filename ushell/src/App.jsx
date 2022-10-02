import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
} from "react-router-dom";

import "antd/dist/antd.css";
import "./index.css";
import "./App.css";
import "./styles/main.less";

import UShell from "./components/UShell";

const App = () => {
  return (
    <BrowserRouter>
      <UShell></UShell>
    </BrowserRouter>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
