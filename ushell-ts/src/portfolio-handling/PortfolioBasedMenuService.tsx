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
import ChevronDownIcon from "ushell-common-components/dist/cjs/_Icons/ChevrodnDownIcon";
import DropdownSelect from "ushell-common-components/dist/cjs/_Atoms/DropdownSelect";
import AppScopeDropdown from "./_Molecules/AppScopeDropdown";

export class PortfolioBasedMenuService {
  public static buildMenuFromModule(): ShellMenu {
    const module: ModuleDescription = PortfolioManager.GetModule();
    console.debug("building menu", module);
    const result1: ShellMenu = MenuBuilder.buildMenuFromModule(
      module,
      (command: CommandDescription, e: any) =>
        PortfolioManager.GetWorkspaceManager().executeCommand(command, e, {})
    );
    if (!result1.topBarItems) {
      result1.topBarItems = [];
    }

    PortfolioBasedMenuService.appendAuthItem(result1);
    PortfolioBasedMenuService.appendUsecaseInstanceDropdown(result1);
    PortfolioBasedMenuService.appendAppScopeItems(result1);

    return result1;
  }

  private static appendUsecaseInstanceDropdown(result1: ShellMenu) {
    result1.topBarItems?.unshift({
      icon: (
        <UsecaseInstanceDropdown
          workspaceManager={PortfolioManager.GetWorkspaceManager()}
        ></UsecaseInstanceDropdown>
      ),
      id: "UsecaseInstanceDropdown",
    });
  }

  public static pickAppScopeValueLabel(value: any): string {
    if (typeof value !== "object") return value;
    for (let p in value) {
      if (p.toLocaleLowerCase().includes("label")) return value[p];
    }
    return "object";
  }

  private static appendAppScopeItems(result1: ShellMenu) {
    const appScopes: ApplicationScopeEntry[] | null =
      PortfolioManager.GetPortfolio().applicationScope;
    if (appScopes) {
      console.log("appScopes", appScopes);
      appScopes.forEach((entry: ApplicationScopeEntry) => {
        if (entry.isVisible) {
          result1.topBarItems?.unshift({
            icon: (
              <div className="flex gap-2">
                {entry.switchScopeCommand && (
                  <button
                    className=" hover:bg-navigationHover dark:hover:bg-bg4dark
                     rounded-sm p-1"
                    onClick={() =>
                      PortfolioManager.GetWorkspaceManager().executeCommandByKey(
                        entry.switchScopeCommand || "",
                        null
                      )
                    }
                  >
                    <div className="flex gap-1 items-center content-center">
                      <p>{entry.label}:</p>
                      <p>
                        {PortfolioBasedMenuService.pickAppScopeValueLabel(
                          entry.initialValue || "Empty"
                        )}
                      </p>
                      <ChevronDownIcon
                        size={1.2}
                        strokeWidth={3}
                      ></ChevronDownIcon>
                    </div>
                  </button>
                )}
                {entry.knownValues &&
                Object.keys(entry.knownValues).length > 0 ? (
                  <AppScopeDropdown entry={entry}></AppScopeDropdown>
                ) : null}
              </div>
            ),
            id: entry.name,
          });
        }
      });
    }
  }

  private static appendAuthItem(result1: ShellMenu) {
    const authInfo: {
      primaryUiTokenSourceUid: string | null;
      isAuthenticated: Boolean;
    } = TokenService.getUiAuthenticatedInfo();
    if (authInfo.primaryUiTokenSourceUid && authInfo.isAuthenticated) {
      result1.topBarItems?.unshift({
        icon: (
          <div>
            <button
              className="relative align-middle"
              onClick={() => {
                TokenService.deleteToken(authInfo.primaryUiTokenSourceUid!);
                PortfolioManager.GetInstance().deleteAppScopeCache();
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
          PortfolioManager.GetWorkspaceManager().executeCommand(command, e, {}),
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
