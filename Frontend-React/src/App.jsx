import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout';
import Home from './pages/customer/Home';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import OrderDetail from './pages/customer/OrderDetail';
import MomoReturn from './pages/customer/MomoReturn';
import { Login, Register, ForgotPassword } from './pages/auth';
import Review from './pages/customer/Review';
import ReturnRequest from './pages/customer/ReturnRequest';
import { AUTH_ROUTES } from './services/auth';
import AdminLayout from './layouts/AdminLayout';
import Product from './pages/admin/ProductPage';
import UserPage from './pages/admin/UserPage';
import OrderPage from './pages/admin/OrderPage';
import CategoryPage from './pages/admin/CategoryPage';
import CompanyPage from './pages/admin/CompanyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes - không nằm trong CustomerLayout */}
        <Route path={AUTH_ROUTES.LOGIN} element={<Login />} />
        <Route path={AUTH_ROUTES.REGISTER} element={<Register />} />
        <Route path={AUTH_ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

        {/* Customer routes - nằm trong CustomerLayout */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order-detail/:orderId" element={<OrderDetail />} />
          <Route path="review/:orderId" element={<Review />} />
          <Route path="return-request/:orderId" element={<ReturnRequest />} />
          <Route path="momo-return" element={<MomoReturn />} />
        </Route>
        {/* Admin routes - nằm trong AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="products" element={<Product />} />
          <Route path="users" element={<UserPage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="companies" element={<CompanyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
