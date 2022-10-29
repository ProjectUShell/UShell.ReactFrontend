import { Menu, Layout } from "antd";
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

const HorizontalMenu = () => {
  const items = [
    {
      label: (
        <span>
          Navigation 1 <DownOutlined className="subMenuExpandIcon" />
        </span>
      ),
      key: "mail",
      icon: <MailOutlined />,
      children: [
        {
          type: "group",
          label: "Item 1",
          key: "sub1",
          children: [
            {
              label: "Option 1",
              key: "setting:1",
            },
            {
              label: "Option 2",
              key: "setting:2",
            },
          ],
        },
        {
          type: "group",
          label: "Item 2",
          children: [
            {
              label: "Option 3",
              key: "setting:3",
            },
            {
              label: "Option 4",
              key: "setting:4",
            },
          ],
        },
      ],
    },
    {
      label: (
        <span>
          Navigation 1 <DownOutlined className="subMenuExpandIcon" />
        </span>
      ),
      key: "app",
      icon: <AppstoreOutlined />,
      children: [
        {
          type: "group",
          label: "Item 1",
          children: [
            {
              label: "Option 1",
              key: "setting:1",
            },
            {
              label: "Option 2",
              key: "setting:2",
            },
          ],
        },
        {
          type: "group",
          label: "Item 2",
          children: [
            {
              label: "Option 3",
              key: "setting:3",
            },
            {
              label: "Option 4",
              key: "setting:4",
            },
          ],
        },
      ],
    },
    {
      label: (
        <span>
          Navigation 3 <DownOutlined className="subMenuExpandIcon" />
        </span>
      ),
      key: "SubMenu",
      icon: <SettingOutlined />,
      children: [
        {
          type: "group",
          label: "Item 1",
          children: [
            {
              label: "Option 1",
              key: "setting:1",
            },
            {
              label: "Option 2",
              key: "setting:2",
            },
          ],
        },
        {
          type: "group",
          label: "Item 2",
          children: [
            {
              label: "Option 3",
              key: "setting:3",
            },
            {
              label: "Option 4",
              key: "setting:4",
            },
          ],
        },
      ],
    },
  ];

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
              items={items}
              triggerSubMenuAction="click"
              expandIcon={<MailOutlined />}
            />
          </div>
        </div>
      </div>
    </Header>
  );
};

export default HorizontalMenu;
