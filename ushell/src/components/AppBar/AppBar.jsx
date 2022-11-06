// react
import React, { useContext } from "react";

// antd
import { Layout, Menu, Button, Badge } from "antd";
const { Header } = Layout;

import { UnorderedListOutlined } from "@ant-design/icons";

// app
import { getWorkspaces } from "../../portfolio-handling/PortfolioService";
import { currentUsecasesOfWorkspace } from "../../portfolio-handling/UseCaseService";
import UseCaseStateContext from "../../portfolio-handling/UseCaseStateContext";
import { getMenuItem } from "../../portfolio-handling/MenuService";
import { useNavigate } from "react-router-dom";

const AppBar = ({ showDrawer, portfolio }) => {
  const navigate = useNavigate();
  const workspaces = getWorkspaces(portfolio);
  const useCaseContext = useContext(UseCaseStateContext);

  const useCaseItems = workspaces.map((ws) => {
    return {
      key: ws.workspaceKey,
      type: "group",
      label: ws.workspaceTitle,
      children: currentUsecasesOfWorkspace(
        portfolio,
        ws.workspaceKey,
        useCaseContext.useCaseState
      )
        .filter((uc) => !uc.fixed)
        .map((uc) => {
          return {
            key: uc.usecaseInstanceUid,
            label: ` ${uc.title} ${uc.input}`,
            item: uc,
          };
        }),
    };
  });

  let numUseCases = 0;
  useCaseItems.forEach((wsi) => (numUseCases += wsi.children.length));

  const onSelectMenuItem = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    const useCaseItem = getMenuItem(useCaseItems, key);
    navigate(`../${useCaseItem.item.parentWorkspaceKey}/${key}`);
  };

  const topBar = (
    <Menu
      mode="horizontal"
      defaultSelectedKeys={["2"]}
      items={[
        {
          key: "1",
          label: "",
          icon: (
            <Badge count={numUseCases}>
              <UnorderedListOutlined />
              {/* <Avatar shape="square" size="large" /> */}
            </Badge>
          ),
          children: useCaseItems,
        },
      ]}
      triggerSubMenuAction="click"
      onSelect={onSelectMenuItem}
    />
  );

  return (
    <Header>
      <div className="header">
        <div className="logo">
          <i className="fa-brands fa-uniregistry"></i>
          Shell
        </div>
        <div className="mobileHidden">{topBar}</div>
        <div className="mobileVisible">
          {topBar}
          <Button type="primary" onClick={showDrawer}>
            <i className="fas fa-bars"></i>
          </Button>
        </div>
      </div>
    </Header>
  );
};

export default AppBar;
