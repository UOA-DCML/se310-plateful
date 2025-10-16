import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaCar, FaWalking, FaBicycle, FaBus, FaMapMarkerAlt } from "react-icons/fa";

export default function DirectionsButton({
  destinationAddress,
  destinationLatLng,
  className = "",
}) {
  const [travelMode, setTravelMode] = useState("driving");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const dropdownButtonRef = useRef(null);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside (while allowing clicks inside the menu)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      const clickedDropdownButton =
        dropdownButtonRef.current &&
        dropdownButtonRef.current.contains(target);
      const clickedMenu = menuRef.current && menuRef.current.contains(target);

      if (!clickedDropdownButton && !clickedMenu) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute dropdown absolute position (for portal)
  useEffect(() => {
    if (menuOpen && dropdownButtonRef.current) {
      const rect = dropdownButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  }, [menuOpen]);

  const openMapsWithOrigin = (origin) => {
    const destination = destinationLatLng
      ? `${destinationLatLng.lat},${destinationLatLng.lng}`
      : encodeURIComponent(destinationAddress || "");
    const url = `https://www.google.com/maps/dir/?api=1${origin ? `&origin=${origin}` : ""
      }&destination=${destination}&travelmode=${travelMode}`;
    window.open(url, "_blank");
  };

  const handleClick = () => {
    if (!navigator.geolocation) {
      // Browser doesn't support geolocation
      alert(
        "Geolocation is not supported by your browser. Opening maps without origin."
      );
      openMapsWithOrigin("");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        openMapsWithOrigin(`${latitude},${longitude}`);
      },
      (error) => {
        // Show a helpful alert depending on the error, then fallback to opening maps without origin
        if (error && error.code === 1) {
          // PERMISSION_DENIED
          alert(
            "Please enable location services to use your current location. Opening maps without origin."
          );
        } else if (error && error.code === 2) {
          // POSITION_UNAVAILABLE
          alert(
            "Unable to determine your location. Opening maps without origin."
          );
        } else if (error && error.code === 3) {
          // TIMEOUT
          alert(
            "Location request timed out. Opening maps without origin."
          );
        } else {
          // Generic fallback
          alert(
            "Could not get your location. Opening maps without origin."
          );
        }
        openMapsWithOrigin("");
      },
      {
        // optional sensible defaults
        maximumAge: 60 * 1000, // accept cached positions up to 60s
        timeout: 10 * 1000, // 10s timeout
        enableHighAccuracy: false,
      }
    );
  };

  const handleModeChange = (mode) => {
    setTravelMode(mode);
    setMenuOpen(false);
  };

  const travelModes = [
    { id: "driving", label: "Driving", icon: FaCar, color: "text-blue-600" },
    { id: "walking", label: "Walking", icon: FaWalking, color: "text-green-600" },
    { id: "bicycling", label: "Cycling", icon: FaBicycle, color: "text-orange-600" },
    { id: "transit", label: "Transit", icon: FaBus, color: "text-purple-600" },
  ];

  const currentMode = travelModes.find((mode) => mode.id === travelMode);
  const CurrentIcon = currentMode?.icon || FaCar;

  return (
    <>
      <div
        className="relative inline-flex gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mode selector button */}
        <button
          ref={dropdownButtonRef}
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`group relative inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ${className}`}
          aria-label="Select travel mode"
        >
          {/* Icon for current travel mode */}
          <CurrentIcon className="w-4 h-4" />

          {/* Mode name */}
          <span className="font-medium">{currentMode?.label}</span>

          {/* Dropdown arrow */}
          <svg
            className={`w-3 h-3 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Get Directions button */}
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          aria-label="Get directions"
        >
          <FaMapMarkerAlt className="w-3.5 h-3.5" />
          Directions
        </button>
      </div>

      {/* Portal dropdown menu */}
      {menuOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="absolute bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999] overflow-hidden"
            style={{
              position: "absolute",
              top: menuPosition.top,
              left: menuPosition.left,
              minWidth: "200px",
            }}
          >
            {/* Dropdown header */}
            <div className="px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Travel Mode
              </p>
            </div>

            {/* Travel mode options */}
            <div className="py-1">
              {travelModes.map((mode) => {
                const ModeIcon = mode.icon;
                const isSelected = mode.id === travelMode;

                return (
                  <button
                    key={mode.id}
                    onClick={() => handleModeChange(mode.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-150 cursor-pointer ${isSelected
                      ? "bg-emerald-50 border-l-4 border-emerald-500"
                      : "hover:bg-gray-50 border-l-4 border-transparent"
                      }`}
                    type="button"
                  >
                    {/* Mode icon */}
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${isSelected
                      ? "bg-emerald-100"
                      : "bg-gray-100 group-hover:bg-gray-200"
                      }`}>
                      <ModeIcon className={`w-4 h-4 ${isSelected ? "text-emerald-600" : mode.color}`} />
                    </div>

                    {/* Mode label */}
                    <span className={`flex-1 text-left font-medium ${isSelected ? "text-emerald-700" : "text-gray-700"
                      }`}>
                      {mode.label}
                    </span>

                    {/* Check mark for selected mode */}
                    {isSelected && (
                      <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
