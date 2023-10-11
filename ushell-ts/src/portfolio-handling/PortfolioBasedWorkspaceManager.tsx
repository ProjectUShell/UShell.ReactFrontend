import React from "react";
import { IWidget, UsecaseState } from "ushell-modulebase";
import { WorkspaceManager } from "../workspace-handling/WorkspaceManager";
import {
  CommandDescription,
  ModuleDescription,
  StaticUsecaseAssignment,
  UsecaseDescription,
  WorkspaceDescription,
} from "ushell-portfoliodescription";
import { v4 as uuidv4 } from "uuid";
import { PortfolioManager } from "./PortfolioManager";
import { ArgumentMapper } from "./ArgumentMapper";

export class PortfolioBasedWorkspaceManager extends WorkspaceManager {
  public constructor() {
    super();
  }

  private _UsecaseStatesByWorkspaceId: { [key: string]: UsecaseState[] } = {};

  private getLocaleStorageKey(workspaceKey: string): string {
    return `workspace:${workspaceKey}`;
  }

  getUsecaseStates(workspaceKey: string): UsecaseState[] {
    const workspace: WorkspaceDescription | undefined =
      PortfolioManager.GetModule().workspaces.find(
        (ws) => ws.workspaceKey == workspaceKey
      );
    if (!workspace) {
      return [];
    }

    const usecaseStatesFromLocalStorageJson: string | null =
      localStorage.getItem(this.getLocaleStorageKey(workspaceKey));

    const usecaseStatesFromLocalStorage: UsecaseState[] =
      usecaseStatesFromLocalStorageJson
        ? JSON.parse(usecaseStatesFromLocalStorageJson)
        : [];

    const staticUsecaseAssignments: StaticUsecaseAssignment[] =
      PortfolioManager.GetModule().staticUsecaseAssignments.filter(
        (sua) => sua.targetWorkspaceKey == workspaceKey
      );
    console.log(
      "PortfolioManager.GetModule().staticUsecaseAssignments.",
      PortfolioManager.GetModule().staticUsecaseAssignments
    );

    const unsavedStaticUsecaseAssignments: StaticUsecaseAssignment[] =
      staticUsecaseAssignments.filter(
        (sua) =>
          usecaseStatesFromLocalStorage.find(
            (l) => l.usecaseKey == sua.usecaseKey
          ) == undefined
      );

    const usecaseStatesFromUnsavedStaticUsecaseAssignments: UsecaseState[] =
      unsavedStaticUsecaseAssignments.map((sua) => {
        const useCase: UsecaseDescription | undefined =
          PortfolioManager.GetModule().usecases.find(
            (u) => u.usecaseKey == sua.usecaseKey
          );
        if (!useCase) {
          console.error("No UsecaseDescription", sua);
          throw "No UsecaseDescription";
        }
        return this.initializeUsecase(
          useCase,
          workspaceKey,
          true,
          sua.initUnitOfWork
        );
        // return {
        //   fixed: true,
        //   parentWorkspaceKey: workspaceKey,
        //   unitOfWork: sua.initUnitOfWork ? sua.initUnitOfWork : {},
        //   usecaseInstanceUid: uuidv4(),
        //   title: useCase!.title,
        //   usecaseKey: sua.usecaseKey,
        // };
      });
    const usecaseStates: UsecaseState[] =
      usecaseStatesFromUnsavedStaticUsecaseAssignments.concat(
        usecaseStatesFromLocalStorage
      );
    this.saveWorkspaceState(workspaceKey, usecaseStates);
    return usecaseStates;
  }

  private initializeUsecase(
    useCase: UsecaseDescription,
    parentWorkspaceKey: string,
    fixed: boolean,
    uowInitializationData?: any
  ): UsecaseState {
    let uow: any = {};
    if (useCase.unitOfWorkDefaults) {
      uow = ArgumentMapper.resolveDynamicMapping(
        useCase.unitOfWorkDefaults,
        {},
        true
      );
    }
    if (uowInitializationData) {
      ArgumentMapper.copyRecursive(uowInitializationData, uow);
    }
    console.log("uow", uow)
    return {
      usecaseInstanceUid: uuidv4(),
      usecaseKey: useCase.usecaseKey,
      title: useCase.title,
      fixed: fixed,
      parentWorkspaceKey: parentWorkspaceKey,
      unitOfWork: uow,
    };
  }

  getDynamicUsecaseStates(): UsecaseState[] {
    const workspaces: WorkspaceDescription[] =
      PortfolioManager.GetModule().workspaces;

    const usecaseStates: UsecaseState[] = [];
    for (const workspace of workspaces) {
      const usecaseStatesFromLocalStorageJson: string | null =
        localStorage.getItem(this.getLocaleStorageKey(workspace.workspaceKey));

      const usecaseStatesFromLocalStorage: UsecaseState[] =
        usecaseStatesFromLocalStorageJson
          ? JSON.parse(usecaseStatesFromLocalStorageJson)
          : [];
      for (const ucs of usecaseStatesFromLocalStorage.filter((u) => !u.fixed)) {
        usecaseStates.push(ucs);
      }
    }
    return usecaseStates;
  }

