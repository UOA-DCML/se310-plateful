import { useState, useRef, useEffect } from "react";

const RadiusDropdown = ({ currentRadius, onRadiusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const radiusOptions = [5, 10, 15, 20, 25];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleRadiusSelect = (radius) => {
    onRadiusChange(radius);
    setIsOpen(false);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="border-none bg-[#7C9749]/95 text-white p-2 px-4 rounded-[5px] cursor-pointer"
      >
        {currentRadius} km
      </button>

      {isOpen && (
        <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto z-50">
          {radiusOptions.map((radius) => (
            <li
              key={radius}
              onClick={() => handleRadiusSelect(radius)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {radius} km
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RadiusDropdown;
