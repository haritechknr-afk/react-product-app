import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthToken } from "../services/authService";

function OAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.slice(1));
    const token = queryParams.get("token") ?? hashParams.get("token");

    if (!token?.trim()) {
      const error =
        queryParams.get("error_description") ??
        queryParams.get("error") ??
        hashParams.get("error_description") ??
        hashParams.get("error");

      navigate("/login", {
        replace: true,
        state: error ? { googleError: `Google sign-in failed: ${error}` } : null,
      });
      return;
    }

    try {
      setAuthToken(token);
      navigate("/", { replace: true });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not complete Google sign-in.";
      navigate("/login", {
        replace: true,
        state: { googleError: message },
      });
    }
  }, [location.hash, location.search, navigate]);

  return (
    <main aria-live="polite" className="login-page">
      Completing Google sign-in...
    </main>
  );
}

export default OAuthCallback;
