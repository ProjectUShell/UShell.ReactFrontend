// react
import React, { useState, useContext } from "react";

// antd
import { Menu, Layout, theme } from "antd";
const { Sider } = Layout;

// app
import {
  convertToAntdItems,
  getMenuItem,
} from "../../portfolio-handling/MenuService";
import { useNavigate, useParams } from "react-router-dom";
import UseCaseStateContext from "../../portfolio-handling/UseCaseStateContext";

const { useToken } = theme; 

const VerticalMenu = ({ menuItems, siderCollapsed, setSiderCollapsed }) => {
  const navigate = useNavigate();
  const params = useParams();

  const workspaceKey = params.workspaceKey;
  const useCaseId = params.useCaseKey;
  const { useCaseState, setUseCaseState } = useContext(UseCaseStateContext);
  const useCaseStates = useCaseState?.statesPerWorkspace[workspaceKey];
  const { token } = useToken();

  let useCaseKey = null;
  if (useCaseStates) {
    useCaseKey = useCaseStates.find((s) => s.usecaseInstanceUid == useCaseId);
  }
  const parentWorkspaceKey = useCaseState.parentWorkspaceKey;

  const items = convertToAntdItems(menuItems, false);

  const onSelectMenuItem = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    const menuItem = getMenuItem(menuItems, key);
    if (!menuItem.command) {
      console.error(`no command set in menuItem ${menuItem.label}`, menuItem);
    }
    menuItem.command(navigate);
  };

  console.log("workspaceKey", workspaceKey);
  console.log(
    "useCaseState?.statesPerWorkspace[workspaceKey]",
    useCaseState?.statesPerWorkspace[workspaceKey]
  );
  console.log("useCaseState", useCaseState);
  console.log("Selected useCaseKey", useCaseKey);

  return (
    <div className="mobileHidden">
      <Sider
        style={{
          overflow: "auto",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          marginTop: "44px",
          background: token.colorBgContainer,
          color: token.colorText
        }}
        collapsible
        collapsed={siderCollapsed}
        onCollapse={(value) => {
          setSiderCollapsed(value);
        }}
        width={200}
        className="site-layout-background"
      >
        {useCaseKey ? (
          <Menu
            mode="inline"
            style={{ height: "calc(100%-6px)", borderRight: 0 }}
            items={items}
            onSelect={onSelectMenuItem}
            defaultSelectedKeys={[workspaceKey]}
            selectedKeys={[workspaceKey]}
            defaultOpenKeys={[parentWorkspaceKey]}
          />
        ) : (
          <Menu
            mode="inline"
            style={{ height: "calc(100%-6px)", borderRight: 0 }}
            items={items}
            onSelect={onSelectMenuItem}
            defaultSelectedKeys={[workspaceKey]}
            defaultOpenKeys={[parentWorkspaceKey]}
          />
        )}
      </Sider>
    </div>
  );
};

export default VerticalMenu;
