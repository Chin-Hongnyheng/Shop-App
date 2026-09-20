import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// NO prop carries cart data — everything comes from useContext via useCart()
export default function CartSummary() {
  const { items, dispatch } = useCart();
  const { user } = useAuth();

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <aside className="cart-summary empty">
        <h2>Your cart is empty</h2>
        <p>Add something from the shop ☝️</p>
      </aside>
    );
  }

  return (
    <aside className="cart-summary">
      <h2>Checkout Summary</h2>

      <ul className="summary-list">
        {items.map((item) => (
          <li key={item.id} className="summary-row">
            <span className="summary-name">{item.name}</span>
            <span className="summary-qty">×{item.quantity}</span>
            <span className="summary-subtotal">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              id={`summary-remove-${item.id}`}
              className="btn btn-danger btn-xs"
              onClick={() =>
                dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })
              }
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="summary-total">
        <strong>Total</strong>
        <strong>${total.toFixed(2)}</strong>
      </div>

      <button
        id="checkout-btn"
        className="btn btn-primary btn-block"
        disabled={!user}
        title={!user ? 'Sign in to checkout' : undefined}
      >
        {user ? `Checkout as ${user.email}` : 'Sign in to checkout'}
      </button>

      {!user && (
        <p className="checkout-hint">Sign in via the nav bar to place your order.</p>
      )}
    </aside>
  );
}
