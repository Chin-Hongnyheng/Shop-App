import { useState } from 'react';

interface FormState {
  email: string;
  error: string | null;
  status: 'idle' | 'loading' | 'success';
}

// Fake async API — resolves after 80 ms (fast enough for tests)
function fakeSignIn(email: string): Promise<{ welcome: string }> {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ welcome: `Welcome, ${email}!` }), 80)
  );
}

export default function LoginForm() {
  const [form, setForm] = useState<FormState>({
    email: '',
    error: null,
    status: 'idle',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ── Validation ──────────────────────────────────────────────
    if (!form.email.trim()) {
      setForm((f) => ({ ...f, error: 'Email is required' }));
      return;
    }

    // ── Async submit ────────────────────────────────────────────
    setForm((f) => ({ ...f, error: null, status: 'loading' }));
    await fakeSignIn(form.email);
    setForm((f) => ({ ...f, status: 'success' }));
  };

  const dismiss = () =>
    setForm({ email: '', error: null, status: 'idle' });

  return (
    <section className="login-form-wrap">
      <h2>Sign in</h2>

      {/* ── Success banner (conditional — tested with queryBy) ── */}
      {form.status === 'success' && (
        <div role="status" className="success-banner">
          Welcome, {form.email}!
          <button
            className="btn btn-outline btn-xs"
            onClick={dismiss}
            aria-label="Dismiss"
          >
            ✕ Dismiss
          </button>
        </div>
      )}

      {form.status !== 'success' && (
        <form onSubmit={handleSubmit} noValidate>
          {/* Label → input linked by htmlFor / id — getByLabelText target */}
          <div className="field">
            <label htmlFor="lf-email">Email</label>
            <input
              id="lf-email"
              type="email"
              className="email-input"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value, error: null }))
              }
            />
            {/* Validation error — appears after submit with empty field */}
            {form.error && (
              <p role="alert" className="field-error">
                {form.error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={form.status === 'loading'}
          >
            {form.status === 'loading' ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      )}
    </section>
  );
}
