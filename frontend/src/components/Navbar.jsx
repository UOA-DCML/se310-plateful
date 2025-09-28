import { Link } from "react-router-dom";
import navLogo from "../assets/navlogo.png";
import { useAuth } from "../auth/AuthContext";

const NavBar = () => {
  const { user } = useAuth();
  console.log("Navbar user:", user);
  console.log("hi");
  return (
    <nav className="relative top-0 left-0 w-full h-[70px] flex items-center justify-between px-8 bg-white shadow-md z-[1000]">
      <div className="flex items-center">
        <a href="/" className="block">
          <img src={navLogo} alt="Logo" className="h-10" />
        </a>
      </div>

      <div className="flex gap-6">
        <Link to="/location" className="text-gray-800 font-medium hover:text-gray-600 transition">
          Location
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/about" className="text-gray-800 font-medium hover:text-gray-600 transition">
          About
        </Link>
        <Link to="/search" className="text-gray-800 font-medium hover:text-gray-600 transition">
          Search
        </Link>
        <Link
          to={"signin"}
          className="text-gray-800 font-medium hover:text-gray-600 transition"
        >
          {user ? "Profile" : "Sign In"}
        </Link>
        {user?.email && (
          <span className="ml-4 text-gray-700 font-medium">
            {user.email.split("@")[0]} {/* just show username part */}
          </span>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
