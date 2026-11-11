import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProductImage from "../components/ProductImage";
import useProductImage from "../hooks/useProductImage";
import { addProductToCart } from "../services/cartService";
import {
  deleteProduct,
  getProduct,
  updateProduct,
} from "../services/productService";

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function isDateField(key) {
  return /date|birthday|release/i.test(key);
}

function formatDateInput(value) {
  if (value == null || value === "") {
    return "";
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return [
      value.getFullYear(),
      String(value.getMonth() + 1).padStart(2, "0"),
      String(value.getDate()).padStart(2, "0"),
    ].join("-");
  }

  const dateString = String(value).trim();
  const isoDate = dateString.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (isoDate) {
    return isoDate;
  }

  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidDateInput(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth;
}

function DatePicker({ value, disabled, onChange }) {
  return (
    <div className="date-picker">
      <input
        disabled={disabled}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

const CATEGORY_OPTIONS = [
  "Accessories",
  "Automotive",
  "Beauty",
  "Books",
  "Clothing",
  "Electronics",
  "Food",
  "Furniture",
  "Health",
  "Home & Kitchen",
  "Sports",
  "Toys",
];

function CategorySelect({ options, value, disabled, onChange }) {
  return (
    <select
      disabled={disabled}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">Select a category</option>
      {options.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}

function isAvailabilityField(key, value) {
  return (
    typeof value === "boolean" &&
    /(available|availability|inStock)/i.test(key)
  );
}

function getEditableFields(product) {
  return Object.entries(product)
    .filter(
      ([key, value]) =>
      key.toLowerCase() !== "id" &&
      !/image|photo|picture/i.test(key) &&
        typeof value !== "function",
    )
    .sort(([keyA, valueA], [keyB, valueB]) => {
      function priority(key, value) {
        if (/^(name|productName)$/i.test(key)) return 0;
        if (/description/i.test(key)) return 1;
        if (/category/i.test(key)) return 2;
        if (isAvailabilityField(key, value)) return 3;
        return 4;
      }

      return priority(keyA, valueA) - priority(keyB, valueB);
    });
}

function createEditValues(product) {
  return Object.fromEntries(
    getEditableFields(product).map(([key, value]) => [
      key,
      /category/i.test(key)
        ? Array.isArray(value)
          ? String(value[0] ?? "")
          : String(value ?? "")
        : isDateField(key)
          ? formatDateInput(value)
        : value !== null && typeof value === "object"
        ? JSON.stringify(value, null, 2)
        : typeof value === "number"
          ? String(value)
          : value ?? "",
    ]),
  );
}

function formatValue(value) {
  if (value == null || typeof value !== "object") {
    return String(value ?? "—");
  }

  return JSON.stringify(value);
}

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productResult, setProductResult] = useState(null);
  const [editValues, setEditValues] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [actionStatus, setActionStatus] = useState("");
  const [actionError, setActionError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState("");
  const imageInputRef = useRef(null);
  const [imageRefreshKey, setImageRefreshKey] = useState(0);
  const { status: imageStatus, imageUrl } = useProductImage(
    id,
    imageRefreshKey,
  );

  useEffect(() => {
    return () => {
      if (selectedImagePreview) {
        URL.revokeObjectURL(selectedImagePreview);
      }
    };
  }, [selectedImagePreview]);

  useEffect(() => {
    const controller = new AbortController();

    getProduct(id, { signal: controller.signal })
      .then((product) => {
        if (!controller.signal.aborted) {
          setProductResult({ id, status: "success", product });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setProductResult({ id, status: "error", error });
          toast.error(`Could not load product. ${error.message}`);
        }
      });

    return () => controller.abort();
  }, [id]);

  const currentResult = productResult?.id === id ? productResult : null;
  const product = currentResult?.status === "success" ? currentResult.product : null;

  function startEditing() {
    setEditValues(createEditValues(product));
    setSelectedImage(null);
    setSelectedImagePreview("");
    setActionError("");
    setIsEditing(true);
  }

  function handleImageChange(event) {
    const image = event.target.files?.[0] ?? null;

    if (image?.type && !image.type.startsWith("image/")) {
      removeSelectedImage();
      setActionError("Choose a valid image file.");
      event.target.value = "";
      return;
    }

    setSelectedImage(image);
    setSelectedImagePreview(image ? URL.createObjectURL(image) : "");
    setActionError("");
  }

  function removeSelectedImage() {
    setSelectedImage(null);
    setSelectedImagePreview("");
    setActionError("");
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  async function handleUpdate(event) {
    event.preventDefault();
    setActionStatus("updating");
    setActionError("");

    let updatedFields;
    try {
      updatedFields = Object.fromEntries(
        getEditableFields(product).map(([key, originalValue]) => {
          const draft = editValues[key];
          let value = draft;

          if (
            typeof originalValue === "number" ||
            /(stock|quantity)/i.test(key)
          ) {
            const isIntegerField = /(stock|quantity|count)/i.test(key);
            const allowDecimal = !isIntegerField && /(price|cost|amount)/i.test(key);
            const numberPattern = (isIntegerField || (originalValue % 1 === 0 && !allowDecimal))
              ? /^-?\d+$/
              : /^-?(?:\d+\.?\d*|\.\d+)$/;

            if (typeof draft !== "string" || !numberPattern.test(draft.trim())) {
              throw new Error(`${formatLabel(key)} must be a valid number.`);
            }
            value = Number(draft);
            if (!Number.isFinite(value)) {
              throw new Error(`${formatLabel(key)} must be a valid number.`);
            }
            if (isIntegerField && !Number.isInteger(value)) {
              throw new Error(`${formatLabel(key)} must be a whole number.`);
            }
            if (/(price|cost|amount|quantity|stock|count)/i.test(key) && value < 0) {
              throw new Error(`${formatLabel(key)} cannot be negative.`);
            }
          } else if (typeof originalValue === "boolean") {
            value = Boolean(draft);
          } else if (/category/i.test(key)) {
            const category = String(draft).trim();
            if (!category) {
              throw new Error("Select a category.");
            }
            value = Array.isArray(originalValue) ? [category] : category;
          } else if (isDateField(key)) {
            if (!isValidDateInput(draft)) {
              throw new Error(`${formatLabel(key)} must be a complete date.`);
            }
            value = draft;
          } else if (
            originalValue !== null &&
            typeof originalValue === "object"
          ) {
            try {
              value = JSON.parse(draft);
            } catch (error) {
              throw new Error(`${formatLabel(key)} must contain valid JSON.`, {
                cause: error,
              });
            }
          } else if (originalValue === null && draft === "") {
            value = null;
          }

          return [key, value];
        }),
      );
    } catch (error) {
      setActionStatus("");
      setActionError("");
      toast.error(error.message);
      return;
    }

    try {
      const productFields = Object.fromEntries(
        Object.entries(product).filter(
          ([key]) =>
            key.toLowerCase() !== "id" &&
            !/image|photo|picture/i.test(key),
        ),
      );
      await updateProduct(
        id,
        {
          ...productFields,
          ...updatedFields,
        },
        { image: selectedImage },
      );
    } catch (error) {
      setActionStatus("");
      setActionError("");
      toast.error(`Could not update product. ${error.message}`);
      return;
    }

    const savedProduct = {
      ...product,
      ...updatedFields,
      id: product.id,
    };

    let refreshedProduct;
    try {
      refreshedProduct = await getProduct(id);
      if (
        !refreshedProduct ||
        typeof refreshedProduct !== "object" ||
        Array.isArray(refreshedProduct)
      ) {
        throw new TypeError("The product API returned an invalid product.");
      }
    } catch (error) {
      setProductResult({ id, status: "success", product: savedProduct });
      setIsEditing(false);
      setActionStatus("");
      setSelectedImage(null);
      setSelectedImagePreview("");
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      toast.error(
        `Product updated, but could not reload it and its image. ${error.message}`,
      );
      return;
    }

    setProductResult({ id, status: "success", product: refreshedProduct });

    const imageWasUpdated = Boolean(selectedImage);
    if (imageWasUpdated) {
      setSelectedImage(null);
      setSelectedImagePreview("");
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
    setImageRefreshKey((key) => key + 1);

    setIsEditing(false);
    setActionStatus("");
    toast.success(
      imageWasUpdated
        ? "Product and image updated successfully."
        : "Product updated successfully.",
    );
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }

    setActionStatus("deleting");
    setActionError("");

    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully.");
      navigate("/products", {
        replace: true,
      });
    } catch (error) {
      setActionStatus("");
      setActionError("");
      toast.error(`Could not delete product. ${error.message}`);
    }
  }

  function handleAddToCart() {
    try {
      addProductToCart(product);
      setActionError("");
      setActionStatus("added");
      toast.success("Product added to cart.");
    } catch (error) {
      setActionStatus("");
      setActionError("");
      toast.error(`Could not save your cart. ${error.message}`);
    }
  }

  if (!currentResult || currentResult.status === "loading") {
    return (
      <main className="product-details-page">
        <p>Loading product...</p>
      </main>
    );
  }

  if (currentResult.status === "error") {
    return (
      <main className="product-details-page">
        <p className="products-error" role="alert">
          Product details could not be loaded.
        </p>
        <Link to="/products">Back to products</Link>
      </main>
    );
  }

  const isBusy = actionStatus === "updating" || actionStatus === "deleting";

  return (
    <main className="product-details-page">
      <Link className="back-link" to="/products">
        Back to products
      </Link>

      <section className={`product-details${isEditing ? " is-editing" : ""}`}>
        {!isEditing ? (
          <ProductImage
            product={product}
            status={imageStatus}
            imageUrl={imageUrl}
            className="product-details-image"
          />
        ) : null}

        <div
          className={`product-details-content${isEditing ? " product-editor" : ""}`}
        >
          {isEditing ? (
            <form className="product-edit-form" onSubmit={handleUpdate}>
              <header className="product-editor-header">
                <div>
                  <h1>Edit product</h1>
                </div>
              </header>

              <div className="product-editor-layout">
                <section
                  className="product-image-editor col-xl-6 col-lg-6 col-md-12 col-sm-12"
                  aria-label="Product image"
                >
                  <ProductImage
                    product={product}
                    status={imageStatus}
                    imageUrl={imageUrl}
                    previewUrl={selectedImagePreview}
                    className="product-edit-image"
                    editable
                    disabled={isBusy}
                    inputRef={imageInputRef}
                    onImageChange={handleImageChange}
                    onRemoveImage={removeSelectedImage}
                  />
                  {selectedImage && (
                    <p className="selected-image-name">
                      Selected image: {selectedImage.name}
                    </p>
                  )}
                  {actionError && (
                    <p className="products-error" role="alert">
                      {actionError}
                    </p>
                  )}
                </section>

                <section
                  className="product-edit-fields col-xl-6 col-lg-6 col-md-12 col-sm-12"
                  aria-label="Product fields"
                >
                {getEditableFields(product).map(([key, originalValue]) => {
                const isObject =
                  originalValue !== null &&
                  typeof originalValue === "object";
                const isBoolean = typeof originalValue === "boolean";
                const isNumber =
                  typeof originalValue === "number" ||
                  /(stock|quantity)/i.test(key);
                const isDate = isDateField(key);
                const isCategory = /category/i.test(key);
                const isAvailability = isAvailabilityField(key, originalValue);
                const isLongText = /description|details|notes/i.test(key);
                const isDescription = /description/i.test(key);
                const currentCategories = Array.isArray(originalValue)
                  ? originalValue.map(String)
                  : [String(originalValue ?? "")];
                const categoryOptions = [
                  ...new Set([
                    ...CATEGORY_OPTIONS,
                    ...currentCategories,
                  ]),
                ].filter(Boolean);

                return (
                  isAvailability ? (
                    <div
                      className="product-field availability-field col-xl-6 col-lg-6 col-md-6 col-sm-12"
                      key={key}
                    >
                      <span>{formatLabel(key)}</span>
                      <button
                        aria-checked={editValues[key]}
                        aria-label={formatLabel(key)}
                        className="availability-toggle"
                        disabled={isBusy}
                        onClick={() =>
                          setEditValues({
                            ...editValues,
                            [key]: !editValues[key],
                          })
                        }
                        role="switch"
                        type="button"
                      >
                        <span className="availability-toggle-track" />
                      </button>
                    </div>
                  ) : (
                    <label
                      className={`product-field col-xl-6 col-lg-6 col-md-6 col-sm-12${isBoolean ? " checkbox-field" : ""}${isLongText || isObject ? " wide-field" : ""}${isDescription ? " description-field" : ""}${/^(name|productName)$/i.test(key) ? " name-field col-12" : ""}`}
                      key={key}
                    >
                    {formatLabel(key)}
                    {isBoolean ? (
                      <input
                        checked={editValues[key]}
                        disabled={isBusy}
                        onChange={(event) =>
                          setEditValues({
                            ...editValues,
                            [key]: event.target.checked,
                          })
                        }
                        type="checkbox"
                      />
                    ) : isDate ? (
                      <DatePicker
                        disabled={isBusy}
                        value={editValues[key]}
                        onChange={(value) =>
                          setEditValues({
                            ...editValues,
                            [key]: value,
                          })
                        }
                      />
                    ) : isCategory ? (
                      <CategorySelect
                        disabled={isBusy}
                        options={categoryOptions}
                        value={editValues[key]}
                        onChange={(categories) =>
                          setEditValues({
                            ...editValues,
                            [key]: categories,
                          })
                        }
                      />
                    ) : isObject || isLongText ? (
                      <textarea
                        disabled={isBusy}
                        rows={isObject ? "5" : "4"}
                        value={editValues[key]}
                        onChange={(event) =>
                          setEditValues({
                            ...editValues,
                            [key]: event.target.value,
                          })
                        }
                      />
                    ) : (
                      <input
                        disabled={isBusy}
                        min={isNumber && /(price|cost|amount|quantity|stock|count)/i.test(key) ? "0" : undefined}
                        step={
                          isNumber
                            ? /(stock|quantity|count)/i.test(key) ||
                              (Number.isInteger(Number(originalValue)) &&
                                !/(price|cost|amount)/i.test(key))
                              ? "1"
                              : "any"
                            : undefined
                        }
                        type={isNumber ? "number" : "text"}
                        value={editValues[key]}
                        onChange={(event) =>
                          setEditValues({
                            ...editValues,
                            [key]: event.target.value,
                          })
                        }
                      />
                    )}
                  </label>
                  )
                );
              })}
                </section>
              </div>
              <div className="product-editor-footer">
              <p>Your changes will be saved to the product.</p>
              <div className="product-actions">
                <button className="product-action" disabled={isBusy} type="submit">
                  {actionStatus === "updating" ? "Saving..." : "Save changes"}
                </button>
                <button
                  className="product-action secondary"
                  disabled={isBusy}
                  onClick={() => {
                    setIsEditing(false);
                    removeSelectedImage();
                    setActionError("");
                  }}
                  type="button"
                >
                  Cancel
                </button>
              </div>
              </div>
            </form>
          ) : (
            <>
              <h1>{product.name}</h1>
              <dl className="product-details-list">
                {Object.entries(product)
                  .filter(
                    ([key]) =>
                      key.toLowerCase() !== "id" &&
                      !/image|photo|picture/i.test(key),
                  )
                  .map(([key, value]) => (
                    <div key={key}>
                      <dt>{formatLabel(key)}</dt>
                      <dd>{formatValue(value)}</dd>
                    </div>
                  ))}
              </dl>
              <div className="product-actions">
                <button
                  className="product-action"
                  disabled={isBusy}
                  onClick={handleAddToCart}
                  type="button"
                >
                  Add to cart
                </button>
                <button
                  className="product-action secondary"
                  disabled={isBusy}
                  onClick={startEditing}
                  type="button"
                >
                  Update
                </button>
                <button
                  className="product-action danger"
                  disabled={isBusy}
                  onClick={handleDelete}
                  type="button"
                >
                  {actionStatus === "deleting" ? "Deleting..." : "Delete"}
                </button>
              </div>
            </>
          )}

        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
