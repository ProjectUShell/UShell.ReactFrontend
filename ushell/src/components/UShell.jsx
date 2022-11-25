// react
import React, { useEffect, useState } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";

// antd

// app
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
import { PortfolioLoader } from "../portfolio-handling/PortfolioLoader";
import { ConfigProvider, theme } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const UShell = ({ customComponentResolverRegister }) => {
  // State
  const [menuItems, setMenuItems] = useState([]);
  const [portfolio, setPortfolio] = useState(null);

  const [useCaseState, setUseCaseState] = useState({
    statesPerWorkspace: {},
  });
  const useCaseStateValue = { useCaseState, setUseCaseState };
  const [ready, setReady] = useState(false);

  useEffect(() => {
    PortfolioLoader.loadModulePortfolio().then((p) => {
      const mi = getMenuItems(p);
      setMenuItems(mi);
      setPortfolio(p);
      console.log("updateModulePortfolio2", portfolio);
      setReady(true);
    });
  }, []);

  // Headless
  const [searchParams, setSearchParams] = useSearchParams();
  const headlessParam = searchParams.get("headless");
  const headless = headlessParam == undefined ? false : true;

  // Layout Mode
  const [layoutMode, setLayoutModeInternal] = useState(restoreLayoutMode());
  const setLayoutMode = (v) => {
    setLayoutModeInternal(v);
    storeLayoutMode(v);
  };

  const layoutContextValue = { layoutMode, setLayoutMode };

  // Color Mode
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

  const colorAlgorithm =
    colorMode == "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm;

  let componetResolverRegister = customComponentResolverRegister;
  if (!componetResolverRegister) {
    componetResolverRegister = new ComponentResolverRegister();
  }
  componetResolverRegister.register("DataDisplay", (inputData) => {
    return <DataDisplay inputData={inputData}></DataDisplay>;
  });

  return (
    <ConfigProvider
      theme={{
        algorithm: colorAlgorithm,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <LayoutModeProvider value={layoutContextValue}>
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
                    path="main/:useCaseKey"
                    element={
                      headless ? (
                        <ModuleView portfolio={portfolio} />
                      ) : (
                        <ShellLayout
                          menuItems={menuItems["_Main"]}
                          portfolio={portfolio}
                          layoutMode={layoutMode}
                          isStandaloneUseCase={true}
                        ></ShellLayout>
                      )
                    }
                  />
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
              </ComponetResloverProvider>
            </UseCaseStateContextProvider>
          </ColorModeProvider>
        </LayoutModeProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default UShell;
