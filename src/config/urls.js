import { appConfig } from "./appConfig";

const apiBaseUrl = appConfig.apiBaseUrl.replace(/\/+$/, "");

export const API_URLS = Object.freeze({
  base: apiBaseUrl,
  login: `${apiBaseUrl}/login`,
  products: `${apiBaseUrl}/products`,
  productSearch: `${apiBaseUrl}/products/search`,
  createProduct: `${apiBaseUrl}/product`,
  product: (productId) =>
    `${apiBaseUrl}/product/${encodeURIComponent(productId)}`,
  productImage: (productId) =>
    `${apiBaseUrl}/product/${encodeURIComponent(productId)}/image`,
  orders: `${apiBaseUrl}/orders`,
  placeOrder: `${apiBaseUrl}/orders/place`,
  googleLogin: appConfig.googleLoginUrl,
  oauthCallback: appConfig.oauthCallbackPath,
});
