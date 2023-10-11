import React, { useEffect, useState } from "react";
import { TabItem } from "../TabItem";
import XMark from "../../shell-layout/_Icons/XMark";

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
  },[initialActiveTabIndex])

  return (
    <div className="m-2 flex flex-col w-screen ">
      <div className="flex justify-stretch min-w-0 ">
        {tabItems.map((ti, index) => (
          <div
            key={ti.id}
            className={`px-2 py-1 rounded-t-lg -rounded-b-sm flex justify-between ${
              index == activeTabIndex
                ? "bg-backgroundone dark:bg-backgroundonedark"
                : "bg-backgroundtwo dark:bg-backgroundtwodark hover:bg-backgroundthree dark:hover:bg-backgroundthreedark"
            } cursor-default`}
          >
            <button className="pl-2 pr-4" onClick={(e) => onTabChange(ti)}>
              {ti.title}
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
      </div>
      <div className="h-full bg-backgroundone dark:bg-backgroundonedark flex flex-col">
        {tabItems[activeTabIndex]?.title}
        {tabItems[activeTabIndex]?.renderMethod &&
          tabItems[activeTabIndex]?.renderMethod!()}
      </div>
    </div>
  );
};

export default TabControl;
