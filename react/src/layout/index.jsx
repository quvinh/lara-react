import React, { useEffect, useState } from "react";
import {
    DashboardOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    DownOutlined,
    ReconciliationOutlined,
    BellOutlined,
    LogoutOutlined,
    HistoryOutlined,
    GroupOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import {
    Layout,
    Menu,
    theme,
    Dropdown,
    Space,
    FloatButton,
    Breadcrumb,
} from "antd";
import {
    Outlet,
    Link,
    Navigate,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../../../react/src/axios-client";
import { message } from "antd";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { array } from "prop-types";

export const index = () => {
    const {
        user,
        token,
        permissions,
        setUser,
        setToken,
        setRole,
        setPermissions,
    } = useStateContext();
    if (!token) {
        return <Navigate to={"/login"} />;
    }

    const [collapsed, setCollapsed] = useState(false);
    const { Header, Sider, Content, Footer } = Layout;
    const navigate = useNavigate();

    const items = [
        {
            label: (
                <>
                    <ReconciliationOutlined /> Profile
                </>
            ),
            key: "profile",
        },
        {
            label: (
                <>
                    <BellOutlined /> Notifications
                </>
            ),
            key: "notifications",
        },
        {
            type: "divider",
        },
        {
            label: (
                <>
                    <LogoutOutlined /> Logout
                </>
            ),
            key: "logout",
        },
    ];

    const usePathname = () => {
        const location = useLocation();
        return location.pathname == "/"
            ? "dashboard"
            : location.pathname.replace("/", "");
    };

    const onLogout = () => {
        axiosClient
            .post("/logout")
            .then(() => {
                setUser({});
                setToken(null);
                setRole(null);
                setPermissions([]);
                message.info("Successful logout");
                navigate("/login");
            })
            .catch((err) => console.log(err));
    };

    const userClick = ({ key }) => {
        switch (key) {
            case "profile":
                break;
            case "notifications":
                break;
            case "logout":
                onLogout();
                break;

            default:
                break;
        }
    };

    const getItem = (label, key, icon, children, type) => {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    };

    const rootSubmenuKeys = ["company", "system"];
    const [openKeys, setOpenKeys] = useState(["company"]);
    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    const showMenuItems = () => {
        let menu = [
            getItem(
                <Link to={"/dashboard"}>Dashboard</Link>,
                "dashboard",
                <DashboardOutlined />
            ),
        ];
        // console.log(permissions)
        if (permissions && permissions.includes("account.view")) {
            menu = [
                ...menu,
                getItem(
                    <Link to={"/users"}>Users</Link>,
                    "users",
                    <UserOutlined />
                ),
            ];
        }
        if (permissions && permissions.includes("company.view")) {
            menu = [
                ...menu,
                getItem("Company", "company", <GroupOutlined />, [
                    getItem(
                        <Link to={"/companies"}>Companies</Link>,
                        "companies"
                    ),
                    getItem(
                        <Link to={"/import-excel"}>Import Excel</Link>,
                        "import-excel"
                    ),
                ]),
            ];
        }
        if (
            permissions && (permissions.includes("log.view") ||
            permissions.includes("role.view"))
        ) {
            menu = [
                ...menu,
                getItem("System", "system", <SettingOutlined />, [
                    getItem(<Link to={"/roles"}>Roles</Link>, "roles"),
                    getItem(<Link to={"/logs"}>Logs</Link>, "logs"),
                ]),
            ];
        }
        return menu;
    };
    const menuItems = showMenuItems();

    return (
        <Layout hasSider>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                className="vh-100"
                style={{
                    overflow: "auto",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div className="logo d-flex justify-content-center align-items-center">
                    {collapsed ? (
                        <b className="text-white">A</b>
                    ) : (
                        <b className="text-white">ADMIN</b>
                    )}
                </div>
                <Menu
                    // className="vh-100"
                    theme="dark"
                    mode="inline"
                    openKeys={openKeys ? openKeys : usePathname()}
                    onOpenChange={onOpenChange}
                    selectedKeys={[usePathname()]}
                    items={menuItems}
                />
            </Sider>
            <Layout
                className="site-layout"
                style={{
                    marginLeft: collapsed ? 80 : 200,
                }}
            >
                <Header
                    style={{
                        padding: 0,
                        background: "rgb(255, 255, 255)",
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="ps-3">
                            {React.createElement(
                                collapsed
                                    ? MenuUnfoldOutlined
                                    : MenuFoldOutlined,
                                {
                                    className: "trigger",
                                    onClick: () => setCollapsed(!collapsed),
                                }
                            )}
                        </div>
                        <div className="pe-3">
                            <Dropdown
                                menu={{
                                    items,
                                    onClick: userClick,
                                }}
                                trigger={["click"]}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <UserOutlined />
                                        {user.name}
                                        <DownOutlined />
                                    </Space>
                                </a>
                            </Dropdown>
                        </div>
                    </div>
                </Header>
                <Content
                    className="min-vh-100 p-3"
                    style={{
                        margin: "24px 16px",
                        background: "rgb(255, 255, 255)",
                        overflow: "initial",
                        // minHeight: 800,
                    }}
                >
                    <Breadcrumbs />
                    <Outlet />
                </Content>
                <Footer className="d-flex justify-content-between align-items-center p-3 bg-white">
                    <div>Company</div>
                    <div>About</div>
                </Footer>
            </Layout>
        </Layout>
    );
};
