import React from "react";
import { WorkspaceManager } from "../WorkspaceManager";
import { useParams } from "react-router-dom";
import { UsecaseState } from "ushell-modulebase";
import { TabItem } from "../TabItem";
import TabControl from "../_Organisms/TabControl";

const Workspace: React.FC<{
  workspaceManager: WorkspaceManager;
}> = ({ workspaceManager }) => {
  const { workspaceKey, usecaseId } = useParams();

  if (!workspaceKey) {
    return <div>Workspace without key</div>;
  }

  const usecaseStates: UsecaseState[] =
    workspaceManager.getUsecaseStates(workspaceKey);

  let activeUsecaseState: UsecaseState | undefined = usecaseStates.find(
    (ucs) => ucs.usecaseInstanceUid == usecaseId
  );

  if (!activeUsecaseState) {
    const staticUsecaseStates: UsecaseState[] = usecaseStates.filter(
      (ucs) => ucs.fixed
    );
    if (staticUsecaseStates.length == 0) {
      return <div>Empty Workspace</div>;
    } else {
      activeUsecaseState = staticUsecaseStates[0];
    }
  }

  const tabItems: TabItem[] = workspaceManager.getTabItems(usecaseStates);

  return (
    <div className="w-full flex">
      {/* Workspace: {workspaceKey}, UseCase: {activeUsecaseState.title} */}
      <TabControl tabItems={tabItems}></TabControl>
    </div>
  );
};

export default Workspace;
