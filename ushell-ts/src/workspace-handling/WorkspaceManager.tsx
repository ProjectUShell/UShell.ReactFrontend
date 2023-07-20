import React from "react";
import { IWidget, UsecaseState } from "ushell-modulebase";
import { TabItem } from "./TabItem";
import { UsecaseDescription } from "ushell-portfoliodescription";
import { WidgetHost } from "../portfolio-handling/WidgetHost";
import { ArgumentMapper } from "../portfolio-handling/ArgumentMapper";
import { PortfolioBasedWorkspaceManager } from "../portfolio-handling/PortfolioBasedWorkspaceManager";

export abstract class WorkspaceManager {
  abstract terminateUsecase(usecaseState: UsecaseState): void;

  abstract startUsecase(
    workspaceKey: string,
    usecaseKey: string,
    input?: any
  ): void;

  abstract enterUsecase(usecaseState: UsecaseState) : void;

  abstract getUsecaseStates(workspaceId: string): UsecaseState[];

  abstract getDynamicUsecaseStates(): UsecaseState[];

  navigateMethod: ((url: string) => void) | undefined = undefined;
  renderWidgetMethod:
    | ((widgetClass: string, input: IWidget) => JSX.Element)
    | undefined;

  abstract renderUsecase(
    usecaseState: UsecaseState,
    input: IWidget
  ): JSX.Element;

  activateWorkspace(workspaceKey: string): void {
    this.navigateSafe(workspaceKey);
  }

  navigateSafe(url: string): void {
    if (!this.navigateMethod) {
      console.warn("no navigate method :(");
      return;
    }
    this.navigateMethod(url);
  }

  getTitleForUseCase(state: UsecaseState): string {
    let title = state.title;
    let brStartIdx: number = -1;
    brStartIdx = title.indexOf("{");
    let loopProtector: number = 0;
    if (state.unitOfWork) {
      while (brStartIdx >= 0) {
        loopProtector++;
        let brEndIdx: number = title.indexOf("}", brStartIdx + 1);
        if (brEndIdx == -1 || loopProtector > 5) {
          return title;
        }
        let keyPath: string = title.substring(brStartIdx + 1, brEndIdx);
        let value = ArgumentMapper.pickValue(state.unitOfWork, keyPath);
        if (value == undefined || value == null) {
          title = title.replace("{" + keyPath + "}", "");
        } else {
          title = title.replace("{" + keyPath + "}", value?.toString());
        }
        title = title.replace("''", "").trim();

        //next
        brStartIdx = title.indexOf("{");
      }
    }
    return title;
  }

  getTabItems(usecaseStates: UsecaseState[]): TabItem[] {
    return usecaseStates.map((ucs) => {
      return {
        title: this.getTitleForUseCase(ucs),
        id: ucs.usecaseInstanceUid,
        tag: ucs,
        canClose: !ucs.fixed,
        renderMethod: () =>
          this.renderUsecase(ucs, { state: ucs, widgetHost: new WidgetHost() }),
      };
    });
  }
}
