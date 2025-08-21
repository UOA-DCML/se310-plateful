import { useParams, Link } from "react-router-dom";
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useEffect, useState } from "react";

export default function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8080/api/restaurants/${id}`)
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

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-6xl w-full p-6">
        <Link to="/" className="text-green-700 mb-4 inline-block">
          ← Go back
        </Link>

        {/** Restaurant image gallery */}
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={images.map((src) => ({ src }))}
        />

        <div className="grid grid-cols-3 gap-4 mb-6 items-start">
          {/* Large image on the left */}
          <div className="col-span-2">
            <img
              src={restaurant.images?.[0] || restaurant.image}
              alt={restaurant.name}
              className="w-full max-h-[400px] object-cover rounded-lg shadow-md cursor-pointer"
              onClick={() => {
                setIndex(0);
                setOpen(true);
              }}
            />
          </div>

          {/* Thumbnails on the right */}
          <div className="flex flex-col gap-4">
            {(restaurant.images?.slice(1, 3) || [restaurant.image]).map(
              (img, idx, arr) => {
                const displayIndex = idx + 1; // actual index in the gallery
                const thumbCount = arr.length; // 1 or 2 thumbnails
                const thumbHeight = (400 - (thumbCount - 1) * 16) / thumbCount; // left image height minus gap

                const isLastVisible = idx === 1 && restaurant.images.length > 2; // overlay on second thumbnail if more than 2 images

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

                    {/* Overlay if there are more images */}
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
                        <span className="relative z-10 text-white text-2xl font-bold">
                          +{restaurant.images.length - 2}
                        </span>
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Restaurant details */}
        <div className="text-left">
          <h1 className="text-2xl font-bold mb-2">{restaurant.name}</h1>
          <div className="flex mb-3">
            {"$".repeat(Math.floor(restaurant.priceLevel))}
          </div>

          {/* Tags */}
          <div className="flex gap-3 mb-4">
            {restaurant.tags?.length
              ? restaurant.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-green-100 text-green-800 px-5 py-2 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))
              : "No tags available"}
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto mb-8">
              {restaurant.description}
            </p>
          </div>

          {/* Contact info */}
          <div className="mt-16">
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
