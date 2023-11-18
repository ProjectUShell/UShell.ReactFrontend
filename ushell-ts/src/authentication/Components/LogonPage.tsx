import React, { useState, useEffect, useRef } from "react";

import { Button, Card, Collapse } from "antd";
import { useNavigate } from "react-router-dom";

const { Panel } = Collapse;

import LogonOverlay from "./LogonOverlay";
import EmbeddedLogin from "./EmbeddedLogin";
import { PortfolioManager } from "../../portfolio-handling/PortfolioManager";
import { AuthTokenConfig } from "ushell-portfoliodescription";
import EmbeddedLoginButton from "./EmbeddedLoginButton";
import PopupLogin from "./PopupLogin";
import PopupLoginButton from "./PopupLoginButton";

const LogonPage = () => {
  return (
    <div className="w-screen h-screen flex">
      <div className="m-auto bg-backgroundtwo p-2 rounded-md flex flex-col gap-1">
        <div className="p-1 hover:bg-backgroundthree">
          <h1>Embedded</h1>
          <EmbeddedLoginButton
            tokenSourceUid={
              PortfolioManager.GetPortfolio().primaryUiTokenSourceUid
            }
            redirectUri="http://localhost:3000"
          ></EmbeddedLoginButton>
        </div>
        <div className="p-1 hover:bg-backgroundthree">
          <h1>PopUp</h1>
          <PopupLoginButton
            tokenSourceUid={
              PortfolioManager.GetPortfolio().primaryUiTokenSourceUid
            }
            redirectUri="http://localhost:3000"
          ></PopupLoginButton>
        </div>
      </div>
    </div>
  );
};

export default LogonPage;
