import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ShareButton from "../ShareButton";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui) => render(<ThemeProvider>{ui}</ThemeProvider>);

describe("ShareButton", () => {
  it("renders share button with icon and text", () => {
    renderWithTheme(<ShareButton onClick={() => { }} />);

    expect(screen.getByRole("button", { name: /share restaurant/i })).toBeInTheDocument();
    expect(screen.getByText("Share")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    renderWithTheme(<ShareButton onClick={handleClick} />);

    const button = screen.getByRole("button", { name: /share restaurant/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className when provided", () => {
    const { container } = renderWithTheme(
      <ShareButton onClick={() => { }} className="custom-class" />
    );

    const button = container.querySelector("button");
    expect(button).toHaveClass("custom-class");
  });

  it("maintains hover state styling", async () => {
    const user = userEvent.setup();
    const { container } = renderWithTheme(<ShareButton onClick={() => { }} />);

    const button = container.querySelector("button");
    expect(button).toHaveClass("hover:bg-gray-50");
    expect(button).toHaveClass("hover:shadow-md");
  });
});
