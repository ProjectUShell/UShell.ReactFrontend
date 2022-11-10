// react
import React, { useEffect, useState } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";

// antd

// app
import { getModulePortfolio2 } from "../moduleportfolio";
import ShellLayout from "./ShellLayout/ShellLayout";

import {
  ColorModeProvider,
  LayoutModeProvider,
} from "./Settings/settingsContext";

import { getMenuItems } from "../portfolio-handling/MenuService";
import { UseCaseStateContextProvider } from "../portfolio-handling/UseCaseStateContext";
import {
  restoreColorMode,
  restoreLayoutMode,
  setDarkMode,
  setLightMode,
  storeLayoutMode,
} from "./Settings/SettingsService";
import ModuleView from "./ModuleView/ModuleView";
import {
  ComponentResolverRegister,
  ComponetResloverProvider,
} from "../services/componentService";
import DataDisplay from "./DefaultUseCases/DataDisplay";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const UShell = ({ customComponentResolverRegister }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const emptyRoutes = [];
  const [routes, setRoutes] = useState(emptyRoutes);

  const [portfolio, setPortfolio] = useState(null);

  const [useCaseState, setUseCaseState] = useState({
    statesPerWorkspace: {},
  });
  const useCaseStateValue = { useCaseState, setUseCaseState };
  const [ready, setReady] = useState(false);
  const updateModulePortfolio2 = () => {
    getModulePortfolio2().then((p) => {
      const mi = getMenuItems(p);
      setMenuItems(mi);
      setPortfolio(p);
      console.log("updateModulePortfolio2", portfolio);
      setReady(true);
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

  const [layoutMode, setLayoutModeInternal] = useState(restoreLayoutMode());
  const setLayoutMode = (v) => {
    setLayoutModeInternal(v);
    storeLayoutMode(v);
  };
  const settingsContextValue = { layoutMode, setLayoutMode };

  const [colorMode, setColorModeInternal] = useState(restoreColorMode());
  const setColorMode = (v) => {
    if (v == "dark") {
      setDarkMode();
    } else {
      setLightMode();
    }
    setColorModeInternal(v);
  };
  const colorModeContextValue = {
    colorMode: colorMode,
    setColorMode: setColorMode,
  };

  if (!ready) {
    return <div>loading...</div>;
  }

  let componetResolverRegister = customComponentResolverRegister;
  if (!componetResolverRegister) {
    componetResolverRegister =  new ComponentResolverRegister();
  }
  componetResolverRegister.register("DataDisplay", (inputData) => {
    return <DataDisplay inputData={inputData}></DataDisplay>;
  });

  return (
    <LayoutModeProvider value={settingsContextValue}>
      <ColorModeProvider value={colorModeContextValue}>
        <UseCaseStateContextProvider value={useCaseStateValue}>
          <ComponetResloverProvider value={componetResolverRegister}>
            <Routes>
              <Route
                path="*"
                element={
                  <ShellLayout
                    menuItems={menuItems["_Main"]}
                    portfolio={portfolio}
                    layoutMode={layoutMode}
                  ></ShellLayout>
                }
              ></Route>
              <Route
                path=":workspaceKey"
                element={
                  headless ? (
                    <ModuleView portfolio={portfolio} />
                  ) : (
                    <ShellLayout
                      menuItems={menuItems["_Main"]}
                      portfolio={portfolio}
                      layoutMode={layoutMode}
                    ></ShellLayout>
                  )
                }
              />
              <Route
                path=":workspaceKey/:useCaseKey"
                element={
                  headless ? (
                    <ModuleView
                      menuItems={menuItems["_Main"]}
                      portfolio={portfolio}
                    />
                  ) : (
                    <ShellLayout
                      menuItems={menuItems["_Main"]}
                      portfolio={portfolio}
                      layoutMode={layoutMode}
                    ></ShellLayout>
                  )
                }
              />
            </Routes>
            {/* <Button
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
        </Drawer> */}
          </ComponetResloverProvider>
        </UseCaseStateContextProvider>
      </ColorModeProvider>
    </LayoutModeProvider>
  );
};

export default UShell;
