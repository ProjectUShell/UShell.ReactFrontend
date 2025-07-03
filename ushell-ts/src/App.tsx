import React, { useEffect, useRef, useState } from "react";
import * as ReactDOMClient from "react-dom/client";

import "./App.css";
// import ShellLayout from "./shell-layout/_Templates/ShellLayout";
import { ShellLayout } from "ushell-common-components";
import { containsItem, ShellMenu } from "./shell-layout/ShellMenu";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

// import { UShellLayout } from "ushell-common-components";
import { UsecaseState } from "ushell-modulebase";
import Workspace from "./workspace-handling/_Templates/Workspace";
import { PortfolioManager } from "./portfolio-handling/PortfolioManager";
import { PortfolioBasedMenuService } from "./portfolio-handling/PortfolioBasedMenuService";
import { PortfolioLoader } from "./portfolio-handling/PortfolioLoader";
import ProtectedRoute from "./authentication/ProtectedRoute";
import { WorkspaceManager } from "./workspace-handling/WorkspaceManager";
import {
  TokenResolveResult,
  TokenService,
} from "./authentication/TokenService";
import LogonPage from "./authentication/Components/LogonPage";
import { AuthTokenInfo } from "./authentication/AuthTokenInfo";
import { DatasourceManager } from "./datasource-handling/DatasourceManager";
import {
  loadShellMenuStates,
  saveShellMenuState,
  ShellMenuState,
} from "ushell-common-components/dist/esm/components/shell-layout/ShellMenuState";

import UsecaseModal from "./workspace-handling/_Templates/UsecaseModal";
import { ColorMode, loadShellSettings } from "./shell-layout/ShellSettings";
import AppBreadcrumb, {
  AppBreadcrumbItem,
} from "./workspace-handling/_Molecules/AppBreadcrumb";
import { WidgetHost } from "./portfolio-handling/WidgetHost";
import { CommandDescription } from "ushell-portfoliodescription";

const glob: any = globalThis;
glob.globalWorkspaceManager = PortfolioManager.GetWorkspaceManager();
glob.setAppScope = (x: any) => PortfolioManager.GetInstance().SetAppScope(x);

export const pickBasePath = () => {
  let baseHref = (document.getElementsByTagName("base")[0] || { href: "/" })
    .href;

  //Because of some strange magic, the browser automatically prepends the
  //hostname to the base-href. Also when reading the base-tag directly
  //from the html-head! So we need to remove the host to get the plain
  //configured value (a directory-url, relative to the root of the webserver)
  baseHref = baseHref.replace("://", "");
  let pos = baseHref.indexOf("/");
  if (pos < 0) {
    baseHref = "/";
  } else {
    baseHref = baseHref.substring(pos);
  }

  return baseHref;
};

const plm: any = document.querySelector('meta[name="portfolioLocation"]');
const portfolioLocation: string = plm
  ? plm.content
  : pickBasePath() + "portfolio";

console.debug("portfolioLocation", portfolioLocation);

