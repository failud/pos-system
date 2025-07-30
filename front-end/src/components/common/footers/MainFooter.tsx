import React from 'react';

interface FooterProps {
  t: (key: string) => string;
}

const MainFooter: React.FC<FooterProps> = ({ t }) => {
  return (
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
              <li><a href="#" className="hover:text-white transition-colors">{t("home")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("about")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("contact")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("contact")}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>{t("email")}: info@myapp.com</li>
              <li>{t("phone")}: +1 234 567 8900</li>
              <li>{t("address")}: 123 Main St, City</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 SkotByte.</p>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;