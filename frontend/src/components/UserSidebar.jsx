import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';

const UserSidebar = ({ isOpen, onClose }) => {
  const sidebarRef = useRef(null);
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Load user data
  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const user = await userService.getCurrentUser();
        setUserData(user);
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadUserData();
    }
  }, [isOpen]);

  // Mock user data - replace with actual user data when backend is ready
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: null
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleLogout = () => {
    // TODO: Implement logout logic when backend is ready
    console.log("Logout clicked");
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-[1010] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[1020] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">User Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
          {/* User Info */}
          <div className="p-6 border-b border-gray-200">
            {loading ? (
              <div className="animate-pulse">
                <div className="bg-gray-300 rounded-full h-16 w-16 mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-3 rounded w-2/3"></div>
              </div>
            ) : userData ? (
              <div className="text-center">
                <div className="bg-blue-500 text-white rounded-full h-16 w-16 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h3 className="font-semibold text-gray-800">{userData.name || 'User'}</h3>
                <p className="text-gray-600 text-sm">{userData.email || 'No email'}</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-gray-500 text-white rounded-full h-16 w-16 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  U
                </div>
                <h3 className="font-semibold text-gray-800">User</h3>
                <p className="text-gray-600 text-sm">No email</p>
              </div>
            )}
          </div>        {/* Menu Items */}
        <nav className="p-4">
          <div className="space-y-2">
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>User Profile</span>
            </Link>

            <Link
              to="/settings"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </Link>

            <Link
              to="/history"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Browse History</span>
            </Link>

            <Link
              to="/favorites"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Favorites</span>
            </Link>

            <div className="border-t border-gray-200 my-4"></div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default UserSidebar;
