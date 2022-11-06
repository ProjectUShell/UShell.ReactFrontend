import React, { Suspense, useEffect, useState } from "react";

import {
  getCommand,
  getCommands,
  getUseCase,
  getUseCases,
  getUseCasesByKeys,
  getWorkspaces,
} from "./PortfolioService";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  DownOutlined,
  PlayCircleOutlined,
  GoogleOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  UserOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ModuleLoader from "../federation/ModuleLoader";
import {
  currentUsecasesOfWorkspace,
  EnterNewUsecase,
  terminateUseCase,
} from "./UseCaseService";
import { GetUseCaseStatesByWorkspaceKey } from "./StateSerivce";
import { Button } from "antd";

function getAntdMenuItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export function getMenuItems(portfolio) {
  const commands = getCommands(portfolio);
  let result = [];

  let menuStructureByMenuKey = {};

  commands.forEach((command) => {
    let menuKey = command.menuOwnerUseCaseKey;
    if (!menuKey) {
      menuKey = "_Main";
    }
    let structure = menuStructureByMenuKey[menuKey];
    if (!structure) {
      structure = [];
    }
    pushIntoMenuStructure(command, structure);
    menuStructureByMenuKey[menuKey] = structure;
  });
  return menuStructureByMenuKey;
}

function pushIntoMenuStructure(command, structure) {
  let item = {};
  if (!command.menuFolder) {
    if (command.menuOwnerUseCaseKey) {
      item = peekOrCreateItem(
        command.label,
        structure,
        command.locateAfterCommand,
        command.locationPriority
      );
    } else {
      item = peekOrCreateItem(
        ".../" + command.label,
        structure,
        command.locateAfterCommand,
        command.locationPriority
      );
    }
  } else {
    item = peekOrCreateItem(
      command.menuFolder + "/" + command.label,
      structure,
      command.locateAfterCommand,
      command.locationPriority
    );
  }

  item.id = command.uniqueCommandKey;
  //item.label = command.label;
  item.icon = command.iconKey;
  item.tooltip = command.description;
  item.state.assignedCommand = command;

  //item.styleClass

  if (command.commandType == "activate-workspace") {
    item.command = (navigate) => {
      navigate(`../${command.targetWorkspaceKey}`);
    };
  } else if (command.commandType == "start-useCase") {
    item.command = (useCaseContext, input) => {
      EnterNewUsecase(
        useCaseContext,
        command.targetUsecaseKey,
        command.targetWorkspaceKey,
        input
      );
    };
  } else if (command.commandType == "usecase-action") {
    console.warn("usecase-action");
    //.actionName
    //.triggerableFrom
  } else if (command.commandType == "backend-action") {
    console.warn("backend-action");
    //.actionName
    //.wait
  } else if (command.commandType == "set-runtime-tag") {
    if (command.tagsToSet) {
      item.command = (event) => {
        console.warn(`set tags ${command.tagsToSet}`);
        // this._StateService.modifyTags(command.tagsToSet);
      };
    }
  } else if (command.commandType == "navigate") {
    //item.routerLink = command.routerLink;
    item.command = (event) => {
      console.warn(`navigate ${command.routerLink}`);
      // this._Router.navigate(command.routerLink);
    };
  } else {
  }

  if (command.WarningToConfirm) {
    const originalCommand = item.command;
    item.command = (event) => {
      const commandHandleInLambda = originalCommand;

      /* this.executeConfirmDialog(command.WarningToConfirm).subscribe((c)=>{
          if(c){
              originalCommand(event);
          }
        });*/

      //TODO: muss mich gescheitem dialog gemacht werden!
      alert(command.WarningToConfirm);

      commandHandleInLambda(event);
      /*
          this._ConfirmationService.confirm({
              key: 'confirmCommandExecution',
              target: event.target,
              message: command.WarningToConfirm,
              icon: 'pi pi-exclamation-triangle',
              acceptLabel: "OK",
              rejectLabel: "Cancel",
              accept: () => {
                  commandHandleInLambda(event);
              },
              reject: () => {
              }
          });
*/
    };
  }

  function peekOrCreateItem(path, itemsOfCurrentLevel, locateAfter, priority) {
    const nextsplitterIndex = path.indexOf("/");

    let currentTitleToPeek = path;
    if (nextsplitterIndex >= 0) {
      currentTitleToPeek = path.substring(0, nextsplitterIndex);
    }
    if (!currentTitleToPeek) {
      currentTitleToPeek = "...";
    }

    let foundItemForCurrentLevel = null;
    for (let itemOfCurrentLevel of itemsOfCurrentLevel) {
      if (itemOfCurrentLevel.label == currentTitleToPeek) {
        foundItemForCurrentLevel = itemOfCurrentLevel;
        break;
      }
    }

    if (!foundItemForCurrentLevel) {
      foundItemForCurrentLevel = {
        label: currentTitleToPeek,
        state: {
          priority: 100,
        },
      };
      if (nextsplitterIndex < 0) {
        foundItemForCurrentLevel.state = {
          locateAfter: locateAfter,
          priority: priority,
        };
      }

      //console.warn("INITIALLYCREATE MENUTIEM: " + currentTitleToPeek);

      itemsOfCurrentLevel.push(foundItemForCurrentLevel);
    }

    //TODO: also use the    locateAfter
    itemsOfCurrentLevel.sort((a, b) => a.state.priority - b.state.priority);

    if (nextsplitterIndex >= 0) {
      if (!foundItemForCurrentLevel.items) {
        foundItemForCurrentLevel.items = [];
      }
      return peekOrCreateItem(
        path.substring(nextsplitterIndex + 1),
        foundItemForCurrentLevel.items,
        locateAfter,
        priority
      );
    } else {
      return foundItemForCurrentLevel;
    }
  }
}

