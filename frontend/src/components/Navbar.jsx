import { Link } from "react-router-dom";
import navLogo from "../assets/navlogo.png";

const NavBar = () => {
  return (
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

      <div className="flex gap-6">
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
      </div>
    </nav>
  );
};

export default NavBar;
