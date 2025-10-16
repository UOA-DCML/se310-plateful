// components/MapContainer.jsx
import { useEffect, useRef, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";

export default function MapContainer({ children }) {
  const mapElement = useRef(null);
  const [map, setMap] = useState(null);
  const [mapLongitude, setMapLongitude] = useState(174.763336);
  const [mapLatitude, setMapLatitude] = useState(-36.848461);
  const [mapZoom, setMapZoom] = useState(13);

  const MAX_ZOOM = 18;

  useEffect(() => {
    const mapInstance = tt.map({
      key: "agzx9wsQdqX7CENP7gN1KQWwEe7V9c37",
      container: mapElement.current,
      center: [mapLongitude, mapLatitude],
      zoom: mapZoom,
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, [mapLongitude, mapLatitude, mapZoom]);

  const increaseZoom = () => {
    if (mapZoom < MAX_ZOOM) {
      setMapZoom((z) => z + 1);
    }
  };

  const decreaseZoom = () => {
    if (mapZoom > 1) {
      setMapZoom((z) => z - 1);
    }
  };

  const updateMap = () => {
    map.setCenter([parseFloat(mapLongitude), parseFloat(mapLatitude)]);
    map.setZoom(mapZoom);
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapElement} className="w-full h-full" />

      {/* Zoom Controls */}
      <div className="absolute top-5 right-5 flex flex-col space-y-2">
        <button
          onClick={increaseZoom}
          className="bg-white shadow p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"
        >
          +
        </button>
        <button
          onClick={decreaseZoom}
          className="bg-white shadow p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"
        >
          -
        </button>
      </div>

      {map && children(map)}
    </div>
  );
}
