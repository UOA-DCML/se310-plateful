import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/PlatefulBackgroundHome copy.png";
import MapContainer from "../components/MapContainer";
import Dropdown from "../components/Dropdown";
import RestaurantList from "../components/RestaurantList";
import RestaurantMarkers from "../components/RestaurantMarkers";
import { buildApiUrl } from "../lib/config";
import { useTheme } from "../context/ThemeContext"; // adjust path
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import useRecommendations from "../services/useRecommendations";

export default function Home() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [restaurantsRaw, setRestaurantsRaw] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([1, 5]);
  const [priceMin, setPriceMin] = useState(null);
  const [priceMax, setPriceMax] = useState(null);
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [openNow, setOpenNow] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [popularRestaurants, setPopularRestaurants] = useState([]);


  // ✅ useRecommendations at top level (not inside effects)
  const {
    recommended,
    loading: recLoading,
    error: recErr,
    diagnostics,
  } = useRecommendations({
    restaurants: restaurantsRaw,
    enabled: true,
  });

  // ✅ useRecommendations at top level (not inside effects)
  const {
    recommended,
    loading: recLoading,
    error: recErr,
    diagnostics,
  } = useRecommendations({
    restaurants: restaurantsRaw,
    enabled: true,
  });

  useEffect(() => {
    setLoading(true);
    setErr("");

    const fetchRestaurants = fetch(buildApiUrl("/api/restaurants"))
      .then((res) => {
        if (!res.ok) throw new Error(`API ${res.status}`);
        return res.json();
      })
      .then((data) => setRestaurantsRaw(Array.isArray(data) ? data : []));
      const fetchPopular = fetch(buildApiUrl("/api/restaurants/popular"))
  .then((res) => {
    if (!res.ok) throw new Error(`Popular API ${res.status}`);
    return res.json();
  })
  .then((data) => setPopularRestaurants(Array.isArray(data) ? data : []));


    const fetchCuisines = fetch(buildApiUrl("/api/restaurants/cuisines"))
      .then((res) => {
        if (!res.ok) throw new Error(`Cuisines API ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const cuisineObjects = Array.isArray(data)
          ? data.map((c) => ({ name: c }))
          : [];
        setCuisines(cuisineObjects);
      });

    Promise.all([fetchRestaurants, fetchCuisines,fetchPopular])
      .catch((e) => setErr(e.message || "Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  // 🔧 define toCard once
  const toCard = (r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    priceLevel: r.priceLevel,
    upvoteCount: r.upvoteCount || 0,
    downvoteCount: r.downvoteCount || 0,
    image:
      (Array.isArray(r.images) && r.images[0]) ||
      "https://picsum.photos/seed/placeholder/600/400",
    tags: r.tags,
  });

  // ✅ safe mapping in render scope
  const recommendedCards = (recommended ?? []).map(toCard);

  const handleSearch = async () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append("query", searchQuery.trim());
    if (priceMin !== null) params.append("priceMin", priceMin);
    if (priceMax !== null) params.append("priceMax", priceMax);
    if (reservation !== null) params.append("reservation", reservation);
    if (openNow !== null) params.append("openNow", openNow);
    if (selectedCity) params.append("city", selectedCity);
    if (selectedCuisine) params.append("cuisine", selectedCuisine);

    try {
      const response = await fetch(
        buildApiUrl(`/api/restaurants/filter?${params.toString()}`)
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      navigate(`/search?${params.toString()}`, { state: { results: data } });
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleKeyPress = (e) => e.key === "Enter" && handleSearch();


const popularCards = (popularRestaurants.length
  ? popularRestaurants
  : restaurantsRaw.slice(0, 6)
).map(toCard);



  const localFavDocs = restaurantsRaw.slice(0, 5);
  const localFavCards = localFavDocs.map(toCard);
console.log("Popular Restaurants:", popularRestaurants);
  const handleCuisineClick = (cuisineName) => {
    navigate(`/search?query=${encodeURIComponent(cuisineName)}`);
  };

  // Dark mode classes - improved slate palette
  const bgClass = isDark ? "bg-slate-900 text-gray-100" : "bg-gray-50 text-gray-900";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const inputBg = isDark ? "bg-slate-700 text-gray-100 placeholder-gray-400" : "bg-white text-black placeholder-gray-500";
  const btnDark = isDark ? "bg-slate-600 hover:bg-slate-500" : "bg-[#333] hover:bg-[#222]";
  const textGray = isDark ? "text-gray-200" : "text-gray-900";
  useEffect(() => {
    if (diagnostics?.topTags?.length || diagnostics?.topCuisines?.length) {
      // The hook already logs, but this lets you add extra UI/alerts if needed.
      // Example: console.log("Diagnostics:", diagnostics);
    }
  }, [diagnostics]);
  return (
    <div className={`flex flex-col gap-12 pb-12 ${bgClass}`}>
      {/* Search Bar */}
      <section className="relative w-full min-h-[420px] md:h-[40vh]">
        <img
          src={backgroundImage}
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <h1
          className="absolute inset-x-0 top-[30%] -translate-y-1/2 px-4 text-center text-2xl font-semibold md:text-4xl"
          style={{ color: isDark ? '#0f172a' : '#000000' }}
        >
          Looking for something to eat?
        </h1>
        <div className="absolute top-[55%] left-1/2 w-[90%] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
          <div className={`flex w-full flex-col gap-3 rounded-[12px] p-4 shadow-md backdrop-blur-sm md:flex-row md:items-center md:gap-2 ${inputBg}`}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full border-none p-3 text-base outline-none md:text-lg ${inputBg}`}
            />
            <button
              className={`w-full rounded-[6px] px-4 py-3 text-base font-semibold text-white transition md:w-auto cursor-pointer ${btnDark}`}
              onClick={handleSearch}
            >
              Go
            </button>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap lg:justify-center">
            <Dropdown
              label="Cuisine"
              options={cuisines.map((c) => c.name)}
              value={selectedCuisine}
              onChange={setSelectedCuisine}
              width="w-full sm:w-[150px]"
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
            />
            <Dropdown
              label="Reservation"
              options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]}
              value={reservation !== null ? reservation.toString() : ""}
              onChange={(val) => setReservation(val === "" ? null : val === "true")}
              width="w-full sm:w-[150px]"
            />
            <Dropdown
              label="Open Now"
              options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]}
              value={openNow !== null ? openNow.toString() : ""}
              onChange={(val) => setOpenNow(val === "" ? null : val === "true")}
              width="w-full sm:w-[150px]"
            />
            <Dropdown
              label="City"
              options={["Auckland", "Wellington", "Christchurch"]}
              value={selectedCity}
              onChange={setSelectedCity}
              width="w-full sm:w-[150px]"
            />
          </div>
        </div>
      </section>
      {/* Recommended For You */}
      {recommendedCards.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-20 py-8 z-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className={`text-lg font-bold sm:text-xl ${textGray}`}>Recommended For You</h3>
            <span className="text-sm opacity-70">
              {recLoading ? "personalizing…" : `Top ${recommendedCards.length}`}
            </span>
          </div>
          <RestaurantList restaurants={recommendedCards} direction="horizontal" />
        </section>
      )}

      {/* Popular Restaurants */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-20 py-8 z-0">
        <div className="flex items-center justify-between gap-3">
          <h3 className={`text-lg font-bold sm:text-xl ${textGray}`}>Popular Restaurants</h3>
          <button
            type="button"
            className="rounded-full px-4 py-2 text-sm font-medium text-lime-700 transition hover:bg-lime-50 focus:outline-none focus:ring-2 focus:ring-lime-400 sm:hidden cursor-pointer"
            onClick={() => navigate("/search?sort=popular")}
          >
            View all
          </button>
        </div>
        <RestaurantList restaurants={popularCards} direction="horizontal" />
      </section>

      {/* Explore Cuisines */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-20 py-8 z-0">
        <h3 className={`text-lg font-bold sm:text-xl ${textGray}`}>Explore Cuisines</h3>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap lg:justify-center lg:gap-4">
          {cuisines.map((c) => (
            <button
              key={c.name}
              className="group relative flex items-center justify-center rounded-lg bg-lime-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-lime-700 focus:outline-none focus:ring-4 focus:ring-lime-300 sm:text-base cursor-pointer"
              onClick={() => handleCuisineClick(c.name)}
            >
              <span className="relative z-10">{c.name}</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
            </button>
          ))}
        </div>
      </section>

      {/* Local Favourites */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-20 py-8 mb-10 z-0">
        <div className="flex items-center justify-between gap-3">
          <h3 className={`text-lg font-bold sm:text-xl ${textGray}`}>Local Favourites</h3>
          <button
            type="button"
            className="rounded-full px-4 py-2 text-sm font-medium text-lime-700 transition hover:bg-lime-50 focus:outline-none focus:ring-2 focus:ring-lime-400 sm:hidden cursor-pointer"
            onClick={() => navigate("/search?filter=local")}
          >
            View all
          </button>
        </div>
        <RestaurantList restaurants={localFavCards} direction="horizontal" />
      </section>

      {/* Map */}
      <section className="relative z-0">
        <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-lg px-4 sm:px-8 lg:px-20">
          <div className="h-[280px] w-full rounded-lg sm:h-[340px] lg:h-[420px]">
            <MapContainer>
              {(map) => <RestaurantMarkers map={map} restaurants={restaurantsRaw} />}
            </MapContainer>
          </div>
        </div>
      </section>

      {(loading || err) && (
        <div className="px-4 text-center text-sm sm:px-8 lg:px-20">
          {loading ? "Loading fresh recommendations..." : `Error: ${err}`}
        </div>
      )}
    </div>
  );
}
