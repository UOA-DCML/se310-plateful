import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import RestaurantDetails from "../RestaurantDetails";

const mockNavigate = vi.fn();
const originalFetch = global.fetch;

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    // Lock the param so the component always fetches the same fixture
    useParams: () => ({ id: "rest-42" }),
    // Capture navigation intent instead of letting React Router mutate history
    useNavigate: () => mockNavigate,
  };
});

vi.mock("yet-another-react-lightbox", () => ({
  Lightbox: () => null,
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock framer-motion - render children conditionally
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, onClick, initial, animate, exit, variants, ...props }) => (
      <div onClick={onClick} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }) => {
    // Render children if they exist (modal is open)
    return <>{children}</>;
  },
}));

// Mirrors the minimal payload returned by the backend for bug #42, so the regression is reproducible in isolation.
const restaurantFixture = {
  id: "rest-42",
  name: "Back Button Bistro",
  priceLevel: 2,
  description: "A cozy spot.",
  tags: ["Casual"],
  images: ["https://example.com/img.jpg"],
  image: "https://example.com/img.jpg",
  address: {
    street: "123 Test Ave",
    city: "Sample City",
    postcode: "12345",
    country: "NZ",
  },
  phone: "1234567",
};

// Reproduces bug #42: the Go Back button should respect browser history when possible and otherwise land on Home.
describe("RestaurantDetails back navigation", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    // Replace the network call with a deterministic restaurant response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(restaurantFixture),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("goes back in history when a previous entry exists", async () => {
    // Emulate having at least one prior entry in the navigation stack
    window.history.replaceState({ idx: 1 }, "", "/restaurant/rest-42");

    render(<RestaurantDetails />);

    const goBackButton = await screen.findByRole("button", { name: /go back/i });
    await userEvent.click(goBackButton);

    // Preserves the search context by delegating to browser history.
    expect(mockNavigate).toHaveBeenCalledWith(-1);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("falls back to home when no previous entry exists", async () => {
    // Emulate loading the page directly (no history entries behind this one)
    window.history.replaceState({ idx: 0 }, "", "/restaurant/rest-42");

    render(<RestaurantDetails />);

    const goBackButton = await screen.findByRole("button", { name: /go back/i });
    await userEvent.click(goBackButton);

    // With no prior history, the UX requirement is to guide users back to the home landing page.
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});

// Tests for the sharing feature on RestaurantDetails page
describe("RestaurantDetails sharing feature", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(restaurantFixture),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("renders share button on restaurant details page", async () => {
    render(<RestaurantDetails />);

    // Wait for restaurant data to load
    await screen.findByText("Back Button Bistro");

    const shareButton = screen.getByRole("button", { name: /share restaurant/i });
    expect(shareButton).toBeInTheDocument();
  });

  it("opens share modal when share button is clicked (no native API)", async () => {
    const user = userEvent.setup();

    // Ensure no native share API
    delete navigator.share;

    render(<RestaurantDetails />);

    // Wait for restaurant data to load
    await screen.findByText("Back Button Bistro");

    const shareButton = screen.getByRole("button", { name: /share restaurant/i });
    await user.click(shareButton);

    // Modal should appear - wait for it
    await waitFor(() => {
      expect(screen.getByText("Share Restaurant")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("uses native share API when available on details page", async () => {
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

    render(<RestaurantDetails />);

    // Wait for restaurant data to load
    await screen.findByText("Back Button Bistro");

    const shareButton = screen.getByRole("button", { name: /share restaurant/i });
    await user.click(shareButton);

    expect(mockShare).toHaveBeenCalledWith({
      title: "Back Button Bistro",
      text: expect.stringContaining("Back Button Bistro"),
      url: expect.any(String),
    });
  });

  it("displays restaurant information in share modal", async () => {
    const user = userEvent.setup();

    // Ensure no native share API
    delete navigator.share;

    render(<RestaurantDetails />);

    // Wait for restaurant data to load
    await screen.findByText("Back Button Bistro");

    const shareButton = screen.getByRole("button", { name: /share restaurant/i });
    await user.click(shareButton);

    // Wait for modal to appear
    await waitFor(() => {
      expect(screen.getByText("Share Restaurant")).toBeInTheDocument();
    }, { timeout: 2000 });

    // Check if restaurant info appears in modal
    const modalRestaurantName = screen.getAllByText("Back Button Bistro");
    expect(modalRestaurantName.length).toBeGreaterThan(1); // Should appear in page and modal
  });

  it("closes share modal when close button is clicked", async () => {
    const user = userEvent.setup();

    // Ensure no native share API
    delete navigator.share;

    render(<RestaurantDetails />);

    // Wait for restaurant data to load
    await screen.findByText("Back Button Bistro");

    // Open modal
    const shareButton = screen.getByRole("button", { name: /share restaurant/i });
    await user.click(shareButton);

    await waitFor(() => {
      expect(screen.getByText("Share Restaurant")).toBeInTheDocument();
    }, { timeout: 2000 });

    // Close modal
    const closeButton = screen.getByRole("button", { name: /close modal/i });
    await user.click(closeButton);

    // Modal should be removed
    await waitFor(() => {
      expect(screen.queryByText("Share Restaurant")).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
