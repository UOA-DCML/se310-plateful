import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ShareButton from "./ShareButton";
import ShareModal from "./ShareModal";

const RestaurantCard = ({ restaurant, direction = "vertical" }) => {
  const navigate = useNavigate();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

  // Share URL for this restaurant
  const shareUrl = `${window.location.origin}/restaurant/${restaurant.id}`;

  // Handle share button click
  const handleShare = async (e) => {
    e.stopPropagation(); // Prevent card click navigation

    // Try to use native Web Share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant.name,
          text: `Check out ${restaurant.name} - ${restaurant.cuisine || restaurant.tags?.[0] || 'Restaurant'} • ⭐ ${restaurant.rating || 'N/A'}/5`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error - show modal as fallback
        if (err.name !== 'AbortError') {
          setIsShareModalOpen(true);
        }
      }
    } else {
      // No native share API - show custom modal
      setIsShareModalOpen(true);
    }
  };

  return (
    <>
      {/* Card container with dynamic styles based on direction (i.e. vertical in Home or horizontal in Search) */}
      <div className="relative">
        <div
          className={`restaurant-card ${direction === "vertical"
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
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-lg font-bold truncate flex-1">
                {restaurant.name || "Unnamed Restaurant"}
              </h3>
              {/* Share Button */}
              <button
                onClick={handleShare}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                aria-label="Share restaurant"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
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
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        restaurant={restaurant}
        shareUrl={shareUrl}
      />
    </>
  );
};

export default RestaurantCard;
