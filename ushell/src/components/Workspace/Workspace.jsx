// react
import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

// antd
import { Tabs } from "antd";

// app
import { getWorkspace } from "../../portfolio-handling/PortfolioService";
import { getAntdTabItems } from "../../portfolio-handling/MenuService";
import UseCaseStateContext from "../../portfolio-handling/UseCaseStateContext";

// css
import './Workspace.css';

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

  const activeTab = tabItems.find((t) => t.key == useCaseKey);
  if (!activeTab && useCaseKey) {
    navigate(`../${workspaceKey}`);
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
