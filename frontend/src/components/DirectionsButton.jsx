export default function DirectionsButton({
  destinationAddress, // string e.g. "66-68 Tyler St, Britomart, Auckland 1010, New Zealand"
  destinationLatLng, 
  className = "",
}) {
  const openDirections = () => {
    // Build destination param: prefer lat,lng if provided, otherwise use encoded address
    const destination = destinationLatLng
      ? `${destinationLatLng.lat},${destinationLatLng.lng}`
      : encodeURIComponent(destinationAddress || "");

    // Helper to open Google Maps with origin and destination
    const openMapsWithOrigin = (origin) => {
      // origin may be '' -> still opens maps showing destination
      const originParam = origin ? `&origin=${origin}` : "";
      const url = `https://www.google.com/maps/dir/?api=1${originParam}&destination=${destination}&travelmode=driving`;
      window.open(url, "_blank");
    };

    // Try to get user's location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          openMapsWithOrigin(`${userLat},${userLng}`);
        },
        (err) => {
          // Permission denied or error -> fallback to maps with no origin
          console.warn("Geolocation error:", err);
          openMapsWithOrigin("");
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
      );
    } else {
      // Geolocation not supported -> open maps with only destination
      openMapsWithOrigin("");
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // helpful when used inside clickable cards
        openDirections();
      }}
      className={`inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-400 hover:shadow ${className}`}
      aria-label="Get directions"
      type="button"
    >
      Get directions
    </button>
  );
}
