// Static product catalog data used by the cart/checkout specs. The IDs and
// prices are fixed properties of the demo site under test, not generated,
// so they're plain data rather than a factory.

export const PRODUCTS = {
  blueTop: {
    id: "1",
    name: "Blue Top",
    category: "Women > Tops",
    price: "Rs. 500",
  },
  menTshirt: {
    id: "2",
    name: "Men Tshirt",
    category: "Men > Tshirts",
    price: "Rs. 400",
  },
};

export const SEARCH_TERMS = {
  valid: "Dress",
  invalid: "XPXPXPXPXX",
};
