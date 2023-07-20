import { MenuItem } from "./ShellMenu";

export interface MenuItemState {
  collapsed: boolean;
}

export class ShellMenuState {
  menuItemStateById: { [id: string]: MenuItemState } = {};
  activeItemId: string = "";
}

export function loadShellMenuState(): ShellMenuState {
  const shellMenuStateJson: string | null =
    localStorage.getItem("ShellMenuState");
  if (!shellMenuStateJson) {
    return new ShellMenuState();
  }
  return JSON.parse(shellMenuStateJson);
}

export function saveShellMenuState(shellMenuState: ShellMenuState) {
  localStorage.setItem("ShellMenuState", JSON.stringify(shellMenuState));
}

export function getItemState(
  shellMenuState: ShellMenuState,
  itemId: string
): MenuItemState {
  const itemState: MenuItemState | null | undefined =
    shellMenuState.menuItemStateById[itemId];
  if (itemState) {
    return itemState;
  }
  const newItemState = { collapsed: true };
  shellMenuState.menuItemStateById[itemId] = newItemState;
  return newItemState;
}

export async function toggleFolderCollapse(
  shellMenuState: ShellMenuState,
  itemId: string
): Promise<ShellMenuState> {
  const itemState: MenuItemState = getItemState(shellMenuState, itemId);
  itemState.collapsed = !itemState.collapsed;
  saveShellMenuState(shellMenuState);
  return shellMenuState;
}

export function activateItem(item: MenuItem, shellMenuState?: ShellMenuState) {
  if (!shellMenuState) shellMenuState = loadShellMenuState();
  shellMenuState.activeItemId = item.id;
  if (item.command) {
    item.command(null);
  }
  saveShellMenuState(shellMenuState);
}
