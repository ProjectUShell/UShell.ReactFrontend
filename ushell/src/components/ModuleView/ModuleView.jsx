import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCommand,
  getUseCase,
  getWorkspace,
} from "../../portfolio-handling/PortfolioService";
import {
  EnterNewUsecase,
  getUseCaseStateByUseCaseId,
} from "../../portfolio-handling/UseCaseService";
import UseCaseStateContext from "../../portfolio-handling/UseCaseStateContext";
import ModuleViewSuspense from "./ModuleViewSuspense";

const ModuleView = ({ portfolio }) => {
  const params = useParams();
  const navigate = useNavigate();

  const { useCaseState, setUseCaseState } = useContext(UseCaseStateContext);

  const workspaceKey = params.workspaceKey;
  const useCaseId = params.useCaseKey;
  let useCaseKey = "";
  let useCaseInstanceState = null;
  if (!useCaseId) {
    const workspace = getWorkspace(portfolio, workspaceKey);
    const defaultStaticUseCaseKeys = workspace.defaultStaticUseCaseKeys;
    if (!defaultStaticUseCaseKeys || defaultStaticUseCaseKeys.length <= 0) {
      return <div>No UseCase</div>;
    }
    useCaseKey = defaultStaticUseCaseKeys[0];
  } else {
    useCaseInstanceState = getUseCaseStateByUseCaseId(
      portfolio,
      workspaceKey,
      useCaseId,
      useCaseState
    );
    useCaseKey = useCaseInstanceState.usecaseKey;
  }

  console.log("useCaseInstanceState", useCaseInstanceState);

  const useCase = getUseCase(portfolio, useCaseKey);
  if (!portfolio) {
    return <div>loading...</div>;
  }

  const startExecuteCommand = (commandKey, input) => {
    const commandDescription = getCommand(portfolio, commandKey);

    if (!commandDescription) {
      console.error(`No Command with key ${commandKey}`);
    }
    if (commandDescription.commandType == "activate-workspace") {
    } else if (commandDescription.commandType == "start-useCase") {
      EnterNewUsecase(
        portfolio,
        useCaseState,
        commandDescription.targetUseCaseKey,
        commandDescription.targetWorkspaceKey,
        input,
        navigate,
        true
      );
    }
  };

  return (
    <ModuleViewSuspense
      useCase={useCase}
      input={useCaseInstanceState?.input}
      startExecuteCommand={startExecuteCommand}
    ></ModuleViewSuspense>
  );
};

export default ModuleView;
