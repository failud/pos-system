import React from 'react';
import { Menu, X, Bell } from 'lucide-react';
import LanguageButton from '../languages/LanguageButton';
import { useLanguage } from '../languages/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { t } = useLanguage();


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                {t('welcome')}
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                Services
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                Contact
              </a>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="btn btn-primary">
                Get Started
              </button>
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
            <nav className="container-custom py-4">
              <div className="flex flex-col space-y-3">
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                  Home
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                  About
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                  Services
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                  Contact
                </a>
                <div className="pt-4 border-t border-gray-200">
                  <button className="btn btn-primary w-full">
                    Get Started
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">MyApp</h3>
              <p className="text-gray-400 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@myapp.com</li>
                <li>Phone: +1 234 567 8900</li>
                <li>Address: 123 Main St, City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MyApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;