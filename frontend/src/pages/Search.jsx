import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import backgroundImage from "../assets/PlatefulBackgroundHome copy.png";
import RestaurantList from "../components/RestaurantList";
import "../styles/search.css";
import "../styles/global.css";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import tt from "@tomtom-international/web-sdk-maps";

export default function Search() {
  const mapElement = useRef(null);
  const [searchParams] = useSearchParams();

  const [mapLongitude, setMapLongitude] = useState(174.763336);
  const [mapLatitude, setMapLatitude] = useState(-36.848461);
  const [mapZoom, setMapZoom] = useState(13);
  const [map, setMap] = useState(null);

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const MAX_ZOOM = 18;

  // Function to fetch restaurants based on search query
  const fetchRestaurants = async (query = "") => {
    try {
      setLoading(true);
      setError("");

      const url = query.trim()
        ? `http://localhost:8080/api/restaurants/search?query=${encodeURIComponent(
            query
          )}`
        : `http://localhost:8080/api/restaurants`;

      console.log("Fetching from URL:", url); // Debug log

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data:", data); // Debug log

      // Ensure data is an array
      const restaurantArray = Array.isArray(data) ? data : [];
      setRestaurants(restaurantArray);

      if (restaurantArray.length === 0 && query) {
        console.log("No restaurants found for query:", query);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch restaurants: " + err.message);
      setRestaurants([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Handle search from the search bar on this page
  const handleSearch = () => {
    fetchRestaurants(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Load initial data when component mounts or search params change
  useEffect(() => {
    const queryFromUrl = searchParams.get("query");
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
      fetchRestaurants(queryFromUrl);
    } else {
      fetchRestaurants(); // Load all restaurants if no query
    }
  }, [searchParams]);

  const increaseZoom = () => {
    if (mapZoom < MAX_ZOOM) {
      setMapZoom(mapZoom + 1);
    }
  };

  const decreaseZoom = () => {
    if (mapZoom > 1) {
      setMapZoom(mapZoom - 1);
    }
  };

  const updateMap = () => {
    map.setCenter([parseFloat(mapLongitude), parseFloat(mapLatitude)]);
    map.setZoom(mapZoom);
  };

  useEffect(() => {
    let map = tt.map({
      key: "agzx9wsQdqX7CENP7gN1KQWwEe7V9c37",
      container: mapElement.current,
      center: [mapLongitude, mapLatitude],
      zoom: mapZoom,
    });
    setMap(map);
    return () => map.remove();
  }, []);

  useEffect(() => {
    if (!map || !restaurants.length) return;

    // Clear existing markers
    const markers = document.querySelectorAll(".custom-marker");
    markers.forEach((marker) => marker.remove());

    restaurants.forEach((r) => {
      try {
        // Use location from MongoDB data
        const longitude = r.location?.coordinates?.[0] || r.longitude;
        const latitude = r.location?.coordinates?.[1] || r.latitude;

        if (!longitude || !latitude) return;

        const element = document.createElement("div");
        element.className = "custom-marker";

        // Use restaurant image if available, otherwise use a default
        const imageUrl =
          r.images?.[0] ||
          "https://media.istockphoto.com/id/1829241109/photo/enjoying-a-brunch-together.jpg?s=612x612&w=0&k=20&c=9awLLRMBLeiYsrXrkgzkoscVU_3RoVwl_HA-OT-srjQ=";
        element.innerHTML = `<img src="${imageUrl}" style="width:30px;height:30px;border-radius:50%;" />`;

        // Safely handle price level
        const priceLevel = Math.max(
          1,
          Math.min(4, parseInt(r.priceLevel) || 1)
        );
        const priceDisplay = "$".repeat(priceLevel);

        // Create a popup with restaurant details on click of map marker
        const popup = new tt.Popup({ offset: 30 }).setHTML(
          `<h3>${r.name || "Restaurant"}</h3>
           <p>${r.description || "No description available"}</p>
           <p><strong>Cuisine:</strong> ${r.cuisine || "Not specified"}</p>
           <p><strong>Price Level:</strong> ${priceDisplay}</p>`
        );

        // Create a marker with the custom element and add it to the map
        new tt.Marker({ element })
          .setLngLat([longitude, latitude])
          .setPopup(popup)
          .addTo(map);
      } catch (error) {
        console.error("Error creating marker for restaurant:", r.name, error);
      }
    });
  }, [map, restaurants]);

  return (
    <div>
      <section className="search-wrapper">
        <img
          src={backgroundImage}
          alt="Background"
          className="background-image"
        />
        <h1 className="search-title">Looking for something to eat?</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Go"}
          </button>
        </div>
        {error && (
          <div
            className="error-message"
            style={{ color: "red", textAlign: "center", marginTop: "10px" }}
          >
            Error: {error}
          </div>
        )}
      </section>

      <section className="results-container">
        <div className="restaurant-list">
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              Loading restaurants...
            </div>
          ) : restaurants.length > 0 ? (
            <RestaurantList restaurants={restaurants} direction={"vertical"} />
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              {searchQuery
                ? "No restaurants found for your search."
                : "No restaurants available."}
            </div>
          )}
        </div>
        <div className="map-container">
          <div ref={mapElement} className="mapDiv">
            <input
              type="text"
              name="longitude"
              value={mapLongitude}
              onChange={(e) => setMapLongitude(e.target.value)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
