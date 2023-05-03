import { useState } from "react";
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

    const [isTokenValid, setIsTokenValid] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (tokenSourceUid && tokenSourceUid != "00000000-0000-0000-0000-000000000000") {
                
            var token = getPersistentState('token_' + tokenSourceUid.toLowerCase())
    
            if (!token) {
                setIsTokenValid(false);
                setError('Token ' + tokenSourceUid + ' is not available!');

                console.warn(error);

                return { isTokenValid, error };
            }
            
            let payload = tryGetJwtPayload(token);
            if (payload && payload.exp) {
                if (isExpired(payload.exp)) {
                    setIsTokenValid(false);
                    setError('Token ' + tokenSourceUid + ' is exired!');

                    console.warn(error);
    
                    return { isTokenValid, error };
                }
            }
        }

        setIsTokenValid(true);
    });

    return { isTokenValid, error };
}