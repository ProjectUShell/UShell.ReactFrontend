import React from "react";
import { WorkspaceManager } from "../WorkspaceManager";
import { useParams } from "react-router-dom";
import { UsecaseState } from "ushell-modulebase";
import { TabItem } from "../TabItem";
import TabControl from "../_Organisms/TabControl";
import { PortfolioManager } from "../../portfolio-handling/PortfolioManager";
import { WidgetHost } from "../../portfolio-handling/WidgetHost";

const Workspace: React.FC<{}> = ({}) => {
  const { workspaceKey, usecaseId } = useParams();

  if (!workspaceKey) {
    const homeWorkspaceKey: string =
      PortfolioManager.GetPortfolio().landingWorkspaceName;

    const usecaseStates: UsecaseState[] =
      PortfolioManager.GetWorkspaceManager().getUsecaseStates(homeWorkspaceKey);
    const staticUsecaseStates: UsecaseState[] = usecaseStates.filter(
      (ucs) => ucs.fixed
    );
    let activeUsecaseState: UsecaseState;
    if (staticUsecaseStates.length == 0) {
      return <div>no usecases</div>;
    } else {
      activeUsecaseState = staticUsecaseStates[0];
    }
    return PortfolioManager.GetWorkspaceManager().renderUsecase(
      activeUsecaseState,
      { state: activeUsecaseState, widgetHost: new WidgetHost() }
    );
  }

  const usecaseStates: UsecaseState[] =
    PortfolioManager.GetWorkspaceManager().getUsecaseStates(workspaceKey);

  let activeUsecaseState: UsecaseState | undefined = usecaseStates.find(
    (ucs) => ucs.usecaseInstanceUid == usecaseId
  ); //TODO_KRN how to determine which usecase is active? => save in wsm

  // TODO Idee: usecaseKey-singletonActionKey (oder instanceUid) als key im localstorage für einzelne usecaseStates
  console.log("workspaceKey", workspaceKey);

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
  if (usecaseStates.length == 1) {
    return PortfolioManager.GetWorkspaceManager().renderUsecase(
      activeUsecaseState,
      { state: activeUsecaseState, widgetHost: new WidgetHost() }
    );
  }
  const tabItems: TabItem[] =
    PortfolioManager.GetWorkspaceManager().getTabItems(usecaseStates);
  const activeIndex: number = tabItems.findIndex(
    (ti) => ti.id == activeUsecaseState!.usecaseInstanceUid
  );

  return (
    <div className="w-full h-full flex">
      {/* Workspace: {workspaceKey}, UseCase: {activeUsecaseState.title} */}
      <TabControl
        tabItems={tabItems}
        initialActiveTabIndex={activeIndex}
        onTabClose={(ti: TabItem) =>
          PortfolioManager.GetWorkspaceManager().terminateUsecase(ti.tag)
        }
        onTabChange={(ti: TabItem) =>
          PortfolioManager.GetWorkspaceManager().enterUsecase(ti.tag)
        }
      ></TabControl>
    </div>
  );
};

export default Workspace;
