import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import UnauthPage from "./pages/unauth-page";
import 'leaflet/dist/leaflet.css';
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import StoreLayout from "./components/store-view/StoreLayout";
import Landing from "./pages/Landing";
import { AuthLogin, ChangePassword, RegisterStore, SelectRole, VerifyAccount } from "./pages/auth";
import TouristRegister from "./pages/auth/RegisterTourist";
import EmailForgetPassword from "./pages/auth/EmailForgetPassword";
import AddAdmin from "./pages/admin-view/AddAdmin";
import CategoryManager from "./pages/admin-view/CategoryManager";
import FeedbackManager from "./pages/admin-view/Feedback";
import SettingsAdmin from "./pages/admin-view/SettingsAdmin";
import StoreDashboard from "./pages/shopping-view/StoreDashboard";
import StoreOrders from "./pages/shopping-view/StoreOrders";
import StoreFeedback from "./pages/shopping-view/StoreFeedback";
import StoreSetting from "./pages/shopping-view/StoreSetting";
import ProductPage from "./pages/shopping-view/ProductPage";
import ProductFilterPage from "./pages/shopping-view/listing";


function App() {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/"
          element={
            <Landing />
          }
        />
        <Route
          path="/auth"
          element={
              <AuthLayout />
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="selectRole" element={<SelectRole />} />
          <Route path="register/store" element={<RegisterStore />} />
          <Route path="register/tourist" element={<TouristRegister />} />
          <Route path=":email/verifyRgister" element={<VerifyAccount />} />
          <Route path="send-otp" element={<EmailForgetPassword />} />
          <Route path=":email/changePassword" element={<ChangePassword />} />
        </Route>
        <Route
          path="/admin"
          element={
              <AdminLayout />
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="feedback" element={<FeedbackManager />} />
          <Route path="setting" element={<SettingsAdmin />} />
          <Route path="admins" element={<AddAdmin />} />
          <Route path="finances" element={<AdminFeatures />} />
        </Route>
        <Route
          path="/store"
          element={
              <StoreLayout />
          }
        >
          <Route path="dashboard" element={<StoreDashboard />} />
          <Route path="orders" element={<StoreOrders />} />
          <Route path="feedback" element={<StoreFeedback />} />
          <Route path="setting" element={<StoreSetting />} />
        </Route>
        <Route
          path="/tourist"
          element={
              <ShoppingLayout />
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ProductFilterPage />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path=":productId" element={<ProductPage />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
