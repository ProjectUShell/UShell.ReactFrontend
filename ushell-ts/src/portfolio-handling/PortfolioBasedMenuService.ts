import {
  CommandDescription,
  ModuleDescription,
} from "ushell-portfoliodescription";
import { MenuItem, ShellMenu } from "../shell-layout/ShellMenu";
import { PortfolioManager } from "./PortfolioManager";

export class PortfolioBasedMenuService {
  public static buildMenuFromModule(): ShellMenu {
    const module: ModuleDescription = PortfolioManager.GetModule();
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
