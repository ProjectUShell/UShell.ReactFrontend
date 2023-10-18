import React, { useEffect, useState } from "react";
import * as ReactDOMClient from "react-dom/client";

import "./App.css";
// import ShellLayout from "./shell-layout/_Templates/ShellLayout";
import { GuifadFuse, ShellLayout } from "ushell-common-components";
import { ShellMenu } from "./shell-layout/ShellMenu";
import HomeIcon from "./shell-layout/_Icons/HomeIcon";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

// import { UShellLayout } from "ushell-common-components";
import FolderIcon from "./shell-layout/_Icons/FolderIcon";
import Workspace from "./workspace-handling/_Templates/Workspace";
import { PortfolioManager } from "./portfolio-handling/PortfolioManager";
import { PortfolioBasedMenuService } from "./portfolio-handling/PortfolioBasedMenuService";
import { RemoteWidgetDescription } from "./federation/RemoteWidgetDescription";
import { IWidget } from "ushell-modulebase";
import FederatedComponentProxy from "./federation/_Molecules/FederatedComponentProxy";
import UsecaseInstanceDropdown from "./workspace-handling/_Molecules/UsecaseInstanceDropdown";
import { ModuleDescription } from "ushell-portfoliodescription";
import { PortfolioLoader } from "./portfolio-handling/PortfolioLoader";
import PowerIcon from "./shell-layout/_Atoms/PowerIcon";

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
const portfolioLocation: string = plm ? plm.content : pickBasePath();

const App = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const portfolio: string | null = searchParams.get("portfolio");

  // states
  const [menu, setMenu] = useState<ShellMenu | null>(null);

  useEffect(() => {
    PortfolioManager.SetPortfolioLocation(portfolioLocation);
  }, [portfolioLocation]);

  // effects
  useEffect(() => {
    console.log("App booting portfolio", portfolio);
    PortfolioLoader.loadModuleDescription(portfolioLocation, portfolio).then(
      (p) => {
        console.log("md in App", p);
        PortfolioManager.SetModule(p.portfolio, p.module);
        setMenu(PortfolioBasedMenuService.buildMenuFromModule());
      }
    );
  }, [portfolio]);

  // init managers
  PortfolioManager.GetWorkspaceManager().navigateMethod = (url: string) => {
    if (url == "//") {
      navigate("/");
    }
    console.log("navigating", portfolio);
    const url1: string = portfolio ? `${url}?portfolio=${portfolio}` : url;
    console.log("navigating", url1);
    navigate(url1);
  };

  if (!menu) {
    return <div>Shell is loading...</div>;
  }

  console.log("menu", menu);
  console.log("portfolio", portfolio);

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
      element: <App />,

      children: [
        {
          path: "",
          element: <Workspace></Workspace>,
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
  ],
  { basename: pickBasePath() }
);

const container: any = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);
root.render(<RouterProvider router={router} />);
