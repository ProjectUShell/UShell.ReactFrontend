import { UsecaseState } from "ushell-modulebase";
import { WorkspaceManager } from "../workspace-handling/WorkspaceManager";
import {
  ModuleDescription,
  StaticUseCaseAssignment,
  UsecaseDescription,
  WorkspaceDescription,
} from "ushell-portfoliodescription";
import { v4 as uuidv4 } from "uuid";
import { PortfolioManager } from "./PortfolioManager";

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

    const staticUsecaseAssignments: StaticUseCaseAssignment[] =
      PortfolioManager.GetModule().staticUsecaseAssignments; // TODO_KRN: This is missing!!

    const unsavedStaticUsecaseAssignments: StaticUseCaseAssignment[] =
      staticUsecaseAssignments.filter(
        (sua) =>
          usecaseStatesFromLocalStorage.find(
            (l) => l.usecaseKey == sua.useCaseKey
          ) == undefined
      );

    const usecaseStatesFromUnsavedStaticUsecaseAssignments: UsecaseState[] =
      unsavedStaticUsecaseAssignments.map((sua) => {
        const useCase: UsecaseDescription | undefined =
          PortfolioManager.GetModule().usecases.find(
            (u) => u.useCaseKey == sua.useCaseKey
          );
        return {
          fixed: true,
          parentWorkspaceKey: workspaceKey,
          unitOfWork: sua.initUnitOfWork ? sua.initUnitOfWork : {},
          usecaseInstanceUid: uuidv4(),
          title: useCase!.title,
          usecaseKey: sua.useCaseKey,
        };
      });
    const usecaseStates: UsecaseState[] =
      usecaseStatesFromUnsavedStaticUsecaseAssignments.concat(
        usecaseStatesFromLocalStorage
      );
    this.saveWorkspaceState(workspaceKey, usecaseStates);
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

  startUsecase(
    workspaceKey: string,
    usecaseKey: string,
    input?: any
  ): void {
    //TODO_KRN usecase Schreibweise einheitlich!!
    const usecase: UsecaseDescription | undefined =
      PortfolioManager.GetModule().usecases.find(
        (uc) => uc.useCaseKey == usecaseKey
      );
    if (!usecase) {
      console.error(`No Usecase with usecaseKey `);
      return;
    }
    const newUsecaseState: UsecaseState = {
      fixed: false,
      parentWorkspaceKey: workspaceKey,
      title: usecase.title,
      unitOfWork: usecase.unitOfWorkDefaults,
      usecaseInstanceUid: uuidv4(),
      usecaseKey: usecaseKey,
    };

    const currentUsecaseStates: UsecaseState[] =
      this.getUsecaseStates(workspaceKey);
    currentUsecaseStates.push(newUsecaseState);
    this.saveWorkspaceState(workspaceKey, currentUsecaseStates);

    this.navigateSafe(`${workspaceKey}\\${newUsecaseState.usecaseInstanceUid}`);
  }

  loadInitialUsecaseStates(): UsecaseState[] {
    throw new Error("Method not implemented.");
  }
}
