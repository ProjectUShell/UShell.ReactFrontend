import React from "react";
import { ShellMenu } from "../ShellMenu";
import HorizontalMenu from "../_Organisms/HorizontalMenu";
import Menu from "../_Organisms/Menu";

const HorizontalShellLayout: React.FC<{
  shellMenu: ShellMenu;
  children: any;
}> = ({ shellMenu, children }) => {
  return (
    <div className={`h-screen flex flex-col overflow-hidden`}>
      <header
        className="flex flex-col z-20 px-6 bg-backgroundone dark:bg-backgroundonedark
      text-textone dark:text-textonedark shadow-md"
      >
        <div className="flex justify-between items-center py-2">
          <Menu direction="Horizontal" menuItems={shellMenu.items}></Menu>
        </div>
      </header>
      <div
        className="w-screen h-full flex min-w-0 
          bg-backgroundtwo text-gray-800 dark:bg-backgroundtwodark dark:text-white overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalShellLayout;
