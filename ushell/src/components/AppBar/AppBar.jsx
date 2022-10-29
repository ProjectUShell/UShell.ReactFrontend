import { Breadcrumb, Layout, Menu, Button, Drawer } from "antd";
const { Header } = Layout;

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

const AppBar = ({ showDrawer }) => {

  const topBar = (
    <Menu
      mode="horizontal"
      defaultSelectedKeys={["2"]}
      items={new Array(2).fill(null).map((_, index) => {
        const key = index + 1;
        return {
          key,
          label: "",
          icon: <GoogleOutlined />,
        };
      })}
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
  )
}

export default AppBar