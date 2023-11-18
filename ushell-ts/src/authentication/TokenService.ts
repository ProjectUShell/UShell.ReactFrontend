import { AuthTokenConfig } from "ushell-portfoliodescription";
import { PortfolioManager } from "../portfolio-handling/PortfolioManager";
import { AuthTokenInfo, AuthTokenInfo2 } from "./AuthTokenInfo";

export class TokenService {
  static performPopupOAuthLogin(
    tokenSourceUid: string,
    redirectUri: string,
    onClose: () => void
  ): void {
    if (!PortfolioManager.GetPortfolio().authTokenConfigs) {
      return;
    }

    const tokenConfig: AuthTokenConfig | null =
      PortfolioManager.tryGetAuthTokenConfig(
        PortfolioManager.GetPortfolio().primaryUiTokenSourceUid
      );
    if (!tokenConfig) {
      return;
    }

    const oauthUrl: string | null = TokenService.buildOAuthUrl(
      tokenConfig,
      redirectUri,
      tokenSourceUid
    );
    if (!oauthUrl) {
      return;
    }

    const popup = window.open(oauthUrl, "popup", "popup=true");
    const checkPopup = setInterval(() => {
      if (TokenService.isAuthenticated(tokenSourceUid)) {
        popup?.close();
        onClose();
      }
      if (!popup || !popup.closed) {
        return;
      }
    }, 1000);
    clearInterval(checkPopup)
  }

  static buildOAuthUrl(
    tokenConfig: AuthTokenConfig,
    redirectUri: string,
    tokenSourceUid: string
  ): string | null {
    if (!tokenConfig.authEndpointUrl) {
      return null;
    }
    const params: any = this.buildParams(
      tokenConfig,
      redirectUri,
      tokenSourceUid
    );
    let result: string = tokenConfig.authEndpointUrl + "?";
    for (const [key, value] of Object.entries(params)) {
      result += `${key}=${value}&`;
    }
    // result = result.slice(result.length - 1, result.length);
    return result;
  }
  public static applicationStateScopeDiscriminator: string =
    document.baseURI.substring(document.baseURI.indexOf("://") + 3);

  public static setToken(tokenSourceUid: string, token: string): Boolean {
    localStorage.setItem(
      TokenService.generateLocalStorageKey(tokenSourceUid),
      token
    );
    return true;
  }

  public static getToken(tokenSourceUid: string): string | null {
    return localStorage.getItem(
      TokenService.generateLocalStorageKey(tokenSourceUid)
    );
  }

  public static deleteToken(tokenSourceUid: string): Boolean {
    localStorage.removeItem(
      TokenService.generateLocalStorageKey(tokenSourceUid)
    );
    return true;
  }

  public static isExpired(expirationTimestamp: number): Boolean {
    return Math.floor(new Date().getTime() / 1000) >= expirationTimestamp;
  }

  public static tryGetJwtPayload(token: string): any {
    try {
      if (token.indexOf(".") < 0) {
        return null;
      }

      let decodedJson = atob(token.split(".")[1]);
      if (!decodedJson || !decodedJson.startsWith("{")) {
        return null;
      }

      return JSON.parse(decodedJson);
    } catch {
      return null;
    }
  }

  public static tryGetAuthTokenInfo(
    location: Location,
    searchParams: URLSearchParams
  ): AuthTokenInfo {
    const codeFromUrlQuery: string | null = searchParams.get("code");
    const tokenFromUrlQuery: string | null = searchParams.get("token");
    const stateFromUrlQuery: string | null = searchParams.get("state");
    let result: AuthTokenInfo2 = null!;
    if (codeFromUrlQuery || tokenFromUrlQuery || stateFromUrlQuery) {
      result = {
        codeFromUrlQuery: codeFromUrlQuery,
        tokenFromUrlQuery: tokenFromUrlQuery,
        stateFromUrlQuery: stateFromUrlQuery,
      };
    } else {
      result = this.tryGetGoogleAuthTokenInfo(location);
    }

    var receivedOAuthState: any = {};
    if (result.stateFromUrlQuery) {
      //var b = Buffer.from(stateFromUrlQuery, 'base64')
      //var decodedState: string = b.toString();
      var decodedState: string = atob(result.stateFromUrlQuery);
      console.log(
        "Reiceived State via Url (seems to come from OAuth redirect): ",
        decodedState
      );
      receivedOAuthState = JSON.parse(decodedState);
    }
    return {
      codeFromUrlQuery: result.codeFromUrlQuery,
      tokenFromUrlQuery: result.tokenFromUrlQuery,
      stateFromUrlQuery: receivedOAuthState,
    };
  }

