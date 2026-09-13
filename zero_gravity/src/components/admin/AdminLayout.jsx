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
    <div className="min-h-screen bg-[#08090c] text-white flex">
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-[#0d0f17] border-r border-zinc-800/80 z-30">
        {/* Sidebar Header / Brand Logo */}
        <div className="px-6 py-5 border-b border-zinc-800/80 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#e5a93b] to-[#f5af3f] flex items-center justify-center font-bold text-black shadow-[0_0_20px_rgba(229,169,59,0.35)] group-hover:scale-105 transition-transform">
              ZG
            </div>
            <div>
              <span className="text-sm font-extrabold uppercase tracking-wider font-display text-white block">
                Zero Gravity
              </span>
              <span className="text-[10px] uppercase font-bold text-[#e5a93b] tracking-widest block">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all group ${
                  item.active
                    ? "bg-[#e5a93b] text-black shadow-[0_0_20px_rgba(229,169,59,0.25)] font-bold"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      item.active ? "text-black" : "text-zinc-500 group-hover:text-[#e5a93b]"
                    } transition-colors`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.active && <ChevronRight className="w-4 h-4 text-black" />}
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
              <Shield className="w-4 h-4" />
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
                  <div className="w-9 h-9 rounded-xl bg-[#e5a93b] flex items-center justify-center font-bold text-black">
                    ZG
                  </div>
                  <div>
                    <span className="text-sm font-bold uppercase tracking-wider font-display text-white">
                      Zero Gravity
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#e5a93b] tracking-wider block">
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
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                        item.active
                          ? "bg-[#e5a93b] text-black font-bold"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800"
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
              <div className="text-xs text-zinc-400">
                Logged in as <strong className="text-white">{user?.profile?.username || user?.email}</strong>
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
                <span className="text-white font-semibold capitalize">
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
                className="py-2 px-3.5 bg-gradient-to-r from-[#e5a93b] to-[#f5af3f] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 hover:brightness-110 shadow-[0_0_15px_rgba(229,169,59,0.25)] transition-all cursor-pointer uppercase tracking-wider"
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
              <ExternalLink className="w-3.5 h-3.5 text-[#e5a93b]" />
              <span>Storefront</span>
            </Link>

            <div className="h-6 w-[1px] bg-zinc-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#e5a93b]/10 border border-[#e5a93b]/30 flex items-center justify-center text-[#e5a93b] text-xs font-bold">
                {user?.profile?.username?.slice(0, 2).toUpperCase() || "AD"}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 overflow-x-hidden">
          {children || <Outlet context={{ user }} />}
        </main>
      </div>
    </div>
  );
}
