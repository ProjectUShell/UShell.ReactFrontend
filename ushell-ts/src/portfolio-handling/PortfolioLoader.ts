import {
  ModuleDescription,
  PortfolioDescription,
} from "ushell-portfoliodescription";

export function loadModuleDescription(): Promise<ModuleDescription> {
  const result: ModuleDescription = new ModuleDescription();
  return fetch("default.portfolio.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (portfolio) {
      console.log("portfolio", portfolio)
      portfolio.moduleDescriptions = [];
      // befülle das protfolio-Objekt mit den ModuleDescriptions
      return fillModuleDescriptions(portfolio, result, 0);
    });
}

function fillModuleDescriptions(
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
      console.log("md", md);
      // füge die moduleDescription in das porfolio ein
      md.commands.forEach((c) => result.commands.push(c));
      md.usecases?.forEach((c) => result.usecases.push(c));
      md.workspaces?.forEach((c) => result.workspaces.push(c));
      md.staticUsecaseAssignments?.forEach((c) => result.staticUsecaseAssignments.push(c))
      // falls noch nicht fertig, rufe diese Funktion rekursiv mit dem nächsten Index auf,
      // sonst returne portfolio
      if (index < urls.length - 1) {
        return fillModuleDescriptions(portfolio, result, index + 1);
      } else {
        return result;
      }
    });
}
