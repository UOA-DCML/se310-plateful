import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

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
    const url = `https://www.google.com/maps/dir/?api=1${
      origin ? `&origin=${origin}` : ""
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

  const travelModes = ["driving", "walking", "bicycling", "transit"];

  return (
    <>
      <div
        className="relative inline-flex items-center space-x-1"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main directions button */}
        <button
          type="button"
          onClick={handleClick}
          className={`bg-green-100 text-green-800 px-3 py-[6px] rounded-full text-[10px] font-medium border border-green-400 hover:shadow inline-flex items-center whitespace-nowrap ${className}`}
        >
          Get directions
        </button>

        {/* Mode dropdown button */}
        <button
          ref={dropdownButtonRef}
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="bg-blue-600 text-white px-3 py-[6px] rounded-full text-[10px] font-medium hover:bg-blue-700 inline-flex items-center whitespace-nowrap"
          aria-label="Select travel mode"
        >
          <span>
            {travelMode.charAt(0).toUpperCase() + travelMode.slice(1)}
          </span>
          <span className="ml-1">▼</span>
        </button>
      </div>

      {/* Portal dropdown menu */}
      {menuOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="absolute bg-white border border-gray-300 rounded-lg shadow-lg z-[9999] w-28"
            style={{
              position: "absolute",
              top: menuPosition.top,
              left: menuPosition.left,
            }}
          >
            {travelModes.map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`block w-full text-left px-3 py-1 text-[10px] ${
                  mode === travelMode ? "bg-green-100" : "hover:bg-gray-100"
                }`}
                type="button"
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
