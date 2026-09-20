import { useCart } from '../context/CartContext';

const PRODUCTS = [
  { id: 1, name: 'Mechanical Keyboard', price: 129.99 },
  { id: 2, name: 'Noise-Cancelling Headphones', price: 249.99 },
  { id: 3, name: 'USB-C Hub (7-in-1)', price: 49.99 },
  { id: 4, name: 'Desk LED Lamp', price: 34.99 },
];

export default function Shop() {
  const { items, dispatch } = useCart();

  return (
    <section className="shop-grid">
      {PRODUCTS.map((product) => {
        const cartItem = items.find((i) => i.id === product.id);
        const qty = cartItem?.quantity ?? 0;

        return (
          <div key={product.id} className="product-card">
            <div className="product-emoji">
              {['⌨️', '🎧', '🔌', '💡'][product.id - 1]}
            </div>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price.toFixed(2)}</p>

            {qty === 0 ? (
              <button
                id={`add-${product.id}`}
                className="btn btn-primary"
                onClick={() =>
                  dispatch({ type: 'ADD_ITEM', payload: product })
                }
              >
                Add to cart
              </button>
            ) : (
              <div className="qty-controls">
                <button
                  id={`dec-${product.id}`}
                  className="btn btn-outline qty-btn"
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE_QUANTITY',
                      payload: { id: product.id, quantity: qty - 1 },
                      // quantity 0 → reducer removes the line
                    })
                  }
                >
                  −
                </button>
                <span className="qty-display">{qty}</span>
                <button
                  id={`inc-${product.id}`}
                  className="btn btn-outline qty-btn"
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE_QUANTITY',
                      payload: { id: product.id, quantity: qty + 1 },
                    })
                  }
                >
                  +
                </button>
                <button
                  id={`remove-${product.id}`}
                  className="btn btn-danger qty-btn"
                  onClick={() =>
                    dispatch({ type: 'REMOVE_ITEM', payload: { id: product.id } })
                  }
                >
                  🗑
                </button>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
