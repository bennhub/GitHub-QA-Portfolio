# Automation Demo


## Playwright Demo Overview

This folder contains a series of automated tests designed to validate key functionalities of a sample e-commerce website, automation.com. The tests focus on various user actions, such as account registration, adding products to the cart, and API interactions. Each test follows the Arrange, Act, Assert pattern to ensure clarity and maintainability.

## Project Structure

- **Tests:**  
  The project includes six Playwright tests that automate the following scenarios:
  1. **Account Registration:**  
     Verifies that a new user can successfully register on automation.com.
  2. **Login:**  
     Ensures that registered users can log in with valid credentials.
  3. **Add Products to Cart:**  
     Tests the ability to search for products and add them to the shopping cart.
  4. **Checkout:**  
     Simulates the checkout process, verifying that users can complete a purchase.
  5. **Order History:**  
     Confirms that users can view their past orders after logging in.
  6. **API Test:**  
     Tests the API endpoint responsible for retrieving product details.

- **Scripts:**  
  All Playwright scripts are located in the `tests` folder. Each script is structured to ensure readability and maintainability using the Arrange, Act, Assert pattern.

## How to Use

1. **Setup:**
   - Ensure you have Node.js and npm installed on your machine.
   - Install the required dependencies by running:
     ```bash
     npm install playwright
     ```

2. **Running Tests:**
   - To execute all tests, use the following command:
     ```bash
     npx playwright test
     ```
   - To run a specific test, you can specify the test file:
     ```bash
     npx playwright test tests/<test-file-name>.spec.js
     ```

3. **Reviewing Test Results:**
   - Playwright generates detailed reports after each test run. You can view the test results by opening the HTML report:
     ```bash
     npx playwright show-report
     ```

4. **API Testing:**
   - The API test validates the response from the product details endpoint. This test ensures the API returns the expected product information in the correct format.

## Conclusion

This automation project demonstrates proficiency in using Playwright for both UI and API testing. The tests cover essential e-commerce functionalities, ensuring that the user experience is smooth and reliable. By following the Arrange, Act, Assert pattern, the tests are not only effective but also easy to understand and maintain.

