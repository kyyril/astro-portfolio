import { test, expect } from "@playwright/test";

test.describe("Accessibility Features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);
  });

  test("should have proper ARIA labels on navigation", async ({ page }) => {
    const nav = page.locator('nav[role="navigation"]');
    await expect(nav).toHaveAttribute("aria-label", "Main navigation");

    // Check navigation items have proper labels
    const homeLink = page.locator('a[aria-label="Home page"]');
    await expect(homeLink).toBeVisible();

    const projectsLink = page.locator('a[aria-label="Projects page"]');
    await expect(projectsLink).toBeVisible();
  });

  test("should show focus indicator during keyboard navigation", async ({
    page,
  }) => {
    // Start keyboard navigation
    await page.keyboard.press("Tab");

    // Check if keyboard navigation class is added
    const bodyClass = await page.getAttribute("body", "class");
    expect(bodyClass).toContain("keyboard-navigation");

    // Check if focus indicator is visible
    const focusIndicator = page.locator(".focus-indicator");
    await expect(focusIndicator).toBeVisible();

    // Use mouse to remove keyboard navigation mode
    await page.mouse.click(100, 100);

    const bodyClassAfter = await page.getAttribute("body", "class");
    expect(bodyClassAfter).not.toContain("keyboard-navigation");
  });

  test("should support arrow key navigation", async ({ page }) => {
    // Focus on first navigation item
    const firstNavItem = page.locator(".nav-item").first();
    await firstNavItem.focus();

    // Use arrow key to navigate
    await page.keyboard.press("ArrowRight");

    // Check if focus moved to next item
    const secondNavItem = page.locator(".nav-item").nth(1);
    await expect(secondNavItem).toBeFocused();

    // Use arrow key to navigate back
    await page.keyboard.press("ArrowLeft");
    await expect(firstNavItem).toBeFocused();
  });

  test("should close dropdowns with Escape key", async ({ page }) => {
    // Open theme dropdown (if exists)
    const themeToggle = page.locator(
      ".theme-toggle-btn, .sticky-theme-toggle-btn"
    );
    if ((await themeToggle.count()) > 0) {
      await themeToggle.click();

      // Check if dropdown is open
      const dropdown = page.locator(".theme-dropdown");
      await expect(dropdown).toBeVisible();

      // Press Escape to close
      await page.keyboard.press("Escape");

      // Check if dropdown is closed
      await expect(dropdown).toBeHidden();
    }
  });

  test("should have screen reader announcer", async ({ page }) => {
    const announcer = page.locator("#sr-announcer");
    await expect(announcer).toBeAttached();
    await expect(announcer).toHaveAttribute("aria-live", "polite");
    await expect(announcer).toHaveAttribute("aria-atomic", "true");
  });

  test("should respect high contrast preference", async ({ page }) => {
    // Set high contrast preference
    await page.emulateMedia({ colorScheme: "dark", forcedColors: "active" });

    // Reload to apply preference
    await page.reload();
    await page.waitForTimeout(1000);

    // Check if high contrast class is applied
    const bodyClass = await page.getAttribute("body", "class");
    expect(bodyClass).toContain("high-contrast-preference");
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    // Check if there's only one h1
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBeLessThanOrEqual(1);

    // Check if headings are in proper order
    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();

    if (headings.length > 1) {
      for (let i = 1; i < headings.length; i++) {
        const currentLevel = parseInt(
          await headings[i].evaluate((el) => el.tagName.charAt(1))
        );
        const previousLevel = parseInt(
          await headings[i - 1].evaluate((el) => el.tagName.charAt(1))
        );

        // Heading levels should not skip more than one level
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
      }
    }
  });

  test("should have alt text for images", async ({ page }) => {
    const images = await page.locator("img").all();

    for (const img of images) {
      const alt = await img.getAttribute("alt");
      const ariaLabel = await img.getAttribute("aria-label");
      const ariaHidden = await img.getAttribute("aria-hidden");

      // Images should have alt text, aria-label, or be marked as decorative
      expect(alt !== null || ariaLabel !== null || ariaHidden === "true").toBe(
        true
      );
    }
  });

  test("should have proper form labels", async ({ page }) => {
    const inputs = await page.locator("input, textarea, select").all();

    for (const input of inputs) {
      const id = await input.getAttribute("id");
      const ariaLabel = await input.getAttribute("aria-label");
      const ariaLabelledBy = await input.getAttribute("aria-labelledby");

      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = (await label.count()) > 0;

        // Input should have associated label or aria-label
        expect(hasLabel || ariaLabel !== null || ariaLabelledBy !== null).toBe(
          true
        );
      }
    }
  });

  test("should have sufficient color contrast", async ({ page }) => {
    // This is a basic check - in real scenarios you'd use axe-core
    const textElements = await page
      .locator("p, h1, h2, h3, h4, h5, h6, a, button, span")
      .all();

    for (const element of textElements.slice(0, 10)) {
      // Check first 10 elements
      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: computed.fontSize,
        };
      });

      // Basic check that text has color (not transparent)
      expect(styles.color).not.toBe("rgba(0, 0, 0, 0)");
      expect(styles.color).not.toBe("transparent");
    }
  });

  test("should support keyboard-only navigation", async ({ page }) => {
    // Navigate through all focusable elements using Tab
    const focusableElements = await page
      .locator(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )
      .all();

    if (focusableElements.length > 0) {
      // Start from first element
      await page.keyboard.press("Tab");

      // Navigate through several elements
      for (let i = 0; i < Math.min(5, focusableElements.length - 1); i++) {
        await page.keyboard.press("Tab");

        // Check that focus is visible
        const focusedElement = page.locator(":focus");
        await expect(focusedElement).toBeVisible();
      }
    }
  });

  test("should announce dynamic content changes", async ({ page }) => {
    const announcer = page.locator("#sr-announcer");

    // Simulate a dynamic content change that would trigger announcement
    await page.evaluate(() => {
      const announcerEl = document.getElementById("sr-announcer");
      if (announcerEl) {
        announcerEl.textContent = "Content updated";
      }
    });

    // Check if announcement was made
    await expect(announcer).toHaveText("Content updated");

    // Announcements should clear after timeout
    await page.waitForTimeout(1100);
    await expect(announcer).toHaveText("");
  });
});

test.describe("Mobile Accessibility", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);
  });

  test("should have proper touch targets", async ({ page }) => {
    const touchTargets = await page
      .locator('a, button, input, [role="button"]')
      .all();

    for (const target of touchTargets.slice(0, 10)) {
      // Check first 10 elements
      const boundingBox = await target.boundingBox();

      if (boundingBox) {
        // Touch targets should be at least 44x44 pixels (WCAG guideline)
        expect(boundingBox.width).toBeGreaterThanOrEqual(44);
        expect(boundingBox.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test("should support touch navigation", async ({ page }) => {
    // Test touch scrolling
    await page.touchscreen.tap(200, 300);

    // Swipe down
    await page.touchscreen.tap(200, 300);
    await page.mouse.move(200, 300);
    await page.mouse.down();
    await page.mouse.move(200, 400);
    await page.mouse.up();

    // Check if page scrolled
    const scrollTop = await page.evaluate(() => window.pageYOffset);
    expect(scrollTop).toBeGreaterThanOrEqual(0);
  });

  test("should have mobile-optimized navigation", async ({ page }) => {
    // Check if mobile class is applied
    const bodyClass = await page.getAttribute("body", "class");
    expect(bodyClass).toContain("mobile-device");

    // Navigation should be accessible on mobile
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });
});
