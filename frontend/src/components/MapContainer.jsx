// components/MapContainer.jsx
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "../context/ThemeContext";

export default function MapContainer({ children }) {
  const mapElement = useRef(null);
  const [map, setMap] = useState(null);
  const { isDark } = useTheme();

  const MAX_ZOOM = 18;

  // Initialize map once on mount
  useEffect(() => {
    console.log('🗺️ Initializing MapLibre map...');

    // Using OpenStreetMap-based styles - Voyager for colorful light mode, Dark Matter for dark mode
    const mapStyle = isDark
      ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

    const mapInstance = new maplibregl.Map({
      container: mapElement.current,
      style: mapStyle,
      center: [174.763336, -36.848461],
      zoom: 13,
    });

    mapInstance.on('load', () => {
      console.log('✅ Map loaded successfully with style:', mapStyle);
      setMap(mapInstance);
    });

    mapInstance.on('error', (e) => {
      console.error('❌ Map error:', e);
      console.error('Attempted style URL:', mapStyle);
    }); return () => {
      console.log('🗑️ Removing map instance');
      mapInstance.remove();
    };
  }, [isDark]); // Recreate when theme changes

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapElement} className="w-full h-full" />

      {/* Zoom Controls */}
      <div className="absolute top-5 right-5 flex flex-col space-y-2 z-10">
        <button
          onClick={() => map && map.zoomIn()}
          className="shadow p-2 rounded transition-colors cursor-pointer font-bold text-lg w-10 h-10"
          style={{
            backgroundColor: isDark ? '#1e293b' : 'white',
            color: isDark ? '#f1f5f9' : '#111827'
          }}
        >
          +
        </button>
        <button
          onClick={() => map && map.zoomOut()}
          className="shadow p-2 rounded transition-colors cursor-pointer font-bold text-lg w-10 h-10"
          style={{
            backgroundColor: isDark ? '#1e293b' : 'white',
            color: isDark ? '#f1f5f9' : '#111827'
          }}
        >
          -
        </button>
      </div>

      {map && children(map)}
    </div>
  );
}
