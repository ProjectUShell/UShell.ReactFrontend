import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PortfolioLoader } from "../portfolio-handling/PortfolioLoader";

import { 
    setToken,
    deleteToken,
    isExpired,
    tryGetJwtPayload
} from "../services/TokenService";

import {
    getPersistentState
} from "../portfolio-handling/StateSerivce";

export default function useAuthToken(tokenSourceUid) {

    var isTokenValid = false;
    var error = "";

    if (tokenSourceUid && tokenSourceUid != "00000000-0000-0000-0000-000000000000") {
                
        var token = getPersistentState('token_' + tokenSourceUid.toLowerCase())

        if (!token) {
            isTokenValid = false;
            error = 'Token ' + tokenSourceUid + ' is not available!';

            console.warn(error);

            return isTokenValid;
        }

        let payload = tryGetJwtPayload(token);
        if (payload && payload.exp) {
            if (isExpired(payload.exp)) {
                isTokenValid = false;
                error = 'Token ' + tokenSourceUid + ' is exired!';

                console.warn(error);

                return isTokenValid;
            }
        }
    }

    isTokenValid = true;

    return isTokenValid;

    // useEffect(() => {
    //     if (tokenSourceUid && tokenSourceUid != "00000000-0000-0000-0000-000000000000") {
                
    //         var token = getPersistentState('token_' + tokenSourceUid.toLowerCase())
    
    //         if (!token) {
    //             setIsTokenValid(false);
    //             setError('Token ' + tokenSourceUid + ' is not available!');

    //             console.warn('Token ' + tokenSourceUid + ' is not available!');
    //         }
    //         else {
    //             let payload = tryGetJwtPayload(token);
    //             if (payload && payload.exp) {
    //                 if (isExpired(payload.exp)) {
    //                     setIsTokenValid(false);
    //                     setError('Token ' + tokenSourceUid + ' is exired!');

    //                     console.warn(error);
    //                 }
    //             }
    //         }
    //     }

    //     setIsTokenValid(true);
    //     setError("Success");
    // });
}