import { useState } from 'react';
import useDebounce from '../hooks/useDebounce';

export default function SearchBox() {
  const [raw, setRaw] = useState('');
  // Debounced value only updates 500 ms after the user stops typing
  const debounced = useDebounce(raw, 500);

  return (
    <section className="search-demo">
      <h2>useDebounce demo</h2>
      <label htmlFor="search-input" className="search-label">Search query</label>
      <input
        id="search-input"
        className="email-input search-input"
        type="text"
        placeholder="Type something…"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
      />

      <div className="debug-grid">
        <div className="debug-card">
          <span className="debug-label">Raw value</span>
          {/* Updates on every keystroke */}
          <span className="debug-value raw">{raw || <em>empty</em>}</span>
        </div>
        <div className="debug-card">
          <span className="debug-label">Debounced (500 ms)</span>
          {/* Updates only after 500 ms of silence */}
          <span className="debug-value debounced">{debounced || <em>empty</em>}</span>
        </div>
      </div>

      {debounced && (
        <p className="search-result">
          🔍 Would search for: <strong>{debounced}</strong>
        </p>
      )}
    </section>
  );
}
