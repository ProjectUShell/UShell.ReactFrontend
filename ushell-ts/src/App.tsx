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
import { useAuthToken } from "./authentication/useAuthToken";
import { TokenService } from "./authentication/TokenService";

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
const portfolioLocation: string = plm ? plm.content : pickBasePath() + "portfolio";

console.log("portfolioLocation", portfolioLocation);

const App = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // receives OAuth return params
  const codeFromUrlQuery: string | null = searchParams.get("code");
  const tokenFromUrlQuery: string | null = searchParams.get("token");
  const stateFromUrlQuery: string | null = searchParams.get("state");
  var receivedOAuthState : any = {};

  if(stateFromUrlQuery){
    //var b = Buffer.from(stateFromUrlQuery, 'base64')
    //var decodedState: string = b.toString();
    var decodedState: string = atob(stateFromUrlQuery);
    console.log("Reiceived State via Url (seems to come from OAuth redirect): ", decodedState);
    receivedOAuthState = JSON.parse(decodedState);
  }

  if(receivedOAuthState.portfolio){
    console.log("Setting portfolio from oauth-state: ", receivedOAuthState.portfolio);
    searchParams.set("portfolio", receivedOAuthState.portfolio)
    //ewogInBvcnRmb2xpbyI6ImfDvGxsZSIKfQ==
  }

  const portfolio: string | null = searchParams.get("portfolio");

  // states
  const [menu, setMenu] = useState<ShellMenu | null>(null);
  const [uiIsAuthenticated, setUiIsAuthenticated] = useState<boolean>(false);

  /*
  useEffect(() => {

    if(codeFromUrlQuery || tokenFromUrlQuery){
      console.log("Code: ", codeFromUrlQuery, " State: ", tokenFromUrlQuery," Token: ", stateFromUrlQuery);



    }




      //TODO: muss aus der neuen konfigurationsstruktur kommen
      //var currentTokenSource = getTokenSourcesForPrimaryUiTokenSourceUid(p, p.primaryUiTokenSourceUid)
      //var tokenSource = Object.values(currentTokenSource)[0];

      var oAuthProxyUrl = null;
      var oAuthProxyProfile = null;

var primaryUiTokenSourceUid = port

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
*/

  useEffect(() => {
    PortfolioManager.SetPortfolioLocation(portfolioLocation);
  }, [portfolioLocation]);

  // effects
  useEffect(() => {
    console.log("App booting portfolio", portfolio);
    PortfolioLoader.loadModuleDescription(portfolioLocation, portfolio).then(
      (p) => {
        PortfolioManager.SetModule(p.portfolio, p.module);
        setMenu(PortfolioBasedMenuService.buildMenuFromModule()); //TODO create PortfolioBasedMenuService with parameters
        // in common components for use in UShell Modules

        const primaryUiTokenSourceUid = PortfolioManager.GetPortfolio().primaryUiTokenSourceUid; 

        if(codeFromUrlQuery || tokenFromUrlQuery){
          console.log("Code: ", codeFromUrlQuery, " State: ", stateFromUrlQuery ," Token: ", tokenFromUrlQuery);
    
          var token = tokenFromUrlQuery;
          if(codeFromUrlQuery){
            //TODO: ausprogrammieren
            token = "abgeholterToken"
          }
          if(receivedOAuthState.tokenSourceUid && token){
            console.log("importing token '" + token + "' for source " + receivedOAuthState.tokenSourceUid)
            TokenService.setToken(receivedOAuthState.tokenSourceUid, token);
          }

          searchParams.delete("state");
          searchParams.delete("code");
          searchParams.delete("token");

          setSearchParams(searchParams);
        }

        var isAuthenticated: boolean = true;
        if(primaryUiTokenSourceUid && primaryUiTokenSourceUid != "00000000-0000-0000-0000-000000000000"){
          isAuthenticated = useAuthToken(primaryUiTokenSourceUid);
        }
        setUiIsAuthenticated(isAuthenticated);

      }
    );

  }, [portfolio]);

  // init managers
  PortfolioManager.GetWorkspaceManager().navigateMethod = (url: string) => {
    if (url == "//") {
      navigate("/");
      return;
    }
    const url1: string = portfolio ? `${url}?portfolio=${portfolio}` : url;
    navigate(url1);
  };

  if (!uiIsAuthenticated) {
    console.log("Protected route -> navigate to laogin!");
    PortfolioManager.GetWorkspaceManager().navigateSafe("/login");
  }

  if (!menu) {
    return <div>Shell is loading...</div>;
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
    {
      path: "login",
      element: <div>Login</div>,
    }
],
  { basename: pickBasePath() }
);

const container: any = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);
root.render(<RouterProvider router={router} />);
