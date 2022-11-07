import React, { Suspense, useContext } from "react";
import ModuleLoader from "../../federation/ModuleLoader";

const ModuleViewSuspense = ({useCase, input, startExecuteCommand}) => {
  return (
    <Suspense fallback={"Loading . . . "}>
      <ModuleLoader
        url={useCase.url}
        scope={useCase.module}
        module={useCase.component}
        inputData={{
          input: input,
          executeCommand: startExecuteCommand,
        }}
      />
    </Suspense>
  );
};

export default ModuleViewSuspense;
