import { IDataSource, IWidgetHost, UsecaseState } from "ushell-modulebase";
import { SchemaRoot } from "fusefx-modeldescription";
import { PortfolioManager } from "./PortfolioManager";
import { CommandDescription } from "ushell-portfoliodescription";
import { TokenService } from "../authentication/TokenService";
import { DatasourceManager } from "../datasource-handling/DatasourceManager";

export class WidgetHost implements IWidgetHost {
  getApplicationScope() {
    return PortfolioManager.GetPortfolio().applicationScope;
  }

  getDataSource(dataSourceUid: string): Promise<IDataSource> {
    throw new Error("Method not implemented.");
  }

  getDataSourceForEntity(
    entityName: string,
    storeName?: string | undefined
  ): IDataSource {
    const result = DatasourceManager.Instance().tryGetDataSource(entityName);
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
