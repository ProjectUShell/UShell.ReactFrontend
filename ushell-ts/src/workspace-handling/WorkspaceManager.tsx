import React from "react";
import { v4 as uuidv4 } from "uuid";
import { IWidget, UsecaseState } from "ushell-modulebase";
import { TabItem } from "./TabItem";
import {
  CommandDescription,
  StaticUsecaseAssignment,
  UsecaseDescription,
  WorkspaceDescription,
} from "ushell-portfoliodescription";
import { WidgetHost } from "../portfolio-handling/WidgetHost";
import { ArgumentMapper } from "../portfolio-handling/ArgumentMapper";
import { PortfolioManager } from "../portfolio-handling/PortfolioManager";
import { Guifad, GuifadFuse } from "ushell-common-components";
import { RemoteWidgetDescription } from "../federation/RemoteWidgetDescription";
import FederatedComponentProxy from "../federation/_Molecules/FederatedComponentProxy";
import PortfolioSelector from "../portfolio-handling/_Organisms/PortfolioSelector";
import { TokenService } from "../authentication/TokenService";
import LogonPage from "../authentication/Components/LogonPage";
import { PortfolioLoader } from "../portfolio-handling/PortfolioLoader";
import { Demo } from "../demo/Demo";
import { DatasourceManager } from "../datasource-handling/DatasourceManager";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { EntitySchema } from "fusefx-modeldescription";
const queryClient = new QueryClient();

export class WorkspaceManager {
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

  navigateMethod: ((url: string) => void) | undefined = undefined;

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

  private _UsecaseStatesByWorkspaceId: { [key: string]: UsecaseState[] } = {};

  private getLocaleStorageKey(workspaceKey: string): string {
    const portfolioIdentifier: string =
      PortfolioManager.GetPortfolio().applicationTitle;
    return `${portfolioIdentifier}|${workspaceKey}`;
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
    return {
      usecaseInstanceUid: uuidv4(),
      usecaseKey: useCase.usecaseKey,
      title: useCase.title,
      fixed: fixed,
      parentWorkspaceKey: parentWorkspaceKey,
      unitOfWork: uow,
    };
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
      case "navigate": {
        console.warn("navigating");
        this.navigateSafe("//");
        return;
      }
    }
    throw "invalid command type";
  }

  enterUsecase(usecaseState: UsecaseState): void {
    this.navigateSafe(
      `${usecaseState.parentWorkspaceKey}\\${usecaseState.usecaseInstanceUid}`
    );
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

    if (
      !PortfolioManager.GetPortfolio().anonymouseAccess?.authIndependentUsecases?.find(
        //TODO wildcards
        (uc) => uc == usecase.usecaseKey
      )
    ) {
      if (!TokenService.isUiAuthenticated()) {
        console.log(
          "Protected route -> navigate to laogin!",
          PortfolioManager.GetPortfolio()
        );

        return (
          <LogonPage
            tokenSourceUid={
              PortfolioManager.GetPortfolio().primaryUiTokenSourceUid
            }
            portfolio={PortfolioLoader.GetPortfolioUrl()}
          ></LogonPage>
        );
      }
    }
    console.log("input", input);
    return this.renderWidget(usecase.widgetClass, input);
  }

  renderWidget(widgetClass: string, input: IWidget) {
    const remoteWidgetDesc: RemoteWidgetDescription | null =
      this.parseWidgetClass(widgetClass, input);
    if (remoteWidgetDesc) {
      return (
        <FederatedComponentProxy
          scope={remoteWidgetDesc.scope}
          module={remoteWidgetDesc.module}
          url={remoteWidgetDesc.url}
          inputData={remoteWidgetDesc.inputData}
        ></FederatedComponentProxy>
      );
    }
    if (widgetClass == "portfolioChooser") {
      const portfolioLocation: string = PortfolioManager.GetPortfolioLocation();
      return (
        <PortfolioSelector
          url={portfolioLocation}
          onPortfolioSelected={(portfolioUrl: string) =>
            this.navigateSafe(`?portfolio=${portfolioUrl}`)
          }
        ></PortfolioSelector>
      );
    }
    const uow: any = input.state.unitOfWork;
    console.log("uow", uow);
    if (widgetClass == "guifad") {
      return (
        <QueryClientProvider client={queryClient}>
          <Guifad
            rootEntityName={uow.entityName}
            dataSourceManager={DatasourceManager.Instance()}
            enterRecord={(r, es) => this.tryStartGuifad(r, es)}
          ></Guifad>
        </QueryClientProvider>
      );
    }
    if (widgetClass == "guifadFuse") {
      const uow: any = input.state.unitOfWork;
      const fuseUrl: string = uow.fuseUrl;
      console.log("uow.rootEntityName", uow);
      return (
        <GuifadFuse
          fuseUrl={uow.fuseUrl}
          rootEntityName={uow.rootEntityName}
          routePattern={uow.routePattern ? uow.routePattern : "body"}
        ></GuifadFuse>
      );
    }
    if (widgetClass.toLowerCase() == "login") {
      return (
        <LogonPage
          tokenSourceUid={
            PortfolioManager.GetPortfolio().primaryUiTokenSourceUid
          }
          portfolio={PortfolioLoader.GetPortfolioUrl()}
        ></LogonPage>
      );
    }
    if (widgetClass.toLocaleLowerCase() == "demo") {
      return <Demo widget={input}></Demo>;
    }
    return <div>Invalid Widget Class</div>;
  }

  parseWidgetClass(
    widgetClass: string,
    input: IWidget
  ): RemoteWidgetDescription | null {
    try {
      let result: RemoteWidgetDescription | undefined = JSON.parse(widgetClass);
      if (result) {
        result.inputData = input;
        return result;
      }
    } catch (error) {
      console.error("error parsing widget class", error);
      return null;
    }
    console.error("Invalid widget class", widgetClass);
    return null;
  }

  tryStartGuifad(r: any, es: EntitySchema) {
    console.log("try executing guifad command", r);
    const usecase: UsecaseDescription | undefined =
      PortfolioManager.GetModule().usecases.find(
        (uc) => uc.usecaseKey == es.name
      );
    if (!usecase) return;
    const command: CommandDescription | undefined =
      PortfolioManager.GetModule().commands.find(
        (c) => c.targetUsecaseKey == usecase.usecaseKey
      );
    if (!command) return;
    console.log("executing guifad command", command);
    this.executeCommand(command, r);
  }
}
