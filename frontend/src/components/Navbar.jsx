import { Link } from "react-router-dom";
import { useState } from "react";
import navLogo from "../assets/navlogo.png";
import UserSidebar from "./UserSidebar";

const NavBar = () => {
  const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);

  const toggleUserSidebar = () => {
    setIsUserSidebarOpen(!isUserSidebarOpen);
  };

  const closeUserSidebar = () => {
    setIsUserSidebarOpen(false);
  };

  return (
    <>
      <nav className="relative top-0 left-0 w-full h-[70px] flex items-center justify-between px-8 bg-white shadow-md z-[1000]">
        <div className="flex items-center">
          <a href="/" className="block">
            <img src={navLogo} alt="Logo" className="h-10" />
          </a>
        </div>

        <div className="flex gap-6">
          <a
            href="/location"
            className="text-gray-800 font-medium hover:text-gray-600 transition"
          >
            Location
          </a>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="/about"
            className="text-gray-800 font-medium hover:text-gray-600 transition"
          >
            About
          </a>
          <a
            href="/search"
            className="text-gray-800 font-medium hover:text-gray-600 transition"
          >
            Search
          </a>
          
          {/* User Profile Icon */}
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
            
            {/* Notification dot (optional - for future use) */}
            {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div> */}
          </button>
        </div>
      </nav>

      {/* User Sidebar */}
      <UserSidebar isOpen={isUserSidebarOpen} onClose={closeUserSidebar} />
    </>
  );
};

export default NavBar;
