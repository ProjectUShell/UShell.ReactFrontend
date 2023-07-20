import React from "react";
import { ShellMenu } from "../ShellMenu";
import VerticalMenu from "../_Organisms/VerticalMenu";
import Menu from "../_Organisms/Menu";

const VerticalShellLayout: React.FC<{
  sidebarOpen: boolean;
  shellMenu: ShellMenu;
  children: any;
}> = ({ sidebarOpen, shellMenu, children }) => {
  return (
    <div className={`flex overflow-hidden h-screen`}>
      {/* Sidebar */}
      <div
        className={`fixed z-30 lg:static inset-y-0 left-0 
          bg-backgroundone dark:bg-backgroundonedark py-4 overflow-auto transform ${
            sidebarOpen
              ? "translate-x-0 w-64 px-2  ease-out transition-all duration-200"
              : "-translate-x-0 w-0 ease-in transition-all duration-20"
          }`}
      >
        <Menu menuItems={shellMenu.items} direction="Vertical"></Menu>
      </div>

      {/* Content */}
      <div
        className="w-screen flex h-full min-w-0 
          bg-backgroundtwo dark:bg-backgroundtwodark overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
};

export default VerticalShellLayout;
