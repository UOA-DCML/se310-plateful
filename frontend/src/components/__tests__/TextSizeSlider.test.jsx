import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextSizeProvider } from "../../context/TextSizeContext";
import TextSizeSlider from "../TextSizeSlider";

const renderSlider = () =>
  render(
    <TextSizeProvider>
      <TextSizeSlider />
    </TextSizeProvider>
  );

describe("TextSizeSlider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.style.fontSize = "";
  });

  it("shows the current text size and reveals preset options", async () => {
    renderSlider();

    const toggleButton = screen.getByRole("button", { name: /current 100%/i });
    expect(toggleButton).toHaveAccessibleName("Adjust text size (current 100%)");
    expect(toggleButton).toBeInTheDocument();

    await userEvent.click(toggleButton);

    expect(
      screen.getByRole("button", {
        name: "115%",
      })
    ).toBeInTheDocument();
  });

  it("updates the selected size when a preset is clicked", async () => {
    renderSlider();

    const toggleButton = screen.getByRole("button", { name: /current 100%/i });
    await userEvent.click(toggleButton);

    const optionButton = screen.getByRole("button", { name: "125%" });
    await userEvent.click(optionButton);

    expect(toggleButton).toHaveAccessibleName("Adjust text size (current 125%)");
    expect(optionButton.className).toMatch(/border-lime-500/);
  });

  it("resets to the default size", async () => {
    renderSlider();

    const toggleButton = screen.getByRole("button", { name: /current 100%/i });
    await userEvent.click(toggleButton);
    await userEvent.click(screen.getByRole("button", { name: "135%" }));

    expect(toggleButton).toHaveAccessibleName("Adjust text size (current 135%)");

    const resetButton = screen.getByRole("button", { name: /default 100%/i });
    await userEvent.click(resetButton);

    expect(toggleButton).toHaveAccessibleName("Adjust text size (current 100%)");
  });
});
