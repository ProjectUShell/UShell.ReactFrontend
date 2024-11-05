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

export function containsItem(menuItems: MenuItem[], itemId: string) {
  for (let menuItem of menuItems) {
    if (menuItem.id == itemId) return true;
    if (!menuItem.children) continue;
    const childResult: boolean = containsItem(menuItem.children, itemId);
    if (childResult) return true;
  }
  return false;
}
