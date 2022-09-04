import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  BrowserRouter,
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
import { getModulePortfolio } from "./moduleportfolio";
import SideMenuShell from "./components/Shells/SideMenuShell";
import ModuleLoader from "./federation/ModuleLoader";

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
  const [workspaces, setWorkspaces] = useState([]);
  const [routes, setRoutes] = useState([]);

  const updateModulePortfolio = () => {
    getModulePortfolio().then(function (myJson) {
      let newItems = [];
      let newRoutes = [];
      let i = 0;
      myJson.workspaces.forEach((x) => {
        i += 1;
        let j = i + 1;
        let children = [];
        x.useCases.forEach((uc) => {
          j += 1;
          routes.push({
            path: "/" + x.name + "/" + uc.name,
            key: j,
            component: uc.component,
            module: uc.module,
            url: uc.url
          });
          children.push(getItem(uc.name, j));
        });
        routes.push({ path: "/" + x.name, key: i });
        newItems.push(getItem(x.name, i, <UserOutlined />, children));
      });
      setWorkspaces(newItems);
    });
  };

  // getData();
  useEffect(() => {
    updateModulePortfolio();
  }, []);

  console.log("items in app", workspaces);
  console.log("routes in app", routes);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            <SideMenuShell
              workspaces={workspaces}
              content={<div>Welcome to USHell</div>}
            ></SideMenuShell>
          }
        ></Route>
        {routes.map((r, i) => {
          return (
            <Route
              key={i}
              path={r.path}
              element={
                <SideMenuShell
                  workspaces={workspaces}
                  content={
                    <Suspense fallback={"Loading . . . "}>
                      <ModuleLoader
                        url={r.url}
                        scope={r.module}
                        module={r.component}
                        inputData={{ someInput: "WTF" }}
                      />
                    </Suspense>
                  }
                ></SideMenuShell>
              }
            ></Route>
          );
        })}
        ;
      </Routes>
    </BrowserRouter>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
