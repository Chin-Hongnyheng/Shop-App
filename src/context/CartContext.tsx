import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Discriminated-union Action type
export type Action =
  | { type: 'ADD_ITEM';         payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM';      payload: { id: number } }
  | { type: 'UPDATE_QUANTITY';  payload: { id: number; quantity: number } };

interface CartContextValue {
  items: CartItem[];
  dispatch: React.Dispatch<Action>;
}

// ── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((i) => i.id === action.payload.id);
      if (existing) {
        // Already in cart → bump quantity
        return state.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case 'REMOVE_ITEM':
      return state.filter((i) => i.id !== action.payload.id);

    case 'UPDATE_QUANTITY':
      // quantity === 0 removes the line entirely
      if (action.payload.quantity <= 0) {
        return state.filter((i) => i.id !== action.payload.id);
      }
      return state.map((i) =>
        i.id === action.payload.id
          ? { ...i, quantity: action.payload.quantity }
          : i
      );

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);

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
