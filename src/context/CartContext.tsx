import { createContext, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// ── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Discriminated-union Action type — only predefined actions compile
export type Action =
  | { type: 'ADD_ITEM';         payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM';      payload: { id: number } }
  | { type: 'UPDATE_QUANTITY';  payload: { id: number; quantity: number } };

interface CartContextValue {
  items: CartItem[];
  dispatch: (action: Action) => void;
}

// ── Reducer (pure function — no fetch, no localStorage, no console) ───────────

function cartReducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((i) => i.id === action.payload.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case 'REMOVE_ITEM':
      return state.filter((i) => i.id !== action.payload.id);

    case 'UPDATE_QUANTITY':
      // quantity <= 0 removes the line; quantity: -1 is structurally impossible
      // because the discriminated union enforces the payload shape at compile time
      if (action.payload.quantity <= 0) {
        return state.filter((i) => i.id !== action.payload.id);
      }
      return state.map((i) =>
        i.id === action.payload.id
          ? { ...i, quantity: action.payload.quantity }
          : i
      );

    default:
      return state; // same reference → React skips re-render
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

// ── Provider — cart persisted to localStorage via useLocalStorage ─────────────

export function CartProvider({ children }: { children: ReactNode }) {
  // useLocalStorage replaces useState: reads from localStorage on mount,
  // writes back on every setValue call — cart survives a page refresh
  const [items, setItems] = useLocalStorage<CartItem[]>('cart-items', []);

  // dispatch = call pure reducer on latest state, then persist the resulting state
  const dispatch = useCallback(
    (action: Action) => {
      setItems((prev) => cartReducer(prev, action));
    },
    [setItems]
  );

  return (
    <CartContext.Provider value={{ items, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
