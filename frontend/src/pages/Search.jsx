import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/PlatefulBackgroundHome copy.png";
import RestaurantList from "../components/RestaurantList";
import MapContainer from "../components/MapContainer";
import Dropdown from "../components/Dropdown";
import RestaurantMarkers from "../components/RestaurantMarkers";
import { buildApiUrl } from "../lib/config";
import { useTheme } from "../context/ThemeContext"; // adjust path
import "@tomtom-international/web-sdk-maps/dist/maps.css";

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

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

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError("");

      const query = searchParams.get("query");
      const cuisine = searchParams.get("cuisine");
      const priceMinParam = searchParams.get("priceMin");
      const priceMaxParam = searchParams.get("priceMax");
      const reservationParam = searchParams.get("reservation");
      const openNowParam = searchParams.get("openNow");
      const city = searchParams.get("city");

      const params = new URLSearchParams();
      if (query) {
        setSearchQuery(query);
        params.append("query", query);
      }
      if (cuisine) params.append("cuisine", cuisine);
      if (priceMinParam) params.append("priceMin", priceMinParam);
      if (priceMaxParam) params.append("priceMax", priceMaxParam);
      if (reservationParam !== null) params.append("reservation", reservationParam);
      if (openNowParam !== null) params.append("openNow", openNowParam);
      if (city) params.append("city", city);

      const response = await fetch(
        buildApiUrl(`/api/restaurants/filter?${params.toString()}`)
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

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
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    fetchRestaurants();
  }, [searchParams]);

  return (
    <div className={isDark ? "bg-slate-900 text-slate-100" : "bg-gray-50 text-gray-900"}>
      <section className="relative w-full" style={{ minHeight: '520px', paddingBottom: '2rem' }}>
        <img
          src={backgroundImage}
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <h1
          className="absolute inset-x-0 px-4 text-center text-2xl font-semibold md:text-4xl"
          style={{ color: isDark ? '#0f172a' : '#000000', top: '20px', paddingTop: '20px' }}
        >
          Looking for something to eat?
        </h1>
        <div className="absolute left-1/2 flex w-[90%] max-w-5xl -translate-x-1/2 flex-col items-center gap-4" style={{ top: '35%' }}>
          {/* Search Bar */}
          <div className={`flex w-full flex-col gap-3 rounded-[12px] p-4 shadow-md backdrop-blur-sm md:flex-row md:items-center md:gap-2 ${isDark ? "bg-slate-700 text-gray-100 placeholder-gray-400" : "bg-white/85"
            }`}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full p-3 text-base outline-none md:text-lg ${isDark ? "bg-slate-700 text-gray-100 placeholder-gray-400" : "bg-white text-black placeholder-gray-500"
                }`}
            />
            <button
              className={`w-full rounded-[6px] px-4 py-3 text-base font-semibold text-white transition md:w-auto cursor-pointer ${isDark
                ? "bg-slate-600 hover:bg-slate-500"
                : "bg-[#333] hover:bg-[#222]"
                }`}
              onClick={handleSearch}
            >
              Go
            </button>
          </div>

          {/* Filters */}
          <div className="grid w-full gap-3 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap lg:justify-center">
            <Dropdown
              label="Cuisine"
              options={cuisines.map((c) => c.name)}
              value={selectedCuisine}
              onChange={setSelectedCuisine}
              width="w-full sm:w-[150px]"
              darkMode={isDark}
            />
            <Dropdown
              label="Price Range"
              options={[
                { value: "1-5", label: "Any Price" },
                { value: "1-1", label: "$ - Budget" },
                { value: "2-2", label: "$$ - Moderate" },
                { value: "3-3", label: "$$$ - Pricey" },
                { value: "4-4", label: "$$$$ - Upscale" },
                { value: "5-5", label: "$$$$$ - Luxury" },
                { value: "1-2", label: "$ to $$" },
                { value: "1-3", label: "$ to $$$" },
                { value: "2-3", label: "$$ to $$$" },
                { value: "3-5", label: "$$$ to $$$$$" },
              ]}
              value={`${priceRange[0]}-${priceRange[1]}`}
              onChange={(val) => {
                if (val) {
                  const [min, max] = val.split("-").map(Number);
                  setPriceRange([min, max]);
                  setPriceMin(min);
                  setPriceMax(max);
                }
              }}
              width="w-full sm:w-[180px]"
              darkMode={isDark}
            />
            <Dropdown
              label="Reservation"
              options={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
              value={reservation !== null ? reservation.toString() : ""}
              onChange={(val) => setReservation(val === "" ? null : val === "true")}
              width="w-full sm:w-[150px]"
              darkMode={isDark}
            />
            <Dropdown
              label="Open Now"
              options={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
              value={openNow !== null ? openNow.toString() : ""}
              onChange={(val) => setOpenNow(val === "" ? null : val === "true")}
              width="w-full sm:w-[150px]"
              darkMode={isDark}
            />
            <Dropdown
              label="City"
              options={["Auckland", "Wellington", "Christchurch"]}
              value={selectedCity}
              onChange={setSelectedCity}
              width="w-full sm:w-[150px]"
              darkMode={isDark}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-8 lg:px-20">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Restaurant List */}
          <div className={`flex-1 space-y-4 ${isDark ? "text-white" : "text-black"}`}>
            {loading ? (
              <div className={`rounded-lg p-5 text-center shadow-sm ${isDark ? "bg-gray-800/60" : "bg-white/60"}`}>
                Loading restaurants...
              </div>
            ) : restaurants.length > 0 ? (
              <RestaurantList restaurants={restaurants} direction={"vertical"} darkMode={isDark} />
            ) : (
              <div className={`rounded-lg p-5 text-center shadow-sm ${isDark ? "bg-gray-800/60" : "bg-white/60"}`}>
                {searchQuery
                  ? "No restaurants found for your search."
                  : "No restaurants available."}
              </div>
            )}
          </div>

          {/* Map */}
          <div className={`flex-1 overflow-hidden rounded-lg p-4 shadow-sm ${isDark ? "bg-gray-800/60" : "bg-white/60"}`}>
            <div className="h-[260px] sm:h-[320px] lg:h-[520px] lg:sticky lg:top-28">
              <MapContainer>
                {(map) => <RestaurantMarkers map={map} restaurants={restaurants} />}
              </MapContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
