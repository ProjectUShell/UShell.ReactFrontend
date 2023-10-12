import React, { useState } from "react";
import { WorkspaceManager } from "../WorkspaceManager";
import Dropdown from "../../shell-layout/_Atoms/Dropdown";
import ClipboardIcon from "../../shell-layout/_Icons/ClipboardIcon";
import { UsecaseState } from "ushell-modulebase";

const UsecaseInstanceDropdown: React.FC<{
  workspaceManager: WorkspaceManager;
}> = ({ workspaceManager }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openUsecaseStates: UsecaseState[] =
    workspaceManager.getDynamicUsecaseStates();
  return (
    <div>
      <button className="relative" onClick={() => setIsOpen((o) => !o)}>
        <ClipboardIcon></ClipboardIcon>
        <p className="absolute -right-1 -top-2 rounded-full w-4 h-4 bg-accent text-xs">
          {openUsecaseStates.length}
        </p>
      </button>
      {isOpen && (
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
      )}
    </div>
  );
};

export default UsecaseInstanceDropdown;
