import React from "react";

import { PortfolioManager } from "../../portfolio-handling/PortfolioManager";
import PopupLoginButton from "./PopupLoginButton";
import { ShellMenu } from "ushell-common-components/dist/esm/components/shell-layout/ShellMenu";
import IFrameLoginButton from "./IFrameLoginButton";
import { pickBasePath } from "../../App";

const LogonPage: React.FC<{
  tokenSourceUid: string;
  portfolio: string | null;
}> = ({ tokenSourceUid, portfolio }) => {
  // const tokenConfig: AuthTokenConfig | null =
  //   PortfolioManager.tryGetAuthTokenConfig(tokenSourceUid);
  // if (!tokenConfig) {
  //   return <div>No Token Config {tokenSourceUid}</div>;
  // }

  const redirectUri: string = window.location.origin;

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
              redirectUri={redirectUri}
              portfolio={portfolio}
            ></PopupLoginButton>
          ) : (
            <IFrameLoginButton
              key={ts}
              tokenConfig={PortfolioManager.tryGetAuthTokenConfig(ts)!}
              tokenSourceUid={ts}
              redirectUri={redirectUri}
              portfolio={portfolio}
            ></IFrameLoginButton>
          )
      )}
    </div>
  );
};
export default LogonPage;
