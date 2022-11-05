// react
import React, { useContext, useState } from "react";

// antd
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
const { Header } = Layout;

// app
import { Menu, Layout } from "antd";
import {
  convertToAntdItems,
  getMenuItem,
} from "../../portfolio-handling/MenuService";
import { useNavigate } from "react-router-dom";

const HorizontalMenu = ({ menuItems }) => {

  const navigate = useNavigate();  

  const items2 = convertToAntdItems(menuItems, true);

  const onSelectMenuItem = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    const menuItem = getMenuItem(menuItems, key);
    if (!menuItem.command) {
     console.error(`no command set in menuItem ${menuItem.label}`, menuItem)
    }    
    menuItem.command(navigate);
  };

  return (
    <Header
      style={{
        zIndex: "998",
      }}
    >
      <div className="container-fluid2">
        <div className="mobileHidden">
          <div className="header2">
            <Menu
              mode="horizontal"
              defaultSelectedKeys={["2"]}
              items={items2}
              triggerSubMenuAction="click"
              onSelect={onSelectMenuItem}
            />
          </div>
        </div>
      </div>
    </Header>
  );
};

export default HorizontalMenu;
