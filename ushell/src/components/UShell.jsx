import React, { Suspense, useEffect, useState } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";

import { getModulePortfolio } from "../moduleportfolio";
import ModuleLoader from "../federation/ModuleLoader";
import HorizontalMenuLayout from "./HorizontalMenuLayout/HorizontalMenuLayout";

import { UserOutlined } from "@ant-design/icons";
import { SettingsProvider } from "./Settings/settingsContext";
import Settings from "./Settings/Settings";
import { Button, Drawer } from "antd";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const UShell = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [routes, setRoutes] = useState([]);

  const updateModulePortfolio = () => {
    getModulePortfolio().then(function (myJson) {
      let newItems = [];
      let newRoutes = [];
      let i = 0;
      myJson.workspaces.forEach((x) => {
        i += 1;
        let j = i + 1;
        let children = [];
        x.useCases.forEach((uc) => {
          j += 1;
          routes.push({
            path: "/" + x.name + "/" + uc.name,
            key: j,
            component: uc.component,
            module: uc.module,
            url: uc.url,
          });
          children.push(getItem(uc.name, j));
        });
        routes.push({ path: "/" + x.name, key: i });
        newItems.push(getItem(x.name, i, <UserOutlined />, children));
      });
      setWorkspaces(newItems);
    });
  };

  useEffect(() => {
    updateModulePortfolio();
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const headlessParam = searchParams.get("headless");
  const headless = headlessParam == undefined ? false : true;

  const [open2, setOpen2] = useState(false);

  console.log("items in app", workspaces);
  console.log("routes in app", routes);

  const showDrawer2 = () => {
    console.log("showing drawer");
    setOpen2(true);
  };

  const onClose2 = () => {
    console.log("closing drawer");
    setOpen2(false);
  };

  const [settingsValue, setSettingsValue] = useState('horizontal');

  return (
    <SettingsProvider value={settingsValue}>
      <Routes>
        <Route
          path="*"
          element={
            // <SideMenuShell
            //   workspaces={workspaces}
            //   content={<div>Welcome to USHell</div>}
            // ></SideMenuShell>
            <HorizontalMenuLayout
              content={
                <>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                  <div>Welcome to USHell</div>
                </>
              }
            ></HorizontalMenuLayout>
          }
        ></Route>
        {routes.map((r, i) => {
          return (
            <Route
              key={i}
              path={r.path}
              element={
                headless ? (
                  <Suspense fallback={"Loading . . . "}>
                    <ModuleLoader
                      url={r.url}
                      scope={r.module}
                      module={r.component}
                      inputData={{ someInput: "WTF" }}
                    />
                  </Suspense>
                ) : (
                  // <SideMenuShell
                  //   workspaces={workspaces}
                  //   content={
                  //     <Suspense fallback={"Loading . . . "}>
                  //       <ModuleLoader
                  //         url={r.url}
                  //         scope={r.module}
                  //         module={r.component}
                  //         inputData={{ someInput: "WTF" }}
                  //       />
                  //     </Suspense>
                  //   }
                  // ></SideMenuShell>
                  <HorizontalMenuLayout></HorizontalMenuLayout>
                )
              }
            ></Route>
          );
        })}
        ;
      </Routes>
      <Button className="settingsButton" type="primary" onClick={showDrawer2}>
        <i className="fas fa-cog" />
      </Button>
      <Drawer
        title="Customize Theme"
        placement="right"
        onClose={onClose2}
        open={open2}
      >
        <Settings setSettingsValue={setSettingsValue}></Settings>
      </Drawer>
    </SettingsProvider>
  );
};

export default UShell;
