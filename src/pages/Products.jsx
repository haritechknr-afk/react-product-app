import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [productsStatus, setProductsStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    getProducts({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          setProducts(data);
          setProductsStatus("success");
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setProductsStatus("error");
          toast.error(`Could not load products. ${error.message}`);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <main className="products-page">
      <h1>Products</h1>

      {productsStatus === "error" && (
        <p className="products-error" role="alert">
          Products could not be loaded.
        </p>
      )}

      <section className="product-list" aria-label="Products">
        {productsStatus === "loading" && <p>Loading products...</p>}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {productsStatus === "success" && products.length === 0 && (
          <p className="products-empty">No products available.</p>
        )}
      </section>
    </main>
  );
}

export default Products;
