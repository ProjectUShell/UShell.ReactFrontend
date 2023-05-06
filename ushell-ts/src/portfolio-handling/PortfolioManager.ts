import {
  ModuleDescription,
  UsecaseDescription,
} from "ushell-portfoliodescription";
import { WorkspaceManager } from "../workspace-handling/WorkspaceManager";
import { PortfolioBasedWorkspaceManager } from "./PortfolioBasedWorkspaceManager";

export class PortfolioManager {
  constructor(private _WorkspaceManager: WorkspaceManager) {}

  private static _Instance: PortfolioManager | null = null;
  static GetModule(): ModuleDescription {
    return this.GetInstance()._Module!;
  }

  private static GetInstance(): PortfolioManager {
    if (!this._Instance) {
      this._Instance = new PortfolioManager(
        new PortfolioBasedWorkspaceManager()
      );
    }
    return this._Instance;
  }

  private _Module: ModuleDescription | null = null;

  public static SetModule(module: ModuleDescription) {
    this._Instance = null;
    this._Instance = new PortfolioManager(new PortfolioBasedWorkspaceManager());
    this._Instance._Module = module;
  }

  public static GetWorkspaceManager(): WorkspaceManager {
    return this._Instance!._WorkspaceManager;
  }
}
