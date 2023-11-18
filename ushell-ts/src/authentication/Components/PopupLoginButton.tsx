import React, { useEffect, useState } from "react";
import { TokenService } from "../TokenService";
import { AuthTokenConfig } from "ushell-portfoliodescription";
import { PortfolioManager } from "../../portfolio-handling/PortfolioManager";
import { useNavigate } from "react-router-dom";

const PopupLoginButton: React.FC<{
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

  const oauthUrl: string | null = TokenService.buildOAuthUrl(
    tokenConfig,
    redirectUri,
    tokenSourceUid
  );
  console.log("oauthUrl", oauthUrl);

  if (!oauthUrl) {
    return <div>nope</div>;
  }

  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) {
      navigate("/", { unstable_viewTransition: false });
    }
  }, [done]);

  function login() {
    const popup = window.open(oauthUrl!, "popup", "popup=true");
    const checkPopup = setInterval(() => {
      if (TokenService.isAuthenticated(tokenSourceUid)) {
        popup?.close();
        setDone(true);
      }
      if (!popup || !popup.closed) return;
    }, 1000);
  }

  return (
    <button onClick={() => login()}>
      Login with {tokenConfig.localLogonNameToLower}
    </button>
  );
};

export default PopupLoginButton;
