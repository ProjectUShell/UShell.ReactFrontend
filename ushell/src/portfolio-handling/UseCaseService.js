import { v4 as newGuid } from "uuid";

import { getUseCase, getUseCases, getWorkspace } from "./PortfolioService";
import {
  GetUseCaseStatesByWorkspaceKey,
  storeUsecaseStatesByWorkspaceKey,
} from "./StateSerivce";

export function EnterNewUsecase(
  portfolio,
  useCaseContext,
  useCaseKey,
  parentWorkspaceKey,
  input,
  navigate
) {
  let state = getStateOfWorkspace(
    portfolio,
    parentWorkspaceKey,
    useCaseContext
  );
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

  navigate(`../${parentWorkspaceKey}/${newUsecase.usecaseInstanceUid}`);

  //TODO: dann auch direkt hin-navigieren
}

function getStateOfWorkspace(portfolio, workspaceKey, useCaseContext) {
  let states = useCaseContext.statesPerWorkspace[workspaceKey];
  if (!states) {
    states = GetUseCaseStatesByWorkspaceKey(workspaceKey);

    const workspaceDescription = getWorkspace(portfolio, workspaceKey);

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
            input
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
  }
  return states;
}

function initializeUsecase(
  portfolio,
  useCaseKey,
  parentWorkspaceKey,
  fixed,
  input
) {
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

export function terminateUseCase(
  portfolio,
  useCaseState,
  useCaseContext,
  navigate
) {
  console.log("terminate UseCase", useCaseState);

  const workspaceKey = useCaseState.parentWorkspaceKey;
  let states = useCaseContext.statesPerWorkspace[workspaceKey];
  console.log("old states", states);
  const i = states.indexOf(useCaseState);
  if (i < 0) {
    console.error(`Invalid States`);
  }
  states = states.splice(i, 1);

  navigate(`../${workspaceKey}`);
  console.log("new states", states);
}
