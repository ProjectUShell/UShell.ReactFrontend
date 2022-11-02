// react
import React, { useState } from "react";

// antd
import { Menu, Layout } from "antd";
const { Sider } = Layout;

// app
import { convertToAntdItems } from "../../portfolio-handling/MenuService";

const VerticalMenu = ({ menuItems }) => {
  const [siderCollapsed2, setSiderCollapsed2] = useState(false);

  function getItem2(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const items = convertToAntdItems(menuItems, false);

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
        collapsed={siderCollapsed2}
        onCollapse={(value) => setSiderCollapsed2(value)}
        width={200}
        className="site-layout-background"
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          style={{ height: "100%", borderRight: 0 }}
          items={items}
        />
      </Sider>
    </div>
  );
};

export default VerticalMenu;
