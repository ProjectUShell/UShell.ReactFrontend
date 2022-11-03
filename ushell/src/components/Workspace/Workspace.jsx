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

  const useCaseContext = useContext(UseCaseStateContext);
  const navigate = useNavigate();

  console.log("workspace", workspace);
  console.log("useCaseKey", useCaseKey);
  console.log("portfolio", portfolio);
  console.log(
    "workspace?.defaultStaticUseCaseKeys",
    workspace?.defaultStaticUseCaseKeys
  );
  const tabItems = getAntdTabItems(
    portfolio,
    workspace?.defaultStaticUseCaseKeys,
    useCaseContext,
    navigate
  );
  console.log("tabItems", tabItems);
  return <Tabs defaultActiveKey="1" onChange={onChange} items={tabItems} />;
};

export default Workspace;
