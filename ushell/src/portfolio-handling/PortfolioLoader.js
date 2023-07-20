import { PortfolioModel } from "./PortfolioModel";

export class PortfolioLoader {
  static loadModulePortfolio() {
    return fetch("moduleportfolio.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(function (response) {
      return response.json();
    });
  }

  static loadModulePortfolio2() {
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
        portfolio.moduleDescriptions = [];
        // befülle das protfolio-Objekt mit den ModuleDescriptions
        return fillModuleDescriptions(portfolio, 0);
      });
  }
}

/// befüllt das portfolio mit den ModuleDescriptions via ModuleDescriptionUrls
/// returns Promise<Portfolio>
function fillModuleDescriptions(portfolio, index) {
  const urls = portfolio.moduleDescriptionUrls;
  return fetch(`${urls[index]}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (moduleDescription) {
      // füge die moduleDescription in das porfolio ein
      portfolio.moduleDescriptions.push(moduleDescription);
      // falls noch nicht fertig, rufe diese Funktion rekursiv mit dem nächsten Index auf,
      // sonst returne portfolio
      if (index < urls.length - 1) {
        return fillModuleDescriptions(portfolio, index + 1);
      } else {
        return portfolio;
      }
    });
}
