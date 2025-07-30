import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../languages/LanguageContext';
import LoginModal from '../common/modals/LoginModal';
import MainFooter from '../common/footers/MainFooter';
import ATLoginNavbar from '../common/ืnavbars/ATLoginNavbar';
import BFLoginNavbar from '../common/ืnavbars/BFLoginNavbar';


interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { t } = useLanguage();
  const [login_modal, setLoginModal] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openLoginModal = () => {
    setLoginModal(true);
  };

  // Check if current path is '/' or '/welcome'
  const isWelcomePath = ['/', '/welcome'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <LoginModal t={t} onCancel={() => setLoginModal(false)} open={login_modal} />

      {isWelcomePath ? (
        <BFLoginNavbar
          t={t}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          openLoginModal={openLoginModal}
        />
      ) : (
        <ATLoginNavbar
          t={t}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          openLoginModal={openLoginModal}
        />
      )}

      <main className="flex-1">
        {children}
      </main>

      <MainFooter t={t} />
    </div>
  );
};

export default Layout;