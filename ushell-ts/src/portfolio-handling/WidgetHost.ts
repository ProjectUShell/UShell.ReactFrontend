import { IDataSource, IWidgetHost, UsecaseState } from "ushell-modulebase";
import { SchemaRoot } from "fusefx-modeldescription";
import { PortfolioManager } from "./PortfolioManager";
import { CommandDescription } from "ushell-portfoliodescription";
import { TokenService } from "../authentication/TokenService";
import { DatasourceManager } from "../datasource-handling/DatasourceManager";
import { WorkspaceManager } from "../workspace-handling/WorkspaceManager";

export class WidgetHost implements IWidgetHost {
  tryGetDataSource(entityName: string, storeName?: string): IDataSource | null {
    return this.getDataSourceForEntity(entityName, storeName);
  }
  getApplicationScope() {
    return PortfolioManager.GetPortfolio().applicationScope;
  }
  switchScope(scopeKey: string, targetValue: any) {
    PortfolioManager.GetWorkspaceManager().switchScope(scopeKey, targetValue);
  }
  getApplicationScopeValues(): {
    [dimension: string]: any;
  } {
    const appScope = PortfolioManager.GetPortfolio().applicationScope;
    if (!appScope) return {};
    const result: any = {};
    Object.keys(appScope).forEach((apk) => {
      result[apk] = appScope[apk].value;
    });
    return result;
  }

  getDataSource(dataSourceUid: string): Promise<IDataSource> {
    throw new Error("Method not implemented.");
  }

  getDataSourceForEntity(
    entityName: string,
    storeName?: string | undefined
  ): IDataSource {
    const result = DatasourceManager.Instance().tryGetDataSource(
      entityName,
      storeName
    );
    if (!result) throw `No DataSource for entityName ${entityName}`;
    return result;
  }

  getSchemaRoot(): SchemaRoot {
    return DatasourceManager.Instance().getSchemaRoot();
  }

  populateChangedState(changedState: UsecaseState): void {
    PortfolioManager.GetWorkspaceManager().updateUsecaseState(changedState);
  }

  subscribeEvent(name: string, subscriber: (args: object) => void): void {
    throw new Error("Method not implemented.");
  }

  pushBreadcrumbItem(id: string, label: string, command: () => void) {
    PortfolioManager.GetWorkspaceManager().pushBreadcrumbItem(
      id,
      label,
      command
    );
  }

  forceBreadcrumbItem(id: string) {
    PortfolioManager.GetWorkspaceManager().forceBreadcrumbItem(id);
  }

  static fireEvent1(name: string, args: object): void {
    const command: CommandDescription | undefined =
      PortfolioManager.GetModule().commands.find(
        (c) => c.uniqueCommandKey == name
      );
    if (!command) {
      console.error("No command with given name", name);
      return;
    }
    PortfolioManager.GetWorkspaceManager().executeCommand(command, args, {});
  }

  fireEvent(name: string, args: object): void {
    const command: CommandDescription | undefined =
      PortfolioManager.GetModule().commands.find(
        (c) => c.uniqueCommandKey == name
      );
    if (!command) {
      console.error("No command with given name", name);
      return;
    }
    PortfolioManager.GetWorkspaceManager().executeCommand(command, args, {});
  }

  getAccessToken(
    tokenSourceUid: string
  ): Promise<{ token: string; content: object } | null> {
    return TokenService.getTokenAndContent(tokenSourceUid);
  }

  get allignWidgetNavPanelLeft(): boolean {
    throw new Error("Method not implemented.");
  }
}
