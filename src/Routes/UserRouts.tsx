// src/routes/UserRoute.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Registration from '../pages/userPages/Registration';
import Home from '../pages/userPages/LandingPage';
import Profile from '../pages/userPages/Profile';
import Seller from '../pages/seller/SellerDashBord';
import ProductListingForm from '../containers/sellerFeturs/ProductListingForm';
import EditProductForm from '../containers/sellerFeturs/EditProductForm';
import UserProtectedRoute from './ProtectRout/UserVerifyRoute';
import AuthRoute from './ProtectRout/AuthRoute';
import ForgetPasswordPage from '../pages/userPages/PasswordForgetPage';
import EmailSendPage from '../pages/userPages/EmailSendPage';
import ProductManagment from '../pages/seller/ProductManagment';
import AuctionItemForm from '../components/Seller/auction-item-form';
import UserDashBoard from '../components/User/UserDshboard';
import SellerAboutPage from '../components/Seller/SellerAbout';
import ProductPage from '../pages/ProductDetailPage';
import AddressPage from '../pages/userPages/addressPage';
import CheckoutPage from '../pages/chekOutPage';
import Success from '../pages/commenPages/succsess';
import OrderManagementTable from '../pages/seller/orderManagmentPage';
import OrdersPage from '../pages/userPages/ordersPage';
import OrderDetails from '../pages/userPages/orderDetailsPage';

const UserRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/registration" element={<AuthRoute element={Registration} />} />
      <Route path="/" element={<Home />} />
      <Route path="/forget-password" element={<ForgetPasswordPage />} />
      <Route path="/forget-password-request" element={<EmailSendPage />} />
      <Route path="/product-details/:id" element={<ProductPage />} />
      <Route path="/checkout/:id" element={<CheckoutPage />} /> 
      <Route path="/success" element={<Success />} />
      <Route path="/orders/:id" element={<OrderDetails />} />
      {/* Profile Routees */}
      <Route path="/profile" element={<UserProtectedRoute element={Profile} />}>
        <Route path="dashboard" element={<UserDashBoard />} />
        <Route path="password" element={<AuctionItemForm />} />
        <Route path="address" element={<AddressPage />} />
        <Route path="orders" element={<OrdersPage />} />

        <Route path="seller" element={<UserProtectedRoute element={Seller} />}>
          <Route
            path="product-management"
            element={<UserProtectedRoute element={ProductManagment} />}
          />
          <Route path="addproduct" element={<UserProtectedRoute element={ProductListingForm} />} />
          <Route
            path="editproduct/:productId"
            element={<UserProtectedRoute element={EditProductForm} />}
          />
          <Route path="order-management" element={<UserProtectedRoute element={OrderManagementTable} />} />
          <Route path="about" element={<SellerAboutPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default UserRoute;
