import { useEffect } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import { useNavigate } from "react-router-dom";

export default function RestaurantMarkers({ map, restaurants }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!map) return;

    const container = map.getContainer();

    // Handle click on restaurant title within popup
    const handleClick = (e) => {
      const button = e.target.closest("button[data-restaurant-id]");
      if (button && container.contains(button)) {
        e.preventDefault();
        const id = button.getAttribute("data-restaurant-id");
        if (id) navigate(`/restaurant/${id}`);
      }
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [map, navigate]);

  // Create markers + popups
  useEffect(() => {
    if (!map || !restaurants?.length) return;

    const createdMarkers = [];

    restaurants.forEach((r) => {
      try {
        const lng = r.location?.coordinates?.[0] ?? r.longitude;
        const lat = r.location?.coordinates?.[1] ?? r.latitude;
        if (lng == null || lat == null) return;

        const el = document.createElement("div");
        el.className = "custom-marker";

        const imageUrl = r.images?.[0] || "https://via.placeholder.com/30";
        el.innerHTML = `<img src="${imageUrl}" style="width:30px;height:30px;border-radius:50%;" />`;

        const priceLevel = Math.max(
          1,
          Math.min(4, parseInt(r.priceLevel) || 1)
        );
        const priceDisplay = "$".repeat(priceLevel);
        const id = r.id ?? r._id; // handle Mongo-style IDs too

        const popupHTML = `
          <div style="padding:5px;">
            <h3 class="popup-title" style="margin:0; border:none !important;">
                <button 
                data-restaurant-id="${id}" 
                style="background:none;border:none;color:#007bff;cursor:pointer;font-size:16px;text-decoration:underline;padding:0;"
                >
                ${r.name || "Restaurant"}
                </button>
            </h3>
            <p>${r.description || "No description"}</p>
            <p><strong>Cuisine:</strong> ${r.cuisine || "N/A"}</p>
            <p><strong>Price:</strong> ${priceDisplay}</p>
          </div>
        `;

        const popup = new tt.Popup({ offset: 30 }).setHTML(popupHTML);

        // Add styling to the popup close button manually after popup creation
        popup.on("open", () => {
          const closeBtn = popup
            .getElement()
            .querySelector(".mapboxgl-popup-close-button");
          if (closeBtn) {
            closeBtn.style.width = "30px";
            closeBtn.style.height = "30px";
            closeBtn.style.fontSize = "20px";
            closeBtn.style.lineHeight = "30px";

            // Move it closer to the content
            closeBtn.style.top = "5px";
            closeBtn.style.right = "5px";
          }
        });

        // Create the marker and add it to the map
        const marker = new tt.Marker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);

        createdMarkers.push(marker);
      } catch (err) {
        console.error("Error creating marker for restaurant:", r?.name, err);
      }
    });

    return () => {
      createdMarkers.forEach((m) => m.remove());
    };
  }, [map, restaurants]);

  return null;
}
