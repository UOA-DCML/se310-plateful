import React from 'react';
import { IoShareSocial } from 'react-icons/io5';
import { useTheme } from '../context/ThemeContext';

const ShareButton = ({ onClick, className = '' }) => {
  const { isDark } = useTheme();

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer ${isDark
          ? 'bg-gray-800 border border-gray-600 hover:bg-gray-700 text-gray-100'
          : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-900'
        } ${className}`}
      aria-label="Share restaurant"
    >
      <IoShareSocial className="text-lg" />
      <span className="text-sm font-medium">Share</span>
    </button>
  );
};

export default ShareButton;
