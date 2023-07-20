import { RouteModel } from "./MenuModel";
import {
  CommandDescription,
  ModuleDescription,
  PortfolioModel,
  UsecaseDescription,
} from "./PortfolioModel";

export function getCommands(portfolio) {
  let result = [];
  portfolio.moduleDescriptions.forEach((md) => {
    md.commands.forEach((command) => {
      if (
        result.find((c) => c.uniqueCommandKey == command.uniqueCommandKey) ==
        undefined
      ) {
        result.push(command);
      }
    });
  });
  return result;
}

export function getUseCases(portfolio) {
  let result = [];
  portfolio.moduleDescriptions.forEach((md) => {
    md.useCases.forEach((useCase) => {
      if (result.find((c) => c.useCaseKey == useCase.useCaseKey) == undefined) {
        result.push(useCase);
      }
    });
  });
  return result;
}

export function getUseCase(portfolio, useCaseKey) {
  if (!portfolio) {
    return null;
  }
  return getUseCases(portfolio).find((uc) => uc.useCaseKey == useCaseKey);
}

export function getUseCasesByKeys(portfolio, useCaseKeys) {
  let result = [];
  useCaseKeys.forEach((useCaseKey) => {
    portfolio.moduleDescriptions.forEach((md) => {
      const foundUseCase = md.useCases.find((c) => c.useCaseKey == useCaseKey);
      if (foundUseCase && foundUseCase.useCaseKey == useCaseKey) {
        result.push(foundUseCase);
      }
    });
  });
  return result;
}

export function getWorkspaces(portfolio) {
  if (!portfolio.moduleDescriptions) {
    return [];
  }
  let result = [];
  portfolio.moduleDescriptions.forEach((md) => {
    md.workspaces.forEach((workspace) => {
      if (
        result.find((ws) => ws.workspaceKey == workspace.workspaceKey) ==
        undefined
      ) {
        result.push(workspace);
      }
    });
  });
  return result;
}

export function getRoutes(portfolio) {
  let result = [];
  const commands = getCommands(portfolio);
  const useCases = getUseCases(portfolio);
  commands.forEach((command) => {
    const useCase = useCases.find(
      (uc) => uc.useCaseKey == command.targetUsecaseKey
    );
    if (useCase == undefined) {
      const workspaces = getWorkspaces(portfolio);
      const workspace = workspaces.find(
        (ws) => ws.workspaceKey == command.targetWorkspaceKey
      );
      if (workspace == undefined) {
        throw `No workspace with key ${command.targetWorkspaceKey} `;
      }
      if (workspace.defaultStaticUseCaseKeys.length == 0) {
        throw `No default use case in workspace ${workspace.workspaceTitle} `;
      }
      const useCaseKey = workspace.defaultStaticUseCaseKeys[0];
      useCase = useCases.find((uc) => uc.useCaseKey == useCaseKey);
      if (useCase == undefined) {
        throw `No useCase with key ${useCaseKey} `;
      }
    }
    result.push({
      path: command.targetWorkspaceKey + "/" + command.targetUsecaseKey,
      key: command.uniqueCommandKey,
      component: useCase.component,
      module: useCase.module,
      url: useCase.url,
    });
  });
  return result;
}

export function getWorkspace(portfolio, workspaceKey) {
  if (!portfolio) {
    return {};
  }
  const workspaces = getWorkspaces(portfolio);
  return workspaces.find((ws) => ws.workspaceKey == workspaceKey);
}

export function getCommand(portfolio, commandKey) {
  const commands = getCommands(portfolio);
  return commands.find((c) => c.uniqueCommandKey == commandKey);
}

export function getHomeUseCase(portfolio) {
  // const homeUseCaseKey = portfolio.homeUseCaseKey;
  return getUseCase(portfolio, "home");
}

export function getTitle(portfolio) {
  return portfolio.title;
}

export function getTokenSourcesForPrimaryUiTokenSourceUid(portfolio, primaryUiTokenSourceUid) {
  let result = [];

  console.log("Portfolio service: Current token source primary Uid -> ", primaryUiTokenSourceUid);

  portfolio.tokenSources.forEach((ts) => {
    console.log("Found token source: ", ts);

    var tokenSourceKeys = Object.keys(ts);
    var tokenSourceValues = Object.values(ts);

    console.log("Portfolio service: Token source keys -> ", tokenSourceKeys[0]);
    console.log("Portfolio service: Token source values -> ", tokenSourceValues[0]);

    if (tokenSourceKeys[0] == primaryUiTokenSourceUid && tokenSourceValues) {
      result.push(tokenSourceValues[0]);
    }
  });

  return result;
}
