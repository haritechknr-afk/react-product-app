import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createProduct } from "../services/productService";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const CATEGORY_OPTIONS = [
  "Accessories",
  "Automotive",
  "Beauty",
  "Books",
  "Clothing",
  "Computers",
  "Electronics",
  "Fashion",
  "Food",
  "Footwear",
  "Furniture",
  "Health",
  "Home & Kitchen",
  "Phone",
  "Sports",
  "Tablet",
  "Toys",
];

function CreateProduct() {
  const navigate = useNavigate();
  const imageInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(
    () => () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    },
    [imagePreview],
  );

  function handleImageChange(event) {
    const image = event.target.files?.[0] ?? null;

    if (image && image.size > MAX_IMAGE_SIZE_BYTES) {
      setFormError("Image size must be 10 MB or less. Choose a smaller file.");
      event.target.value = "";
      return;
    }

    if (image?.type && !image.type.startsWith("image/")) {
      setFormError("Choose a valid image file.");
      event.target.value = "";
      return;
    }

    setSelectedImage(image);
    setImagePreview(image ? URL.createObjectURL(image) : "");
    setFormError("");
  }

  function removeSelectedImage() {
    setSelectedImage(null);
    setImagePreview("");
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setFormError("");

    const formData = new FormData(event.currentTarget);
    const product = {
      name: String(formData.get("name")).trim(),
      brand: String(formData.get("brand")).trim(),
      description: String(formData.get("description")).trim(),
      category: String(formData.get("category")).trim(),
      price: Number(formData.get("price")),
      stockQuantity: Number(formData.get("stockQuantity")),
      releaseDate: String(formData.get("releaseDate")),
      available: isAvailable,
    };

    try {
      if (!Number.isFinite(product.price) || product.price < 0) {
        throw new Error("Price must be a non-negative number.");
      }
      if (
        !Number.isInteger(product.stockQuantity) ||
        product.stockQuantity < 0
      ) {
        throw new Error("Stock quantity must be a non-negative whole number.");
      }

      await createProduct(product, { image: selectedImage });
      toast.success("Product created successfully.");
      navigate("/products");
    } catch (error) {
      setFormError(error.message);
      toast.error(`Could not create product. ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }

  const previewProduct = { name: "Product image preview" };

  return (
    <main className="create-product-page">
      <Link className="back-link" to="/products">
        Back to products
      </Link>
      <form className="product-edit-form" onSubmit={handleSubmit}>
        <header className="product-editor-header">
          <div>
            <p className="product-editor-eyebrow">Product management</p>
            <h1>Create product</h1>
            <p>
              Fill in the product information below to add it to your catalog.
            </p>
          </div>
        </header>

        <div className="product-editor-layout">
          <section
            aria-label="Product image"
            className="create-product-image-section col-xl-5 col-lg-5 col-md-12 col-sm-12"
          >
            <h2>Product image</h2>
            <div className="create-product-image">
              {imagePreview ? (
                <img src={imagePreview} alt={previewProduct.name} />
              ) : (
                <div className="create-product-image-empty">
                  <svg
                    aria-hidden="true"
                    fill="none"
                    height="40"
                    viewBox="0 0 40 40"
                    width="40"
                  >
                    <rect
                      height="28"
                      rx="4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      width="32"
                      x="4"
                      y="6"
                    />
                    <circle
                      cx="14"
                      cy="15"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="m6 29 9-9 6 6 5-5 8 8"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                  <strong>Add a product photo</strong>
                  <span>PNG, JPG, or WEBP up to 10 MB</span>
                </div>
              )}
            </div>
            <div className="create-product-image-actions">
              <label className="product-action secondary create-image-upload">
                {imagePreview ? "Change image" : "Choose image"}
                <input
                  accept="image/*"
                  disabled={isSaving}
                  onChange={handleImageChange}
                  ref={imageInputRef}
                  type="file"
                />
              </label>
              {selectedImage && (
                <button
                  className="cart-remove-button"
                  disabled={isSaving}
                  onClick={removeSelectedImage}
                  type="button"
                >
                  Remove image
                </button>
              )}
            </div>
            {selectedImage && (
              <p className="selected-image-name">
                {selectedImage.name} · {(selectedImage.size / 1024).toFixed(0)} KB
              </p>
            )}
          </section>

          <section
            aria-label="Product fields"
            className="product-edit-fields create-product-fields col-xl-7 col-lg-7 col-md-12 col-sm-12"
          >
            <div className="create-product-section-heading">
              <h2>Product information</h2>
              <p>Fields marked with * are required.</p>
            </div>
            <label className="product-field name-field col-12">
              Product name *
              <input
                autoComplete="off"
                maxLength="200"
                name="name"
                placeholder="e.g. Wireless headphones"
                required
              />
            </label>
            <label className="product-field col-xl-6 col-lg-6 col-md-6 col-sm-12">
              Brand *
              <input
                autoComplete="organization"
                maxLength="120"
                name="brand"
                placeholder="e.g. Acme"
                required
              />
            </label>
            <label className="product-field col-xl-6 col-lg-6 col-md-6 col-sm-12">
              Release date
              <input name="releaseDate" type="date" />
            </label>
            <label className="product-field description-field wide-field">
              Description *
              <textarea
                maxLength="2000"
                name="description"
                placeholder="Describe the product and its key features"
                required
                rows="5"
              />
            </label>
            <label className="product-field col-xl-6 col-lg-6 col-md-6 col-sm-12">
              Category *
              <select defaultValue="" name="category" required>
                <option disabled value="">
                  Select a category
                </option>
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="product-field col-xl-6 col-lg-6 col-md-6 col-sm-12">
              Price (₹) *
              <input
                min="0"
                name="price"
                placeholder="0.00"
                required
                step="0.01"
                type="number"
              />
            </label>
            <label className="product-field col-xl-6 col-lg-6 col-md-6 col-sm-12">
              Stock quantity *
              <input
                min="0"
                name="stockQuantity"
                placeholder="0"
                required
                step="1"
                type="number"
              />
            </label>
            <div className="product-field availability-field col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <span>Available for purchase</span>
              <button
                aria-checked={isAvailable}
                aria-label="Available for purchase"
                className="availability-toggle"
                disabled={isSaving}
                onClick={() => setIsAvailable((available) => !available)}
                role="switch"
                type="button"
              >
                <span className="availability-toggle-track" />
                <span className="availability-toggle-state">
                  {isAvailable ? "Available" : "Unavailable"}
                </span>
              </button>
            </div>
          </section>
        </div>

        {formError && (
          <p className="products-error" role="alert">
            {formError}
          </p>
        )}

        <footer className="product-editor-footer">
          <p>New products will appear in the product catalog after saving.</p>
          <div className="product-actions">
            <button
              className="product-action"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Creating..." : "Create product"}
            </button>
            <Link
              aria-disabled={isSaving}
              className="product-action secondary"
              onClick={(event) => {
                if (isSaving) {
                  event.preventDefault();
                }
              }}
              to="/products"
            >
              Cancel
            </Link>
          </div>
        </footer>
      </form>
    </main>
  );
}

export default CreateProduct;
