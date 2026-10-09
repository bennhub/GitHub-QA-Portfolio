import { test, expect } from "../fixtures/pages.fixture.js";

test("Scroll down and back up, verify slider content", async ({
  page,
  homePage,
}) => {
  //--------------------------------
  // Arrange:
  //--------------------------------
  await homePage.goto();
  await expect(page).toHaveTitle(/Automation Exercise/);

  //--------------------------------
  // Act:
  //--------------------------------
  await homePage.scrollToBottom();

  //--------------------------------
  // Assert:
  //--------------------------------
  await expect(homePage.subscriptionHeading).toBeVisible();
  await expect(homePage.subscriptionEmailInput).toBeVisible();

  await homePage.scrollToTop();

  const sliderText = await homePage.getSliderText();
  expect(sliderText).toContain(
    "Full-Fledged practice website for Automation Engineers",
  );
});
