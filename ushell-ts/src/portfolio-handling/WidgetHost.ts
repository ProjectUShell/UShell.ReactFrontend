import { IDataSource, IWidgetHost, UsecaseState } from "ushell-modulebase";
import { PortfolioManager } from "./PortfolioManager";
import { CommandDescription } from "ushell-portfoliodescription";
import { TokenService } from "../authentication/TokenService";

export class WidgetHost implements IWidgetHost {
  getApplicationScope() {
    return PortfolioManager.GetPortfolio().applicationScope;
  }

  getDataSourceForEntity(
    entityName: string,
    storeName?: string | undefined
  ): Promise<IDataSource> {
    throw new Error("Method not implemented.");
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

  getDataSource(dataSourceUid: string): Promise<IDataSource> {
    throw new Error("Method not implemented.");
  }

  get allignWidgetNavPanelLeft(): boolean {
    throw new Error("Method not implemented.");
  }
}
