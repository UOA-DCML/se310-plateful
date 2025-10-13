import React from 'react';
import { IoShareSocial } from 'react-icons/io5';

const ShareButton = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-md ${className}`}
      aria-label="Share restaurant"
    >
      <IoShareSocial className="text-lg" />
      <span className="text-sm font-medium">Share</span>
    </button>
  );
};

export default ShareButton;
