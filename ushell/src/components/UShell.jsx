// react
import React, { Suspense, useEffect, useState } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";

// antd
import { UserOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";

// app
import { getModulePortfolio } from "../moduleportfolio";
import { getModulePortfolio2 } from "../moduleportfolio";
import ModuleLoader from "../federation/ModuleLoader";
import ShellLayout from "./ShellLayout/ShellLayout";

import { SettingsProvider } from "./Settings/settingsContext";
import Settings from "./Settings/Settings";
import Welcome from "./Welcome/Welcome";
import { PortfolioLoader } from "../portfolio-handling/PortfolioLoader";
import { getRoutes } from "../portfolio-handling/PortfolioService";

import { RouteModel } from "../portfolio-handling/MenuModel";
import Workspace from "./Workspace/Workspace";
import { getMenuItems } from "../portfolio-handling/MenuService";
import UseCaseStateContext, {
  UseCaseStateContextProvider,
} from "../portfolio-handling/UseCaseStateContext";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const UShell = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const emptyRoutes = [];
  const [routes, setRoutes] = useState(emptyRoutes);

  const [portfolio, setPortfolio] = useState({});

  const portfolioLoader = new PortfolioLoader();

  const updateModulePortfolio2 = () => {
    getModulePortfolio2().then((p) => {
      console.warn("portfolio after load", p);
      setPortfolio(p);
      const mi = getMenuItems(p);
      setMenuItems(mi);
      // setRoutes(getRoutes(p));
    });
  };

  // const updateModulePortfolio = () => {
  //   getModulePortfolio().then(function (myJson) {
  //     let newItems = [];
  //     let newRoutes = [];
  //     let i = 0;
  //     myJson.workspaces.forEach((x) => {
  //       i += 1;
  //       let j = i + 1;
  //       let children = [];
  //       x.useCases.forEach((uc) => {
  //         j += 1;
  //         routes.push({
  //           path: "/" + x.name + "/" + uc.name,
  //           key: j,
  //           component: uc.component,
  //           module: uc.module,
  //           url: uc.url,
  //         });
  //         children.push(getItem(uc.name, j));
  //       });
  //       routes.push({ path: "/" + x.name, key: i });
  //       newItems.push(getItem(x.name, i, <UserOutlined />, children));
  //     });
  //     setWorkspaces(newItems);
  //   });
  // };

  useEffect(() => {
    // updateModulePortfolio();
    updateModulePortfolio2();
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const headlessParam = searchParams.get("headless");
  const headless = headlessParam == undefined ? false : true;

  const [open2, setOpen2] = useState(false);

  console.log("items in app", workspaces);
  console.log("routes in app", routes);

  const showDrawer2 = () => {
    console.log("showing drawer");
    setOpen2(true);
  };

  const onClose2 = () => {
    console.log("closing drawer");
    setOpen2(false);
  };

  const [settingsValue, setSettingsValue] = useState("horizontal");

  console.log("routes", routes);

  return (
    <SettingsProvider value={settingsValue}>
      <UseCaseStateContextProvider
        value={{ statesPerWorkspace: {}, stateSubjectsPerWorkspace: {} }}
      >
        <Routes>
          <Route
            path="*"
            element={
              <ShellLayout
                menuItems={menuItems["_Main"]}
                portfolio={portfolio}
              ></ShellLayout>
            }
          ></Route>
          <Route
            path=":workspaceKey"
            element={
              headless ? (
                <Suspense fallback={"Loading . . . "}>
                  <ModuleLoader
                    url={r.url}
                    scope={r.module}
                    module={r.component}
                    inputData={{ someInput: "WTF" }}
                  />
                </Suspense>
              ) : (
                <ShellLayout
                  workspaces={workspaces}
                  menuItems={menuItems["_Main"]}
                  content={<Workspace />}
                  portfolio={portfolio}
                ></ShellLayout>
              )
            }
          />
          <Route
            path=":workspaceKey/:useCaseKey"
            element={
              headless ? (
                <Suspense fallback={"Loading . . . "}>
                  <ModuleLoader
                    url={r.url}
                    scope={r.module}
                    module={r.component}
                    inputData={{ someInput: "WTF" }}
                  />
                </Suspense>
              ) : (
                <ShellLayout
                  workspaces={workspaces}
                  menuItems={menuItems["_Main"]}
                  content={<Workspace />}
                ></ShellLayout>
              )
            }
          />
        </Routes>
        <Button
          className="app__settings-button"
          type="primary"
          onClick={showDrawer2}
        >
          <i className="fas fa-cog" />
        </Button>
        <Drawer
          title="Customize Theme"
          placement="right"
          onClose={onClose2}
          open={open2}
        >
          <Settings setSettingsValue={setSettingsValue}></Settings>
        </Drawer>
      </UseCaseStateContextProvider>
    </SettingsProvider>
  );
};

export default UShell;
