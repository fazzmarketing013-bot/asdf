
import React from 'react';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <i className="fa-solid fa-utensils text-2xl text-primary-500"></i>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Mess Manager Pro
            </h1>
          </div>
          <div className="flex items-center">
            <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              <i className={`fas ${isDarkMode ? 'fa-moon' : 'fa-sun'}`}></i>
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
