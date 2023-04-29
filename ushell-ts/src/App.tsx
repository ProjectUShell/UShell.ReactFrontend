import React from "react";
import * as ReactDOMClient from "react-dom/client";

import "./App.css";
import ShellLayout from "./shell-layout/_Templates/ShellLayout";
import SettingsDropdown from "./shell-layout/_Molecules/SettingsDropdown";
import RadioGroup from "./shell-layout/_Atoms/RadioGroup";
import { MenuItemType, ShellMenu } from "./shell-layout/ShellMenu";
import HomeIcon from "./shell-layout/_Icons/HomeIcon";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Routes,
  Route,
  Router,
  redirect,
  useNavigate,
} from "react-router-dom";
import { activateItem } from "./shell-layout/ShellMenuState";

import { UShellLayout } from "ushell-common-components"
import FolderIcon from "./shell-layout/_Icons/FolderIcon";

const App = () => {
  const navigate = useNavigate();

  const demoMenu: ShellMenu = {
    items: [
      {
        type: "Command",
        label: "Home",
        icon: <HomeIcon />,
        id: "1",
      },
      {
        type: "Group",
        label: "Gruppe 1",
        id: "2",
        children: [
          {
            type: "Command",
            label: "Test",
            id: "3",
            icon: <FolderIcon/>,
            command: () => {
              activateItem("3");
              navigate("/test");
            },
          },
          {
            type: "Command",
            label: "GItem 2",
            id: "4",
            icon: <FolderIcon/>,
          },
        ],
      },
      {
        type: "Folder",
        label: "Folder 1",
        id: "5",
        children: [
          {
            type: "Command",
            label: "Item 1",
            id: "6",
            icon: <FolderIcon/>,
          },
          {
            type: "Command",
            label: "Item 2",
            id: "7",
            icon: <FolderIcon/>,
          },
        ],
      },
      {
        type: "Folder",
        label: "Folder 2",
        id: "8",
        children: [
          {
            type: "Command",
            label: "Item 3",
            id: "9",
            icon: <FolderIcon/>,
          },
          {
            type: "Command",
            label: "Item 4",
            id: "10",
            icon: <FolderIcon/>,
          },
          {
            type: "Folder",
            label: "Subfolder 2",
            id: "11",
            children: [
              {
                type: "Command",
                label: "Item 3",
                id: "12",
                icon: <FolderIcon/>,
              },
              {
                type: "Command",
                label: "Item 4",
                id: "13",
                icon: <FolderIcon/>,
              },
            ],
          },
        ],
      },
    ],
  };

  return (
    <ShellLayout shellMenu={demoMenu}>
      <Outlet />
    </ShellLayout>
    // <FederatedComponentProxy
    //   scope="ushell_demo_app"
    //   module="./Test"
    //   url="http://localhost:3001/remoteEntry.js"
    //   inputData={{ inputData: "asd" }}
    // ></FederatedComponentProxy>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{ path: "test", element: <UShellLayout></UShellLayout> }],
  },
]);

const container: any = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);
root.render(<RouterProvider router={router} />);
