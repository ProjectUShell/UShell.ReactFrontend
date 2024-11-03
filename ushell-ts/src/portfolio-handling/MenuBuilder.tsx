import React from "react";
import { ReactElement } from "react";
import { ShellMenu } from "ushell-common-components/dist/cjs/components/shell-layout/ShellMenu";
import { MenuItem } from "ushell-common-components/dist/cjs/components/shell-layout/ShellMenu";

import {
  CommandDescription,
  ModuleDescription,
} from "ushell-portfoliodescription";
import PowerIcon from "ushell-common-components/dist/cjs/_Atoms/PowerIcon";
import ListIcon from "ushell-common-components/dist/cjs/_Icons/ListIcon";
import { TokenService } from "../authentication/TokenService";
import { PortfolioManager } from "./PortfolioManager";
import { WorkspaceManager } from "../workspace-handling/WorkspaceManager";

export class MenuBuilder {
  public static buildMenuFromModuleUrl(
    moduleUrl: string,
    executeCommand: (comman: CommandDescription, e: any) => void
  ): Promise<ShellMenu> {
    return fetch(moduleUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((md: ModuleDescription) => {
        return this.buildMenuFromModule(md, executeCommand);
      });
  }

  private static getIcon(iconKey: string): ReactElement {
    switch (iconKey) {
      case "Power":
        return (
          <div className="hover:text-red-400 dark:hover:text-red-300">
            <PowerIcon></PowerIcon>
          </div>
        );
      default:
        return <ListIcon></ListIcon>;
    }
  }

  public static fullfillsRequiredTag(rt: string): boolean {
    const scopeMarker: string = "Scope_";
    if (rt.startsWith(scopeMarker)) {
      const requiredScope: string = rt.substring(scopeMarker.length);
      if (!PortfolioManager.GetPortfolio().applicationScope) return false;
      const scopeEntry: any =
        PortfolioManager.GetPortfolio().applicationScope![requiredScope];
      if (!scopeEntry) return false;
      if (!scopeEntry.value) return false;
      if (scopeEntry.value == "") return false;
      return true;
    }

    const notScopeMarker: string = "NotScope_";
    if (rt.startsWith(notScopeMarker)) {
      console.log("check NotScope_", rt);
      const notRequiredScope: string = rt.substring(notScopeMarker.length);
      if (!PortfolioManager.GetPortfolio().applicationScope) return true;
      const scopeEntry: any =
        PortfolioManager.GetPortfolio().applicationScope![notRequiredScope];
      console.log("NotScope scopeEntry", scopeEntry);
      if (!scopeEntry) return true;
      if (!scopeEntry.value) return true;
      if (scopeEntry.value == "") return true;
      console.log("NotScope false");
      return false;
    }
    return true;
  }

  public static buildMenuFromModule(
    module: ModuleDescription,
    executeCommand: (comman: CommandDescription, e: any) => void
  ): ShellMenu {
    const commands: CommandDescription[] = module.commands;
    const result: ShellMenu = new ShellMenu();
    const isAuthenticated: boolean = TokenService.isUiAuthenticated();
    // console.log("buildMenuFromModule", commands);
    commands
      .filter((c) => {
        let result =
          isAuthenticated || !PortfolioManager.commandRequiresAuthentication(c);
        if (!c.requiredRuntimeTagsForVisibility) return result;
        for (let rt of c.requiredRuntimeTagsForVisibility) {
          result = result && this.fullfillsRequiredTag(rt);
        }
        return result;
      })
      .forEach((command: CommandDescription) => {
        // console.log("adding command", command);
        if (command.menuFolder == "TopBar") {
          const icon: ReactElement = this.getIcon(
            command.iconKey ? command.iconKey : ""
          );
          if (!result.topBarItems) {
            result.topBarItems = [];
          }
          result.topBarItems.push({
            icon: (
              <button
                className="align-middle "
                onClick={(e) => executeCommand(command, e)}
              >
                {icon}
              </button>
            ),
            id: command.uniqueCommandKey,
          });
        } else {
          this.pushIntoMenu(command, executeCommand, result);
        }
      });
    return result;
  }

  private static pushIntoMenu(
    command: CommandDescription,
    executeCommand: (comman: CommandDescription, e: any) => void,
    shellMenu: ShellMenu
  ) {
    if (command.menuFolder == "") {
      return;
    }
    //TODO_KRN what is menuOwnerUsecaseKey? => tooblar im usecase selbst
    const menuFolders: string[] = command.menuFolder
      ? command.menuFolder.split("\\")
      : [];
    this.peekOrCreateItem(
      menuFolders,
      command,
      executeCommand,
      shellMenu.items
    );
  }

  static peekOrCreateItem(
    menuFolders: string[],
    command: CommandDescription,
    executeCommand: (comman: CommandDescription, e: any) => void,
    menuItems: MenuItem[]
  ) {
    if (!menuFolders || menuFolders.length == 0) {
      const menuItem: MenuItem = {
        id: command.uniqueCommandKey,
        label: command.label,
        type: "Command",
        command: (e: any) => executeCommand(command, e),
      };
      menuItems.push(menuItem);
    }

    let currentFolder: MenuItem | undefined;
    menuFolders.forEach((menuFolder: string) => {
      currentFolder = menuItems.find(
        (i) => i.type == "Folder" && i.label == menuFolder
      );
      if (!currentFolder) {
        currentFolder = {
          id: menuFolder,
          label: menuFolder,
          type: "Folder",
          children: [],
        };
        menuItems.push(currentFolder);
      }
      if (!currentFolder.children) {
        currentFolder.children = [];
      }
      this.peekOrCreateItem(
        menuFolders.slice(1),
        command,
        executeCommand,
        currentFolder.children
      );
    });
  }
}
