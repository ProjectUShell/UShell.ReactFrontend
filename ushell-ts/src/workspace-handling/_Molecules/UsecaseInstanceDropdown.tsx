import React, { useState } from "react";
import { WorkspaceManager } from "../WorkspaceManager";
import Dropdown from "../../shell-layout/_Atoms/Dropdown";
import ClipboardIcon from "../../shell-layout/_Icons/ClipboardIcon";
import { UsecaseState } from "ushell-modulebase";
import CogWheelIcon from "ushell-common-components/dist/cjs/components/shell-layout/_Icons/CogWheelIcon";

export const UsecaseInstanceDropdownButton: React.FC<{
  workspaceManager: WorkspaceManager;
}> = ({ workspaceManager }) => {
  const openUsecaseStates: UsecaseState[] =
    workspaceManager.getDynamicUsecaseStates();
  return (
    <>
      <button
        className="relative align-middle"
        // onClick={() => setIsOpen((o) => !o)}
      >
        <ClipboardIcon size={1.2}></ClipboardIcon>
        {/* <CogWheelIcon size={1.2}></CogWheelIcon> */}
        <p className="absolute -right-1 -top-2 rounded-full w-4 h-4 bg-accent text-xs">
          {openUsecaseStates.length}
        </p>
      </button>
      {/* {isOpen && (
        <Dropdown setIsOpen={setIsOpen}>
          <div className="bg-backgroundone dark:bg-backgroundonedark p-1 rounded-md">
            {openUsecaseStates.map((ucs) => (
              <div
                key={ucs.usecaseInstanceUid}
                className="hover:bg-backgroundtwo dark:hover:bg-backgroundtwodark rounded-md"
              >
                <button onClick={() => workspaceManager.enterUsecase(ucs)}>
                  {workspaceManager.getTitleForUseCase(ucs)}
                </button>
              </div>
            ))}
          </div>
        </Dropdown>
      )} */}
    </>
  );
};

export const UsecaseInstanceDropdownContent: React.FC<{
  workspaceManager: WorkspaceManager;
}> = ({ workspaceManager }) => {
  const openUsecaseStates: UsecaseState[] =
    workspaceManager.getDynamicUsecaseStates();
  return (
    <div className="bg-backgroundone dark:bg-backgroundonedark p-1 rounded-md">
      {openUsecaseStates.length === 0 && (
        <div className="text-sm text-texttwo dark:text-texttwodark p-2">
          No open use cases
        </div>
      )}
      {openUsecaseStates.map((ucs) => (
        <div
          key={ucs.usecaseInstanceUid}
          className="hover:bg-backgroundtwo dark:hover:bg-backgroundtwodark rounded-md"
        >
          <button onClick={() => workspaceManager.enterUsecase(ucs)}>
            {workspaceManager.getTitleForUseCase(ucs)}
          </button>
        </div>
      ))}
    </div>
  );
};
