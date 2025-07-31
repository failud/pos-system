import React, { useEffect, useState } from 'react';
import { Menu, X, Bell } from 'lucide-react';
import { Button, Tabs } from 'antd';
import type { TabsProps } from 'antd';
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
  const [activeTab, setActiveTab] = useState('1');
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

  const tabItems: TabsProps['items'] = [
    {
      key: 'dashboard',
      label: t("Dashboard"),
    },
    {
      key: 'sales',
      label: t("Sales"),
    },
    {
      key: 'products',
      label: t("Product"),
    },
    {
      key: 'categories',
      label: t("Category"),
    },
  ];

  const handleTabChange = (key: string) => {
    navigate(`/${key}`);
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              {t('My Store')}
            </h1>
          </div>

          {/* Desktop Navigation with Tabs */}
          <nav className="hidden md:block">
            <Tabs
            tabPosition='bottom'
              activeKey={location.pathname.split('/')[1] || 'dashboard'}
              items={tabItems}
              onChange={handleTabChange}
              className=""
            />
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
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
            <Tabs
              activeKey={location.pathname.split('/')[1] || 'dashboard'}
              items={tabItems}
              onChange={handleTabChange}
              tabPosition="top"
              centered
              className="w-full"
            />
            
            <div className="pt-4 border-t border-gray-200">
              <Button 
                onClick={openLoginModal}
                type='primary'
                block
              >
                {t("login")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ATLoginNavbar;