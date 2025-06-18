// 1. Imports
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// 2. Types
type HeaderProps = {
  className?: string;
};

// 3. Component
const Header = ({ className }: HeaderProps) => {
  // 4. Hooks
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  // 5. Effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 6. Handlers
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50'
          : 'bg-transparent'
      } ${className || ''}`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            TotVPS
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['home', 'plans', 'features', 'faq'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="relative text-slate-300 hover:text-white transition-colors duration-300 group px-4 py-2"
              >
                {t(item)}
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 -z-10"></span>
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
            ))}
          </nav>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 rounded-full border border-slate-700/50 transition-all duration-300"
            >
              <span className="text-sm font-medium text-slate-300">
                {language.toUpperCase()}
              </span>
              <div className="w-8 h-4 bg-slate-700 rounded-full relative">
                <div
                  className={`absolute top-0.5 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-transform duration-300 ${
                    language === 'vi' ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                ></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.displayName = 'Header';

export { Header };
export type { HeaderProps };
