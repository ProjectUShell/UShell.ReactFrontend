// react
import React, { useState } from "react";

// antd
import { Menu, Layout } from "antd";
const { Sider } = Layout;

// app
import {
  convertToAntdItems,
  getMenuItem,
} from "../../portfolio-handling/MenuService";
import { useNavigate } from "react-router-dom";

const VerticalMenu = ({ menuItems, siderCollapsed, setSiderCollapsed }) => {
  // const [siderCollapsed, setSiderCollapsed] = useState(false);

  const navigate = useNavigate();

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
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          style={{ height: "100%", borderRight: 0 }}
          items={items}
          onSelect={onSelectMenuItem}
        />
      </Sider>
    </div>
  );
};

export default VerticalMenu;
