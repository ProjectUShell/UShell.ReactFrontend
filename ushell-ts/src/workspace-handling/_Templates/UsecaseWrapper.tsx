import React from "react";
import { CommandDescription } from "ushell-portfoliodescription";
import CommandBar from "../_Organisms/CommandBar";
import { UsecaseState } from "ushell-modulebase";

const UsecaseWrapper: React.FC<{
  children: any;
  commands: CommandDescription[];
  usecaseState: UsecaseState;
}> = ({ children, commands, usecaseState }) => {
  return (
    <div className="w-full h-full flex flex-col">
      {commands.length > 0 && (
        <div
          className="bg-navigation dark:bg-navigationDark p-2 
          border-b border-navigationBorder dark:border-navigationBorderDark"
        >
          <CommandBar
            commands={commands}
            usecaseState={usecaseState}
          ></CommandBar>
        </div>
      )}
      {children}
    </div>
  );
};

export default UsecaseWrapper;
