import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Outlet,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import OfferMarquee from "./components/OfferMarquee";
import { hasAuthToken } from "./services/authService";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import CreateProduct from "./pages/CreateProduct";
import Login from "./pages/Login";

function RequireAuth() {
  const location = useLocation();

  if (!hasAuthToken()) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}

function AppContent() {
  const { pathname } = useLocation();

  return (
    <>
      <ToastContainer position="top-right" autoClose={3500} />
      {pathname !== "/login" && (
        <>
          <Navbar />
          <OfferMarquee />
        </>
      )}
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route element={<RequireAuth />}>
          <Route element={<Home />} path="/" />
          <Route element={<Products />} path="/products" />
          <Route element={<CreateProduct />} path="/products/new" />
          <Route element={<ProductDetails />} path="/product/:id" />
          <Route element={<Cart />} path="/cart" />
          <Route element={<Orders />} path="/orders" />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;