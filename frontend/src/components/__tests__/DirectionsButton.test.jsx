import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DirectionsButton from "../DirectionsButton";

describe("DirectionsButton", () => {
  const originalOpen = window.open;
  const mockOpen = vi.fn();
  const originalGeo = navigator.geolocation;

  beforeEach(() => {
    // Mock window.open so we can assert the URL it opens
    window.open = mockOpen;
    mockOpen.mockClear();

    // Provide a mock geolocation object
    navigator.geolocation = {
      getCurrentPosition: vi.fn(),
    };
  });

  afterEach(() => {
    window.open = originalOpen;
    navigator.geolocation = originalGeo;
  });

  it("renders the button text", () => {
    render(<DirectionsButton destinationAddress="66-68 Tyler St, Auckland" />);
    expect(screen.getByRole("button", { name: /get directions/i })).toBeInTheDocument();
  });

  it("opens Google Maps with only destination when geolocation not supported", async () => {
    const user = userEvent.setup();
    // Remove geolocation entirely
    delete navigator.geolocation;

    render(<DirectionsButton destinationAddress="66-68 Tyler St, Auckland" />);
    const button = screen.getByRole("button", { name: /get directions/i });

    await user.click(button);

    expect(mockOpen).toHaveBeenCalledTimes(1);
    const url = mockOpen.mock.calls[0][0];
    expect(url).toMatch(/^https:\/\/www\.google\.com\/maps\/dir\/\?api=1/);
    expect(url).toContain("destination=66-68%20Tyler%20St%2C%20Auckland");
  });

  it("uses current location when geolocation succeeds", async () => {
    const user = userEvent.setup();

    const mockPosition = {
      coords: { latitude: -36.8445, longitude: 174.768 },
    };

    navigator.geolocation.getCurrentPosition.mockImplementationOnce((success) =>
      success(mockPosition)
    );

    render(<DirectionsButton destinationAddress="66-68 Tyler St, Auckland" />);
    const button = screen.getByRole("button", { name: /get directions/i });

    await user.click(button);

    expect(mockOpen).toHaveBeenCalledTimes(1);
    const url = mockOpen.mock.calls[0][0];
    expect(url).toContain("origin=-36.8445,174.768");
    expect(url).toContain("destination=66-68%20Tyler%20St%2C%20Auckland");
  });

  it("still opens destination when geolocation fails", async () => {
    const user = userEvent.setup();

    navigator.geolocation.getCurrentPosition.mockImplementationOnce((_, error) =>
      error(new Error("Permission denied"))
    );

    render(<DirectionsButton destinationAddress="Auckland" />);
    const button = screen.getByRole("button", { name: /get directions/i });

    await user.click(button);

    expect(mockOpen).toHaveBeenCalledTimes(1);
    const url = mockOpen.mock.calls[0][0];
    expect(url).toContain("destination=Auckland");
    expect(url).not.toContain("origin=");
  });
});
