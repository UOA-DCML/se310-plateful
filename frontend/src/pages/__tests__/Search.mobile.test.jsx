import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Search from "../Search";
import { ThemeProvider } from "../../context/ThemeContext"; // Adjust path if needed

// Helper to wrap component in ThemeProvider
const renderWithTheme = (ui) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

const mockNavigate = vi.fn();
const originalFetch = global.fetch;
const originalInnerWidth = window.innerWidth;

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../components/MapContainer", () => ({
  default: ({ children }) => (
    <div data-testid="map-for-mobile">
      {typeof children === "function" ? children({}) : null}
    </div>
  ),
}));

vi.mock("../../components/RestaurantMarkers", () => ({
  default: () => <div data-testid="markers-mock" />,
}));

vi.mock("../../components/Slider", () => ({
  default: ({ onApply }) => (
    <div data-testid="price-slider-mock">
      <button type="button" onClick={onApply}>
        Apply
      </button>
    </div>
  ),
}));

vi.mock("@tomtom-international/web-sdk-maps/dist/maps.css", () => ({}));

const setViewportWidth = (width) => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });
  window.dispatchEvent(new Event("resize"));
};

describe("Search page on mobile", () => {
  beforeEach(() => {
    setViewportWidth(375);
    mockNavigate.mockReset();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  afterAll(() => {
    setViewportWidth(originalInnerWidth);
  });

  it("renders fetched restaurants in a single column layout", async () => {
    const cuisinesFixture = ["Street Food", "BBQ"];
    const restaurantFixture = [
      { id: "mobile-1", name: "Pocket Eats", tags: ["Street Food"], priceLevel: 2 },
    ];

    global.fetch = vi.fn((url) => {
      if (url === "http://localhost:8080/api/restaurants/cuisines") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(cuisinesFixture) });
      }
      if (url === "http://localhost:8080/api/restaurants/filter?query=street") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(restaurantFixture) });
      }
      return Promise.reject(new Error(`Unhandled fetch: ${url}`));
    });

    renderWithTheme(
      <MemoryRouter initialEntries={["/search?query=street"]}>
        <Search />
      </MemoryRouter>
    );

    const cardTitle = await screen.findByText("Pocket Eats");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/restaurants/cuisines"
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/restaurants/filter?query=street"
    );

    const card = cardTitle.closest(".restaurant-card");
    expect(card).toHaveClass("flex");
    expect(card).toHaveClass("flex-row");

    const map = screen.getByTestId("map-for-mobile");
    expect(map).toBeInTheDocument();
    expect(card.compareDocumentPosition(map) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("shows the empty state copy when a mobile query has no matches", async () => {
    const cuisinesFixture = ["Seafood"];

    global.fetch = vi.fn((url) => {
      if (url === "http://localhost:8080/api/restaurants/cuisines") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(cuisinesFixture) });
      }
      if (url === "http://localhost:8080/api/restaurants/filter?query=noodles") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      return Promise.reject(new Error(`Unhandled fetch: ${url}`));
    });

    renderWithTheme(
      <MemoryRouter initialEntries={["/search?query=noodles"]}>
        <Search />
      </MemoryRouter>
    );

    const emptyStateCopy = await screen.findByText(
      "No restaurants found for your search."
    );
    expect(emptyStateCopy).toBeInTheDocument();
  });

  it("pushes the composed querystring when submitting a mobile search", async () => {
    const cuisinesFixture = ["Comfort Food"];

    global.fetch = vi.fn((url) => {
      if (url === "http://localhost:8080/api/restaurants/cuisines") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(cuisinesFixture) });
      }
      if (url.startsWith("http://localhost:8080/api/restaurants/filter")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      return Promise.reject(new Error(`Unhandled fetch: ${url}`));
    });

    const user = userEvent.setup();

    renderWithTheme(
      <MemoryRouter initialEntries={["/search"]}>
        <Search />
      </MemoryRouter>
    );

    const input = await screen.findByPlaceholderText("Search...");
    await user.clear(input);
    await user.type(input, "dumplings");
    await user.click(screen.getByRole("button", { name: /go/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/search?query=dumplings");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