const App = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const headless: string | null = searchParams.get("headless");

  // states
  const [menu, setMenu] = useState<ShellMenu | null>(null);
  const [appBreadcrumbItems, setAppBreacdrumbItems] = useState<
    AppBreadcrumbItem[]
  >([]);

  const [error, setError] = useState<string | null>(null);

  const [modalUsecaseState, setModalUsecaseState] =
    useState<UsecaseState | null>(null);

  const [closing, setClosing] = useState(false);

  const [r, setR] = useState(0);
  // const [shellMenuState, setShellMenuState] = useState<ShellMenuState>(
  //   loadShellMenuState()
  // );
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authTokenInfo: AuthTokenInfo = TokenService.tryGetAuthTokenInfo(
    location,
    searchParams
  );

  if (authTokenInfo.stateFromUrlQuery.portfolio) {
    console.debug(
      "Setting portfolio from oauth-state: ",
      authTokenInfo.stateFromUrlQuery.portfolio
    );
    searchParams.set("portfolio", authTokenInfo.stateFromUrlQuery.portfolio);
  }

  const portfolio: string | null = searchParams.get("portfolio");

  // effects
  useEffect(() => {
    console.log("useEffect portfolioLocation");
    PortfolioManager.SetPortfolioLocation(portfolioLocation);
  }, [portfolioLocation]);

  useEffect(() => {
    console.log("useEffect portfolio");
    console.debug("App booting portfolio", portfolio);
    PortfolioLoader.loadModuleDescription(portfolioLocation, portfolio)
      .then((p) => {
        PortfolioManager.SetModule(p.portfolio, p.module);

        TokenService.resolveAuthTokenInfo(
          authTokenInfo,
          searchParams,
          setSearchParams
        )
          .then((result: TokenResolveResult) => {
            if (!result.noParams && result.wasPopup) {
              setClosing(true);
              window.close();
            }
            if (!result.noParams && !result.success) {
              throw "Unauthorized";
            }
          })
          .then(() => {
            DatasourceManager.Instance()
              .init()
              .then(() => {
                console.log("set menu because portfolio change");
                setMenu(PortfolioBasedMenuService.buildMenuFromModule());
              });
          });
      })
      .catch((err) => {
        console.error(
          `Error loading portfolio (PortfolioLocation = ${portfolioLocation})`,
          err
        );
        setError(
          "Error loading portfolio. Please check the console for more details."
        );
      });
  }, [portfolio]);

  // useEffect(() => {
  //   console.log("useEffect shellMenuState");
  //   saveShellMenuState(shellMenuState);
  // }, [shellMenuState]);

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (closing) {
    return <div>closing...</div>;
  }

  // debug useEffects

  // useEffect(() => {
  //   console.log("useEffect closing");
  // }, [closing]);

  // useEffect(() => {
  //   console.log("useEffect menu");
  // }, [menu]);

  // useEffect(() => {
  //   console.log("useEffect appBreadcrumbItems");
  // }, [appBreadcrumbItems]);

  // useEffect(() => {
  //   console.log("useEffect isAuthenticated");
  // }, [isAuthenticated]);

  // useEffect(() => {
  //   console.log("useEffect shellMenuState");
  // }, [shellMenuState]);

  // useEffect(() => {
  //   console.log("useEffect modalUsecaseState");
  // }, [modalUsecaseState]);

  // init managers
  PortfolioManager.GetWorkspaceManager().navigateMethod = (url: string) => {
    if (url == "//") {
      navigate("/");
      return;
    }
    if (url.includes("?portfolio")) {
      navigate(url);
    } else {
      const url1: string = portfolio ? `${url}?portfolio=${portfolio}` : url;
      navigate(url1);
    }
  };

  PortfolioManager.GetWorkspaceManager().onAppScopeChangedMethod = () => {
    setModalUsecaseState(null);
    DatasourceManager.Instance()
      .init()
      .then(() => {
        const newMenu = PortfolioBasedMenuService.buildMenuFromModule();
        // console.log("set menu after appScope change", newMenu);
        setMenu(newMenu);
      });
  };

  PortfolioManager.GetWorkspaceManager().activateModalMethod =
    setModalUsecaseState;

  PortfolioManager.GetWorkspaceManager().deactivateModalMethod = (
    mus?: UsecaseState
  ) => {
    if (mus) {
      if (
        modalUsecaseState &&
        modalUsecaseState.usecaseInstanceUid == mus.usecaseInstanceUid
      ) {
        setModalUsecaseState(null);
      }
    }
    setModalUsecaseState(null);
  };

  // PortfolioManager.GetWorkspaceManager().setActiveMenuItemMethod = (
  //   activeMenuItemId: string
  // ) => {
  //   // console.log("setActiveMenuItemMethod called");
  //   setShellMenuState((sm) => {
  //     return { ...sm, activeItemId: activeMenuItemId };
  //   });
  // };

  PortfolioManager.GetWorkspaceManager().trySetActiveMenuItemMethod = (
    workspaceKey: string
  ) => {
    if (!menu) return;
    // if (containsItem(menu.items, shellMenuState.activeItemId)) return;
    // console.log("trySetActiveMenuItemMethod", menu, shellMenuState);
    if (!workspaceKey || workspaceKey == "") {
      const shellMenuStates: ShellMenuState[] = loadShellMenuStates();
      const defaultShellMenuState: ShellMenuState | undefined =
        shellMenuStates.find((s) => s.id == "");
      if (!defaultShellMenuState) {
        return;
      }
      if (defaultShellMenuState.activeItemId == "") {
        return;
      }
      defaultShellMenuState.activeItemId = "";
      saveShellMenuState(defaultShellMenuState, true);
      setR((r) => r + 1);
      return;
    }
    const matchingCommands: CommandDescription[] =
      PortfolioManager.GetModule().commands.filter(
        (c) => c.targetWorkspaceKey == workspaceKey
      );
    for (let matchingCommand of matchingCommands) {
      if (containsItem(menu.items, matchingCommand.uniqueCommandKey)) {
        const shellMenuStates: ShellMenuState[] = loadShellMenuStates();
        const defaultShellMenuState: ShellMenuState | undefined =
          shellMenuStates.find((s) => s.id == "");
        if (!defaultShellMenuState) {
          return;
        }
        defaultShellMenuState.activeItemId = matchingCommand.uniqueCommandKey;
        saveShellMenuState(defaultShellMenuState, true);
        // setShellMenuState((sm) => {
        //   return { ...sm, activeItemId: matchingCommand.uniqueCommandKey };
        // });
        return;
      }
    }
  };

  PortfolioManager.GetWorkspaceManager().pushBreadcrumbItemMethod = (
    id,
    label,
    command
  ) => {
    const indexOfItem: number = appBreadcrumbItems.findIndex(
      (bi) => bi.id == id
    );
    console.log("pushBreadcrumbItemMethod", appBreadcrumbItems, indexOfItem);
    if (indexOfItem >= 0) {
      if (indexOfItem == appBreadcrumbItems.length - 1) return;
      appBreadcrumbItems.splice(indexOfItem + 1);
      setAppBreacdrumbItems([...appBreadcrumbItems]);
      return;
    }
    if (appBreadcrumbItems.find((bi) => bi.id == id)) return;
    // console.log("pushBreadcrumbItem", id);
    appBreadcrumbItems.push({ id: id, label: label, onClicked: command });
    setAppBreacdrumbItems([...appBreadcrumbItems]);
  };

  PortfolioManager.GetWorkspaceManager().forceBreadcrumbItemMethod = (id) => {
    if (id == "" && appBreadcrumbItems.length > 0) setAppBreacdrumbItems([]);
    const indexOfItem: number = appBreadcrumbItems.findIndex(
      (bi) => bi.id == id
    );
    if (indexOfItem < 0 || indexOfItem == appBreadcrumbItems.length - 1) return;
    const newAppBreadcrumbItems = appBreadcrumbItems.splice(indexOfItem + 1);
    setAppBreacdrumbItems([...newAppBreadcrumbItems]);
  };

  PortfolioManager.GetWorkspaceManager().activateBreadcrumbItemMethod = (
    id
  ) => {
    // console.log("activateBreadcrumbItemMethod", id);
    if (id == "") {
      setAppBreacdrumbItems([]);
    }
  };

  if (!PortfolioManager.GetPortfolio()) {
    return <div>Loading...</div>;
  }

  // if (!menu) {
  //   return <div>Shell is loading...</div>;
  // }

  if (!DatasourceManager.isInitialized()) {
    return <div>Shell is loading...</div>;
  }

  if (isAuthenticated !== TokenService.isUiAuthenticated()) {
    setIsAuthenticated(TokenService.isUiAuthenticated());
    const newMenu = PortfolioBasedMenuService.buildMenuFromModule();
    // console.log("set menu because authentication change", newMenu);
    setMenu(newMenu);
  }

  // console.debug("rendering app", menu);

  if (headless) {
    return (
      <div className="h-screen w-screen flex flex-col overflow-hidden font-custom antialiased bg-backgroundtwo dark:bg-backgroundtwodark text-textone dark:text-textonedark">
        <Workspace></Workspace>
      </div>
    );
  }
  return (
    <ShellLayout
      title={
        <div className="flex items-center content-center">
          <img
            src={
              loadShellSettings().colorMode == ColorMode.Dark
                ? PortfolioManager.GetPortfolio().logoUrlDark &&
                  PortfolioManager.GetPortfolio().logoUrlDark != "" &&
                  PortfolioManager.GetPortfolio().logoUrlDark!.includes(".png")
                  ? PortfolioManager.GetPortfolio().logoUrlDark
                  : "ushell-whitebg.png"
                : PortfolioManager.GetPortfolio().logoUrlLight &&
                  PortfolioManager.GetPortfolio().logoUrlLight != "" &&
                  PortfolioManager.GetPortfolio().logoUrlLight!.includes(".png")
                ? PortfolioManager.GetPortfolio().logoUrlLight
                : "ushell-whitebg.png"
            }
            style={{ height: "30px" }}
            alt="ushell-whitebg.png"
            onClick={() => {
              const homeWorkspaceKey: string =
                PortfolioManager.GetPortfolio().landingWorkspaceName;
              if (homeWorkspaceKey.startsWith("activate")) {
                WidgetHost.fireEvent1(homeWorkspaceKey, {});
              } else {
                PortfolioManager.GetWorkspaceManager().navigateSafe("/");
              }
              setAppBreacdrumbItems([]);
            }}
            className="cursor-pointer"
          />
          <p>{PortfolioManager.GetPortfolio().applicationTitle}</p>
          <div>
            <AppBreadcrumb items={appBreadcrumbItems}></AppBreadcrumb>
          </div>
        </div>
      }
      shellMenu={menu || { items: [] }}
      // shellMenuState={shellMenuState}
    >
      <Workspace></Workspace>
      {modalUsecaseState && (
        <UsecaseModal
          usecaseState={modalUsecaseState}
          terminate={() => {
            PortfolioManager.GetWorkspaceManager().terminateModal(
              modalUsecaseState
            );
          }}
        ></UsecaseModal>
      )}
      {/* <Outlet /> */}
    </ShellLayout>
  );
};

const router = createBrowserRouter(
  [
    {
      path: "/",
      //element: <ProtectedRoute redirectPath="/login" primaryUiTokenSourceUid="4E888413-243B-22A9-4407-6AF84F43A12E" />,
      element: <App></App>,
      children: [
        {
          path: "",
          element: <App></App>,
        },
        {
          path: ":workspaceKey",
          element: <App></App>,
        },
        {
          path: ":workspaceKey/:usecaseId",
          element: <App></App>,
        },
      ],
    },
    // {
    //   path: "login",
    //   element: <LogonPage></LogonPage>,
    // },
  ],
  { basename: pickBasePath() }
);

const container: any = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);
root.render(<RouterProvider router={router} />);
