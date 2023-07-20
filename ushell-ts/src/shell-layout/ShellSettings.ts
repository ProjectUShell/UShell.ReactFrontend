export enum LayoutMode {
  Vertical = 0,
  Horizontal = 1,
}

export enum ColorMode {
  Light = 0,
  Dark = 1,
}

export interface ShellSettings {
  colorMode: ColorMode;
  layoutMode: LayoutMode;
}

export function loadShellSettings(): ShellSettings {
  const shellSettingsJson = localStorage.getItem("ShellSettings");
  if (!shellSettingsJson) {
    return {
      colorMode: ColorMode.Light,
      layoutMode: LayoutMode.Vertical,
    };
  }
  return JSON.parse(shellSettingsJson);
}

export function saveShellSettings(shellSettings: ShellSettings) {
  localStorage.setItem("ShellSettings", JSON.stringify(shellSettings));
}
