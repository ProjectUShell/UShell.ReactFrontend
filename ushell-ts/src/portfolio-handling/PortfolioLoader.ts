import {
  ModuleDescription,
  PortfolioDescription,
} from "ushell-portfoliodescription";

export class PortfolioLoader {
  private static _DefaultPortfolioModule: ModuleDescription | null = null;
  private static _DefaultPortfolio: PortfolioDescription | null = null;

  private static GetDefaultPortfolio(portfolioLocation: string): Promise<{
    portfolio: PortfolioDescription;
    module: ModuleDescription;
  }> {
    if (PortfolioLoader._DefaultPortfolio) {
      return new Promise<{
        portfolio: PortfolioDescription;
        module: ModuleDescription;
      }>((resolve, reject) => {
        resolve({
          portfolio: PortfolioLoader._DefaultPortfolio!,
          module: this._DefaultPortfolioModule!,
        });
      });
    }
    return PortfolioLoader.loadFromUrl(portfolioLocation, "default.portfolio");
  }

  private static loadFromUrl(
    portfolioLocation: string,
    portfolioName: string
  ): Promise<{
    portfolio: PortfolioDescription;
    module: ModuleDescription;
  }> {
    const url1: string =
      this.combineUrl(portfolioLocation, `${portfolioName}`) +
      ".json";

    return fetch(url1, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (portfolio) {
        portfolio.moduleDescriptions = [];

        // befülle das protfolio-Objekt mit den ModuleDescriptions
        const result: ModuleDescription = new ModuleDescription();
        const actualPortfolio: PortfolioDescription =
          portfolio.portfolioDescriptionJson
            ? JSON.parse(portfolio.portfolioDescriptionJson)
            : portfolio;
        return PortfolioLoader.fillModuleDescriptions(
          actualPortfolio,
          result,
          0
        ).then((md) => {
          return {
            portfolio: actualPortfolio,
            module: md,
          };
        });
      });
  }

  static loadModuleDescription(
    portfolioLocation: string,
    portfolioName: string | null
  ): Promise<{ portfolio: PortfolioDescription; module: ModuleDescription }> {
    if (!portfolioName) {
      return PortfolioLoader.GetDefaultPortfolio(portfolioLocation);
    }
    return this.loadFromUrl(portfolioLocation, portfolioName);
  }

  private static combineUrl(base: string, ex: string) {
    if (base && base !== "") {
      if (base.endsWith("/")) {
        return base + ex;
      }
      return base + "/" + ex;
    }
    return ex;
  }

  static fillModuleDescriptions(
    portfolio: PortfolioDescription,
    result: ModuleDescription,
    index: number
  ): Promise<ModuleDescription> {
    const urls = portfolio.moduleDescriptionUrls;
    return fetch(`${urls[index]}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((md: ModuleDescription) => {
        // füge die moduleDescription in das porfolio ein
        md.commands?.forEach((c) => result.commands.push(c));
        md.usecases?.forEach((c) => result.usecases.push(c));
        md.workspaces?.forEach((c) => result.workspaces.push(c));
        md.staticUsecaseAssignments?.forEach((c) =>
          result.staticUsecaseAssignments.push(c)
        );
        // falls noch nicht fertig, rufe diese Funktion rekursiv mit dem nächsten Index auf,
        // sonst returne portfolio
        if (index < urls.length - 1) {
          return PortfolioLoader.fillModuleDescriptions(
            portfolio,
            result,
            index + 1
          );
        } else {
          return result;
        }
      });
  }
}
