import { useState } from "react";
import { Link } from "react-router-dom";
import navLogo from "../assets/navlogo.png";
import { useAuth } from "../auth/AuthContext";

const NavBar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = (
    <>
      <Link
        to="/location"
        className="rounded-full px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-lime-50 hover:text-lime-700 sm:text-base"
        onClick={closeMenu}
      >
        Location
      </Link>
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
      <Link
        to="signin"
        className="rounded-full px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-lime-50 hover:text-lime-700 sm:text-base"
        onClick={closeMenu}
      >
        {user ? "Profile" : "Sign In"}
      </Link>
      {user?.email && (
        <span className="px-3 py-2 text-sm font-medium text-gray-700 sm:text-base">
          {user.email.split("@")[0]}
        </span>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-[1000] w-full border-b border-lime-50 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <a href="/" className="block">
          <img src={navLogo} alt="Logo" className="h-9 sm:h-10" />
        </a>

        <div className="hidden items-center gap-2 md:flex md:gap-4">{navLinks}</div>

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
          <div className="flex flex-col gap-2">{navLinks}</div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
