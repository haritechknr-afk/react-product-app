import { Link } from "react-router-dom";
import useProductImage from "../hooks/useProductImage";
import ProductImage from "./ProductImage";

function ProductCard({ product }) {
  const { status, imageUrl } = useProductImage(product.id);

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
        <Link className="product-action" to={`/product/${product.id}`}>
          Add to cart
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;