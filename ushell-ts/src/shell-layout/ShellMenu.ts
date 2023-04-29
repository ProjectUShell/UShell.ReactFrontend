import { ReactElement } from "react";

export type MenuItemType = "Command" | "Group" | "Folder";

export interface MenuItem {
  label: string;
  type: MenuItemType;
  command?: (e: any) => void;
  children?: MenuItem[];
  icon?: ReactElement;
  id: string;
}

export interface ShellMenu {
  items: MenuItem[];
}
