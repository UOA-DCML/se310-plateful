import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DirectionsButton from "../DirectionsButton";

describe("DirectionsButton", () => {
  const originalOpen = window.open;
  const originalGeo = navigator.geolocation;
  const originalAlert = window.alert;

  let mockOpen;
  let mockAlert;

  beforeEach(() => {
    // Mock window.open so we can assert the URL it opens
    mockOpen = vi.fn();
    window.open = mockOpen;

    // Mock alert so tests don't open native dialogs
    mockAlert = vi.fn();
    window.alert = mockAlert;

    // Provide a mock geolocation object by default (individual tests can delete/override)
    navigator.geolocation = {
      getCurrentPosition: vi.fn(),
    };
  });

  afterEach(() => {
    window.open = originalOpen;
    navigator.geolocation = originalGeo;
    window.alert = originalAlert;
  });

  it("renders the Get directions button", () => {
    render(<DirectionsButton destinationAddress="66-68 Tyler St, Auckland" />);
    expect(
      screen.getByRole("button", { name: /get directions/i })
    ).toBeInTheDocument();
  });

  it("opens Google Maps with only destination when geolocation not supported (and alerts)", async () => {
    const user = userEvent.setup();

    // Simulate browser without geolocation
    // Deleting in jsdom: use delete operator
    // eslint-disable-next-line no-delete-var
    delete navigator.geolocation;

    render(<DirectionsButton destinationAddress="66-68 Tyler St, Auckland" />);
    const button = screen.getByRole("button", { name: /get directions/i });

    await user.click(button);

    // alert should have been shown about geolocation not supported
    expect(mockAlert).toHaveBeenCalledWith(
      expect.stringContaining("Geolocation is not supported")
    );

    expect(mockOpen).toHaveBeenCalledTimes(1);
    const url = mockOpen.mock.calls[0][0];
    expect(url).toMatch(/^https:\/\/www\.google\.com\/maps\/dir\/\?api=1/);
    expect(url).toContain("destination=66-68%20Tyler%20St%2C%20Auckland");
    // no origin param
    expect(url).not.toContain("origin=");
  });

  it("uses current location when geolocation succeeds", async () => {
    const user = userEvent.setup();

    const mockPosition = {
      coords: { latitude: -36.8445, longitude: 174.768 },
    };

    // Call success callback with mock position
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
    // default travel mode is driving
    expect(url).toContain("travelmode=driving");
    // no alert in success path
    expect(mockAlert).not.toHaveBeenCalled();
  });

  it("shows an alert on permission denied and still opens destination without origin", async () => {
    const user = userEvent.setup();

    // Simulate geolocation failing with PERMISSION_DENIED (code 1)
    navigator.geolocation.getCurrentPosition.mockImplementationOnce(
      (_, errorCb) => errorCb({ code: 1 })
    );

    render(<DirectionsButton destinationAddress="Auckland" />);
    const button = screen.getByRole("button", { name: /get directions/i });

    await user.click(button);

    // alert about enabling location services should have been shown
    expect(mockAlert).toHaveBeenCalledWith(
      expect.stringContaining("Please enable location services")
    );

    expect(mockOpen).toHaveBeenCalledTimes(1);
    const url = mockOpen.mock.calls[0][0];
    expect(url).toContain("destination=Auckland");
    expect(url).not.toContain("origin=");
  });

  it("dropdown selection updates displayed mode and is used in the opened URL", async () => {
    const user = userEvent.setup();

    render(<DirectionsButton destinationAddress="66-68 Tyler St, Auckland" />);

    // Open the dropdown: use the aria-label on the blue button
    const modeButton = screen.getByRole("button", { name: /select travel mode/i });
    await user.click(modeButton);

    // The portal menu should render a 'Walking' option — click it
    const walkingOption = screen.getByRole("button", { name: /walking/i });
    await user.click(walkingOption);

    // After selecting, the blue button should show "Walking"
    const updatedModeButton = screen.getByRole("button", { name: /select travel mode/i });
    expect(updatedModeButton).toHaveTextContent(/walking/i);

    // Now simulate geolocation not available so it falls back and we can inspect URL easily
    // eslint-disable-next-line no-delete-var
    delete navigator.geolocation;

    const getDirectionsButton = screen.getByRole("button", { name: /get directions/i });
    await user.click(getDirectionsButton);

    expect(mockOpen).toHaveBeenCalledTimes(1);
    const url = mockOpen.mock.calls[0][0];

    // travelmode should reflect the selected option
    expect(url).toContain("travelmode=walking");
    expect(url).toContain("destination=66-68%20Tyler%20St%2C%20Auckland");
  });
});
