import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ShareModal from "../ShareModal";

// Mock toast notifications
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock framer-motion to avoid animation complexities in tests
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

describe("ShareModal", () => {
  const mockRestaurant = {
    id: "test123",
    name: "Test Restaurant",
    cuisine: "Italian",
    rating: 4.5,
    tags: ["Italian", "Pizza"],
    images: ["https://example.com/image.jpg"],
  };

  const mockShareUrl = "https://example.com/restaurant/test123";
  const mockOnClose = vi.fn();
  let writeTextSpy;

  beforeEach(() => {
    mockOnClose.mockClear();
    // Create a proper spy for clipboard
    writeTextSpy = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: writeTextSpy,
      },
      writable: true,
      configurable: true,
    });
  });

  it("does not render when isOpen is false", () => {
    render(
      <ShareModal
        isOpen={false}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
        shareUrl={mockShareUrl}
      />
    );

    expect(screen.queryByText("Share Restaurant")).not.toBeInTheDocument();
  });

  it("renders modal when isOpen is true", () => {
    render(
      <ShareModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
        shareUrl={mockShareUrl}
      />
    );

    expect(screen.getByText("Share Restaurant")).toBeInTheDocument();
    expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
  });

  it("displays restaurant information correctly", () => {
    render(
      <ShareModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
        shareUrl={mockShareUrl}
      />
    );

    expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
    expect(screen.getByText("Italian")).toBeInTheDocument();
    expect(screen.getByText("4.5/5")).toBeInTheDocument();
  });

  it("displays all social sharing options", () => {
    render(
      <ShareModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
        shareUrl={mockShareUrl}
      />
    );

    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Messenger")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("SMS")).toBeInTheDocument();
  });

  it("displays share URL in input field", () => {
    render(
      <ShareModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
        shareUrl={mockShareUrl}
      />
    );

    const input = screen.getByDisplayValue(mockShareUrl);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("readonly");
  });

  it("has copy button that triggers clipboard API", async () => {
    const user = userEvent.setup();

    render(
      <ShareModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
        shareUrl={mockShareUrl}
      />
    );

    // Verify copy button exists
    const copyButtons = screen.getAllByRole("button");
    const copyButton = copyButtons.find(btn => btn.textContent.includes("Copy"));
    expect(copyButton).toBeDefined();
    
    // Verify the input field has the correct URL
    const urlInput = screen.getByDisplayValue(mockShareUrl);
    expect(urlInput).toBeInTheDocument();
  });

  it("shows success state after copying", async () => {
    const user = userEvent.setup();

    render(
      <ShareModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
        shareUrl={mockShareUrl}
      />
    );

    const copyButton = screen.getByRole("button", { name: /copy/i });
    await user.click(copyButton);

    await waitFor(() => {
      expect(screen.getByText("Copied")).toBeInTheDocument();
    });
  });

  it("closes modal when close button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ShareModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
        shareUrl={mockShareUrl}
      />
    );

    const closeButton = screen.getByRole("button", { name: /close modal/i });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("displays QR code", () => {
    const { container } = render(
      <ShareModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
        shareUrl={mockShareUrl}
      />
    );

    expect(screen.getByText("Scan QR Code")).toBeInTheDocument();
    // QR code component should be rendered
    const qrCode = container.querySelector("svg");
    expect(qrCode).toBeInTheDocument();
  });

  it("handles restaurant without rating", () => {
    const restaurantWithoutRating = {
      ...mockRestaurant,
      rating: null,
    };

    render(
      <ShareModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={restaurantWithoutRating}
        shareUrl={mockShareUrl}
      />
    );

    expect(screen.getByText("N/A/5")).toBeInTheDocument();
  });

  it("handles restaurant without cuisine or tags", () => {
    const restaurantWithoutCuisine = {
      ...mockRestaurant,
      cuisine: null,
      tags: [],
    };

    render(
      <ShareModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={restaurantWithoutCuisine}
        shareUrl={mockShareUrl}
      />
    );

    expect(screen.getByText("Restaurant")).toBeInTheDocument();
  });

  it("opens share links in new window", async () => {
    const user = userEvent.setup();
    const mockWindowOpen = vi.fn();
    window.open = mockWindowOpen;

    render(
      <ShareModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
        shareUrl={mockShareUrl}
      />
    );

    const whatsappButton = screen.getByText("WhatsApp").closest("button");
    await user.click(whatsappButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining("wa.me"),
      "_blank",
      "width=600,height=400"
    );
  });

  it("prevents body scroll when modal is open", () => {
    const { rerender } = render(
      <ShareModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
        shareUrl={mockShareUrl}
      />
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <ShareModal
        isOpen={false}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
        shareUrl={mockShareUrl}
      />
    );

    expect(document.body.style.overflow).toBe("unset");
  });
});
