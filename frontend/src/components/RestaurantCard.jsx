import { useNavigate } from "react-router-dom";
import DirectionsButton from "./DirectionsButton";

const RestaurantCard = ({ restaurant, direction = "vertical" }) => {
  const navigate = useNavigate();

  // Handle the image - use first image from images array or fallback
  const imageUrl =
    restaurant.images?.[0] ||
    restaurant.image ||
    "https://media.istockphoto.com/id/1829241109/photo/enjoying-a-brunch-together.jpg?s=612x612&w=0&k=20&c=9awLLRMBLeiYsrXrkgzkoscVU_3RoVwl_HA-OT-srjQ=";

  // Handle rating - use rating if available, otherwise show cuisine and price level
  const displayInfo = restaurant.rating
    ? `⭐ Rating: ${restaurant.rating}`
    : `${restaurant.cuisine || "Restaurant"} • ${"$".repeat(
        Math.max(1, Math.min(4, restaurant.priceLevel || 1))
      )}`;

  return (
    // Card container with dynamic styles based on direction (i.e. vertical in Home or horizontal in Search)
    <div
      className={`restaurant-card ${
        direction === "vertical"
          ? "max-w-[100%] h-40 flex flex-row rounded-lg shadow-lg bg-white overflow-hidden"
          : "w-44 h-80 flex flex-col rounded-lg shadow-lg bg-white overflow-hidden"
      }`}
      onClick={() => {
        if (restaurant.id) {
          navigate(`/restaurant/${restaurant.id}`);
        }
      }}
      style={{ cursor: "pointer" }}
    >
      <img
        src={imageUrl}
        alt={restaurant.name || "Restaurant"}
        className={
          direction === "vertical"
            ? "w-60 h-50 object-cover rounded-t-lg"
            : "w-full h-48 object-cover rounded-t-lg"
        }
        onError={(e) => {
          e.target.src =
            "https://media.istockphoto.com/id/1829241109/photo/enjoying-a-brunch-together.jpg?s=612x612&w=0&k=20&c=9awLLRMBLeiYsrXrkgzkoscVU_3RoVwl_HA-OT-srjQ=";
        }}
      />
      {/* Content section with dynamic styles based on direction */}
      <div className="flex flex-col p-3 flex-grow">
        <h3 className="text-lg font-bold truncate">
          {restaurant.name || "Unnamed Restaurant"}
        </h3>
        {Array.isArray(restaurant.tags) && restaurant.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1 mt-1">
            {restaurant.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-200 text-gray-700 text-[10px] px-1.5 py-0.5 rounded-full inline-block"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No tags available</p>
        )}
        <p className="text-sm text-gray-500 mt-auto">{displayInfo}</p>
        <div onClick={(e) => e.stopPropagation()}>
          <DirectionsButton
            destinationAddress={
              restaurant.address
                ? `${restaurant.address.street}, ${restaurant.address.city} ${restaurant.address.postcode}, ${restaurant.address.country}`
                : restaurant.name
            }
            className="text-xs px-3 py-1"
          />
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
