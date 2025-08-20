import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{restaurant.name}</h1>
      <p className="text-gray-600">{restaurant.description}</p>
      <p className="text-gray-500">
        Cuisine: {restaurant.cuisine} • Rating: {restaurant.rating}
      </p>
    </div>
  );
}
