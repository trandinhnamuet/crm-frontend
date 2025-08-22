
import { Layout, Menu, Button, Dropdown, Drawer } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined, HomeOutlined, TeamOutlined, UsergroupAddOutlined, ApartmentOutlined, CarOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useUser } from './context/UserContext';

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: <Link to="/">Trang Chủ</Link>,
  },
  {
    key: '/user',
    icon: <TeamOutlined />,
    label: <Link to="/user">Tài khoản</Link>,
  },
  {
    key: '/customer',
    icon: <UsergroupAddOutlined />,
    label: <Link to="/customer">Khách hàng</Link>,
  },
  {
    key: '/route-template',
    icon: <ApartmentOutlined />,
    label: <Link to="/route-template">Lộ Trình</Link>,
  },
  {
    key: '/route-instance',
    icon: <CarOutlined />,
    label: <Link to="/route-instance">Đi Tuyến</Link>,
  },
];


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, setUser } = useUser();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/login');
  };

  const handleProfile = () => {
    if (user && user.id) {
      navigate(`/user/${user.id}`);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />,
      onClick: handleProfile,
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  // Sidebar content
  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div
          style={{
            height: 64,
            color: darkMode ? 'white' : 'black',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 24,
            padding: 16,
            background: darkMode ? '#001529' : '#f9f9f9',
            transition: 'background 0.2s',
          }}
        >
          <a href="/" style={{ color: 'inherit', textDecoration: 'none', display: 'block', width: '100%', height: '100%' }}>CRM</a>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <Menu
            theme={darkMode ? 'dark' : 'light'}
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={() => isMobile && setCollapsed(false)}
            style={{ background: darkMode ? '#001529' : '#f9f9f9', height: '100%' }}
          />
        </div>
        <div style={{ marginTop: 'auto', padding: 0 }}>
          <span
            style={{
              cursor: 'pointer',
              color: darkMode ? 'white' : 'black',
              background: darkMode ? '#002259' : '#f0f0f0',
              borderRadius: 0,
              padding: '16px 0',
              display: 'block',
              fontWeight: 500,
              fontSize: 15,
              width: '100%',
              textAlign: 'center',
              transition: 'background 0.2s',
              boxShadow: '0 -1px 4px rgba(0,0,0,0.04)'
            }}
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {darkMode ? 'Dark Mode' : 'Light Mode'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar for desktop */}
      {!isMobile && (
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          collapsed={collapsed}
          width="12%"
          style={{ background: darkMode ? '#001529' : '#fff' }}
        >
          {sidebarContent}
        </Sider>
      )}
      {/* Drawer for mobile */}
      {isMobile && (
        <Drawer
          placement="left"
          open={collapsed}
          onClose={() => setCollapsed(false)}
          closable={false}
          width="80vw"
          bodyStyle={{ padding: 0, background: darkMode ? '#032c6e' : '#f9f9f9' }}
          maskStyle={{ background: 'rgba(0,0,0,0.3)' }}
        >
          {sidebarContent}
        </Drawer>
      )}
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
            {!isMobile && <span>CRM Application</span>}
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
        <Content style={{ margin: isMobile ? 0 : '24px', background: '#fff', borderRadius: 8, padding: isMobile ? 12 : 24, minHeight: 200 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
