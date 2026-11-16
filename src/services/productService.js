import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "/api";

async function handleRequestError(error) {
  if (!axios.isAxiosError(error) || !error.response) {
    throw error;
  }

  const { status } = error.response;
  let { data } = error.response;
  if (typeof Blob !== "undefined" && data instanceof Blob) {
    data = await data.text();
  }

  let responseMessage = "";

  if (typeof data === "string") {
    responseMessage = data.trim();
    if (responseMessage) {
      try {
        const body = JSON.parse(responseMessage);
        responseMessage = body.message ?? body.error ?? responseMessage;
      } catch {
        // Keep the response text when it is not JSON.
      }
    }
  } else if (data && typeof data === "object") {
    responseMessage = data.message ?? data.error ?? "";
  }

  throw new Error(
    responseMessage
      ? `Request failed (${status}): ${String(responseMessage).slice(0, 300)}`
      : `Request failed with status ${status}`,
    { cause: error },
  );
}

export function getProducts({ signal } = {}) {
  return axios
    .get(`${API_BASE_URL}/products`, { signal })
    .then(({ data }) => {
      if (!Array.isArray(data)) {
        throw new TypeError("The products API must return an array.");
      }

      return data;
    })
    .catch(handleRequestError);
}

export function searchProducts(keyword, { signal } = {}) {
  return axios
    .get(`${API_BASE_URL}/products/search`, {
      params: { keyword },
      signal,
    })
    .then(({ data }) => {
      if (!Array.isArray(data)) {
        throw new TypeError("The product search API must return an array.");
      }

      return data;
    })
    .catch(handleRequestError);
}

export function getProduct(productId, { signal } = {}) {
  return axios
    .get(`${API_BASE_URL}/product/${encodeURIComponent(productId)}`, {
      signal,
    })
    .then(({ data }) => data)
    .catch(handleRequestError);
}

export function getProductImage(productId, { signal } = {}) {
  return axios
    .get(`${API_BASE_URL}/product/${encodeURIComponent(productId)}/image`, {
      signal,
      responseType: "blob",
    })
    .then(({ data }) => data)
    .catch(handleRequestError);
}

export function updateProduct(productId, product, { image, signal } = {}) {
  const formData = new FormData();
  formData.append(
    "product",
    new Blob([JSON.stringify(product)], { type: "application/json" }),
  );
  if (image) {
    formData.append("imageFile", image, image.name);
  }

  return axios
    .put(
      `${API_BASE_URL}/product/${encodeURIComponent(productId)}`,
      formData,
      {
        signal,
        headers: { "Content-Type": "multipart/form-data" },
      },
    )
    .then(({ data }) => {
      if (data == null || (typeof data === "string" && !data.trim())) {
        return product;
      }

      let responseBody = data;
      if (typeof responseBody === "string") {
        try {
          responseBody = JSON.parse(responseBody);
        } catch {
          return product;
        }
      }

      return responseBody &&
        typeof responseBody === "object" &&
        !Array.isArray(responseBody) &&
        Object.keys(product).some((key) => key in responseBody)
        ? responseBody
        : product;
    })
    .catch(handleRequestError);
}

export function createProduct(product, { image, signal } = {}) {
  const formData = new FormData();
  formData.append(
    "product",
    new Blob([JSON.stringify(product)], { type: "application/json" }),
  );
  formData.append(
    "imageFile",
    image ?? new Blob([], { type: "application/octet-stream" }),
    image?.name ?? "empty",
  );

  return axios
    .post(`${API_BASE_URL}/product`, formData, {
      signal,
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(({ data }) => data)
    .catch(handleRequestError);
}

export function deleteProduct(productId, { signal } = {}) {
  return axios
    .delete(`${API_BASE_URL}/product/${encodeURIComponent(productId)}`, {
      signal,
    })
    .then(() => undefined)
    .catch(handleRequestError);
}
