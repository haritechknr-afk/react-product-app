const CART_STORAGE_KEY = "react-product-app-cart";

export function getProductStock(product) {
  const stockFields = Object.entries(product ?? {})
    .filter(([key]) => /(stock|quantity)/i.test(key))
    .sort(([keyA], [keyB]) => {
      const stockA = /stock/i.test(keyA);
      const stockB = /stock/i.test(keyB);
      return Number(stockB) - Number(stockA);
    });

  for (const [, value] of stockFields) {
    if (value == null || value === "") {
      continue;
    }

    const stock = Number(value);
    if (Number.isFinite(stock) && stock >= 0) {
      return Math.floor(stock);
    }
  }

  return Infinity;
}

function readCart() {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (!storedCart) {
    return [];
  }

  let cart;
  try {
    cart = JSON.parse(storedCart);
  } catch (error) {
    console.error("Could not read the saved cart:", error);
    throw new Error("Saved cart data is invalid.", { cause: error });
  }

  if (!Array.isArray(cart)) {
    throw new TypeError("Saved cart data must be a list.");
  }

  if (
    cart.some(
      (item) =>
        !item?.product ||
        item.product.id == null ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1,
    )
  ) {
    throw new TypeError("Saved cart contains an invalid item.");
  }

  return cart;
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  return cart;
}

export function getCart() {
  return readCart();
}

export function addProductToCart(product) {
  if (!product || product.id == null) {
    throw new TypeError("A valid product is required.");
  }

  const cart = readCart();
  const existingItem = cart.find((item) => item.product.id === product.id);
  const stock = getProductStock(product);
  const currentQuantity = existingItem?.quantity ?? 0;

  if (currentQuantity >= stock) {
    throw new Error(
      stock === 0
        ? "This product is out of stock."
        : `Only ${stock} units are available.`,
    );
  }

  const updatedCart = existingItem
    ? cart.map((item) =>
        item.product.id === product.id
          ? { ...item, product, quantity: item.quantity + 1 }
          : item,
      )
    : [...cart, { product, quantity: 1 }];

  return saveCart(updatedCart);
}

export function updateCartItemQuantity(productId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new TypeError("Cart quantity must be a positive whole number.");
  }

  const cart = readCart();
  const existingItem = cart.find((item) => item.product.id === productId);
  if (!existingItem) {
    throw new Error("The product is not in your cart.");
  }

  const stock = getProductStock(existingItem.product);
  if (quantity > stock) {
    throw new Error(`Only ${stock} units are available.`);
  }

  return saveCart(
    cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item,
    ),
  );
}

export function removeProductFromCart(productId) {
  const cart = readCart();
  return saveCart(cart.filter((item) => item.product.id !== productId));
}

export function clearCart() {
  return saveCart([]);
}
