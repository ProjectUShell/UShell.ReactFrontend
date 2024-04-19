import {
  AuthTokenConfig,
  CommandDescription,
  ModuleDescription,
  PortfolioDescription,
  UsecaseDescription,
  WorkspaceDescription,
} from "ushell-portfoliodescription";

import { WorkspaceManager } from "../workspace-handling/WorkspaceManager";

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
    console.log("commandRequiresAuthentication", command);
    if (!this.GetPortfolio().anonymouseAccess) {
      return true;
    }
    if (!this.GetPortfolio().anonymouseAccess.authIndependentCommands) {
      return true;
    }
    return !this.GetPortfolio().anonymouseAccess.authIndependentCommands.find(
      (c) => c == command.uniqueCommandKey
    );
  }

  static usecaseRequiresAuthentication(usecase: UsecaseDescription): boolean {
    if (!this.GetPortfolio().anonymouseAccess) {
      return true;
    }
    if (!this.GetPortfolio().anonymouseAccess.authIndependentCommands) {
      return true;
    }
    return !this.GetPortfolio().anonymouseAccess.authIndependentUsecases.find(
      (uc) => uc == usecase.usecaseKey
    );
  }

  static workspaceRequiresAuthentication(
    workspace: WorkspaceDescription
  ): boolean {
    if (!this.GetPortfolio().anonymouseAccess) {
      return true;
    }
    if (!this.GetPortfolio().anonymouseAccess.authIndependentCommands) {
      return true;
    }
    return !this.GetPortfolio().anonymouseAccess.authIndependentWorkspaces.find(
      (ws) => ws == workspace.workspaceKey
    );
  }

  private static GetInstance(): PortfolioManager {
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
  }

  public static GetWorkspaceManager(): WorkspaceManager {
    return PortfolioManager.GetInstance()._WorkspaceManager;
  }
}
