import { Breadcrumb, Layout, Menu, Button, Drawer } from "antd";
import { Footer } from "antd/lib/layout/layout";
import React, { useState } from "react";
import AppFooter from "../Footer/AppFooter";

import "./HorizontalMenuLayout.css";

const { Header, Content } = Layout;

const HorizontalMenuLayout = ({ workspaces, content }) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    console.log("showing drawer");
    setOpen(true);
  };

  const onClose = () => {
    console.log("closing drawer");
    setOpen(false);
  };

  return (
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
                theme="dark"
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
                  theme="dark"
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
          marginTop: 74,
        }}
      >
        <Layout>
          <Header>
            <div className="container-fluid2">
              <div className="header2">                
                <div className="mobileHidden2">
                  <Menu
                    theme="dark"
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
                      theme="dark"
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
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              textAlign: "center",
            }}
          >
            {content}
          </div>
        </Layout>
      </Content>
      <Footer>
        <AppFooter></AppFooter>
      </Footer>
    </Layout>
  );
};

export default HorizontalMenuLayout;
