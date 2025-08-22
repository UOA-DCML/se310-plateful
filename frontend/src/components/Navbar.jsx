import { Link } from "react-router-dom";
import React, { useState } from "react";
import navLogo from "../assets/navlogo.png";

const NavBar = () => {
  const [showInput, setShowInput] = useState(false);
  const [address, setAddress] = useState("Location");
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle form submission to update address
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (trimmedValue !== "") {
      setAddress(trimmedValue);
    } else {
      setAddress("Location");
    }
    setShowInput(false);
  };

  const handleButtonClick = () => {
    setInputValue(address === "Location" ? "" : address);
    setShowInput(true);
  };

  return (
    <nav className="relative top-0 left-0 w-full h-[70px] flex items-center justify-between px-8 bg-white shadow-md z-[1000]">
      <div className="flex items-center">
        <a href="/" className="block">
          <img src={navLogo} alt="Logo" className="h-10" />
        </a>
      </div>

      {/* Center Section: Location Input */}
      <div className="flex-1 flex justify-center">
        {showInput ? (
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter your address"
              className="border px-2 py-1 rounded w-64 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="ml-2 px-3 py-1 bg-[#7C9749] text-white rounded hover:bg-[#678033] transition"
            >
              Save
            </button>
          </form>
        ) : (
          <button
            onClick={handleButtonClick}
            className="text-[#7C9749] font-medium hover:text-gray-600 transition"
          >
            {address}
          </button>
        )}
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
