import React from "react";
import { PortfolioManager } from "../PortfolioManager";

const PortfolioView = () => {
  const portfiolio = PortfolioManager.GetPortfolio();
  const module = PortfolioManager.GetModule();
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-2 overflow-hidden">
      <h1 className="text-2xl font-bold mb-4">{portfiolio.applicationTitle}</h1>
      <p className="text-lg mb-8">
        This is a default landing page for the portfolio
      </p>
      <h1 className="text-xl font-bold">Workspaces</h1>
      <div className="flex flex-col items-center h-full w-full max-w-4xl p-4 overflow-auto">
        {module.workspaces.map((workspace) => (
          <div
            key={workspace.workspaceKey}
            className="w-full max-w-md p-4 mb-4 border dark:border-contentBorderDark rounded-lg shadow-md
             hover:bg-contentHover dark:hover:bg-contentHoverDark cursor-pointer"
            onClick={() => {
              PortfolioManager.GetWorkspaceManager().activateWorkspace(
                workspace.workspaceKey
              );
              PortfolioManager.GetWorkspaceManager().trySetActiveMenuItem(
                workspace.workspaceKey
              );
            }}
          >
            <h2 className="text-xl font-semibold">{workspace.workspaceKey}</h2>
            <p className="text-texttwo dark:text-texttwodark">
              Description of Workspaces???
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioView;
