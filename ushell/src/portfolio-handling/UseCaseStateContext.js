import React from "react";
const UseCaseStateContext = React.createContext({
  useCaseState: { statesPerWorkspace: {} },
  setUseCaseState: () => {},
});
export const UseCaseStateContextProvider = UseCaseStateContext.Provider;
export default UseCaseStateContext;
