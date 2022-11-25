// react
import React, { useContext } from "react";

// antd
import { Layout, Menu, Button, Badge, Switch } from "antd";
const { Header } = Layout;

import { UnorderedListOutlined } from "@ant-design/icons";

// app
import {
  getTitle,
  getWorkspaces,
} from "../../portfolio-handling/PortfolioService";
import { currentUsecasesOfWorkspace } from "../../portfolio-handling/UseCaseService";
import { getMenuItem } from "../../portfolio-handling/MenuService";
import { useNavigate } from "react-router-dom";
import { setDarkMode, setLightMode } from "../Settings/SettingsService";
import UseCaseStateContext from "../../portfolio-handling/UseCaseStateContext";
import { LayoutModeContext } from "../Settings/settingsContext";
import { ColorModeContext } from "../Settings/settingsContext";
import { rootUrlPath } from "../../constants";

import "./AppBar.css";

const AppBar = ({ showDrawer, portfolio }) => {
  const navigate = useNavigate();
  const workspaces = getWorkspaces(portfolio);
  const useCaseContext = useContext(UseCaseStateContext);
  let { layoutMode, setLayoutMode } = useContext(LayoutModeContext);
  let { colorMode, setColorMode } = useContext(ColorModeContext);

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
    if (!useCaseItem?.item) {
      return;
    }
    navigate(`../${rootUrlPath}${useCaseItem.item.parentWorkspaceKey}/${key}`);
  };

  const settingsItems = [
    {
      key: "colorMode",
      label: "",
      icon: (
        <Switch
          checkedChildren="Dark Mode"
          unCheckedChildren="Light Mode"
          checked={colorMode == "dark"}
          onChange={(checked, event) => {
            if (checked) {
              setColorMode("dark");
            } else {
              setColorMode("light");
            }
          }}
        />
      ),
    },
    {
      key: "menuMode",
      label: "",
      icon: (
        <Switch
          checkedChildren="Horizontal Menu"
          unCheckedChildren="Vertical Menu"
          checked={layoutMode == "horizontal"}
          onChange={(checked, event) => {
            if (checked) {
              setLayoutMode("horizontal");
            } else {
              setLayoutMode("vertical");
            }
          }}
        />
      ),
    },
  ];

  const topBar = (
    <Menu
      style={{
        background: 'none'
      }}
      mode="horizontal"
      items={[
        {
          key: "settings",
          label: "",
          icon: (
            <Badge count={numUseCases}>
              <UnorderedListOutlined />
              {/* <Avatar shape="square" size="large" /> */}
            </Badge>
          ),
          children: useCaseItems,
        },
        {
          key: "1232",
          label: "",
          icon: <i className="fas fa-cog" />,
          children: settingsItems,
        },
      ]}
      triggerSubMenuAction="click"
      onSelect={onSelectMenuItem}
      selectedKeys={[]}
    />
  );

  const title = getTitle(portfolio);

  const titleDiv = title ? (
    <div className="shell__app-bar_title">
      <span>{title}</span>
    </div>
  ) : (
    <div className="logo">
      <i className="fa-brands fa-uniregistry"></i>
      Shell
    </div>
  );

  return (
    <Header>
      <div className="header">
        <a href="/">{titleDiv}</a>
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
