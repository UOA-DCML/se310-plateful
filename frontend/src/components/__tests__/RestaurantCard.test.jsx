import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import RestaurantCard from "../RestaurantCard";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    // The tests own the navigation assertion, so we stub useNavigate to observe what the card would do.
    useNavigate: () => mockNavigate,
  };
});

describe("RestaurantCard", () => {
  const restaurant = {
    id: "abc123",
    name: "Test Bistro",
    tags: ["Fusion", "Casual"],
    priceLevel: 3,
    rating: 4.5,
    image: "https://example.com/image.jpg",
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the restaurant name and tags", () => {
    // MemoryRouter provides just enough routing context for the card without booting the entire app shell.
    render(<RestaurantCard restaurant={restaurant} />, {
      wrapper: MemoryRouter,
    });

    expect(screen.getByText("Test Bistro")).toBeInTheDocument();
    expect(screen.getByText("Fusion")).toBeInTheDocument();
    expect(screen.getByText("Casual")).toBeInTheDocument();
  });

  it("navigates to the restaurant details when clicked", async () => {
    const user = userEvent.setup();

    render(<RestaurantCard restaurant={restaurant} />, {
      wrapper: MemoryRouter,
    });

    // Querying via the card's class keeps the interaction stable even if inner markup shifts.
    const card = document.querySelector(".restaurant-card");
    await user.click(card);

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/abc123");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
