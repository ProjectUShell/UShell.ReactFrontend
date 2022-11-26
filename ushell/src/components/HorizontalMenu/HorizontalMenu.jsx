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

import { Menu, Layout, theme } from "antd";

// app
import {
  convertToAntdItems,
  getMenuItem,
} from "../../portfolio-handling/MenuService";
import { useNavigate, useParams } from "react-router-dom";
import UseCaseStateContext from "../../portfolio-handling/UseCaseStateContext";

const { useToken } = theme;

const HorizontalMenu = ({ menuItems }) => {
  const navigate = useNavigate();
  const params = useParams();
  const { token } = useToken();

  const workspaceKey = params.workspaceKey;
  const { useCaseState, setUseCaseState } = useContext(UseCaseStateContext);
  const useCaseKey = useCaseState.usecaseKey;
  const parentWorkspaceKey = useCaseState.parentWorkspaceKey;

  const items = convertToAntdItems(menuItems, true);

  const onSelectMenuItem = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    const menuItem = getMenuItem(menuItems, key);
    if (!menuItem.command) {
      console.error(`no command set in menuItem ${menuItem.label}`, menuItem);
    }
    menuItem.command(navigate, useCaseState, null);
  };

  return (
    <Header
      style={{
        zIndex: "998",
      }}
    >
      <div className="container-fluid2">
        <div className="mobileHidden">
          <div
            className="header2"
            style={{
              background: token.colorBgContainer,
            }}
          >
            <Menu
              mode="horizontal"
              items={items}
              triggerSubMenuAction="click"
              onSelect={onSelectMenuItem}
              defaultSelectedKeys={[workspaceKey]}
              selectedKeys={[useCaseKey]}
              defaultOpenKeys={[parentWorkspaceKey]}
            />
          </div>
        </div>
      </div>
    </Header>
  );
};

export default HorizontalMenu;
