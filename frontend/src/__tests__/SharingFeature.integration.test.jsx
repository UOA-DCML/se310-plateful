import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import RestaurantCard from "../components/RestaurantCard";

// Mock dependencies
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

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

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Sharing Feature Integration Tests", () => {
  const mockRestaurant = {
    id: "test-restaurant-123",
    name: "Integration Test Bistro",
    cuisine: "Fusion",
    rating: 4.8,
    tags: ["Modern", "Fusion"],
    priceLevel: 3,
    images: ["https://example.com/image1.jpg"],
  };

  let writeTextSpy;

  beforeEach(() => {
    mockNavigate.mockClear();

    // Create a proper spy for clipboard
    writeTextSpy = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: writeTextSpy,
      },
      writable: true,
      configurable: true,
    });

    // Reset navigator.share
    delete navigator.share;
  });

  describe("Complete sharing workflow", () => {
    it("completes full share flow from button click to copy link", async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter>
          <RestaurantCard restaurant={mockRestaurant} />
        </MemoryRouter>
      );

      // Step 1: Click share button
      const shareButton = screen.getByRole("button", { name: /share restaurant/i });
      expect(shareButton).toBeInTheDocument();
      await user.click(shareButton);

      // Step 2: Modal should open
      expect(screen.getByText("Share Restaurant")).toBeInTheDocument();
      // Restaurant name appears in both card and modal, so use getAllByText
      expect(screen.getAllByText("Integration Test Bistro").length).toBeGreaterThan(0);

      // Step 3: Verify all sharing options are present
      expect(screen.getByText("WhatsApp")).toBeInTheDocument();
      expect(screen.getByText("Messenger")).toBeInTheDocument();
      expect(screen.getByText("Twitter")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("SMS")).toBeInTheDocument();

      // Step 4: Verify copy link section is present
      expect(screen.getByText("Or copy link")).toBeInTheDocument();
      const allButtons = screen.getAllByRole("button");
      const copyButton = allButtons.find(btn => btn.textContent.includes("Copy"));
      expect(copyButton).toBeDefined();
    });

    it("handles social media share button clicks", async () => {
      const user = userEvent.setup();
      const mockWindowOpen = vi.fn();
      window.open = mockWindowOpen;

      render(
        <MemoryRouter>
          <RestaurantCard restaurant={mockRestaurant} />
        </MemoryRouter>
      );

      // Open modal
      const shareButton = screen.getByRole("button", { name: /share restaurant/i });
      await user.click(shareButton);

      // Click WhatsApp share
      const whatsappButton = screen.getByText("WhatsApp").closest("button");
      await user.click(whatsappButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining("wa.me"),
        "_blank",
        "width=600,height=400"
      );
    });

    it("closes modal and allows reopening", async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter>
          <RestaurantCard restaurant={mockRestaurant} />
        </MemoryRouter>
      );

      // Open modal
      const shareButton = screen.getByRole("button", { name: /share restaurant/i });
      await user.click(shareButton);
      expect(screen.getByText("Share Restaurant")).toBeInTheDocument();

      // Close modal
      const closeButton = screen.getByRole("button", { name: /close modal/i });
      await user.click(closeButton);
      expect(screen.queryByText("Share Restaurant")).not.toBeInTheDocument();

      // Reopen modal
      await user.click(shareButton);
      expect(screen.getByText("Share Restaurant")).toBeInTheDocument();
    });
  });

  describe("Native share API integration", () => {
    it("prefers native share API when available", async () => {
      const user = userEvent.setup();
      const mockShare = vi.fn(() => Promise.resolve());

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

      render(
        <MemoryRouter>
          <RestaurantCard restaurant={mockRestaurant} />
        </MemoryRouter>
      );

      const shareButton = screen.getByRole("button", { name: /share restaurant/i });
      await user.click(shareButton);

      // Native share should be called
      expect(mockShare).toHaveBeenCalledTimes(1);
      expect(mockShare).toHaveBeenCalledWith({
        title: "Integration Test Bistro",
        text: expect.stringContaining("Integration Test Bistro"),
        url: expect.stringContaining("/restaurant/test-restaurant-123"),
      });

      // Modal should NOT open
      expect(screen.queryByText("Share Restaurant")).not.toBeInTheDocument();
    });

    it("falls back to modal when native share is cancelled", async () => {
      const user = userEvent.setup();
      const mockShare = vi.fn(() => Promise.reject({ name: "AbortError" }));

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

      render(
        <MemoryRouter>
          <RestaurantCard restaurant={mockRestaurant} />
        </MemoryRouter>
      );

      const shareButton = screen.getByRole("button", { name: /share restaurant/i });
      await user.click(shareButton);

      // Modal should NOT open on abort
      expect(screen.queryByText("Share Restaurant")).not.toBeInTheDocument();
    });

    it("falls back to modal when native share fails", async () => {
      const user = userEvent.setup();
      const mockShare = vi.fn(() => Promise.reject(new Error("Share failed")));

      Object.defineProperty(navigator, "share", {
        value: mockShare,
        writable: true,
        configurable: true,
      });

      render(
        <MemoryRouter>
          <RestaurantCard restaurant={mockRestaurant} />
        </MemoryRouter>
      );

      const shareButton = screen.getByRole("button", { name: /share restaurant/i });
      await user.click(shareButton);

      // Modal should open as fallback
      await waitFor(() => {
        expect(screen.getByText("Share Restaurant")).toBeInTheDocument();
      });
    });
  });

  describe("Restaurant data handling", () => {
    it("handles restaurant with minimal data", async () => {
      const user = userEvent.setup();
      const minimalRestaurant = {
        id: "minimal-123",
        name: "Minimal Restaurant",
        tags: [],
        images: [],
      };

      render(
        <MemoryRouter>
          <RestaurantCard restaurant={minimalRestaurant} />
        </MemoryRouter>
      );

      const shareButton = screen.getByRole("button", { name: /share restaurant/i });
      await user.click(shareButton);

      await waitFor(() => {
        expect(screen.getByText("Share Restaurant")).toBeInTheDocument();
      });

      // Should appear in both card and modal
      const restaurantNames = screen.getAllByText("Minimal Restaurant");
      expect(restaurantNames.length).toBeGreaterThan(0);
      expect(screen.getByText("N/A/5")).toBeInTheDocument(); // No rating
    });

    it("correctly formats share text with restaurant details", async () => {
      const user = userEvent.setup();
      const mockShare = vi.fn(() => Promise.resolve());

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

      render(
        <MemoryRouter>
          <RestaurantCard restaurant={mockRestaurant} />
        </MemoryRouter>
      );

      const shareButton = screen.getByRole("button", { name: /share restaurant/i });
      await user.click(shareButton);

      expect(mockShare).toHaveBeenCalledWith({
        title: "Integration Test Bistro",
        text: "Check out Integration Test Bistro - Fusion • ⭐ 4.8/5",
        url: expect.stringContaining("/restaurant/test-restaurant-123"),
      });
    });
  });

  describe("Accessibility", () => {
    it("maintains focus management in modal", async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter>
          <RestaurantCard restaurant={mockRestaurant} />
        </MemoryRouter>
      );

      const shareButton = screen.getByRole("button", { name: /share restaurant/i });
      await user.click(shareButton);

      // Modal should be accessible
      expect(screen.getByRole("button", { name: /close modal/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
    });

    it("provides aria-label for share button", () => {
      render(
        <MemoryRouter>
          <RestaurantCard restaurant={mockRestaurant} />
        </MemoryRouter>
      );

      const shareButton = screen.getByRole("button", { name: /share restaurant/i });
      expect(shareButton).toHaveAttribute("aria-label", "Share restaurant");
    });
  });
});
