import useProductImage from "../hooks/useProductImage";

function ProductAddedToast({ product }) {
  const { imageUrl } = useProductImage(product.id);

  return (
    <div className="product-added-toast">
      <img
        alt=""
        className="product-added-toast-image"
        src={imageUrl || "/missing-product-image"}
      />
      <div>
        <strong>Added to cart</strong>
        <span>{product.name}</span>
      </div>
    </div>
  );
}

export default ProductAddedToast;
