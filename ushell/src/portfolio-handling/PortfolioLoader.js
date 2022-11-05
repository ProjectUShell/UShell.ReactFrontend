import { PortfolioModel } from "./PortfolioModel";

export class PortfolioLoader {
  loadModulePortfolio() {
    return fetch("moduleportfolio2.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(function (response) {
      return response.json();
    });
  }
}
