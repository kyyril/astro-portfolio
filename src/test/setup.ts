import { beforeEach, afterEach, vi } from "vitest";

// Mock global objects that might not be available in test environment
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock PerformanceObserver
global.PerformanceObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = vi
  .fn()
  .mockImplementation((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = vi
  .fn()
  .mockImplementation((id) => clearTimeout(id));

// Mock performance API
Object.defineProperty(global, "performance", {
  writable: true,
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => []),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000,
    },
  },
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock sessionStorage
Object.defineProperty(window, "sessionStorage", {
  value: localStorageMock,
});

// Mock CSS custom properties
Object.defineProperty(document.documentElement.style, "setProperty", {
  value: vi.fn(),
  writable: true,
  configurable: true,
});

Object.defineProperty(document.documentElement.style, "getPropertyValue", {
  value: vi.fn(() => ""),
  writable: true,
  configurable: true,
});

// Enable fake timers by default
vi.useFakeTimers();

// Clean up after each test
afterEach(() => {
  document.body.innerHTML = "";
  document.head.innerHTML = "";
  vi.clearAllMocks();
});

// Setup before each test
beforeEach(() => {
  // Reset DOM
  document.body.className = "";
  document.documentElement.className = "";

  // Reset mocked functions
  vi.clearAllTimers();
});
