import { useNavigate } from "react-router-dom";

import {
    deleteToken
} from "../services/TokenService";

export default function useSignOff(primaryUiTokenSourceUid) {

    const navigate = useNavigate();

    if (primaryUiTokenSourceUid && primaryUiTokenSourceUid != "00000000-0000-0000-0000-000000000000") {
        console.info("LOGGING OUT!");
        deleteToken(primaryUiTokenSourceUid);
    }
  
    navigate(`/login`, {tokenSourceUid: primaryUiTokenSourceUid});
}
