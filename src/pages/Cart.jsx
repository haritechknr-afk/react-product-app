import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ProductImage from "../components/ProductImage";
import useProductImage from "../hooks/useProductImage";
import {
  clearCart,
  getCart,
  getProductStock,
  removeProductFromCart,
  updateCartItemQuantity,
} from "../services/cartService";
import { placeOrder } from "../services/orderService";

function CartItem({ item, onQuantityChange, onRemove }) {
  const { status, imageUrl } = useProductImage(item.product.id);
  const stock = getProductStock(item.product);

  return (
    <tr>
      <td className="order-product-cell">
        <ProductImage
          className="cart-item-image"
          imageUrl={imageUrl}
          product={item.product}
          status={status}
        />
        <span>{item.product.name}</span>
      </td>
      <td className="order-price-cell">₹{Number(item.product.price).toFixed(2)}</td>
      <td>
        <div className="cart-item-controls">
          <div className="quantity-control" aria-label="Quantity">
            <button
              aria-label={`Decrease quantity of ${item.product.name}`}
              disabled={item.quantity <= 1}
              onClick={() => onQuantityChange(item.product.id, item.quantity - 1)}
              type="button"
            >
              −
            </button>
            <span aria-live="polite">{item.quantity}</span>
            <button
              aria-label={`Increase quantity of ${item.product.name}`}
              disabled={item.quantity >= stock}
              onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
              type="button"
            >
              +
            </button>
          </div>
          <button
            className="cart-remove-button"
            onClick={() => onRemove(item.product.id)}
            type="button"
          >
            Remove
          </button>
        </div>
      </td>
      <td className="order-subtotal-cell">
        ₹{(Number(item.product.price) * item.quantity).toFixed(2)}
      </td>
    </tr>
  );
}

function Cart() {
  const [cartState, setCartState] = useState(() => {
    try {
      return { cart: getCart(), status: "success", error: "" };
    } catch (error) {
      return { cart: [], status: "error", error: error.message };
    }
  });
  const { cart, status: cartStatus, error: cartError } = cartState;
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const checkoutDialogRef = useRef(null);

  useEffect(() => {
    const dialog = checkoutDialogRef.current;
    if (!dialog) {
      return;
    }

    if (isCheckoutOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isCheckoutOpen && dialog.open) {
      dialog.close();
    }
  }, [isCheckoutOpen]);

  function handleQuantityChange(productId, quantity) {
    try {
      setCartState({
        cart: updateCartItemQuantity(productId, quantity),
        status: "success",
        error: "",
      });
    } catch (error) {
      toast.error(`Could not update your cart. ${error.message}`);
    }
  }

  function handleRemove(productId) {
    try {
      setCartState({
        cart: removeProductFromCart(productId),
        status: "success",
        error: "",
      });
      toast.success("Product removed from cart.");
    } catch (error) {
      toast.error(`Could not update your cart. ${error.message}`);
    }
  }

  async function handleCheckout(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const customer = {
      name: String(formData.get("name")).trim(),
      email: String(formData.get("email")).trim(),
    };

    setIsSubmitting(true);
    try {
      const order = await placeOrder({
        customerName: customer.name,
        email: customer.email,
        items: cart.map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
        })),
      });

      clearCart();
      setCartState({ cart: [], status: "success", error: "" });
      setPlacedOrder({
        ...order,
        customerName: order.customerName ?? customer.name,
        email: order.email ?? customer.email,
        items: order.items ?? [],
      });
      setIsCheckoutOpen(false);
    } catch (error) {
      toast.error(`Could not place your order. ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0,
  );

  return (
    <main className="cart-page">
      <header className="cart-header">
        <h1>Your cart</h1>
      </header>

      {cartStatus === "error" && (
        <p className="products-error" role="alert">
          Your cart could not be loaded. {cartError}
        </p>
      )}
      {cartStatus === "success" && cart.length === 0 && (
        placedOrder ? (
          <section className="order-confirmation" role="status">
            <div className="order-confirmation-mark" aria-hidden="true">
              ✓
            </div>
            <p className="order-confirmation-eyebrow">Order confirmed</p>
            <h2>Thank you, {placedOrder.customerName}!</h2>
            <p>
              Your order has been placed.
            </p>
            <p>
              {placedOrder.orderId && (
                <>
                  Order ID: <strong>{placedOrder.orderId}</strong>
                </>
              )}
            </p>
            <p>{placedOrder.email}</p>
            <p>Status: {placedOrder.status}</p>
            {placedOrder.orderDate && <p>Order date: {placedOrder.orderDate}</p>}
            {placedOrder.items.length > 0 && (
              <ul className="order-confirmation-items">
                {placedOrder.items.map((item, index) => (
                  <li key={`${item.productName ?? item.name}-${index}`}>
                    {item.productName ?? item.name} × {item.quantity} — ₹
                    {Number(item.totalPrice).toFixed(2)}
                  </li>
                ))}
              </ul>
            )}
            <Link className="product-action" to="/products">
              Continue shopping
            </Link>
          </section>
        ) : (
          <section className="cart-empty">
            <h2>Your cart is empty</h2>
            <p>Add products to your cart to see them here.</p>
            <Link className="product-action" to="/products">
              Browse products
            </Link>
          </section>
        )
      )}
      {cartStatus === "success" && cart.length > 0 && (
        <div className="cart-layout">
          <section className="cart-items" aria-label="Order items">
            <div className="order-table-wrap">
              <table className="order-table">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <CartItem
                      item={item}
                      key={item.product.id}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemove}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <aside className="cart-summary" aria-label="Order summary">
            <h2>Order summary</h2>
            <p>
              <span>Items ({itemCount})</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </p>
            <p className="cart-total">
              <strong>Total</strong>
              <strong>₹{cartTotal.toFixed(2)}</strong>
            </p>
            <button
              className="product-action checkout-button"
              onClick={() => setIsCheckoutOpen(true)}
              type="button"
            >
              Proceed to checkout
            </button>
          </aside>
        </div>
      )}
      {isCheckoutOpen && cart.length > 0 && (
        <dialog
          className="checkout-dialog"
          onCancel={(event) => {
            event.preventDefault();
            if (!isSubmitting) {
              setIsCheckoutOpen(false);
            }
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget && !isSubmitting) {
              setIsCheckoutOpen(false);
            }
          }}
          ref={checkoutDialogRef}
          aria-labelledby="checkout-title"
        >
          <div className="checkout-panel-heading">
            <div>
              <p className="order-confirmation-eyebrow">Almost there</p>
              <h2 id="checkout-title">Checkout details</h2>
            </div>
            <button
              className="checkout-cancel"
              disabled={isSubmitting}
              onClick={() => setIsCheckoutOpen(false)}
              type="button"
            >
              Cancel
            </button>
          </div>
          <form className="checkout-form" onSubmit={handleCheckout}>
            <label>
              Full name
              <input
                autoComplete="name"
                maxLength="120"
                name="name"
                required
              />
            </label>
            <label>
              Email address
              <input
                autoComplete="email"
                maxLength="254"
                name="email"
                required
                type="email"
              />
            </label>
            <div className="checkout-form-footer">
              <p>
                Total to pay <strong>₹{cartTotal.toFixed(2)}</strong>
              </p>
              <button
                className="product-action"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Placing order..." : "Place order"}
              </button>
            </div>
          </form>
        </dialog>
      )}
    </main>
  );
}

export default Cart;
