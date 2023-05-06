import React from "react";
import { TabItem } from "../TabItem";

const TabControl: React.FC<{ tabItems: TabItem[] }> = ({ tabItems }) => {
  return (
    <div className="m-2 flex flex-col w-screen">
      <div className="flex">
        {tabItems.map((ti) => (
          <div key={ti.title} className="bg-blue-500">
            <button>{ti.title}</button>
          </div>
        ))}
      </div>
      <div className="bg-green-300 h-full border-4 border-red-600">Content</div>
    </div>
  );
};

export default TabControl;
