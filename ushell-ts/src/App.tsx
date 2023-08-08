import React, { useEffect, useState } from "react";
import * as ReactDOMClient from "react-dom/client";

import "./App.css";
// import ShellLayout from "./shell-layout/_Templates/ShellLayout";
import { ShellLayout } from "ushell-common-components";
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

// import { UShellLayout } from "ushell-common-components";
import FolderIcon from "./shell-layout/_Icons/FolderIcon";
import { WorkspaceManager } from "./workspace-handling/WorkspaceManager";
import Workspace from "./workspace-handling/_Templates/Workspace";
import { UsecaseState } from "ushell-modulebase/lib/usecaseState";
import { PortfolioBasedWorkspaceManager } from "./portfolio-handling/PortfolioBasedWorkspaceManager";
import { ModuleDescription } from "ushell-portfoliodescription";
import { PortfolioManager } from "./portfolio-handling/PortfolioManager";
import { PortfolioBasedMenuService } from "./portfolio-handling/PortfolioBasedMenuService";
import { RemoteWidgetDescription } from "./federation/RemoteWidgetDescription";
import { IWidget } from "ushell-modulebase";
import FederatedComponentProxy from "./federation/_Molecules/FederatedComponentProxy";
import UsecaseInstanceDropdown from "./workspace-handling/_Molecules/UsecaseInstanceDropdown";
import { loadModuleDescription } from "./portfolio-handling/PortfolioLoader";

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
      usecaseKey: "EmployeeList",
      title: "Employee List",
      singletonActionkey: "1",
      iconName: "",
      widgetClass: "{test}",
      unitOfWorkDefaults: {},
    },
    {
      usecaseKey: "EmployeeDetails",
      title: "Employee Details {employeeId}",
      singletonActionkey: "2",
      iconName: "",
      widgetClass:
        '{"scope": "ushell_demo_app", "module": "./EmployeeDetails", "url": "http://localhost:3001/remoteEntry.js"}',
      unitOfWorkDefaults: { employeeId: 0 },
    },
    {
      usecaseKey: "ProductList",
      title: "Product List",
      singletonActionkey: "3",
      iconName: "",
      widgetClass: "{test}",
      unitOfWorkDefaults: {},
    },
    {
      usecaseKey: "ProductDetails",
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
      semantic: "primary",
      iconKey: "testIcon",
      targetWorkspacePath: "Employees",
      targetWorkspaceKey: "Employees",
      menuFolder: "Employees",
      commandType: "activate-workspace",
    },
    {
      uniqueCommandKey: "ShowEmployeeDetails",
      label: "New Employee",
      semantic: "primary",
      iconKey: "testIcon",
      targetWorkspacePath: "Employees",
      targetWorkspaceKey: "Employees",
      targetUsecaseKey: "EmployeeDetails",
      menuFolder: "Employees",
      commandType: "start-usecase",
      initUnitOfWork: {
        mapDynamic: [{ use: "commandArgs://employeeId", for: "employeeId" }],
      },
    },
    {
      uniqueCommandKey: "ShowProducts",
      label: "Products",
      semantic: "primary",
      iconKey: "testIcon",
      targetWorkspacePath: "Products",
      targetWorkspaceKey: "Products",
      menuFolder: "Products",
      commandType: "activate-workspace",
    },
    {
      uniqueCommandKey: "ShowProductDetails",
      label: "Edit Product",
      semantic: "primary",
      iconKey: "testIcon",
      targetWorkspacePath: "Products",
      targetWorkspaceKey: "Products",
      targetUsecaseKey: "ProductDetails",
      menuFolder: "",
      commandType: "start-usecase",
    },
  ],
  staticUsecaseAssignments: [
    {
      targetWorkspaceKey: "Employees",
      usecaseKey: "EmployeeList",
    },
  ],
};

PortfolioManager.SetModule(demoModule);

function parseWidgetClass(
  widgetClass: string,
  input: IWidget
): RemoteWidgetDescription {
  try {
    let result: RemoteWidgetDescription | undefined = JSON.parse(widgetClass);
    if (result) {
      result.inputData = input;
      return result;
    }
  } catch (error) {
    console.log("error parsing widget class", error)
  }
  return {
    scope: "ushell_demo_app",
    module: "./EmployeeList",
    url: "http://localhost:3001/remoteEntry.js",
    inputData: input,
  };
}

const App = () => {
  const navigate = useNavigate();

  const [menu, setMenu] = useState<ShellMenu | null>(null);

  useEffect(() => {
    loadModuleDescription().then((md) => {
      PortfolioManager.SetModule(md);
      setMenu(PortfolioBasedMenuService.buildMenuFromModule());
    });
  }, []);

  PortfolioManager.GetWorkspaceManager().navigateMethod = navigate;
  PortfolioManager.GetWorkspaceManager().renderWidgetMethod = (
    widgetClass: string,
    input: IWidget
  ) => {
    const remoteWidgetDesc: RemoteWidgetDescription = parseWidgetClass(
      widgetClass,
      input
    );
    return (
      <FederatedComponentProxy
        scope={remoteWidgetDesc.scope}
        module={remoteWidgetDesc.module}
        url={remoteWidgetDesc.url}
        inputData={remoteWidgetDesc.inputData}
      ></FederatedComponentProxy>
    );
  };

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

  if (!menu) {
    return <div>Shell is loading...</div>;
  }

  return (
    <ShellLayout
      title="UShell"
      shellMenu={menu}
      topBarElements={[
        <UsecaseInstanceDropdown
          workspaceManager={PortfolioManager.GetWorkspaceManager()}
        ></UsecaseInstanceDropdown>,
      ]}
    >
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
