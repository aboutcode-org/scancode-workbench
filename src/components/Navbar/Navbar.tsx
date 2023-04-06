import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ProSidebar, Menu, MenuItem, SidebarFooter, SidebarContent } from 'react-pro-sidebar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faBars, faChartColumn, faGavel, faHome, faInfoCircle, faFileCode, faTable, faFileLines, faList } from '@fortawesome/free-solid-svg-icons';

import { ROUTES } from '../../constants/routes';

import 'react-pro-sidebar/dist/css/styles.css';
import './navbar.css';

const MENU_ITEMS = [
    {
        title: "Welcome page",
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
        icon: faGavel,
    },
    {
        title: "Package Info Dashboard",
        route: "/" + ROUTES.PACKAGE_DASHBOARD,
        icon: faArchive,
    },
    {
        title: "License detections Explorer",
        route: "/" + ROUTES.LICENSE_DETECTIONS,
        icon: faList,
    },
    {
        title: "Packages Explorer",
        route: "/" + ROUTES.PACKAGES,
        icon: faList,
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
        title: "About workbench",
        route: "/" + ROUTES.ABOUT,
        icon: faInfoCircle,
    },
]

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
            className='navbar-wrapper'
        >
            <SidebarContent>
                <Menu iconShape="round">
                    {
                        MENU_ITEMS.map(menuItem => (
                            <MenuItem
                                key={menuItem.route}
                                active={menuItem.route === location.pathname}
                                icon={<FontAwesomeIcon icon={menuItem.icon} />}
                                onClick={() => navigate(menuItem.route)}
                            >
                                { menuItem.title }
                            </MenuItem>
                        ))
                    }
                </Menu>
            </SidebarContent>
            <SidebarFooter>
                <Menu iconShape="round">
                    <MenuItem
                        icon={<FontAwesomeIcon icon={faBars} />}
                        onClick={() => setCollapsed(prev => !prev)}
                    >
                        Collapse 
                    </MenuItem>
                </Menu>
            </SidebarFooter>
        </ProSidebar>
        {/* Dummy sidebar to occupy space in dom */}
        <div className='dummy-sidebar' />
        </>
    )
}

export default Navbar