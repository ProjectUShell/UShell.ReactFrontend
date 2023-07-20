import React from "react";
import { MenuItem } from "../ShellMenu";
import VerticalMenu from "./VerticalMenu";
import HorizontalMenu from "./HorizontalMenu";

type MenuDirection = "Vertical" | "Horizontal";

const Menu: React.FC<{
  menuItems: MenuItem[];
  direction: MenuDirection;
}> = ({ menuItems, direction }) => {
  switch (direction) {
    case "Vertical":
      return <VerticalMenu menuItems={menuItems}></VerticalMenu>;
    case "Horizontal":
      return <HorizontalMenu menuItems={menuItems}></HorizontalMenu>;
  }
  return <div>Menu</div>;
};

export default Menu;
