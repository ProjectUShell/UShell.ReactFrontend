import React, { Suspense, useContext } from "react";
import ModuleLoader from "../../federation/ModuleLoader";
import { ComponentResolverContext } from "../../services/componentService";

const ModuleViewSuspense = ({ useCase, input, startExecuteCommand }) => {
  const componentRegister = useContext(ComponentResolverContext);
  const inputData = {
    input: input,
    executeCommand: startExecuteCommand,
  };
  if (!useCase.url) {
    const UseCaseComponent = componentRegister.resolve(
      useCase.component,
      inputData
    );
    console.log("UseCaseComponent", UseCaseComponent);
    return <div>{UseCaseComponent}</div>;
  }
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
