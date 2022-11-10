import darkVars from "./dark.json";
import lightVars from "./light.json";

function storeColorMode(colorMode) {
  localStorage.setItem("colorMode", colorMode);
}

export function restoreColorMode() {
  const colorMode = localStorage.getItem("colorMode");
  if (!colorMode) {
    return 'light';
  }
  if (colorMode == "dark") {
    setDarkMode();
  }
  return colorMode;
}

export function restoreLayoutMode() {
  const layoutMode = localStorage.getItem("layoutMode");
  if (!layoutMode) {
    return "horizontal";
  }
  return layoutMode;
}

export function setDarkMode() {
  window.less.modifyVars(darkVars).catch((error) => {
    console.error(`Failed to reset theme`);
  });
  storeColorMode("dark");
}

export function setLightMode() {
  window.less.modifyVars(lightVars).catch((error) => {
    console.error(`Failed to reset theme`);
  });
  storeColorMode("light");
}

export function storeLayoutMode(layoutMode) {
  localStorage.setItem("layoutMode", layoutMode);
}

export function initColors() {
  
}
