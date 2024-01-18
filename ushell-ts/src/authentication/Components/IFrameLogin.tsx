import React, { useEffect, useState } from "react";
import { PortfolioManager } from "../../portfolio-handling/PortfolioManager";
import { AuthTokenConfig } from "ushell-portfoliodescription";
import { TokenService } from "../TokenService";
import { useNavigate } from "react-router-dom";

const IFrameLogin: React.FC<{
  tokenConfig: AuthTokenConfig;
  tokenSourceUid: string;
  redirectUri: string;
  onClose: () => void;
  portfolio: string | null;
}> = ({ tokenSourceUid, redirectUri, tokenConfig, onClose, portfolio }) => {
  const oauthUrl: string | null = TokenService.buildOAuthUrl(
    tokenConfig,
    redirectUri,
    tokenSourceUid,
    portfolio,
    false
  );
  console.log("oauthUrl", oauthUrl);

  if (!oauthUrl) {
    return <div>nope</div>;
  }

  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) {
      if (portfolio) {
        navigate("/?portfolio=" + portfolio);
      } else {
        navigate("/");
      }
    }
  }, [done]);

  const checkPopup = setInterval(() => {
    if (TokenService.isAuthenticated(tokenSourceUid)) {
      setDone(true);
    }
  }, 1000);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2">
      <div className="bg-backgroundthree dark:bg-backgroundthreedark p-4 rounded-md ">
        <iframe
          className="w-full h-[calc(100vh-12rem)]"
          src={oauthUrl}
        ></iframe>
        <div className="flex justify-end">
          <button
            className=" mt-2 rounded-md p-1 bg-backgroundtwo dark:bg-backgroundtwodark hover:bg-backgroundone hover:dark:bg-backgroundonedark"
            onClick={() => onClose()}
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
};

export default IFrameLogin;
