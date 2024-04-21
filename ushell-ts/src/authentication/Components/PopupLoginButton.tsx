import React, { useEffect, useState } from "react";
import { TokenService } from "../TokenService";
import { AuthTokenConfig } from "ushell-portfoliodescription";
import { PortfolioManager } from "../../portfolio-handling/PortfolioManager";
import { useNavigate } from "react-router-dom";
import LoginButton from "./LoginButton";
import PopupLogin from "./PopupLogin";

const PopupLoginButton: React.FC<{
  tokenConfig: AuthTokenConfig;
  tokenSourceUid: string;
  redirectUri: string;
  portfolio: string | null
}> = ({ tokenSourceUid, redirectUri, tokenConfig, portfolio }) => {
  const [showPopup, setShowPopup] = useState(false);

  if (showPopup) {
    return (
      <PopupLogin
        tokenConfig={tokenConfig}
        redirectUri={redirectUri}
        tokenSourceUid={tokenSourceUid}
        portfolio={portfolio}
      ></PopupLogin>
    );
  }

  return (
    <LoginButton
      onClick={() => setShowPopup(true)}
      text={`Login with ${tokenConfig.localLogonNameInputLabel}`}
    ></LoginButton>
  );
};

export default PopupLoginButton;
