import axios from "axios";
import { API_URLS } from "../config/urls";

function getRequestError(error) {
  if (!axios.isAxiosError(error) || !error.response) {
    return error;
  }

  const { status, data } = error.response;
  const message =
    typeof data === "string"
      ? data.trim()
      : data && typeof data === "object"
        ? data.message ?? data.error ?? ""
        : "";

  return new Error(
    message
      ? `Request failed (${status}): ${String(message).slice(0, 300)}`
      : `Request failed with status ${status}`,
    { cause: error },
  );
}

export async function getOrders({ signal } = {}) {
  try {
    const { data } = await axios.get(API_URLS.orders, { signal });
    if (!Array.isArray(data)) {
      throw new TypeError("The orders API must return an array.");
    }

    return data;
  } catch (error) {
    throw getRequestError(error);
  }
}

export async function placeOrder(orderRequest) {
  try {
    const { data } = await axios.post(
      API_URLS.placeOrder,
      orderRequest,
    );
    return data;
  } catch (error) {
    throw getRequestError(error);
  }
}
