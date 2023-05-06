import React, { ReactElement, useEffect, useState } from "react";
import { MenuItem, ShellMenu } from "../ShellMenu";
import ChevronDown from "../_Icons/ChevronDown";
import {
  ShellMenuState,
  activateItem,
  getItemState,
  loadShellMenuState,
  toggleFolderCollapse,
} from "../ShellMenuState";

const VerticalMenu: React.FC<{ menuItems: MenuItem[] }> = ({ menuItems }) => {
  const [rerenderTrigger, setRerenderTrigger] = useState(0);
  const [shellMenuState] = useState<ShellMenuState>(loadShellMenuState());

  function triggerRerender() {
    setRerenderTrigger((t) => t + 1);
  }

  return (
    <VerticalMenuInternal
      menuItems={menuItems}
      depth={0}
      triggerRerender={triggerRerender}
      shellMenuState={shellMenuState}
    ></VerticalMenuInternal>
  );
};

const VerticalMenuInternal: React.FC<{
  menuItems: MenuItem[];
  depth: number;
  triggerRerender: () => void;
  shellMenuState: ShellMenuState;
}> = ({ menuItems, depth, triggerRerender, shellMenuState }) => {

  function onToggleFolderCollapse(itemId: string) {
    toggleFolderCollapse(shellMenuState!, itemId).then(
      (newState: ShellMenuState) => {
        // setShellMenuState(newState);
        triggerRerender();
      }
    );
  }

  let depthCssClass: string = getDepthCssClass(depth);

  return (
    <ul className="pt-2 select-none text-sm bg-backgroundone dark:bg-backgroundonedark rounded-md">
      {menuItems.map((mi: MenuItem) => (
        <div key={mi.id}>
          <li
            key={mi.id}
            className={`flex items-center gap-x-4 p-1 rounded-md ${depthCssClass} ${
              mi.type !== "Group" &&
              "hover:bg-backgroundfour dark:hover:bg-backgroundfourdark cursor-pointer"
            } ${mi.type == "Command" ? "mt-0 font-light" : "mt-4 font-bold"} ${
              shellMenuState.activeItemId == mi.id ? "bg-backgroundfour dark:bg-backgroundfourdark" : ""
            }`}
            onClick={() => {
              if (mi.type == "Folder") {
                onToggleFolderCollapse(mi.id);
              }
              if (mi.type == "Command") {
                activateItem(mi, shellMenuState);
              }
              triggerRerender();
            }}
          >
            {mi.icon && (
              <span className="text-2xl block float-left">{mi.icon}</span>
            )}
            <span className={`flex-1 `}>{mi.label}</span>
            {mi.type == "Folder" && <ChevronDown />}
          </li>

          {mi.type == "Group" && (
            <VerticalMenuInternal
              menuItems={mi.children!}
              depth={depth + 1}
              triggerRerender={triggerRerender}
              shellMenuState={shellMenuState}
            ></VerticalMenuInternal>
          )}

          {mi.type == "Folder" &&
            !getItemState(shellMenuState!, mi.id).collapsed && (
              <VerticalMenuInternal
                menuItems={mi.children!}
                depth={depth + 1}
                triggerRerender={triggerRerender}
                shellMenuState={shellMenuState}
              ></VerticalMenuInternal>
            )}
        </div>
      ))}
    </ul>
  );
};

export default VerticalMenu;

function getDepthCssClass(depth: number) {
  let depthCssClass: string = "ml-0";
  switch (depth) {
    case 1:
      depthCssClass = "ml-2";
      break;
    case 2:
      depthCssClass = "ml-4";
      break;
    case 3:
      depthCssClass = "ml-8";
      break;
  }
  return depthCssClass;
}
