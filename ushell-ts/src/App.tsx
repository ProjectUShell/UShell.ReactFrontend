import React, { useEffect, useState } from "react";
import * as ReactDOMClient from "react-dom/client";

import "./App.css";
// import ShellLayout from "./shell-layout/_Templates/ShellLayout";
import { ShellLayout } from "ushell-common-components";
import { ShellMenu } from "./shell-layout/ShellMenu";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

// import { UShellLayout } from "ushell-common-components";
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

const pickBasePath = () => {
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

console.log("portfolioLocation", portfolioLocation);

const App = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const headless: string | null = searchParams.get("headless");

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authTokenInfo: AuthTokenInfo = TokenService.tryGetAuthTokenInfo(
    location,
    searchParams
  );

  if (authTokenInfo.stateFromUrlQuery.portfolio) {
    console.log(
      "Setting portfolio from oauth-state: ",
      authTokenInfo.stateFromUrlQuery.portfolio
    );
    searchParams.set("portfolio", authTokenInfo.stateFromUrlQuery.portfolio);
  }

  const portfolio: string | null = searchParams.get("portfolio");

  // states
  const [menu, setMenu] = useState<ShellMenu | null>(null);
  const [renderTrigger, setRenderTrigger] = useState(0);

  useEffect(() => {
    PortfolioManager.SetPortfolioLocation(portfolioLocation);
  }, [portfolioLocation]);

  const [closing, setClosing] = useState(false);

  console.log("render app", window.location.href);
  // effects
  useEffect(() => {
    console.log("App booting portfolio", portfolio);
    console.log("SearchParams", window.location.href);
    PortfolioLoader.loadModuleDescription(portfolioLocation, portfolio).then(
      (p) => {
        PortfolioManager.SetModule(p.portfolio, p.module);
        TokenService.resolveAuthTokenInfo(
          authTokenInfo,
          searchParams,
          setSearchParams
        ).then((result: TokenResolveResult) => {
          if (!result.noParams && result.wasPopup) {
            setClosing(true);
            window.close();
          }
          if (!result.noParams && !result.success) {
            throw "Unauthorized";
          }
          setMenu(PortfolioBasedMenuService.buildMenuFromModule()); //TODO create PortfolioBasedMenuService with parameters
        });
      }
    );
  }, [portfolio]);

  if (closing) {
    return <div>closing...</div>;
  }

  // init managers
  PortfolioManager.GetWorkspaceManager().navigateMethod = (url: string) => {
    if (url == "//") {
      navigate("/");
      return;
    }
    const url1: string = portfolio ? `${url}?portfolio=${portfolio}` : url;
    navigate(url1);
  };

  if (!PortfolioManager.GetPortfolio()) {
    return <div>Loading...</div>;
  }

  if (!menu) {
    return <div>Shell is loading...</div>;
  }

  if (isAuthenticated !== TokenService.isUiAuthenticated()) {
    setIsAuthenticated(TokenService.isUiAuthenticated());
    setMenu(PortfolioBasedMenuService.buildMenuFromModule());
  }

  if (headless) {
    return <Workspace></Workspace>;
  }
  return (
    <ShellLayout
      title={
        <img
          src={"ushell-whitebg.png"}
          style={{ height: "30px" }}
          alt="fireSpot"
          onClick={() =>
            PortfolioManager.GetWorkspaceManager().navigateSafe("/")
          }
          className="cursor-pointer"
        />
      }
      shellMenu={menu}
    >
      <Workspace></Workspace>
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
