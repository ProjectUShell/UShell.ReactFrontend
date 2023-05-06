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
  createRoutesFromElements,
} from "react-router-dom";
import { activateItem } from "./shell-layout/ShellMenuState";

import { UShellLayout } from "ushell-common-components";
import FolderIcon from "./shell-layout/_Icons/FolderIcon";
import { WorkspaceManager } from "./workspace-handling/WorkspaceManager";
import Workspace from "./workspace-handling/_Templates/Workspace";
import { UsecaseState } from "ushell-modulebase/lib/usecaseState";
import { PortfolioBasedWorkspaceManager } from "./portfolio-handling/PortfolioBasedWorkspaceManager";
import { ModuleDescription } from "ushell-portfoliodescription";
import { PortfolioManager } from "./portfolio-handling/PortfolioManager";
import { PortfolioBasedMenuService } from "./portfolio-handling/PortfolioBasedMenuService";

const demoModule: ModuleDescription = {
  moduleUid: "1",
  moduleTitle: "Demo",
  moduleScopingKey: "1",
  datasources: [],
  workspaces: [
    {
      workspaceKey: "Employees",
      workspaceTitle: "Employees",
      isSidebar: false,
    },
    {
      workspaceKey: "Products",
      workspaceTitle: "Products",
      isSidebar: false,
    },
  ],
  usecases: [
    {
      useCaseKey: "EmployeeList",
      title: "Employee List",
      singletonActionkey: "1",
      iconName: "",
      widgetClass: "{test}",
      unitOfWorkDefaults: {},
    },
    {
      useCaseKey: "EmployeeDetails",
      title: "Employee Details",
      singletonActionkey: "2",
      iconName: "",
      widgetClass: "{test}",
      unitOfWorkDefaults: {},
    },
    {
      useCaseKey: "ProductList",
      title: "Product List",
      singletonActionkey: "3",
      iconName: "",
      widgetClass: "{test}",
      unitOfWorkDefaults: {},
    },
    {
      useCaseKey: "ProductDetails",
      title: "Product Details",
      singletonActionkey: "4",
      iconName: "",
      widgetClass: "{test}",
      unitOfWorkDefaults: {},
    },
  ],
  commands: [
    {
      uniqueCommandKey: "ShowEmplyees",
      label: "Employees",
      semantic: "",
      iconKey: "testIcon",
      targetWorkspacePath: "Employees",
      targetWorkspaceKey: "Employees",
      menuFolder: "Employees",
      commandType: "ActivateWorkspace",
    },
    {
      uniqueCommandKey: "ShowEmplyeeDetails",
      label: "Edit Employee",
      semantic: "",
      iconKey: "testIcon",
      targetWorkspacePath: "Employees",
      targetWorkspaceKey: "Employees",
      targetUsecaseKey: "EmployeeDetails",
      menuFolder: "Employees",
      commandType: "start-usecase",
    },
    {
      uniqueCommandKey: "ShowProducts",
      label: "Products",
      semantic: "",
      iconKey: "testIcon",
      targetWorkspacePath: "Products",
      targetWorkspaceKey: "Products",
      menuFolder: "Products",
      commandType: "ActivateWorkspace",
    },
    {
      uniqueCommandKey: "ShowProductDetails",
      label: "Edit Product",
      semantic: "",
      iconKey: "testIcon",
      targetWorkspacePath: "Products",
      targetWorkspaceKey: "Products",
      targetUsecaseKey: "ProductDetails",
      menuFolder: "Products",
      commandType: "start-usecase",
    },
  ],
  staticUsecaseAssignments: [
    {
      targetWorkspaceKey: "Employees",
      useCaseKey: "EmployeeList",
    },
  ],
};

// class DummyWorkspaceManager extends WorkspaceManager {
//   getUsecaseStates(workspaceKey: string): UsecaseState[] {
//     return [];
//   }
// }

PortfolioManager.SetModule(demoModule);

const App = () => {
  const navigate = useNavigate();

  PortfolioManager.GetWorkspaceManager().navigateMethod = navigate;

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
            icon: <FolderIcon />,
            command: () => {
              navigate("/test");
            },
          },
          {
            type: "Command",
            label: "GItem 2",
            id: "4",
            icon: <FolderIcon />,
          },
        ],
      },
      {
        type: "Folder",
        label: "Employees",
        id: "5",
        children: [
          {
            type: "Command",
            label: "List of Employees",
            id: "6",
            icon: <FolderIcon />,
            command: (e) => {
              PortfolioManager.GetWorkspaceManager().activateWorkspace("1");
            },
          },
          {
            type: "Command",
            label: "Item 2",
            id: "7",
            icon: <FolderIcon />,
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
            icon: <FolderIcon />,
          },
          {
            type: "Command",
            label: "Item 4",
            id: "10",
            icon: <FolderIcon />,
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
                icon: <FolderIcon />,
              },
              {
                type: "Command",
                label: "Item 4",
                id: "13",
                icon: <FolderIcon />,
              },
            ],
          },
        ],
      },
    ],
  };

  const demoMenu2: ShellMenu = PortfolioBasedMenuService.buildMenuFromModule();

  return (
    <ShellLayout shellMenu={demoMenu2}>
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

    children: [
      { path: "test", element: <UShellLayout></UShellLayout> },
      {
        path: ":workspaceKey",
        element: (
          <Workspace
            workspaceManager={PortfolioManager.GetWorkspaceManager()}
          ></Workspace>
        ),
      },
      {
        path: ":workspaceKey/:usecaseId",
        element: (
          <Workspace
            workspaceManager={PortfolioManager.GetWorkspaceManager()}
          ></Workspace>
        ),
      },
    ],
  },
]);

const container: any = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);
root.render(<RouterProvider router={router} />);
