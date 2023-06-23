import React, { useState } from "react";
import { MenuItem } from "../ShellMenu";
import ChevronDown from "../_Icons/ChevronDown";
import Dropdown from "../_Atoms/Dropdown";
import VerticalMenu from "./VerticalMenu";

const HorizontalMenu: React.FC<{ menuItems: MenuItem[] }> = ({ menuItems }) => {
  const [renderTrigger, setRenderTrigger] = useState(0);
  function rerender() {
    setRenderTrigger((r) => r + 1);
  }

  const [openStateById, setOpenStateById] = useState<{ [id: string]: boolean }>(
    {}
  );

  function setiIsOpen(id: string, isOpen: boolean) {
    let newIsOpenState = { ...openStateById };
    newIsOpenState[id] = isOpen;
    setOpenStateById(newIsOpenState);
  }

  return (
    <div className="flex items-center text-sm select-none">
      {menuItems.map((mi: MenuItem) => (
        <div key={mi.id}>
          <div
            className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-backgroundfour dark:hover:bg-backgroundfourdark cursor-pointer"
            onClick={(e) => {
              setiIsOpen(mi.id, true);
            }}
          >
            <div className="px-1"> {mi.label}</div>
            {mi.children && <ChevronDown size={4}></ChevronDown>}
          </div>
          {mi.children && openStateById[mi.id] && (
            <Dropdown
              topOffset={0}
              rightOffset={0}
              setIsOpen={(i) => {
                setiIsOpen(mi.id, false);
              }}
            >
              <div className="p-2 bg-backgroundone dark:bg-backgroundonedark rounded-md border-2 border-solid border-black">
                <VerticalMenu menuItems={mi.children}></VerticalMenu>
              </div>
            </Dropdown>
          )}
        </div>
      ))}
    </div>
  );
};

export default HorizontalMenu;
