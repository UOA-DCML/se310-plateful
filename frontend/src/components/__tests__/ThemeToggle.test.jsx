import React from "react";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "../../context/ThemeContext";
import ThemeToggle from "../ThemeToggle";

const STORAGE_KEY = "plateful:theme";

/**
 * Minimal matchMedia mock that lets tests simulate system preference changes.
 * Exposes an object with an internal _fire(matches) method to simulate preference flips.
 *
 * NOTE: this mock returns the same mq instance for each call to window.matchMedia()
 * so listeners registered by the ThemeProvider will be fired via mq._fire(...)
 */
function installMatchMediaMock(initialMatches = false) {
  const listeners = new Set();
  const mq = {
    matches: initialMatches,
    media: "(prefers-color-scheme: dark)",
    addEventListener: (evt, cb) => {
      if (evt === "change") listeners.add(cb);
    },
    removeEventListener: (evt, cb) => {
      if (evt === "change") listeners.delete(cb);
    },
    addListener: (cb) => listeners.add(cb),
    removeListener: (cb) => listeners.delete(cb),
    _fire(newMatches) {
      this.matches = newMatches;
      const ev = { matches: newMatches, media: this.media };
      listeners.forEach((cb) => {
        try {
          cb(ev);
        } catch (e) {
            console.error("Error in matchMedia listener:", e);
        }
      });
    },
  };

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: () => mq,
  });

  return mq;
}

beforeEach(() => {
  // start from clean slate for every test
  window.localStorage.clear();
  document.documentElement.classList.remove("dark");
  installMatchMediaMock(false); // default system = light
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.classList.remove("dark");
});

test("Toggling the ThemeToggle button adds/removes html.dark and updates localStorage + aria-pressed", async () => {
  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );

  const button = screen.getByRole("button");

  // ThemeProvider writes initial theme ("system") into localStorage on mount
  expect(document.documentElement.classList.contains("dark")).toBe(false);
  expect(window.localStorage.getItem(STORAGE_KEY)).toBe("system");

  // Click to toggle -> should set dark
  fireEvent.click(button);

  // wait for side effects (class + localStorage) to settle
  await waitFor(() => {
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("dark");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  // Click again -> should go to light
  fireEvent.click(button);

  await waitFor(() => {
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("light");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });
});

test("When theme is 'system', ThemeProvider responds to prefers-color-scheme changes", async () => {
  // capture the mq instance so we can fire events
  const mq = installMatchMediaMock(false); // starts light

  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );

  // Try to set the provider to 'system' via any UI select if present.
  // If the toggle exposes a <select> (combobox role), use it. Otherwise fallback to rewriting localStorage and remounting.
  const select = screen.queryByRole("combobox");
  if (select) {
    fireEvent.change(select, { target: { value: "system" } });
  } else {
    // fallback approach: persist 'system' then remount provider so it picks up the mode and attaches listener
    window.localStorage.setItem(STORAGE_KEY, "system");
    cleanup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
  }

  // initially mq.matches is false -> no dark applied
  expect(mq.matches).toBe(false);
  expect(document.documentElement.classList.contains("dark")).toBe(false);

  // simulate system switching to dark
  mq._fire(true);

  // wait for provider to react and add class
  await waitFor(() => {
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  // simulate system switching back to light
  mq._fire(false);

  await waitFor(() => {
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
