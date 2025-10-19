import { useState } from "react";
import { Link } from "react-router-dom";
import navLogo from "../assets/navlogo.png";
import UserSidebar from "./UserSidebar";
import { useAuth } from "../auth/AuthContext";
import TextSizeSlider from "./TextSizeSlider";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const NavBar = () => {
  const { user, isAuthed } = useAuth() ?? {};
  const { isDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const toggleUserSidebar = () => {
    setIsUserSidebarOpen((prev) => !prev);
  };

  const closeUserSidebar = () => {
    setIsUserSidebarOpen(false);
  };

  const navLinks = (
    <>
      <Link
        to="/about"
        className={`rounded-full px-3 py-2 text-sm font-medium transition sm:text-base ${isDark
            ? "text-slate-100 hover:bg-slate-700 hover:text-slate-50"
            : "text-gray-800 hover:bg-lime-50 hover:text-lime-700"
          }`}
        onClick={closeMenu}
      >
        About
      </Link>
      <Link
        to="/search"
        className={`rounded-full px-3 py-2 text-sm font-medium transition sm:text-base ${isDark
            ? "text-slate-100 hover:bg-slate-700 hover:text-slate-50"
            : "text-gray-800 hover:bg-lime-50 hover:text-lime-700"
          }`}
        onClick={closeMenu}
      >
        Search
      </Link>
      {isAuthed ? (
        <button
          onClick={toggleUserSidebar}
          className={`relative p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDark
              ? "hover:bg-slate-700 focus:ring-slate-500"
              : "hover:bg-lime-50 focus:ring-lime-500"
            }`}
          aria-label="Open user menu"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </button>
      ) : (
        <Link
          to="/signin"
          className={`rounded-full px-3 py-2 text-sm font-medium transition sm:text-base ${isDark
              ? "text-slate-100 hover:bg-slate-700 hover:text-slate-50"
              : "text-gray-800 hover:bg-lime-50 hover:text-lime-700"
            }`}
          onClick={closeMenu}
        >
          Sign In
        </Link>
      )}
    </>
  );

  return (
    <>
      <nav
        className="sticky top-0 z-[1000] w-full backdrop-blur"
        style={{
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderBottom: isDark ? '1px solid rgba(51, 65, 85, 0.5)' : '1px solid rgba(236, 252, 203, 0.5)'
        }}
      >
        <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link to="/" className="block" onClick={closeMenu}>
            <img src={navLogo} alt="Logo" className="h-9 sm:h-10" />
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            {navLinks}
            <TextSizeSlider />
            <ThemeToggle />
          </div>

          <button
            type="button"
            className={`inline-flex items-center justify-center rounded-full p-2 transition md:hidden ${isDark
                ? "text-slate-100 hover:bg-slate-700"
                : "text-gray-700 hover:bg-lime-50"
              }`}
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div
            className="px-4 py-4 shadow-inner md:hidden"
            style={{
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              borderTop: isDark ? '1px solid rgba(51, 65, 85, 0.5)' : '1px solid rgba(236, 252, 203, 1)'
            }}
          >
            <div className="flex flex-col gap-3">
              {navLinks}
              <TextSizeSlider className="mt-2" />
              <div className="mt-2"><ThemeToggle /></div>
            </div>
          </div>
        )}
      </nav>

      {isAuthed && (
        <UserSidebar isOpen={isUserSidebarOpen} onClose={closeUserSidebar} />
      )}
    </>
  );
};

export default NavBar;
