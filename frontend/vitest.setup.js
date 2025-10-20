import "@testing-library/jest-dom/vitest";

// Mock window.URL.createObjectURL for maplibre-gl
if (typeof window !== 'undefined' && !window.URL.createObjectURL) {
  window.URL.createObjectURL = () => 'mock-url';
  window.URL.revokeObjectURL = () => {};
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};
