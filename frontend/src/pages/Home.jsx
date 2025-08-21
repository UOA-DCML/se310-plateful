import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/PlatefulBackgroundHome copy.png";
import "../styles/home.css";
import "../styles/global.css";
import navLogo from "../assets/navlogo.png";
import RestaurantList from "../components/RestaurantList";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import tt from "@tomtom-international/web-sdk-maps";

export default function Home() {
  const mapElement = useRef(null);
  const navigate = useNavigate();

  const [mapLongitude, setMapLongitude] = useState(174.763336);
  const [mapLatitude, setMapLatitude] = useState(-36.848461);
  const [mapZoom, setMapZoom] = useState(13);
  const [map, setMap] = useState(null);

  const [restaurantsRaw, setRestaurantsRaw] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const MAX_ZOOM = 18;

  // Fetch real restaurants from MongoDB
  useEffect(() => {
    setLoading(true);
    setErr("");

    // Fetch restaurants
    const fetchRestaurants = fetch("http://localhost:8080/api/restaurants")
      .then((res) => {
        if (!res.ok) throw new Error(`API ${res.status}`);
        return res.json();
      })
      .then((data) => setRestaurantsRaw(Array.isArray(data) ? data : []));

    // Fetch cuisines
    const fetchCuisines = fetch(
      "http://localhost:8080/api/restaurants/cuisines"
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Cuisines API ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Transform cuisine strings into objects with name and default image
        const cuisineObjects = Array.isArray(data)
          ? data.map((cuisine) => ({
              name: cuisine,
              image: navLogo, // Using default image for now
            }))
          : [];
        setCuisines(cuisineObjects);
      });

    Promise.all([fetchRestaurants, fetchCuisines])
      .catch((e) => setErr(e.message || "Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    try {
      // Perform the search and navigate to search page with results
      const response = await fetch(
        `http://localhost:8080/api/restaurants/search?query=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (response.ok) {
        const searchResults = await response.json();
        // Navigate to search page with query parameter
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      } else {
        console.error("Search failed:", response.status);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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

  // Map fetched data into card shape
  const toCard = (r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    priceLevel: r.priceLevel,
    rating: 5, // TODO: hardcoded for testing, should change later
    image:
      (Array.isArray(r.images) && r.images[0]) ||
      "https://picsum.photos/seed/placeholder/600/400",
  });

  // filter popular
  const popularDocs = restaurantsRaw.filter(
    (r) => Array.isArray(r.tags) && r.tags.includes("popular")
  );
  // filter local favourite
  const localFavDocs = restaurantsRaw.slice(0, 5);

  const popularCards = (
    popularDocs.length ? popularDocs : restaurantsRaw.slice(0, 6)
  ).map(toCard);
  const localFavCards = localFavDocs.map(toCard);

  // Handle cuisine click to search for restaurants of that cuisine
  const handleCuisineClick = (cuisineName) => {
    navigate(`/search?query=${encodeURIComponent(cuisineName)}`);
  };

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
          />
          <button onClick={handleSearch}>Go</button>
        </div>
      </section>

      <section className="restaurant-section">
        <h3>Popular Restaurants</h3>
        <RestaurantList restaurants={popularCards} />
      </section>

      <section className="cuisine-section">
        <h3>Explore Cuisines</h3>
        <div className="cuisine-list">
          {cuisines.map((cuisine) => (
            <div
              key={cuisine.name}
              className="cuisine-item"
              onClick={() => handleCuisineClick(cuisine.name)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={cuisine.image}
                alt={cuisine.name}
                className="cuisine-image"
              />
              <div className="cuisine-label">{cuisine.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="restaurant-section">
        <h3>Local Favourites</h3>
        <RestaurantList restaurants={localFavCards} />
      </section>

      <section className="map-section">
        <div ref={mapElement} className="mapDiv">
          <input
            type="text"
            name="longitude"
            value={mapLongitude}
            onChange={(e) => setMapLongitude(e.target.value)}
          />
        </div>
      </section>
    </div>
  );
}