  private saveWorkspaceState(
    workspaceKey: string,
    usecaseStates: UsecaseState[]
  ) {
    this._UsecaseStatesByWorkspaceId[workspaceKey] = usecaseStates;
    localStorage.setItem(
      this.getLocaleStorageKey(workspaceKey),
      JSON.stringify(usecaseStates)
    );
  }

  public executeCommand(c: CommandDescription, input: any): void {
    switch (c.commandType) {
      case "activate-workspace": {
        PortfolioManager.GetWorkspaceManager().activateWorkspace(
          c.targetWorkspaceKey!
        );
        return;
      }
      case "start-usecase": {
        const uowData: any = ArgumentMapper.resolveDynamicMapping(
          c.initUnitOfWork,
          {},
          false,
          input
        );
        PortfolioManager.GetWorkspaceManager().startUsecase(
          c.targetWorkspaceKey!,
          c.targetUsecaseKey!,
          uowData
        );
        return;
      }
    }
    throw "invalid command type";
  }

  startUsecase(workspaceKey: string, usecaseKey: string, uowData: any): void {
    //TODO für init von uow: auch aufrufendes usecaseInstance verwenden => iwie pushen / merken
    const usecase: UsecaseDescription | undefined =
      PortfolioManager.GetModule().usecases.find(
        (uc) => uc.usecaseKey == usecaseKey
      );
    if (!usecase) {
      console.error(`No Usecase with usecaseKey `);
      return;
    }
    const currentUsecaseStates: UsecaseState[] =
      this.getUsecaseStates(workspaceKey);

    let uowDefaults: any = {};
    if (usecase.unitOfWorkDefaults) {
      uowDefaults = ArgumentMapper.resolveDynamicMapping(
        usecase.unitOfWorkDefaults,
        {},
        true
      );
    }
    if (uowData) {
      ArgumentMapper.copyRecursive(uowData, uowDefaults);
    }

    const existingUsecaseState: UsecaseState | undefined =
      currentUsecaseStates.find(
        (ucs) =>
          ucs.usecaseKey == usecaseKey &&
          this.areEqual(ucs.unitOfWork, uowDefaults)
      );
    if (existingUsecaseState) {
      this.navigateSafe(
        `${workspaceKey}\\${existingUsecaseState.usecaseInstanceUid}`
      );
      return;
    }

    const newUsecaseState: UsecaseState = {
      fixed: false,
      parentWorkspaceKey: workspaceKey,
      title: usecase.title,
      unitOfWork: uowDefaults,
      usecaseInstanceUid: uuidv4(),
      usecaseKey: usecaseKey,
    };

    currentUsecaseStates.push(newUsecaseState);
    this.saveWorkspaceState(workspaceKey, currentUsecaseStates);

    this.navigateSafe(`${workspaceKey}\\${newUsecaseState.usecaseInstanceUid}`);
  }

  enterUsecase(usecaseState: UsecaseState): void {
    this.navigateSafe(
      `${usecaseState.parentWorkspaceKey}\\${usecaseState.usecaseInstanceUid}`
    );
  }

  areEqual(unitOfWork: any, uowData: any): Boolean {
    //TODO singletonActionKey ist Vergeichsschlüssel (so wie title auflösen mit Platzhaltern)
    if (!unitOfWork && !uowData) {
      return true;
    }
    if ((unitOfWork && !uowData) || (!unitOfWork && uowData)) {
      return false;
    }
    const keys1: string[] = Object.keys(unitOfWork);
    const keys2: string[] = Object.keys(uowData);

    for (const key1 of keys1) {
      const key2: string | undefined = keys2.find((k) => k == key1);
      if (!key2) {
        return false;
      }
      const v1: any = unitOfWork[key1];
      const v2: any = uowData[key2];
      if (v1 != v2) {
        return false;
      }
    }
    return true;
  }

  loadInitialUsecaseStates(): UsecaseState[] {
    throw new Error("Method not implemented.");
  }

  terminateUsecase(usecaseState: UsecaseState): void {
    const usecaseStates: UsecaseState[] = this.getUsecaseStates(
      usecaseState.parentWorkspaceKey
    );
    const indexOfUsecaseState: number = usecaseStates.findIndex(
      (ucs) => ucs.usecaseInstanceUid == usecaseState.usecaseInstanceUid
    );
    usecaseStates.splice(indexOfUsecaseState, 1);
    this.saveWorkspaceState(usecaseState.parentWorkspaceKey, usecaseStates);

    this.navigateSafe(usecaseState.parentWorkspaceKey);
  }

  renderUsecase(usecaseState: UsecaseState, input: IWidget): JSX.Element {
    const usecase: UsecaseDescription | undefined =
      PortfolioManager.GetModule().usecases.find(
        (uc) => uc.usecaseKey == usecaseState.usecaseKey
      );
    if (!usecase) {
      return <div>No Usecase Description</div>;
    }
    console.log("usecase", usecase);
    console.log("input", input);
    if (!this.renderWidgetMethod) {
      return <div>{usecase.widgetClass}</div>;
    }
    return this.renderWidgetMethod(usecase.widgetClass, input);
  }
}
