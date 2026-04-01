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
import {
  UsecaseInstanceDropdownButton,
  UsecaseInstanceDropdownContent,
} from "../workspace-handling/_Molecules/UsecaseInstanceDropdown";
import ClipboardIcon from "../shell-layout/_Icons/ClipboardIcon";
import { TokenService } from "../authentication/TokenService";
import ArrowRightStartOn from "../authentication/Components/ArrowRightStartOn";
import ChevronDownIcon from "ushell-common-components/dist/cjs/_Icons/ChevrodnDownIcon";
import DropdownSelect from "ushell-common-components/dist/cjs/_Atoms/DropdownSelect";
import AppScopeDropdown from "./_Molecules/AppScopeDropdown";
import UserCircleIcon from "./_Icons/UserCircleIcon";
import UserPlusIcon from "./_Icons/UserPlusIcon";
import UserMinusIcon from "./_Icons/UserMinusIcon";

export class PortfolioBasedMenuService {
  public static buildMenuFromModule(): ShellMenu {
    const module: ModuleDescription = PortfolioManager.GetModule();
    console.debug("building menu", module);
    const result1: ShellMenu = MenuBuilder.buildMenuFromModule(
      module,
      (command: CommandDescription, e: any) =>
        PortfolioManager.GetWorkspaceManager().executeCommand(command, e, {}),
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
        <UsecaseInstanceDropdownButton
          workspaceManager={PortfolioManager.GetWorkspaceManager()}
        ></UsecaseInstanceDropdownButton>
      ),
      dropdown: (
        <UsecaseInstanceDropdownContent
          workspaceManager={PortfolioManager.GetWorkspaceManager()}
        ></UsecaseInstanceDropdownContent>
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
          console.log("adding app scope entry to menu", entry);
          result1.topBarItems?.unshift({
            icon: (
              <>
                {entry.switchScopeCommand && (
                  <button
                    className=" relative align-middle"
                    onClick={() =>
                      PortfolioManager.GetWorkspaceManager().executeCommandByKey(
                        entry.switchScopeCommand || "",
                        null,
                      )
                    }
                  >
                    <div className="flex gap-1 items-center content-center text-sm">
                      <p>{entry.label}:</p>
                      <p>
                        {PortfolioBasedMenuService.pickAppScopeValueLabel(
                          entry.initialValue || "Empty",
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
              </>
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
    if (authInfo.primaryUiTokenSourceUid) {
      const tokenAndContent = TokenService.getTokenAndContentSync(
        authInfo.primaryUiTokenSourceUid,
      );

      result1.topBarItems?.unshift({
        icon: <UserCircleIcon size={1.2}></UserCircleIcon>,
        dropdown: (
          <div
            className=" bg-menu dark:bg-menuDark flex flex-col border
           border-contentBorder dark:border-contentBorderDark"
          >
            {authInfo.isAuthenticated ? (
              <>
                <p className="font-semibold m-4">
                  Signed in as {(tokenAndContent?.content as any)?.sub || ""}
                </p>
                <button
                  className="flex gap-2 items-center align-middle p-3
                  shadow border-t border-contentBorder dark:border-contentBorderDark
                   bg-content dark:bg-contentDark hover:bg-contentHover dark:hover:bg-contentHoverDark"
                  onClick={() => {
                    TokenService.deleteToken(authInfo.primaryUiTokenSourceUid!);
                    PortfolioManager.GetInstance().deleteAppScopeCache();
                    PortfolioManager.GetWorkspaceManager().navigateSafe("/");
                  }}
                >
                  <UserMinusIcon size={1.8}></UserMinusIcon>
                  <p>Sign out</p>
                </button>
              </>
            ) : (
              <>
                <p className="font-semibold m-4">You are not signed in</p>
                <button
                  className="flex gap-2 items-center align-middle p-3
                  shadow border-t border-contentBorder dark:border-contentBorderDark
                   bg-content dark:bg-contentDark hover:bg-contentHover dark:hover:bg-contentHoverDark"
                  onClick={() =>
                    PortfolioManager.GetWorkspaceManager().navigateSafe(
                      "/login",
                    )
                  }
                >
                  <UserPlusIcon size={1.8}></UserPlusIcon>
                  <p>Sign in</p>
                </button>
              </>
            )}
          </div>
        ),
        // icon: (
        //   <div>
        //     <button
        //       className="relative align-middle"
        //       onClick={() => {
        //         TokenService.deleteToken(authInfo.primaryUiTokenSourceUid!);
        //         PortfolioManager.GetInstance().deleteAppScopeCache();
        //         PortfolioManager.GetWorkspaceManager().navigateSafe("/");
        //       }}
        //     >
        //       <ArrowRightStartOn></ArrowRightStartOn>
        //     </button>
        //   </div>
        // ),
        id: "Logoff",
      });
    }
  }

  private static pushIntoMenu(
    command: CommandDescription,
    shellMenu: ShellMenu,
    module: ModuleDescription,
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
    menuItems: MenuItem[],
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
        (i) => i.type == "Folder" && i.label == menuFolder,
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
        currentFolder.children,
      );
    });
  }
}
