import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/PlatefulBackgroundHome copy.png";
import MapContainer from "../components/MapContainer";
import PriceSlider from "../components/Slider";
import Dropdown from "../components/Dropdown";
import RestaurantMarkers from "../components/RestaurantMarkers";
import RestaurantList from "../components/RestaurantList";
import { buildApiUrl } from "../lib/config";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

export default function Home() {
  const navigate = useNavigate();
  const [restaurantsRaw, setRestaurantsRaw] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSlider, setShowSlider] = useState(false);
  const [priceRange, setPriceRange] = useState([1, 5]);
  const [priceMin, setPriceMin] = useState(null);
  const [priceMax, setPriceMax] = useState(null);
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [openNow, setOpenNow] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Fetch real restaurants from MongoDB
  useEffect(() => {
    setLoading(true);
    setErr("");

    // Fetch restaurants
    const fetchRestaurants = fetch(buildApiUrl("/api/restaurants"))
      .then((res) => {
        if (!res.ok) throw new Error(`API ${res.status}`);
        return res.json();
      })
      .then((data) => setRestaurantsRaw(Array.isArray(data) ? data : []));

    // Fetch cuisines
    const fetchCuisines = fetch(buildApiUrl("/api/restaurants/cuisines"))
      .then((res) => {
        if (!res.ok) throw new Error(`Cuisines API ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Transform cuisine strings into objects with name only
        const cuisineObjects = Array.isArray(data)
          ? data.map((cuisine) => ({
            name: cuisine,
          }))
          : [];
        setCuisines(cuisineObjects);
      });

    Promise.all([fetchRestaurants, fetchCuisines])
      .catch((e) => setErr(e.message || "Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

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

      navigate(`/search?${params.toString()}`, {
        state: { results: data },
      });
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
    tags: r.tags,
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
    <div className="flex flex-col gap-12 pb-12">
      {/* Search Bar Section */}
      <section className="relative w-full min-h-[420px] overflow-hidden md:min-h-[420px]">
        <img
          src={backgroundImage}
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative z-10 mx-auto flex h-full w-[90%] max-w-5xl flex-col items-center gap-6 px-4 py-16 sm:py-20">
          <h1 className="text-center text-3xl font-semibold text-gray-900 md:text-4xl">
            Looking for something to eat?
          </h1>
          {/* Search Bar */}
          <div className="flex w-full flex-col gap-3 rounded-[12px] bg-white/85 p-4 shadow-md backdrop-blur-sm md:flex-row md:items-center md:gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full border-none p-3 text-base outline-none md:text-lg"
            />
            <button
              className="w-full rounded-[6px] bg-[#333] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#222] md:w-auto cursor-pointer"
              onClick={handleSearch}
            >
              Go
            </button>
          </div>

          {/* Filters*/}
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
              options={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
              value={reservation !== null ? reservation.toString() : ""}
              onChange={(val) =>
                setReservation(val === "" ? null : val === "true")
              }
              width="w-full sm:w-[150px]"
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
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-20">
        {/* Popular Restaurants */}
        <section className="relative mt-6 py-8 z-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
              Popular Restaurants
            </h3>
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
        <section className="relative py-8 z-0">
          <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
            Explore Cuisines
          </h3>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap lg:justify-center lg:gap-4">
            {cuisines.map((cuisine) => {
              return (
                <button
                  key={cuisine.name}
                  className="group relative flex items-center justify-center rounded-lg bg-lime-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-lime-700 focus:outline-none focus:ring-4 focus:ring-lime-300 sm:text-base cursor-pointer"
                  onClick={() => handleCuisineClick(cuisine.name)}
                >
                  <span className="relative z-10">{cuisine.name}</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Local Favourites */}
        <section className="relative py-8 mb-10 z-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
              Local Favourites
            </h3>
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
      </div>

      {/* Map Section */}
      <section className="relative z-0">
        <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-lg px-4 sm:px-8 lg:px-20">
          <div className="h-[280px] w-full rounded-lg sm:h-[340px] lg:h-[420px]">
            <MapContainer>
              {(map) => (
                <RestaurantMarkers map={map} restaurants={restaurantsRaw} />
              )}
            </MapContainer>
          </div>
        </div>
      </section>

      {(loading || err) && (
        <div className="px-4 text-center text-sm text-gray-600 sm:px-8 lg:px-20">
          {loading ? "Loading fresh recommendations..." : `Error: ${err}`}
        </div>
      )}
    </div>
  );
}
