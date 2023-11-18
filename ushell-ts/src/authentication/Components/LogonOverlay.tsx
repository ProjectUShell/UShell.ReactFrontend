import React, { useState, useEffect, useRef } from "react";

import { Button, Card, Collapse } from "antd";
import { useNavigate } from "react-router-dom";

const { Panel } = Collapse;

import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";

/*
import useAuthToken from "../../hooks/useAuthToken";

import {
  getPersistentState,
  setPersistentState,
  deletePersistentState
} from "../../portfolio-handling/StateSerivce";

import {
  getTokenSourcesForPrimaryUiTokenSourceUid
} from "../../portfolio-handling/PortfolioService";

import {
  setToken
} from "../../services/TokenService";
*/

import { PortfolioLoader } from "../../portfolio-handling/PortfolioLoader";

// import "./SignIn.css";
import { TokenService } from "../TokenService";

const delay = 500;

const LogonOverlay: React.FC<{ tokenSourceUid: string }> = ({
  tokenSourceUid,
}) => {
  const [activeCollapse, setActiveCollapse] = useState(1);
  const [currentLoginState, setCurrentLoginState] = useState("Signing in...");

  // const interval = useRef(null);
  var interval2: any;

  const navigate = useNavigate();

  var oAuthProxyUrl = "";
  var oAuthProxyProfile = "";
  var clientId = "";
  var logonUrlUnsafe = "";
  var state = "";

  useEffect(() => {
    interval2 = setInterval(() => {
      checkForTokenArrived();
    }, delay);

    // TODO: select by
    // issueMode: OAUTH_CIBA_CODEGRAND, etc.
    // oAuthProxyProfile: github_lh3000, etc.
    // for now just pick the first one
    // var currentTokenSource =  getTokenSourcesForPrimaryUiTokenSourceUid(p, tokenSourceUid)
    // console.log("Loaded token source: ", Object.values(currentTokenSource)[0]);

    // var currentTokenSourceValues = Object.values(currentTokenSource)[0];
    // console.log("authEndpointUrl: ", currentTokenSourceValues[0].authEndpointUrl);

    // if (currentTokenSource && Object.values(currentTokenSource)[0]) {
    //   console.log("SignIn: SUCCESS current token source -> ", currentTokenSource[0]);

    //   oAuthProxyUrl = currentTokenSourceValues[0].authEndpointUrl;
    //   oAuthProxyProfile = currentTokenSourceValues[0].authProxyProfile;
    //   clientId = currentTokenSourceValues[0].clientId;

    //   console.log("SignIn: SUCCESS oauth proxy url and proxy profile -> ", oAuthProxyUrl, oAuthProxyProfile);
    // }
    // else {
    //   console.warn("SignIn: FAILED to load current token source from Portfolio -> ", p);
    // }

    // Just in case, clear interval on component un-mount, to be safe.
    // return () => clearInterval(interval.current);
  }, []);

  const startSignIn = () => {
    prepareSignIn();
    setActiveCollapse(1);
    setCurrentLoginState("Singing in...");
  };

  const cancelSignIn = () => {
    setActiveCollapse(2);
    setCurrentLoginState("Sing in cancelled!");

    onSinInCancelled();
  };

  const prepareSignIn = () => {
    // TODO: get dynamically -> useLocation hook?
    var localRootUri = "http://localhost:3000/#/"; //window.location.href;

    // cut any query-parameter
    let idx = localRootUri.indexOf("?");
    if (idx > 0) {
      localRootUri = localRootUri.substring(0, idx);
    }

    //localRootUri = localRootUri.replace('/#/', '/');

    console.info("SignIn: using OAUTH redirect_uri -> " + localRootUri);

    var randomString = makeRandom(32, "0123456789bcdef");
    state = randomString + "@" + oAuthProxyProfile;

    console.info("SigIn: using state -> " + state);

    //logonUrl = this.sanitizer.bypassSecurityTrustResourceUrl(oAuthProxyUrl + '?state=' + state +'&redirect_uri=' + localRootUri);
    logonUrlUnsafe = `${oAuthProxyUrl}?scope=user:email&client_id=${clientId}`; //&state=${state}&redirect_uri=${localRootUri}`;

    console.log("SignIn: Logon url -> ", logonUrlUnsafe);

    interval2 = setInterval(() => {
      checkForTokenArrived();
    }, delay);
  };

  const checkForTokenArrived = () => {
    // console.log("...Checking for token arrived...");
    // //var result = getPersistentState("stagedtoken_" + state);
    // // HACK: use this line instead a line below -> var result = getPersistentState("stagedtoken_" + state);
    // var result = getPersistentState("stagedtoken_" + "stateFromUrl");
    // if (result) {
    //   console.info("SignIn: Got token -> " + result);
    //   // temporär, um den token zu transpotieren
    //   deletePersistentState("stagedtoken_" + state);
    //   console.info("...reset time interval...");
    //   clearInterval(interval.current);
    //   // TODO: uncomment, after CORS problems are solved
    //   // if (result.startsWith("ERROR")) {
    //   //     error = result.substring(6);
    //   //     console.warn("TOKEN-REQUEST-ERROR: " + error);
    //   // }
    //   // else {
    //     console.info("SinIn: GOT NEW TOKEN -> " + result);
    //     let isValid = setToken(tokenSourceUid, result);
    //       if (isValid) {
    //         navigate(`/`);
    //       }
    //       else {
    //         console.log("An invalid token was returned: '" + result + "'");
    //       }
    //   // }
    // }
    // else {
    //   console.log("...no token arrived...");
    // }
  };

  function makeRandom(lengthOfCode: any, possible: any) {
    let text = "";

    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  function onSinInCancelled() {
    console.info("...reset time interval...");
    //clearInterval(interval.current);
  }

  // HACK: just for testing now, already dynamically builded, but not used yet
  // let hackUrl = `https://github.com/login/oauth/authorize?scope=user:email&client_id=1c295a48ec933ccdf6b7`;
  let hackUrl =
    `https://ct-expert.de/oauth/authorize` +
    `?state=ewogICJwb3J0Zm9saW8iPSJWYWxpZGF0aW9uUHJvZmlsZUNsaWVudEEiLAogICJ0b2tlblNvdXJjZVVpZCI9IjRFODg4NDEzLTI0M0ItMjJBOS00NDA3LTZBRjg0RjQzQTEyRSIKfQ==` +
    `&redirectUri=http://localhost:3000/`;

  let hackUrl2 =
    "https://accounts.google.com/o/oauth2/auth?redirect_uri=http://localhost:3000&client_id=776141787389-1iv3vc50uoamnfe8bkffjq3auii344i4.apps.googleusercontent.com&response_type=token&scope=https://www.googleapis.com/auth/plus.login+";

  const popup = window.open(hackUrl2, "popup", "popup=true");
  const checkPopup = setInterval(() => {
    if (popup?.window.location.href.includes("localhost")) {
      console.log("logon", popup?.window.location.href)
      popup.close();
    }
    if (!popup || !popup.closed) return;
  }, 1000);
  return (
    <div>
      {/* <iframe
        id="inlineFrameExample"
        title="Inline Frame Example"
        width="300"
        height="200"
        // src="https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik"
        src="https://www.google.com/"
      ></iframe> */}
      {/* <iframe src={hackUrl2}></iframe> */}
      {/* <iframe src={"https://accounts.google.com/o/oauth2/auth?redirect_uri=http://localhost:3000&client_id=776141787389-1iv3vc50uoamnfe8bkffjq3auii344i4.apps.googleusercontent.com&response_type=token&scope=https://www.googleapis.com/auth/plus.login+"}></iframe> */}
      <a href={hackUrl2} target="_blank">
        Open in separate Window
      </a>
    </div>
  );

  return (
    <div className="">
      <iframe src={hackUrl2} width="100%">
        please wait...
      </iframe>
      <div>Problems caused by iframe-restrictions? </div>
      <button type="submit" onClick={cancelSignIn} style={{ marginTop: 15 }}>
        Cancel
      </button>
    </div>
  );
};

export default LogonOverlay;
