import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  clearAuthToken,
  hasAuthToken,
} from "../services/authService";

function Fish() {
  return (
    <svg
      aria-hidden="true"
      className="nav-fish"
      fill="none"
      viewBox="0 0 88 48"
    >
      <g className="nav-fish-tail">
        <path d="M25 24 7 10q3 14 0 28l18-14Z" fill="#ffb547" stroke="#8f4d28" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="m21 24-9-8m9 8-9 8" stroke="#ffe0a0" strokeLinecap="round" strokeWidth="1.2" />
      </g>
      <g className="nav-fish-body">
        <path d="M19 24q13-17 39-10 12 3 19 10-7 7-19 10-26 7-39-10Z" fill="#f99b38" stroke="#8f4d28" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M31 17q14-7 29-2" stroke="#ffda91" strokeLinecap="round" strokeWidth="2" />
        <path d="M36 17q-2 7 1 14m6-17q-2 9 1 18m6-19q-2 9 1 18m6-17q-1 7 2 14" stroke="#d87a32" strokeLinecap="round" strokeWidth="1" opacity=".7" />
        <path d="M47 13q3-8 12-10-1 8-6 14Z" fill="#ffc15b" stroke="#8f4d28" strokeLinejoin="round" strokeWidth="1.3" />
        <g className="nav-fish-pectoral">
          <path d="M43 26q6 0 11 7-8 3-13-2Z" fill="#e77e32" stroke="#8f4d28" strokeLinejoin="round" strokeWidth="1.2" />
        </g>
        <path d="M72 21q5 3 0 6" stroke="#8f4d28" strokeLinecap="round" strokeWidth="1.2" />
        <ellipse cx="67" cy="20" rx="2.2" ry="2.7" fill="#fff" />
        <circle cx="68" cy="20.5" r="1.15" fill="#263849" />
        <path d="M54 19v10m4-11v11" stroke="#c96f31" strokeLinecap="round" strokeWidth="1.1" />
        <path d="M61 27q4 2 8 0" stroke="#ffe1ae" strokeLinecap="round" strokeWidth="1" opacity=".8" />
      </g>
    </svg>
  );
}

function MovingSea() {
  return (
    <svg
      aria-hidden="true"
      className="nav-sea"
      preserveAspectRatio="none"
      viewBox="0 0 2400 72"
    >
      <g className="nav-sea-layer">
        <path
          d="M0 16c150-18 250 18 400 0s250-18 400 0 250 18 400 0v56H0Z"
          fill="#73d7df"
          fillOpacity=".42"
        />
        <path
          d="M0 29c150-14 250 14 400 0s250-14 400 0 250 14 400 0v43H0Z"
          fill="#087eaa"
          fillOpacity=".3"
        />
        <path
          d="M0 18c150-18 250 18 400 0s250-18 400 0 250 18 400 0"
          fill="none"
          stroke="#d7ffff"
          strokeOpacity=".38"
          strokeWidth="2"
        />
        <path
          d="M0 16c150-18 250 18 400 0s250-18 400 0 250 18 400 0v56H0Z"
          fill="#73d7df"
          fillOpacity=".42"
          transform="translate(1200)"
        />
        <path
          d="M0 29c150-14 250 14 400 0s250-14 400 0 250 14 400 0v43H0Z"
          fill="#087eaa"
          fillOpacity=".3"
          transform="translate(1200)"
        />
        <path
          d="M0 18c150-18 250 18 400 0s250-18 400 0 250 18 400 0"
          fill="none"
          stroke="#d7ffff"
          strokeOpacity=".38"
          strokeWidth="2"
          transform="translate(1200)"
        />
      </g>
    </svg>
  );
}

function UnderwaterPlants() {
  return (
    <svg
      aria-hidden="true"
      className="nav-underwater-plants"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 1200 72"
    >
      <g stroke="#175f56" strokeLinecap="round" strokeLinejoin="round">
        <path d="M38 74q8-20 1-43m0 22Q22 48 20 34q14 2 20 16m0-7q13-13 12-25-13 4-14 17" strokeWidth="3" />
        <path d="M208 74q-5-23 5-49m-3 27q-16-9-18-22 13 3 20 15m-4-10q14-12 14-24-13 5-17 17" strokeWidth="2.5" />
        <path d="M407 74q10-18 4-40m2 27q-14-6-18-19 12 1 18 12m-1-8q12-11 12-21-11 4-14 14" strokeWidth="2.5" />
        <path d="M608 74q-8-24 2-48m-1 28q-16-8-19-22 13 2 20 14m-1-10q13-12 12-23-12 4-15 17" strokeWidth="3" />
        <path d="M823 74q7-19 0-40m1 26q-14-7-17-20 12 2 18 13m-2-9q12-11 11-22-11 4-14 15" strokeWidth="2.5" />
        <path d="M1036 74q-8-22 3-46m-2 28q-15-8-18-21 13 2 19 13m-2-9q13-12 12-23-12 4-15 16" strokeWidth="3" />
        <path d="M1167 74q6-17-2-34m1 23q-12-5-15-16 11 2 16 11m-2-7q10-10 9-19-9 4-11 13" strokeWidth="2.5" />
      </g>
      <path d="M0 70q170-8 340 0t340 0 340 0 340 0v2H0Z" fill="#0b6d62" opacity=".35" />
    </svg>
  );
}

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isSignedIn = hasAuthToken();
  const isProductsActive =
    pathname === "/products" || pathname.startsWith("/product/");

  return (
    <header className="app-header">
      <MovingSea />
      <UnderwaterPlants />
      <NavLink aria-label="ProductHub home" className="app-brand" to="/">
        <span aria-hidden="true" className="app-brand-mark">
          P
        </span>
        <span>ProductHub</span>
      </NavLink>
      <div aria-hidden="true" className="nav-swim-track">
        <div className="nav-fish-mover">
          <Fish />
        </div>
      </div>
      <nav aria-label="Main navigation" className="app-navigation">
        <NavLink
          end
          aria-current={pathname === "/" ? "page" : undefined}
          className={`app-navigation-link${pathname === "/" ? " is-active" : ""}`}
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          aria-current={isProductsActive ? "page" : undefined}
          className={`app-navigation-link${isProductsActive ? " is-active" : ""}`}
          end
          to="/products"
        >
          Products
        </NavLink>
        <NavLink
          aria-current={pathname === "/products/new" ? "page" : undefined}
          className={`app-navigation-link app-navigation-create${pathname === "/products/new" ? " is-active" : ""}`}
          to="/products/new"
        >
          Create product
        </NavLink>
        <NavLink
          aria-current={pathname === "/orders" ? "page" : undefined}
          className={`app-navigation-link${pathname === "/orders" ? " is-active" : ""}`}
          to="/orders"
        >
          Orders
        </NavLink>
        <NavLink
          aria-current={pathname === "/cart" ? "page" : undefined}
          className={`app-navigation-link${pathname === "/cart" ? " is-active" : ""}`}
          to="/cart"
        >
          Cart
        </NavLink>
        {isSignedIn ? (
          <button
            className="app-navigation-link auth-sign-out"
            onClick={() => {
              clearAuthToken();
              navigate("/login", { replace: true });
            }}
            type="button"
          >
            Sign out
          </button>
        ) : (
          <NavLink
            aria-current={pathname === "/login" ? "page" : undefined}
            className={`app-navigation-link${pathname === "/login" ? " is-active" : ""}`}
            to="/login"
          >
            Sign in
          </NavLink>
        )}
      </nav>
    </header>
  );
}

export default Navbar;