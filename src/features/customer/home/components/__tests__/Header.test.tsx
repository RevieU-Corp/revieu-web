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
  it('keeps search tap navigation while rendering only the primary search action button', () => {
    const onSearchTap = vi.fn();

    render(<Header onSearchTap={onSearchTap} />);

    const input = screen.getByRole('textbox');

    fireEvent.mouseDown(input);

    expect(onSearchTap).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});
