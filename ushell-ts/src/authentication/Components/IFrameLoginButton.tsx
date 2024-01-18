import React, { useEffect, useState } from "react";
import { TokenService } from "../TokenService";
import { AuthTokenConfig } from "ushell-portfoliodescription";
import { PortfolioManager } from "../../portfolio-handling/PortfolioManager";
import { useNavigate } from "react-router-dom";
import LoginButton from "./LoginButton";
import PopupLogin from "./PopupLogin";
import IFrameLogin from "./IFrameLogin";

const IFrameLoginButton: React.FC<{
  tokenConfig: AuthTokenConfig;
  tokenSourceUid: string;
  redirectUri: string;
  portfolio: string | null
}> = ({ tokenSourceUid, redirectUri, tokenConfig, portfolio }) => {
  const [showIFrame, setShowIFrame] = useState(false);

  return (
    <>
      {showIFrame && (
        <IFrameLogin
          tokenConfig={tokenConfig}
          redirectUri={redirectUri}
          tokenSourceUid={tokenSourceUid}
          onClose={() => setShowIFrame(false)}
          portfolio={portfolio}
        ></IFrameLogin>
      )}
      <LoginButton
        onClick={() => setShowIFrame(true)}        
        text={`Login with ${tokenConfig.localLogonNameToLower}`}
      ></LoginButton>
    </>
  );
};

export default IFrameLoginButton;
