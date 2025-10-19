import { useNavigate } from "react-router-dom";
import DirectionsButton from "./DirectionsButton";
import { useState } from "react";
import ShareButton from "./ShareButton";
import ShareModal from "./ShareModal";
import { FaDollarSign } from "react-icons/fa";
import { buildFrontendUrl } from "../lib/config";
import { useTheme } from "../context/ThemeContext";

const RestaurantCard = ({ restaurant, direction = "vertical" }) => {
  const navigate = useNavigate();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { isDark } = useTheme();

  // Handle the image - use first image from images array or fallback
  const imageUrl =
    restaurant.images?.[0] ||
    restaurant.image ||
    "https://media.istockphoto.com/id/1829241109/photo/enjoying-a-brunch-together.jpg?s=612x612&w=0&k=20&c=9awLLRMBLeiYsrXrkgzkoscVU_3RoVwl_HA-OT-srjQ=";

  // Share URL for this restaurant - use canonical frontend URL
  const shareUrl = buildFrontendUrl(`/restaurant/${restaurant.id}`);

  // Get upvote and downvote counts
  const upvoteCount = restaurant.upvoteCount || 0;
  const downvoteCount = restaurant.downvoteCount || 0;
  const netVotes = upvoteCount - downvoteCount;

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
          text: `Check out ${restaurant.name} - ${restaurant.cuisine || restaurant.tags?.[0] || 'Restaurant'} • 👍 ${upvoteCount} upvotes`,
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
          className={`restaurant-card group transition-all duration-300 rounded-xl shadow-md hover:shadow-xl overflow-hidden ${direction === "vertical"
            ? "flex flex-row items-stretch"
            : "w-[300px] flex flex-col"
            }`}
          style={{
            backgroundColor: isDark ? '#1e293b' : 'white',
            cursor: 'pointer',
            height: direction === "vertical" ? '280px' : 'auto',
            minHeight: direction === "vertical" ? '280px' : '420px'
          }}
          onClick={() => {
            if (restaurant.id) {
              navigate(`/restaurant/${restaurant.id}`);
            }
          }}
        >
          {/* Image Section */}
          <div
            className="flex-shrink-0 relative overflow-hidden"
            style={{
              width: direction === "vertical" ? '220px' : '100%',
              height: direction === "vertical" ? '100%' : '180px',
              minWidth: direction === "vertical" ? '220px' : 'auto',
              minHeight: direction === "vertical" ? '280px' : '180px'
            }}
          >
            <img
              src={imageUrl}
              alt={restaurant.name || "Restaurant"}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
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
          <div
            className="flex flex-col flex-grow overflow-hidden"
            style={{
              padding: direction === "vertical" ? '16px 16px 16px 16px' : '20px 20px 20px 20px',
              gap: direction === "vertical" ? '10px' : '12px'
            }}
          >
            {/* Header Section */}
            <div className="flex-shrink-0">
              <h3
                className={`font-bold leading-tight mb-2 ${direction === "vertical" ? "text-base line-clamp-1" : "text-lg line-clamp-2"}`}
                style={{ color: isDark ? '#f1f5f9' : '#111827' }}
              >
                {restaurant.name || "Unnamed Restaurant"}
              </h3>

              {/* Tags - Limited to 2-3 visible with dynamic handling */}
              {Array.isArray(restaurant.tags) && restaurant.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {restaurant.tags.slice(0, direction === "vertical" ? 2 : 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap"
                      style={{
                        backgroundColor: isDark ? '#334155' : '#f3f4f6',
                        color: isDark ? '#d1d5db' : '#4b5563'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {restaurant.tags.length > (direction === "vertical" ? 2 : 2) && (
                    <span
                      className="text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap"
                      style={{
                        backgroundColor: isDark ? '#334155' : '#f3f4f6',
                        color: isDark ? '#9ca3af' : '#6b7280'
                      }}
                    >
                      +{restaurant.tags.length - (direction === "vertical" ? 2 : 2)}
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-xs" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>No tags available</p>
              )}
            </div>

            {/* Flexible Spacer */}
            <div className="flex-grow" style={{ minHeight: '8px' }} />

            {/* Bottom Section - Fixed spacing */}
            <div className="mt-auto flex-shrink-0 flex flex-col" style={{ gap: direction === "vertical" ? '10px' : '12px' }}>
              {/* Votes and Price Section */}
              <div className="flex items-center justify-between gap-2">
                {/* Vote Badge */}
                <div
                  className="flex gap-1 rounded-lg p-1 flex-shrink-0"
                  style={{
                    backgroundColor: isDark ? '#1e293b' : '#f3f4f6'
                  }}
                >
                  <div
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
                    style={{
                      backgroundColor: isDark ? '#065f46' : '#d1fae5',
                      color: isDark ? '#6ee7b7' : '#047857',
                      minWidth: '50px'
                    }}
                  >
                    <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    <span className="text-xs font-semibold" style={{ fontSize: '11px' }}>{upvoteCount}</span>
                  </div>
                  <div
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
                    style={{
                      backgroundColor: isDark ? '#991b1b' : '#fee2e2',
                      color: isDark ? '#fca5a5' : '#dc2626',
                      minWidth: '50px'
                    }}
                  >
                    <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                    </svg>
                    <span className="text-xs font-semibold" style={{ fontSize: '11px' }}>{downvoteCount}</span>
                  </div>
                </div>

                {/* Price Level Badge */}
                {restaurant.priceLevel && (
                  <div
                    className="inline-flex items-center px-2.5 py-1.5 rounded-lg border flex-shrink-0"
                    style={{
                      backgroundColor: isDark ? '#334155' : '#f8fafc',
                      color: isDark ? '#cbd5e1' : '#334155',
                      borderColor: isDark ? '#475569' : '#e2e8f0',
                      fontSize: '10px'
                    }}
                  >
                    {Array.from({ length: Math.max(1, Math.min(4, restaurant.priceLevel)) }).map((_, i) => (
                      <FaDollarSign key={i} style={{ width: '10px', height: '10px' }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Directions Button - Always at bottom with spacing */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex-shrink-0"
              >
                <DirectionsButton
                  destinationAddress={
                    restaurant.address
                      ? `${restaurant.address.street}, ${restaurant.address.city} ${restaurant.address.postcode}, ${restaurant.address.country}`
                      : restaurant.name
                  }
                  className="w-full"
                  style={{ fontSize: direction === "vertical" ? '12px' : '13px' }}
                  stacked={direction === "vertical"}
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
