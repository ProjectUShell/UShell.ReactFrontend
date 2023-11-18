import React from "react";
import { PortfolioManager } from "../../portfolio-handling/PortfolioManager";
import { AuthTokenConfig } from "ushell-portfoliodescription";
import { TokenService } from "../TokenService";

const EmbeddedLogin: React.FC<{
  tokenSourceUid: string;
  redirectUri: string;
}> = ({ tokenSourceUid, redirectUri }) => {
  if (!PortfolioManager.GetPortfolio().authTokenConfigs) {
    return <div>No Token Configs</div>;
  }

  const tokenConfig: AuthTokenConfig | null =
    PortfolioManager.tryGetAuthTokenConfig(
      PortfolioManager.GetPortfolio().primaryUiTokenSourceUid
    );
  if (!tokenConfig) {
    return <div>No Token Config</div>;
  }
  TokenService.performEmbeddedOauthLogin(
    tokenConfig,
    redirectUri,
    tokenSourceUid
  )
  return (
    <div>Logging in...</div>
  );
};

export default EmbeddedLogin;