  public static tryGetGoogleAuthTokenInfo(location: Location): AuthTokenInfo2 {
    var fragmentString = location.hash.substring(1);

    // Parse query string to see if page request is coming from OAuth 2.0 server.
    var params: any = {};
    var regex = /([^&=]+)=([^&]*)/g,
      m;
    while ((m = regex.exec(fragmentString))) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    if (Object.keys(params).length > 0) {
      localStorage.setItem("oauth2-test-params", JSON.stringify(params));
      if (params["state"] && params["state"] == "try_sample_request") {
        // trySampleRequest();
      }
    }
    return {
      codeFromUrlQuery: null,
      stateFromUrlQuery: params["state"],
      tokenFromUrlQuery: params["access_token"],
    };
  }

  public static isAuthenticated(tokenSourceUid: string): boolean {
    var isTokenValid = false;
    var error = "";

    if (
      tokenSourceUid &&
      tokenSourceUid != "00000000-0000-0000-0000-000000000000"
    ) {
      var token = TokenService.getToken(tokenSourceUid);

      if (!token) {
        isTokenValid = false;
        error = "Token " + tokenSourceUid + " is not available!";

        console.warn(error);

        return isTokenValid;
      }
      /*
        let payload = TokenService.tryGetJwtPayload(token);
        if (payload && payload.exp) {
            if (TokenService.isExpired(payload.exp)) {
                isTokenValid = false;
                error = 'Token ' + tokenSourceUid + ' is exired!';

                console.warn(error);

                return isTokenValid;
            }
        }*/
    }

    isTokenValid = true;

    return isTokenValid;
  }

  private static generateLocalStorageKey(tokenSourceUid: string): string {
    return (
      TokenService.applicationStateScopeDiscriminator +
      "token_" +
      tokenSourceUid.toLowerCase()
    );
  }

  public static resolveAuthTokenInfo(
    authTokenInfo: AuthTokenInfo,
    searchParams: URLSearchParams,
    setSearchParams: (sp: URLSearchParams) => void
  ) {
    const primaryUiTokenSourceUid =
      PortfolioManager.GetPortfolio().primaryUiTokenSourceUid;

    if (authTokenInfo.codeFromUrlQuery || authTokenInfo.tokenFromUrlQuery) {
      console.log(
        "Code: ",
        authTokenInfo.codeFromUrlQuery,
        " State: ",
        authTokenInfo.stateFromUrlQuery,
        " Token: ",
        authTokenInfo.tokenFromUrlQuery
      );

      var token = authTokenInfo.tokenFromUrlQuery;
      if (authTokenInfo.codeFromUrlQuery) {
        //TODO: ausprogrammieren
        token = "abgeholterToken";
      }
      if (authTokenInfo.stateFromUrlQuery.tokenSourceUid && token) {
        console.log(
          "importing token '" +
            token +
            "' for source " +
            authTokenInfo.stateFromUrlQuery.tokenSourceUid
        );
        TokenService.setToken(
          authTokenInfo.stateFromUrlQuery.tokenSourceUid,
          token
        );
      }

      searchParams.delete("state");
      searchParams.delete("code");
      searchParams.delete("token");

      setSearchParams(searchParams);
    }
  }

  static performEmbeddedOauthLogin(
    tokenConfig: AuthTokenConfig,
    redirectUri: string,
    tokenSourceUid: string
  ) {
    var oauth2Endpoint = tokenConfig.authEndpointUrl;

    // Create element to open OAuth 2.0 endpoint in new window.
    var form = document.createElement("form");
    form.setAttribute("method", "GET"); // Send as a GET request.
    form.setAttribute("action", oauth2Endpoint!);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params: any = TokenService.buildParams(
      tokenConfig,
      redirectUri,
      tokenSourceUid
    );

    // Add form parameters as hidden input values.
    for (var p in params) {
      var input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", p);
      input.setAttribute("value", params[p]);
      form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  }

  private static buildParams(
    tokenConfig: AuthTokenConfig,
    redirectUri: string,
    tokenSourceUid: string
  ) {
    let scope: string = "";
    if (tokenConfig.claims) {
      for (const [key, value] of Object.entries(tokenConfig.claims)) {
        scope += value;
      }
    }

    var params: any = {
      client_id: tokenConfig.clientId,
      redirect_uri: redirectUri,
      //   scope: "https://www.googleapis.com/auth/drive.metadata.readonly",
      scope: scope,
      response_type: "token",
      state: btoa(JSON.stringify({ tokenSourceUid: tokenSourceUid })),
    };
    if (!tokenConfig.clientId) {
      params = {
        redirect_uri: redirectUri,
        //   scope: "https://www.googleapis.com/auth/drive.metadata.readonly",
        state: btoa(JSON.stringify({ tokenSourceUid: tokenSourceUid })),
      };
    }
    if (tokenConfig.additionalAuthArgs) {
      for (const [key, value] of Object.entries(
        tokenConfig.additionalAuthArgs
      )) {
        params[key] = value;
      }
    }
    return params;
  }
}
