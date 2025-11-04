import {
  ApplicationScopeEntry,
  AuthTokenConfig,
  CommandDescription,
  ModuleDescription,
  PortfolioDescription,
  UsecaseDescription,
  WorkspaceDescription,
} from "ushell-portfoliodescription";

import { WorkspaceManager } from "../workspace-handling/WorkspaceManager";
import { DatasourceManager } from "../datasource-handling/DatasourceManager";

export class PortfolioManager {
  constructor(private _WorkspaceManager: WorkspaceManager) {}

  private static _Instance: PortfolioManager | null = null;

  private static _PortfolioLocation: string = "";

  static GetModule(): ModuleDescription {
    return this.GetInstance()._Module!;
  }

  static GetPortfolioLocation(): string {
    return PortfolioManager._PortfolioLocation;
  }

  static SetPortfolioLocation(portfolioLocation: string) {
    PortfolioManager._PortfolioLocation = portfolioLocation;
  }

  static GetPortfolio(): PortfolioDescription {
    return this.GetInstance()._Portfolio!;
  }

  static tryGetAuthTokenConfig(tokenSourceUid: string): AuthTokenConfig | null {
    if (!this.GetPortfolio().authTokenConfigs) {
      return null;
    }
    return this.GetPortfolio().authTokenConfigs![tokenSourceUid];
  }

  static commandRequiresAuthentication(command: CommandDescription): boolean {
    if (!this.GetPortfolio().anonymousAccess) {
      return true;
    }
    if (!this.GetPortfolio().anonymousAccess.authIndependentCommands) {
      return true;
    }
    return !this.GetPortfolio().anonymousAccess.authIndependentCommands.find(
      (c) => c == command.uniqueCommandKey
    );
  }

  static usecaseRequiresAuthentication(usecase: UsecaseDescription): boolean {
    if (!this.GetPortfolio().anonymousAccess) {
      return true;
    }
    if (!this.GetPortfolio().anonymousAccess.authIndependentCommands) {
      return true;
    }
    return !this.GetPortfolio().anonymousAccess.authIndependentUsecases.find(
      (uc) => uc == usecase.usecaseKey
    );
  }

  static workspaceRequiresAuthentication(
    workspace: WorkspaceDescription
  ): boolean {
    if (!this.GetPortfolio().anonymousAccess) {
      return true;
    }
    if (!this.GetPortfolio().anonymousAccess.authIndependentCommands) {
      return true;
    }
    return !this.GetPortfolio().anonymousAccess.authIndependentWorkspaces.find(
      (ws) => ws == workspace.workspaceKey
    );
  }

  public static GetInstance(): PortfolioManager {
    if (!this._Instance) {
      this._Instance = new PortfolioManager(new WorkspaceManager());
    }
    return this._Instance;
  }

  private _Module: ModuleDescription | null = null;
  private _Portfolio: PortfolioDescription | null = null;

  public static SetModule(
    portfolio: PortfolioDescription,
    module: ModuleDescription
  ) {
    this._Instance = null;
    this._Instance = new PortfolioManager(new WorkspaceManager());
    this._Instance._Module = module;
    this._Instance._Portfolio = portfolio;
    if (!this._Instance!._Portfolio.applicationScope) {
      this._Instance!._Portfolio.applicationScope = [];
    }
    this._Instance.restoreAppScope();
    PortfolioManager.externalAppScope?.forEach((v) => {
      this._Instance!._Portfolio!.applicationScope!.push({
        initialValue: v.value,
        isVisible: false,
        label: v.key,
        switchScopeCommand: null,
        knownValues: null,
        dependentScopeConstraints: null,
        dependentScopeNames: null,
        name: v.key,
      });
    });
    console.debug(
      "after setting externalAppScope",
      this._Instance!._Portfolio!.applicationScope
    );
  }

  public static GetWorkspaceManager(): WorkspaceManager {
    return PortfolioManager.GetInstance()._WorkspaceManager;
  }

  private static externalAppScope: { key: string; value: string }[];

  private storeAppScope(appScope: ApplicationScopeEntry[]) {
    if (!this._Portfolio) return;
    localStorage.setItem(
      `appScope_${this._Portfolio.applicationTitle}`,
      JSON.stringify(appScope)
    );
  }

  deleteAppScopeCache() {
    if (!this._Portfolio) return;
    localStorage.removeItem(`appScope_${this._Portfolio.applicationTitle}`);
  }

  private restoreAppScope() {
    if (!this._Portfolio) return;
    const appScopeJson: string | null = localStorage.getItem(
      `appScope_${this._Portfolio.applicationTitle}`
    );
    if (!appScopeJson) return;
    const appScope: ApplicationScopeEntry[] = JSON.parse(appScopeJson);
    if (!appScope) return;
    this._Portfolio.applicationScope = appScope;
  }

  public SetAppScope(values: { key: string; value: string }[]) {
    console.log("set appscope", values);
    if (!this._Portfolio) {
      PortfolioManager.externalAppScope = values;
      return;
    }
    if (!this._Portfolio.applicationScope) {
      this._Portfolio.applicationScope = [];
    }
    values.forEach((v) => {
      let currentEntry: ApplicationScopeEntry | undefined =
        this._Portfolio?.applicationScope!.find((ase) => ase.name == v.key);
      if (!currentEntry) {
        currentEntry = {
          initialValue: v.value,
          isVisible: false,
          label: v.key,
          switchScopeCommand: null,
          knownValues: null,
          dependentScopeConstraints: null,
          dependentScopeNames: null,
          name: v.key,
        };
      } else {
        currentEntry.initialValue = v.value;
      }

      // this._Portfolio!.applicationScope![v.key] = currentEntry;
    });
    this.storeAppScope(this._Portfolio.applicationScope);
  }
}
