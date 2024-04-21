import React from "react";
import { PortfolioManager } from "../../portfolio-handling/PortfolioManager";
import { AuthTokenConfig } from "ushell-portfoliodescription";
import { TokenService } from "../TokenService";
import LoginButton from "./LoginButton";

const EmbeddedLogin: React.FC<{
  tokenConfig: AuthTokenConfig;
  tokenSourceUid: string;
  redirectUri: string;
  portfolio: string | null
}> = ({ tokenSourceUid, redirectUri, tokenConfig, portfolio }) => {
  return (
    <LoginButton
      text={`Embedded Login with ${tokenConfig.localLogonNameInputLabel}`}
      onClick={() =>
        TokenService.performEmbeddedOauthLogin(
          tokenConfig,
          redirectUri,
          tokenSourceUid,
          portfolio
        )
      }
    ></LoginButton>
  );
};

export default EmbeddedLogin;
