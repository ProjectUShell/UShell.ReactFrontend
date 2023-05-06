import {
  CommandDescription,
  ModuleDescription,
} from "ushell-portfoliodescription";
import { MenuItem, ShellMenu } from "../shell-layout/ShellMenu";
import { PortfolioManager } from "./PortfolioManager";
import { ShellMenuState } from "../shell-layout/ShellMenuState";

export class PortfolioBasedMenuService {
  public static buildMenuFromModule(): ShellMenu {
    const module: ModuleDescription = PortfolioManager.GetModule();
    const commands: CommandDescription[] = module.commands;
    const result: ShellMenu = new ShellMenu();
    commands.forEach((command: CommandDescription) => {
      this.pushIntoMenu(command, result, module);
    });
    return result;
    return {
      items: module.commands.map((c: CommandDescription) => {
        return {
          id: c.uniqueCommandKey,
          label: c.label,
          type: "Command",
          command: PortfolioBasedMenuService.getCommandMethod(c),
        };
      }),
    };
  }

  private static getCommandMethod(c: CommandDescription): () => void {
    switch (
      c.commandType //TODO_KRN CommandType festlegen
    ) {
      case "ActivateWorkspace": {
        return () => {
          PortfolioManager.GetWorkspaceManager().activateWorkspace(
            c.targetWorkspaceKey!
          );
        };
      }
      case "start-usecase": {
        return () => {
          PortfolioManager.GetWorkspaceManager().startUsecase(
            c.targetWorkspaceKey!,
            c.targetUsecaseKey!
          );
        };
      }
    }
    throw "invalid command type";
  }

  private static pushIntoMenu(
    command: CommandDescription,
    shellMenu: ShellMenu,
    module: ModuleDescription
  ) {
    //TODO_KRN what is menuOwnerUsecaseKey?
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
        command: this.getCommandMethod(command),
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
