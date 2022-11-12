// react
import React, { useState, useContext } from "react";

// antd
import { Menu, Layout } from "antd";
const { Sider } = Layout;

// app
import {
  convertToAntdItems,
  getMenuItem,
} from "../../portfolio-handling/MenuService";
import { useNavigate, useParams } from "react-router-dom";
import UseCaseStateContext from "../../portfolio-handling/UseCaseStateContext";

const VerticalMenu = ({ menuItems, siderCollapsed, setSiderCollapsed }) => {
  
  const navigate = useNavigate();
  const params = useParams();

  const workspaceKey = params.workspaceKey;
  const { useCaseState, setUseCaseState } = useContext(UseCaseStateContext);
  const useCaseKey = useCaseState.usecaseKey;
  const parentWorkspaceKey = useCaseState.parentWorkspaceKey;

  const items = convertToAntdItems(menuItems, false);

  const onSelectMenuItem = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    const menuItem = getMenuItem(menuItems, key);
    if (!menuItem.command) {
      console.error(`no command set in menuItem ${menuItem.label}`, menuItem);
    }
    menuItem.command(navigate);
  };

  return (
    <div className="mobileHidden">
      <Sider
        style={{
          overflow: "auto",
          height: "calc(100vh - 85px)",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          marginTop: "58px",
        }}
        collapsible
        collapsed={siderCollapsed}
        onCollapse={(value) => {
          setSiderCollapsed(value);
        }}
        width={200}
        className="site-layout-background"
      >
        <Menu
          mode="inline"
          style={{ height: "100%", borderRight: 0 }}
          items={items}
          onSelect={onSelectMenuItem}        
          defaultSelectedKeys={[workspaceKey]}
          selectedKeys={[useCaseKey]}
          defaultOpenKeys={[parentWorkspaceKey]}           
        />
      </Sider>
    </div>
  );
};

export default VerticalMenu;
