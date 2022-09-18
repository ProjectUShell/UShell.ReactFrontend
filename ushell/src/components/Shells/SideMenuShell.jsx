import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Shell from "../Shell";
import { useNavigate } from "react-router-dom";

// import "antd/dist/antd.css";

const { Header, Content, Footer, Sider } = Layout;

const SideMenuShell = ({ workspaces, content }) => {
  
  const navigate = useNavigate();

  console.log("itmes in sb", workspaces);
  // if (workspaces.length == 0) {
  //   return <div>So</div>;
  // }

  const onMenuItemClick = (i) => {
    const workspace = workspaces.find(ws => ws.key == [i.keyPath[1]]);
    const useCase = workspace.children.find(uc => uc.key == [i.keyPath[0]]);
    console.log("workspace", workspace);
    console.log("useCase", useCase);
    console.log("workspaces", workspaces);
    console.log(i);
    navigate("../" + workspace.label + "/" + useCase.label);
  }

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={workspaces}
          onClick={onMenuItemClick}
        />
      </Sider>
      <Layout
        className="site-layout"
        style={{
          marginLeft: 200,
        }}
      >
        <Header
          theme="dark"
          className="site-layout-background"
          style={{
            padding: 0,
            zIndex: 1,
            width: "100%",
            position: "fixed",
          }}
        />
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
    </Layout>
  );
};

export default SideMenuShell;
