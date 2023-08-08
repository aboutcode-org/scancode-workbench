import {
  faBars,
  faBook,
  faBoxOpen,
  faChartColumn,
  faCopyright,
  faFileCode,
  faFileLines,
  faFolderTree,
  faHome,
  faInfoCircle,
  faListCheck,
  faRectangleList,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarFooter,
} from "react-pro-sidebar";
import { useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "../../constants/routes";

import "react-pro-sidebar/dist/css/styles.css";
import "./navbar.css";

const MENU_ITEMS = [
  {
    title: "Home",
    route: ROUTES.HOME,
    icon: faHome,
  },
  {
    title: "Table View",
    route: "/" + ROUTES.TABLE_VIEW,
    icon: faTable,
  },
  {
    title: "File Info Dashboard",
    route: "/" + ROUTES.FILE_DASHBOARD,
    icon: faFileLines,
  },
  {
    title: "License Info Dashboard",
    route: "/" + ROUTES.LICENSE_DASHBOARD,
    icon: faBook,
  },
  {
    title: "Copyright Info Dashboard",
    route: "/" + ROUTES.COPYRIGHT_DASHBOARD,
    icon: faCopyright,
  },
  {
    title: "Package Info Dashboard",
    route: "/" + ROUTES.PACKAGE_DASHBOARD,
    icon: faBoxOpen,
  },
  {
    title: "Dependency Info Dashboard",
    route: "/" + ROUTES.DEPENDENCY_DASHBOARD,
    icon: faListCheck,
  },
  {
    title: "License Explorer",
    route: "/" + ROUTES.LICENSES,
    icon: faRectangleList,
  },
  {
    title: "Package Explorer",
    route: "/" + ROUTES.PACKAGES,
    icon: faFolderTree,
  },
  {
    title: "Chart Summary View",
    route: "/" + ROUTES.CHART_SUMMARY,
    icon: faChartColumn,
  },
  {
    title: "Scan Info",
    route: "/" + ROUTES.SCAN_INFO,
    icon: faFileCode,
  },
  {
    title: "About Workbench",
    route: "/" + ROUTES.ABOUT,
    icon: faInfoCircle,
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState<boolean>(true);
  const expandOnHover = true;

  return (
    <>
      <ProSidebar
        collapsed={collapsed}
        onMouseEnter={() => expandOnHover && setCollapsed(false)}
        onMouseLeave={() => expandOnHover && setCollapsed(true)}
        className="navbar-wrapper"
      >
        <SidebarContent>
          <Menu iconShape="round">
            {MENU_ITEMS.map((menuItem) => (
              <MenuItem
                key={menuItem.route}
                active={menuItem.route === location.pathname}
                icon={<FontAwesomeIcon icon={menuItem.icon} />}
                onClick={() => navigate(menuItem.route)}
              >
                {menuItem.title}
              </MenuItem>
            ))}
          </Menu>
        </SidebarContent>
        <SidebarFooter>
          <Menu iconShape="round">
            <MenuItem
              icon={<FontAwesomeIcon icon={faBars} />}
              onClick={() => setCollapsed((prev) => !prev)}
            >
              Collapse
            </MenuItem>
          </Menu>
        </SidebarFooter>
      </ProSidebar>

      {/* Dummy sidebar-sized div to occupy space in dom */}
      {/* @TODO - Try :before or some other css way to handle this instead */}
      <div className="dummy-sidebar" />
    </>
  );
};

export default Navbar;
