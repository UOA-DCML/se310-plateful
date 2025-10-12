import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import DOMPurify from "dompurify";
import { buildApiUrl } from "../lib/config";

export default function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch(buildApiUrl(`/api/restaurants/${id}`))
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch restaurant");
        return res.json();
      })
      .then((data) => {
        setRestaurant(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!restaurant) return <p>Restaurant not found</p>;

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
          <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
          <div className="flex mb-3">
            {"$".repeat(Math.floor(restaurant.priceLevel))}
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
    </div>
  );
}
