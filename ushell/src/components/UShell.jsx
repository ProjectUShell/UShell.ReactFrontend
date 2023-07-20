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
import TeresasKomponente from "./DefaultUseCases/TeresasKomponente";
import { PortfolioLoader } from "../portfolio-handling/PortfolioLoader";
import { ConfigProvider, theme } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";

// Authentication
import SignIn from "./Authentication/SignIn";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

import {
  getTokenSourcesForPrimaryUiTokenSourceUid
} from "../portfolio-handling/PortfolioService";

import {
  getPersistentState,
  setPersistentState,
  deletePersistentState
} from "../portfolio-handling/StateSerivce";

import useAuthToken from "../hooks/useAuthToken";

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
    PortfolioLoader.loadModulePortfolio2().then((p) => {
      console.log("loadModulePortfolio2", p);
      const mi = getMenuItems(p);
      console.log("mi", mi);
      setMenuItems(mi);
      setPortfolio(p);
      setReady(true);

      // TODO: move / split into functions
      // Auth
      window.appId = 'default';

      var currentWindowUrl = window.location.href;
      var codeFromUrl = null;
      var stateFromUrl = null;

      var idx = currentWindowUrl.indexOf("?");
      if (idx >= 0) {
        var params = currentWindowUrl.substring(idx + 1).split('&').forEach((v, i, a) => {

          var idx = v.indexOf("=");
          var key = decodeURIComponent(v.substring(0, idx));
          var val = decodeURIComponent(v.substring(idx + 1));

          if (key == "code") {
            codeFromUrl = val;
          }
          if (key == "state") {
            stateFromUrl = val;
          }
          if (key == "appid") {
            window.appId = val;
          }
        })
      }

      console.log("Code: ", codeFromUrl, " State: ", stateFromUrl);

      var currentTokenSource = getTokenSourcesForPrimaryUiTokenSourceUid(p, p.primaryUiTokenSourceUid)
      var tokenSource = Object.values(currentTokenSource)[0];

      var oAuthProxyUrl = null;
      var oAuthProxyProfile = null;

      if (tokenSource != null) {
        oAuthProxyUrl = tokenSource[0].authEndpointUrl;
        oAuthProxyProfile = tokenSource[0].authProxyProfile;
      }

      if (codeFromUrl != null) {
        //var postUrl = p.oAuthProxyUrl + "?state=" + stateFromUrl + "&code=" + codeFromUrl;
        var postUrl = "https://github.com/login/oauth/access_token?code=" + codeFromUrl + "&client_id=1c295a48ec933ccdf6b7&client_secret=345fe992a7255b396a0b4ab47dafcd54f127c924";
        console.log("loading token via proxy-call: " + postUrl);

        // HACK: locally CORS problem -> for now skip http request
        console.log("Staged token: ", "stagedtoken_" + stateFromUrl);
        // HACK: github transfered no stateFromUrl only codeFromUrl
        setPersistentState("stagedtoken_" + "stateFromUrl", "access_token_test");

        // TODO: after deploy and start using prod auth server instead of github:
        // 1. Remove line above
        // 2. Uncomment lines below
        
        // fetch(postUrl, {
        //   method: 'POST',
        //   headers: {
        //     'Access-Control-Allow-Origin': 'http://localhost:3000',
        //     'Referrer-Policy': 'origin-when-cross-origin',
        //     'Accept':'application/json'
        //   }
        // })
        //   .then(result => {
        //     console.log("Success: ", result)
        //     if (result.error) {
        //       let tokenReceivingError = "ERROR:" + result.error;
        //       setPersistentState("stagedtoken_" + stateFromUrl, tokenReceivingError);
        //       console.log("Error: ", result.error);
        //     }
        //     else {
        //       if (!result.access_token) {
        //         tokenReceivingError = "ERROR: the response contained no 'access_token'";
        //         setPersistentState("stagedtoken_" + stateFromUrl, tokenReceivingError);
        //       }
        //       else {
        //         setPersistentState("stagedtoken_" + stateFromUrl, result.access_token);
        //       }
        //     }
        //   })
        //   .catch((error) => {
        //     let tokenReceivingError = "ERROR:" + error.message;
        //     setPersistentState("stagedtoken_" + stateFromUrl, tokenReceivingError);
        //     console.log("Error: ", error.message);
        //   });
        }
    });
    PortfolioLoader.loadModulePortfolio().then((p) => {
      // console.log("loadModulePortfolio", p);
      // const mi = getMenuItems(p);
      // console.log("mi", mi);
      // setMenuItems(mi);
      // setPortfolio(p);
      // setReady(true);
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
  componetResolverRegister.register("TeresasKomponente", (inputData) => {
    return <TeresasKomponente inputData={inputData}></TeresasKomponente>;
  });

  const { darkAlgorithm, compactAlgorithm } = theme;

  const colorBgBase =
    colorMode == "dark"
      ? "linear-gradient(99deg, rgb(57, 65, 73) 0%, rgb(47, 54, 62) 100%)"
      : "linear-gradient(99deg, rgb(246, 249, 254) 0%, rgb(232, 241, 248) 100%)";

  const colorContainerBgBase = colorMode == "dark" ? "#434B54" : "#FDFEFF";

  return (
    <ConfigProvider
      theme={{
        algorithm: [colorAlgorithm, compactAlgorithm],
        token: {
          colorBgBase: colorBgBase,
          colorBgContainer: colorContainerBgBase,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <LayoutModeProvider value={layoutContextValue}>
          <ColorModeProvider value={colorModeContextValue}>
            <UseCaseStateContextProvider value={useCaseStateValue}>
              <ComponetResloverProvider value={componetResolverRegister}>
                <Routes>
                  <Route element={<ProtectedRoute portfolio={portfolio} />}>
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
                  </Route>
                  <Route
                    path="/login"
                    element={
                      <SignIn
                        tokenSourceUid={portfolio.primaryUiTokenSourceUid}
                      />
                    }
                  />
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
