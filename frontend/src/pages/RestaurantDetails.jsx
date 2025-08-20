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
      <div className="max-w-4xl w-full p-6">
        {/* Go Back */}
        <Link to="/" className="text-green-700 mb-4 inline-block">
          ← Go back
        </Link>

        {/* Lightbox */}
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={images.map((src) => ({ src }))}
        />

        {/* Image gallery */}
        <div className="grid grid-cols-3 gap-4 mb-6 items-start">
          {/* Main image */}
          <div className="col-span-2">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full max-h-[400px] object-cover rounded-lg shadow-md cursor-pointer"
              onClick={() => {
                setIndex(0); // main image is first
                setOpen(true);
              }}
            />
          </div>

          {/* Thumbnails */}
          <div className="flex flex-col gap-4">
            {(restaurant.images?.length
              ? restaurant.images
              : [restaurant.image, restaurant.image, restaurant.image]
            ).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${restaurant.name} ${idx}`}
                className="w-full max-h-[120px] object-cover rounded-lg shadow"
              />
            ))}
          </div>
        </div>

        {/* Restaurant info */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{restaurant.name}</h1>

          {/* Rating */}
          <div className="flex items-center justify-center mb-3">
            {"⭐".repeat(Math.floor(restaurant.rating))}
            <span className="ml-2 text-gray-600">{restaurant.rating}</span>
          </div>

          {/* Tags */}
          <div className="flex justify-center gap-2 mb-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              Top pick!
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              {restaurant.cuisine}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              Dinner
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
            {restaurant.description}
          </p>
        </div>
      </div>
    </div>
  );
}
