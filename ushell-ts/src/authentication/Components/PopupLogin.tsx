import React, { useEffect, useState } from "react";
import { TokenService } from "../TokenService";
import { AuthTokenConfig } from "ushell-portfoliodescription";
import { PortfolioManager } from "../../portfolio-handling/PortfolioManager";
import { useNavigate } from "react-router-dom";

const PopupLogin: React.FC<{
  tokenConfig: AuthTokenConfig;
  tokenSourceUid: string;
  redirectUri: string;
  portfolio: string | null;
}> = ({ tokenSourceUid, redirectUri, tokenConfig, portfolio }) => {
  const oauthUrl: string | null = TokenService.buildOAuthUrl(
    tokenConfig,
    redirectUri,
    tokenSourceUid,
    portfolio,
    true
  );

  if (!oauthUrl) {
    return <div>nope</div>;
  }

  const navigate = useNavigate();
  const [checkInterval, setCheckInterval] = useState<any>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setCheckInterval(
      setInterval(() => {
        if (TokenService.isAuthenticated(tokenSourceUid)) {
          setDone(true);
        }
      }, 1000)
    );
  }, []);

  useEffect(() => {
    if (done) {
      console.debug("clearing interval");
      clearInterval(checkInterval);
      if (portfolio) {
        navigate("/?portfolio=" + portfolio);
      } else {
        navigate("/");
      }
    }
  }, [done]);

  if (done) {
    return <div>redirecting...</div>;
  }
  const popup = window.open(
    oauthUrl!,
    "popup",
    "popup=true,height=320,scrollbars=1"
  );

  const desiredX: number = window.screenX;
  const desiredY: number = window.screenY;
  const desiredWidth: number = window.innerWidth - 20;
  const desiredHeight: number = window.innerHeight - 20;
  popup?.resizeTo(desiredWidth, desiredHeight);
  popup?.moveTo(desiredX + 20, desiredY + 20);

  return <div>Logging in...</div>;
};

export default PopupLogin;
