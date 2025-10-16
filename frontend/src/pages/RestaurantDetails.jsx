import { useParams, useNavigate } from "react-router-dom";
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import toast from "react-hot-toast";
import ShareButton from "../components/ShareButton";
import ShareModal from "../components/ShareModal";
import { useAuth } from "../auth/AuthContext";

export default function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [voteStatus, setVoteStatus] = useState({
    hasUpvoted: false,
    hasDownvoted: false,
    upvoteCount: 0,
    downvoteCount: 0,
    voteCount: 0
  });
  const [voteLoading, setVoteLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/api/restaurants/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch restaurant");
        return res.json();
      })
      .then((data) => {
        setRestaurant(data);
        setLoading(false);
        
        // Add to browse history
        if (user?.id) {
          fetch(`http://localhost:8080/api/user/history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              restaurantId: data.id,
              restaurantName: data.name,
              viewType: 'Details viewed'
            })
          }).catch(err => console.error('Failed to add to history:', err));
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id, user]);

  // Check if restaurant is in favorites
  useEffect(() => {
    if (user?.id && id) {
      fetch(`http://localhost:8080/api/user/favorites?userId=${user.id}`)
        .then(res => res.json())
        .then(favorites => {
          setIsFavorite(favorites.includes(id));
        })
        .catch(err => console.error('Failed to check favorites:', err));
    }
  }, [user, id]);

  // Fetch vote status
  useEffect(() => {
    if (id) {
      const token = localStorage.getItem('accessToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      fetch(`http://localhost:8080/api/restaurants/${id}/vote-status`, { headers })
        .then(res => res.json())
        .then(data => {
          setVoteStatus({
            hasUpvoted: data.hasUpvoted || false,
            hasDownvoted: data.hasDownvoted || false,
            upvoteCount: data.upvoteCount || 0,
            downvoteCount: data.downvoteCount || 0,
            voteCount: data.voteCount || 0
          });
        })
        .catch(err => console.error('Failed to fetch vote status:', err));
    }
  }, [user, id]);

  // Share URL for this restaurant
  const shareUrl = window.location.href;

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Please sign in to add favorites');
      navigate('/signin');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        // Remove from favorites
        await fetch(`http://localhost:8080/api/user/favorites`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            restaurantId: id
          })
        });
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        // Add to favorites
        await fetch(`http://localhost:8080/api/user/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            restaurantId: id
          })
        });
        setIsFavorite(true);
        toast.success('Added to favorites!');
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      toast.error('Failed to update favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Handle share button click
  const handleShare = async () => {
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

  // Handle upvote
  const handleUpvote = async () => {
    if (!user) {
      toast.error('Please sign in to vote');
      navigate('/signin');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Please sign in to vote');
      navigate('/signin');
      return;
    }

    setVoteLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/restaurants/${id}/upvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Upvote response:', data);
      const newVoteStatus = {
        hasUpvoted: true,
        hasDownvoted: false,
        upvoteCount: data.upvoteCount || 0,
        downvoteCount: data.downvoteCount || 0,
        voteCount: data.voteCount || 0
      };
      console.log('Setting new vote status:', newVoteStatus);
      setVoteStatus(newVoteStatus);
      toast.success('Upvoted!');
    } catch (err) {
      console.error('Failed to upvote:', err);
      toast.error('Failed to upvote');
    } finally {
      setVoteLoading(false);
    }
  };

  // Handle downvote
  const handleDownvote = async () => {
    if (!user) {
      toast.error('Please sign in to vote');
      navigate('/signin');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Please sign in to vote');
      navigate('/signin');
      return;
    }

    setVoteLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/restaurants/${id}/downvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setVoteStatus({
        hasUpvoted: false,
        hasDownvoted: true,
        upvoteCount: data.upvoteCount || 0,
        downvoteCount: data.downvoteCount || 0,
        voteCount: data.voteCount || 0
      });
      toast.success('Downvoted!');
    } catch (err) {
      console.error('Failed to downvote:', err);
      toast.error('Failed to downvote');
    } finally {
      setVoteLoading(false);
    }
  };

  // Handle remove vote
  const handleRemoveVote = async () => {
    if (!user) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    setVoteLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/restaurants/${id}/vote`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setVoteStatus({
        hasUpvoted: false,
        hasDownvoted: false,
        upvoteCount: data.upvoteCount || 0,
        downvoteCount: data.downvoteCount || 0,
        voteCount: data.voteCount || 0
      });
      toast.success('Vote removed');
    } catch (err) {
      console.error('Failed to remove vote:', err);
      toast.error('Failed to remove vote');
    } finally {
      setVoteLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!restaurant) return <p>Restaurant not found</p>;

  console.log('Current voteStatus:', voteStatus);

  const images = restaurant.images?.length
    ? restaurant.images
    : [restaurant.image, restaurant.image, restaurant.image];

  // Sanitize images to ensure they are safe
  const safeImages = (
    restaurant.images?.length ? restaurant.images : [restaurant.image]
  ).map(
    (image) =>
      DOMPurify.sanitize(image, { ALLOWED_URI_REGEXP: /^https?:\/\// }) ||
      "/fallback.png"
  );

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-6xl w-full p-6">
        <button
          type="button"
          className="text-green-700 mb-4 inline-block"
          onClick={() => {
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate("/", { replace: true });
            }
          }}
        >
          ← Go back
        </button>

        {/** Restaurant image gallery */}
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={safeImages.map((src) => ({ src }))}
        />

        <div className="grid grid-cols-3 gap-4 mb-6 items-start">
          {/* Large image */}
          <div className="col-span-2">
            <img
              src={safeImages[0]}
              alt={restaurant.name}
              className="w-full h-[400px] object-cover rounded-lg shadow-md cursor-pointer"
              onClick={() => {
                setIndex(0);
                setOpen(true);
              }}
            />
          </div>

          {/* Smaller image thumbnails */}
          <div className="flex flex-col gap-4">
            {safeImages.slice(1, 3).map((img, idx) => {
              const displayIndex = idx + 1;
              const thumbCount = safeImages.slice(1, 3).length;
              const thumbHeight = (400 - (thumbCount - 1) * 16) / thumbCount;
              const isLastVisible = idx === 1 && safeImages.length > 2; // Check if this is the last thumbnail and there are more images

              return (
                <div key={displayIndex} className="relative">
                  <img
                    src={img}
                    alt={`${restaurant.name} ${displayIndex}`}
                    className="w-full object-cover rounded-lg shadow cursor-pointer"
                    style={{ height: `${thumbHeight}px` }}
                    onClick={() => {
                      setIndex(displayIndex);
                      setOpen(true);
                    }}
                  />
                  {isLastVisible && (
                    <div
                      className="absolute inset-0 flex items-center justify-center rounded-lg cursor-pointer"
                      style={{ background: "rgba(0,0,0,0.7)" }}
                      onClick={() => {
                        setIndex(displayIndex);
                        setOpen(true);
                      }}
                    >
                      <img
                        src={img}
                        alt={`${restaurant.name} ${displayIndex}`}
                        className="w-full object-cover rounded-lg shadow cursor-pointer opacity-40 absolute inset-0"
                        style={{ height: `${thumbHeight}px` }}
                      />
                      {/* Overlay text for additional images (if any) */}
                      <span className="relative z-10 text-white text-2xl font-bold">
                        +{safeImages.length - 2}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Restaurant details */}
        <div className="text-left">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
              <div className="flex mb-3">
                {"$".repeat(Math.floor(restaurant.priceLevel))}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Voting Buttons with Counts */}
              <div className="flex gap-1 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => voteStatus.hasUpvoted ? handleRemoveVote() : handleUpvote()}
                  disabled={voteLoading}
                  className={`px-3 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                    voteStatus.hasUpvoted
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={voteStatus.hasUpvoted ? 'Remove upvote' : 'Upvote'}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span className="text-sm font-medium">{voteStatus.upvoteCount}</span>
                </button>
                <button
                  onClick={() => voteStatus.hasDownvoted ? handleRemoveVote() : handleDownvote()}
                  disabled={voteLoading}
                  className={`px-3 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                    voteStatus.hasDownvoted
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={voteStatus.hasDownvoted ? 'Remove downvote' : 'Downvote'}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                  </svg>
                  <span className="text-sm font-medium">{voteStatus.downvoteCount}</span>
                </button>
              </div>
              {/* Favorite Button */}
              <button
                onClick={handleFavoriteToggle}
                disabled={favoriteLoading}
                className={`p-3 rounded-full transition-all duration-200 ${
                  isFavorite
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg
                  className="w-6 h-6"
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
              {/* Share Button */}
              <ShareButton onClick={handleShare} />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-6">
            {restaurant.tags?.length
              ? restaurant.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-400 mb-2"
                >
                  {tag}
                </span>
              ))
              : "No tags available"}
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed max-w-2xl mb-4">
              {restaurant.description}
            </p>
          </div>

          {/* Contact info */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-2">Contact Info</h4>
            <p>{restaurant.address.street}</p>
            <p>{restaurant.address.city}</p>
            <p>{restaurant.address.postcode}</p>
            <p>{restaurant.address.country}</p>
            <p>{restaurant.phone}</p>
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
    </div>
  );
}
