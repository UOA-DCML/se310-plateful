import { useNavigate } from "react-router-dom";
import DirectionsButton from "./DirectionsButton";
import { useState } from "react";
import ShareButton from "./ShareButton";
import ShareModal from "./ShareModal";
import { FaStar, FaStarHalfAlt, FaRegStar, FaDollarSign } from "react-icons/fa";
import { buildFrontendUrl } from "../lib/config";

const RestaurantCard = ({ restaurant, direction = "vertical" }) => {
  const navigate = useNavigate();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Handle the image - use first image from images array or fallback
  const imageUrl =
    restaurant.images?.[0] ||
    restaurant.image ||
    "https://media.istockphoto.com/id/1829241109/photo/enjoying-a-brunch-together.jpg?s=612x612&w=0&k=20&c=9awLLRMBLeiYsrXrkgzkoscVU_3RoVwl_HA-OT-srjQ=";

  // Share URL for this restaurant - use canonical frontend URL
  const shareUrl = buildFrontendUrl(`/restaurant/${restaurant.id}`);

  // Helper function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="w-3 h-3 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="w-3 h-3 text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="w-3 h-3 text-gray-300" />);
      }
    }
    return stars;
  };

  // Helper function to get rating badge color
  const getRatingColor = (rating) => {
    if (!rating) return "bg-gray-100 text-gray-600 border-gray-300";
    if (rating >= 4.5) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (rating >= 4.0) return "bg-green-50 text-green-700 border-green-200";
    if (rating >= 3.5) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    if (rating >= 3.0) return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  // Handle share button click
  const handleShare = async (e) => {
    e.stopPropagation(); // Prevent card click navigation

    // Check if device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Only use native Web Share API on mobile devices
    if (isMobile && navigator.share) {
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
      // Desktop or no native share API - show custom modal
      setIsShareModalOpen(true);
    }
  };

  return (
    <>
      {/* Card container with dynamic styles based on direction (i.e. vertical in Home or horizontal in Search) */}
      <div className="relative">
        <div
          className={`restaurant-card group transition-all duration-300 ${direction === "vertical"
            ? "max-w-full h-[160px] flex flex-row rounded-xl shadow-md hover:shadow-xl bg-white overflow-hidden"
            : "w-[300px] min-h-[440px] flex flex-col rounded-xl shadow-md hover:shadow-xl bg-white overflow-hidden"
            }`}
          onClick={() => {
            if (restaurant.id) {
              navigate(`/restaurant/${restaurant.id}`);
            }
          }}
          style={{ cursor: "pointer" }}
        >
          {/* Image Section */}
          <div className={direction === "vertical" ? "w-[200px] flex-shrink-0 relative" : "w-full h-[180px] flex-shrink-0 relative"}>
            <img
              src={imageUrl}
              alt={restaurant.name || "Restaurant"}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.src =
                  "https://media.istockphoto.com/id/1829241109/photo/enjoying-a-brunch-together.jpg?s=612x612&w=0&k=20&c=9awLLRMBLeiYsrXrkgzkoscVU_3RoVwl_HA-OT-srjQ=";
              }}
            />
            {/* Share Button Overlay */}
            <button
              onClick={handleShare}
              className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full transition-all duration-200 shadow-md hover:shadow-lg z-10 cursor-pointer"
              aria-label="Share restaurant"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>

          {/* Content section with improved spacing */}
          <div className={`flex flex-col flex-grow ${direction === "vertical" ? "p-4" : "p-5"}`}>
            {/* Header Section */}
            <div className={`space-y-2.5 ${direction === "vertical" ? "mb-2" : "mb-4"}`}>
              <h3 className={`font-bold text-gray-900 leading-tight ${direction === "vertical" ? "text-base line-clamp-1" : "text-lg line-clamp-2"}`}>
                {restaurant.name || "Unnamed Restaurant"}
              </h3>

              {/* Tags - Limited to 2-3 visible with dynamic handling */}
              {Array.isArray(restaurant.tags) && restaurant.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {restaurant.tags.slice(0, direction === "vertical" ? 2 : 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                  {restaurant.tags.length > (direction === "vertical" ? 2 : 3) && (
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap">
                      +{restaurant.tags.length - (direction === "vertical" ? 2 : 3)}
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-xs">No tags available</p>
              )}
            </div>

            {/* Spacer to push content to bottom - only for horizontal cards */}
            {direction !== "vertical" && <div className="flex-grow min-h-[24px]" />}

            {/* Bottom Section - Fixed spacing */}
            <div className={direction === "vertical" ? "space-y-2" : "space-y-3.5"}>
              {/* Rating and Price Section */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Rating Badge */}
                {restaurant.rating ? (
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${getRatingColor(restaurant.rating)} font-semibold transition-all duration-200`}>
                    <div className="flex items-center gap-0.5">
                      {renderStars(restaurant.rating)}
                    </div>
                    <span className="text-sm font-bold">{restaurant.rating.toFixed(1)}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border bg-gray-50 text-gray-500 border-gray-200">
                    <FaRegStar className="w-3 h-3" />
                    <span className="text-xs font-medium">New</span>
                  </div>
                )}

                {/* Price Level Badge */}
                {restaurant.priceLevel && (
                  <div className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                    {Array.from({ length: Math.max(1, Math.min(4, restaurant.priceLevel)) }).map((_, i) => (
                      <FaDollarSign key={i} className="w-2.5 h-2.5" />
                    ))}
                  </div>
                )}
              </div>

              {/* Directions Button - Always at bottom */}
              <div onClick={(e) => e.stopPropagation()}>
                <DirectionsButton
                  destinationAddress={
                    restaurant.address
                      ? `${restaurant.address.street}, ${restaurant.address.city} ${restaurant.address.postcode}, ${restaurant.address.country}`
                      : restaurant.name
                  }
                  className="w-full text-sm"
                />
              </div>
            </div>
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
