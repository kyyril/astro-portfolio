import { test, expect } from "@playwright/test";

test.describe("Scroll Behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for scroll optimizer to initialize
    await page.waitForTimeout(1000);
  });

  test("should have smooth scrolling enabled", async ({ page }) => {
    // Check if smooth scroll class is applied
    const bodyClass = await page.getAttribute("body", "class");
    expect(bodyClass).toContain("unified-smooth-scroll");
  });

  test("should track FPS correctly", async ({ page }) => {
    // Enable performance monitor
    const perfToggle = page.locator("#perf-toggle");
    await perfToggle.click();

    // Wait for FPS tracking to start
    await page.waitForTimeout(1000);

    // Check if FPS value is displayed
    const fpsValue = page.locator(".fps-value");
    await expect(fpsValue).toBeVisible();

    const fpsText = await fpsValue.textContent();
    expect(fpsText).toMatch(/^\d+$/); // Should be a number

    const fps = parseInt(fpsText || "0");
    expect(fps).toBeGreaterThan(0);
    expect(fps).toBeLessThanOrEqual(120);
  });

  test("should handle scroll events smoothly", async ({ page }) => {
    // Scroll down the page
    await page.mouse.wheel(0, 500);

    // Check if scrolling class is applied
    const bodyClass = await page.getAttribute("body", "class");
    expect(bodyClass).toContain("is-scrolling");

    // Wait for scroll to finish
    await page.waitForTimeout(200);

    // Check if scrolling class is removed
    const bodyClassAfter = await page.getAttribute("body", "class");
    expect(bodyClassAfter).not.toContain("is-scrolling");
  });

  test("should respond to keyboard navigation", async ({ page }) => {
    // Test arrow down key
    await page.keyboard.press("ArrowDown");

    // Check if page scrolled
    const scrollTop = await page.evaluate(() => window.pageYOffset);
    expect(scrollTop).toBeGreaterThan(0);

    // Test Home key
    await page.keyboard.press("Home");

    // Check if page scrolled to top
    const scrollTopAfter = await page.evaluate(() => window.pageYOffset);
    expect(scrollTopAfter).toBe(0);
  });

  test("should handle mobile touch scrolling", async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip("Mobile-only test");
    }

    // Simulate touch scroll
    await page.touchscreen.tap(200, 300);
    await page.mouse.wheel(0, 300);

    // Check if mobile class is applied
    const bodyClass = await page.getAttribute("body", "class");
    expect(bodyClass).toContain("mobile-device");
  });

  test("should respect reduced motion preferences", async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });

    // Reload page to apply preference
    await page.reload();
    await page.waitForTimeout(1000);

    // Check if reduced motion class is applied
    const bodyClass = await page.getAttribute("body", "class");
    expect(bodyClass).toContain("reduced-motion");
  });

  test("should cleanup properly on page navigation", async ({ page }) => {
    // Navigate to another page
    await page.click('a[href="/projects"]');
    await page.waitForLoadState("networkidle");

    // Navigate back
    await page.goBack();
    await page.waitForLoadState("networkidle");

    // Check if scroll optimizer is still working
    const bodyClass = await page.getAttribute("body", "class");
    expect(bodyClass).toContain("unified-smooth-scroll");
  });
});
