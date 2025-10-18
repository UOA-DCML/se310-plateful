import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import RestaurantDetails from "../RestaurantDetails";
import { ThemeProvider } from "../../context/ThemeContext"; // Adjust path if needed

// Helper to wrap component in ThemeProvider
const renderWithTheme = (ui) => render(<ThemeProvider>{ui}</ThemeProvider>);

const mockNavigate = vi.fn();
const originalFetch = global.fetch;

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useParams: () => ({ id: "rest-42" }),
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../auth/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "user-1", email: "tester@example.com" },
    isAuthed: true,
  }),
}));

vi.mock("yet-another-react-lightbox", () => ({ Lightbox: () => null }));

vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: vi.fn() } }));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, onClick, ...props }) => <div onClick={onClick} {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

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

describe("RestaurantDetails back navigation", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(restaurantFixture) });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("goes back in history when a previous entry exists", async () => {
    window.history.replaceState({ idx: 1 }, "", "/restaurant/rest-42");

    renderWithTheme(<RestaurantDetails />);

    const goBackButton = await screen.findByRole("button", { name: /go back/i });
    await userEvent.click(goBackButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("falls back to home when no previous entry exists", async () => {
    window.history.replaceState({ idx: 0 }, "", "/restaurant/rest-42");

    renderWithTheme(<RestaurantDetails />);

    const goBackButton = await screen.findByRole("button", { name: /go back/i });
    await userEvent.click(goBackButton);

    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});

describe("RestaurantDetails sharing feature", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(restaurantFixture) });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("renders share button on restaurant details page", async () => {
    renderWithTheme(<RestaurantDetails />);
    await screen.findByText("Back Button Bistro");
    const shareButton = screen.getByRole("button", { name: /share restaurant/i });
    expect(shareButton).toBeInTheDocument();
  });

  it("opens share modal when share button is clicked (no native API)", async () => {
    const user = userEvent.setup();
    delete navigator.share;

    renderWithTheme(<RestaurantDetails />);
    await screen.findByText("Back Button Bistro");

    const shareButton = screen.getByRole("button", { name: /share restaurant/i });
    await user.click(shareButton);

    await waitFor(() => {
      expect(screen.getByText("Share Restaurant")).toBeInTheDocument();
    });
  });

  it("uses native share API when available on details page", async () => {
    const user = userEvent.setup();
    const mockShare = vi.fn(() => Promise.resolve());

    Object.defineProperty(navigator, "share", { value: mockShare, writable: true, configurable: true });
    Object.defineProperty(navigator, "userAgent", { value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)", writable: true, configurable: true });

    renderWithTheme(<RestaurantDetails />);
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
    delete navigator.share;

    renderWithTheme(<RestaurantDetails />);
    await screen.findByText("Back Button Bistro");

    const shareButton = screen.getByRole("button", { name: /share restaurant/i });
    await user.click(shareButton);

    await waitFor(() => {
      expect(screen.getByText("Share Restaurant")).toBeInTheDocument();
    });

    const modalRestaurantName = screen.getAllByText("Back Button Bistro");
    expect(modalRestaurantName.length).toBeGreaterThan(1);
  });

  it("closes share modal when close button is clicked", async () => {
    const user = userEvent.setup();
    delete navigator.share;

    renderWithTheme(<RestaurantDetails />);
    await screen.findByText("Back Button Bistro");

    const shareButton = screen.getByRole("button", { name: /share restaurant/i });
    await user.click(shareButton);

    await waitFor(() => {
      expect(screen.getByText("Share Restaurant")).toBeInTheDocument();
    });

    const closeButton = screen.getByRole("button", { name: /close modal/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("Share Restaurant")).not.toBeInTheDocument();
    });
  });
});
