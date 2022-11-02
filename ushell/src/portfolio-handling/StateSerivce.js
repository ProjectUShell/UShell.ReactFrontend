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
