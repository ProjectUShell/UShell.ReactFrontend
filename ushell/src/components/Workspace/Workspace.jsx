import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Tabs } from "antd";
import { getWorkspace } from "../../portfolio-handling/PortfolioService";
import { getAntdTabItems } from "../../portfolio-handling/MenuService";
import UseCaseStateContext from "../../portfolio-handling/UseCaseStateContext";

const Workspace = ({ portfolio }) => {
  const params = useParams();

  const onChange = (key) => {
    console.log(key);
  };

  const workspaceKey = params.workspaceKey;
  const useCaseKey = params.useCaseKey;
  const workspace = getWorkspace(portfolio, workspaceKey);

  const { useCaseState, setUseCaseState } = useContext(UseCaseStateContext);
  const navigate = useNavigate();
  const tabItems = getAntdTabItems(
    portfolio,
    workspace,
    useCaseState,
    navigate
  );

  // useCaseContext.test = (useCaseContext.test ? useCaseContext.test : 0) + 1;
  // useCaseContext.setStatesPerWorkspace("NENENENE");
  return <Tabs defaultActiveKey="1" onChange={onChange} items={tabItems} />;
};

export default Workspace;
