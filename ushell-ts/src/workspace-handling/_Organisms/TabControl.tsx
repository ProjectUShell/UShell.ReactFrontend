import React, { useEffect, useState } from "react";
import { TabItem } from "../TabItem";
import XMark from "../../shell-layout/_Icons/XMark";
import { ColorMode, loadShellSettings } from "../../shell-layout/ShellSettings";

const TabControl: React.FC<{
  tabItems: TabItem[];
  initialActiveTabIndex: number;
  onTabClose: (tab: TabItem) => void;
  onTabChange: (tab: TabItem) => void;
}> = ({ tabItems, initialActiveTabIndex, onTabClose, onTabChange }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(initialActiveTabIndex);
  // function onTabChange(tabId: string) {
  //   onTabChange(tab)
  //   setActiveTabIndex(tabItems.findIndex((ti) => ti.id == tabId));
  // }

  useEffect(() => {
    setActiveTabIndex(initialActiveTabIndex);
  }, [initialActiveTabIndex]);

  const shellSettings = loadShellSettings();

  return (
    <div className="h-full m-0 flex flex-col w-screen overflow-hidden bg-menu dark:bg-menuDark border-0 border-pink-600">
      <ul className="flex flex-wrap text-sm font-medium text-center border-b-2 border-menuBorder dark:border-menuBorderDark  -mb-px">
        {tabItems.map((ti, index) => (
          <li
            key={ti.id}
            // className={`px-2 py-1 -rounded-b-sm flex justify-between border1-x cursor-default font-medium
            className={`me-2 `}
          >
            <a
              className={`inline-block py-3 px-2 rounded-t-lg cursor-pointer select-none whitespace-nowrap
                ${
                  index == activeTabIndex
                    ? "font-bold bg1-bg2 dark:bg1-bg1dark border-b-2 border-blue-400"
                    : " hover1:bg-bg2 dark:hover1:bg-bg1dark bg-topbar1 dark:bg1-topbarDark hover:border-b-2 border-menuBorder dark:border-menuBorderDark"
                }`}
              onClick={(e) => onTabChange(ti)}
            >
              <p>{ti.title}</p>
            </a>
            {ti.canClose && (
              <button
                className="hover:bg-backgroundtwo dark:hover:bg-backgroundtwodark"
                onClick={(e) => onTabClose(ti)}
              >
                <XMark size={4}></XMark>
              </button>
            )}
          </li>
        ))}
        {/* <div className="border-b border-bg6 dark:border-bg3dark w-full"></div> */}
      </ul>
      <div className="h-full bg-backgroundone dark:bg-backgroundonedark flex flex-col mt-0">
        {tabItems[activeTabIndex]?.renderMethod &&
          tabItems[activeTabIndex]?.renderMethod!()}
      </div>
    </div>
  );
};

export default TabControl;
