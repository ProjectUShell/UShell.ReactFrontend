import React, { useState, useEffect, useRef } from 'react';

import { Button, Card, Collapse } from 'antd';
import { useNavigate } from "react-router-dom";

const { Panel } = Collapse;

import {  EditOutlined, EllipsisOutlined, SettingOutlined  } from "@ant-design/icons";

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

import { PortfolioLoader } from "../../portfolio-handling/PortfolioLoader";

import "./SignIn.css";

const delay = 500;

const SignIn = ({tokenSourceUid}) => {

  const [activeCollapse, setActiveCollapse] = useState(1);
  const [currentLoginState, setCurrentLoginState] = useState("Signing in...");

  const interval = useRef(null);

  const navigate = useNavigate();

  var oAuthProxyUrl = '';
  var oAuthProxyProfile = '';
  var clientId = '';
  var logonUrlUnsafe = '';
  var state = '';

  useEffect(() => {
    PortfolioLoader.loadModulePortfolio().then((p) => {
      
      interval.current = setInterval(() => {
        checkForTokenArrived();
      }, delay);
      
      // TODO: select by
      // issueMode: OAUTH_CIBA_CODEGRAND, etc.
      // oAuthProxyProfile: github_lh3000, etc.
      // for now just pick the first one
      var currentTokenSource = getTokenSourcesForPrimaryUiTokenSourceUid(p, tokenSourceUid)
      console.log("Loaded token source: ", Object.values(currentTokenSource)[0]);

      var currentTokenSourceValues = Object.values(currentTokenSource)[0];
      console.log("authEndpointUrl: ", currentTokenSourceValues[0].authEndpointUrl);

      if (currentTokenSource && Object.values(currentTokenSource)[0]) {
        console.log("SignIn: SUCCESS current token source -> ", currentTokenSource[0]);

        oAuthProxyUrl = currentTokenSourceValues[0].authEndpointUrl;
        oAuthProxyProfile = currentTokenSourceValues[0].authProxyProfile;
        clientId = currentTokenSourceValues[0].clientId;

        console.log("SignIn: SUCCESS oauth proxy url and proxy profile -> ", oAuthProxyUrl, oAuthProxyProfile);
      }
      else {
        console.warn("SignIn: FAILED to load current token source from Portfolio -> ", p);
      }
    });

    // Just in case, clear interval on component un-mount, to be safe.
    // return () => clearInterval(interval.current);
  }, []);

  const startSignIn = () => {
    prepareSignIn();
    setActiveCollapse(1);
    setCurrentLoginState("Singing in...");
  }

  const cancelSignIn = () => {
    setActiveCollapse(2);
    setCurrentLoginState("Sing in cancelled!");

    onSinInCancelled();
  }

  const prepareSignIn = () => {
      
    // TODO: get dynamically -> useLocation hook?
    var localRootUri = "http://localhost:3000/#/"; //window.location.href;

    // cut any query-parameter
    let idx = localRootUri.indexOf('?');
    if (idx > 0) {
      localRootUri = localRootUri.substring(0, idx);
    }

    //HACK: as ugly as the fact that we have this # in our url!
    localRootUri = localRootUri.replace('/#/', '/');

    console.info("SignIn: using OAUTH redirect_uri -> " + localRootUri);

    var randomString = makeRandom(32, "0123456789bcdef");
    state = randomString + "@" + oAuthProxyProfile;

    console.info("SigIn: using state -> " + state);

    //logonUrl = this.sanitizer.bypassSecurityTrustResourceUrl(oAuthProxyUrl + '?state=' + state +'&redirect_uri=' + localRootUri);
    logonUrlUnsafe = `${oAuthProxyUrl}?scope=user:email&client_id=${clientId}`; //&state=${state}&redirect_uri=${localRootUri}`;

    console.log("SignIn: Logon url -> ", logonUrlUnsafe);

    interval.current = setInterval(() => {
      checkForTokenArrived();
    }, delay);
  }

  const checkForTokenArrived = () => {

    console.log("...Checking for token arrived...");

    //var result = getPersistentState("stagedtoken_" + state);
    // HACK: use this line instead a line below -> var result = getPersistentState("stagedtoken_" + state);
    var result = getPersistentState("stagedtoken_" + "stateFromUrl");
    if (result) {
      console.info("SignIn: Got token -> " + result);

      // temporär, um den token zu transpotieren
      deletePersistentState("stagedtoken_" + state);

      console.info("...reset time interval...");
      clearInterval(interval.current);

      // TODO: uncomment, after CORS problems are solved
      // if (result.startsWith("ERROR")) {
      //     error = result.substring(6);
      //     console.warn("TOKEN-REQUEST-ERROR: " + error);
      // }
      // else {  
        console.info("SinIn: GOT NEW TOKEN -> " + result);

        let isValid = setToken(tokenSourceUid, result);

          if (isValid) {
            navigate(`/`);
          }
          else {
            console.log("An invalid token was returned: '" + result + "'");
          }
      // }
    }
    else {
      console.log("...no token arrived...");
    }
  }

  function makeRandom(lengthOfCode, possible) {
    let text = "";

    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    return text;
  }

  function onSinInCancelled() {
    console.info("...reset time interval...");
    clearInterval(interval.current);
  }

  // HACK: just for testing now, already dynamically builded, but not used yet
  let githubUrl = `https://github.com/login/oauth/authorize?scope=user:email&client_id=1c295a48ec933ccdf6b7`;

  return (
    <div className="shell__signin_container">
            <button
              onClick={startSignIn}
            > SignIn </button>

          <Logon></>

    </div>
    );
  };

export default SignIn;
