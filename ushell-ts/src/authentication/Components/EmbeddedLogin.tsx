import React from "react";
import { PortfolioManager } from "../../portfolio-handling/PortfolioManager";
import { AuthTokenConfig } from "ushell-portfoliodescription";
import { TokenService } from "../TokenService";

const EmbeddedLogin: React.FC<{
  tokenConfig: AuthTokenConfig;
  tokenSourceUid: string;
  redirectUri: string;
  portfolio: string | null
}> = ({ tokenSourceUid, redirectUri, tokenConfig, portfolio }) => {
  TokenService.performEmbeddedOauthLogin(
    tokenConfig,
    redirectUri,
    tokenSourceUid,
    portfolio
  );
  return <div>Logging in...</div>;
};

export default EmbeddedLogin;
