import { Fragment, useEffect, useState } from "react";
import ProductImage from "../components/ProductImage";
import useProductImage from "../hooks/useProductImage";
import { getProducts } from "../services/productService";
import { getOrders } from "../services/orderService";

function getOrderItems(order) {
  if (Array.isArray(order.orderItems)) {
    return order.orderItems;
  }

  return Array.isArray(order.items) ? order.items : [];
}

function getItemProduct(item, products) {
  const productId = item.productId ?? item.product?.id;
  const productName = item.productName ?? item.name ?? item.product?.name;

  return (
    products.find(
      (product) =>
        (productId != null && String(product.id) === String(productId)) ||
        (productName &&
          product.name?.toLowerCase() === productName.toLowerCase()),
    ) ?? {
      id: productId,
      name: productName ?? "Product",
    }
  );
}

function OrderItemRow({ item, products }) {
  const product = getItemProduct(item, products);
  const { status, imageUrl } = useProductImage(product.id);

  return (
    <tr>
      <td className="order-detail-product">
        <ProductImage
          className="order-detail-image"
          imageUrl={imageUrl}
          product={product}
          status={status}
        />
        <span>{product.name}</span>
      </td>
      <td>{item.quantity ?? "—"}</td>
      <td className="orders-total-cell">
        {Number.isFinite(Number(item.totalPrice))
          ? Number(item.totalPrice).toLocaleString(undefined, {
              style: "currency",
              currency: "INR",
            })
          : "—"}
      </td>
    </tr>
  );
}

function formatOrderDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function Orders() {
  const [ordersState, setOrdersState] = useState({
    orders: [],
    status: "loading",
    error: "",
  });
  const [productsState, setProductsState] = useState({
    products: [],
    status: "loading",
    error: "",
  });
  const [expandedOrders, setExpandedOrders] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getOrders({ signal: controller.signal })
      .then((orders) => {
        if (!controller.signal.aborted) {
          setOrdersState({ orders, status: "success", error: "" });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setOrdersState({ orders: [], status: "error", error: error.message });
        }
      });

    return () => controller.abort();
  }, [refreshKey]);

  useEffect(() => {
    const controller = new AbortController();

    getProducts({ signal: controller.signal })
      .then((products) => {
        if (!controller.signal.aborted) {
          setProductsState({ products, status: "success", error: "" });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setProductsState({
            products: [],
            status: "error",
            error: error.message,
          });
        }
      });

    return () => controller.abort();
  }, []);

  const { orders, status, error } = ordersState;
  const { products, status: productsStatus, error: productsError } =
    productsState;

  function refreshOrders() {
    setOrdersState((state) => ({ ...state, status: "loading", error: "" }));
    setExpandedOrders({});
    setRefreshKey((key) => key + 1);
  }

  function toggleOrderDetails(orderKey) {
    setExpandedOrders((expanded) => ({
      ...expanded,
      [orderKey]: !expanded[orderKey],
    }));
  }

  return (
    <main className="orders-page">
      <header className="orders-header">
        <div>
          <p className="orders-eyebrow">Management</p>
          <h1>Orders</h1>
          <p className="orders-description">
            Review customer orders and their items.
          </p>
        </div>
        <div className="orders-actions">
          <button
            className="product-action secondary"
            disabled={status === "loading"}
            onClick={refreshOrders}
            type="button"
          >
            {status === "loading" ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {status === "loading" && (
        <p className="orders-message" role="status">
          Loading orders...
        </p>
      )}
      {status === "error" && (
        <section className="orders-message orders-error" role="alert">
          <p>Orders could not be loaded. {error}</p>
          <button
            className="product-action secondary"
            onClick={refreshOrders}
            type="button"
          >
            Try again
          </button>
        </section>
      )}
      {status === "success" && orders.length === 0 && (
        <section className="orders-empty">
          <h2>No orders yet</h2>
          <p>Placed orders will appear here.</p>
        </section>
      )}
      {status === "success" && orders.length > 0 && (
        <section className="orders-table-wrap" aria-label="Orders list">
          {productsStatus === "error" && (
            <p className="orders-image-warning" role="status">
              Product images could not be matched. {productsError}
            </p>
          )}
          <table className="orders-table">
            <thead>
              <tr>
                <th scope="col">Order</th>
                <th scope="col">Customer</th>
                <th scope="col">Date</th>
                <th scope="col">Item count</th>
                <th scope="col">Total</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const items = getOrderItems(order);
                const itemCount = items.reduce(
                  (count, item) => count + Number(item.quantity ?? 0),
                  0,
                );
                const total = items.reduce(
                  (sum, item) => sum + Number(item.totalPrice ?? 0),
                  0,
                );
                const orderKey = order.orderId ?? `order-${index}`;
                const isExpanded = Boolean(expandedOrders[orderKey]);

                return (
                  <Fragment key={orderKey}>
                    <tr>
                      <td className="order-id-cell">
                        #{order.orderId ?? "—"}
                      </td>
                      <td>
                        <strong>{order.customerName ?? "—"}</strong>
                        <span className="order-customer-email">
                          {order.email ?? "—"}
                        </span>
                      </td>
                      <td>{formatOrderDate(order.orderDate)}</td>
                      <td>{itemCount}</td>
                      <td className="orders-total-cell">
                        {total.toLocaleString(undefined, {
                          style: "currency",
                          currency: "INR",
                        })}
                      </td>
                      <td>
                        <span
                          className={`order-status order-status-${String(
                            order.status ?? "unknown",
                          ).toLowerCase()}`}
                        >
                          {order.status ?? "Unknown"}
                        </span>
                      </td>
                      <td>
                        <button
                          aria-expanded={isExpanded}
                          aria-controls={`order-details-${index}`}
                          className="order-details-toggle"
                          onClick={() => toggleOrderDetails(orderKey)}
                          type="button"
                        >
                          {isExpanded ? "Hide Details" : "Show Details"}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr
                        className="order-details-row"
                        id={`order-details-${index}`}
                        key={`${orderKey}-details`}
                      >
                        <td colSpan="7">
                          <div className="order-details-panel">
                            <h2>Order items</h2>
                            {items.length > 0 ? (
                              <div className="order-details-table-wrap">
                                <table className="order-details-table">
                                  <thead>
                                    <tr>
                                      <th scope="col">Product</th>
                                      <th scope="col">Quantity</th>
                                      <th scope="col">Line total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {items.map((item, itemIndex) => (
                                      <OrderItemRow
                                        item={item}
                                        key={`${item.productId ?? item.productName ?? itemIndex}-${itemIndex}`}
                                        products={products}
                                      />
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p>This order has no item details.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}

export default Orders;
