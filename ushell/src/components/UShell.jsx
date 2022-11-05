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

  const [useCaseState, setUseCaseState] = useState({
    statesPerWorkspace: {}
  });
  const useCaseStateValue = { useCaseState, setUseCaseState };

  const updateModulePortfolio2 = () => {
    getModulePortfolio2().then((p) => {
      setPortfolio(p);
      const mi = getMenuItems(p);
      setMenuItems(mi);
      // setRoutes(getRoutes(p));
    });
  };

  useEffect(() => {
    // updateModulePortfolio();
    updateModulePortfolio2();
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const headlessParam = searchParams.get("headless");
  const headless = headlessParam == undefined ? false : true;

  const [open2, setOpen2] = useState(false);

  const showDrawer2 = () => {
    setOpen2(true);
  };

  const onClose2 = () => {
    setOpen2(false);
  };

  const [settingsValue, setSettingsValue] = useState("horizontal");

  return (
    <SettingsProvider value={settingsValue}>
      <UseCaseStateContextProvider value={useCaseStateValue}>
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
                  portfolio={portfolio}
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
