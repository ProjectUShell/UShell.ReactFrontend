import { AuthTokenConfig } from "ushell-portfoliodescription";
import { PortfolioManager } from "../portfolio-handling/PortfolioManager";
import { AuthTokenInfo, AuthTokenInfo2 } from "./AuthTokenInfo";

export class TokenResolveResult {
  public noParams: boolean = true;
  public success: boolean = false;
  public wasPopup: boolean = false;
}

export class TokenService {
  static performPopupOAuthLogin(
    tokenSourceUid: string,
    redirectUri: string,
    onClose: () => void,
    portfolio: string | null
  ): void {
    if (!PortfolioManager.GetPortfolio().authTokenConfigs) {
      return;
    }

    const tokenConfig: AuthTokenConfig | null =
      PortfolioManager.tryGetAuthTokenConfig(tokenSourceUid);
    if (!tokenConfig) {
      return;
    }

    const oauthUrl: string | null = TokenService.buildOAuthUrl(
      tokenConfig,
      redirectUri,
      tokenSourceUid,
      portfolio,
      true
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
    clearInterval(checkPopup);
  }

  static buildOAuthUrl(
    tokenConfig: AuthTokenConfig,
    redirectUri: string,
    tokenSourceUid: string,
    portfolio: string | null,
    popup: boolean
  ): string | null {
    if (!tokenConfig.authEndpointUrl) {
      return null;
    }
    const params: any = this.buildParams(
      tokenConfig,
      redirectUri,
      tokenSourceUid,
      portfolio,
      popup
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
    const result = localStorage.getItem(
      TokenService.generateLocalStorageKey(tokenSourceUid)
    );
    console.log("getToken", result);
    return result;
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
      var decodedState: string = "{}";
      try {
        decodedState = atob(result.stateFromUrlQuery);
      } catch (error) {}
      console.log(
        "Reiceived State via Url (seems to come from OAuth redirect): ",
        { decoded: decodedState, raw: result.stateFromUrlQuery }
      );
      try {
        receivedOAuthState = JSON.parse(result.stateFromUrlQuery);
      } catch {}
      if (!receivedOAuthState.tokenSourceUid) {
        receivedOAuthState = JSON.parse(decodedState);
      }
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

  public static getUiAuthenticatedInfo(): {
    primaryUiTokenSourceUid: string | null;
    isAuthenticated: Boolean;
  } {
    if (
      !PortfolioManager.GetPortfolio().authenticatedAccess
        ?.primaryUiTokenSources
    ) {
      return { primaryUiTokenSourceUid: null, isAuthenticated: true };
    }
    if (
      PortfolioManager.GetPortfolio().authenticatedAccess.primaryUiTokenSources
        .length == 0
    ) {
      return { primaryUiTokenSourceUid: null, isAuthenticated: true };
    }
    let result: {
      primaryUiTokenSourceUid: string | null;
      isAuthenticated: Boolean;
    } = {
      primaryUiTokenSourceUid:
        PortfolioManager.GetPortfolio().authenticatedAccess
          .primaryUiTokenSources[0],
      isAuthenticated: false,
    };
    PortfolioManager.GetPortfolio().authenticatedAccess.primaryUiTokenSources.forEach(
      (ts) => {
        if (TokenService.isAuthenticated(ts)) {
          result = { primaryUiTokenSourceUid: ts, isAuthenticated: true };
        }
      }
    );
    return result;
  }

  public static isUiAuthenticated(): boolean {
    if (
      !PortfolioManager.GetPortfolio().authenticatedAccess
        ?.primaryUiTokenSources
    ) {
      return true;
    }
    if (
      PortfolioManager.GetPortfolio().authenticatedAccess.primaryUiTokenSources
        .length == 0
    ) {
      return true;
    }
    let result: boolean = false;
    PortfolioManager.GetPortfolio().authenticatedAccess.primaryUiTokenSources.forEach(
      (ts) => {
        if (TokenService.isAuthenticated(ts)) {
          result = true;
        }
      }
    );
    return result;
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

  public static async resolveAuthTokenInfo(
    authTokenInfo: AuthTokenInfo,
    searchParams: URLSearchParams,
    setSearchParams: (sp: URLSearchParams) => void
  ): Promise<TokenResolveResult> {
    const result: TokenResolveResult = new TokenResolveResult();

    if (authTokenInfo.codeFromUrlQuery || authTokenInfo.tokenFromUrlQuery) {
      result.noParams = false;

      console.log(
        "Code: ",
        authTokenInfo.codeFromUrlQuery,
        " State: ",
        authTokenInfo.stateFromUrlQuery,
        " Token: ",
        authTokenInfo.tokenFromUrlQuery
      );

      var token = authTokenInfo.tokenFromUrlQuery;

      let tokenSourceUid: string =
        authTokenInfo.stateFromUrlQuery.tokenSourceUid;
      if (!token) {
        token = await this.getTokenFromCode(
          authTokenInfo.codeFromUrlQuery,
          tokenSourceUid
        );
      }
      result.wasPopup = authTokenInfo.stateFromUrlQuery.popup;
      if (token) {
        result.success = true;
        console.log(
          "importing token '" + token + "' for source " + tokenSourceUid
        );
        TokenService.setToken(tokenSourceUid, token);
      } else {
        result.success = false;
        console.error("could not get token from OAuth response", {
          tokenInfo: authTokenInfo,
          searchParams: searchParams,
        });
      }

      searchParams.delete("state");
      searchParams.delete("code");
      searchParams.delete("token");

      setSearchParams(searchParams);
      return result;
    }

    result.noParams = true;
    return result;
  }
  static async getTokenFromCode(
    codeFromUrlQuery: string | null,
    tokenSourceUid: string
  ): Promise<string | null> {
    console.log("getting token from code 1", tokenSourceUid);
    if (!codeFromUrlQuery) {
      return null;
    }
    const tokenConfig: AuthTokenConfig | null =
      PortfolioManager.tryGetAuthTokenConfig(tokenSourceUid);
    if (!tokenConfig) {
      return null;
    }
    let retrieveUrl: string =
      tokenConfig.retrieveEndpointUrl + `?code=${codeFromUrlQuery}`;
    if (tokenConfig.additionalAuthArgs) {
      for (const [key, value] of Object.entries(
        tokenConfig.additionalAuthArgs!
      )) {
        retrieveUrl += `&${key}=${value}`;
      }
    }
    retrieveUrl += `&client_id=${tokenConfig.clientId}`;
    try {
      console.log("getting token from code 2", retrieveUrl);
      const response = await fetch(retrieveUrl, {
        method: "Get",
        credentials: "include",
        mode: "cors",
      });
      const tokenInfo: any = await response.json();
      return tokenInfo.access_token;
    } catch (error) {
      console.error(error);
    }

    return "token_todo";
  }

  static performEmbeddedOauthLogin(
    tokenConfig: AuthTokenConfig,
    redirectUri: string,
    tokenSourceUid: string,
    portfolio: string | null
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
      tokenSourceUid,
      portfolio,
      false
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
    tokenSourceUid: string,
    portfolio: string | null,
    popup: boolean = false
  ) {
    let scope: string = "";
    if (tokenConfig.claims) {
      for (const [key, value] of Object.entries(tokenConfig.claims)) {
        scope += `${key}:${value}`;
      }
    }

    var params: any = {
      client_id: tokenConfig.clientId,
      redirect_uri: redirectUri,
      scope: scope,
      response_type: "token",
      state: btoa(
        JSON.stringify({
          tokenSourceUid: tokenSourceUid,
          portfolio: portfolio,
          popup: popup,
        })
      ),
    };

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
