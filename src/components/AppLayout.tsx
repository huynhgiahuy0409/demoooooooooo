import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
    MessageOutlined,
    SettingOutlined,
    FileTextOutlined,
    EditOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/AppLayout.css';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: '/rules',
            icon: <SettingOutlined />,
            label: 'Rule Management',
        },
        {
            key: '/chat',
            icon: <MessageOutlined />,
            label: 'Chat',
        },
        {
            key: '/chat-editor',
            icon: <EditOutlined />,
            label: 'Docs Editor',
        },
        {
            key: '/prompts',
            icon: <FileTextOutlined />,
            label: 'Prompt List',
        },
    ];

    const getSelectedKey = () => {
        const path = location.pathname;
        if (path.startsWith('/rules')) return '/rules';
        if (path.startsWith('/chat-editor')) return '/chat-editor';
        if (path.startsWith('/chat')) return '/chat';
        if (path.startsWith('/prompts')) return '/prompts';
        return '/chat'; // Default
    };

    return (
        <Layout className="app-layout">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                className="app-sider"
                width={200}
                collapsedWidth={80}
            >
                <div className="app-logo">{!collapsed && <span>FS Micro App</span>}</div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[getSelectedKey()]}
                    items={menuItems}
                    onClick={({ key }) => {
                        navigate(key);
                    }}
                />
            </Sider>
            <Layout className={`site-layout ${collapsed ? 'site-layout-collapsed' : ''}`}>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className="trigger-button"
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflow: 'hidden',
                        height: 'fit-content',
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AppLayout;
