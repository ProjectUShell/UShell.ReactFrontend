export class PortfolioConnector {
  private static async post(url: string, bodyParams: any = null): Promise<any> {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();

    return content;
  }

  static async getPortfolioIndex(url: string): Promise<any> {
    const url1: string = url.endsWith("/")
      ? url + `PortfolioIndex.json`
      : url + "/" + `PortfolioIndex.json`;
    return this.post(url1)
      .then((r) => r)
      .catch((e) => null);
  }
}
