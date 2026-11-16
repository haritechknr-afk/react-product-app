import { useEffect, useRef, useState } from "react";
import { getProductImage } from "../services/productService";

function useProductImage(productId, refreshKey = 0) {
  const [imageResult, setImageResult] = useState(null);
  const imageUrlRef = useRef(null);
  const currentResult =
    imageResult?.productId === productId ? imageResult : null;

  useEffect(
    () => () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (productId == null) {
      return;
    }

    const controller = new AbortController();

    getProductImage(productId, { signal: controller.signal })
      .then((image) => {
        if (controller.signal.aborted) {
          return;
        }

        const imageUrl = URL.createObjectURL(image);
        if (imageUrlRef.current) {
          URL.revokeObjectURL(imageUrlRef.current);
        }
        imageUrlRef.current = imageUrl;
        setImageResult({ productId, refreshKey, status: "loaded", imageUrl });
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setImageResult((result) =>
            result?.productId === productId
              ? result
              : { productId, refreshKey, status: "error", error },
          );
        }
      });

    return () => controller.abort();
  }, [productId, refreshKey]);

  if (productId == null) {
    return { status: "idle", imageUrl: null };
  }

  return currentResult
    ? { status: currentResult.status, imageUrl: currentResult.imageUrl ?? null }
    : { status: "loading", imageUrl: null };
}

export default useProductImage;
