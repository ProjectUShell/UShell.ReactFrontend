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
import Workspace from "../Workspace/Workspace";

import LayoutContext from "../Settings/settingsContext";
import ModuleViewSuspense from "../ModuleView/ModuleViewSuspense";
import ModuleView from "../ModuleView/ModuleView";

const { Content } = Layout;

const ShellLayout = ({
  portfolio,
  menuItems,
  layoutMode,
  isStandaloneUseCase,
}) => {

  const [mobileMenuOpen, setmobileMenuOpen] = useState(false);
  const [siderCollapsed, setSiderCollapsed] = useState(false);

  const showMobileMenu = () => {
    setmobileMenuOpen(true);
  };

  return (
    <>
      <Layout className="shell__outer-layout">
        <AppBar showDrawer={showMobileMenu} portfolio={portfolio} />
        <MobileMenu
          open={mobileMenuOpen}
          setOpen={setmobileMenuOpen}
          menuItems={menuItems}
        />
        <Content className="shell__inner-layout">
          <Layout>
            {layoutMode == "horizontal" && (
              <HorizontalMenu menuItems={menuItems} />
            )}
            {!(layoutMode == "horizontal") && (
              <VerticalMenu
                menuItems={menuItems}
                siderCollapsed={siderCollapsed}
                setSiderCollapsed={setSiderCollapsed}
              />
            )}
            <Layout
              className={
                layoutMode == "horizontal"
                  ? "shell__content-layout shell__content-layout_horizontal"
                  : siderCollapsed
                  ? "shell__content-layout shell__content-layout_vertical-collapsed"
                  : "shell__content-layout shell__content-layout_vertical"
              }
            >
              {/* <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb> */}
              <Content className="shell__content">
                {isStandaloneUseCase ? (
                  <ModuleView portfolio={portfolio}></ModuleView>
                ) : (
                  <Workspace portfolio={portfolio}></Workspace>
                )}
              </Content>
            </Layout>
          </Layout>
        </Content>
        {/* <Footer>
          <AppFooter></AppFooter>
        </Footer> */}
      </Layout>
    </>
  );
};

export default ShellLayout;
