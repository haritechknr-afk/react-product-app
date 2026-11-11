function ProductImage({
  product,
  status,
  imageUrl,
  className = "",
  editable = false,
  previewUrl = "",
  disabled = false,
  onImageChange,
  onRemoveImage,
  inputRef,
}) {
  const displayedUrl = previewUrl || imageUrl;
  const hasImage = Boolean(previewUrl) || status === "loaded";

  return (
    <div className={`product-image-container ${className}`.trim()}>
      {status === "loading" && !previewUrl ? (
        <p>Loading image...</p>
      ) : (
        <img
          src={hasImage ? displayedUrl : "/image-not-found.svg"}
          alt={hasImage ? product.name : "Product image not found"}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/image-not-found.svg";
          }}
        />
      )}
      {!hasImage && status === "error" && (
        <span className="product-image-status">Product image unavailable</span>
      )}
      {editable && (
        <div className="product-image-actions">
          <label className="product-image-change">
            <span>{hasImage ? "Replace image" : "Add image"}</span>
            <input
              accept="image/*"
              disabled={disabled}
              onChange={onImageChange}
              ref={inputRef}
              type="file"
            />
          </label>
          {previewUrl && (
            <button
              className="product-image-remove"
              disabled={disabled}
              onClick={(event) => {
                event.stopPropagation();
                onRemoveImage();
              }}
              type="button"
              aria-label="Remove selected image"
              title="Remove selected image"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="m19 6-1 14H6L5 6" />
                <path d="M10 11v5M14 11v5" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductImage;
