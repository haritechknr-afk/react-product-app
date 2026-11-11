const CART_STORAGE_KEY = "react-product-app-cart";

export function addProductToCart(product) {
  let cart = [];
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (storedCart) {
    try {
      cart = JSON.parse(storedCart);
    } catch (error) {
      console.error("Could not read the saved cart:", error);
      throw new Error("Saved cart data is invalid.", { cause: error });
    }
  }

  if (!Array.isArray(cart)) {
    throw new TypeError("Saved cart data must be a list.");
  }

  const existingItem = cart.find((item) => item.product.id === product.id);

  const updatedCart = existingItem
    ? cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    : [...cart, { product, quantity: 1 }];

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  return updatedCart;
}
