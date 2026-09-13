import React, { useState, useEffect } from "react";
import { getCurrentAdmin, supabase } from "@/lib/supabase";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Loader2 } from "lucide-react";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state
    const checkSession = async () => {
      try {
        const adminUser = await getCurrentAdmin();
        setUser(adminUser);
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes (sign in, sign out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const adminUser = await getCurrentAdmin();
        setUser(adminUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090c] flex flex-col items-center justify-center text-white gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#e5a93b]" />
        <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold font-display">
          Checking Security Credentials...
        </p>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLoginSuccess={(adminUser) => setUser(adminUser)} />;
  }

  return <AdminDashboard user={user} onLogout={() => setUser(null)} />;
}
