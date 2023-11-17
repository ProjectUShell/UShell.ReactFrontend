import { useState } from "react";

import { TokenService } from "./TokenService";

export function useAuthToken(tokenSourceUid: string) {
    var isTokenValid = false;
    var error = "";

    if (tokenSourceUid && tokenSourceUid != "00000000-0000-0000-0000-000000000000") {
                
        var token = TokenService.getToken(tokenSourceUid)

        if (!token) {
            isTokenValid = false;
            error = 'Token ' + tokenSourceUid + ' is not available!';

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