import { Layout, Menu, Button, Dropdown } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useUser } from './context/UserContext';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/', label: <Link to="/">Trang Chủ</Link> },
  { key: '/user', label: <Link to="/user">Quản Lý User</Link> },
  { key: '/customer', label: <Link to="/customer">Quản Lý Khách hàng</Link> },
  { key: '/route-template', label: <Link to="/route-template">Lộ Trình</Link> },
  { key: '/route-instance', label: <Link to="/route-instance">Đi Tuyến</Link> },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { user, setUser } = useUser();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={collapsed}
        width="12%"
      >
        <div style={{ height: 64, color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 24, padding: 16 }}>
          CRM
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', fontSize: 20, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 16 }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: 20 }}
              />
            </span>
            <span>CRM Application</span>
          </div>
          {user && (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" style={{ fontSize: 16, fontWeight: 400, color: '#1677ff' }}>
                <UserOutlined style={{ marginRight: 8 }} />
                {user.fullname}
              </Button>
            </Dropdown>
          )}
        </Header>
        <Content style={{ margin: '24px', background: '#fff', borderRadius: 8, padding: 24 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
