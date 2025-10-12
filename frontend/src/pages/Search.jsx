import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/PlatefulBackgroundHome copy.png";
import RestaurantList from "../components/RestaurantList";
import MapContainer from "../components/MapContainer";
import Dropdown from "../components/Dropdown";
import PriceSlider from "../components/Slider";
import RestaurantMarkers from "../components/RestaurantMarkers";
import { buildApiUrl } from "../lib/config";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [cuisines, setCuisines] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [priceRange, setPriceRange] = useState([1, 5]);
  const [priceMin, setPriceMin] = useState(null);
  const [priceMax, setPriceMax] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [openNow, setOpenNow] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showSlider, setShowSlider] = useState(false);

  // Fetch cuisines
  useEffect(() => {
  fetch(buildApiUrl("/api/restaurants/cuisines"))
      .then((res) => res.json())
      .then((data) => {
        const cuisineObjects = Array.isArray(data)
          ? data.map((cuisine) => ({ name: cuisine }))
          : [];
        setCuisines(cuisineObjects);
      })
      .catch((err) => console.error("Failed to fetch cuisines:", err));
  }, []);

  // Function to fetch restaurants based on search query and filters
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError("");

      // Extract filters from URL
      const query = searchParams.get("query");
      const cuisine = searchParams.get("cuisine");
      const priceMin = searchParams.get("priceMin");
      const priceMax = searchParams.get("priceMax");
      const reservation = searchParams.get("reservation");
      const openNow = searchParams.get("openNow");
      const city = searchParams.get("city");

      const params = new URLSearchParams();
      if (query) {
        setSearchQuery(query);
        params.append("query", query);
      }
      if (cuisine) params.append("cuisine", cuisine);
      if (priceMin) params.append("priceMin", priceMin);
      if (priceMax) params.append("priceMax", priceMax);
      if (reservation !== null) params.append("reservation", reservation);
      if (openNow !== null) params.append("openNow", openNow);
      if (city) params.append("city", city);

      const response = await fetch(
        buildApiUrl(`/api/restaurants/filter?${params.toString()}`)
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch restaurants: " + err.message);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search from the search bar on this page
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) params.set("query", searchQuery);
    if (selectedCuisine) params.set("cuisine", selectedCuisine);
    if (priceMin !== null) params.set("priceMin", priceMin);
    if (priceMax !== null) params.set("priceMax", priceMax);
    if (reservation !== null) params.set("reservation", reservation);
    if (openNow !== null) params.set("openNow", openNow);
    if (selectedCity) params.set("city", selectedCity);

    navigate(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Fetch restaurants when search params change
  useEffect(() => {
    fetchRestaurants();
  }, [searchParams]);

  return (
    <div>
      <section className="relative w-full h-[40vh]">
        <img
          src={backgroundImage}
          alt="Background"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
        <h1 className="absolute inset-x-0 top-1/3 transform -translate-y-1/2 text-4xl text-center z-10">
          Looking for something to eat?
        </h1>
        <div
          className="absolute top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2
         flex flex-col items-center gap-4 z-10 w-[60%]"
        >
          {/* Search Bar */}
          <div className="flex w-full bg-white/80 px-4 py-2 rounded-[10px]">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-none p-2 outline-none w-full"
            />
            <button
              className="bg-[#333] text-white p-2 px-4 rounded-[5px] ml-2"
              onClick={handleSearch}
            >
              Go
            </button>
          </div>

          {/* Filters*/}
          <div className="flex flex-wrap justify-center gap-2">
            <Dropdown
              label="Cuisine"
              options={cuisines.map((c) => c.name)}
              value={selectedCuisine}
              onChange={setSelectedCuisine}
              width="w-[150px]"
            />
            <div className="relative">
              <button
                className="bg-white text-sm px-2 py-1 rounded-md outline-none w-[120px]"
                onClick={() => setShowSlider(!showSlider)}
              >
                Price: {"$".repeat(priceRange[0])}–{"$".repeat(priceRange[1])}
              </button>

              {showSlider && (
                <div className="absolute top-full mt-2 z-50">
                  <PriceSlider
                    value={priceRange}
                    onChange={setPriceRange}
                    onApply={() => {
                      setPriceMin(priceRange[0]);
                      setPriceMax(priceRange[1]);
                      setShowSlider(false);
                    }}
                  />
                </div>
              )}
            </div>

            <Dropdown
              label="Reservation"
              options={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
              value={reservation !== null ? reservation.toString() : ""}
              onChange={(val) =>
                setReservation(val === "" ? null : val === "true")
              }
              width="w-[110px]"
            />

            <Dropdown
              label="Open Now"
              options={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
              value={openNow !== null ? openNow.toString() : ""}
              onChange={(val) => setOpenNow(val === "" ? null : val === "true")}
              width="w-[105px]"
            />

            <Dropdown
              label="City"
              options={["Auckland", "Wellington", "Christchurch"]}
              value={selectedCity}
              onChange={setSelectedCity}
              width="w-[120px]"
            />
          </div>
        </div>
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
