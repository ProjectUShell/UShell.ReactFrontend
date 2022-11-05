import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Tabs } from "antd";
import { getWorkspace } from "../../portfolio-handling/PortfolioService";
import { getAntdTabItems } from "../../portfolio-handling/MenuService";
import UseCaseStateContext from "../../portfolio-handling/UseCaseStateContext";

const Workspace = ({ portfolio }) => {
  const params = useParams();
  const navigate = useNavigate();

  const workspaceKey = params.workspaceKey;
  const useCaseKey = params.useCaseKey;
  const workspace = getWorkspace(portfolio, workspaceKey);

  const onChange = (key) => {
    navigate(`../${workspaceKey}/${key}`);

    console.log("tab changed", key);
  };

  const { useCaseState, setUseCaseState } = useContext(UseCaseStateContext);
  const tabItems = getAntdTabItems(
    portfolio,
    workspace,
    useCaseState,
    navigate
  );

  // useCaseContext.test = (useCaseContext.test ? useCaseContext.test : 0) + 1;
  // useCaseContext.setStatesPerWorkspace("NENENENE");
  const selectedTabKey = `'${useCaseKey}'`;
  console.log("tabs", tabItems);
  console.log("selected tab", selectedTabKey);
  return useCaseKey ? (
    <Tabs
      activeKey={useCaseKey}
      defaultActiveKey={selectedTabKey}
      onChange={onChange}
      items={tabItems}
    />
  ) : (
    <Tabs
      defaultActiveKey={selectedTabKey}
      onChange={onChange}
      items={tabItems}
    />
  );
};

export default Workspace;
