import { createContext, useContext, useEffect, useMemo, useState } from "react";

const Ctx = createContext(null);
const KEY = "zg-cart-v1";
const WHATSAPP = "917892318639";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch (err) {
      console.error("Failed to load cart from localStorage", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(items));
    } catch (err) {
      console.error("Failed to save cart to localStorage", err);
    }
  }, [items, isLoaded]);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      add: (item, qty = 1) =>
        setItems((p) => {
          const e = p.find((i) => i.id === item.id);
          if (e) return p.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i));
          return [...p, { ...item, qty }];
        }),
      remove: (id) => setItems((p) => p.filter((i) => i.id !== id)),
      setQty: (id, qty) =>
        setItems((p) =>
          qty <= 0 ? p.filter((i) => i.id !== id) : p.map((i) => (i.id === id ? { ...i, qty } : i)),
        ),
      clear: () => setItems([]),
    }),
    [items],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}

export function buildWhatsAppOrderUrl(items, note) {
  const lines = items.map((i) => `• ${i.name} (${i.cat}) × ${i.qty} — ${i.price}`).join("\n");
  const fullText = `Hi ZERO GRAVITY, I'd like to order the following accessories:\n\n${lines}${note ? `\n\nNote: ${note}` : ""}`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(fullText)}`;
}

export function buildWhatsAppSingleUrl(item) {
  const text = `Hi ZERO GRAVITY, I'd like to order: ${item.name} (${item.cat}) — ${item.price}. Please share the details.`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export const WHATSAPP_NUMBER = WHATSAPP;
