import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  cat: string;
  price: string;
  img: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "zg-cart-v1";
const WHATSAPP = "917892318639";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const value = useMemo<CartCtx>(
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

export function buildWhatsAppOrderUrl(items: CartItem[], note?: string) {
  const lines = items.map((i) => `• ${i.name} (${i.cat}) × ${i.qty} — ${i.price}`).join("%0A");
  const header = "Hi ZERO GRAVITY, I'd like to order the following accessories:%0A%0A";
  const footer = note ? `%0A%0ANote: ${encodeURIComponent(note)}` : "";
  return `https://wa.me/${WHATSAPP}?text=${header}${lines}${footer}`;
}

export function buildWhatsAppSingleUrl(item: { name: string; cat: string; price: string }) {
  const text = encodeURIComponent(
    `Hi ZERO GRAVITY, I'd like to order: ${item.name} (${item.cat}) — ${item.price}. Please share the details.`,
  );
  return `https://wa.me/${WHATSAPP}?text=${text}`;
}

export const WHATSAPP_NUMBER = WHATSAPP;
