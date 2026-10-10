import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  Package,
  PlusCircle,
  LayoutDashboard,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Shield,
  Layers,
  Sparkles,
  ShoppingBag,
  User,
  Loader2,
  ChevronRight,
  Database,
  Tag,
} from "lucide-react";
import { getCurrentAdmin, supabase, adminLogout } from "@/lib/supabase";
import AdminLogin from "./AdminLogin";
import zeroGravityLogo from "@/assets/zero_gravity.jpeg";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const adminUser = await getCurrentAdmin();
        setUser(adminUser);
      } catch (err) {
        console.error("Auth verification failed:", err);
      } finally {
        setAuthLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const adminUser = await getCurrentAdmin();
        setUser(adminUser);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#08090c] flex flex-col items-center justify-center text-white gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#e5a93b]" />
        <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold font-display">
          Initializing Secure Console...
        </p>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLoginSuccess={(adminUser) => setUser(adminUser)} />;
  }

  const isInventoryActive = location.pathname === "/admin";
  const isAddProductActive = location.pathname === "/admin/add-product";
  const isCategoriesActive = location.pathname.startsWith("/admin/categories");
  const isBrandsActive = location.pathname.startsWith("/admin/brands");
  const isEditProductActive = location.pathname.startsWith("/admin/edit-product");

  const getBreadcrumbTitle = () => {
    if (location.pathname === "/admin") return "Products Inventory";
    if (location.pathname === "/admin/add-product") return "Add New Product";
    if (location.pathname.startsWith("/admin/categories")) return "Categories Master";
    if (location.pathname.startsWith("/admin/brands")) return "Brands Master";
    if (location.pathname.startsWith("/admin/edit-product")) return "Edit Product";
    return "Admin Console";
  };

  const handleSignOut = async () => {
    await adminLogout();
    setUser(null);
    navigate("/admin");
  };

  const navItems = [
    {
      name: "Products Inventory",
      path: "/admin",
      icon: LayoutDashboard,
      active: isInventoryActive,
      badge: "Master",
    },
    {
      name: "Add New Product",
      path: "/admin/add-product",
      icon: PlusCircle,
      active: isAddProductActive,
      badge: "Form",
    },
    {
      name: "Categories Master",
      path: "/admin/categories",
      icon: Layers,
      active: isCategoriesActive,
      badge: "Master",
    },
    {
      name: "Brands Master",
      path: "/admin/brands",
      icon: Tag,
      active: isBrandsActive,
      badge: "Master",
    },
  ];

  return (
    <div className="admin-theme min-h-screen bg-[#090a0f] text-zinc-100 flex">
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-[#0d0f17] border-r border-zinc-800/80 z-30">
        {/* Sidebar Header / Brand Logo */}
        <div className="px-6 py-5 border-b border-zinc-800/80 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3 group">
            <img
              src={zeroGravityLogo}
              alt="Zero Gravity"
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-700/80 group-hover:scale-105 transition-transform shrink-0"
            />
            <div>
              <span className="text-sm font-bold text-white block tracking-wide">
                Zero Gravity
              </span>
              <span className="text-[10px] uppercase font-semibold text-[#e5a93b] tracking-wider block">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-colors group ${
                  item.active
                    ? "bg-[#e5a93b] text-zinc-950 font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60 font-medium"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      item.active ? "text-zinc-950" : "text-zinc-400 group-hover:text-zinc-200"
                    } transition-colors`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.active && <ChevronRight className="w-4 h-4 text-zinc-950" />}
              </Link>
            );
          })}

          <div className="pt-6 px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Store Links
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all group"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-zinc-500 group-hover:text-[#e5a93b] transition-colors" />
              <span>Live Storefront</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />
          </Link>

          <Link
            to="/accessories"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-zinc-500 group-hover:text-[#e5a93b] transition-colors" />
              <span>Accessories Vault</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />
          </Link>
        </div>

        {/* Bottom User Card & Sign Out */}
        <div className="p-4 border-t border-zinc-800/80 bg-[#0a0b10]/60 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[#e5a93b] shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-bold text-white truncate">
                {user?.profile?.username || "Administrator"}
              </p>
              <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-950/40 hover:text-red-300 text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation (Overlay) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="fixed inset-y-0 left-0 w-72 bg-[#0d0f17] border-r border-zinc-800 p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <img
                    src={zeroGravityLogo}
                    alt="Zero Gravity"
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-zinc-700/80 shrink-0"
                  />
                  <div>
                    <span className="text-sm font-bold text-white block tracking-wide">
                      Zero Gravity
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-[#e5a93b] tracking-wider block">
                      Admin Console
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs transition-colors ${
                        item.active
                          ? "bg-[#e5a93b] text-zinc-950 font-semibold"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.active && <ChevronRight className="w-4 h-4" />}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <div className="text-xs text-zinc-400 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[#e5a93b] shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="block text-white font-medium truncate">{user?.profile?.username || "Admin"}</span>
                  <span className="block text-[11px] text-zinc-500 truncate">{user?.email}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-950/30 border border-red-900/50 text-red-400 text-xs font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Right Content Layout Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Top Global Header Bar */}
        <header className="sticky top-0 z-20 bg-[#0d0f17]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white md:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Title */}
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Link to="/admin" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                  Admin
                </Link>
                <span>/</span>
                <span className="text-white font-medium capitalize">
                  {getBreadcrumbTitle()}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isAddProductActive && (
              <Link
                to="/admin/add-product"
                className="py-2 px-3.5 bg-[#e5a93b] hover:bg-[#d4972e] text-zinc-950 font-medium rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </Link>
            )}

            {!isInventoryActive && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#e5a93b]" />
                <span>Inventory</span>
              </Link>
            )}

            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span>Storefront</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 overflow-x-hidden pb-20 md:pb-8">
          {children || <Outlet context={{ user }} />}
        </main>

        {/* Mobile Bottom Navigation Bar for Thumb-Friendly Access */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0d0f17]/95 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-1.5 flex items-center justify-around">
          <Link
            to="/admin"
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
              isInventoryActive ? "text-[#e5a93b] font-medium" : "text-zinc-400 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px]">Inventory</span>
          </Link>
          <Link
            to="/admin/add-product"
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
              isAddProductActive ? "text-[#e5a93b] font-medium" : "text-zinc-400 hover:text-white"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span className="text-[10px]">Add Product</span>
          </Link>
          <Link
            to="/admin/categories"
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
              isCategoriesActive ? "text-[#e5a93b] font-medium" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-[10px]">Categories</span>
          </Link>
          <Link
            to="/admin/brands"
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
              isBrandsActive ? "text-[#e5a93b] font-medium" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span className="text-[10px]">Brands</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span className="text-[10px]">Menu</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
