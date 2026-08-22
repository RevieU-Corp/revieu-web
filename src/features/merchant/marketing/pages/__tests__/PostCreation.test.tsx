import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import PostCreation from '../PostCreation';

describe('PostCreation gray-release state', () => {
  it('does not claim that a post was published before the backend contract exists', () => {
    render(
      <MemoryRouter>
        <PostCreation />
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toHaveTextContent(/Demo \/ Coming soon/i);
    expect(screen.getByRole('status')).toHaveTextContent(/nothing will be stored/i);
    expect(screen.getByRole('button', { name: /Publish Post \(coming soon\)/i })).toBeDisabled();
  });
});
