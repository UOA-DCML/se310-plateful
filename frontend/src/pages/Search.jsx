import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import backgroundImage from "../assets/PlatefulBackgroundHome copy.png";
import RestaurantList from "../components/RestaurantList";
import MapContainer from "../components/MapContainer";
import RestaurantMarkers from "../components/RestaurantMarkers";
import "../styles/search.css";
import "../styles/global.css";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

export default function Search() {
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div>
      <section className="relative w-full overflow-hidden h-[40vh]">
        <img
          src={backgroundImage}
          alt="Background"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
        <h1 className="absolute inset-x-0 top-1/3 transform -translate-y-1/2 text-4xl text-center z-10">
          Looking for something to eat?
        </h1>
        <div
          className="absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2
                flex gap-2 bg-white/80 px-4 py-2 mt-4 rounded-[10px] w-[55%]"
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="border-none p-2 outline-none w-full"
          />
          <button
            className="border-none bg-[#333] text-white p-2 px-4 rounded-[5px] cursor-pointer relative ml-2"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Go"}
          </button>
        </div>
        {error && (
          <div className=" className=text-red-600 text-center mt-2.5">
            Error: {error}
          </div>
        )}
      </section>

      <section className="flex justify-center gap-5 mx-auto mt-8">
        {/* Restaurant List */}
        <div className="flex-1 max-w-[55%] overflow-y-auto flex flex-col pl-60">
          {loading ? (
            <div className="text-center p-5">Loading restaurants...</div>
          ) : restaurants.length > 0 ? (
            <RestaurantList restaurants={restaurants} direction={"vertical"} />
          ) : (
            <div className="text-center p-5">
              {searchQuery
                ? "No restaurants found for your search."
                : "No restaurants available."}
            </div>
          )}
        </div>
        {/* Map */}
        <div className="flex-1 h-[80vh] sticky top-8 mt-8 mb-8 mx-8 pr-60">
          <MapContainer>
            {(map) => <RestaurantMarkers map={map} restaurants={restaurants} />}
          </MapContainer>
        </div>
      </section>
    </div>
  );
}
