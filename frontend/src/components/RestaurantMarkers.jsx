import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function RestaurantMarkers({ map, restaurants }) {
  const navigate = useNavigate();
  const { isDark } = useTheme();

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
          // TODO: Remove this when Database Entries are fixed
          let lng = Number(r.location?.coordinates?.[0] ?? r.longitude);
          let lat = Number(r.location?.coordinates?.[1] ?? r.latitude);

        if (lng == null || lat == null) return;
        // If it looks like [lat, lng] or ranges are invalid, swap them.
        if ((Math.abs(lng) <= 90 && Math.abs(lat) > 90) || lng < -180 || lng > 180 || lat < -90 || lat > 90) {
            [lng, lat] = [lat, lng];
        }

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

        // Dark mode styles
        const popupBg = isDark ? '#1e293b' : '#ffffff';
        const popupText = isDark ? '#f1f5f9' : '#000000';
        const linkColor = isDark ? '#60a5fa' : '#007bff';

        const popupHTML = `
          <div style="padding:5px; background-color:${popupBg}; color:${popupText};">
            <h3 class="popup-title" style="margin:0; border:none !important;">
                <button 
                data-restaurant-id="${id}" 
                style="background:none;border:none;color:${linkColor};cursor:pointer;font-size:16px;text-decoration:underline;padding:0;"
                >
                ${r.name || "Restaurant"}
                </button>
            </h3>
            <p style="color:${popupText};">${r.description || "No description"}</p>
            <p style="color:${popupText};"><strong>Cuisine:</strong> ${r.cuisine || "N/A"}</p>
            <p style="color:${popupText};"><strong>Price:</strong> ${priceDisplay}</p>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 30 }).setHTML(popupHTML);

        // Add styling to the popup close button manually after popup creation
        popup.on("open", () => {
          const closeBtn = popup
            .getElement()
            .querySelector(".maplibregl-popup-close-button");
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
        const marker = new maplibregl.Marker({ element: el })
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
  }, [map, restaurants, isDark, navigate]);

  return null;
}
