import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import RestaurantCard from "../RestaurantCard";

const mockNavigate = vi.fn();

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, onClick, ...props }) => (
      <div onClick={onClick} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

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

  it("renders share button", () => {
    render(<RestaurantCard restaurant={restaurant} />, {
      wrapper: MemoryRouter,
    });

    const shareButton = screen.getByRole("button", { name: /share restaurant/i });
    expect(shareButton).toBeInTheDocument();
  });

  it("opens share modal when share button is clicked (no native API)", async () => {
    const user = userEvent.setup();

    // Ensure no native share API
    delete navigator.share;

    render(<RestaurantCard restaurant={restaurant} />, {
      wrapper: MemoryRouter,
    });

    const shareButton = screen.getByRole("button", { name: /share restaurant/i });
    await user.click(shareButton);

    // Modal should appear
    await waitFor(() => {
      expect(screen.getByText("Share Restaurant")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("does not navigate when share button is clicked", async () => {
    const user = userEvent.setup();

    render(<RestaurantCard restaurant={restaurant} />, {
      wrapper: MemoryRouter,
    });

    const shareButton = screen.getByRole("button", { name: /share restaurant/i });
    await user.click(shareButton);

    // Should not trigger navigation
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("uses native share API when available on mobile", async () => {
    const user = userEvent.setup();
    const mockShare = vi.fn(() => Promise.resolve());

    // Mock navigator.share
    Object.defineProperty(navigator, "share", {
      value: mockShare,
      writable: true,
      configurable: true,
    });

    // Mock mobile user agent
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
      writable: true,
      configurable: true,
    });

    render(<RestaurantCard restaurant={restaurant} />, {
      wrapper: MemoryRouter,
    });

    const shareButton = screen.getByRole("button", { name: /share restaurant/i });
    await user.click(shareButton);

    expect(mockShare).toHaveBeenCalledWith({
      title: "Test Bistro",
      text: expect.stringContaining("Test Bistro"),
      url: expect.stringContaining("/restaurant/abc123"),
    });
  });

  it("displays restaurant image with fallback", () => {
    render(<RestaurantCard restaurant={restaurant} />, {
      wrapper: MemoryRouter,
    });

    const image = screen.getByAltText("Test Bistro");
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
  });

  it("handles missing restaurant tags gracefully", () => {
    const restaurantWithoutTags = {
      ...restaurant,
      tags: [],
    };

    render(<RestaurantCard restaurant={restaurantWithoutTags} />, {
      wrapper: MemoryRouter,
    });

    expect(screen.getByText("No tags available")).toBeInTheDocument();
  });
});
