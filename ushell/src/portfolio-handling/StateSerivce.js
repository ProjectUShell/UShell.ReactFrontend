export const applicationStateScopeDiscriminator = document.baseURI.substring(document.baseURI.indexOf("://")+3);

export function GetUseCaseStatesByWorkspaceKey(workspaceKey) {
  let rawStates = localStorage.getItem("|" + "Workspace(" + workspaceKey + ")");
  if (rawStates) {
    return JSON.parse(rawStates);
  } else {
    return [];
  }
}

export function storeUsecaseStatesByWorkspaceKey(workspaceKey, states) {
  let rawStates = JSON.stringify(states);
  localStorage.setItem("|" + "Workspace(" + workspaceKey + ")", rawStates);
}

export function setPersistentState(stateKey, value) {
  localStorage.setItem(applicationStateScopeDiscriminator + stateKey, value);
  return true;
}

export function getPersistentState(stateKey) {
  return localStorage.getItem(applicationStateScopeDiscriminator + stateKey);
}

export function deletePersistentState(stateKey) {
  localStorage.removeItem(applicationStateScopeDiscriminator + stateKey);
}
