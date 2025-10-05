export default function DirectionsButton({
  destinationAddress, 
  destinationLatLng, 
  className = "",
}) {
  const openDirections = () => {
    const destination = destinationLatLng
      ? `${destinationLatLng.lat},${destinationLatLng.lng}`
      : encodeURIComponent(destinationAddress || "");

    const openMapsWithOrigin = (origin) => {
      const originParam = origin ? `&origin=${origin}` : "";
      const url = `https://www.google.com/maps/dir/?api=1${originParam}&destination=${destination}&travelmode=driving`;
      window.open(url, "_blank");
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          openMapsWithOrigin(`${userLat},${userLng}`);
        },
        (err) => {
          console.warn("Geolocation error:", err);
          openMapsWithOrigin("");
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
      );
    } else {
      openMapsWithOrigin("");
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); 
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
