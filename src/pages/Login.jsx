import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URLS } from "../config/urls";
import { login, setAuthToken } from "../services/authService";

function handleGoogleLogin() {
  window.location.assign(API_URLS.googleLogin);
}

function Login() {
  const [formError, setFormError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const googleError =
    typeof location.state?.googleError === "string"
      ? location.state.googleError
      : "";

  async function handleSubmit(event) {
    event.preventDefault();
    if (location.state?.googleError) {
      navigate("/login", { replace: true, state: null });
    }

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username")).trim();
    const password = String(formData.get("password"));

    if (!username || !password) {
      setFormError("Enter both your username and password.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const token = await login(username, password);
      setAuthToken(token);
      const destination = location.state?.from ?? "/";
      navigate(destination, { replace: true });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Could not sign in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section aria-labelledby="login-title" className="login-card">
        <div aria-hidden="true" className="login-card-art">
          <span className="login-art-bubble login-art-bubble-one" />
          <span className="login-art-bubble login-art-bubble-two" />
          <span className="login-art-bubble login-art-bubble-three" />
          <svg className="login-art-fish" fill="none" viewBox="0 0 120 90">
            <path
              d="M37 45 13 27q5 18 0 36l24-18Z"
              fill="#ffc15b"
              stroke="#8f4d28"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M32 45q17-22 49-10 15 5 25 10-10 10-25 15-32 12-49-15Z"
              fill="#f99b38"
              stroke="#8f4d28"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path d="M53 34q16-9 31-3" stroke="#ffe0a0" strokeWidth="3" />
            <circle cx="92" cy="40" r="4" fill="white" />
            <circle cx="93" cy="40" r="2" fill="#263849" />
            <path
              d="m63 34 8-17 13 7-5 13"
              fill="#ffc15b"
              stroke="#8f4d28"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          <p>Welcome back to your little corner of the ocean.</p>
        </div>

        <div className="login-card-content">
          <p className="login-eyebrow">PRODUCTHUB ACCOUNT</p>
          <h1 id="login-title">Sign in</h1>
          <p className="login-description">
            Enter your API credentials to continue.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="login-username">Username</label>
            <input
              autoComplete="username"
              autoFocus
              id="login-username"
              name="username"
              required
            />

            <label htmlFor="login-password">Password</label>
            <div className="login-password-field">
              <input
                autoComplete="current-password"
                id="login-password"
                name="password"
                required
                type={isPasswordVisible ? "text" : "password"}
              />
              <button
                aria-controls="login-password"
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                aria-pressed={isPasswordVisible}
                className="password-visibility-toggle"
                onClick={() => setIsPasswordVisible((visible) => !visible)}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="20"
                  viewBox="0 0 24 24"
                  width="20"
                >
                  <path
                    d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="2.6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  {!isPasswordVisible && (
                    <path
                      d="m4 4 16 16"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.7"
                    />
                  )}
                </svg>
              </button>
            </div>

            {(formError || googleError) && (
              <p className="login-error" role="alert">
                {formError || googleError}
              </p>
            )}

            <button
              className="login-submit"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Signing in..." : "Continue"}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <div aria-hidden="true" className="login-divider">
            <span>or</span>
          </div>

          <button
            className="google-login-button"
            onClick={handleGoogleLogin}
            type="button"
          >
            <span aria-hidden="true" className="google-login-mark">
              G
            </span>
            Continue with Google
          </button>

          <p className="login-security-note">
            Your password is sent to the login API. The returned JWT is saved
            in this browser and sent with API requests. Sign out to clear it.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
