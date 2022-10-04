import { Breadcrumb, Layout, Menu, Button, Drawer } from "antd";
import { Footer } from "antd/lib/layout/layout";
import React, { useState } from "react";
import AppFooter from "../Footer/AppFooter";
import Settings from "../Settings/Settings";
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

import "./HorizontalMenuLayout.css";

const { Header, Content, Sider } = Layout;

const HorizontalMenuLayout = ({ workspaces, content }) => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [horizontalMode, setHorizontalMode] = useState(false);
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const [siderCollapsed2, setSiderCollapsed2] = useState(false);

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
                  items={new Array(2).fill(null).map((_, index) => {
                    const key = index + 1;
                    return {
                      key,
                      label: "",
                      icon: <GoogleOutlined />,
                    };
                  })}
                />
              </div>
              <div className="mobileVisible">
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
                <Button type="primary" onClick={showDrawer}>
                  <i className="fas fa-bars"></i>
                </Button>
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 0px 0",
            overflow: "initial",
            marginTop: 55,
          }}
        >
          <Layout>
            {horizontalMode && (
              <Header
                style={{
                  zIndex: "998",
                }}
              >
                <div className="container-fluid2">
                  <div className="mobileHidden2">
                    <div className="header2">
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
                        placement="right"
                        closable={true}
                        onClose={onClose}
                        open={open}
                      >
                        <Menu
                          mode="inline"
                          defaultSelectedKeys={["2"]}
                          expandIcon={<i className="fas fas-wheel"></i>}
                          items={items}
                        />
                      </Drawer>
                    </div>
                  </div>
                </div>
              </Header>
            )}
            {!horizontalMode && (
              <>
                <div className="mobileHidden">
                  <Sider
                    style={{
                      overflow: 'auto',
                      height: 'calc(100vh - 85px)',
                      position: 'fixed',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      marginTop: '58px'
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
                <div className="mobileVisible">
                  <Drawer
                    title="Basic Drawer"
                    placement="right"
                    closable={true}
                    onClose={onClose}
                    open={open}
                  >
                    <Menu
                      mode="inline"
                      defaultSelectedKeys={["2"]}
                      expandIcon={<i className="fas fas-wheel"></i>}
                      items={items}
                    />
                  </Drawer>
                </div>
              </>
            )}
            <Layout
              className={siderCollapsed2 ? "testXXX" : "testXXX2"}
              style={{
                padding: "0 24px 24px",
                marginTop: horizontalMode ? "40px" : "0px"
              }}
            >
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
              <Content
                style={{
                  margin: "24px 16px 0",
                  overflow: "initial",
                  marginTop: "0px",
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
