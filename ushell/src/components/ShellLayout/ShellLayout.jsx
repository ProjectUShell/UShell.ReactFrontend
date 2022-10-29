// react
import React, { useContext, useState } from "react";

// antd
import { Breadcrumb, Layout } from "antd";
import { Footer } from "antd/lib/layout/layout";

// app
import AppFooter from "../Footer/AppFooter";
import VerticalMenu from "../VerticalMenu/VerticalMenu";
import HorizontalMenu from "../HorizontalMenu/HorizontalMenu";
import MobileMenu from "../MobileMenu/MobileMenu";
import AppBar from "../AppBar/AppBar";

import SettingsContext from "../Settings/settingsContext";

const { Content } = Layout;

const ShellLayout = ({ workspaces, content }) => {
  const [mobileMenuOpen, setmobileMenuOpen] = useState(false);

  const showMobileMenu = () => {
    setmobileMenuOpen(true);
  };

  const settings = useContext(SettingsContext);
  console.log("settings", settings);

  return (
    <>
      <Layout className="shell__outer-layout">
        <AppBar showDrawer={showMobileMenu} />
        <MobileMenu open={mobileMenuOpen} setOpen={setmobileMenuOpen} />
        <Content className="shell__inner-layout">
          <Layout>
            {settings == "horizontal" && <HorizontalMenu />}
            {!(settings == "horizontal") && <VerticalMenu />}
            <Layout
              className={
                settings == "horizontal"
                  ? "shell__content-layout shell__content-layout_horizontal"
                  : "shell__content-layout shell__content-layout_vertical"
              }
            >
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
              <Content className="shell__content">{content}</Content>
            </Layout>
          </Layout>
        </Content>
        <Footer>
          <AppFooter></AppFooter>
        </Footer>
      </Layout>
    </>
  );
};

export default ShellLayout;
