import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ShopLayout } from "./layouts/ShopLayout.jsx";
import { AdminLayout } from "./layouts/AdminLayout.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ShopPage } from "./pages/ShopPage.jsx";
import { ProductPage } from "./pages/ProductPage.jsx";
import { CartPage } from "./pages/CartPage.jsx";
import { CheckoutPage } from "./pages/CheckoutPage.jsx";
import { ContactPage } from "./pages/ContactPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage.jsx";
import { AdminToysPage } from "./pages/admin/AdminToysPage.jsx";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage.jsx";
import { AdminPromoPage } from "./pages/admin/AdminPromoPage.jsx";
import { AdminCategoriesPage } from "./pages/admin/AdminCategoriesPage.jsx";
import { OrdersPage } from "./pages/OrderPage.jsx";
import { RequireAdmin } from "./components/RequireAdmin.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ShopLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="catalog" element={<Navigate to="/shop" replace />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<Navigate to="/contact" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>

        <Route element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route path="admin/users" element={<AdminUsersPage />} />
            <Route path="admin/toys" element={<AdminToysPage />} />
            <Route path="admin/orders" element={<AdminOrdersPage />} />
            <Route path="admin/promo" element={<AdminPromoPage />} />
            <Route path="admin/categories" element={<AdminCategoriesPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
