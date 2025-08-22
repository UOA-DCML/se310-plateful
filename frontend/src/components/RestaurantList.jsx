import RestaurantCard from "./RestaurantCard";
import "../styles/global.css";

const RestaurantList = ({ restaurants, direction }) => {
  return (
    <div className="w-full overflow-visible">
      <div
        className={`flex p-2 ${
          direction === "vertical" ? "flex-col gap-4" : "flex-row gap-4"
        }`}
      >
        {restaurants.map((restaurant, index) => (
          <RestaurantCard
            key={index}
            restaurant={restaurant}
            direction={direction}
          />
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
