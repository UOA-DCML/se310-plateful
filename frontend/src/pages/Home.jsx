import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/PlatefulBackgroundHome copy.png";
import MapContainer from "../components/MapContainer";
import PriceSlider from "../components/Slider";
import Dropdown from "../components/Dropdown";
import RestaurantMarkers from "../components/RestaurantMarkers";
import RestaurantList from "../components/RestaurantList";
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

    if (searchQuery.trim()) params.append("query", searchQuery);
    if (priceMin) params.append("priceMin", priceMin);
    if (priceMax) params.append("priceMax", priceMax);
    if (reservation !== null) params.append("reservation", reservation);
    if (openNow !== null) params.append("openNow", openNow);
    if (selectedCity) params.append("city", selectedCity);
    if (selectedCuisine) params.append("cuisine", selectedCuisine);

    try {
      const response = await fetch(
        `http://localhost:8080/api/restaurants/filter?${params.toString()}`
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

  const boolOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  return (
    <div>
      {/* Search Bar Section */}
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
      <div className="px-20 mx-20">
        {/* Popular Restaurants */}
        <section className="mt-10 py-8">
          <h3 className="text-xl font-bold">Popular Restaurants</h3>
          <RestaurantList restaurants={popularCards} direction="horizontal" />
        </section>

        {/* Explore Cuisines */}
        <section className="relative py-8">
          <h3 className="text-xl font-bold">Explore Cuisines</h3>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {cuisines.map((cuisine) => {
              return (
                <button
                  key={cuisine.name}
                  className="group relative px-6 py-3 bg-lime-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out hover:bg-lime-700 focus:outline-none focus:ring-4"
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
        <section className="py-8 mb-10">
          <h3 className="text-xl font-bold">Local Favourites</h3>
          <RestaurantList restaurants={localFavCards} direction="horizontal" />
        </section>
      </div>

      {/* Map Section */}
      <section className="relative">
        <div className="w-full h-[400px] rounded-lg overflow-hidden">
          <MapContainer>
            {(map) => (
              <RestaurantMarkers map={map} restaurants={restaurantsRaw} />
            )}
          </MapContainer>
        </div>
      </section>
    </div>
  );
}
