import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import { getProducts, searchProducts } from "../services/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [productsStatus, setProductsStatus] = useState("loading");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [isSearchRequest, setIsSearchRequest] = useState(false);
  const [productsError, setProductsError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const requestController = useRef(null);
  const groupedProducts = products.reduce((groups, product) => {
    const categoryValue = Array.isArray(product.category)
      ? product.category[0]
      : product.category;
    const category =
      typeof categoryValue === "string" && categoryValue.trim()
        ? categoryValue.trim()
        : "Uncategorized";

    groups.set(category, [...(groups.get(category) ?? []), product]);
    return groups;
  }, new Map());
  const sortedProductGroups = [...groupedProducts.entries()].sort(
    ([categoryA], [categoryB]) => {
      if (categoryA === "Uncategorized") return 1;
      if (categoryB === "Uncategorized") return -1;
      return categoryA.localeCompare(categoryB);
    },
  );
  const visibleProductGroups =
    selectedCategory === "All"
      ? sortedProductGroups
      : sortedProductGroups.filter(([category]) => category === selectedCategory);

  useEffect(() => {
    const controller = new AbortController();
    requestController.current = controller;

    getProducts({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          setProducts(data);
          setProductsStatus("success");
          setProductsError("");
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setProductsStatus("error");
          setProductsError(error.message);
          toast.error(`Could not load products. ${error.message}`);
        }
      });

    return () => {
      controller.abort();
      requestController.current?.abort();
    };
  }, []);

  function loadProducts(keyword, isSearch = false) {
    const controller = new AbortController();

    requestController.current?.abort();
    requestController.current = controller;
    setProducts([]);
    setProductsStatus("loading");
    setProductsError("");
    setActiveSearch(keyword);
    setIsSearchRequest(isSearch);

    const request = isSearch
      ? searchProducts(keyword, { signal: controller.signal })
      : getProducts({ signal: controller.signal });

    request
      .then((data) => {
        if (!controller.signal.aborted) {
          setProducts(data);
          setProductsStatus("success");
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setProductsStatus("error");
          setProductsError(error.message);
          toast.error(
            `${isSearch ? "Could not search products" : "Could not load products"}. ${error.message}`,
          );
        }
      });
  }

  function handleSearch(event) {
    event.preventDefault();
    setSelectedCategory("All");
    const keyword = searchTerm.trim();
    loadProducts(keyword, Boolean(keyword));
  }

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearchTerm(value);

    if (!value && activeSearch) {
      setSelectedCategory("All");
      loadProducts("", false);
    }
  }

  return (
    <main className="products-page">
      <header className="products-header">
        <h1>Products</h1>
      </header>

      {productsStatus === "success" && sortedProductGroups.length > 0 && (
        <nav className="product-category-tabs" aria-label="Filter products by category">
          <button
            aria-pressed={selectedCategory === "All"}
            className={`product-category-tab${selectedCategory === "All" ? " is-selected" : ""}`}
            onClick={() => setSelectedCategory("All")}
            type="button"
          >
            All <span>{products.length}</span>
          </button>
          {sortedProductGroups.map(([category, categoryProducts]) => (
            <button
              aria-pressed={selectedCategory === category}
              className={`product-category-tab${selectedCategory === category ? " is-selected" : ""}`}
              key={category}
              onClick={() => setSelectedCategory(category)}
              type="button"
            >
              {category} <span>{categoryProducts.length}</span>
            </button>
          ))}
        </nav>
      )}

      <form className="product-search" onSubmit={handleSearch} role="search">
        <label className="sr-only" htmlFor="product-search">
          Search products
        </label>
        <input
          autoComplete="off"
          id="product-search"
          onChange={handleSearchChange}
          placeholder="Search products..."
          type="search"
          value={searchTerm}
        />
        <button disabled={productsStatus === "loading"} type="submit">
          Search
        </button>
      </form>

      {productsStatus === "error" && (
        <p className="products-error" role="alert">
          {isSearchRequest
            ? `Products could not be searched. ${productsError}`
            : `Products could not be loaded. ${productsError}`}
        </p>
      )}

      {productsStatus === "loading" && (
        <p>{isSearchRequest ? "Searching products..." : "Loading products..."}</p>
      )}
      {productsStatus === "success" && visibleProductGroups.length > 0 && (
        <div className="product-groups" aria-label="Products grouped by category">
          {visibleProductGroups.map(([category, categoryProducts]) => (
            <section
              aria-label={`${category} products`}
              className="product-category-group"
              key={category}
            >
              <header className="product-category-heading">
                <h2>{category}</h2>
                <span>
                  {categoryProducts.length}{" "}
                  {categoryProducts.length === 1 ? "product" : "products"}
                </span>
              </header>
              <div className="product-list">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
      {productsStatus === "success" && products.length === 0 && (
        <p className="products-empty">
          {isSearchRequest
            ? activeSearch
              ? `No products found for "${activeSearch}".`
              : "No products found."
            : "No products available."}
        </p>
      )}
    </main>
  );
}

export default Products;
