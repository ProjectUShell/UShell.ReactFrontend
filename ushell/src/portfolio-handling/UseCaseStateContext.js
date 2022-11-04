import React from "react";
const UseCaseStateContext = React.createContext({
  useCaseState: { statesPerWorkspace: {}, stateSubjectsPerWorkspace: {} },
  setUseCaseState: () => {},
});
export const UseCaseStateContextProvider = UseCaseStateContext.Provider;
export default UseCaseStateContext;
