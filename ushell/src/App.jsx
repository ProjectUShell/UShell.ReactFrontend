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
import Shell from "./components/Shell";

import "antd/dist/antd.css";
import "./index.css";

const { Header, Content, Footer, Sider } = Layout;
const items = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));

const items2 = [UserOutlined, VideoCameraOutlined, UploadOutlined].map(
  (icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `nav ${index + 1}`,
  })
);

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const App = () => {
  const [modulePortfolio, setModulePortfolio] = useState(null);
  const [items1, setItems1] = useState(items);

  const getData = () => {
    fetch("moduleportfolio.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        console.log(response);
        return response.json();
      })
      .then(function (myJson) {
        console.log("myJson", myJson.workspaces);
        setModulePortfolio(myJson);
        let items3 = [];
        let i = 0;
        myJson.workspaces.forEach((x) => {
          // let items2 = [];
          i += 1;
          let children = [];
          // console.log("workspace", x);
          x.useCases.forEach((uc) => {
            i += 1;
            children.push(getItem(uc.name, i));
          });
          items3.push(getItem(x.name, i, <UserOutlined />, children));
        });
        setItems1(items3);
      });
  };

  // getData();
  useEffect(() => {
    let items2 = [];
    let i = 0;
    getData();
    console.log("modulePortfolio", modulePortfolio);
    // modulePortfolio.workspaces.forEach((x) => {
    //   i += 1;
    //   let children = [];
    //   console.log("workspace", x);
    //   x.useCases.forEach((uc) => {
    //     i += 1;
    //     children.push(getItem(uc.name, i));
    //   });
    //   items2.push(getItem(x.name, i, <UserOutlined />, children));
    // });
  }, []);

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
          items={items1}
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
            <Shell></Shell>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
