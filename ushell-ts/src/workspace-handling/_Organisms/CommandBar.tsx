import React from "react";
import { CommandDescription } from "ushell-portfoliodescription";
import { PortfolioManager } from "../../portfolio-handling/PortfolioManager";
import { IWidget, UsecaseState } from "ushell-modulebase";

const CommandBar: React.FC<{
  commands: CommandDescription[];
  usecaseState: UsecaseState;
}> = ({ commands, usecaseState }) => {
  return (
    <>
      {commands.map((c) => (
        <button
          className="hover:bg-bg1 dark:hover:bg-bg1dark 
          border border-navigationBorder dark:border-navigationBorderDark p-1 rounded-sm"
          onClick={() =>
            PortfolioManager.GetWorkspaceManager().executeCommand(
              c,
              null,
              PortfolioManager.GetWorkspaceManager().getUsecaseState(
                usecaseState.parentWorkspaceKey,
                usecaseState.usecaseInstanceUid
              )?.unitOfWork
            )
          }
        >
          {c.label}
        </button>
      ))}
    </>
  );
};

export default CommandBar;
