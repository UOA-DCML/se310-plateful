import { useState } from "react";
import { Link } from "react-router-dom";
import navLogo from "../assets/navlogo.png";
import UserSidebar from "./UserSidebar";
import { useAuth } from "../auth/AuthContext";
import TextSizeSlider from "./TextSizeSlider";
import ThemeToggle from "./ThemeToggle";

const NavBar = () => {
  const { user, isAuthed } = useAuth() ?? {};
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
        className="rounded-full px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-lime-50 hover:text-lime-700 sm:text-base"
        onClick={closeMenu}
      >
        About
      </Link>
      <Link
        to="/search"
        className="rounded-full px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-lime-50 hover:text-lime-700 sm:text-base"
        onClick={closeMenu}
      >
        Search
      </Link>
      {isAuthed ? (
        <button
          onClick={toggleUserSidebar}
          className="relative p-2 rounded-full hover:bg-lime-50 transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
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
          className="rounded-full px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-lime-50 hover:text-lime-700 sm:text-base"
          onClick={closeMenu}
        >
          Sign In
        </Link>
      )}
    </>
  );

  return (
    <>
      <nav className="sticky top-0 z-[1000] w-full border-b border-lime-50 bg-white/90 backdrop-blur">
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
            className="inline-flex items-center justify-center rounded-full p-2 text-gray-700 transition hover:bg-lime-50 md:hidden"
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
          <div className="border-t border-lime-100 bg-white/95 px-4 py-4 shadow-inner md:hidden">
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
