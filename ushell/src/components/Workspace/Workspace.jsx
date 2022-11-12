// react
import React, { useContext } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

// antd
import { Tabs } from "antd";

// app
import { getHomeUseCase, getWorkspace } from "../../portfolio-handling/PortfolioService";
import { getAntdTabItems } from "../../portfolio-handling/MenuService";
import UseCaseStateContext from "../../portfolio-handling/UseCaseStateContext";

// css
import "./Workspace.css";
import { rootUrlPath } from "../../constants";
import ModuleView from "../ModuleView/ModuleView";
import ModuleViewSuspense from "../ModuleView/ModuleViewSuspense";

const Workspace = ({ portfolio }) => {
  const params = useParams();

  const navigate = useNavigate();
  const { useCaseState, setUseCaseState } = useContext(UseCaseStateContext);

  const workspaceKey = params.workspaceKey;

  if (!workspaceKey) {
    const startExecuteCommand = (commandKey, input) => {
      const commandDescription = getCommand(portfolio, commandKey);

      if (!commandDescription) {
        console.error(`No Command with key ${commandKey}`);
      }
      if (commandDescription.commandType == "activate-workspace") {
      } else if (commandDescription.commandType == "start-useCase") {
        EnterNewUsecase(
          portfolio,
          useCaseState,
          commandDescription.targetUseCaseKey,
          commandDescription.targetWorkspaceKey,
          input,
          navigate,
          true
        );
      }
    };

    const useCase = getHomeUseCase(portfolio);

    return <ModuleViewSuspense startExecuteCommand={startExecuteCommand} portfolio ={portfolio} useCase={useCase}></ModuleViewSuspense>;
  }

  const useCaseKey = params.useCaseKey;
  const workspace = getWorkspace(portfolio, workspaceKey);

  const onChange = (key) => {
    navigate(`../${rootUrlPath}${workspaceKey}/${key}`);

    console.log("tab changed", key);
  };

 

  const tabItems = getAntdTabItems(
    portfolio,
    workspace,
    useCaseState,
    navigate
  );

  const activeTab = tabItems.find((t) => t.key == useCaseKey);

  if (!activeTab && useCaseKey) {
    navigate(`../${rootUrlPath}${workspaceKey}`);
  }

  return useCaseKey ? (
    <Tabs
      activeKey={useCaseKey}
      defaultActiveKey={0}
      onChange={onChange}
      items={tabItems}
    />
  ) : (
    <Tabs defaultActiveKey={0} onChange={onChange} items={tabItems} />
  );
};

export default Workspace;
