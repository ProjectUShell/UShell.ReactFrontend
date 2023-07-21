export class TokenService {

    public static applicationStateScopeDiscriminator: string = document.baseURI.substring(document.baseURI.indexOf("://")+3);

    public static setToken(tokenSourceUid: string, token: string): Boolean {

        localStorage.setItem(TokenService.generateLocalStorageKey(tokenSourceUid), token);
        return true;

    }

    public static getToken(tokenSourceUid: string): string | null {

        return localStorage.getItem(TokenService.generateLocalStorageKey(tokenSourceUid));

    }

    public static deleteToken(tokenSourceUid: string): Boolean {

        localStorage.removeItem(TokenService.generateLocalStorageKey(tokenSourceUid));
        return true;

    }

    public static isExpired(expirationTimestamp: number): Boolean {

        return (Math.floor((new Date).getTime() / 1000)) >= expirationTimestamp;

    }

    public static tryGetJwtPayload(token: string): any {

        try {
            if (token.indexOf('.') < 0) {
              return null;
            }
            
            let decodedJson = atob(token.split('.')[1]);
            if (!decodedJson || !decodedJson.startsWith('{')) {
              return null;
            }
            
            return JSON.parse(decodedJson);
        }
        catch {
            return null;
        }

    }

    private static generateLocalStorageKey(tokenSourceUid: string): string {

        return TokenService.applicationStateScopeDiscriminator + 'token_' + tokenSourceUid.toLowerCase();

    }
}
