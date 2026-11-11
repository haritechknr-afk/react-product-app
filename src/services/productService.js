const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

async function fetchResponse(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const responseText = (await response.text()).trim();
    let message = responseText;

    if (responseText) {
      try {
        const body = JSON.parse(responseText);
        message = body.message ?? body.error ?? responseText;
      } catch {
        message = responseText;
      }
    }

    throw new Error(
      message
        ? `Request failed (${response.status}): ${message.slice(0, 300)}`
        : `Request failed with status ${response.status}`,
    );
  }

  return response;
}

export async function getProducts({ signal } = {}) {
  const response = await fetchResponse(`${API_BASE_URL}/products`, { signal });
  const products = await response.json();

  if (!Array.isArray(products)) {
    throw new TypeError("The products API must return an array.");
  }

  return products;
}

export async function getProduct(productId, { signal } = {}) {
  const response = await fetchResponse(
    `${API_BASE_URL}/product/${encodeURIComponent(productId)}`,
    { signal },
  );

  return response.json();
}

export async function getProductImage(productId, { signal } = {}) {
  const response = await fetchResponse(
    `${API_BASE_URL}/product/${encodeURIComponent(productId)}/image`,
    { signal },
  );

  return response.blob();
}

export async function updateProduct(
  productId,
  product,
  { image, signal } = {},
) {
  const formData = new FormData();
  formData.append("product", JSON.stringify(product));
  if (image) {
    formData.append("imageFile", image);
  }

  const response = await fetchResponse(
    `${API_BASE_URL}/product/${encodeURIComponent(productId)}`,
    {
      method: "PUT",
      body: formData,
      signal,
    },
  );

  const responseBody = await response.text();
  if (!responseBody.trim()) {
    return product;
  }

  try {
    const body = JSON.parse(responseBody);
    return (
      body &&
      typeof body === "object" &&
      !Array.isArray(body) &&
      Object.keys(product).some((key) => key in body)
    )
      ? body
      : product;
  } catch {
    return product;
  }
}

export async function deleteProduct(productId, { signal } = {}) {
  await fetchResponse(
    `${API_BASE_URL}/product/${encodeURIComponent(productId)}`,
    { method: "DELETE", signal },
  );
}
