import React from 'react';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { useLanguage, LANGUAGES, type LanguageType } from './LanguageContext';

interface LanguageOption {
  key: LanguageType;
  icon: string;
  alt: string;
  // label: string
}

// Language options configuration
const languageOptions: LanguageOption[] = [
  {
    key: LANGUAGES.LA,
    icon: '/icons/flags/laos.png',
    alt: 'Lao Language',
    // label: "LA"
  },
  {
    key: LANGUAGES.EN,
    icon: '/icons/flags/united-kingdom.png',
    alt: 'English Language',
    // label: "EN"
  },
];

const LanguageButton: React.FC = () => {
  const { currentLanguage, setLanguage, t } = useLanguage();

  const selectedLanguage = languageOptions.find(lang => lang.key === currentLanguage) || languageOptions[0];

  const handleLanguageSelect: MenuProps['onClick'] = ({ key }) => {
    setLanguage(key as LanguageType);
    // window.location.reload();
  };

  const items: MenuProps['items'] = languageOptions
    .filter(lang => lang.key !== currentLanguage)
    .map(lang => ({
      key: lang.key,
      label: (
        <div className="flex items-center gap-2 py-2 justify-center rounded-md">
          <img 
            className="w-5 h-5 undrag" 
            src={lang.icon} 
            alt={lang.alt}
          />
          {/* <span>{lang.label}</span> */}
        </div>
      ),
    }));

  return (
    <Dropdown 
      menu={{ items, onClick: handleLanguageSelect }}
      placement="bottom"
      trigger={['click']}
      className='hover:bg-custom_light_cyan'
    >
      <button 
        className="flex items-center p-1 rounded-full hover:ring-4 duration-500 hover:ring-custom_blue_sky hover:bg-gray-100"
        aria-label={t('change_language')}
      >
        <img 
          className="w-5 h-5" 
          src={selectedLanguage.icon} 
          alt={selectedLanguage.alt}
        />
        {/* <span className="text-sm">{selectedLanguage.label}</span> */}
      </button>
    </Dropdown>
  );
};

export default LanguageButton;