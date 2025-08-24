import RestaurantCard from "./RestaurantCard";
import "../styles/global.css";

const RestaurantList = ({ restaurants, direction }) => {
  return (
    <div
      className={`w-full ${
        direction === "vertical" ? "" : "overflow-x-auto"
      }`}
    >
      <div
        className={`flex p-2 ${
          direction === "vertical"
            ? "flex-col gap-4"
            : "flex-row gap-2"
        }`}
      >
        {restaurants.map((restaurant, index) => (
          <div key={index} className="shrink-0">
            <RestaurantCard
              restaurant={restaurant}
              direction={direction}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
