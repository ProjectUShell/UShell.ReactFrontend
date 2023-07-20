import React, { useEffect, useState } from "react";
import TopBar from "../_Organisms/TopBar";
import VerticalShellLayout from "./VerticalShellLayout";
import HorizontalShellLayout from "./HorizontalShellLayout";
import {
  ColorMode,
  LayoutMode,
  loadShellSettings,
  saveShellSettings,
  ShellSettings,
} from "../ShellSettings";
import { ShellMenu } from "../ShellMenu";

const ShellLayout: React.FC<{
  shellMenu: ShellMenu;
  topBarElements?: JSX.Element[];
  children: any;
  title: string;
}> = ({ shellMenu, children, topBarElements, title }) => {
  const [shellSettings, setShellSettings] = useState<ShellSettings>({
    colorMode: ColorMode.Light,
    layoutMode: LayoutMode.Vertical,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setShellSettings(loadShellSettings());
  }, []);

  const toggleSidebarOpen = () => {
    setSidebarOpen((o) => !o);
  };

  function setLayoutMode(layoutMode: LayoutMode) {
    setShellSettings((ss) => {
      const newSettings: ShellSettings = { ...ss, layoutMode: layoutMode };
      saveShellSettings(newSettings);
      return newSettings;
    });
  }

  function setColorMode(colorMode: ColorMode) {
    setShellSettings((ss) => {
      const newSettings: ShellSettings = { ...ss, colorMode: colorMode };
      saveShellSettings(newSettings);
      return newSettings;
    });
    saveShellSettings(shellSettings);
  }

  // return (
  //   <div className={`${shellSettings.colorMode == ColorMode.Dark && "dark"}`}>
  //     <div
  //       className={`h-screen w-screen flex flex-col font-custom antialiased text-textone dark:text-textonedark ${
  //         shellSettings.colorMode == ColorMode.Dark && "dark"
  //       }`}
  //     >
  //       <TopBar
  //         setLayoutMode={setLayoutMode}
  //         setColorMode={setColorMode}
  //         toggleSidebarOpen={toggleSidebarOpen}
  //       ></TopBar>
  //       <div className="bg-green-200 w-screen flex h-screen border-4 border-violet-600">
  //         <div
  //           className={`fixed z-30 lg:static inset-y-0 left-0
  //         bg-backgroundone dark:bg-backgroundonedark py-4 overflow-auto transform ${
  //           sidebarOpen
  //             ? "translate-x-0 w-64 px-2  ease-out transition-all duration-200"
  //             : "-translate-x-0 w-0 ease-in transition-all duration-20"
  //         }`}
  //         >
  //           Side
  //         </div>
  //         <div className="h-full flex border-4 border-red-600 w-screen">
  //           <div className="inset-y-0 w-full bg-gray-200 m-2">test</div>
  //           {/* {children} */}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className={`${shellSettings.colorMode == ColorMode.Dark && "dark"}`}>
      <div
        className={`h-screen w-screen flex flex-col overflow-hidden font-custom antialiased text-textone dark:text-textonedark ${
          shellSettings.colorMode == ColorMode.Dark && "dark"
        }`}
      >
        <TopBar
          setLayoutMode={setLayoutMode}
          setColorMode={setColorMode}
          toggleSidebarOpen={toggleSidebarOpen}
          topBarElements={topBarElements}
          title={title}
        ></TopBar>
        {shellSettings.layoutMode == LayoutMode.Vertical ? (
          <VerticalShellLayout sidebarOpen={sidebarOpen} shellMenu={shellMenu}>
            {children}
          </VerticalShellLayout>
        ) : (
          <HorizontalShellLayout shellMenu={shellMenu}>
            {children}
          </HorizontalShellLayout>
        )}
      </div>
    </div>
  );
};

export default ShellLayout;
