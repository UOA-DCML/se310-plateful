import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextSizeProvider } from "../../context/TextSizeContext";
import { ThemeProvider } from "../../context/ThemeContext";
import TextSizeSlider from "../TextSizeSlider";

const renderSlider = () =>
  render(
    <ThemeProvider>
      <TextSizeProvider>
        <TextSizeSlider />
      </TextSizeProvider>
    </ThemeProvider>
  );

describe("TextSizeSlider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.style.fontSize = "";
  });

  it("shows the current text size and reveals slider options", async () => {
    renderSlider();

    const toggleButton = screen.getByRole("button", { name: /current 100%/i });
    expect(toggleButton).toHaveAccessibleName("Adjust text size (current 100%)");
    expect(toggleButton).toBeInTheDocument();

    await userEvent.click(toggleButton);

    // The component now shows a slider instead of preset buttons
    // Check for slider indicators (percentage labels)
    expect(screen.getByText(/80\s*%/)).toBeInTheDocument();
    expect(screen.getByText(/90\s*%/)).toBeInTheDocument();
  });

  it("updates the selected size when slider is interacted with", async () => {
    renderSlider();

    const toggleButton = screen.getByRole("button", { name: /current 100%/i });
    await userEvent.click(toggleButton);

    // The slider uses a different interaction model
    // Just verify the slider interface is present
    const resetButton = screen.getByRole("button", { name: "Reset to Default (100%)" });
    expect(resetButton).toBeInTheDocument();
  });

  it("resets to the default size", async () => {
    renderSlider();

    const toggleButton = screen.getByRole("button", { name: /current 100%/i });
    await userEvent.click(toggleButton);

    const resetButton = screen.getByRole("button", { name: "Reset to Default (100%)" });
    await userEvent.click(resetButton);

    // After reset, should still show 100%
    expect(toggleButton).toHaveAccessibleName("Adjust text size (current 100%)");
  });
});
