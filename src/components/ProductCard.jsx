import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useProductImage from "../hooks/useProductImage";
import {
  addProductToCart,
  getCart,
  getProductStock,
  removeProductFromCart,
  updateCartItemQuantity,
} from "../services/cartService";
import ProductImage from "./ProductImage";
import ProductAddedToast from "./ProductAddedToast";

function ProductCard({ product }) {
  const { status, imageUrl } = useProductImage(product.id);
  const stock = getProductStock(product);
  const [cartState, setCartState] = useState(() => {
    try {
      const item = getCart().find((cartItem) => cartItem.product.id === product.id);
      return { quantity: item?.quantity ?? 0, error: "" };
    } catch (error) {
      return { quantity: 0, error: error.message };
    }
  });

  useEffect(() => {
    if (cartState.error) {
      toast.error(`Could not load your cart. ${cartState.error}`);
    }
  }, [cartState.error]);

  function handleAddToCart() {
    try {
      const cart = addProductToCart(product);
      const item = cart.find((cartItem) => cartItem.product.id === product.id);
      setCartState({ quantity: item.quantity, error: "" });
      toast.success(<ProductAddedToast product={product} />);
    } catch (error) {
      toast.error(`Could not save your cart. ${error.message}`);
    }
  }

  function handleQuantityChange(quantity) {
    try {
      if (quantity === 0) {
        removeProductFromCart(product.id);
      } else {
        updateCartItemQuantity(product.id, quantity);
      }

      setCartState({ quantity, error: "" });
    } catch (error) {
      toast.error(`Could not update your cart. ${error.message}`);
    }
  }

  function handleDecreaseQuantity() {
    handleQuantityChange(cartState.quantity - 1);
  }

  function handleIncreaseQuantity() {
    try {
      const cart = addProductToCart(product);
      const item = cart.find((cartItem) => cartItem.product.id === product.id);
      setCartState({ quantity: item.quantity, error: "" });
    } catch (error) {
      toast.error(`Could not update your cart. ${error.message}`);
    }
  }

  return (
    <article className="product-card">
      <ProductImage
        product={product}
        status={status}
        imageUrl={imageUrl}
        className="product-card-image"
      />
      <div className="product-card-content">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p className="product-price">Price: ₹{product.price}</p>
        {cartState.quantity === 0 ? (
          <button
            className="product-action"
            disabled={stock === 0}
            onClick={handleAddToCart}
            type="button"
          >
            {stock === 0 ? "Out of stock" : "Add to cart"}
          </button>
        ) : (
          <div className="quantity-control product-card-quantity">
            <button
              aria-label={`Decrease quantity of ${product.name}`}
              onClick={handleDecreaseQuantity}
              type="button"
            >
              −
            </button>
            <span aria-live="polite">{cartState.quantity}</span>
            <button
              aria-label={`Increase quantity of ${product.name}`}
              disabled={cartState.quantity >= stock}
              onClick={handleIncreaseQuantity}
              type="button"
            >
              +
            </button>
          </div>
        )}
        <Link className="product-details-link" to={`/product/${product.id}`}>
          View details
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;