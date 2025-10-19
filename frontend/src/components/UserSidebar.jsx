import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../context/ThemeContext';

const UserSidebar = ({ isOpen, onClose }) => {
  const sidebarRef = useRef(null);
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const { user: authUser, signOut } = useAuth() ?? {};
  const { isDark } = useTheme();

  // Load user data
  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const profile = await userService.getCurrentUser();
        setUserData(profile);
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [isOpen]);

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
    (async () => {
      try {
        await signOut?.();
        toast.success('Signed out successfully!');
      } catch (err) {
        console.error('Failed to sign out', err);
        toast.error('Failed to sign out. Please try again.');
      } finally {
        onClose();
        navigate('/');
      }
    })();
  };

  const displayName = userData?.name || authUser?.name || authUser?.username || (authUser?.email ? authUser.email.split('@')[0] : 'User');
  const displayEmail = userData?.email || authUser?.email || 'No email';
  const avatarLetter = displayName ? displayName.charAt(0).toUpperCase() : 'U';

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[1010] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        style={{
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)'
        }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-80 shadow-2xl z-[1020] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        style={{
          backgroundColor: isDark ? '#1e293b' : '#ffffff'
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6"
          style={{
            borderBottom: isDark ? '1px solid #334155' : '1px solid #e5e7eb'
          }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: isDark ? '#f1f5f9' : '#111827' }}
          >
            User Menu
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors"
            style={{
              backgroundColor: isDark ? 'transparent' : 'transparent',
              color: isDark ? '#cbd5e1' : '#4b5563'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        {/* User Info */}
        <div
          className="p-6"
          style={{
            borderBottom: isDark ? '1px solid #334155' : '1px solid #e5e7eb'
          }}
        >
          {loading ? (
            <div className="animate-pulse">
              <div
                className="rounded-full h-16 w-16 mb-4"
                style={{ backgroundColor: isDark ? '#334155' : '#d1d5db' }}
              ></div>
              <div
                className="h-4 rounded mb-2"
                style={{ backgroundColor: isDark ? '#334155' : '#d1d5db' }}
              ></div>
              <div
                className="h-3 rounded w-2/3"
                style={{ backgroundColor: isDark ? '#334155' : '#d1d5db' }}
              ></div>
            </div>
          ) : userData || authUser ? (
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full h-16 w-16 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {avatarLetter}
              </div>
              <h3
                className="font-semibold"
                style={{ color: isDark ? '#f1f5f9' : '#1f2937' }}
              >
                {displayName}
              </h3>
              <p
                className="text-sm"
                style={{ color: isDark ? '#94a3b8' : '#4b5563' }}
              >
                {displayEmail}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div
                className="rounded-full h-16 w-16 flex items-center justify-center text-xl font-bold mx-auto mb-4"
                style={{ backgroundColor: isDark ? '#475569' : '#6b7280', color: 'white' }}
              >
                U
              </div>
              <h3
                className="font-semibold"
                style={{ color: isDark ? '#f1f5f9' : '#1f2937' }}
              >
                User
              </h3>
              <p
                className="text-sm"
                style={{ color: isDark ? '#94a3b8' : '#4b5563' }}
              >
                No email
              </p>
            </div>
          )}
        </div>        {/* Menu Items */}
        <nav className="p-4">
          <div className="space-y-2">
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg transition-colors"
              style={{ color: isDark ? '#e2e8f0' : '#374151' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>User Profile</span>
            </Link>

            <Link
              to="/settings"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg transition-colors"
              style={{ color: isDark ? '#e2e8f0' : '#374151' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
              className="flex items-center space-x-3 p-3 rounded-lg transition-colors"
              style={{ color: isDark ? '#e2e8f0' : '#374151' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Browse History</span>
            </Link>

            <Link
              to="/favorites"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg transition-colors"
              style={{ color: isDark ? '#e2e8f0' : '#374151' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Favorites</span>
            </Link>

            <div
              className="my-4"
              style={{ borderTop: isDark ? '1px solid #334155' : '1px solid #e5e7eb' }}
            ></div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 p-3 rounded-lg transition-colors w-full text-left text-red-600"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#7f1d1d' : '#fef2f2'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
