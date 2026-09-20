import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function NavBar() {
  const { user, signIn, signOut } = useAuth();
  const { items } = useCart();
  const [inputEmail, setInputEmail] = useState('');

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="navbar">
      <span className="navbar-brand">🛒 ShopApp</span>

      <span className="cart-badge">
        Cart <span className="badge">{totalItems}</span>
      </span>

      <div className="navbar-auth">
        {user ? (
          <>
            <span className="greeting">Hi, {user.email}</span>
            <button className="btn btn-outline" onClick={signOut}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <input
              id="email-input"
              className="email-input"
              type="email"
              placeholder="you@example.com"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
            />
            <button
              id="sign-in-btn"
              className="btn btn-primary"
              onClick={() => { if (inputEmail) signIn(inputEmail); }}
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
