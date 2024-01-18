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
import SettingsDropdown from "../../shell-layout/_Molecules/SettingsDropdown";
import {
  ColorMode,
  LayoutMode,
  saveShellSettings,
} from "../../shell-layout/ShellSettings";
import TopBar from "ushell-common-components/dist/cjs/components/shell-layout/_Organisms/TopBar";
import { ShellLayout } from "ushell-common-components";
import { ShellMenu } from "ushell-common-components/dist/esm/components/shell-layout/ShellMenu";
import LoginButton from "./LoginButton";
import IFrameLogin from "./IFrameLogin";
import IFrameLoginButton from "./IFrameLoginButton";

const LogonPage: React.FC<{
  tokenSourceUid: string;
  portfolio: string | null;
}> = ({ tokenSourceUid, portfolio }) => {
  const tokenConfig: AuthTokenConfig | null =
    PortfolioManager.tryGetAuthTokenConfig(tokenSourceUid);
  if (!tokenConfig) {
    return <div>No Token Config</div>;
  }

  const shellMenu: ShellMenu = new ShellMenu();
  shellMenu.items = [];

  return (
    <div className="m-auto bg-backgroundone dark:bg-backgroundonedark p-8 rounded-lg flex flex-col gap-2">
      {PortfolioManager.GetPortfolio().authenticatedAccess.primaryUiTokenSources.map(
        (ts) =>
          PortfolioManager.tryGetAuthTokenConfig(ts)!
            .authEndpointRejectsIframe ? (
            <PopupLoginButton
              key={ts}
              tokenConfig={PortfolioManager.tryGetAuthTokenConfig(ts)!}
              tokenSourceUid={ts}
              redirectUri="http://localhost:3000"
              portfolio={portfolio}
            ></PopupLoginButton>
          ) : (
            <IFrameLoginButton
              key={ts}
              tokenConfig={PortfolioManager.tryGetAuthTokenConfig(ts)!}
              tokenSourceUid={ts}
              redirectUri="http://localhost:3000"
              portfolio={portfolio}
            ></IFrameLoginButton>
          )
      )}
    </div>
  );
};
export default LogonPage;
