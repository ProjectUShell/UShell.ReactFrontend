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
}
