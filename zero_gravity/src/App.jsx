import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CartProvider } from "@/lib/cart";
import Home from "@/pages/Home";
import Accessories from "@/pages/Accessories";
import BookService from "@/pages/BookService";
import Cart from "@/pages/Cart";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AddProductPage from "@/pages/AddProductPage";
import CategoriesPage from "@/pages/admin/CategoriesPage";
import BrandsPage from "@/pages/admin/BrandsPage";
import EditProductPage from "@/pages/admin/EditProductPage";
import NotFound from "@/pages/NotFound";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/book-service" element={<BookService />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="add-product" element={<AddProductPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="edit-product/:id" element={<EditProductPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </CartProvider>
  );
}
