import React from "react";
import {
  ApplicationScopeEntry,
  CommandDescription,
  ModuleDescription,
  PortfolioDescription,
} from "ushell-portfoliodescription";
import { MenuItem } from "../shell-layout/ShellMenu";
import { PortfolioManager } from "./PortfolioManager";
// import { MenuBuilder } from "ushell-common-components/dist/cjs/components/shell-layout/MenuBuilder";
import { MenuBuilder } from "./MenuBuilder";
import { ShellMenu } from "ushell-common-components/dist/cjs/components/shell-layout/ShellMenu";
import UsecaseInstanceDropdown from "../workspace-handling/_Molecules/UsecaseInstanceDropdown";
import ClipboardIcon from "../shell-layout/_Icons/ClipboardIcon";
import { TokenService } from "../authentication/TokenService";
import ArrowRightStartOn from "../authentication/Components/ArrowRightStartOn";

export class PortfolioBasedMenuService {
  public static buildMenuFromModule(): ShellMenu {
    const module: ModuleDescription = PortfolioManager.GetModule();
    console.log("build menu", module);
    const result1: ShellMenu = MenuBuilder.buildMenuFromModule(
      module,
      (command: CommandDescription, e: any) =>
        PortfolioManager.GetWorkspaceManager().executeCommand(command, e)
    );
    if (!result1.topBarItems) {
      result1.topBarItems = [];
    }
    result1.topBarItems.unshift({
      icon: (
        <UsecaseInstanceDropdown
          workspaceManager={PortfolioManager.GetWorkspaceManager()}
        ></UsecaseInstanceDropdown>
      ),
      id: "UsecaseInstanceDropdown",
    });

    const authInfo: {
      primaryUiTokenSourceUid: string | null;
      isAuthenticated: Boolean;
    } = TokenService.getUiAuthenticatedInfo();
    if (authInfo.primaryUiTokenSourceUid && authInfo.isAuthenticated) {
      result1.topBarItems.unshift({
        icon: (
          <div>
            <button
              className="relative align-middle"
              onClick={() => {
                TokenService.deleteToken(authInfo.primaryUiTokenSourceUid!);
                PortfolioManager.GetWorkspaceManager().navigateSafe("/");
              }}
            >
              <ArrowRightStartOn></ArrowRightStartOn>
            </button>
          </div>
        ),
        id: "Logoff",
      });
    }

    const appScope: {
      [dimension: string]: ApplicationScopeEntry;
    } | null = PortfolioManager.GetPortfolio().applicationScope;
    if (appScope) {
      Object.keys(appScope).forEach((scopeKey: string) => {
        const entry: ApplicationScopeEntry = appScope[scopeKey];
        if (entry.isVisible) {
          console.log("ApplicationScopeEntry visible");
          result1.topBarItems?.unshift({
            icon: (
              <div className="flex gap-2">
                <p>
                  {entry.label}: {entry.value}
                </p>
                {entry.switchScopeCommand && (
                  <button
                    onClick={() =>
                      PortfolioManager.GetWorkspaceManager().executeCommandByKey(
                        entry.switchScopeCommand || "",
                        null
                      )
                    }
                  >
                    Switch
                  </button>
                )}
              </div>
            ),
            id: scopeKey,
          });
        }
      });
    }

    return result1;
    const commands: CommandDescription[] = module.commands;
    const result: ShellMenu = new ShellMenu();
    commands.forEach((command: CommandDescription) => {
      this.pushIntoMenu(command, result, module);
    });
    return result;
  }

  private static pushIntoMenu(
    command: CommandDescription,
    shellMenu: ShellMenu,
    module: ModuleDescription
  ) {
    if (command.menuFolder == "") {
      return;
    }
    //TODO_KRN what is menuOwnerUsecaseKey? => tooblar im usecase selbst
    const menuFolders: string[] = command.menuFolder
      ? command.menuFolder.split("\\")
      : [];
    this.peekOrCreateItem(menuFolders, command, shellMenu.items);
  }

  static peekOrCreateItem(
    menuFolders: string[],
    command: CommandDescription,
    menuItems: MenuItem[]
  ) {
    if (!menuFolders || menuFolders.length == 0) {
      const menuItem: MenuItem = {
        id: command.uniqueCommandKey,
        label: command.label,
        type: "Command",
        command: (e: any) =>
          PortfolioManager.GetWorkspaceManager().executeCommand(command, e),
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
        currentFolder.children
      );
    });
  }
}
