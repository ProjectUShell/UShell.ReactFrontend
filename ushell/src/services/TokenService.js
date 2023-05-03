import {
    getPersistentState,
    setPersistentState,
    deletePersistentState
} from "../portfolio-handling/StateSerivce";

export function setToken(tokenSourceUid, token) {
    return setPersistentState('token_' + tokenSourceUid.toLowerCase(), token);
}

export function deleteToken(tokenSourceUid) {
    deletePersistentState('token_' + tokenSourceUid.toLowerCase());
}

export function isExpired(expirationTimestamp) {
    return (Math.floor((new Date).getTime() / 1000)) >= expirationTimestamp;
}
      
export function tryGetJwtPayload(token) {

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
