import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import navLogo from "../assets/navlogo.png";
import UserSidebar from "./UserSidebar";
import { useAuth } from "../auth/AuthContext";
import TextSizeSlider from "./TextSizeSlider";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const NavBar = () => {
  const { user, isAuthed } = useAuth() ?? {};
  const { isDark } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const toggleUserSidebar = () => {
    setIsUserSidebarOpen((prev) => !prev);
  };

  const closeUserSidebar = () => {
    setIsUserSidebarOpen(false);
  };

  // Handle scroll effect for navbar elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if a route is active
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Navigation items configuration
  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Search', path: '/search', icon: '🔍' },
    { name: 'About', path: '/about', icon: 'ℹ️' }
  ];

  const NavLink = ({ item, mobile = false }) => {
    const active = isActiveRoute(item.path);
    return (
      <Link
        to={item.path}
        onClick={closeMenu}
        className={`
          relative group flex items-center gap-2 px-4 py-2.5 rounded-lg
          font-medium transition-all duration-200
          ${mobile ? 'text-base w-full justify-start' : 'text-sm'}
          ${active
            ? isDark
              ? 'bg-slate-700 text-white'
              : 'bg-lime-100 text-lime-800'
            : isDark
              ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              : 'text-gray-700 hover:bg-lime-50 hover:text-lime-700'
          }
        `}
      >
        {mobile && <span className="text-lg">{item.icon}</span>}
        <span>{item.name}</span>
        {active && !mobile && (
          <motion.div
            layoutId="activeTab"
            className={`absolute bottom-0 left-0 right-0 h-0.5 ${
              isDark ? 'bg-lime-400' : 'bg-lime-600'
            }`}
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-[1000] w-full backdrop-blur-md transition-all duration-300 ${
          scrolled ? 'shadow-lg' : 'shadow-sm'
        }`}
        style={{
          backgroundColor: isDark 
            ? scrolled ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.9)'
            : scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
          borderBottom: isDark 
            ? `1px solid rgba(51, 65, 85, ${scrolled ? '0.8' : '0.5'})` 
            : `1px solid rgba(236, 252, 203, ${scrolled ? '1' : '0.5'})`
        }}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group" 
            onClick={closeMenu}
          >
            <motion.img 
              src={navLogo} 
              alt="Plateful Logo" 
              className="h-10 sm:h-11 transition-transform duration-200 group-hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Navigation Links */}
            <div className="flex items-center gap-1 mr-2">
              {navItems.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </div>

            {/* Divider */}
            <div 
              className="h-8 w-px mx-2"
              style={{
                backgroundColor: isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(0, 0, 0, 0.1)'
              }}
            />

            {/* Utility Controls */}
            <div className="flex items-center gap-2">
              <TextSizeSlider />
              <ThemeToggle />
            </div>

            {/* Divider */}
            <div 
              className="h-8 w-px mx-2"
              style={{
                backgroundColor: isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(0, 0, 0, 0.1)'
              }}
            />

            {/* User Section */}
            {isAuthed ? (
              <motion.button
                onClick={toggleUserSidebar}
                className={`relative p-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDark
                    ? "hover:bg-slate-700 focus:ring-slate-500"
                    : "hover:bg-lime-50 focus:ring-lime-500"
                }`}
                aria-label="Open user menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-9 h-9 bg-gradient-to-br from-lime-500 via-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-white/20">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                {user?.name && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-3 h-3 border-2 border-white"
                    title="Online"
                  />
                )}
              </motion.button>
            ) : (
              <Link
                to="/signin"
                className={`
                  px-5 py-2.5 rounded-lg font-semibold text-sm
                  transition-all duration-200 shadow-sm hover:shadow-md
                  ${isDark
                    ? "bg-gradient-to-r from-lime-600 to-green-600 text-white hover:from-lime-500 hover:to-green-500"
                    : "bg-gradient-to-r from-lime-500 to-green-500 text-white hover:from-lime-600 hover:to-green-600"
                  }
                `}
                onClick={closeMenu}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            type="button"
            className={`inline-flex items-center justify-center rounded-lg p-2.5 transition-colors md:hidden ${
              isDark
                ? "text-slate-100 hover:bg-slate-700"
                : "text-gray-700 hover:bg-lime-50"
            }`}
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.svg
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden md:hidden"
              style={{
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                borderTop: isDark ? '1px solid rgba(51, 65, 85, 0.5)' : '1px solid rgba(236, 252, 203, 1)'
              }}
            >
              <div className="px-4 py-6 space-y-4">
                {/* Navigation Links */}
                <div className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NavLink item={item} mobile />
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div 
                  className="h-px w-full"
                  style={{
                    backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                  }}
                />

                {/* User Section for Mobile */}
                {isAuthed ? (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => {
                      toggleUserSidebar();
                      closeMenu();
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors duration-200
                      ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-lime-50 hover:bg-lime-100'}
                    `}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-lime-500 via-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user?.name || 'My Account'}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        View Profile
                      </p>
                    </div>
                    <svg className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      to="/signin"
                      onClick={closeMenu}
                      className={`
                        w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg
                        font-semibold transition-all duration-200 shadow-md hover:shadow-lg
                        ${isDark
                          ? "bg-gradient-to-r from-lime-600 to-green-600 text-white hover:from-lime-500 hover:to-green-500"
                          : "bg-gradient-to-r from-lime-500 to-green-500 text-white hover:from-lime-600 hover:to-green-600"
                        }
                      `}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign In
                    </Link>
                  </motion.div>
                )}

                {/* Divider */}
                <div 
                  className="h-px w-full"
                  style={{
                    backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                  }}
                />

                {/* Settings */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <p className={`text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    Settings
                  </p>
                  <TextSizeSlider className="w-full" />
                  <ThemeToggle />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {isAuthed && (
        <UserSidebar isOpen={isUserSidebarOpen} onClose={closeUserSidebar} />
      )}
    </>
  );
};

export default NavBar;
