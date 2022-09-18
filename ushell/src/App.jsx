import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  BrowserRouter,
  useSearchParams,
} from "react-router-dom";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Shell from "./components/Shell";

import "antd/dist/antd.css";
import "./index.css";
import "./App.css";
import UShell from "./components/UShell";
import TestDrawer from "./components/TestDrawer";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const App = () => {
  return (
    <BrowserRouter>      
      <UShell></UShell>
    </BrowserRouter>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
