import { useEffect, useState } from "react";
import { getProductImage } from "../services/productService";

function useProductImage(productId, refreshKey = 0) {
  const [imageResult, setImageResult] = useState(null);
  const currentResult =
    imageResult?.productId === productId &&
    imageResult?.refreshKey === refreshKey
      ? imageResult
      : null;

  useEffect(() => {
    if (productId == null) {
      return;
    }

    const controller = new AbortController();
    let imageUrl;

    getProductImage(productId, { signal: controller.signal })
      .then((image) => {
        if (controller.signal.aborted) {
          return;
        }

        imageUrl = URL.createObjectURL(image);
        setImageResult({ productId, refreshKey, status: "loaded", imageUrl });
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setImageResult({ productId, refreshKey, status: "error", error });
        }
      });

    return () => {
      controller.abort();
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [productId, refreshKey]);

  if (productId == null) {
    return { status: "idle", imageUrl: null };
  }

  return currentResult
    ? { status: currentResult.status, imageUrl: currentResult.imageUrl ?? null }
    : { status: "loading", imageUrl: null };
}

export default useProductImage;
