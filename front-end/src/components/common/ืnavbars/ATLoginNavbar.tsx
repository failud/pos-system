import React, { useEffect, useState } from 'react';
import { Menu, X, Bell, BarChart3, FileText, Package, Grid3X3, SquareSigma } from 'lucide-react';
import { Button, Drawer, Menu as AntMenu, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import LanguageButton from '../../languages/LanguageButton';
import { DropdownProfile } from '../ui/DropdownProfile';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  t: (key: string) => string;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  openLoginModal: () => void;
}

const ATLoginNavbar: React.FC<HeaderProps> = ({ t, isMobileMenuOpen, toggleMobileMenu, openLoginModal }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [user_data, setUserData] = useState({
    uuid: '',
    role: '',
    first: '',
    last: '',
    email: ''
  });

  useEffect(() => {
    const uuid = localStorage.getItem('uuid') || '';
    const role = localStorage.getItem('role') || '';
    const first = localStorage.getItem('first_name') || '';
    const last = localStorage.getItem('last_name') || '';
    const email = localStorage.getItem('email') || '';

    setUserData({
      uuid,
      role,
      first,
      email,
      last
    });
  }, []);

  const menuConfig = [
    {
      key: 'dashboard',
      icon: <Grid3X3 className="w-5 h-5" />,
      label: t("Dashboard"),
    },
    {
      key: 'sales',
      icon: <BarChart3 className="w-5 h-5" />,
      label: t("Sales"),
    },
    {
      key: 'products',
      icon: <Package className="w-5 h-5" />,
      label: t("Product"),
    },
    {
      key: 'categories',
      icon: <FileText className="w-5 h-5" />,
      label: t("Category"),
    },
    {
      key: 'brands',
      icon: <SquareSigma className="w-5 h-5" />,
      label: t("brands"),
    },
  ];

  const menuItems: MenuProps['items'] = menuConfig.map(item => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  }));

  const mobileMenuItems: MenuProps['items'] = menuConfig.map(item => ({
    key: item.key,
    label: item.label,
  }));

  const handleMenuClick = (key: string) => {
    navigate(`/${key}`);
    setDrawerVisible(false);
  };

  const handleMobileMenuClick = (key: string) => {
    navigate(`/${key}`);
    toggleMobileMenu();
  };

  const handleIconClick = (key: string) => {
    navigate(`/${key}`);
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const currentPath = location.pathname.split('/')[1] || 'dashboard';

  return (
    <>
      {/* Collapsed Sidebar for Desktop */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-200 flex-col items-center py-4 z-30">
        {/* Logo/Menu Toggle */}
        <button
          onClick={toggleDrawer}
          className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-6 hover:bg-blue-600 transition-colors"
        >
          <Grid3X3 className="w-5 h-5 text-white" />
        </button>

        {/* Navigation Icons */}
        <div className="flex flex-col space-y-2 flex-1">
          {menuConfig.map((item) => (
            <Tooltip key={item.key} title={item.label} placement="right">
              <button
                onClick={() => handleIconClick(item.key)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${currentPath === item.key
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
              >
                {item.icon}
              </button>
            </Tooltip>
          ))}
        </div>

        {/* Bottom Icons */}
        <div className="flex flex-col space-y-2">
          <Tooltip title={t('Notifications')} placement="right">
            <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </button>
          </Tooltip>
        </div>
      </div>

      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 md:ml-16">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                {t('My Store')}
              </h1>
            </div>

            {/* Mobile Logo */}
            <div className="md:hidden flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                {t('My Store')}
              </h1>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageButton />

              {user_data.uuid ? (
                <DropdownProfile
                  open={dropdownVisible}
                  onVisibleChange={(visible) => setDropdownVisible(visible)}
                  userData={{
                    first: user_data.first,
                    last: user_data.last,
                    email: user_data.email || '',
                    avatar: user_data.first || '',
                    role: user_data.role || ''
                  }}
                />
              ) : (
                <Button
                  onClick={openLoginModal}
                  type='primary'
                  className="btn btn-primary"
                >
                  {t("login")}
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="container-custom py-4">
              <AntMenu
                mode="vertical"
                selectedKeys={[currentPath]}
                items={mobileMenuItems}
                onClick={({ key }) => handleMobileMenuClick(key)}
                className="border-none"
              />

              <div className="pt-4 mt-4 border-t border-gray-200 flex flex-col space-y-3">
                <LanguageButton />
                {user_data.uuid ? (
                  <div className="text-sm text-gray-600">
                    {t('Logged in as')}: {user_data.first} {user_data.last}
                  </div>
                ) : (
                  <Button
                    onClick={openLoginModal}
                    type='primary'
                    block
                  >
                    {t("login")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Expanded Drawer */}
      <Drawer
        title={
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-800">{t('My Store')}</span>
          </div>
        }
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
        className="drawer-custom"
        mask={false}
        styles={{
          header: {
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: '16px'
          },
          body: {
            padding: '24px 0'
          },
          wrapper: {
            marginLeft: '64px'
          }
        }}
      >
        <div className="flex flex-col h-full">
          {/* Main Menu */}
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-6">
                {t('Menu')}
              </h3>
              <AntMenu
                mode="vertical"
                selectedKeys={[currentPath]}
                items={menuItems}
                onClick={({ key }) => handleMenuClick(key)}
                className="border-none"
                style={{
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          {/* Footer Info */}
          <div className="border-t border-gray-100 pt-4 px-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">{t('Notifications')}</p>
                <p className="text-sm font-medium text-gray-900">15+</p>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Main Content Wrapper */}
      <div className="md:ml-16">
        {/* Your main content goes here */}
      </div>
    </>
  );
};

export default ATLoginNavbar;