import React from "react";
import SettingsDropdown from "../_Molecules/SettingsDropdown";
import { LayoutMode, ColorMode } from "../ShellSettings";

const TopBar: React.FC<{
  setLayoutMode: (layoutMode: LayoutMode) => void;
  setColorMode: (colorMode: ColorMode) => void;
  toggleSidebarOpen: () => void;
  title: string;
  topBarElements?: JSX.Element[];
}> = ({ setLayoutMode, setColorMode, toggleSidebarOpen, topBarElements, title }) => {
  return (
    <header className="static top-0 flex flex-col z-50 px-6 bg-backgroundone dark:bg-backgroundonedark text-textone dark:text-textonedark shadow-lg">
      <div className="flex justify-between items-center py-1">
        <div className="flex items-center py-2">
          <h1>{title}</h1>
          <button className="ml-4" onClick={() => toggleSidebarOpen()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        <div>Search</div>

        <div className="flex items-center justify-between py-2">
          {topBarElements &&
            topBarElements!.map((e: JSX.Element) => (
              <div className="px-2"> {e}</div>
            ))}
          <SettingsDropdown
            setLayoutMode={setLayoutMode}
            setColorMode={setColorMode}
          ></SettingsDropdown>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
