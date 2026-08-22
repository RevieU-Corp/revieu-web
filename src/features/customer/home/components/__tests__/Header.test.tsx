import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import Header from '../Header';

vi.mock('../../../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      email: 'tester@example.com',
      name: 'Tester',
      role: 'user',
    },
  }),
}));

describe('Header', () => {
  it('submits typed search text without navigating outside the application', () => {
    const onSearchTap = vi.fn();

    render(<Header onSearchTap={onSearchTap} />);

    const input = screen.getByRole('searchbox', { name: 'Search merchants' });

    fireEvent.mouseDown(input);
    expect(onSearchTap).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: 'ramen' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSearchTap).toHaveBeenCalledWith('ramen');
    expect(screen.getByDisplayValue('ramen')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Voice search' })).toBeInTheDocument();
  });
});
