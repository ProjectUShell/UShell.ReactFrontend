import { Menu, Layout, Drawer } from "antd";
const { Header } = Layout;

import React from "react";

import {
  convertToAntdItems,
  getMenuItem,
} from "../../portfolio-handling/MenuService";
import { useNavigate } from "react-router-dom";

const MobileMenu = ({ open, setOpen, menuItems }) => {
  const navigate = useNavigate();

  const items2 = convertToAntdItems(menuItems, true);

  const onSelectMenuItem = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    const menuItem = getMenuItem(menuItems, key);
    if (!menuItem.command) {
      console.error(`no command set in menuItem ${menuItem.label}`, menuItem);
    }
    setOpen(false);
    menuItem.command(navigate);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="mobileVisible shell__mobile-drawer">
      <Drawer
        title="UShell"
        placement="right"
        closable={true}
        onClose={onClose}
        open={open}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={["2"]}
          expandIcon={<i className="fas fas-wheel"></i>}
          items={items2}
          onSelect={onSelectMenuItem}
        />
      </Drawer>
    </div>
  );
};

export default MobileMenu;
