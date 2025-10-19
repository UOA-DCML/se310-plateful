import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import footerLogo from "../assets/footer-logo.png"; // New footer logo
import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer
      className="py-8 px-6"
      style={{
        backgroundColor: isDark ? '#0f172a' : '#fff',
        color: '#7C9749',
        boxShadow: isDark ? '0 -2px 5px rgba(0,0,0,0.3)' : '0 -2px 5px rgba(0,0,0,0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
        {/* Logo + Branding */}
        <div className="flex flex-col items-center md:items-center md:w-full">
          <img src={footerLogo} alt="Plateful Logo" style={{ height: '160px' }} className="mb-3" />
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-center md:w-full">
          <h4 className="font-semibold mb-2 py-2 px-4" style={{ color: '#7C9749' }}>Quick Links</h4>
          <ul className="flex flex-row justify-center gap-8">
            <li><Link to="/" style={{ color: '#7C9749' }}>Home</Link></li>
            <li><Link to="/about" style={{ color: '#7C9749' }}>About</Link></li>
            <li><Link to="/search" style={{ color: '#7C9749' }}>Search</Link></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="flex flex-col items-center md:items-center md:w-full">
          <h4 className="font-semibold mb-2" style={{ color: '#7C9749' }}>Contact Us</h4>
          <p>Email: <a href="mailto:info@plateful.com" style={{ color: '#7C9749' }}>info@plateful.com</a></p>
          <p>Phone: <a href="tel:+64123456789" style={{ color: '#7C9749' }}>+64 123 456 789</a></p>
          {/* <p style={{ color: '#7C9749' }}>Address: 123 Queen St, Auckland, NZ</p> */}
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-center md:items-center md:w-full">
          <h4 className="font-semibold mb-2" style={{ color: '#7C9749' }}>Follow Us</h4>
          <div className="flex space-x-6  ">
            <a href="#" aria-label="Facebook" style={{ color: '#7C9749' }}><FaFacebook size={40} /></a>
            <a href="#" aria-label="Instagram" style={{ color: '#7C9749' }}><FaInstagram size={40} /></a>
            <a href="#" aria-label="Twitter" style={{ color: '#7C9749' }}><FaTwitter size={40} /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-6 pt-4" style={{ color: '#7C9749' }}>
        © {new Date().getFullYear()} Plateful. All rights reserved.
      </div>
    </footer>
  );
}
