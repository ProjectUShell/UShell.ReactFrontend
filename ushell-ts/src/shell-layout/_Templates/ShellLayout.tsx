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

const ShellLayout: React.FC<{ shellMenu: ShellMenu; children: any }> = ({
  shellMenu,
  children,
}) => {
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
