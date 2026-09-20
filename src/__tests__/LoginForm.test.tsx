import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../components/LoginForm';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: every test gets a fresh render + userEvent instance
// ─────────────────────────────────────────────────────────────────────────────
function setup() {
  const user = userEvent.setup();
  render(<LoginForm />);
  return { user };
}

describe('LoginForm', () => {
  // ── 1. Renders ─────────────────────────────────────────────────────────────
  it('renders the Email input linked to its label', () => {
    setup();
    // getByLabelText finds the <input id="lf-email"> via <label htmlFor="lf-email">
    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
  });

  // ── 2. Validation error via userEvent.type + submit ────────────────────────
  it('shows a validation error when submitted with an empty email', async () => {
    const { user } = setup();

    // Submit without typing anything
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // The error paragraph has role="alert" → findable by text
    const error = screen.getByRole('alert');
    expect(error).toHaveTextContent('Email is required');
  });

  it('clears the error once the user starts typing', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Email'), 'a');
    // Error should disappear on first keystroke
    expect(screen.queryByRole('alert')).toBeNull();
  });

  // ── 3. Async: findBy waits for the success banner ─────────────────────────
  it('shows a welcome message after a valid submit (async findBy)', async () => {
    const { user } = setup();

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // findByRole polls the DOM until the element appears (up to 1 s by default)
    // This exercises the async path: button → fakeSignIn (80 ms) → success state
    const banner = await screen.findByRole('status');
    expect(banner).toHaveTextContent('Welcome, test@example.com!');
  });

  // ── 4. Prove absence: queryBy returns null once the banner is dismissed ────
  it('queryBy* returns null once the success banner is dismissed', async () => {
    const { user } = setup();

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for the banner to appear first
    await screen.findByRole('status');
    expect(screen.queryByRole('status')).not.toBeNull(); // confirm presence

    // Dismiss the banner
    await user.click(screen.getByRole('button', { name: /dismiss/i }));

    // queryBy* does NOT throw when the element is missing — returns null instead
    // This is the correct assertion for "element is gone from the DOM"
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.queryByText(/welcome/i)).toBeNull();
  });

  // ── 5. Edge cases: whitespace-only input & rapid clicking ───────────────────
  it('treats whitespace-only input as empty and displays the validation error', async () => {
    // Arrange
    const { user } = setup();

    // Act
    await user.type(screen.getByLabelText('Email'), '   ');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Assert
    const error = screen.getByRole('alert');
    expect(error).toHaveTextContent('Email is required');
  });

  it('disables the submit button while in-flight to prevent duplicate submits from rapid clicking', async () => {
    // Arrange
    const { user } = setup();

    // Act: Type valid email and click submit
    await user.type(screen.getByLabelText('Email'), 'fast@clicker.com');
    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitBtn);

    // Assert: Button reflects loading state and is disabled to user interaction
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();

    // Wait for completion
    await screen.findByRole('status');
    // Button is no longer visible because form transitioned to success
    expect(screen.queryByRole('button', { name: /signing in/i })).toBeNull();
  });
});
