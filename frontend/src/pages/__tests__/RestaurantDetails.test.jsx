import { render, screen } from "@testing-library/react";
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
