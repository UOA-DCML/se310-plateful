import { Link } from "react-router-dom";
import { useState } from "react";
import navLogo from "../assets/navlogo.png";
import UserSidebar from "./UserSidebar";
import { useAuth } from "../auth/AuthContext";

const NavBar = () => {
  const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
  const { isAuthed } = useAuth() ?? {};

  const toggleUserSidebar = () => {
    setIsUserSidebarOpen((prev) => !prev);
  };

  const closeUserSidebar = () => {
    setIsUserSidebarOpen(false);
  };
  return (
    <>
      <nav className="relative top-0 left-0 w-full h-[70px] flex items-center justify-between px-8 bg-white shadow-md z-[1000]">
        <div className="flex items-center">
          <Link to="/" className="block">
            <img src={navLogo} alt="Logo" className="h-10" />
          </Link>
        </div>

        <div className="flex gap-6">
          <Link
            to="/location"
            className="text-gray-800 font-medium hover:text-gray-600 transition"
          >
            Location
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/about"
            className="text-gray-800 font-medium hover:text-gray-600 transition"
          >
            About
          </Link>
          <Link
            to="/search"
            className="text-gray-800 font-medium hover:text-gray-600 transition"
          >
            Search
          </Link>

          {isAuthed ? (
            <button
              onClick={toggleUserSidebar}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
              className="text-gray-800 font-medium hover:text-gray-600 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {isAuthed && (
        <UserSidebar isOpen={isUserSidebarOpen} onClose={closeUserSidebar} />
      )}
    </>
  );
};

export default NavBar;