export function convertToAntdItems(menuItems, addExpandIcon) {
  if (!menuItems) {
    return [];
  }
  let result = [];

  menuItems.forEach((mi) => {
    result.push({
      label:
        addExpandIcon && mi.items?.length > 0 ? (
          <span>
            {mi.label} <DownOutlined className="subMenuExpandIcon" />
          </span>
        ) : (
          mi.label
        ),
      key: mi.id ? mi.id : mi.label,
      icon: <MailOutlined />,
      children: mi.items?.length > 0 ? convertToAntdItems(mi.items) : undefined,
      onSelect: () => console.log("selected"),
    });
  });

  return result;
}

export function getMenuItem(menuItems, id) {
  if (!menuItems) {
    return null;
  }
  console.log("getMenuItem menuItems", menuItems);
  console.log("getMenuItem id", id);
  if (!menuItems || !id) return null;
  for (let mi of menuItems) {
    if ((mi.id ? mi.id : mi.key) == id) {
      return mi;
    }
    const r = getMenuItem((mi.items ? mi.items : mi.children), id);
    if (r) {
      return r;
    }
  }
  return null;
}

export function getAntdTabItems(
  portfolio,
  workspace,
  useCaseContext,
  navigate
) {
  if (!portfolio || !workspace) {
    return [];
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
        useCaseContext,
        commandDescription.targetUseCaseKey,
        commandDescription.targetWorkspaceKey,
        input,
        navigate
      );
    }
  };

  const closeTab = (useCaseState) => {
    terminateUseCase(portfolio, useCaseState, useCaseContext, navigate);
  };

  const dynamicUseCases = currentUsecasesOfWorkspace(
    portfolio,
    workspace.workspaceKey,
    useCaseContext
  );

  let result = [];

  dynamicUseCases.forEach((useCaseState) => {
    const useCaseInput = useCaseState.input ? useCaseState.input : "";
    const uc = getUseCase(portfolio, useCaseState.usecaseKey);
    result.push({
      // label: `${uc.title} ${useCaseInput} ${<div>Hi</div>}`,
      label: useCaseState.fixed ? (
        <div>
          {uc.title} {useCaseInput}
        </div>
      ) : (
        <div>
          {uc.title} {useCaseInput}
          <Button type="link" onClick={() => closeTab(useCaseState)}>
            <CloseOutlined />
          </Button>
        </div>
      ),
      key: `${useCaseState.usecaseInstanceUid}`,
      closeable: true,
      children: (
        <Suspense fallback={"Loading . . . "}>
          <ModuleLoader
            url={uc.url}
            scope={uc.module}
            module={uc.component}
            inputData={{
              input: useCaseState.input,
              executeCommand: (commandKey, input) =>
                startExecuteCommand(commandKey, input),
            }}
          />
        </Suspense>
      ),
    });
  });
  return result;
}

{
  /* <Suspense fallback={"Loading . . . "}>
  <ModuleLoader
    url={r.url}
    scope={r.module}
    module={r.component}
    inputData={{ someInput: "WTF" }}
  />
</Suspense> */
}
