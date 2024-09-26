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
      <div className="flex justify-stretch min-w-0 w-full">
        {tabItems.map((ti, index) => (
          <div
            style={
              shellSettings.colorMode == ColorMode.Dark
                ? {
                    borderLeftColor: "var(--color-background-three-dark)",
                    borderRightColor: "var(--color-background-three-dark)",
                  }
                : {
                    borderLeftColor: "var(--color-background-six)",
                    borderRightColor: "var(--color-background-six)",
                  }
            }
            key={ti.id}
            className={`px-2 py-1 -rounded-b-sm flex justify-between border-x ${
              index == activeTabIndex
                ? "bg-navigation dark:bg-navigationDark border-t-4 border-prim3 dark:border-prim6 border-x border-l-bg3dark"
                : "bg-topbar dark:bg-topbarDark hover:bg-bg2 dark:hover:bg-bg1dark border-bg5 dark:border-bg3dark border-t border-b"
            } cursor-default`}
          >
            <button
              className="pl-2 pr-4 whitespace-nowrap"
              onClick={(e) => onTabChange(ti)}
            >
              <p>{ti.title}</p>
            </button>
            {ti.canClose && (
              <button
                className="hover:bg-backgroundtwo dark:hover:bg-backgroundtwodark"
                onClick={(e) => onTabClose(ti)}
              >
                <XMark size={4}></XMark>
              </button>
            )}
          </div>
        ))}
        <div className="border-b border-bg6 dark:border-bg3dark w-full"></div>
      </div>
      <div className="h-full bg-backgroundone dark:bg-backgroundonedark flex flex-col">
        {tabItems[activeTabIndex]?.renderMethod &&
          tabItems[activeTabIndex]?.renderMethod!()}
      </div>
    </div>
  );
};

export default TabControl;
