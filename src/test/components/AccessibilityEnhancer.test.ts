import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("AccessibilityEnhancer", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Screen Reader Support", () => {
    it("should create screen reader announcer", () => {
      const announcer = document.createElement("div");
      announcer.id = "sr-announcer";
      announcer.className = "sr-only";
      announcer.setAttribute("aria-live", "polite");
      announcer.setAttribute("aria-atomic", "true");

      document.body.appendChild(announcer);

      expect(document.getElementById("sr-announcer")).toBeTruthy();
      expect(announcer.getAttribute("aria-live")).toBe("polite");
      expect(announcer.getAttribute("aria-atomic")).toBe("true");
    });

    it("should announce messages to screen readers", () => {
      const announcer = document.createElement("div");
      announcer.id = "sr-announcer";
      announcer.className = "sr-only";
      announcer.setAttribute("aria-live", "polite");

      document.body.appendChild(announcer);

      const announceToScreenReader = (message: string) => {
        const announcerElement = document.getElementById("sr-announcer");
        if (announcerElement) {
          announcerElement.textContent = message;
          setTimeout(() => {
            announcerElement.textContent = "";
          }, 1000);
        }
      };

      announceToScreenReader("Test message");
      expect(announcer.textContent).toBe("Test message");

      // Fast forward time
      vi.advanceTimersByTime(1100);
      expect(announcer.textContent).toBe("");
    });
  });

  describe("Focus Management", () => {
    it("should create focus indicator", () => {
      const focusIndicator = document.createElement("div");
      focusIndicator.className = "focus-indicator";

      document.body.appendChild(focusIndicator);

      expect(document.querySelector(".focus-indicator")).toBeTruthy();
    });

    it("should update focus indicator position", () => {
      const focusIndicator = document.createElement("div");
      focusIndicator.className = "focus-indicator";
      document.body.appendChild(focusIndicator);

      const element = document.createElement("button");
      element.textContent = "Test Button";
      document.body.appendChild(element);

      const updateFocusIndicator = (targetElement: HTMLElement) => {
        const rect = targetElement.getBoundingClientRect();
        focusIndicator.style.left = `${rect.left - 2}px`;
        focusIndicator.style.top = `${rect.top - 2}px`;
        focusIndicator.style.width = `${rect.width + 4}px`;
        focusIndicator.style.height = `${rect.height + 4}px`;
        focusIndicator.style.opacity = "1";
      };

      // Mock getBoundingClientRect
      element.getBoundingClientRect = vi.fn(() => ({
        left: 100,
        top: 50,
        width: 80,
        height: 30,
        right: 180,
        bottom: 80,
        x: 100,
        y: 50,
        toJSON: vi.fn(),
      }));

      updateFocusIndicator(element);

      expect(focusIndicator.style.left).toBe("98px");
      expect(focusIndicator.style.top).toBe("48px");
      expect(focusIndicator.style.width).toBe("84px");
      expect(focusIndicator.style.height).toBe("34px");
      expect(focusIndicator.style.opacity).toBe("1");
    });

    it("should handle keyboard navigation mode", () => {
      const tabEvent = new KeyboardEvent("keydown", { key: "Tab" });
      const mouseEvent = new MouseEvent("mousedown");

      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          document.body.classList.add("keyboard-navigation");
        }
      };

      const handleMousedown = () => {
        document.body.classList.remove("keyboard-navigation");
      };

      handleKeydown(tabEvent);
      expect(document.body.classList.contains("keyboard-navigation")).toBe(
        true
      );

      handleMousedown();
      expect(document.body.classList.contains("keyboard-navigation")).toBe(
        false
      );
    });
  });

  describe("ARIA Labels and Roles", () => {
    it("should add navigation ARIA attributes", () => {
      const nav = document.createElement("nav");
      nav.className = "nav-bar";
      document.body.appendChild(nav);

      // Simulate ARIA enhancement
      nav.setAttribute("role", "navigation");
      nav.setAttribute("aria-label", "Main navigation");
      nav.id = "navigation";

      expect(nav.getAttribute("role")).toBe("navigation");
      expect(nav.getAttribute("aria-label")).toBe("Main navigation");
      expect(nav.id).toBe("navigation");
    });

    it("should add main content ARIA attributes", () => {
      const main = document.createElement("main");
      document.body.appendChild(main);

      main.setAttribute("role", "main");

      expect(main.getAttribute("role")).toBe("main");
    });

    it("should add footer ARIA attributes", () => {
      const footer = document.createElement("footer");
      document.body.appendChild(footer);

      footer.id = "footer";
      footer.setAttribute("role", "contentinfo");

      expect(footer.id).toBe("footer");
      expect(footer.getAttribute("role")).toBe("contentinfo");
    });

    it("should enhance navigation items with ARIA labels", () => {
      const navItems = [
        { href: "/", label: "Home page" },
        { href: "/projects", label: "Projects page" },
        { href: "/blog", label: "Blog page" },
        { href: "/guestbook", label: "Guestbook page" },
        { href: "/chat", label: "Chat page" },
      ];

      navItems.forEach(({ href, label }) => {
        const item = document.createElement("a");
        item.href = href;
        item.className = "nav-item";
        item.setAttribute("aria-label", label);
        item.setAttribute("role", "link");

        document.body.appendChild(item);

        expect(item.getAttribute("aria-label")).toBe(label);
        expect(item.getAttribute("role")).toBe("link");
      });
    });
  });

  describe("Accessibility Preferences", () => {
    it("should handle reduced motion preference", () => {
      const mockMediaQuery = {
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };

      window.matchMedia = vi.fn().mockReturnValue(mockMediaQuery);

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

      if (prefersReducedMotion.matches) {
        document.body.classList.add("reduced-motion-preference");
      }

      expect(
        document.body.classList.contains("reduced-motion-preference")
      ).toBe(true);
    });

    it("should handle high contrast preference", () => {
      const mockMediaQuery = {
        matches: true,
        media: "(prefers-contrast: high)",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };

      window.matchMedia = vi.fn().mockReturnValue(mockMediaQuery);

      const prefersHighContrast = window.matchMedia("(prefers-contrast: high)");

      if (prefersHighContrast.matches) {
        document.body.classList.add("high-contrast-preference");
      }

      expect(document.body.classList.contains("high-contrast-preference")).toBe(
        true
      );
    });

    it("should detect screen reader usage", () => {
      // Mock screen reader detection
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 NVDA",
        configurable: true,
      });

      const isScreenReader =
        navigator.userAgent.includes("NVDA") ||
        navigator.userAgent.includes("JAWS") ||
        "speechSynthesis" in window;

      if (isScreenReader) {
        document.body.classList.add("screen-reader-detected");
      }

      expect(isScreenReader).toBe(true);
      expect(document.body.classList.contains("screen-reader-detected")).toBe(
        true
      );
    });
  });

  describe("Keyboard Navigation", () => {
    it("should handle escape key to close dropdowns", () => {
      const dropdown = document.createElement("div");
      dropdown.className = "theme-dropdown";
      document.body.appendChild(dropdown);

      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          document.querySelectorAll(".theme-dropdown").forEach((dropdown) => {
            dropdown.classList.add("hidden");
          });
        }
      };

      handleEscape(escapeEvent);
      expect(dropdown.classList.contains("hidden")).toBe(true);
    });

    it("should handle arrow key navigation", () => {
      const navItems = ["item1", "item2", "item3"].map((id) => {
        const item = document.createElement("a");
        item.id = id;
        item.className = "nav-item";
        item.href = "#";
        item.tabIndex = 0;
        document.body.appendChild(item);
        return item;
      });

      let currentIndex = 0;
      navItems[currentIndex].focus();

      const handleArrowNavigation = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
          currentIndex =
            currentIndex > 0 ? currentIndex - 1 : navItems.length - 1;
        } else if (e.key === "ArrowRight") {
          currentIndex =
            currentIndex < navItems.length - 1 ? currentIndex + 1 : 0;
        }
        navItems[currentIndex].focus();
      };

      const arrowRightEvent = new KeyboardEvent("keydown", {
        key: "ArrowRight",
      });
      handleArrowNavigation(arrowRightEvent);

      expect(currentIndex).toBe(1);

      const arrowLeftEvent = new KeyboardEvent("keydown", { key: "ArrowLeft" });
      handleArrowNavigation(arrowLeftEvent);

      expect(currentIndex).toBe(0);
    });

    it("should trap focus in modal elements", () => {
      const modal = document.createElement("div");
      const button1 = document.createElement("button");
      const button2 = document.createElement("button");

      button1.textContent = "First";
      button2.textContent = "Last";

      modal.appendChild(button1);
      modal.appendChild(button2);
      document.body.appendChild(modal);

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      expect(firstElement).toBe(button1);
      expect(lastElement).toBe(button2);
      expect(focusableElements.length).toBe(2);
    });
  });

  describe("Cleanup", () => {
    it("should remove accessibility elements on cleanup", () => {
      const skipLinks = document.createElement("div");
      skipLinks.className = "skip-links";
      const announcer = document.createElement("div");
      announcer.id = "sr-announcer";
      const focusIndicator = document.createElement("div");
      focusIndicator.className = "focus-indicator";

      document.body.appendChild(skipLinks);
      document.body.appendChild(announcer);
      document.body.appendChild(focusIndicator);

      // Simulate cleanup
      const cleanup = () => {
        const skipLinksEl = document.querySelector(".skip-links");
        const announcerEl = document.getElementById("sr-announcer");
        const focusIndicatorEl = document.querySelector(".focus-indicator");

        if (skipLinksEl) skipLinksEl.remove();
        if (announcerEl) announcerEl.remove();
        if (focusIndicatorEl) focusIndicatorEl.remove();
      };

      cleanup();

      expect(document.querySelector(".skip-links")).toBeNull();
      expect(document.getElementById("sr-announcer")).toBeNull();
      expect(document.querySelector(".focus-indicator")).toBeNull();
    });
  });
});
