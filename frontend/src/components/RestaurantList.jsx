import RestaurantCard from "./RestaurantCard";
import "../styles/global.css";

const RestaurantList = ({ restaurants, direction }) => {
  return (
    <div
      className={`w-full ${
        direction === "vertical"
          ? ""
          : "overflow-x-auto snap-x snap-mandatory"
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
          <div key={index} className={direction === "vertical" ? "shrink-0" : "shrink-0 snap-center"}>
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
