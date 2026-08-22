import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, test, vi } from 'vitest';
import AllReviews from '../AllReviews';

afterEach(cleanup);

const review = {
  id: 44,
  customerName: 'Jamie Customer',
  rating: 2,
  text: 'The wait was too long.',
  date: '2026-08-22T10:00:00Z',
  hasReply: false,
};

describe('AllReviews persistence contract', () => {
  test('awaits the server reply before closing the reply modal', async () => {
    const onReply = vi.fn().mockResolvedValue(true);
    const onDelete = vi.fn().mockResolvedValue(true);

    render(
      <MemoryRouter>
        <AllReviews reviews={[review]} onReply={onReply} onDelete={onDelete} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Reply' }));
    fireEvent.change(screen.getByPlaceholderText(/Thank you for your feedback/), { target: { value: 'Thanks for visiting.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send Reply' }));

    await waitFor(() => {
      expect(onReply).toHaveBeenCalledWith(44, 'Thanks for visiting.');
    });
    expect(screen.queryByRole('button', { name: 'Send Reply' })).not.toBeInTheDocument();
  });

  test('does not change the list locally when the server delete fails', async () => {
    const onReply = vi.fn().mockResolvedValue(true);
    const onDelete = vi.fn().mockResolvedValue(false);

    render(
      <MemoryRouter>
        <AllReviews
          reviews={[review]}
          onReply={onReply}
          onDelete={onDelete}
          error="Review was not deleted."
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete review' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith(44);
    });
    expect(screen.getByText('The wait was too long.')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Review was not deleted.');
  });
});
