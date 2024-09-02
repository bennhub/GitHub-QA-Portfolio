//--------------------------------
// Arrange:
//--------------------------------
import { test, expect } from "@playwright/test";
test("Validate Adding Products to Cart", async ({ page, context }) => {
  await context.setDefaultNavigationTimeout(60000); // optional: set a longer navigation timeout
  await page.goto("https://automationexercise.com", {
    waitUntil: "domcontentloaded", // ensure the DOM is fully loaded
    ignoreHTTPSErrors: true, // Ignore HTTPS errors (if needed)
  });

  // Verify that home page is visible successfully
  await expect(page).toHaveTitle(/Automation Exercise/);

  //--------------------------------
  // Act:
  //--------------------------------

  // scroll to bottom of page
  await page.evaluate(() => {
    window.scrollBy(0, document.documentElement.scrollHeight);
  });

  //--------------------------------
  // Assert:
  //--------------------------------

  // verify subscription is visible
  await expect(page.locator(`:text("Subscription")`)).toBeVisible();
  await expect(page.locator(`[type="email"]`)).toBeVisible();

  // close ad
  await page.locator(`.grippy-host`).click();

  // scroll up on page
  await page.locator(`#scrollUp`).click();

  // verify text on slider
  const sliderText = await page.innerText("#slider-carousel");
  expect(sliderText).toContain(
    "Full-Fledged practice website for Automation Engineers"
  );
});
