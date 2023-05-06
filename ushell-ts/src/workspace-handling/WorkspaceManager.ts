import { UsecaseState } from "ushell-modulebase";
import { TabItem } from "./TabItem";

export abstract class WorkspaceManager {
  abstract startUsecase(
    workspaceKey: string,
    usecaseKey: string,
    input?: any
  ): void;

  abstract getUsecaseStates(workspaceId: string): UsecaseState[];

  navigateMethod: ((url: string) => void) | undefined = undefined;

  activateWorkspace(workspaceKey: string): void {
    this.navigateSafe(workspaceKey);
  }

  navigateSafe(url: string): void {
    if (!this.navigateMethod) {
      console.log("no navigate method :(");
      return;
    }
    this.navigateMethod(url);
  }
  getTabItems(usecaseStates: UsecaseState[]): TabItem[] {
    return usecaseStates.map((ucs) => {
      return {
        title: ucs.title,
      };
    });
  }
}
