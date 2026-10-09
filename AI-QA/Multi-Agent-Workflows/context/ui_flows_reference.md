# UI Flows Reference

Documented UI flows for the application under test (automationexercise.com). These
are the same flows automated in
[Automation-Project/Playwright](../../../Automation-Project/Playwright/tests/) — the
UI Flow Agent treats this file as its source of truth for page structure and flow
sequencing.

## Registration

1. Home page → click `text=Signup / Login`
2. "New User Signup!" panel appears → fill `[data-qa="signup-name"]`,
   `[data-qa="signup-email"]` → click `[data-qa="signup-button"]`
3. "Enter Account Information" form → gender radio (`#id_gender1`), password,
   date of birth selects, name/company/address fields, country select, state/city/
   zipcode/mobile → click `[data-qa="create-account"]`
4. Success: `text=Account Created!` → click `[data-qa="continue-button"]`

## Add to Cart

1. Click `[href="/products"]` to reach the product list
2. Hover + click `[data-product-id="N"].add-to-cart` for each product
3. Click `text=Continue Shopping` to dismiss the modal between adds
4. Click `text=View Cart`
5. Cart rows are addressed as `#product-N`, with `.cart_price`, `.cart_quantity`,
   `.cart_total_price` children

## Checkout

1. From the cart, click `.btn:has-text("Proceed To Checkout")`
2. Delivery/invoice address blocks: `#address_delivery`, `#address_invoice`

## Product Search

1. Click `[href="/products"]`
2. Fill `#search_product`, click `#submit_search`
3. Results render under `.col-sm-4 .productinfo p`; an empty/invalid search renders no
   `.col-sm-4 p` nodes at all

## Scroll / Homepage Slider

1. `window.scrollBy` to the bottom reveals the `text=Subscription` section and an
   `[type="email"]` field
2. `#scrollUp` returns to the top
3. `#slider-carousel` contains the homepage tagline text

## Conventions

- Prefer `[data-qa="..."]` / `[data-product-id="..."]` attribute selectors — they're
  stable across copy changes.
- Text selectors (`text=...`, `:text("...")`) are used only where no stable attribute
  exists, and are treated as more brittle.
