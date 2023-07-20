import { ReactElement } from "react";

export type MenuItemType = "Command" | "Group" | "Folder";

export class MenuItem {
  label: string = "";
  type: MenuItemType = "Command";
  command?: (e: any) => void;
  children?: MenuItem[];
  icon?: ReactElement;
  id: string = "";
}

export class ShellMenu {
  items: MenuItem[] = [];
}
