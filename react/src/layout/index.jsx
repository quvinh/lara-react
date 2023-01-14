import React, { useState } from 'react';
import {
    DashboardOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    DownOutlined,
    ReconciliationOutlined,
    BellOutlined,
    LogoutOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme, Dropdown, Space, FloatButton, Breadcrumb } from 'antd';
import { Outlet, Link, Navigate, useLocation } from 'react-router-dom';
import { useStateContext } from '../context/ContextProvider';
import axiosClient from '../../../react/src/axios-client';
import { message } from 'antd'
import { Breadcrumbs } from '../components/Breadcrumbs'

export const index = () => {
    const { user, token, setUser, setToken } = useStateContext();
    const [collapsed, setCollapsed] = useState(false);
    const { Header, Sider, Content, Footer } = Layout;

    const items = [
        {
            label: <><ReconciliationOutlined /> Profile</>,
            key: 'profile',
        },
        {
            label: <><BellOutlined /> Notifications</>,
            key: 'notifications',
        },
        {
            type: 'divider',
        },
        {
            label: <><LogoutOutlined /> Logout</>,
            key: 'logout',
        },
    ];


    if (!token) {
        return <Navigate to={"/login"} />
    }

    const usePathname = () => {
        const location = useLocation();
        return location.pathname == '/' ? 'dashboard' : (location.pathname).replace('/', '');
    }

    const onLogout = () => {
        axiosClient.post('/logout')
            .then(() => {
                setUser({});
                setToken(null);
                message.info('Successful logout');
            })
    }

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
    }

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo d-flex justify-content-center align-items-center">
                    {collapsed ? <b className='text-white'>A</b> : <b className='text-white'>ADMIN</b>}
                </div>
                <Menu
                    className="vh-100"
                    theme="dark"
                    mode="inline"
                    selectedKeys={[usePathname()]}
                    items={[
                        {
                            key: 'dashboard',
                            icon: <DashboardOutlined />,
                            label: <Link to={'/dashboard'}>Dashboard</Link>,
                        },
                        {
                            key: 'users',
                            icon: <UserOutlined />,
                            label: <Link to={'/users'}>Users</Link>,
                        },
                        {
                            key: 'logs',
                            icon: <HistoryOutlined />,
                            label: <Link to={'/logs'}>Logs</Link>,
                        }
                    ]}
                />
            </Sider>
            <Layout className="site-layout">
                <Header
                    style={{
                        padding: 0,
                        background: 'rgb(255, 255, 255)',
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="ps-3">
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                        </div>
                        <div className="pe-3">
                            <Dropdown
                                menu={{
                                    items,
                                    onClick: userClick
                                }}
                                trigger={['click']}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <UserOutlined />{user.name}
                                        <DownOutlined />
                                    </Space>
                                </a>
                            </Dropdown>
                        </div>
                    </div>

                </Header>
                <Content
                    className="h-auto p-3"
                    style={{
                        margin: '24px 16px',
                        background: 'rgb(255, 255, 255)',
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
    )
}
