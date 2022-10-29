import { Menu, Layout } from "antd";
const { Sider } = Layout;

import React, { useContext, useState } from "react";

import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  DownOutlined,
  PlayCircleOutlined,
  GoogleOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  UserOutlined,
} from "@ant-design/icons";

const VerticalMenu = () => {
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

  const items2 = [
    getItem2("Option 1", "1", <PieChartOutlined />),
    getItem2("Option 2", "2", <DesktopOutlined />),
    getItem2("Option 3", "3", <ContainerOutlined />),

    getItem2("Navigation One", "sub1", <MailOutlined />, [
      getItem2("Option 5", "5"),
      getItem2("Option 6", "6"),
      getItem2("Option 7", "7"),
      getItem2("Option 8", "8"),
    ]),

    getItem2("Navigation Two", "sub2", <AppstoreOutlined />, [
      getItem2("Option 9", "9"),
      getItem2("Option 10", "10"),

      getItem2("Submenu", "sub3", null, [
        getItem2("Option 11", "11"),
        getItem2("Option 12", "12"),
      ]),
    ]),
  ];

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
          items={items2}
        />
      </Sider>
    </div>
  );
};

export default VerticalMenu;
