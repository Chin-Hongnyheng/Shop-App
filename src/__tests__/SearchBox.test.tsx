import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBox from '../components/SearchBox';

describe('SearchBox (useDebounce edge-case tests)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders initial state with empty placeholders and no search query banner', () => {
    // Arrange
    render(<SearchBox />);

    // Assert: queries mirror user-visible labels and text — never test IDs
    const input = screen.getByLabelText('Search query');
    expect(input).toHaveValue('');
    expect(screen.queryByText(/Would search for:/i)).toBeNull();
  });

  it('handles rapid typing: updates raw value immediately but debounces output until delay elapses', () => {
    // Arrange
    render(<SearchBox />);
    const input = screen.getByLabelText('Search query');

    // Act: Rapid typing sequence
    fireEvent.change(input, { target: { value: 'q' } });
    fireEvent.change(input, { target: { value: 'qu' } });
    fireEvent.change(input, { target: { value: 'quick' } });

    // Assert: Raw value reflects the latest typing immediately
    expect(input).toHaveValue('quick');
    expect(screen.getByText('quick')).toBeInTheDocument();

    // Debounced value has NOT updated yet because 500 ms haven't passed
    expect(screen.queryByText(/Would search for: quick/i)).toBeNull();

    // Act: Advance time past 500 ms debounce window
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Assert: Debounced value now reflects 'quick'
    expect(screen.getByText(/Would search for:/i)).toHaveTextContent('Would search for: quick');
  });

  it('handles empty input after typing: clears search banner after debounce delay', () => {
    // Arrange
    render(<SearchBox />);
    const input = screen.getByLabelText('Search query');

    // Act: Type word and let debounce settle
    fireEvent.change(input, { target: { value: 'hello' } });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByText(/Would search for:/i)).toHaveTextContent('Would search for: hello');

    // Act: Clear the input
    fireEvent.change(input, { target: { value: '' } });
    expect(input).toHaveValue('');

    // Wait for the debounce delay to catch up with empty value
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Assert: Absence verified with queryBy* returning null
    expect(screen.queryByText(/Would search for:/i)).toBeNull();
  });
});
