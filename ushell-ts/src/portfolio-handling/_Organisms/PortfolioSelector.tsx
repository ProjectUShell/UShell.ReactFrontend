import React, { useEffect, useState } from "react";
import { PortfolioConnector } from "../PortfolioConnector";
import { PortfolioEntry } from "../PortfolioEntry";
import { PortfolioDescription } from "ushell-portfoliodescription";

const PortfolioSelector: React.FC<{
  url: string;
  onPortfolioSelected: (portfolioUrl: string) => void;
}> = ({ url, onPortfolioSelected }) => {
  const [portfolioEntries, setPortfolioEntries] = useState<PortfolioEntry[]>(
    []
  );

  useEffect(() => {
    PortfolioConnector.getPortfolioIndex(url).then((pi) => {
      setPortfolioEntries(pi);
    });
  }, [url]);

  return (
    <div className="m-auto bg-backgroundfour dark:bg-backgroundfourdark p-2 rounded-md">
      <h1 className="text-lg border-b">Select a portfolio</h1>
      <div className="p-2">
        {portfolioEntries.map((pe) => (
          <div
            key={pe.portfolioUrl}
            className="m-1 hover:bg-backgroundthree hover:dark:bg-backgroundthreedark p-2 rounded-md"
          >
            <button onClick={(e) => onPortfolioSelected(pe.portfolioUrl)}>
              {pe.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioSelector;
