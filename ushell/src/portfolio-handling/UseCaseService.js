import { v4 as newGuid } from "uuid";
import { rootUrlPath } from "../constants";

import { getUseCase, getUseCases, getWorkspace } from "./PortfolioService";
import {
  GetUseCaseStatesByWorkspaceKey,
  storeUsecaseStatesByWorkspaceKey,
} from "./StateSerivce";
import { UseCaseStateContextProvider } from "./UseCaseStateContext";

export function EnterNewUsecase(
  portfolio,
  useCaseContext,
  useCaseKey,
  parentWorkspaceKey,
  input,
  navigate,
  headless
) {
  console.log("portfolio", portfolio);
  console.log("useCaseContext", useCaseContext);
  let state = getStateOfWorkspace(
    portfolio,
    parentWorkspaceKey,
    useCaseContext
  );
  const existingUseCase = state.find(
    (ucs) => ucs.usecaseKey == useCaseKey && ucs.input == input
  );
  if (existingUseCase) {
    if (headless) {
      navigate(
        `../${rootUrlPath}${parentWorkspaceKey}/${existingUseCase.usecaseInstanceUid}?headless`
      );
    } else {
      navigate(
        `../${rootUrlPath}${parentWorkspaceKey}/${existingUseCase.usecaseInstanceUid}`
      );
    }
    return;
  }

  let newUsecase = initializeUsecase(
    portfolio,
    useCaseKey,
    parentWorkspaceKey,
    false,
    input
  );
  state.push(newUsecase);
  useCaseContext.statesPerWorkspace[parentWorkspaceKey] = state;

  // let sub = useCaseContext.stateSubjectsPerWorkspace[parentWorkspaceKey];
  // if (sub) {
  //   // sub.next(state);
  //   sub = state;
  // }

  storeUsecaseStatesByWorkspaceKey(parentWorkspaceKey, state);

  if (headless) {
    navigate(
      `../${rootUrlPath}${parentWorkspaceKey}/${newUsecase.usecaseInstanceUid}?headless`
    );
  } else {
    navigate(
      `../${rootUrlPath}${parentWorkspaceKey}/${newUsecase.usecaseInstanceUid}`
    );
  }

  //TODO: dann auch direkt hin-navigieren
}

function getStateOfWorkspace(portfolio, workspaceKey, useCaseContext) {
  let states = useCaseContext.statesPerWorkspace[workspaceKey];
  if (states) {
    return states;
  }

  states = GetUseCaseStatesByWorkspaceKey(workspaceKey);

  const workspaceDescription = getWorkspace(portfolio, workspaceKey);

  if (!workspaceDescription) {
    return [];
  }

  let idx = 0;
  let newFixesUsecasesToStart = [];
  for (var defaultStaticUseCaseKey of workspaceDescription.defaultStaticUseCaseKeys) {
    if (
      idx > states.length - 1 ||
      !states[idx].fixed ||
      states[idx].usecaseKey != defaultStaticUseCaseKey
    ) {
      newFixesUsecasesToStart.push(
        initializeUsecase(
          portfolio,
          defaultStaticUseCaseKey,
          workspaceKey,
          true,
          null
        )
      );
    }
    idx++;
  }
  if (newFixesUsecasesToStart.length > 0) {
    states = newFixesUsecasesToStart.concat(states.filter((u) => !u.fixed));
    storeUsecaseStatesByWorkspaceKey(workspaceKey, states);
  }

  useCaseContext.statesPerWorkspace[workspaceKey] = states;

  return states;
}

function initializeUsecase(
  portfolio,
  useCaseKey,
  parentWorkspaceKey,
  fixed,
  input
) {
  console.log("useCaseKey", useCaseKey);
  let desc = getUseCase(portfolio, useCaseKey);

  let newState = {
    usecaseInstanceUid: newGuid(),
    usecaseKey: useCaseKey,
    title: desc.title,
    fixed: fixed,
    parentWorkspaceKey: parentWorkspaceKey,
    input: input,
  };
  return newState;
}

export function currentUsecasesOfWorkspace(
  portfolio,
  workspaceKey,
  useCaseContext
) {
  let state = getStateOfWorkspace(portfolio, workspaceKey, useCaseContext);
  return state;
}

export function getUseCaseStateByUseCaseId(
  portfolio,
  workspaceKey,
  useCaseId,
  useCaseContext
) {
  const states = getStateOfWorkspace(portfolio, workspaceKey, useCaseContext);

  let result = null;
  states.forEach((useCaseState) => {
    if (useCaseState.usecaseInstanceUid == useCaseId) {
      result = useCaseState;
    }
  });
  return result;
}

export function terminateUseCase(
  portfolio,
  useCaseState,
  useCaseContext,
  navigate
) {
  console.log("terminate UseCase", useCaseState);

  const workspaceKey = useCaseState.parentWorkspaceKey;
  let states = useCaseContext.statesPerWorkspace[workspaceKey];

  const i = states.indexOf(useCaseState);
  if (i < 0) {
    console.error(`Invalid States`);
  }
  states = states.splice(i, 1);

  storeUsecaseStatesByWorkspaceKey(workspaceKey, states);

  navigate(`../${rootUrlPath}${workspaceKey}`);
}
