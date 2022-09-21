import { Breadcrumb, Layout, Menu, Button, Drawer } from "antd";
import { Footer } from "antd/lib/layout/layout";
import React, { useState } from "react";
import AppFooter from "../Footer/AppFooter";
import Settings from "../Settings/Settings";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  DownOutlined
} from "@ant-design/icons";

import "./HorizontalMenuLayout.css";

const { Header, Content } = Layout;

const HorizontalMenuLayout = ({ workspaces, content }) => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const showDrawer = () => {
    console.log("showing drawer");
    setOpen(true);
  };

  const onClose = () => {
    console.log("closing drawer");
    setOpen(false);
  };

  const showDrawer2 = () => {
    console.log("showing drawer");
    setOpen2(true);
  };

  const onClose2 = () => {
    console.log("closing drawer");
    setOpen2(false);
  };

  const items = [
    {
      label: (        
        <span>Navigation 1 <DownOutlined className="subMenuExpandIcon"/></span>
      ),
      key: "mail",
      icon: <MailOutlined />,
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
      label: "Navigation Two",
      key: "app",
      icon: <AppstoreOutlined />
    },
    {
      label: (        
        <span>Navigation 3 <DownOutlined className="subMenuExpandIcon"/></span>
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
    <>
      <Layout className="mainLayout">
        <Header>
          <div className="container-fluid2">
            <div className="header">
              <div className="logo">
                <i className="fa-brands fa-uniregistry"></i>
                Shell
              </div>
              <div className="mobileHidden">
                <Menu
                  mode="horizontal"
                  defaultSelectedKeys={["2"]}
                  items={new Array(5).fill(null).map((_, index) => {
                    const key = index + 1;
                    return {
                      key,
                      label: `nav ${key}`,
                    };
                  })}
                />
              </div>
              <div className="mobileVisible">
                <Button type="primary" onClick={showDrawer}>
                  <i className="fas fa-bars"></i>
                </Button>
                <Drawer
                  title="Basic Drawer"
                  placement="left"
                  closable={true}
                  onClose={onClose}
                  open={open}
                >
                  <Menu
                    mode="horizontal"
                    defaultSelectedKeys={["2"]}
                    items={new Array(5).fill(null).map((_, index) => {
                      const key = index + 1;
                      return {
                        key,
                        label: `nav ${key}`,
                      };
                    })}
                  />
                </Drawer>
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
            marginTop: 55,
          }}
        >
          <Layout>
            <Header
              style={{
                zIndex: "998",
              }}
            >
              <div className="container-fluid2">
                <div className="header2">
                  <div className="mobileHidden2">
                    <Menu
                      mode="horizontal"
                      defaultSelectedKeys={["2"]}
                      items={items}
                      triggerSubMenuAction="click"
                      expandIcon={<MailOutlined />}
                    />
                  </div>
                  <div className="mobileVisible">
                    <Drawer
                      title="Basic Drawer"
                      placement="left"
                      closable={true}
                      onClose={onClose}
                      open={open}
                    >
                      <Menu
                        mode="horizontal"
                        defaultSelectedKeys={["2"]}
                        expandIcon={<i className="fas fas-wheel"></i>}
                        items={new Array(5).fill(null).map((_, index) => {
                          const key = index + 1;
                          return {
                            key,
                            label: `nav ${key}`,
                          };
                        })}
                      />
                    </Drawer>
                  </div>
                </div>
              </div>
            </Header>
            <Content
              style={{
                margin: "24px 16px 0",
                overflow: "initial",
                marginTop: 74,
              }}
            >
              <div
                className="site-layout-background"
                style={{
                  padding: 24,
                  textAlign: "center",
                }}
              >
                {content}
              </div>
            </Content>
          </Layout>
        </Content>
        <Footer>
          <AppFooter></AppFooter>
        </Footer>
      </Layout>

      <Button className="settingsButton" type="primary" onClick={showDrawer2}>
        <i className="fas fa-cog" />
      </Button>
      <Drawer
        title="Customize Theme"
        placement="right"
        onClose={onClose2}
        open={open2}
      >
        <Settings></Settings>
      </Drawer>
    </>
  );
};

export default HorizontalMenuLayout;
